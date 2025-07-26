import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthService } from '@/lib/auth';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'admin';
  location:string;
  status: boolean;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  totalPosts: number;
  createdAt: string | null;
  updatedAt: string | null;
  lastLogin: string | null;
  lastActive: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  allUsers: User[];
  selectedUser: User | null;
  resetEmail:User | null;
  otpVerified:User|boolean;

}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  allUsers: [],
  selectedUser: null,
  resetEmail: null,
  otpVerified: false,
};

// Thunks
export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }: { email: string; password: string }, thunkAPI) => {
  try {
    return await AuthService.login(email, password);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const registerUser = createAsyncThunk('auth/registerUser', async ({ email, password, name }: { email: string; password: string; name: string }, thunkAPI) => {
  try {
    return await AuthService.register(email, password, name);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, thunkAPI) => {
  try {
    await AuthService.logout();
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const updateUserProfile = createAsyncThunk('auth/updateUserProfile', async ({ uid, updates }: { uid: string; updates: Partial<User> }, thunkAPI) => {
  try {
    await AuthService.updateProfile(uid, updates);
    return await AuthService.getUserProfile(uid);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email: string, thunkAPI) => {
  try {
    await AuthService.forgotPassword(email);
    return email;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const verifyResetCode = createAsyncThunk('auth/verifyResetCode', async (code: string, thunkAPI) => {
  try {
    const email = await AuthService.verifyOTP(code);
    return email; // return email to store in state if needed
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ code, newPassword }: { code: string; newPassword: string }, thunkAPI) => {
  try {
    await AuthService.resetPassword(code, newPassword);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});
export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async (email: string, thunkAPI) => {
    try {
      await AuthService.resendOTP(email);
      return email;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
// Admin-only Thunks
export const getAllUsers = createAsyncThunk('auth/getAllUsers', async (_, thunkAPI) => {
  try {
    return await AuthService.getAllUsers();
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const getUserById = createAsyncThunk('auth/getUserById', async (uid: string, thunkAPI) => {
  try {
    const user = await AuthService.getUserById(uid);
    return user;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const deleteUserById = createAsyncThunk('auth/deleteUserById', async (uid: string, thunkAPI) => {
  try {
    await AuthService.deleteUser(uid);
    return uid;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔐 Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // 📝 Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // 🚪 Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // 🧑‍🔧 Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // 🔐 Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // 🔑 Verify Code
      .addCase(verifyResetCode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyResetCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpVerified = true;

      })
      
      .addCase(verifyResetCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // 🔄 Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // 👥 Get All Users
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload;
        state.isLoading = false;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // 🔍 Get User by ID
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
        state.isLoading = false;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ❌ Delete User
      .addCase(deleteUserById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUserById.fulfilled, (state, action) => {
        state.allUsers = state.allUsers.filter(user => user.id !== action.payload);
        state.isLoading = false;
      })
      .addCase(deleteUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});



export const { setUser, clearUser, setLoading } = authSlice.actions;
export default authSlice.reducer;




// | Feature       | Thunk/Function      | Dispatch Example                                    |
// | ------------- | ------------------- | --------------------------------------------------- |
// | 🔐 Login      | `loginUser`         | `dispatch(loginUser({ email, password }))`          |
// | 🆕 Register   | `registerUser`      | `dispatch(registerUser({ email, password, name }))` |
// | 🚪 Logout     | `logoutUser`        | `dispatch(logoutUser())`                            |
// | ✏️ Update     | `updateUserProfile` | `dispatch(updateUserProfile({ uid, updates }))`     |
// | ❓ Forgot Pass | `forgotPassword`    | `dispatch(forgotPassword(email))`                  |
// | 🧾 Verify OTP | `verifyResetCode`   | `dispatch(verifyResetCode(code))`                   |
// | 🔑 Reset Pass | `resetPassword`     | `dispatch(resetPassword({ code, newPassword }))`    |
