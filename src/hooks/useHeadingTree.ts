/**
 * useHeadingTree Hook
 *
 * Extracts heading tree building and numbering logic from TableOfContents.
 * Builds a hierarchical structure from flat heading list and calculates numbering.
 *
 * @example
 * ```tsx
 * function TableOfContents() {
 *   const headings = useHeadingTree();
 *
 *   return (
 *     <nav>
 *       {headings.map(heading => (
 *         <div key={heading.id}>{heading.text}</div>
 *       ))}
 *     </nav>
 *   );
 * }
 * ```
 */

import { useSyncExternalStore } from 'react';

export interface Heading {
  id: string;
  text: string;
  level: number;
  children: Heading[];
  parent?: Heading;
}

/**
 * Build hierarchical structure from flat heading list
 */
function buildHeadingTree(flatHeadings: Array<{ id: string; text: string; level: number }>): Heading[] {
  const tree: Heading[] = [];
  const stack: Heading[] = [];

  flatHeadings.forEach((heading) => {
    const newHeading: Heading = {
      ...heading,
      children: [],
    };

    // Find the appropriate parent
    while (stack.length > 0 && stack[stack.length - 1].level >= newHeading.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      // This is a root level heading
      tree.push(newHeading);
    } else {
      // This is a child of the last item in stack
      const parent = stack[stack.length - 1];
      parent.children.push(newHeading);
      newHeading.parent = parent;
    }

    stack.push(newHeading);
  });

  return tree;
}

/**
 * Hook to build heading tree from article content
 *
 * @returns Hierarchical heading tree with numbering
 */
function getHeadingSnapshot(): Heading[] {
  if (typeof document === 'undefined') {
    return [];
  }

  const articleContent = document.querySelector('.custom-content') ?? document.querySelector('article');
  if (!articleContent) {
    return [];
  }

  const headingElements = Array.from(articleContent.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')).filter(
    (heading) => !heading.closest('.link-preview-block'),
  );

  if (headingElements.length === 0) {
    return [];
  }

  const flatHeadings: Array<{ id: string; text: string; level: number }> = headingElements.map((heading, index) => {
    let id = heading.id;
    if (!id) {
      const text = heading.textContent || '';
      id =
        text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim() || `heading-${index}`;
      heading.id = id;
    }

    return {
      id,
      text: heading.textContent || '',
      level: parseInt(heading.tagName.substring(1)),
    };
  });

  return buildHeadingTree(flatHeadings);
}

function subscribe(callback: () => void) {
  if (typeof document === 'undefined') {
    return () => {};
  }

  const observerTarget = document.querySelector('.custom-content') ?? document.querySelector('article') ?? document.body;
  const observer = observerTarget
    ? new MutationObserver(() => {
        callback();
      })
    : null;

  if (observerTarget && observer) {
    observer.observe(observerTarget, { childList: true, subtree: true });
  }

  document.addEventListener('astro:page-load', callback);
  document.addEventListener('astro:after-swap', callback);
  requestAnimationFrame(callback);

  return () => {
    observer?.disconnect();
    document.removeEventListener('astro:page-load', callback);
    document.removeEventListener('astro:after-swap', callback);
  };
}

export function useHeadingTree(): Heading[] {
  return useSyncExternalStore(subscribe, getHeadingSnapshot, () => []);
}

/**
 * Find a heading by ID in the tree structure
 */
export function findHeadingById(headings: Heading[], id: string): Heading | null {
  for (const heading of headings) {
    if (heading.id === id) {
      return heading;
    }
    const found = findHeadingById(heading.children, id);
    if (found) {
      return found;
    }
  }
  return null;
}

/**
 * Get all parent IDs for a given heading
 */
export function getParentIds(heading: Heading): string[] {
  const parentIds: string[] = [];
  let current = heading.parent;
  while (current) {
    parentIds.push(current.id);
    current = current.parent;
  }
  return parentIds;
}

/**
 * Get all siblings of a heading (headings at the same level with the same parent)
 */
export function getSiblingIds(targetHeading: Heading, allHeadings: Heading[]): string[] {
  const siblings: string[] = [];

  if (!targetHeading.parent) {
    // This is a root level heading, get all root level headings
    allHeadings.forEach((heading) => {
      if (heading.id !== targetHeading.id && heading.children.length > 0) {
        siblings.push(heading.id);
      }
    });
  } else {
    // This has a parent, get all children of the parent
    targetHeading.parent.children.forEach((heading) => {
      if (heading.id !== targetHeading.id && heading.children.length > 0) {
        siblings.push(heading.id);
      }
    });
  }

  return siblings;
}
