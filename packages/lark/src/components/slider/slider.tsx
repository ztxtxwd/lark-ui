import { Slider as BaseSlider } from "@base-ui/react/slider";
import { type ReactNode } from "react";
import { cn } from "../../utils/cn";

/**
 * Feishu (`ud__slider`) metrics.
 *
 * The rail is 4px tall with a 2px radius, the filled track is brand
 * coloured, and the handle is a white circle with a 1px outline and a small
 * drop shadow. Hovering or dragging the handle swaps the outline for a 2px
 * brand-coloured one.
 */
const SLIDER_SIZE_STYLES = {
  sm: { thumb: "h-3 w-3" },
  base: { thumb: "h-4 w-4" },
} as const;

/** Slider size definitions mapping sizes to their track heights. */
export const LARK_SLIDER_VARIANTS = {
  size: {
    sm: {
      classes: "h-6",
      description: "Compact slider for dense layouts",
    },
    base: {
      classes: "h-8",
      description: "Default slider size",
    },
  },
} as const;

export const LARK_SLIDER_DEFAULT_VARIANTS = {
  size: "base",
} as const;

export type LarkSliderSize = keyof typeof LARK_SLIDER_VARIANTS.size;

export interface LarkSliderVariantsProps {
  /**
   * Height of the slider track.
   * - `"sm"` — Compact slider for dense layouts
   * - `"base"` — Default slider size
   * @default "base"
   */
  size?: LarkSliderSize;
}

export function sliderVariants({
  size = LARK_SLIDER_DEFAULT_VARIANTS.size,
}: LarkSliderVariantsProps = {}) {
  return cn("relative w-full", LARK_SLIDER_VARIANTS.size[size].classes);
}

type SliderValue = number | readonly number[];

/**
 * Slider component props.
 *
 * @example
 * ```tsx
 * <Slider label="Match count" defaultValue={2} max={5} />
 * <Slider label="Price" defaultValue={[25, 75]} />
 * ```
 */
export interface SliderProps<Value extends SliderValue = SliderValue>
  extends
    Omit<BaseSlider.Root.Props<Value>, "children" | "orientation">,
    LarkSliderVariantsProps {
  /** Label displayed above the slider track. */
  label?: ReactNode;
  /**
   * Accessible name for each thumb. Use it when there is no visible `label`,
   * or to tell the thumbs of a range slider apart.
   */
  getAriaLabel?: (index: number) => string;
}

function countThumbs(value: SliderValue | undefined) {
  return Array.isArray(value) ? value.length : 1;
}

/**
 * Lets people pick a number, or a range between two numbers, by dragging a
 * thumb along a track. Pass an array to `value` or `defaultValue` for a range.
 *
 * @example
 * ```tsx
 * <Slider label="Volume" defaultValue={40} />
 * ```
 */
export function Slider<Value extends SliderValue = SliderValue>({
  label,
  size = LARK_SLIDER_DEFAULT_VARIANTS.size,
  getAriaLabel,
  // Keeps the thumbs within the track at either end of the range.
  thumbAlignment = "edge",
  className,
  min = 0,
  max = 100,
  format,
  locale,
  value,
  defaultValue,
  disabled = false,
  ...props
}: SliderProps<Value>) {
  const thumbCount = countThumbs(value ?? defaultValue);
  const isRange = thumbCount > 1;
  const formatter = new Intl.NumberFormat(locale, format);
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <BaseSlider.Root
      {...props}
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      format={format}
      locale={locale}
      thumbAlignment={thumbAlignment}
      disabled={disabled}
      // The track, badges, and range labels are laid out for a horizontal slider only.
      orientation="horizontal"
      className={cn("flex w-full flex-col gap-2", className)}
    >
      {label ? (
        <BaseSlider.Label
          className={cn("font-medium text-lark-default", textSize)}
        >
          {label}
        </BaseSlider.Label>
      ) : null}
      {/* The rail lives on a wrapper rather than the control: Base UI
          positions edge-aligned thumbs as a percentage of the control's full
          width, so any control padding pushes them past the track ends. */}
      <div className={sliderVariants({ size })}>
        <BaseSlider.Control className="flex h-full w-full items-center">
          <BaseSlider.Track
            className={cn(
              "relative h-1 w-full rounded-xs",
              disabled ? "bg-lark-hairline" : "bg-lark-line",
            )}
          >
            <BaseSlider.Indicator
              className={cn(
                "h-full rounded-xs",
                disabled ? "bg-lark-border" : "bg-lark-brand",
              )}
            />
            {Array.from({ length: thumbCount }, (_, index) => (
              <BaseSlider.Thumb
                key={index}
                index={isRange ? index : undefined}
                getAriaLabel={getAriaLabel}
                className={cn(
                  // Feishu draws a white circle with a 1px outline; hovering or
                  // dragging it swaps the outline for a 2px brand-coloured one.
                  "group shrink-0 rounded-full ring outline-none ring-inset",
                  SLIDER_SIZE_STYLES[size].thumb,
                  disabled
                    ? // A disabled slider drops the handle shadow and mutes the
                      // outline, the rail and the filled track.
                      "cursor-no-drop bg-lark-elevated shadow-none ring-lark-line"
                    : "cursor-grab bg-lark-elevated shadow-lark-sm ring-lark-border hover:ring-2 hover:ring-lark-brand has-focus-visible:ring-2 has-focus-visible:ring-lark-brand data-dragging:ring-2 data-dragging:ring-lark-brand",
                  "data-dragging:cursor-grabbing",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-full left-1/2 mt-[11px] -translate-x-1/2 rounded px-1.5 font-medium whitespace-nowrap tabular-nums",
                    disabled
                      ? "bg-lark-fill text-lark-default"
                      : "bg-lark-contrast text-lark-inverse",
                    textSize,
                  )}
                >
                  <BaseSlider.Value>
                    {(formattedValues) => formattedValues[index]}
                  </BaseSlider.Value>
                </span>
              </BaseSlider.Thumb>
            ))}
          </BaseSlider.Track>
        </BaseSlider.Control>
      </div>
      <div
        aria-hidden
        className={cn(
          "flex justify-between text-lark-subtle tabular-nums",
          textSize,
        )}
      >
        <span>{formatter.format(min)}</span>
        <span>{formatter.format(max)}</span>
      </div>
    </BaseSlider.Root>
  );
}

Slider.displayName = "Slider";
