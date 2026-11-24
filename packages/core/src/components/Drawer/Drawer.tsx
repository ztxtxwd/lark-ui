import {
  Drawer as UiDrawer,
  DrawerBackdrop as UiDrawerBackdrop,
  DrawerClose as UiDrawerClose,
  DrawerContent as UiDrawerContent,
  DrawerDescription as UiDrawerDescription,
  DrawerHandle as UiDrawerHandle,
  DrawerTitle as UiDrawerTitle,
  DrawerTrigger as UiDrawerTrigger,
} from "@ui-sdk/react/drawer";
import type { ComponentProps, ReactNode } from "react";
import { XIcon } from "../../icons";
import { cn } from "../../lib/cn";
import { Button } from "../Button";

export type DrawerProps = ComponentProps<typeof UiDrawer>;
export type DrawerTriggerProps = ComponentProps<typeof UiDrawerTrigger>;
export type DrawerSide = NonNullable<DrawerProps["side"]>;

/**
 * The UD side sheet. It slides in from the right by default, dims the page with
 * the 55% mask, traps focus and returns it to the trigger on close. Drag and
 * snap-point behaviour comes from ui-sdk: pass `snapPoints` to the root and
 * `resizable` to the content to opt in.
 */
export function Drawer({ side = "right", children, ...props }: DrawerProps) {
  return (
    <UiDrawer {...props} side={side}>
      {children}
    </UiDrawer>
  );
}

export function DrawerTrigger({
  children,
  render,
  ...props
}: DrawerTriggerProps & { children?: ReactNode }) {
  return <UiDrawerTrigger {...props} render={render ?? <Button>{children}</Button>} />;
}

export type DrawerSize = "sm" | "md" | "lg";

/**
 * UD drawer sizes are fixed: 350 / 480 / 680px. A right or left drawer uses
 * that as its width; a top or bottom drawer uses it as its height.
 */
const drawerSize = {
  sm: "350px",
  md: "480px",
  lg: "680px",
} as const satisfies Record<DrawerSize, string>;

const sizeClass = {
  sm: { horizontal: "w-[350px]", vertical: "h-[350px]" },
  md: { horizontal: "w-[480px]", vertical: "h-[480px]" },
  lg: { horizontal: "w-[680px]", vertical: "h-[680px]" },
} as const satisfies Record<DrawerSize, { horizontal: string; vertical: string }>;

function sideClasses(side: string, size: DrawerSize) {
  const dims = sizeClass[size];
  switch (side) {
    case "left":
    case "right":
      return cn("h-dvh max-h-dvh", dims.horizontal);
    case "top":
    case "bottom":
      return cn("w-full max-h-dvh", dims.vertical);
    default:
      return dims.horizontal;
  }
}

export type DrawerContentProps = ComponentProps<typeof UiDrawerContent> & {
  /** Fixed UD width, or height for top/bottom drawers. Defaults to `sm` (350px). */
  size?: DrawerSize;
  /** The accessible name, rendered as the header title. */
  title?: ReactNode;
  /** A supporting line under the title. */
  description?: ReactNode;
  /** Buttons fixed to the bottom of the drawer. */
  footer?: ReactNode;
  /** Shows the header close button. Defaults to true. */
  closable?: boolean;
  /** The close button's accessible name. Defaults to 关闭. */
  closeLabel?: string;
  /** Renders the 55% UD mask. Turn it off for a non-modal drawer. Defaults to true. */
  mask?: boolean;
  /** Shows the ui-sdk grabber for drag and snap-point drawers. Defaults to false. */
  resizable?: boolean;
  /** The grabber's accessible name. Defaults to 调整大小. */
  handleLabel?: string;
};

export function DrawerContent({
  size = "sm",
  title,
  description,
  footer,
  closable = true,
  closeLabel = "关闭",
  mask = true,
  resizable = false,
  handleLabel = "调整大小",
  className,
  children,
  ...props
}: DrawerContentProps) {
  return (
    <>
      {mask ? (
        <UiDrawerBackdrop
          className={cn(
            "fixed inset-0 z-50 bg-lark-mask",
            "transition-opacity duration-200 ease-lark",
            "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
            "motion-reduce:transition-none",
          )}
        />
      ) : null}
      <UiDrawerContent
        {...props}
        className={(state) =>
          cn(
            "relative z-50 flex flex-col",
            "max-w-[100vw] bg-lark-float text-lark-title shadow-lark-5 outline-none",
            sideClasses(state.side, size),
            "motion-reduce:transition-none",
            typeof className === "function" ? className(state) : className,
          )
        }
      >
        {(state) => (
          <>
            {resizable ? (
              <UiDrawerHandle
                aria-label={handleLabel}
                className={cn(
                  "mx-auto mt-2 mb-1 flex h-1.5 w-10 shrink-0 cursor-grab",
                  "items-center justify-center rounded-lark-full bg-lark-border",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
                  "active:cursor-grabbing",
                )}
              />
            ) : null}

            {title || description || closable ? (
              <header
                data-slot="drawer-header"
                className={cn(
                  "flex shrink-0 items-start justify-between gap-4",
                  "border-b border-lark-divider bg-lark-float px-6 py-4",
                )}
              >
                <div className="min-w-0 flex-1">
                  {title ? (
                    <UiDrawerTitle className="m-0 text-lark-16 font-medium text-lark-title">
                      {title}
                    </UiDrawerTitle>
                  ) : null}
                  {description ? (
                    <UiDrawerDescription className="mt-1 text-lark-14 text-lark-caption">
                      {description}
                    </UiDrawerDescription>
                  ) : null}
                </div>
                {closable ? (
                  <UiDrawerClose
                    aria-label={closeLabel}
                    className={cn(
                      "-mt-1 -mr-2 flex size-8 shrink-0 cursor-pointer items-center justify-center",
                      "rounded-lark-md text-lark-icon-2 transition-colors duration-100 ease-lark-linear",
                      "hover:bg-lark-hover hover:text-lark-icon-1",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
                    )}
                  >
                    <XIcon size={18} />
                  </UiDrawerClose>
                ) : null}
              </header>
            ) : null}

            <div
              data-slot="drawer-body"
              className={cn(
                "min-h-0 flex-1 overflow-y-auto px-6 pt-6 text-lark-14 leading-[22px]",
                footer ? "pb-0" : "pb-6",
              )}
            >
              {typeof children === "function" ? children(state) : children}
            </div>

            {footer ? (
              <footer
                data-slot="drawer-footer"
                className="flex shrink-0 flex-wrap-reverse items-center justify-end gap-3 px-6 py-6"
              >
                {footer}
              </footer>
            ) : null}
          </>
        )}
      </UiDrawerContent>
    </>
  );
}

export type DrawerCloseProps = ComponentProps<typeof UiDrawerClose>;

export function DrawerClose({ className, ...props }: DrawerCloseProps) {
  return <UiDrawerClose {...props} className={cn("cursor-pointer", className)} />;
}

export {
  UiDrawerDescription as DrawerDescription,
  UiDrawerHandle as DrawerHandle,
  UiDrawerTitle as DrawerTitle,
};

/** The usable size steps, for consumers that mirror the UD spec. */
export const drawerWidths = drawerSize;
