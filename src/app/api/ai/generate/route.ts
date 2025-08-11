import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth'; // Import auth from your auth.ts

let openai: OpenAI;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  // Provide a dummy object or throw an error if accessed without API key
  // For build, we can provide a dummy object that won't cause errors
  openai = {
    chat: {
      completions: {
        create: async () => {
          console.warn("OpenAI client not initialized: OPENAI_API_KEY is missing.");
          return { choices: [{ message: { content: "" } }], usage: { total_tokens: 0 } };
        },
      },
    },
  } as any; // Cast to any to satisfy type checking for dummy object
}
const prisma = new PrismaClient();

// Master prompt for report generation (can be customized)
const MASTER_PROMPT = "Generate a detailed market research report summary based on the following topic: ";

export async function POST(request: Request) {
  const session = await auth();
  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'EDITOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { topic, locale } = await request.json(); // Expect a topic and locale from the request

    if (!topic || !locale) {
      return NextResponse.json({ error: 'Topic and locale are required' }, { status: 400 });
    }

    const fullPrompt = `${MASTER_PROMPT}${topic}. Ensure the output is in ${locale} language.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Or "gpt-3.5-turbo" for faster/cheaper
      messages: [{ role: "user", content: fullPrompt }],
    });

    const generatedContent = completion.choices[0]?.message?.content || '';

    // Store in AI Generation Queue
    const aiQueueItem = await prisma.aIGenerationQueue.create({
      data: {
        prompt: fullPrompt,
        outputJson: generatedContent, // Store as JSON string
        status: 'PENDING_REVIEW',
        locale: locale,
        // You might want to store sourceDocId or reportId here if applicable
        tokenCount: completion.usage?.total_tokens || 0,
        costCents: (completion.usage?.total_tokens || 0) * 0.00001 // Example cost calculation (adjust based on model pricing)
      },
    });

    return NextResponse.json({
      message: 'AI content generated and queued for review',
      content: generatedContent,
      queueId: aiQueueItem.id,
    }, { status: 200 });

  } catch (error) {
    console.error('Error generating AI content:', error);
    return NextResponse.json({ error: 'Failed to generate AI content' }, { status: 500 });
  }
}