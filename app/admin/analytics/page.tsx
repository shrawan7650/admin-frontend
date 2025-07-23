'use client';

import React, { useState } from 'react';
import { Calendar, TrendingUp, Users, Eye, Heart, FileText, Brain, Download } from 'lucide-react';

import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { exportToCSV, formatAnalyticsData } from '@/utils/export';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

// Mock data
const monthlyData = [
  { month: 'Jan', posts: 12, views: 4500, likes: 240, users: 120 },
  { month: 'Feb', posts: 19, views: 5200, likes: 380, users: 145 },
  { month: 'Mar', posts: 15, views: 4800, likes: 290, users: 132 },
  { month: 'Apr', posts: 22, views: 6100, likes: 450, users: 178 },
  { month: 'May', posts: 28, views: 7200, likes: 520, users: 195 },
  { month: 'Jun', posts: 25, views: 6800, likes: 480, users: 210 },
];

const categoryData = [
  { name: 'Technology', value: 35, color: '#8884d8' },
  { name: 'AI/ML', value: 25, color: '#82ca9d' },
  { name: 'Web Dev', value: 20, color: '#ffc658' },
  { name: 'Design', value: 15, color: '#ff7300' },
  { name: 'Other', value: 5, color: '#00ff7f' },
];

const dailyData = [
  { day: 'Mon', views: 1200, likes: 89 },
  { day: 'Tue', views: 1400, likes: 102 },
  { day: 'Wed', views: 1100, likes: 78 },
  { day: 'Thu', views: 1600, likes: 124 },
  { day: 'Fri', views: 1800, likes: 145 },
  { day: 'Sat', views: 2200, likes: 178 },
  { day: 'Sun', views: 1900, likes: 156 },
];

const topPosts = [
  { title: 'Getting Started with AI', views: 3421, likes: 234, category: 'AI/ML' },
  { title: 'Modern CSS Techniques', views: 2456, likes: 156, category: 'Web Dev' },
  { title: 'React Best Practices', views: 2234, likes: 189, category: 'Technology' },
  { title: 'Design Systems Guide', views: 1987, likes: 145, category: 'Design' },
  { title: 'TypeScript Tips', views: 1654, likes: 123, category: 'Web Dev' },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6months');

  const handleExport = () => {
    try {
      const data = formatAnalyticsData(timeRange);
      const exportData = data.map(item => ({
        Date: item.date,
        'Total Posts': item.posts,
        'Page Views': item.views,
        'Total Likes': item.likes,
        'Active Users': item.users,
        'Engagement Rate': ((item.likes / item.views) * 100).toFixed(2) + '%'
      }));
      
      const filename = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}`;
      exportToCSV(exportData, filename);
      toast.success('Analytics data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
      console.error('Export error:', error);
    }
  };

  const stats = [
    {
      title: 'Total Views',
      value: '45.2K',
      change: '+18%',
      changeType: 'positive' as const,
      icon: Eye,
      description: 'Last 30 days'
    },
    {
      title: 'Total Likes',
      value: '2.4K',
      change: '+8%',
      changeType: 'positive' as const,
      icon: Heart,
      description: 'All time likes'
    },
    {
      title: 'Total Posts',
      value: '124',
      change: '+12%',
      changeType: 'positive' as const,
      icon: FileText,
      description: '8 published this month'
    },
    {
      title: 'Active Users',
      value: '1.2K',
      change: '+15%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'Monthly active users'
    }
  ];

  return (
  
      <div className="flex h-screen bg-gradient-to-br from-background via-background/50 to-muted/30 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Detailed insights into your blog performance
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">7 Days</SelectItem>
                    <SelectItem value="30days">30 Days</SelectItem>
                    <SelectItem value="3months">3 Months</SelectItem>
                    <SelectItem value="6months">6 Months</SelectItem>
                    <SelectItem value="1year">1 Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2" onClick={handleExport}>
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
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
                      <span className={`font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span>{stat.description}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              {/* Monthly Trends */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Monthly Trends</CardTitle>
                  <CardDescription className="text-sm">Posts, views, and engagement over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                      <XAxis dataKey="month" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Area type="monotone" dataKey="views" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="likes" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Daily Activity */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Daily Activity</CardTitle>
                  <CardDescription className="text-sm">Views and likes by day of week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                      <XAxis dataKey="day" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="views" fill="#8884d8" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="likes" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
              {/* Category Distribution */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Category Distribution</CardTitle>
                  <CardDescription className="text-sm">Posts by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-1 gap-2 mt-4">
                    {categoryData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Posts */}
              <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Top Performing Posts</CardTitle>
                  <CardDescription className="text-sm">Most viewed and liked content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPosts.map((post, index) => (
                      <div key={index} className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors">
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                            <h3 className="font-medium text-sm sm:text-base leading-tight">{post.title}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {post.views.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {post.likes}
                            </span>
                            <Badge variant="outline" className="text-xs">{post.category}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

  );
}