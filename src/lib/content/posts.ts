/**
 * 文章相关工具函数
 */

import summaries from '@/cache/summaries.json';
import { weeklyConfig } from '@/config/weeklyConfig';
import type { BlogPost } from '@/types/blog';
import { Routes } from '@constants/router';
import type { Page } from 'astro';

import { extractTextFromMarkdown } from '../sanitize';
import {
  buildCategoryPath,
  DEFAULT_CATEGORY_NAME,
  getCategoryArr,
} from './categories';
import {
  getPostStableKey,
  getVisibleBlogPosts,
  getVisibleBlogPostsSortedAsc,
  getVisibleBlogPostsSortedDesc,
  splitPostsBySticky,
} from './repository';

/** AI 摘要数据类型 */
type SummariesData = Record<string, { title: string; summary: string }>;
let postIndexMapCache: Promise<Map<string, number>> | null = null;

/**
 * 获取文章描述
 * 优先使用 frontmatter description，否则从正文提取
 */
export function getPostDescription(
  post: BlogPost,
  maxLength: number = 150,
): string {
  return (
    post.data.description || extractTextFromMarkdown(post.body ?? '', maxLength)
  );
}

/**
 * 获取文章 AI 摘要
 */
export function getPostSummary(slug: string): string | null {
  const data = summaries as SummariesData;
  return data[slug]?.summary ?? null;
}

/**
 * 获取文章描述，带 AI 摘要回退
 * 优先级：description > AI 摘要 > 正文提取
 */
export function getPostDescriptionWithSummary(
  post: BlogPost,
  maxLength: number = 150,
): string {
  const key = getPostStableKey(post);
  return (
    post.data.description ||
    getPostSummary(key) ||
    extractTextFromMarkdown(post.body ?? '', maxLength)
  );
}

/**
 * 构建文章序号索引（最早文章为 1）
 */
export async function getPostIndexMap(): Promise<Map<string, number>> {
  const buildMap = async (): Promise<Map<string, number>> => {
    const sorted = await getVisibleBlogPostsSortedAsc();
    const map = new Map<string, number>();

    sorted.forEach((post, index) => {
      const key = getPostStableKey(post);
      if (key) {
        map.set(key, index + 1);
      }
    });

    return map;
  };

  if (import.meta.env.DEV) {
    return buildMap();
  }

  if (!postIndexMapCache) {
    postIndexMapCache = buildMap();
  }

  return new Map(await postIndexMapCache);
}

export function getPostIndex(
  post: BlogPost,
  indexMap: Map<string, number>,
): number | null {
  const key = getPostStableKey(post);
  if (!key) return null;
  return indexMap.get(key) ?? null;
}

export function getPostHref(
  post: BlogPost,
  indexMap?: Map<string, number>,
): string {
  if (indexMap) {
    const index = getPostIndex(post, indexMap);
    if (index) return `${Routes.Post}/${index}`;
  }

  const key = getPostStableKey(post);
  return key ? `${Routes.Post}/${key}` : Routes.Post;
}

/**
 * 获取按日期降序排列的文章（最新在前）
 */
export async function getSortedPosts(): Promise<BlogPost[]> {
  return getVisibleBlogPostsSortedDesc();
}

/**
 * 按置顶状态拆分文章
 */
export async function getPostsBySticky(): Promise<{
  stickyPosts: BlogPost[];
  nonStickyPosts: BlogPost[];
}> {
  return splitPostsBySticky(await getSortedPosts());
}

/**
 * 获取文章总数（生产环境排除草稿）
 */
export async function getPostCount(): Promise<number> {
  return (await getVisibleBlogPosts()).length;
}

/**
 * 兼容旧接口：按分类名筛选文章。
 * 新代码优先使用 getPostsByCategoryPath 以避免同名分类歧义。
 */
export async function getPostsByCategory(
  categoryName: string,
): Promise<BlogPost[]> {
  return getPostsByCategoryPath(categoryName);
}

/**
 * 获取指定分类路径下的文章（包含子路径）。
 */
export async function getPostsByCategoryPath(
  categoryPath: string | string[],
): Promise<BlogPost[]> {
  const rawPath = Array.isArray(categoryPath) ? categoryPath : [categoryPath];
  const normalizedPath = rawPath
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
  const targetPath =
    normalizedPath.length > 0 ? normalizedPath : [DEFAULT_CATEGORY_NAME];
  const posts = await getSortedPosts();

  return posts.filter((post) => {
    if (post.data.catalog === false) return false;
    const postPath = getCategoryArr(post.data.categories);
    if (postPath.length < targetPath.length) return false;

    return targetPath.every((name, index) => postPath[index] === name);
  });
}

function isPostInCategory(post: BlogPost, categoryName: string): boolean {
  if (!categoryName) return false;
  return getCategoryArr(post.data.categories).includes(categoryName);
}

/**
 * 获取周刊文章（按日期降序）
 */
export async function getWeeklyPosts(): Promise<BlogPost[]> {
  return getPostsByCategory(weeklyConfig.categoryName);
}

/**
 * 获取非周刊文章（按日期降序）
 */
export async function getNonWeeklyPosts(): Promise<BlogPost[]> {
  const posts = await getSortedPosts();
  return posts.filter(
    (post) => !isPostInCategory(post, weeklyConfig.categoryName),
  );
}

/**
 * 获取非周刊文章并按置顶状态拆分
 */
export async function getNonWeeklyPostsBySticky(): Promise<{
  stickyPosts: BlogPost[];
  nonStickyPosts: BlogPost[];
}> {
  return splitPostsBySticky(await getNonWeeklyPosts());
}

/**
 * 获取文章最深层分类
 */
export function getPostLastCategory(post: BlogPost): {
  link: string;
  name: string;
} {
  const categoryPath = getCategoryArr(post.data.categories);

  if (categoryPath.length === 0) {
    return {
      link: buildCategoryPath(DEFAULT_CATEGORY_NAME),
      name: DEFAULT_CATEGORY_NAME,
    };
  }

  return {
    link: buildCategoryPath(categoryPath),
    name: categoryPath[categoryPath.length - 1],
  };
}

/**
 * Fisher-Yates 洗牌算法
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 获取随机文章
 */
export async function getRandomPosts(count: number = 10): Promise<BlogPost[]> {
  const posts = await getSortedPosts();
  const shuffled = shuffleArray(posts);
  return shuffled.slice(0, Math.min(count, posts.length));
}

/**
 * 获取文章所属系列（按最深分类）
 */
export async function getSeriesPosts(post: BlogPost): Promise<BlogPost[]> {
  const categoryPath = getCategoryArr(post.data.categories);
  if (categoryPath.length === 0) return [];
  return getPostsByCategoryPath(categoryPath);
}

/**
 * 获取系列中的上一篇和下一篇
 */
export async function getAdjacentSeriesPosts(currentPost: BlogPost): Promise<{
  prevPost: BlogPost | null;
  nextPost: BlogPost | null;
}> {
  const seriesPosts = await getSeriesPosts(currentPost);
  if (seriesPosts.length === 0) {
    return { prevPost: null, nextPost: null };
  }

  const currentKey = getPostStableKey(currentPost);
  const currentIndex = seriesPosts.findIndex(
    (post) => getPostStableKey(post) === currentKey,
  );
  if (currentIndex === -1) {
    return { prevPost: null, nextPost: null };
  }

  const prevPost = currentIndex > 0 ? seriesPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < seriesPosts.length - 1
      ? seriesPosts[currentIndex + 1]
      : null;

  return { prevPost, nextPost };
}

/**
 * 按年份分组文章（输入需为按日期降序的列表）。
 */
export function groupPostsByYear(
  posts: BlogPost[],
): Record<number, BlogPost[]> {
  return posts.reduce(
    (result, post) => {
      const year = new Date(post.data.date).getFullYear();
      if (!result[year]) {
        result[year] = [];
      }
      result[year].push(post);
      return result;
    },
    {} as Record<number, BlogPost[]>,
  );
}

/**
 * 归档页数据：文章列表、按年分组结果、年份列表。
 */
export async function getArchiveData(): Promise<{
  posts: BlogPost[];
  postsByYear: Record<number, BlogPost[]>;
  years: number[];
}> {
  const posts = await getSortedPosts();
  const postsByYear = groupPostsByYear(posts);
  const years = Object.keys(postsByYear)
    .map((year) => Number(year))
    .sort((a, b) => b - a);

  return { posts, postsByYear, years };
}

export type PostSummarySource = 'description' | 'ai' | 'auto';

export interface PostSummaryData {
  text: string;
  source: PostSummarySource;
}

export interface PostLinkItem {
  post: BlogPost;
  href: string;
}

/**
 * 获取文章摘要面板数据，统一摘要优先级规则。
 */
export function getPostSummaryData(
  post: BlogPost,
  autoLength: number = 200,
): PostSummaryData {
  if (post.data.description) {
    return {
      text: post.data.description,
      source: 'description',
    };
  }

  const key = getPostStableKey(post);
  const aiSummary = getPostSummary(key);
  if (aiSummary) {
    return {
      text: aiSummary,
      source: 'ai',
    };
  }

  return {
    text: extractTextFromMarkdown(post.body ?? '', autoLength),
    source: 'auto',
  };
}

/**
 * 构建文章分类面包屑数据。
 */
export function getPostCategoryBreadcrumbs(
  post: BlogPost,
): Array<{ name: string; link: string }> {
  const categoryArr = getCategoryArr(post.data.categories);
  if (categoryArr.length === 0) return [];

  return categoryArr.map((name, index) => ({
    name,
    link: buildCategoryPath(categoryArr.slice(0, index + 1)),
  }));
}

/**
 * 获取文章关键词（标签 + 分类）用于 SEO。
 */
export function getPostKeywords(post: BlogPost): string[] {
  const tags = Array.isArray(post.data.tags)
    ? post.data.tags
    : post.data.tags
      ? [post.data.tags]
      : [];
  const categories = getCategoryArr(post.data.categories);
  return categories.length > 0 ? tags.concat(categories) : tags;
}

/**
 * 构建文章页侧栏的系列导航数据。
 */
export async function getPostSeriesViewModel(post: BlogPost): Promise<{
  seriesPostItems: PostLinkItem[];
  prevPostItem: PostLinkItem | null;
  nextPostItem: PostLinkItem | null;
  currentPostSlug: string;
}> {
  const [seriesPosts, postIndexMap, adjacentPosts] = await Promise.all([
    getSeriesPosts(post),
    getPostIndexMap(),
    getAdjacentSeriesPosts(post),
  ]);

  const seriesPostItems = seriesPosts.map((seriesPost) => ({
    post: seriesPost,
    href: getPostHref(seriesPost, postIndexMap),
  }));

  const prevPostItem = adjacentPosts.prevPost
    ? {
        post: adjacentPosts.prevPost,
        href: getPostHref(adjacentPosts.prevPost, postIndexMap),
      }
    : null;
  const nextPostItem = adjacentPosts.nextPost
    ? {
        post: adjacentPosts.nextPost,
        href: getPostHref(adjacentPosts.nextPost, postIndexMap),
      }
    : null;

  return {
    seriesPostItems,
    prevPostItem,
    nextPostItem,
    currentPostSlug: getPostStableKey(post),
  };
}

/**
 * 构建首页第一页的分页数据。
 */
export function buildHomePageData(
  allPosts: BlogPost[],
  pageSize: number = 10,
): {
  posts: BlogPost[];
  page: Page<BlogPost>;
} {
  const posts = allPosts.slice(0, pageSize);
  const lastPage = Math.max(1, Math.ceil(allPosts.length / pageSize));

  return {
    posts,
    page: {
      data: posts,
      start: 0,
      end: Math.max(0, posts.length - 1),
      size: pageSize,
      total: allPosts.length,
      currentPage: 1,
      lastPage,
      url: {
        current: Routes.Home,
        prev: undefined,
        next: allPosts.length > pageSize ? `${Routes.Posts}/2` : undefined,
        first: Routes.Home,
        last: `${Routes.Posts}/${lastPage}`,
      },
    },
  };
}
