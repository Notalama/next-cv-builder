"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const EDGE_THRESHOLD_PX = 240;

type ScrollControlsProps = {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
};

export function ScrollControls({ scrollContainerRef }: ScrollControlsProps) {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container == null) {
      return;
    }

    const updateVisibility = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - clientHeight - scrollTop;
      const canScroll = scrollHeight > clientHeight + EDGE_THRESHOLD_PX;

      setShowScrollToTop(canScroll && scrollTop > EDGE_THRESHOLD_PX);
      setShowScrollToBottom(
        canScroll && distanceFromBottom > EDGE_THRESHOLD_PX,
      );
    };

    updateVisibility();
    container.addEventListener("scroll", updateVisibility, { passive: true });
    const resizeObserver = new ResizeObserver(updateVisibility);
    resizeObserver.observe(container);
    if (container.firstElementChild != null) {
      resizeObserver.observe(container.firstElementChild);
    }
    return () => {
      container.removeEventListener("scroll", updateVisibility);
      resizeObserver.disconnect();
    };
  }, [scrollContainerRef]);

  if (!showScrollToTop && !showScrollToBottom) {
    return null;
  }

  return (
    <div className="cv-hide-on-print absolute right-6 bottom-6 z-10 flex flex-col gap-2">
      {showScrollToTop ? (
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="shadow-md"
          aria-label="Scroll to top"
          onClick={() => {
            scrollContainerRef.current?.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        >
          <ArrowUp className="size-4" />
        </Button>
      ) : null}
      {showScrollToBottom ? (
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="shadow-md"
          aria-label="Scroll to bottom"
          onClick={() => {
            const container = scrollContainerRef.current;
            if (container == null) {
              return;
            }
            container.scrollTo({
              top: container.scrollHeight,
              behavior: "smooth",
            });
          }}
        >
          <ArrowDown className="size-4" />
        </Button>
      ) : null}
    </div>
  );
}
