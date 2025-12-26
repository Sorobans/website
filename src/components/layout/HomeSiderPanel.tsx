import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import { HomeSiderSegmentType, HomeSiderType } from '@constants/enum';
import { homeSiderSegmentType } from '@store/app';
import { TableOfContents } from './TableOfContents';
import HomeSiderSegmented from '@components/ui/segmented/HomeSiderSegmented';
import { SeriesPostList } from '@components/post/SeriesPostList';
import { SeriesNavigation } from '@components/post/SeriesNavigation';
import { ScrollProgress } from './ScrollProgress';
import HomeInfoPanel from './HomeInfoPanel';
import { cn } from '@lib/utils';
import type { Router } from '@constants/router';
import type { BlogPost } from '@/types/blog';
import type { MarkdownHeading } from '@/types/markdown';

interface SeriesPostItem {
  post: BlogPost;
  href: string;
}

interface HomeInfoData {
  avatar: string;
  name?: string;
  description?: string;
  postCount: number;
  categoryCount: number;
  tagCount: number;
  routes: Router[];
  currentPath: string;
}

interface HomeSiderPanelProps {
  type: HomeSiderType;
  defaultSegmentType: HomeSiderSegmentType;
  homeInfo: HomeInfoData;
  tocHeadings?: MarkdownHeading[];
  tocNumbering?: boolean;
  seriesPostItems?: SeriesPostItem[];
  currentPostSlug?: string;
  prevPostItem?: SeriesPostItem | null;
  nextPostItem?: SeriesPostItem | null;
}

const ANIMATION_DURATION_MS = 200;

export function HomeSiderPanel({
  type,
  defaultSegmentType,
  homeInfo,
  tocHeadings,
  tocNumbering = true,
  seriesPostItems = [],
  currentPostSlug,
  prevPostItem,
  nextPostItem,
}: HomeSiderPanelProps) {
  const isPostPage = type === HomeSiderType.POST;
  const storeSegment = useStore(homeSiderSegmentType);
  const effectiveSegment = isPostPage ? storeSegment : HomeSiderSegmentType.INFO;
  const [activeSegment, setActiveSegment] = useState<HomeSiderSegmentType>(effectiveSegment);
  const [enteringSegment, setEnteringSegment] = useState<HomeSiderSegmentType | null>(null);
  const [exitingSegment, setExitingSegment] = useState<HomeSiderSegmentType | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!isPostPage) {
      homeSiderSegmentType.set(HomeSiderSegmentType.INFO);
    } else {
      homeSiderSegmentType.set(defaultSegmentType);
    }
  }, [defaultSegmentType, isPostPage]);

  useEffect(() => {
    if (isFirstRender.current) {
      setActiveSegment(effectiveSegment);
      isFirstRender.current = false;
      return;
    }

    if (effectiveSegment === activeSegment) return;

    setExitingSegment(activeSegment);
    setActiveSegment(effectiveSegment);
    setEnteringSegment(effectiveSegment);

    const timeoutId = window.setTimeout(() => {
      setExitingSegment(null);
      setEnteringSegment(null);
    }, ANIMATION_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeSegment, effectiveSegment]);

  const slotClassName = (slotType: HomeSiderSegmentType) =>
    cn('sider-slot', {
      hidden: slotType !== activeSegment && slotType !== exitingSegment,
      entering: slotType === enteringSegment,
      exiting: slotType === exitingSegment,
    });

  const defaultSegmentValue = useMemo(
    () => (isPostPage ? defaultSegmentType : HomeSiderSegmentType.INFO),
    [defaultSegmentType, isPostPage],
  );

  return (
    <>
      {isPostPage && (
        <HomeSiderSegmented
          className="my-4 flex w-full justify-between text-sm/6"
          itemClass="grow"
          defaultValue={defaultSegmentValue}
          id="inner-home-sider"
        />
      )}

      <div
        className="vertical-scrollbar scroll-gutter-stable relative block w-full flex-1 overflow-x-hidden overflow-y-auto md:pt-4 md:pl-3"
        data-type={type}
        data-default-type={defaultSegmentValue}
      >
        <div className={slotClassName(HomeSiderSegmentType.INFO)} data-slot-type="info">
          <HomeInfoPanel className={type === HomeSiderType.HOME ? 'pt-18 md:pt-0' : ''} {...homeInfo} />
        </div>
        <div className={slotClassName(HomeSiderSegmentType.DIRECTORY)} data-slot-type="directory">
          {isPostPage && (
            <TableOfContents
              enableNumbering={tocNumbering}
              sourceHeadings={tocHeadings}
            />
          )}
        </div>
        <div className={slotClassName(HomeSiderSegmentType.SERIES)} data-slot-type="series">
          {isPostPage && (
            <SeriesPostList posts={seriesPostItems} currentPostSlug={currentPostSlug} />
          )}
        </div>
      </div>

      {isPostPage && (
        <SeriesNavigation prevPost={prevPostItem ?? null} nextPost={nextPostItem ?? null} className="w-full px-2" />
      )}

      <ScrollProgress className="mt-auto w-full rounded-full pt-4 sticky bottom-0" />
    </>
  );
}

export default HomeSiderPanel;
