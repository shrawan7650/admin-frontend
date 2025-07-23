'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
// import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { BlogEditor } from '@/components/blog/BlogEditor';
import { BlogBlock } from '@/lib/ai-blog-generator';
import toast from 'react-hot-toast';

export default function NewPostPage() {
  const router = useRouter();

  const handleSave = (post: any) => {
    // Mock save functionality
    console.log('Saving post:', post);
    
    // Convert blocks to content if using block editor
    if (post.blocks && post.blocks.length > 0) {
      const content = post.blocks.map((block: BlogBlock) => {
        switch (block.type) {
          case 'HeadingBlock':
            return `<h${block.content.level}>${block.content.text}</h${block.content.level}>`;
          case 'ParagraphBlock':
            return `<p>${block.content.text}</p>`;
          case 'ListBlock':
            const listItems = block.content.items.map(item => `<li>${item}</li>`).join('');
            return block.content.ordered ? `<ol>${listItems}</ol>` : `<ul>${listItems}</ul>`;
          default:
            return '';
        }
      }).join('\n');
      
      post.content = content;
    }
    
    toast.success('Post saved successfully!');
    router.push('/admin/posts');
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