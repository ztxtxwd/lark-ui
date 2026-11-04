import { resolveVariant } from "../../utils/resolve-variant";
import { cn } from "../../utils/cn";

/** Loader size variant definitions mapping sizes to their pixel values. */
export const LARK_LOADER_VARIANTS = {
  size: {
    sm: {
      value: 14,
      description: "Small loader for inline use",
    },
    base: {
      value: 24,
      description: "Default loader size",
    },
    lg: {
      value: 40,
      description: "Large loader for prominent loading states",
    },
  },
} as const;

export const LARK_LOADER_DEFAULT_VARIANTS = {
  size: "base",
} as const;

// Derived types from LARK_LOADER_VARIANTS
export type LarkLoaderSize = keyof typeof LARK_LOADER_VARIANTS.size;

export interface LarkLoaderVariantsProps {
  /**
   * Size of the loader. Use a preset name or a custom pixel number.
   * - `"sm"` — 14px, small loader for inline use
   * - `"base"` — 24px, default loader size
   * - `"lg"` — 40px, large loader for prominent loading states
   * @default "base"
   */
  size?: LarkLoaderSize | number;
}

export function loaderVariants({
  size = LARK_LOADER_DEFAULT_VARIANTS.size,
}: LarkLoaderVariantsProps = {}): number {
  if (typeof size === "number") return size;
  return resolveVariant(
    LARK_LOADER_VARIANTS.size,
    size,
    LARK_LOADER_DEFAULT_VARIANTS.size,
  ).value;
}

/**
 * Loader component props.
 *
 * @example
 * ```tsx
 * <Loader />
 * <Loader size="sm" />
 * <Loader size={24} />
 * ```
 */
export interface LoaderProps {
  /** Additional CSS classes merged via `cn()`. */
  className?: string;
  /**
   * Size of the spinner. Use a preset name or a custom pixel number.
   * - `"sm"` — 14px, for inline use
   * - `"base"` — 24px, default size
   * - `"lg"` — 40px, for prominent loading states
   * @default "base"
   */
  size?: LarkLoaderSize | number;
  /**
   * Accessible label for the loader, announced by screen readers.
   * Pass a translated string for internationalization.
   * @default "Loading"
   */
  "aria-label"?: string;
}

/**
 * Animated circular spinner for indicating loading states.
 *
 * @example
 * ```tsx
 * <Loader />
 * ```
 */
export const Loader = ({
  className,
  size = LARK_LOADER_DEFAULT_VARIANTS.size,
  "aria-label": ariaLabel = "Loading",
}: LoaderProps) => {
  const sizeValue = loaderVariants({ size });
  return (
    <svg
      width={sizeValue}
      height={sizeValue}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      // Feishu renders the spinner in the brand colour
      className={cn("text-lark-brand", className)}
      role="status"
      aria-label={ariaLabel}
    >
      <circle
        cx="12"
        cy="12"
        r="9.5"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-dasharray"
          values="0 150;42 150;42 150"
          keyTimes="0;0.5;1"
          dur="1.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-dashoffset"
          values="0;-16;-59"
          keyTimes="0;0.5;1"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        cx="12"
        cy="12"
        r="9.5"
        fill="none"
        opacity={0.1}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
