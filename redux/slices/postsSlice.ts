import { Post } from '@/lib/firebase';
import { PostsService } from '@/lib/firebase/postsService';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { DocumentSnapshot } from 'firebase/firestore';

type PostsState = {
  posts: Post[];
  currentPost: Post | null;
  lastDoc: DocumentSnapshot | null;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  searchTerm: string | null;
  statusFilter: string | null;
};

const initialState: PostsState = {
  posts: [],
  currentPost: null,
  lastDoc: null,
  hasMore: true,
  isLoading: false,
  error: null,
  searchTerm: '',
  statusFilter: 'all', // new
};

// 🟢 Fetch All Posts (with optional filters and pagination)
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (
    filters: {
      status?: 'draft' | 'published';
      categoryId?: string;
      authorId?: string;
      lastDoc?: DocumentSnapshot;
    },
    thunkAPI
  ) => {
    try {
      console.log("PostsService.getPosts", PostsService.getPosts); // ✅ should log [Function]

      return await PostsService.getPosts(filters);
    } catch (error: any) {
      console.error("Error fetching posts:", error);

      // Optional: log index creation link
      if (
        error.code === 'failed-precondition' &&
        typeof error.message === 'string' &&
        error.message.includes('index')
      ) {
        const match = error.message.match(/https:\/\/console\.firebase\.google\.com\/[^\s)]+/);
        if (match) {
          console.warn("Create missing Firestore index here:", match[0]);
        }
      }

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 🟢 Fetch Post by ID
export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (id: string, thunkAPI) => {
    try {
      return await PostsService.getPostById(id);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 🟢 Create Post
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>, thunkAPI) => {
    try {
      return await PostsService.createPost(postData); // returns new ID
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 🟢 Update Post
export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async (
    { id, updates }: { id: string; updates: Partial<Post> },
    thunkAPI
  ) => {
    try {
      await PostsService.updatePost(id, updates);
      return { id, updates };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 🟢 Delete Post
export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id: string, thunkAPI) => {
    try {
      await PostsService.deletePost(id);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    resetCurrentPost(state) {
      state.currentPost = null;
    },
    resetPosts(state) {
      state.posts = [];
      state.lastDoc = null;
      state.hasMore = true;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
    },
  },
  extraReducers: builder => {
    builder

      // 🔄 fetchPosts
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.meta.arg.lastDoc) {
          // Append posts
          state.posts = [...state.posts, ...action.payload.posts];
        } else {
          // First load or reset
          state.posts = action.payload.posts;
        }
        state.lastDoc = action.payload.lastDoc;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Something went wrong';
      })
      // 🔄 fetchPostById
      .addCase(fetchPostById.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action: PayloadAction<Post | null>) => {
        state.currentPost = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ✅ createPost (you may trigger refetch here)
      .addCase(createPost.fulfilled, (state, action: PayloadAction<string>) => {
        // Optional: can trigger refetch or optimistically insert post
      })

      // ✅ updatePost
      .addCase(updatePost.fulfilled, (state, action: PayloadAction<{ id: string; updates: Partial<Post> }>) => {
        const { id, updates } = action.payload;
        const index = state.posts.findIndex(p => p.id === id);
        if (index !== -1) {
          state.posts[index] = { ...state.posts[index], ...updates };
        }
        if (state.currentPost?.id === id) {
          state.currentPost = { ...state.currentPost, ...updates };
        }
      })

      // ✅ deletePost
      .addCase(deletePost.fulfilled, (state, action: PayloadAction<string>) => {
        const id = action.payload;
        state.posts = state.posts.filter(p => p.id !== id);
        if (state.currentPost?.id === id) {
          state.currentPost = null;
        }
      });
  },
});

export const { resetCurrentPost, resetPosts ,setSearchTerm,setStatusFilter} = postsSlice.actions;
export default postsSlice.reducer;
