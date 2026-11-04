import { forwardRef, useContext, type ForwardedRef } from "react";
import { cn } from "../utils/cn";
import { LARK_ICONS } from "./icon-registry";
import { IconContext, type IconProps } from "./phosphor";
import type { LarkIconName } from "./icon-names";

export interface LarkIconProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "color"
> {
  /** Icon name, e.g. `"check"`. */
  name: LarkIconName;
  /** Icon size in CSS units. Defaults to `1em`. */
  size?: number | string;
  /** Icon colour. Defaults to `currentColor`. */
  color?: string;
}

/**
 * Renders an icon by name.
 *
 * The glyphs are inlined SVG from
 * [Phosphor Icons](https://phosphoricons.com) (MIT), so no font download and
 * no SVG imports are needed. The icon inherits the text colour and the
 * surrounding font size.
 *
 * @example
 * ```tsx
 * <LarkIcon name="check" />
 * <LarkIcon name="plus" size={20} className="text-lark-brand" />
 * ```
 */
export const LarkIcon = forwardRef<HTMLElement, LarkIconProps>(
  function LarkIcon({ name, size, color, className, style, ...props }, ref) {
    const context = useContext(IconContext);
    const Glyph = LARK_ICONS[name];

    return (
      <Glyph
        {...(props as IconProps)}
        ref={ref as ForwardedRef<SVGSVGElement>}
        aria-hidden="true"
        focusable="false"
        data-lark-icon={name}
        size={size ?? context.size}
        color={color ?? context.color}
        weight={context.weight}
        mirrored={context.mirrored}
        className={cn("lark-icon", className)}
        style={style}
      />
    );
  },
);

LarkIcon.displayName = "LarkIcon";
