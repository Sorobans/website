import Giscus from '@giscus/react';
import { useIsDarkTheme } from '@hooks/index';

export default function GiscusComments() {
  const isDarkTheme = useIsDarkTheme();
  const theme = isDarkTheme ? 'dark' : 'light';

  return (
    <div className="w-full pb-12">
      <Giscus
        id="comments"
        repo="Sorobans/website"
        repoId="R_kgDORr5w2g"
        category="General"
        categoryId="DIC_kwDORr5w2s4C44Vb"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom" // Changed to bottom as per your script
        theme={theme}
        lang="en"              // Changed to English
        loading="lazy"
      />
    </div>
  );
}