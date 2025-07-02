import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Mail, MessageCircle, Eye, EyeOff, AlertCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import PhoneVerification from "@/components/PhoneVerification";

const SignIn = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/profile");
      }
    };
    checkUser();
  }, [navigate]);

  // Enhanced schema with better validation
  const signinSchema = z.object({
    email: z.string()
      .min(1, { message: "Email is required" })
      .email({ message: "Please enter a valid email address" }),
    password: z.string()
      .min(1, { message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" }),
  });

  const signupSchema = z.object({
    email: z.string()
      .min(1, { message: "Email is required" })
      .email({ message: "Please enter a valid email address" }),
    password: z.string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number" 
      }),
    confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  const signinForm = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSignIn = async (values: z.infer<typeof signinSchema>) => {
    setIsLoading(true);
    setAuthError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setAuthError("Invalid email or password. Please check your credentials and try again.");
        } else if (error.message.includes("Email not confirmed")) {
          setAuthError("Please check your email and click the confirmation link before signing in.");
        } else {
          setAuthError(error.message);
        }
        return;
      }

      toast.success("Welcome back! Successfully signed in.");
      navigate("/profile");
    } catch (error) {
      setAuthError("An unexpected error occurred. Please try again.");
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUp = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    setAuthError("");

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          setAuthError("This email is already registered. Please sign in instead or use a different email.");
        } else if (error.message.includes("Password should be at least")) {
          setAuthError("Password must be at least 6 characters long.");
        } else {
          setAuthError(error.message);
        }
        return;
      }

      toast.success("Account created successfully! Please check your email to verify your account before signing in.");
      signupForm.reset();
      setActiveTab("signin");
    } catch (error) {
      setAuthError("An unexpected error occurred. Please try again.");
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google') => {
    setIsLoading(true);
    setAuthError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/profile`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        setAuthError(`Failed to sign in with ${provider}. Please try again.`);
        console.error(`${provider} login error:`, error);
      } else {
        toast.success(`Signing in with ${provider}...`);
      }
    } catch (error) {
      setAuthError(`Failed to sign in with ${provider}. Please try again.`);
      console.error(`${provider} login error:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = () => {
    setShowPhoneVerification(true);
  };

  const handlePhoneVerified = () => {
    setShowPhoneVerification(false);
    toast.success("Phone verification successful!");
    navigate("/profile");
  };

  const handlePhoneCancel = () => {
    setShowPhoneVerification(false);
  };

  const clearError = () => {
    setAuthError("");
  };

  if (showPhoneVerification) {
    return (
      <div className="container max-w-md mx-auto p-4 min-h-screen flex flex-col bg-gradient-to-b from-background to-slate-50/30 dark:to-slate-900/30">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handlePhoneCancel} 
            className="mr-2 hover:bg-accent hover:scale-105 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Phone Verification</h1>
            <p className="text-sm text-muted-foreground">Verify your phone number to continue</p>
          </div>
        </div>
        <PhoneVerification onVerified={handlePhoneVerified} onCancel={handlePhoneCancel} />
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto p-4 min-h-screen flex flex-col bg-gradient-to-b from-background to-slate-50/30 dark:to-slate-900/30">
      {/* Header with back button */}
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)} 
          className="mr-2 hover:bg-accent hover:scale-105 transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Welcome</h1>
          <p className="text-sm text-muted-foreground">Sign in to your account or create a new one</p>
        </div>
      </div>

      {/* Error Alert */}
      {authError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{authError}</span>
            <Button variant="ghost" size="sm" onClick={clearError} className="h-auto p-1">
              <Eye className="h-3 w-3" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); clearError(); }} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8 w-full">
            <TabsTrigger value="signin" className="text-sm font-medium">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="text-sm font-medium">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-6">
            <Form {...signinForm}>
              <form onSubmit={signinForm.handleSubmit(onSignIn)} className="space-y-4">
                <FormField
                  control={signinForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            {...field} 
                            placeholder="Enter your email" 
                            className="pl-10"
                            type="email"
                            autoComplete="email"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signinForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            {...field} 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter your password" 
                            className="pr-10"
                            autoComplete="current-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-6">
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(onSignUp)} className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            {...field} 
                            placeholder="Enter your email" 
                            className="pl-10"
                            type="email"
                            autoComplete="email"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            {...field} 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Create a strong password" 
                            className="pr-10"
                            autoComplete="new-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            {...field} 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="Confirm your password" 
                            className="pr-10"
                            autoComplete="new-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-border"></div>
          <div className="px-4 text-sm text-muted-foreground">or continue with</div>
          <div className="flex-1 border-t border-border"></div>
        </div>

        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 hover:bg-accent transition-colors" 
            onClick={() => handleSocialLogin("google")}
            disabled={isLoading}
          >
            <FcGoogle className="h-5 w-5" />
            {isLoading ? "Connecting..." : "Continue with Google"}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 hover:bg-accent transition-colors" 
            onClick={handlePhoneLogin}
            disabled={isLoading}
          >
            <MessageCircle className="h-5 w-5" />
            Continue with Phone
          </Button>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        By continuing, you agree to our{" "}
        <span className="underline cursor-pointer hover:text-foreground">Terms of Service</span>{" "}
        and{" "}
        <span className="underline cursor-pointer hover:text-foreground">Privacy Policy</span>
      </div>
    </div>
  );
};

export default SignIn;
