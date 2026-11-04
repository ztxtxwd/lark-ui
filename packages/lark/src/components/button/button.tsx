import React from "react";
import { ArrowsClockwise, type Icon } from "../../icons/phosphor";
import { Loader } from "../loader/loader";
import { Tooltip } from "../tooltip/tooltip";
import { cn } from "../../utils/cn";
import { resolveVariant } from "../../utils/resolve-variant";
import { useLinkComponent } from "../../utils/link-provider";

/** Button variant definitions mapping shape, size, and variant names to their Tailwind classes. */
export const LARK_BUTTON_VARIANTS = {
  shape: {
    base: {
      // Feishu centres the label inside the button: `.ud__button` sets
      // `justify-content:center`, and the min-width on the size variants only
      // makes sense when the content is centred inside that extra space.
      classes: "justify-center",
      description: "Default rectangular button shape",
    },
    square: {
      classes: "items-center justify-center p-0",
      description: "Square button for icon-only actions",
    },
    circle: {
      classes: "items-center justify-center p-0 rounded-full",
      description: "Circular button for icon-only actions",
    },
  },
  size: {
    xs: {
      classes: "h-6 min-w-[48px] gap-1 rounded-md px-[7px] text-xs",
      description: "Extra small button for compact UIs (24px)",
    },
    sm: {
      classes: "h-7 min-w-[48px] gap-1 rounded-md px-[7px] text-xs",
      description: "Small button (28px, Feishu small control)",
    },
    base: {
      classes: "h-8 min-w-[80px] gap-1.5 rounded-md px-[11px] text-base",
      description: "Default button (32px, Feishu medium control)",
    },
    lg: {
      classes: "h-10 min-w-[96px] gap-2 rounded-md px-[15px] text-lg",
      description: "Large button (40px, Feishu large control)",
    },
  },
  compactSize: {
    xs: { classes: "size-6 min-w-0" },
    sm: { classes: "size-7 min-w-0" },
    base: { classes: "size-8 min-w-0" },
    lg: { classes: "size-10 min-w-0" },
  },
  variant: {
    primary: {
      classes:
        "bg-(--lark-button-emphasis-bg) !text-white ring-0 hover:bg-(--lark-button-emphasis-hover) focus-visible:bg-(--lark-button-emphasis-hover) active:bg-(--lark-button-emphasis-pressed) disabled:bg-lark-disabled disabled:text-white",
      description: "High-emphasis button for primary actions",
    },
    secondary: {
      classes:
        "bg-lark-base !text-lark-default ring ring-lark-border not-disabled:hover:bg-lark-fill not-disabled:focus-visible:bg-lark-fill not-disabled:active:bg-lark-recessed disabled:bg-lark-base disabled:text-lark-inactive disabled:ring-lark-border data-[state=open]:bg-lark-fill",
      description: "Default button style for most actions",
    },
    ghost: {
      classes:
        "text-lark-default hover:bg-lark-fill-hover focus-visible:bg-lark-fill-hover active:bg-lark-fill-pressed shadow-none bg-inherit ring-0 disabled:text-lark-inactive",
      description: "Minimal button with no background",
    },
    destructive: {
      classes:
        "bg-(--lark-button-emphasis-bg) !text-white ring-0 hover:bg-(--lark-button-emphasis-hover) focus-visible:bg-(--lark-button-emphasis-hover) active:bg-(--lark-button-emphasis-pressed) disabled:bg-lark-disabled disabled:text-white",
      description: "Danger button for destructive actions like delete",
    },
    "secondary-destructive": {
      classes:
        "bg-lark-base !text-lark-danger ring ring-lark-border not-disabled:hover:bg-lark-danger-tint not-disabled:focus-visible:bg-lark-danger-tint not-disabled:active:bg-lark-danger-tint not-disabled:hover:!text-lark-danger disabled:bg-lark-base disabled:text-lark-inactive disabled:ring-lark-border data-[state=open]:bg-lark-danger-tint",
      description:
        "Secondary button with destructive text for less prominent dangerous actions",
    },
    outline: {
      classes:
        "bg-transparent text-lark-default ring ring-lark-border not-disabled:hover:bg-lark-fill not-disabled:focus-visible:bg-lark-fill not-disabled:active:bg-lark-recessed not-disabled:hover:text-lark-strong disabled:bg-transparent disabled:text-lark-inactive disabled:ring-lark-border",
      description: "Bordered button with transparent background",
    },
  },
} as const;

export const LARK_BUTTON_DEFAULT_VARIANTS = {
  shape: "base",
  size: "base",
  variant: "secondary",
} as const;

// Derived types from LARK_BUTTON_VARIANTS
export type LarkButtonShape = keyof typeof LARK_BUTTON_VARIANTS.shape;
export type LarkButtonSize = keyof typeof LARK_BUTTON_VARIANTS.size;
export type LarkButtonVariant = keyof typeof LARK_BUTTON_VARIANTS.variant;

export interface LarkButtonVariantsProps {
  /**
   * Button shape.
   * - `"base"` — Default rectangular button
   * - `"square"` — Square button for icon-only actions
   * - `"circle"` — Circular button for icon-only actions
   * @default "base"
   */
  shape?: LarkButtonShape;
  /**
   * Button size.
   * - `"xs"` — Extra small for compact UIs
   * - `"sm"` — Small for secondary actions
   * - `"base"` — Default size
   * - `"lg"` — Large for primary CTAs
   * @default "base"
   */
  size?: LarkButtonSize;
  /**
   * Visual style of the button.
   * - `"primary"` — High-emphasis, brand-colored for primary actions
   * - `"secondary"` — Default style with border for most actions
   * - `"ghost"` — Minimal, no background for tertiary actions
   * - `"destructive"` — Danger button for destructive actions
   * - `"secondary-destructive"` — Secondary style with destructive text
   * - `"outline"` — Bordered with transparent background
   * @default "secondary"
   */
  variant?: LarkButtonVariant;
}

export function buttonVariants({
  variant = LARK_BUTTON_DEFAULT_VARIANTS.variant,
  size = LARK_BUTTON_DEFAULT_VARIANTS.size,
  shape = LARK_BUTTON_DEFAULT_VARIANTS.shape,
}: LarkButtonVariantsProps = {}) {
  const isCompactShape = shape === "square" || shape === "circle";

  return cn(
    // Base styles
    "group flex w-max shrink-0 items-center font-medium select-none",
    "border-0",
    // Feishu drops the focus outline entirely — focus-visible mirrors hover
    "focus:outline-none focus-visible:outline-none",
    "cursor-pointer",
    // Disabled state — Feishu mutes the label with `--text-disabled`
    "disabled:cursor-not-allowed disabled:text-lark-inactive",
    resolveVariant(
      LARK_BUTTON_VARIANTS.size,
      size,
      LARK_BUTTON_DEFAULT_VARIANTS.size,
    ).classes,
    resolveVariant(
      LARK_BUTTON_VARIANTS.shape,
      shape,
      LARK_BUTTON_DEFAULT_VARIANTS.shape,
    ).classes,
    isCompactShape &&
      resolveVariant(
        LARK_BUTTON_VARIANTS.compactSize,
        size,
        LARK_BUTTON_DEFAULT_VARIANTS.size,
      ).classes,
    resolveVariant(
      LARK_BUTTON_VARIANTS.variant,
      variant,
      LARK_BUTTON_DEFAULT_VARIANTS.variant,
    ).classes,
  );
}

// Lowercase text sits below its line box's center, so lift the content row
// with bottom padding to optically center the text in the button.
const TEXT_LIFT_CLASSES: Record<LarkButtonSize, string> = {
  xs: "pb-px [--lark-button-text-lift:0.5px]",
  sm: "pb-px [--lark-button-text-lift:0.5px]",
  base: "pb-0.5 [--lark-button-text-lift:1px]",
  lg: "pb-0.5 [--lark-button-text-lift:1px]",
};

// Icons carry built-in whitespace inside their viewBox, so trim the leading
// padding of icon + text buttons to optically match the trailing padding.
const ICON_LEADING_PADDING: Record<LarkButtonSize, string> = {
  xs: "pl-1",
  sm: "pl-1.5",
  base: "pl-2.5",
  lg: "pl-3.5",
};

// Undo the lift for the icon so it stays centered. Icons can be consumer SVGs
// or the inline SVG glyphs rendered by the internal compatibility layer.
const ICON_CENTER_CLASSES =
  "[&>svg:first-child]:translate-y-(--lark-button-text-lift) [&>span.relative>svg:first-child]:translate-y-(--lark-button-text-lift)";

const getTextClasses = (
  shape: LarkButtonShape,
  size: LarkButtonSize,
  iconNode: React.ReactNode,
  children: React.ReactNode,
) => {
  const hasText = React.Children.toArray(children).some(
    (child) => child !== "",
  );
  if (shape !== "base" || !hasText) return undefined;
  return cn(
    TEXT_LIFT_CLASSES[size],
    iconNode != null && [ICON_LEADING_PADDING[size], ICON_CENTER_CLASSES],
  );
};

// Normalize icon prop to support both React elements and component types
const renderIconNode = (IconComponent?: Icon | React.ReactNode) => {
  if (!IconComponent) return null;
  if (React.isValidElement(IconComponent)) return IconComponent;
  const Comp = IconComponent as React.ComponentType<Record<string, unknown>>;
  return <Comp />;
};

/**
 * Emphasis fills for the solid variants.
 *
 * They are exposed as CSS variables so that containers (e.g. `Banner.Action`)
 * can re-tint a solid button with their own accent colour.
 */
const getEmphasisStyle = (variant: LarkButtonVariant) => {
  if (variant === "primary") {
    return {
      "--lark-button-emphasis-bg": "var(--color-lark-brand)",
      "--lark-button-emphasis-hover": "var(--color-lark-brand-hover)",
      "--lark-button-emphasis-pressed": "var(--color-lark-brand-pressed)",
    };
  }
  if (variant === "destructive") {
    return {
      "--lark-button-emphasis-bg": "var(--color-lark-danger)",
      "--lark-button-emphasis-hover": "var(--color-lark-danger-hover)",
      "--lark-button-emphasis-pressed": "var(--color-lark-danger-pressed)",
    };
  }
  return undefined;
};

const ANCHOR_ONLY_PROPS = new Set([
  "href",
  "target",
  "rel",
  "download",
  "hrefLang",
  "media",
  "ping",
  "referrerPolicy",
  "linksExternal",
]);

const toDisabledButtonProps = (
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>,
): React.ButtonHTMLAttributes<HTMLButtonElement> => {
  const result: Partial<React.AnchorHTMLAttributes<HTMLAnchorElement>> = {
    ...props,
  };
  for (const key of Object.keys(result)) {
    // event handlers are inert on a disabled button, and anchor-only attrs are invalid on it
    if (key.startsWith("on") || ANCHOR_ONLY_PROPS.has(key)) {
      delete result[key as keyof typeof result];
    }
  }
  return result as React.ButtonHTMLAttributes<HTMLButtonElement>;
};

const renderButtonContent = (
  _variant: LarkButtonVariant,
  iconNode: React.ReactNode,
  children: React.ReactNode,
) => {
  const childNode =
    children != null ? <span className="contents">{children}</span> : null;

  return (
    <>
      {iconNode}
      {childNode}
    </>
  );
};

const getTitleLabel = (title: React.ReactNode) => {
  if (typeof title === "string") return title;
  if (typeof title === "number") return String(title);
  return undefined;
};

/**
 * Button component props.
 *
 * Uses a discriminated union on `shape` so that icon-only buttons
 * (`shape="square"` or `shape="circle"`) require an accessible name.
 *
 * @example
 * ```tsx
 * <Button variant="primary">Save</Button>
 * <Button variant="secondary" shape="square" icon={PlusIcon} aria-label="Add" />
 * <Button variant="destructive" loading>Deleting...</Button>
 * ```
 */
type ButtonBaseProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Content rendered inside the button. */
  children?: React.ReactNode;
  /** Additional CSS classes merged via `cn()`. */
  className?: string;
  /** Icon from `@phosphor-icons/react` or a React element. Rendered before children. */
  icon?: Icon | React.ReactNode;
  /** Shows a loading spinner and disables interaction. */
  loading?: boolean;
  /** When set, wraps the button in a Tooltip with this content. */
  title?: React.ReactNode;
};

type ButtonWithTextProps = ButtonBaseProps & {
  shape?: "base";
  size?: LarkButtonSize;
  variant?: LarkButtonVariant;
};

type IconOnlyButtonAccessibleNameProps =
  | {
      /** Required for icon-only buttons to provide an accessible label for screen readers. */
      "aria-label": string;
      "aria-labelledby"?: string;
    }
  | {
      "aria-label"?: string;
      /** References an element that provides the accessible label for screen readers. */
      "aria-labelledby": string;
    }
  | {
      /** Used as tooltip content and as a fallback accessible label when no children are provided. */
      title: string | number;
      "aria-label"?: string;
      "aria-labelledby"?: string;
    };

type IconOnlyButtonProps = ButtonBaseProps &
  IconOnlyButtonAccessibleNameProps & {
    shape: "square" | "circle";
    size?: LarkButtonSize;
    variant?: LarkButtonVariant;
  };

export type ButtonProps = ButtonWithTextProps | IconOnlyButtonProps;

export type RefreshButtonProps = Omit<
  IconOnlyButtonProps,
  "children" | "icon" | "shape"
>;

/**
 * LinkButton component props — renders an anchor styled as a button.
 *
 * @example
 * ```tsx
 * <LinkButton href="/docs" variant="ghost" icon={BookIcon}>Docs</LinkButton>
 * <LinkButton href="https://example.com" external>Visit Site</LinkButton>
 * ```
 */
export type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  LarkButtonVariantsProps & {
    /** Content rendered inside the link button. */
    children?: React.ReactNode;
    /** Additional CSS classes merged via `cn()`. */
    className?: string;
    /** When `true`, the button is disabled. We render an actual html button with `disabled` attribute. */
    disabled?: boolean;
    /** Icon from `@phosphor-icons/react` or a React element. Rendered before children. */
    icon?: Icon | React.ReactNode;
    /** When `true`, opens in a new tab with `rel="noopener noreferrer"`. */
    external?: boolean;
    linksExternal?: boolean;
  };

/**
 * Primary action trigger. Supports multiple variants, sizes, shapes, icons, and loading state.
 *
 * @example
 * ```tsx
 * <Button variant="primary">Save</Button>
 * <Button variant="secondary" icon={PlusIcon}>Create Worker</Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled,
      loading,
      shape = "base",
      size = "base",
      variant = "secondary",
      icon: IconComponent,
      style,
      title,
      ...props
    },
    ref,
  ) => {
    const { type, ...restProps } = props;
    const emphasisStyle = getEmphasisStyle(variant);
    const titleLabel = getTitleLabel(title);
    const buttonProps = {
      ...restProps,
      ...(!React.Children.count(children) &&
        !restProps["aria-label"] &&
        !restProps["aria-labelledby"] &&
        titleLabel && { "aria-label": titleLabel }),
    };
    const iconNode = loading ? (
      <Loader size={size === "lg" ? 16 : 14} />
    ) : (
      renderIconNode(IconComponent)
    );

    const button = (
      <button
        ref={ref}
        data-lark-component="Button"
        className={cn(
          buttonVariants({ variant, size, shape }),
          getTextClasses(shape, size, iconNode, children),
          disabled && "cursor-not-allowed",
          className,
        )}
        disabled={loading || disabled}
        style={emphasisStyle ? { ...emphasisStyle, ...style } : style}
        type={type ?? "button"}
        {...buttonProps}
      >
        {renderButtonContent(variant, iconNode, children)}
      </button>
    );

    if (title && (disabled || loading)) {
      return (
        <Tooltip content={title} render={<span className="inline-flex" />}>
          {button}
        </Tooltip>
      );
    }

    if (title) {
      return <Tooltip content={title} render={button} />;
    }

    return button;
  },
);

Button.displayName = "Button";

/**
 * Square button with a rotating arrows icon, used to trigger data refresh actions.
 *
 * @example
 * ```tsx
 * <RefreshButton loading={isRefreshing} onClick={refresh} />
 * ```
 */
export const RefreshButton = ({
  "aria-label": ariaLabel = "Refresh",
  loading,
  ...props
}: RefreshButtonProps) => (
  <Button shape="square" aria-label={ariaLabel} {...props}>
    <ArrowsClockwise
      className={cn({
        "animate-refresh": loading,
        "size-4.5": props.size === "base" || !props.size,
        "size-4": props.size === "sm",
        "size-5": props.size === "lg",
      })}
    />
  </Button>
);

/**
 * Anchor element styled as a button. Integrates with `LinkProvider` for framework routing.
 *
 * @example
 * ```tsx
 * <LinkButton href="/settings" variant="ghost">Settings</LinkButton>
 * ```
 */
export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  (
    {
      children,
      className,
      disabled = false,
      external,
      href,
      shape = "base",
      size = "base",
      variant = "ghost",
      icon: IconComponent,
      style,
      title,
      // linksExternal = false,
      ...props
    },
    ref,
  ) => {
    const LinkComponent = useLinkComponent();
    const emphasisStyle = getEmphasisStyle(variant);
    const externalProps = external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};

    if (disabled) {
      // ref is intentionally not forwarded: it's typed for the anchor, but the disabled state renders a button
      return (
        <Button
          {...toDisabledButtonProps(props)}
          className={cn("select-text", className)}
          data-lark-component="LinkButton"
          disabled
          icon={IconComponent}
          shape={shape as "base"}
          size={size}
          style={emphasisStyle ? { ...emphasisStyle, ...style } : style}
          title={title}
          variant={variant}
        >
          {children}
        </Button>
      );
    }

    const iconNode = renderIconNode(IconComponent);
    const link = (
      <LinkComponent
        ref={ref}
        data-lark-component="LinkButton"
        className={cn(
          buttonVariants({ variant, size, shape }),
          getTextClasses(shape, size, iconNode, children),
          "flex items-center no-underline! select-text",
          className,
        )}
        href={href}
        style={emphasisStyle ? { ...emphasisStyle, ...style } : style}
        to={typeof href === "string" ? href : undefined}
        {...externalProps}
        {...props}
      >
        {renderButtonContent(variant, iconNode, children)}
      </LinkComponent>
    );

    if (title) {
      return <Tooltip content={title} render={link} />;
    }

    return link;
  },
);

LinkButton.displayName = "LinkButton";
