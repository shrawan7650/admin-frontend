import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  colorScheme: string;
  
  // Modals
  isDeleteModalOpen: boolean;
  isImageUploadModalOpen: boolean;
  isSettingsModalOpen: boolean;
  
  // Sidebar
  isSidebarOpen: boolean;
  isMobileSidebarOpen: boolean;
  
  // Loading states
  isPageLoading: boolean;
  isSubmitting: boolean;
  
  // Notifications
  notifications: Notification[];
  
  // Search & Filters
  searchQuery: string;
  activeFilters: Record<string, any>;
  
  // Pagination
  currentPage: number;
  itemsPerPage: number;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
}

const initialState: UIState = {
  // Theme
  theme: 'dark',
  colorScheme: 'default',
  
  // Modals
  isDeleteModalOpen: false,
  isImageUploadModalOpen: false,
  isSettingsModalOpen: false,
  
  // Sidebar
  isSidebarOpen: true,
  isMobileSidebarOpen: false,
  
  // Loading states
  isPageLoading: false,
  isSubmitting: false,
  
  // Notifications
  notifications: [],
  
  // Search & Filters
  searchQuery: '',
  activeFilters: {},
  
  // Pagination
  currentPage: 1,
  itemsPerPage: 10,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme actions
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    setColorScheme: (state, action: PayloadAction<string>) => {
      state.colorScheme = action.payload;
    },
    
    // Modal actions
    openDeleteModal: (state) => {
      state.isDeleteModalOpen = true;
    },
    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
    },
    openImageUploadModal: (state) => {
      state.isImageUploadModalOpen = true;
    },
    closeImageUploadModal: (state) => {
      state.isImageUploadModalOpen = false;
    },
    openSettingsModal: (state) => {
      state.isSettingsModalOpen = true;
    },
    closeSettingsModal: (state) => {
      state.isSettingsModalOpen = false;
    },
    
    // Sidebar actions
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    toggleMobileSidebar: (state) => {
      state.isMobileSidebarOpen = !state.isMobileSidebarOpen;
    },
    setMobileSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileSidebarOpen = action.payload;
    },
    
    // Loading actions
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.isPageLoading = action.payload;
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    
    // Notification actions
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'isRead'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
        isRead: false,
      };
      state.notifications.unshift(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.isRead = true;
      }
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    
    // Search & Filter actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setActiveFilters: (state, action: PayloadAction<Record<string, any>>) => {
      state.activeFilters = action.payload;
    },
    updateFilter: (state, action: PayloadAction<{ key: string; value: any }>) => {
      state.activeFilters[action.payload.key] = action.payload.value;
    },
    clearFilters: (state) => {
      state.activeFilters = {};
      state.searchQuery = '';
    },
    
    // Pagination actions
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
    },
    resetPagination: (state) => {
      state.currentPage = 1;
    },
  },
});

export const {
  // Theme
  setTheme,
  setColorScheme,
  
  // Modals
  openDeleteModal,
  closeDeleteModal,
  openImageUploadModal,
  closeImageUploadModal,
  openSettingsModal,
  closeSettingsModal,
  
  // Sidebar
  toggleSidebar,
  setSidebarOpen,
  toggleMobileSidebar,
  setMobileSidebarOpen,
  
  // Loading
  setPageLoading,
  setSubmitting,
  
  // Notifications
  addNotification,
  removeNotification,
  markNotificationAsRead,
  clearAllNotifications,
  
  // Search & Filters
  setSearchQuery,
  setActiveFilters,
  updateFilter,
  clearFilters,
  
  // Pagination
  setCurrentPage,
  setItemsPerPage,
  resetPagination,
} = uiSlice.actions;

export default uiSlice.reducer;