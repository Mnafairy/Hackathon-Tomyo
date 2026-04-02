export interface FeatureItem {
  title: string;
  description: string;
  span: string;
  gradient: string;
}

export const features: FeatureItem[] = [
  {
    title: 'Тэмцээн & Олимпиад',
    description:
      'Математик, шинжлэх ухаан, IT, урлаг зэрэг чиглэлийн тэмцээн, олимпиадуудыг нэг дороос олоорой.',
    span: 'md:col-span-8',
    gradient: 'from-ds-primary/60 to-ds-secondary/60',
  },
  {
    title: 'Төсөл & Хакатон',
    description: 'Сурагчдад зориулсан төсөл, хакатон, бүтээлч уралдаануудын мэдээлэл.',
    span: 'md:col-span-4',
    gradient: 'from-ds-tertiary/60 to-ds-primary/60',
  },
  {
    title: 'Тэтгэлэг & Хөтөлбөр',
    description:
      'Дотоод, гадаадын тэтгэлэг, сургалтын хөтөлбөр, зуны кэмпүүдийн мэдээллийг цуглуулсан.',
    span: 'md:col-span-4',
    gradient: 'from-ds-secondary/60 to-ds-tertiary/60',
  },
  {
    title: 'Хадгалах & Хуваалцах',
    description:
      'Таалагдсан боломжуудаа хадгалж, найз нөхөд, ангийнхандаа хуваалцаарай.',
    span: 'md:col-span-8',
    gradient: 'from-ds-primary/60 to-ds-tertiary/60',
  },
];
