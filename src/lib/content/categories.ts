/**
 * Category-related utility functions
 */

import { categoryMap } from '@constants/category';
import { withBlogBase } from '@constants/router';
import { getCollection } from 'astro:content';

import type { Category, CategoryListResult } from './types';

export const DEFAULT_CATEGORY_NAME = '技术教程';

function normalizeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

function normalizeCategories(categories?: string | string[] | string[][]): string[] | string[][] {
  if (!categories) return [DEFAULT_CATEGORY_NAME];
  if (Array.isArray(categories)) {
    return categories.length ? categories : [DEFAULT_CATEGORY_NAME];
  }
  return [categories];
}

export function getCategorySlug(name: string): string {
  const mapped = categoryMap[name];
  if (mapped) return mapped;
  return encodeURIComponent(name.trim());
}

/**
 * Get hierarchical category list with counts (excluding drafts in production)
 */
export async function getCategoryList(): Promise<CategoryListResult> {
  const allBlogPosts = await getCollection('blog', ({ data }) => {
    // 在生产环境中，过滤掉草稿
    return import.meta.env.PROD ? data.draft !== true : true;
  });
  const countMap: { [key: string]: number } = {}; // TODO: 需要优化，应该以分类路径为键名而不是 name 如数据结构既是根分类也是笔记-后端-数据结构。
  const resCategories: Category[] = [];

  // 统计每个分类的直接文章数量
  for (let i = 0; i < allBlogPosts.length; ++i) {
    const post = allBlogPosts[i];
    const { catalog, categories } = post.data;
    if (catalog === false) {
      continue;
    }

    const normalizedCategories = normalizeCategories(categories);
    const firstCategory = normalizedCategories[0];
    if (Array.isArray(firstCategory)) {
      // categories[0] = ['笔记', '算法']
      if (!firstCategory.length) continue;

      for (let j = 0; j < firstCategory.length; ++j) {
        const name = firstCategory[j];
        countMap[name] = (countMap[name] || 0) + 1;
        if (j === 0) {
          addCategoryRecursively(resCategories, [], name);
        } else {
          const parentNames = firstCategory.slice(0, j);
          addCategoryRecursively(resCategories, parentNames, name);
        }
      }
    } else if (typeof firstCategory === 'string') {
      // categories[0] = '工具'
      countMap[firstCategory] = (countMap[firstCategory] || 0) + 1;
      addCategoryRecursively(resCategories, [], firstCategory);
    }
  }

  return { categories: resCategories, countMap };
}

/**
 * 递归添加子分类 有副作用的函数 如 ['分类1', '分类2', '分类3'] 创建一级分类 '分类1'、二级分类 '分类2'、三级分类 '分类3'
 * @param rootCategories 根分类
 * @param parentNames 父分类名 ['分类1', '分类2']
 * @param name 子分类名 '分类3'
 */
export function addCategoryRecursively(rootCategories: Category[], parentNames: string[], name: string) {
  if (parentNames.length === 0) {
    const index = rootCategories.findIndex((c) => c.name === name); // 如果当前分类已存在，则直接返回
    if (index === -1) rootCategories.push({ name });
    return;
  } else {
    const rootParentName = parentNames[0];
    const index = rootCategories.findIndex((c) => c.name === rootParentName);
    if (index === -1) {
      // 如果父级分类不存在，则创建
      const rootParentCategory = { name: rootParentName, children: [] };
      rootCategories.push(rootParentCategory);
      addCategoryRecursively(rootParentCategory.children, parentNames.slice(1), name);
    } else {
      // 如果父级分类存在,找到这个分类
      const rootParentCategory = rootCategories[index];
      if (!rootParentCategory?.children) rootParentCategory.children = [];
      addCategoryRecursively(rootParentCategory.children, parentNames.slice(1), name);
    }
  }
}

/**
 * 获取分类完整链接
 * @param categories 分类
 * @param parentLink 父分类链接
 * @returns 分类链接
 */
export function getCategoryLinks(categories?: Category[], parentLink?: string): string[] {
  if (!categories?.length) return [];
  const res: string[] = [];
  categories.forEach((category: Category) => {
    const link = getCategorySlug(category.name);
    const fullLink = parentLink ? `${parentLink}/${link}` : link;
    res.push(fullLink);
    if (category?.children?.length) {
      const children = getCategoryLinks(category?.children, fullLink);
      res.push(...children);
    }
  });
  return res;
}

/**
 * Get category name by link
 * @param link categories/xxx/front-end
 * @returns 前端
 */
export function getCategoryNameByLink(link: string): string {
  if (!link) return '';

  // Remove leading/trailing slashes and split
  const cleanLink = link.replace(/^\/+|\/+$/g, '');
  if (!cleanLink) return '';

  const segments = cleanLink.split('/').filter(Boolean); // Filter out empty segments
  if (segments.length === 0) return '';

  const lastSegment = segments[segments.length - 1];
  const reverseCategoryMap = Object.fromEntries(Object.entries(categoryMap).map(([key, value]) => [value, key]));
  return reverseCategoryMap[lastSegment] ?? normalizeSegment(lastSegment);
}

/**
 * Get category by link
 */
export function getCategoryByLink(categories: Category[], link?: string): Category | null {
  if (!link || !categories?.length) return null;
  const cleanLink = link.replace(/^\/+|\/+$/g, '');
  if (!cleanLink) return null;

  const segments = cleanLink.split('/').filter(Boolean);
  let currentCategories = categories;
  let currentCategory: Category | null = null;

  for (const segment of segments) {
    const normalized = normalizeSegment(segment);
    const nextCategory = currentCategories.find(
      (category) => getCategorySlug(category.name) === segment || category.name === normalized,
    );
    if (!nextCategory) return null;
    currentCategory = nextCategory;
    currentCategories = nextCategory.children ?? [];
  }

  return currentCategory;
}

/**
 * 获取分类的父分类（递归查找）
 */
export function getParentCategory(category: Category | null, categories: Category[]): Category | null {
  if (!categories?.length || !category) return null;

  for (const c of categories) {
    if (!c.children?.length) continue;

    // 直接检查当前层级
    if (c.children.some((child) => child.name === category.name)) {
      return c;
    }

    // 递归检查子分类
    for (const child of c.children) {
      if (child.children?.length) {
        const result = getParentCategory(category, [child]);
        if (result) return result;
      }
    }
  }
  return null;
}

/**
 * Build category path from category names
 * @param categoryNames Array of category names or single category name
 * @returns Category path like "/categories/note/front-end"
 */
export function buildCategoryPath(categoryNames: string | string[]): string {
  if (!categoryNames) return '';

  const names = Array.isArray(categoryNames) ? categoryNames : [categoryNames];
  if (names.length === 0) return '';

  const slugs = names.map((name) => getCategorySlug(name));
  return withBlogBase(`/categories/${slugs.join('/')}`);
}

/**
 * 统一 ['分类1', '分类2'] 和 '分类'
 */
export function getCategoryArr(categories?: string | string[] | string[][]) {
  const normalizedCategories = normalizeCategories(categories);
  const firstCategory = normalizedCategories[0];

  if (Array.isArray(firstCategory)) {
    return firstCategory.length ? firstCategory : [DEFAULT_CATEGORY_NAME];
  }

  if (typeof firstCategory === 'string') {
    return [firstCategory];
  }

  return [DEFAULT_CATEGORY_NAME];
}
