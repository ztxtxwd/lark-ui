import {
  type CSSProperties,
  createContext,
  forwardRef,
  useContext,
} from "react";
import {
  Button,
  type ButtonProps,
  type LarkButtonSize,
  type LarkButtonVariant,
} from "../button/button";
import { cn } from "../../utils/cn";
import type { LarkBannerVariant } from "./banner";

/**
 * Visual variant for a `Banner.Action`, aligned with `Button`'s `variant` naming.
 * - `"primary"` — filled accent gradient for the main action.
 * - `"secondary"` — transparent with an accent-hued outline (same hue as the banner).
 * - `"ghost"` — text-only accent action with a faint accent-tinted hover.
 */
export type BannerActionVariant = Extract<
  LarkButtonVariant,
  "primary" | "secondary" | "ghost"
>;

/**
 * Size of a `Banner.Action`, matching the equivalent `Button` size specs.
 * - `"xs"` — extra small for dense/compact banners.
 * - `"sm"` — small (default), the standard banner CTA size.
 */
export type BannerActionSize = Extract<LarkButtonSize, "xs" | "sm">;

/** Value shared from the `Banner` root to its `Banner.Action` children. */
export interface BannerActionContextValue {
  /** Banner variant, used to pick the matching accent color. */
  variant: LarkBannerVariant;
  /** Action size derived from the banner's own size. */
  size: BannerActionSize;
}

/**
 * Propagates the banner's variant and action size to `Banner.Action`
 * children so each CTA can self-style without prop drilling:
 * - `variant` — selects the matching accent color.
 * - `size` — a compact `size="sm"` banner renders actions at `"xs"`, and a
 *   `"base"` banner renders them at `"sm"`.
 *
 * The `Banner` root always overrides these defaults via a Provider; the literals
 * mirror a default, base-size banner (kept as literals to avoid a runtime import
 * cycle with `banner.tsx`).
 */
export const BannerActionContext = createContext<BannerActionContextValue>({
  variant: "default",
  size: "sm",
});

/** Per-banner-variant colors passed to the underlying `Button`. */
const BANNER_ACTION_ACCENTS: Record<
  LarkBannerVariant,
  { accent: string; secondary: string; ghost: string }
> = {
  default: {
    accent: "var(--color-lark-info)",
    secondary:
      "text-inherit ring-lark-info/50 fill-lark-info hover:!text-inherit hover:!ring-lark-info/50 hover:bg-lark-info/10",
    ghost: "text-lark-info fill-lark-info hover:bg-lark-info/10",
  },
  alert: {
    accent: "var(--color-lark-warning)",
    secondary:
      "text-inherit ring-lark-warning/50 fill-lark-warning hover:!text-inherit hover:!ring-lark-warning/50 hover:bg-lark-warning/10",
    ghost: "text-lark-warning fill-lark-warning hover:bg-lark-warning/10",
  },
  error: {
    accent: "var(--color-lark-danger)",
    secondary:
      "text-inherit ring-lark-danger/50 fill-lark-danger hover:!text-inherit hover:!ring-lark-danger/50 hover:bg-lark-danger/10",
    ghost: "text-lark-danger fill-lark-danger hover:bg-lark-danger/10",
  },
  secondary: {
    accent: "var(--color-neutral-700, oklch(37.1% 0 0))",
    secondary:
      "text-inherit ring-lark-focus/20 fill-lark-contrast hover:!text-inherit hover:!ring-lark-focus/20 hover:bg-lark-contrast/10",
    ghost: "text-lark-default fill-lark-contrast hover:bg-lark-fill-hover",
  },
};

function bannerActionAccentVars(accent: string) {
  // Feishu lightens a solid fill on hover and darkens it on press.
  return {
    "--lark-button-emphasis-bg": accent,
    "--lark-button-emphasis-hover": `color-mix(in oklch, ${accent}, white 14%)`,
    "--lark-button-emphasis-pressed": `color-mix(in oklch, ${accent}, black 12%)`,
  } satisfies CSSProperties & Record<`--${string}`, string>;
}

/** Props for {@link BannerAction}. */
type WithBannerActionVariants<Props> = Props extends ButtonProps
  ? Omit<Props, "size" | "variant"> & {
      /**
       * Visual variant of the CTA, aligned with `Button`'s `variant` naming.
       * - `"primary"` — filled accent gradient for the main action (default).
       * - `"secondary"` — transparent with an accent-hued outline matching the banner.
       * - `"ghost"` — text-only accent action with a faint accent-tinted hover.
       * @default "primary"
       */
      variant?: BannerActionVariant;
    }
  : never;

export type BannerActionProps = WithBannerActionVariants<ButtonProps>;

/**
 * A banner CTA built on Lark's `Button`. It inherits Button's sizing, interaction,
 * loading, and accessibility behavior while supplying banner-specific accent styles.
 *
 * @example
 * ```tsx
 * <Banner.Action onClick={retry}>Retry</Banner.Action>
 * <Banner.Action variant="ghost" icon={<X />} aria-label="Dismiss" />
 * ```
 */
export const BannerAction = forwardRef<HTMLButtonElement, BannerActionProps>(
  function BannerAction(
    { variant = "primary", className, style, ...props },
    ref,
  ) {
    const banner = useContext(BannerActionContext);
    const styles = BANNER_ACTION_ACCENTS[banner.variant];
    const buttonVariant = variant === "secondary" ? "outline" : variant;

    return (
      <Button
        ref={ref}
        variant={buttonVariant}
        size={banner.size}
        className={cn(variant !== "primary" && styles[variant], className)}
        style={
          variant === "primary"
            ? { ...bannerActionAccentVars(styles.accent), ...style }
            : style
        }
        {...props}
      />
    );
  },
);

BannerAction.displayName = "Banner.Action";
