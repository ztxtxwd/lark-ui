import {
  NavigationMenu as UiNavigationMenu,
  NavigationMenuContent as UiNavigationMenuContent,
  NavigationMenuItem as UiNavigationMenuItem,
  NavigationMenuLink as UiNavigationMenuLink,
  NavigationMenuLinkIcon as UiNavigationMenuLinkIcon,
  NavigationMenuList as UiNavigationMenuList,
  NavigationMenuTrigger as UiNavigationMenuTrigger,
} from "@ui-sdk/react/navigation-menu";
import { type ComponentProps, type ReactNode, useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "../../icons";
import { cn } from "../../lib/cn";

export type NavigationMenuChildData = {
  key: string;
  label: ReactNode;
  href?: string;
  /** Optional secondary line in a dropdown panel. */
  description?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};

export type NavigationMenuItemData = {
  key: string;
  label: ReactNode;
  /** A plain link. Ignored when the item has children. */
  href?: string;
  disabled?: boolean;
  /** Child links render in a dropdown panel. */
  children?: NavigationMenuChildData[];
  /** Custom panel body. Wins over `children`. */
  content?: ReactNode;
};

type UiNavigationMenuProps = ComponentProps<typeof UiNavigationMenu>;

export type NavigationMenuProps = Omit<UiNavigationMenuProps, "children"> & {
  /** Top-level entries, left to right in horizontal navigation. */
  items: NavigationMenuItemData[];
  /** Controlled active entry. May be a top-level or a panel entry key. */
  activeKey?: string;
  /** Initially active entry, when uncontrolled. */
  defaultActiveKey?: string;
  /** Runs when a link or panel link is chosen. */
  onSelect?: (key: string) => void;
  /** Brand slot at the start of the bar. */
  brand?: ReactNode;
  /** Wraps the brand slot in a home link. */
  brandHref?: string;
  /** Accessible name of the brand link when it holds no text. */
  brandLabel?: string;
  /** Global actions at the end of the bar. */
  actions?: ReactNode;
  /** Accessible name of the navigation landmark. Defaults to `主导航`. */
  label?: string;
  /** Extra classes for the top-level list. */
  listClassName?: string;
};

const topItemStyles = cn(
  "group relative box-border flex shrink-0 cursor-pointer items-center gap-1 px-4",
  "border-0 bg-transparent font-normal no-underline outline-none",
  "transition-colors duration-100 ease-lark-linear",
  "hover:text-lark-primary-content",
  "data-[active]:font-medium data-[active]:text-lark-primary-content",
  "focus-visible:outline-solid focus-visible:outline-2",
  "focus-visible:outline-offset-[-2px] focus-visible:outline-lark-primary",
  "data-[disabled]:cursor-not-allowed data-[disabled]:text-lark-disabled",
);

const horizontalItemStyles = cn(
  topItemStyles,
  "h-14 text-lark-16 text-lark-title",
  "after:pointer-events-none after:absolute after:inset-x-4 after:bottom-0 after:h-[3px] after:rounded-full",
  "after:bg-lark-primary-content after:opacity-0 after:transition-opacity after:duration-100",
  "after:content-[''] data-[active]:after:opacity-100",
);

const verticalItemStyles = cn(
  topItemStyles,
  "h-10 w-full rounded-lark-md px-4 text-lark-14 text-lark-title",
  "hover:bg-lark-hover",
  "data-[active]:bg-[var(--lark-primary-fill-transparent-02)]",
  "before:pointer-events-none before:absolute before:bottom-2 before:left-0 before:top-2 before:w-[3px]",
  "before:rounded-full before:bg-lark-primary-content before:opacity-0 before:content-['']",
  "data-[active]:before:opacity-100",
);

const panelStyles = cn(
  "z-50 w-[200px] rounded-lark-lg border border-solid border-lark-border-card bg-lark-float p-2",
  "text-lark-title shadow-lark-4 outline-none",
  "origin-(--transform-origin) transition-[opacity,scale] duration-100 ease-lark",
  "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
  "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
);

const childLinkStyles = cn(
  "relative flex min-h-10 w-full flex-col justify-center gap-0.5 rounded-lark-md px-3 py-2",
  "text-lark-14 text-lark-title no-underline outline-none transition-colors duration-100 ease-lark-linear",
  "hover:bg-lark-hover",
  "focus-visible:outline-solid focus-visible:outline-2",
  "focus-visible:outline-offset-[-2px] focus-visible:outline-lark-primary",
  "data-[current]:bg-[var(--lark-primary-fill-transparent-01)] data-[current]:text-lark-primary-content",
  "dark:data-[current]:text-[var(--lark-primary-content-pressed)]",
  "data-[disabled]:cursor-not-allowed data-[disabled]:text-lark-disabled",
);

function isActiveBranch(item: NavigationMenuItemData, activeKey: string | undefined): boolean {
  if (activeKey === undefined) {
    return false;
  }
  if (item.key === activeKey) {
    return true;
  }
  return item.children?.some((child) => child.key === activeKey) ?? false;
}

/**
 * The UD navigation menu: a 56px top bar (or a 240px sidebar) built on the
 * ui-sdk navigation menu. Top-level entries are links or dropdown triggers with
 * hover intent; the active entry gets a 3px primary indicator, and a sibling
 * panel link marks its branch active.
 */
export function NavigationMenu({
  items,
  activeKey,
  defaultActiveKey,
  onSelect,
  brand,
  brandHref,
  brandLabel,
  actions,
  label,
  orientation = "horizontal",
  className,
  listClassName,
  "aria-label": ariaLabel,
  ...props
}: NavigationMenuProps) {
  const [internalActive, setInternalActive] = useState<string | undefined>(defaultActiveKey);
  const currentKey = activeKey ?? internalActive;
  const vertical = orientation === "vertical";

  const select = (key: string) => {
    if (activeKey === undefined) {
      setInternalActive(key);
    }
    onSelect?.(key);
  };

  const brandContent =
    brand === undefined ? null : brandHref === undefined ? (
      <div className="flex min-w-0 items-center">{brand}</div>
    ) : (
      <a
        href={brandHref}
        aria-label={brandLabel}
        className={cn(
          "flex min-w-0 items-center rounded-sm text-lark-title no-underline outline-none",
          "focus-visible:outline-solid focus-visible:outline-2",
          "focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
        )}
      >
        {brand}
      </a>
    );

  const renderPanel = (item: NavigationMenuItemData) => {
    if (item.content !== undefined) {
      return item.content;
    }

    return (
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
        {item.children?.map((child) => (
          <li key={child.key} className="m-0 min-w-0 p-0">
            <UiNavigationMenuLink
              href={child.href}
              // An entry without an href is an action, not a destination. A
              // bare <a> has no href and therefore no tab stop, so render a
              // button to keep it reachable by keyboard.
              render={child.href === undefined ? <button type="button" /> : undefined}
              current={currentKey === child.key}
              aria-disabled={child.disabled === true ? true : undefined}
              data-disabled={child.disabled === true ? "" : undefined}
              tabIndex={child.disabled === true ? -1 : undefined}
              onClick={(event) => {
                if (child.disabled === true) {
                  event.preventDefault();
                  return;
                }
                select(child.key);
              }}
              className={childLinkStyles}
            >
              <span className="flex min-w-0 items-center gap-2">
                {child.icon !== undefined ? (
                  <UiNavigationMenuLinkIcon className="flex size-4 shrink-0 items-center justify-center text-lark-icon-2">
                    {child.icon}
                  </UiNavigationMenuLinkIcon>
                ) : null}
                <span className="truncate">{child.label}</span>
              </span>
              {child.description !== undefined ? (
                <span className="truncate text-lark-12 text-lark-caption">{child.description}</span>
              ) : null}
            </UiNavigationMenuLink>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <UiNavigationMenu
      {...props}
      orientation={orientation}
      aria-label={ariaLabel ?? label ?? "主导航"}
      className={(state) =>
        cn(
          "block bg-lark-canvas text-lark-title",
          vertical ? "w-[240px]" : "w-full",
          typeof className === "function" ? className(state) : className,
        )
      }
    >
      <div
        className={cn(
          vertical ? "flex w-full flex-col" : "flex h-14 w-full items-center gap-10 px-6",
        )}
      >
        {brandContent !== null ? (
          <div className={cn("flex shrink-0 items-center", vertical ? "h-16 px-4" : "h-14")}>
            {brandContent}
          </div>
        ) : null}

        <UiNavigationMenuList
          className={cn(
            "m-0 list-none p-0",
            vertical ? "flex w-full flex-col gap-1 px-2 py-2" : "flex items-stretch",
            listClassName,
          )}
        >
          {items.map((item) => {
            const active = isActiveBranch(item, currentKey);
            const hasPanel = item.children !== undefined && item.children.length > 0;

            if (hasPanel || item.content !== undefined) {
              return (
                <UiNavigationMenuItem key={item.key} value={item.key} className="relative flex">
                  <UiNavigationMenuTrigger
                    disabled={item.disabled}
                    aria-current={active ? "true" : undefined}
                    data-active={active ? "" : undefined}
                    className={vertical ? verticalItemStyles : horizontalItemStyles}
                  >
                    <span className={cn("truncate", !vertical && "max-w-[320px]")}>
                      {item.label}
                    </span>
                    {vertical ? (
                      <ChevronRightIcon
                        size={16}
                        className="shrink-0 text-lark-icon-3 transition-colors duration-100 ease-lark-linear group-hover:text-lark-primary-content group-data-[active]:text-lark-primary-content"
                      />
                    ) : (
                      <ChevronDownIcon
                        size={16}
                        className="shrink-0 text-lark-icon-3 transition-[color,transform] duration-100 ease-lark-linear group-hover:text-lark-primary-content group-data-[active]:text-lark-primary-content group-data-[open]:rotate-180"
                      />
                    )}
                  </UiNavigationMenuTrigger>
                  <UiNavigationMenuContent sideOffset={8} className={panelStyles}>
                    {renderPanel(item)}
                  </UiNavigationMenuContent>
                </UiNavigationMenuItem>
              );
            }

            return (
              <UiNavigationMenuItem key={item.key} value={item.key} className="flex">
                <UiNavigationMenuLink
                  href={item.href}
                  // See the panel link above: without an href the entry is an
                  // action and needs button semantics to enter the tab order.
                  render={item.href === undefined ? <button type="button" /> : undefined}
                  current={active}
                  aria-disabled={item.disabled === true ? true : undefined}
                  data-active={active ? "" : undefined}
                  data-disabled={item.disabled === true ? "" : undefined}
                  tabIndex={item.disabled === true ? -1 : undefined}
                  onClick={(event) => {
                    if (item.disabled === true) {
                      event.preventDefault();
                      return;
                    }
                    select(item.key);
                  }}
                  className={vertical ? verticalItemStyles : horizontalItemStyles}
                >
                  <span className={cn("truncate", !vertical && "max-w-[320px]")}>{item.label}</span>
                </UiNavigationMenuLink>
              </UiNavigationMenuItem>
            );
          })}
        </UiNavigationMenuList>

        {actions !== undefined ? (
          <div
            className={cn(
              "flex shrink-0 items-center gap-2",
              vertical ? "mt-auto px-3 py-3" : "ml-auto pl-10",
            )}
          >
            {actions}
          </div>
        ) : null}
      </div>
    </UiNavigationMenu>
  );
}
