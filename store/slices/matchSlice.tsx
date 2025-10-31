// store/slices/profileSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';


export const fetchCandidates = createAsyncThunk(
  'match/fetchCandidates',
  async () => {
    const res = await api.get('/matching');
    return res.data; // array of strings
  }
);
interface LimitedUserProfileDto {
  _id: string;
  name: string;
  shortBio: string;
  avatarUrl: string | null;
  gender: string | undefined;
  interests: string[];
  popularityScore: number;
  score: number;
  age: number;
}

interface MatchState {
  candidates: LimitedUserProfileDto[];
  loading: boolean;
  error: string | null;
}

const initialState: MatchState = {
  candidates: [],
  loading: false,
  error: null,
};

const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidates.pending, (state) =>{
        state.loading = true;
      })
      .addCase(fetchCandidates.fulfilled, (state, action)=>{
        state.loading= false;
        state.candidates=action.payload.data;

      })
      .addCase(fetchCandidates.rejected, (state)=>{
        state.loading=false;
      })
     
  },
});

export default matchSlice.reducer;
