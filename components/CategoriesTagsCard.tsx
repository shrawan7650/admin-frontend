'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import CategoriesManager from './CategoriesManager/CategoriesManager';
import TagsManager from './TagsManager/TagsManager';

interface CategoriesTagsCardProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  handleCategoryChange: (category: string) => void;
}

export default function CategoriesTagsCard({ tags, onTagsChange ,handleCategoryChange}: CategoriesTagsCardProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Categories & Tags</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories Section */}
        <CategoriesManager handleCategoryChange={handleCategoryChange} />
        
        {/* Divider */}
        <div className="border-t border-border/50"></div>
        
        {/* Tags Section */}
        <TagsManager tags={tags} onTagsChange={onTagsChange} />
      </CardContent>
    </Card>
  );
}