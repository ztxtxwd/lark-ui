import { Switch as BaseSwitch } from "@base-ui/react/switch";
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type Ref,
  type ReactNode,
  createContext,
  useContext,
} from "react";
import { cn } from "../../utils/cn";
import { resolveVariant } from "../../utils/resolve-variant";
import { Field } from "../field/field";
import { Fieldset } from "@base-ui/react/fieldset";

/**
 * Feishu switch metrics (`ud__switch`).
 *
 * Feishu ships two switch sizes: `sm` (28×16 with a 12px knob) and `md`
 * (40×22 with an 18px knob). The knob sits 2px from the top-left corner and
 * travels to `100% - knob - 2px` when the switch is on. `lg` is a
 * library-only size that scales the same geometry up.
 */
const SWITCH_SIZE_STYLES = {
  sm: { track: "h-4 w-7", knob: "h-3 w-3", slide: "left-3.5" },
  base: { track: "h-5.5 w-10", knob: "h-4.5 w-4.5", slide: "left-5" },
  lg: { track: "h-6 w-11", knob: "h-5 w-5", slide: "left-5.5" },
} as const;

/** Switch size and variant definitions mapping names to their Tailwind classes. */
export const LARK_SWITCH_VARIANTS = {
  size: {
    sm: {
      classes: "h-4 w-7",
      description: "Small switch for compact UIs",
    },
    base: {
      classes: "h-5.5 w-10",
      description: "Default switch size",
    },
    lg: {
      classes: "h-6 w-11",
      description: "Large switch for prominent toggles",
    },
  },
  variant: {
    default: {
      classes: "bg-lark-border data-[checked]:bg-lark-brand",
      description: "Default switch with pill shape and brand blue color",
    },
    neutral: {
      classes: "bg-lark-border data-[checked]:bg-lark-contrast",
      description: "Monochrome switch with pill shape for subtle toggles",
    },
  },
} as const;

export const LARK_SWITCH_DEFAULT_VARIANTS = {
  size: "base",
  variant: "default",
} as const;

// Derived types from LARK_SWITCH_VARIANTS
export type LarkSwitchSize = keyof typeof LARK_SWITCH_VARIANTS.size;
export type LarkSwitchVariant = keyof typeof LARK_SWITCH_VARIANTS.variant;

export interface LarkSwitchVariantsProps {
  /**
   * Switch size.
   * - `"sm"` — Small for compact UIs
   * - `"base"` — Default size
   * - `"lg"` — Large for prominent toggles
   * @default "base"
   */
  size?: LarkSwitchSize;
  /**
   * Visual variant.
   * - `"default"` — Standard switch appearance
   * - `"error"` — Error state for validation failures
   * @default "default"
   */
  variant?: LarkSwitchVariant;
}

export function switchVariants({
  size = LARK_SWITCH_DEFAULT_VARIANTS.size,
  variant = LARK_SWITCH_DEFAULT_VARIANTS.variant,
}: LarkSwitchVariantsProps = {}) {
  const sizeConfig = resolveVariant(
    LARK_SWITCH_VARIANTS.size,
    size,
    LARK_SWITCH_DEFAULT_VARIANTS.size,
  );
  const variantConfig = resolveVariant(
    LARK_SWITCH_VARIANTS.variant,
    variant,
    LARK_SWITCH_DEFAULT_VARIANTS.variant,
  );
  return cn(sizeConfig.classes, variantConfig.classes);
}

// Legacy type aliases for backwards compatibility
export type SwitchSize = LarkSwitchSize;
export type SwitchVariant = LarkSwitchVariant;

/**
 * Feishu (`ud__switch`) track styling.
 *
 * The track is a pill without a border: the component border colour while the
 * switch is off, the brand colour while it is on. Disabled switches swap to
 * the card border colour, or to a muted brand fill while they are on.
 */
function switchControlClasses({
  variant,
  size,
  checked,
  disabled,
}: {
  variant: SwitchVariant;
  size: LarkSwitchSize;
  checked: boolean;
  disabled?: boolean;
}) {
  const isNeutral = variant === "neutral";
  const trackColor = disabled
    ? checked
      ? isNeutral
        ? "bg-lark-border"
        : "bg-lark-brand/30"
      : "bg-lark-line"
    : checked
      ? isNeutral
        ? "bg-lark-contrast"
        : "bg-lark-brand"
      : "bg-lark-border";

  return cn(
    "relative inline-flex items-center rounded-full p-0",
    // Feishu transitions colour on a 100ms curve and nothing else.
    "transition-[color,background-color,border-color] duration-100 ease-in",
    // Feishu removes the focus outline and draws no focus ring.
    "focus:outline-none focus-visible:outline-none",
    disabled ? "cursor-not-allowed" : "cursor-pointer",
    SWITCH_SIZE_STYLES[size].track,
    trackColor,
  );
}

/** The knob that slides across the track. */
function switchThumbClasses({
  variant,
  size,
  checked,
}: {
  variant: SwitchVariant;
  size: LarkSwitchSize;
  checked: boolean;
}) {
  return cn(
    "absolute top-0.5 left-0.5 rounded-full",
    // Feishu slides the knob over 120ms on its own easing curve.
    "transition-[left] duration-[120ms] ease-[cubic-bezier(.4,.8,.74,1)]",
    // Feishu draws the knob as an inner circle (the shadow lives on it) that
    // shifts 30% towards the pressed side while the switch is held down.
    "before:absolute before:inset-0 before:rounded-full before:shadow-lark-sm",
    "before:transition-[right] before:duration-[120ms] before:ease-[cubic-bezier(.4,.8,.74,1)]",
    "active:before:right-[-30%]",
    // The brand switch keeps the static white knob; the monochrome switch
    // uses the inverse surface so the knob stays visible in both themes.
    variant === "neutral" ? "before:bg-lark-base" : "before:bg-white",
    SWITCH_SIZE_STYLES[size].knob,
    checked ? SWITCH_SIZE_STYLES[size].slide : "left-0.5",
  );
}

// Context for passing controlFirst from Group to Items
const SwitchGroupContext = createContext<{ controlFirst: boolean }>({
  controlFirst: true,
});

/**
 * Single switch component props (with built-in Field)
 *
 * Usage patterns:
 *
 * Basic usage:
 * ```tsx
 * <Switch label="Enable notifications" checked={true} onCheckedChange={setChecked} />
 * ```
 *
 * Label first layout:
 * ```tsx
 * <Switch label="Dark mode" checked={false} onCheckedChange={setChecked} controlFirst={false} />
 * ```
 *
 * Neutral variant (monochrome, squircle shape):
 * ```tsx
 * <Switch label="Setting" variant="neutral" checked={false} onCheckedChange={setChecked} />
 * ```
 *
 * @property {string} label - Label text for the switch (Field wrapper is built-in)
 * @property {boolean} [controlFirst] - When true (default), switch appears before label
 */
export type SwitchProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  /** Visual variant: "default" (pill, brand color) or "neutral" (squircle, monochrome) */
  variant?: SwitchVariant;
  /** Label content for the switch (Field wrapper is built-in) - can be a string or any React node. Optional when used standalone for visual-only purposes. */
  label?: ReactNode;
  /** Tooltip content to display next to the label via an info icon */
  labelTooltip?: ReactNode;
  /**
   * Whether the switch is required.
   * When explicitly false, shows "(optional)" text after the label.
   */
  required?: boolean;
  /** When true (default), switch appears before label. When false, label appears before switch. */
  controlFirst?: boolean;
  size?: LarkSwitchSize;
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  transitioning?: boolean;
};

/**
 * Switch group component props (with built-in Fieldset)
 *
 * Usage:
 * ```tsx
 * <Switch.Group
 *   legend="Notification settings"
 *   error="You must enable at least one notification type"
 * >
 *   <Switch.Item label="Email notifications" value="email" />
 *   <Switch.Item label="SMS notifications" value="sms" />
 * </Switch.Group>
 * ```
 */
/**
 * Props for Switch.Legend — a composable sub-component for labeling a Switch.Group.
 *
 * Place as a direct child of `<Switch.Group>` to provide a styled, accessible legend.
 * Accepts `className` for full styling control (e.g. `className="sr-only"` to visually hide).
 *
 * @example
 * ```tsx
 * <Switch.Group>
 *   <Switch.Legend className="sr-only">Notification settings</Switch.Legend>
 *   <Switch.Item label="Email" value="email" />
 * </Switch.Group>
 * ```
 */
export interface SwitchLegendProps {
  /** Legend content */
  children: ReactNode;
  /** Additional CSS classes (e.g. "sr-only" to visually hide the legend) */
  className?: string;
}

export interface SwitchGroupProps {
  /**
   * Legend text for the group.
   * For more control over legend styling, omit this prop and use `<Switch.Legend>` as a child instead.
   */
  legend?: string;
  /** Child Switch.Item components (and optionally a Switch.Legend) */
  children: ReactNode;
  /** Error message for the group (only appears in groups, not single switches) */
  error?: string;
  /** Helper text for the group */
  description?: ReactNode;
  /** Whether all switches in the group are disabled */
  disabled?: boolean;
  /** When true (default), switch appears before label. When false, label appears before switch. */
  controlFirst?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Individual switch item within a group
 */
export type SwitchItemProps = {
  /** Visual variant: "default" or "error" for validation failures */
  variant?: SwitchVariant;
  /** Label text displayed next to switch */
  label: string;
  /** Additional CSS classes for the label wrapper */
  className?: string;
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: LarkSwitchSize;
  transitioning?: boolean;
};

// Single switch with built-in Field
const SwitchBase = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      checked,
      disabled,
      size = "base",
      variant = "default",
      label,
      labelTooltip,
      required,
      controlFirst = true,
      onCheckedChange,
      transitioning,
      id,
      ...props
    },
    ref,
  ) => {
    // For aria-label, only use string labels (ReactNode labels can't be used for aria-label)
    const ariaLabelFallback = typeof label === "string" ? label : "Switch";
    const switchControl = (
      <BaseSwitch.Root
        ref={ref}
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        nativeButton
        render={(rootProps, state) => {
          const {
            ref: rootRef,
            className: baseClassName,
            role: baseRole,
            "aria-checked": _ariaChecked,
            "aria-pressed": _ariaPressed,
            ...restRootProps
          } = rootProps as typeof rootProps & {
            ref?: Ref<HTMLButtonElement>;
            className?: string;
            role?: string;
            "aria-checked"?: boolean;
            "aria-pressed"?: boolean;
          };

          const role =
            (props.role as string | undefined) ?? baseRole ?? "switch";
          const checkedA11yProps =
            role === "switch"
              ? { "aria-checked": state.checked }
              : { "aria-pressed": state.checked };

          return (
            <button
              {...restRootProps}
              {...props}
              ref={rootRef}
              data-lark-component="Switch"
              type="button"
              role={role}
              {...checkedA11yProps}
              aria-busy={transitioning || undefined}
              aria-label={props["aria-label"] ?? ariaLabelFallback}
              className={cn(
                switchControlClasses({
                  variant,
                  size,
                  checked: state.checked,
                  disabled,
                }),
                className,
                baseClassName,
              )}
            >
              <div
                className={switchThumbClasses({
                  variant,
                  size,
                  checked: state.checked,
                })}
              />
            </button>
          );
        }}
      />
    );

    // Wrap in Field (built-in) - no description for single switches
    // If no label provided, return bare switch (for use in other components)
    if (!label) {
      return switchControl;
    }

    return (
      <Field
        label={
          // Feishu mutes the label of a disabled control.
          disabled ? <span className="text-lark-inactive">{label}</span> : label
        }
        required={required}
        labelTooltip={labelTooltip}
        controlFirst={controlFirst}
      >
        {switchControl}
      </Field>
    );
  },
);

SwitchBase.displayName = "Switch";

// Switch.Item for use within Switch.Group
const SwitchItem = forwardRef<HTMLButtonElement, SwitchItemProps>(
  (
    {
      className,
      checked,
      disabled,
      size = "base",
      variant = "default",
      label,
      onCheckedChange,
      transitioning,
    },
    ref,
  ) => {
    const { controlFirst } = useContext(SwitchGroupContext);

    return (
      <label
        data-lark-component="Switch"
        data-lark-part="item-label"
        className={cn(
          "relative m-0 inline-flex items-center gap-2",
          // Control first (default): switch before label
          // Label first: label before switch using flex-row-reverse
          !controlFirst && "flex-row-reverse justify-end",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          className,
        )}
      >
        <BaseSwitch.Root
          ref={ref}
          checked={checked}
          disabled={disabled}
          onCheckedChange={onCheckedChange}
          nativeButton
          render={(rootProps, state) => {
            const {
              ref: rootRef,
              className: baseClassName,
              role: baseRole,
              "aria-checked": _ariaChecked,
              "aria-pressed": _ariaPressed,
              ...restRootProps
            } = rootProps as typeof rootProps & {
              ref?: Ref<HTMLButtonElement>;
              className?: string;
              role?: string;
              "aria-checked"?: boolean;
              "aria-pressed"?: boolean;
            };

            const role = baseRole ?? "switch";
            const checkedA11yProps =
              role === "switch"
                ? { "aria-checked": state.checked }
                : { "aria-pressed": state.checked };

            return (
              <button
                {...restRootProps}
                ref={rootRef}
                data-lark-component="Switch"
                data-lark-part="item"
                type="button"
                role={role}
                {...checkedA11yProps}
                aria-busy={transitioning || undefined}
                className={cn(
                  switchControlClasses({
                    variant,
                    size,
                    checked: state.checked,
                    disabled,
                  }),
                  baseClassName,
                )}
              >
                <div
                  className={switchThumbClasses({
                    variant,
                    size,
                    checked: state.checked,
                  })}
                />
              </button>
            );
          }}
        />
        <span
          className={cn(
            "text-base font-medium",
            disabled ? "text-lark-inactive" : "text-lark-default",
          )}
        >
          {label}
        </span>
      </label>
    );
  },
);

SwitchItem.displayName = "Switch.Item";

// Switch.Legend — composable legend sub-component for Switch.Group
function SwitchLegend({ children, className }: SwitchLegendProps) {
  return (
    <Fieldset.Legend
      className={cn("text-base font-medium text-lark-default", className)}
    >
      {children}
    </Fieldset.Legend>
  );
}

SwitchLegend.displayName = "Switch.Legend";

// Switch.Group with built-in Fieldset
function SwitchGroup({
  legend,
  children,
  error,
  description,
  disabled,
  controlFirst = true,
  className,
}: SwitchGroupProps) {
  return (
    <SwitchGroupContext.Provider value={{ controlFirst }}>
      <Fieldset.Root
        className={cn("flex flex-col gap-4", className)}
        disabled={disabled}
      >
        {legend && (
          <Fieldset.Legend className="text-base font-medium text-lark-default">
            {legend}
          </Fieldset.Legend>
        )}
        <div className="flex flex-col gap-2">{children}</div>
        {error && <p className="text-sm text-lark-danger">{error}</p>}
        {description && (
          <p className="text-sm text-lark-subtle">{description}</p>
        )}
      </Fieldset.Root>
    </SwitchGroupContext.Provider>
  );
}

// Compound component
export const Switch = Object.assign(SwitchBase, {
  Item: SwitchItem,
  Group: SwitchGroup,
  Legend: SwitchLegend,
});

Switch.displayName = "Switch";
