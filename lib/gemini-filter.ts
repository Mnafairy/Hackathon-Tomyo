import { GoogleGenerativeAI } from '@google/generative-ai';

import { ScrapedItem } from '@/lib/scraper';

export type OpportunityType =
  | 'JOB'
  | 'SCHOLARSHIP'
  | 'GRANT'
  | 'INTERNSHIP'
  | 'COMPETITION'
  | 'OTHER';

export type Subject =
  | 'STEM'
  | 'SCIENCE'
  | 'TECHNOLOGY'
  | 'ENGINEERING'
  | 'MATHEMATICS'
  | 'ARTS'
  | 'HUMANITIES'
  | 'SOCIAL_SCIENCE'
  | 'BUSINESS'
  | 'LAW'
  | 'MEDICINE'
  | 'COMPUTER_SCIENCE'
  | 'ENVIRONMENT'
  | 'DESIGN'
  | 'EDUCATION'
  | 'OTHER';

export interface ClassifiedItem extends ScrapedItem {
  type: OpportunityType;
  subjects: Subject[];
  minAge: number | null;
  maxAge: number | null;
}

const VALID_TYPES = new Set<string>([
  'JOB', 'SCHOLARSHIP', 'GRANT', 'INTERNSHIP', 'COMPETITION', 'OTHER',
]);

const VALID_SUBJECTS = new Set<string>([
  'STEM', 'SCIENCE', 'TECHNOLOGY', 'ENGINEERING', 'MATHEMATICS',
  'ARTS', 'HUMANITIES', 'SOCIAL_SCIENCE', 'BUSINESS', 'LAW',
  'MEDICINE', 'COMPUTER_SCIENCE', 'ENVIRONMENT', 'DESIGN', 'EDUCATION', 'OTHER',
]);

export const classifyWithGemini = async (
  items: ScrapedItem[],
): Promise<ClassifiedItem[]> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_key_here') {
    return items.map((item) => ({
      ...item,
      type: 'OTHER' as OpportunityType,
      subjects: [] as Subject[],
      minAge: null,
      maxAge: null,
    }));
  }

  if (items.length === 0) {
    return [];
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const articleList = items
    .map((item, i) => `[${i}] ${item.title}`)
    .join('\n');

  const prompt = `You are an opportunity classifier for high school and university students. Given article titles, do THREE things:

1. Filter: Keep only articles about scholarships, jobs, grants, internships, competitions, programs, or similar opportunities
2. Classify type: JOB, SCHOLARSHIP, GRANT, INTERNSHIP, COMPETITION, or OTHER
3. Classify subjects from: STEM, SCIENCE, TECHNOLOGY, ENGINEERING, MATHEMATICS, ARTS, HUMANITIES, SOCIAL_SCIENCE, BUSINESS, LAW, MEDICINE, COMPUTER_SCIENCE, ENVIRONMENT, DESIGN, EDUCATION, OTHER
4. Estimate age range if determinable (null otherwise). High school = minAge 14, maxAge 18. University = minAge 17, maxAge 25.

Articles:
${articleList}

Return ONLY a JSON array:
[{"index":0,"type":"SCHOLARSHIP","subjects":["SCIENCE","STEM"],"minAge":14,"maxAge":18}]

Rules:
- subjects is an array, can have multiple values
- minAge and maxAge are integers or null
- If NO articles match, return "NONE"
- No markdown, no explanation, just the JSON array`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    if (text === 'NONE' || text === '') {
      return [];
    }

    text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');

    const parsed = JSON.parse(text) as Array<{
      index: number;
      type: string;
      subjects?: string[];
      minAge?: number | null;
      maxAge?: number | null;
    }>;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (entry) =>
          typeof entry.index === 'number' &&
          entry.index >= 0 &&
          entry.index < items.length &&
          VALID_TYPES.has(entry.type),
      )
      .map((entry) => ({
        ...items[entry.index],
        type: entry.type as OpportunityType,
        subjects: (entry.subjects ?? []).filter((s) =>
          VALID_SUBJECTS.has(s),
        ) as Subject[],
        minAge: typeof entry.minAge === 'number' ? entry.minAge : null,
        maxAge: typeof entry.maxAge === 'number' ? entry.maxAge : null,
      }));
  } catch (error) {
    console.error(
      '[Gemini classify error]',
      error instanceof Error ? error.message : error,
    );
    return items.map((item) => ({
      ...item,
      type: 'OTHER' as OpportunityType,
      subjects: [] as Subject[],
      minAge: null,
      maxAge: null,
    }));
  }
};
