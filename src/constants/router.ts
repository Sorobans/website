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
  Weekly = `${BLOG_BASE}/weekly`,
  // Gallery = `${BLOG_BASE}/gallery`,
  Post = `${BLOG_BASE}/post`,
  Posts = `${BLOG_BASE}/posts`,
  Archives = `${BLOG_BASE}/archives`,
  // Dashboard = `${BLOG_BASE}/dashboard`,
}

export const routers: Router[] = [
  { name: 'Home', path: Routes.Home, icon: 'fa-solid fa-house-chimney' },
  {
    name: 'Articles',
    icon: 'fa-solid fa-pen-nib',
    children: [
      {
        name: 'Catagories',
        path: Routes.Categories,
        icon: 'fa-solid fa-layer-group',
      },
      { name: 'Tags', path: Routes.Tags, icon: 'fa-solid fa-tags' },
      { name: 'Weekly', path: Routes.Weekly, icon: 'fa-regular fa-newspaper' },
    ],
  },
  { name: 'Friends', path: Routes.Friends, icon: 'fa-solid fa-link' },
  { name: 'About', path: Routes.About, icon: 'fa-regular fa-circle-user' },
];
