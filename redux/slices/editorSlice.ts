import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EditorState {
  // Content
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  
  // Metadata
  category: string;
  tags: string[];
  featuredImage: string;
  metaDescription: string;
  
  // Settings
  status: 'draft' | 'published';
  isAIGenerated: boolean;
  
  // UI State
  isPreviewMode: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  lastSaved: number | null;
  
  // Editor Settings
  wordCount: number;
  readingTime: number;
  
  // AI Generation
  aiPrompt: string;
  isGenerating: boolean;
}

const initialState: EditorState = {
  // Content
  title: '',
  content: '',
  excerpt: '',
  slug: '',
  
  // Metadata
  category: '',
  tags: [],
  featuredImage: '',
  metaDescription: '',
  
  // Settings
  status: 'draft',
  isAIGenerated: false,
  
  // UI State
  isPreviewMode: false,
  isSaving: false,
  hasUnsavedChanges: false,
  lastSaved: null,
  
  // Editor Settings
  wordCount: 0,
  readingTime: 0,
  
  // AI Generation
  aiPrompt: '',
  isGenerating: false,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    // Content actions
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
      state.hasUnsavedChanges = true;
      // Auto-generate slug from title
      state.slug = action.payload
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    },
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
      state.hasUnsavedChanges = true;
      // Calculate word count and reading time
      const words = action.payload.replace(/<[^>]*>/g, '').split(/\s+/).length;
      state.wordCount = words;
      state.readingTime = Math.ceil(words / 200); // 200 words per minute
    },
    setExcerpt: (state, action: PayloadAction<string>) => {
      state.excerpt = action.payload;
      state.hasUnsavedChanges = true;
    },
    setSlug: (state, action: PayloadAction<string>) => {
      state.slug = action.payload;
      state.hasUnsavedChanges = true;
    },
    
    // Metadata actions
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
      state.hasUnsavedChanges = true;
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.tags = action.payload;
      state.hasUnsavedChanges = true;
    },
    addTag: (state, action: PayloadAction<string>) => {
      if (!state.tags.includes(action.payload)) {
        state.tags.push(action.payload);
        state.hasUnsavedChanges = true;
      }
    },
    removeTag: (state, action: PayloadAction<string>) => {
      state.tags = state.tags.filter(tag => tag !== action.payload);
      state.hasUnsavedChanges = true;
    },
    setFeaturedImage: (state, action: PayloadAction<string>) => {
      state.featuredImage = action.payload;
      state.hasUnsavedChanges = true;
    },
    setMetaDescription: (state, action: PayloadAction<string>) => {
      state.metaDescription = action.payload;
      state.hasUnsavedChanges = true;
    },
    
    // Settings actions
    setStatus: (state, action: PayloadAction<'draft' | 'published'>) => {
      state.status = action.payload;
      state.hasUnsavedChanges = true;
    },
    setIsAIGenerated: (state, action: PayloadAction<boolean>) => {
      state.isAIGenerated = action.payload;
    },
    
    // UI State actions
    togglePreviewMode: (state) => {
      state.isPreviewMode = !state.isPreviewMode;
    },
    setPreviewMode: (state, action: PayloadAction<boolean>) => {
      state.isPreviewMode = action.payload;
    },
    setSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
    markAsSaved: (state) => {
      state.hasUnsavedChanges = false;
      state.lastSaved = Date.now();
      state.isSaving = false;
    },
    
    // AI Generation actions
    setAIPrompt: (state, action: PayloadAction<string>) => {
      state.aiPrompt = action.payload;
    },
    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
    
    // Reset actions
    resetEditor: (state) => {
      return { ...initialState };
    },
    loadPost: (state, action: PayloadAction<Partial<EditorState>>) => {
      return {
        ...state,
        ...action.payload,
        hasUnsavedChanges: false,
        lastSaved: Date.now(),
      };
    },
  },
});

export const {
  // Content
  setTitle,
  setContent,
  setExcerpt,
  setSlug,
  
  // Metadata
  setCategory,
  setTags,
  addTag,
  removeTag,
  setFeaturedImage,
  setMetaDescription,
  
  // Settings
  setStatus,
  setIsAIGenerated,
  
  // UI State
  togglePreviewMode,
  setPreviewMode,
  setSaving,
  markAsSaved,
  
  // AI Generation
  setAIPrompt,
  setGenerating,
  
  // Reset
  resetEditor,
  loadPost,
} = editorSlice.actions;

export default editorSlice.reducer;