import { Toggle as UiToggle, ToggleGroup as UiToggleGroup } from "@ui-sdk/react/toggle";
import type { ComponentProps, ReactNode, Ref } from "react";
import { cn } from "../../lib/cn";

type UiToggleGroupProps = ComponentProps<typeof UiToggleGroup>;
type UiToggleProps = ComponentProps<typeof UiToggle>;
type UiToggleGroupValueChange = NonNullable<UiToggleGroupProps["onValueChange"]>;

export type SegmentedControlValueChangeDetails = Parameters<UiToggleGroupValueChange>[1];

export type SegmentedControlProps = Omit<
  UiToggleGroupProps,
  "value" | "defaultValue" | "onValueChange" | "multiple" | "deselectable" | "orientation"
> & {
  /** 当前选中项。传 `null` 表示不选中；不传则由 `defaultValue` 起非受控。 */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string, details: SegmentedControlValueChangeDetails) => void;
};

/**
 * UD 选择组（飞书卡片搭建器 ChoiceSetter）：28px 灰色轨道、20px 选项、
 * 单选。行为来自 ui-sdk 的 ToggleGroup：组内一个 tab stop、方向键移动、
 * `aria-pressed`、禁用项仍可聚焦。
 */
export function SegmentedControl({
  value,
  defaultValue,
  onValueChange,
  className,
  ...props
}: SegmentedControlProps) {
  return (
    <UiToggleGroup
      {...props}
      multiple={false}
      deselectable={false}
      value={value === undefined ? undefined : value === null ? [] : [value]}
      defaultValue={
        defaultValue === undefined ? undefined : defaultValue === null ? [] : [defaultValue]
      }
      onValueChange={
        onValueChange ? (next, details) => onValueChange(next[0] ?? "", details) : undefined
      }
      className={(state) =>
        cn(
          "inline-flex h-7 items-center gap-0.5 rounded-lark-md bg-lark-base p-1",
          "select-none transition-colors duration-100 ease-lark-linear",
          "data-[disabled]:bg-lark-neutral-300",
          typeof className === "function" ? className(state) : className,
        )
      }
    />
  );
}

export type SegmentedControlItemProps = Omit<
  UiToggleProps,
  "children" | "value" | "pressed" | "defaultPressed" | "onPressedChange" | "controller"
> & {
  value: string;
  children?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
};

/** 选择组的一项。纯图标项必须带 `aria-label`。 */
export function SegmentedControlItem({
  value,
  children,
  className,
  ref,
  ...props
}: SegmentedControlItemProps) {
  return (
    <UiToggle
      {...props}
      ref={ref}
      value={value}
      className={(state) =>
        cn(
          "inline-flex h-full min-w-5 flex-1 cursor-pointer items-center justify-center gap-1",
          "rounded-lark-sm border-0 bg-transparent px-1 text-lark-12 leading-none",
          "whitespace-nowrap text-lark-caption select-none",
          "transition-colors duration-100 ease-lark-linear",
          "hover:bg-lark-neutral-300 hover:text-lark-title",
          "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-lark-primary",
          "data-[pressed]:bg-lark-canvas data-[pressed]:text-lark-title",
          "data-[pressed]:hover:bg-lark-canvas data-[pressed]:hover:text-lark-primary-content",
          "data-[disabled]:cursor-not-allowed data-[disabled]:text-lark-disabled",
          "data-[disabled]:hover:bg-transparent data-[disabled]:hover:text-lark-disabled",
          "data-[pressed]:data-[disabled]:bg-lark-neutral-50",
          "data-[pressed]:data-[disabled]:text-lark-caption",
          "data-[pressed]:data-[disabled]:hover:bg-lark-neutral-50",
          "[&_svg]:size-3 [&_svg]:shrink-0",
          typeof className === "function" ? className(state) : className,
        )
      }
    >
      {children}
    </UiToggle>
  );
}
