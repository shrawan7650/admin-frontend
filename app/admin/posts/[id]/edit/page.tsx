'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Sidebar } from '@/components/layout/Sidebar';
import { BlogEditor } from '@/components/blog/BlogEditor';
import { BlogBlock } from '@/lib/ai-blog-generator';
import toast from 'react-hot-toast';

// Mock post data
const getPostData = (id: string) => ({
  id,
  title: 'Getting Started with AI in Web Development',
  slug: 'getting-started-ai-web-dev',
  content: `
    <h1>Getting Started with AI in Web Development</h1>
    <p>This is a comprehensive guide to integrating AI into your web development workflow.</p>
    <h2>Introduction</h2>
    <p>Artificial Intelligence is revolutionizing how we build and interact with web applications...</p>
  `,
  blocks: [
    {
      id: 'block-1',
      type: 'HeadingBlock' as const,
      content: { text: 'Getting Started with AI in Web Development', level: 1 },
      order: 0
    },
    {
      id: 'block-2',
      type: 'ParagraphBlock' as const,
      content: { text: 'This is a comprehensive guide to integrating AI into your web development workflow.' },
      order: 1
    },
    {
      id: 'block-3',
      type: 'HeadingBlock' as const,
      content: { text: 'Introduction', level: 2 },
      order: 2
    },
    {
      id: 'block-4',
      type: 'ParagraphBlock' as const,
      content: { text: 'Artificial Intelligence is revolutionizing how we build and interact with web applications...' },
      order: 3
    }
  ] as BlogBlock[],
  excerpt: 'Learn how to integrate AI into your web development workflow with this comprehensive guide.',
  category: 'AI/ML',
  tags: ['AI', 'Web Development', 'Tutorial'],
  thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
  published: true,
  aiGenerated: true,
  readingTime: { text: '5 min read', minutes: 5 }
});

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const post = getPostData(params.id as string);

  const handleSave = (updatedPost: any) => {
    // Mock save functionality
    console.log('Saving updated post:', updatedPost);
    
    // Convert blocks to content if using block editor
    if (updatedPost.blocks && updatedPost.blocks.length > 0) {
      const content = updatedPost.blocks.map((block: BlogBlock) => {
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
      
      updatedPost.content = content;
    }
    
    toast.success('Post updated successfully!');
    router.push('/admin/posts');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this post?')) {
      // Mock delete functionality
      console.log('Deleting post:', params.id);
      toast.success('Post deleted successfully!');
      router.push('/admin/posts');
    }
  };

  return (

      <div className="flex h-screen bg-gradient-to-br from-background via-background/50 to-muted/30 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <BlogEditor 
              initialPost={post} 
              onSave={handleSave}
              onDelete={handleDelete}
              isEditing={true}
            />
          </div>
        </main>
      </div>
 
  );
}