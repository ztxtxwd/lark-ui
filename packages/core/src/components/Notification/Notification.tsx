import {
  createToaster,
  type ToastActionDetails,
  type ToastDismissDetails,
  ToastRegion,
  Toast as UiToast,
  ToastAction as UiToastAction,
  ToastClose as UiToastClose,
  ToastDescription as UiToastDescription,
  type Toaster as UiToaster,
  type ToastOptions as UiToastOptions,
  ToastTitle as UiToastTitle,
} from "@ui-sdk/react/toast";
import { cva } from "class-variance-authority";
import { createContext, isValidElement, type ReactNode, useContext } from "react";
import { AlertCircleIcon, AlertTriangleIcon, CheckCircleIcon, InfoIcon, XIcon } from "../../icons";
import { cn } from "../../lib/cn";

/** The four semantic notification tones documented by UD. */
export type NotificationTone = "info" | "success" | "warning" | "error";

/** UD documents a 360px basic card and a 400px card for richer content. */
export type NotificationSize = "sm" | "md";

export type NotificationActionOptions = {
  /** The action's text, like 查看详情. */
  label: ReactNode;
  /** Runs when pressed. A returned promise keeps the notification open while it runs. */
  onAction?: (event: Event | undefined, details: ToastActionDetails) => unknown;
  /** Renders the action as a link instead of a button. */
  href?: string;
  /** Whether pressing it dismisses the notification. Defaults to true. */
  dismiss?: boolean;
};

export type NotificationOptions = {
  /** The bold first line. Optional: a notification may show only a description. */
  title?: ReactNode;
  /** The body text under the title. */
  description?: ReactNode;
  /** The tone. `notification.info(...)` sets it too; `open()` defaults to info. */
  type?: NotificationTone;
  /**
   * How long the notification stays, in ms. Defaults to 4000 following UD's
   * four-second rule. Notifications with an action stay until dismissed unless
   * you pass one. `Infinity` keeps it until closed.
   */
  duration?: number;
  /** Shows the close button. Defaults to true, as in the UD basic style. */
  closable?: boolean;
  /** The close button's accessible name. Defaults to 关闭. */
  closeLabel?: string;
  /** Hides the tone icon. Defaults to false. */
  showIcon?: boolean;
  /** Replaces the tone icon. */
  icon?: ReactNode;
  /** A text button under the body, like 查看详情. */
  action?: NotificationActionOptions;
  /** Reuses or updates a notification with this id. */
  key?: string;
  /** `sm` is 360px wide, `md` 400px. Defaults to the provider's size. */
  size?: NotificationSize;
  /** How screen readers announce it. Errors are assertive by default. */
  priority?: "polite" | "assertive";
  /** Whether the user can dismiss it with Escape or a swipe. Defaults to true. */
  dismissible?: boolean;
  /** Runs when it closes, with the reason. Calling `details.cancel()` keeps it. */
  onDismiss?: (details: ToastDismissDetails) => void;
};

export type NotificationUpdateOptions = Omit<NotificationOptions, "key">;

export type NotificationShow = {
  (options: NotificationOptions): string;
  (title: ReactNode, options?: NotificationOptions): string;
};

export type NotificationApi = {
  /** Shows a notification; `type` chooses the tone, defaulting to info. */
  open: NotificationShow;
  info: NotificationShow;
  success: NotificationShow;
  warning: NotificationShow;
  error: NotificationShow;
  /** Updates a notification in place. Returns whether it was still showing. */
  update: (key: string, options: NotificationUpdateOptions) => boolean;
  /** Closes one notification, or every notification without a key. */
  destroy: (key?: string) => void;
  /** Alias for `destroy`. */
  dismiss: (key?: string) => void;
};

export type NotificationProviderProps = {
  children?: ReactNode;
  /** A queue of your own. Defaults to the shared `notification` queue. */
  toaster?: UiToaster<ReactNode>;
  /** The edge of the viewport. UD places notifications at the top right. */
  side?: "top" | "bottom";
  /** Where along that edge. Defaults to the right edge. */
  align?: "start" | "center" | "end";
  /** How far from the edges, in px. Defaults to 24. */
  offset?: number;
  /** How many show at once. Older ones wait with their timers stopped. */
  maxVisible?: number;
  /** Keeps the stack expanded. Notifications stack in a column, so this is true by default. */
  expanded?: boolean;
  /** The notification card width. Defaults to `sm` (360px). */
  size?: NotificationSize;
  /** The live landmark's name once a notification is showing. */
  label?: string;
  /** The close button's accessible name. Defaults to 关闭. */
  closeLabel?: string;
  /** What screen readers hear while an action stays pending. */
  pendingAnnouncement?: string;
};

type NotificationRenderData = {
  closable?: boolean;
  closeLabel?: string;
  icon?: ReactNode;
  showIcon?: boolean;
  size?: NotificationSize;
};

const sharedNotificationToaster = createToaster<ReactNode>({ duration: 4000 });

/**
 * UD notification card: a floating light surface, 8px radius, 1px card border,
 * the s5 elevation, 24px padding and 16/24 title + 14/22 body type. The 4px
 * tone accent and the 24px icon follow the extracted client rules.
 * `shadow-lark-float-5` is the single-layer rendering of UD `shadow-s5-down`:
 * the three-layer token bands into visible rings on flat backgrounds.
 */
const notificationStyles = cva(
  [
    "pointer-events-auto relative box-border flex w-full flex-col",
    "max-w-[calc(100vw-32px)] overflow-hidden rounded-lark-lg border border-lark-border-card",
    "bg-lark-float text-lark-title shadow-lark-float-5",
    "transition-[opacity,transform] duration-200 ease-lark",
    "data-[starting-style]:translate-x-2 data-[starting-style]:opacity-0",
    "data-[ending-style]:translate-x-2 data-[ending-style]:opacity-0",
    "motion-reduce:transition-none",
    "outline-none focus-visible:outline-solid focus-visible:outline-2",
    "focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
  ],
  {
    variants: {
      size: {
        sm: "w-[360px]",
        md: "w-[400px]",
      },
    },
    defaultVariants: { size: "sm" },
  },
);

const regionStyles = cva(
  [
    "w-max max-w-[calc(100vw-32px)]",
    "[&>ol]:m-0 [&>ol]:flex [&>ol]:list-none [&>ol]:flex-col",
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
    defaultVariants: { align: "end" },
  },
);

const toneIcon = {
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: AlertTriangleIcon,
  error: AlertCircleIcon,
} satisfies Record<NotificationTone, typeof InfoIcon>;

const toneIconClass: Record<NotificationTone, string> = {
  info: "text-lark-info-content",
  success: "text-lark-success-content",
  warning: "text-lark-warning",
  error: "text-lark-danger-content",
};

/**
 * The client draws the 4px accent with the tone's content colour
 * (`.ud__notification__notice-border`), which is stronger than the fill for
 * success and warning.
 */
const toneAccentClass: Record<NotificationTone, string> = {
  info: "bg-lark-info-content",
  success: "bg-lark-success-content",
  warning: "bg-lark-warning-content",
  error: "bg-lark-danger-content",
};

function isTone(value: string): value is NotificationTone {
  return value === "info" || value === "success" || value === "warning" || value === "error";
}

function isNotificationOptions(
  value: ReactNode | NotificationOptions,
): value is NotificationOptions {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !isValidElement(value) &&
    typeof (value as Promise<unknown>).then !== "function"
  );
}

function show(
  toaster: UiToaster<ReactNode>,
  type: NotificationTone,
  titleOrOptions: ReactNode | NotificationOptions,
  maybeOptions?: NotificationOptions,
) {
  const options: NotificationOptions = isNotificationOptions(titleOrOptions)
    ? titleOrOptions
    : { ...maybeOptions, title: titleOrOptions };

  const {
    action,
    closable = true,
    closeLabel,
    description,
    dismissible,
    duration,
    icon,
    key,
    onDismiss,
    priority,
    showIcon,
    size,
    title,
  } = options;

  return toaster({
    id: key,
    title,
    description,
    type,
    // UD: four seconds by default; an interactive notification waits for the user.
    duration: duration ?? (action ? Infinity : 4000),
    priority,
    dismissible: dismissible ?? true,
    action,
    data: {
      closable,
      closeLabel,
      icon,
      showIcon,
      size,
    } satisfies NotificationRenderData,
    onDismiss,
  });
}

function createNotificationApi(
  toaster: UiToaster<ReactNode> = sharedNotificationToaster,
): NotificationApi {
  const showTone = (type: NotificationTone): NotificationShow =>
    ((titleOrOptions: ReactNode | NotificationOptions, options?: NotificationOptions) =>
      show(toaster, type, titleOrOptions, options)) as NotificationShow;

  const api = {
    open: ((titleOrOptions: ReactNode | NotificationOptions, options?: NotificationOptions) => {
      const type = isNotificationOptions(titleOrOptions)
        ? (titleOrOptions.type ?? "info")
        : (options?.type ?? "info");
      return show(toaster, type, titleOrOptions, options);
    }) as NotificationShow,
    info: showTone("info"),
    success: showTone("success"),
    warning: showTone("warning"),
    error: showTone("error"),
  } as NotificationApi;

  api.update = (key, options) => {
    const previous = toaster.toasts().find((item) => item.id === key);
    const previousData = (previous?.data ?? {}) as NotificationRenderData;
    const data: NotificationRenderData = { ...previousData };

    if (options.closable !== undefined) {
      data.closable = options.closable;
    }
    if (options.closeLabel !== undefined) {
      data.closeLabel = options.closeLabel;
    }
    if (options.icon !== undefined) {
      data.icon = options.icon;
    }
    if (options.showIcon !== undefined) {
      data.showIcon = options.showIcon;
    }
    if (options.size !== undefined) {
      data.size = options.size;
    }

    const patch: UiToastOptions<ReactNode> = { data };
    if (options.title !== undefined) {
      patch.title = options.title;
    }
    if (options.description !== undefined) {
      patch.description = options.description;
    }
    if (options.type !== undefined) {
      patch.type = options.type;
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

    return toaster.update(key, patch);
  };

  api.destroy = (key) => toaster.dismiss(key);
  api.dismiss = (key) => toaster.dismiss(key);

  return api;
}

/**
 * Shows a notification from anywhere. Notifications are global, informative
 * messages; they stack at the top right, pause on hover and stay for 4s.
 *
 * ```tsx
 * notification.success({ title: "更改已保存", description: "所有文件已同步" });
 * notification.error("保存失败", { action: { label: "重试", onAction: retry } });
 * const key = notification.info({ title: "正在上传…", duration: Infinity });
 * notification.update(key, { type: "success", title: "上传完成" });
 * ```
 */
export const notification: NotificationApi = createNotificationApi();

export { createToaster };

/**
 * Creates a notification API bound to the given queue. Stories and isolated
 * surfaces use this to avoid sharing the global `notification` queue.
 */
export function createNotificationApiFor(toaster: UiToaster<ReactNode>): NotificationApi {
  return createNotificationApi(toaster);
}

const NotificationProviderContext = createContext<{ toaster: UiToaster<ReactNode> } | null>(null);

/**
 * Mounts the shared notification live region once. Place it near the app root.
 * Nested providers reuse the outer region, so nothing is announced twice.
 */
export function NotificationProvider({
  children,
  toaster,
  side = "top",
  align = "end",
  offset = 24,
  maxVisible = 5,
  expanded = true,
  size = "sm",
  label = "通知提醒",
  closeLabel = "关闭",
  pendingAnnouncement = "加载中",
}: NotificationProviderProps) {
  const parent = useContext(NotificationProviderContext);
  const activeToaster = toaster ?? sharedNotificationToaster;
  // One region per queue: a nested provider showing the same queue reuses it.
  const ownsRegion = parent === null || parent.toaster !== activeToaster;

  return (
    <NotificationProviderContext.Provider value={{ toaster: activeToaster }}>
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
            insetInlineStart: align === "start" ? offset : undefined,
            insetInlineEnd: align === "end" ? offset : undefined,
          }}
        >
          {(item) => {
            const data = (item.data ?? {}) as NotificationRenderData;
            const type = isTone(item.type) ? item.type : "info";
            const Icon = toneIcon[type];
            const cardSize = data.size ?? size;
            const closable = data.closable ?? true;
            const showIcon = data.showIcon ?? true;
            const hasTitle = item.title !== undefined && item.title !== null;

            return (
              <UiToast
                data-slot="notification"
                data-tone={type}
                className={cn(
                  notificationStyles({ size: cardSize }),
                  "py-6",
                  // The 24px icon starts at 28px, so copy starts 16px after it
                  // (68px). The client's 40px figure only works with its extra
                  // nested indentation; using it here would overlap the icon.
                  showIcon ? "pl-[68px] pr-4" : "pl-7 pr-6",
                )}
              >
                <span
                  aria-hidden="true"
                  data-slot="notification-accent"
                  className={cn("absolute inset-y-0 left-0 w-1", toneAccentClass[type])}
                />

                {showIcon ? (
                  <span
                    aria-hidden="true"
                    data-slot="notification-icon"
                    className={cn("absolute top-6 left-7 flex", toneIconClass[type])}
                  >
                    {data.icon ?? <Icon size={24} />}
                  </span>
                ) : null}

                <div data-slot="notification-content" className="min-w-0 flex-1">
                  <UiToastTitle
                    className={cn(
                      "text-lark-16 font-medium leading-6 text-lark-title",
                      closable ? "pr-4" : null,
                    )}
                  />
                  <UiToastDescription
                    className={cn(
                      "text-lark-14 leading-[22px] text-lark-body",
                      // A body-only notification shares the first line with
                      // the close button, so keep its copy clear of it.
                      hasTitle ? "mt-2" : closable ? "pr-4" : null,
                    )}
                  />
                  {item.action ? (
                    <div className="mt-2 flex justify-end">
                      <UiToastAction
                        className={cn(
                          "shrink-0 cursor-pointer rounded-lark-sm px-1 py-0.5",
                          "text-lark-14 font-medium text-lark-link",
                          "transition-colors duration-100 ease-lark-linear",
                          "hover:text-lark-link-hover data-[pending]:cursor-default",
                          "focus-visible:outline-2 focus-visible:outline-offset-2",
                          "focus-visible:outline-lark-primary",
                        )}
                      />
                    </div>
                  ) : null}
                </div>

                {closable ? (
                  <UiToastClose
                    aria-label={data.closeLabel ?? closeLabel}
                    className={cn(
                      "absolute top-5 right-5 flex size-6 cursor-pointer items-center",
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
    </NotificationProviderContext.Provider>
  );
}

/**
 * Alias for `NotificationProvider`. Named with the component prefix so it can
 * live in the same barrel as Toast's `Toaster`.
 */
export const NotificationToaster = NotificationProvider;

/**
 * Alias for `NotificationProvider`, for apps that name the host after the queue.
 * The folder entry exports it as `NotificationToaster` so the package barrel can
 * also export Toast's `Toaster`.
 */
export const Toaster = NotificationProvider;
