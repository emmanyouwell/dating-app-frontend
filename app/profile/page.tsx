'use client';
import { UserProfile } from '@/common/interfaces/user.interface';
import ProfileCompletionCard from '@/components/card/ProfileCompletionCard';
import EditPreferencesForm from '@/components/forms/EditPreferencesForm';
import { EditProfileForm } from '@/components/forms/EditProfileForm';
import { VerifyEmail } from '@/components/forms/VerifyEmail';
import Navbar from '@/components/layout/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Typography } from '@/components/ui/typography';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/store/hooks';
import { sendVerificationCode } from '@/store/slices/userSlice';
import { Edit, Mail } from 'lucide-react';

const page = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const userDetails: UserProfile = {
    name: user?.name,
    isEmailVerified: user?.isEmailVerified,
    avatar: user?.avatar?.url,
    address: user?.address,
    interests: user?.interests.map((i) => i._id),
    birthday: user?.birthday,
    shortBio: user?.shortBio,
    gender: user?.gender,
  };
  return (
    <ProtectedRoute>
      <Navbar isAuthenticated={isAuthenticated} loading={loading} />
      <div className='flex min-h-screen items-center justify-center bg-background font-sans dark:bg-background'>
        <main className='flex flex-col lg:flex-row min-h-screen w-full max-w-7xl justify-center bg-background dark:bg-background sm:items-start p-4 gap-4'>
          <EditProfileForm />
          <div className='w-full flex flex-col gap-4'>
            <div className='w-full flex flex-col md:flex-row items-stretch gap-4'>
              <EditPreferencesForm />
              <ProfileCompletionCard user={userDetails} />
            </div>
            <VerifyEmail
              user={{
                email: user?.email,
                isEmailVerified: user?.isEmailVerified,
              }}
            />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

const Gradient = () => (
  <div className='group-hover:opacity-100 opacity-0 absolute bottom-0 z-10 hidden h-24 w-full bg-linear-to-t from-neutral-600 to-neutral-500/0 md:block transition-opacity duration-500' />
);
export default page;
