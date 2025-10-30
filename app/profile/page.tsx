'use client';
import EditPreferencesForm from '@/components/forms/EditPreferencesForm';
import { EditProfileForm } from '@/components/forms/EditProfileForm';
import Navbar from '@/components/layout/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Typography } from '@/components/ui/typography';
import { useAuth } from '@/hooks/useAuth';
import { Edit } from 'lucide-react';

const page = () => {
  const { isAuthenticated, loading, user, error } = useAuth();

  return (
    <ProtectedRoute>
      <Navbar isAuthenticated={isAuthenticated} loading={loading} />
      <div className='flex min-h-screen items-center justify-center bg-background font-sans dark:bg-background'>
        <main className='flex min-h-screen w-full max-w-7xl justify-between bg-background dark:bg-background sm:items-start p-4'>
          <EditProfileForm />
          <EditPreferencesForm/>
        </main>
      </div>
    </ProtectedRoute>
  );
};

const Gradient = () => (
  <div className='group-hover:opacity-100 opacity-0 absolute bottom-0 z-10 hidden h-24 w-full bg-linear-to-t from-neutral-600 to-neutral-500/0 md:block transition-opacity duration-500' />
);
export default page;
