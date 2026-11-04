"use client";

import { useState } from "react";
import { DatePicker, Popover, Button, type DateRange } from "@lark-ui/core";
import { CalendarDotsIcon } from "@phosphor-icons/react";

/**
 * 选择单个日期。
 */
export function DatePickerSingleDemo() {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <div className="flex flex-col gap-4">
      <DatePicker
        className="p-3"
        mode="single"
        selected={date}
        onChange={(d) => {
          if (d) {
            setDate(d);
          }
        }}
      />
      <p className="text-sm text-lark-subtle">
        已选择：{date ? date.toLocaleDateString() : "无"}
      </p>
    </div>
  );
}

/**
 * 选择多个日期，最多可选 5 个。
 */
export function DatePickerMultipleDemo() {
  const [dates, setDates] = useState<Date[] | undefined>();

  return (
    <div className="flex flex-col gap-4">
      <DatePicker
        className="p-3"
        mode="multiple"
        selected={dates}
        onChange={setDates}
        max={5}
      />
      <p className="text-sm text-lark-subtle">
        已选择：{dates?.length ?? 0} 个日期
      </p>
    </div>
  );
}

/**
 * 选择日期范围，同时显示两个月。
 */
export function DatePickerRangeDemo() {
  const [range, setRange] = useState<DateRange | undefined>();

  return (
    <div className="flex flex-col gap-4">
      <DatePicker
        className="p-3"
        mode="range"
        selected={range}
        onChange={setRange}
        numberOfMonths={2}
      />
      <p className="text-sm text-lark-subtle">
        范围：
        {range?.from
          ? `${range.from.toLocaleDateString()} - ${range.to?.toLocaleDateString() ?? "..."}`
          : "无"}
      </p>
    </div>
  );
}

/**
 * 日期范围选择，最短 3 晚、最长 7 晚。
 */
export function DatePickerRangeMinMaxDemo() {
  const [range, setRange] = useState<DateRange | undefined>();

  return (
    <div className="flex flex-col gap-4">
      <DatePicker
        className="p-3"
        mode="range"
        selected={range}
        onChange={setRange}
        min={3}
        max={7}
        footer={<span className="text-xs text-lark-subtle">选择 3-7 晚</span>}
      />
    </div>
  );
}

/**
 * 通过月份和年份下拉框直接跳转到指定日期。
 */
export function DatePickerDropdownCaptionDemo() {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <DatePicker
      className="p-3"
      mode="single"
      selected={date}
      onChange={setDate}
      captionLayout="dropdown"
      startMonth={new Date(2020, 0)}
      endMonth={new Date(2030, 11)}
    />
  );
}

/**
 * 与 Popover 组合的日期选择器，呈现下拉式交互。
 */
export function DatePickerPopoverDemo() {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <Popover>
      <Popover.Trigger
        render={<Button variant="outline" icon={CalendarDotsIcon} />}
      >
        {date ? date.toLocaleDateString() : "选择日期"}
      </Popover.Trigger>
      <Popover.Content className="p-3">
        <DatePicker mode="single" selected={date} onChange={setDate} />
      </Popover.Content>
    </Popover>
  );
}

/**
 * 与 Popover 组合的日期范围选择器，呈现下拉式交互。
 */
export function DatePickerRangePopoverDemo() {
  const [range, setRange] = useState<DateRange | undefined>();

  const formatRange = () => {
    if (!range?.from) return "选择日期范围";
    if (!range.to) return range.from.toLocaleDateString();
    return `${range.from.toLocaleDateString()} – ${range.to.toLocaleDateString()}`;
  };

  return (
    <Popover>
      <Popover.Trigger
        render={<Button variant="outline" icon={CalendarDotsIcon} />}
      >
        {formatRange()}
      </Popover.Trigger>
      <Popover.Content className="p-3">
        <DatePicker
          mode="range"
          selected={range}
          onChange={setRange}
          numberOfMonths={2}
        />
      </Popover.Content>
    </Popover>
  );
}

/**
 * 带预设选项（位于 Popover 中）的日期范围选择器。
 */
export function DatePickerRangeWithPresetsDemo() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [month, setMonth] = useState<Date>(new Date());

  const today = new Date();

  const presets = [
    {
      label: "今天",
      range: { from: today, to: today },
    },
    {
      label: "最近 7 天",
      range: {
        from: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000),
        to: today,
      },
    },
    {
      label: "最近 30 天",
      range: {
        from: new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000),
        to: today,
      },
    },
    {
      label: "最近 90 天",
      range: {
        from: new Date(today.getTime() - 89 * 24 * 60 * 60 * 1000),
        to: today,
      },
    },
    {
      label: "本月",
      range: {
        from: new Date(today.getFullYear(), today.getMonth(), 1),
        to: new Date(today.getFullYear(), today.getMonth() + 1, 0),
      },
    },
    {
      label: "上个月",
      range: {
        from: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        to: new Date(today.getFullYear(), today.getMonth(), 0),
      },
    },
  ];

  const handlePresetClick = (preset: { range: DateRange }) => {
    setRange(preset.range);
    // Navigate calendar to show the start of the range
    if (preset.range.from) {
      setMonth(preset.range.from);
    }
  };

  const isPresetActive = (preset: { range: DateRange }) => {
    if (!range?.from || !range?.to || !preset.range.from || !preset.range.to)
      return false;
    // Compare dates only (ignore time)
    const sameFrom =
      range.from.toDateString() === preset.range.from.toDateString();
    const sameTo = range.to.toDateString() === preset.range.to.toDateString();
    return sameFrom && sameTo;
  };

  const formatRange = () => {
    if (!range?.from) return "选择日期范围";
    if (!range.to) return range.from.toLocaleDateString();
    return `${range.from.toLocaleDateString()} – ${range.to.toLocaleDateString()}`;
  };

  return (
    <Popover>
      <Popover.Trigger
        render={<Button variant="outline" icon={CalendarDotsIcon} />}
      >
        {formatRange()}
      </Popover.Trigger>
      <Popover.Content className="p-0">
        <div className="flex">
          <div className="flex flex-col gap-1 border-r border-lark-hairline p-2 text-sm">
            {presets.map((preset) => {
              const isActive = isPresetActive(preset);
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className={`rounded-md px-3 py-1.5 text-left whitespace-nowrap ${
                    isActive
                      ? "bg-lark-contrast text-lark-inverse"
                      : "text-lark-subtle hover:bg-lark-control"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
          <div className="p-3">
            <DatePicker
              mode="range"
              selected={range}
              onChange={setRange}
              month={month}
              onMonthChange={setMonth}
              numberOfMonths={2}
            />
          </div>
        </div>
      </Popover.Content>
    </Popover>
  );
}

/**
 * 含禁用日期的日期选择器，页脚展示使用次数限制。
 */
export function DatePickerDisabledWithFooterDemo() {
  const [dates, setDates] = useState<Date[] | undefined>();
  const today = new Date();

  // Example: some dates are already used/unavailable
  const unavailableDates = [
    new Date(today.getFullYear(), today.getMonth(), 5),
    new Date(today.getFullYear(), today.getMonth(), 12),
    new Date(today.getFullYear(), today.getMonth(), 18),
    new Date(today.getFullYear(), today.getMonth(), 25),
  ];

  const selectedCount = dates?.length ?? 0;
  const maxDays = 5;

  return (
    <DatePicker
      className="p-3"
      mode="multiple"
      selected={dates}
      onChange={setDates}
      max={maxDays}
      disabled={unavailableDates}
      fixedWeeks
      footer={
        <p className="w-full pt-2 text-xs text-lark-subtle">
          已选择 {selectedCount}/{maxDays} 天。灰色日期不可用。
        </p>
      }
    />
  );
}
