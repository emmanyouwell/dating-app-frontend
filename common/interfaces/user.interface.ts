interface Interest {
  _id: string;
  name: string;
  category: string;
}

export interface UserDetails {
  id: string;
  email: string;
  name: string;
  isEmailVerified: boolean;
  shortBio: string;
  birthday: Date;
  age: number;
  avatar: {
    public_id: string | null;
    url: string | null;
  };
  gender: 'male' | 'female' | 'other';
  interests: Interest[];
  address: {
    street: string;
    brgy: string;
    city: string;
    location: {
      type: 'Point';
      coordinates: number[];
    };
  };
  lastLogin: Date;
  lastActiveAt: Date;
}
export interface LocationDto {
  type: string;
  coordinates: number[] | undefined; // [longitude, latitude]
}
export interface AddressDto {
  street?: string | undefined;
  brgy?: string | undefined;
  city?: string | undefined;
  location?: LocationDto;
}
export interface UserUpdateProfile {
  name?: string;
  birthday?: Date;
  shortBio?: string;
  gender?: 'male' | 'female' | 'non-binary' | 'other';
  interests?: string[];
  address?: AddressDto;
  sexualOrientation?: 'heterosexual' | 'homosexual' | 'bisexual' | 'other';
}
