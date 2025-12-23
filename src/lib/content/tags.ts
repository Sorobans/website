/**
 * Tag-related utility functions
 */

import type { BlogPost } from 'types/blog';

/**
 * Get all tags with their counts
 */
export const getAllTags = (posts: BlogPost[]) => {
  return posts.reduce<Record<string, number>>((acc, post) => {
    const postTags = post.data.tags || [];
    const tags = Array.isArray(postTags) ? postTags : [postTags];
    tags.forEach((tag: string) => {
      if (!acc[tag]) {
        acc[tag] = 0;
      }
      acc[tag]++;
    });
    return acc;
  }, {});
};
