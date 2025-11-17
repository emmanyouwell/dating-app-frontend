import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { sendVerificationCode, verifyEmail } from '@/store/slices/userSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, CheckCircle, XCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface EmailVerificationCardProps {
  user?: { email?: string; isEmailVerified?: boolean };
}

export function VerifyEmail({ user }: EmailVerificationCardProps) {
  const dispatch = useAppDispatch();
  const { refreshUser } = useAuth();
  const isVerified = user?.isEmailVerified ?? false;
  const { codeLoading } = useAppSelector((state) => state.user);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  // -------------------------
  // ✅ Send Verification Code
  // -------------------------
  const onResend = async () => {
    if (!user?.email) return toast.error('No email found');

    try {
     
      await dispatch(
        sendVerificationCode({ email: String(user.email) })
      ).unwrap();
      setOtpSent(true);
      toast.success('Verification code sent successfully.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to send verification code');
    } 
  };

  // -------------------------
  // ✅ Verify Email with OTP
  // -------------------------
  const onVerify = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }

    try {
     
      await dispatch(
        verifyEmail({ email: String(user?.email), code: otp })
      ).unwrap();
      toast.success('Email verified successfully');
      setOtpSent(false);
      setOtp('');
      // Refresh user session to get updated verification status
      await refreshUser();
    } catch (err) {
      console.error(err);
      toast.error('Invalid or expired code');
    }
  };

  // -------------------------
  // ✅ Render
  // -------------------------
  return (
    <Card className='border-none shadow-md bg-linear-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl'>
      <CardContent className='p-6 flex flex-col gap-4'>
        {/* Header Row */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div
              className={`p-2 rounded-full ${
                isVerified
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300'
                  : 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300'
              }`}
            >
              <Mail className='w-5 h-5' />
            </div>

            <div>
              <p className='font-medium text-sm text-slate-800 dark:text-slate-100'>
                {isVerified ? 'Email verified' : 'Email not verified'}: {user?.email}
              </p>
              <p className='text-xs text-slate-500 dark:text-slate-400'>
                {isVerified
                  ? 'Your account is secured.'
                  : otpSent
                  ? 'Enter the verification code we sent.'
                  : 'Please verify your email to access all features.'}
              </p>
            </div>
          </div>

          {isVerified ? (
            <CheckCircle className='text-green-500 w-5 h-5' />
          ) : (
            <XCircle className='text-red-500 w-5 h-5' />
          )}
        </div>

        {/* Actions */}
        {!isVerified && (
          <>
            {!otpSent ? (
              <Button
                variant='secondary'
                size='sm'
                disabled={codeLoading}
                onClick={onResend}
                className='self-start flex items-center gap-2 mt-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
              >
                <RefreshCcw
                  className={`w-4 h-4 ${codeLoading ? 'animate-spin' : ''}`}
                />
                {codeLoading ? 'Sending...' : 'Resend verification email'}
              </Button>
            ) : (
              <div className='flex flex-col gap-4 mt-2'>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  className='justify-start'
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

                <Button
                  onClick={onVerify}
                  disabled={codeLoading}
                  className='w-fit flex items-center gap-2'
                >
                  {codeLoading ? 'Verifying...' : 'Verify Email'}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
