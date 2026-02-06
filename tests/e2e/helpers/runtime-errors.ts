import { expect, type Page } from '@playwright/test';

const NOISY_CONSOLE_PATTERNS = [
  /Failed to load resource/i,
  /giscus/i,
  /cdn\.jsdelivr\.net/i,
  /Error while running audit's match function: TypeError: Failed to fetch/i,
];

export function setupRuntimeErrorCollector(page: Page) {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];

  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });

  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    const isNoise = NOISY_CONSOLE_PATTERNS.some((pattern) =>
      pattern.test(text),
    );
    if (!isNoise) {
      consoleErrors.push(text);
    }
  });

  return {
    assertClean: () => {
      expect(pageErrors, `page errors:\n${pageErrors.join('\n')}`).toEqual([]);
      expect(
        consoleErrors,
        `console errors:\n${consoleErrors.join('\n')}`,
      ).toEqual([]);
    },
  };
}
