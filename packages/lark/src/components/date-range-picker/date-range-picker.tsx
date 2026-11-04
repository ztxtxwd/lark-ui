import {
  CaretLeftIcon,
  CaretRightIcon,
  GlobeHemisphereWestIcon,
} from "../../icons/phosphor";
import { useCallback, useState } from "react";
import { cn } from "../../utils/cn";

/** DateRangePicker size and variant definitions mapping names to their Tailwind classes. */
export const LARK_DATE_RANGE_PICKER_VARIANTS = {
  size: {
    sm: {
      classes: "p-3 gap-2",
      cellHeight: "h-[22px]",
      cellWidth: "w-6",
      calendarWidth: "w-[168px]",
      textSize: "text-xs",
      iconSize: 14,
      description: "Compact calendar for tight spaces",
    },
    base: {
      classes: "p-4 gap-2.5",
      cellHeight: "h-[26px]",
      cellWidth: "w-7",
      calendarWidth: "w-[196px]",
      textSize: "text-sm",
      iconSize: 16,
      description: "Default calendar size",
    },
    lg: {
      classes: "p-5 gap-3",
      cellHeight: "h-[32px]",
      cellWidth: "w-9",
      calendarWidth: "w-[252px]",
      textSize: "text-base",
      iconSize: 18,
      description: "Large calendar for prominent date selection",
    },
  },
  variant: {
    default: {
      // Feishu floats the picker panel on `--bg-float`.
      classes: "bg-lark-elevated",
      description: "Default calendar appearance",
    },
    subtle: {
      classes: "bg-lark-base",
      description: "Subtle calendar with minimal background",
    },
  },
} as const;

export const LARK_DATE_RANGE_PICKER_DEFAULT_VARIANTS = {
  size: "base",
  variant: "default",
} as const;

// Derived types from LARK_DATE_RANGE_PICKER_VARIANTS
export type LarkDateRangePickerSize =
  keyof typeof LARK_DATE_RANGE_PICKER_VARIANTS.size;
export type LarkDateRangePickerVariant =
  keyof typeof LARK_DATE_RANGE_PICKER_VARIANTS.variant;

export interface LarkDateRangePickerVariantsProps {
  /**
   * Calendar size.
   * - `"sm"` — Compact calendar for tight spaces
   * - `"base"` — Default calendar size
   * - `"lg"` — Large calendar for prominent date selection
   * @default "base"
   */
  size?: LarkDateRangePickerSize;
  /**
   * Visual variant.
   * - `"default"` — Standard appearance with overlay background
   * - `"subtle"` — Minimal background
   * @default "default"
   */
  variant?: LarkDateRangePickerVariant;
}

export function dateRangePickerVariants({
  size = LARK_DATE_RANGE_PICKER_DEFAULT_VARIANTS.size,
  variant = LARK_DATE_RANGE_PICKER_DEFAULT_VARIANTS.variant,
}: LarkDateRangePickerVariantsProps = {}) {
  return cn(
    // Base styles
    "flex w-fit flex-col rounded-xl select-none",
    // Apply variant and size styles
    LARK_DATE_RANGE_PICKER_VARIANTS.variant[variant].classes,
    LARK_DATE_RANGE_PICKER_VARIANTS.size[size].classes,
  );
}

// Helper to get size config
function getSizeConfig(size: LarkDateRangePickerSize) {
  return LARK_DATE_RANGE_PICKER_VARIANTS.size[size];
}

enum DateRangeCellMode {
  OUT_OF_RANGE,
  ENABLED,
  SELECTED_START_NODE,
  SELECTED_END_NODE,
  SELECTED,
  SELECTED_OUT_OF_RANGE,
}

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

/**
 * DateRangePicker component props.
 *
 * Dual-calendar date range selector with hover preview, timezone display, and reset support.
 *
 * @example
 * ```tsx
 * <DateRangePicker
 *   onStartDateChange={(d) => setStart(d)}
 *   onEndDateChange={(d) => setEnd(d)}
 *   timezone="New York, NY, USA (GMT-4)"
 * />
 *
 * // Compact variant
 * <DateRangePicker
 *   size="sm"
 *   variant="subtle"
 *   onStartDateChange={setStart}
 *   onEndDateChange={setEnd}
 * />
 * ```
 *
 * @deprecated Use {@link DatePicker} with `mode="range"` instead.
 */
export interface DateRangePickerProps extends LarkDateRangePickerVariantsProps {
  /** Callback fired when start date changes. Receives `null` on reset. */
  onStartDateChange: (date: Date | null) => void;
  /** Callback fired when end date changes. Receives `null` on reset. */
  onEndDateChange: (date: Date | null) => void;
  /**
   * Display timezone string shown in the footer.
   * @default "New York, NY, USA (GMT-4)"
   */
  timezone?: string;
  /** Additional CSS classes merged via `cn()`. */
  className?: string;
}

/**
 * DateRangePicker — dual-calendar date range selector.
 *
 * Renders two side-by-side month calendars with click-to-select start/end dates,
 * hover preview of the range, a timezone footer, and a reset button.
 *
 * @example
 * ```tsx
 * <DateRangePicker
 *   onStartDateChange={setStart}
 *   onEndDateChange={setEnd}
 * />
 * ```
 *
 * @deprecated Use {@link DatePicker} with `mode="range"` instead.
 */
export function DateRangePicker({
  onStartDateChange,
  onEndDateChange,
  size = LARK_DATE_RANGE_PICKER_DEFAULT_VARIANTS.size,
  variant = LARK_DATE_RANGE_PICKER_DEFAULT_VARIANTS.variant,
  timezone = "New York, NY, USA (GMT-4)",
  className,
}: DateRangePickerProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [viewingMonth, setViewingMonth] = useState<Date>(new Date());
  const [hoveringDate, setHoveringDate] = useState<Date | null>(null);

  const sizeConfig = getSizeConfig(size);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    onStartDateChange(date); // Pass the updated startDate to the parent component
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    onEndDateChange(date); // Pass the updated endDate to the parent component
  };

  const getMonthName = useCallback((date: Date, monthOffset?: number) => {
    const copyDate = new Date(date);
    copyDate.setMonth(copyDate.getMonth() + (monthOffset || 0));
    return copyDate.toLocaleString("default", { month: "long" });
  }, []);

  const getDateYear = useCallback((date: Date, monthOffset?: number) => {
    const copyDate = new Date(date);
    copyDate.setMonth(copyDate.getMonth() + (monthOffset || 0));
    return copyDate.getFullYear();
  }, []);

  const getMonthsStartingDay = useCallback(
    (date: Date, monthOffset?: number) => {
      const copyDate = new Date(date);
      copyDate.setDate(1);
      copyDate.setMonth(copyDate.getMonth() + (monthOffset || 0));
      return copyDate.getDay();
    },
    [],
  );

  const getNumberOfDaysInMonth = useCallback(
    (date: Date, monthOffset?: number) => {
      const copyDate = new Date(date);
      copyDate.setDate(1);
      copyDate.setMonth(copyDate.getMonth() + (monthOffset || 0));
      copyDate.setMonth(copyDate.getMonth() + 1);
      copyDate.setDate(0);
      return copyDate.getDate();
    },
    [],
  );

  const adjustMonth = useCallback((monthOffset: number) => {
    setViewingMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + monthOffset);
      return newDate;
    });
  }, []);

  const getDateFromIndex = useCallback(
    (date: Date, monthOffset: number, index: number) => {
      const startingDay = getMonthsStartingDay(date, monthOffset);

      if (index < startingDay) {
        // Get the last day of the previous month
        const previousMonth = new Date(date);
        previousMonth.setMonth(previousMonth.getMonth() + monthOffset);
        previousMonth.setDate(1);
        previousMonth.setDate(previousMonth.getDate() - (startingDay - index));
        return previousMonth;
      } else if (
        index >
        getNumberOfDaysInMonth(date, monthOffset) + startingDay - 1
      ) {
        // Get the first day of the next month
        const nextMonth = new Date(date);
        nextMonth.setMonth(nextMonth.getMonth() + monthOffset);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextMonth.setDate(
          index - getNumberOfDaysInMonth(date, monthOffset) - startingDay + 1,
        );
        return nextMonth;
      } else {
        // Get the current month's date
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + monthOffset);
        newDate.setDate(index - startingDay + 1);
        return newDate;
      }
    },
    [getMonthsStartingDay, getNumberOfDaysInMonth],
  );

  const isDateEqual = useCallback((date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false;
    return date1.toDateString() === date2.toDateString();
  }, []);

  return (
    <div className={cn(dateRangePickerVariants({ size, variant }), className)}>
      <div className="flex gap-4">
        <div className={cn("relative", sizeConfig.calendarWidth)}>
          <button
            type="button"
            aria-label="Previous month"
            className="absolute top-0 left-0 cursor-pointer rounded-md p-1 text-lark-subtle transition-colors hover:text-lark-brand focus:outline-none focus-visible:text-lark-brand"
            onClick={() => adjustMonth(-1)}
          >
            <CaretLeftIcon size={sizeConfig.iconSize} />
          </button>

          <DateRangeMonthHeader
            month={getMonthName(viewingMonth)}
            year={getDateYear(viewingMonth)}
            size={size}
            updateCurrentMonth={(dateString) => {
              setViewingMonth(new Date(dateString));
            }}
          />

          <div className="grid grid-cols-7 gap-0 gap-y-0.5">
            {Array.from({ length: 42 }).map((_, index) => (
              <DateRangeDayCell
                key={index}
                date={getDateFromIndex(viewingMonth, 0, index)}
                size={size}
                mode={
                  // After current month range
                  (startDate &&
                    endDate &&
                    getDateFromIndex(viewingMonth, 0, index) >= startDate &&
                    getDateFromIndex(viewingMonth, 0, index) <= endDate &&
                    index >
                      getNumberOfDaysInMonth(viewingMonth, 0) +
                        getMonthsStartingDay(viewingMonth, 0) -
                        1) ||
                  // Before current month range
                  (startDate &&
                    endDate &&
                    getDateFromIndex(viewingMonth, 0, index) >= startDate &&
                    getDateFromIndex(viewingMonth, 0, index) <= endDate &&
                    index < getMonthsStartingDay(viewingMonth, 0))
                    ? DateRangeCellMode.SELECTED_OUT_OF_RANGE
                    : // Before current month range
                      index < getMonthsStartingDay(viewingMonth, 0)
                      ? DateRangeCellMode.OUT_OF_RANGE
                      : // After current month range
                        index >
                          getNumberOfDaysInMonth(viewingMonth, 0) +
                            getMonthsStartingDay(viewingMonth, 0) -
                            1
                        ? DateRangeCellMode.OUT_OF_RANGE
                        : // Selected start date
                          isDateEqual(
                              getDateFromIndex(viewingMonth, 0, index),
                              startDate,
                            )
                          ? DateRangeCellMode.SELECTED_START_NODE
                          : // Selected end date
                            isDateEqual(
                                getDateFromIndex(viewingMonth, 0, index),
                                endDate,
                              )
                            ? DateRangeCellMode.SELECTED_END_NODE
                            : // Selected date range
                              startDate &&
                                getDateFromIndex(viewingMonth, 0, index) >=
                                  startDate &&
                                endDate &&
                                getDateFromIndex(viewingMonth, 0, index) <=
                                  endDate
                              ? DateRangeCellMode.SELECTED
                              : // Hovering past a starting date and no end date selected
                                startDate &&
                                  !endDate &&
                                  hoveringDate &&
                                  hoveringDate > startDate &&
                                  getDateFromIndex(viewingMonth, 0, index) <=
                                    hoveringDate &&
                                  getDateFromIndex(viewingMonth, 0, index) >
                                    startDate
                                ? DateRangeCellMode.SELECTED
                                : // Default to enabled date
                                  DateRangeCellMode.ENABLED
                }
                onClick={(date) => {
                  if (!startDate || date < startDate) {
                    handleStartDateChange(date);
                    setHoveringDate(date);
                  } else {
                    handleEndDateChange(date);
                  }
                }}
                isHoveringDate={(date) => {
                  if (startDate && !endDate && date > startDate) {
                    setHoveringDate(date);
                  }
                }}
              />
            ))}
          </div>
        </div>
        <div className={cn("relative", sizeConfig.calendarWidth)}>
          <button
            type="button"
            aria-label="Next month"
            className="absolute top-0 right-0 cursor-pointer rounded-md p-1 text-lark-subtle transition-colors hover:text-lark-brand focus:outline-none focus-visible:text-lark-brand"
            onClick={() => adjustMonth(1)}
          >
            <CaretRightIcon size={sizeConfig.iconSize} />
          </button>

          <DateRangeMonthHeader
            month={getMonthName(viewingMonth, 1)}
            year={getDateYear(viewingMonth, 1)}
            size={size}
            updateCurrentMonth={(dateString) => {
              const date = new Date(dateString);
              date.setMonth(date.getMonth() - 1);
              setViewingMonth(date);
            }}
          />

          <div className="grid grid-cols-7 gap-0 gap-y-0.5">
            {Array.from({ length: 42 }).map((_, index) => (
              <DateRangeDayCell
                key={index}
                date={getDateFromIndex(viewingMonth, 1, index)}
                size={size}
                mode={
                  // After current month range
                  (startDate &&
                    endDate &&
                    getDateFromIndex(viewingMonth, 1, index) >= startDate &&
                    getDateFromIndex(viewingMonth, 1, index) <= endDate &&
                    index >
                      getNumberOfDaysInMonth(viewingMonth, 1) +
                        getMonthsStartingDay(viewingMonth, 1) -
                        1) ||
                  // Before current month range
                  (startDate &&
                    endDate &&
                    getDateFromIndex(viewingMonth, 1, index) >= startDate &&
                    getDateFromIndex(viewingMonth, 1, index) <= endDate &&
                    index < getMonthsStartingDay(viewingMonth, 1))
                    ? DateRangeCellMode.SELECTED_OUT_OF_RANGE
                    : // Before current month range
                      index < getMonthsStartingDay(viewingMonth, 1)
                      ? DateRangeCellMode.OUT_OF_RANGE
                      : // After current month range
                        index >
                          getNumberOfDaysInMonth(viewingMonth, 1) +
                            getMonthsStartingDay(viewingMonth, 1) -
                            1
                        ? DateRangeCellMode.OUT_OF_RANGE
                        : // Selected start date
                          isDateEqual(
                              getDateFromIndex(viewingMonth, 1, index),
                              startDate,
                            )
                          ? DateRangeCellMode.SELECTED_START_NODE
                          : // Selected end date
                            isDateEqual(
                                getDateFromIndex(viewingMonth, 1, index),
                                endDate,
                              )
                            ? DateRangeCellMode.SELECTED_END_NODE
                            : // Selected date range
                              startDate &&
                                getDateFromIndex(viewingMonth, 1, index) >=
                                  startDate &&
                                endDate &&
                                getDateFromIndex(viewingMonth, 1, index) <=
                                  endDate
                              ? DateRangeCellMode.SELECTED
                              : // Hovering past a starting date and no end date selected
                                startDate &&
                                  !endDate &&
                                  hoveringDate &&
                                  hoveringDate > startDate &&
                                  getDateFromIndex(viewingMonth, 1, index) <=
                                    hoveringDate &&
                                  getDateFromIndex(viewingMonth, 1, index) >
                                    startDate
                                ? DateRangeCellMode.SELECTED
                                : // Default to enabled date
                                  DateRangeCellMode.ENABLED
                }
                onClick={(date) => {
                  if (!startDate || date < startDate) {
                    handleStartDateChange(date);
                    setHoveringDate(date);
                  } else {
                    handleEndDateChange(date);
                  }
                }}
                isHoveringDate={(date) => {
                  if (startDate && !endDate && date > startDate) {
                    setHoveringDate(date);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <DateRangeFooter
        timezone={timezone}
        size={size}
        reset={() => {
          handleStartDateChange(null);
          handleEndDateChange(null);
        }}
      />
    </div>
  );
}

function DateRangeDayCell({
  date,
  mode,
  size = LARK_DATE_RANGE_PICKER_DEFAULT_VARIANTS.size,
  onClick,
  isHoveringDate,
}: {
  date: Date;
  mode?: DateRangeCellMode;
  size?: LarkDateRangePickerSize;
  onClick?: (date: Date) => void;
  isHoveringDate?: (date: Date) => void;
}) {
  const sizeConfig = getSizeConfig(size);

  const getDateNumberFromDate = useCallback((date: Date) => {
    return date.getDate();
  }, []);

  const getBackgroundColor = useCallback(() => {
    switch (mode) {
      case DateRangeCellMode.OUT_OF_RANGE:
        return "bg-transparent";
      case DateRangeCellMode.ENABLED:
        return "bg-transparent";
      // Feishu fills the two ends of a range with the brand colour.
      case DateRangeCellMode.SELECTED_START_NODE:
        return "!bg-lark-brand rounded-tl-[5px] rounded-bl-[5px]";
      case DateRangeCellMode.SELECTED_END_NODE:
        return "!bg-lark-brand rounded-tr-[5px] rounded-br-[5px]";
      // The band between the ends carries the brand tint.
      case DateRangeCellMode.SELECTED:
        return "bg-lark-brand-tint";
      case DateRangeCellMode.SELECTED_OUT_OF_RANGE:
        return "bg-lark-brand-tint";
    }
  }, [mode]);

  const getTextColor = useCallback(() => {
    switch (mode) {
      // Days from another month are as quiet as disabled ones.
      case DateRangeCellMode.OUT_OF_RANGE:
      case DateRangeCellMode.SELECTED_OUT_OF_RANGE:
        return "!text-lark-placeholder";
      case DateRangeCellMode.SELECTED_START_NODE:
      case DateRangeCellMode.SELECTED_END_NODE:
        return "!text-white";
      default:
        return "text-lark-default";
    }
  }, [mode]);

  const getAriaLabel = useCallback(() => {
    const dateStr = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    switch (mode) {
      case DateRangeCellMode.SELECTED_START_NODE:
        return `${dateStr}, selected as start date`;
      case DateRangeCellMode.SELECTED_END_NODE:
        return `${dateStr}, selected as end date`;
      case DateRangeCellMode.SELECTED:
        return `${dateStr}, within selected range`;
      default:
        return dateStr;
    }
  }, [date, mode]);

  return (
    <button
      type="button"
      aria-label={getAriaLabel()}
      id={date.toDateString()}
      className={cn(
        sizeConfig.cellHeight,
        sizeConfig.cellWidth,
        sizeConfig.textSize,
        // Feishu eases the day's colours over 200ms and nothing else.
        "cursor-pointer text-center text-lark-default transition-colors duration-200 ease-[cubic-bezier(0.34,0.69,0.1,1)]",
        `leading-[${sizeConfig.cellHeight.replace("h-[", "").replace("]", "")}]`,
        // Hovering a free day paints it with the brand tint. The days inside
        // a range keep the band, and the two ends keep the brand fill.
        mode === DateRangeCellMode.ENABLED ? "hover:bg-lark-brand-tint" : "",
        getBackgroundColor(),
        getTextColor(),
      )}
      onClick={() => onClick?.(date)}
      onMouseOver={() => isHoveringDate?.(date)}
      onFocus={() => isHoveringDate?.(date)}
    >
      {getDateNumberFromDate(date)}
    </button>
  );
}

function DateRangeMonthHeader({
  month,
  year,
  size = LARK_DATE_RANGE_PICKER_DEFAULT_VARIANTS.size,
  updateCurrentMonth,
}: {
  month?: string;
  year?: number;
  size?: LarkDateRangePickerSize;
  updateCurrentMonth?: (dateString: string) => void;
}) {
  const sizeConfig = getSizeConfig(size);

  return (
    <div>
      <div className="mb-3 text-center">
        <input
          key={`${month}-${year}`}
          aria-label="Edit month and year"
          defaultValue={`${month} ${year}`}
          className={cn(
            // Feishu's month title turns brand-coloured on hover and on
            // focus — it never draws a halo.
            "w-full rounded-md border-none bg-transparent py-1.5 text-center font-semibold text-lark-default transition-colors duration-200 hover:text-lark-brand focus:text-lark-brand focus:ring-1 focus:ring-lark-brand focus:outline-none",
            sizeConfig.textSize,
          )}
          onBlur={(e) => {
            if (e.currentTarget.value.length === 0) return;
            updateCurrentMonth?.(e.currentTarget.value);
          }}
        />
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className={cn(
              "h-[22px] text-center text-lark-subtle",
              sizeConfig.cellWidth,
              sizeConfig.textSize,
            )}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}

function DateRangeFooter({
  timezone,
  size = LARK_DATE_RANGE_PICKER_DEFAULT_VARIANTS.size,
  reset,
}: {
  timezone?: string;
  size?: LarkDateRangePickerSize;
  reset?: () => void;
}) {
  const sizeConfig = getSizeConfig(size);

  return (
    <div
      className={cn(
        // Feishu separates the footer with a card divider and pads it by
        // 12px.
        "flex items-center gap-2 border-t border-lark-line pt-3 text-lark-subtle",
        sizeConfig.textSize,
      )}
    >
      <GlobeHemisphereWestIcon size={sizeConfig.iconSize} />
      <span className="flex-1">Timezone: {timezone}</span>
      <button
        type="button"
        onClick={reset}
        className="cursor-pointer font-semibold text-lark-default underline underline-offset-2 transition-colors duration-200 hover:text-lark-brand focus:outline-none focus-visible:text-lark-brand"
      >
        Reset Dates
      </button>
    </div>
  );
}

// Default export for backwards compatibility
/**
 * @deprecated Use {@link DatePicker} with `mode="range"` instead.
 */
export default DateRangePicker;
