import type { CSSProperties, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type PlaceholderVariant = "image" | "error";

export type PlaceholderProps = {
  /** Image placeholder (default) or a failed-to-load placeholder. */
  variant?: PlaceholderVariant;
  /** Box size in pixels. UD default is 36px. */
  size?: number;
  /** Visible or screen-reader label. Override for the local language. */
  label?: string;
  /** Tinted surface instead of a transparent one. */
  muted?: boolean;
  /** Custom icon or content replacing the built-in glyph. */
  children?: ReactNode;
  /** Omit the image role when the placeholder is purely decorative. */
  decorative?: boolean;
  className?: string;
  style?: CSSProperties;
};

function ImageGlyph() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="100%"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      width="100%"
    >
      <rect height="16" rx="2" width="18" x="3" y="4" />
      <circle cx="8.5" cy="9" r="1.4" />
      <path d="m4.5 18 5.2-5.1 3.2 3.1 2.3-2.2 4.3 4.2" />
    </svg>
  );
}

function ErrorGlyph() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="100%"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      width="100%"
    >
      <rect height="16" rx="2" width="18" x="3" y="4" />
      <path d="m4 5 16 14M8.5 9h.01" />
    </svg>
  );
}

/**
 * UD placeholder for images that are absent or failed to load. The default
 * 36px box and N400 glyph follow the Feishu design specification.
 */
export function Placeholder({
  variant = "image",
  size = 36,
  label,
  muted = false,
  children,
  decorative = false,
  className,
  style,
}: PlaceholderProps) {
  const glyphSize = Math.max(12, Math.round(size * 0.62));
  const fallbackLabel = variant === "error" ? "加载失败" : "暂无图片";

  const classes = cn(
    "box-border inline-flex shrink-0 items-center justify-center overflow-hidden",
    "text-lark-neutral-400",
    muted && "rounded-lark-md bg-lark-neutral-100 dark:bg-lark-neutral-200",
    className,
  );
  const dimensions = { width: size, height: size, ...style };
  const content = children ?? (
    <span aria-hidden="true" className="block" style={{ width: glyphSize, height: glyphSize }}>
      {variant === "error" ? <ErrorGlyph /> : <ImageGlyph />}
    </span>
  );

  if (decorative) {
    return (
      <span
        aria-hidden="true"
        className={classes}
        style={dimensions}
        data-slot="placeholder"
        data-variant={variant}
        data-muted={muted ? "" : undefined}
      >
        {content}
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label={label ?? fallbackLabel}
      className={classes}
      style={dimensions}
      data-slot="placeholder"
      data-variant={variant}
      data-muted={muted ? "" : undefined}
    >
      {content}
    </span>
  );
}
