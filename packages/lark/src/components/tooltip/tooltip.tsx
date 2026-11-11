import { Tooltip as TooltipBase } from "@base-ui/react/tooltip";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../../utils/cn";
import { resolveVariant } from "../../utils/resolve-variant";
import {
  usePortalContainer,
  type PortalContainer,
} from "../../utils/portal-provider";

/** Tooltip side variant definitions mapping positions to their Tailwind classes. */
export const LARK_TOOLTIP_VARIANTS = {
  side: {
    top: {
      classes: "",
      description: "Tooltip appears above the trigger",
    },
    bottom: {
      classes: "",
      description: "Tooltip appears below the trigger",
    },
    left: {
      classes: "",
      description: "Tooltip appears to the left of the trigger",
    },
    right: {
      classes: "",
      description: "Tooltip appears to the right of the trigger",
    },
  },
} as const;

export const LARK_TOOLTIP_DEFAULT_VARIANTS = {
  side: "top",
} as const;

// Derived types from LARK_TOOLTIP_VARIANTS
export type LarkTooltipSide = keyof typeof LARK_TOOLTIP_VARIANTS.side;

export interface LarkTooltipVariantsProps {
  /**
   * Preferred side of the trigger to render the tooltip.
   * - `"top"` — Tooltip appears above the trigger
   * - `"bottom"` — Tooltip appears below the trigger
   * - `"left"` — Tooltip appears to the left of the trigger
   * - `"right"` — Tooltip appears to the right of the trigger
   * @default "top"
   */
  side?: LarkTooltipSide;
}

/**
 * Feishu `ud__tooltip-content`: `--bg-float`-inverted dark surface
 * (`#1f2329`), 8px radius, 12px/20px type, 8px/12px padding and
 * `--shadow-s4-down`. The tooltip has **no** border — the surface is
 * defined by its shadow only.
 */
const TOOLTIP_POPUP_CLASSES = cn(
  "flex max-w-80 origin-[var(--transform-origin)] flex-col rounded-lg bg-lark-contrast px-3 py-2 text-xs leading-5 text-lark-inverse outline-hidden",
  "shadow-lark-modal",
  "transition-[transform,scale,opacity] duration-150",
  "data-[starting-style]:scale-90 data-[starting-style]:opacity-0",
  "data-[ending-style]:scale-90 data-[ending-style]:opacity-0",
  "data-[instant]:duration-0",
);

export function tooltipVariants({
  side = LARK_TOOLTIP_DEFAULT_VARIANTS.side,
}: LarkTooltipVariantsProps = {}) {
  return cn(
    // Base styles
    TOOLTIP_POPUP_CLASSES,
    // Apply side-specific styles (currently none, but extensible)
    resolveVariant(
      LARK_TOOLTIP_VARIANTS.side,
      side,
      LARK_TOOLTIP_DEFAULT_VARIANTS.side,
    ).classes,
  );
}

export const TooltipProvider = TooltipBase.Provider;

type BaseTooltipProps = ComponentPropsWithoutRef<typeof TooltipBase.Root>;

type TriggerProps = ComponentPropsWithoutRef<typeof TooltipBase.Trigger>;

/** Alignment options for tooltip positioning. Source: PositionerProps["align"] */
type TooltipAlign = "start" | "center" | "end";

/**
 * Tooltip component props.
 *
 * @example
 * ```tsx
 * <Tooltip content="Add new item" render={<Button shape="square" icon={PlusIcon} />}>
 *   Add
 * </Tooltip>
 * ```
 */
export type TooltipProps = BaseTooltipProps &
  LarkTooltipVariantsProps & {
    /**
     * Alignment on the axis perpendicular to `side`.
     * - `"start"` — Align to the start edge
     * - `"center"` — Center-aligned
     * - `"end"` — Align to the end edge
     */
    align?: TooltipAlign;
    /**
     * @deprecated Use the `render` prop instead.
     * @example `<Tooltip render={<Button />}>Label</Tooltip>` instead of `<Tooltip asChild><Button>Label</Button></Tooltip>`
     */
    asChild?: boolean;
    /** Additional CSS classes merged via `cn()`. */
    className?: string;
    /** Content to display inside the tooltip popup. */
    content: ReactNode;
    /**
     * Container element for the portal. Use this to render the tooltip inside
     * a Shadow DOM or custom container. Overrides `LarkPortalProvider` context.
     * @default LarkPortalProvider container, or Lark's portal host in `<body>`
     */
    container?: PortalContainer;
    /**
     * How long to wait before closing the tooltip. Specified in milliseconds.
     * @default 0
     */
    closeDelay?: number;
    /**
     * How long to wait before opening the tooltip. Specified in milliseconds.
     * @default 600
     */
    delay?: number;
    /**
     * Element to render as the tooltip trigger. Children are passed to this element.
     * @example `<Tooltip content="Save" render={<Button />}>Save</Tooltip>`
     */
    render?: TriggerProps["render"];
  };

/**
 * Accessible popup that shows additional information on hover/focus.
 * Wrap your app or section with `<TooltipProvider>` to enable delay grouping.
 *
 * @example
 * ```tsx
 * <Tooltip content="Save changes" render={<Button variant="primary" />}>
 *   Save
 * </Tooltip>
 * ```
 */
export function Tooltip({
  content,
  children,
  align,
  asChild,
  render,
  side,
  className,
  container: containerProp,
  closeDelay,
  delay,
  ...props
}: TooltipProps) {
  const contextContainer = usePortalContainer();
  const container = containerProp ?? contextContainer ?? undefined;

  // Support both render prop (preferred) and deprecated asChild pattern
  // When using asChild, children IS the render element, so don't pass it as children
  const resolvedRender =
    render ?? (asChild ? (children as TriggerProps["render"]) : undefined);
  const shouldUseRender = resolvedRender !== undefined;

  // A disabled tooltip has nothing to reveal, so keep Lark's own trigger
  // (usually plain text) out of the tab order. Custom triggers keep theirs.
  const triggerTabIndex = !shouldUseRender && props.disabled ? -1 : undefined;

  return (
    <TooltipBase.Root {...props}>
      <TooltipBase.Trigger
        closeDelay={closeDelay}
        delay={delay}
        className={cn(
          // Defensive resets when rendering as button wrapper (not render/asChild)
          // These prevent global button styles from polluting the trigger
          // Consumer styles passed via className will override these.
          !shouldUseRender &&
            "m-0 inline-flex h-auto min-h-0 items-center border-none bg-transparent p-0 shadow-none",
          // Tooltip triggers are disclosure elements, not actions — override
          // cursor: pointer (e.g. from Button used via render prop) so the
          // trigger doesn't appear clickable
          "cursor-default",
          className,
        )}
        render={resolvedRender}
        tabIndex={triggerTabIndex}
      >
        {asChild ? undefined : (children as ReactNode)}
      </TooltipBase.Trigger>
      <TooltipBase.Portal container={container}>
        <TooltipBase.Positioner
          align={align}
          side={side}
          sideOffset={8}
          className="max-w-[var(--available-width)]"
        >
          <TooltipBase.Popup
            className={cn(TOOLTIP_POPUP_CLASSES, "lark-tooltip-popup")}
          >
            <TooltipBase.Arrow
              className={cn(
                "flex",
                "data-[side=bottom]:top-[-8px]",
                "data-[side=left]:right-[-13px] data-[side=left]:rotate-90",
                "data-[side=right]:left-[-13px] data-[side=right]:-rotate-90",
                "data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180",
              )}
            >
              <ArrowSvg />
            </TooltipBase.Arrow>
            {content}
          </TooltipBase.Popup>
        </TooltipBase.Positioner>
      </TooltipBase.Portal>
    </TooltipBase.Root>
  );
}

/**
 * Arrow SVG for the tooltip.
 *
 * Feishu's tooltip arrow (`ud__tooltip__arrow__streamline__content`) is a
 * plain filled shape in the tooltip's own surface colour — the tooltip has
 * no border, so the arrow carries no edge or stroke.
 */
function ArrowSvg(props: React.ComponentProps<"svg">) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
        className="fill-lark-contrast"
      />
    </svg>
  );
}
