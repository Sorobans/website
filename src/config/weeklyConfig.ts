export type WeeklyConfig = {
  slug: string;
  categoryName: string;
  title: string;
  description?: string;
  cover?: string;
};

export const weeklyConfig: WeeklyConfig = {
  slug: 'weekly',
  categoryName: 'Weekly',
  title: 'Weekly Newsletter',
  description: 'A weekly review of tech insights and life fragments worth remembering.',
  cover: '/img/weekly_header.webp',
};