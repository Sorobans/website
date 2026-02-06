export const CONTENT_GLOB = 'source/posts/**/*.md';
export const CACHE_FILE = '.cache/summaries-cache.json';
export const OUTPUT_FILE = 'src/cache/summaries.json';
export const CACHE_VERSION = '1';

export const API_BASE_URL =
  process.env.GEMINI_API_BASE_URL ??
  'https://generativelanguage.googleapis.com/v1beta/openai/';
export const API_KEY = process.env.GEMINI_API_KEY ?? '';
export const DEFAULT_MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash-exp';

export const EXCLUDE_PATTERNS = ['weekly-'];
