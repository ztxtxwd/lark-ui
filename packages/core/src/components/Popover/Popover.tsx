import {
  type PopoverOptions,
  Popover as UiPopover,
  PopoverArrow as UiPopoverArrow,
  PopoverClose as UiPopoverClose,
  PopoverContent as UiPopoverContent,
  PopoverDescription as UiPopoverDescription,
  PopoverTitle as UiPopoverTitle,
  PopoverTrigger as UiPopoverTrigger,
} from "@ui-sdk/react/popover";
import { cva } from "class-variance-authority";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type PopoverSide = "top" | "right" | "bottom" | "left";
export type PopoverAlign = "start" | "center" | "end";
export type PopoverSize = "sm" | "lg";

type UiPopoverContentProps = ComponentProps<typeof UiPopoverContent>;
type UiPopoverArrowProps = ComponentProps<typeof UiPopoverArrow>;
type UiPopoverTitleProps = ComponentProps<typeof UiPopoverTitle>;
type UiPopoverDescriptionProps = ComponentProps<typeof UiPopoverDescription>;
type UiPopoverCloseProps = ComponentProps<typeof UiPopoverClose>;

export type PopoverProps = Omit<PopoverOptions, "children"> & {
  /** The element that opens the popover. It must be a real interactive element. */
  trigger: ReactElement;
  /** Free-form body content, rendered after the title and description. */
  content?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** Actions at the bottom, separated by a full-width divider. */
  footer?: ReactNode;
  /** Extra content rendered after `content`. */
  children?: ReactNode;
  side?: PopoverSide;
  align?: PopoverAlign;
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number;
  /** Shows the 12 × 6 triangle pointing at the trigger. Defaults to true. */
  arrow?: boolean;
  /** Small uses 12 / 16px padding, large uses 20 / 24px, as in UD. */
  size?: PopoverSize;
  /** Disables the trigger. */
  disabled?: boolean;
  /**
   * Accessible name for the trigger. The content itself is named by `title`,
   * or by the trigger when there is no title.
   */
  "aria-label"?: string;
  className?: string;
  contentClassName?: string;
};

const surfaceClass = cn(
  "z-50 flex max-h-[480px] w-max min-w-[30px] max-w-[420px] flex-col",
  "rounded-lark-lg border border-solid border-lark-border-card bg-lark-float",
  "break-words text-lark-title shadow-lark-4 outline-none",
  "origin-(--transform-origin) transition-[opacity,scale] duration-100 ease-lark",
  "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
  "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
);

const contentSizes = cva("min-h-0 overflow-y-auto", {
  variants: {
    size: {
      sm: "p-3 px-4",
      lg: "p-5 px-6",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

const footerSizes = cva(
  "flex flex-wrap items-center justify-end gap-2 border-t border-solid border-lark-divider",
  {
    variants: {
      size: {
        sm: "px-4 py-3",
        lg: "px-6 py-4",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
);

const titleClass = "text-lark-14 leading-[22px] font-medium text-lark-title";
const descriptionClass = "mt-1 text-lark-14 leading-[22px] font-normal text-lark-body";

/**
 * UD triangle: 12px wide and 6px high. The rotation follows the side the
 * popover actually landed on after flipping. The positioner writes the
 * arrow's inline left/top already centered on the trigger, so only the
 * edge offset lives here. The container carries the rotation because it
 * is the element that receives `data-side`; a square inset-0 layer would
 * not flip for the horizontal sides.
 */
const arrowPosition = cn(
  "absolute size-3 h-1.5 overflow-visible",
  "data-[side=top]:bottom-[-6px] data-[side=top]:left-0 data-[side=top]:translate-x-0",
  "data-[side=bottom]:top-[-6px] data-[side=bottom]:left-0 data-[side=bottom]:translate-x-0",
  // The 12×6 box rotates about its center, moving the outer edge 3px in;
  // shift back out to keep the base flush with the popover edge.
  "data-[side=left]:right-[-9px] data-[side=left]:top-0 data-[side=left]:translate-y-0 data-[side=left]:-rotate-90",
  "data-[side=right]:left-[-9px] data-[side=right]:top-0 data-[side=right]:translate-y-0 data-[side=right]:rotate-90",
);

/** The UD arrow, for the composable parts. */
export function PopoverArrow({
  className,
  ...props
}: Omit<UiPopoverArrowProps, "className"> & { className?: string }) {
  return (
    <UiPopoverArrow {...props} className={cn(arrowPosition, "z-10", className)}>
      <span aria-hidden="true" className="absolute inset-0 block">
        <span className="absolute inset-x-0 top-0 h-0 w-0 border-x-[6px] border-t-[6px] border-x-transparent border-t-lark-border-card" />
        <span className="absolute top-px left-px h-0 w-0 border-x-[5px] border-t-[5px] border-x-transparent border-t-lark-float" />
      </span>
    </UiPopoverArrow>
  );
}

/** The UD popover surface, for composing a popover from its parts. */
export function PopoverContent({
  size = "sm",
  className,
  ...props
}: Omit<UiPopoverContentProps, "className"> & {
  className?: string;
  size?: PopoverSize;
}) {
  return (
    <UiPopoverContent {...props} className={cn(surfaceClass, contentSizes({ size }), className)} />
  );
}

/** A popover title. Names the dialog. */
export function PopoverTitle({ className, ...props }: UiPopoverTitleProps) {
  return <UiPopoverTitle {...props} className={cn(titleClass, className)} />;
}

/** A popover description. Adds context to the dialog's name. */
export function PopoverDescription({ className, ...props }: UiPopoverDescriptionProps) {
  return <UiPopoverDescription {...props} className={cn(descriptionClass, className)} />;
}

/** A button that closes the popover, styled as a UD text button. */
export function PopoverClose({ className, ...props }: UiPopoverCloseProps) {
  return (
    <UiPopoverClose
      {...props}
      className={cn(
        "inline-flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-lark-md",
        "border-0 bg-transparent px-3 text-lark-14 font-normal text-lark-title",
        "transition-colors duration-100 ease-lark-linear",
        "hover:bg-[var(--lark-fill-hover)] active:bg-[var(--lark-fill-pressed)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
        className,
      )}
    />
  );
}

/** The unstyled popover root, for composing from the parts. */
export { Popover as PopoverRoot, PopoverTrigger } from "@ui-sdk/react/popover";

export function Popover({
  trigger,
  content,
  title,
  description,
  footer,
  children,
  side = "bottom",
  align = "center",
  sideOffset = 4,
  alignOffset,
  collisionPadding = 16,
  arrow = true,
  size = "sm",
  disabled = false,
  "aria-label": ariaLabel,
  className,
  contentClassName,
  ...props
}: PopoverProps) {
  const hasBody = Boolean(title || description) || content != null || children != null;

  return (
    <UiPopover {...props}>
      <UiPopoverTrigger render={trigger} disabled={disabled} aria-label={ariaLabel} />
      <UiPopoverContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className={cn(surfaceClass, className, contentClassName)}
      >
        {arrow ? <PopoverArrow /> : null}
        {hasBody ? (
          <div className={cn(contentSizes({ size }))}>
            {title ? <UiPopoverTitle className={titleClass}>{title}</UiPopoverTitle> : null}
            {description ? (
              <UiPopoverDescription className={descriptionClass}>
                {description}
              </UiPopoverDescription>
            ) : null}
            {content != null || children != null ? (
              <div
                className={cn(
                  "text-lark-14 leading-[22px] text-lark-body",
                  title || description ? "mt-2" : undefined,
                )}
              >
                {content}
                {children}
              </div>
            ) : null}
          </div>
        ) : null}
        {footer ? (
          <div className={cn(footerSizes({ size }), "shrink-0", !hasBody && "border-t-0")}>
            {footer}
          </div>
        ) : null}
      </UiPopoverContent>
    </UiPopover>
  );
}
