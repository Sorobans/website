import Giscus from '@giscus/react';
import { useIsDarkTheme } from '@hooks/index';

export default function GiscusComments() {
  const isDarkTheme = useIsDarkTheme();
  const theme = isDarkTheme ? 'dark' : 'light';

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
