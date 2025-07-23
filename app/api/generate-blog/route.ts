import { NextRequest, NextResponse } from 'next/server';
import { AIBlogGenerator, AIBlogInput } from '@/lib/ai-blog-generator';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const ai = new AIBlogGenerator(process.env.OPENAI_API_KEY!);

  try {
    const result = await ai.generateBlogPost(body as AIBlogInput);
    return NextResponse.json(result);
  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json({ error: 'Failed to generate blog post' }, { status: 500 });
  }
}
