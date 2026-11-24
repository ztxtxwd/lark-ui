import { cva } from "class-variance-authority";
import type { ComponentProps, ReactNode, Ref } from "react";
import { XIcon } from "../../icons";
import { cn } from "../../lib/cn";

export type TagTone = "neutral" | "primary" | "success" | "warning" | "danger";
export type TagSize = "sm" | "md";

const tagStyles = cva(
  [
    "box-border inline-flex max-w-full select-none items-center gap-1",
    "whitespace-nowrap rounded-lark-sm border-0 font-normal",
    "transition-colors duration-100 ease-lark-linear",
    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
  ],
  {
    variants: {
      tone: {
        neutral: "bg-[var(--lark-tag-fill-neutral)] text-lark-tag-neutral",
        primary: "bg-[var(--lark-tag-fill-primary)] text-lark-tag-primary",
        success: "bg-[var(--lark-tag-fill-success)] text-lark-tag-success",
        warning: "bg-[var(--lark-tag-fill-warning)] text-lark-tag-warning",
        danger: "bg-[var(--lark-tag-fill-danger)] text-lark-tag-danger",
      },
      size: {
        sm: "h-5 px-1.5 text-lark-12 leading-5",
        md: "h-6 px-2 text-lark-12 leading-6",
      },
    },
    defaultVariants: {
      tone: "neutral",
      size: "md",
    },
  },
);

export type TagProps = Omit<ComponentProps<"span">, "children"> & {
  /** Semantic colour of the tag. */
  tone?: TagTone;
  size?: TagSize;
  /** Shows a remove button after the label. */
  closable?: boolean;
  /** Accessible name of the remove button. */
  closeLabel?: string;
  onClose?: () => void;
  /** Decorative leading icon. */
  startIcon?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
  ref?: Ref<HTMLSpanElement>;
};

export function Tag({
  tone = "neutral",
  size = "md",
  closable = false,
  closeLabel = "移除",
  onClose,
  startIcon,
  disabled = false,
  className,
  children,
  ref,
  ...props
}: TagProps) {
  return (
    <span
      {...props}
      ref={ref}
      data-slot="tag"
      data-tone={tone}
      data-size={size}
      data-disabled={disabled ? "" : undefined}
      aria-disabled={disabled || undefined}
      className={cn(tagStyles({ tone, size }), className)}
    >
      {startIcon ? (
        <span aria-hidden="true" className="inline-flex shrink-0 items-center [&_svg]:size-3">
          {startIcon}
        </span>
      ) : null}
      <span className="min-w-0 truncate">{children}</span>
      {closable ? (
        <button
          type="button"
          data-slot="tag-close"
          aria-label={closeLabel}
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            onClose?.();
          }}
          className={cn(
            "-mr-1 inline-flex size-4 shrink-0 cursor-pointer items-center justify-center",
            "rounded-lark-xs border-0 bg-transparent p-0 text-current",
            "opacity-60 transition-opacity duration-100 ease-lark-linear",
            "hover:opacity-100 active:opacity-100",
            "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-lark-primary",
            "disabled:cursor-not-allowed disabled:opacity-40",
          )}
        >
          <XIcon size={12} />
        </button>
      ) : null}
    </span>
  );
}
