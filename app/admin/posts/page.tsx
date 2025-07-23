'use client';

import React, { useState } from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, Edit, Trash2, Eye, Brain, Calendar, Tag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
// import { fetchPosts, deletePost, setSearchTerm, setFilter } from '@/redux/slices/postSlice';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import toast from 'react-hot-toast';


export default function PostsPage() {
  const dispatch = useAppDispatch();
  // const { posts, isLoading, error, searchTerm, filter } = useAppSelector((state) => state.posts);
  const router = useRouter(); 
  const isLoading = false;
  const error = null;
  const searchTerm = '';
  const filter = 'all'; // could be 'published', 'draft', etc.
  const posts = [
    {
      id: '1',
      title: 'Understanding React Server Components',
      author: 'Jane Doe',
      date: '2025-07-19',
      status: 'published',
      views: 1023,
      likes: 234,
      tags: ['react', 'server', 'components'],
      aiGenerated: false,
    },
    {
      id: '2',
      title: 'Next.js App Router Guide',
      author: 'John Smith',
      date: '2025-07-15',
      status: 'draft',
      views: 321,
      likes: 45,
      tags: ['nextjs', 'routing'],
      aiGenerated: false,
    },
    {
      id: '3',
      title: 'Deploying on Vercel with CI/CD',
      author: 'Alice Lee',
      date: '2025-07-10',
      status: 'published',
      views: 876,
      likes: 112,
      tags: ['vercel', 'deployment', 'ci/cd'],
      aiGenerated: true,
    },
  ];
  
  const filteredPosts = posts.filter(post => {
    const status = post.published ? 'published' : 'draft';
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'published') return matchesSearch && status === 'published';
    if (filter === 'draft') return matchesSearch && status === 'draft';
    if (filter === 'ai') return matchesSearch && post.aiGenerated;
    
    return matchesSearch;
  });

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background/50 to-muted/30 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">All Posts</h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Manage and organize your blog content
                </p>
              </div>
              <Link href="/admin/posts/new">
                <Button className="gap-2 w-full sm:w-auto">
                  <Plus className="h-4 w-4" />
                  New Post
                </Button>
              </Link>
            </div>

            {/* Filters and Search */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                      className="pl-10 text-sm sm:text-base"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                    {['all', 'published', 'draft', 'ai'].map((filterType) => (
                      <Button
                        key={filterType}
                        variant={filter === filterType ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => dispatch(setFilter(filterType))}
                        className="capitalize whitespace-nowrap text-xs sm:text-sm"
                      >
                        {filterType === 'ai' ? 'AI Generated' : filterType}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {isLoading && (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {error && (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-center text-destructive">
                    <div className="font-medium">Error loading posts</div>
                    <div className="text-sm">{error}</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts Table */}
            {!isLoading && !error && (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  Posts ({filteredPosts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Mobile view */}
                <div className="block sm:hidden space-y-4">
                  {filteredPosts.map((post) => (
                    <Card key={post.id} className="border-border/50">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-medium text-sm leading-tight">{post.title}</h3>
                                {post.aiGenerated && (
                                  <Badge variant="outline" className="text-purple-500 border-purple-500 text-xs">
                                    <Brain className="h-3 w-3 mr-1" />
                                    AI
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">/{post.slug}</p>
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditPost(post.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeletePost(post.id, post.title)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <Badge variant={post.published ? 'default' : 'secondary'} className="text-xs">
                                {post.published ? 'published' : 'draft'}
                              </Badge>
                              <Badge variant="outline" className="text-xs">{post.category}</Badge>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {post.views.toLocaleString()}
                              </span>
                              {post.publishedAt && (
                                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {post.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{post.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Desktop table view */}
                <div className="hidden sm:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Stats</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPosts.map((post) => (
                        <TableRow key={post.id} className="hover:bg-accent/50">
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{post.title}</span>
                                {post.aiGenerated && (
                                  <Badge variant="outline" className="text-purple-500 border-purple-500">
                                    <Brain className="h-3 w-3 mr-1" />
                                    AI
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>/{post.slug}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {post.tags.slice(0, 3).map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {post.tags.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{post.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={post.published ? 'default' : 'secondary'}>
                              {post.published ? 'published' : 'draft'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{post.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {post.views.toLocaleString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {post.likes.toLocaleString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              {post.publishedAt ? (
                                <>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(post.publishedAt).toLocaleDateString()}
                                  </div>
                                  <span className="text-muted-foreground">Published</span>
                                </>
                              ) : (
                                <span className="text-muted-foreground">Draft</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditPost(post.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeletePost(post.id, post.title)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              {post.status === 'published' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                onClick={() => handleViewPost(post.id)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredPosts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="space-y-4">
                      <div className="mx-auto w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                        <Search className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-medium">No posts found</h3>
                        <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            )}
          </div>
        </main>
      </div>
  );
}