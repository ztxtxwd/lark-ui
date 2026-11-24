import { MenuTrigger as UiMenuTrigger } from "@ui-sdk/react/menu";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Dropdown, DropdownContent, DropdownItem } from "../Dropdown";
import { Tooltip } from "../Tooltip";
import { Button, type ButtonProps } from "./Button";

export type FloatButtonTone = "primary" | "neutral";
export type FloatButtonSize = "sm" | "md" | "lg";
export type FloatButtonShape = "circle" | "round";
export type FloatButtonPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";

export type FloatButtonItem = {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
};

export type FloatButtonProps = Omit<
  ButtonProps,
  "appearance" | "tone" | "size" | "shape" | "block" | "startIcon" | "endIcon"
> & {
  /**
   * 主要悬浮（Primary，蓝底白图标）或次要悬浮（Secondary，浮层底色 + 图标色）。
   * @defaultValue "primary"
   */
  tone?: FloatButtonTone;
  /** UD 悬浮按钮尺寸：36 / 40 / 48px。 */
  size?: FloatButtonSize;
  /** 圆形图标按钮，或带文字的圆角矩形（官网样式）。 */
  shape?: FloatButtonShape;
  /** 放在浏览器视口四角；仅在 `fixed` 时生效。 */
  position?: FloatButtonPosition;
  /** 固定在视口中，滚动不移动。 */
  fixed?: boolean;
  /** 图标按钮的悬停提示；菜单模式下默认用 `menuLabel`。 */
  tooltip?: ReactNode | false;
  /** 菜单模式：点击展开同类操作。省略时是单操作悬浮按钮。 */
  items?: FloatButtonItem[];
  onSelect?: (value: string) => void;
  menuLabel?: string;
  menuClassName?: string;
};

/** 36 / 40 / 48px，对应 Button 的 sm / lg / xl 度量后再覆盖。 */
const sizeMetrics: Record<
  FloatButtonSize,
  { button: "sm" | "lg" | "xl"; icon: string; pill: string }
> = {
  sm: { button: "sm", icon: "size-9 p-0", pill: "h-9 min-w-0 px-3 text-lark-12" },
  md: { button: "lg", icon: "size-10 p-0", pill: "h-10 min-w-0 px-4 text-lark-14" },
  lg: { button: "xl", icon: "size-12 p-0", pill: "h-12 min-w-0 px-4 text-lark-16" },
};

const positionClass: Record<FloatButtonPosition, string> = {
  "bottom-right": "bottom-6 right-6",
  "bottom-left": "bottom-6 left-6",
  "top-right": "top-6 right-6",
  "top-left": "top-6 left-6",
};

/**
 * UD 悬浮按钮（Button_Float）。
 *
 * 固定在页面某处、高程高于内容并带阴影；主要悬浮用蓝色，次要悬浮用浮层底色。
 * 支持单操作、Tooltip，以及两种菜单模式：点击展开一组同类操作。图标按钮请提供
 * `aria-label`（或 `tooltip` + `menuLabel`）作为可访问名称。
 */
export function FloatButton({
  tone = "primary",
  size = "md",
  shape = "circle",
  position = "bottom-right",
  fixed = false,
  tooltip,
  items,
  onSelect,
  menuLabel = "更多操作",
  menuClassName,
  className,
  children,
  disabled = false,
  ...props
}: FloatButtonProps) {
  const metrics = sizeMetrics[size];
  const menuMode = Boolean(items && items.length > 0);

  const visual = cn(
    "shadow-lark-3",
    shape === "circle" ? metrics.icon : metrics.pill,
    tone === "primary" ? undefined : "border-lark-border-card bg-lark-float text-lark-icon-1",
    fixed && cn("fixed z-50", positionClass[position]),
    className,
  );

  const surface = (
    <Button
      {...props}
      appearance={tone === "primary" ? "filled" : "outlined"}
      tone={tone === "primary" ? "primary" : "neutral"}
      size={metrics.button}
      shape={shape}
      disabled={disabled}
      className={visual}
    >
      {children}
    </Button>
  );

  if (!menuMode) {
    return tooltip ? <Tooltip content={tooltip}>{surface}</Tooltip> : surface;
  }

  const menuSide = position.startsWith("bottom") ? "top" : "bottom";
  const menuAlign = position.endsWith("right") ? "end" : "start";
  const hint = tooltip === false ? null : (tooltip ?? menuLabel);

  const trigger = <UiMenuTrigger aria-label={menuLabel} disabled={disabled} render={surface} />;

  return (
    <Dropdown onSelect={onSelect}>
      {hint ? <Tooltip content={hint}>{trigger}</Tooltip> : trigger}
      <DropdownContent side={menuSide} align={menuAlign} className={menuClassName}>
        {(items ?? []).map((item) => (
          <DropdownItem
            key={item.value}
            value={item.value}
            icon={item.icon}
            disabled={item.disabled}
            danger={item.danger}
          >
            {item.label}
          </DropdownItem>
        ))}
      </DropdownContent>
    </Dropdown>
  );
}
