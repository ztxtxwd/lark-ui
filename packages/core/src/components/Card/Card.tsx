import { cva } from "class-variance-authority";
import type { ComponentProps, Ref } from "react";
import { cn } from "../../lib/cn";

export type CardVariant = "outlined" | "borderless" | "filled";
export type CardSize = "sm" | "md" | "lg";

/**
 * UD card metrics come from the client `.ud__card` rules:
 * 1px N300 border, N00/N100 background, 12px padding and 8/10/12px radii.
 * Shadow steps map to `--lark-shadow-s1`..`s3`.
 */
const cardStyles = cva(
  [
    "box-border flex w-full min-w-0 flex-col gap-3 overflow-hidden p-3",
    "border border-solid text-lark-title",
    "transition-[border-color,box-shadow] duration-100 ease-lark-linear",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      variant: {
        outlined: "border-lark-border-card bg-lark-canvas",
        borderless: "border-transparent bg-lark-canvas shadow-lark-1",
        filled: "border-transparent bg-lark-base",
      },
      size: {
        sm: "rounded-lark-lg",
        md: "rounded-[10px]",
        lg: "rounded-lark-xl",
      },
      hoverable: {
        true: "cursor-pointer hover:shadow-lark-3",
        false: "",
      },
    },
    defaultVariants: {
      variant: "outlined",
      size: "md",
      hoverable: false,
    },
  },
);

export type CardProps = ComponentProps<"div"> & {
  /** Border and background treatment. */
  variant?: CardVariant;
  /** Corner radius: 8px, 10px or 12px. */
  size?: CardSize;
  /**
   * Turns the card into a hover entry point: pointer cursor and the UD
   * `Shadow-M-down`/`Shadow-L-down` hover elevation.
   */
  hoverable?: boolean;
  ref?: Ref<HTMLDivElement>;
};

export function Card({
  variant = "outlined",
  size = "md",
  hoverable = false,
  className,
  children,
  ref,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      ref={ref}
      data-slot="card"
      data-variant={variant}
      data-size={size}
      data-hoverable={hoverable ? "" : undefined}
      className={cn(cardStyles({ variant, size, hoverable }), className)}
    >
      {children}
    </div>
  );
}

export type CardHeaderProps = ComponentProps<"div">;

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      {...props}
      data-slot="card-header"
      className={cn("flex min-w-0 flex-col gap-1", className)}
    />
  );
}

export type CardTitleProps = ComponentProps<"h3">;

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      {...props}
      data-slot="card-title"
      className={cn("m-0 text-lark-16 font-medium leading-6 text-lark-title", className)}
    />
  );
}

export type CardDescriptionProps = ComponentProps<"p">;

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p
      {...props}
      data-slot="card-description"
      className={cn("m-0 text-lark-12 leading-5 text-lark-caption", className)}
    />
  );
}

export type CardBodyProps = ComponentProps<"div">;

export function CardBody({ className, ...props }: CardBodyProps) {
  return (
    <div
      {...props}
      data-slot="card-body"
      className={cn("min-w-0 text-lark-14 leading-[22px] text-lark-title", className)}
    />
  );
}

export type CardFooterProps = ComponentProps<"div">;

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      {...props}
      data-slot="card-footer"
      className={cn("flex min-w-0 flex-wrap items-center gap-2", className)}
    />
  );
}

export type CardCoverProps = ComponentProps<"div">;

export function CardCover({ className, ...props }: CardCoverProps) {
  return (
    <div
      {...props}
      data-slot="card-cover"
      className={cn(
        "-mx-3 overflow-hidden",
        "[&:first-child]:-mt-3 [&:last-child]:-mb-3",
        "[&_img]:block [&_img]:h-auto [&_img]:w-full",
        className,
      )}
    />
  );
}
