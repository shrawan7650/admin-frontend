
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
// import { db, storage } from '@/config/firebase';
import { BlogBlock } from '../ai-blog-generator';
import { db } from '@/config/firebase';
// import { BlogBlock } from './ai-blog-generator';

// Types


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
export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  blocks?: BlogBlock[];
  status: 'draft' | 'published';
  featuredImage?: string;
  readingTime: {
    text: string;
    minutes: number;
  };
  metaDescription?: string;
  authorId: string;
  categoryId: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  isAIGenerated: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
// Posts Service
function removeUndefinedFields(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  );
}
export class PostsService {
  static async createPost(postData: any): Promise<string> {
    console.log("postData", postData);

    const cleanPostData = removeUndefinedFields(postData);

    const docRef = await addDoc(collection(db, 'posts'), {
      ...cleanPostData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  }
  
// Firestore PostsService.getPosts
static async getPosts(filters = {}) {
  const { status, categoryId, authorId, limit: limitCount = 10, lastDoc, search } = filters;
  const constraints = [];

  if (status && status !== 'all') {
    constraints.push(where('status', '==', status));
  }

  if (categoryId) {
    constraints.push(where('category', '==', categoryId));
  }

  if (authorId) {
    constraints.push(where('authorId', '==', authorId));
  }

  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  constraints.push(orderBy('createdAt', 'desc'));
  constraints.push(limit(limitCount)); // ✅ Now this uses the Firestore limit() function

  const q = query(collection(db, 'posts'), ...constraints);
  const snap = await getDocs(q);

  const posts = snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Post[];

  return {
    posts,
    lastDoc: snap.docs[snap.docs.length - 1] ?? null,
    hasMore: snap.size === limitCount,
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

  

  static async updatePost(id: string, updates: Partial<Post>): Promise<void> {
    await updateDoc(doc(db, 'posts', id), {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  static async deletePost(id: string): Promise<void> {
    await deleteDoc(doc(db, 'posts', id));
  }

  // static async incrementViewCount(id: string): Promise<void> {
  //   await updateDoc(doc(db, 'posts', id), {
  //     viewCount: increment(1)
  //   });
  // }

  // static async toggleLike(id: string, increment: boolean): Promise<void> {
  //   await updateDoc(doc(db, 'posts', id), {
  //     likeCount: increment ? increment(1) : increment(-1)
  //   });
  // }
}
