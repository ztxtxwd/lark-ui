import type { HTMLAttributes, ReactNode } from "react";
import { CheckIcon, SpinnerIcon, XIcon } from "../../icons";
import { cn } from "../../lib/cn";

export type StepsStatus = "wait" | "process" | "finish" | "error";
export type StepsDirection = "horizontal" | "vertical";
export type StepsSize = "sm" | "md";
export type StepsLabelPlacement = "horizontal" | "vertical";

export type StepsItem = {
  /** A stable key for the step. Defaults to the title when it is a string. */
  id?: string;
  /** The step title, shown on one or two lines. */
  title: ReactNode;
  /** Optional supporting copy under the title. */
  description?: ReactNode;
  /** Replaces the default number / check / error glyph inside the node. */
  icon?: ReactNode;
  /** Overrides the status derived from `current`. */
  status?: StepsStatus;
  /** Keeps a clickable step from running `onChange`. */
  disabled?: boolean;
  /** Shows the UD loading spinner in the node and keeps it in the process style. */
  loading?: boolean;
};

export type StepsProps = Omit<HTMLAttributes<HTMLOListElement>, "children" | "onChange"> & {
  items: StepsItem[];
  /** Zero-based index of the active step. Defaults to 0. */
  current?: number;
  /** Status of the active step. Defaults to "process". */
  status?: StepsStatus;
  direction?: StepsDirection;
  /** Node size: 24px (sm) or 28px (md). UD's base steps node is 28px. */
  size?: StepsSize;
  /**
   * Horizontal direction only. "vertical" centers the title under the node;
   * "horizontal" puts the title beside it.
   */
  labelPlacement?: StepsLabelPlacement;
  /** Makes the steps clickable and runs with the pressed index. */
  onChange?: (current: number) => void;
};

const nodeSize: Record<StepsSize, string> = {
  sm: "size-6 text-lark-12",
  md: "size-7 text-lark-14",
};

const glyphSize: Record<StepsSize, number> = {
  sm: 12,
  md: 14,
};

/**
 * Vertical connector: 8px under the node (UD `top: calc(50% + 22px)` against
 * the 28px node) down to the item edge; the next item's 8px top padding leaves
 * the 8px gap before the next node.
 */
const verticalConnector: Record<StepsSize, string> = {
  sm: "top-10 left-3",
  md: "top-11 left-3.5",
};

/** 24/28px node vs 22px title line: the title line centres on the node. */
const titleOffset: Record<StepsSize, string> = {
  sm: "pt-px",
  md: "pt-[3px]",
};

/** Horizontal connector, centered under the node. */
const horizontalConnector: Record<StepsSize, string> = {
  sm: "top-3 left-[calc(50%_+_20px)] right-[calc(-50%_+_20px)]",
  md: "top-3.5 left-[calc(50%_+_22px)] right-[calc(-50%_+_22px)]",
};

const nodeTone: Record<StepsStatus, string> = {
  wait: "border-lark-icon-3 bg-transparent text-lark-icon-3",
  process: "border-lark-primary bg-lark-primary text-lark-on-primary",
  finish: "border-lark-primary-content bg-transparent text-lark-primary-content",
  error: "border-lark-danger-strong bg-lark-danger-strong text-lark-on-danger",
};

const titleTone: Record<StepsStatus, string> = {
  wait: "text-lark-caption",
  process: "text-lark-title",
  finish: "text-lark-title",
  error: "text-lark-title",
};

/**
 * UD draws every connector at N900 30% (`.ud__steps__item-tail`,
 * `.ud__steps__item-title::after`), primary-content once the step is done and
 * danger when the next step failed.
 */
function connectorTone(status: StepsStatus, nextStatus: StepsStatus | undefined) {
  if (nextStatus === "error") {
    return "bg-lark-danger-strong";
  }
  return status === "finish" ? "bg-lark-primary-content" : "bg-lark-neutral-900/30";
}

function StepGlyph({
  item,
  index,
  status,
  size,
}: {
  item: StepsItem;
  index: number;
  status: StepsStatus;
  size: StepsSize;
}) {
  if (item.loading) {
    return <SpinnerIcon size={glyphSize[size]} />;
  }
  if (item.icon !== undefined) {
    return <span className="flex items-center justify-center">{item.icon}</span>;
  }
  if (status === "finish") {
    return <CheckIcon size={glyphSize[size]} />;
  }
  if (status === "error") {
    return <XIcon size={glyphSize[size]} />;
  }
  return <span className="leading-none tabular-nums">{index + 1}</span>;
}

/**
 * UD steps (步骤条): a semantic ordered list that guides a user through a
 * sequence of tasks. The active step carries `aria-current="step"`; passing
 * `onChange` turns each node into a real button.
 */
export function Steps({
  items,
  current = 0,
  status = "process",
  direction = "horizontal",
  size = "md",
  labelPlacement = "horizontal",
  onChange,
  className,
  ...props
}: StepsProps) {
  const clickable = onChange !== undefined;
  const vertical = direction === "vertical";
  const centered = !vertical && labelPlacement === "vertical";

  const resolved = items.map((item, index): StepsStatus => {
    if (item.status) {
      return item.status;
    }
    if (index < current) {
      return "finish";
    }
    return index === current ? status : "wait";
  });

  return (
    <ol
      {...props}
      data-slot="steps"
      data-direction={direction}
      data-size={size}
      data-label-placement={labelPlacement}
      className={cn(
        "m-0 list-none p-0 text-lark-title",
        vertical ? "grid w-full auto-rows-fr" : "flex w-full flex-row items-start",
        className,
      )}
    >
      {items.map((item, index) => {
        const itemStatus = resolved[index];
        const nextStatus = resolved[index + 1];
        const isCurrent = index === current;
        const nodeStatus = item.loading ? "process" : itemStatus;
        const isLast = index === items.length - 1;
        const interactive = clickable && !item.disabled;
        /** UD only treats a clickable step as hoverable when it is not current. */
        const canHover = interactive && !isCurrent;
        const showsConnector = nextStatus !== undefined && !isLast;

        const containerClass = cn(
          "group/step flex min-w-0 flex-1 border-0 bg-transparent p-0 text-left outline-none",
          "transition-colors duration-100 ease-lark-linear",
          centered ? "flex-col items-center text-center" : "flex-row items-start gap-2",
          interactive &&
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
          canHover && "cursor-pointer",
          item.disabled && "cursor-not-allowed",
        );

        const titleClass = cn(
          "line-clamp-2 min-w-0 max-w-full text-lark-14 leading-[22px]",
          "transition-colors duration-100 ease-lark-linear",
          titleTone[itemStatus],
          item.disabled && "text-lark-disabled",
          canHover && "group-hover/step:text-lark-primary-content",
        );

        const content = (
          <>
            <span
              data-slot="steps-icon"
              data-status={itemStatus}
              aria-hidden="true"
              className={cn(
                "relative z-10 flex shrink-0 items-center justify-center rounded-lark-full",
                "border border-solid transition-colors duration-100 ease-lark-linear",
                nodeSize[size],
                nodeTone[nodeStatus],
                centered && "mb-1",
                canHover &&
                  nodeStatus !== "process" &&
                  nodeStatus !== "error" &&
                  "group-hover/step:bg-lark-selected",
              )}
            >
              <StepGlyph item={item} index={index} status={itemStatus} size={size} />
            </span>
            <span
              className={cn(
                "flex min-w-0 flex-1 flex-col",
                centered && "items-center",
                !centered && titleOffset[size],
              )}
            >
              {vertical || centered ? (
                <span className={cn("relative inline-block", titleClass)}>{item.title}</span>
              ) : (
                // UD keeps the label on the node's centre line and starts the
                // connector 8px after the label (`title` padding-right), not
                // after the wider description.
                <span className="flex w-full min-w-0 items-center">
                  <span className={cn("relative inline-block pr-2", titleClass)}>{item.title}</span>
                  {showsConnector && (
                    <span
                      data-slot="steps-connector"
                      aria-hidden="true"
                      className={cn("h-px min-w-0 flex-1", connectorTone(itemStatus, nextStatus))}
                    />
                  )}
                </span>
              )}
              {item.description !== undefined && (
                <span
                  className={cn(
                    "line-clamp-2 max-w-full text-lark-12 leading-5 text-lark-caption",
                    centered ? "text-center" : "text-left",
                  )}
                >
                  {item.description}
                </span>
              )}
            </span>
          </>
        );

        return (
          <li
            key={item.id ?? (typeof item.title === "string" ? item.title : index)}
            aria-current={isCurrent ? "step" : undefined}
            aria-busy={item.loading || undefined}
            data-slot="steps-item"
            data-status={itemStatus}
            data-disabled={item.disabled ? "" : undefined}
            className={cn(
              "relative flex min-w-0",
              vertical
                ? cn("pt-2", !isLast && "pb-6")
                : centered
                  ? "flex-1 px-3"
                  : // UD: `.ud__steps__item:last-child { flex: none }`
                    cn(isLast ? "flex-none" : "flex-1", index > 0 && "pl-2"),
            )}
          >
            {clickable ? (
              <button
                type="button"
                disabled={item.disabled}
                aria-disabled={item.disabled || undefined}
                onClick={() => onChange?.(index)}
                data-disabled={item.disabled ? "" : undefined}
                className={containerClass}
              >
                {content}
              </button>
            ) : (
              <div className={containerClass}>{content}</div>
            )}
            {vertical && !isLast && nextStatus !== undefined && (
              <span
                data-slot="steps-connector"
                aria-hidden="true"
                className={cn(
                  "absolute bottom-0 w-px -translate-x-1/2",
                  verticalConnector[size],
                  connectorTone(itemStatus, nextStatus),
                )}
              />
            )}
            {centered && !isLast && nextStatus !== undefined && (
              <span
                data-slot="steps-connector"
                aria-hidden="true"
                className={cn(
                  "absolute h-px -translate-y-1/2",
                  horizontalConnector[size],
                  connectorTone(itemStatus, nextStatus),
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
