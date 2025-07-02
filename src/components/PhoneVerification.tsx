
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PhoneVerificationProps {
  onVerified: () => void;
  onCancel: () => void;
}

const PhoneVerification = ({ onVerified, onCancel }: PhoneVerificationProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) {
        toast.error("Failed to send OTP. Please try again.");
        console.error("OTP send error:", error);
      } else {
        toast.success(`OTP sent to ${phoneNumber}`);
        setStep("otp");
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
      console.error("OTP send error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otpValue.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otpValue,
        type: 'sms',
      });

      if (error) {
        toast.error("Invalid OTP. Please try again.");
        console.error("OTP verify error:", error);
      } else {
        toast.success("Phone number verified successfully!");
        onVerified();
      }
    } catch (error) {
      toast.error("Failed to verify OTP. Please try again.");
      console.error("OTP verify error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold text-center">Phone Verification</h2>
      
      {step === "phone" ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number with country code (+1234567890)"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Include country code (e.g., +1 for US, +91 for India)
            </p>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSendOTP} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send OTP"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-center">
            Enter the 6-digit code sent to your phone {phoneNumber}
          </p>
          
          <div className="flex justify-center my-4">
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={setOtpValue}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} index={index} />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep("phone")}>
              Back
            </Button>
            <Button onClick={handleVerifyOTP} disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </div>
          
          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={handleSendOTP} 
              disabled={isLoading}
              className="text-sm"
            >
              Resend OTP
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneVerification;
