import { RadioIndicator, Radio as UiRadio, RadioGroup as UiRadioGroup } from "@ui-sdk/react/radio";
import { type ComponentProps, type ReactNode, useId } from "react";
import { cn } from "../../lib/cn";

export type RadioGroupProps = ComponentProps<typeof UiRadioGroup> & {
  orientation?: "vertical" | "horizontal";
};

export function RadioGroup({ className, orientation = "vertical", ...props }: RadioGroupProps) {
  return (
    <UiRadioGroup
      {...props}
      className={cn(
        "flex",
        orientation === "vertical" ? "flex-col gap-2" : "flex-row flex-wrap gap-x-6 gap-y-2",
        className,
      )}
    />
  );
}

export type RadioProps = Omit<ComponentProps<typeof UiRadio>, "children"> & {
  children?: ReactNode;
  description?: ReactNode;
  className?: string;
};

export function Radio({
  children,
  description,
  className,
  disabled,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: RadioProps) {
  const descriptionId = useId();
  const labelId = useId();

  return (
    <label
      className={cn(
        "group/radio inline-flex min-h-[22px] cursor-pointer items-baseline gap-2",
        "text-lark-14 leading-[22px] text-lark-title select-none",
        "has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:text-lark-disabled",
        className,
      )}
    >
      <UiRadio
        {...props}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-describedby={description ? descriptionId : ariaDescribedBy}
        aria-labelledby={
          ariaLabelledBy ?? (children && ariaLabel === undefined ? labelId : undefined)
        }
        className={cn(
          "relative inline-flex size-4 shrink-0 translate-y-[3px] items-center justify-center",
          "rounded-full border border-solid border-lark-neutral-500 bg-lark-canvas",
          "transition-[background-color,border-color] duration-100 ease-lark-linear",
          "hover:border-lark-primary",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
          "data-[checked]:border-transparent data-[checked]:bg-lark-primary",
          "data-[checked]:hover:bg-lark-primary-hover",
          "data-[disabled]:cursor-not-allowed data-[disabled]:border-lark-neutral-400",
          "data-[disabled]:bg-lark-neutral-200 data-[disabled]:hover:border-lark-neutral-400",
          "data-[checked]:data-[disabled]:bg-lark-fill-disabled",
          "data-[checked]:data-[disabled]:border-transparent",
        )}
      >
        {/* Out of flow: an in-flow dot changes the button's baseline and drops the box on selection. */}
        <RadioIndicator className="pointer-events-none absolute inset-0 m-auto flex size-1.5 items-center justify-center">
          <span className="block size-1.5 rounded-full bg-white" />
        </RadioIndicator>
      </UiRadio>

      {children || description ? (
        <span className="flex min-w-0 flex-col">
          {children ? <span id={labelId}>{children}</span> : null}
          {description ? (
            <span
              id={descriptionId}
              className="text-lark-12 leading-5 text-lark-caption group-has-[[data-disabled]]/radio:text-lark-disabled"
            >
              {description}
            </span>
          ) : null}
        </span>
      ) : null}
    </label>
  );
}
