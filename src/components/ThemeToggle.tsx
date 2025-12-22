import { useEffect } from 'react';
import * as stylex from '@stylexjs/stylex';
import { useTranslation } from 'react-i18next';
import { useBlogStore } from '../store/blogStore';
import { ensureI18n } from '../lib/i18n';

const styles = stylex.create({
  wrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 12,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(15,23,42,0.1)',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  label: { fontSize: 14, color: '#475569' },
  button: {
    padding: '6px 10px',
    borderRadius: 10,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(15,23,42,0.12)',
    fontSize: 14,
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    cursor: 'pointer',
  },
});

export default function ThemeToggle() {
  const { theme, setTheme, language } = useBlogStore();
  ensureI18n(language);
  const { t } = useTranslation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggle = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <div {...stylex.props(styles.wrap)}>
      <span {...stylex.props(styles.label)}>
        {t('theme')}: {theme === 'light' ? t('light') : t('dark')}
      </span>
      <button type="button" {...stylex.props(styles.button)} onClick={toggle}>
        {theme === 'light' ? '🌞' : '🌙'}
      </button>
    </div>
  );
}
