'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Only redirect when loading is done and user is unauthenticated
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router]);
  useEffect(() => {
    console.log('Auth status changed:', { loading, isAuthenticated });
  }, [loading, isAuthenticated]);
  // While checking authentication, show loader
  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Loader className='animate-spin' />
      </div>
    );
  }

  // Only render children once authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
