import { Meter as BaseMeter } from "@base-ui/react/meter";
import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../../utils/cn";

/** Meter variant definitions (currently empty, reserved for future additions). */
export const LARK_METER_VARIANTS = {
  // Meter currently has no variant options but structure is ready for future additions
} as const;

export const LARK_METER_DEFAULT_VARIANTS = {} as const;

// Derived types from LARK_METER_VARIANTS
export interface LarkMeterVariantsProps {}

export function meterVariants(_props: LarkMeterVariantsProps = {}) {
  return cn(
    // Base styles
    "flex w-full flex-col gap-2",
  );
}

type RootProps = ComponentPropsWithoutRef<typeof BaseMeter.Root>;

/**
 * Meter component props.
 *
 * @example
 * ```tsx
 * <Meter label="Storage used" value={65} />
 * <Meter label="API requests" value={75} customValue="750 / 1,000" />
 * ```
 */
export interface MeterProps extends RootProps, LarkMeterVariantsProps {
  /** Custom formatted value text (e.g. "750 / 1,000") displayed instead of percentage. */
  customValue?: string;
  /** Label text displayed above the meter track. */
  label: string;
  /**
   * Whether to display the percentage value next to the label.
   * @default true
   */
  showValue?: boolean;
  /** Additional CSS classes for the track (background bar). */
  trackClassName?: string;
  /** Additional CSS classes for the indicator (filled bar). */
  indicatorClassName?: string;
}

/**
 * Progress bar showing a measured value within a known range (e.g. quota usage).
 *
 * Styled after Feishu's `ud__progress--line`: a 4px rail with a pill radius
 * on the card border colour, filled with the brand colour, and 12px info text
 * above it.
 *
 * @example
 * ```tsx
 * <Meter label="Storage" value={65} />
 * ```
 */
export function Meter({
  value,
  customValue,
  label,
  showValue = true,
  className,
  trackClassName,
  indicatorClassName,
  ...props
}: MeterProps) {
  return (
    <BaseMeter.Root
      value={value}
      {...props}
      className={cn("flex w-full flex-col gap-2", className)}
    >
      <div className="flex items-center justify-between gap-4">
        <BaseMeter.Label className="text-xs text-lark-placeholder">
          {label}
        </BaseMeter.Label>
        {customValue ? (
          <span className="text-xs font-medium text-lark-default tabular-nums">
            {customValue}
          </span>
        ) : (
          <>
            {showValue && (
              <BaseMeter.Value className="text-xs font-medium text-lark-default tabular-nums" />
            )}
          </>
        )}
      </div>
      <BaseMeter.Track
        className={cn(
          "relative h-1 w-full overflow-hidden rounded-full bg-lark-line",
          trackClassName,
        )}
      >
        <BaseMeter.Indicator
          className={cn(
            "absolute inset-y-0 left-0 rounded-full bg-lark-brand transition-[width] duration-300 ease-out",
            indicatorClassName,
          )}
        />
      </BaseMeter.Track>
    </BaseMeter.Root>
  );
}
