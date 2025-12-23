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
  featuredCategories?: {
    link: string;
    image: string;
    label?: string;
    description?: string;
  }[];
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
  color: string;
};

type SocialConfig = {
  github?: SocialPlatform;
  x?: SocialPlatform;
  email?: SocialPlatform;
};

export const blogLayoutConfig: BlogLayoutConfig = {
  title: '雪花の博客',
  alternate: 'snow',
  subtitle: '爬起仅仅只是因为不想输。',
  name: 'cos',
  description: 'FE / ACG / 手工 / 深色模式强迫症 / INFP / 兴趣广泛养两只猫的老宅女 / remote',
  avatar: '/img/724d7fb480c8ac0db472ca5c7e36d239.jpg',
  showLogo: true,
  author: 'cos',
  site: 'https://xhblog.top/',
  startYear: 2022,
  keywords: ['snow', 'littleSnow', '博客', '个人空间', '技术', '前端'],
  featuredCategories: [
    {
      link: 'life',
      label: '随笔',
      image: '/img/cover/2.webp',
      description: '生活记录、年度总结等',
    },
    {
      link: 'note/front-end',
      label: '前端笔记',
      image: '/img/cover/1.webp',
      description: '前端相关的笔记',
    },
    {
      link: 'project',
      label: '项目集锦',
      image: '/img/cover/3.webp',
      description: '项目集锦',
    },
    {
      link: 'note',
      label: '笔记',
      image: '/img/cover/4.webp',
      description: '技术笔记、学习笔记等',
    },
    {
      link: 'tools',
      label: '工具',
      image: '/img/cover/11.webp',
      description: '工具使用、软件推荐等',
    },
    {
      link: 'coding-train',
      label: '题目记录',
      image: '/img/cover/6.webp',
      description: '曾经的刷题记录等',
    },
    {
      link: 'note/bytedance-note',
      label: '青训营笔记',
      image: '/img/cover/9.webp',
      description: '初学前端时的笔记',
    },
    {
      link: 'note/cs-basics',
      label: 'CS基础',
      image: '/img/cover/8.webp',
      description: '大学时期的 CS 基础笔记',
    },
  ],
  banner: {
    src: '/img/site_header_1920.webp',
    srcset: '/img/site_header_800.webp 800w,/img/site_header_1920.webp 1200w',
    lqipSrc: '/img/site_header_1920.webp',
    alt: 'cover',
  },
};

export const blogSocialConfig: SocialConfig = {
  github: {
    url: 'https://github.com/yusixian',
    label: 'GitHub',
    iconText: 'GH',
    color: '#191717',
  },
  x: {
    url: 'https://x.com/_cosine_x',
    label: 'X (推特)',
    iconText: 'X',
    color: '#4b9ae4',
  },
  email: {
    url: 'mailto:cosine_yu@qq.com',
    label: 'Email',
    iconText: '@',
    color: '#55acd5',
  },
};

const { title, alternate, subtitle } = blogLayoutConfig;

export const blogSeoConfig = {
  title: `${alternate ? alternate + ' = ' : ''}${title}${subtitle ? ' = ' + subtitle : ''}`,
  description: blogLayoutConfig.description,
  keywords: blogLayoutConfig?.keywords?.join(',') ?? '',
  url: blogLayoutConfig.site,
};

export const defaultCoverList = Array.from({ length: 13 }, (_, index) => index + 1).map((item) => `/img/cover/${item}.webp`);
