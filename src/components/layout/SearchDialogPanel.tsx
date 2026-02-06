import { useStore } from '@nanostores/react';
import { useEventListener } from '@reactuses/core';
import { closeSearch, openSearch, searchOpen } from '@store/ui';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from 'react';

const CLOSE_ANIMATION_MS = 200;
const FOCUS_DELAY_MS = 150;

function getSelectableItems(): HTMLElement[] {
  const results = Array.from(
    document.querySelectorAll<HTMLElement>('.pagefind-ui__result'),
  );
  const loadMoreBtn = document.querySelector<HTMLElement>(
    '.pagefind-ui__button',
  );

  if (loadMoreBtn && loadMoreBtn.offsetParent !== null) {
    return [...results, loadMoreBtn];
  }
  return results;
}

export default function SearchDialogPanel() {
  const isOpen = useStore(searchOpen);
  const [state, setState] = useState<'open' | 'closed'>('closed');
  const [active, setActive] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const closeTimerRef = useRef<number | null>(null);
  const focusTimerRef = useRef<number | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const documentTarget = useCallback(() => document, []);

  const clearSelectionDom = useCallback(() => {
    const items = getSelectableItems();
    if (selectedIndex >= 0 && selectedIndex < items.length) {
      items[selectedIndex]?.removeAttribute('data-selected');
    }
  }, [selectedIndex]);

  const clearSelection = useCallback(() => {
    clearSelectionDom();
    setSelectedIndex(-1);
  }, [clearSelectionDom]);

  const selectResult = useCallback(
    (index: number) => {
      const items = getSelectableItems();
      if (items.length === 0) {
        setSelectedIndex(-1);
        return;
      }

      const newIndex = Math.max(-1, Math.min(index, items.length - 1));

      if (selectedIndex >= 0 && selectedIndex < items.length) {
        items[selectedIndex]?.removeAttribute('data-selected');
      }

      setSelectedIndex(newIndex);

      if (newIndex >= 0) {
        items[newIndex]?.setAttribute('data-selected', 'true');
        items[newIndex]?.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
        return;
      }

      const searchInput = document.querySelector<HTMLInputElement>(
        '.pagefind-ui__search-input',
      );
      searchInput?.focus();
    },
    [selectedIndex],
  );

  const navigateToSelected = useCallback(() => {
    const items = getSelectableItems();
    if (selectedIndex < 0 || selectedIndex >= items.length) return;

    const selectedItem = items[selectedIndex];
    if (selectedItem.classList.contains('pagefind-ui__button')) {
      selectedItem.click();
      setSelectedIndex(-1);
      return;
    }

    const link = selectedItem.querySelector<HTMLAnchorElement>(
      '.pagefind-ui__result-link',
    );
    if (link?.href) {
      closeSearch();
      window.location.href = link.href;
    }
  }, [selectedIndex]);

  const setupResultsObserver = useCallback(() => {
    observerRef.current?.disconnect();
    const container = document.getElementById('search-dialog-container');
    if (!container) return;

    const observer = new MutationObserver(() => {
      clearSelection();
    });

    observer.observe(container, { childList: true, subtree: true });
    observerRef.current = observer;
  }, [clearSelection]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openSearch();
        return;
      }

      if (!searchOpen.get()) return;

      if (event.key === 'Escape') {
        closeSearch();
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        selectResult(selectedIndex + 1);
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        selectResult(selectedIndex - 1);
        return;
      }

      if (event.key === 'Enter' && selectedIndex >= 0) {
        event.preventDefault();
        navigateToSelected();
      }
    },
    [navigateToSelected, selectResult, selectedIndex],
  );

  const handleDialogClose = useCallback(() => {
    closeSearch();
  }, []);

  const onDialogBackgroundClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (event.target === event.currentTarget) {
        closeSearch();
      }
    },
    [],
  );

  useEffect(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (focusTimerRef.current) {
      window.clearTimeout(focusTimerRef.current);
      focusTimerRef.current = null;
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.dispatchEvent(new CustomEvent('search-dialog-open'));
      requestAnimationFrame(() => {
        setState('open');
        setActive(true);
      });

      focusTimerRef.current = window.setTimeout(() => {
        const searchInput = document.querySelector<HTMLInputElement>(
          '.pagefind-ui__search-input',
        );
        searchInput?.focus();
      }, FOCUS_DELAY_MS);

      setupResultsObserver();
      return;
    }

    clearSelectionDom();
    observerRef.current?.disconnect();
    observerRef.current = null;
    window.dispatchEvent(new CustomEvent('search-dialog-close'));
    requestAnimationFrame(() => {
      setActive(false);
    });
    queueMicrotask(() => {
      setSelectedIndex(-1);
    });

    closeTimerRef.current = window.setTimeout(() => {
      setState('closed');
      document.body.style.overflow = '';
    }, CLOSE_ANIMATION_MS);
  }, [clearSelectionDom, isOpen, setupResultsObserver]);

  useEventListener('keydown', handleKeyDown, documentTarget);
  useEventListener(
    'astro:before-preparation',
    handleDialogClose,
    documentTarget,
  );

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
      if (focusTimerRef.current) {
        window.clearTimeout(focusTimerRef.current);
      }
      observerRef.current?.disconnect();
      document.body.style.overflow = '';
    };
  }, []);

  const overlayClassName = useMemo(
    () =>
      `fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
        active ? 'opacity-100' : 'opacity-0'
      } ${state === 'closed' ? 'hidden' : ''}`,
    [active, state],
  );
  const dialogClassName = useMemo(
    () =>
      `fixed inset-0 z-50 grid place-items-center px-4 ${
        state === 'closed' ? 'hidden' : ''
      }`,
    [state],
  );
  const contentClassName = useMemo(
    () =>
      `bg-gradient-start shadow-box w-full max-w-3xl overflow-auto rounded-xl transition-all duration-200 ${
        active ? 'opacity-100' : 'opacity-0'
      }`,
    [active],
  );

  return (
    <>
      <button
        id="search-overlay"
        type="button"
        data-state={state}
        className={overlayClassName}
        aria-label="关闭搜索"
        onClick={onDialogBackgroundClick}
      />
      <div
        id="search-dialog"
        data-state={state}
        className={dialogClassName}
        role="dialog"
        aria-label="搜索文章"
        aria-modal="true">
        <div id="search-dialog-content" className={contentClassName}>
          <div className="relative p-6 md:p-3">
            <div className="search-dialog">
              <div className="relative mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold md:text-base">
                  <i
                    className="fa-solid fa-magnifying-glass text-base md:text-sm"
                    aria-hidden="true"
                  />
                  搜索文章
                </h2>
                <button
                  id="search-dialog-close"
                  className="flex size-8 items-center justify-center rounded-full bg-black/5 transition-colors duration-300 hover:bg-black/10 md:size-7 dark:bg-white/10 dark:hover:bg-white/20"
                  aria-label="关闭搜索"
                  onClick={handleDialogClose}>
                  <i
                    className="fa-solid fa-xmark text-base md:text-sm"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div
                id="search-empty-hint"
                className="search-empty-hint absolute inset-x-0 top-32 text-center text-sm opacity-60 md:top-28">
                <p>输入关键词搜索博客文章</p>
                <p className="mt-1 text-xs">
                  按{' '}
                  <kbd className="rounded bg-black/10 px-1.5 py-0.5 font-mono dark:bg-white/10">
                    ESC
                  </kbd>{' '}
                  关闭
                </p>
              </div>
              <div className="vertical-scrollbar scroll-feather-mask -mx-6 h-[calc(80dvh-140px)] overflow-auto scroll-smooth px-6 pb-10 md:-mx-3 md:h-[calc(80dvh-120px)] md:px-3">
                <div id="search-dialog-container" />
              </div>
            </div>
            <div className="bg-background/2 absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-4 px-4 pt-2 pb-4 text-xs text-black/50 dark:border-white/10 dark:text-white/50">
              <span>
                <kbd className="kbd">↑↓</kbd> 选择
              </span>
              <span>
                <kbd className="kbd">Enter</kbd> 打开
              </span>
              <span>
                <kbd className="kbd">ESC</kbd> 关闭
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
