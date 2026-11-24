import { cva } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type BadgeStatus = "default" | "success" | "warning" | "danger" | "info";

const badgeStyles = cva(
  [
    "z-10 box-border inline-flex items-center justify-center whitespace-nowrap",
    "font-medium leading-4 text-lark-on-primary",
    "transition-colors duration-100 ease-lark-linear",
  ],
  {
    variants: {
      status: {
        default: "bg-[var(--lark-neutral-650)] dark:bg-[var(--lark-neutral-300)]",
        success:
          "bg-[var(--lark-success-content-pressed)] dark:bg-[var(--lark-success-fill-loading)]",
        warning:
          "bg-[var(--lark-warning-content-pressed)] dark:bg-[var(--lark-warning-fill-loading)]",
        danger: "bg-lark-danger-strong",
        info: "bg-lark-primary",
      },
      variant: {
        count: "h-4 min-w-4 rounded-lark-full px-1 text-lark-12",
        text: "h-4 min-w-4 rounded-lark-full px-1 text-lark-12",
        dot: "size-2 rounded-lark-full",
      },
    },
    defaultVariants: {
      status: "danger",
      variant: "count",
    },
  },
);

export type BadgeProps = Omit<ComponentPropsWithoutRef<"span">, "children"> & {
  /** Numeric count. Values above `overflowCount` render as `{overflowCount}+`. */
  count?: number;
  /** Maximum count rendered before switching to the overflow form. */
  overflowCount?: number;
  /** Renders an 8 × 8 dot instead of text. */
  dot?: boolean;
  /** Semantic colour. Counts default to the strong notification red. */
  status?: BadgeStatus;
  /** Character badge content, for example "New". Takes precedence over `count`. */
  text?: ReactNode;
  /** Content to anchor an offset badge on. */
  children?: ReactNode;
  /** Renders the badge in flow instead of positioning it over `children`. */
  standalone?: boolean;
  /** Accessible label for the badge. For counts the full total is read when overflowing. */
  label?: string;
};

export function Badge({
  count,
  overflowCount = 99,
  dot = false,
  status,
  text,
  children,
  standalone = false,
  label,
  className,
  ...props
}: BadgeProps) {
  const resolvedStatus = status ?? "danger";
  const hasCount = typeof count === "number";
  const zeroCount = hasCount && count === 0;
  const showCount = hasCount && !zeroCount;
  const overflowed = showCount && count > overflowCount;
  const displayCount = showCount ? (overflowed ? `${overflowCount}+` : String(count)) : undefined;
  const visibleContent = text ?? displayCount;
  // A dot never renders the count, and `text` takes precedence over it, so the
  // count is only read out when it is the visible content and overflows.
  const accessibleText = dot
    ? label
    : (label ?? (text == null && overflowed ? String(count) : undefined));
  const hideVisibleContent = accessibleText != null;
  const overlay = children != null && !standalone;
  const variant = dot ? "dot" : text != null ? "text" : "count";

  // UD hides empty badges and zero counts: a 0 badge signals nothing to do.
  // A dot with an explicit count of 0 is hidden too; dots without a count stay.
  const isHidden = dot
    ? zeroCount && text == null
    : visibleContent == null || visibleContent === "";

  if (isHidden) {
    return children == null ? null : children;
  }

  return (
    <span
      {...props}
      data-slot="badge-root"
      data-standalone={standalone ? "" : undefined}
      className={cn(
        overlay ? "relative inline-flex align-baseline" : "inline-flex items-center",
        className,
      )}
    >
      {children}
      <span
        data-slot="badge"
        data-status={resolvedStatus}
        data-dot={dot ? "" : undefined}
        data-overlay={overlay ? "" : undefined}
        className={cn(
          badgeStyles({ status: resolvedStatus, variant }),
          overlay &&
            "absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 ring-2 ring-lark-canvas",
        )}
      >
        {dot ? (
          accessibleText ? (
            <span className="sr-only">{accessibleText}</span>
          ) : null
        ) : (
          <>
            {visibleContent != null ? (
              <span
                data-slot="badge-content"
                className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                aria-hidden={hideVisibleContent ? "true" : undefined}
              >
                {visibleContent}
              </span>
            ) : null}
            {accessibleText ? <span className="sr-only">{accessibleText}</span> : null}
          </>
        )}
      </span>
    </span>
  );
}
