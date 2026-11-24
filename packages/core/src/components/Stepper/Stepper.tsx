import {
  createNumberInputController,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  type NumberInputState,
  type NumberInputValueChangeReason,
  NumberInput as UiNumberInput,
} from "@ui-sdk/react/number-input";
import { cva } from "class-variance-authority";
import { type ReactNode, useId, useState } from "react";
import { MinusIcon, PlusIcon } from "../../icons";
import { cn } from "../../lib/cn";

export type StepperSize = "sm" | "md" | "lg";

export type StepperValueChangeDetails = {
  /** Why the value changed, such as `step-key` or `increment-press`. */
  reason: NumberInputValueChangeReason;
  /** The DOM event behind the change. */
  event?: Event;
  /** How the user caused it: `mouse`, `touch`, `pen`, `keyboard`, `virtual` or `agent`. */
  source?: string;
  /** Stops the change. */
  cancel?: () => void;
};

export type StepperProps = {
  /** Controlled value. Pass `null` while the field is empty. */
  value?: number | null;
  /** The value at first, when uncontrolled. Defaults to `min`. */
  defaultValue?: number | null;
  /** The lowest value. Defaults to 0. */
  min?: number;
  /** The highest value. */
  max?: number;
  /** How far one press of a step button moves. Defaults to 1. */
  step?: number;
  /** How far Page Up, Page Down and Shift and a step button move. Defaults to ten steps. */
  largeStep?: number;
  /**
   * Decimal places shown in the field. The value itself is snapped to `step`,
   * so leave `precision` unset for the integer behaviour UD documents.
   */
  precision?: number;
  /** `Intl.NumberFormat` options for the field. Merged after `precision`. */
  format?: Intl.NumberFormatOptions;
  size?: StepperSize;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  /** The field's visible label. */
  label?: ReactNode;
  /** Keeps the label for assistive technology but visually hides it. */
  hideLabel?: boolean;
  /** The field's accessible name when there is no visible label. */
  "aria-label"?: string;
  /** Accessible name for the decrement button. */
  decrementLabel?: string;
  /** Accessible name for the increment button. */
  incrementLabel?: string;
  /** The id of the input, used to associate the visible label. */
  id?: string;
  name?: string;
  form?: string;
  /** Lets the mouse wheel step the value while the field is focused. */
  wheel?: boolean;
  /** Runs on every step and while a typed number becomes valid. */
  onValueChange?: (value: number | null, details: StepperValueChangeDetails) => void;
  /** Runs once an interaction that changed the value ends. */
  onValueCommit?: (value: number | null, details: StepperValueChangeDetails) => void;
  /** Alias of `onValueChange` for consumers that prefer `onChange`. */
  onChange?: (value: number | null) => void;
  className?: string;
  inputClassName?: string;
};

const groupSizes: Record<StepperSize, string> = {
  sm: "h-7 text-lark-12",
  md: "h-8 text-lark-14",
  lg: "h-10 text-lark-16",
};

const groupStyles = cva(
  [
    "flex w-40 min-w-0 items-stretch overflow-hidden rounded-lark-md border border-solid",
    "border-lark-border bg-lark-canvas text-lark-title",
    "transition-[border-color,background-color] duration-100 ease-lark-linear",
    "hover:border-lark-primary focus-within:border-lark-primary",
    "data-[disabled]:border-lark-border data-[disabled]:bg-lark-disabled-bg",
    "data-[disabled]:text-lark-placeholder data-[disabled]:hover:border-lark-border",
    "data-[readonly]:hover:border-lark-border data-[readonly]:focus-within:border-lark-border",
  ],
  {
    variants: {
      size: groupSizes,
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const stepButton = cn(
  "flex w-10 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent",
  "text-lark-icon-2 transition-colors duration-100 ease-lark-linear",
  "hover:bg-[var(--lark-primary-fill-transparent-01)] hover:text-lark-primary-content",
  "active:bg-[var(--lark-primary-fill-transparent-03)]",
  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-lark-primary",
  "disabled:cursor-not-allowed disabled:bg-lark-disabled-bg disabled:text-lark-placeholder",
  "data-[disabled]:bg-lark-disabled-bg data-[disabled]:text-lark-placeholder",
  "data-[disabled]:cursor-not-allowed data-[disabled]:hover:bg-lark-disabled-bg",
  "data-[disabled]:hover:text-lark-placeholder",
);

export function Stepper({
  value,
  defaultValue,
  min = 0,
  max,
  step = 1,
  largeStep,
  precision,
  format,
  size = "md",
  disabled = false,
  readOnly = false,
  required = false,
  label,
  hideLabel = false,
  "aria-label": ariaLabel,
  decrementLabel = "减少",
  incrementLabel = "增加",
  id,
  name,
  form,
  wheel = false,
  onValueChange,
  onValueCommit,
  onChange,
  className,
  inputClassName,
}: StepperProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const labelId = `${inputId}-label`;
  const initialValue = defaultValue !== undefined ? defaultValue : (min ?? 0);
  const [controller] = useState(() => createNumberInputController());

  const displayFormat =
    precision === undefined && format === undefined
      ? undefined
      : {
          ...(precision === undefined
            ? {}
            : {
                minimumFractionDigits: precision,
                maximumFractionDigits: precision,
              }),
          ...format,
        };

  return (
    <div className={cn("inline-flex min-w-0 flex-col gap-1", className)}>
      {label ? (
        <label
          id={labelId}
          htmlFor={inputId}
          className={hideLabel ? "sr-only" : "text-lark-14 leading-[22px] text-lark-title"}
        >
          {label}
        </label>
      ) : null}

      <UiNumberInput
        value={value}
        defaultValue={value === undefined ? initialValue : undefined}
        min={min}
        max={max}
        step={step}
        largeStep={largeStep}
        format={displayFormat}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        name={name}
        form={form}
        wheel={wheel}
        controller={controller}
        onValueChange={(next, details) => {
          onValueChange?.(next, details);
          onChange?.(next);
        }}
        onValueCommit={(next, details) => {
          /*
           * UD: clearing the field and leaving it sets it to the minimum.
           * ui-sdk reports the empty field as null, so restore the bound.
           */
          if (next === null) {
            controller.setValue(min ?? 0);
          }
          onValueCommit?.(next ?? min ?? 0, details);
        }}
      >
        <NumberInputGroup
          className={(state: NumberInputState) =>
            cn(groupStyles({ size }), state.scrubbing && "select-none")
          }
        >
          <NumberInputDecrement
            aria-label={decrementLabel}
            className={cn(stepButton, "border-r border-solid border-lark-border")}
          >
            <MinusIcon aria-hidden="true" />
          </NumberInputDecrement>

          <NumberInputControl
            id={inputId}
            aria-label={label ? undefined : (ariaLabel ?? "数值")}
            aria-labelledby={label ? labelId : undefined}
            className={cn(
              "h-full w-full min-w-0 flex-1 border-0 bg-transparent px-1",
              "text-center text-inherit outline-none",
              "placeholder:text-lark-placeholder disabled:cursor-not-allowed",
              "read-only:cursor-default",
              inputClassName,
            )}
          />

          <NumberInputIncrement
            aria-label={incrementLabel}
            className={cn(stepButton, "border-l border-solid border-lark-border")}
          >
            <PlusIcon aria-hidden="true" />
          </NumberInputIncrement>
        </NumberInputGroup>
      </UiNumberInput>
    </div>
  );
}
