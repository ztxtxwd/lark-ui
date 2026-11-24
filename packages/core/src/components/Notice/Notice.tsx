import { cva } from "class-variance-authority";
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from "react";
import { useState } from "react";
import { AlertCircleIcon, AlertTriangleIcon, CheckCircleIcon, InfoIcon, XIcon } from "../../icons";
import { cn } from "../../lib/cn";

export type NoticeTone = "info" | "success" | "warning" | "danger" | "neutral";
export type NoticeSize = "sm" | "md";

/**
 * UD filled notice: soft tone background, 6px radius, 14/22 text.
 * The extracted client rule is `.ud__notice--filled { padding: 9px 0 9px 16px;
 * font-size: 14px; line-height: 1.5715 }`; title and content inherit it. One
 * line is therefore 9 + 22 + 9 = 40px, which the UD spec art matches.
 */
const noticeStyles = cva(
  "relative box-border flex w-full items-start rounded-lark-md text-left text-lark-title",
  {
    variants: {
      tone: {
        info: "bg-lark-info-soft",
        success: "bg-lark-success-soft",
        warning: "bg-lark-warning-soft",
        danger: "bg-lark-danger-soft",
        neutral: "bg-lark-filler",
      },
      size: {
        // The UD client only defines one size. `sm` is the compact density
        // built from the documented 12/20 type step and 4px spacing unit.
        sm: "px-3 py-1 text-lark-12",
        md: "px-4 py-[9px] text-lark-14",
      },
    },
    defaultVariants: {
      tone: "info",
      size: "md",
    },
  },
);

const iconTone: Record<NoticeTone, string> = {
  info: "text-lark-info-content",
  success: "text-lark-success-content",
  warning: "text-lark-warning",
  danger: "text-lark-danger-content",
  neutral: "text-lark-icon-2",
};

const toneIcon = {
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: AlertTriangleIcon,
  danger: AlertCircleIcon,
  neutral: InfoIcon,
} satisfies Record<NoticeTone, typeof InfoIcon>;

export type NoticeProps = Omit<ComponentPropsWithoutRef<"div">, "children" | "title" | "role"> & {
  /** Semantic tone. UD documents info, success, error and warning. */
  tone?: NoticeTone;
  /** `md` matches UD's 9px/16px padding; `sm` is the compact density. */
  size?: NoticeSize;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Overrides the tone icon. Colour still follows the tone. */
  icon?: ReactNode;
  showIcon?: boolean;
  closable?: boolean;
  onClose?: (event: MouseEvent<HTMLButtonElement>) => void;
  action?: ReactNode;
  /**
   * Alert (danger) should only announce assertively when the host application
   * knows it is appropriate. Defaults to the polite `status` live region.
   */
  role?: "status" | "alert";
};

export function Notice({
  tone = "info",
  size = "md",
  title,
  description,
  children,
  icon,
  showIcon = true,
  closable = false,
  onClose,
  action,
  role = "status",
  className,
  ...props
}: NoticeProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) {
    return null;
  }

  const content = description ?? children;
  const hasTitle = title !== undefined && title !== null;
  const iconSize = size === "sm" ? 14 : 16;
  const ToneIcon = toneIcon[tone];

  function handleClose(event: MouseEvent<HTMLButtonElement>) {
    onClose?.(event);
    setDismissed(true);
  }

  return (
    <div
      {...props}
      role={role}
      data-slot="notice"
      data-tone={tone}
      data-size={size}
      className={cn(noticeStyles({ tone, size }), className)}
    >
      {showIcon ? (
        <span
          data-slot="notice-icon"
          className={cn("mt-[3px] mr-2 inline-flex shrink-0", iconTone[tone])}
        >
          {icon ?? <ToneIcon size={iconSize} />}
        </span>
      ) : null}

      <div className="min-w-0 flex-1">
        {hasTitle ? (
          <>
            <div data-slot="notice-title" className="mb-1 break-words [overflow-wrap:anywhere]">
              {title}
            </div>
            {content !== undefined && content !== null ? (
              <div data-slot="notice-description" className="break-words [overflow-wrap:anywhere]">
                {content}
              </div>
            ) : null}
            {action !== undefined && action !== null ? (
              <div data-slot="notice-action" className="mt-1">
                {action}
              </div>
            ) : null}
          </>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            {content !== undefined && content !== null ? (
              <div
                data-slot="notice-description"
                className="min-w-0 flex-1 break-words [overflow-wrap:anywhere]"
              >
                {content}
              </div>
            ) : null}
            {action !== undefined && action !== null ? (
              <div data-slot="notice-action" className="shrink-0">
                {action}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {closable ? (
        <button
          type="button"
          aria-label="关闭"
          data-slot="notice-close"
          onClick={handleClose}
          className={cn(
            // UD's close is a 24px icon button with `margin: -1px ... -1px`
            // (`.ud__notice__close.ud__button--icon`); the negative block margin
            // keeps a single-line notice at 40px and centres the icon on the
            // first line. The compact size matches its 20px line instead.
            size === "sm" ? "size-5" : "-my-px size-6",
            "ml-3 flex shrink-0 items-center justify-center rounded-lark-sm",
            "text-lark-icon-2 transition-colors duration-100 ease-lark-linear",
            "hover:bg-lark-hover focus-visible:bg-lark-hover",
            "focus-visible:outline-2 focus-visible:outline-offset-2",
            "focus-visible:outline-lark-primary",
          )}
        >
          <XIcon size={iconSize} />
        </button>
      ) : null}
    </div>
  );
}
