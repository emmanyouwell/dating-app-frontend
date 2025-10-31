'use client';
import { UserProfile } from '@/common/interfaces/user.interface';
import ProfileCompletionCard from '@/components/card/ProfileCompletionCard';
import EditPreferencesForm from '@/components/forms/EditPreferencesForm';
import { EditProfileForm } from '@/components/forms/EditProfileForm';
import { VerifyEmail } from '@/components/forms/VerifyEmail';
import Navbar from '@/components/layout/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';

const Page = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const userDetails: UserProfile = {
    name: user?.name,
    isEmailVerified: user?.isEmailVerified,
    avatar: user?.avatar?.url,
    address: user?.address,
    interests: user?.interests?.map((i) => i._id),
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

export default Page;
