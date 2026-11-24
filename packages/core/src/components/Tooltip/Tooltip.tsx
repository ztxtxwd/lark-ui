import {
  Tooltip as UiTooltip,
  TooltipArrow as UiTooltipArrow,
  TooltipContent as UiTooltipContent,
  TooltipTrigger as UiTooltipTrigger,
} from "@ui-sdk/react/tooltip";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { cn } from "../../lib/cn";

type UiTooltipProps = ComponentProps<typeof UiTooltip>;
type UiTooltipContentProps = ComponentProps<typeof UiTooltipContent>;

/**
 * UD arrow: 12px wide, 6px tall, on the edge the tooltip landed on. The
 * base triangle points down (correct for `top`); every other side rotates
 * the container, which is the element that carries `data-side`. The
 * positioner writes the arrow's inline left/top already centered on the
 * trigger, so only the edge offset lives here.
 */
const arrowPosition = cn(
  "absolute h-1.5 w-3 overflow-visible",
  "data-[side=top]:bottom-[-6px] data-[side=top]:left-0 data-[side=top]:translate-x-0",
  "data-[side=bottom]:top-[-6px] data-[side=bottom]:left-0 data-[side=bottom]:translate-x-0 data-[side=bottom]:rotate-180",
  // The rotated 12×6 box's outer edge moves 3px in; shift back out to
  // keep the base flush with the tooltip edge.
  "data-[side=left]:right-[-9px] data-[side=left]:top-0 data-[side=left]:translate-y-0 data-[side=left]:-rotate-90",
  "data-[side=right]:left-[-9px] data-[side=right]:top-0 data-[side=right]:translate-y-0 data-[side=right]:rotate-90",
);

export type TooltipProps = Omit<UiTooltipProps, "children"> & {
  content: ReactNode;
  children: ReactElement;
  side?: UiTooltipContentProps["side"];
  align?: UiTooltipContentProps["align"];
  sideOffset?: number;
  arrow?: boolean;
  contentClassName?: string;
};

const arrowShape = (
  <span aria-hidden="true" className="absolute inset-0 block">
    <span className="absolute top-0 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[6px] border-t-[6px] border-x-transparent border-t-lark-tips" />
  </span>
);

export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  sideOffset = 8,
  arrow = true,
  contentClassName,
  delay = 100,
  closeDelay = 100,
  ...props
}: TooltipProps) {
  return (
    <UiTooltip {...props} delay={delay} closeDelay={closeDelay}>
      <UiTooltipTrigger render={children} />
      <UiTooltipContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-w-80 min-w-[30px] rounded-lark-lg bg-lark-tips px-3 py-2",
          "text-lark-12 text-lark-canvas shadow-lark-4 break-words outline-none",
          "origin-(--transform-origin) transition-[opacity,scale] duration-100 ease-lark",
          "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
          "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
          contentClassName,
        )}
      >
        {content}
        {arrow ? <UiTooltipArrow className={arrowPosition}>{arrowShape}</UiTooltipArrow> : null}
      </UiTooltipContent>
    </UiTooltip>
  );
}
