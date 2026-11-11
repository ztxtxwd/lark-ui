import {
  Toast,
  ToastManagerAddOptions,
  ToastManagerUpdateOptions,
  ToastObject,
} from "@base-ui/react/toast";
import type React from "react";
import { cn } from "../../utils/cn";
import { resolveVariant } from "../../utils/resolve-variant";
import { Button, ButtonProps } from "../../components/button";
import {
  usePortalContainer,
  type PortalContainer,
} from "../../utils/portal-provider";
import {
  CheckCircleIcon,
  InfoIcon,
  WarningIcon,
  WarningOctagonIcon,
  XIcon,
} from "../../icons/phosphor";

/**
 * Toast styling configuration for Figma plugin consumption.
 * Toast has no user-facing variants but documents the styling structure.
 */
export const LARK_TOAST_VARIANTS = {
  root: {
    classes:
      "rounded-lg ring ring-lark-line bg-lark-elevated p-6 shadow-lark-notification text-lark-default",
    description: "Toast container with background, border, and shadow",
  },
  title: {
    classes: "text-base leading-[22px] font-medium text-lark-default",
    description: "Toast title with primary text color",
  },
  description: {
    classes: "text-base leading-[22px] text-lark-subtle",
    description: "Toast description with muted text color",
  },
  close: {
    classes:
      "absolute top-6 right-6 size-5 rounded text-lark-subtle hover:bg-current/15",
    description: "Button-based close control with variant-aware hover tint",
  },
  variant: {
    default: {
      classes: "",
      description: "Default toast style",
    },
    success: {
      classes: "[&_[data-toast-icon]]:text-lark-success",
      description: "Success toast for confirmations and positive outcomes",
      icon: CheckCircleIcon,
    },
    error: {
      classes: "[&_[data-toast-icon]]:text-lark-danger",
      description: "Error toast for critical issues",
      icon: WarningOctagonIcon,
    },
    warning: {
      classes: "[&_[data-toast-icon]]:text-lark-warning",
      description: "Warning toast for cautionary messages",
      icon: WarningIcon,
    },
    info: {
      classes: "[&_[data-toast-icon]]:text-lark-info",
      description: "Info toast for neutral informational messages",
      icon: InfoIcon,
    },
  },
} as const;

export const LARK_TOAST_DEFAULT_VARIANTS = {
  variant: "default",
} as const;

/**
 * Toast styling configuration for Figma plugin consumption.
 * Provides structured metadata for generating Toast components in Figma.
 */
export const LARK_TOAST_STYLING = {
  container: {
    width: 420,
    padding: 24,
    borderRadius: 8,
    background: "bg-lark-elevated",
    border: "ring ring-lark-line",
    shadow: "shadow-lark-notification",
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 500,
    color: "text-lark-default",
  },
  description: {
    fontSize: 14,
    fontWeight: 400,
    color: "text-lark-subtle",
  },
  closeButton: {
    size: 20,
    iconSize: 16,
    iconName: "ph-x",
    iconColor: "text-lark-subtle",
    hoverBackground: "color-color-2",
    hoverColor: "text-color-label",
    borderRadius: 4,
  },
} as const;

// Derived types from LARK_TOAST_VARIANTS
export type LarkToastVariant = keyof typeof LARK_TOAST_VARIANTS.variant;

export interface LarkToastVariantsProps {
  variant?: LarkToastVariant;
}

export function toastVariants({
  variant = LARK_TOAST_DEFAULT_VARIANTS.variant,
}: LarkToastVariantsProps = {}) {
  return cn(
    // Base styles for the toast surface — Feishu `ud__notification__notice-content`:
    // `--bg-float` surface, 1px `--line-border-card` edge, 8px radius,
    // `--shadow-s5-down` and 24px padding.
    "overflow-hidden rounded-lg bg-lark-elevated bg-clip-padding p-6 ring ring-lark-line shadow-lark-notification",
    // Apply variant styles from LARK_TOAST_VARIANTS
    resolveVariant(
      LARK_TOAST_VARIANTS.variant,
      variant,
      LARK_TOAST_DEFAULT_VARIANTS.variant,
    ).classes,
  );
}

/**
 * Toasty component props.
 *
 * Wrap your app with `<Toasty>` to enable toast notifications.
 * Use `Toast.useToastManager().notify(…)` to create toasts.
 *
 * @example
 * ```tsx
 * // 1. Wrap your app
 * <Toasty>
 *   <App />
 * </Toasty>
 *
 * // 2. Show a toast from any child component
 * const toasts = Toast.useToastManager();
 * toasts.notify({ title: "Saved", description: "Changes saved successfully." });
 * ```
 *
 * @example Dispatching toasts from non-React-component code
 * ```tsx
 * // 1. Create a manager at module scope
 * import { createLarkToastManager } from "@lark-ui/core";
 * export const appToastManager = createLarkToastManager();
 *
 * // 2. Pass it to <Toasty>
 * <Toasty toastManager={appToastManager}>
 *   <App />
 * </Toasty>
 *
 * // 3. Dispatch from anywhere — timers, callbacks, query-cache listeners
 * appToastManager.add({ title: "Saved" });
 * ```
 */
export interface ToastyProps extends LarkToastVariantsProps {
  /** Application content. Toasts render via a portal above this. */
  children: React.ReactNode;
  /**
   * Container element for the portal. Use this to render toasts inside
   * a Shadow DOM or custom container. Overrides `LarkPortalProvider` context.
   * @default LarkPortalProvider container, or Lark's portal host in `<body>`
   */
  container?: PortalContainer;
  /**
   * Optional toast manager created by `createLarkToastManager()`. When
   * provided, allows code outside the React tree (timers, module-load
   * callbacks, query-cache listeners) to dispatch toasts via the same
   * dedupe-aware manager that `useLarkToastManager()` returns inside the
   * tree.
   *
   * Forwarded to the underlying `@base-ui/react/toast` `Toast.Provider`
   * `toastManager` prop — see
   * https://base-ui.com/react/components/toast for the upstream primitive.
   */
  toastManager?: ReturnType<typeof createLarkToastManager>;
}

type LarkToastOptionsBase = {
  variant?: LarkToastVariant;
  content?: React.ReactNode;
  actions?: Array<ButtonProps>;
  bump?: boolean;
};

// Set by every `add()` and cleared by `update()` and promise results.
// `ToastList` only bumps when this is set and `updateKey > 0`, because Base UI
// increments `updateKey` for duplicate adds and explicit updates alike.
const LARK_TOAST_AUTO_BUMP = Symbol("lark-toast-auto-bump");

type LarkToastInternalOptions = {
  [LARK_TOAST_AUTO_BUMP]?: boolean;
};

export type LarkToastOptions<Data extends object> = ToastObject<Data> &
  LarkToastOptionsBase;

export type LarkToastManagerAddOptions<Data extends object> =
  ToastManagerAddOptions<Data> & LarkToastOptionsBase;

export type LarkToastManagerUpdateOptions<Data extends object> =
  ToastManagerUpdateOptions<Data> & LarkToastOptionsBase;

function withBumpIntent<T extends LarkToastOptionsBase>(
  options: T,
  autoBump: boolean,
): T & LarkToastInternalOptions {
  return {
    ...options,
    // Keep `bump` operation-scoped instead of inheriting a previous value
    // through Base UI's partial update merge.
    bump: options.bump,
    [LARK_TOAST_AUTO_BUMP]: autoBump,
  };
}

function wrapManagerMethods<
  T extends {
    add: Function;
    update: Function;
    promise: Function;
    toasts?: Array<ToastObject<any>>;
  },
>(manager: T) {
  return {
    ...manager,

    add: (options: LarkToastManagerAddOptions<any>) => {
      const existingToast = options.id
        ? manager.toasts?.find((toast) => toast.id === options.id)
        : undefined;

      if (existingToast) {
        // Bump the visible toast instead of replacing it, and let an
        // exiting toast finish.
        if (existingToast.transitionStatus !== "ending") {
          const bumpOptions: LarkToastManagerUpdateOptions<any> =
            options.timeout !== undefined ? { timeout: options.timeout } : {};
          manager.update(existingToast.id, withBumpIntent(bumpOptions, true));
        }
        return existingToast.id;
      }

      return manager.add(withBumpIntent(options, true));
    },

    update: (
      id: string,
      options:
        | LarkToastManagerUpdateOptions<any>
        | ((
            prevToast: LarkToastOptions<any>,
          ) => LarkToastManagerUpdateOptions<any>),
    ) => {
      return manager.update(
        id,
        typeof options === "function"
          ? (prevToast: ToastObject<any>) =>
              withBumpIntent(options(prevToast), false)
          : withBumpIntent(options, false),
      );
    },

    promise: <T,>(
      promise: Promise<T>,
      options: {
        loading: LarkToastManagerAddOptions<any>;
        success:
          | LarkToastManagerAddOptions<any>
          | ((data: T) => LarkToastManagerAddOptions<any>);
        error:
          | LarkToastManagerAddOptions<any>
          | ((error: Error) => LarkToastManagerAddOptions<any>);
      },
    ) => {
      return manager.promise(promise, {
        loading: withBumpIntent(options.loading, false),
        success:
          typeof options.success === "function"
            ? (data: T) =>
                withBumpIntent(
                  (options.success as (
                    data: T,
                  ) => LarkToastManagerAddOptions<any>)(data),
                  false,
                )
            : withBumpIntent(options.success, false),
        error:
          typeof options.error === "function"
            ? (error: Error) =>
                withBumpIntent(
                  (options.error as (
                    error: Error,
                  ) => LarkToastManagerAddOptions<any>)(error),
                  false,
                )
            : withBumpIntent(options.error, false),
      });
    },
  };
}

export const useLarkToastManager = () => {
  const manager = Toast.useToastManager();
  return {
    ...wrapManagerMethods(manager),
    toasts: manager.toasts as Array<LarkToastOptions<any>>,
  };
};

export const createLarkToastManager = () => {
  return wrapManagerMethods(Toast.createToastManager());
};

/**
 * Toasty — toast notification provider and viewport.
 *
 * Renders a `Toast.Provider` with a fixed-position viewport in the bottom-right corner.
 * Toasts stack with smooth enter/exit animations, swipe-to-dismiss, and expand-on-hover.
 *
 * Built on `@base-ui/react/toast`.
 *
 * @example
 * ```tsx
 * <Toasty>
 *   <App />
 * </Toasty>
 * ```
 */
export function Toasty({
  children,
  container: containerProp,
  toastManager,
}: ToastyProps) {
  const contextContainer = usePortalContainer();
  const container = containerProp ?? contextContainer ?? undefined;

  return (
    <Toast.Provider toastManager={toastManager}>
      {children}
      <Toast.Portal container={container}>
        <Toast.Viewport className="fixed top-auto right-4 bottom-4 z-1 mx-auto flex w-[calc(100%-2rem)] sm:right-8 sm:bottom-8 sm:w-[420px]">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

/** Alias for Toasty — provided for discoverability when migrating from other libraries */
export const ToastProvider = Toasty;

function getBumpAnimation(toast: LarkToastOptions<any>) {
  const updateKey = toast.updateKey ?? 0;
  const internalToast: LarkToastOptions<any> & LarkToastInternalOptions = toast;
  const shouldBump =
    toast.bump === true ||
    (toast.bump !== false &&
      internalToast[LARK_TOAST_AUTO_BUMP] === true &&
      updateKey > 0);

  // Alternate between two identical animations so each bump replays.
  // Unlike clipboard-text, don't remount with `key={updateKey}`: that would
  // drop focus from a focused action or close button inside the toast.
  return (
    shouldBump &&
    (updateKey % 2 === 0 ? "animate-toast-bump-alternate" : "animate-toast-bump")
  );
}

// The root owns the slide transition and the inner surface owns the bump,
// so a bump never cancels an in-progress slide-in.
function ToastList() {
  const { toasts } = useLarkToastManager();
  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      className={cn(
        "absolute right-0 bottom-0 left-auto z-[calc(1000-var(--toast-index))] mr-0 h-[var(--height)] w-full origin-bottom rounded-lg select-none motion-reduce:[transition-property:opacity]",
        "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]",
        "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s,height_0.15s]",
        "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
        "data-[ending-style]:opacity-0 data-[expanded]:h-[var(--toast-height)] data-[expanded]:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--offset-y)))] data-[limited]:opacity-0 data-[starting-style]:[transform:translateY(150%)]",
        "data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] data-[expanded]:data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))] data-[expanded]:data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-[expanded]:data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))] data-[expanded]:data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]",
      )}
    >
      <div
        data-lark-part="surface"
        className={cn(
          "relative h-full w-full",
          toastVariants({ variant: toast.variant }),
          getBumpAnimation(toast),
        )}
      >
        <ToastBackground variant={toast.variant} />
        <Toast.Content className="isolate flex flex-col gap-2 transition-opacity [transition-duration:250ms] data-[behind]:pointer-events-none data-[behind]:opacity-0 data-[expanded]:pointer-events-auto data-[expanded]:opacity-100">
          {toast.content ?? (
            <>
              <div className="flex items-start gap-2">
                <ToastIcon variant={toast.variant} />
                <div className="flex flex-col gap-2 overflow-hidden">
                  <Toast.Title
                    data-toast-title
                    className="pr-4 text-base leading-[22px] font-medium text-lark-default"
                  />
                  <Toast.Description className="text-base leading-[22px] text-lark-subtle" />

                  {!!toast.actions && (
                    <div className="flex min-w-0 flex-nowrap gap-3 overflow-x-auto p-px">
                      {toast.actions.map((actionProps, idx) => (
                        <Button key={idx} {...actionProps} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          <Toast.Close
            data-lark-part="close"
            aria-label="Close"
            render={
              <Button
                variant="ghost"
                size="sm"
                shape="square"
                aria-label="Close"
                className={cn(
                  "absolute top-6 right-6 size-5 rounded text-lark-subtle hover:bg-current/15",
                )}
                icon={<XIcon className="h-3 w-3" />}
              />
            }
          />
        </Toast.Content>
      </div>
    </Toast.Root>
  ));
}

/**
 * Feishu marks a notification with a 4px colour bar on the leading edge
 * (`ud__notification__notice-border`) instead of tinting the whole surface.
 * The bar uses Feishu's notice colours (#4e83fd / #62d256 / #ffa53d / #f76964).
 */
const TOAST_BAR_CLASSES: Record<string, string> = {
  success: "bg-lark-notice-success",
  error: "bg-lark-notice-danger",
  warning: "bg-lark-notice-warning",
  info: "bg-lark-notice-info",
};

function ToastBackground({ variant }: { variant?: LarkToastVariant }) {
  const background = variant && TOAST_BAR_CLASSES[variant];
  if (!background) return null;
  return (
    <div
      data-lark-part="accent-bar"
      className={cn("absolute inset-y-0 left-0 w-1", background)}
    />
  );
}

function ToastIcon({ variant }: { variant?: LarkToastVariant }) {
  if (!variant || variant === "default") return null;
  const variantConfig = resolveVariant(
    LARK_TOAST_VARIANTS.variant,
    variant,
    LARK_TOAST_DEFAULT_VARIANTS.variant,
  );
  if (!("icon" in variantConfig)) return null;
  const Icon = variantConfig.icon;
  return (
    <Icon data-toast-icon className="mt-0.5 h-6 w-6 shrink-0" weight="fill" />
  );
}
