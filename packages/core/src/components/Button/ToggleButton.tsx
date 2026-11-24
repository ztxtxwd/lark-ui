import { type ToggleState, Toggle as UiToggle } from "@ui-sdk/react/toggle";
import type { ComponentProps, ReactNode, Ref } from "react";
import { cn } from "../../lib/cn";
import {
  type ButtonAppearance,
  type ButtonShape,
  type ButtonSize,
  type ButtonTone,
  getButtonClassName,
} from "./Button";

type UiToggleProps = ComponentProps<typeof UiToggle>;

export type ToggleButtonProps = Omit<UiToggleProps, "children" | "className"> & {
  appearance?: ButtonAppearance;
  tone?: ButtonTone;
  size?: ButtonSize;
  shape?: ButtonShape;
  block?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children?: ReactNode;
  className?: string | ((state: ToggleState) => string | undefined);
  ref?: Ref<HTMLButtonElement>;
};

/**
 * UD 状态切换按钮（Button_Toggle）。
 *
 * 与 `Button selected` 的视觉一致，但按压状态交给 ui-sdk 的 `Toggle` 管理：
 * `aria-pressed` 自动维护，支持 `pressed` 受控、`defaultPressed` 非受控和
 * `onPressedChange`。基础、文字和图标三种外观都可以切换。
 */
export function ToggleButton({
  appearance = "outlined",
  tone = "primary",
  size = "md",
  shape = "default",
  block = false,
  startIcon,
  endIcon,
  className,
  children,
  ref,
  ...props
}: ToggleButtonProps) {
  return (
    <UiToggle
      {...props}
      ref={ref}
      className={(state) =>
        cn(
          getButtonClassName({ appearance, tone, size, shape, block }),
          typeof className === "function" ? className(state) : className,
        )
      }
    >
      {startIcon}
      {children}
      {endIcon}
    </UiToggle>
  );
}
