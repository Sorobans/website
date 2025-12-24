/**
 * useMediaQuery Hook
 *
 * Hook for responding to media query changes (responsive breakpoints).
 *
 * @example
 * ```tsx
 * function Component() {
 *   const isMobile = useMediaQuery('(max-width: 768px)');
 *   const isDesktop = useMediaQuery('(min-width: 1024px)');
 *   const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 *
 *   return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
 * }
 * ```
 */

import { useSyncExternalStore } from 'react';

/**
 * Hook for media query matching
 *
 * @param query - Media query string (e.g., "(max-width: 768px)")
 * @returns Whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const getSnapshot = () => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return false;
    }
    return window.matchMedia(query).matches;
  };

  const subscribe = (callback: () => void) => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return () => {};
    }

    const mediaQuery = window.matchMedia(query);
    const handleChange = () => callback();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }

    mediaQuery.addListener(handleChange);
    return () => {
      mediaQuery.removeListener(handleChange);
    };
  };

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/**
 * Predefined breakpoint hooks based on Tailwind defaults
 */

/** Mobile (max-width: 768px) */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}

/** Tablet (max-width: 992px) */
export function useIsTablet(): boolean {
  return useMediaQuery('(max-width: 992px)');
}

/** User prefers dark color scheme */
export function usePrefersColorSchemeDark(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

/** User prefers reduced motion for accessibility */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
