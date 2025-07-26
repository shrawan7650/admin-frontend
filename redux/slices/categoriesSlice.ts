import { CategoriesService } from '@/lib/firebase';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Category {
  id: string;
  name: string;
}

interface CategoriesState {
  items: Category[];
  loading: boolean;
  error: string | null;
  selectedCategory: Category | null;
}

const initialState: CategoriesState = {
  items: [],
  loading: false,
  error: null,
  selectedCategory: null,
};

// Async actions
export const fetchCategories = createAsyncThunk('categories/fetch', async () => {
  return await CategoriesService.getCategories();
});

export const addCategory = createAsyncThunk(
  'categories/add',
  async (name: string, { dispatch }) => {
    await CategoriesService.createCategory({ name });
    dispatch(fetchCategories());
  }
);

export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, name }: { id: string; name: string }, { dispatch }) => {
    await CategoriesService.updateCategory(id, { name });
    dispatch(fetchCategories());
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id: string, { dispatch }) => {
    await CategoriesService.deleteCategory(id);
    dispatch(fetchCategories());
  }
);

// Slice
export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.items = action.payload;
        state.loading = false;

        // Optional: Auto-select first category if none selected
        if (!state.selectedCategory && action.payload.length > 0) {
          state.selectedCategory = action.payload[0];
        }
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });
  },
});

export const { setSelectedCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;