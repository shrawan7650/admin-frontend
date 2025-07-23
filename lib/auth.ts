import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  User as FirebaseUser,
  onAuthStateChanged,
  onIdTokenChanged
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";

import { auth, db } from "@/config/firebase";
import { User } from "@/redux/slices/authSlice";

export interface AuthError {
  code: string;
  message: string;
}

function serializeTimestamps<T extends Record<string, any>>(data: T): T {
  const result: any = {};

  for (const key in data) {
    const value = data[key];
    if (value && typeof value === 'object' && 'toDate' in value) {
      result[key] = value.toDate().toISOString();
    } else {
      result[key] = value;
    }
  }

  return result;
}


export class AuthService {
  // ✅ Login with email and password
  static async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Update lastLogin timestamp
      await updateDoc(doc(db, 'users', uid), {
        lastLogin: serverTimestamp(),
      });

      // Fetch user profile
      return await this.getUserProfile(uid);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // ✅ Register new user
  static async register(email: string, password: string, name: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const uid = userCredential.user.uid;
      const userData: User = {
        id: uid,
        name,
        email,
        role: "admin",
        avatar: "",
        status: true,
        bio: "",
        totalPosts: 0,
        socialLinks: {
          twitter: "",
          linkedin: "",
          github: "",
          website: ""
        },
        lastLogin: serverTimestamp() as unknown as string,
        createdAt: serverTimestamp()as unknown as string,
        updatedAt: serverTimestamp()as unknown as string,
        location: ""
      };

      await setDoc(doc(db, "users", uid), userData);
      return userData;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // ✅ Logout
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // ✅ Forgot password
  static async forgotPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }
  static async resendOTP(email: string): Promise<void> {
    // Same as forgotPassword
    return this.forgotPassword(email);
  }
  // ✅ Verify OTP from reset email
  static async verifyOTP(code: string): Promise<string> {
    try {
      return await verifyPasswordResetCode(auth, code);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // ✅ Reset password
  static async resetPassword(code: string, newPassword: string): Promise<void> {
    try {
      await confirmPasswordReset(auth, code, newPassword);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }


  
  static async getUserProfile(uid: string): Promise<User> {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (!userDoc.exists()) throw new Error("User profile not found");
  
    const data = userDoc.data();
  
    const user: User = {
      id: uid,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      role: data.role || "user",
      status: data.status ?? true,
      bio: data.bio || '',
      location: data.location,
      totalPosts: data.totalPosts || 0,
      socialLinks: data.socialLinks || {},
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      lastLogin: data.lastLogin,
    };
  
    return serializeTimestamps(user);
  }
  
  

  // ✅ Update user profile
  static async updateProfile(uid: string, updates: Partial<User>): Promise<void> {
    try {
      await updateDoc(doc(db, "users", uid), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // ✅ Delete user (admin use)
  static async deleteUser(uid: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "users", uid));
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // ✅ Get all users (admin use)
  static async getAllUsers(limitCount = 10): Promise<User[]> {
    try {
      const q = query(
        collection(db, "users"),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        const rawData: User = {
          id: doc.id,
          name: data.name,
          email: data.email,
          avatar: data.avatar,
          role: data.role || "user",
          status: data.status ?? true,
          bio: data.bio || '',
          location: data.location,
          totalPosts: data.totalPosts || 0,
          socialLinks: data.socialLinks || {},
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          lastLogin: data.lastLogin,
        };
        return serializeTimestamps(rawData);
      });
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }
  
  
  // ✅ Get single user by ID (admin use)
  static async getUserById(id: string): Promise<User | null> {
    try {
      console.log("Fetching user by ID:", id);
      const docSnap = await getDoc(doc(db, "users", id));
      console.log("Doc exists?", docSnap.exists());
console.log("Doc data:", docSnap.data());
      if (!docSnap.exists()) return null;
  
      const rawData = { id: docSnap.id, ...docSnap.data() } as User;
      return serializeTimestamps(rawData);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }
  

  // ✅ Listen to auth state
  static onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const user = await this.getUserProfile(firebaseUser.uid);
          callback(user);
        } catch (error) {
          console.error("Error getting user profile:", error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }
  
  static onIdTokenChange(callback: (user: User | null) => void): () => void {
    // Wrap onIdTokenChanged, but also resolve user profile data for consistency:
    return onIdTokenChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const user = await this.getUserProfile(firebaseUser.uid);
          callback(user);
        } catch (error) {
          console.error("Error getting user profile on token change:", error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }
  
  // ✅ Handle errors
  private static handleAuthError(error: any): AuthError {
    const errorMessages: Record<string, string> = {
      "auth/user-not-found": "No user found with this email address.",
      "auth/wrong-password": "Incorrect password.",
      "auth/email-already-in-use": "An account with this email already exists.",
      "auth/weak-password": "Password should be at least 6 characters.",
      "auth/invalid-email": "Invalid email address.",
      "auth/too-many-requests": "Too many failed attempts. Please try again later.",
      "auth/network-request-failed": "Network error. Please check your connection.",
    };

    return {
      code: error.code || "auth/unknown-error",
      message:
        errorMessages[error.code] || error.message || "An unexpected error occurred.",
    };
  }
}
