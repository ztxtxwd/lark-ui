import { forwardRef, createContext, useContext, type ReactNode } from "react";
import { CheckIcon, MinusIcon } from "../../icons/phosphor";
import { cn } from "../../utils/cn";
import { resolveVariant } from "../../utils/resolve-variant";
import { Label } from "../label";
import { Fieldset } from "@base-ui/react/fieldset";
import { Field as FieldBase } from "@base-ui/react/field";
import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";

/** Event details passed to onCheckedChange callback. Re-exported from Base UI. */
export type CheckboxChangeEventDetails = Parameters<
  NonNullable<BaseCheckbox.Root.Props["onCheckedChange"]>
>[1];

/**
 * Feishu transitions colour changes over 100ms and nothing else. The control
 * outline is drawn with a ring, so `ring-color` joins the transition list.
 */
const FEISHU_COLOR_TRANSITION =
  "transition-[color,background-color,border-color,ring-color] duration-100 ease-in";

/** Checkbox variant definitions mapping variant names to their Tailwind classes. */
export const LARK_CHECKBOX_VARIANTS = {
  variant: {
    default: {
      classes:
        "bg-lark-base ring-lark-outline hover:ring-lark-brand active:ring-lark-brand-pressed focus-visible:ring-lark-brand data-[checked]:bg-lark-brand data-[checked]:ring-transparent data-[checked]:hover:bg-lark-brand-hover data-[checked]:active:bg-lark-brand-pressed",
      description: "Default checkbox appearance",
    },
    error: {
      classes: "bg-lark-base ring-lark-danger data-[checked]:bg-lark-brand",
      description: "Error state for validation failures",
    },
  },
  appearance: {
    default: {
      classes: "",
      description: "Standard inline checkbox item",
    },
    card: {
      classes:
        "rounded-lg border border-lark-hairline bg-lark-base p-3 hover:not-has-[[data-checked]]:bg-lark-elevated has-[[data-checked]]:border-lark-interact has-[[data-checked]]:bg-lark-tint",
      description:
        "Choice card appearance with border, padding, and highlighted selection state",
    },
  },
} as const;

export const LARK_CHECKBOX_DEFAULT_VARIANTS = {
  variant: "default",
  appearance: "default",
} as const;

// Derived types from LARK_CHECKBOX_VARIANTS
export type LarkCheckboxVariant = keyof typeof LARK_CHECKBOX_VARIANTS.variant;
export type LarkCheckboxAppearance =
  keyof typeof LARK_CHECKBOX_VARIANTS.appearance;

export interface LarkCheckboxVariantsProps {
  /**
   * Visual variant.
   * - `"default"` — Standard checkbox appearance
   * - `"error"` — Error state for validation failures
   * @default "default"
   */
  variant?: LarkCheckboxVariant;
  /**
   * Visual appearance.
   * - `"default"` — Standard inline checkbox item
   * - `"card"` — Choice card with border, padding, and highlighted selection state
   * @default "default"
   */
  appearance?: LarkCheckboxAppearance;
}

export function checkboxVariants({
  variant = LARK_CHECKBOX_DEFAULT_VARIANTS.variant,
  appearance = LARK_CHECKBOX_DEFAULT_VARIANTS.appearance,
}: LarkCheckboxVariantsProps = {}) {
  return cn(
    resolveVariant(
      LARK_CHECKBOX_VARIANTS.variant,
      variant,
      LARK_CHECKBOX_DEFAULT_VARIANTS.variant,
    ).classes,
    resolveVariant(
      LARK_CHECKBOX_VARIANTS.appearance,
      appearance,
      LARK_CHECKBOX_DEFAULT_VARIANTS.appearance,
    ).classes,
  );
}

// Legacy type alias for backwards compatibility
export type CheckboxVariant = LarkCheckboxVariant;

/**
 * Feishu (`ud__checkbox`) control styling.
 *
 * Feishu draws a 16×16 box with a 1px outline, a 4px radius and the page
 * background inside it. Hover, press and keyboard focus repaint the *outline*
 * brand-coloured; the checked and indeterminate states fill the box with the
 * brand colour and drop the outline; the disabled state swaps to the
 * recessed fill and stops reacting to pointer input.
 *
 * The outline is an inset ring, so the box keeps Feishu's exact 16×16
 * footprint instead of growing by a pixel on each side.
 */
function checkboxControlClasses({
  variant,
  disabled,
}: {
  variant: CheckboxVariant;
  disabled?: boolean;
}) {
  const isError = variant === "error";
  return cn(
    "relative flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-lark-base ring ring-inset focus:outline-none",
    FEISHU_COLOR_TRANSITION,
    // Resting outline: the component border, or the danger colour on errors.
    isError ? "ring-lark-danger" : "ring-lark-outline",
    // Hover / press / focus only repaint the outline of an unchecked box.
    // Feishu also reacts when the label row is hovered, because the input
    // covers the whole row.
    !disabled &&
      !isError &&
      "group-hover:not-data-[checked]:ring-lark-brand hover:not-data-[checked]:ring-lark-brand focus-visible:not-data-[checked]:ring-lark-brand active:not-data-[checked]:ring-lark-brand-pressed",
    // Checked and indeterminate fill the box with the brand colour and hide
    // the outline; hovering the filled box lightens the fill.
    !disabled &&
      "data-[checked]:bg-lark-brand data-[checked]:ring-transparent data-[checked]:hover:bg-lark-brand-hover data-[checked]:focus-visible:bg-lark-brand-hover data-[checked]:active:bg-lark-brand-pressed data-[indeterminate]:bg-lark-brand data-[indeterminate]:ring-transparent data-[indeterminate]:hover:bg-lark-brand-hover data-[indeterminate]:focus-visible:bg-lark-brand-hover data-[indeterminate]:active:bg-lark-brand-pressed",
    // Disabled controls mute the fill and drop every interaction.
    disabled &&
      "cursor-not-allowed bg-lark-recessed ring-lark-disabled data-[checked]:bg-lark-disabled data-[indeterminate]:bg-lark-disabled",
  );
}

// Context for passing controlFirst, appearance, and orientation from Group to
// Items. `controlFirst` may be undefined so each item can fall back to an
// appearance-appropriate default (control first for default, last for card).
// `orientation` is null outside a Checkbox.Group.
const CheckboxGroupContext = createContext<{
  controlFirst: boolean | undefined;
  appearance: LarkCheckboxAppearance;
  orientation: "vertical" | "horizontal" | null;
}>({
  controlFirst: undefined,
  appearance: "default",
  orientation: null,
});

/**
 * Single checkbox component props with accessibility guidance.
 *
 * **Accessible Name Required:** Checkbox should have one of:
 * 1. `label` prop (recommended) - built-in Field wrapper with horizontal layout
 * 2. `aria-label` - for checkboxes without visible label
 * 3. `aria-labelledby` - for custom label association
 *
 * **Note:** When used inside Checkbox.Group or Dropdown, label is optional (parent provides context).
 *
 * Missing accessible names will trigger console warnings in development (unless inside a group).
 *
 * @example
 * // Recommended: Built-in Field wrapper with label
 * <Checkbox label="Accept terms and conditions" />
 *
 * @example
 * // Control-first layout (checkbox before label)
 * <Checkbox label="Remember me" controlFirst={true} />
 *
 * @example
 * // Label-first layout (label before checkbox)
 * <Checkbox label="Enable notifications" controlFirst={false} />
 *
 * @example
 * // Error variant (visual only, no error text for single checkboxes)
 * <Checkbox label="Required field" variant="error" />
 *
 * @example
 * // Without visible label (aria-label required)
 * <Checkbox aria-label="Select all items" />
 *
 * @example
 * // Custom label association
 * <label id="terms-label">I accept the terms</label>
 * <Checkbox aria-labelledby="terms-label" />
 *
 * @example
 * // Inside Checkbox.Group (label optional)
 * <Checkbox.Group legend="Preferences">
 *   <Checkbox.Item value="email" label="Email notifications" />
 *   <Checkbox.Item value="sms" label="SMS notifications" />
 * </Checkbox.Group>
 */
export type CheckboxProps = {
  /** Visual variant: "default" or "error" for validation failures (visual only, no error text) */
  variant?: CheckboxVariant;
  /** Label content for the checkbox (enables built-in Field wrapper) - can be a string or any React node */
  label?: ReactNode;
  /** Tooltip content to display next to the label via an info icon */
  labelTooltip?: ReactNode;
  /** When true (default), checkbox appears before label. When false, label appears before checkbox. */
  controlFirst?: boolean;
  /** Whether the checkbox is checked (controlled) */
  checked?: boolean;
  /** Whether the checkbox is in indeterminate state */
  indeterminate?: boolean;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Callback when the checked state changes */
  onCheckedChange?: BaseCheckbox.Root.Props["onCheckedChange"];
  /** Name for form submission */
  name?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Additional class name */
  className?: string;
  /** Accessible label when no visible label is provided */
  "aria-label"?: string;
  /** ID of element that labels this checkbox */
  "aria-labelledby"?: string;
};

/**
 * Checkbox group component props (with built-in Fieldset and CheckboxGroup)
 *
 * Usage:
 * ```tsx
 * <Checkbox.Group
 *   legend="Choose preferences"
 *   defaultValue={['email']}
 *   error="You must select at least one option"
 * >
 *   <Checkbox.Item label="Email notifications" value="email" />
 *   <Checkbox.Item label="SMS notifications" value="sms" />
 * </Checkbox.Group>
 * ```
 */
/**
 * Props for Checkbox.Legend — a composable sub-component for labeling a Checkbox.Group.
 *
 * Place as a direct child of `<Checkbox.Group>` to provide a styled, accessible legend.
 * Accepts `className` for full styling control (e.g. `className="sr-only"` to visually hide).
 *
 * @example
 * ```tsx
 * <Checkbox.Group>
 *   <Checkbox.Legend className="sr-only">Preferences</Checkbox.Legend>
 *   <Checkbox.Item label="Email" value="email" />
 * </Checkbox.Group>
 * ```
 */
export interface CheckboxLegendProps {
  /** Legend content */
  children: ReactNode;
  /** Additional CSS classes (e.g. "sr-only" to visually hide the legend) */
  className?: string;
}

export interface CheckboxGroupProps {
  /**
   * Legend text for the group.
   * For more control over legend styling, omit this prop and use `<Checkbox.Legend>` as a child instead.
   */
  legend?: string;
  /** Child Checkbox.Item components (and optionally a Checkbox.Legend) */
  children: ReactNode;
  /** Error message for the group (only appears in groups, not single checkboxes) */
  error?: string;
  /** Helper text for the group */
  description?: ReactNode;
  /** Values of checkboxes that should be initially checked (uncontrolled) */
  defaultValue?: string[];
  /** Values of checkboxes that should be checked (controlled) */
  value?: string[];
  /** Event handler called when checkbox values change */
  onValueChange?: (value: string[]) => void;
  /** All possible checkbox values (required for parent checkbox pattern) */
  allValues?: string[];
  /** Whether all checkboxes in the group are disabled */
  disabled?: boolean;
  /** Layout direction of the checkbox items */
  orientation?: "vertical" | "horizontal";
  /**
   * Visual appearance applied to all Checkbox.Item children.
   * - `"default"` — Standard inline checkbox items
   * - `"card"` — Choice card with border, padding, and highlighted selection state
   *
   * Individual items can override this with their own `appearance` prop.
   * @default "default"
   */
  appearance?: LarkCheckboxAppearance;
  /** When true, checkbox appears before label. When false, label appears before checkbox. Defaults to true for default appearance and false for card appearance. */
  controlFirst?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Individual checkbox item within a group
 */
export type CheckboxItemProps = {
  /** Visual variant: "default" or "error" for validation failures */
  variant?: CheckboxVariant;
  /**
   * Visual appearance of the checkbox item.
   * - `"default"` — Standard inline checkbox item
   * - `"card"` — Choice card with border, padding, and highlighted selection state
   *
   * When set on an individual item, overrides the group-level `appearance`.
   * @default "default"
   */
  appearance?: LarkCheckboxAppearance;
  /** Label text displayed next to checkbox */
  label: string;
  /** Description text displayed below the label (only visible in card appearance) */
  description?: ReactNode;
  /** Value of the checkbox (required when used in Checkbox.Group) */
  value?: string;
  /** Additional CSS classes for the label wrapper */
  className?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  /** Callback when the checked state changes */
  onCheckedChange?: BaseCheckbox.Root.Props["onCheckedChange"];
  name?: string;
};

// Single checkbox with built-in Field
const CheckboxBase = forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      className,
      checked,
      indeterminate,
      disabled,
      variant = "default",
      label,
      labelTooltip,
      controlFirst = true,
      onCheckedChange,
      required,
      name,
      ...props
    },
    ref,
  ) => {
    // A11y enforcement: warn in dev if no accessible name provided
    if (process.env.NODE_ENV !== "production") {
      const hasLabel = Boolean(label);
      const hasAriaLabel = Boolean(props["aria-label"]);
      const hasAriaLabelledBy = Boolean(props["aria-labelledby"]);

      if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
        console.warn(
          "[Lark Checkbox]: Checkbox must have an accessible name. Provide either:\n" +
            "  - label prop: <Checkbox label='Accept terms' />\n" +
            "  - aria-label: <Checkbox aria-label='Select item' />\n" +
            "  - aria-labelledby for custom label association\n" +
            "  Note: When used inside Checkbox.Group, label is optional",
        );
      }
    }

    const checkboxControl = (
      <BaseCheckbox.Root
        ref={ref}
        data-lark-component="Checkbox"
        name={name}
        checked={checked}
        indeterminate={indeterminate}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        className={cn(
          checkboxControlClasses({ variant, disabled }),
          "after:absolute after:-inset-x-3 after:-inset-y-2",
          label && "mt-0.5",
          className,
        )}
        {...props}
      >
        <BaseCheckbox.Indicator
          keepMounted
          className={cn(
            // Feishu scales the tick in from 0 over 200ms.
            "flex items-center justify-center transition-[scale,opacity] duration-200 ease-[cubic-bezier(0.34,0.69,0.1,1)] data-[unchecked]:invisible data-[unchecked]:scale-0 data-[unchecked]:opacity-0",
            // Feishu draws the tick in the static white of the brand fill and
            // mutes it on the disabled fill.
            disabled ? "text-lark-inverse" : "text-white",
          )}
          render={(renderProps, state) => (
            <span {...renderProps}>
              {state.indeterminate ? (
                <MinusIcon weight="bold" size={12} />
              ) : (
                <CheckIcon weight="bold" size={12} />
              )}
            </span>
          )}
        />
      </BaseCheckbox.Root>
    );

    // If no label provided, return bare checkbox (for use in other components like Dropdown)
    if (!label) {
      return checkboxControl;
    }

    // Use Field.Root + Field.Label enclosing pattern for proper a11y association
    // See: https://base-ui.com/react/components/field
    return (
      <FieldBase.Root className="inline-flex">
        <FieldBase.Label
          className={cn(
            "group !m-0 inline-flex !min-h-0 items-start gap-2 !text-base",
            controlFirst ? "flex-row" : "flex-row-reverse justify-end",
            disabled
              ? "cursor-not-allowed text-lark-inactive"
              : "cursor-pointer text-lark-default",
          )}
        >
          {checkboxControl}
          <Label
            showOptional={required === false}
            tooltip={labelTooltip}
            asContent
          >
            {label}
          </Label>
        </FieldBase.Label>
      </FieldBase.Root>
    );
  },
);

CheckboxBase.displayName = "Checkbox";

// Checkbox.Item for use within Checkbox.Group
const CheckboxItem = forwardRef<HTMLButtonElement, CheckboxItemProps>(
  (
    {
      className,
      checked,
      indeterminate,
      disabled,
      variant = "default",
      appearance: appearanceProp,
      label,
      description,
      value,
      onCheckedChange,
      name,
    },
    ref,
  ) => {
    const {
      controlFirst: groupControlFirst,
      appearance: groupAppearance,
      orientation,
    } = useContext(CheckboxGroupContext);
    const appearance = appearanceProp ?? groupAppearance;
    const isCard = appearance === "card";
    // Fall back to an appearance-appropriate default when controlFirst is not
    // provided: card puts the checkbox last (right), default puts it first.
    const controlFirst = groupControlFirst ?? !isCard;
    // Card items in a card group render as cells of one shared card; the group
    // draws the outer border and each cell draws its own dividers.
    const isJoined =
      isCard && groupAppearance === "card" && orientation !== null;

    const indicator = (
      <BaseCheckbox.Indicator
        keepMounted
        className={cn(
          // Feishu scales the tick in from 0 over 200ms.
          "flex items-center justify-center transition-[scale,opacity] duration-200 ease-[cubic-bezier(0.34,0.69,0.1,1)] data-[unchecked]:invisible data-[unchecked]:scale-0 data-[unchecked]:opacity-0",
          // Feishu draws the tick in the static white of the brand fill and
          // mutes it on the disabled fill.
          disabled ? "text-lark-inverse" : "text-white",
        )}
        render={(renderProps, state) => (
          <span {...renderProps}>
            {state.indeterminate ? (
              <MinusIcon weight="bold" size={12} />
            ) : (
              <CheckIcon weight="bold" size={12} />
            )}
          </span>
        )}
      />
    );

    if (isCard) {
      return (
        <label
          data-lark-component="Checkbox"
          data-lark-part="item-label"
          className={cn(
            "group relative m-0 flex items-start gap-3 bg-lark-base p-3 has-[[data-checked]]:bg-lark-tint",
            isJoined
              ? cn(
                  // bg-clip-padding keeps the checked tint from darkening the
                  // translucent dividers.
                  "border-b border-lark-line bg-clip-padding last:border-b-0",
                  // Two-column grid: the left column draws the column divider
                  // (unless it's a lone last item), and the last row drops its
                  // bottom divider.
                  orientation === "horizontal" &&
                    "odd:border-r [&:last-child:nth-child(odd)]:border-r-0 [&:nth-last-child(2):nth-child(odd)]:border-b-0",
                )
              : "rounded-lg border border-lark-hairline has-[[data-checked]]:border-lark-interact",
            controlFirst && "flex-row-reverse",
            variant === "error" &&
              cn(
                "has-[[data-checked]]:bg-lark-base",
                !isJoined &&
                  "border-lark-danger has-[[data-checked]]:border-lark-danger",
              ),
            disabled
              ? "cursor-not-allowed"
              : cn(
                  "cursor-pointer has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:text-lark-inactive",
                  // The checked row keeps its tint while hovered.
                  variant !== "error" &&
                    "hover:not-has-[[data-disabled]]:not-has-[[data-checked]]:bg-lark-elevated",
                ),
            className,
          )}
        >
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span
              className={cn(
                "text-base font-medium",
                disabled ? "text-lark-inactive" : "text-lark-default",
              )}
            >
              {label}
            </span>
            {description && (
              <span
                className={cn(
                  "text-sm",
                  disabled ? "text-lark-inactive" : "text-lark-subtle",
                )}
              >
                {description}
              </span>
            )}
          </div>
          <BaseCheckbox.Root
            ref={ref}
            data-lark-component="Checkbox"
            data-lark-part="item"
            value={value}
            name={name}
            checked={checked}
            indeterminate={indeterminate}
            disabled={disabled}
            onCheckedChange={onCheckedChange}
            className={cn(
              checkboxControlClasses({ variant, disabled }),
              "mt-0.5",
            )}
          >
            {indicator}
          </BaseCheckbox.Root>
        </label>
      );
    }

    return (
      <label
        data-lark-component="Checkbox"
        data-lark-part="item-label"
        className={cn(
          "group relative m-0 inline-flex items-start gap-2",
          // Control first (default): checkbox before label
          // Label first: label before checkbox using flex-row-reverse
          !controlFirst && "flex-row-reverse justify-end",
          disabled
            ? "cursor-not-allowed"
            : "cursor-pointer has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:text-lark-inactive",
          className,
        )}
      >
        <BaseCheckbox.Root
          ref={ref}
          data-lark-component="Checkbox"
          data-lark-part="item"
          value={value}
          name={name}
          checked={checked}
          indeterminate={indeterminate}
          disabled={disabled}
          onCheckedChange={onCheckedChange}
          className={cn(
            checkboxControlClasses({ variant, disabled }),
            "mt-0.5 after:absolute after:-inset-x-3 after:-inset-y-2",
          )}
        >
          {indicator}
        </BaseCheckbox.Root>
        <span
          className={cn(
            "text-base",
            disabled ? "text-lark-inactive" : "text-lark-default",
          )}
        >
          {label}
        </span>
      </label>
    );
  },
);

CheckboxItem.displayName = "Checkbox.Item";

// Checkbox.Legend — composable legend sub-component for Checkbox.Group
function CheckboxLegend({ children, className }: CheckboxLegendProps) {
  return (
    <Fieldset.Legend
      className={cn("text-base font-medium text-lark-default", className)}
    >
      {children}
    </Fieldset.Legend>
  );
}

CheckboxLegend.displayName = "Checkbox.Legend";

// Checkbox.Group with built-in Fieldset and CheckboxGroup
function CheckboxGroup({
  legend,
  children,
  error,
  description,
  defaultValue,
  value,
  onValueChange,
  allValues,
  disabled,
  orientation = "vertical",
  appearance = "default",
  controlFirst,
  className,
}: CheckboxGroupProps) {
  return (
    <CheckboxGroupContext.Provider
      value={{ controlFirst, appearance, orientation }}
    >
      <BaseCheckboxGroup
        defaultValue={defaultValue}
        value={value}
        onValueChange={onValueChange}
        allValues={allValues}
        disabled={disabled}
      >
        <Fieldset.Root
          className={cn(
            "flex flex-col p-0",
            // Card groups match Field's label-to-control gap.
            appearance === "card" ? "gap-2" : "gap-4",
            className,
          )}
        >
          {legend && (
            <Fieldset.Legend className="text-base font-medium text-lark-default">
              {legend}
            </Fieldset.Legend>
          )}
          <div
            className={cn(
              orientation === "vertical"
                ? appearance === "card"
                  ? "flex flex-col overflow-hidden rounded-lg ring ring-lark-line"
                  : "flex flex-col gap-2"
                : appearance === "card"
                  ? "grid grid-cols-2 overflow-hidden rounded-lg bg-lark-base ring ring-lark-line"
                  : "flex flex-row flex-wrap gap-2",
            )}
          >
            {children}
          </div>
          {error && <p className="text-sm text-lark-danger">{error}</p>}
          {description && (
            <p className="text-sm text-lark-subtle">{description}</p>
          )}
        </Fieldset.Root>
      </BaseCheckboxGroup>
    </CheckboxGroupContext.Provider>
  );
}

// Compound component
export const Checkbox = Object.assign(CheckboxBase, {
  Item: CheckboxItem,
  Group: CheckboxGroup,
  Legend: CheckboxLegend,
});

Checkbox.displayName = "Checkbox";
