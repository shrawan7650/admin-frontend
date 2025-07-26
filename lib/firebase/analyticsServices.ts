


import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { startOfMonth, format } from 'date-fns';
import { db } from '@/config/firebase';
import { BlogPost } from '../ai-blog-generator';




export interface Analytics {
  totalPosts: number;
  totalDrafts: number;
  totalPublished: number;
  totalUsers: number;
  activeUsers: number;
  totalViews: number;
  totalLikes: number;
  monthlyStats: Array<{
    month: string;
    posts: number;
    views: number;
    likes: number;
    aiPosts: number;
    manualPosts: number;
  }>;
  topPosts: Array<{
    id: string;
    title: string;
    views: number;
    likes: number;
    category: string;
    createdAt: string;
  }>;
  recentPosts: Array<{
    id: string;
    title: string;
    createdAt: string;
    status: string;
  }>;
  categoryDistribution: Array<{
    name: string;
    count: number;
  }>;
  dailyActivity: Array<{
    day: string; // Mon–Sun
    views: number;
    likes: number;
  }>;
}


export class AnalyticsService {
  static async getAnalytics() {
    const analytics = {
      totalPosts: 0,
      totalViews: 0,
      totalLikes: 0,
      totalDrafts: 0,
      totalActiveUsers: 0,
      totalPublished: 0,
      aiManualDistribution: [] as { type: string; count: number }[],
      draftPublishedDistribution: [] as { type: string; count: number }[],
      monthlyStats: [] as {
        month: string;
        posts: number;
        views: number;
        likes: number;
      }[],
      dailyActivity: [] as {
        day: string;
        posts: number;
        views: number;
        likes: number;
        aiPosts: number;
        manualPosts: number;
        drafts: number;
        published: number;
      }[],
      categoryDistribution: [] as { name: string; count: number }[],
      topPosts: [] as BlogPost[],
      recentPosts: [] as BlogPost[],
    };

    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map((doc) => ({
      ...(doc.data() as BlogPost),
      id: doc.id,
    }));

    const usersSnapshot = await getDocs(collection(db, "users"));
    const users = usersSnapshot.docs.map(doc => doc.data());

    analytics.totalPosts = posts.length;
    analytics.totalViews = posts.reduce((sum, post) => sum + (post.viewCount || 0), 0);
    analytics.totalLikes = posts.reduce((sum, post) => sum + (post.likeCount || 0), 0);
    analytics.totalDrafts = posts.filter((p) => p.status === "draft").length;
    analytics.totalPublished = posts.filter((p) => p.status === "published").length;

    // 1. AI vs Manual Distribution
   // Step 1: Filter posts from last 7 days
const today = new Date();
const past7Days = new Date();
past7Days.setDate(today.getDate() - 6);
past7Days.setHours(0, 0, 0, 0);
today.setHours(23, 59, 59, 999);

const filteredPosts = posts.filter((p) => {
  const createdAt = p.createdAt?.toDate?.(); // Firestore timestamp
  return createdAt && createdAt >= past7Days && createdAt <= today;
});

// Step 2: Count AI vs Manual in that 7-day range
const aiCount = filteredPosts.filter((p) => p.isAIGenerated).length;
const manualCount = filteredPosts.length - aiCount;

analytics.aiManualDistribution = [
  { type: "AI Generated", count: aiCount },
  { type: "Manual", count: manualCount },
];
    // 2. Draft vs Published Distribution
    analytics.draftPublishedDistribution = [
      { type: "Draft", count: analytics.totalDrafts },
      { type: "Published", count: analytics.totalPublished },
    ];

    // 3. Monthly Stats
    const monthMap = new Map<string, { posts: number; views: number; likes: number }>();
    posts.forEach((post) => {
      const date = post.createdAt?.toDate?.() || new Date();
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!monthMap.has(key)) {
        monthMap.set(key, { posts: 0, views: 0, likes: 0 });
      }
      const data = monthMap.get(key)!;
      data.posts += 1;
      data.views += post.viewCount || 0;
      data.likes += post.likeCount || 0;
    });
    analytics.monthlyStats = Array.from(monthMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, data]) => ({ month, ...data }));

    // 4. Daily Activity
    const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dailyMap = new Map<string, any>();
    posts.forEach((post) => {
      const date = post.createdAt?.toDate?.() || new Date();
      const day = dayMap[date.getDay()];
      if (!dailyMap.has(day)) {
        dailyMap.set(day, {
          day,
          posts: 0,
          views: 0,
          likes: 0,
          aiPosts: 0,
          manualPosts: 0,
          drafts: 0,
          published: 0,
        });
      }
      const d = dailyMap.get(day)!;
      d.posts += 1;
      d.views += post.viewCount || 0;
      d.likes += post.likeCount || 0;
      d.aiPosts += post.isAIGenerated ? 1 : 0;
      d.manualPosts += post.isAIGenerated ? 0 : 1;
      d.drafts += post.status === "draft" ? 1 : 0;
      d.published += post.status === "published" ? 1 : 0;
    });
    analytics.dailyActivity = Array.from(dailyMap.values());

    // 5. Category Distribution
    const categorySnap = await getDocs(collection(db, "categories"));
    const categoryMap = new Map<string, string>();
    categorySnap.forEach((doc) => {
      categoryMap.set(doc.id, doc.data().name || "Unknown");
    });
    const catMap = new Map<string, number>();
    posts.forEach((post) => {
      const catId = post.categoryId || "unknown";
      const catName = categoryMap.get(catId) || "Other";
      catMap.set(catName, (catMap.get(catName) || 0) + 1);
    });
    analytics.categoryDistribution = Array.from(catMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));

    // 6. Top Posts
    analytics.topPosts = [...posts]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 5);

    // 7. Recent Posts
    analytics.recentPosts = posts.slice(0, 5);

    // 8. Active Users (Last 7 Days)
    const activeUsers = users.filter(user => {
      const last = new Date(user.lastLogin || user.lastActive || new Date(0));
      const now = new Date();
      const diffInDays = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
      return diffInDays <= 7;
    });
    analytics.totalActiveUsers = activeUsers.length;

    return analytics;
  }
}
