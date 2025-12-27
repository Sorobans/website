/**
 * MenuIcon Component (Refactored)
 *
 * Hamburger menu icon with animated state transitions.
 *
 * Key improvements:
 * - Uses Nanostores instead of CustomEvent for state management
 * - Uses design tokens instead of hardcoded colors
 * - Cleaner and more maintainable code
 */

'use client';

import type { Variants } from 'motion/react';
import { motion } from 'motion/react';
import { useStore } from '@nanostores/react';
import { cn } from '@lib/utils';
import { drawerOpen, toggleDrawer } from '@store/ui';
import { animation } from '@constants/design-tokens';

const iconVariants: Variants = {
  closed: {
    rotate: 0,
    opacity: 1,
    transition: animation.spring.menu,
  },
  opened: {
    rotate: 90,
    opacity: 1,
    transition: animation.spring.menu,
  },
};

interface MenuIconProps {
  className?: string;
  id?: string;
}

const MenuButton = ({ className, id }: MenuIconProps) => {
  const isOpen = useStore(drawerOpen);

  const handleToggle = () => {
    toggleDrawer();
  };

  return (
    <div className={cn(className)} id={id} style={{ viewTransitionName: 'home-menu-icon' }}>
      <button
        className="flex-center text-shoka size-10 cursor-pointer rounded-full bg-white/20 select-none"
        onClick={handleToggle}
        aria-label={isOpen ? '关闭菜单' : '打开菜单'}
        aria-expanded={isOpen}
        type="button"
        style={{
          viewTransitionName: 'menu-icon',
        }}
      >
        <motion.i
          className={cn('text-xl', isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars')}
          variants={iconVariants}
          initial={false}
          animate={isOpen ? 'opened' : 'closed'}
          aria-hidden="true"
        />
      </button>
    </div>
  );
};

export { MenuButton };
