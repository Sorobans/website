import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as stylex from '@stylexjs/stylex';
import { ensureI18n } from '../lib/i18n';
import { useBlogStore } from '../store/blogStore';

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
  select: {
    padding: '6px 10px',
    borderRadius: 10,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(15,23,42,0.12)',
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#0f172a',
  },
});

export default function LanguageSwitcher() {
  const { language, setLanguage } = useBlogStore();
  ensureI18n(language);
  const { t } = useTranslation();

  useEffect(() => {
  }, [language]);

  return (
    <div {...stylex.props(styles.wrap)}>
      <span {...stylex.props(styles.label)}>{t('language')}</span>
      <select
        {...stylex.props(styles.select)}
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'zh')}
      >
        <option value="en">English</option>
        <option value="zh">中文</option>
      </select>
    </div>
  );
}
