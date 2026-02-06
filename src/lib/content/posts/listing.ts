import { weeklyConfig } from '@/config/weeklyConfig';
import type { BlogPost } from '@/types/blog';

import { DEFAULT_CATEGORY_NAME, getCategoryArr } from '../categories';
import {
  getVisibleBlogPosts,
  getVisibleBlogPostsSortedDesc,
  splitPostsBySticky,
} from '../repository';

export async function getSortedPosts(): Promise<BlogPost[]> {
  return getVisibleBlogPostsSortedDesc();
}

export async function getPostsBySticky(): Promise<{
  stickyPosts: BlogPost[];
  nonStickyPosts: BlogPost[];
}> {
  return splitPostsBySticky(await getSortedPosts());
}

export async function getPostCount(): Promise<number> {
  return (await getVisibleBlogPosts()).length;
}

export async function getPostsByCategory(
  categoryName: string,
): Promise<BlogPost[]> {
  return getPostsByCategoryPath(categoryName);
}

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

export async function getWeeklyPosts(): Promise<BlogPost[]> {
  return getPostsByCategory(weeklyConfig.categoryName);
}

export async function getNonWeeklyPosts(): Promise<BlogPost[]> {
  const posts = await getSortedPosts();
  return posts.filter(
    (post) => !isPostInCategory(post, weeklyConfig.categoryName),
  );
}

export async function getNonWeeklyPostsBySticky(): Promise<{
  stickyPosts: BlogPost[];
  nonStickyPosts: BlogPost[];
}> {
  return splitPostsBySticky(await getNonWeeklyPosts());
}
