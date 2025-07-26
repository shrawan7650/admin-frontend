import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import editorReducer from './slices/editorSlice';
import categoriesReducer from "./slices/categoriesSlice"
import postReducer from "./slices/postsSlice"
import analyticsReducer from "./slices/analyticSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories:categoriesReducer,
    analytics:analyticsReducer,
    ui: uiReducer,
    editor: editorReducer,
    posts:postReducer,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;