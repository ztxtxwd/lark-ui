import { cn } from "../../utils/cn";
import { resolveVariant } from "../../utils/resolve-variant";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { Input as BaseInput } from "@base-ui/react/input";
import {
  Field,
  normalizeFieldError,
  type FieldErrorMatch,
} from "../field/field";

/** Input size and variant definitions mapping names to their Tailwind classes. */
export const LARK_INPUT_VARIANTS = {
  size: {
    xs: {
      classes: "h-6 gap-1 rounded-md pl-[7px] pr-[3px] text-xs",
      description: "Extra small input for compact UIs (24px)",
    },
    sm: {
      classes: "h-7 gap-1 rounded-md pl-[7px] pr-[3px] text-xs",
      description: "Small input (28px, Feishu small control)",
    },
    base: {
      classes: "h-8 gap-1.5 rounded-md pl-[11px] pr-2 text-base",
      description: "Default input (32px, Feishu medium control)",
    },
    lg: {
      classes: "h-10 gap-2 rounded-md pl-[11px] pr-2 text-lg",
      description: "Large input (40px, Feishu large control)",
    },
  },
  variant: {
    default: {
      classes:
        "bg-lark-base ring-lark-border hover:ring-lark-brand focus:ring-lark-brand",
      description: "Default input appearance",
    },
    error: {
      classes:
        "!ring-lark-danger hover:!ring-lark-danger focus:!ring-lark-danger",
      description: "Error state for validation failures",
    },
  },
} as const;

export const LARK_INPUT_DEFAULT_VARIANTS = {
  size: "base",
  variant: "default",
} as const;

export const LARK_INPUT_STYLING = {
  dimensions: {
    xs: { height: 24, paddingX: 7, fontSize: 12, borderRadius: 6, width: 160 },
    sm: { height: 28, paddingX: 7, fontSize: 12, borderRadius: 6, width: 200 },
    base: {
      height: 32,
      paddingX: 11,
      fontSize: 14,
      borderRadius: 6,
      width: 280,
    },
    lg: { height: 40, paddingX: 11, fontSize: 16, borderRadius: 6, width: 320 },
  },
  baseTokens: {
    background: "color-lark-base",
    text: "text-color-lark-default",
    placeholder: "text-color-lark-placeholder",
    ring: "color-lark-border",
  },
  stateTokens: {
    hover: { ring: "color-lark-brand" },
    focus: { ring: "color-lark-brand" },
    error: { ring: "color-lark-danger" },
    disabled: { background: "color-lark-control", ring: "color-lark-border" },
  },
} as const;

// Derived types from LARK_INPUT_VARIANTS
export type LarkInputSize = keyof typeof LARK_INPUT_VARIANTS.size;
export type LarkInputVariant = keyof typeof LARK_INPUT_VARIANTS.variant;

export interface LarkInputVariantsProps {
  /**
   * Input size.
   * - `"xs"` — Extra small for compact UIs
   * - `"sm"` — Small for secondary fields
   * - `"base"` — Default size
   * - `"lg"` — Large for prominent fields
   * @default "base"
   */
  size?: LarkInputSize;
  /**
   * Visual variant.
   * - `"default"` — Standard input
   * - `"error"` — Error state for validation failures
   * @default "default"
   */
  variant?: LarkInputVariant;
  parentFocusIndicator?: boolean;
  focusIndicator?: boolean;
}

// Omit native `size` attribute (number) to avoid conflict with our custom `size` variant
type BaseInputProps = Omit<ComponentPropsWithoutRef<typeof BaseInput>, "size">;

export function inputVariants({
  variant = LARK_INPUT_DEFAULT_VARIANTS.variant,
  size = LARK_INPUT_DEFAULT_VARIANTS.size,
  parentFocusIndicator = false,
  focusIndicator = false,
}: LarkInputVariantsProps = {}) {
  return cn(
    // Base styles — Feishu draws a 1px component border, white surface
    "bg-lark-base text-lark-default ring ring-lark-border outline-none",
    // Hover and focus both turn the border brand-coloured (no focus halo)
    "hover:ring-lark-brand focus:ring-lark-brand",
    // Disabled: recessed surface, muted text, border stays put
    "disabled:cursor-not-allowed disabled:bg-lark-control disabled:text-lark-placeholder",
    // Placeholder styles (using vanilla CSS class for Chrome compatibility)
    "lark-input-placeholder",
    // Apply size styles from LARK_INPUT_VARIANTS
    resolveVariant(
      LARK_INPUT_VARIANTS.size,
      size,
      LARK_INPUT_DEFAULT_VARIANTS.size,
    ).classes,
    // Apply variant styles from LARK_INPUT_VARIANTS
    resolveVariant(
      LARK_INPUT_VARIANTS.variant,
      variant,
      LARK_INPUT_DEFAULT_VARIANTS.variant,
    ).classes,
    // Focus state handling
    parentFocusIndicator &&
      (variant === "error"
        ? "focus-within:ring-lark-danger"
        : "focus-within:ring-lark-brand"),
    focusIndicator &&
      (variant === "error"
        ? "focus:ring-lark-danger"
        : "focus:ring-lark-brand"),
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    className,
    size = "base",
    variant: variantProp,
    label,
    labelTooltip,
    description,
    error,
    passwordManagerIgnore = false,
    ...inputProps
  } = props;

  // Deprecation warning for variant="error"
  if (process.env.NODE_ENV !== "production" && variantProp === "error") {
    console.warn(
      '[Lark Input]: variant="error" is deprecated. ' +
        "Error styling is now automatically applied when the `error` prop is truthy. " +
        "Simply remove the variant prop and pass an error message instead.",
    );
  }

  // Auto-apply error styling when error prop is truthy
  // Explicit variant prop takes precedence for backwards compatibility
  const variant = variantProp ?? (error ? "error" : "default");

  // Extract required from inputProps to pass to Field for label decoration
  const { required } = inputProps;

  // A11y enforcement: warn in dev if no accessible name provided
  if (process.env.NODE_ENV !== "production") {
    const hasLabel = Boolean(label);
    const hasAriaLabel = Boolean(inputProps["aria-label"]);
    const hasAriaLabelledBy = Boolean(inputProps["aria-labelledby"]);

    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
      console.warn(
        "[Lark Input]: Input must have an accessible name. Provide either:\n" +
          "  - label prop: <Input label='Email' />\n" +
          "  - aria-label: <Input aria-label='Email address' />\n" +
          "  - aria-labelledby for custom label association",
      );
    }
  }

  const input = (
    <BaseInput
      ref={ref}
      className={cn(
        inputVariants({ size, variant, focusIndicator: true }),
        passwordManagerIgnore && "keeper-ignore",
        className,
      )}
      {...(passwordManagerIgnore
        ? {
            "data-1p-ignore": "true",
            "data-bwignore": "true",
            "data-form-type": "other",
            "data-lpignore": "true",
          }
        : {})}
      {...inputProps}
    />
  );

  // Render with Field wrapper if label, error, or description is provided
  if (label || error || description) {
    return (
      <Field
        label={label}
        required={required}
        labelTooltip={labelTooltip}
        description={description}
        error={normalizeFieldError(error)}
      >
        {input}
      </Field>
    );
  }

  // Render bare input without Field wrapper
  return input;
});

Input.displayName = "Input";

/**
 * Input component props with accessibility guidance.
 *
 * **Accessible Name Required:** Input should have one of:
 * 1. `label` prop (recommended) - enables Field wrapper with label/description/error
 * 2. `placeholder` + `aria-label` - for bare inputs with visual placeholder
 * 3. `aria-labelledby` - for custom label association
 *
 * Missing accessible names will trigger console warnings in development.
 *
 * @example
 * // Recommended: Built-in Field wrapper
 * <Input label="Email" placeholder="you@example.com" />
 *
 * @example
 * // Bare input with placeholder and aria-label
 * <Input placeholder="Search..." aria-label="Search products" />
 *
 * @example
 * // Custom label association
 * <label id="email-label">Email</label>
 * <Input aria-labelledby="email-label" />
 *
 * @example
 * // With description and error
 * <Input
 *   label="Password"
 *   description="Must be at least 8 characters"
 *   error="Password is too short"
 * />
 */
export type InputProps = Pick<LarkInputVariantsProps, "size" | "variant"> &
  BaseInputProps & {
    /** Label content for the input (enables Field wrapper) - can be a string or any React node */
    label?: ReactNode;
    /** Tooltip content to display next to the label via an info icon */
    labelTooltip?: ReactNode;
    /** Helper text displayed below the input */
    description?: ReactNode;
    /** Error message or validation error object */
    error?: string | { message: ReactNode; match: FieldErrorMatch };
    /** Suppress browser extension password manager overlays on non-credential inputs. */
    passwordManagerIgnore?: boolean;
  };
