import {
  type ComponentProps,
  type ReactNode,
  type Ref,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { AlertCircleIcon, CheckCircleIcon, PlusIcon, SpinnerIcon, XIcon } from "../../icons";
import { cn } from "../../lib/cn";
import { Button } from "../Button";
import { Progress, type ProgressSize } from "../Progress";

export type UploadListType = "text" | "picture";
export type UploadFileStatus = "ready" | "uploading" | "done" | "error" | "removed";

export type UploadFile = {
  uid: string;
  name: string;
  size?: number;
  status?: UploadFileStatus;
  /** 0–100. */
  percent?: number;
  /** Remote preview URL. */
  url?: string;
  /** Optional thumbnail URL, used before `url` is available. */
  thumbUrl?: string;
  type?: string;
  /** Human-readable failure reason. */
  error?: string;
  /** The local file, when the entry came from the picker or a drop. */
  originFile?: File;
  /** Whatever the request returned on success. */
  response?: unknown;
};

export type UploadChangeInfo = {
  file: UploadFile;
  fileList: UploadFile[];
};

export type UploadProgressConfig = {
  /**
   * Show the percent. Text items render it in the subtitle row; picture tiles
   * render it below the centered bar.
   */
  showInfo?: boolean;
  size?: ProgressSize;
};

export type BeforeUploadResult = boolean | File | Blob | void;
export type BeforeUpload = (
  file: File,
  fileList: File[],
) => BeforeUploadResult | Promise<BeforeUploadResult>;

export type UploadRequestHelpers = {
  onProgress: (percent: number) => void;
  onSuccess: (response?: unknown) => void;
  onError: (error: unknown) => void;
};

export type UploadRequestOptions = UploadRequestHelpers & {
  file: File;
  filename: string;
};

export type UploadRequestResult = { abort?: () => void } | void;
export type UploadRequest = (
  options: UploadRequestOptions,
) => UploadRequestResult | Promise<UploadRequestResult>;
export type UploadHandler = (file: File, helpers: UploadRequestHelpers) => void | Promise<void>;

export type UploadProps = Omit<ComponentProps<"div">, "onChange" | "children" | "ref"> & {
  /** Same as the native `accept` attribute: extensions, MIME types or wildcards. */
  accept?: string;
  multiple?: boolean;
  /** Total number of files allowed, including `defaultFileList`. */
  maxCount?: number;
  /** Largest accepted file, in bytes. */
  maxSize?: number;
  disabled?: boolean;
  /** Replace the trigger with the UD dashed drop area. */
  drag?: boolean;
  /** Return `false` to reject a file, or a new `File`/`Blob` to upload instead. */
  beforeUpload?: BeforeUpload;
  /** A request receives progress callbacks. Without one nothing uploads automatically. */
  customRequest?: UploadRequest;
  /** Simpler alternative to `customRequest`. */
  onUpload?: UploadHandler;
  /** Controlled file list. */
  fileList?: UploadFile[];
  defaultFileList?: UploadFile[];
  onChange?: (info: UploadChangeInfo) => void;
  onRemove?: (file: UploadFile) => void | boolean | Promise<void | boolean>;
  listType?: UploadListType;
  showUploadList?: boolean;
  /**
   * Progress bar settings; `false` hides the bar. Text items pin a bare line
   * to the item's bottom edge (`showInfo` moves the percent into the subtitle
   * row); picture tiles center the line over a dimmed tile.
   */
  progress?: UploadProgressConfig | false;
  /** Extra requirement text. Defaults to a summary built from `accept`, `maxSize` and `maxCount`. */
  hint?: ReactNode;
  ref?: Ref<HTMLDivElement>;
};

let uidSeed = 0;

function createUid() {
  uidSeed += 1;
  return `lark-upload-${Date.now()}-${uidSeed}`;
}

function formatFileSize(size?: number): string {
  if (size === undefined) {
    return "";
  }
  if (size < 1024) {
    return `${size} B`;
  }
  const units = ["KB", "MB", "GB", "TB"];
  let value = size / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value >= 10 ? Math.round(value) : Number(value.toFixed(1))} ${units[unit]}`;
}

function acceptsFile(file: File, accept?: string): boolean {
  if (!accept) {
    return true;
  }
  const rules = accept
    .split(",")
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean);
  if (rules.length === 0) {
    return true;
  }
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return rules.some((rule) => {
    if (rule === "*" || rule === "*/*") {
      return true;
    }
    if (rule.startsWith(".")) {
      return name.endsWith(rule);
    }
    if (rule.endsWith("/*")) {
      return type.startsWith(rule.slice(0, -1));
    }
    return type === rule;
  });
}

function UploadIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="text-lark-icon-3"
      fill="none"
      focusable="false"
      height={size}
      viewBox="0 0 48 48"
      width={size}
    >
      <path
        d="M24 31V12m0 0-7 7m7-7 7 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
      <path
        d="M10 29v6a4 4 0 0 0 4 4h20a4 4 0 0 0 4-4v-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function FileGlyph({ size = 40 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size}
      viewBox="0 0 40 40"
      width={size}
    >
      <path
        d="M10 4.5h12.5L30 12v23.5H10z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path d="M22.5 4.5V12H30" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <path
        d="M14.5 19h11M14.5 24h11M14.5 29h7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function RetryIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="14"
      viewBox="0 0 16 16"
      width="14"
    >
      <path
        d="M13.25 8a5.25 5.25 0 1 1-1.55-3.72M13.25 2.75v3.5h-3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

const iconButtonClass = cn(
  "flex size-6 shrink-0 items-center justify-center rounded-lark-sm",
  "text-lark-icon-2 transition-colors duration-100",
  "hover:bg-[var(--lark-fill-hover)] hover:text-lark-primary-content",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
  "disabled:cursor-not-allowed disabled:text-lark-icon-disabled",
  "disabled:hover:bg-transparent disabled:hover:text-lark-icon-disabled",
);

function PicturePreview({ file }: { file: UploadFile }) {
  const [objectUrl, setObjectUrl] = useState<string>();

  useEffect(() => {
    if (file.url || file.thumbUrl || !file.originFile?.type.startsWith("image/")) {
      setObjectUrl(undefined);
      return;
    }
    const next = URL.createObjectURL(file.originFile);
    setObjectUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file.url, file.thumbUrl, file.originFile]);

  const source = file.url ?? file.thumbUrl ?? objectUrl;
  if (source) {
    return <img alt="" aria-hidden="true" className="size-full object-cover" src={source} />;
  }
  return (
    <span className="flex size-full items-center justify-center text-lark-icon-3">
      <FileGlyph size={24} />
    </span>
  );
}

function UploadPictureItem({
  file,
  disabled,
  progress,
  onRemove,
}: {
  file: UploadFile;
  disabled: boolean;
  progress: UploadProgressConfig | false;
  onRemove: () => void;
}) {
  const uploading = file.status === "uploading";
  const isError = file.status === "error";
  const showPercent = uploading && progress !== false && progress?.showInfo === true;

  return (
    <li
      data-slot="upload-picture"
      data-status={file.status ?? "ready"}
      title={isError ? (file.error ?? file.name) : file.name}
      className={cn(
        "relative size-20 shrink-0 overflow-hidden rounded-lark-lg border border-solid bg-lark-filler",
        isError ? "border-lark-danger-content" : "border-lark-border-card",
      )}
    >
      <PicturePreview file={file} />
      <span className="sr-only">{file.name}</span>

      {uploading && progress !== false ? (
        <>
          {/* The client dims the tile while it uploads and centers a bare line over it. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 z-1 bg-[var(--lark-bg-mask)] opacity-40"
          />
          {/* Client: width:100% + padding:0 8px, so the bar insets stay symmetric. */}
          <Progress
            value={file.percent ?? 0}
            size={progress?.size ?? "sm"}
            aria-label={`${file.name} 上传进度`}
            className="absolute left-0 top-1/2 z-4 w-full -translate-y-1/2 px-2"
          />
          {showPercent ? (
            <span
              className="absolute inset-x-0 top-1/2 z-4 -translate-y-[calc(-50%_-_12px)] text-center text-lark-12 leading-5 text-white tabular-nums"
              aria-hidden="true"
            >
              {file.percent ?? 0}%
            </span>
          ) : null}
        </>
      ) : null}

      {file.status === "done" ? (
        <span className="absolute bottom-1 left-1 z-4 flex size-4 items-center justify-center rounded-full bg-lark-canvas text-lark-success-content">
          <CheckCircleIcon size={12} />
        </span>
      ) : null}
      {isError ? (
        <span className="absolute bottom-1 left-1 z-4 flex size-4 items-center justify-center rounded-full bg-lark-canvas text-lark-danger-content">
          <AlertCircleIcon size={12} />
        </span>
      ) : null}

      <button
        type="button"
        aria-label={`移除 ${file.name}`}
        disabled={disabled}
        onClick={onRemove}
        className={cn(
          "absolute right-1 top-1 z-4 flex size-5 items-center justify-center rounded-full",
          // Keep the visual 20px disc but give it a 24px pointer target.
          "after:absolute after:-inset-0.5 after:content-['']",
          "bg-[var(--lark-bg-mask)] text-white transition-opacity duration-100",
          "hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <XIcon size={12} />
      </button>
    </li>
  );
}

function UploadTextItem({
  file,
  disabled,
  hasRequest,
  progress,
  onRemove,
  onRetry,
}: {
  file: UploadFile;
  disabled: boolean;
  hasRequest: boolean;
  progress: UploadProgressConfig | false;
  onRemove: () => void;
  onRetry: () => void;
}) {
  const uploading = file.status === "uploading";
  const isError = file.status === "error";
  const isDone = file.status === "done";
  const sizeText = formatFileSize(file.size);
  const statusText = isError
    ? (file.error ?? "上传失败")
    : uploading
      ? "上传中"
      : isDone
        ? "已上传"
        : "待上传";
  const showPercent = uploading && progress !== false && progress?.showInfo === true;
  const subtitle = isError
    ? statusText
    : [sizeText, statusText, showPercent ? `${file.percent ?? 0}%` : undefined]
        .filter(Boolean)
        .join(" · ");

  return (
    <li
      data-slot="upload-file"
      data-status={file.status ?? "ready"}
      className={cn(
        "relative flex min-h-10 w-full items-center gap-2 overflow-hidden rounded-lark-lg border border-solid",
        "bg-lark-canvas py-2 pr-2 pl-3",
        isError
          ? "border-lark-danger-content"
          : "border-lark-border-card hover:border-lark-primary-content",
        "transition-colors duration-100",
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center text-lark-icon-2">
        <FileGlyph />
      </span>

      <div className="min-w-0 flex-1 pr-2">
        <span
          className="block truncate text-lark-14 leading-[22px] text-lark-title"
          title={file.name}
        >
          {file.name}
        </span>
        <span
          className={cn(
            "flex items-center gap-1 text-lark-12 leading-5",
            isError ? "text-lark-danger-strong dark:text-lark-danger-content" : "text-lark-caption",
          )}
        >
          {uploading ? <SpinnerIcon size={12} /> : null}
          {isDone ? <CheckCircleIcon className="text-lark-success-content" size={12} /> : null}
          {isError ? <AlertCircleIcon size={12} /> : null}
          <span className="truncate">{subtitle}</span>
        </span>
      </div>

      <span className="flex shrink-0 items-center gap-2">
        {isError && hasRequest && file.originFile ? (
          <button
            type="button"
            aria-label={`重试 ${file.name}`}
            disabled={disabled}
            onClick={onRetry}
            className={iconButtonClass}
          >
            <RetryIcon />
          </button>
        ) : null}
        <button
          type="button"
          aria-label={`移除 ${file.name}`}
          disabled={disabled}
          onClick={onRemove}
          className={iconButtonClass}
        >
          <XIcon />
        </button>
      </span>

      {uploading && progress !== false ? (
        <Progress
          value={file.percent ?? 0}
          size={progress?.size ?? "sm"}
          aria-label={`${file.name} 上传进度`}
          // The client pins a bare 2px line to the item's bottom edge, square-capped.
          className="absolute inset-x-0 bottom-0 **:rounded-none"
        />
      ) : null}
    </li>
  );
}

/**
 * Uploads local files, with optional validation, drag and drop, custom requests
 * and per-file progress. Without `customRequest` or `onUpload` it only collects
 * files (status `ready`); it never uploads on its own.
 *
 * The UD client styles the drop area with a 1px dashed component border, 32px
 * top / 28px bottom padding, an 8px radius and a 552 × 156px default footprint.
 * Text attachments are 40px high, use an 8px radius and show a 2px progress line
 * pinned to their bottom edge.
 */
export function Upload({
  accept,
  multiple = false,
  maxCount,
  maxSize,
  disabled = false,
  drag = false,
  beforeUpload,
  customRequest,
  onUpload,
  fileList,
  defaultFileList,
  onChange,
  onRemove,
  listType = "text",
  showUploadList = true,
  progress = {},
  hint,
  className,
  ref,
  ...props
}: UploadProps) {
  const [innerFiles, setInnerFiles] = useState<UploadFile[]>(defaultFileList ?? []);
  const [dragging, setDragging] = useState(false);
  const controlled = fileList !== undefined;
  const displayFiles = controlled ? fileList : innerFiles;
  const filesRef = useRef<UploadFile[]>(displayFiles);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef(new Map<string, () => void>());
  const onChangeRef = useRef(onChange);
  const hintId = useId();
  const dragLabelId = useId();
  const hasRequest = Boolean(customRequest || onUpload);
  const reachedMax = maxCount !== undefined && displayFiles.length >= maxCount;
  const triggerDisabled = disabled || reachedMax;

  useEffect(() => {
    filesRef.current = displayFiles;
  }, [displayFiles]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const aborts = abortRef.current;
    return () => {
      for (const abort of aborts.values()) {
        abort();
      }
      aborts.clear();
    };
  }, []);

  function commit(nextFiles: UploadFile[], file: UploadFile) {
    filesRef.current = nextFiles;
    if (!controlled) {
      setInnerFiles(nextFiles);
    }
    onChangeRef.current?.({ file, fileList: nextFiles });
  }

  function updateFile(uid: string, patch: Partial<UploadFile>) {
    const current = filesRef.current;
    const target = current.find((file) => file.uid === uid);
    if (!target) {
      return;
    }
    const updated = { ...target, ...patch };
    const next = current.map((file) => (file.uid === uid ? updated : file));
    commit(next, updated);
  }

  function startUpload(item: UploadFile) {
    const request = customRequest ?? onUpload;
    const origin = item.originFile;
    if (!request || !origin) {
      return;
    }

    let settled = false;
    const clearAbort = () => abortRef.current.delete(item.uid);

    const report = (percent: number) => {
      if (settled) {
        return;
      }
      updateFile(item.uid, {
        status: "uploading",
        percent: Math.max(0, Math.min(100, Math.round(percent))),
        error: undefined,
      });
    };
    const succeed = (response?: unknown) => {
      if (settled) {
        return;
      }
      settled = true;
      clearAbort();
      updateFile(item.uid, { status: "done", percent: 100, error: undefined, response });
    };
    const fail = (error: unknown) => {
      if (settled) {
        return;
      }
      settled = true;
      clearAbort();
      const message =
        error instanceof Error ? error.message : typeof error === "string" ? error : "上传失败";
      updateFile(item.uid, { status: "error", error: message });
    };

    const observe = (result: unknown) => {
      if (result && typeof (result as Promise<unknown>).then === "function") {
        (result as Promise<UploadRequestResult>)
          .then((handle) => {
            if (!settled && handle?.abort) {
              abortRef.current.set(item.uid, handle.abort);
            }
          })
          .catch(fail);
        return;
      }
      const handle = result as UploadRequestResult;
      if (handle?.abort) {
        abortRef.current.set(item.uid, handle.abort);
      }
    };

    try {
      if (customRequest) {
        observe(
          customRequest({
            file: origin,
            filename: item.name,
            onProgress: report,
            onSuccess: succeed,
            onError: fail,
          }),
        );
      } else if (onUpload) {
        observe(onUpload(origin, { onProgress: report, onSuccess: succeed, onError: fail }));
      }
    } catch (error) {
      fail(error);
    }
  }

  async function processFiles(incoming: File[]) {
    if (disabled || incoming.length === 0) {
      return;
    }

    const candidates = multiple ? incoming : incoming.slice(0, 1);
    let nextFiles = multiple ? [...filesRef.current] : [];
    const accepted: UploadFile[] = [];

    for (const original of candidates) {
      if (maxCount !== undefined && nextFiles.length >= maxCount) {
        break;
      }
      if (!acceptsFile(original, accept)) {
        continue;
      }
      if (maxSize !== undefined && original.size > maxSize) {
        continue;
      }

      let origin = original;
      if (beforeUpload) {
        let result: BeforeUploadResult;
        try {
          result = await beforeUpload(original, candidates);
        } catch {
          continue;
        }
        if (result === false) {
          continue;
        }
        if (result instanceof File) {
          origin = result;
        } else if (result instanceof Blob) {
          origin = new File([result], original.name, {
            type: result.type || original.type,
            lastModified: Date.now(),
          });
        }
      }

      if (maxSize !== undefined && origin.size > maxSize) {
        continue;
      }

      const item: UploadFile = {
        uid: createUid(),
        name: origin.name || original.name,
        size: origin.size,
        type: origin.type,
        status: hasRequest ? "uploading" : "ready",
        percent: hasRequest ? 0 : undefined,
        originFile: origin,
      };
      nextFiles = multiple ? [...nextFiles, item] : [item];
      accepted.push(item);
      if (!multiple) {
        break;
      }
    }

    if (accepted.length === 0) {
      return;
    }

    commit(nextFiles, accepted[accepted.length - 1]);
    if (hasRequest) {
      for (const item of accepted) {
        startUpload(item);
      }
    }
  }

  async function handleRemove(file: UploadFile) {
    if (disabled) {
      return;
    }
    try {
      const result = await onRemove?.(file);
      if (result === false) {
        return;
      }
    } catch {
      return;
    }
    const abort = abortRef.current.get(file.uid);
    abort?.();
    abortRef.current.delete(file.uid);
    const next = filesRef.current.filter((item) => item.uid !== file.uid);
    commit(next, { ...file, status: "removed" });
  }

  function handleRetry(file: UploadFile) {
    if (disabled || !hasRequest || !file.originFile) {
      return;
    }
    const abort = abortRef.current.get(file.uid);
    abort?.();
    abortRef.current.delete(file.uid);
    const retried = { ...file, status: "uploading" as const, percent: 0, error: undefined };
    updateFile(file.uid, retried);
    startUpload(retried);
  }

  function openPicker() {
    if (triggerDisabled) {
      return;
    }
    inputRef.current?.click();
  }

  const generatedHint: string[] = [];
  if (accept) {
    generatedHint.push(`支持 ${accept}`);
  }
  if (maxSize !== undefined) {
    generatedHint.push(`单个文件不超过 ${formatFileSize(maxSize)}`);
  }
  if (maxCount !== undefined) {
    generatedHint.push(`最多 ${maxCount} 个文件`);
  }
  const hintText = hint === undefined ? generatedHint.join("，") : hint;

  return (
    <div
      {...props}
      ref={ref}
      data-slot="upload"
      data-disabled={disabled ? "" : undefined}
      className={cn("flex flex-col gap-3", className)}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        aria-label="选择文件"
        tabIndex={-1}
        className="sr-only"
        onChange={(event) => {
          const files = Array.from(event.currentTarget.files ?? []);
          event.currentTarget.value = "";
          void processFiles(files);
        }}
      />

      {drag ? (
        <button
          type="button"
          aria-labelledby={dragLabelId}
          aria-describedby={hintText ? hintId : undefined}
          disabled={triggerDisabled}
          data-dragging={dragging ? "" : undefined}
          onClick={openPicker}
          onDragOver={(event) => {
            event.preventDefault();
            if (!triggerDisabled) {
              setDragging(true);
            }
          }}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setDragging(false);
            }
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            if (triggerDisabled) {
              return;
            }
            void processFiles(Array.from(event.dataTransfer.files ?? []));
          }}
          className={cn(
            "box-border flex min-h-[156px] w-[552px] max-w-full cursor-pointer flex-col items-center justify-center",
            "rounded-lark-lg border border-dashed border-lark-border bg-lark-canvas",
            "px-10 pt-8 pb-7 text-center",
            "transition-[border-color,background-color] duration-100 ease-lark-linear",
            "hover:border-lark-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
            "data-[dragging]:border-lark-primary data-[dragging]:bg-[var(--lark-primary-fill-transparent-01)]",
            "disabled:cursor-not-allowed disabled:border-lark-border-card disabled:hover:border-lark-border-card",
          )}
        >
          <UploadIcon />
          <span
            id={dragLabelId}
            className={cn(
              "mt-2 text-lark-14 leading-[22px] text-lark-title",
              triggerDisabled && "text-lark-disabled",
            )}
          >
            点击或拖拽文件到此处上传
          </span>
          {hintText ? (
            <span
              id={hintId}
              className={cn(
                "mt-1 max-w-full text-lark-14 leading-[22px] text-lark-caption",
                triggerDisabled && "text-lark-disabled",
              )}
            >
              {hintText}
            </span>
          ) : null}
        </button>
      ) : (
        <div className="flex flex-col items-start gap-1">
          <Button
            appearance="outlined"
            tone="neutral"
            size="md"
            startIcon={<PlusIcon />}
            aria-describedby={hintText ? hintId : undefined}
            disabled={triggerDisabled}
            onClick={openPicker}
          >
            上传文件
          </Button>
          {hintText ? (
            <span id={hintId} className="text-lark-12 leading-5 text-lark-caption">
              {hintText}
            </span>
          ) : null}
        </div>
      )}

      {showUploadList && displayFiles.length > 0 ? (
        <ul
          aria-label="文件列表"
          className={cn(
            "m-0 list-none p-0",
            listType === "picture" ? "flex flex-wrap gap-3" : "flex w-full flex-col gap-2",
          )}
        >
          {displayFiles.map((file) =>
            listType === "picture" ? (
              <UploadPictureItem
                key={file.uid}
                file={file}
                disabled={disabled}
                progress={progress}
                onRemove={() => void handleRemove(file)}
              />
            ) : (
              <UploadTextItem
                key={file.uid}
                file={file}
                disabled={disabled}
                hasRequest={hasRequest}
                progress={progress}
                onRemove={() => void handleRemove(file)}
                onRetry={() => handleRetry(file)}
              />
            ),
          )}
        </ul>
      ) : null}
    </div>
  );
}
