import {
  createSliderController,
  type NumberFormat,
  SliderControl,
  type SliderController,
  SliderIndicator,
  type SliderOptions,
  SliderThumb,
  SliderTrack,
  Slider as UiSlider,
} from "@ui-sdk/react/slider";
import { type ReactNode, useId, useMemo, useState } from "react";
import { cn } from "../../lib/cn";

export type SliderOrientation = "horizontal" | "vertical";

/**
 * Marks are keyed by value, like `{ 0: "0", 50: "50", 100: "100" }`.
 * Each label is also the accessible name of the mark button.
 */
export type SliderMarks = Record<number, ReactNode>;

type UiSliderOptions = SliderOptions<number | number[]>;

export type SliderProps = Omit<
  UiSliderOptions,
  "children" | "render" | "orientation" | "format" | "controller"
> & {
  /** The slider's axis. Vertical sliders grow upward. */
  orientation?: SliderOrientation;
  /** The lowest value. Defaults to 0. */
  min?: number;
  /** The highest value. Defaults to 100. */
  max?: number;
  /**
   * Values that show a tick label under the track. A press on a mark moves the
   * nearest thumb to that value.
   */
  marks?: SliderMarks;
  /** Shows the current value above the thumb while hovering, focusing or dragging. Defaults to true. */
  tooltip?: boolean;
  /** How the tooltip reads. It is also used for `aria-valuetext`. */
  formatValue?: (value: number) => string;
  /** `Intl.NumberFormat` options, or a function, forwarded to the thumb inputs. */
  format?: NumberFormat;
  /** Accessible names for a range's thumbs, from the lowest value to the highest. */
  thumbLabels?: readonly string[];
  /** Height of a vertical slider. Defaults to 128px. */
  height?: number | string;
  /** Label for the slider group. */
  "aria-label"?: string;
  /** Moves the slider from outside, for example from a paired number input. */
  controller?: SliderController<number | number[]>;
  className?: string;
};

const thumbClass = cn(
  "group/thumb absolute z-[1] box-border size-4 cursor-grab rounded-lark-full",
  "border border-solid border-lark-border bg-lark-float",
  "shadow-[0_2px_4px_var(--lark-fill-focus)]",
  "transition-[border-color,border-width,box-shadow] duration-100 ease-lark-linear",
  "hover:border-2 hover:border-lark-primary",
  "has-[:focus-visible]:border-2 has-[:focus-visible]:border-lark-primary",
  "has-[:focus-visible]:shadow-[0_0_0_4px_var(--lark-focus-ring),0_2px_4px_var(--lark-fill-focus)]",
  "data-[dragging]:cursor-grabbing data-[dragging]:border-2 data-[dragging]:border-lark-primary",
  "data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed",
  "data-[disabled]:border-lark-border-card data-[disabled]:shadow-none",
);

function percentOf(value: number, min: number, max: number) {
  if (max === min) return 0;
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

export function Slider({
  orientation = "horizontal",
  min = 0,
  max = 100,
  marks,
  tooltip = true,
  formatValue,
  format,
  thumbLabels,
  height,
  "aria-label": ariaLabel,
  controller,
  className,
  value,
  defaultValue,
  onValueChange,
  ...props
}: SliderProps) {
  const vertical = orientation === "vertical";
  const groupLabel = ariaLabel ?? "数值";
  const markId = useId();

  const [internalController] = useState(() => createSliderController<number | number[]>());
  const sliderController = controller ?? internalController;

  const supplied = value ?? defaultValue;
  const thumbCount = Array.isArray(supplied) ? Math.max(1, supplied.length) : 1;

  const [latest, setLatest] = useState<number | number[] | undefined>(value ?? defaultValue);
  const current = value ?? latest;

  const tooltipText = useMemo(() => {
    if (formatValue) return formatValue;
    if (typeof format === "function") return format;
    if (format) {
      const formatter = new Intl.NumberFormat(props.locale, format);
      return (next: number) => formatter.format(next);
    }
    return (next: number) => String(next);
  }, [formatValue, format, props.locale]);

  const isCovered = (mark: number) => {
    if (typeof current === "number") return mark <= current;
    if (Array.isArray(current)) {
      if (current.length < 2) return mark <= current[0];
      return mark >= Math.min(...current) && mark <= Math.max(...current);
    }
    return false;
  };

  const moveToMark = (mark: number) => {
    if (props.disabled || props.readOnly) return;
    const next = sliderController.getValue();
    if (Array.isArray(next)) {
      let nearest = 0;
      for (let index = 1; index < next.length; index += 1) {
        if (Math.abs(next[index] - mark) < Math.abs(next[nearest] - mark)) {
          nearest = index;
        }
      }
      const updated = [...next];
      updated[nearest] = mark;
      sliderController.setValue(updated);
      return;
    }
    sliderController.setValue(mark);
  };

  const markEntries = marks
    ? Object.entries(marks)
        .map(([raw, label]) => ({ mark: Number(raw), label }))
        .filter(({ mark }) => Number.isFinite(mark))
        .sort((first, second) => first.mark - second.mark)
    : [];

  return (
    <UiSlider
      {...props}
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      orientation={orientation}
      aria-label={ariaLabel}
      controller={sliderController}
      format={formatValue ?? format}
      onValueChange={(next, details) => {
        onValueChange?.(next, details);
        if (!details.canceled) {
          setLatest(next);
        }
      }}
      className={cn(
        "group/slider flex min-w-0 flex-col",
        vertical ? "inline-flex items-center" : "w-full",
        vertical && !height && "h-32",
        vertical && markEntries.length > 0 && "mr-10",
        className,
      )}
      style={vertical && height !== undefined ? { height } : undefined}
    >
      <div className={cn("relative", vertical ? "h-full w-5 px-2" : "w-full px-2")}>
        <SliderControl
          className={cn(
            "relative flex",
            vertical
              ? "h-full w-full justify-center data-[disabled]:cursor-not-allowed"
              : "h-5 w-full items-center data-[disabled]:cursor-not-allowed",
          )}
        >
          <SliderTrack
            className={cn(
              "relative rounded-lark-xs bg-lark-divider",
              "data-[disabled]:bg-lark-tag-fill",
              vertical ? "h-full w-1" : "h-1 w-full",
            )}
          >
            <SliderIndicator className="absolute rounded-lark-xs bg-lark-primary data-[disabled]:bg-lark-fill-disabled" />

            {Array.from({ length: thumbCount }, (_, index) => {
              const thumbLabel =
                thumbCount === 1
                  ? groupLabel
                  : (thumbLabels?.[index] ??
                    (index === 0
                      ? `${groupLabel}最小值`
                      : index === 1
                        ? `${groupLabel}最大值`
                        : `${groupLabel} ${index + 1}`));

              return (
                <SliderThumb
                  key={thumbLabel}
                  index={index}
                  aria-label={thumbLabel}
                  className={thumbClass}
                >
                  {(state) =>
                    tooltip ? (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "pointer-events-none absolute z-10 whitespace-nowrap rounded-lark-sm",
                          "bg-lark-tips px-2 py-0.5 text-lark-12 leading-5 text-lark-canvas",
                          "opacity-0 shadow-lark-2 transition-opacity duration-100 ease-lark-linear",
                          "group-hover/thumb:opacity-100 group-focus-within/thumb:opacity-100",
                          "group-data-[dragging]/thumb:opacity-100",
                          "group-data-[disabled]/thumb:hidden",
                          state.orientation === "vertical"
                            ? "top-1/2 right-full mr-2 -translate-y-1/2"
                            : "bottom-full left-1/2 mb-2 -translate-x-1/2",
                        )}
                      >
                        {tooltipText(state.thumbValue)}
                      </span>
                    ) : null
                  }
                </SliderThumb>
              );
            })}
          </SliderTrack>
        </SliderControl>

        {!vertical && markEntries.length > 0 ? (
          <div className="relative mt-1 h-4 w-full">
            {markEntries.map(({ mark, label }) => (
              <button
                key={mark}
                type="button"
                disabled={props.disabled}
                aria-disabled={props.readOnly || undefined}
                onClick={() => moveToMark(mark)}
                style={{ left: `${percentOf(mark, min, max)}%` }}
                className={cn(
                  "absolute top-0 -translate-x-1/2 cursor-pointer whitespace-nowrap rounded-lark-xs",
                  "px-0.5 pb-0.5 text-center text-lark-12 leading-[14px] text-lark-caption",
                  "outline-none transition-colors duration-100 ease-lark-linear",
                  "hover:text-lark-primary-content focus-visible:outline-solid",
                  "focus-visible:outline-2 focus-visible:outline-offset-2",
                  "focus-visible:outline-lark-primary",
                  "disabled:cursor-not-allowed disabled:text-lark-disabled",
                  props.readOnly && "cursor-default",
                  isCovered(mark) && "text-lark-title",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -top-[14px] left-1/2 size-2 -translate-x-1/2 -translate-y-1/2",
                    "rounded-lark-full border border-solid bg-lark-float",
                    isCovered(mark) ? "border-lark-primary" : "border-lark-border",
                    props.disabled && "border-lark-fill-disabled bg-lark-disabled-bg",
                  )}
                />
                {label}
              </button>
            ))}
          </div>
        ) : null}

        {vertical && markEntries.length > 0 ? (
          <div className="absolute inset-y-0 left-full ml-2 w-max">
            {markEntries.map(({ mark, label }) => (
              <button
                key={`${markId}-${mark}`}
                type="button"
                disabled={props.disabled}
                aria-disabled={props.readOnly || undefined}
                onClick={() => moveToMark(mark)}
                style={{ bottom: `${percentOf(mark, min, max)}%` }}
                className={cn(
                  "absolute left-0 translate-y-1/2 cursor-pointer whitespace-nowrap rounded-lark-xs",
                  "px-0.5 py-0.5 text-left text-lark-12 leading-[14px] text-lark-caption",
                  "outline-none transition-colors duration-100 ease-lark-linear",
                  "hover:text-lark-primary-content focus-visible:outline-solid",
                  "focus-visible:outline-2 focus-visible:outline-offset-2",
                  "focus-visible:outline-lark-primary",
                  "disabled:cursor-not-allowed disabled:text-lark-disabled",
                  props.readOnly && "cursor-default",
                  isCovered(mark) && "text-lark-title",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </UiSlider>
  );
}
