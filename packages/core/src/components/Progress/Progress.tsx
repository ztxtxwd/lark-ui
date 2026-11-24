import {
  type NumberFormat,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
  Progress as UiProgress,
} from "@ui-sdk/react/progress";
import { cva } from "class-variance-authority";
import type { ComponentProps, ReactNode, Ref } from "react";
import { cn } from "../../lib/cn";

export type ProgressSize = "sm" | "md" | "lg";
export type ProgressStatus = "normal" | "success" | "warning" | "danger";

const trackStyles = cva("relative min-w-0 flex-1 overflow-hidden bg-lark-border-card", {
  variants: {
    size: {
      /* UD documents a 4px track at the default size; 2px / 8px keep the 2N / 4N rhythm. */
      sm: "h-0.5 rounded-lark-xs",
      md: "h-1 rounded-lark-xs",
      lg: "h-2 rounded-lark-xs",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const indicatorStyles = cva(
  [
    "block h-full rounded-lark-xs",
    "[transition:width_300ms_var(--lark-ease-linear),background-color_200ms_linear]",
  ],
  {
    variants: {
      status: {
        normal: "bg-lark-primary-content",
        success: "bg-lark-success-content",
        warning: "bg-lark-warning-content",
        danger: "bg-lark-danger-content",
      },
    },
    defaultVariants: {
      status: "normal",
    },
  },
);

/*
 * ui-sdk removes the indicator width while the value is unknown. UD asks for a
 * segment that sweeps along the fixed track, growing and shrinking.
 */
const indeterminateStyles = `
@keyframes lark-progress-indeterminate {
  0% { inset-inline-start: -40%; width: 40%; }
  55% { inset-inline-start: 45%; width: 55%; }
  100% { inset-inline-start: 100%; width: 40%; }
}
.lark-progress-indeterminate {
  position: relative;
  animation: lark-progress-indeterminate 1.8s var(--lark-ease-standard) infinite;
}
@media (prefers-reduced-motion: reduce) {
  .lark-progress-indeterminate {
    inset-inline-start: 0;
    width: 100%;
    animation: none;
    opacity: 0.4;
  }
}
`;

export type ProgressProps = Omit<ComponentProps<"div">, "children" | "value" | "ref"> & {
  /** How far the task has come. Omit or pass null for an unknown amount. */
  value?: number | null;
  /** The lowest value. */
  min?: number;
  /** The highest value. */
  max?: number;
  size?: ProgressSize;
  status?: ProgressStatus;
  /** Show the formatted value beside the track. */
  showInfo?: boolean;
  /** `Intl.NumberFormat` options, or a function of the value, for the value text. */
  format?: NumberFormat;
  /** Force the unknown-progress (moving segment) state. */
  indeterminate?: boolean;
  /** Visible label. `children` takes precedence when both are set. */
  label?: ReactNode;
  /** Visible label; a convenient alternative to `label`. */
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
};

export function Progress({
  value,
  min = 0,
  max = 100,
  size = "md",
  status = "normal",
  showInfo = false,
  format,
  indeterminate = false,
  label,
  children,
  className,
  ref,
  "aria-label": ariaLabel,
  ...props
}: ProgressProps) {
  const unknown = indeterminate || value === null || value === undefined;
  const visibleLabel = children ?? label;

  return (
    <>
      <style href="lark-progress-indeterminate" precedence="default">
        {indeterminateStyles}
      </style>
      <UiProgress
        {...props}
        ref={ref}
        value={unknown ? null : value}
        min={min}
        max={max}
        format={format}
        aria-label={visibleLabel ? ariaLabel : (ariaLabel ?? "进度")}
        data-status={status}
        className={cn("flex w-full flex-col gap-2", className)}
      >
        {visibleLabel ? (
          <ProgressLabel className="text-lark-14 text-lark-title">{visibleLabel}</ProgressLabel>
        ) : null}
        <div className="flex w-full items-center gap-3">
          <ProgressTrack className={trackStyles({ size })}>
            <ProgressIndicator
              className={cn(indicatorStyles({ status }), unknown && "lark-progress-indeterminate")}
            />
          </ProgressTrack>
          {showInfo && !unknown ? (
            <ProgressValue className="shrink-0 text-lark-12 text-lark-caption tabular-nums" />
          ) : null}
        </div>
      </UiProgress>
    </>
  );
}
