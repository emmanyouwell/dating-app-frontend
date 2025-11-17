'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { refreshUser } = useAuth();
  const { loginLoading, loginError } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await dispatch(loginUser(data));
    
    if (result.type === 'auth/login/fulfilled' && result.payload?.success) {
      // Refresh auth state from server (httpOnly cookies)
      // This will update the Context with the new user session
      await refreshUser();
      // Redirect after auth is refreshed
      router.replace('/');
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4'>
      <Card className='w-full max-w-md shadow-lg border-2'>
        <CardHeader className='space-y-1 text-center'>
          <CardTitle className='text-3xl font-bold tracking-tight'>
            Welcome Back
          </CardTitle>
          <CardDescription className='text-base'>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {/* Email Field */}
            <div className='space-y-2'>
              <Label htmlFor='email' className='text-sm font-medium'>
                Email Address
              </Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  id='email'
                  type='email'
                  placeholder='you@example.com'
                  {...register('email')}
                  className='pl-10'
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
              </div>
              {errors.email && (
                <p className='text-sm text-destructive flex items-center gap-1'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className='space-y-2'>
              <Label htmlFor='password' className='text-sm font-medium'>
                Password
              </Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  id='password'
                  type='password'
                  placeholder='Enter your password'
                  {...register('password')}
                  className='pl-10'
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
              </div>
              {errors.password && (
                <p className='text-sm text-destructive flex items-center gap-1'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Error Message */}
            {loginError && (
              <div className='rounded-md bg-destructive/10 border border-destructive/20 p-3'>
                <p className='text-sm text-destructive flex items-center gap-2'>
                  <AlertCircle className='h-4 w-4' />
                  {loginError}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type='submit'
              disabled={loginLoading}
              className='w-full'
              size='lg'
            >
              {loginLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Logging in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex flex-col space-y-4'>
          <div className='text-sm text-center text-muted-foreground'>
            Don&apos;t have an account?{' '}
            <button
              type='button'
              onClick={() => router.push('/register')}
              className='text-primary font-medium hover:underline transition-colors'
            >
              Create an account
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
