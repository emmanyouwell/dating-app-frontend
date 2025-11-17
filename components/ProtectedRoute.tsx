'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Loader } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  profileCheck?: boolean;
}

/**
 * ProtectedRoute component that ensures user is authenticated
 * and optionally checks if profile is complete
 * 
 * Uses AuthContext for session state - no Redux needed
 */
export default function ProtectedRoute({
  children,
  profileCheck = false,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();
  
  const completionCriteria = [
    { key: 'name', label: 'Name', isDone: !!user?.name },
    { key: 'gender', label: 'Gender', isDone: !!user?.gender },
    {
      key: 'isEmailVerified',
      label: 'Email Verified',
      isDone: !!user?.isEmailVerified,
    },
    { key: 'avatar', label: 'Avatar', isDone: !!user?.avatar },
    { key: 'address', label: 'Address', isDone: !!user?.address },
  ];
  const completedCount = completionCriteria.filter(
    (item) => item.isDone
  ).length;
  const progress = Math.round(
    (completedCount / completionCriteria.length) * 100
  );
  const isCompleted = progress === 100;
  
  // Track whether we've already shown a toast to avoid duplicates
  const toastShown = useRef(false);

  useEffect(() => {
    // Only run when loading is finished
    if (!loading) {
      // 1. Not authenticated → redirect to login
      if (!isAuthenticated) {
        router.replace('/login');
        return;
      }

      // 2. Profile check logic
      if (profileCheck && !isCompleted && !toastShown.current) {
        toastShown.current = true; // prevent multiple toasts
        toast.warning('Complete minimum profile requirements');
        router.replace('/profile');
      }
    }
  }, [isAuthenticated, loading, profileCheck, isCompleted, router]);

  // While checking authentication, show loader
  if (loading || !isAuthenticated) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Loader className='animate-spin' />
      </div>
    );
  }

  return <>{children}</>;
}
