// store/slices/profileSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

export const swipeRight = createAsyncThunk(
  'swipe/swipeRight',
  async (id: string) => {
    const res = await api.post('/swipes/right', { candidateId: id });
    return res.data; // array of strings
  }
);
export const swipeLeft = createAsyncThunk(
  'swipe/swipeLeft',
  async (id: string) => {
    const res = await api.post('/swipes/left', { candidateId: id });
    return res.data; // array of strings
  }
);
export const unmatch = createAsyncThunk('swipe/unmatch', async (id: string) => {
  const res = await api.post('/swipes/unmatch', { candidateId: id });
  return res.data; // array of strings
});

export const fetchLikedCandidates = createAsyncThunk(
  'swipe/fetchLikedCandidates',
  async () => {
    const res = await api.get('/swipes/candidates');
    return res.data;
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
interface SwipeState {
  liked: LimitedUserProfileDto[] | null;
  message: string;
  loading: boolean;
  swipeLoadingIds: string[];
  unmatchLoadingIds: string[]; // or Set<string>
  error: string | null;
}

const initialState: SwipeState = {
  liked: null,
  message: '',
  loading: false,
  swipeLoadingIds: [],
  unmatchLoadingIds: [],
  error: null,
};

const swipeSlice = createSlice({
  name: 'swipe',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(swipeRight.pending, (state, action) => {
        const id = action.meta.arg; // ← get id from thunk argument
        state.swipeLoadingIds.push(id);
      })
      .addCase(swipeRight.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.swipeLoadingIds = state.unmatchLoadingIds.filter((x) => x !== id);
        state.message = action.payload.message;
      })
      .addCase(swipeRight.rejected, (state, action) => {
        const id = action.meta.arg;
        state.swipeLoadingIds = state.unmatchLoadingIds.filter((x) => x !== id);
      })
      .addCase(swipeLeft.pending, (state, action) => {
        const id = action.meta.arg; // ← get id from thunk argument
        state.swipeLoadingIds.push(id);
      })
      .addCase(swipeLeft.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.swipeLoadingIds = state.unmatchLoadingIds.filter((x) => x !== id);
        state.message = action.payload.message;
      })
      .addCase(swipeLeft.rejected, (state, action) => {
        const id = action.meta.arg;
        state.swipeLoadingIds = state.unmatchLoadingIds.filter((x) => x !== id);
      })
      .addCase(unmatch.pending, (state, action) => {
        const id = action.meta.arg; // ← get id from thunk argument
        state.unmatchLoadingIds.push(id);
      })
      .addCase(unmatch.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.unmatchLoadingIds = state.unmatchLoadingIds.filter(
          (x) => x !== id
        );
        state.message = action.payload.message;
      })
      .addCase(unmatch.rejected, (state, action) => {
        const id = action.meta.arg;
        state.unmatchLoadingIds = state.unmatchLoadingIds.filter(
          (x) => x !== id
        );
      })
      .addCase(fetchLikedCandidates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLikedCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.liked = action.payload.data;
      })
      .addCase(fetchLikedCandidates.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default swipeSlice.reducer;
