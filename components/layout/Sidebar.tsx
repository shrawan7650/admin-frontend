'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Plus, 
  Settings, 
  LogOut,
  Brain,
  TrendingUp,
  Users,
  Menu,
  X
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { toggleMobileSidebar, setMobileSidebarOpen } from '@/redux/slices/uiSlice';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ui/theme-toggle';

import { useRouter } from "next/navigation";
import { deleteCookie } from 'cookies-next';
import toast from 'react-hot-toast';
import { logoutUser } from '@/redux/slices/authSlice';
const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'All Posts', href: '/admin/posts', icon: FileText },
  { name: 'New Post', href: '/admin/posts/new', icon: Plus },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  // const { user, logout } = useAuth();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { isMobileSidebarOpen } = useAppSelector((state) => state.ui);
  // console.log("user",user)
  const handleLogout = async () => {
    try {
      // 1. Call logoutUser thunk (which calls Firebase signOut)
      await dispatch(logoutUser()).unwrap();
  
      // 2. Delete the auth token cookie
      deleteCookie('token');
  
      // 3. Redirect to login
      router.push('/login');
  
      // 4. Notify
      toast.success('Logged out successfully!');
    } catch (error: any) {
      console.error('Logout failed:', error);
      toast.error(error.message || 'Logout failed');
    }
  };
  

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch(toggleMobileSidebar())}
          className="bg-card/80 backdrop-blur-sm border-border/50"
        >
          {isMobileSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => dispatch(setMobileSidebarOpen(false))}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        flex h-full flex-col bg-card/50 backdrop-blur-xl border-r border-border/50
      `}>
        {/* Header */}
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Brain className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
            <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              AI Blog CMS
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-3 sm:p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => dispatch(setMobileSidebarOpen(false))}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-border/50 p-3 sm:p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.name?.charAt(0) || ''}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            {/* <div className="flex-shrink-0">
              <ThemeToggle />
            </div> */}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full gap-2 border-border/50 duration-200"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}