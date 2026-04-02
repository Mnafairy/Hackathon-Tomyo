export interface Channel {
  emoji: string;
  name: string;
  active: boolean;
}

export interface ThreadAttachment {
  name: string;
  size: string;
}

export interface Thread {
  id: number;
  author: string;
  time: string;
  category: string;
  votes: number;
  title: string;
  preview: string;
  comments: number;
  pinned: boolean;
  attachment: ThreadAttachment | null;
  highlighted: boolean;
}

export interface CommunityProject {
  title: string;
  contributors: number;
  gradient: string;
}

export const channels: Channel[] = [
  { emoji: '💬', name: 'Ерөнхий', active: true },
  { emoji: '📐', name: 'Математик', active: false },
  { emoji: '🔬', name: 'Шинжлэх ухаан', active: false },
  { emoji: '💻', name: 'Технологи', active: false },
];

export const trendingTags = ['#олимпиад', '#хакатон', '#STEM', '#тэтгэлэг'];

export const threads: Thread[] = [
  {
    id: 1,
    author: 'Б. Тэмүүлэн',
    time: '2 цагийн өмнө',
    category: 'Ерөнхий',
    votes: 142,
    title:
      'Олимпиадын бэлтгэл хэрхэн эхлэх вэ? Туршлагатай хүмүүсээс зөвлөгөө авмаар байна',
    preview:
      'Сайн байна уу! Би 10-р ангийн сурагч бөгөөд энэ жил анх удаа олимпиадад оролцохоор бэлдэж байна. Ямар номноос эхлэх, хэрхэн цагаа зөв хуваарилах талаар зөвлөгөө өгөөч.',
    comments: 48,
    pinned: false,
    attachment: null,
    highlighted: false,
  },
  {
    id: 2,
    author: 'А. Сарнай',
    time: '5 цагийн өмнө',
    category: 'Математик',
    votes: 89,
    title: 'Математикийн олимпиадын бэлтгэл материалуудыг хуваалцъя',
    preview:
      'Математикийн олимпиадад бэлдэж буй сурагчдад зориулж миний цуглуулсан материалуудыг хуваалцаж байна.',
    comments: 12,
    pinned: false,
    attachment: { name: 'Олимпиад_бэлтгэл.pdf', size: '2.4 MB' },
    highlighted: true,
  },
  {
    id: 3,
    author: 'Модератор',
    time: '1 өдрийн өмнө',
    category: 'Ерөнхий',
    votes: 215,
    title: 'Улирлын хакатон: Бүртгэл нээгдлээ!',
    preview:
      'Энэ улирлын хакатон ирэх сарын 15-нд эхлэх бөгөөд бүх ахлах ангийн сурагчдад нээлттэй. Багаараа эсвэл ганцаараа бүртгүүлээрэй!',
    comments: 67,
    pinned: true,
    attachment: null,
    highlighted: false,
  },
];

export const projects: CommunityProject[] = [
  {
    title: 'EcoMongolia Апп',
    contributors: 12,
    gradient: 'from-ds-primary/60 to-ds-tertiary/40',
  },
  {
    title: 'MathBattle Тэмцээн',
    contributors: 8,
    gradient: 'from-ds-secondary/60 to-ds-primary/40',
  },
];

export const threadDelays = ['delay-1', 'delay-2', 'delay-3'];
