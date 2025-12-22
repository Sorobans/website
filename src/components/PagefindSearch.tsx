import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as stylex from '@stylexjs/stylex';
import { ensureI18n } from '../lib/i18n';
import { useBlogStore } from '../store/blogStore';

declare global {
  interface Window {
    PagefindUI?: new (options: { element: HTMLElement; showEmptyFilters?: boolean }) => void;
  }
}

const styles = stylex.create({
  card: {
    borderRadius: 16,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(15,23,42,0.1)',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  label: { fontSize: 14, color: '#475569', marginBottom: 8, display: 'block' },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 12,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(15,23,42,0.12)',
    fontSize: 15,
  },
  hint: { marginTop: 8, fontSize: 13, color: '#6b7280' },
});

export default function PagefindSearch() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [attached, setAttached] = useState(false);
  const { query, setQuery, language } = useBlogStore();
  ensureI18n(language);
  const { t } = useTranslation();

  useEffect(() => {
    if (!containerRef.current || attached) return;

    const mount = () => {
      if (!containerRef.current || !window.PagefindUI) return;
      new window.PagefindUI({
        element: containerRef.current,
        showEmptyFilters: false,
      });
      setAttached(true);
    };

    if (window.PagefindUI) {
      mount();
      return;
    }

    const script = document.createElement('script');
    script.src = '/pagefind/pagefind-ui.js';
    script.defer = true;
    script.onload = mount;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [attached]);

  return (
    <div {...stylex.props(styles.card)}>
      <label htmlFor="pagefind" {...stylex.props(styles.label)}>
        {t('searchTitle')}
      </label>
      {!attached && (
        <input
          id="pagefind"
          {...stylex.props(styles.input)}
          placeholder={t('searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      )}
      <div ref={containerRef} />
      {!attached && <p {...stylex.props(styles.hint)}>Tip: run `npm run build && npm run pagefind` to enable live search.</p>}
    </div>
  );
}
