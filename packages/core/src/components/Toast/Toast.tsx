import {
  toast as baseToast,
  createToaster as createUiToaster,
  type ToastActionDetails,
  type ToastDismissDetails,
  ToastRegion,
  type ToastType,
  Toast as UiToast,
  ToastAction as UiToastAction,
  ToastClose as UiToastClose,
  ToastDescription as UiToastDescription,
  type Toaster as UiToaster,
  type ToastOptions as UiToastOptions,
  ToastTitle as UiToastTitle,
} from "@ui-sdk/react/toast";
import { cva } from "class-variance-authority";
import { createContext, type ReactNode, useContext } from "react";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  InfoIcon,
  SpinnerIcon,
  XIcon,
} from "../../icons";
import { cn } from "../../lib/cn";

/**
 * UD toast tones. `default` renders like `info`; the five named tones map to
 * the documented info / success / error / warning / loading set.
 */
export type ToastTone = ToastType;

export type ToastActionOptions = {
  /** The action's text, like 撤销. */
  label: ReactNode;
  /** Runs when pressed. A returned promise keeps the toast open while it runs. */
  onAction?: (event: Event | undefined, details: ToastActionDetails) => unknown;
  /** Renders the action as a link instead of a button. */
  href?: string;
  /** Whether pressing it dismisses the toast. Defaults to true. */
  dismiss?: boolean;
};

export type ToastOptions = {
  /** A second line under the message. */
  description?: ReactNode;
  /**
   * How long the toast stays, in ms. Defaults to 5000, or 6000 when it has an
   * action, following UD's minimum 4s / 6s rules. Loading stays until updated, so
   * it defaults to `Infinity`. `Infinity` keeps any toast until dismissed.
   */
  duration?: number;
  /**
   * Shows a close button. UD recommends it for longer text or a toast that
   * stays longer. Defaults to false; Escape and swiping still dismiss.
   */
  closable?: boolean;
  /** The close button's accessible name. Defaults to 关闭. */
  closeLabel?: string;
  /** Replaces the tone icon. */
  icon?: ReactNode;
  /** A text button on the right, like 撤销. */
  action?: ToastActionOptions;
  /** How screen readers announce it. Errors are assertive by default. */
  priority?: "polite" | "assertive";
  /** Reuses a toast with this id instead of adding another. */
  id?: string;
  /** Whether the user can dismiss it. Defaults to true. */
  dismissible?: boolean;
  /** Runs when it closes, with the reason. Calling `details.cancel()` keeps it. */
  onDismiss?: (details: ToastDismissDetails) => void;
};

export type ToastUpdateOptions = ToastOptions & {
  /** Changes the tone of the existing toast. */
  type?: ToastTone;
};

type ToastShow = (message: ReactNode, options?: ToastOptions) => string;

export type ToastApi = {
  (message: ReactNode, options?: ToastOptions): string;
  info: ToastShow;
  success: ToastShow;
  error: ToastShow;
  warning: ToastShow;
  loading: ToastShow;
  /** Closes one toast, or every toast without an id. */
  dismiss: (id?: string) => void;
  /** Updates a toast in place. Returns whether it was still showing. */
  update: (id: string, message: ReactNode, options?: ToastUpdateOptions) => boolean;
};

export type ToastProviderProps = {
  children?: ReactNode;
  /** A queue of your own. Defaults to the shared `toast` queue. */
  toaster?: UiToaster<ReactNode>;
  /** The edge of the viewport. UD places toasts at the top center by default. */
  side?: "top" | "bottom";
  /** Where along that edge. */
  align?: "start" | "center" | "end";
  /** How many show at once. UD shows two by default. */
  maxVisible?: number;
  /** How far from the chosen edge, in px. UD web recommends 32px from the top. */
  offset?: number;
  /** Keeps the stack expanded. UD stacks toasts in a column, so this is true by default. */
  expanded?: boolean;
  /** The live landmark's name once a toast is showing. */
  label?: string;
  /** The close button's accessible name. Defaults to 关闭. */
  closeLabel?: string;
  /** What screen readers hear while an action stays pending. */
  pendingAnnouncement?: string;
};

type ToastRenderData = {
  closable?: boolean;
  closeLabel?: string;
  icon?: ReactNode;
};

const sharedToaster = baseToast as unknown as UiToaster<ReactNode>;

/**
 * The toast surface from the UD spec: a light tone-tinted panel, 6px radius,
 * 1px tone border, 14/22 text, 600px maximum width and the s4 elevation.
 * `shadow-lark-float-4` is the single-layer rendering of UD `shadow-s4-down`:
 * the three-layer token bands into visible rings on flat backgrounds.
 */
const toastStyles = cva(
  [
    "pointer-events-auto box-border flex w-fit items-start gap-2",
    "max-w-[min(600px,calc(100vw-32px))] rounded-lark-md border border-solid",
    "px-4 py-[9px] text-lark-14 text-lark-title shadow-lark-float-4",
    "transition-[opacity,transform] duration-300 ease-lark",
    "outline-none focus-visible:outline-solid focus-visible:outline-2",
    "focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
    "data-[starting-style]:-translate-y-2 data-[starting-style]:opacity-0",
    "data-[ending-style]:-translate-y-2 data-[ending-style]:opacity-0",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      type: {
        // The client's outlined notice uses the tone content colour for its
        // 1px border (`.ud__notice--outlined`), not the fill.
        default: "border-lark-info-content bg-lark-info-soft",
        info: "border-lark-info-content bg-lark-info-soft",
        success: "border-lark-success-content bg-lark-success-soft",
        warning: "border-lark-warning-content bg-lark-warning-soft",
        error: "border-lark-danger-content bg-lark-danger-soft",
        loading: "border-lark-info-content bg-lark-info-soft",
      },
    },
    defaultVariants: { type: "default" },
  },
);

const regionStyles = cva(
  [
    "w-max max-w-[calc(100vw-32px)]",
    "[&>ol]:m-0 [&>ol]:flex [&>ol]:list-none [&>ol]:flex-col-reverse",
    "[&>ol]:gap-4 [&>ol]:p-0",
  ],
  {
    variants: {
      align: {
        start: "[&>ol]:items-start",
        center: "[&>ol]:items-center",
        end: "[&>ol]:items-end",
      },
    },
    defaultVariants: { align: "center" },
  },
);

const toneIcon = {
  default: InfoIcon,
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: AlertTriangleIcon,
  error: AlertCircleIcon,
} satisfies Record<Exclude<ToastTone, "loading">, typeof InfoIcon>;

const toneIconClass: Record<ToastTone, string> = {
  default: "text-lark-info-content",
  info: "text-lark-info-content",
  success: "text-lark-success-content",
  warning: "text-lark-warning",
  error: "text-lark-danger-content",
  loading: "text-lark-info-content",
};

const ToastProviderContext = createContext<{ toaster: UiToaster<ReactNode> } | null>(null);

function show(
  toaster: UiToaster<ReactNode>,
  type: ToastTone,
  message: ReactNode,
  options: ToastOptions = {},
) {
  const {
    action,
    closable = false,
    closeLabel,
    description,
    dismissible,
    duration,
    icon,
    id,
    onDismiss,
    priority,
  } = options;

  return toaster({
    id,
    title: message,
    description,
    type,
    // UD: 4s minimum without an action, 6s with one; loading stays until updated.
    duration: duration ?? (type === "loading" ? Infinity : action ? 6000 : 5000),
    priority,
    dismissible: dismissible ?? true,
    action,
    data: { closable, closeLabel, icon } satisfies ToastRenderData,
    onDismiss,
  });
}

function createToastApi(toaster: UiToaster<ReactNode> = sharedToaster): ToastApi {
  const api = ((message: ReactNode, options?: ToastOptions) =>
    show(toaster, "info", message, options)) as ToastApi;

  api.info = (message, options) => show(toaster, "info", message, options);
  api.success = (message, options) => show(toaster, "success", message, options);
  api.error = (message, options) => show(toaster, "error", message, options);
  api.warning = (message, options) => show(toaster, "warning", message, options);
  api.loading = (message, options) => show(toaster, "loading", message, options);

  api.dismiss = (id) => toaster.dismiss(id);

  api.update = (id, message, options = {}) => {
    const previous = toaster.toasts().find((item) => item.id === id);
    const previousData = (previous?.data ?? {}) as ToastRenderData;
    const data: ToastRenderData = { ...previousData };

    if (options.closable !== undefined) {
      data.closable = options.closable;
    }
    if (options.closeLabel !== undefined) {
      data.closeLabel = options.closeLabel;
    }
    if (options.icon !== undefined) {
      data.icon = options.icon;
    }

    const patch: UiToastOptions<ReactNode> = { title: message, data };
    if (options.description !== undefined) {
      patch.description = options.description;
    }
    if (options.duration !== undefined) {
      patch.duration = options.duration;
    }
    if (options.priority !== undefined) {
      patch.priority = options.priority;
    }
    if (options.dismissible !== undefined) {
      patch.dismissible = options.dismissible;
    }
    if (options.action !== undefined) {
      patch.action = options.action;
    }
    if (options.onDismiss !== undefined) {
      patch.onDismiss = options.onDismiss;
    }
    if (options.type !== undefined) {
      patch.type = options.type;
    }

    return toaster.update(id, patch);
  };

  return api;
}

/** Creates a toast API bound to the given queue, for isolated surfaces. */
export function createToastApiFor(toaster: UiToaster<ReactNode>): ToastApi {
  return createToastApi(toaster);
}

export { createUiToaster as createToastToaster };

/**
 * Shows a toast from anywhere, matching UD's temporary feedback.
 *
 * ```tsx
 * toast.success("保存成功");
 * toast.error("保存失败", { description: "请稍后重试", closable: true });
 * toast("已删除", { action: { label: "撤销", onAction: undo } });
 * ```
 */
export const toast: ToastApi = createToastApi();

/**
 * Mounts the shared live region once. Place it near the app root.
 * Nested providers reuse the outer region, so toasts are never announced twice.
 */
export function ToastProvider({
  children,
  toaster,
  side = "top",
  align = "center",
  maxVisible = 2,
  offset = 32,
  expanded = true,
  label = "通知",
  closeLabel = "关闭",
  pendingAnnouncement = "加载中",
}: ToastProviderProps) {
  const parent = useContext(ToastProviderContext);
  const activeToaster = toaster ?? sharedToaster;
  // One region per queue: a nested provider showing the same queue reuses it.
  const ownsRegion = parent === null || parent.toaster !== activeToaster;

  return (
    <ToastProviderContext.Provider value={{ toaster: activeToaster }}>
      {children}
      {ownsRegion ? (
        <ToastRegion
          toaster={activeToaster}
          side={side}
          align={align}
          maxVisible={maxVisible}
          expanded={expanded}
          aria-label={label}
          pendingAnnouncement={pendingAnnouncement}
          className={regionStyles({ align })}
          style={{
            top: side === "top" ? offset : undefined,
            bottom: side === "bottom" ? offset : undefined,
            // The region's base style pins start/end to the viewport edge, so
            // the offset must be applied horizontally as well.
            insetInlineStart: align === "start" ? offset : undefined,
            insetInlineEnd: align === "end" ? offset : undefined,
          }}
        >
          {(item) => {
            const data = (item.data ?? {}) as ToastRenderData;
            const type = item.type;
            const ToneIcon = toneIcon[type === "loading" ? "default" : type];

            return (
              <UiToast className={toastStyles({ type })}>
                <span
                  aria-hidden="true"
                  data-slot="toast-icon"
                  className={cn("mt-[3px] flex shrink-0", toneIconClass[type])}
                >
                  {data.icon ??
                    (type === "loading" ? <SpinnerIcon size={16} /> : <ToneIcon size={16} />)}
                </span>

                <div data-slot="toast-content" className="min-w-0 flex-1">
                  <UiToastTitle className="break-words [overflow-wrap:anywhere]" />
                  <UiToastDescription className="mt-0.5 break-words text-lark-caption [overflow-wrap:anywhere]" />
                </div>

                {item.action ? (
                  <UiToastAction
                    className={cn(
                      "shrink-0 cursor-pointer rounded-lark-sm px-1 text-lark-14 text-lark-link",
                      "transition-colors duration-100 ease-lark-linear",
                      "hover:text-lark-link-hover data-[pending]:cursor-default",
                      "focus-visible:outline-2 focus-visible:outline-offset-2",
                      "focus-visible:outline-lark-primary",
                    )}
                  />
                ) : null}

                {data.closable ? (
                  <UiToastClose
                    aria-label={data.closeLabel ?? closeLabel}
                    className={cn(
                      "mt-px -mr-1 flex size-5 shrink-0 cursor-pointer items-center",
                      "justify-center rounded-lark-sm text-lark-icon-2",
                      "transition-colors duration-100 ease-lark-linear",
                      "hover:bg-lark-hover hover:text-lark-icon-1",
                      "focus-visible:outline-2 focus-visible:outline-offset-2",
                      "focus-visible:outline-lark-primary",
                    )}
                  >
                    <XIcon size={16} />
                  </UiToastClose>
                ) : null}
              </UiToast>
            );
          }}
        </ToastRegion>
      ) : null}
    </ToastProviderContext.Provider>
  );
}

/** Alias for `ToastProvider`, for apps that name the host after the queue. */
export const Toaster = ToastProvider;
