import { GoogleGenAI } from '@google/genai';

import { ScrapedItem } from '@/lib/scraper';

export interface SocialSourceConfig {
  name: string;
  nameInMongolian: string;
  url: string;
  keywords?: string[];
}

export const facebookPages: SocialSourceConfig[] = [
  {
    name: 'Tomyo School',
    nameInMongolian: 'Томёо сургууль',
    url: 'https://www.facebook.com/tomyoschool',
    keywords: ['хакатон', 'тэмцээн', 'бүртгэл', 'хөтөлбөр'],
  },
];

export const scrapeFacebookPages = async (
  pages: SocialSourceConfig[],
): Promise<ScrapedItem[]> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_key_here' || pages.length === 0) {
    return [];
  }

  const ai = new GoogleGenAI({ apiKey });
  const today = new Date().toISOString().split('T')[0];
  const allItems: ScrapedItem[] = [];

  for (const page of pages) {
    const extraKeywords = page.keywords?.join(', ') ?? '';
    const searchTerms = [
      `"${page.nameInMongolian}" тэмцээн бүртгэл 2026`,
      `"${page.nameInMongolian}" хакатон 2026`,
      `"${page.nameInMongolian}" хөтөлбөр сурагч`,
      `"${page.name}" competition registration 2026`,
    ];

    const prompt = `Today is ${today}. You must search Google for recent opportunities from "${page.name}" (${page.nameInMongolian}).

Search for these terms:
${searchTerms.map((t) => `- ${t}`).join('\n')}
${extraKeywords ? `Also search: ${page.nameInMongolian} ${extraKeywords}` : ''}

Find ACTIONABLE opportunities for Mongolian middle/high school students (ages 12-18) that they can register for, apply to, or participate in. Look for:
- Hackathons, competitions, olympiads
- Programs, workshops, camps
- Scholarships, grants
- Events with open registration

For each opportunity found, return a JSON object:
- "title": clear title in the original language
- "description": 2-3 sentence summary in the original language
- "originalUrl": source URL where you found it (news article, website, etc.)
- "date": when it was posted or when the event is (ISO date or "unknown")

Rules:
- ONLY include opportunities that are currently open or upcoming (not past events)
- Skip results, recaps, congratulations, or general news
- Include the source URL where you found the information
- Return ONLY a JSON array, no markdown, no explanation
- If nothing found, return "NONE"`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      let text = response.text?.trim() ?? '';

      if (text === 'NONE' || text === '') {
        continue;
      }

      text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');

      const parsed = JSON.parse(text) as Array<{
        title: string;
        description: string;
        originalUrl: string;
        date: string;
      }>;

      if (!Array.isArray(parsed)) continue;

      for (const entry of parsed) {
        if (!entry.title || entry.title.length < 5) continue;

        allItems.push({
          sourceName: page.name,
          sourceUrl: page.url,
          title: entry.title,
          description: entry.description ?? '',
          originalUrl: entry.originalUrl || page.url,
          imageUrl: null,
          originalLang: 'mn',
          scrapedDate: entry.date ?? '',
        });
      }
    } catch (error) {
      console.error(
        `[Social scraper error: ${page.name}]`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  return allItems;
};
