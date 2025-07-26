import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Analytics } from '@/lib/firebase/analyticsServices';
import { AnalyticsService } from '@/lib/firebase/analyticsServices';

interface AnalyticsState {
  data: Analytics | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  data: null,
  loading: false,
  error: null
};

export const fetchAnalytics = createAsyncThunk('analytics/fetch', async () => {
  return await AnalyticsService.getAnalytics();
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAnalytics.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action: PayloadAction<Analytics>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching analytics';
      });
  }
});

export default analyticsSlice.reducer;
