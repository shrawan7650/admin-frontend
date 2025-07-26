'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
// import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { BlogEditor } from '@/components/blog/BlogEditor';
import { BlogBlock } from '@/lib/ai-blog-generator';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/redux/hooks';
import { createPost } from '@/redux/slices/postsSlice';

export default  function NewPostPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleSave = async (post: any) => {
    try {
      let finalPost = { ...post };
  
      // Convert blocks to HTML content only if blocks exist
      if (post.blocks && post.blocks.length > 0) {
        const content = post.blocks.map((block: BlogBlock) => {
          switch (block.type) {
            case 'HeadingBlock':
              return `<h${block.content.level}>${block.content.text}</h${block.content.level}>`;
            case 'ParagraphBlock':
              return `<p>${block.content.text}</p>`;
            case 'ListBlock':
              const items = block.content.items.map((item: string) => `<li>${item}</li>`).join('');
              return block.content.ordered ? `<ol>${items}</ol>` : `<ul>${items}</ul>`;
            default:
              return '';
          }
        }).join('\n');
  
        finalPost = { ...finalPost, content };
      }
    console.log("finalPost",finalPost)
      // Save the post
      const newPostId = await dispatch(createPost(finalPost)).unwrap();
      toast.success('Post created successfully!');
      // router.push('/admin/posts');
    } catch (err) {
      console.error('Failed to save post:', err);
      toast.error('Failed to save post.');
    }
  };
  

  return (

      <div className="flex h-screen bg-gradient-to-br from-background via-background/50 to-muted/30 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <BlogEditor onSave={handleSave} />
          </div>
        </main>
      </div>

  );
}