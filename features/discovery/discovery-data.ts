export const SUBJECT_OPTIONS = [
  { key: 'MATHEMATICS', label: 'Математик' },
  { key: 'COMPUTER_SCIENCE', label: 'Мэдээллийн технологи' },
  { key: 'SCIENCE', label: 'Шинжлэх ухаан' },
  { key: 'ENGINEERING', label: 'Инженерчлэл' },
  { key: 'ARTS', label: 'Урлаг' },
  { key: 'HUMANITIES', label: 'Хүмүүнлэг' },
  { key: 'STEM', label: 'STEM' },
  { key: 'BUSINESS', label: 'Бизнес' },
];

export const TYPE_OPTIONS = [
  { key: 'COMPETITION', label: 'Тэмцээн' },
  { key: 'SCHOLARSHIP', label: 'Тэтгэлэг' },
  { key: 'GRANT', label: 'Грант' },
  { key: 'INTERNSHIP', label: 'Дадлага' },
  { key: 'JOB', label: 'Ажлын байр' },
];

export const TYPE_BADGE_CLASSES: Record<string, string> = {
  COMPETITION: 'bg-ds-primary-container text-on-primary-container',
  SCHOLARSHIP: 'bg-tertiary-container text-on-tertiary-container',
  GRANT: 'bg-secondary-container text-on-secondary-container',
  INTERNSHIP: 'bg-ds-tertiary/20 text-ds-tertiary',
  JOB: 'bg-surface-container-highest text-on-surface',
  OTHER: 'bg-surface-container text-on-surface-variant',
};

export const TYPE_LABELS: Record<string, string> = {
  COMPETITION: 'Тэмцээн',
  SCHOLARSHIP: 'Тэтгэлэг',
  GRANT: 'Грант',
  INTERNSHIP: 'Дадлага',
  JOB: 'Ажлын байр',
  OTHER: 'Бусад',
};

export const SUBJECT_LABELS: Record<string, string> = {
  MATHEMATICS: 'Математик',
  COMPUTER_SCIENCE: 'МТ',
  SCIENCE: 'Шинжлэх ухаан',
  ENGINEERING: 'Инженер',
  ARTS: 'Урлаг',
  HUMANITIES: 'Хүмүүнлэг',
  STEM: 'STEM',
  BUSINESS: 'Бизнес',
  TECHNOLOGY: 'Технологи',
  EDUCATION: 'Боловсрол',
  MEDICINE: 'Анагаах',
  OTHER: 'Бусад',
};

export const STATUS_BADGE_CLASSES: Record<string, string> = {
  ACTIVE: 'bg-green-500/15 text-green-600',
  EXPIRED: 'bg-red-500/15 text-red-600',
  UNKNOWN: 'bg-gray-500/15 text-gray-500',
};

export const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Идэвхтэй',
  EXPIRED: 'Хугацаа дууссан',
  UNKNOWN: 'Тодорхойгүй',
};

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  originalUrl: string;
  originalLang: string;
  imageUrl: string | null;
  type: string;
  subjects: string[];
  minAge: number | null;
  maxAge: number | null;
  status: string;
  deadline: string | null;
  scrapedAt: string;
  sourceName: string;
}

export const DELAY_CLASSES = [
  'delay-0', 'delay-1', 'delay-2', 'delay-3',
  'delay-4', 'delay-5', 'delay-6', 'delay-7',
];
