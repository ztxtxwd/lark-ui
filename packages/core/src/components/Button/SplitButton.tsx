import { MenuTrigger as UiMenuTrigger } from "@ui-sdk/react/menu";
import type { ComponentProps, ReactNode, Ref } from "react";
import { ChevronDownIcon } from "../../icons";
import { cn } from "../../lib/cn";
import { Dropdown, DropdownContent, DropdownItem } from "../Dropdown";
import { Tooltip } from "../Tooltip";
import { Button, type ButtonProps, type ButtonSize, type ButtonTone } from "./Button";

export type SplitButtonVariant = "split" | "menu";
export type SplitButtonAppearance = "filled" | "outlined";

export type SplitButtonItem = {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
};

type DropdownStateProps = Pick<
  ComponentProps<typeof Dropdown>,
  "open" | "defaultOpen" | "onOpenChange"
>;

export type SplitButtonProps = DropdownStateProps & {
  /** The main action label; in `menu` variant it is the only label. */
  children: ReactNode;
  /** Secondary actions. They open from the right segment. */
  items: SplitButtonItem[];
  /**
   * `split` draws the UD 分割线 and keeps two hit areas; `menu` has no divider
   * and the whole button opens the menu.
   * @defaultValue "split"
   */
  variant?: SplitButtonVariant;
  appearance?: SplitButtonAppearance;
  tone?: ButtonTone;
  size?: ButtonSize;
  startIcon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
  /** Accessible name for the dropdown segment. */
  menuLabel?: string;
  /** Hover hint for the dropdown segment. Set false to skip the tooltip. */
  tooltip?: ReactNode | false;
  side?: "top" | "bottom";
  align?: "start" | "end";
  onClick?: ButtonProps["onClick"];
  onSelect?: (value: string) => void;
  className?: string;
  menuClassName?: string;
  ref?: Ref<HTMLButtonElement>;
};

const triggerWidth: Record<ButtonSize, string> = {
  xs: "w-6",
  sm: "w-7",
  md: "w-8",
  lg: "w-10",
  xl: "w-12",
};

/** Filled segments need a light divider; outlined segments already share the tone border. */
const filledDivider =
  "border-l-lark-on-primary hover:border-l-lark-on-primary focus-visible:border-l-lark-on-primary active:border-l-lark-on-primary aria-expanded:border-l-lark-on-primary";

const chevron = (
  <ChevronDownIcon
    aria-hidden="true"
    size={16}
    className="transition-transform duration-100 group-aria-expanded:rotate-180"
  />
);

/**
 * UD 分裂按钮 / 菜单按钮（Button_Split / Button_Menu）。
 *
 * - 分裂按钮：主操作和下拉菜单是两段独立热区，中间有一条通栏分割线。
 * - 菜单按钮：文字和箭头同属一个热区，点击整体打开菜单，没有分割线。
 *
 * 菜单行为由 ui-sdk 的 menu 提供：点击触发、方向键导航、Escape 关闭并把
 * 焦点还给触发按钮；打开期间 `aria-expanded` 让按钮保持交互态。
 */
export function SplitButton({
  children,
  items,
  variant = "split",
  appearance = "filled",
  tone = "primary",
  size = "md",
  startIcon,
  loading = false,
  disabled = false,
  block = false,
  menuLabel = "更多操作",
  tooltip,
  side = "bottom",
  align = "start",
  onClick,
  onSelect,
  className,
  menuClassName,
  ref,
  ...dropdownProps
}: SplitButtonProps) {
  const dropdownTrigger = (
    <UiMenuTrigger
      aria-label={menuLabel}
      disabled={disabled}
      render={
        <Button
          appearance={appearance}
          tone={tone}
          size={size}
          disabled={disabled}
          className={cn(
            "group -ml-px min-w-0 shrink-0 rounded-l-none px-0",
            triggerWidth[size],
            appearance === "filled" ? filledDivider : undefined,
          )}
        >
          {chevron}
        </Button>
      }
    />
  );
  const hint = tooltip === false ? null : (tooltip ?? menuLabel);

  return (
    <Dropdown {...dropdownProps} onSelect={onSelect}>
      {variant === "menu" ? (
        <UiMenuTrigger
          ref={ref}
          disabled={disabled}
          render={
            <Button
              appearance={appearance}
              tone={tone}
              size={size}
              startIcon={startIcon}
              endIcon={chevron}
              disabled={disabled}
              className={cn("group", block && "w-full", className)}
            >
              {children}
            </Button>
          }
        />
      ) : (
        <div className={cn("inline-flex items-stretch", block ? "flex w-full" : className)}>
          <Button
            ref={ref}
            appearance={appearance}
            tone={tone}
            size={size}
            startIcon={startIcon}
            loading={loading}
            disabled={disabled}
            onClick={onClick}
            className={cn("rounded-r-none", block && "flex-1")}
          >
            {children}
          </Button>
          {hint ? <Tooltip content={hint}>{dropdownTrigger}</Tooltip> : dropdownTrigger}
        </div>
      )}
      <DropdownContent side={side} align={align} className={menuClassName}>
        {items.map((item) => (
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
