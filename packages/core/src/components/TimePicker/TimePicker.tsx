import {
  Popover as UiPopover,
  PopoverContent as UiPopoverContent,
  PopoverTitle as UiPopoverTitle,
  PopoverTrigger as UiPopoverTrigger,
} from "@ui-sdk/react/popover";
import {
  createTimeInputController,
  TimeInput,
  type TimeInputGranularity,
} from "@ui-sdk/react/time-input";
import {
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { XIcon } from "../../icons";
import { cn } from "../../lib/cn";

export type TimePickerSize = "sm" | "md" | "lg";
export type TimePickerParts = { hour: number; minute: number; second: number };

export type TimePickerChangeHandler = (value: string | null, details?: unknown) => void;

export type TimePickerProps = {
  /** Controlled value, always 24-hour: `"14:30"` or `"14:30:15"`. */
  value?: string | null;
  /** Initial value when uncontrolled. */
  defaultValue?: string | null;
  /** Called whenever the value changes, from typing or from the panel. */
  onChange?: TimePickerChangeHandler;
  /** Alias of `onChange`, matching the ui-sdk naming. */
  onValueChange?: TimePickerChangeHandler;
  /** `"HH:mm"` (default), `"HH:mm:ss"`, or a 12-hour pattern such as `"hh:mm A"`. */
  format?: string;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  minTime?: string;
  maxTime?: string;
  /** Greys out times the panel must not offer. */
  disabledTime?: (time: TimePickerParts) => boolean;
  size?: TimePickerSize;
  allowClear?: boolean;
  clearLabel?: string;
  disabled?: boolean;
  readOnly?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: ReactNode;
  hideLabel?: boolean;
  "aria-label"?: string;
  className?: string;
  contentClassName?: string;
  name?: string;
  required?: boolean;
  /** BCP 47 locale for the typed segments, separators and day periods. */
  locale?: string;
};

const triggerSize: Record<TimePickerSize, string> = {
  sm: "h-7 gap-1 pl-[7px] pr-[3px] text-lark-12",
  md: "h-8 gap-1.5 pl-[11px] pr-[3px] text-lark-14",
  lg: "h-10 gap-2 pl-[11px] pr-[3px] text-lark-16",
};

const clearIconSize: Record<TimePickerSize, number> = { sm: 10, md: 12, lg: 16 };

const triggerIconSize: Record<TimePickerSize, string> = {
  sm: "[&_svg]:size-3.5",
  md: "[&_svg]:size-4",
  lg: "[&_svg]:size-5",
};

const iconButtonClass = cn(
  "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-lark-sm",
  "border-0 bg-transparent p-0 text-lark-icon-3 transition-colors duration-100",
  "hover:bg-[var(--lark-fill-hover)] hover:text-lark-primary-content",
  "disabled:cursor-not-allowed disabled:text-lark-icon-disabled disabled:hover:bg-transparent",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
);

const panelClass = cn(
  "z-50 flex flex-col rounded-lark-lg border border-solid border-lark-border-card",
  "bg-lark-float p-0 text-lark-title shadow-lark-4 outline-none",
  "origin-(--transform-origin) transition-[opacity,scale] duration-200 ease-lark",
  "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
  "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
);

const optionClass = cn(
  "mx-[3px] my-px flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-lark-sm",
  "px-2 text-lark-14 leading-[22px] text-lark-title outline-none",
  "transition-colors duration-200 ease-lark",
  "hover:bg-[var(--lark-fill-hover)]",
  "aria-selected:text-lark-primary-content dark:aria-selected:text-lark-blue-300",
  "aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
  "focus-visible:ring-2 focus-visible:ring-lark-primary focus-visible:ring-inset",
);

const timeInputClass = cn(
  "flex min-w-0 flex-1 items-center text-inherit",
  "[&_[data-slot=time-input-segment]]:w-[2ch] [&_[data-slot=time-input-segment]]:min-w-0",
  "[&_[data-slot=time-input-segment]]:border-0 [&_[data-slot=time-input-segment]]:bg-transparent",
  "[&_[data-slot=time-input-segment]]:p-0 [&_[data-slot=time-input-segment]]:text-center",
  "[&_[data-slot=time-input-segment]]:text-inherit [&_[data-slot=time-input-segment]]:outline-none",
  "[&_[data-slot=time-input-segment]]:focus:bg-lark-primary-soft",
  "[&_[data-slot=time-input-segment]]:focus:text-lark-primary-content dark:[&_[data-slot=time-input-segment]]:focus:text-lark-blue-300",
  "[&_[data-slot=time-input-segment][data-empty]]:text-lark-caption",
  "[&_[data-slot=time-input-segment][data-type=literal]]:w-auto",
  "[&_[data-slot=time-input-segment][data-type=dayPeriod]]:w-[2.5em]",
  "data-[disabled]:cursor-not-allowed",
);

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function parseTimeValue(value: string | null | undefined): TimePickerParts | null {
  if (!value) {
    return null;
  }
  const match = /^\s*(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?\s*$/.exec(value);
  if (!match) {
    return null;
  }
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const second = match[3] === undefined ? 0 : Number(match[3]);
  if (hour > 23 || minute > 59 || second > 59) {
    return null;
  }
  return { hour, minute, second };
}

function formatTimeValue(parts: TimePickerParts, withSeconds: boolean): string {
  const base = `${pad(parts.hour)}:${pad(parts.minute)}`;
  return withSeconds ? `${base}:${pad(parts.second)}` : base;
}

function normalizeTimeValue(value: string | null | undefined, withSeconds: boolean): string | null {
  const parts = parseTimeValue(value);
  return parts ? formatTimeValue(parts, withSeconds) : null;
}

function secondsOfDay(parts: TimePickerParts, withSeconds: boolean): number {
  return parts.hour * 3600 + parts.minute * 60 + (withSeconds ? parts.second : 0);
}

function dayPeriodNames(locale: string): [string, string] {
  try {
    const formatter = new Intl.DateTimeFormat(locale, { hour: "numeric", hour12: true });
    const nameAt = (hour: number) =>
      formatter.formatToParts(new Date(2020, 0, 1, hour)).find((part) => part.type === "dayPeriod")
        ?.value ?? (hour < 12 ? "AM" : "PM");
    return [nameAt(9), nameAt(21)];
  } catch {
    return ["AM", "PM"];
  }
}

function rangeStep(stop: number, step: number): number[] {
  const safeStep = Math.max(1, Math.floor(step));
  const values: number[] = [];
  for (let value = 0; value < stop; value += safeStep) {
    values.push(value);
  }
  return values;
}

type TimeColumnProps = {
  label: string;
  values: number[];
  selected: number | null;
  formatValue: (value: number) => string;
  isDisabled: (value: number) => boolean;
  onSelect: (value: number) => void;
};

function TimeColumn({
  label,
  values,
  selected,
  formatValue,
  isDisabled,
  onSelect,
}: TimeColumnProps) {
  const selectedIndex = selected === null ? -1 : values.indexOf(selected);
  const [activeIndex, setActiveIndex] = useState(Math.max(selectedIndex, 0));
  const optionRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (selectedIndex >= 0) {
      setActiveIndex(selectedIndex);
      optionRefs.current[selectedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const moveTo = (index: number) => {
    const next = Math.max(0, Math.min(values.length - 1, index));
    setActiveIndex(next);
    optionRefs.current[next]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveTo(activeIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveTo(activeIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      moveTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      moveTo(values.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const value = values[activeIndex];
      if (value !== undefined && !isDisabled(value)) {
        onSelect(value);
      }
    }
  };

  return (
    <div className="flex min-w-0 flex-col">
      <span className="pt-[15px] pr-2 pb-[10px] pl-[11px] text-lark-14 leading-[22px] text-lark-title">
        {label}
      </span>
      <div
        role="listbox"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className="flex max-h-[240px] min-w-0 flex-col overflow-y-auto overscroll-contain pb-2"
      >
        {values.map((value, index) => {
          const disabled = isDisabled(value);
          return (
            <div
              key={value}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              role="option"
              aria-selected={value === selected}
              aria-disabled={disabled || undefined}
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={() => {
                setActiveIndex(index);
                if (!disabled) {
                  onSelect(value);
                }
              }}
              className={cn(optionClass, index === activeIndex && "outline-none")}
            >
              {formatValue(value)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M8 4.75V8l2.25 1.35"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * UD time picker. The field is a segmented input people can type into; the
 * clock button opens hour, minute, second and AM/PM columns that work with
 * pointer and arrow keys. Values are always 24-hour strings.
 */
export function TimePicker({
  value,
  defaultValue,
  onChange,
  onValueChange,
  format = "HH:mm",
  hourStep = 1,
  minuteStep = 1,
  secondStep = 1,
  minTime,
  maxTime,
  disabledTime,
  size = "md",
  allowClear = true,
  clearLabel = "清除",
  disabled = false,
  readOnly = false,
  open,
  defaultOpen = false,
  onOpenChange,
  label,
  hideLabel = false,
  "aria-label": ariaLabel,
  className,
  contentClassName,
  name,
  required = false,
  locale = "zh-CN",
}: TimePickerProps) {
  const labelId = useId();
  const controlRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // Read the field's box when the popup positions, so a panel that starts open
  // anchors to it too, before any re-render.
  const controlAnchor = useMemo(
    () => ({
      getBoundingClientRect: () =>
        controlRef.current?.getBoundingClientRect() ?? { x: 0, y: 0, width: 0, height: 0 },
    }),
    [],
  );
  const showSeconds = /s/i.test(format);
  const hour12 = /a/i.test(format) || (/h/.test(format) && !/H/.test(format));
  const granularity: TimeInputGranularity = showSeconds ? "second" : "minute";

  const controlledValue = value !== undefined;
  const [innerValue, setInnerValue] = useState<string | null>(() =>
    normalizeTimeValue(defaultValue, showSeconds),
  );
  const effectiveValue = controlledValue ? normalizeTimeValue(value, showSeconds) : innerValue;

  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const openControlled = open !== undefined;
  const isOpen = (openControlled ? open : innerOpen) && !disabled;

  useEffect(() => {
    if (disabled && !openControlled) {
      setInnerOpen(false);
    }
  }, [disabled, openControlled]);
  const [controller] = useState(() => createTimeInputController());

  const parts = parseTimeValue(effectiveValue);
  const baseParts: TimePickerParts = parts ?? { hour: 0, minute: 0, second: 0 };

  const minParts = parseTimeValue(minTime);
  const maxParts = parseTimeValue(maxTime);
  const minSeconds = minParts ? secondsOfDay(minParts, showSeconds) : null;
  const maxSeconds = maxParts ? secondsOfDay(maxParts, showSeconds) : null;

  const isTimeUnavailable = (candidate: TimePickerParts) => {
    const value = secondsOfDay(candidate, showSeconds);
    if (minSeconds !== null && value < minSeconds) {
      return true;
    }
    if (maxSeconds !== null && value > maxSeconds) {
      return true;
    }
    return disabledTime?.(candidate) ?? false;
  };

  // A column disables an option only when every time it can stand for falls
  // outside min/max, so e.g. hour 11 stays pickable when maxTime is 11:00.
  const isOutsideMinMax = (earliest: number, latest: number) =>
    (minSeconds !== null && latest < minSeconds) || (maxSeconds !== null && earliest > maxSeconds);

  const isHourOfDayDisabled = (hour: number) => {
    const earliest = secondsOfDay({ hour, minute: 0, second: 0 }, showSeconds);
    const latest = secondsOfDay({ hour, minute: 59, second: showSeconds ? 59 : 0 }, showSeconds);
    if (isOutsideMinMax(earliest, latest)) {
      return true;
    }
    return disabledTime?.({ ...baseParts, hour }) ?? false;
  };

  const isMinuteDisabled = (minute: number) => {
    const earliest = secondsOfDay({ ...baseParts, minute, second: 0 }, showSeconds);
    const latest = secondsOfDay(
      { ...baseParts, minute, second: showSeconds ? 59 : 0 },
      showSeconds,
    );
    if (isOutsideMinMax(earliest, latest)) {
      return true;
    }
    return disabledTime?.({ ...baseParts, minute }) ?? false;
  };

  const fireChange = (next: string | null, details?: unknown) => {
    onChange?.(next, details);
    onValueChange?.(next, details);
  };

  const partsOfDay = (seconds: number): TimePickerParts => ({
    hour: Math.floor(seconds / 3600),
    minute: Math.floor((seconds % 3600) / 60),
    second: seconds % 60,
  });

  // Picking an hour (or period) keeps the current minute, so it can land
  // outside min/max even though the hour itself was offered. Keep the closest
  // time inside the range instead of committing an unavailable time.
  const clampToRange = (candidate: TimePickerParts): TimePickerParts | null => {
    let seconds = secondsOfDay(candidate, showSeconds);
    let clamped = candidate;
    if (minSeconds !== null && seconds < minSeconds) {
      seconds = minSeconds;
      clamped = partsOfDay(seconds);
    }
    if (maxSeconds !== null && seconds > maxSeconds) {
      seconds = maxSeconds;
      clamped = partsOfDay(seconds);
    }
    return disabledTime?.(clamped) ? null : clamped;
  };

  const commitParts = (candidate: TimePickerParts) => {
    if (readOnly) {
      return;
    }
    const nextParts = clampToRange(candidate);
    if (!nextParts) {
      return;
    }
    const next = formatTimeValue(nextParts, showSeconds);
    if (next === effectiveValue) {
      return;
    }
    if (!controlledValue) {
      setInnerValue(next);
    }
    fireChange(next, { reason: "item-press" });
  };

  const handleInputValueChange = (next: string | null, details?: unknown) => {
    if (next === null) {
      if (!controlledValue) {
        setInnerValue(null);
      }
      fireChange(null, details);
      return;
    }
    const parsed = parseTimeValue(next);
    if (!parsed || isTimeUnavailable(parsed)) {
      controller.setValue(effectiveValue);
      return;
    }
    const normalized = formatTimeValue(parsed, showSeconds);
    if (normalized === effectiveValue) {
      return;
    }
    if (!controlledValue) {
      setInnerValue(normalized);
    }
    fireChange(normalized, details);
  };

  const handleClear = () => {
    if (disabled || readOnly) {
      return;
    }
    controller.clear();
    controller.focus();
  };

  const handleOpenChange = (next: boolean) => {
    if (!openControlled) {
      setInnerOpen(next);
    }
    onOpenChange?.(next);
  };

  const handleInputClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (disabled || isOpen) {
      return;
    }
    // UD's field is the trigger too: clicking it opens the panel. A click on
    // the separators or padding focuses the first segment, like the field.
    if (!(event.target as HTMLElement).closest("[data-slot=time-input-segment]")) {
      controlRef.current?.querySelector<HTMLElement>("[data-slot=time-input-segment]")?.focus();
    }
    handleOpenChange(true);
  };

  const initialFocus = () => {
    // Keep focus in the segment that opened the panel, so people can keep
    // typing; opening from the clock button focuses the column's tab stop.
    const active = document.activeElement;
    if (active instanceof HTMLElement && active.closest("[data-slot=time-input]")) {
      return active;
    }
    return contentRef.current?.querySelector<HTMLElement>('[role="option"][tabindex="0"]');
  };

  const displayHour = parts ? (hour12 ? parts.hour % 12 || 12 : parts.hour) : null;
  const displayPeriod = parts ? (parts.hour >= 12 ? 1 : 0) : null;

  const twelveHourValues = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].filter(
    (_, index) => index % Math.max(1, Math.floor(hourStep)) === 0,
  );
  const hourValues = hour12 ? twelveHourValues : rangeStep(24, hourStep);
  const minuteValues = rangeStep(60, minuteStep);
  const secondValues = rangeStep(60, secondStep);
  const periodLabels = dayPeriodNames(locale);

  const selectHour = (hour: number) => {
    if (hour12) {
      commitParts({ ...baseParts, hour: (hour % 12) + (displayPeriod === 1 ? 12 : 0) });
    } else {
      commitParts({ ...baseParts, hour });
    }
  };

  const selectPeriod = (period: number) => {
    const hourOfHalfDay = baseParts.hour % 12;
    commitParts({ ...baseParts, hour: hourOfHalfDay + (period === 1 ? 12 : 0) });
  };

  const isHourDisabled = (hour: number) => {
    if (hour12) {
      return isHourOfDayDisabled((hour % 12) + (displayPeriod === 1 ? 12 : 0));
    }
    return isHourOfDayDisabled(hour);
  };

  const isPeriodDisabled = (period: number) => {
    const start = period === 1 ? 12 : 0;
    const candidate = clampToRange({
      ...baseParts,
      hour: (baseParts.hour % 12) + start,
    });
    // Selecting a period keeps the hour of the half day, so it is only
    // available when that time (after clamping to min/max) stays in the
    // requested half of the day.
    return !candidate || candidate.hour < start || candidate.hour >= start + 12;
  };

  const inputName = ariaLabel ?? (typeof label === "string" ? label : undefined) ?? "时间";
  const triggerAriaLabel = `${inputName}，选择时间`;
  const hasValue = effectiveValue !== null;

  return (
    <div className={cn("flex min-w-0 flex-col gap-1", className)}>
      {label !== undefined && label !== null ? (
        <span
          id={labelId}
          className={hideLabel ? "sr-only" : "text-lark-14 leading-[22px] text-lark-title"}
        >
          {label}
        </span>
      ) : null}

      <UiPopover open={isOpen} onOpenChange={handleOpenChange} modal={false}>
        <div
          ref={controlRef}
          data-slot="time-picker-control"
          data-open={isOpen ? "" : undefined}
          data-disabled={disabled ? "" : undefined}
          className={cn(
            "flex w-full min-w-0 items-center rounded-lark-md border border-solid",
            "border-lark-border bg-lark-canvas text-lark-title",
            "transition-[border-color,background-color] duration-100 ease-lark-linear",
            "hover:border-lark-primary focus-within:border-lark-primary",
            "data-[open]:border-lark-primary",
            "[&:has([data-invalid])]:border-lark-danger",
            "[&:has([data-invalid])]:hover:border-lark-danger",
            "data-[disabled]:cursor-not-allowed data-[disabled]:border-lark-border",
            "data-[disabled]:bg-lark-disabled-bg data-[disabled]:text-lark-placeholder",
            "data-[disabled]:hover:border-lark-border",
            triggerSize[size],
          )}
        >
          <TimeInput
            aria-label={
              ariaLabel ?? (label === undefined || label === null ? inputName : undefined)
            }
            aria-labelledby={
              !ariaLabel && label !== undefined && label !== null ? labelId : undefined
            }
            value={effectiveValue}
            onValueChange={handleInputValueChange}
            onClick={handleInputClick}
            granularity={granularity}
            hourCycle={hour12 ? 12 : 24}
            min={minParts ? formatTimeValue(minParts, showSeconds) : undefined}
            max={maxParts ? formatTimeValue(maxParts, showSeconds) : undefined}
            locale={locale}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            name={name}
            controller={controller}
            className={timeInputClass}
          />

          {allowClear ? (
            hasValue ? (
              <button
                type="button"
                aria-label={clearLabel}
                onClick={handleClear}
                disabled={disabled || readOnly}
                className={iconButtonClass}
              >
                <XIcon size={clearIconSize[size]} />
              </button>
            ) : (
              <span aria-hidden="true" className="size-6 shrink-0" />
            )
          ) : null}

          <UiPopoverTrigger
            aria-label={triggerAriaLabel}
            disabled={disabled}
            className={cn(iconButtonClass, triggerIconSize[size])}
          >
            <ClockIcon />
          </UiPopoverTrigger>

          <UiPopoverContent
            // Anchor the panel to the field itself, so its left edge follows
            // the input's, rather than the 24px clock button at the end.
            anchor={controlAnchor}
            side="bottom"
            align="start"
            sideOffset={4}
            collisionPadding={8}
            initialFocus={initialFocus}
            className={cn(panelClass, contentClassName)}
          >
            <UiPopoverTitle className="sr-only">选择时间</UiPopoverTitle>
            <div ref={contentRef} className="flex items-start gap-0.5">
              {hour12 ? (
                <TimeColumn
                  label="上午/下午"
                  values={[0, 1]}
                  selected={displayPeriod}
                  formatValue={(period) => periodLabels[period]}
                  isDisabled={(period) => readOnly || isPeriodDisabled(period)}
                  onSelect={selectPeriod}
                />
              ) : null}
              <TimeColumn
                label="时"
                values={hourValues}
                selected={displayHour}
                formatValue={(hour) => pad(hour)}
                isDisabled={(hour) => readOnly || isHourDisabled(hour)}
                onSelect={selectHour}
              />
              <TimeColumn
                label="分"
                values={minuteValues}
                selected={parts?.minute ?? null}
                formatValue={(minute) => pad(minute)}
                isDisabled={(minute) => readOnly || isMinuteDisabled(minute)}
                onSelect={(minute) => commitParts({ ...baseParts, minute })}
              />
              {showSeconds ? (
                <TimeColumn
                  label="秒"
                  values={secondValues}
                  selected={parts?.second ?? null}
                  formatValue={(second) => pad(second)}
                  isDisabled={(second) => readOnly || isTimeUnavailable({ ...baseParts, second })}
                  onSelect={(second) => commitParts({ ...baseParts, second })}
                />
              ) : null}
            </div>
          </UiPopoverContent>
        </div>
      </UiPopover>
    </div>
  );
}
