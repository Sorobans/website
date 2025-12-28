/**
 * Generate AI summaries for blog posts using xsai SDK
 *
 * This script:
 * 1. Reads all markdown files from source/posts/
 * 2. Extracts plain text from body using remark
 * 3. Uses frontmatter description when available; otherwise calls LLM API (OpenAI-compatible)
 * 4. Caches results for incremental updates
 * 5. Outputs summaries.json for page display
 *
 * Usage:
 *   pnpm generate:summaries                    # Use default model
 *   pnpm generate:summaries --model qwen2.5:1.5b
 *   pnpm generate:summaries --force            # Regenerate all
 */

import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import matter from 'gray-matter';
import { remark } from 'remark';
import strip from 'strip-markdown';
import crypto from 'crypto';
import { generateText } from '@xsai/generate-text';

// --------- Configuration ---------
const CONTENT_GLOB = 'source/posts/**/*.md';
const CACHE_FILE = '.cache/summaries-cache.json';
const OUTPUT_FILE = 'src/cache/summaries.json';
const CACHE_VERSION = '1';

// LLM API settings (OpenAI-compatible)
// Uses Google Gemini OpenAI-compatible endpoint.
const API_BASE_URL = process.env.GEMINI_API_BASE_URL ?? 'https://generativelanguage.googleapis.com/v1beta/openai/';
const API_KEY = process.env.GEMINI_API_KEY ?? '';
const DEFAULT_MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash-exp';

// Exclude patterns - posts matching these patterns won't get summaries
const EXCLUDE_PATTERNS = [
  'weekly-', // Exclude weekly newsletters
];

// --------- Parse CLI Arguments ---------
function parseArgs(): { model: string; force: boolean } {
  const args = process.argv.slice(2);
  let model = DEFAULT_MODEL;
  let force = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--model' && args[i + 1]) {
      model = args[i + 1];
      i++;
    } else if (args[i] === '--force') {
      force = true;
    }
  }

  return { model, force };
}

// --------- Type Definitions ---------
interface PostData {
  slug: string;
  title: string;
  description?: string;
  text: string;
  hash: string;
}

interface CacheEntry {
  hash: string;
  title: string;
  summary: string;
  generatedAt: string;
}

interface SummariesCache {
  version: string;
  model: string;
  entries: Record<string, CacheEntry>;
}

interface SummaryOutput {
  title: string;
  summary: string;
}

// --------- Utility Functions ---------

function shouldExclude(slug: string): boolean {
  return EXCLUDE_PATTERNS.some((pattern) => slug.includes(pattern));
}

function computeHash(content: string): string {
  return crypto.createHash('md5').update(content).digest('hex');
}

async function loadCache(): Promise<SummariesCache | null> {
  try {
    const data = await fs.readFile(CACHE_FILE, 'utf-8');
    return JSON.parse(data) as SummariesCache;
  } catch {
    return null;
  }
}

async function loadOutputSummaries(): Promise<Record<string, SummaryOutput> | null> {
  try {
    const data = await fs.readFile(OUTPUT_FILE, 'utf-8');
    return JSON.parse(data) as Record<string, SummaryOutput>;
  } catch {
    return null;
  }
}

async function saveCache(cache: SummariesCache): Promise<void> {
  const dir = path.dirname(CACHE_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
}

function isCacheValid(cache: SummariesCache, model: string): boolean {
  return cache.version === CACHE_VERSION && cache.model === model;
}

async function getPlainText(markdown: string): Promise<string> {
  const result = await remark().use(strip).process(markdown);
  return String(result)
    .replace(/^import\s+.*$/gm, '')
    .replace(/^export\s+.*$/gm, '')
    .replace(/^\s*(TLDR|Introduction|Conclusion|Summary|References?|Footnotes?)\s*$/gim, '')
    .replace(/^[A-Z\s]{4,}$/gm, '')
    .replace(/^\|.*\|$/gm, '')
    .replace(/^:::.*/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function extractSlug(filePath: string, link?: string): string {
  if (link) return link;
  const relativePath = filePath.replace(/^source\/posts\//, '').replace(/\.md$/, '');
  // Convert to lowercase to match Astro's auto-generated collection entry IDs
  return relativePath.toLowerCase();
}

// --------- LLM API ---------

async function checkApiRunning(): Promise<boolean> {
  try {
    const headers: Record<string, string> = {};
    if (API_KEY) {
      headers.Authorization = `Bearer ${API_KEY}`;
    }
    const response = await fetch(`${API_BASE_URL}models`, { headers });
    return response.ok;
  } catch {
    return false;
  }
}

async function generateSummary(text: string, model: string): Promise<string> {
  // Truncate text to avoid token limits
  const truncatedText = text.slice(0, 6000);

  const { text: summary } = await generateText({
    apiKey: API_KEY,
    baseURL: API_BASE_URL,
    model,
    messages: [
      {
        role: 'system',
        content:
          '你是一只猫娘, 兼我的博客文章总结助理。请用中文，用简洁、可爱地语言总结文章的核心内容。只输出总结，不要有任何前缀、解释或思考过程。',
      },
      {
        role: 'user',
        content: `请总结以下文章：\n\n${truncatedText}`,
      },
    ],
    temperature: 0.3,
    maxTokens: 200,
  });

  return summary?.trim() ?? '';
}

// --------- File Processing ---------

async function processFile(filePath: string): Promise<PostData | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const { data: frontmatter, content: body } = matter(content);

    if (frontmatter.draft) return null;

    if (!frontmatter.title) {
      return null;
    }

    const slug = extractSlug(filePath, frontmatter.link as string | undefined);

    if (shouldExclude(slug)) {
      return null;
    }

    const description = (frontmatter.description as string | undefined)?.trim();
    const plainText = await getPlainText(body);
    const hash = computeHash(content);

    return {
      slug,
      title: frontmatter.title as string,
      description,
      text: plainText,
      hash,
    };
  } catch (error) {
    console.error(chalk.red(`  Error processing ${filePath}:`), error);
    return null;
  }
}

async function loadPosts(files: string[]): Promise<PostData[]> {
  const posts: PostData[] = [];
  for (let i = 0; i < files.length; i++) {
    process.stdout.write(`\r  Processing ${i + 1}/${files.length}...`);
    const post = await processFile(files[i]);
    if (post) posts.push(post);
  }
  return posts;
}

// --------- Main Execution ---------

async function main() {
  const startTime = Date.now();
  const { model, force } = parseArgs();

  try {
    if (force) {
    }
    // Load cache
    let cache = force ? null : await loadCache();
    if (cache) {
      if (isCacheValid(cache, model)) {
      } else {
        cache = null;
      }
    } else if (!force) {
    }

    // Find all markdown files
    const files = await glob(CONTENT_GLOB);
    if (!files.length) {
      return;
    }

    // Process all files
    const posts = await loadPosts(files);
    if (!posts.length) {
      return;
    }

    let validCache = cache?.entries || {};
    if (!cache && !force) {
      const outputSummaries = await loadOutputSummaries();
      if (outputSummaries) {
        const seededCache: Record<string, CacheEntry> = {};
        for (const post of posts) {
          const outputEntry = outputSummaries[post.slug];
          if (!outputEntry?.summary) continue;
          seededCache[post.slug] = {
            hash: post.hash,
            title: outputEntry.title || post.title,
            summary: outputEntry.summary,
            generatedAt: new Date().toISOString(),
          };
        }
        if (Object.keys(seededCache).length > 0) {
          validCache = seededCache;
        }
      }
    }

    const needsGeneration = posts.some((post) => {
      const hasDescription = Boolean(post.description);
      const cachedEntry = validCache[post.slug];
      const hasCache = cachedEntry && cachedEntry.hash === post.hash;
      return !hasDescription && !(hasCache && !force);
    });

    let skipGeneration = false;
    if (needsGeneration) {
      // Check LLM API is running only when needed
      const apiRunning = await checkApiRunning();
      if (!apiRunning) {
        skipGeneration = true;
        console.error(chalk.yellow('\nWarning: Cannot connect to LLM API.'));
        console.error(chalk.yellow('  - GEMINI_API_KEY is set correctly'));
        console.error(chalk.yellow('  - GEMINI_API_BASE_URL is accessible'));
        console.error(chalk.yellow('Skipping AI generation; will output manual/cached summaries only.'));
      }
    }

    // Generate summaries incrementally
    const newEntries: Record<string, CacheEntry> = {};
    let cached = 0;
    let generated = 0;
    let manual = 0;
    let skipped = 0;
    let errors = 0;

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const cachedEntry = validCache[post.slug];
      const description = post.description;

      if (description) {
        newEntries[post.slug] = {
          hash: post.hash,
          title: post.title,
          summary: description,
          generatedAt: new Date().toISOString(),
        };
        manual++;
        process.stdout.write(`\r  [${i + 1}/${posts.length}] ${chalk.blue('manual')}: ${post.slug.slice(0, 40)}...`);
      } else if (cachedEntry && cachedEntry.hash === post.hash && !force) {
        // Use cached summary
        newEntries[post.slug] = cachedEntry;
        cached++;
        process.stdout.write(`\r  [${i + 1}/${posts.length}] ${chalk.gray('cached')}: ${post.slug.slice(0, 40)}...`);
      } else if (skipGeneration) {
        // Keep cached summary if available, otherwise skip
        if (cachedEntry) {
          newEntries[post.slug] = cachedEntry;
          cached++;
        } else {
          skipped++;
        }
        process.stdout.write(`\r  [${i + 1}/${posts.length}] ${chalk.yellow('skipped')}: ${post.slug.slice(0, 40)}...`);
      } else {
        // Generate new summary
        process.stdout.write(`\r  [${i + 1}/${posts.length}] ${chalk.yellow('generating')}: ${post.slug.slice(0, 40)}...`);

        try {
          const summary = await generateSummary(post.text, model);
          newEntries[post.slug] = {
            hash: post.hash,
            title: post.title,
            summary,
            generatedAt: new Date().toISOString(),
          };
          generated++;
        } catch (error) {
          console.error(chalk.red(`  Error generating summary for ${post.slug}:`), error);
          errors++;
          // Keep old cached entry if available
          if (cachedEntry) {
            newEntries[post.slug] = cachedEntry;
          }
        }
      }
    }

    // Save cache
    const newCache: SummariesCache = {
      version: CACHE_VERSION,
      model,
      entries: newEntries,
    };
    await saveCache(newCache);

    // Generate output file for page display
    const output: Record<string, SummaryOutput> = {};
    for (const [slug, entry] of Object.entries(newEntries)) {
      output[slug] = {
        title: entry.title,
        summary: entry.summary,
      };
    }

    const outputDir = path.dirname(OUTPUT_FILE);
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2));

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(
      chalk.green(
        `\nDone. Generated ${generated}, manual ${manual}, reused ${cached}, skipped ${skipped}, errors ${errors}. (${elapsed}s)`,
      ),
    );
  } catch (error) {
    console.error(chalk.red('\nError:'), error);
    process.exitCode = 1;
  }
}

void main();
