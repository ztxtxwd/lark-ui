import {
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  isValidElement,
} from "react";
import { cn } from "../../utils/cn";
import { resolveVariant } from "../../utils/resolve-variant";
import { Link } from "../link/link";
import {
  BannerAction,
  type BannerActionSize,
  BannerActionContext,
} from "./banner-action";

/** Structural base styles applied to all banners; size-specific spacing/alignment lives in `LARK_BANNER_VARIANTS.size`. */
export const LARK_BANNER_BASE_STYLES = "flex w-full";

/**
 * Banner variant definitions mapping style options to their Tailwind classes and descriptions.
 *
 * The surface is always Feishu's `ud__notice--filled`: a flat status tint with
 * no border. Banner is an inline, full-width notice; the floating, bordered
 * treatment lives on `Toast` instead.
 */
export const LARK_BANNER_VARIANTS = {
  variant: {
    default: {
      // Feishu `ud__notice` colours only the status icon — the title and
      // description stay on `--text-title` (`text-lark-default`).
      classes: "bg-lark-banner-info-solid text-lark-default",
      iconClasses: "text-lark-info fill-lark-info",
      description: "Informational banner for general messages",
    },
    alert: {
      classes: "bg-lark-banner-warning-solid text-lark-default",
      iconClasses: "text-lark-warning fill-lark-warning",
      description: "Warning banner for cautionary messages",
    },
    error: {
      classes: "bg-lark-banner-danger-solid text-lark-default",
      iconClasses: "text-lark-danger fill-lark-danger",
      description: "Error banner for critical issues",
    },
    secondary: {
      classes: "bg-lark-contrast/5 text-lark-default",
      iconClasses: "text-lark-subtle",
      description: "Neutral banner for secondary messages",
    },
  },
  size: {
    base: {
      // Feishu `ud__notice--filled`: `padding: 9px 0 9px 16px`, 6px radius,
      // 14px/1.5715 type, and an 8px gap between the status icon and the text.
      classes:
        "items-start gap-2 rounded-md py-[9px] pl-4 text-base leading-[1.5715] overflow-hidden wrap-anywhere",
      description: "Default banner size",
    },
    sm: {
      classes:
        "items-center gap-2 rounded-md px-3 py-2 text-sm leading-[1.5715] overflow-hidden wrap-anywhere",
      description: "Compact banner for dialogs and tight spaces",
    },
  },
} as const;

export const LARK_BANNER_DEFAULT_VARIANTS = {
  variant: "default",
  size: "base",
} as const;

// Derived types from LARK_BANNER_VARIANTS
export type LarkBannerVariant = keyof typeof LARK_BANNER_VARIANTS.variant;
export type LarkBannerSize = keyof typeof LARK_BANNER_VARIANTS.size;

/**
 * Per-size render-site classes not carried by `bannerVariants` (which only emits
 * the container classes). `row` is the title↔action flex gap, `icon` the icon
 * wrapper (Feishu renders a 16px status icon, baseline aligned, 3px from the
 * top), `description` the description text size, and `action` the size that
 * child `Banner.Action`s inherit via {@link BannerActionContext}.
 */
const BANNER_SIZE_PARTS: Record<
  LarkBannerSize,
  { row: string; icon: string; description: string; action: BannerActionSize }
> = {
  base: {
    row: "gap-3",
    icon: "mt-[3px] text-lg",
    description: "text-base",
    action: "sm",
  },
  sm: {
    row: "gap-2",
    icon: "mt-[2px] text-base",
    description: "text-sm",
    action: "xs",
  },
};

// The `Banner.Action` CTA compound lives in ./banner-action
// and is attached to `Banner` via Object.assign at the bottom of this file.
export type {
  BannerActionVariant,
  BannerActionSize,
  BannerActionProps,
} from "./banner-action";

export interface LarkBannerVariantsProps {
  /**
   * Visual style of the banner.
   * - `"default"` — Informational banner for general messages
   * - `"alert"` — Warning banner for cautionary messages
   * - `"error"` — Error banner for critical issues
   * - `"secondary"` — Neutral banner for secondary messages
   * @default "default"
   */
  variant?: LarkBannerVariant;
  /**
   * Size of the banner.
   * - `"base"` — Default full-size banner
   * - `"sm"` — Compact banner for dialogs and other tight spaces
   * @default "base"
   */
  size?: LarkBannerSize;
}

export function bannerVariants({
  variant = LARK_BANNER_DEFAULT_VARIANTS.variant,
  size = LARK_BANNER_DEFAULT_VARIANTS.size,
}: LarkBannerVariantsProps = {}) {
  const resolvedVariant = resolveVariant(
    LARK_BANNER_VARIANTS.variant,
    variant,
    LARK_BANNER_DEFAULT_VARIANTS.variant,
  );
  const resolvedSize = resolveVariant(
    LARK_BANNER_VARIANTS.size,
    size,
    LARK_BANNER_DEFAULT_VARIANTS.size,
  );

  return cn(
    // Structural base styles (exported as LARK_BANNER_BASE_STYLES for Figma plugin)
    LARK_BANNER_BASE_STYLES,
    // Apply variant styles from LARK_BANNER_VARIANTS
    resolvedVariant.classes,
    // Apply size styles (spacing / radius / text) from LARK_BANNER_VARIANTS
    resolvedSize.classes,
  );
}

// Legacy enum for backwards compatibility
export enum BannerVariant {
  DEFAULT,
  ALERT,
  ERROR,
}

/**
 * Banner component props.
 *
 * @example
 * ```tsx
 * <Banner title="Update available" description="A new version is ready to install." />
 * <Banner variant="alert" title="Session expiring" description="Your session will expire soon." />
 * <Banner variant="error" title="Save failed" description="We couldn't save your changes." />
 * ```
 */
export interface BannerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "title"
> {
  /** Icon element rendered before the banner content (e.g. from `@phosphor-icons/react`). */
  icon?: ReactNode;
  /** Primary heading text for the banner. Use for i18n string injection. */
  title?: string;
  /** Secondary description text displayed below the title. Use for i18n string injection. */
  description?: ReactNode;
  /**
   * Action slot for a CTA button or link. Compact banners render a Lark `Link`
   * inline with the description; CTAs render at the trailing end.
   * Use `Banner.Action` for accent-aware CTAs that self-style to the banner
   * variant; other nodes are rendered as-is. Multiple actions can be passed in
   * a Fragment. Only used in structured mode (with `title` or `description`).
   */
  action?: ReactNode;
  /** @deprecated Use `title` and `description` instead. Will be removed in a future major version. */
  text?: string;
  /** @deprecated Use `title` and `description` instead for better i18n support. */
  children?: ReactNode;
  /**
   * Visual style of the banner.
   * - `"default"` — Informational blue banner for general messages
   * - `"alert"` — Warning yellow banner for cautionary messages
   * - `"error"` — Error red banner for critical issues
   * - `"secondary"` — Neutral banner for secondary messages
   * @default "default"
   */
  variant?: LarkBannerVariant;
  /**
   * Size of the banner. A `"sm"` banner uses tighter spacing and `text-sm`,
   * renders a Lark `Link` action inline with the description, and sets its
   * `Banner.Action` children to the `"xs"` size — suited to dialogs and other
   * tight spaces.
   * @default "base"
   */
  size?: LarkBannerSize;
  /** Additional CSS classes merged via `cn()`. */
  className?: string;
}

/**
 * Full-width message bar for informational, warning, or error notices.
 * Supports structured title/description for i18n, or simple children for basic usage.
 *
 * @example
 * ```tsx
 * // Structured (recommended for i18n)
 * <Banner
 *   variant="alert"
 *   icon={<WarningCircle />}
 *   title="Review required"
 *   description="Please review your billing information."
 * />
 *
 * // Simple (backwards compatible)
 * <Banner variant="alert" icon={<WarningCircle />}>
 *   Review your billing information.
 * </Banner>
 * ```
 */
const BannerRoot = forwardRef<HTMLDivElement, BannerProps>(function BannerRoot(
  {
    icon,
    title,
    description,
    action,
    children,
    text,
    variant = LARK_BANNER_DEFAULT_VARIANTS.variant,
    size = LARK_BANNER_DEFAULT_VARIANTS.size,
    className,
    ...props
  },
  ref,
) {
  const variantConfig = resolveVariant(
    LARK_BANNER_VARIANTS.variant,
    variant,
    LARK_BANNER_DEFAULT_VARIANTS.variant,
  );
  const sizeParts = BANNER_SIZE_PARTS[size];
  // Compact banners keep the title and description on one line (inline spans)
  // rather than stacking them, to stay short in dialogs and other tight spaces.
  const isCompact = size === "sm";
  const hasInlineLinkAction =
    isCompact && isValidElement(action) && action.type === Link;
  // Feishu keeps a 32px gutter after the copy and after the trailing action
  // (`ud__notice__description-content` / `__description-action`), and drops
  // the container's own right padding to 0.
  const trailingGutter = isCompact ? undefined : "pr-8";

  // Structured mode: title and/or description provided
  if (title || description) {
    return (
      <BannerActionContext.Provider value={{ variant, size: sizeParts.action }}>
        <div
          ref={ref}
          className={cn(bannerVariants({ variant, size }), className)}
          {...props}
        >
          {icon && (
            <span
              className={cn(
                "flex shrink-0 items-start",
                sizeParts.icon,
                variantConfig.iconClasses,
              )}
            >
              {icon}
            </span>
          )}
          <div
            className={cn(
              "flex min-w-0 flex-1 items-center justify-between",
              sizeParts.row,
              !title && "pt-px",
            )}
          >
            {isCompact ? (
              <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5">
                {title && (
                  <span className="font-semibold">
                    {title}
                    {!description && hasInlineLinkAction && (
                      <span className="ml-1.5 [&_[data-lark-component=Link]]:inline">
                        {action}
                      </span>
                    )}
                  </span>
                )}
                {description && (
                  <span className={sizeParts.description}>
                    {description}
                    {hasInlineLinkAction && (
                      <span className="ml-1.5 [&_[data-lark-component=Link]]:inline">
                        {action}
                      </span>
                    )}
                  </span>
                )}
              </div>
            ) : (
              <div className={cn("flex flex-col gap-1", trailingGutter)}>
                {/* Feishu's notice message is set semibold; the description
                    below it stays on the regular body weight. */}
                {title && <p className="font-semibold">{title}</p>}
                {description && (
                  <div className={sizeParts.description}>
                    {isValidElement(description) ? (
                      description
                    ) : (
                      <p>{description}</p>
                    )}
                  </div>
                )}
              </div>
            )}
            {!hasInlineLinkAction && action != null && (
              <div
                className={cn(
                  "flex shrink-0 items-center gap-2",
                  trailingGutter,
                )}
              >
                {action}
              </div>
            )}
          </div>
        </div>
      </BannerActionContext.Provider>
    );
  }

  // Legacy mode: children or text prop
  const value = children ?? text;
  const content = isValidElement(value) ? value : <p>{value}</p>;

  return (
    <BannerActionContext.Provider value={{ variant, size: sizeParts.action }}>
      <div
        ref={ref}
        className={cn(
          bannerVariants({ variant, size }),
          // The legacy copy is a direct child, so the trailing gutter lives on
          // the container instead of on the text block.
          trailingGutter,
          className,
        )}
        {...props}
      >
        {icon && (
          <span
            className={cn(
              "shrink-0",
              sizeParts.icon,
              variantConfig.iconClasses,
            )}
          >
            {icon}
          </span>
        )}
        {content}
      </div>
    </BannerActionContext.Provider>
  );
});

BannerRoot.displayName = "Banner";

/**
 * Full-width message bar with an optional trailing CTA slot.
 *
 * `Banner.Action` is an accent-aware CTA button
 * (`variant="primary" | "secondary" | "ghost"`).
 */
export const Banner = Object.assign(BannerRoot, {
  Action: BannerAction,
});
