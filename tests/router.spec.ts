import { describe, expect, it } from 'vitest';
import { Routes, withBlogBase } from '../src/constants/router';

describe('router helpers', () => {
  it('withBlogBase should prefix blog base correctly', () => {
    expect(withBlogBase('/about')).toBe('/blog/about');
    expect(withBlogBase('tags')).toBe('/blog/tags');
    expect(withBlogBase('/')).toBe('/blog');
  });

  it('Routes enum should expose expected blog entry route', () => {
    expect(Routes.Home).toBe('/blog');
    expect(Routes.Post).toBe('/blog/post');
  });
});
