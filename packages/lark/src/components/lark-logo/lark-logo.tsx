import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../../utils/cn";

/**
 * The three brand colours of the mark.
 *
 * They are used as-is, with no gradients: the teal is the top layer, the dark
 * blue the middle layer and the bright blue the bottom layer.
 */
export const LARK_BRAND_COLORS = {
  /** Teal — the top layer. */
  teal: "#00D6B9",
  /** Dark blue — the middle layer and the first UI element. */
  dark: "#163C9A",
  /** Bright blue — the bottom layer. */
  blue: "#3370FF",
} as const;

export type LarkBrandColor = keyof typeof LARK_BRAND_COLORS;

/**
 * Colour treatments accepted by the `color` prop.
 *
 * `color` is the full brand treatment: the mark keeps its three colours. Every
 * other value draws the whole mark in a single colour.
 */
export const LARK_LOGO_COLORS = {
  color: "#3370FF",
  teal: "#00D6B9",
  dark: "#163C9A",
  blue: "#3370FF",
  black: "#1F2329",
  white: "#FFFFFF",
} as const;

export type LarkLogoColor = keyof typeof LARK_LOGO_COLORS;

export interface LarkLogoProps extends Omit<
  ComponentPropsWithoutRef<"svg">,
  "color"
> {
  /** Solid colour treatment. `color` keeps the three-colour brand mark. */
  color?: LarkLogoColor;
  /** Accessible label. Omit for a decorative mark. */
  label?: string;
}

/**
 * The Lark logomark.
 *
 * Three stacked layers — teal on top, dark blue in the middle, bright blue at
 * the bottom — with the UI elements drawn in dark blue and white.
 *
 * @example
 * ```tsx
 * <LarkLogo className="size-8" />
 * <LarkLogo color="white" label="Lark" />
 * ```
 */
export const LarkLogo = forwardRef<SVGSVGElement, LarkLogoProps>(
  function LarkLogo({ color = "color", label, className, ...props }, ref) {
    // The solid treatments collapse the mark to one colour.
    const solid = color !== "color";
    const solidFill = solid ? LARK_LOGO_COLORS[color] : undefined;

    return (
      <svg
        ref={ref}
        viewBox="55 45.5 396 396"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        className={cn("inline-block size-8 shrink-0", className)}
        {...props}
      >
        {/* Bottom layer — bright blue. */}
        <path
          d="M103 323 L256 235 Q270 227 286 234 L420 305 Q438 314 422 328 L277 424 Q260 435 243 426 L99 351 Q81 341 103 323Z"
          fill={solidFill ?? LARK_BRAND_COLORS.blue}
        />
        {/* Middle layer — dark blue. */}
        <path
          d="M76 244 L247 145 Q263 136 280 145 L432 225 Q451 235 433 250 L278 354 Q260 366 241 356 L74 271 Q55 258 76 244Z"
          fill={solidFill ?? LARK_BRAND_COLORS.dark}
        />
        {/* Top layer — teal. */}
        <path
          d="M79 155 L235 63 Q253 52 272 60 L428 127 Q451 137 432 154 L280 255 Q260 269 240 259 L78 182 Q57 171 79 155Z"
          fill={solidFill ?? LARK_BRAND_COLORS.teal}
        />
        {/* UI elements — dark blue and white. */}
        <path
          d="M166 130 L212 103 Q221 98 231 102 L262 116 Q272 121 262 129 L217 157 Q207 163 197 158 L166 143 Q157 138 166 130Z"
          fill={solidFill ?? LARK_BRAND_COLORS.dark}
        />
        <path
          d="M295 125 L365 157 Q375 162 365 169 L355 176 Q349 180 340 176 L272 145 Q262 140 272 133 L281 127 Q287 122 295 125Z"
          fill={solidFill ?? "#FFFFFF"}
        />
        <path
          d="M261 169 L327 200 Q337 205 327 212 L317 219 Q310 223 302 219 L238 189 Q228 184 238 177 L247 171 Q253 166 261 169Z"
          fill={solidFill ?? "#FFFFFF"}
        />
      </svg>
    );
  },
);

LarkLogo.displayName = "LarkLogo";
