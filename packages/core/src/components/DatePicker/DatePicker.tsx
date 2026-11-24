import {
  CalendarDay,
  CalendarGrid,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
  CalendarWeekday,
  CalendarWeekdays,
  CalendarWeeks,
  createDatePickerController,
  DatePickerContent,
  DatePickerPreset,
  DatePickerTrigger,
  DatePicker as UiDatePicker,
  type DatePickerValue as UiDatePickerValue,
} from "@ui-sdk/react/date-picker";
import { type KeyboardEvent, type ReactNode, useId, useMemo, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "../../icons";
import { cn } from "../../lib/cn";

export type DatePickerSize = "sm" | "md" | "lg";
export type DatePickerMode = "single" | "range";
export type DatePickerDateInput = Date | string;
export type DatePickerRangeInput = [DatePickerDateInput | null, DatePickerDateInput | null];

export type DatePickerChangeValue = Date | [Date, Date] | null;
export type DatePickerChangeString = string | [string, string] | null;

export type DatePickerChangeHandler = (
  value: DatePickerChangeValue,
  valueString: DatePickerChangeString,
  details?: unknown,
) => void;

export type DatePickerProps = {
  /** Select one date or a start/end range. */
  mode?: DatePickerMode;
  /** Controlled value. Strings are read with `valueFormat`. */
  value?: DatePickerDateInput | DatePickerRangeInput | null;
  /** Initial value when uncontrolled. Strings are read with `valueFormat`. */
  defaultValue?: DatePickerDateInput | DatePickerRangeInput | null;
  /** Called with `Date` objects and with strings formatted by `valueFormat`. */
  onChange?: DatePickerChangeHandler;
  /** Alias of `onChange`, matching the ui-sdk naming. */
  onValueChange?: DatePickerChangeHandler;
  /** Format used for string values and for the callback's second argument. */
  valueFormat?: string;
  /** Format shown in and parsed from the text field. */
  format?: string;
  min?: DatePickerDateInput;
  max?: DatePickerDateInput;
  /** Marks a day as unavailable; it stays focusable but can't be picked. */
  disabledDate?: (date: Date) => boolean;
  placeholder?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  size?: DatePickerSize;
  allowClear?: boolean;
  clearLabel?: string;
  disabled?: boolean;
  readOnly?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Adds a footer bar. `true` renders the UD Today/Clear pair. */
  footer?: boolean | ReactNode;
  todayLabel?: string;
  label?: ReactNode;
  hideLabel?: boolean;
  "aria-label"?: string;
  className?: string;
  contentClassName?: string;
  name?: string;
  startName?: string;
  endName?: string;
  required?: boolean;
  /** BCP 47 locale for month, weekday and day labels. */
  locale?: string;
};

const DEFAULT_VALUE_FORMAT = "YYYY-MM-DD";
const DEFAULT_DISPLAY_FORMAT = "YYYY/MM/DD";

const triggerSize: Record<DatePickerSize, string> = {
  sm: "h-7 gap-1 pl-[7px] pr-[3px] text-lark-12",
  md: "h-8 gap-1.5 pl-[11px] pr-[3px] text-lark-14",
  lg: "h-10 gap-2 pl-[11px] pr-[3px] text-lark-16",
};

const clearIconSize: Record<DatePickerSize, number> = { sm: 10, md: 12, lg: 16 };

const triggerIconSize: Record<DatePickerSize, string> = {
  sm: "[&_svg]:size-3.5",
  md: "[&_svg]:size-4",
  lg: "[&_svg]:size-5",
};

const navButtonClass = cn(
  "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-lark-sm",
  "border-0 bg-transparent p-0 text-lark-icon-2 transition-colors duration-100",
  "hover:bg-[var(--lark-fill-hover)] hover:text-lark-title",
  "data-[disabled]:cursor-not-allowed data-[disabled]:text-lark-icon-disabled",
  "data-[disabled]:hover:bg-transparent",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
);

const iconButtonClass = cn(
  "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-lark-sm",
  "border-0 bg-transparent p-0 text-lark-icon-3 transition-colors duration-100",
  "hover:bg-[var(--lark-fill-hover)] hover:text-lark-primary-content",
  "disabled:cursor-not-allowed disabled:text-lark-icon-disabled disabled:hover:bg-transparent",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
);

const footerButtonClass = cn(
  "inline-flex h-7 cursor-pointer items-center justify-center rounded-lark-sm border-0 bg-transparent px-2",
  "text-lark-14 leading-[22px] text-lark-primary-content transition-colors duration-100 dark:text-lark-blue-300",
  "hover:bg-[var(--lark-fill-hover)]",
  "data-[disabled]:cursor-not-allowed data-[disabled]:text-lark-disabled data-[disabled]:hover:bg-transparent",
  "disabled:cursor-not-allowed disabled:text-lark-disabled disabled:hover:bg-transparent",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
);

const panelClass = cn(
  "z-50 flex w-max flex-col rounded-lark-lg border border-solid border-lark-border-card",
  "bg-lark-float p-[15px] text-lark-title shadow-lark-4 outline-none",
  "origin-(--transform-origin) transition-[opacity,scale] duration-200 ease-lark",
  "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
  "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
);

type DateParts = { year: number; month: number; day: number };
type FormatToken = { token?: "YYYY" | "YY" | "MM" | "M" | "DD" | "D"; literal?: string };

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function partsToDate({ year, month, day }: DateParts): Date | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

function dateToParts(date: Date): DateParts {
  return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
}

function dateToISO(date: Date): string | null {
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  const { year, month, day } = dateToParts(date);
  return `${String(year).padStart(4, "0")}-${pad(month)}-${pad(day)}`;
}

function isoToDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) {
    return null;
  }
  return partsToDate({
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  });
}

function tokenizeFormat(format: string): FormatToken[] {
  const tokens: FormatToken[] = [];
  const names = ["YYYY", "YY", "MM", "M", "DD", "D"] as const;
  let index = 0;
  while (index < format.length) {
    const token = names.find((name) => format.startsWith(name, index));
    if (token) {
      tokens.push({ token });
      index += token.length;
    } else {
      tokens.push({ literal: format[index] });
      index += 1;
    }
  }
  return tokens;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatDateParts(date: Date, format: string): string {
  const parts = dateToParts(date);
  return tokenizeFormat(format)
    .map(({ token, literal }) => {
      switch (token) {
        case "YYYY":
          return String(parts.year).padStart(4, "0");
        case "YY":
          return pad(parts.year % 100);
        case "MM":
          return pad(parts.month);
        case "M":
          return String(parts.month);
        case "DD":
          return pad(parts.day);
        case "D":
          return String(parts.day);
        default:
          return literal ?? "";
      }
    })
    .join("");
}

function parseWithFormat(text: string, format: string): Date | null {
  const tokens = tokenizeFormat(format);
  let pattern = "^\\s*";
  const order: Array<"year" | "month" | "day"> = [];
  for (const { token, literal } of tokens) {
    if (!token) {
      pattern += escapeRegExp(literal ?? "");
      continue;
    }
    if (token === "YYYY") {
      pattern += "(\\d{4})";
      order.push("year");
    } else if (token === "YY") {
      pattern += "(\\d{2})";
      order.push("year");
    } else if (token === "MM" || token === "M") {
      pattern += "(\\d{1,2})";
      order.push("month");
    } else {
      pattern += "(\\d{1,2})";
      order.push("day");
    }
  }
  pattern += "\\s*$";
  const match = new RegExp(pattern).exec(text);
  if (!match) {
    return null;
  }
  const values: Partial<Record<"year" | "month" | "day", number>> = {};
  order.forEach((part, index) => {
    const value = Number(match[index + 1]);
    values[part] = part === "year" && value < 100 ? 2000 + value : value;
  });
  if (values.year === undefined || values.month === undefined || values.day === undefined) {
    return null;
  }
  return partsToDate({ year: values.year, month: values.month, day: values.day });
}

function parseDateText(text: string, formats: string[]): Date | null {
  const seen = new Set<string>();
  for (const format of formats) {
    if (seen.has(format)) {
      continue;
    }
    seen.add(format);
    const parsed = parseWithFormat(text, format);
    if (parsed) {
      return parsed;
    }
  }
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(text.trim());
  if (iso) {
    return partsToDate({
      year: Number(iso[1]),
      month: Number(iso[2]),
      day: Number(iso[3]),
    });
  }
  const numbers = text.match(/\d+/g);
  // The loose fallback accepts another separator, but never letters or other
  // words: UD treats text that is not a date in a known format as invalid.
  if (numbers?.length === 3 && !/[a-z]/i.test(text)) {
    const order: Array<"Y" | "M" | "D"> = [];
    for (const entry of tokenizeFormat(formats[0] ?? DEFAULT_DISPLAY_FORMAT)) {
      if (!entry.token) {
        continue;
      }
      if (entry.token.startsWith("Y")) {
        order.push("Y");
      } else if (entry.token.startsWith("M")) {
        order.push("M");
      } else {
        order.push("D");
      }
    }
    const mapped: Partial<Record<"Y" | "M" | "D", number>> = {};
    order.forEach((part, index) => {
      if (mapped[part] === undefined) {
        mapped[part] = Number(numbers[index]);
      }
    });
    if (mapped.Y !== undefined && mapped.M !== undefined && mapped.D !== undefined) {
      return partsToDate({
        year: mapped.Y < 100 ? 2000 + mapped.Y : mapped.Y,
        month: mapped.M,
        day: mapped.D,
      });
    }
  }
  return null;
}

function normalizeDateInput(
  value: DatePickerDateInput | null | undefined,
  valueFormat: string,
): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (value instanceof Date) {
    return dateToISO(value);
  }
  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }
  const parsed = parseDateText(value, [valueFormat, DEFAULT_VALUE_FORMAT, DEFAULT_DISPLAY_FORMAT]);
  return parsed ? dateToISO(parsed) : null;
}

function normalizeValue(
  value: DatePickerProps["value"],
  mode: DatePickerMode,
  valueFormat: string,
): UiDatePickerValue {
  if (mode === "single") {
    return normalizeDateInput(value as DatePickerDateInput | null | undefined, valueFormat);
  }
  if (!Array.isArray(value)) {
    return null;
  }
  const start = normalizeDateInput(value[0], valueFormat);
  const end = normalizeDateInput(value[1], valueFormat);
  if (!start || !end) {
    return null;
  }
  return start <= end ? [start, end] : [end, start];
}

function formatISO(iso: string, valueFormat: string): string {
  const date = isoToDate(iso);
  return date ? formatDateParts(date, valueFormat) : iso;
}

function toChangeValue(iso: UiDatePickerValue): DatePickerChangeValue {
  if (iso === null) {
    return null;
  }
  if (Array.isArray(iso)) {
    const start = isoToDate(iso[0]);
    const end = isoToDate(iso[1]);
    return start && end ? [start, end] : null;
  }
  return isoToDate(iso);
}

function toChangeString(iso: UiDatePickerValue, valueFormat: string): DatePickerChangeString {
  if (iso === null) {
    return null;
  }
  if (Array.isArray(iso)) {
    return [formatISO(iso[0], valueFormat), formatISO(iso[1], valueFormat)];
  }
  return formatISO(iso, valueFormat);
}

function todayISO(): string {
  return dateToISO(new Date()) ?? "";
}

/**
 * UD date picker: an Input-sized trigger with a calendar popup, single date or
 * range. Values go in and out as `Date` objects; string values and the second
 * callback argument use `valueFormat`, while `format` controls the text field.
 */
export function DatePicker({
  mode = "single",
  value,
  defaultValue,
  onChange,
  onValueChange,
  valueFormat = DEFAULT_VALUE_FORMAT,
  format = DEFAULT_DISPLAY_FORMAT,
  min,
  max,
  disabledDate,
  placeholder = "请选择日期",
  startPlaceholder = "开始日期",
  endPlaceholder = "结束日期",
  size = "md",
  allowClear = true,
  clearLabel = "清除",
  disabled = false,
  readOnly = false,
  open,
  defaultOpen = false,
  onOpenChange,
  footer = false,
  todayLabel = "今天",
  label,
  hideLabel = false,
  "aria-label": ariaLabel,
  className,
  contentClassName,
  name,
  startName,
  endName,
  required = false,
  locale = "zh-CN",
}: DatePickerProps) {
  const labelId = useId();
  const startInputId = useId();
  const endInputId = useId();
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);
  // Read the field's box when the popup positions, so a panel that starts open
  // anchors to it too, before any re-render.
  const controlAnchor = useMemo(
    () => ({
      getBoundingClientRect: () =>
        controlRef.current?.getBoundingClientRect() ?? { x: 0, y: 0, width: 0, height: 0 },
    }),
    [],
  );
  const [controller] = useState(() => createDatePickerController());
  // ui-sdk's day label follows the locale's `day: "numeric"` pattern, which is
  // "16日" in zh-CN. UD shows only the number in the cell, while the day's
  // `aria-label` keeps the full date for assistive technology.
  const dayNumberFormat = useMemo(
    () => new Intl.NumberFormat(locale, { useGrouping: false }),
    [locale],
  );

  const controlledValue = value !== undefined;
  const initialISO = normalizeValue(defaultValue, mode, valueFormat);
  const [innerISO, setInnerISO] = useState<UiDatePickerValue>(initialISO);
  const effectiveISO = controlledValue ? normalizeValue(value, mode, valueFormat) : innerISO;

  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const openControlled = open !== undefined;
  const isOpen = openControlled ? open : innerOpen;

  const [draftStart, setDraftStart] = useState<string | null>(null);
  const [draftEnd, setDraftEnd] = useState<string | null>(null);

  const minISO = normalizeDateInput(min, valueFormat);
  const maxISO = normalizeDateInput(max, valueFormat);
  const today = todayISO();
  const unavailable = useMemo(
    () => (disabledDate ? (iso: string) => disabledDate(isoToDate(iso) as Date) : undefined),
    [disabledDate],
  );

  const singleISO = mode === "single" && typeof effectiveISO === "string" ? effectiveISO : null;
  const rangeISO =
    mode === "range" && Array.isArray(effectiveISO) ? (effectiveISO as [string, string]) : null;

  const currentStart = rangeISO
    ? formatDateParts(isoToDate(rangeISO[0]) as Date, format)
    : singleISO
      ? formatDateParts(isoToDate(singleISO) as Date, format)
      : "";
  const currentEnd = rangeISO ? formatDateParts(isoToDate(rangeISO[1]) as Date, format) : "";

  const startText = draftStart ?? currentStart;
  const endText = draftEnd ?? currentEnd;
  const hasValue = Array.isArray(effectiveISO) ? effectiveISO.length === 2 : effectiveISO !== null;

  const labelText = typeof label === "string" ? label : undefined;
  const nameBase = ariaLabel ?? labelText;
  const inputLabel = nameBase ?? (mode === "range" ? "日期范围" : "日期");
  // A rendered label already names the start input through its `htmlFor`, so
  // only add a second name when it is a string we can extend.
  const startAriaLabel = nameBase
    ? mode === "range"
      ? `${nameBase} 开始`
      : nameBase
    : label !== undefined && label !== null
      ? undefined
      : mode === "range"
        ? "日期 开始"
        : "日期";
  const endAriaLabel = nameBase ? `${nameBase} 结束` : "结束日期";
  const triggerAriaLabel =
    mode === "range" ? `${inputLabel}，选择日期范围` : `${inputLabel}，选择日期`;

  const isAllowed = (date: Date) => {
    const iso = dateToISO(date);
    if (!iso) {
      return false;
    }
    if (minISO && iso < minISO) {
      return false;
    }
    if (maxISO && iso > maxISO) {
      return false;
    }
    return !disabledDate?.(date);
  };

  const fireChange = (iso: UiDatePickerValue, details?: unknown) => {
    const nextValue = toChangeValue(iso);
    const nextString = toChangeString(iso, valueFormat);
    onChange?.(nextValue, nextString, details);
    onValueChange?.(nextValue, nextString, details);
  };

  const commitISO = (iso: UiDatePickerValue, details?: unknown) => {
    if (JSON.stringify(iso) === JSON.stringify(effectiveISO)) {
      setDraftStart(null);
      setDraftEnd(null);
      return;
    }
    if (!controlledValue) {
      setInnerISO(iso);
    }
    fireChange(iso, details);
  };

  const handleRootValueChange = (next: UiDatePickerValue, details: unknown) => {
    setDraftStart(null);
    setDraftEnd(null);
    commitISO(next, details);
  };

  const handleOpenChange = (next: boolean) => {
    if (!openControlled) {
      setInnerOpen(next);
    }
    onOpenChange?.(next);
  };

  const handleInputClick = () => {
    if (disabled || isOpen) {
      return;
    }
    // UD's default trigger is the whole field, so clicking the input opens the
    // calendar instead of only letting people type into it.
    controller.open({ reason: "trigger-press" });
  };

  const commitSingle = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setDraftStart(null);
      commitISO(null);
      return;
    }
    const parsed = parseDateText(trimmed, [format, valueFormat]);
    if (!parsed || !isAllowed(parsed)) {
      setDraftStart(null);
      return;
    }
    setDraftStart(null);
    commitISO(dateToISO(parsed));
  };

  const commitRange = (field: "start" | "end") => {
    // Both visible fields take part in the range, including drafts typed into
    // the field that is not being committed.
    const startValue = startText;
    const endValue = endText;
    const startParsed = startValue.trim()
      ? parseDateText(startValue.trim(), [format, valueFormat])
      : null;
    const endParsed = endValue.trim()
      ? parseDateText(endValue.trim(), [format, valueFormat])
      : null;

    if (!startValue.trim() && !endValue.trim()) {
      setDraftStart(null);
      setDraftEnd(null);
      commitISO(null);
      return;
    }
    if (!startParsed || !endParsed) {
      if (
        (field === "start" && startValue.trim() && !startParsed) ||
        (field === "end" && endValue.trim() && !endParsed)
      ) {
        if (field === "start") {
          setDraftStart(null);
        } else {
          setDraftEnd(null);
        }
      }
      return;
    }
    if (!isAllowed(startParsed) || !isAllowed(endParsed)) {
      setDraftStart(null);
      setDraftEnd(null);
      return;
    }
    const start = dateToISO(startParsed) as string;
    const end = dateToISO(endParsed) as string;
    setDraftStart(null);
    setDraftEnd(null);
    commitISO(start <= end ? [start, end] : [end, start]);
  };

  const handleClear = () => {
    if (disabled || readOnly) {
      return;
    }
    setDraftStart(null);
    setDraftEnd(null);
    controller.clear();
    startRef.current?.focus();
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (mode === "single") {
        commitSingle(startText);
      } else {
        commitRange("start");
      }
    } else if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      controller.close();
    } else if (event.altKey && event.key === "ArrowDown") {
      event.preventDefault();
      controller.open();
    }
  };

  const footerContent =
    footer === true ? (
      <>
        <DatePickerPreset
          value={mode === "range" ? [today, today] : today}
          className={footerButtonClass}
        >
          {todayLabel}
        </DatePickerPreset>
        <button
          type="button"
          className={footerButtonClass}
          onClick={handleClear}
          disabled={disabled || readOnly || !hasValue}
        >
          {clearLabel}
        </button>
      </>
    ) : (
      footer
    );

  return (
    <UiDatePicker
      mode={mode}
      value={effectiveISO}
      onValueChange={handleRootValueChange}
      open={isOpen}
      onOpenChange={handleOpenChange}
      min={minISO ?? undefined}
      max={maxISO ?? undefined}
      unavailable={unavailable}
      disabled={disabled}
      readOnly={readOnly}
      months={mode === "range" ? 2 : 1}
      pageBy={mode === "range" ? "page" : "month"}
      locale={locale}
      weekStartsOn={1}
      today={today}
      name={name}
      startName={startName}
      endName={endName}
      required={required}
      controller={controller}
      className="relative flex min-w-0 flex-col gap-1"
    >
      {label !== undefined && label !== null ? (
        <label
          id={labelId}
          htmlFor={startInputId}
          className={hideLabel ? "sr-only" : "text-lark-14 leading-[22px] text-lark-title"}
        >
          {label}
        </label>
      ) : null}

      <div
        ref={controlRef}
        data-slot="date-picker-control"
        data-open={isOpen ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
        className={cn(
          "flex w-full min-w-0 items-center rounded-lark-md border border-solid",
          "border-lark-border bg-lark-canvas text-lark-title",
          "transition-[border-color,background-color] duration-100 ease-lark-linear",
          "hover:border-lark-primary focus-within:border-lark-primary",
          "data-[open]:border-lark-primary",
          "data-[disabled]:cursor-not-allowed data-[disabled]:border-lark-border",
          "data-[disabled]:bg-lark-disabled-bg data-[disabled]:text-lark-placeholder",
          "data-[disabled]:hover:border-lark-border",
          triggerSize[size],
          className,
        )}
      >
        <input
          ref={startRef}
          id={startInputId}
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={startText}
          placeholder={mode === "range" ? startPlaceholder : placeholder}
          aria-label={startAriaLabel}
          aria-haspopup="dialog"
          disabled={disabled}
          readOnly={readOnly}
          onChange={(event) => setDraftStart(event.target.value)}
          onClick={handleInputClick}
          onBlur={() => {
            if (mode === "single") {
              commitSingle(startText);
            } else {
              commitRange("start");
            }
          }}
          onKeyDown={handleInputKeyDown}
          className={cn(
            "min-w-0 flex-1 border-0 bg-transparent p-0 text-inherit outline-none",
            "placeholder:text-lark-placeholder disabled:cursor-not-allowed read-only:cursor-default",
            mode === "range" && "w-0",
          )}
        />

        {mode === "range" ? (
          <span aria-hidden="true" className="mx-[7px] h-px w-2 shrink-0 bg-lark-title" />
        ) : null}

        {mode === "range" ? (
          <input
            ref={endRef}
            id={endInputId}
            type="text"
            autoComplete="off"
            spellCheck={false}
            value={endText}
            placeholder={endPlaceholder}
            aria-label={endAriaLabel}
            aria-haspopup="dialog"
            disabled={disabled}
            readOnly={readOnly}
            onChange={(event) => setDraftEnd(event.target.value)}
            onClick={handleInputClick}
            onBlur={() => commitRange("end")}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                commitRange("end");
              } else if (event.key === "Escape" && isOpen) {
                event.preventDefault();
                controller.close();
              } else if (event.altKey && event.key === "ArrowDown") {
                event.preventDefault();
                controller.open();
              }
            }}
            className={cn(
              "min-w-0 flex-1 border-0 bg-transparent p-0 text-inherit outline-none",
              "placeholder:text-lark-placeholder disabled:cursor-not-allowed read-only:cursor-default",
              "w-0",
            )}
          />
        ) : null}

        {allowClear && footer !== true ? (
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

        <DatePickerTrigger
          aria-label={triggerAriaLabel}
          className={cn(iconButtonClass, triggerIconSize[size])}
        />

        <DatePickerContent
          aria-label={triggerAriaLabel}
          // ui-sdk anchors to its own DatePickerInput; ours are native inputs,
          // so anchor the panel to the field itself and keep its left edge.
          anchor={controlAnchor}
          side="bottom"
          align="start"
          sideOffset={4}
          collisionPadding={8}
          className={cn(panelClass, contentClassName)}
        >
          <div className="mb-[10px] flex items-center justify-between gap-2 pl-2">
            <CalendarPrevious aria-label="上个月" className={navButtonClass}>
              <ChevronLeftIcon />
            </CalendarPrevious>
            <CalendarHeading className="text-lark-14 leading-[22px] font-normal text-lark-title" />
            <CalendarNext aria-label="下个月" className={navButtonClass}>
              <ChevronRightIcon />
            </CalendarNext>
          </div>

          <div className="flex items-start gap-8">
            {(mode === "range" ? [0, 1] : [0]).map((offset) => (
              <CalendarGrid
                key={offset}
                offset={offset}
                className="w-[248px] table-fixed border-separate border-spacing-0"
              >
                <CalendarWeekdays>
                  {(index) => (
                    <CalendarWeekday
                      index={index}
                      className="h-8 w-8 p-0 text-center text-lark-12 leading-5 font-normal text-lark-caption"
                    />
                  )}
                </CalendarWeekdays>
                <CalendarWeeks>
                  {(cell) => (
                    <CalendarDay
                      key={cell.date}
                      value={cell.date}
                      className={(state) =>
                        cn(
                          "group h-8 w-8 p-0 text-center align-middle",
                          mode === "range" && state.inRange && "bg-lark-primary-soft",
                          mode === "range" && state.rangeStart && "rounded-l-lark-full",
                          mode === "range" && state.rangeEnd && "rounded-r-lark-full",
                          "focus-visible:outline-none",
                        )
                      }
                    >
                      {(state) => (
                        <span
                          className={cn(
                            "mx-auto flex size-8 items-center justify-center rounded-lark-full",
                            "border border-transparent text-lark-14 leading-[22px]",
                            "transition-colors duration-200 ease-lark",
                            !state.disabled &&
                              !state.selected &&
                              "group-hover:bg-lark-primary-soft",
                            state.outside && "text-lark-caption",
                            state.today &&
                              "border-lark-primary text-lark-primary-content dark:text-lark-blue-300",
                            state.today && !state.selected && "group-hover:bg-lark-primary-soft",
                            (mode === "single"
                              ? state.selected
                              : state.rangeStart || state.rangeEnd) &&
                              "border-lark-primary bg-lark-primary text-lark-on-primary",
                            mode === "range" &&
                              state.selected &&
                              !state.rangeStart &&
                              !state.rangeEnd &&
                              "text-lark-primary-content dark:text-lark-blue-300",
                            state.disabled &&
                              !state.outside &&
                              "bg-lark-disabled-bg text-lark-placeholder",
                            state.disabled &&
                              state.selected &&
                              "bg-lark-fill-disabled text-lark-on-primary",
                            state.disabled && !state.outside && "group-hover:bg-lark-disabled-bg",
                            state.disabled && state.selected && "group-hover:bg-lark-fill-disabled",
                            "group-focus-visible:ring-2 group-focus-visible:ring-lark-primary",
                            "group-focus-visible:ring-offset-1",
                          )}
                        >
                          {dayNumberFormat.format(Number(state.date.slice(8, 10)))}
                        </span>
                      )}
                    </CalendarDay>
                  )}
                </CalendarWeeks>
              </CalendarGrid>
            ))}
          </div>

          {footer !== false && footer !== undefined ? (
            <div className="-mx-[15px] -mb-[15px] mt-3 flex items-center justify-between gap-2 border-t border-solid border-lark-border-card px-2 py-3">
              {footerContent}
            </div>
          ) : null}
        </DatePickerContent>
      </div>
    </UiDatePicker>
  );
}
