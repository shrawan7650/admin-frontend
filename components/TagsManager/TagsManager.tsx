'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface TagsManagerProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export default function TagsManager({ tags, onTagsChange }: TagsManagerProps) {
  const [tagInput, setTagInput] = useState('');

  // Function to clean quotes and trim
  const cleanTag = (tag: string) => {
    return tag
      .trim()
      .replace(/^['"]/, '') // Remove leading quote
      .replace(/['"]$/, '') // Remove trailing quote
      .trim(); // Trim again after quote removal
  };

  const addTag = () => {
    const input = tagInput.trim();
    if (!input) return;

    // Check if input contains commas for multiple tags
    const newTags = input.includes(',') 
      ? input.split(',').map(cleanTag).filter(tag => tag.length > 0)
      : [cleanTag(input)];

    // Filter out tags that already exist
    const uniqueNewTags = newTags.filter(tag => !tags.includes(tag));

    if (uniqueNewTags.length > 0) {
      onTagsChange([...tags, ...uniqueNewTags]);
    }
    
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  // Get preview tags for display
  const getPreviewTags = () => {
    if (!tagInput.trim()) return [];
    
    return tagInput.includes(',') 
      ? tagInput.split(',')
          .map(cleanTag)
          .filter(tag => tag.length > 0)
      : [cleanTag(tagInput)];
  };

  const previewTags = getPreviewTags();

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="tags" className="text-sm font-medium">
          Tags
          <span className="text-xs text-muted-foreground ml-2 font-normal">
            (Separate multiple tags with commas)
          </span>
        </Label>
        
        <div className="flex gap-2 mt-2">
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add tags... (e.g., 'morning routine', 'productivity', 'self improvement')"
            className="text-sm"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button 
            onClick={addTag} 
            variant="outline" 
            size="sm" 
            className="text-xs whitespace-nowrap"
            disabled={!tagInput.trim()}
          >
            Add
          </Button>
        </div>
        
        {/* Show preview of tags that will be added */}
        {tagInput.trim() && previewTags.length > 0 && (
          <div className="mt-2 p-2 bg-muted/50 rounded-md">
            <div className="text-xs text-muted-foreground mb-1">Preview:</div>
            <div className="flex flex-wrap gap-1">
              {previewTags.map((tag, index) => (
                <Badge
                  key={index}
                  variant={tags.includes(tag) ? "destructive" : "outline"}
                  className="text-xs"
                >
                  {tag} {tags.includes(tag) && "(exists)"}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Current tags */}
        {tags.length > 0 && (
          <div className="mt-3">
            <div className="text-xs text-muted-foreground mb-2">
              Current tags ({tags.length}):
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer text-xs hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={() => removeTag(tag)}
                  title="Click to remove"
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Empty state */}
        {tags.length === 0 && (
          <div className="mt-3 text-xs text-muted-foreground">
            No tags added yet. Try: "'morning routine', 'productivity', 'self improvement'"
          </div>
        )}
      </div>
    </div>
  );
}