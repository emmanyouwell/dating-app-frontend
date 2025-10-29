'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const route = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    dispatch(loginUser(data)).then(() => route.push('/'));
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='bg-white shadow-md rounded-lg p-8 w-full max-w-sm'
      >
        <h2 className='text-xl font-semibold mb-6 text-center'>Login</h2>

        <div className='mb-4'>
          <label className='block text-gray-700'>Email</label>
          <input
            type='email'
            {...register('email')}
            className='mt-1 block w-full rounded border border-gray-300 p-2'
          />
          {errors.email && (
            <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>
          )}
        </div>

        <div className='mb-4'>
          <label className='block text-gray-700'>Password</label>
          <input
            type='password'
            {...register('password')}
            className='mt-1 block w-full rounded border border-gray-300 p-2'
          />
          {errors.password && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.password.message}
            </p>
          )}
        </div>

        {error && <p className='text-red-600 text-center mb-4'>{error}</p>}
        {user && (
          <p className='text-green-600 text-center mb-4'>
            Welcome, {user.email}!
          </p>
        )}

        <button
          type='submit'
          disabled={!loading}
          className='w-full bg-primary hover:bg-primary/75 hover:text-secondary-foreground hover:cursor-pointer text-white py-2 rounded transition'
        >
          {!loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
