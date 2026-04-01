import { GoogleGenerativeAI } from '@google/generative-ai';

import { NewsItem } from '@/lib/scraper';

export const filterWithGemini = async (
  items: NewsItem[],
  criteria: string,
): Promise<NewsItem[]> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_key_here') {
    return items;
  }

  if (items.length === 0) {
    return [];
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const articleList = items
    .map((item, i) => `[${i}] ${item.title}`)
    .join('\n');

  const prompt = `You are a news article filter. Given the following list of article titles, return ONLY the indices (numbers) of articles that match this criteria: "${criteria}".

Articles:
${articleList}

Rules:
- Return ONLY a comma-separated list of matching indices (e.g., "0,2,5")
- If NO articles match, return exactly "NONE"
- Do not include any other text or explanation`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    if (text === 'NONE' || text === '') {
      return [];
    }

    const indices = text
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n >= 0 && n < items.length);

    if (indices.length === 0) {
      return [];
    }

    return indices.map((i) => items[i]);
  } catch (error) {
    console.error('[Gemini filter error]', error instanceof Error ? error.message : error);
    return items;
  }
};
