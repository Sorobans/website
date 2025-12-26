import logoSrc from 'src/assets/logo.webp?url';
import { MobilePostHeader } from '@components/layout/MobilePostHeader';
import { MenuIcon } from '@components/ui/MenuIcon';
import { MAX_WIDTH } from '@constants/layout';
import { Routes } from '@constants/router';
import { blogLayoutConfig } from '@/config/blogLayoutConfig';
import Navigator from './Navigator';
import type { MarkdownHeading } from '@/types/markdown';
import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { useHeaderScroll } from '@hooks/useHeaderScroll.ts';

interface Props {
  isPostPage?: boolean;
  tocNumbering?: boolean;
  tocHeadings?: MarkdownHeading[];
}

export default function Header({ isPostPage = false, tocNumbering = true, tocHeadings }: Props) {
  const { alternate, title, showLogo } = blogLayoutConfig;
  const subscribe = useCallback(() => () => {}, []);
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);

  const mobileLogo = useMemo(() => {
    if (showLogo) {
      return <img src={logoSrc} alt={alternate || title} className="h-8" height={32} />;
    }
    return <span className="logo-text text-primary">{alternate || title}</span>;
  }, [alternate, showLogo, title]);
  useHeaderScroll();

  return (
    <>
      <div
        id="site-header"
        className="shadow-text fixed inset-x-0 top-0 z-10 gap-4 py-2.5 text-white select-none tablet:backdrop-blur tablet:py-2 tablet:pl-3 tablet:pr-3"
        style={{ viewTransitionName: 'site-header' }}
      >
        <div className="site-header-bg pointer-events-none absolute inset-0"></div>
        <div
          className={`relative z-10 mx-auto flex items-center justify-between px-6 tablet:w-full tablet:px-0 ${MAX_WIDTH.content}`}
        >
          <a
            className="tablet:hidden -my-4 mr-4 flex cursor-pointer items-center justify-center gap-1 whitespace-nowrap"
            href={Routes.Home}
            target="_self"
            title={alternate || title}
            aria-label={alternate || title}
            data-astro-transition-persist="page-header-avatar"
            style={{ viewTransitionName: 'page-header-avatar' }}
          >
            {showLogo ? (
              <img src={logoSrc} alt={alternate || title} className="mt-2 mb-2 h-16" />
            ) : (
              <p className="logo-text text-primary">{alternate || title}</p>
            )}
          </a>
          <div className="tablet:flex tablet:grow hidden items-center justify-center">
            {isClient ? (
              <MobilePostHeader
                isPostPage={isPostPage}
                enableNumbering={tocNumbering}
                sourceHeadings={tocHeadings}
                logoElement={showLogo ? 'svg' : 'text'}
                logoText={alternate || title}
                logoSrc={logoSrc}
              />
            ) : (
              <a href={Routes.Home} className="flex items-center gap-1">
                {mobileLogo}
              </a>
            )}
          </div>
          <Navigator />
        </div>
      </div>

      <MenuIcon
        className="tablet:flex tablet:items-center tablet:justify-center fixed top-0 left-3 z-[70] hidden h-14 transition-transform"
        id="mobile-menu-container"
      />
    </>
  );
}
