"use client";

import React, { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchPostById } from "@/redux/slices/postsSlice";
import { fetchCategories } from "@/redux/slices/categoriesSlice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SinglePostPage() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const post = useAppSelector((state) => state.posts.currentPost);
  const categories = useAppSelector((state) => state.categories.items);

  useEffect(() => {
    if (id && typeof id === "string") {
      dispatch(fetchPostById(id));
      dispatch(fetchCategories());
    }
  }, [dispatch, id]);

  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat) => {
      map[cat.id] = cat.name;
    });
    return map;
  }, [categories]);

  if (!post) return <div className="p-6">Loading post...</div>;

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <Card className="shadow-xl rounded-2xl p-6 space-y-4">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              {post.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={post.published ? "default" : "secondary"}>
                {post.published ? "Published" : "Draft"}
              </Badge>

              <Badge variant="outline" className="text-sm">
                {categoryMap[post.categoryId] || "Uncategorized"}
              </Badge>

              <Badge variant="secondary">Views: {post.viewCount || 0}</Badge>
              <Badge variant="secondary">Likes: {post.likeCount || 0}</Badge>

              {post.publishedAt && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.publishedAt).toLocaleDateString()}
                </span>
              )}
            </div>

            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content || "<p>No content available.</p>" }}
            />

            <div className="flex flex-wrap gap-2 pt-4">
              {(post.tags || []).map((tag, index) => (
                <Badge key={index} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
