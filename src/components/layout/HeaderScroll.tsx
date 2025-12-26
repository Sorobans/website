import { useEffect } from 'react';
import { Routes } from '@constants/router';

const DESKTOP_BREAKPOINT = 992;
const SCROLL_END_DELAY = 800;

const HeaderScroll = () => {
  useEffect(() => {
    let firstScroll = true;
    let hideDistance = window.innerHeight * 0.4;
    let showDistance = window.innerHeight * 0.5;
    let backgroundDistance = window.innerHeight * 0.45;
    let lastScrollY = 0;
    let isHeaderPinned = false;
    let scrollEndTimer: ReturnType<typeof setTimeout> | null = null;
    let scrollHandler: ((event?: Event) => void) | null = null;
    const postBase = Routes.Post;

    const isPostPageMobile = () => {
      const isMobile = window.innerWidth <= DESKTOP_BREAKPOINT;
      const isPostPage = window.location.pathname.startsWith(`${postBase}/`);
      return isMobile && isPostPage;
    };

    const handleScroll = () => {
      const siteHeader = document.getElementById('site-header');
      const mobileMenuContainer = document.getElementById('mobile-menu-container');
      const currentScrollY = window.scrollY;
      const isDesktop = window.innerWidth > DESKTOP_BREAKPOINT;

      const setHeaderVisible = (visible: boolean) => {
        if (!siteHeader) return;
        siteHeader.style.transform = visible ? 'translateY(0)' : 'translateY(-100%)';
      };

      if (siteHeader && !isDesktop) {
        if (currentScrollY > backgroundDistance) {
          siteHeader.classList.add('with-background');
        } else {
          siteHeader.classList.remove('with-background');
        }
      }

      if (!isDesktop && firstScroll) {
        firstScroll = false;
        lastScrollY = currentScrollY;
        return;
      }

      if (isPostPageMobile()) {
        if (scrollEndTimer) {
          clearTimeout(scrollEndTimer);
        }

        setHeaderVisible(true);
        if (mobileMenuContainer) mobileMenuContainer.classList.remove('-translate-y-full');

        scrollEndTimer = setTimeout(() => {
          // no-op; keep timer for alignment with previous behavior
        }, SCROLL_END_DELAY);

        lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY > 0) {
        if (isDesktop) {
          const isScrollingUp = currentScrollY < lastScrollY;
          if (currentScrollY <= hideDistance) {
            setHeaderVisible(true);
            if (siteHeader) siteHeader.classList.remove('with-background');
            isHeaderPinned = false;
          } else if (isHeaderPinned && isScrollingUp) {
            setHeaderVisible(true);
            if (siteHeader) siteHeader.classList.add('with-background');
          } else if (currentScrollY > showDistance && isScrollingUp) {
            setHeaderVisible(true);
            if (siteHeader) siteHeader.classList.add('with-background');
            isHeaderPinned = true;
          } else {
            setHeaderVisible(false);
            if (siteHeader) siteHeader.classList.remove('with-background');
            isHeaderPinned = false;
          }
        } else {
          if (currentScrollY > lastScrollY) {
            setHeaderVisible(false);
            if (mobileMenuContainer) mobileMenuContainer.classList.add('-translate-y-full');
          } else {
            setHeaderVisible(true);
            if (mobileMenuContainer) mobileMenuContainer.classList.remove('-translate-y-full');
          }
        }
      }
      lastScrollY = currentScrollY;
    };

    const throttle = (func: () => void, limit: number) => {
      let lastFunc: ReturnType<typeof setTimeout>;
      let lastRan: number | null = null;
      return () => {
        if (lastRan === null) {
          func();
          lastRan = Date.now();
        } else {
          clearTimeout(lastFunc);
          lastFunc = setTimeout(() => {
            if (Date.now() - (lastRan ?? 0) >= limit) {
              func();
              lastRan = Date.now();
            }
          }, limit - (Date.now() - (lastRan ?? 0)));
        }
      };
    };

    const initNavigator = () => {
      if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler);
      }
      if (scrollEndTimer) {
        clearTimeout(scrollEndTimer);
        scrollEndTimer = null;
      }

      firstScroll = true;
      hideDistance = window.innerHeight * 0.4;
      showDistance = window.innerHeight * 0.5;
      backgroundDistance = window.innerHeight * 0.45;
      lastScrollY = window.scrollY;

      const siteHeader = document.getElementById('site-header');
      if (siteHeader) {
        siteHeader.style.transition = 'transform 0.3s ease';
        siteHeader.style.willChange = 'transform';
      }

      scrollHandler = throttle(handleScroll, 80);
      window.addEventListener('scroll', scrollHandler, { passive: true });
      handleScroll();
    };

    const handlePageLoad = () => {
      initNavigator();
    };

    const handleBeforeSwap = () => {
      if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler);
        scrollHandler = null;
      }
      if (scrollEndTimer) {
        clearTimeout(scrollEndTimer);
        scrollEndTimer = null;
      }
    };

    if (document.readyState !== 'loading') {
      initNavigator();
    }

    document.addEventListener('astro:page-load', handlePageLoad);
    document.addEventListener('astro:before-swap', handleBeforeSwap);

    return () => {
      document.removeEventListener('astro:page-load', handlePageLoad);
      document.removeEventListener('astro:before-swap', handleBeforeSwap);
      handleBeforeSwap();
    };
  }, []);

  return null;
};

export default HeaderScroll;
