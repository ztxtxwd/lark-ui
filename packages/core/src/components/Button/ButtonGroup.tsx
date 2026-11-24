import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export type ButtonGroupOrientation = "horizontal" | "vertical";
export type ButtonGroupSpacing = "sm" | "md" | "lg";

/** UD button group spacing: 8px with small buttons, 12px with medium, 16px in toolbars. */
const spacingClass: Record<ButtonGroupSpacing, string> = {
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
};

export type ButtonGroupProps = ComponentProps<"div"> & {
  orientation?: ButtonGroupOrientation;
  spacing?: ButtonGroupSpacing;
};

/**
 * UD 按钮组（ButtonGroup）。
 *
 * 只是布局容器：同组按钮共享 8 / 12 / 16px 间距；纵向排列时按钮拉伸到等宽。
 * 分组写作 `role="group"`，请通过 `aria-label` 给按钮组一个名称。
 */
export function ButtonGroup({
  orientation = "horizontal",
  spacing = "md",
  className,
  ...props
}: ButtonGroupProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: a layout group of buttons, not a form fieldset
    <div
      role="group"
      {...props}
      className={cn(
        "inline-flex",
        orientation === "vertical" ? "flex-col items-stretch" : "flex-row items-center flex-wrap",
        spacingClass[spacing],
        className,
      )}
    />
  );
}
