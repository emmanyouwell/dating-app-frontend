'use client';
import { LimitedProfileCard } from '@/components/card/LimitedProfileCard';
import EmptyTemplate from '@/components/EmptyTemplate';
import Navbar from '@/components/layout/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Typography } from '@/components/ui/typography';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCandidates } from '@/store/slices/matchSlice';
import {
  fetchLikedCandidates,
  swipeLeft,
  swipeRight,
  unmatch,
} from '@/store/slices/swipeSlice';
import {  Loader, Search } from 'lucide-react';
import React, { useEffect } from 'react';

const Page = () => {
  const { isAuthenticated, loading } = useAuth();
  const { liked, loading: fetchLiked, swipeLoadingIds, unmatchLoadingIds } = useAppSelector(
    (state) => state.swipe
  );
  const { candidates, loading: matchLoading } = useAppSelector(
    (state) => state.match
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchCandidates());
    dispatch(fetchLikedCandidates());
  }, [dispatch]);
  const onLike = (id: string) => {
    dispatch(swipeRight(id));
  };
  const onUnmatch = (id: string) => {
    dispatch(unmatch(id));
  };
  const onDislike = (id: string) => {
    dispatch(swipeLeft(id));
  };
  return (
    <ProtectedRoute profileCheck>
      <Navbar isAuthenticated={isAuthenticated} loading={loading} />
      <div className='flex min-h-screen items-center justify-center bg-background font-sans dark:bg-background'>
        <main className='flex min-h-screen w-full max-w-7xl flex-col items-center bg-background dark:bg-background sm:items-start p-4 gap-4'>
          <div
            className='relative w-full rounded-3xl flex items-center justify-center overflow-hidden'
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1516414559093-91c1c3d7359c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: `calc(100vh - 40rem)`,
              top: 12,
            }}
          >
            {/* Overlay */}
            <div className='absolute inset-0 bg-black/50 z-0' />

            {/* Content */}
            <div className='relative z-10 text-center'>
              <Typography variant='h1' className='text-white'>
                Find your match
              </Typography>
              <Typography variant='p' className='text-white max-w-3xl'>
                Let the algorithm handle the search while you focus on the
                connection. It learns what you love — from shared interests to
                lifestyle preferences — and introduces you to people who truly
                click with you.
              </Typography>
            </div>
          </div>
          <Tabs defaultValue='find' className='w-full'>
            <TabsList className='w-full'>
              <TabsTrigger value='find'>Find candidates</TabsTrigger>
              <TabsTrigger value='liked'>Liked candidates</TabsTrigger>
            </TabsList>
            <TabsContent value='find'>
              {matchLoading ? (
                <div className='w-full h-96 flex items-center justify-center gap-4'>
                  <Typography variant='p'>
                    Looking for potential candidates
                  </Typography>{' '}
                  <Loader className='animate-spin' />
                </div>
              ) : (
                <>
                  {candidates.length > 0 ? (
                    <div className='w-full grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                      {candidates.map((c) => (
                        <LimitedProfileCard
                          key={c._id}
                          id={c._id}
                          avatarUrl={String(c.avatarUrl)}
                          name={c.name}
                          shortBio={c.shortBio}
                          score={c.score}
                          gender={String(c.gender)}
                          interests={c.interests}
                          age={c.age}
                          onLike={() => onLike(c._id)}
                          onDislike={() => onDislike(c._id)}
                          swipeLoading={swipeLoadingIds.includes(c._id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyTemplate
                      title='No new matches found'
                      icon={Search}
                      description="No matches yet, but love's on the way. Adjust your preferences and see who's out there waiting for you."
                    />
                  )}
                </>
              )}
            </TabsContent>
            <TabsContent value='liked'>
              {fetchLiked ? (
                <div className='w-full h-96 flex items-center justify-center gap-4'>
                  <Typography variant='p'>Getting liked candidates</Typography>{' '}
                  <Loader className='animate-spin' />
                </div>
              ) : (
                <>
                  {(liked?.length ?? 0) > 0 ? (
                    <div className='w-full grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                      {liked?.map((c) => (
                        <LimitedProfileCard
                          key={c._id}
                          id={c._id}
                          avatarUrl={String(c.avatarUrl)}
                          name={c.name}
                          shortBio={c.shortBio}
                          score={c.score}
                          gender={String(c.gender)}
                          interests={c.interests}
                          age={c.age}
                          onLike={() => onLike(c._id)}
                          onDislike={() => onDislike(c._id)}
                          onUnmatch={() => onUnmatch(c._id)}
                          isLiked
                          unmatchLoading={unmatchLoadingIds.includes(c._id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyTemplate
                      title='No crushes yet? No pressure.'
                      icon={Search}
                      description='Keep your standards high and your heart open. Explore your preferences and see who catches your eye.'
                    />
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
