/**
 * 分类相关工具函数
 */

import { categoryMap } from '@constants/category';
import { withBlogBase } from '@constants/router';

import { getVisibleBlogPosts } from './repository';
import type { Category, CategoryListResult } from './types';

export const DEFAULT_CATEGORY_NAME = '技术教程';

const REVERSE_CATEGORY_MAP = Object.fromEntries(
  Object.entries(categoryMap).map(([key, value]) => [value, key]),
);

function normalizeCategoryPathInput(
  categoryNames: string | string[],
): string[] {
  return Array.isArray(categoryNames) ? categoryNames : [categoryNames];
}

/**
 * 分类计数键使用完整路径，避免同名分类互相污染。
 */
export function getCategoryCountKey(categoryNames: string | string[]): string {
  return JSON.stringify(normalizeCategoryPathInput(categoryNames));
}

/**
 * 读取分类路径对应的计数，未命中时返回 0。
 */
export function getCategoryCount(
  countMap: Record<string, number>,
  categoryNames: string | string[],
): number {
  return countMap[getCategoryCountKey(categoryNames)] ?? 0;
}

function normalizeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

function normalizeCategories(
  categories?: string | string[] | string[][],
): string[][] {
  if (!categories) return [[DEFAULT_CATEGORY_NAME]];

  if (Array.isArray(categories)) {
    if (categories.length === 0) return [[DEFAULT_CATEGORY_NAME]];

    const first = categories[0];
    if (Array.isArray(first)) {
      const path = first.filter(
        (name) => typeof name === 'string' && name.trim().length > 0,
      );
      return [path.length > 0 ? path : [DEFAULT_CATEGORY_NAME]];
    }

    const path = categories.filter(
      (name): name is string =>
        typeof name === 'string' && name.trim().length > 0,
    );
    return [path.length > 0 ? path : [DEFAULT_CATEGORY_NAME]];
  }

  return [[categories]];
}

function upsertCategoryPath(rootCategories: Category[], path: string[]): void {
  let currentLevel = rootCategories;
  const currentPath: string[] = [];

  for (const name of path) {
    currentPath.push(name);
    let current = currentLevel.find((category) => category.name === name);
    if (!current) {
      current = { name, path: [...currentPath] };
      currentLevel.push(current);
    } else if (!current.path?.length) {
      current.path = [...currentPath];
    }

    if (!current.children) {
      current.children = [];
    }
    currentLevel = current.children;
  }
}

export function getCategorySlug(name: string): string {
  const mapped = categoryMap[name];
  if (mapped) return mapped;
  return encodeURIComponent(name.trim());
}

/**
 * 获取层级分类和分类文章数（生产环境会过滤草稿）。
 */
export async function getCategoryList(): Promise<CategoryListResult> {
  const allBlogPosts = await getVisibleBlogPosts();
  const countMap: Record<string, number> = {};
  const resCategories: Category[] = [];

  for (const post of allBlogPosts) {
    if (post.data.catalog === false) continue;

    const categoryPath = getCategoryArr(post.data.categories);
    for (let index = 0; index < categoryPath.length; index++) {
      const currentPath = categoryPath.slice(0, index + 1);
      const key = getCategoryCountKey(currentPath);
      countMap[key] = (countMap[key] || 0) + 1;
    }

    upsertCategoryPath(resCategories, categoryPath);
  }

  return { categories: resCategories, countMap };
}

/**
 * 兼容旧接口：按父级路径添加一个分类节点。
 */
export function addCategoryRecursively(
  rootCategories: Category[],
  parentNames: string[],
  name: string,
) {
  upsertCategoryPath(rootCategories, [...parentNames, name]);
}

/**
 * 获取分类完整链接
 */
export function getCategoryLinks(
  categories?: Category[],
  parentLink?: string,
): string[] {
  if (!categories?.length) return [];
  const res: string[] = [];

  for (const category of categories) {
    const link = getCategorySlug(category.name);
    const fullLink = parentLink ? `${parentLink}/${link}` : link;
    res.push(fullLink);

    if (category.children?.length) {
      res.push(...getCategoryLinks(category.children, fullLink));
    }
  }

  return res;
}

/**
 * 统计分类树节点总数。
 */
export function getCategoryNodeCount(categories?: Category[]): number {
  if (!categories?.length) return 0;

  return categories.reduce((count, category) => {
    return count + 1 + getCategoryNodeCount(category.children);
  }, 0);
}

/**
 * 通过链接获取分类名称
 */
export function getCategoryNameByLink(link: string): string {
  if (!link) return '';

  const cleanLink = link.replace(/^\/+|\/+$/g, '');
  if (!cleanLink) return '';

  const segments = cleanLink.split('/').filter(Boolean);
  if (segments.length === 0) return '';

  const lastSegment = segments[segments.length - 1];
  return REVERSE_CATEGORY_MAP[lastSegment] ?? normalizeSegment(lastSegment);
}

/**
 * 通过链接查找分类节点
 */
export function getCategoryByLink(
  categories: Category[],
  link?: string,
): Category | null {
  if (!link || !categories?.length) return null;
  const cleanLink = link.replace(/^\/+|\/+$/g, '');
  if (!cleanLink) return null;

  const segments = cleanLink.split('/').filter(Boolean);
  let currentCategories = categories;
  let currentCategory: Category | null = null;

  for (const segment of segments) {
    const normalized = normalizeSegment(segment);
    const nextCategory = currentCategories.find(
      (category) =>
        getCategorySlug(category.name) === segment ||
        category.name === normalized,
    );
    if (!nextCategory) return null;

    currentCategory = nextCategory;
    currentCategories = nextCategory.children ?? [];
  }

  return currentCategory;
}

/**
 * 获取分类父节点
 */
export function getParentCategory(
  category: Category | null,
  categories: Category[],
): Category | null {
  if (!category || categories.length === 0) return null;

  const queue: Array<{ node: Category; parent: Category | null }> =
    categories.map((node) => ({
      node,
      parent: null,
    }));

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;

    if (current.node.name === category.name) {
      return current.parent;
    }

    for (const child of current.node.children ?? []) {
      queue.push({ node: child, parent: current.node });
    }
  }

  return null;
}

/**
 * 根据分类名称构建分类路径
 */
export function buildCategoryPath(categoryNames: string | string[]): string {
  if (!categoryNames) return '';

  const names = Array.isArray(categoryNames) ? categoryNames : [categoryNames];
  if (names.length === 0) return '';

  const slugs = names.map((name) => getCategorySlug(name));
  return withBlogBase(`/categories/${slugs.join('/')}`);
}

/**
 * 统一分类输入格式：
 * - '分类' -> ['分类']
 * - ['分类1', '分类2'] -> ['分类1', '分类2']
 * - [['分类1', '分类2']] -> ['分类1', '分类2']
 */
export function getCategoryArr(
  categories?: string | string[] | string[][],
): string[] {
  return normalizeCategories(categories)[0];
}
