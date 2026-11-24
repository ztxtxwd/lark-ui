import type { SelectProps as UiSelectRootProps } from "@ui-sdk/react/select";
import {
  Select as UiSelect,
  SelectClear as UiSelectClear,
  SelectContent as UiSelectContent,
  SelectEmpty as UiSelectEmpty,
  SelectInput as UiSelectInput,
  SelectItem as UiSelectItem,
  SelectItemIndicator as UiSelectItemIndicator,
  SelectItemText as UiSelectItemText,
  SelectLabel as UiSelectLabel,
  SelectList as UiSelectList,
  SelectTrigger as UiSelectTrigger,
  SelectValue as UiSelectValue,
} from "@ui-sdk/react/select";
import { type ReactElement, type ReactNode, useId } from "react";
import { CheckIcon, ChevronDownIcon, XIcon } from "../../icons";
import { cn } from "../../lib/cn";

export type SelectSize = "sm" | "md" | "lg";

export type SelectOption = {
  value: string;
  label: string;
  description?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};

type UiSelectProps = UiSelectRootProps<string, boolean> & {
  className?: string;
  children?: ReactNode;
};

const SelectRoot = UiSelect as unknown as (props: UiSelectProps) => ReactElement;

export type SelectProps = Omit<UiSelectProps, "children" | "items"> & {
  options: SelectOption[];
  label?: ReactNode;
  hideLabel?: boolean;
  placeholder?: string;
  size?: SelectSize;
  invalid?: boolean;
  allowClear?: boolean;
  clearLabel?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchLabel?: string;
  emptyText?: ReactNode;
  maxDisplayLabels?: number;
  className?: string;
  contentClassName?: string;
  "aria-label"?: string;
};

const triggerSize: Record<SelectSize, string> = {
  sm: "min-h-7 gap-1.5 py-0.5 pr-2 pl-2 text-lark-12",
  md: "min-h-8 gap-2 py-1 pr-2 pl-[11px] text-lark-14",
  lg: "min-h-10 gap-2 py-2 pr-2 pl-[11px] text-lark-16",
};

export function Select({
  options,
  label,
  hideLabel = false,
  placeholder = "请选择",
  size = "md",
  invalid = false,
  allowClear = true,
  clearLabel = "清除",
  searchable = false,
  searchPlaceholder = "搜索",
  searchLabel = "搜索选项",
  emptyText = "暂无匹配选项",
  maxDisplayLabels = 2,
  className,
  contentClassName,
  multiple,
  "aria-label": ariaLabel,
  ...props
}: SelectProps) {
  const labelId = useId();
  const items = options.map((option) => ({
    value: option.value,
    label: option.label,
    disabled: option.disabled,
  }));

  const renderedItems = options.map((option) => (
    <UiSelectItem
      key={option.value}
      value={option.value}
      label={option.label}
      disabled={option.disabled}
      className={cn(
        "flex min-h-8 cursor-pointer items-center gap-2 rounded-lark-sm px-2 py-1",
        "text-lark-14 leading-[22px] text-lark-title outline-none transition-colors duration-100",
        "data-[highlighted]:bg-[var(--lark-fill-hover)]",
        "data-[selected]:text-lark-primary",
        "data-[disabled]:cursor-not-allowed",
        // UD dims a disabled option's whole row to 50% when it has compound content.
        option.icon || option.description
          ? "data-[disabled]:opacity-50"
          : "data-[disabled]:text-lark-disabled",
      )}
    >
      {option.icon ? (
        <span className="flex size-4 shrink-0 items-center justify-center text-lark-icon-2 [&_svg]:size-4">
          {option.icon}
        </span>
      ) : null}
      <span className="flex min-w-0 flex-1 flex-col">
        <UiSelectItemText className="block truncate">{option.label}</UiSelectItemText>
        {option.description ? (
          <span className="block truncate text-lark-12 leading-5 text-lark-caption">
            {option.description}
          </span>
        ) : null}
      </span>
      <UiSelectItemIndicator className="flex size-3 shrink-0 items-center justify-center text-lark-primary [&_svg]:size-3">
        <CheckIcon />
      </UiSelectItemIndicator>
    </UiSelectItem>
  ));

  return (
    <SelectRoot
      {...props}
      items={searchable ? undefined : items}
      itemToLabel={
        searchable
          ? (value: string) => options.find((option) => option.value === value)?.label ?? value
          : undefined
      }
      multiple={multiple}
      className={cn("flex min-w-0 flex-col gap-1", className)}
    >
      {label ? (
        <UiSelectLabel
          id={labelId}
          className={hideLabel ? "sr-only" : "text-lark-14 leading-[22px] text-lark-title"}
        >
          {label}
        </UiSelectLabel>
      ) : null}

      <div className="relative flex min-w-0 items-center">
        <UiSelectTrigger
          aria-label={ariaLabel ?? (label ? undefined : "选择器")}
          aria-invalid={invalid || undefined}
          aria-labelledby={label ? labelId : undefined}
          data-invalid={invalid ? "" : undefined}
          className={(state) =>
            cn(
              "group/select flex w-full min-w-0 flex-1 items-center rounded-lark-md border border-solid",
              "border-lark-border bg-lark-canvas text-left text-lark-title",
              "transition-[border-color,background-color] duration-100 ease-lark-linear",
              "hover:border-lark-primary focus-visible:border-lark-primary focus-visible:outline-none",
              "data-[open]:border-lark-primary",
              "data-[invalid]:border-lark-danger data-[invalid]:hover:border-lark-danger",
              "data-[disabled]:cursor-not-allowed data-[disabled]:border-lark-border",
              "data-[disabled]:bg-lark-disabled-bg data-[disabled]:text-lark-placeholder",
              "data-[disabled]:hover:border-lark-border",
              !multiple && triggerSize[size],
              multiple && "min-h-8 flex-wrap py-1",
              state.open && "border-lark-primary",
            )
          }
        >
          <UiSelectValue
            placeholder={placeholder}
            className={(state) =>
              cn(
                "min-w-0 flex-1 truncate text-left",
                state.placeholder ? "text-lark-caption" : "text-lark-title",
              )
            }
          >
            {(state) => {
              if (state.placeholder) {
                return placeholder;
              }
              if (!multiple) {
                return state.label;
              }
              const shown = state.labels.slice(0, maxDisplayLabels);
              const hidden = state.labels.length - shown.length;
              return [...shown, ...(hidden > 0 ? [`+${hidden}`] : [])].join("、");
            }}
          </UiSelectValue>
          {allowClear ? <span aria-hidden="true" className="size-4 shrink-0" /> : null}
          <ChevronDownIcon
            className={cn(
              "pointer-events-none size-4 shrink-0 text-lark-icon-2",
              "transition-transform duration-200 ease-lark",
              "group-data-[open]/select:rotate-180",
            )}
          />
        </UiSelectTrigger>

        {allowClear ? (
          <UiSelectClear
            aria-label={clearLabel}
            className={cn(
              "absolute top-1/2 right-7 flex size-4 -translate-y-1/2 cursor-pointer items-center justify-center",
              "rounded-full text-lark-icon-3 transition-colors duration-100",
              "hover:bg-[var(--lark-fill-hover)] hover:text-lark-primary-content",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
            )}
          >
            <XIcon size={14} />
          </UiSelectClear>
        ) : null}
      </div>

      <UiSelectContent
        sideOffset={4}
        className={cn(
          "z-50 flex max-h-[246px] w-[var(--anchor-width)] min-w-[120px] max-w-[420px] flex-col",
          "rounded-lark-lg border border-lark-border-card bg-lark-float p-1 shadow-lark-4 outline-none",
          "origin-(--transform-origin) transition-[opacity,scale] duration-100 ease-lark",
          "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
          "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
          contentClassName,
        )}
      >
        {searchable ? (
          <UiSelectInput
            aria-label={searchLabel}
            placeholder={searchPlaceholder}
            className={cn(
              "mb-1 h-8 w-full rounded-lark-md border border-lark-border bg-lark-canvas px-2",
              "text-lark-14 text-lark-title outline-none placeholder:text-lark-placeholder",
              "focus:border-lark-primary",
            )}
          />
        ) : null}
        {/* ui-sdk keeps the empty part mounted and only clears its children, so the
            vertical padding has to follow data-empty or it leaves a blank row. */}
        <UiSelectEmpty className="px-2 text-lark-14 text-lark-caption data-[empty]:py-3">
          {emptyText}
        </UiSelectEmpty>
        <UiSelectList className="min-h-0 flex-1 overflow-y-auto">{renderedItems}</UiSelectList>
      </UiSelectContent>
    </SelectRoot>
  );
}
