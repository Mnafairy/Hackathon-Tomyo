import { GoogleGenerativeAI } from '@google/generative-ai';

import { ScrapedItem } from '@/lib/scraper';

export type OpportunityType =
  | 'JOB'
  | 'SCHOLARSHIP'
  | 'GRANT'
  | 'INTERNSHIP'
  | 'COMPETITION'
  | 'OTHER';

export type OpportunityStatus = 'ACTIVE' | 'EXPIRED' | 'UNKNOWN';

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
  deadline: Date | null;
  status: OpportunityStatus;
}

const VALID_TYPES = new Set<string>([
  'JOB', 'SCHOLARSHIP', 'GRANT', 'INTERNSHIP', 'COMPETITION', 'OTHER',
]);

const VALID_SUBJECTS = new Set<string>([
  'STEM', 'SCIENCE', 'TECHNOLOGY', 'ENGINEERING', 'MATHEMATICS',
  'ARTS', 'HUMANITIES', 'SOCIAL_SCIENCE', 'BUSINESS', 'LAW',
  'MEDICINE', 'COMPUTER_SCIENCE', 'ENVIRONMENT', 'DESIGN', 'EDUCATION', 'OTHER',
]);

const VALID_STATUSES = new Set<string>(['ACTIVE', 'EXPIRED', 'UNKNOWN']);

const REJECT_PATTERNS: RegExp[] = [
  /дүн\s*(гарлаа|гарсан|зарлалаа)/i,
  /үр\s*дүн/i,
  /шалгарлаа/i,
  /шалгаруулав/i,
  /байр\s*эзэлсэн/i,
  /амжилттай\s*(болж|зохион)/i,
  /өндөрлөлөө/i,
  /болж\s*өнгөрлөө/i,
  /зохион\s*байгуулагдлаа/i,
  /шагнал\s*гардуул/i,
  /гардуулах\s*ёслол/i,
  /\bresults?\b/i,
  /\bwinners?\b/i,
  /\brankings?\b/i,
  /successfully\s+concluded/i,
];

const matchesRejectPattern = (title: string, description: string): boolean => {
  const text = `${title} ${description}`;
  return REJECT_PATTERNS.some((pattern) => pattern.test(text));
};

const parseDeadline = (value: string | null | undefined): Date | null => {
  if (!value) return null;
  const date = new Date(value);
  if (isNaN(date.getTime())) return null;
  return date;
};

const resolveStatus = (
  status: OpportunityStatus,
  deadline: Date | null,
): OpportunityStatus => {
  if (!deadline) return status;
  const now = new Date();
  if (deadline < now) return 'EXPIRED';
  if (deadline > now) return 'ACTIVE';
  return status;
};

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
      deadline: null,
      status: 'UNKNOWN' as OpportunityStatus,
    }));
  }

  if (items.length === 0) {
    return [];
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const today = new Date().toISOString().split('T')[0];

  const articleList = items
    .map(
      (item, i) =>
        `[${i}] Title: ${item.title}\n    Description: ${item.description.substring(0, 200)}\n    Date: ${item.scrapedDate || 'unknown'}`,
    )
    .join('\n');

  const prompt = `You are an opportunity classifier for Mongolian HIGH SCHOOL and MIDDLE SCHOOL students (ages 12-18). Today is ${today}.

Given scraped articles, you must:

1. **FILTER** — Keep articles that are opportunities students aged 12-18 can apply for, register for, or participate in. Be INCLUSIVE for anything that could benefit high school or middle school students.

KEEP:
- Scholarships, grants, fellowships (including university prep scholarships for high schoolers)
- Competitions, olympiads, hackathons (math, science, IT, arts, language, etc.)
- Summer programs, camps, workshops, training programs
- Exchange programs, study abroad opportunities for high schoolers
- Events, fairs, exhibitions students can attend or register for
- Internships or volunteer programs open to high school students
- University scholarships that high school seniors can apply for NOW

REJECT (do NOT include in output):
- Results, outcomes, rankings of past events ("дүн гарлаа", "үр дүн", "шалгарлаа", "winners", "rankings")
- Event recaps ("амжилттай болж өндөрлөлөө", "зохион байгуулагдлаа", "болж өнгөрлөө")
- Award ceremonies ("шагнал гардуулав", "гардуулах ёслол")
- University-internal opportunities NOT open to high schoolers (e.g. "багшлах эрх олгох сургалт", faculty training, graduate programs, PhD positions)
- Government policy news, budget approvals, institutional announcements
- Faculty/staff job postings
- Academic papers, research summaries

KEY DISTINCTION: "Олимпиадын бүртгэл эхэллээ" (registration opened) = KEEP. "Олимпиадын дүн гарлаа" (results released) = REJECT.

2. **CLASSIFY** each kept item:
- type: JOB, SCHOLARSHIP, GRANT, INTERNSHIP, COMPETITION, or OTHER
- subjects: array from [STEM, SCIENCE, TECHNOLOGY, ENGINEERING, MATHEMATICS, ARTS, HUMANITIES, SOCIAL_SCIENCE, BUSINESS, LAW, MEDICINE, COMPUTER_SCIENCE, ENVIRONMENT, DESIGN, EDUCATION, OTHER]
- minAge/maxAge: integers or null. Middle school = 12-15. High school = 14-18.
- deadline: ISO date string ("2026-05-15") if a deadline/registration date is mentioned or inferable, otherwise null
- status: "ACTIVE" if deadline is in the future or opportunity is ongoing, "EXPIRED" if deadline has passed, "UNKNOWN" if no date is determinable
- confidence: integer 1-5, how confident you are this is relevant to high school/middle school students (5 = clearly for them, 1 = probably not)

Articles:
${articleList}

Return ONLY a JSON array:
[{"index":0,"type":"COMPETITION","subjects":["MATHEMATICS"],"minAge":14,"maxAge":18,"deadline":"2026-05-15","status":"ACTIVE","confidence":4}]

Rules:
- Be STRICT: when in doubt, REJECT the article rather than including it
- Only include items with confidence >= 3
- subjects is an array, can have multiple values
- minAge and maxAge are integers or null
- deadline is an ISO date string or null
- status is "ACTIVE", "EXPIRED", or "UNKNOWN"
- confidence is an integer 1-5
- If NO articles qualify, return "NONE"
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
      deadline?: string | null;
      status?: string;
      confidence?: number;
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
          VALID_TYPES.has(entry.type) &&
          (entry.confidence ?? 0) >= 3,
      )
      .map((entry) => {
        const deadline = parseDeadline(entry.deadline);
        const rawStatus = VALID_STATUSES.has(entry.status ?? '')
          ? (entry.status as OpportunityStatus)
          : 'UNKNOWN';
        const status = resolveStatus(rawStatus, deadline);

        return {
          ...items[entry.index],
          type: entry.type as OpportunityType,
          subjects: (entry.subjects ?? []).filter((s) =>
            VALID_SUBJECTS.has(s),
          ) as Subject[],
          minAge: typeof entry.minAge === 'number' ? entry.minAge : null,
          maxAge: typeof entry.maxAge === 'number' ? entry.maxAge : null,
          deadline,
          status,
        };
      })
      .filter((item) => !matchesRejectPattern(item.title, item.description));
  } catch (error) {
    console.error(
      '[Gemini classify error]',
      error instanceof Error ? error.message : error,
    );
    return [];
  }
};
