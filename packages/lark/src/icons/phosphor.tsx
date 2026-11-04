/**
 * Internal icon layer.
 *
 * Icons are inline SVG from [Phosphor Icons](https://phosphoricons.com) (MIT).
 * Each glyph keeps the `data-lark-icon` hook and the `lark-icon` class so
 * components can target it from CSS.
 *
 * The public `Icon` / `IconProps` types stay compatible with Phosphor so
 * consumers can keep passing Phosphor icons to `icon` props.
 */
import { forwardRef, useContext } from "react";
import { IconContext } from "@phosphor-icons/react/dist/lib/context";
import type {
  Icon as PhosphorIcon,
  IconProps as PhosphorIconProps,
} from "@phosphor-icons/react";
import { cn } from "../utils/cn";
import {
  ArrowRightIcon as PhosphorArrowRightIcon,
  ArrowSquareOutIcon as PhosphorArrowSquareOutIcon,
  ArrowsClockwiseIcon as PhosphorArrowsClockwiseIcon,
  CaretDoubleLeftIcon as PhosphorCaretDoubleLeftIcon,
  CaretDoubleRightIcon as PhosphorCaretDoubleRightIcon,
  CaretDownIcon as PhosphorCaretDownIcon,
  CaretLeftIcon as PhosphorCaretLeftIcon,
  CaretRightIcon as PhosphorCaretRightIcon,
  CaretUpDownIcon as PhosphorCaretUpDownIcon,
  CaretUpIcon as PhosphorCaretUpIcon,
  CheckCircleIcon as PhosphorCheckCircleIcon,
  CheckIcon as PhosphorCheckIcon,
  CopyIcon as PhosphorCopyIcon,
  CopySimpleIcon as PhosphorCopySimpleIcon,
  EyeIcon as PhosphorEyeIcon,
  EyeSlashIcon as PhosphorEyeSlashIcon,
  GearIcon as PhosphorGearIcon,
  GearSixIcon as PhosphorGearSixIcon,
  GlobeHemisphereWestIcon as PhosphorGlobeHemisphereWestIcon,
  InfoIcon as PhosphorInfoIcon,
  MagnifyingGlassIcon as PhosphorMagnifyingGlassIcon,
  MinusIcon as PhosphorMinusIcon,
  PlusIcon as PhosphorPlusIcon,
  WarningCircleIcon as PhosphorWarningCircleIcon,
  WarningIcon as PhosphorWarningIcon,
  WarningOctagonIcon as PhosphorWarningOctagonIcon,
  XIcon as PhosphorXIcon,
} from "./icon-registry";

export type IconProps = PhosphorIconProps;
export type Icon = PhosphorIcon;
export { IconContext };

/**
 * Wraps a Phosphor icon so it renders as an inline SVG carrying the
 * `data-lark-icon` hook and the `lark-icon` class.
 *
 * Sizing follows Phosphor: `size` is a CSS length (`1em` by default) and
 * `color` falls back to `currentColor`, so icons inherit the surrounding text
 * colour and scale with the surrounding font size.
 */
function createIcon(
  displayName: string,
  name: string,
  Glyph: PhosphorIcon,
): Icon {
  const Component = forwardRef<SVGSVGElement, IconProps>(function LarkIconGlyph(
    { alt, size, color, weight, mirrored, className, style, ...rest },
    ref,
  ) {
    const context = useContext(IconContext);
    return (
      <Glyph
        {...rest}
        ref={ref}
        alt={alt}
        aria-hidden={alt ? undefined : true}
        focusable="false"
        data-lark-icon={name}
        size={size ?? context.size}
        color={color ?? context.color}
        weight={weight ?? context.weight}
        mirrored={mirrored ?? context.mirrored}
        className={cn("lark-icon", className)}
        style={style}
      />
    );
  });
  Component.displayName = displayName;
  return Component as Icon;
}

export const ArrowRightIcon = createIcon(
  "ArrowRightIcon",
  "arrow-right",
  PhosphorArrowRightIcon,
);
export const ArrowSquareOutIcon = createIcon(
  "ArrowSquareOutIcon",
  "arrow-square-out",
  PhosphorArrowSquareOutIcon,
);
export const ArrowsClockwise = createIcon(
  "ArrowsClockwise",
  "arrows-clockwise",
  PhosphorArrowsClockwiseIcon,
);
export const CaretDoubleLeftIcon = createIcon(
  "CaretDoubleLeftIcon",
  "caret-double-left",
  PhosphorCaretDoubleLeftIcon,
);
export const CaretDoubleRightIcon = createIcon(
  "CaretDoubleRightIcon",
  "caret-double-right",
  PhosphorCaretDoubleRightIcon,
);
export const CaretDownIcon = createIcon(
  "CaretDownIcon",
  "caret-down",
  PhosphorCaretDownIcon,
);
export const CaretLeftIcon = createIcon(
  "CaretLeftIcon",
  "caret-left",
  PhosphorCaretLeftIcon,
);
export const CaretRightIcon = createIcon(
  "CaretRightIcon",
  "caret-right",
  PhosphorCaretRightIcon,
);
export const CaretUpDownIcon = createIcon(
  "CaretUpDownIcon",
  "caret-up-down",
  PhosphorCaretUpDownIcon,
);
export const CaretUpIcon = createIcon(
  "CaretUpIcon",
  "caret-up",
  PhosphorCaretUpIcon,
);
export const CheckCircleIcon = createIcon(
  "CheckCircleIcon",
  "check-circle",
  PhosphorCheckCircleIcon,
);
export const CheckIcon = createIcon("CheckIcon", "check", PhosphorCheckIcon);
export const CopyIcon = createIcon("CopyIcon", "copy", PhosphorCopyIcon);
export const CopySimpleIcon = createIcon(
  "CopySimpleIcon",
  "copy-simple",
  PhosphorCopySimpleIcon,
);
export const Eye = createIcon("Eye", "eye", PhosphorEyeIcon);
export const EyeIcon = createIcon("EyeIcon", "eye", PhosphorEyeIcon);
export const EyeSlash = createIcon(
  "EyeSlash",
  "eye-slash",
  PhosphorEyeSlashIcon,
);
export const EyeSlashIcon = createIcon(
  "EyeSlashIcon",
  "eye-slash",
  PhosphorEyeSlashIcon,
);
export const GearIcon = createIcon("GearIcon", "gear", PhosphorGearIcon);
export const GearSixIcon = createIcon(
  "GearSixIcon",
  "gear-six",
  PhosphorGearSixIcon,
);
export const GlobeHemisphereWestIcon = createIcon(
  "GlobeHemisphereWestIcon",
  "globe-hemisphere-west",
  PhosphorGlobeHemisphereWestIcon,
);
export const Info = createIcon("Info", "info", PhosphorInfoIcon);
export const InfoIcon = createIcon("InfoIcon", "info", PhosphorInfoIcon);
export const MagnifyingGlassIcon = createIcon(
  "MagnifyingGlassIcon",
  "magnifying-glass",
  PhosphorMagnifyingGlassIcon,
);
export const MinusIcon = createIcon("MinusIcon", "minus", PhosphorMinusIcon);
export const Plus = createIcon("Plus", "plus", PhosphorPlusIcon);
export const WarningCircleIcon = createIcon(
  "WarningCircleIcon",
  "warning-circle",
  PhosphorWarningCircleIcon,
);
export const WarningIcon = createIcon(
  "WarningIcon",
  "warning",
  PhosphorWarningIcon,
);
export const WarningOctagonIcon = createIcon(
  "WarningOctagonIcon",
  "warning-octagon",
  PhosphorWarningOctagonIcon,
);
export const X = createIcon("X", "x", PhosphorXIcon);
export const XIcon = createIcon("XIcon", "x", PhosphorXIcon);
