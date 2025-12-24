import Giscus from '@giscus/react';
import { useEffect, useState } from 'react';

export default function GiscusComments() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // 获取初始主题
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    // 监听主题变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setTheme(isDark ? 'dark' : 'light');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full pb-12">
      <Giscus
        id="comments"
        repo="XueHua-s/astro-snow"
        repoId="R_kgDOQtSVXw"
        category="General"
        categoryId="DIC_kwDOQtSVX84C0M1B"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme}
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  );
}
