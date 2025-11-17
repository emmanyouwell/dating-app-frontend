'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchUserPreferences,
  updateUserPreferences,
} from '@/store/slices/userSlice';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Checkbox } from '../ui/checkbox';
// -------------------------
// ✅ Zod Schema
// -------------------------
const preferencesSchema = z
  .object({
    minAge: z.number().min(18, 'Minimum age must be at least 18'),
    maxAge: z.number().max(100, 'Maximum age must be below 100'),
    maxDistance: z.number().min(1, 'Distance must be greater than 0'),
    genderPreference: z
      .array(z.enum(['male', 'female', 'other']))
      .nonempty('Select at least one gender'),
  })
  .refine((data) => data.minAge <= data.maxAge, {
    message: 'Min age cannot be greater than max age',
    path: ['minAge'],
  });

// -------------------------
// ✅ Type Definition
// -------------------------
export type PreferencesFormValues = z.infer<typeof preferencesSchema>;

// -------------------------
// ✅ Component
// -------------------------
export default function EditPreferencesForm() {
  const dispatch = useAppDispatch();
  const {
    preferences,
    updatePreferenceLoading: loading,
    error,
  } = useAppSelector((state) => state.user);

  // -------------------------
  // ✅ Form Setup
  // -------------------------
  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      minAge: preferences?.minAge,
      maxAge: preferences?.maxAge,
      maxDistance: preferences?.maxDistance,
      genderPreference: preferences?.genderPreference,
    },
  });
  // Fetch interests
  useEffect(() => {
    dispatch(fetchUserPreferences());
  }, [dispatch]);
  // Sync existing preferences if they change
  useEffect(() => {
    if (preferences) {
      console.log(preferences.minAge);
      form.reset({
        minAge: preferences.minAge,
        maxAge: preferences.maxAge,
        maxDistance: preferences.maxDistance,
        genderPreference: preferences.genderPreference,
      });
    }
  }, [preferences, form]);

  // -------------------------
  // ✅ Submit Handler
  // -------------------------
  const onSubmit = async (values: PreferencesFormValues) => {
    try {
      await dispatch(updateUserPreferences(values)).unwrap();
      toast.success('Preferences updated successfully');
      dispatch(fetchUserPreferences());
    } catch (err) {
      console.error(err);
      toast.error('Failed to update preferences');
    }
  };

  // -------------------------
  // ✅ JSX
  // -------------------------
  return (
    <Card className='w-full bg-linear-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl'>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Update your preferences</CardDescription>
      </CardHeader>

      <CardContent className='h-full'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6 justify-between flex flex-col h-full'
          >
            <div className='flex items-center justify-between gap4'>
              {/* Min Age */}
              <FormField
                control={form.control}
                name='minAge'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Age</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={18}
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Max Age */}
              <FormField
                control={form.control}
                name='maxAge'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Age</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        max={100}
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Max Distance */}
              <FormField
                control={form.control}
                name='maxDistance'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Distance (km)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={1}
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Gender Preferences (multi-select) */}
            <FormField
              control={form.control}
              name='genderPreference'
              render={() => (
                <FormItem>
                  <FormLabel>Gender Preferences</FormLabel>
                  <div className='flex flex-col gap-2 mt-2'>
                    {(['male', 'female'] as const).map((gender) => (
                      <FormField
                        key={gender}
                        control={form.control}
                        name='genderPreference'
                        render={({ field }) => {
                          const checked = field.value?.includes(gender);
                          return (
                            <FormItem
                              key={gender}
                              className='flex flex-row items-center space-x-3 space-y-0'
                            >
                              <FormControl>
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(checkedValue) => {
                                    const newValue = checkedValue
                                      ? [...field.value, gender]
                                      : field.value.filter((g) => g !== gender);
                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className='font-normal capitalize'>
                                {gender}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='pt-2'>
              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>

            {error && (
              <p className='text-sm text-destructive mt-2'>
                {typeof error === 'string'
                  ? error
                  : 'An unexpected error occurred'}
              </p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
