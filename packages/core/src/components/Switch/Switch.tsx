import { SwitchThumb, Switch as UiSwitch } from "@ui-sdk/react/switch";
import type { ComponentProps, ReactNode } from "react";
import { SpinnerIcon } from "../../icons";
import { cn } from "../../lib/cn";

export type SwitchSize = "sm" | "md";

export type SwitchProps = Omit<ComponentProps<typeof UiSwitch>, "children" | "onCheckedChange"> & {
  size?: SwitchSize;
  loading?: boolean;
  children?: ReactNode;
  className?: string;
  onCheckedChange?: ComponentProps<typeof UiSwitch>["onCheckedChange"];
};

const trackSize: Record<SwitchSize, string> = {
  sm: "h-4 w-7",
  md: "h-[22px] w-10",
};

const thumbSize: Record<SwitchSize, string> = {
  sm: "left-0.5 size-3 data-[checked]:translate-x-3",
  md: "left-0.5 size-[18px] data-[checked]:translate-x-[18px]",
};

export function Switch({
  size = "md",
  loading = false,
  children,
  className,
  disabled,
  onCheckedChange,
  onClick,
  ...props
}: SwitchProps) {
  return (
    <label
      className={cn(
        "group/switch inline-flex cursor-pointer items-center gap-2 select-none",
        "text-lark-14 leading-[22px] text-lark-title",
        "has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:text-lark-disabled",
        className,
      )}
    >
      <UiSwitch
        {...props}
        disabled={disabled}
        onClick={loading ? (event) => event.preventDefault() : onClick}
        onCheckedChange={loading ? undefined : onCheckedChange}
        aria-busy={loading || undefined}
        data-loading={loading ? "" : undefined}
        className={cn(
          "relative inline-flex shrink-0 items-center rounded-full border-0 p-0",
          "bg-lark-border transition-colors duration-100 ease-lark-linear",
          "hover:data-[checked]:bg-lark-primary-hover",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
          "data-[checked]:bg-lark-primary",
          "data-[disabled]:cursor-not-allowed",
          "data-[checked]:data-[disabled]:bg-lark-primary-softer",
          "data-[disabled]:bg-lark-border-card",
          trackSize[size],
        )}
      >
        <SwitchThumb
          className={cn(
            "absolute top-1/2 flex -translate-y-1/2 items-center justify-center",
            "rounded-full bg-white text-lark-icon-disabled shadow-lark-1",
            "transition-[left,translate,background-color] duration-100 ease-[cubic-bezier(0.4,0.8,0.74,1)]",
            "data-[checked]:text-lark-primary-softer",
            "data-[disabled]:bg-white/60",
            thumbSize[size],
          )}
        >
          {loading ? <SpinnerIcon size={size === "sm" ? 8 : 14} /> : null}
        </SwitchThumb>
      </UiSwitch>

      {children ? <span>{children}</span> : null}
    </label>
  );
}
