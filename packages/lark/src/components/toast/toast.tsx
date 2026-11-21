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
  XCircleIcon,
} from "../../icons/phosphor";

/**
 * Toast styling configuration for Figma plugin consumption.
 *
 * A toast is a floating status notice. Feishu's client renders it as a small
 * banner-like surface: a pale status tint with a 1px border in the status
 * colour, an 8px radius and an elevated shadow. The status icon and the title
 * share one row, and the title is set semibold.
 */
export const LARK_TOAST_VARIANTS = {
  root: {
    classes:
      "rounded-lg border bg-clip-padding px-5 py-4 shadow-lark-popover text-lark-default",
    description:
      "Toast container with a status tint (or neutral surface), 1px border, and shadow",
  },
  title: {
    classes: "text-base leading-[22px] font-semibold text-lark-default",
    description: "Toast title in Feishu's semibold notice type",
  },
  description: {
    classes: "text-base leading-[22px] text-lark-subtle",
    description: "Toast description with muted text color",
  },
  variant: {
    default: {
      // Neutral toast: the elevated surface with a hairline border.
      classes: "border-lark-line bg-lark-elevated",
      description: "Default neutral toast style",
    },
    success: {
      classes:
        "border-lark-success-outline bg-lark-toast-success-outlined",
      iconClasses: "text-lark-success",
      description: "Success toast for confirmations and positive outcomes",
      icon: CheckCircleIcon,
    },
    error: {
      classes: "border-lark-danger-outline bg-lark-toast-danger-outlined",
      iconClasses: "text-lark-danger",
      description: "Error toast for critical issues",
      icon: XCircleIcon,
    },
    warning: {
      classes: "border-lark-warning-outline bg-lark-toast-warning-outlined",
      iconClasses: "text-lark-warning",
      description: "Warning toast for cautionary messages",
      icon: WarningIcon,
    },
    info: {
      classes: "border-lark-info-outline bg-lark-toast-info-outlined",
      iconClasses: "text-lark-info",
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
    padding: 20,
    paddingY: 16,
    borderRadius: 8,
    background: "bg-lark-elevated",
    border: "border border-lark-line",
    shadow: "shadow-lark-popover",
    gap: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: "text-lark-default",
  },
  description: {
    fontSize: 14,
    fontWeight: 400,
    color: "text-lark-subtle",
  },
  icon: {
    size: 16,
    defaultIconName: "ph-info",
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
    // Base surface — the floating, bordered counterpart to Banner's filled
    // inline notice (Feishu `ud__notice--outlined`): pale status tint, 1px
    // status border, 8px radius, `--shadow-s4-down` (Feishu `ud__toast`),
    // 20px by 16px padding.
    "overflow-hidden rounded-lg border bg-clip-padding px-5 py-4 text-lark-default shadow-lark-popover",
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
 * Renders a `Toast.Provider` with a fixed-position viewport at the top centre
 * of the screen, matching the Feishu client. Toasts stack downwards in a
 * column, slide in from above and fade out.
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
        <Toast.Viewport className="fixed inset-x-0 top-0 z-1 mx-auto w-[calc(100%-2rem)] max-w-[600px]">
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
  // drop focus from a focused action inside the toast.
  return (
    shouldBump &&
    (updateKey % 2 === 0 ? "animate-toast-bump-alternate" : "animate-toast-bump")
  );
}

// The root owns the slide/fade transition and the inner surface owns the
// bump, so a bump never cancels an in-progress entrance.
//
// Feishu stacks toasts in a full column at the top of the viewport, newest
// first, 16px apart. Each root is positioned by its measured height
// (`--toast-offset-y`), so every toast stays fully visible instead of
// collapsing into a hover-to-expand deck.
function ToastList() {
  const { toasts } = useLarkToastManager();
  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      swipeDirection="up"
      className={cn(
        "absolute top-4 right-0 left-0 z-[calc(1000-var(--toast-index))] mx-auto w-fit max-w-full origin-top select-none",
        "[--gap:1rem] [--offset-y:calc(var(--toast-offset-y)+calc(var(--toast-index)*var(--gap))+var(--toast-swipe-movement-y))]",
        "[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))] [transition:transform_0.4s_cubic-bezier(0.22,1,0.36,1),opacity_0.25s]",
        "data-[ending-style]:opacity-0 data-[limited]:pointer-events-none data-[limited]:opacity-0",
        "data-[starting-style]:opacity-0 data-[starting-style]:[transform:translateY(calc(var(--offset-y)-100%))]",
        "motion-reduce:[transition-property:opacity]",
      )}
    >
      <div
        data-lark-part="surface"
        className={cn(
          "relative w-full",
          toastVariants({ variant: toast.variant }),
          getBumpAnimation(toast),
        )}
      >
        <Toast.Content className="isolate flex items-start gap-2.5">
          {toast.content ? (
            <div className="min-w-0 flex-1">{toast.content}</div>
          ) : (
            <>
              <ToastIcon variant={toast.variant} />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Toast.Title
                  data-toast-title
                  className="text-base leading-[22px] font-semibold text-lark-default"
                />
                <Toast.Description className="text-base leading-[22px] text-lark-subtle" />

                {!!toast.actions && (
                  <div className="mt-1 flex min-w-0 flex-nowrap gap-3 overflow-x-auto p-px">
                    {toast.actions.map((actionProps, idx) => (
                      <Button key={idx} {...actionProps} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </Toast.Content>
      </div>
    </Toast.Root>
  ));
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
    <Icon
      data-toast-icon
      className={cn(
        "mt-[3px] size-4 shrink-0",
        "iconClasses" in variantConfig ? variantConfig.iconClasses : undefined,
      )}
      weight="fill"
    />
  );
}
