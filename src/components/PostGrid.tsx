import { useMemo } from 'react';
import * as stylex from '@stylexjs/stylex';
import dayjs from 'dayjs';
import { useWindowSize } from '@reactuses/core';
import { useTranslation } from 'react-i18next';
import CodeBlock from './CodeBlock';
import { useBlogStore } from '../store/blogStore';
import { ensureI18n } from '../lib/i18n';
import type { Post } from '../data/posts';

type RichPost = Post & { html: string };

type Props = {
  posts: RichPost[];
};

const styles = stylex.create({
  grid: {
    display: 'grid',
    gap: 18,
  },
  card: {
    borderRadius: 18,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(15,23,42,0.08)',
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    boxShadow: '0 14px 36px rgba(15,23,42,0.08)',
  },
  title: { fontSize: 18, fontWeight: 700, margin: '0 0 6px' },
  meta: { fontSize: 13, color: '#64748b', marginBottom: 12 },
  tags: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 },
  tag: {
    padding: '4px 8px',
    borderRadius: 10,
    backgroundColor: 'rgba(59,130,246,0.12)',
    color: '#1d4ed8',
    fontSize: 12,
    fontWeight: 600,
  },
  content: {
    marginTop: 8,
    color: '#0f172a',
    lineHeight: 1.7,
  },
});

export default function PostGrid({ posts }: Props) {
  const { query, language } = useBlogStore();
  const size = useWindowSize();
  ensureI18n(language);
  const { t } = useTranslation();

  const filtered = useMemo(() => {
    if (!query) return posts;
    return posts.filter((post) => {
      const haystack = `${post.title} ${post.description} ${post.content}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    });
  }, [posts, query]);

  const columns = size.width && size.width < 960 ? 1 : 2;

  return (
    <div style={{ display: 'grid', gap: 18, gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {filtered.map((post) => (
        <article key={post.slug} {...stylex.props(styles.card)}>
          <h3 {...stylex.props(styles.title)}>{post.title}</h3>
          <div {...stylex.props(styles.meta)}>
            {dayjs(post.date).format('MMM DD, YYYY')} · {post.tags.join(', ')}
          </div>
          <p {...stylex.props(styles.content)}>{post.description}</p>
          <div
            {...stylex.props(styles.content)}
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
          <CodeBlock code={post.code} />
          <div {...stylex.props(styles.tags)}>
            {post.tags.map((tag) => (
              <span key={tag} {...stylex.props(styles.tag)}>
                {tag}
              </span>
            ))}
          </div>
        </article>
      ))}
      {!filtered.length && <p>{t('results')}: 0</p>}
    </div>
  );
}
