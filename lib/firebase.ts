// Firebase Services for Blog Operations
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  increment,
  serverTimestamp,
  DocumentSnapshot,
  QueryConstraint
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from '@/config/firebase';

// Types
export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  status: 'draft' | 'published';
  featuredImage?: string;
  readingTime: {
    text: string;
    minutes: number;
  };
  metaDescription?: string;
  authorId: string;
  categoryId: string;
  tagIds: string[];
  viewCount: number;
  likeCount: number;
  shareCount: number;
  isAIGenerated: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'admin' | 'user';
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  totalPosts: number;
  lastLogin:Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  totalPosts: number;
  totalDrafts: number;
  totalPublished: number;
  totalUsers: number;
  totalViews: number;
  totalLikes: number;
  monthlyStats: Array<{
    month: string;
    posts: number;
    views: number;
    likes: number;
  }>;
  topPosts: Array<{
    id: string;
    title: string;
    views: number;
    likes: number;
  }>;
  categoryDistribution: Array<{
    name: string;
    count: number;
  }>;
  tagDistribution: Array<{
    name: string;
    count: number;
  }>;
}

// Posts Service
export class PostsService {
  static async getPosts(
    filters: {
      status?: 'draft' | 'published';
      categoryId?: string;
      authorId?: string;
      limit?: number;
      lastDoc?: DocumentSnapshot;
    } = {}
  ) {
    const constraints: QueryConstraint[] = [];
    
    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }
    if (filters.categoryId) {
      constraints.push(where('categoryId', '==', filters.categoryId));
    }
    if (filters.authorId) {
      constraints.push(where('authorId', '==', filters.authorId));
    }
    
    constraints.push(orderBy('createdAt', 'desc'));
    constraints.push(limit(filters.limit || 10));
    
    if (filters.lastDoc) {
      constraints.push(startAfter(filters.lastDoc));
    }

    const q = query(collection(db, 'posts'), ...constraints);
    const snapshot = await getDocs(q);
    
    return {
      posts: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)),
      lastDoc: snapshot.docs[snapshot.docs.length - 1],
      hasMore: snapshot.docs.length === (filters.limit || 10)
    };
  }

  static async getPostById(id: string): Promise<Post | null> {
    const docSnap = await getDoc(doc(db, 'posts', id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Post : null;
  }

  static async getPostBySlug(slug: string): Promise<Post | null> {
    const q = query(collection(db, 'posts'), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const docSnap = snapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as Post;
  }

  static async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'posts'), {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  static async updatePost(id: string, updates: Partial<Post>): Promise<void> {
    await updateDoc(doc(db, 'posts', id), {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  static async deletePost(id: string): Promise<void> {
    await deleteDoc(doc(db, 'posts', id));
  }

  static async incrementViewCount(id: string): Promise<void> {
    await updateDoc(doc(db, 'posts', id), {
      viewCount: increment(1)
    });
  }

  static async toggleLike(id: string, increment: boolean): Promise<void> {
    await updateDoc(doc(db, 'posts', id), {
      likeCount: increment ? increment(1) : increment(-1)
    });
  }
}

// Categories Service
export class CategoriesService {
  static async getCategories(): Promise<Category[]> {
    const q = query(collection(db, 'categories'), orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
  }

  static async createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'categories'), {
      ...categoryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  static async updateCategory(id: string, updates: Partial<Category>): Promise<void> {
    await updateDoc(doc(db, 'categories', id), {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  static async deleteCategory(id: string): Promise<void> {
    await deleteDoc(doc(db, 'categories', id));
  }
}

// Tags Service
export class TagsService {
  static async getTags(): Promise<Tag[]> {
    const q = query(collection(db, 'tags'), orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tag));
  }

  static async createTag(name: string): Promise<string> {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const docRef = await addDoc(collection(db, 'tags'), {
      name,
      slug,
      postCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  static async updateTag(id: string, updates: Partial<Tag>): Promise<void> {
    await updateDoc(doc(db, 'tags', id), {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  static async deleteTag(id: string): Promise<void> {
    await deleteDoc(doc(db, 'tags', id));
  }
}

// Users Service
// export class UsersService {
//   static async getUsers(limitCount = 20): Promise<BlogUser[]> {
//     const q = query(
//       collection(db, 'users'),
//       orderBy('createdAt', 'desc'),
//       limit(limitCount)
//     );
//     const snapshot = await getDocs(q);
//     return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogUser));
//   }

//   static async getUserById(id: string): Promise<BlogUser | null> {
//     const docSnap = await getDoc(doc(db, 'users', id));
//     return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as BlogUser : null;
//   }

//   static async updateUser(id: string, updates: Partial<BlogUser>): Promise<void> {
//     await updateDoc(doc(db, 'users', id), {
//       ...updates,
//       updatedAt: serverTimestamp()
//     });
//   }

//   static async deleteUser(id: string): Promise<void> {
//     await deleteDoc(doc(db, 'users', id));
//   }
// }

// Storage Service
export class StorageService {
  static async uploadImage(file: File, path: string): Promise<string> {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }

  static async deleteImage(url: string): Promise<void> {
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
  }

  static async uploadUserAvatar(userId: string, file: File): Promise<string> {
    // const path = `users/${userId}/avatar/${Date.now()}-${file.name}`;
    const path = `users/${userId}/avatar/${Date.now()}-${file.name}`;
    console.log("path",path)
    return await this.uploadImage(file, path);
  }

  static async uploadPostImage(postId: string, file: File): Promise<string> {
    const path = `posts/${postId}/images/${Date.now()}-${file.name}`;
    return await this.uploadImage(file, path);
  }
}

// Analytics Service
export class AnalyticsService {
  static async getAnalytics(): Promise<Analytics> {
    // This would typically aggregate data from multiple collections
    // For now, returning mock structure - implement based on your needs
    const analytics: Analytics = {
      totalPosts: 0,
      totalDrafts: 0,
      totalPublished: 0,
      totalUsers: 0,
      totalViews: 0,
      totalLikes: 0,
      monthlyStats: [],
      topPosts: [],
      categoryDistribution: [],
      tagDistribution: []
    };

    // Get total posts
    const postsSnapshot = await getDocs(collection(db, 'posts'));
    analytics.totalPosts = postsSnapshot.size;

    // Get published/draft counts
    const publishedQuery = query(collection(db, 'posts'), where('status', '==', 'published'));
    const publishedSnapshot = await getDocs(publishedQuery);
    analytics.totalPublished = publishedSnapshot.size;
    analytics.totalDrafts = analytics.totalPosts - analytics.totalPublished;

    // Get total users
    const usersSnapshot = await getDocs(collection(db, 'users'));
    analytics.totalUsers = usersSnapshot.size;

    // Calculate total views and likes
    postsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      analytics.totalViews += data.viewCount || 0;
      analytics.totalLikes += data.likeCount || 0;
    });

    return analytics;
  }
}