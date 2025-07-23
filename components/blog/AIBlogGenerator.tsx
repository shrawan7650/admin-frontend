'use client';

import React, { useState } from 'react';
import { Brain, Wand2, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AIBlogInput, AIBlogResponse, aiBlogGenerator, BlogBlock } from '@/lib/ai-blog-generator';
import toast from 'react-hot-toast';

interface AIBlogGeneratorProps {
  onGenerate: (response: AIBlogResponse) => void;
  initialData?: {
    title?: string;
    category?: string;
    tags?: string[];
  };
}

export function AIBlogGenerator({ onGenerate, initialData }: AIBlogGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggestingTags, setIsSuggestingTags] = useState(false);
  const [formData, setFormData] = useState<AIBlogInput>({
    title: initialData?.title || '',
    category: initialData?.category || '',
    tags: initialData?.tags || [],
    tone: 'beginner-friendly',
    language: 'English',
    targetAudience: 'General readers interested in the topic',
    includeAffiliate: false,
    includeAds: true,
    wordCount: 'medium'
  });
  const [tagInput, setTagInput] = useState('');

  const handleGenerate = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a blog title');
      return;
    }

    if (!formData.category.trim()) {
      toast.error('Please enter a category');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await aiBlogGenerator.generateBlogPost(formData);
      onGenerate(response);
      toast.success('Blog post generated successfully!');
    } catch (error) {
      console.error('AI Generation Error:', error);
      toast.error('Failed to generate blog post. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggestTags = async () => {
    if (!formData.title.trim() || !formData.category.trim()) {
      toast.error('Please enter title and category first');
      return;
    }

    setIsSuggestingTags(true);

    try {
      const suggestedTags = await aiBlogGenerator.suggestTags(formData.title, formData.category);
      setFormData(prev => ({ ...prev, tags: suggestedTags }));
      toast.success('Tags suggested successfully!');
    } catch (error) {
      console.error('Tag suggestion error:', error);
      toast.error('Failed to suggest tags. Please try again.');
    } finally {
      setIsSuggestingTags(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-purple-500" />
          AI Blog Generator
        </CardTitle>
        <CardDescription>
          Generate SEO-optimized, affiliate-friendly blog content with AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title" className="text-sm">Blog Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Top 5 AI Tools in 2025: Free vs Paid"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="category" className="text-sm">Category *</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="e.g., AI Tools, Technology, Productivity"
              className="mt-1"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm">Tags</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSuggestTags}
              disabled={isSuggestingTags || !formData.title.trim() || !formData.category.trim()}
              className="gap-2"
            >
              {isSuggestingTags ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3" />
              )}
              Suggest with AI
            </Button>
          </div>
          
          <div className="flex gap-2 mb-3">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button onClick={addTag} variant="outline" size="sm">
              Add
            </Button>
          </div>

          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Content Settings */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tone" className="text-sm">Writing Tone</Label>
            <Select
              value={formData.tone}
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, tone: value }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="beginner-friendly">Beginner-friendly</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="wordCount" className="text-sm">Content Length</Label>
            <Select
              value={formData.wordCount}
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, wordCount: value }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short (800-1200 words)</SelectItem>
                <SelectItem value="medium">Medium (1200-2000 words)</SelectItem>
                <SelectItem value="long">Long (2000+ words)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Target Audience */}
        <div>
          <Label htmlFor="audience" className="text-sm">Target Audience</Label>
          <Textarea
            id="audience"
            value={formData.targetAudience}
            onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
            placeholder="Describe your target audience..."
            className="mt-1"
            rows={2}
          />
        </div>

        {/* Monetization Options */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Monetization Options</h4>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Include Affiliate Products</Label>
              <p className="text-xs text-muted-foreground">Add affiliate product recommendations</p>
            </div>
            <Switch
              checked={formData.includeAffiliate}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeAffiliate: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Include Ad Placements</Label>
              <p className="text-xs text-muted-foreground">Add strategic ad placement blocks</p>
            </div>
            <Switch
              checked={formData.includeAds}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeAds: checked }))}
            />
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !formData.title.trim() || !formData.category.trim()}
          className="w-full gap-2"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Blog Post...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
              Generate AI Blog Post
            </>
          )}
        </Button>

        {/* Preview Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• AI will generate SEO-optimized content with proper headings and structure</p>
          <p>• Content will be organized in editable blocks for easy customization</p>
          <p>• Meta tags and keywords will be automatically generated</p>
          {formData.includeAffiliate && <p>• Affiliate product blocks will be naturally integrated</p>}
          {formData.includeAds && <p>• Strategic ad placement blocks will be included</p>}
        </div>
      </CardContent>
    </Card>
  );
}