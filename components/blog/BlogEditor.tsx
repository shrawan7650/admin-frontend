
'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Heading1, 
  Heading2,
  Eye,
  EyeOff,
  Brain,
  Save, 
  Wand2,
  Upload, 
  Trash2,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/components/ui/copy-button';
import { ImageUpload } from '@/components/ui/image-upload';
import toast from 'react-hot-toast';
import { BlockEditor } from './BlockEditor';
import { AIBlogGenerator } from './AIBlogGenerator';
import { BlogBlock, AIBlogResponse } from '@/lib/ai-blog-generator';
import CategoriesManager from '../CategoriesManager/CategoriesManager';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchCategories } from '@/redux/slices/categoriesSlice';
import CategoriesTagsCard from '../CategoriesTagsCard';
import { Post } from '@/lib/firebase';
interface BlogEditorProps {
  initialPost?: Partial<Post>;
  onSave: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDelete?: () => void;
  isEditing?: boolean;
}

export function BlogEditor({ initialPost, onSave, onDelete, isEditing = false }: BlogEditorProps) {
  const {  user: currentUser } = useAppSelector((state) => state.auth)

  const [post, setPost] = useState<Omit<Post, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    categoryId: '',
    authorId: currentUser?.id || '',
    tags: [],
    featuredImage: 'https://res.cloudinary.com/dmmnkipms/image/upload/v1753272853/avatar/umpvpliqica1cjbg65ro.jpg',
    status: 'draft',
    readingTime: { text: '1 min read', minutes: 1 },
    metaDescription: '',
    viewCount: 0,
    likeCount: 0,
    isAIGenerated: false,
    ...initialPost
  });
  const [preview, setPreview] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [editorMode, setEditorMode] = useState<'traditional' | 'blocks' | 'ai'>('blocks');
  const dispatch = useAppDispatch();
  // useEffect(() => {
  //   if (!categories.length) {
  //     dispatch(fetchCategories());
  //   }
  // }, [categories.length, dispatch]);


  const editor = useEditor({
    extensions: [
      StarterKit
    ],
    content: post.content,
    onUpdate: ({ editor }) => {
      setPost(prev => ({ ...prev, content: editor.getHTML() }));
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none dark:prose-invert max-w-none',
      },
    },
    immediatelyRender: false,
  });

  const calculateReadingTime = (blocks: BlogBlock[]): { text: string; minutes: number } => {
    // Simple word count calculation from blocks
    let wordCount = blocks.reduce((count, block) => {
      return count + JSON.stringify(block.content).split(' ').length;
    }, 0);
    const minutes = Math.ceil(wordCount / 200);
    return { text: `${minutes} min read`, minutes };
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setPost(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleTagsChange = (newTags: string[]) => {
    setPost(prev => ({
      ...prev,
      tags: newTags
    }));
  };
  const handleCategoryChange = (categoryId: string) => {
    setPost(prev => ({
      ...prev,
      categoryId:categoryId
    }));
    
  }


  const handleAIGenerate = (response: AIBlogResponse) => {
    setPost(prev => ({
      ...prev,
      title: response.title,
      slug: response.slug,
      category: response.category,
      tags: response.suggestedTags,
      blocks: response.blocks,
      aiGenerated: true,
      readingTime: calculateReadingTime(response.blocks)
    }));
    setEditorMode('blocks');
  };

  const handleBlocksChange = (blocks: BlogBlock[]) => {
      setPost(prev => ({ 
        ...prev, 
        blocks,
        readingTime: calculateReadingTime(blocks)
      }));
  };
  

  const handleSave = () => {
    // Basic validation
    if (!post.title.trim()) {
      toast.error('Title is required');
      return;
    }
  
    if (editorMode === 'blocks') {
      if (!post.blocks || post.blocks.length === 0) {
        toast.error('Please add some content blocks');
        return;
      }
    }
  
    if (editorMode === 'traditional') {
      if (!post.content || !post.content.trim()) {
        toast.error('Content is required');
        return;
      }
    }
  
    // Trigger save with validated post
    onSave(post);
  };
  

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };


  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">
          {isEditing ? 'Edit Post' : 'Create New Post'}
        </h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Label className="text-sm">Reading Time:</Label>
            <Badge variant="outline" className="text-xs">
              {post.readingTime.text}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="published" className="text-sm">Published</Label>
            <Switch
              id="published"
              checked={post.published}
              onCheckedChange={(checked) => setPost(prev => ({ ...prev, published: checked }))}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {isEditing && onDelete && (
              <Button 
                onClick={handleDelete} 
                variant="destructive" 
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              {isEditing ? 'Update Post' : 'Save Post'}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Mode Selection */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">Editor Mode:</Label>
            <div className="flex gap-2">
              <Button
                variant={editorMode === 'ai' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setEditorMode('ai')}
                className="gap-2"
              >
                <Wand2 className="h-3 w-3" />
                AI Generate
              </Button>
              <Button
                variant={editorMode === 'blocks' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setEditorMode('blocks')}
              >
                Block Editor
              </Button>
              <Button
                variant={editorMode === 'traditional' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setEditorMode('traditional')}
              >
                Traditional
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
          {/* Basic Info */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm">Title</Label>
                <Input
                  id="title"
                  value={post.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter post title..."
                  className="mt-1 text-sm sm:text-base"
                />
              </div>
              
              <div>
                <Label htmlFor="slug" className="text-sm">Slug</Label>
                <Input
                  id="slug"
                  value={post.slug}
                  onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="post-slug"
                  className="mt-1 text-sm sm:text-base"
                />
              </div>

              <div>
                <Label htmlFor="excerpt" className="text-sm">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={post.excerpt}
                  onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of the post..."
                  className="mt-1 text-sm sm:text-base"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Generation Mode */}
          {editorMode === 'ai' && (
            <AIBlogGenerator
              onGenerate={handleAIGenerate}
              initialData={{
                title: post.title,
                category: post.category,
                tags: post.tags
              }}
            />
          )}

          {/* Block Editor Mode */}
          {editorMode === 'blocks' && (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Block Editor</CardTitle>
              </CardHeader>
              <CardContent>
                <BlockEditor
                  blocks={post.blocks}
                  onChange={handleBlocksChange}
                />
              </CardContent>
            </Card>
          )}

          {/* Traditional Editor Mode */}
          {editorMode === 'traditional' && (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="text-base sm:text-lg">Content Editor</CardTitle>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreview(!preview)}
                    className="gap-2 text-xs sm:text-sm"
                  >
                    {preview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {preview ? 'Edit' : 'Preview'}
                  </Button>
                </div>
              </div>
              
              {!preview && (
                <div className="flex items-center gap-1 pt-2 border-t border-border/50 overflow-x-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={editor?.isActive('bold') ? 'bg-accent' : ''}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={editor?.isActive('italic') ? 'bg-accent' : ''}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor?.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}
                  >
                    <Heading1 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor?.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
                  >
                    <Heading2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={editor?.isActive('bulletList') ? 'bg-accent' : ''}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    className={editor?.isActive('orderedList') ? 'bg-accent' : ''}
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                    className={editor?.isActive('blockquote') ? 'bg-accent' : ''}
                  >
                    <Quote className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                    className={editor?.isActive('codeBlock') ? 'bg-accent' : ''}
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent >
              {preview ? (
                <div className="relative">
                  <div 
                    className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto dark:prose-invert max-w-none min-h-[300px] sm:min-h-[400px] p-3 sm:p-4 border border-border/50 rounded-md text-sm sm:text-base"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                  <div className="absolute top-2 right-2">
                    <CopyButton text={post.content} />
                  </div>
                </div>
              ) : (
                <EditorContent 
                  editor={editor} 
                  className="min-h-[300px] sm:min-h-[400px] p-3 sm:p-4 border border-border/50 rounded-md focus-within:border-primary transition-colors"
                />
              )}
            </CardContent>
          </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
          {/* Publishing */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Status:</span>
                <Badge variant={post.published ? "default" : "secondary"}>
                  {post.published ? 'Published' : 'Draft'}
                </Badge>
              </div>
              
              {post.aiGenerated && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Generated:</span>
                  <Badge variant="outline" className="text-purple-500 border-purple-500">
                    <Brain className="h-3 w-3 mr-1" />
                    AI
                  </Badge>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Editor Mode:</span>
                <Badge variant="secondary" className="capitalize">
                  {editorMode}
                </Badge>
              </div>
            </CardContent>
          </Card>
          <CategoriesTagsCard   tags={post.tags}
        onTagsChange={handleTagsChange} handleCategoryChange={handleCategoryChange}/>

          {/* Featured Image */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="thumbnail" className="text-sm">Image URL</Label>
                <ImageUpload
                  value={post.thumbnail}
                  onChange={(value) => setPost(prev => ({ ...prev, thumbnail: value }))}
                  placeholder="Upload featured image"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}