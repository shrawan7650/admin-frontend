"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Mail,
  Calendar,
  Shield,
  FileText,
  Eye,
  Heart,
  Linkedin,
  Github,
  Twitter,
  Globe,
} from "lucide-react";
import { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getUserById } from "@/redux/slices/authSlice";
import { Spinner } from "@/components/ui/spinner";
const formatDate = (date: string | null | undefined) =>
  date ? new Date(date).toLocaleDateString() : "-";

export default function UserDetailPage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  console.log("params", params);
  const {
    selectedUser,
    isLoading,
    user: currentUser,
  } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (params?.id) {
      console.log("fetch single data2");
      dispatch(getUserById(params.id as string));
      console.log("fetch single data2");
    }
  }, [params?.id, dispatch]);
  console.log("selectedUser", selectedUser);
  if (isLoading) return <Spinner />;
  // if (!user) return <p>User not found</p>;

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background/50 to-muted/30 overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/admin/users">
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  User Profile
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  View and manage user details
                </p>
              </div>
            </div>
            {currentUser?.id === selectedUser?.id && (
              <Link href={`/admin/users/${selectedUser?.id}/edit`}>
                <Button className="gap-2 w-full sm:w-auto">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </Link>
            )}
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Left Panel (selectedUser Info & Stats) */}
            <div className="space-y-6">
              {/* selectedUser Info */}
              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="text-center space-y-4">
                    <Avatar className="h-20 w-20 mx-auto">
                      <AvatarImage
                        src={selectedUser?.avatar}
                        alt={selectedUser?.name}
                      />
                      <AvatarFallback className="text-lg">
                        {selectedUser?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h2 className="text-xl font-bold">
                        {selectedUser?.name}
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        {selectedUser?.email}
                      </p>
                    </div>

                    <div className="flex items-center justify-center flex-wrap gap-2 text-xs">
                      <Badge
                        variant={
                          selectedUser?.status === true
                            ? "default"
                            : "secondary"
                        }
                      >
                        {selectedUser?.status === true ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        <Shield className="h-3 w-3 mr-1" />
                        {selectedUser?.role}
                      </Badge>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedUser?.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Joined {formatDate(selectedUser?.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Last login {formatDate(selectedUser?.lastLogin)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Last Update {formatDate(selectedUser?.updatedAt)}
                      </span>
                    </div>
                  </div>

                  {selectedUser?.bio && (
                    <>
                      <Separator className="my-6" />
                      <div>
                        <h3 className="font-medium mb-2">Bio</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedUser?.bio}
                        </p>
                      </div>
                    </>
                  )}
                  {selectedUser?.socialLinks &&
                    Object.keys(selectedUser?.socialLinks).length > 0 && (
                      <>
                        <Separator className="my-6" />
                        <div>
                          <h3 className="font-medium mb-2">Social Links</h3>
                          <div className="flex flex-wrap gap-4">
                            {selectedUser?.socialLinks?.linkedin && (
                              <a
                                href={selectedUser?.socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-sm text-blue-600 hover:underline"
                              >
                                <Linkedin className="h-4 w-4 mr-1" />
                                LinkedIn
                              </a>
                            )}
                            {selectedUser?.socialLinks?.github && (
                              <a
                                href={selectedUser?.socialLinks.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-sm text-gray-600 hover:underline"
                              >
                                <Github className="h-4 w-4 mr-1" />
                                GitHub
                              </a>
                            )}
                            {selectedUser?.socialLinks?.twitter && (
                              <a
                                href={selectedUser?.socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-sm text-sky-500 hover:underline"
                              >
                                <Twitter className="h-4 w-4 mr-1" />
                                Twitter
                              </a>
                            )}
                            {selectedUser?.socialLinks?.website && (
                              <a
                                href={selectedUser?.socialLinks.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-sm text-green-600 hover:underline"
                              >
                                <Globe className="h-4 w-4 mr-1" />
                                Website
                              </a>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                </CardContent>
              </Card>
            </div>

            {/* Right Panel (Recent Posts + Statistics) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Posts */}
              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    Recent Posts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      id: "1",
                      title: "Getting Started with AI",
                      views: 1200,
                      likes: 89,
                      publishedAt: "2024-01-18",
                    },
                    {
                      id: "2",
                      title: "Modern Web Development",
                      views: 890,
                      likes: 67,
                      publishedAt: "2024-01-15",
                    },
                    {
                      id: "3",
                      title: "Design Systems Guide",
                      views: 2100,
                      likes: 156,
                      publishedAt: "2024-01-12",
                    },
                  ].length > 0 ? (
                    [
                      {
                        id: "1",
                        title: "Getting Started with AI",
                        views: 1200,
                        likes: 89,
                        publishedAt: "2024-01-18",
                      },
                      {
                        id: "2",
                        title: "Modern Web Development",
                        views: 890,
                        likes: 67,
                        publishedAt: "2024-01-15",
                      },
                      {
                        id: "3",
                        title: "Design Systems Guide",
                        views: 2100,
                        likes: 156,
                        publishedAt: "2024-01-12",
                      },
                    ].map((post) => (
                      <div
                        key={post.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors"
                      >
                        <div className="space-y-1 flex-1 min-w-0">
                          <h3 className="font-medium text-sm sm:text-base truncate">
                            {post.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {post.views.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {post.likes}
                            </span>
                            <span>
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {currentUser?.id === selectedUser?.id && (
                            <Link href={`/admin/posts/${post.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}

                          <Link href={`/admin/posts/${post.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No recent posts found.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Posts", value: 0 },
                      { label: "Views", value: 0 },
                      { label: "Likes", value: 0 },
                      { label: "Comments", value: 0 },
                    ].map((stat, idx) => (
                      <div key={idx} className="text-center space-y-1">
                        <div className="text-xl font-bold">
                          {typeof stat.value === "number"
                            ? stat.value.toLocaleString()
                            : stat.value}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
