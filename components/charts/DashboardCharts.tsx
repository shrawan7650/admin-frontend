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
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
const monthlyData = [
  { month: 'Jan', posts: 12, views: 4500, likes: 240 },
  { month: 'Feb', posts: 19, views: 5200, likes: 380 },
  { month: 'Mar', posts: 15, views: 4800, likes: 290 },
  { month: 'Apr', posts: 22, views: 6100, likes: 450 },
  { month: 'May', posts: 28, views: 7200, likes: 520 },
  { month: 'Jun', posts: 25, views: 6800, likes: 480 },
];


function getCurrentWeekRange() {
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(today, { weekStartsOn: 1 });     // Sunday
  return { start, end };
}
function getWeekDays() {
  const { start, end } = getCurrentWeekRange();
  return eachDayOfInterval({ start, end }).map((date) => ({
    date,
    label: format(date, "EEE"), // e.g. "Mon", "Tue"
  }));
}

export function DashboardCharts({analytics}: { analytics: any }) {

  const categoryColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff7f', '#00bcd4', '#ff69b4'];

const categoryData = (analytics?.categoryDistribution || []).map((item, index) => ({
  name: item.name,
  value: item.count, // map `count` to `value`
  color: categoryColors[index % categoryColors.length],
}));
  // Fix here

  const weekDays = getWeekDays();
  const dailyActivity = analytics?.dailyActivity || [];

  // Normalize day names from backend to match getWeekDays format
  const normalizedDailyActivity = dailyActivity.map((item) => ({
    ...item,
    day: item.day.slice(0, 3), // Make sure it's like "Mon", "Tue" etc
  }));

  const aiVsManualData = weekDays.map(({ label, date }) => {
    const backendEntry = normalizedDailyActivity.find((item) => item.day === label);
    return {
      day: label,
      date: format(date, "dd MMM"),
      ai: backendEntry?.ai || 0,
      manual: backendEntry?.manual || 0,
    };
  });

  const aiCount = aiVsManualData.reduce((sum, d) => sum + d.ai, 0);
  const manualCount = aiVsManualData.reduce((sum, d) => sum + d.manual, 0);
  const avgAi = (aiCount / aiVsManualData.length).toFixed(1);
  const avgManual = (manualCount / aiVsManualData.length).toFixed(1);

  const { start, end } = getCurrentWeekRange();
  const formattedRange = `${format(start, "dd MMM")} – ${format(end, "dd MMM")}`;
  
const monthlyData = analytics?.monthlyStats?.map((item, index) => ({
  month: item.month || `Month ${index + 1}`, // fallback if month is missing
  views: item.views || 0,
  likes: item.likes || 0,
  posts: item.posts || 0,
})) || [];
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
    <CardDescription className="text-sm">
      Weekly summary: <span className="font-medium">{formattedRange}</span>
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
      <div className="flex flex-col items-center">
        <span className="text-foreground text-lg font-semibold">{aiCount}</span>
        <span>Total AI Posts</span>
        <span className="text-xs">(Avg: {avgAi}/day)</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-foreground text-lg font-semibold">{manualCount}</span>
        <span>Total Manual Posts</span>
        <span className="text-xs">(Avg: {avgManual}/day)</span>
      </div>
    </div>

    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={aiVsManualData}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
        <XAxis dataKey="day" className="text-muted-foreground" />
        <YAxis className="text-muted-foreground" />
        <Tooltip
          labelFormatter={(label: string, payload: any) => {
            const date = aiVsManualData.find(d => d.day === label)?.date;
            return `${label} (${date})`;
          }}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Bar dataKey="ai" fill="#8884d8" radius={[4, 4, 0, 0]} name="AI Posts" />
        <Bar dataKey="manual" fill="#82ca9d" radius={[4, 4, 0, 0]} name="Manual Posts" />
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
                    // backgroundColor: 'hsl(var(--card))', 
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