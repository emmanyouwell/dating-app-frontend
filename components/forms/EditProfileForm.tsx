'use client';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchInterests, fetchGeocode } from '@/store/slices/profileSlice';
import { toast } from 'sonner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Loader } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { ScrollArea } from '../ui/scroll-area';
import { UserUpdateProfile } from '@/common/interfaces/user.interface';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { updateProfile } from '@/store/slices/userSlice';
import { useAuth } from '@/hooks/useAuth';

// ---------- Zod Schema ----------
const formSchema = z.object({
  name: z.string().optional(),
  birthday: z.string().optional(),
  shortBio: z.string().max(160).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  avatar: z.any().optional(),
  interests: z.array(z.string()).optional(),
  address: z
    .object({
      street: z.string().optional(),
      brgy: z.string().optional(),
      city: z.string().optional(),
      location: z
        .object({
          displayName: z.string(),
          lon: z.number(),
          lat: z.number(),
        })
        .optional(),
    })
    .optional(),
});

// ---------- Component ----------
export const EditProfileForm = () => {
  const DEBOUNCE_DELAY = 500;
  const dispatch = useAppDispatch();
  const { interests, geocodeResults, loading } = useAppSelector(
    (state) => state.profile
  );
  const user = useAppSelector((state) => state.auth.user);
  const { updateLoading } = useAppSelector((state) => state.user);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      birthday: user?.birthday
        ? new Date(user.birthday).toISOString().slice(0, 10)
        : '',
      shortBio: user?.shortBio || '',
      gender: user?.gender || 'other',
      avatar: undefined,
      interests: user?.interests.map((i) => i._id) || [],
      address: {
        street: user?.address?.street || '',
        brgy: user?.address?.brgy || '',
        city: user?.address?.city || '',
        location: user?.address?.location
          ? {
              displayName: `${user.address.street}, ${user.address.city}`,
              lon: user.address.location.coordinates[0],
              lat: user.address.location.coordinates[1],
            }
          : { displayName: '', lon: 0, lat: 0 },
      },
    },
  });

  // Fetch interests
  useEffect(() => {
    dispatch(fetchInterests());
  }, [dispatch]);

  // Debounced geocode fetch
  const street = form.watch('address.street');
  const city = form.watch('address.city');
  const brgy = form.watch('address.brgy');
  useEffect(() => {
    if (!street || !city || !brgy) return;
    const handler = setTimeout(
      () => dispatch(fetchGeocode({ street, city })),
      DEBOUNCE_DELAY
    );
    return () => clearTimeout(handler);
  }, [street, city, brgy, dispatch]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      const interests = data.interests?.length
        ? data.interests.map((id) => id) // backend DTO handles ObjectId conversion
        : undefined;
      // Non-file fields
      if (data.name) formData.append('name', data.name);
      if (data.birthday)
        formData.append('birthday', new Date(data.birthday).toISOString());
      if (data.shortBio) formData.append('shortBio', data.shortBio);
      if (data.gender) formData.append('gender', data.gender);

      // Interests (send as JSON string, even if empty)
      formData.append('interests', JSON.stringify(interests || []));

      if (data.address) {
        const addressPayload = {
          street: data.address.street || undefined,
          brgy: data.address.brgy || undefined,
          city: data.address.city || undefined,
          location:
            data.address.location &&
            data.address.location.lon &&
            data.address.location.lat
              ? {
                  type: 'Point',
                  coordinates: [
                    data.address.location.lon,
                    data.address.location.lat,
                  ],
                }
              : undefined,
        };

        formData.append('address', JSON.stringify(addressPayload));
      }

      // Avatar file
      if (data.avatar?.length) {
        // field.avatar is FileList
        formData.append('avatar', data.avatar[0]);
      }

      // Send PATCH request
      await dispatch(updateProfile(formData)).unwrap();
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <Card className='w-full lg:max-w-xl bg-linear-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl'>
      <CardHeader>
        <div className='rounded-lg rounded-br-none rounded-bl-none animate-fade-down bg-primary dark:bg-primary h-[150px] w-full relative cover-photo'>
          <div className='flex justify-center w-full absolute -top-5'>
            <Avatar className='h-44 w-44 mx-auto'>
              <AvatarImage
                src={user?.avatar?.url ?? '/'}
                alt='profile picture'
                className='object-cover object-top'
              />
              <AvatarFallback>No Profile Picture</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form
          id='profile-form'
          onSubmit={form.handleSubmit(onSubmit)}
          className='gap-6 space-y-2'
        >
          {/* Basic Info */}
          <h3 className='text-lg text-primary font-semibold col-span-1 md:col-span-2'>
            Basic Info
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full'>
            {/* Name */}
            <Controller
              name='name'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Name</FieldLabel>
                  <Input {...field} placeholder='John Doe' />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Birthday */}
            <Controller
              name='birthday'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Birthday</FieldLabel>
                  <Input {...field} type='date' />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Gender */}
            <Controller
              name='gender'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Gender</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select gender' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='male'>Male</SelectItem>
                      <SelectItem value='female'>Female</SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          {/* Avatar */}
          <Controller
            name='avatar'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Avatar</FieldLabel>
                <Input
                  type='file'
                  accept='image/*'
                  onChange={(e) => field.onChange(e.target.files)}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* Profile Details */}
          <h3 className='text-lg text-primary font-semibold col-span-1 md:col-span-2'>
            Profile Details
          </h3>
          <Controller
            name='shortBio'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Short Bio</FieldLabel>
                <Textarea
                  {...field}
                  placeholder='Tell us about yourself'
                  rows={3}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Address */}
          <h3 className='text-lg text-primary font-semibold col-span-1 md:col-span-2'>
            Address
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Controller
              name='address.street'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Street</FieldLabel>
                  <Input {...field} placeholder='123 Main St' />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name='address.brgy'
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Brgy</FieldLabel>
                  <Input {...field} placeholder='Barangay' />
                </Field>
              )}
            />
            <Controller
              name='address.city'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>City</FieldLabel>
                  <Input {...field} placeholder='City' />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Geocode selection */}
          {loading ? (
            <Loader className='animate-spin' />
          ) : (
            geocodeResults.length > 0 && (
              <Controller
                name='address.location'
                control={form.control}
                render={({ field }) => {
                  const selectedIndex = geocodeResults.findIndex(
                    (r) =>
                      parseFloat(r.lon) === field.value?.lon &&
                      parseFloat(r.lat) === field.value?.lat
                  );

                  return (
                    <Field>
                      <FieldLabel>Select Your Location</FieldLabel>
                      <select
                        value={selectedIndex >= 0 ? selectedIndex : ''}
                        onChange={(e) => {
                          const selected =
                            geocodeResults[parseInt(e.target.value)];
                          field.onChange({
                            displayName: selected.display_name,
                            lon: parseFloat(selected.lon),
                            lat: parseFloat(selected.lat),
                          });
                        }}
                        className='border rounded p-2 w-full text-black'
                      >
                        <option value='' disabled>
                          Select a location...
                        </option>
                        {geocodeResults.map((loc, idx) => (
                          <option key={idx} value={idx}>
                            {loc.display_name}
                          </option>
                        ))}
                      </select>
                    </Field>
                  );
                }}
              />
            )
          )}

          {/* Interests Multi-select */}
          <Controller
            name='interests'
            control={form.control}
            render={({ field, fieldState }) => {
              const [search, setSearch] = useState('');
              const [isOpen, setIsOpen] = useState(false);

              const filtered = search
                ? interests.filter((i) => {
                    const name = i.name?.toLowerCase() || '';
                    const category = i.category?.toLowerCase() || '';
                    const query = search.toLowerCase();
                    return name.includes(query) || category.includes(query);
                  })
                : [];

              const selectedInterests = interests.filter((i) =>
                field.value?.includes(i._id)
              );

              const handleSelect = (id: string) => {
                const isSelected = field.value?.includes(id);
                const newValue = isSelected
                  ? field.value?.filter((v: string) => v !== id)
                  : [...(field.value || []), id];

                field.onChange(newValue);
                setSearch(''); // ✅ Clear search input
                setIsOpen(false); // ✅ Hide list
              };

              const handleRemove = (id: string) => {
                const newValue = field.value?.filter((v: string) => v !== id);
                field.onChange(newValue);
              };

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Interests</FieldLabel>

                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder='Search interests...'
                      value={search}
                      onValueChange={(value) => {
                        setSearch(value);
                        setIsOpen(Boolean(value));
                      }}
                    />

                    {isOpen && (
                      <>
                        {search && filtered.length === 0 && (
                          <CommandEmpty>No results found</CommandEmpty>
                        )}
                        {search && filtered.length > 0 && (
                          <CommandGroup>
                            <ScrollArea className='h-96'>
                              {filtered.map((i) => {
                                const selected = field.value?.includes(i._id);
                                return (
                                  <CommandItem
                                    key={i._id}
                                    onSelect={() => handleSelect(i._id)}
                                    className='flex items-center gap-2'
                                  >
                                    <input
                                      type='checkbox'
                                      checked={selected}
                                      readOnly
                                      className='pointer-events-none'
                                    />
                                    <span>
                                      {i.name} ({i.category})
                                    </span>
                                  </CommandItem>
                                );
                              })}
                            </ScrollArea>
                          </CommandGroup>
                        )}
                      </>
                    )}
                  </Command>

                  {/* Selected Interests Preview */}
                  {selectedInterests.length > 0 && (
                    <div className='mt-2 flex flex-wrap gap-2'>
                      {selectedInterests.map((i) => (
                        <span
                          key={i._id}
                          className='flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm'
                        >
                          {i.name}
                          <button
                            type='button'
                            onClick={() => handleRemove(i._id)}
                            className='hover:text-red-500 focus:outline-none'
                            aria-label={`Remove ${i.name}`}
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />
        </form>
      </CardContent>
      <CardFooter className='flex justify-start gap-2'>
        <Button type='submit' form='profile-form' disabled={updateLoading}>
          {updateLoading ? 'Saving...' : 'Save'}
        </Button>
      </CardFooter>
    </Card>
  );
};
