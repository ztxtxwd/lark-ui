import {
  Dialog as UiDialog,
  DialogBackdrop as UiDialogBackdrop,
  DialogClose as UiDialogClose,
  DialogContent as UiDialogContent,
  DialogTitle as UiDialogTitle,
} from "@ui-sdk/react/dialog";
import {
  type KeyboardEvent,
  type ReactNode,
  type SVGProps,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "../../icons";
import { cn } from "../../lib/cn";
import { Placeholder } from "../Placeholder";

export type ImageViewerImage = {
  /** The image source. */
  src: string;
  /** Alternative text for this image. */
  alt?: string;
  /** File name offered by the download action. */
  downloadName?: string;
};

export type ImageViewerProps = {
  /** Whether the viewer is open. Pass it to control the viewer. */
  open?: boolean;
  /** Whether the viewer starts open, when uncontrolled. */
  defaultOpen?: boolean;
  /** Runs when the viewer asks to open or close. */
  onOpenChange?: (open: boolean) => void;
  /** A single image. Ignored when `images` is given. */
  src?: string;
  /** Alternative text for the single image. */
  alt?: string;
  /** The images to browse. */
  images?: ImageViewerImage[];
  /** The visible image index. Pass it to control the index. */
  index?: number;
  /** The visible image index at first, when uncontrolled. Defaults to 0. */
  defaultIndex?: number;
  /** Runs when the visible image changes through the toolbar or the keyboard. */
  onIndexChange?: (index: number) => void;
  /** Shows the bottom toolbar with zoom, rotate and download. Defaults to true. */
  showToolbar?: boolean;
  /** Extra actions appended to the toolbar, after a divider. */
  toolbarExtra?: ReactNode;
  /** Custom content shown in the top-left corner, like a title or an edit action. */
  children?: ReactNode;
  /** Accessible name for the viewer and the dialog. */
  "aria-label"?: string;
  closeLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  zoomInLabel?: string;
  zoomOutLabel?: string;
  resetLabel?: string;
  rotateLabel?: string;
  downloadLabel?: string;
  /** Extra classes for the dialog content. */
  className?: string;
  /** Extra classes for the image element. */
  imageClassName?: string;
};

type ViewerIconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  size?: number | string;
};

function ViewerIcon({ size = 16, children, ...props }: ViewerIconProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      viewBox="0 0 16 16"
      width={size}
      {...props}
    >
      {children}
    </svg>
  );
}

function ZoomInIcon(props: ViewerIconProps) {
  return (
    <ViewerIcon {...props}>
      <circle cx="7" cy="7" r="4.5" />
      <path d="m10.3 10.3 3.2 3.2M5 7h4M7 5v4" />
    </ViewerIcon>
  );
}

function ZoomOutIcon(props: ViewerIconProps) {
  return (
    <ViewerIcon {...props}>
      <circle cx="7" cy="7" r="4.5" />
      <path d="m10.3 10.3 3.2 3.2M5 7h4" />
    </ViewerIcon>
  );
}

function FitIcon(props: ViewerIconProps) {
  return (
    <ViewerIcon {...props}>
      <path d="M2.5 6V3.5a1 1 0 0 1 1-1H6M10 2.5h2.5a1 1 0 0 1 1 1V6M13.5 10v2.5a1 1 0 0 1-1 1H10M6 13.5H3.5a1 1 0 0 1-1-1V10" />
    </ViewerIcon>
  );
}

function RotateIcon(props: ViewerIconProps) {
  return (
    <ViewerIcon {...props}>
      <path d="M13 8a5 5 0 1 1-1.55-3.58" />
      <path d="M13.2 2.6v3.6H9.6" />
    </ViewerIcon>
  );
}

function DownloadIcon(props: ViewerIconProps) {
  return (
    <ViewerIcon {...props}>
      <path d="M8 2.5v7.5M4.8 6.8 8 10l3.2-3.2M2.8 12.5h10.4" />
    </ViewerIcon>
  );
}

const MIN_SCALE = 0.1;
const MAX_SCALE = 5;
const ZOOM_STEP = 0.1;

const rotationClassName: Record<number, string> = {
  0: "rotate-0",
  90: "rotate-90",
  180: "rotate-180",
  270: "-rotate-90",
};

const toolbarButtonClass = cn(
  "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lark-xs text-white",
  "transition-colors duration-100 ease-lark-linear hover:bg-white/10",
  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white",
  "disabled:cursor-not-allowed disabled:text-white/30 disabled:hover:bg-transparent",
);

function ToolbarButton({
  label,
  onClick,
  disabled = false,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={toolbarButtonClass}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span aria-hidden="true" className="mx-1 h-4 w-px shrink-0 bg-white/20" />;
}

function downloadNameOf(image: ImageViewerImage, fallback: string) {
  if (image.downloadName) return image.downloadName;
  if (image.src.startsWith("data:")) return image.alt || fallback;
  const clean = image.src.split(/[?#]/)[0];
  const base = clean.slice(clean.lastIndexOf("/") + 1);
  return base || image.alt || fallback;
}

/**
 * UD image viewer. A modal lightbox with an 80% black mask, prev/next
 * navigation, zoom, rotate and download, built on the ui-sdk dialog so focus
 * stays trapped and Escape returns to where the user started.
 *
 * Controlled usage:
 *
 * ```tsx
 * const [open, setOpen] = useState(false);
 * <button onClick={() => setOpen(true)}>预览</button>
 * <ImageViewer open={open} onOpenChange={setOpen} images={images} />
 * ```
 */
export function ImageViewer({
  open,
  defaultOpen = false,
  onOpenChange,
  src,
  alt,
  images,
  index,
  defaultIndex = 0,
  onIndexChange,
  showToolbar = true,
  toolbarExtra,
  children,
  "aria-label": ariaLabel = "图片预览",
  closeLabel = "关闭",
  previousLabel = "上一张",
  nextLabel = "下一张",
  zoomInLabel = "放大",
  zoomOutLabel = "缩小",
  resetLabel = "重置",
  rotateLabel = "向左旋转",
  downloadLabel = "下载",
  className,
  imageClassName,
}: ImageViewerProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const isOpen = open ?? internalOpen;
  const list = images && images.length > 0 ? images : src ? [{ src, alt }] : [];
  const total = list.length;
  const activeIndex = total === 0 ? 0 : Math.min(Math.max(index ?? internalIndex, 0), total - 1);
  const current = list[activeIndex];
  const imageFailed = current != null && failedSrc === current.src;
  const imageAlt =
    current?.alt ??
    (alt
      ? total > 1
        ? `${alt} ${activeIndex + 1}`
        : alt
      : total > 1
        ? `${ariaLabel} ${activeIndex + 1}`
        : ariaLabel);

  // Reset the view when the viewer opens, and when the visible image changes
  // from the outside (for example a controlled `index`).
  useEffect(() => {
    if (!isOpen) return;
    setScale(1);
    setRotation(0);
    // Reopening retries an image that failed on a previous visit.
    setFailedSrc(null);
  }, [isOpen]);

  const previousView = useRef({ index: activeIndex, src: current?.src });
  useEffect(() => {
    const previous = previousView.current;
    previousView.current = { index: activeIndex, src: current?.src };
    if (previous.index === activeIndex && previous.src === current?.src) return;
    setScale(1);
    setRotation(0);
  }, [activeIndex, current?.src]);

  const handleOpenChange = (next: boolean) => {
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const goTo = (next: number) => {
    if (total === 0 || next < 0 || next >= total || next === activeIndex) return;
    setScale(1);
    setRotation(0);
    if (index === undefined) setInternalIndex(next);
    onIndexChange?.(next);
  };

  const zoomBy = (delta: number) => {
    setScale((currentScale) => {
      const next = Math.round((currentScale + delta) * 100) / 100;
      return Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
    });
  };

  const resetView = () => {
    setScale(1);
    setRotation(0);
  };

  const rotate = () => {
    setRotation((currentRotation) => (currentRotation + 270) % 360);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target as HTMLElement | null;
    if (
      target?.isContentEditable ||
      target?.tagName === "INPUT" ||
      target?.tagName === "TEXTAREA" ||
      target?.tagName === "SELECT"
    ) {
      return;
    }

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        goTo(activeIndex - 1);
        break;
      case "ArrowRight":
        event.preventDefault();
        goTo(activeIndex + 1);
        break;
      case "ArrowUp":
      case "+":
      case "=":
        event.preventDefault();
        zoomBy(ZOOM_STEP);
        break;
      case "ArrowDown":
      case "-":
      case "_":
        event.preventDefault();
        zoomBy(-ZOOM_STEP);
        break;
      case "0":
        event.preventDefault();
        resetView();
        break;
      default:
        break;
    }
  };

  return (
    <UiDialog open={isOpen} onOpenChange={handleOpenChange}>
      <UiDialogBackdrop
        className={cn(
          "fixed inset-0 z-50 bg-black/80",
          "transition-opacity duration-200 ease-lark",
          "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
        )}
      />
      <UiDialogContent
        initialFocus="content"
        onKeyDown={handleKeyDown}
        className={cn(
          // Center with auto margins instead of translate/scale: a transform
          // on this element would make it the containing block for the fixed
          // toolbar and close button, pinning them to the image instead of
          // the viewport.
          "fixed inset-0 z-50 m-auto flex h-fit w-fit max-w-[80vw]",
          "max-h-[calc(100vh-176px)] flex-col items-center justify-center bg-transparent p-0",
          "text-white outline-none",
          "transition-opacity duration-200 ease-lark",
          "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
          className,
        )}
      >
        <UiDialogTitle className="sr-only">{ariaLabel}</UiDialogTitle>

        {children ? (
          <div className="fixed top-5 left-5 z-[60] flex items-center gap-2">{children}</div>
        ) : null}

        {current ? (
          <div
            className={cn(
              "flex max-h-[calc(100vh-176px)] max-w-[80vw] items-center justify-center overflow-auto",
              "overscroll-contain",
            )}
          >
            {imageFailed ? (
              // The viewer is a dark surface in both themes, so the default
              // N400 placeholder colour (dark grey in the dark theme) would
              // disappear on the black mask.
              <Placeholder variant="error" size={64} className="text-white/70" />
            ) : (
              /*
                Scale is computed geometry rather than a design token, so it
                stays on the element. Rotation uses token-free utility classes.
              */
              <div
                style={{ transform: `scale(${scale})` }}
                className="flex items-center justify-center transition-transform duration-100 ease-lark"
              >
                <img
                  src={current.src}
                  alt={imageAlt}
                  data-rotation={rotation}
                  draggable={false}
                  onError={() => setFailedSrc(current.src)}
                  className={cn(
                    "block max-h-[calc(100vh-176px)] max-w-[80vw] select-none object-contain",
                    "transition-transform duration-100 ease-lark",
                    rotationClassName[rotation] ?? "rotate-0",
                    imageClassName,
                  )}
                />
              </div>
            )}
          </div>
        ) : (
          <p className="px-6 py-10 text-lark-14 text-white/80">暂无图片</p>
        )}

        {showToolbar && current ? (
          <div
            role="toolbar"
            aria-label="图片操作"
            className={cn(
              "fixed bottom-5 left-1/2 z-[60] flex h-10 -translate-x-1/2 items-center rounded-lark-sm",
              "bg-black/75 px-1 text-white",
            )}
          >
            {total > 1 ? (
              <>
                <ToolbarButton
                  label={previousLabel}
                  disabled={activeIndex === 0}
                  onClick={() => goTo(activeIndex - 1)}
                >
                  <ChevronLeftIcon size={18} />
                </ToolbarButton>
                <ToolbarButton
                  label={nextLabel}
                  disabled={activeIndex === total - 1}
                  onClick={() => goTo(activeIndex + 1)}
                >
                  <ChevronRightIcon size={18} />
                </ToolbarButton>
                <span
                  aria-live="polite"
                  className="min-w-11 px-1 text-center text-lark-12 tabular-nums text-white/90"
                >
                  {activeIndex + 1} / {total}
                </span>
                <ToolbarDivider />
              </>
            ) : null}

            <ToolbarButton
              label={zoomOutLabel}
              disabled={scale <= MIN_SCALE + 0.001}
              onClick={() => zoomBy(-ZOOM_STEP)}
            >
              <ZoomOutIcon />
            </ToolbarButton>
            <span className="w-11 text-center text-lark-12 tabular-nums text-white/90">
              {Math.round(scale * 100)}%
            </span>
            <ToolbarButton
              label={zoomInLabel}
              disabled={scale >= MAX_SCALE - 0.001}
              onClick={() => zoomBy(ZOOM_STEP)}
            >
              <ZoomInIcon />
            </ToolbarButton>
            <ToolbarButton label={resetLabel} onClick={resetView}>
              <FitIcon />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton label={rotateLabel} onClick={rotate}>
              <RotateIcon />
            </ToolbarButton>
            <a
              href={current.src}
              download={downloadNameOf(current, `${ariaLabel}.png`)}
              aria-label={downloadLabel}
              title={downloadLabel}
              className={toolbarButtonClass}
            >
              <DownloadIcon />
            </a>

            {toolbarExtra ? (
              <>
                <ToolbarDivider />
                <div className="flex items-center">{toolbarExtra}</div>
              </>
            ) : null}
          </div>
        ) : null}

        <UiDialogClose
          aria-label={closeLabel}
          className={cn(
            "fixed top-5 right-5 z-[60] flex size-9 cursor-pointer items-center justify-center",
            "rounded-full bg-black text-white transition-colors duration-100 ease-lark-linear",
            "hover:bg-black/50 hover:text-white/85",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
          )}
        >
          <XIcon size={18} />
        </UiDialogClose>
      </UiDialogContent>
    </UiDialog>
  );
}
