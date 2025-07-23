'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ArrowLeft, Brain } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import toast from 'react-hot-toast';
import { verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '@/config/firebase';

import { resendOTP as resendOTPThunk } from '@/redux/slices/authSlice'; 

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const email = searchParams.get('email') || '';

  // Cooldown timer effect
  useEffect(() => {
    if (resendCooldown === 0) return;

    const timer = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      // Verify OTP using Firebase
      await verifyPasswordResetCode(auth, otp);
      toast.success('OTP verified! You can now reset your password.');

      // Navigate to reset password page with oobCode in URL
      router.push(`/reset-password?oobCode=${encodeURIComponent(otp)}`);
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return; // Prevent spamming resend

    try {
      await dispatch(resendOTPThunk(email)).unwrap();
      toast.success('New OTP sent to your email!');
      setResendCooldown(120); // Start 2-minute cooldown
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/50 to-muted/30 p-4 sm:p-6 lg:p-8">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-sm sm:max-w-md border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center space-y-4 px-4 sm:px-6">
          <div className="flex items-center justify-center gap-2">
            <Brain className="h-8 sm:h-10 w-8 sm:w-10 text-primary" />
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              AI Blog CMS
            </span>
          </div>
          <CardTitle className="text-xl sm:text-2xl">Verify OTP</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Enter the 6-digit code sent to {email}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm">Enter OTP</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <Button type="submit" className="w-full text-sm sm:text-base" disabled={isLoading || otp.length !== 6}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </form>

          <div className="mt-6 space-y-4 text-center">
            <Button
              variant="ghost"
              onClick={handleResendOTP}
              disabled={resendCooldown > 0}
              className="text-xs sm:text-sm text-muted-foreground hover:text-primary"
            >
              {resendCooldown > 0
                ? `Resend OTP in ${resendCooldown}s`
                : "Didn't receive the code? Resend OTP"}
            </Button>

            <Link
              href="/forgot-password"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to forgot password
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
