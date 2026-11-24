import {
  type MenuContentState,
  type MenuContextTriggerState,
  type MenuItemState,
  type MenuSubProps,
  type MenuTriggerState,
  Menu as UiMenu,
  MenuContent as UiMenuContent,
  MenuContextTrigger as UiMenuContextTrigger,
  MenuGroup as UiMenuGroup,
  MenuGroupLabel as UiMenuGroupLabel,
  MenuItem as UiMenuItem,
  MenuItemIcon as UiMenuItemIcon,
  type MenuProps as UiMenuProps,
  MenuSeparator as UiMenuSeparator,
  MenuSub as UiMenuSub,
  MenuSubTrigger as UiMenuSubTrigger,
  MenuTrigger as UiMenuTrigger,
} from "@ui-sdk/react/menu";
import type { ComponentProps, ReactNode } from "react";
import { CheckIcon, ChevronRightIcon } from "../../icons";
import { cn } from "../../lib/cn";

export type DropdownProps = UiMenuProps & {
  /** Runs with the chosen item's value, in addition to the ui-sdk `onAction`. */
  onSelect?: (value: string) => void;
};

type StateClassName<State> = string | ((state: State) => string | undefined);

function classNameOf<State>(className: StateClassName<State> | undefined, state: State) {
  return typeof className === "function" ? className(state) : className;
}

const dropdownSurface = cn(
  "z-50 flex max-h-[480px] w-max min-w-[55px] max-w-[420px] flex-col",
  "overflow-x-hidden overflow-y-auto rounded-lark-lg border border-solid border-lark-border-card",
  "bg-lark-float p-1 text-lark-title shadow-lark-4 outline-none",
  "origin-(--transform-origin) transition-[opacity,scale] duration-100 ease-lark",
  "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
  "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
);

const triggerBase = cn(
  "relative box-border h-7 shrink-0 cursor-pointer select-none items-center gap-1",
  "rounded-lark-md border-0 bg-transparent px-2 text-lark-14 leading-[22px] text-lark-title",
  "outline-none transition-colors duration-100 ease-lark-linear",
  "hover:bg-[var(--lark-fill-hover)] focus-visible:bg-[var(--lark-fill-hover)]",
  "focus-visible:outline-solid focus-visible:outline-2",
  "focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
  "data-[disabled]:cursor-not-allowed data-[disabled]:text-lark-disabled",
  "data-[disabled]:hover:bg-transparent",
);

const itemBase = cn(
  "group/item flex min-h-7 cursor-pointer select-none items-center gap-2 rounded-lark-sm",
  "px-2 py-1 text-lark-14 leading-5 text-lark-title outline-none",
  "transition-colors duration-100 ease-lark-linear",
  "hover:bg-[var(--lark-fill-hover)] focus-visible:bg-[var(--lark-fill-hover)]",
  "data-[highlighted]:bg-[var(--lark-fill-hover)]",
  "data-[disabled]:cursor-not-allowed data-[disabled]:text-lark-disabled",
  "data-[destructive]:text-lark-danger-strong data-[destructive]:hover:bg-lark-danger-soft dark:data-[destructive]:text-[var(--lark-danger-content-pressed)]",
  "data-[pending]:cursor-progress",
  "[&_[data-slot='menu-shortcut']]:ml-auto [&_[data-slot='menu-shortcut']]:shrink-0",
  "[&_[data-slot='menu-shortcut']]:pl-4 [&_[data-slot='menu-shortcut']]:text-lark-12",
  "[&_[data-slot='menu-shortcut']]:leading-5 [&_[data-slot='menu-shortcut']]:text-lark-caption",
);

const itemIcon = cn(
  "flex size-4 shrink-0 items-center justify-center text-lark-icon-2 [&_svg]:size-4",
  "group-data-[disabled]/item:text-lark-icon-disabled",
  "group-data-[destructive]/item:text-lark-danger-strong dark:group-data-[destructive]/item:text-[var(--lark-danger-content-pressed)]",
);

/** A list of actions opened from a trigger. */
export function Dropdown({ onSelect, onAction, ...props }: DropdownProps) {
  return (
    <UiMenu
      {...props}
      onAction={(value, details) => {
        onSelect?.(value);
        return onAction?.(value, details);
      }}
    />
  );
}

export type DropdownTriggerProps = Omit<ComponentProps<typeof UiMenuTrigger>, "className"> & {
  className?: StateClassName<MenuTriggerState>;
  /**
   * Keeps the trigger inline with surrounding text. Set false for a full-width
   * trigger whose content is spaced to both edges.
   * @defaultValue true
   */
  inline?: boolean;
};

/** The button that opens the dropdown. Pass `render` to use a Button or icon button. */
export function DropdownTrigger({ inline = true, className, ...props }: DropdownTriggerProps) {
  return (
    <UiMenuTrigger
      {...props}
      className={(state) =>
        cn(
          triggerBase,
          inline ? "inline-flex" : "flex w-full justify-between",
          classNameOf(className, state),
        )
      }
    />
  );
}

/**
 * An area that opens the dropdown on right-click, long press or Shift+F10.
 * It is a tab stop by default so the keyboard shortcuts can reach it.
 */
export type DropdownContextTriggerProps = Omit<
  ComponentProps<typeof UiMenuContextTrigger>,
  "className"
> & {
  className?: StateClassName<MenuContextTriggerState>;
};

export function DropdownContextTrigger({
  className,
  // ui-sdk opens the menu from the focused area on Shift+F10 or the context
  // menu key, so the area has to be a tab stop. Consumers can opt out or place
  // it in their own roving tab order.
  tabIndex = 0,
  ...props
}: DropdownContextTriggerProps) {
  return (
    <UiMenuContextTrigger
      {...props}
      tabIndex={tabIndex}
      className={(state) =>
        cn(
          "outline-none focus-visible:outline-solid focus-visible:outline-2",
          "focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
          classNameOf(className, state),
        )
      }
    />
  );
}

export type DropdownContentProps = Omit<ComponentProps<typeof UiMenuContent>, "className"> & {
  className?: StateClassName<MenuContentState>;
};

/** The floating menu surface: 4px padding, 8px radius, shadow s4, 480px max height. */
export function DropdownContent({
  align = "start",
  sideOffset = 4,
  collisionPadding = 16,
  className,
  ...props
}: DropdownContentProps) {
  // `side` is left to ui-sdk: it opens a root menu below the trigger and a
  // submenu at the inline end, which also mirrors in right-to-left text.
  return (
    <UiMenuContent
      {...props}
      align={align}
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={(state) => cn(dropdownSurface, classNameOf(className, state))}
    />
  );
}

export type DropdownItemProps = Omit<
  ComponentProps<typeof UiMenuItem>,
  "children" | "className" | "destructive"
> & {
  children?: ReactNode;
  className?: StateClassName<MenuItemState>;
  /** A leading icon, 16px or smaller. */
  icon?: ReactNode;
  /** Shows a trailing check for the current choice. The action still closes the menu. */
  selected?: boolean;
  /** Keeps the menu open after the item runs. */
  keepOpen?: boolean;
  /** Styles the item as a dangerous action. */
  danger?: boolean;
  /** Alias of `danger`, matching the ui-sdk menu part. */
  destructive?: boolean;
};

/** A single action. Pressing it closes the dropdown unless `keepOpen` is set. */
export function DropdownItem({
  icon,
  selected = false,
  keepOpen = false,
  danger = false,
  destructive = false,
  className,
  children,
  closeOnSelect,
  shortcut,
  ...props
}: DropdownItemProps) {
  return (
    <UiMenuItem
      {...props}
      shortcut={shortcut}
      destructive={danger || destructive}
      closeOnSelect={keepOpen ? false : closeOnSelect}
      className={(state) => cn(itemBase, classNameOf(className, state))}
    >
      {icon !== undefined ? <UiMenuItemIcon className={itemIcon}>{icon}</UiMenuItemIcon> : null}
      <span className="min-w-0 flex-1 truncate text-left">{children}</span>
      {selected ? (
        <span
          data-slot="dropdown-item-check"
          aria-hidden="true"
          className="ml-auto flex shrink-0 items-center text-lark-primary-content"
        >
          <CheckIcon size={14} />
        </span>
      ) : null}
    </UiMenuItem>
  );
}

export type DropdownSeparatorProps = Omit<ComponentProps<typeof UiMenuSeparator>, "className"> & {
  className?: string;
};

/** A full-width divider between groups of actions, with 4px above and below. */
export function DropdownSeparator({ className, ...props }: DropdownSeparatorProps) {
  return (
    <UiMenuSeparator {...props} className={cn("-mx-1 my-1 h-px bg-lark-divider", className)} />
  );
}

export type DropdownGroupProps = Omit<ComponentProps<typeof UiMenuGroup>, "className"> & {
  className?: string;
};

/** Groups related items and names them with `DropdownGroupLabel`. */
export function DropdownGroup({ className, ...props }: DropdownGroupProps) {
  return <UiMenuGroup {...props} className={cn("flex flex-col", className)} />;
}

export type DropdownGroupLabelProps = Omit<ComponentProps<typeof UiMenuGroupLabel>, "className"> & {
  className?: string;
};

/** The heading that names a `DropdownGroup`. */
export function DropdownGroupLabel({ className, ...props }: DropdownGroupLabelProps) {
  return (
    <UiMenuGroupLabel
      {...props}
      className={cn("px-2 py-1 text-lark-12 leading-5 text-lark-caption", className)}
    />
  );
}

export type DropdownSubmenuProps = MenuSubProps;

/** A submenu. Put a `DropdownSubmenuTrigger` and `DropdownSubmenuContent` inside. */
export function DropdownSubmenu(props: DropdownSubmenuProps) {
  return <UiMenuSub {...props} />;
}

export type DropdownSubmenuTriggerProps = Omit<
  ComponentProps<typeof UiMenuSubTrigger>,
  "children" | "className"
> & {
  children?: ReactNode;
  className?: StateClassName<MenuTriggerState>;
  icon?: ReactNode;
};

/** The parent item that opens its submenu on hover or ArrowRight. */
export function DropdownSubmenuTrigger({
  icon,
  className,
  children,
  ...props
}: DropdownSubmenuTriggerProps) {
  return (
    <UiMenuSubTrigger
      {...props}
      className={(state) => cn(itemBase, "justify-between", classNameOf(className, state))}
    >
      {icon !== undefined ? (
        <span aria-hidden="true" className={itemIcon}>
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1 truncate text-left">{children}</span>
      <ChevronRightIcon size={14} className="shrink-0 text-lark-icon-3 rtl:-scale-x-100" />
    </UiMenuSubTrigger>
  );
}

export type DropdownSubmenuContentProps = DropdownContentProps;

/**
 * The submenu surface. Opens at the inline end, flush with its parent menu, so
 * it mirrors to the left in right-to-left text. Its top edge lines up with the
 * parent item, as in UD, rather than with the first child item.
 */
export function DropdownSubmenuContent({
  align = "start",
  alignOffset = 0,
  sideOffset = 0,
  ...props
}: DropdownSubmenuContentProps) {
  return (
    <DropdownContent align={align} alignOffset={alignOffset} sideOffset={sideOffset} {...props} />
  );
}
