import { Tooltip } from "../tooltip";
import { cn } from "../../utils/cn";
import { IconContext } from "../../icons/phosphor";
import React, { useRef } from "react";
import { useMenuNavigation } from "./use-menu-navigation";

/** MenuBar variant definitions (currently empty, reserved for future additions). */
export const LARK_MENUBAR_VARIANTS = {
  // MenuBar currently has no variant options but structure is ready for future additions
} as const;

export const LARK_MENUBAR_DEFAULT_VARIANTS = {} as const;

// Derived types from LARK_MENUBAR_VARIANTS
export interface LarkMenuBarVariantsProps {}

export function menuBarVariants(_props: LarkMenuBarVariantsProps = {}) {
  return cn(
    // Base styles
    "flex rounded-lg border border-lark-recessed bg-lark-recessed pl-px shadow-lark-xs transition-colors",
  );
}

/** Props for an individual menu option within a MenuBar. */
type MenuOptionProps = {
  /** Icon element (typically from `@phosphor-icons/react`) rendered at 18px */
  icon: React.ReactNode;
  /** Unique identifier for the option (used when `optionIds` is true) */
  id?: number | string;
  /** Currently active value from the parent MenuBar */
  isActive?: number | boolean | string | undefined;
  /** Callback when this option is clicked */
  onClick: () => void;
  /** Tooltip text shown on hover */
  tooltip: string;
};

const MenuOption = ({
  icon,
  id,
  isActive,
  onClick,
  tooltip,
}: MenuOptionProps) => {
  const active = isActive === id;
  const button = (
    <button
      data-lark-component="MenuBar"
      data-lark-part="option"
      aria-label={tooltip}
      className={cn(
        "relative -ml-px flex h-full w-11 cursor-pointer items-center justify-center rounded-md border-none bg-lark-recessed first:rounded-l-lg last:rounded-r-lg",
        // Feishu eases the item colours over 100ms and nothing else.
        "transition-colors duration-100",
        // Feishu drops the focus outline entirely — the hovered fill doubles
        // as the focus indicator.
        "focus:outline-none focus-visible:outline-none",
        !active && "hover:bg-lark-fill-hover focus-visible:bg-lark-fill-hover",
        {
          // The selected item is the raised pill, the same one the segmented
          // Tabs draw as their indicator.
          "z-2 bg-lark-base shadow-lark-xs hover:bg-lark-base focus-visible:bg-lark-base":
            active,
        },
      )}
      onClick={onClick}
    >
      <IconContext.Provider value={{ size: 18 }}>{icon}</IconContext.Provider>
    </button>
  );

  return <Tooltip content={tooltip} render={button} />;
};

/**
 * MenuBar component props.
 *
 * Horizontal icon-button toolbar with keyboard navigation and tooltip labels.
 *
 * @deprecated Use `Tabs` with `variant="segmented"` instead. `MenuBar` will be removed in a future release.
 *
 * @example
 * ```tsx
 * <MenuBar
 *   isActive={activeIndex}
 *   options={[
 *     { icon: <ListIcon />, tooltip: "List view", onClick: () => setView("list") },
 *     { icon: <GridFourIcon />, tooltip: "Grid view", onClick: () => setView("grid") },
 *   ]}
 * />
 * ```
 */
type MenuBarProps = {
  /** Additional CSS classes merged via `cn()`. */
  className?: string;
  /** The currently active option value — matched against option index or `id`. */
  isActive: number | boolean | string | undefined;
  /** Array of menu option configurations. */
  options: MenuOptionProps[];
  /** When true, each option's `id` field is used for matching instead of its array index. */
  optionIds?: boolean;
};

/**
 * MenuBar — horizontal icon-button toolbar with keyboard arrow-key navigation.
 *
 * Each option renders as a `<button>` with a Tooltip. The active option is
 * visually highlighted with an elevated background.
 *
 * @deprecated Use `Tabs` with `variant="segmented"` instead. `MenuBar` will be removed in a future release.
 *
 * @example
 * ```tsx
 * <MenuBar
 *   isActive={0}
 *   options={[
 *     { icon: <ListIcon />, tooltip: "List", onClick: () => {} },
 *     { icon: <GridFourIcon />, tooltip: "Grid", onClick: () => {} },
 *   ]}
 * />
 * ```
 */
export const MenuBar = ({
  className,
  isActive,
  options,
  optionIds = false, // if option needs an extra unique ID
}: MenuBarProps) => {
  const menuRef = useRef<HTMLElement | null>(null);

  useMenuNavigation({ menuRef, direction: "horizontal" });

  return (
    <nav
      className={cn(
        "isolate flex rounded-lg bg-lark-recessed pl-px shadow-lark-xs ring ring-lark-line",
        // Feishu eases the bar's colours over 100ms and nothing else.
        "transition-colors duration-100",
        className,
      )}
      ref={menuRef}
    >
      {options.map((option, index) => (
        <MenuOption
          key={index}
          {...option}
          isActive={isActive}
          id={optionIds ? option.id : index}
        />
      ))}
    </nav>
  );
};
