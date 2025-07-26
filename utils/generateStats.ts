import { Eye, Heart, FileText, Users } from 'lucide-react';

interface AnalyticsData {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalActiveUsers: number;
  monthlyStats: {
    month: string; // e.g., "2025-07"
    posts: number;
    views: number;
    likes: number;
  }[];
}

const getPercentageChange = (current: number, previous: number) => {
  if (previous === 0) return '+100%';
  const change = ((current - previous) / previous) * 100;
  const rounded = change.toFixed(0);
  return `${change >= 0 ? '+' : ''}${rounded}%`;
};

export const generateStats = (analytics: AnalyticsData) => {
  const currentMonth = analytics?.monthlyStats[analytics.monthlyStats.length - 1];
  const prevMonth = analytics?.monthlyStats[analytics.monthlyStats.length - 2];

  const postChange = getPercentageChange(currentMonth?.posts ?? 0, prevMonth?.posts ?? 0);
  const viewsChange = getPercentageChange(currentMonth?.views ?? 0, prevMonth?.views ?? 0);
  const likesChange = getPercentageChange(currentMonth?.likes ?? 0, prevMonth?.likes ?? 0);
  const activeUsersChange = getPercentageChange(analytics?.totalActiveUsers ?? 0, 0);

  return [
    {
      title: 'Total Views',
      value: analytics?.totalViews,
      change: viewsChange,
      changeType: parseFloat(viewsChange) >= 0 ? 'positive' : 'negative' as const,
      icon: Eye,
      description: 'Compared to last month',
    },
    {
      title: 'Total Likes',
      value: analytics?.totalLikes,
      change: likesChange,
      changeType: parseFloat(likesChange) >= 0 ? 'positive' : 'negative' as const,
      icon: Heart,
      description: 'Compared to last month',
    },
    {
      title: 'Total Posts',
      value: analytics?.totalPosts,
      change: postChange,
      changeType: parseFloat(postChange) >= 0 ? 'positive' : 'negative' as const,
      icon: FileText,
      description: `${currentMonth?.posts ?? 0} published this month`,
    },
    {
      title: 'Active Users',
      value: analytics?.totalActiveUsers,
      change: activeUsersChange,
      changeType: 'positive' as const,
      icon: Users,
      description: 'Monthly active users',
    },
  ];
};
