import { CheckboxIndicator, Checkbox as UiCheckbox } from "@ui-sdk/react/checkbox";
import { type ComponentProps, type ReactNode, type Ref, useId } from "react";
import { CheckIcon, MinusIcon } from "../../icons";
import { cn } from "../../lib/cn";

export type CheckboxProps = Omit<ComponentProps<typeof UiCheckbox>, "children" | "ref"> & {
  children?: ReactNode;
  description?: ReactNode;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
};

export function Checkbox({
  children,
  description,
  className,
  disabled,
  ref,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: CheckboxProps) {
  const descriptionId = useId();
  const labelId = useId();

  return (
    <label
      className={cn(
        "group/checkbox inline-flex min-h-[22px] cursor-pointer items-baseline gap-2",
        "text-lark-14 leading-[22px] text-lark-title select-none",
        "has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:text-lark-disabled",
        className,
      )}
    >
      <UiCheckbox
        {...props}
        ref={ref}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-describedby={description ? descriptionId : ariaDescribedBy}
        aria-labelledby={
          ariaLabelledBy ?? (children && ariaLabel === undefined ? labelId : undefined)
        }
        className={cn(
          "relative inline-flex size-4 shrink-0 translate-y-[3px] items-center justify-center",
          "rounded-[4px] border border-solid border-lark-neutral-500 bg-lark-canvas text-white",
          "transition-[background-color,border-color] duration-100 ease-lark-linear",
          "hover:border-lark-primary",
          "focus-visible:border-lark-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
          "data-[checked]:border-transparent data-[checked]:bg-lark-primary",
          "data-[checked]:hover:bg-lark-primary-hover",
          "data-[indeterminate]:border-transparent data-[indeterminate]:bg-lark-primary",
          "data-[indeterminate]:hover:bg-lark-primary-hover",
          "data-[disabled]:cursor-not-allowed data-[disabled]:border-lark-neutral-400",
          "data-[disabled]:bg-lark-neutral-200 data-[disabled]:hover:border-lark-neutral-400",
          "data-[checked]:data-[disabled]:border-lark-fill-disabled",
          "data-[checked]:data-[disabled]:bg-lark-fill-disabled",
          "data-[indeterminate]:data-[disabled]:border-lark-fill-disabled",
          "data-[indeterminate]:data-[disabled]:bg-lark-fill-disabled",
        )}
      >
        {/* Out of flow: an in-flow indicator changes the button's baseline and drops the box on check. */}
        <CheckboxIndicator className="pointer-events-none absolute inset-0 m-auto flex size-3 items-center justify-center [&_svg]:size-3">
          {(state: { indeterminate: boolean }) =>
            state.indeterminate ? <MinusIcon /> : <CheckIcon />
          }
        </CheckboxIndicator>
      </UiCheckbox>

      {children || description ? (
        <span className="flex min-w-0 flex-col">
          {children ? <span id={labelId}>{children}</span> : null}
          {description ? (
            <span
              id={descriptionId}
              className="text-lark-12 leading-5 text-lark-caption group-has-[[data-disabled]]/checkbox:text-lark-disabled"
            >
              {description}
            </span>
          ) : null}
        </span>
      ) : null}
    </label>
  );
}
