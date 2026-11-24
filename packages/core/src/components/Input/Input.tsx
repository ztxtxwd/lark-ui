import { InputClear, InputGroup, Input as UiInput } from "@ui-sdk/react/input";
import {
  createNumberInputController,
  NumberInputControl,
  NumberInputGroup,
  type NumberInputOptions,
  NumberInputScrubArea,
  NumberInputScrubAreaCursor,
  NumberInput as UiNumberInput,
} from "@ui-sdk/react/number-input";
import type {
  ComponentProps,
  FocusEventHandler,
  KeyboardEventHandler,
  ReactNode,
  Ref,
} from "react";
import { useState } from "react";
import { XIcon } from "../../icons";
import { cn } from "../../lib/cn";

export type InputSize = "sm" | "md" | "lg";

type InputFrameProps = {
  size?: InputSize;
  invalid?: boolean;
  allowClear?: boolean;
  clearLabel?: string;
  endIcon?: ReactNode;
  className?: string;
  groupClassName?: string;
  ref?: Ref<HTMLInputElement>;
};

/** A plain text field. The default when `numeric` is not set. */
export type TextInputProps = InputFrameProps & {
  numeric?: false;
  startIcon?: ReactNode;
} & Omit<ComponentProps<typeof UiInput>, "className" | "ref" | "size">;

/**
 * A number field. The value is a number (or `null` while empty); drag the
 * leading icon sideways to scrub it, or type, use the arrow keys, or hold
 * Shift for a large step and Alt for a fine one.
 */
export type InputNumberProps = InputFrameProps &
  Omit<NumberInputOptions, "controller"> & {
    numeric: true;
    /**
     * The icon inside the scrub handle. Takes precedence over `startIcon`;
     * defaults to a horizontal arrows glyph, so any icon can stand in for the
     * drag handle.
     */
    dragIcon?: ReactNode;
    /** The leading icon, which is the drag handle in numeric mode. */
    startIcon?: ReactNode;
    /** Accessible description and tooltip of the drag handle. */
    dragLabel?: string;
    /** CSS pixels of horizontal pointer travel per step. Defaults to 2. */
    pixelsPerStep?: number;
    id?: string;
    placeholder?: string;
    autoFocus?: boolean;
    onFocus?: FocusEventHandler<HTMLInputElement>;
    onBlur?: FocusEventHandler<HTMLInputElement>;
    onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
    onKeyUp?: KeyboardEventHandler<HTMLInputElement>;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    "aria-errormessage"?: string;
  };

export type InputProps = TextInputProps | InputNumberProps;

const groupBase = cn(
  "group/input flex w-full min-w-0 items-center overflow-hidden rounded-lark-md border border-solid",
  "border-lark-border bg-lark-canvas text-lark-title",
  "transition-[border-color,background-color] duration-100 ease-lark-linear",
  "hover:border-lark-primary focus-within:border-lark-primary",
  "data-[invalid]:border-lark-danger data-[invalid]:hover:border-lark-danger",
  "data-[invalid]:focus-within:border-lark-danger",
  "data-[disabled]:border-lark-border data-[disabled]:bg-lark-disabled-bg",
  "data-[disabled]:text-lark-placeholder data-[disabled]:hover:border-lark-border",
  // A disabled field keeps the neutral border even when it is also invalid.
  "data-[invalid]:data-[disabled]:border-lark-border",
  "data-[invalid]:data-[disabled]:hover:border-lark-border",
  "data-[invalid]:data-[disabled]:focus-within:border-lark-border",
);

const sizeClasses: Record<InputSize, string> = {
  sm: "h-7 gap-2 pl-2 pr-1.5 text-lark-12",
  md: "h-8 gap-2 pl-[11px] pr-2 text-lark-14",
  lg: "h-10 gap-2 pl-[11px] pr-2 text-lark-16",
};

// UD sizes prefix/suffix icons at 14 / 16 / 20px and the clear icon at 10 / 12 / 16px.
const iconSizeClasses: Record<InputSize, string> = {
  sm: "[&_svg]:size-3.5",
  md: "[&_svg]:size-4",
  lg: "[&_svg]:size-5",
};

const clearIconSize: Record<InputSize, number> = {
  sm: 10,
  md: 12,
  lg: 16,
};

const inputBase = cn(
  "min-w-0 flex-1 border-0 bg-transparent p-0 text-inherit outline-none",
  "placeholder:text-lark-placeholder disabled:cursor-not-allowed",
  "read-only:cursor-default",
);

const clearButtonClass = cn(
  "flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full",
  "text-lark-icon-2 transition-colors duration-100",
  "hover:bg-[var(--lark-fill-hover)] hover:text-lark-primary-content",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
);

/*
 * The handle pill sits inside the field's own padding: negative margins keep
 * the icon at UD's 12px inset and the 8px gap to the text, while the padding
 * gives the pointer a target big enough to grab.
 */
const dragHandleClasses: Record<InputSize, string> = {
  sm: "-ml-0.5 -mr-0.5 p-0.5",
  md: "-ml-1 -mr-1 p-1",
  lg: "-ml-1 -mr-1 p-1",
};

function DragHandleIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    >
      <path d="M3.25 8h9.5" />
      <path d="M5.5 5.75 3.25 8l2.25 2.25" />
      <path d="m10.5 5.75 2.25 2.25-2.25 2.25" />
    </svg>
  );
}

export function Input(props: InputProps) {
  if (props.numeric) {
    return <NumberInput {...props} />;
  }
  return <TextInput {...props} />;
}

function TextInput({
  size = "md",
  invalid = false,
  allowClear = false,
  clearLabel = "清除",
  startIcon,
  endIcon,
  className,
  groupClassName,
  ref,
  numeric: _numeric,
  ...props
}: TextInputProps) {
  return (
    <InputGroup
      className={cn(groupBase, sizeClasses[size], groupClassName)}
      data-invalid={invalid ? "" : undefined}
    >
      {startIcon ? (
        <span
          aria-hidden="true"
          className={cn(
            "flex shrink-0 items-center text-lark-icon-2",
            "group-data-[disabled]/input:text-lark-icon-disabled",
            iconSizeClasses[size],
          )}
        >
          {startIcon}
        </span>
      ) : null}

      <UiInput
        {...props}
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(inputBase, className)}
      />

      {endIcon ? (
        <span
          aria-hidden="true"
          className={cn(
            "flex shrink-0 items-center text-lark-icon-2",
            "group-data-[disabled]/input:text-lark-icon-disabled",
            iconSizeClasses[size],
          )}
        >
          {endIcon}
        </span>
      ) : null}

      {allowClear ? (
        <InputClear aria-label={clearLabel} className={clearButtonClass}>
          <XIcon size={clearIconSize[size]} />
        </InputClear>
      ) : null}
    </InputGroup>
  );
}

function NumberInput({
  size = "md",
  invalid = false,
  allowClear = false,
  clearLabel = "清除",
  dragIcon,
  startIcon,
  endIcon,
  dragLabel = "拖动调整数值",
  pixelsPerStep,
  className,
  groupClassName,
  ref,
  numeric: _numeric,
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  min,
  max,
  step,
  largeStep,
  smallStep,
  format,
  locale,
  wheel,
  disabled,
  readOnly,
  required,
  name,
  form,
  id,
  placeholder,
  autoFocus,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-errormessage": ariaErrorMessage,
}: InputNumberProps) {
  const [controller] = useState(() => createNumberInputController());
  const handleIcon = dragIcon ?? startIcon ?? <DragHandleIcon />;

  return (
    <UiNumberInput
      className="w-full min-w-0"
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      onValueCommit={onValueCommit}
      min={min}
      max={max}
      step={step}
      largeStep={largeStep}
      smallStep={smallStep}
      format={format}
      locale={locale}
      wheel={wheel}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      name={name}
      form={form}
      controller={controller}
    >
      <NumberInputGroup
        className={(state) =>
          cn(
            groupBase,
            sizeClasses[size],
            // UD paints the field's border primary for the whole interaction.
            state.scrubbing && "border-lark-primary",
            groupClassName,
          )
        }
        data-invalid={invalid ? "" : undefined}
      >
        {(state) => (
          <>
            <NumberInputScrubArea
              className={cn(
                "flex shrink-0 cursor-ew-resize items-center justify-center rounded",
                "text-lark-icon-2 transition-colors duration-100 ease-lark-linear",
                "hover:bg-[var(--lark-primary-fill-transparent-01)] hover:text-lark-primary-content",
                "active:bg-[var(--lark-primary-fill-transparent-03)]",
                "data-[scrubbing]:bg-[var(--lark-primary-fill-transparent-01)]",
                "data-[scrubbing]:text-lark-primary-content",
                "data-[disabled]:cursor-not-allowed data-[disabled]:text-lark-icon-disabled",
                "data-[disabled]:hover:bg-transparent data-[disabled]:hover:text-lark-icon-disabled",
                "data-[readonly]:cursor-default data-[readonly]:hover:bg-transparent",
                "data-[readonly]:hover:text-lark-icon-2",
                dragHandleClasses[size],
                iconSizeClasses[size],
              )}
              pixelsPerStep={pixelsPerStep}
              title={dragLabel}
            >
              {handleIcon}
              <NumberInputScrubAreaCursor className="text-lark-primary-content">
                {/* Center the glyph on the locked pointer, per the ui-sdk docs. */}
                <DragHandleIcon className="-ml-2 -mt-2" />
              </NumberInputScrubAreaCursor>
            </NumberInputScrubArea>

            <NumberInputControl
              ref={ref}
              id={id}
              placeholder={placeholder}
              autoFocus={autoFocus}
              onFocus={onFocus}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              onKeyUp={onKeyUp}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledBy}
              aria-describedby={ariaDescribedBy}
              aria-errormessage={ariaErrorMessage}
              aria-invalid={invalid || undefined}
              className={cn(inputBase, "h-full", className)}
            />

            {endIcon ? (
              <span
                aria-hidden="true"
                className={cn(
                  "flex shrink-0 items-center text-lark-icon-2",
                  "group-data-[disabled]/input:text-lark-icon-disabled",
                  iconSizeClasses[size],
                )}
              >
                {endIcon}
              </span>
            ) : null}

            {allowClear && state.value !== null && !state.disabled && !state.readOnly ? (
              <button
                type="button"
                aria-label={clearLabel}
                className={clearButtonClass}
                onClick={() => {
                  controller.setValue(null);
                  controller.focus();
                }}
              >
                <XIcon size={clearIconSize[size]} />
              </button>
            ) : null}
          </>
        )}
      </NumberInputGroup>
    </UiNumberInput>
  );
}
