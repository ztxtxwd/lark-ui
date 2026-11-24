import { cva } from "class-variance-authority";
import type { ComponentProps, ReactNode, Ref } from "react";
import { cn } from "../../lib/cn";

export type LoadingSize = "sm" | "md" | "lg";
export type LoadingTone = "primary" | "neutral" | "inverse";
export type LoadingDirection = "vertical" | "horizontal";

const spinnerStyles = cva("lark-spinner", {
  variants: {
    size: {
      /* UD Spin sizes: 14 / 24 / 40px. */
      sm: "size-3.5",
      md: "size-6",
      lg: "size-10",
    },
    tone: {
      primary: "text-lark-primary-content",
      neutral: "text-lark-neutral-400",
      inverse: "text-lark-on-primary",
    },
  },
  defaultVariants: {
    size: "md",
    tone: "primary",
  },
});

const tipStyles = cva("text-lark-14 text-lark-caption", {
  variants: {
    direction: {
      vertical: "",
      horizontal: "ml-2",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  compoundVariants: [
    { direction: "vertical", size: "md", class: "mt-1" },
    { direction: "vertical", size: "lg", class: "mt-3" },
  ],
  defaultVariants: {
    direction: "vertical",
    size: "md",
  },
});

const contentStyles = cva("flex items-center", {
  variants: {
    direction: {
      vertical: "flex-col",
      horizontal: "flex-row",
    },
  },
  defaultVariants: {
    direction: "vertical",
  },
});

export type LoadingProps = Omit<ComponentProps<"div">, "children" | "ref"> & {
  size?: LoadingSize;
  /** Spinner colour role. `inverse` is white for dark backgrounds. */
  tone?: LoadingTone;
  /** Optional description shown beside or below the spinner. */
  tip?: ReactNode;
  direction?: LoadingDirection;
  /** Fill the parent width and centre the indicator. */
  centered?: boolean;
  /**
   * Cover the passed children with the UD loading mask (60% canvas) while they
   * are inert. Requires `children`; without them the inline indicator renders.
   */
  overlay?: boolean;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
};

export function Loading({
  size = "md",
  tone = "primary",
  tip,
  direction = "vertical",
  centered = false,
  overlay = false,
  children,
  className,
  ref,
  "aria-label": ariaLabel,
  ...props
}: LoadingProps) {
  const label = ariaLabel ?? (tip ? undefined : "加载中");
  const spinner = <span aria-hidden="true" className={spinnerStyles({ size, tone })} />;
  const tipNode = tip ? <span className={tipStyles({ direction, size })}>{tip}</span> : null;

  if (overlay && children) {
    return (
      <div
        {...props}
        ref={ref}
        aria-busy="true"
        data-loading-overlay=""
        className={cn("relative", className)}
      >
        <div inert className="pointer-events-none select-none">
          {children}
        </div>
        <div
          role="status"
          aria-live="polite"
          aria-label={label}
          className="absolute inset-0 z-[4] flex items-center justify-center bg-lark-canvas/60"
        >
          <div className={cn(contentStyles({ direction }))}>
            {spinner}
            {tipNode}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      {...props}
      ref={ref}
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn(contentStyles({ direction }), centered && "w-full justify-center", className)}
    >
      {spinner}
      {tipNode}
    </div>
  );
}
