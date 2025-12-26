import type { KeyboardEvent } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const LIGHT_STYLE = {
  opacity: '1',
  transform: 'rotate(0deg) scale(1)',
};

const DARK_STYLE = {
  opacity: '0',
  transform: 'rotate(-180deg) scale(0)',
};

const LIGHT_STYLE_HIDDEN = {
  opacity: '0',
  transform: 'rotate(180deg) scale(0)',
};

const DARK_STYLE_SHOWN = {
  opacity: '1',
  transform: 'rotate(0deg) scale(1)',
};

export default function ThemeToggle() {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });

  const applyTheme = useCallback((isDark: boolean) => {
    const rootElement = document.documentElement;
    if (isDark) {
      rootElement.classList.add('dark');
      rootElement.classList.remove('light');
      rootElement.dataset.theme = 'dark';
      localStorage.setItem('theme', 'dark');
    } else {
      rootElement.classList.remove('dark');
      rootElement.classList.add('light');
      rootElement.dataset.theme = 'light';
      localStorage.setItem('theme', 'light');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const rootElement = document.documentElement;
    const willBeDark = !rootElement.classList.contains('dark');
    const toggleElement = buttonRef.current;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (toggleElement) {
      const rect = toggleElement.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    rootElement.classList.add('theme-transition');

    const startViewTransition = (document as Document & {
      startViewTransition?: (callback: () => void) => { ready: Promise<void>; finished: Promise<void> };
    }).startViewTransition;

    if (!startViewTransition) {
      applyTheme(willBeDark);
      setIsDarkMode(willBeDark);
      setTimeout(() => {
        rootElement.classList.remove('theme-transition');
      }, 100);
      return;
    }

    const transition = startViewTransition(() => {
      applyTheme(willBeDark);
      setIsDarkMode(willBeDark);
    });

    transition.ready
      .then(() => {
        rootElement.style.setProperty('--x', `${x}px`);
        rootElement.style.setProperty('--y', `${y}px`);
      })
      .catch((error) => {
        console.error('Theme transition setup error:', error);
      });

    transition.finished
      .then(() => {
        rootElement.classList.remove('theme-transition');
      })
      .catch(() => {
        rootElement.classList.remove('theme-transition');
      });
  }, [applyTheme]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleTheme();
      }
    },
    [toggleTheme],
  );

  const lightIconStyle = useMemo(() => (isDarkMode ? LIGHT_STYLE_HIDDEN : LIGHT_STYLE), [isDarkMode]);
  const darkIconStyle = useMemo(() => (isDarkMode ? DARK_STYLE_SHOWN : DARK_STYLE), [isDarkMode]);

  return (
    <>
      <div
        className="theme-toggle text-2xl cursor-pointer transition-transform duration-300 hover:scale-110"
        id="theme-toggle-btn"
        role="button"
        tabIndex={0}
        aria-label="toggle theme"
        onClick={toggleTheme}
        onKeyDown={handleKeyDown}
        ref={buttonRef}
      >
        <i className="fa-solid fa-sun text-2xl light-icon transition-all duration-300" style={lightIconStyle}></i>
        <i className="fa-solid fa-moon text-2xl dark-icon transition-all duration-300" style={darkIconStyle}></i>
      </div>
      <style>{`
        .theme-toggle {
          position: relative;
          z-index: 10;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .theme-toggle i {
          position: absolute;
          text-shadow: none;
          filter: none;
        }
      `}</style>
    </>
  );
}
