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
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='bg-white shadow-md rounded-lg p-8 w-full max-w-sm'
      >
        <h2 className='text-xl font-semibold mb-6 text-center'>Login</h2>

        <div className='mb-4'>
          <Label className='block text-gray-700'>Email</Label>
          <Input
            type='email'
            placeholder='you@example.com'
            {...register('email')}
            className='mt-1 block w-full rounded border border-gray-300 p-2'
          />
          {errors.email && (
            <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>
          )}
        </div>

        <div className='mb-4'>
          <Label className='block text-gray-700'>Password</Label>
          <Input
            type='password'
            placeholder='••••••••'
            {...register('password')}
            className='mt-1 block w-full rounded border border-gray-300 p-2'
          />
          {errors.password && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.password.message}
            </p>
          )}
        </div>

        {loginError && <p className='text-red-600 text-center mb-4'>{loginError}</p>}

        <Button
          type='submit'
          disabled={loginLoading}
          className='w-full bg-primary hover:bg-primary/75 hover:text-secondary-foreground hover:cursor-pointer text-white py-2 rounded transition'
        >
          {loginLoading ? 'Logging in...' : 'Login'}
        </Button>
        <p className='text-sm text-center mt-4 text-gray-600'>
          Don&apos;t have an account yet?{' '}
          <span
            onClick={() => router.push('/register')}
            className='text-primary font-medium hover:underline cursor-pointer'
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}
