import { cva } from "class-variance-authority";
import type { ComponentProps, ReactNode, Ref } from "react";
import { cn } from "../../lib/cn";

export type EmptySize = "sm" | "md" | "lg";

const illustrationStyles = cva("flex shrink-0 items-center justify-center leading-none", {
  variants: {
    size: {
      /* UD illustration sizes: 60 / 120 / 150px. */
      sm: "size-[60px]",
      md: "size-[120px]",
      lg: "size-[150px]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

/** Restrained grey empty-state illustration drawn in the UD neutral language. */
function EmptyIllustration() {
  return (
    <svg
      aria-hidden="true"
      className="h-full w-full"
      fill="none"
      focusable="false"
      viewBox="0 0 120 120"
    >
      <circle cx="60" cy="60" r="46" className="fill-lark-neutral-100" />
      <rect
        x="38"
        y="31"
        width="44"
        height="57"
        rx="6"
        className="fill-lark-canvas stroke-lark-neutral-300"
        strokeWidth={2}
      />
      <path
        d="M47 47h26M47 57h26M47 67h16"
        className="stroke-lark-neutral-300"
        strokeLinecap="round"
        strokeWidth={2}
      />
      <circle
        cx="80"
        cy="82"
        r="13"
        className="fill-lark-neutral-200 stroke-lark-neutral-400"
        strokeWidth={2}
      />
      <path
        d="m89.5 91.5 7.5 7.5"
        className="stroke-lark-neutral-400"
        strokeLinecap="round"
        strokeWidth={3}
      />
    </svg>
  );
}

export type EmptyProps = Omit<ComponentProps<"div">, "title" | "children" | "ref"> & {
  /** Short, single-line summary. */
  title?: ReactNode;
  /** One-sentence explanation of the empty state. */
  description?: ReactNode;
  /** Action slot, typically one or two `Button`s. `children` is a fallback. */
  action?: ReactNode;
  size?: EmptySize;
  /**
   * Custom illustration. Defaults to the built-in grey drawing; pass `null`
   * or `false` to omit the illustration entirely.
   */
  illustration?: ReactNode;
  /** Action slot; `action` takes precedence when both are set. */
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
};

export function Empty({
  title,
  description,
  action,
  size = "md",
  illustration,
  children,
  className,
  ref,
  ...props
}: EmptyProps) {
  const art = illustration === undefined ? <EmptyIllustration /> : illustration;
  const footer = action ?? children;

  return (
    <div
      {...props}
      ref={ref}
      data-slot="empty"
      className={cn(
        "mx-auto flex max-w-[250px] flex-col items-center text-center",
        "text-lark-14 text-lark-title",
        className,
      )}
    >
      {art ? (
        <div
          aria-hidden={illustration === undefined ? true : undefined}
          className={illustrationStyles({ size })}
        >
          {art}
        </div>
      ) : null}
      {title ? <div className={cn("text-lark-title", art && "mt-4")}>{title}</div> : null}
      {description ? (
        <div className={cn("text-lark-caption", title ? "mt-1" : art && "mt-4")}>{description}</div>
      ) : null}
      {footer ? (
        <div
          data-slot="empty-footer"
          className="mt-4 flex flex-row-reverse flex-wrap justify-center gap-2"
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}
