'use client';

import React from 'react';
import { useEffect } from 'react';
import { FileText, Eye, Heart, Brain, TrendingUp, Users, Calendar } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
// import { fetchDashboardStats } from '@/redux/slices/analyticsSlice';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardCharts } from '@/components/charts/DashboardCharts';


export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  // const { dashboardStats, isLoading, error } = useAppSelector((state) => state.analytics);
 const isLoading = false;
 const error = null;

  // useEffect(() => {
  //   dispatch(fetchDashboardStats());
  // }, [dispatch]);

  // const stats = dashboardStats ? [
  //   {
  //     title: 'Total Posts',
  //     value: dashboardStats.totalPosts.toString(),
  //     change: dashboardStats.postsChange,
  //     changeType: 'positive' as const,
  //     icon: FileText,
  //     description: 'Published posts'
  //   },
  //   {
  //     title: 'Page Views',
  //     value: dashboardStats.totalViews.toLocaleString(),
  //     change: dashboardStats.viewsChange,
  //     changeType: 'positive' as const,
  //     icon: Eye,
  //     description: 'Last 30 days'
  //   },
  //   {
  //     title: 'Total Likes',
  //     value: dashboardStats.totalLikes.toLocaleString(),
  //     change: dashboardStats.likesChange,
  //     changeType: 'positive' as const,
  //     icon: Heart,
  //     description: 'All time likes'
  //   },
  //   {
  //     title: 'Active Users',
  //     value: dashboardStats.activeUsers.toString(),
  //     change: dashboardStats.usersChange,
  //     changeType: 'positive' as const,
  //     icon: Users,
  //     description: 'Monthly active'
  //   }
  // ] : [];
  const stats = [
    {
      title: 'Total Posts',
      value: '128',
      change: '+12%',
      changeType: 'positive' as const,
      icon: FileText,
      description: 'Published posts'
    },
    {
      title: 'Page Views',
      value: '45,678',
      change: '+8.5%',
      changeType: 'positive' as const,
      icon: Eye,
      description: 'Last 30 days'
    },
    {
      title: 'Total Likes',
      value: '3,215',
      change: '+5%',
      changeType: 'positive' as const,
      icon: Heart,
      description: 'All time likes'
    },
    {
      title: 'Active Users',
      value: '932',
      change: '+3.2%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'Monthly active'
    }
  ];
  

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-background via-background/50 to-muted/30 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-48 mb-2"></div>
              <div className="h-4 bg-muted rounded w-96"></div>
            </div>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-background via-background/50 to-muted/30 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            <div className="text-center py-12">
              <div className="text-destructive text-lg font-medium">Error loading dashboard</div>
              <div className="text-muted-foreground">{error}</div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background/50 to-muted/30 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:ml-0 ml-0">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Welcome back! Here's what's happening with your blog.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  {stats.length === 0 ? (
    <div className="col-span-full text-center py-8">
      <div className="text-muted-foreground">No statistics available</div>
    </div>
  ) : (
    stats.map((stat) => (
      <Card key={stat.title} className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
            {stat.title}
          </CardTitle>
          <stat.icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <span
              className={`font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stat.change}
            </span>
            <span>{stat.description}</span>
          </div>
        </CardContent>
      </Card>
    ))
  )}
</div>


            {/* Quick Actions */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-200 cursor-pointer group">
                <CardHeader className="text-center space-y-4 px-4 sm:px-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg">Write New Post</CardTitle>
                    <CardDescription className="text-sm">Create a new blog post from scratch</CardDescription>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-200 cursor-pointer group">
                <CardHeader className="text-center space-y-4 px-4 sm:px-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                    <Brain className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg">AI Generate</CardTitle>
                    <CardDescription className="text-sm">Let AI write a blog post for you</CardDescription>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-200 cursor-pointer group">
                <CardHeader className="text-center space-y-4 px-4 sm:px-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <TrendingUp className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg">View Analytics</CardTitle>
                    <CardDescription className="text-sm">See detailed performance metrics</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 order-2 lg:order-1">
                <DashboardCharts />
              </div>

              <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
                {/* Recent Posts */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Recent Posts</CardTitle>
                    <CardDescription className="text-sm">Your latest published content</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    {[
                      { title: 'Getting Started with AI', views: '1.2K', date: '2 days ago' },
                      { title: 'Modern Web Development', views: '890', date: '4 days ago' },
                      { title: 'Design Systems Guide', views: '2.1K', date: '1 week ago' },
                      { title: 'TypeScript Best Practices', views: '1.5K', date: '1 week ago' }
                    ].map((post, index) => (
                      <div key={index} className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors">
                        <div className="space-y-1">
                          <p className="text-xs sm:text-sm font-medium leading-none truncate">{post.title}</p>
                          <p className="text-xs text-muted-foreground">{post.views} views • {post.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* System Status */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">System Status</CardTitle>
                    <CardDescription className="text-sm">Current system health</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    {[
                      { service: 'API Server', status: 'operational', uptime: '99.9%' },
                      { service: 'Database', status: 'operational', uptime: '99.8%' },
                      { service: 'AI Service', status: 'operational', uptime: '98.5%' },
                      { service: 'CDN', status: 'operational', uptime: '99.9%' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs sm:text-sm">{item.service}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{item.uptime}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}