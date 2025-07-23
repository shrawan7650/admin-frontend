'use client';

import React from 'react';
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
  Cell
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const monthlyData = [
  { month: 'Jan', posts: 12, views: 4500, likes: 240 },
  { month: 'Feb', posts: 19, views: 5200, likes: 380 },
  { month: 'Mar', posts: 15, views: 4800, likes: 290 },
  { month: 'Apr', posts: 22, views: 6100, likes: 450 },
  { month: 'May', posts: 28, views: 7200, likes: 520 },
  { month: 'Jun', posts: 25, views: 6800, likes: 480 },
];

const categoryData = [
  { name: 'Technology', value: 35, color: '#8884d8' },
  { name: 'AI/ML', value: 25, color: '#82ca9d' },
  { name: 'Web Dev', value: 20, color: '#ffc658' },
  { name: 'Design', value: 15, color: '#ff7300' },
  { name: 'Other', value: 5, color: '#00ff7f' },
];

const aiVsManualData = [
  { month: 'Jan', ai: 8, manual: 4 },
  { month: 'Feb', ai: 12, manual: 7 },
  { month: 'Mar', ai: 10, manual: 5 },
  { month: 'Apr', ai: 15, manual: 7 },
  { month: 'May', ai: 18, manual: 10 },
  { month: 'Jun', ai: 16, manual: 9 },
];

export function DashboardCharts() {
  return (
    <div className="grid gap-4 sm:gap-6">
      {/* Monthly Posts Trend */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Monthly Posts & Engagement</CardTitle>
          <CardDescription className="text-sm">Track your blog publishing activity and reader engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
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
              <Line type="monotone" dataKey="posts" stroke="#8884d8" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="views" stroke="#82ca9d" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="likes" stroke="#ffc658" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* AI vs Manual Posts */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">AI vs Manual Posts</CardTitle>
            <CardDescription className="text-sm">Comparison of AI-generated and manually written content</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={aiVsManualData}>
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
                <Bar dataKey="ai" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="manual" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Category Distribution</CardTitle>
            <CardDescription className="text-sm">Breakdown of posts by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}