import { Menu as DropdownMenuPrimitive } from "@base-ui/react/menu";
import * as React from "react";
import { cn } from "../../utils/cn";
import { resolveVariant } from "../../utils/resolve-variant";
import { useLinkComponent } from "../../utils/link-provider";
import {
  usePortalContainer,
  type PortalContainer,
} from "../../utils/portal-provider";
import {
  CaretRightIcon as CaretRight,
  CheckIcon,
  CheckIcon as Check,
  type Icon,
} from "../../icons/phosphor";

/** Dropdown item variant definitions (default and danger styles). */
export const LARK_DROPDOWN_VARIANTS = {
  variant: {
    default: {
      classes: "",
      description: "Default dropdown item appearance",
    },
    danger: {
      classes:
        "text-lark-danger data-highlighted:bg-lark-danger/5 data-highlighted:text-lark-danger active:bg-lark-danger/10",
      description: "Destructive action item",
    },
  },
} as const;

export const LARK_DROPDOWN_DEFAULT_VARIANTS = {
  variant: "default",
} as const;

// Derived types from LARK_DROPDOWN_VARIANTS
export type LarkDropdownVariant = keyof typeof LARK_DROPDOWN_VARIANTS.variant;

export interface LarkDropdownVariantsProps {
  /**
   * Visual style of the dropdown item.
   * - `"default"` — Standard item appearance
   * - `"danger"` — Destructive action with red text
   * @default "default"
   */
  variant?: LarkDropdownVariant;
}

export function dropdownVariants({
  variant = LARK_DROPDOWN_DEFAULT_VARIANTS.variant,
}: LarkDropdownVariantsProps = {}) {
  return cn(
    resolveVariant(
      LARK_DROPDOWN_VARIANTS.variant,
      variant,
      LARK_DROPDOWN_DEFAULT_VARIANTS.variant,
    ).classes,
  );
}

/**
 * Renders a menu row icon inside an icon slot. Spacing comes from the row's
 * `gap-2`, so Phosphor components and pre-rendered elements are laid out
 * identically. The slot also lets icon-less rows detect that a sibling has an
 * icon and inset themselves to keep the text aligned.
 */
const renderIconNode = (IconComponent?: Icon | React.ReactNode) => {
  if (!IconComponent) return null;
  let icon: React.ReactNode;
  if (React.isValidElement<{ className?: string }>(IconComponent)) {
    icon = React.cloneElement(IconComponent, {
      className: cn("h-4 w-4", IconComponent.props.className),
    });
  } else {
    const Comp = IconComponent as React.ComponentType<Record<string, unknown>>;
    icon = <Comp className="h-4 w-4" />;
  }
  return (
    <span
      data-lark-part="icon"
      // Feishu `ud__menu-normal-icon-wrap`: a 16px glyph in the caption
      // colour, 8px to the right of the label.
      className="inline-flex shrink-0 items-center text-lg text-lark-subtle"
    >
      {icon}
    </span>
  );
};

/**
 * Insets a row without an icon when another row in the same popup has one,
 * so the text of every row lines up. Same result as the `inset` prop.
 */
const autoInsetClasses =
  "group-has-[[data-lark-part=icon]]/menu:not-has-[[data-lark-part=icon]]:pl-8";

/**
 * Shared layout and interaction styles for every selectable menu row
 * (Item, LinkItem, SubTrigger, CheckboxItem, RadioItem) so they highlight
 * with the same colour, radius and state.
 *
 * Feishu `ud__menu-normal-item`: 4px radius, 4px/8px padding, a 3px/1px
 * margin inside the popup, `--fill-hover` on hover/highlight, `--text-disabled`
 * and `cursor: not-allowed` when disabled, and no focus ring — the
 * highlighted background doubles as the focus indicator.
 */
const menuRowClasses = cn(
  "relative mx-[3px] my-px flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-base outline-hidden select-none", // base styles
  "transition-colors", // Feishu transitions colour over 100ms
  "data-highlighted:bg-lark-fill-hover", // highlight state (hover + keyboard focus)
  "active:bg-lark-fill-pressed", // pressed state (Feishu `--fill-pressed`)
  "data-disabled:cursor-not-allowed data-disabled:text-lark-inactive", // disabled state
  autoInsetClasses,
);

/** Matches the `py-0.5` padding on the menu popup. */
const POPUP_PADDING = 2;

type PositionerSide = DropdownMenuPrimitive.Positioner.Props["side"];

function isBlockSide(side: PositionerSide) {
  return side === "top" || side === "bottom";
}

/**
 * Submenu offsets, as functions of the resolved side (the pattern Base UI's
 * submenu demo uses). Beside the trigger, the submenu keeps Feishu's 4px gap
 * (`ud__menu-normal-submenu-vertical`) and cancels the popup padding so its
 * first item lines up with the trigger. If collision avoidance moves it above
 * or below the trigger, it falls back to the same spacing as a top-level menu.
 */
const submenuSideOffset = ({ side }: { side: PositionerSide }) =>
  isBlockSide(side) ? 8 : 4;
const submenuAlignOffset = ({ side }: { side: PositionerSide }) =>
  isBlockSide(side) ? 0 : -POPUP_PADDING;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubmenuTrigger>,
  React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.SubmenuTrigger
  > & {
    inset?: boolean;
    icon?: Icon | React.ReactNode;
  }
>(({ className, inset, children, icon: IconComponent, ...props }, ref) => (
  <DropdownMenuPrimitive.SubmenuTrigger
    ref={ref}
    data-lark-component="DropdownMenu"
    data-lark-part="submenu-trigger"
    className={cn(
      menuRowClasses,
      "data-popup-open:bg-lark-fill-hover", // keep highlighted while the submenu is open
      "pr-7", // room for the submenu caret (Feishu pads the title by 28px)
      inset && "pl-8", // conditional inset
      className,
    )}
    {...props}
  >
    {renderIconNode(IconComponent)}
    {children}
    <CaretRight
      size={12}
      className="absolute top-1/2 right-2 h-3 w-3 -translate-y-1/2 text-lark-placeholder"
    />
  </DropdownMenuPrimitive.SubmenuTrigger>
));

DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubmenuTrigger.displayName;

/**
 * DropdownMenuPortal — moves the menu popup to the end of the document body
 * (or the `LarkPortalProvider` container, if set).
 *
 * Only needed when composing `Positioner` and `Popup` yourself; `Content` and
 * `SubContent` include it.
 */
function DropdownMenuPortal({
  container: containerProp,
  ...props
}: Omit<
  React.ComponentProps<typeof DropdownMenuPrimitive.Portal>,
  "container"
> & {
  /**
   * Container element for the portal. Use this to render the dropdown inside
   * a Shadow DOM or custom container. Overrides `LarkPortalProvider` context.
   * @default LarkPortalProvider container, or Lark's portal host in `<body>`
   */
  container?: PortalContainer;
}) {
  const contextContainer = usePortalContainer();
  const container = containerProp ?? contextContainer ?? undefined;

  return <DropdownMenuPrimitive.Portal container={container} {...props} />;
}
DropdownMenuPortal.displayName = "DropdownMenuPortal";

/**
 * DropdownMenuPositioner — positions the menu popup against its trigger.
 *
 * A thin wrapper around Base UI's `Menu.Positioner` with Lark's default
 * spacing. `sideOffset` and `alignOffset` accept a number or a function of the
 * resolved side and alignment.
 */
const DropdownMenuPositioner = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Positioner>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Positioner>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <DropdownMenuPrimitive.Positioner
    ref={ref}
    data-lark-component="DropdownMenu"
    data-lark-part="positioner"
    className={(state) =>
      cn(
        "outline-hidden",
        typeof className === "function" ? className(state) : className,
      )
    }
    sideOffset={sideOffset}
    {...props}
  />
));
DropdownMenuPositioner.displayName = "DropdownMenuPositioner";

/**
 * DropdownMenuPopup — the styled menu surface that holds the items.
 *
 * Feishu `ud__menu-normal`: `--bg-float` surface with a 1px
 * `--line-border-card` edge, 6px radius, `--shadow-s4-down`, 2px vertical
 * padding and a 160px minimum width. `shadow-lark-modal` carries Feishu's
 * `--shadow-s4-down` value — the token name is about the modal, the value is
 * the shared overlay shadow.
 *
 * Animates with Base UI's `data-starting-style` / `data-ending-style`,
 * sliding in from 8px below over 200ms like Feishu's `ud-slide-up`.
 */
const DropdownMenuPopup = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Popup>,
  Omit<
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Popup>,
    "className"
  > & { className?: string }
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Popup
    ref={ref}
    data-lark-component="DropdownMenu"
    data-lark-part="popup"
    className={cn(
      "group/menu overflow-hidden bg-lark-elevated text-lark-default outline-hidden", // background; Base UI focuses the popup when the pointer leaves the items
      "max-h-[var(--available-height)] overflow-y-auto", // limit height when list is too long and might go off screen
      "rounded-md shadow-lark-modal ring ring-lark-line", // border part
      "min-w-40 py-0.5", // spacing
      "origin-(--transform-origin) transition-[transform,scale,opacity] duration-200 ease-[cubic-bezier(0.34,0.69,0.1,1)] motion-reduce:transition-none", // animation
      "data-starting-style:translate-y-2 data-starting-style:opacity-0", // enter
      "data-ending-style:translate-y-2 data-ending-style:opacity-0", // exit
      "data-instant:duration-0", // Base UI skips the animation for keyboard and dismiss transitions
      className,
    )}
    {...props}
  />
));
DropdownMenuPopup.displayName = "DropdownMenuPopup";

type DropdownMenuContentProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPositioner
> & {
  /**
   * Container element for the portal. Use this to render the dropdown inside
   * a Shadow DOM or custom container. Overrides `LarkPortalProvider` context.
   * @default LarkPortalProvider container, or Lark's portal host in `<body>`
   */
  container?: PortalContainer;
  /** Classes for the popup surface. */
  className?: string;
};

/**
 * DropdownMenuContent — Portal, Positioner and Popup in one.
 *
 * Positioning props go to the Positioner, and `className` goes to the Popup.
 * Compose `Portal`, `Positioner` and `Popup` directly when you need more
 * control over either part.
 */
const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPositioner>,
  DropdownMenuContentProps
>(({ className, children, container, ...props }, ref) => (
  <DropdownMenuPortal container={container}>
    <DropdownMenuPositioner ref={ref} {...props}>
      <DropdownMenuPopup className={className}>{children}</DropdownMenuPopup>
    </DropdownMenuPositioner>
  </DropdownMenuPortal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

/**
 * DropdownMenuSubContent — popup for a nested submenu.
 *
 * Same as `Content`, with submenu offsets: beside the trigger it cancels the
 * popup padding so the first item lines up with the SubTrigger, and overlaps
 * the parent menu slightly. Pass `sideOffset` or `alignOffset` (a number or a
 * function) to override.
 */
const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuContent>,
  DropdownMenuContentProps
>(
  (
    {
      sideOffset = submenuSideOffset,
      alignOffset = submenuAlignOffset,
      ...props
    },
    ref,
  ) => (
    <DropdownMenuContent
      ref={ref}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      {...props}
    />
  ),
);
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

/**
 * DropdownMenuItem — a single actionable item within a dropdown menu.
 *
 * For navigation links, use `DropdownMenu.LinkItem` instead.
 *
 * @example
 * ```tsx
 * <DropdownMenu.Item>Edit</DropdownMenu.Item>
 * <DropdownMenu.Item icon={CopyIcon}>Duplicate</DropdownMenu.Item>
 * <DropdownMenu.Item variant="danger">Delete</DropdownMenu.Item>
 * ```
 */
const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
    icon?: Icon | React.ReactNode;
    selected?: boolean;
    /**
     * @deprecated Use `DropdownMenu.LinkItem` instead for navigation links.
     * This prop will be removed in a future major version.
     */
    href?: string;
    variant?: "default" | "danger";
  }
>(
  (
    {
      className,
      inset,
      icon: IconComponent,
      children,
      selected,
      render,
      href,
      variant = "default",
      ...props
    },
    ref,
  ) => {
    const LinkComponent = useLinkComponent();

    // Build the inner content with icon, children, and selected indicator
    const innerContent = React.useMemo(
      () => (
        <>
          {IconComponent && renderIconNode(IconComponent)}
          {children}
          {selected && (
            // Feishu `ud__list__item__checkmark`: a 12px brand-coloured tick.
            <span className="inline-flex text-lark-brand">
              <Check className="h-3 w-3" />
            </span>
          )}
        </>
      ),
      [IconComponent, children, selected],
    );

    // Legacy href support (deprecated)
    const linkContent = React.useMemo(() => {
      if (!href) return undefined;

      // Matches http://, https://, or protocol-relative //
      const isExternal = /^(https?:)?\/\//.test(href);
      const styles = cn(
        "flex items-center gap-2",
        variant === "danger" &&
          "text-lark-danger data-highlighted:bg-lark-danger/5 data-highlighted:text-lark-danger",
      );
      if (isExternal) {
        return (
          <a
            className={cn(styles, "w-full text-inherit! no-underline!")}
            href={href}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            {innerContent}
          </a>
        );
      }
      return (
        <LinkComponent
          className={cn(styles, "w-full text-inherit! no-underline!")}
          href={href}
          to={href}
          onClick={(e) => e.stopPropagation()}
        >
          {innerContent}
        </LinkComponent>
      );
    }, [href, innerContent, variant, LinkComponent]);

    // When href is provided, use linkContent as render prop
    // When render prop is provided, caller controls children rendering
    const useRenderProp = href || render;

    return (
      <DropdownMenuPrimitive.Item
        ref={ref}
        data-lark-component="DropdownMenu"
        data-lark-part="item"
        className={cn(
          menuRowClasses,
          inset && "pl-8",
          // Feishu `ud__menu-normal-item-selected`: brand-coloured label.
          selected && "text-lark-brand",
          dropdownVariants({ variant }),
          className,
        )}
        render={href ? linkContent : render}
        {...props}
      >
        {useRenderProp ? undefined : innerContent}
      </DropdownMenuPrimitive.Item>
    );
  },
);

DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

/**
 * DropdownMenuLinkItem — a menu item that navigates to a URL.
 *
 * Use this instead of `DropdownMenu.Item` with `href` for navigation links.
 * Provides full control over link attributes like `target` and `rel`.
 *
 * @example
 * ```tsx
 * // External link
 * <DropdownMenu.LinkItem href="https://example.com" target="_blank">
 *   Documentation
 * </DropdownMenu.LinkItem>
 *
 * // Internal link
 * <DropdownMenu.LinkItem href="/settings">
 *   Settings
 * </DropdownMenu.LinkItem>
 *
 * // With icon
 * <DropdownMenu.LinkItem href="/profile" icon={UserIcon}>
 *   Profile
 * </DropdownMenu.LinkItem>
 * ```
 */
const DropdownMenuLinkItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.LinkItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.LinkItem> & {
    inset?: boolean;
    icon?: Icon | React.ReactNode;
    variant?: "default" | "danger";
  }
>(
  (
    {
      className,
      inset,
      icon: IconComponent,
      children,
      variant = "default",
      ...props
    },
    ref,
  ) => {
    return (
      <DropdownMenuPrimitive.LinkItem
        ref={ref}
        data-lark-component="DropdownMenu"
        data-lark-part="link-item"
        className={cn(
          menuRowClasses,
          "text-inherit no-underline",
          inset && "pl-8",
          dropdownVariants({ variant }),
          className,
        )}
        {...props}
      >
        {IconComponent && renderIconNode(IconComponent)}
        {children}
      </DropdownMenuPrimitive.LinkItem>
    );
  },
);

DropdownMenuLinkItem.displayName = "DropdownMenuLinkItem";

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    data-lark-component="DropdownMenu"
    data-lark-part="checkbox-item"
    className={cn(menuRowClasses, "pl-8 transition-colors", className)}
    checked={checked}
    {...props}
  >
    <DropdownMenuPrimitive.CheckboxItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center text-lark-brand">
      <CheckIcon weight="bold" size={12} />
    </DropdownMenuPrimitive.CheckboxItemIndicator>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.GroupLabel> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.GroupLabel
    ref={ref}
    className={cn(
      // Feishu `ud__menu-normal-item-group-title`: 4px/11px padding in the
      // muted placeholder colour.
      "px-2.75 py-1 text-base text-lark-placeholder",
      autoInsetClasses,
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.GroupLabel.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn(
      // Feishu `ud__menu-normal-item-divider`: 1px rule with 3px of space
      // above and below.
      "my-[3px] h-px bg-lark-hairline",
      className,
    )}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> & {
    inset?: boolean;
    icon?: Icon | React.ReactNode;
  }
>(({ className, children, inset, icon: IconComponent, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    data-lark-component="DropdownMenu"
    data-lark-part="radio-item"
    className={cn(menuRowClasses, inset && "pl-8", className)}
    {...props}
  >
    {IconComponent && renderIconNode(IconComponent)}
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

const DropdownMenuRadioItemIndicator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItemIndicator>,
  React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.RadioItemIndicator
  >
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItemIndicator
    ref={ref}
    className={cn("ml-auto", className)}
    {...props}
  >
    {children ?? <Check className="h-3 w-3 text-lark-brand" />}
  </DropdownMenuPrimitive.RadioItemIndicator>
));
DropdownMenuRadioItemIndicator.displayName = "DropdownMenuRadioItemIndicator";

/**
 * Custom Trigger that converts a single child element to the `render` prop
 * to avoid nested button issues with base-ui's Menu.Trigger.
 *
 * When an explicit `render` prop is provided, children are passed through
 * to the rendered element.
 */
const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>
>(({ children, render, ...props }, ref) => {
  // If render prop is explicitly provided, use it and pass children through
  if (render) {
    return (
      <DropdownMenuPrimitive.Trigger ref={ref} {...props} render={render}>
        {children}
      </DropdownMenuPrimitive.Trigger>
    );
  }

  // Otherwise, auto-promote single child element to render prop
  const childElement = React.isValidElement(children) ? children : null;

  return (
    <DropdownMenuPrimitive.Trigger
      ref={ref}
      {...props}
      {...(childElement && {
        render: childElement as React.ReactElement<Record<string, unknown>>,
      })}
    >
      {childElement ? undefined : children}
    </DropdownMenuPrimitive.Trigger>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

/**
 * DropdownMenu — accessible dropdown menu anchored to a trigger.
 *
 * Compound component: `DropdownMenu` (Root), `.Trigger`, `.Content`, `.Item`,
 * `.LinkItem`, `.CheckboxItem`, `.RadioGroup`, `.RadioItem`, `.RadioItemIndicator`,
 * `.Sub`, `.SubTrigger`, `.SubContent`, `.Label`, `.Separator`, `.Shortcut`, `.Group`.
 * `.Content` and `.SubContent` combine `.Portal`, `.Positioner` and `.Popup`,
 * which can also be composed directly.
 *
 * Built on `@base-ui/react/menu`.
 *
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenu.Trigger>
 *     <Button>Actions</Button>
 *   </DropdownMenu.Trigger>
 *   <DropdownMenu.Content>
 *     <DropdownMenu.Item>Edit</DropdownMenu.Item>
 *     <DropdownMenu.Item icon={CopyIcon}>Duplicate</DropdownMenu.Item>
 *     <DropdownMenu.LinkItem href="/settings" icon={GearIcon}>Settings</DropdownMenu.LinkItem>
 *     <DropdownMenu.Separator />
 *     <DropdownMenu.Item variant="danger">Delete</DropdownMenu.Item>
 *   </DropdownMenu.Content>
 * </DropdownMenu>
 * ```
 *
 * @see https://base-ui.com/react/components/menu
 */
export const DropdownMenu = Object.assign(DropdownMenuPrimitive.Root, {
  Trigger: DropdownMenuTrigger,
  Portal: DropdownMenuPortal,
  Positioner: DropdownMenuPositioner,
  Popup: DropdownMenuPopup,
  Sub: DropdownMenuPrimitive.SubmenuRoot,
  SubTrigger: DropdownMenuSubTrigger,
  SubContent: DropdownMenuSubContent,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  LinkItem: DropdownMenuLinkItem,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioGroup: DropdownMenuPrimitive.RadioGroup,
  RadioItem: DropdownMenuRadioItem,
  RadioItemIndicator: DropdownMenuRadioItemIndicator,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
  Shortcut: DropdownMenuShortcut,
  Group: DropdownMenuPrimitive.Group,
});
