// 'use client';

// import React, { createContext, useContext, useEffect } from 'react';
// import { useAppDispatch, useAppSelector } from '@/redux/hooks';
// import { setUser, clearUser, setLoading } from '@/redux/slices/authSlice';
// import { AuthService } from '@/lib/auth';
// import type { User } from '@/redux/slices/authSlice';

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (email: string, password: string, name: string) => Promise<void>;
//   logout: () => Promise<void>;
//   forgotPassword: (email: string) => Promise<void>;
//   verifyOTP: (code: string) => Promise<string>;
//   resetPassword: (code: string, newPassword: string) => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const dispatch = useAppDispatch();
//   const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

//   useEffect(() => {
//     const unsubscribe = AuthService.onAuthStateChange((user) => {
//       if (user) {
//         dispatch(setUser(user));
//       } else {
//         dispatch(clearUser());
//       }
//     });

//     return unsubscribe;
//   }, [dispatch]);

//   const login = async (email: string, password: string) => {
//     dispatch(setLoading(true));
//     try {
//       const user = await AuthService.login(email, password);
//       dispatch(setUser(user));
//     } catch (error) {
//       dispatch(setLoading(false));
//       throw error;
//     }
//   };

//   const register = async (email: string, password: string, name: string) => {
//     dispatch(setLoading(true));
//     try {
//       const user = await AuthService.register(email, password, name);
//       dispatch(setUser(user));
//     } catch (error) {
//       dispatch(setLoading(false));
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       await AuthService.logout();
//       dispatch(clearUser());
//     } catch (error) {
//       throw error;
//     }
//   };

//   const forgotPassword = async (email: string) => {
//     try {
//       await AuthService.forgotPassword(email);
//     } catch (error) {
//       throw error;
//     }
//   };

//   const verifyOTP = async (code: string) => {
//     try {
//       return await AuthService.verifyOTP(code);
//     } catch (error) {
//       throw error;
//     }
//   };

//   const resetPassword = async (code: string, newPassword: string) => {
//     try {
//       await AuthService.resetPassword(code, newPassword);
//     } catch (error) {
//       throw error;
//     }
//   };

//   const value: AuthContextType = {
//     user,
//     isAuthenticated,
//     isLoading,
//     login,
//     register,
//     logout,
//     forgotPassword,
//     verifyOTP,
//     resetPassword,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }