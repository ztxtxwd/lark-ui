import React, { type ReactNode } from "react";
import type { Icon } from "../../icons/phosphor";
import { cn } from "../../utils/cn";
import { resolveVariant } from "../../utils/resolve-variant";

/**
 * Base styles applied to all badge variants.
 *
 * Feishu badge metrics: 8px radius, 4px horizontal padding, 12px type.
 */
export const LARK_BADGE_BASE_STYLES =
  "inline-flex w-fit flex-none shrink-0 items-center justify-self-start gap-1 rounded-lg px-1 py-0.5 text-xs font-medium whitespace-nowrap [a:hover_&]:ring [a:hover_&]:ring-current";

/** Badge variant definitions mapping variant names to their Tailwind classes and descriptions. */
export const LARK_BADGE_VARIANTS = {
  variant: {
    /** Semantic token badges */
    primary: {
      classes: "bg-lark-badge-inverted text-lark-badge-inverted",
      description: "Primary badge",
    },
    secondary: {
      classes: "bg-lark-fill text-lark-subtle",
      description: "Secondary badge",
    },
    error: {
      classes: "bg-lark-danger/20 text-lark-danger",
      description: "Error badge",
    },
    warning: {
      classes: "bg-lark-warning/20 text-lark-warning",
      description: "Warning badge",
    },
    success: {
      classes: "bg-lark-success/20 text-lark-success",
      description: "Success badge",
    },
    destructive: {
      classes: "bg-lark-badge-red text-white",
      description: "Deprecated. Use red instead.",
    },
    info: {
      classes: "bg-lark-info/20 text-lark-info",
      description: "Info badge",
    },
    beta: {
      classes:
        "border border-dashed border-lark-brand bg-transparent text-lark-link",
      description: "Indicates beta or experimental features",
    },
    outline: {
      classes: "border border-lark-border bg-transparent text-lark-default",
      description: "Bordered badge with base background",
    },

    /** Other color token variants */

    red: {
      classes: "bg-lark-badge-red text-white",
      description: "Red badge",
    },
    green: {
      classes: "bg-lark-badge-green text-white",
      description: "Green badge",
    },
    neutral: {
      classes: "bg-lark-badge-neutral text-white",
      description: "Neutral badge",
    },
    orange: {
      classes: "bg-lark-badge-orange text-white",
      description: "Orange badge",
    },
    purple: {
      classes: "bg-lark-badge-purple text-white",
      description: "Purple badge",
    },
    teal: {
      classes: "bg-lark-badge-teal text-white",
      description: "Teal badge",
    },
    "teal-subtle": {
      classes: "bg-lark-badge-teal/20 text-lark-badge-teal-subtle",
      description: "Subtle teal badge",
    },
    blue: {
      classes: "bg-lark-badge-blue text-white",
      description: "Blue badge",
    },
  },
  appearance: {
    filled: {
      classes: "",
      description: "Filled badge with background color (default)",
    },
    dot: {
      classes: "gap-1.5 bg-transparent text-lark-default ring ring-lark-border",
      description: "Outlined badge with a colored circle dot indicating status",
    },
  },
  dotColor: {
    none: {
      classes: "",
      description:
        "No dot indicator (used when appearance is not dot, or variant has no dot color)",
    },
    success: {
      classes: "bg-lark-success",
      description: "Green dot for success status",
    },
    warning: {
      classes: "bg-lark-badge-orange",
      description: "Orange dot for warning status",
    },
    error: {
      classes: "bg-lark-badge-red",
      description: "Red dot for error status",
    },
    neutral: {
      classes: "bg-lark-badge-neutral",
      description: "Neutral dot for informational status",
    },
  },
} as const;

export const LARK_BADGE_DEFAULT_VARIANTS = {
  variant: "primary",
  appearance: "filled",
  dotColor: "none",
} as const;

// Derived types from LARK_BADGE_VARIANTS
export type LarkBadgeVariant = keyof typeof LARK_BADGE_VARIANTS.variant;
export type LarkBadgeAppearance = keyof typeof LARK_BADGE_VARIANTS.appearance;
export type LarkBadgeDotColor = keyof typeof LARK_BADGE_VARIANTS.dotColor;

export interface LarkBadgeVariantsProps {
  variant?: LarkBadgeVariant;
  appearance?: LarkBadgeAppearance;
}

export function badgeVariants({
  variant = LARK_BADGE_DEFAULT_VARIANTS.variant,
  appearance = LARK_BADGE_DEFAULT_VARIANTS.appearance,
}: LarkBadgeVariantsProps = {}) {
  const variantClasses = resolveVariant(
    LARK_BADGE_VARIANTS.variant,
    variant,
    LARK_BADGE_DEFAULT_VARIANTS.variant,
  ).classes;
  const appearanceClasses = resolveVariant(
    LARK_BADGE_VARIANTS.appearance,
    appearance,
    LARK_BADGE_DEFAULT_VARIANTS.appearance,
  ).classes;
  return cn(
    // Base styles (exported as LARK_BADGE_BASE_STYLES for Figma plugin)
    LARK_BADGE_BASE_STYLES,
    // The dot appearance overrides background/text colors from the variant,
    // so only apply variant classes when we're not in dot mode.
    appearance === "dot" ? "" : variantClasses,
    appearanceClasses,
  );
}

// Legacy type alias for backwards compatibility
export type BadgeVariant = LarkBadgeVariant;

const renderIconNode = (IconComponent?: Icon | ReactNode) => {
  if (!IconComponent) return null;
  const Component = IconComponent as React.ComponentType<
    Record<string, unknown>
  >;
  const icon = React.isValidElement(IconComponent) ? (
    IconComponent
  ) : (
    <Component />
  );

  return (
    <span className="flex h-lh w-3 shrink-0 items-center justify-center [&>svg]:size-3">
      {icon}
    </span>
  );
};

/**
 * Badge component props.
 *
 * @example
 * ```tsx
 * <Badge variant="green">Active</Badge>
 * <Badge variant="red">Error</Badge>
 * <Badge variant="neutral">Inactive</Badge>
 * <Badge variant="success" appearance="dot">Healthy</Badge>
 * ```
 */
interface BadgeBaseProps {
  /**
   * Color variant of the badge.
   * Recommended semantic variants:
   * - `"primary"` — Primary badge
   * - `"secondary"` — Secondary badge
   * - `"error"` — Error badge
   * - `"warning"` — Warning badge
   * - `"success"` — Success badge
   * - `"info"` — Info badge
   *
   * Additional token variants:
   * - `"red"`, `"orange"`, `"green"`, `"teal"`, `"blue"`, `"purple"`, `"neutral"`
   * - `"teal-subtle"`, `"neutral-subtle"`
   * - `"inverted"`
   * - `"outline"` — Bordered badge with the base background
   * - `"beta"` — Dashed-border badge for beta/experimental features
   * @default "primary"
   */
  variant?: LarkBadgeVariant;
  /** Additional CSS classes merged via `cn()`. */
  className?: string;
  /** Content rendered inside the badge. */
  children: ReactNode;
}

interface FilledBadgeProps extends BadgeBaseProps {
  /**
   * Visual appearance of the badge.
   * - `"filled"` — Filled background using the variant color (default)
   * - `"dot"` — Outlined badge with a colored circle dot. Only `success`,
   *   `warning`, `error`, and `neutral` variants show a dot. Dot badges do not
   *   accept icons.
   * @default "filled"
   */
  appearance?: "filled";
  /** Icon from `@phosphor-icons/react` or a React element. Rendered before children. */
  icon?: Icon | ReactNode;
}

interface DotBadgeProps extends BadgeBaseProps {
  /**
   * Visual appearance of the badge.
   * - `"filled"` — Filled background using the variant color (default)
   * - `"dot"` — Outlined badge with a colored circle dot. Only `success`,
   *   `warning`, `error`, and `neutral` variants show a dot. Dot badges do not
   *   accept icons.
   * @default "filled"
   */
  appearance: "dot";
  /** Dot badges use their status dot instead of an icon. */
  icon?: never;
}

export type BadgeProps = FilledBadgeProps | DotBadgeProps;

/**
 * Small status label for categorizing or highlighting content.
 *
 * @example
 * ```tsx
 * <Badge variant="green">Active</Badge>
 * <Badge variant="success" appearance="dot">Healthy</Badge>
 * ```
 */
export function Badge({
  variant = LARK_BADGE_DEFAULT_VARIANTS.variant,
  appearance = LARK_BADGE_DEFAULT_VARIANTS.appearance,
  className,
  icon,
  children,
}: BadgeProps) {
  // Crash-safe dot-color lookup via resolveVariant — unknown variants fall
  // back to "none" (no dot) instead of throwing.
  const dotColor =
    appearance === "dot"
      ? resolveVariant(
          LARK_BADGE_VARIANTS.dotColor,
          variant,
          LARK_BADGE_DEFAULT_VARIANTS.dotColor,
        ).classes
      : "";
  return (
    <span
      data-lark-component="Badge"
      className={cn(
        badgeVariants({ variant, appearance }),
        icon && "pl-1.5",
        className,
      )}
    >
      {dotColor ? (
        <span
          aria-hidden="true"
          className={cn("size-1.75 shrink-0 rounded-full", dotColor)}
        />
      ) : null}
      {renderIconNode(icon)}
      {children}
    </span>
  );
}
