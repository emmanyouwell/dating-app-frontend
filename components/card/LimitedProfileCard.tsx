'use client';

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, HeartCrack, Loader, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Typography } from '../ui/typography';
import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { ScrollArea } from '../ui/scroll-area';
import { fetchCandidates } from '@/store/slices/matchSlice';
import { fetchLikedCandidates } from '@/store/slices/swipeSlice';

interface LimitedProfileCardProps {
  avatarUrl: string;
  name: string;
  age: number;
  shortBio: string;
  score: number; // from 0 to 1
  gender: string;
  interests: string[];
  id: string;
  onLike?: (id: string) => void;
  onDislike?: (id: string) => void;
  onUnmatch?: (id: string) => void;
  isLiked?: boolean;
  unmatchLoading?: boolean;
  swipeLoading?: boolean;
}

export function LimitedProfileCard({
  id,
  avatarUrl,
  name,
  age,
  shortBio,
  score,
  gender,
  interests,
  onLike,
  onDislike,
  onUnmatch,
  isLiked,
  unmatchLoading,
  swipeLoading,
}: LimitedProfileCardProps) {
  const [liked, setLiked] = useState(false);
  const compatibility = Math.floor(score * 100);
  const dispatch = useAppDispatch();
  const handleLike = async () => {
    setLiked(true);
    onLike?.(id);
    // auto-hide overlay after 1.5s
    setTimeout(async () => {
      setLiked(false);
    }, 1500);
  };
  const handleUnmatch = async () => {
    onUnmatch?.(id);
  };
  const handleDislike = async () => {
    onDislike?.(id);
  };
  return (
    <Card className='pb-0 justify-between relative w-full overflow-hidden border border-pink-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-neutral-600 dark:bg-zinc-900'>
      {/* Overlay */}
      <div
        className={`
          absolute inset-0 z-50 flex items-center justify-center bg-primary/80 backdrop-blur-sm
          transition-all duration-500
          ${
            liked
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-75 pointer-events-none'
          }
        `}
      >
        <Heart className='h-32 w-32 text-white animate-ping' />
      </div>
      {/* Header */}
      <CardHeader className='flex flex-col items-center gap-4 p-6'>
        {/* Avatar */}
        <div className='relative flex flex-col items-center'>
          <Avatar className='h-28 w-28 ring-4 ring-pink-100 dark:ring-pink-800'>
            <AvatarImage
              src={avatarUrl}
              alt={`${name}'s profile picture`}
              className='object-cover'
            />
            <AvatarFallback className='bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'>
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {/* Gender */}
          <Badge
            className={`absolute -bottom-3 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold shadow-md
                    ${
                      gender?.toLowerCase() === 'male'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300'
                        : gender?.toLowerCase() === 'female'
                        ? 'bg-pink-100 text-pink-700 dark:bg-pink-800 dark:text-pink-300'
                        : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                    }
                `}
          >
            {gender}
          </Badge>
        </div>

        {/* Name + Age */}
        <div className='mt-6 flex flex-col items-center text-center gap-2'>
          <div className='flex items-center gap-2'>
            <CardTitle className='text-lg font-semibold text-pink-600 dark:text-pink-400'>
              {name}
            </CardTitle>
            <span className='text-sm text-muted-foreground'>{age}</span>
          </div>

          <CardDescription className='line-clamp-2 text-sm text-muted-foreground'>
            <ScrollArea className='h-24'>
              <Typography variant='blockquote'>
                {' '}
                &quot;
                {shortBio
                  ? shortBio
                  : "I'm too lazy to think of a short bio. But I'm not too lazy to get to know you."}
                &quot;
              </Typography>
            </ScrollArea>
          </CardDescription>
        </div>

        {/* Compatibility Progress Bar */}
        <div className='mt-3 w-full'>
          <div className='mb-1 flex justify-between text-xs text-muted-foreground'>
            <span>Compatibility</span>
            <Badge className='rounded-full bg-pink-100 text-pink-700 dark:bg-pink-800 dark:text-pink-300'>
              <Heart className='h-3.5 w-3.5 fill-white' />
              {compatibility}%
            </Badge>
          </div>
          <Progress
            value={compatibility}
            className='h-2 overflow-hidden rounded-full bg-pink-100 dark:bg-pink-900'
          >
            <div
              className='h-full bg-pink-500 transition-all dark:bg-pink-400'
              style={{ width: `${compatibility}%` }}
            />
          </Progress>
        </div>
      </CardHeader>

      {/* Interests */}
      <CardContent className='flex flex-wrap justify-center gap-2 px-4'>
        {interests.length > 0 ? (
          interests.map((i) => (
            <Badge
              key={i}
              className='rounded-full bg-pink-50 text-pink-700 hover:bg-pink-100 dark:bg-pink-900 dark:text-pink-200 dark:hover:bg-pink-800'
            >
              {i}
            </Badge>
          ))
        ) : (
          <Badge className='rounded-full bg-neutral-50 text-neutral-700 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-pink-800'>
            My only interest is you
          </Badge>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className='sticky bottom-0 flex w-full overflow-hidden bg-white/90 dark:bg-zinc-900/90 shadow-md p-0'>
        {isLiked ? (
          <>
            <Button
              onClick={handleUnmatch}
              variant='ghost'
              disabled={unmatchLoading}
              className='h-14 w-full rounded-none border-r border-zinc-200 bg-zinc-100 text-zinc-700 transition-all hover:bg-zinc-200 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            >
              <HeartCrack className='mr-2 h-5 w-5' />
              {unmatchLoading ? 'Unmatching...' : 'Unmatch'}
            </Button>
          </>
        ) : (
          <>
            {swipeLoading ? (
              <div className='bg-primary w-full flex justify-center items-center h-12'>
                <Loader className='animate-spin text-white' />
              </div>
            ) : (
              <>
                {' '}
                <Button
                  onClick={handleDislike}
                  variant='ghost'
                  className='h-14 w-1/2 rounded-none border-r border-zinc-200 bg-zinc-100 text-zinc-700 transition-all hover:bg-zinc-200 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                >
                  <X className='mr-2 h-5 w-5' />
                  Skip
                </Button>
                <Button
                  onClick={handleLike}
                  className='h-14 w-1/2 rounded-none bg-pink-500 text-white transition-all hover:bg-pink-600 active:scale-[0.98] dark:bg-pink-600 dark:hover:bg-pink-500'
                >
                  <Heart className='mr-2 h-5 w-5 fill-white' />
                  Like
                </Button>
              </>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}
