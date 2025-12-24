export type Router = {
  name?: string;
  path?: string;
  icon?: string;
  children?: Router[];
};

export const BLOG_BASE = '/blog';

export const withBlogBase = (path: string) => {
  if (!path || path === '/') return BLOG_BASE;
  return `${BLOG_BASE}${path.startsWith('/') ? path : `/${path}`}`;
};

export enum Routes {
  Home = BLOG_BASE,
  About = `${BLOG_BASE}/about`,
  Categories = `${BLOG_BASE}/categories`,
  Tags = `${BLOG_BASE}/tags`,
  Friends = `${BLOG_BASE}/friends`,
  // Gallery = `${BLOG_BASE}/gallery`,
  Post = `${BLOG_BASE}/post`,
  Posts = `${BLOG_BASE}/posts`,
  Archives = `${BLOG_BASE}/archives`,
  // Dashboard = `${BLOG_BASE}/dashboard`,
}

export const routers: Router[] = [
  { name: '首页', path: Routes.Home, icon: 'fa-solid fa-house-chimney' },
  {
    name: '文章',
    icon: 'fa-solid fa-pen-nib',
    children: [
      { name: '分类', path: Routes.Categories, icon: 'fa-solid fa-layer-group' },
      { name: '标签', path: Routes.Tags, icon: 'fa-solid fa-tags' },
    ],
  },
  { name: '友链', path: Routes.Friends, icon: 'fa-solid fa-link' },
  { name: '关于', path: Routes.About, icon: 'fa-regular fa-circle-user' },
];
