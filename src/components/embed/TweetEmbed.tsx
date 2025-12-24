/**
 * Tweet embed component using react-tweet
 * Provides a lightweight, theme-aware Twitter/X embed
 */

import { Tweet } from 'react-tweet';
import { useMemo } from 'react';
import { useIsDarkTheme } from '@hooks/index';

interface TweetEmbedProps {
  tweetId: string;
}

export function TweetEmbed({ tweetId }: TweetEmbedProps) {
  const isDark = useIsDarkTheme();
  const theme = useMemo(() => (isDark ? 'dark' : 'light'), [isDark]);

  return (
    <div className="not-prose my-6 flex justify-center" data-theme={theme}>
      <Tweet id={tweetId} />
    </div>
  );
}

export default TweetEmbed;
