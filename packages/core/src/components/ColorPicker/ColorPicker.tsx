import {
  ColorPickerArea,
  ColorPickerAreaThumb,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSliderThumb,
  ColorPickerSwatch,
  ColorPickerSwatches,
  ColorPickerSwatchItem,
  type ColorPickerValueChangeDetails,
  ColorPicker as UiColorPicker,
} from "@ui-sdk/react/color-picker";
import {
  Popover as UiPopover,
  PopoverContent as UiPopoverContent,
  PopoverTitle as UiPopoverTitle,
  PopoverTrigger as UiPopoverTrigger,
} from "@ui-sdk/react/popover";
import { cva } from "class-variance-authority";
import { useState } from "react";
import { ChevronDownIcon, XIcon } from "../../icons";
import { cn } from "../../lib/cn";

export type ColorPickerSize = "sm" | "md";

export type ColorPickerProps = {
  /** The colour as a CSS colour string. Pass it to control the picker. */
  value?: string;
  /** The colour at first, when uncontrolled. */
  defaultValue?: string;
  /** Runs on every change. Receives `undefined` when the colour is cleared. */
  onChange?: (value: string | undefined) => void;
  /** Runs on every change with the ui-sdk change details, like the drag reason. */
  onValueChange?: (value: string, details: ColorPickerValueChangeDetails) => void;
  /** Quick colours shown as a grid. Each entry is any CSS colour. */
  presets?: string[];
  /** Shows the hex/CSS colour input in the panel. Defaults to true. */
  showInput?: boolean;
  /** Hides the alpha slider, so the colour stays opaque. */
  disabledAlpha?: boolean;
  /** Offers "取消颜色" in the panel and a clear button in the trigger. */
  allowClear?: boolean;
  /** Trigger height: 28px (sm) or 32px (md). Defaults to md. */
  size?: ColorPickerSize;
  /** Disables the trigger and every control in the panel. */
  disabled?: boolean;
  /** Text shown in the trigger when there is no colour. */
  placeholder?: string;
  /** Accessible name for the clear button. */
  clearLabel?: string;
  /** Accessible name for the preset list. */
  presetsLabel?: string;
  /** Accessible name for the colour input. */
  inputLabel?: string;
  /** Accessible name for the picker and the trigger. */
  "aria-label"?: string;
  className?: string;
  contentClassName?: string;
};

const triggerSizes = cva(
  cn(
    "group/color-picker relative flex w-full items-center gap-2 overflow-hidden text-left",
    "rounded-lark-md border border-solid border-lark-border bg-lark-canvas text-lark-title",
    "transition-[border-color,background-color] duration-100 ease-lark-linear",
    "hover:border-lark-primary focus-visible:border-lark-primary focus-visible:outline-none",
    "data-[open]:border-lark-primary",
    "data-[disabled]:cursor-not-allowed data-[disabled]:border-lark-border",
    "data-[disabled]:bg-lark-disabled-bg data-[disabled]:text-lark-placeholder",
    "data-[disabled]:hover:border-lark-border",
  ),
  {
    variants: {
      size: {
        sm: "h-7 gap-1.5 pr-2 pl-2 text-lark-12",
        md: "h-8 gap-2 pr-2.5 pl-2 text-lark-14",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const sliderTrackClass = cn(
  "relative h-3 min-w-0 flex-1 rounded-lark-xs",
  "[background:var(--color-slider-background)]",
);

const sliderThumbClass = cn(
  // UD hue pointer (client `.ud__color-picker-hue-pointer`): a 10 × 8 white
  // marker whose body hangs 6px below the 12px track, with a pentagonal peak
  // reaching into the track, as drawn in the design spec.
  "absolute -bottom-1.5 h-2 w-2.5 -translate-x-1/2 cursor-grab",
  // Client `--shadow-sm-down` is 0 2px 4px rgba(N900, 12%) in light mode;
  // `--lark-fill-focus` carries that exact colour and flips for dark mode.
  "rounded-b-[1px] bg-white shadow-[0_2px_4px_var(--lark-fill-focus)]",
  // Peak: a 7px square turned 45°, centred on the body's top edge, so its top
  // half reads as a pentagon with a rounded tip and shoulders.
  "before:absolute before:bottom-full before:left-1/2 before:size-[7px] before:content-['']",
  "before:-translate-x-1/2 before:translate-y-1/2 before:rotate-45 before:rounded-[1.5px] before:bg-white",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
  "data-[dragging]:cursor-grabbing",
);

const presetItemClass = cn(
  "relative size-[18px] cursor-pointer rounded-lark-sm border border-solid border-lark-border-card",
  "[background:var(--color-picker-color)] outline-none transition-shadow duration-100 ease-lark",
  "hover:shadow-[0_0_0_2px_var(--lark-primary-fill-loading)]",
  "focus-visible:shadow-[0_0_0_2px_var(--lark-primary-fill-default)]",
  "data-[selected]:shadow-[0_0_0_2px_var(--lark-primary-fill-default)]",
  "data-[disabled]:cursor-not-allowed",
);

/** The current colour, shown at the left of the trigger. */
const triggerSwatchClass = cn(
  "size-4 shrink-0 rounded-lark-sm border border-solid border-lark-border-card",
  "[background:var(--color-picker-color)]",
);

function displayColor(value: string | undefined) {
  if (!value) return undefined;
  return value.startsWith("#") ? value.toUpperCase() : value;
}

/**
 * UD colour picker. The trigger shows a swatch and the current value; the
 * popover holds a saturation/brightness area, hue and alpha sliders, an
 * optional hex input and an optional preset grid.
 */
export function ColorPicker({
  value,
  defaultValue,
  onChange,
  onValueChange,
  presets,
  showInput = true,
  disabledAlpha = false,
  allowClear = false,
  size = "md",
  disabled = false,
  placeholder = "选择颜色",
  clearLabel = "取消颜色",
  presetsLabel = "预设颜色",
  inputLabel = "十六进制色值",
  "aria-label": ariaLabel = "颜色选择器",
  className,
  contentClassName,
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const currentValue = value !== undefined ? value || undefined : internalValue;
  const shownValue = displayColor(currentValue);
  const hasValue = Boolean(currentValue);

  const handleValueChange = (next: string, details: ColorPickerValueChangeDetails) => {
    setInternalValue(next);
    onChange?.(next);
    onValueChange?.(next, details);
    // UD closes the picker as soon as a preset is chosen.
    if (details.reason === "item-press") {
      setOpen(false);
    }
  };

  const handleClear = () => {
    setInternalValue(undefined);
    onChange?.(undefined);
    setOpen(false);
  };

  return (
    <UiColorPicker
      aria-label={ariaLabel}
      value={currentValue ?? "#000000"}
      disabled={disabled}
      onValueChange={handleValueChange}
      className={cn("relative inline-flex w-[212px] max-w-full", className)}
    >
      <UiPopover open={open} onOpenChange={setOpen}>
        <div className="relative flex w-full">
          <UiPopoverTrigger
            aria-label={
              hasValue ? `${ariaLabel}，当前 ${shownValue}` : `${ariaLabel}，${placeholder}`
            }
            disabled={disabled}
            className={cn(
              triggerSizes({ size }),
              allowClear && hasValue && !disabled ? "pr-7" : undefined,
            )}
          >
            {hasValue ? (
              <ColorPickerSwatch aria-hidden="true" className={triggerSwatchClass} />
            ) : (
              <span
                aria-hidden="true"
                className="size-4 shrink-0 rounded-lark-sm border border-solid border-lark-border-card bg-lark-fill-disabled"
              />
            )}
            <span
              className={cn(
                "min-w-0 flex-1 truncate tabular-nums",
                hasValue ? "text-lark-title" : "text-lark-caption",
              )}
            >
              {shownValue ?? placeholder}
            </span>
            {!(allowClear && hasValue && !disabled) ? (
              <ChevronDownIcon
                size={16}
                className="pointer-events-none size-4 shrink-0 text-lark-icon-2 transition-transform duration-100 group-data-[open]/color-picker:rotate-180"
              />
            ) : null}
          </UiPopoverTrigger>

          {allowClear && hasValue && !disabled ? (
            <button
              type="button"
              aria-label={clearLabel}
              onClick={handleClear}
              className={cn(
                "absolute top-1/2 right-1.5 flex size-4 -translate-y-1/2 cursor-pointer items-center justify-center",
                "rounded-full text-lark-icon-3 transition-colors duration-100 ease-lark-linear",
                "hover:bg-[var(--lark-fill-hover)] hover:text-lark-primary-content",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
              )}
            >
              <XIcon size={12} />
            </button>
          ) : null}
        </div>

        <UiPopoverContent
          side="bottom"
          align="start"
          sideOffset={4}
          collisionPadding={16}
          className={cn(
            "z-50 flex w-[212px] flex-col rounded-lark-lg border border-solid border-lark-border-card",
            "bg-lark-float p-3 text-lark-title shadow-lark-4 outline-none",
            "origin-(--transform-origin) transition-[opacity,scale] duration-100 ease-lark",
            "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
            contentClassName,
          )}
        >
          <UiPopoverTitle className="sr-only">{ariaLabel}</UiPopoverTitle>

          <ColorPickerArea
            className={cn(
              // No `overflow-hidden`: the area clips the thumb, and its focus
              // outline, at the edges. The background follows the radius.
              "relative h-[120px] w-full cursor-crosshair rounded-lark-sm",
              "border border-solid border-lark-border-card",
              "[background:var(--color-area-background)]",
            )}
          >
            <ColorPickerAreaThumb
              aria-label="饱和度和亮度"
              className={cn(
                "absolute z-[2] size-3.5 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full",
                "border-2 border-solid border-white shadow-lark-2",
                "transition-[width,height] duration-200 ease-lark hover:size-[18px]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
                "data-[dragging]:cursor-grabbing",
              )}
            />
          </ColorPickerArea>

          <div className="mt-2 flex items-center gap-2">
            <ColorPickerSwatch
              aria-hidden="true"
              className="size-6 shrink-0 rounded-lark-sm border border-solid border-lark-border-card [background:var(--color-picker-color)]"
            />
            <ColorPickerSlider channel="hue" className={sliderTrackClass}>
              <ColorPickerSliderThumb aria-label="色相" className={sliderThumbClass} />
            </ColorPickerSlider>
          </div>

          {!disabledAlpha ? (
            <div className="mt-2 flex items-center gap-2">
              <span
                aria-hidden="true"
                className={cn(
                  "relative size-6 shrink-0 overflow-hidden rounded-lark-sm",
                  "border border-solid border-lark-border-card",
                  "bg-[repeating-conic-gradient(var(--lark-border-card)_0%_25%,var(--lark-bg-float)_0%_50%)]",
                  "[background-size:8px_8px]",
                )}
              >
                <ColorPickerSwatch
                  aria-hidden="true"
                  className="absolute inset-0 block [background:var(--color-picker-color)]"
                />
              </span>
              <ColorPickerSlider channel="alpha" className={sliderTrackClass}>
                <ColorPickerSliderThumb aria-label="不透明度" className={sliderThumbClass} />
              </ColorPickerSlider>
            </div>
          ) : null}

          {showInput ? (
            <label className="mt-2 flex flex-col gap-0.5">
              <span className="text-[10px] leading-[14px] font-semibold text-lark-caption">
                HEX
              </span>
              <ColorPickerInput
                aria-label={inputLabel}
                className={cn(
                  "h-6 w-full rounded-lark-sm border border-solid border-lark-border-card",
                  "bg-transparent px-1.5 text-center text-lark-12 text-lark-title outline-none",
                  "transition-colors duration-100 ease-lark-linear focus:border-lark-primary",
                )}
              />
            </label>
          ) : null}

          {presets && presets.length > 0 ? (
            <ColorPickerSwatches aria-label={presetsLabel} className="mt-3 grid grid-cols-7 gap-2">
              {presets.map((preset) => (
                <ColorPickerSwatchItem
                  key={preset}
                  value={preset}
                  aria-label={preset}
                  // UD collapses the picker as soon as a preset is chosen,
                  // including the preset that is already selected.
                  onClick={() => setOpen(false)}
                  className={presetItemClass}
                />
              ))}
            </ColorPickerSwatches>
          ) : null}

          {allowClear ? (
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                "mt-3 flex w-full cursor-pointer items-center gap-1.5 border-t border-solid border-lark-divider pt-2",
                "text-left text-lark-12 text-lark-caption transition-colors duration-100 ease-lark-linear",
                "hover:text-lark-title focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
              )}
            >
              <XIcon size={14} />
              {clearLabel}
            </button>
          ) : null}
        </UiPopoverContent>
      </UiPopover>
    </UiColorPicker>
  );
}
