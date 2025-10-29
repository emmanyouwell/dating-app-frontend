
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
    avatar:{
        public_id: string | null;
        url: string | null;
    };
    gender: 'male' | 'female' |'other';
    interests: Interest[];
    address: {
        street: string;
        brgy: string;
        city: string;
        location: {
            type: 'Point';
            coordinates: number[];
        }
    };
    lastLogin: Date;
    lastActiveAt: Date;
}
