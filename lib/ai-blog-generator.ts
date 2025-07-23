// AI Blog Generator Service
import { OpenAI } from 'openai';

// Block Types Interface
export interface BlogBlock {
  id: string;
  type: 'HeadingBlock' | 'ParagraphBlock' | 'ListBlock' | 'ComparisonBoxBlock' | 'ImageBlock' | 'FAQBlock' | 'CodeBlock' | 'AffiliateProductBlock' | 'AdBlock' | 'ConclusionBlock';
  content: any;
  order: number;
}

export interface HeadingBlock extends BlogBlock {
  type: 'HeadingBlock';
  content: {
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
  };
}

export interface ParagraphBlock extends BlogBlock {
  type: 'ParagraphBlock';
  content: {
    text: string;
  };
}

export interface ListBlock extends BlogBlock {
  type: 'ListBlock';
  content: {
    items: string[];
    ordered: boolean;
  };
}

export interface ComparisonBoxBlock extends BlogBlock {
  type: 'ComparisonBoxBlock';
  content: {
    title: string;
    columns: string[];
    rows: string[][];
  };
}

export interface ImageBlock extends BlogBlock {
  type: 'ImageBlock';
  content: {
    url: string;
    caption?: string;
    alt: string;
  };
}

export interface FAQBlock extends BlogBlock {
  type: 'FAQBlock';
  content: {
    questions: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export interface CodeBlock extends BlogBlock {
  type: 'CodeBlock';
  content: {
    code: string;
    language: string;
    title?: string;
  };
}

export interface AffiliateProductBlock extends BlogBlock {
  type: 'AffiliateProductBlock';
  content: {
    title: string;
    description: string;
    image: string;
    affiliateUrl: string;
    buttonText: string;
    price?: string;
    rating?: number;
  };
}

export interface AdBlock extends BlogBlock {
  type: 'AdBlock';
  content: {
    adSlot: string;
    description: string;
    size?: 'banner' | 'square' | 'rectangle' | 'leaderboard';
  };
}

export interface ConclusionBlock extends BlogBlock {
  type: 'ConclusionBlock';
  content: {
    text: string;
    callToAction?: {
      text: string;
      url: string;
    };
  };
}

// Blog Post Interface
export interface BlogPost {
  title: string;
  slug: string;
  category: string;
  tags: string[];
  author: string;
  coverImage: {
    url: string;
    description: string;
  };
  blocks: BlogBlock[];
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
  status: 'draft' | 'published';
  isAIGenerated: boolean;
  readingTime: {
    text: string;
    minutes: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// AI Blog Generator Input
export interface AIBlogInput {
  title: string;
  category: string;
  tags?: string[];
  tone: 'professional' | 'casual' | 'beginner-friendly' | 'technical';
  language: string;
  targetAudience: string;
  includeAffiliate?: boolean;
  includeAds?: boolean;
  wordCount?: 'short' | 'medium' | 'long';
}

// AI Blog Generator Response
export interface AIBlogResponse {
  title: string;
  slug: string;
  category: string;
  suggestedTags: string[];
  suggestedImage: string;
  blocks: BlogBlock[];
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export class AIBlogGenerator {
  // private openai: OpenAI;

  // constructor(apiKey: string) {
  //   this.openai = new OpenAI({
  //     apiKey, 
  //   });
  // }
  
  // Generate slug from title
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Calculate reading time
  private calculateReadingTime(blocks: BlogBlock[]): { text: string; minutes: number } {
    let wordCount = 0;
    
    blocks.forEach(block => {
      switch (block.type) {
        case 'ParagraphBlock':
          wordCount += block.content.text.split(' ').length;
          break;
        case 'HeadingBlock':
          wordCount += block.content.text.split(' ').length;
          break;
        case 'ListBlock':
          wordCount += block.content.items.join(' ').split(' ').length;
          break;
        case 'FAQBlock':
          block.content.questions.forEach(q => {
            wordCount += (q.question + ' ' + q.answer).split(' ').length;
          });
          break;
        case 'ConclusionBlock':
          wordCount += block.content.text.split(' ').length;
          break;
      }
    });

    const minutes = Math.ceil(wordCount / 200); // 200 words per minute
    return {
      text: `${minutes} min read`,
      minutes
    };
  }

  // Generate AI blog post
  async generateBlogPost(input: AIBlogInput): Promise<AIBlogResponse> {
    const prompt = this.createPrompt(input);

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a professional blog content generator and SEO expert. Generate high-quality, SEO-optimized blog posts in a structured JSON format with modular blocks. Focus on creating engaging, informative content that's perfect for affiliate marketing and AdSense monetization.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: input.wordCount === 'short' ? 2000 : input.wordCount === 'medium' ? 3500 : 5000,
        temperature: 0.7,
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new Error('No response from AI');
      }

      const aiResponse: AIBlogResponse = JSON.parse(response);
      
      // Add IDs and order to blocks
      aiResponse.blocks = aiResponse.blocks.map((block, index) => ({
        ...block,
        id: `block-${Date.now()}-${index}`,
        order: index
      }));

      // Generate slug if not provided
      if (!aiResponse.slug) {
        aiResponse.slug = this.generateSlug(aiResponse.title);
      }

      return aiResponse;

    } catch (error) {
      console.error('AI Blog Generation Error:', error);
      throw new Error('Failed to generate blog post with AI');
    }
  }

  // Create AI prompt
  private createPrompt(input: AIBlogInput): string {
    return `
Generate a comprehensive blog post with the following specifications:

**Input Parameters:**
- Title: "${input.title}"
- Category: "${input.category}"
- Tags: ${input.tags ? JSON.stringify(input.tags) : 'Generate relevant tags'}
- Tone: ${input.tone}
- Language: ${input.language}
- Target Audience: ${input.targetAudience}
- Include Affiliate Content: ${input.includeAffiliate ? 'Yes' : 'No'}
- Include Ad Placements: ${input.includeAds ? 'Yes' : 'No'}
- Word Count: ${input.wordCount || 'medium'}

**Requirements:**
1. Create SEO-optimized content with proper keyword density
2. Structure content using modular blocks for easy editing
3. Include meta tags for SEO
4. Make content beginner-friendly and engaging
5. Add comparison tables where relevant
6. Include FAQ section for better SEO
7. Add affiliate product recommendations naturally
8. Place ad blocks strategically

**Output Format (JSON):**
Return ONLY a valid JSON object with this exact structure:

{
  "title": "Optimized blog title",
  "slug": "url-friendly-slug",
  "category": "${input.category}",
  "suggestedTags": ["tag1", "tag2", "tag3", "tag4"],
  "suggestedImage": "Detailed description for cover image",
  "blocks": [
    {
      "type": "HeadingBlock",
      "content": {
        "text": "Introduction",
        "level": 2
      }
    },
    {
      "type": "ParagraphBlock",
      "content": {
        "text": "Engaging introduction paragraph..."
      }
    },
    {
      "type": "ListBlock",
      "content": {
        "items": ["Item 1", "Item 2", "Item 3"],
        "ordered": false
      }
    },
    {
      "type": "ComparisonBoxBlock",
      "content": {
        "title": "Comparison Table Title",
        "columns": ["Feature", "Free", "Paid", "Price"],
        "rows": [
          ["Tool 1", "Basic features", "Advanced features", "$10/month"],
          ["Tool 2", "Limited usage", "Unlimited usage", "$20/month"]
        ]
      }
    },
    {
      "type": "ImageBlock",
      "content": {
        "url": "placeholder-image-url",
        "caption": "Descriptive caption",
        "alt": "Alt text for accessibility"
      }
    },
    ${input.includeAffiliate ? `{
      "type": "AffiliateProductBlock",
      "content": {
        "title": "Recommended Product",
        "description": "Why this product is great...",
        "image": "product-image-url",
        "affiliateUrl": "affiliate-link-placeholder",
        "buttonText": "Try Now",
        "price": "$29/month",
        "rating": 4.5
      }
    },` : ''}
    ${input.includeAds ? `{
      "type": "AdBlock",
      "content": {
        "adSlot": "middle-content",
        "description": "Display ad placeholder",
        "size": "rectangle"
      }
    },` : ''}
    {
      "type": "FAQBlock",
      "content": {
        "questions": [
          {
            "question": "Relevant question?",
            "answer": "Detailed answer..."
          }
        ]
      }
    },
    {
      "type": "ConclusionBlock",
      "content": {
        "text": "Compelling conclusion...",
        "callToAction": {
          "text": "Get Started Today",
          "url": "#"
        }
      }
    }
  ],
  "meta": {
    "title": "SEO optimized title (60 chars max)",
    "description": "SEO meta description (160 chars max)",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  }
}

Make sure the content is valuable, well-researched, and naturally incorporates the requested elements.
`;
  }

  // Suggest tags based on title and category
  async suggestTags(title: string, category: string): Promise<string[]> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert. Generate relevant, SEO-friendly tags for blog posts. Return only a JSON array of strings.'
          },
          {
            role: 'user',
            content: `Generate 5-8 relevant tags for a blog post with title: "${title}" in category: "${category}". Focus on SEO keywords and trending topics.`
          }
        ],
        max_tokens: 200,
        temperature: 0.5,
      });

      const response = completion.choices[0].message.content;
      if (!response) return [];

      return JSON.parse(response);
    } catch (error) {
      console.error('Tag suggestion error:', error);
      return [];
    }
  }

  // Generate image description for AI image generation
  async generateImageDescription(title: string, category: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Generate detailed image descriptions for blog cover images that would work well with AI image generators like DALL-E or Midjourney.'
          },
          {
            role: 'user',
            content: `Create a detailed image description for a blog post titled: "${title}" in category: "${category}". The image should be professional, eye-catching, and relevant to the content.`
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      return completion.choices[0].message.content || 'Professional blog cover image';
    } catch (error) {
      console.error('Image description generation error:', error);
      return 'Professional blog cover image';
    }
  }
}

// // Export singleton instance
// export const aiBlogGenerator = new AIBlogGenerator();


