export const TYPE_LABELS: Record<string, string> = {
  SCHOLARSHIP: 'Тэтгэлэг',
  JOB: 'Ажлын байр',
  GRANT: 'Грант',
  INTERNSHIP: 'Дадлага',
  COMPETITION: 'Тэмцээн',
  OTHER: 'Бусад',
};

export const TYPE_BADGE_CLASSES: Record<string, string> = {
  COMPETITION: 'bg-ds-primary-container text-on-primary-container',
  SCHOLARSHIP: 'bg-tertiary-container text-on-tertiary-container',
  GRANT: 'bg-secondary-container text-on-secondary-container',
  INTERNSHIP: 'bg-ds-tertiary/20 text-ds-tertiary',
  JOB: 'bg-surface-container-highest text-on-surface',
  OTHER: 'bg-surface-container text-on-surface-variant',
};

export const SUBJECT_LABELS: Record<string, string> = {
  STEM: 'STEM',
  SCIENCE: 'Шинжлэх ухаан',
  TECHNOLOGY: 'Технологи',
  MATHEMATICS: 'Математик',
  COMPUTER_SCIENCE: 'Компьютерийн ухаан',
  ENGINEERING: 'Инженерчлэл',
  ARTS: 'Урлаг',
  HUMANITIES: 'Хүмүүнлэг',
  SOCIAL_SCIENCE: 'Нийгмийн шинжлэх ухаан',
  BUSINESS: 'Бизнес',
  LAW: 'Хууль',
  MEDICINE: 'Анагаах ухаан',
  ENVIRONMENT: 'Байгаль орчин',
  DESIGN: 'Дизайн',
  EDUCATION: 'Боловсрол',
  OTHER: 'Бусад',
};

export const formatDate = (date: Date | null) => {
  if (!date) return null;
  return new Intl.DateTimeFormat('mn-MN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};
