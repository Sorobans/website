type BlogLayoutConfig = {
  title: string;
  alternate?: string;
  subtitle?: string;
  name: string;
  description?: string;
  avatar?: string;
  showLogo?: boolean;
  author?: string;
  site: string;
  startYear?: number;
  keywords?: string[];
  banner: {
    src: string;
    srcset: string;
    lqipSrc: string;
    alt?: string;
  };
};

type SocialPlatform = {
  url: string;
  label: string;
  iconText: string;
  iconClass?: string; // Font Awesome icon class
  color: string;
};

type SocialConfig = {
  github?: SocialPlatform;
  x?: SocialPlatform;
  email?: SocialPlatform;
  telegram?: SocialPlatform;
  bilibili?: SocialPlatform;
};

export const blogLayoutConfig: BlogLayoutConfig = {
  title: 'Soroban',
  subtitle: 'Developer Blog And Updates',
  name: 'Soroban',
  description: 'ACG / Retro Tech / Vintage / Developer',
  avatar: '/img/724d7fb480c8ac0db472ca5c7e36d239.jpg',
  showLogo: true,
  author: 'Soroban',
  site: 'https://sorobans.github.io/',
  startYear: 2022,
  keywords: ['Soroban', 'Soroban Developer', 'Developer Soroban', 'Sorobans Website', 'Sorobans', 'Soro'],
  banner: {
    src: '/img/site_header_1920.webp',
    srcset: '/img/site_header_800.webp 800w,/img/site_header_1920.webp 1200w',
    lqipSrc: '/img/site_header_1920.webp',
    alt: 'cover',
  },
};

export const blogSocialConfig: SocialConfig = {
  github: {
    url: 'https://github.com/Sorobans',
    label: 'GitHub',
    iconText: 'GH',
    iconClass: 'fa-brands fa-github',
    color: '#191717',
  },
  x: {
    url: 'https://x.com/ImSoroban',
    label: 'X (Twitter)',
    iconText: 'X',
    iconClass: 'fa-brands fa-x-twitter',
    color: '#4b9ae4',
  },
  email: {
    url: 'mailto:vallunacys@gmail.com',
    label: 'Email',
    iconText: '@',
    iconClass: 'fa-regular fa-envelope',
    color: '#55acd5',
  },
  youtube: {
    url: 'https://youtube.com/Sorobans',
    label: 'YouTube',
    iconText: 'YT',
    iconClass: 'fa-brands fa-youtube',
    color: '#229ed9',
  },
  bilibili: {
    url: 'https://space.bilibili.com/158525031',
    label: '哔哩哔哩',
    iconText: 'B',
    iconClass: 'fa-brands fa-bilibili',
    color: '#00a1d6',
  },
};

const { title, alternate, subtitle } = blogLayoutConfig;

export const blogSeoConfig = {
  title: `${alternate ? alternate + ' = ' : ''}${title}${subtitle ? ' = ' + subtitle : ''}`,
  description: blogLayoutConfig.description,
  keywords: blogLayoutConfig?.keywords?.join(',') ?? '',
  url: blogLayoutConfig.site,
};

export const defaultCoverList = Array.from(
  { length: 13 },
  (_, index) => index + 1,
).map((item) => `/img/cover/${item}.webp`);
