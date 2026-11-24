import {
  Dialog as UiDialog,
  DialogBackdrop as UiDialogBackdrop,
  DialogClose as UiDialogClose,
  DialogContent as UiDialogContent,
  DialogDescription as UiDialogDescription,
  DialogTitle as UiDialogTitle,
  DialogTrigger as UiDialogTrigger,
} from "@ui-sdk/react/dialog";
import type { ComponentProps, ReactNode } from "react";
import { XIcon } from "../../icons";
import { cn } from "../../lib/cn";
import { Button } from "../Button";

export type DialogProps = ComponentProps<typeof UiDialog>;
export type DialogTriggerProps = ComponentProps<typeof UiDialogTrigger>;

export function Dialog(props: DialogProps) {
  return <UiDialog {...props} />;
}

export function DialogTrigger({
  children,
  render,
  ...props
}: DialogTriggerProps & { children?: ReactNode }) {
  return <UiDialogTrigger {...props} render={render ?? <Button>{children}</Button>} />;
}

export type DialogSize = "sm" | "md" | "lg" | "xl";

const dialogWidth: Record<DialogSize, string> = {
  sm: "w-[420px]",
  md: "w-[600px]",
  lg: "w-[840px]",
  xl: "w-[1080px]",
};

export type DialogContentProps = ComponentProps<typeof UiDialogContent> & {
  size?: DialogSize;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  closable?: boolean;
  closeLabel?: string;
  /** Renders the 55% UD mask. Turn it off for a non-modal dialog. Defaults to true. */
  mask?: boolean;
};

export function DialogContent({
  size = "sm",
  title,
  description,
  footer,
  closable = true,
  closeLabel = "关闭",
  mask = true,
  className,
  children,
  ...props
}: DialogContentProps) {
  const hasHeader = Boolean(title || description || closable);

  return (
    <>
      {mask ? (
        <UiDialogBackdrop
          className={cn(
            "fixed inset-0 z-50 bg-lark-mask",
            "transition-opacity duration-200 ease-lark",
            "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
          )}
        />
      ) : null}
      <UiDialogContent
        {...props}
        className={(state) =>
          cn(
            "fixed top-1/2 left-1/2 z-50 flex flex-col",
            "max-h-[calc(100vh-64px)] max-w-[calc(100vw-64px)] -translate-x-1/2 -translate-y-1/2",
            "rounded-lark-lg bg-lark-float text-lark-title shadow-lark-5 outline-none",
            "transition-[opacity,scale] duration-200 ease-lark",
            "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
            dialogWidth[size],
            typeof className === "function" ? className(state) : className,
          )
        }
      >
        {(state) => (
          <>
            {hasHeader ? (
              <header data-slot="dialog-header" className="relative shrink-0 p-6">
                {title ? (
                  <UiDialogTitle className="m-0 text-lark-16 font-medium text-lark-title">
                    {title}
                  </UiDialogTitle>
                ) : null}
                {description ? (
                  <UiDialogDescription className="mt-1 text-lark-14 text-lark-caption">
                    {description}
                  </UiDialogDescription>
                ) : null}
                {closable ? (
                  <UiDialogClose
                    aria-label={closeLabel}
                    className={cn(
                      "absolute top-5 right-5 flex size-8 cursor-pointer items-center justify-center",
                      "rounded-lark-md text-lark-icon-2 transition-colors duration-100",
                      "hover:bg-[var(--lark-fill-hover)] hover:text-lark-title",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
                    )}
                  >
                    <XIcon size={18} />
                  </UiDialogClose>
                ) : null}
              </header>
            ) : null}

            <div
              data-slot="dialog-body"
              className={cn(
                "min-h-0 flex-1 overflow-y-auto px-6 pb-6 text-lark-14 leading-[22px]",
                // The header carries the top inset; without one the body has
                // to provide the UD 24px padding itself.
                hasHeader ? null : "pt-6",
              )}
            >
              {typeof children === "function" ? children(state) : children}
            </div>

            {footer ? (
              <footer
                data-slot="dialog-footer"
                className="flex shrink-0 flex-wrap-reverse items-center justify-end gap-3 px-6 pb-6"
              >
                {footer}
              </footer>
            ) : null}
          </>
        )}
      </UiDialogContent>
    </>
  );
}

export type DialogCloseProps = ComponentProps<typeof UiDialogClose>;

export function DialogClose({ className, ...props }: DialogCloseProps) {
  return <UiDialogClose {...props} className={cn("cursor-pointer", className)} />;
}

export { UiDialogDescription as DialogDescription, UiDialogTitle as DialogTitle };
