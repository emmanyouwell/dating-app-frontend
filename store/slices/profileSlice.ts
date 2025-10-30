// store/slices/profileSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';


export const fetchInterests = createAsyncThunk(
  'profile/fetchInterests',
  async () => {
    const res = await api.get('/interests');
    return res.data; // array of strings
  }
);

export const fetchGeocode = createAsyncThunk(
  'profile/fetchGeocode',
  async ({ street, city }: { street: string; city: string }) => {
    console.log('Fetching geocode for:', street, city);
    const res = await api.get('/geocode', { params: { street, city } });
    return res.data
  }
);
interface Interest {
  _id: string;
  name: string;
  category: string;
}

interface GeocodeApiResponse {
  lon: string;
  lat: string;
  display_name: string;
}

interface ProfileState {
  interests: Interest[];
  geocodeResults: GeocodeApiResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  interests: [],
  geocodeResults: [],
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Interests
      .addCase(fetchInterests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterests.fulfilled, (state, action) => {
        state.loading = false;
        state.interests = action.payload.data;
      })
      .addCase(fetchInterests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch interests';
      })
      // Geocode
      .addCase(fetchGeocode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGeocode.fulfilled, (state, action) => {
        state.loading = false;
        state.geocodeResults = action.payload.data;
      })
      .addCase(fetchGeocode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch geocode';
      })
     
  },
});

export default profileSlice.reducer;
