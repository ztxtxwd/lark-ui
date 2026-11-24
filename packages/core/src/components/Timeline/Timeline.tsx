import type {
  TimelineItemState,
  TimelineStatus,
  TimelineItemProps as UiTimelineItemProps,
} from "@ui-sdk/react/timeline";
import {
  TimelineConnector,
  TimelineDescription,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
  Timeline as UiTimeline,
  TimelineItem as UiTimelineItem,
} from "@ui-sdk/react/timeline";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { Children, cloneElement, createContext, Fragment, isValidElement, useContext } from "react";
import { SpinnerIcon } from "../../icons";
import { cn } from "../../lib/cn";

/**
 * Left/right is UD's single-sided structure; `alternate` is the documented
 * two-sided timeline (时间轴为双侧).
 */
export type TimelineMode = "left" | "right" | "alternate";

/** UD node colour. `primary` is the default blue node. */
export type TimelineItemTone = "primary" | "success" | "warning" | "danger" | "neutral";

/** Process status plus UD's verification states. */
export type TimelineItemStatus = TimelineStatus | "success" | "warning" | "danger" | "loading";

export type TimelineProps = Omit<
  ComponentProps<typeof UiTimeline>,
  "children" | "render" | "orientation" | "feed" | "busy"
> & {
  /** Vertical structure. Defaults to `left`. */
  mode?: TimelineMode;
  children?: ReactNode;
};

export type TimelineItemProps = Omit<UiTimelineItemProps, "status" | "render" | "children"> & {
  /** Process / verification state of the node. */
  status?: TimelineItemStatus;
  /** Convenience for `status="current"`. */
  active?: boolean;
  /** Shows the UD loading node. `loading` is an alias. */
  pending?: boolean;
  loading?: boolean;
  /** Node colour. Defaults from `status`. */
  tone?: TimelineItemTone;
  /** Alias of `tone`. */
  color?: TimelineItemTone;
  /** Custom node content, e.g. an icon. */
  dot?: ReactNode;
  title?: ReactNode;
  /** Timestamp text. Rendered as a `<time>` and used as the item description. */
  time?: ReactNode;
  /** Machine-readable timestamp for the `<time>` element. */
  dateTime?: string;
  description?: ReactNode;
  children?: ReactNode;
  /** Injected by Timeline; also usable when composing items by hand. */
  index?: number;
  className?: string | ((state: TimelineItemState) => string | undefined);
};

const TimelineModeContext = createContext<TimelineMode>("left");

const markerTone: Record<TimelineItemTone, string> = {
  primary: "text-lark-primary-content",
  success: "text-lark-success-content",
  warning: "text-lark-warning",
  danger: "text-lark-danger-content",
  neutral: "text-lark-icon-3",
};

/**
 * Alternate mode needs each item's position. Walk fragments too, so a
 * conditional group does not shift every following node.
 */
function injectIndexes(children: ReactNode): ReactNode {
  let index = 0;

  function walk(nodes: ReactNode): ReactNode {
    return Children.map(nodes, (child) => {
      if (!isValidElement(child)) {
        return child;
      }
      if (child.type === Fragment) {
        return cloneElement(
          child as ReactElement<{ children?: ReactNode }>,
          undefined,
          walk((child.props as { children?: ReactNode }).children),
        );
      }
      const itemIndex = index;
      index += 1;
      return cloneElement(child as ReactElement<{ index?: number }>, { index: itemIndex });
    });
  }

  return walk(children);
}

export function Timeline({ mode = "left", className, children, ...props }: TimelineProps) {
  // The two-sided layout alternates from the item's position. Inject the
  // index so TimelineItem can choose its side without CSS hacks.
  const items = mode === "alternate" ? injectIndexes(children) : children;

  return (
    <TimelineModeContext.Provider value={mode}>
      <UiTimeline
        {...props}
        render={<ol data-mode={mode} />}
        className={(state) =>
          cn(
            // UD: `.ud__timeline { margin: 0; padding: 8px 0 0; list-style: none }`
            "m-0 list-none p-0 pt-2",
            typeof className === "function" ? className(state) : className,
          )
        }
      >
        {items}
      </UiTimeline>
    </TimelineModeContext.Provider>
  );
}

export function TimelineItem({
  status,
  active = false,
  pending = false,
  loading = false,
  tone,
  color,
  dot,
  title,
  time,
  dateTime,
  description,
  children,
  index = 0,
  className,
  ...props
}: TimelineItemProps) {
  const mode = useContext(TimelineModeContext);
  const isLoading = pending || loading || status === "loading";
  const effectiveStatus = active ? "current" : status;

  const uiStatus: TimelineStatus | undefined =
    effectiveStatus === "complete" ||
    effectiveStatus === "success" ||
    effectiveStatus === "warning" ||
    effectiveStatus === "danger"
      ? "complete"
      : effectiveStatus === "current"
        ? "current"
        : effectiveStatus === "upcoming"
          ? "upcoming"
          : undefined;

  const resolvedTone: TimelineItemTone =
    color ??
    tone ??
    (effectiveStatus === "success"
      ? "success"
      : effectiveStatus === "warning"
        ? "warning"
        : effectiveStatus === "danger"
          ? "danger"
          : effectiveStatus === "upcoming"
            ? "neutral"
            : "primary");

  const isPrimaryDone = uiStatus === "complete" || uiStatus === "current";
  const dotBackground: Record<TimelineItemTone, string> = {
    primary: isPrimaryDone ? "bg-lark-primary-content" : "bg-lark-primary",
    success: "bg-lark-success-content",
    warning: "bg-lark-warning",
    danger: "bg-lark-danger-content",
    neutral: "bg-lark-icon-3",
  };

  const titleTone =
    effectiveStatus === "danger"
      ? "text-lark-danger-content"
      : effectiveStatus === "warning"
        ? "text-lark-warning"
        : effectiveStatus === "upcoming" || isLoading
          ? "text-lark-caption"
          : "text-lark-title";

  const hasCustomDot = dot !== undefined && dot !== null && !isLoading;
  const markerPadding = hasCustomDot ? "pt-px" : isLoading ? "pt-[3px]" : "pt-[7px]";
  const connectorTop = hasCustomDot ? "top-[21px]" : isLoading ? "top-[19px]" : "top-[15px]";

  const body = description ?? children;
  const contentRight = index % 2 === 0;

  const marker = (
    <TimelineMarker
      className={cn(
        "absolute top-0 z-10 flex w-5 justify-center",
        markerPadding,
        mode === "left" && "left-0",
        mode === "right" && "right-0",
        mode === "alternate" && "left-1/2 -translate-x-1/2",
      )}
    >
      {isLoading ? (
        <SpinnerIcon size={16} className="text-lark-primary-content" />
      ) : hasCustomDot ? (
        <span
          data-slot="timeline-dot"
          className={cn("flex size-5 items-center justify-center", markerTone[resolvedTone])}
        >
          {dot}
        </span>
      ) : (
        <span
          data-slot="timeline-dot"
          className={cn("size-2 rounded-lark-full", dotBackground[resolvedTone])}
        />
      )}
    </TimelineMarker>
  );

  const connector = (
    <TimelineConnector
      className={cn(
        // `.ud__timeline-item__tail`: 1px divider, scaled to a hairline.
        "absolute bottom-0 z-0 w-px bg-lark-divider [li:last-child_&]:hidden",
        connectorTop,
        mode === "left" && "left-[9.5px]",
        mode === "right" && "right-[9.5px]",
        mode === "alternate" && "left-1/2 -translate-x-1/2",
      )}
    />
  );

  const contentBody = (
    <>
      {title !== undefined && title !== null ? (
        <TimelineTitle className={cn("block break-words [overflow-wrap:anywhere]", titleTone)}>
          {title}
        </TimelineTitle>
      ) : null}
      {body !== undefined && body !== null ? (
        <TimelineDescription className="block break-words text-lark-title [overflow-wrap:anywhere]">
          {body}
        </TimelineDescription>
      ) : null}
    </>
  );

  const inlineTime =
    time !== undefined && time !== null ? (
      <TimelineTime dateTime={dateTime} className="block text-lark-caption">
        {time}
      </TimelineTime>
    ) : null;

  const oppositeTime =
    time !== undefined && time !== null ? (
      <TimelineTime
        dateTime={dateTime}
        className={cn("block text-lark-caption", contentRight ? "text-right" : "text-left")}
      >
        {time}
      </TimelineTime>
    ) : null;

  return (
    <UiTimelineItem
      {...props}
      status={uiStatus}
      render={
        <li
          data-tone={resolvedTone}
          data-pending={isLoading ? "" : undefined}
          aria-busy={isLoading || undefined}
        />
      }
      className={(state) =>
        cn(
          // `.ud__timeline-item`: 14px / 1.4286, 24px medium node spacing.
          "relative pb-6 text-lark-14 leading-[1.4286] text-lark-title",
          mode === "left" && "pl-[18px]",
          mode === "right" && "pr-[11px] text-right",
          mode === "alternate" && "grid grid-cols-2",
          typeof className === "function" ? className(state) : className,
        )
      }
    >
      {marker}
      {connector}
      {mode === "alternate" ? (
        contentRight ? (
          <>
            <div
              data-slot="timeline-label"
              className="col-start-1 row-start-1 min-w-0 pr-[18px] text-right"
            >
              {oppositeTime}
            </div>
            <div data-slot="timeline-content" className="col-start-2 row-start-1 min-w-0 pl-[18px]">
              {contentBody}
            </div>
          </>
        ) : (
          <>
            <div
              data-slot="timeline-content"
              className="col-start-1 row-start-1 min-w-0 pr-[11px] text-right"
            >
              {contentBody}
            </div>
            <div data-slot="timeline-label" className="col-start-2 row-start-1 min-w-0 pl-[11px]">
              {oppositeTime}
            </div>
          </>
        )
      ) : (
        <div
          data-slot="timeline-content"
          className={cn("min-w-0", mode === "right" && "text-right")}
        >
          {inlineTime}
          {contentBody}
        </div>
      )}
    </UiTimelineItem>
  );
}
