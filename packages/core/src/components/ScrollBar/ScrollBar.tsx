import {
  type ScrollAreaType,
  ScrollArea as UiScrollArea,
  ScrollAreaContent as UiScrollAreaContent,
  ScrollAreaScrollbar as UiScrollAreaScrollbar,
  ScrollAreaThumb as UiScrollAreaThumb,
  ScrollAreaViewport as UiScrollAreaViewport,
} from "@ui-sdk/react/scroll-area";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type ScrollBarOrientation = "vertical" | "horizontal" | "both";
export type ScrollBarVisibility = ScrollAreaType;

type UiScrollAreaProps = ComponentProps<typeof UiScrollArea>;

export type ScrollBarProps = Omit<UiScrollAreaProps, "type" | "children" | "style"> & {
  children: ReactNode;
  /** Which axes get a custom scrollbar. Defaults to `vertical`. */
  orientation?: ScrollBarOrientation;
  /** Visible thumb thickness in px. Defaults to 7, with a 2px padding on each side. */
  thickness?: number;
  /** Minimum thumb length in px, including its 2px padding. Defaults to 24. */
  minThumbSize?: number;
  /**
   * When the bars show: `auto` while the axis overflows, `always`, `scroll`
   * while scrolling, or `hover` while scrolling or hovered. Defaults to `auto`.
   * An axis without scroll ability never shows a bar, even with `always`, as
   * UD hides scrollbars without scroll ability.
   */
  visibility?: ScrollBarVisibility;
  /** Convenience max height for the scrolling viewport. */
  maxHeight?: number | string;
  /** Accessible name of the scrollable region. Defaults to `可滚动区域`. */
  label?: string;
  viewportClassName?: string;
  contentClassName?: string;
  scrollbarClassName?: string;
  thumbClassName?: string;
  style?: CSSProperties;
};

const verticalBarStyles =
  "pointer-events-none z-10 flex w-[var(--lark-scrollbar-hit)] flex-col opacity-0 transition-opacity duration-200 ease-[cubic-bezier(.34,.69,.1,1)] data-[visible]:data-[overflow-y]:opacity-100 data-[overflow-y]:pointer-events-auto";

const horizontalBarStyles =
  "pointer-events-none z-10 flex h-[var(--lark-scrollbar-hit)] flex-row opacity-0 transition-opacity duration-200 ease-[cubic-bezier(.34,.69,.1,1)] data-[visible]:data-[overflow-x]:opacity-100 data-[overflow-x]:pointer-events-auto";

const verticalThumbStyles = cn(
  "relative w-full min-h-[var(--lark-scrollbar-min)] rounded-full",
  "border-2 border-solid border-transparent bg-lark-title/30 bg-clip-padding",
  "transition-colors duration-200 ease-[cubic-bezier(.34,.69,.1,1)]",
  "hover:bg-lark-title/60 data-[dragging]:bg-lark-title/60",
);

const horizontalThumbStyles = cn(
  "relative h-full min-w-[var(--lark-scrollbar-min)] rounded-full",
  "border-2 border-solid border-transparent bg-lark-title/30 bg-clip-padding",
  "transition-colors duration-200 ease-[cubic-bezier(.34,.69,.1,1)]",
  "hover:bg-lark-title/60 data-[dragging]:bg-lark-title/60",
);

/**
 * A native scrolling region with UD scrollbars: an 11px hit area around a 7px
 * thumb (N900 30%, 60% on hover), a 24px minimum thumb, and optional auto-hide.
 * Wheel, touch, keyboard and screen-reader scrolling stay native; the thumb is
 * draggable and the track is clickable.
 */
export function ScrollBar({
  children,
  orientation = "vertical",
  thickness = 7,
  minThumbSize = 24,
  visibility = "auto",
  maxHeight,
  label,
  className,
  style,
  viewportClassName,
  contentClassName,
  scrollbarClassName,
  thumbClassName,
  ...props
}: ScrollBarProps) {
  const showVertical = orientation !== "horizontal";
  const showHorizontal = orientation !== "vertical";

  const rootStyle = {
    "--lark-scrollbar-hit": `${thickness + 4}px`,
    "--lark-scrollbar-thickness": `${thickness}px`,
    "--lark-scrollbar-min": `${minThumbSize}px`,
    ...style,
  } as CSSProperties;

  return (
    <UiScrollArea
      {...props}
      type={visibility}
      className={cn("relative max-w-full", className)}
      style={rootStyle}
    >
      <UiScrollAreaViewport
        role="region"
        aria-label={label ?? "可滚动区域"}
        style={maxHeight !== undefined ? { maxHeight } : undefined}
        className={cn(
          "size-full outline-none",
          "focus-visible:outline-solid focus-visible:outline-2",
          "focus-visible:outline-offset-[-2px] focus-visible:outline-lark-primary",
          viewportClassName,
        )}
      >
        <UiScrollAreaContent className={contentClassName}>{children}</UiScrollAreaContent>
      </UiScrollAreaViewport>

      {showVertical ? (
        <UiScrollAreaScrollbar
          orientation="vertical"
          className={cn(verticalBarStyles, scrollbarClassName)}
        >
          <UiScrollAreaThumb className={cn(verticalThumbStyles, thumbClassName)} />
        </UiScrollAreaScrollbar>
      ) : null}

      {showHorizontal ? (
        <UiScrollAreaScrollbar
          orientation="horizontal"
          className={cn(horizontalBarStyles, scrollbarClassName)}
        >
          <UiScrollAreaThumb className={cn(horizontalThumbStyles, thumbClassName)} />
        </UiScrollAreaScrollbar>
      ) : null}
    </UiScrollArea>
  );
}
