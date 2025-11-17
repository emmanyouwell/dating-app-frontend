'use client';

import { UserProfile } from '@/common/interfaces/user.interface';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ProfileCompletionCardProps {
  user: UserProfile;
}

export default function ProfileCompletionCard({
  user,
}: ProfileCompletionCardProps) {
  const completionCriteria = [
    { key: 'name', label: 'Name', isDone: !!user.name, isRequired: true },
    { key: 'gender', label: 'Gender', isDone: !!user.gender, isRequired: true },
    {
      key: 'isEmailVerified',
      label: 'Email Verified',
      isDone: !!user.isEmailVerified,
      isRequired: true,
    },
    { key: 'avatar', label: 'Avatar', isDone: !!user.avatar, isRequired: true },
    {
      key: 'address',
      label: 'Address',
      isDone: !!user.address,
      isRequired: true,
    },
    {
      key: 'interests',
      label: 'Interests',
      isDone: user.interests && user.interests.length > 0,
      isRequired: false,
    },
    {
      key: 'birthday',
      label: 'Birthday',
      isDone: !!user.birthday,
      isRequired: false,
    },
    {
      key: 'shortBio',
      label: 'Short Bio',
      isDone: !!user.shortBio,
      isRequired: false,
    },
  ];

  const completedCount = completionCriteria.filter(
    (item) => item.isDone
  ).length;
  const progress = Math.round(
    (completedCount / completionCriteria.length) * 100
  );
  const multiplier = 1.2; // Matching score multiplier when complete
  const isComplete = progress === 100;
  return (
    <Card className='w-sm rounded-2xl'>
      <CardContent className='space-y-4'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-foreground'>
            Profile Completion
          </h3>
          <span
            className={`text-sm font-medium ${
              progress === 100
                ? 'text-green-600 dark:text-green-400'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {progress}%
          </span>
        </div>

        {/* Progress Bar */}
        <Progress
          value={progress}
          className='h-3 bg-muted'
        />

        {/* Completion list */}
        <ul className='space-y-2 mt-3'>
          {completionCriteria.map((item) => (
            <li
              key={item.key}
              className='flex items-center justify-between text-sm text-foreground'
            >
              <div className='flex items-center gap-2'>
                {item.isDone ? (
                  <CheckCircle2 className='text-green-500 w-4 h-4' />
                ) : (
                  <XCircle className='text-destructive w-4 h-4' />
                )}
                <span>{item.label}</span>
                {item.isRequired && (
                  <span className='text-muted-foreground text-xs'>(Required)</span>
                )}
              </div>
              <span
                className={`text-xs ${
                  item.isDone
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-500 dark:text-red-400'
                }`}
              >
                {item.isDone ? 'Done' : 'Missing'}
              </span>
            </li>
          ))}
        </ul>

        {/* Completion Summary */}
        <div className='pt-4 border-t border-border'>
          <p className='text-xs text-muted-foreground text-center'>
            {progress === 100
              ? 'Your profile is complete! Great job 🎉'
              : `Complete ${completionCriteria.length - completedCount} more ${
                  completionCriteria.length - completedCount === 1
                    ? 'item'
                    : 'items'
                } to reach 100% and get x1.2 multiplier on matchmaking!`}
          </p>
        </div>
      </CardContent>
      {/* Circular Progress Bar in Footer */}
      <CardFooter className='flex justify-center py-6 border-t border-border'>
        <div className='relative flex items-center justify-center w-28 h-28'>
          {/* Outer circle with progress */}
          <div
            className='absolute inset-0 rounded-full'
            style={{
              background: `conic-gradient(${
                isComplete
                  ? '#16a34a 0deg 360deg'
                  : `#16a34a 0deg ${progress * 3.6}deg, #e2e8f0 ${
                      progress * 3.6
                    }deg 360deg`
              })`,
            }}
          />

          {/* Inner circle background */}
          <div className='absolute inset-2 bg-card rounded-full flex items-center justify-center shadow-inner'>
            <div className='text-center'>
              {isComplete ? (
                <>
                  <p className='text-sm font-semibold text-green-600 dark:text-green-400'>
                    x{multiplier.toFixed(1)}
                  </p>
                  <p className='text-xs text-slate-500 dark:text-slate-400'>
                    Match Boost
                  </p>
                </>
              ) : (
                <>
                  <p className='text-sm font-semibold text-slate-700 dark:text-slate-200'>
                    {progress}%
                  </p>
                  <p className='text-xs text-slate-500 dark:text-slate-400'>
                    Complete
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
