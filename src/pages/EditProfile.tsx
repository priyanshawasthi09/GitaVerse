import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronLeft, User, Mail, Phone, Camera, Save, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Textarea } from "@/components/ui/textarea";

// Define the form schema
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  bio: z.string().max(160, {
    message: "Bio cannot exceed 160 characters."
  }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function EditProfile() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { signOut } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with default values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      bio: "",
    },
  });

  // Load user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      form.reset({
        name: parsedData.name || "",
        email: parsedData.email || "",
        phone: parsedData.phone || "",
        bio: parsedData.bio || "",
      });
      // Only set avatar if it exists and is not a placeholder
      if (parsedData.avatarUrl && !parsedData.avatarUrl.includes('placeholder')) {
        setAvatarUrl(parsedData.avatarUrl);
      }
    }
  }, [form]);

  const onSubmit = (data: ProfileFormValues) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Save to localStorage
      const updatedData = {
        ...data,
        avatarUrl,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("userData", JSON.stringify(updatedData));
      
      toast.success(t('profileUpdated') || "Your profile has been updated successfully");
      setIsLoading(false);
      navigate("/profile");
    }, 1000);
  };

  const handleAvatarChange = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Create a FileReader to convert the image to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarUrl(result);
        toast.success("Profile picture updated successfully");
      };
      reader.onerror = () => {
        toast.error("Error reading the file");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      toast.success("Successfully signed out");
      navigate("/signin");
    } catch (error) {
      toast.error("Error signing out");
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto p-4 space-y-8 animate-fade-in">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/profile")}
          className="mr-2 hover:bg-accent hover:scale-105 transition-all"
          aria-label="Back to profile"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">{t('back') || "Back"}</span>
        </Button>
        <h1 className="text-2xl font-bold">{t('editProfile') || "Edit Profile"}</h1>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4 mb-8">
        <div className="relative group">
          <div className="size-32 rounded-full bg-black p-1 shadow-lg">
            <div className="size-full rounded-full overflow-hidden border-4 border-background bg-black flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <User className="h-16 w-16 text-white" />
              )}
            </div>
          </div>
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute bottom-0 right-0 rounded-full shadow-md hover:shadow-lg transition-all" 
            onClick={handleAvatarChange}
          >
            <Camera className="h-4 w-4" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            aria-label="Upload profile picture"
          />
        </div>
        <p className="text-sm text-muted-foreground">Tap the camera icon to upload your photo</p>
      </div>

      <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3 space-y-1.5">
          <CardTitle className="text-xl font-semibold">Personal Information</CardTitle>
          <CardDescription>Update your personal details below</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-medium text-base">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2 border rounded-md pl-3 focus-within:ring-1 focus-within:ring-primary transition-all">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <Input {...field} className="border-0 flex-1 text-base" placeholder="Your full name" />
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm font-medium text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-medium text-base">E-mail Address</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2 border rounded-md pl-3 focus-within:ring-1 focus-within:ring-primary transition-all">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <Input {...field} className="border-0 flex-1 text-base" placeholder="your.email@example.com" />
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm font-medium text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-medium text-base">Phone Number</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2 border rounded-md pl-3 focus-within:ring-1 focus-within:ring-primary transition-all">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <Input {...field} className="border-0 flex-1 text-base" placeholder="+1 (234) 567-8900" />
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm font-medium text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-medium text-base">Biography</FormLabel>
                    <FormControl>
                      <div className="border rounded-md p-1 focus-within:ring-1 focus-within:ring-primary transition-all">
                        <Textarea
                          {...field}
                          className="resize-none h-28 border-0 text-base"
                          placeholder="A short bio about yourself..."
                        />
                      </div>
                    </FormControl>
                    <p className="text-xs text-muted-foreground text-right">
                      {field.value?.length || 0}/160 characters
                    </p>
                    <FormMessage className="text-sm font-medium text-destructive" />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full py-6 text-base font-medium shadow-md hover:shadow-lg transition-all" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size={20} className="mr-2" />
                      {t('saving') || "Saving..."}
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      {t('saveChanges') || "Save Changes"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Sign Out Section */}
      <Card className="border border-destructive/20 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-destructive">Account Actions</CardTitle>
          <CardDescription>Manage your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            className="w-full py-6 text-base font-medium shadow-md hover:shadow-lg transition-all"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <>
                <LoadingSpinner size={20} className="mr-2" />
                Signing out...
              </>
            ) : (
              <>
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
