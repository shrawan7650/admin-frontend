'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  Plus, 
  GripVertical, 
  Trash2, 
  Edit3,
  Type,
  List,
  Image,
  Code,
  HelpCircle,
  BarChart3,
  DollarSign,
  Monitor,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { BlogBlock, HeadingBlock, ParagraphBlock, ListBlock, ComparisonBoxBlock, ImageBlock, FAQBlock, CodeBlock, AffiliateProductBlock, AdBlock, ConclusionBlock } from '@/lib/ai-blog-generator';

interface BlockEditorProps {
  blocks: BlogBlock[];
  onChange: (blocks: BlogBlock[]) => void;
}

const blockTypes = [
  { type: 'HeadingBlock', label: 'Heading', icon: Type },
  { type: 'ParagraphBlock', label: 'Paragraph', icon: FileText },
  { type: 'ListBlock', label: 'List', icon: List },
  { type: 'ComparisonBoxBlock', label: 'Comparison Table', icon: BarChart3 },
  { type: 'ImageBlock', label: 'Image', icon: Image },
  { type: 'CodeBlock', label: 'Code', icon: Code },
  { type: 'FAQBlock', label: 'FAQ', icon: HelpCircle },
  { type: 'AffiliateProductBlock', label: 'Affiliate Product', icon: DollarSign },
  { type: 'AdBlock', label: 'Ad Placement', icon: Monitor },
  { type: 'ConclusionBlock', label: 'Conclusion', icon: FileText },
];

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [selectedBlockType, setSelectedBlockType] = useState<string>('');

  const addBlock = (type: string) => {
    const newBlock: BlogBlock = {
      id: `block-${Date.now()}`,
      type: type as any,
      content: getDefaultContent(type),
      order: blocks.length
    };

    onChange([...blocks, newBlock]);
    setSelectedBlockType('');
  };

  const updateBlock = (blockId: string, content: any) => {
    const updatedBlocks = blocks.map(block =>
      block.id === blockId ? { ...block, content } : block
    );
    onChange(updatedBlocks);
  };

  const deleteBlock = (blockId: string) => {
    const updatedBlocks = blocks.filter(block => block.id !== blockId);
    onChange(updatedBlocks);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedBlocks = Array.from(blocks);
    const [removed] = reorderedBlocks.splice(result.source.index, 1);
    reorderedBlocks.splice(result.destination.index, 0, removed);

    // Update order property
    const updatedBlocks = reorderedBlocks.map((block, index) => ({
      ...block,
      order: index
    }));

    onChange(updatedBlocks);
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'HeadingBlock':
        return { text: 'New Heading', level: 2 };
      case 'ParagraphBlock':
        return { text: 'Enter your paragraph text here...' };
      case 'ListBlock':
        return { items: ['Item 1', 'Item 2'], ordered: false };
      case 'ComparisonBoxBlock':
        return {
          title: 'Comparison Table',
          columns: ['Feature', 'Option A', 'Option B'],
          rows: [['Feature 1', 'Value A1', 'Value B1']]
        };
      case 'ImageBlock':
        return { url: '', caption: '', alt: '' };
      case 'CodeBlock':
        return { code: '// Your code here', language: 'javascript', title: '' };
      case 'FAQBlock':
        return {
          questions: [
            { question: 'Your question?', answer: 'Your answer here.' }
          ]
        };
      case 'AffiliateProductBlock':
        return {
          title: 'Product Name',
          description: 'Product description...',
          image: '',
          affiliateUrl: '',
          buttonText: 'Buy Now',
          price: '',
          rating: 5
        };
      case 'AdBlock':
        return {
          adSlot: 'content-ad',
          description: 'Advertisement placeholder',
          size: 'rectangle'
        };
      case 'ConclusionBlock':
        return {
          text: 'Your conclusion here...',
          callToAction: { text: 'Get Started', url: '#' }
        };
      default:
        return {};
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Block Section */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Label className="text-sm font-medium">Add Block:</Label>
            <div className="flex flex-wrap gap-2">
              {blockTypes.map((blockType) => {
                const Icon = blockType.icon;
                return (
                  <Button
                    key={blockType.type}
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock(blockType.type)}
                    className="gap-2 text-xs"
                  >
                    <Icon className="h-3 w-3" />
                    {blockType.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blocks List */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="blocks" isDropDisabled={false}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {blocks.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${snapshot.isDragging ? 'opacity-50' : ''}`}
                    >
                      <BlockRenderer
                        block={block}
                        onUpdate={(content) => updateBlock(block.id, content)}
                        onDelete={() => deleteBlock(block.id)}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {blocks.length === 0 && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">No blocks added yet</h3>
                <p className="text-sm text-muted-foreground">Start building your blog post by adding content blocks above.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface BlockRendererProps {
  block: BlogBlock;
  onUpdate: (content: any) => void;
  onDelete: () => void;
  dragHandleProps: any;
}

function BlockRenderer({ block, onUpdate, onDelete, dragHandleProps }: BlockRendererProps) {
  const [isEditing, setIsEditing] = useState(false);

  const renderBlockContent = () => {
    switch (block.type) {
      case 'HeadingBlock':
        return <HeadingBlockEditor block={block as HeadingBlock} onUpdate={onUpdate} isEditing={isEditing} />;
      case 'ParagraphBlock':
        return <ParagraphBlockEditor block={block as ParagraphBlock} onUpdate={onUpdate} isEditing={isEditing} />;
      case 'ListBlock':
        return <ListBlockEditor block={block as ListBlock} onUpdate={onUpdate} isEditing={isEditing} />;
      case 'ComparisonBoxBlock':
        return <ComparisonBoxBlockEditor block={block as ComparisonBoxBlock} onUpdate={onUpdate} isEditing={isEditing} />;
      case 'ImageBlock':
        return <ImageBlockEditor block={block as ImageBlock} onUpdate={onUpdate} isEditing={isEditing} />;
      case 'CodeBlock':
        return <CodeBlockEditor block={block as CodeBlock} onUpdate={onUpdate} isEditing={isEditing} />;
      case 'FAQBlock':
        return <FAQBlockEditor block={block as FAQBlock} onUpdate={onUpdate} isEditing={isEditing} />;
      case 'AffiliateProductBlock':
        return <AffiliateProductBlockEditor block={block as AffiliateProductBlock} onUpdate={onUpdate} isEditing={isEditing} />;
      case 'AdBlock':
        return <AdBlockEditor block={block as AdBlock} onUpdate={onUpdate} isEditing={isEditing} />;
      case 'ConclusionBlock':
        return <ConclusionBlockEditor block={block as ConclusionBlock} onUpdate={onUpdate} isEditing={isEditing} />;
      default:
        return <div>Unknown block type</div>;
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm group hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing mt-1">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {block.type.replace('Block', '')}
                </Badge>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="h-8 w-8 p-0"
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            {renderBlockContent()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Individual Block Editors
function HeadingBlockEditor({ block, onUpdate, isEditing }: { block: HeadingBlock; onUpdate: (content: any) => void; isEditing: boolean }) {
  if (isEditing) {
    return (
      <div className="space-y-3">
        <div>
          <Label className="text-sm">Heading Text</Label>
          <Input
            value={block.content.text}
            onChange={(e) => onUpdate({ ...block.content, text: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm">Heading Level</Label>
          <Select
            value={block.content.level.toString()}
            onValueChange={(value) => onUpdate({ ...block.content, level: parseInt(value) })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map(level => (
                <SelectItem key={level} value={level.toString()}>H{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  const HeadingTag = `h${block.content.level}` as keyof JSX.IntrinsicElements;
  return (
    <HeadingTag className={`font-bold ${
      block.content.level === 1 ? 'text-3xl' :
      block.content.level === 2 ? 'text-2xl' :
      block.content.level === 3 ? 'text-xl' :
      block.content.level === 4 ? 'text-lg' :
      block.content.level === 5 ? 'text-base' : 'text-sm'
    }`}>
      {block.content.text}
    </HeadingTag>
  );
}

function ParagraphBlockEditor({ block, onUpdate, isEditing }: { block: ParagraphBlock; onUpdate: (content: any) => void; isEditing: boolean }) {
  if (isEditing) {
    return (
      <div>
        <Label className="text-sm">Paragraph Text</Label>
        <Textarea
          value={block.content.text}
          onChange={(e) => onUpdate({ ...block.content, text: e.target.value })}
          className="mt-1"
          rows={4}
        />
      </div>
    );
  }

  return <p className="text-sm leading-relaxed">{block.content.text}</p>;
}

function ListBlockEditor({ block, onUpdate, isEditing }: { block: ListBlock; onUpdate: (content: any) => void; isEditing: boolean }) {
  if (isEditing) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Switch
            checked={block.content.ordered}
            onCheckedChange={(checked) => onUpdate({ ...block.content, ordered: checked })}
          />
          <Label className="text-sm">Ordered List</Label>
        </div>
        <div>
          <Label className="text-sm">List Items (one per line)</Label>
          <Textarea
            value={block.content.items.join('\n')}
            onChange={(e) => onUpdate({ ...block.content, items: e.target.value.split('\n').filter(item => item.trim()) })}
            className="mt-1"
            rows={4}
          />
        </div>
      </div>
    );
  }

  const ListTag = block.content.ordered ? 'ol' : 'ul';
  return (
    <ListTag className={`text-sm space-y-1 ${block.content.ordered ? 'list-decimal' : 'list-disc'} list-inside`}>
      {block.content.items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ListTag>
  );
}

function ComparisonBoxBlockEditor({ block, onUpdate, isEditing }: { block: ComparisonBoxBlock; onUpdate: (content: any) => void; isEditing: boolean }) {
  if (isEditing) {
    return (
      <div className="space-y-3">
        <div>
          <Label className="text-sm">Table Title</Label>
          <Input
            value={block.content.title}
            onChange={(e) => onUpdate({ ...block.content, title: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm">Columns (comma separated)</Label>
          <Input
            value={block.content.columns.join(', ')}
            onChange={(e) => onUpdate({ ...block.content, columns: e.target.value.split(',').map(col => col.trim()) })}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm">Rows (one row per line, columns separated by commas)</Label>
          <Textarea
            value={block.content.rows.map(row => row.join(', ')).join('\n')}
            onChange={(e) => {
              const rows = e.target.value.split('\n').map(row => 
                row.split(',').map(cell => cell.trim())
              ).filter(row => row.some(cell => cell));
              onUpdate({ ...block.content, rows });
            }}
            className="mt-1"
            rows={4}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-semibold">{block.content.title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-border text-sm">
          <thead>
            <tr className="bg-muted/50">
              {block.content.columns.map((column, index) => (
                <th key={index} className="border border-border p-2 text-left font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.content.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-border p-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ImageBlockEditor({ block, onUpdate, isEditing }: { block: ImageBlock; onUpdate: (content: any) => void; isEditing: boolean }) {
  if (isEditing) {
    return (
      <div className="space-y-3">
        <div>
          <Label className="text-sm">Image URL</Label>
          <Input
            value={block.content.url}
            onChange={(e) => onUpdate({ ...block.content, url: e.target.value })}
            className="mt-1"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <Label className="text-sm">Caption</Label>
          <Input
            value={block.content.caption || ''}
            onChange={(e) => onUpdate({ ...block.content, caption: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm">Alt Text</Label>
          <Input
            value={block.content.alt}
            onChange={(e) => onUpdate({ ...block.content, alt: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {block.content.url ? (
        <img
          src={block.content.url}
          alt={block.content.alt}
          className="w-full h-auto rounded-lg border border-border"
        />
      ) : (
        <div className="w-full h-48 bg-muted/50 rounded-lg border border-border flex items-center justify-center">
          <div className="text-center">
            <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No image URL provided</p>
          </div>
        </div>
      )}
      {block.content.caption && (
        <p className="text-sm text-muted-foreground text-center italic">
          {block.content.caption}
        </p>
      )}
    </div>
  );
}

function CodeBlockEditor({ block, onUpdate, isEditing }: { block: CodeBlock; onUpdate: (content: any) => void; isEditing: boolean }) {
  if (isEditing) {
    return (
      <div className="space-y-3">
        <div>
          <Label className="text-sm">Title (optional)</Label>
          <Input
            value={block.content.title || ''}
            onChange={(e) => onUpdate({ ...block.content, title: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm">Language</Label>
          <Select
            value={block.content.language}
            onValueChange={(value) => onUpdate({ ...block.content, language: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="bash">Bash</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm">Code</Label>
          <Textarea
            value={block.content.code}
            onChange={(e) => onUpdate({ ...block.content, code: e.target.value })}
            className="mt-1 font-mono"
            rows={6}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {block.content.title && (
        <h4 className="font-medium text-sm">{block.content.title}</h4>
      )}
      <div className="bg-muted/50 rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            {block.content.language}
          </Badge>
        </div>
        <pre className="text-sm overflow-x-auto">
          <code>{block.content.code}</code>
        </pre>
      </div>
    </div>
  );
}

function FAQBlockEditor({ block, onUpdate, isEditing }: { block: FAQBlock; onUpdate: (content: any) => void; isEditing: boolean }) {
  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">FAQ Questions</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newQuestions = [...block.content.questions, { question: '', answer: '' }];
              onUpdate({ ...block.content, questions: newQuestions });
            }}
          >
            Add Question
          </Button>
        </div>
        {block.content.questions.map((qa, index) => (
          <div key={index} className="space-y-2 p-3 border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Question {index + 1}</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newQuestions = block.content.questions.filter((_, i) => i !== index);
                  onUpdate({ ...block.content, questions: newQuestions });
                }}
                className="h-6 w-6 p-0 text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <Input
              value={qa.question}
              onChange={(e) => {
                const newQuestions = [...block.content.questions];
                newQuestions[index] = { ...qa, question: e.target.value };
                onUpdate({ ...block.content, questions: newQuestions });
              }}
              placeholder="Enter question..."
              className="text-sm"
            />
            <Textarea
              value={qa.answer}
              onChange={(e) => {
                const newQuestions = [...block.content.questions];
                newQuestions[index] = { ...qa, answer: e.target.value };
                onUpdate({ ...block.content, questions: newQuestions });
              }}
              placeholder="Enter answer..."
              className="text-sm"
              rows={2}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Frequently Asked Questions</h4>
      <div className="space-y-3">
        {block.content.questions.map((qa, index) => (
          <div key={index} className="border border-border rounded-lg p-3">
            <h5 className="font-medium text-sm mb-2">{qa.question}</h5>
            <p className="text-sm text-muted-foreground">{qa.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AffiliateProductBlockEditor({ block, onUpdate, isEditing }: { block: AffiliateProductBlock; onUpdate: (content: any) => void; isEditing: boolean }) {
  if (isEditing) {
    return (
      <div className="space-y-3">
        <div>
          <Label className="text-sm">Product Title</Label>
          <Input
            value={block.content.title}
            onChange={(e) => onUpdate({ ...block.content, title: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm">Description</Label>
          <Textarea
            value={block.content.description}
            onChange={(e) => onUpdate({ ...block.content, description: e.target.value })}
            className="mt-1"
            rows={3}
          />
        </div>
        <div>
          <Label className="text-sm">Product Image URL</Label>
          <Input
            value={block.content.image}
            onChange={(e) => onUpdate({ ...block.content, image: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm">Affiliate URL</Label>
          <Input
            value={block.content.affiliateUrl}
            onChange={(e) => onUpdate({ ...block.content, affiliateUrl: e.target.value })}
            className="mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm">Button Text</Label>
            <Input
              value={block.content.buttonText}
              onChange={(e) => onUpdate({ ...block.content, buttonText: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm">Price</Label>
            <Input
              value={block.content.price || ''}
              onChange={(e) => onUpdate({ ...block.content, price: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label className="text-sm">Rating (1-5)</Label>
          <Input
            type="number"
            min="1"
            max="5"
            step="0.1"
            value={block.content.rating || 5}
            onChange={(e) => onUpdate({ ...block.content, rating: parseFloat(e.target.value) })}
            className="mt-1"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
      <div className="flex items-start gap-4">
        {block.content.image && (
          <img
            src={block.content.image}
            alt={block.content.title}
            className="w-20 h-20 object-cover rounded-lg"
          />
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-sm">{block.content.title}</h4>
              {block.content.rating && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-xs">{block.content.rating}/5</span>
                </div>
              )}
            </div>
            {block.content.price && (
              <Badge variant="secondary" className="text-xs">
                {block.content.price}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2">{block.content.description}</p>
          <Button size="sm" className="mt-3">
            {block.content.buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}

function AdBlockEditor({ block, onUpdate, isEditing }: { block: AdBlock; onUpdate: (content: any) => void; isEditing: boolean }) {
  if (isEditing) {
    return (
      <div className="space-y-3">
        <div>
          <Label className="text-sm">Ad Slot ID</Label>
          <Input
            value={block.content.adSlot}
            onChange={(e) => onUpdate({ ...block.content, adSlot: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm">Description</Label>
          <Input
            value={block.content.description}
            onChange={(e) => onUpdate({ ...block.content, description: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm">Ad Size</Label>
          <Select
            value={block.content.size || 'rectangle'}
            onValueChange={(value) => onUpdate({ ...block.content, size: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="banner">Banner (728x90)</SelectItem>
              <SelectItem value="rectangle">Rectangle (300x250)</SelectItem>
              <SelectItem value="square">Square (250x250)</SelectItem>
              <SelectItem value="leaderboard">Leaderboard (728x90)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  const sizeClasses = {
    banner: 'h-24',
    rectangle: 'h-64',
    square: 'h-64 max-w-64',
    leaderboard: 'h-24'
  };

  return (
    <div className={`bg-muted/30 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center ${sizeClasses[block.content.size as keyof typeof sizeClasses] || 'h-64'}`}>
      <div className="text-center">
        <Monitor className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">{block.content.description}</p>
        <p className="text-xs text-muted-foreground mt-1">Ad Slot: {block.content.adSlot}</p>
      </div>
    </div>
  );
}

function ConclusionBlockEditor({ block, onUpdate, isEditing }: { block: ConclusionBlock; onUpdate: (content: any) => void; isEditing: boolean }) {
  if (isEditing) {
    return (
      <div className="space-y-3">
        <div>
          <Label className="text-sm">Conclusion Text</Label>
          <Textarea
            value={block.content.text}
            onChange={(e) => onUpdate({ ...block.content, text: e.target.value })}
            className="mt-1"
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm">Call to Action (optional)</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={block.content.callToAction?.text || ''}
              onChange={(e) => onUpdate({ 
                ...block.content, 
                callToAction: { 
                  ...block.content.callToAction, 
                  text: e.target.value 
                } 
              })}
              placeholder="Button text"
              className="text-sm"
            />
            <Input
              value={block.content.callToAction?.url || ''}
              onChange={(e) => onUpdate({ 
                ...block.content, 
                callToAction: { 
                  ...block.content.callToAction, 
                  url: e.target.value 
                } 
              })}
              placeholder="Button URL"
              className="text-sm"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border">
      <p className="text-sm leading-relaxed">{block.content.text}</p>
      {block.content.callToAction && block.content.callToAction.text && (
        <Button className="w-full sm:w-auto">
          {block.content.callToAction.text}
        </Button>
      )}
    </div>
  );
}