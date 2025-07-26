'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchCategories,
  addCategory,
  deleteCategory,
  updateCategory,
  setSelectedCategory,
} from '@/redux/slices/categoriesSlice';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CategoriesManagerProps {
  handleCategoryChange: (categoryId: string) => void;
}

export default function CategoriesManager({ handleCategoryChange }: CategoriesManagerProps) {
  const dispatch = useAppDispatch();
  const { items: categories, loading, selectedCategory } = useAppSelector(state => state.categories);

  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editValue, setEditValue] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Update selected ID & edit value from selectedCategory object
  useEffect(() => {
    if (selectedCategory) {
      setSelectedCategoryId(selectedCategory.id);
      setEditValue(selectedCategory.name);
    } else {
      setSelectedCategoryId('');
      setEditValue('');
    }
  }, [selectedCategory]);

  const handleAddCategory = async () => {
    const name = newCategory.trim();
    if (!name) return;

    const exists = categories.some(cat => cat.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      toast.error("Category already exists");
      setNewCategory('');
      return;
    }

    try {
      await dispatch(addCategory(name));
      
      // Find the newly added category and select it
      // Note: We need to wait for fetchCategories to complete first
      const updatedCategories = await dispatch(fetchCategories()).unwrap();
      const newlyAdded = updatedCategories.find(cat => cat.name === name);
      if (newlyAdded) {
        dispatch(setSelectedCategory(newlyAdded));
      }
      
      setNewCategory('');
      toast.success("Category added successfully");
    } catch (error) {
      toast.error("Failed to add category");
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategoryId || !editValue.trim()) return;

    const newName = editValue.trim();
    
    // Check if new name already exists (excluding current category)
    const exists = categories.some(cat => 
      cat.name.toLowerCase() === newName.toLowerCase() && cat.id !== selectedCategoryId
    );
    
    if (exists) {
      toast.error("Category name already exists");
      return;
    }

    try {
      await dispatch(updateCategory({ id: selectedCategoryId, name: newName }));
      
      // Update the selected category to the new category object
      const updatedCategories = await dispatch(fetchCategories()).unwrap();
      const updatedCategory = updatedCategories.find(cat => cat.id === selectedCategoryId);
      if (updatedCategory) {
        dispatch(setSelectedCategory(updatedCategory));
      }
      
      setOpenDialog(false);
      toast.success("Category updated successfully");
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategoryId) return;

    try {
      await dispatch(deleteCategory(selectedCategoryId));
      await dispatch(fetchCategories());
      
      // Clear selection after deletion
      dispatch(setSelectedCategory(null));
      setSelectedCategoryId('');
      setEditValue('');
      setOpenDialog(false);
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };
// Modify the value passed to SelectItem and logic
const handleSelectChange = (id: string) => {
  const selected = categories.find(cat => cat.id === id);
  if (selected) {
    dispatch(setSelectedCategory(selected));
    handleCategoryChange(selected.id); // 👈 send ID to parent
  }
};


  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      <Label className="text-base font-medium">Choose or Create Category</Label>
      
      {/* Dropdown Selector */}
      <Select
  value={selectedCategory?.id || ''}
  onValueChange={handleSelectChange}
>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select category" />
  </SelectTrigger>

  <SelectContent>
    {loading ? (
      <div className="p-2 text-sm flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading categories...
      </div>
    ) : categories.length ? (
      categories.map(cat => (
        <SelectItem key={cat.id} value={cat.id}>
          {cat.name}
        </SelectItem>
      ))
    ) : (
      <div className="p-2 text-sm text-muted-foreground">No categories found</div>
    )}
  </SelectContent>
</Select>

      <p className="text-sm text-muted-foreground text-center">Or</p>

      {/* New Category Creation */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="New category name"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
        />
        <Button 
          onClick={handleAddCategory} 
          disabled={loading || !newCategory.trim()}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add'}
        </Button>
      </div>

      {/* Edit/Delete Dialog */}
      {selectedCategoryId && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Edit or Delete "{selectedCategory?.name}"
            </Button>
          </DialogTrigger>
          <DialogContent className="space-y-4">
            <Label>Edit selected category</Label>
            <Input
              placeholder="Edit category name"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEditCategory()}
            />
            <div className="flex justify-end gap-2">
              <Button 
                onClick={handleEditCategory} 
                disabled={loading || !editValue.trim() || editValue.trim() === selectedCategory?.name}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update'}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteCategory}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}