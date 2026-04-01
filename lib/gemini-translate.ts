import { GoogleGenerativeAI } from '@google/generative-ai';

import { prisma } from '@/lib/prisma';

interface TranslationResult {
  title: string;
  description: string;
  summary: string;
}

export const translateOpportunity = async (
  opportunityId: string,
  targetLang: string = 'mn',
): Promise<TranslationResult> => {
  const existing = await prisma.translation.findUnique({
    where: { opportunityId_targetLang: { opportunityId, targetLang } },
  });

  if (existing?.status === 'COMPLETED') {
    return {
      title: existing.title,
      description: existing.description,
      summary: existing.summary ?? '',
    };
  }

  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
  });

  if (!opportunity) {
    throw new Error('Opportunity not found');
  }

  if (opportunity.originalLang === targetLang) {
    return {
      title: opportunity.title,
      description: opportunity.description,
      summary: '',
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `Translate this opportunity posting to Mongolian (mn). Return JSON only:
{"title":"...","description":"...","summary":"..."}

The summary should be 1-2 sentences explaining why this is relevant for Mongolian high school students.

Title: ${opportunity.title}
Description: ${opportunity.description}`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');

    const parsed = JSON.parse(text) as TranslationResult;

    await prisma.translation.upsert({
      where: { opportunityId_targetLang: { opportunityId, targetLang } },
      update: {
        title: parsed.title,
        description: parsed.description,
        summary: parsed.summary,
        status: 'COMPLETED',
        geminiModel: 'gemini-2.5-flash',
      },
      create: {
        opportunityId,
        targetLang,
        title: parsed.title,
        description: parsed.description,
        summary: parsed.summary,
        status: 'COMPLETED',
        geminiModel: 'gemini-2.5-flash',
      },
    });

    return parsed;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown';

    await prisma.translation.upsert({
      where: { opportunityId_targetLang: { opportunityId, targetLang } },
      update: { status: 'FAILED', errorMessage },
      create: {
        opportunityId,
        targetLang,
        title: opportunity.title,
        description: opportunity.description,
        status: 'FAILED',
        errorMessage,
      },
    });

    throw error;
  }
};
