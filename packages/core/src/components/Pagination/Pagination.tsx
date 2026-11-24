import {
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
  Pagination as UiPagination,
} from "@ui-sdk/react/pagination";
import { cva } from "class-variance-authority";
import type { ComponentProps, ReactNode, Ref } from "react";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "../../icons";
import { cn } from "../../lib/cn";

export type PaginationSize = "default" | "small";

type UiPaginationProps = ComponentProps<typeof UiPagination>;

/** Why and how the page changed, forwarded from the ui-sdk pagination. */
export type PaginationChangeDetails = Parameters<NonNullable<UiPaginationProps["onPageChange"]>>[1];

export type PaginationProps = {
  /** How many items there are. The page count is `Math.ceil(total / pageSize)`. */
  total?: number;
  /** How many items fit on a page. Defaults to 10. */
  pageSize?: number;
  /** The current page, from 1. Pass it with `onPageChange` to control the component. */
  current?: number;
  /** The page it starts on when uncontrolled. Defaults to 1. */
  defaultCurrent?: number;
  onPageChange?: (page: number, details: PaginationChangeDetails) => void;
  /** Renders the total and the visible item range before the pages. */
  showTotal?: (total: number, range: [number, number]) => ReactNode;
  /** How many pages show on each side of the current one. Defaults to 2, as in UD. */
  siblingCount?: number;
  /** True renders previous, `current / pageCount`, and next only. */
  simple?: boolean;
  disabled?: boolean;
  /** UD 普通分页 (28px) or 小型分页 (24px). The simple pager is always 24px. */
  size?: PaginationSize;
  className?: string;
  "aria-label"?: string;
  ref?: Ref<HTMLElement>;
};

const controlStyles = cva(
  [
    "box-border inline-flex select-none items-center justify-center",
    "rounded-lark-md border border-solid text-lark-14",
    "transition-colors duration-100 ease-lark-linear",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
  ],
  {
    variants: {
      size: {
        default: "me-2 h-7 min-w-7",
        small: "me-1 h-6 min-w-6",
      },
      kind: {
        page: "",
        step: "",
        ellipsis: "cursor-default border-transparent bg-transparent text-lark-icon-2",
      },
    },
    compoundVariants: [
      { size: "default", kind: "page", class: "px-1" },
      { size: "small", kind: "page", class: "px-0.5" },
    ],
  },
);

const pageColors: Record<PaginationSize, string> = {
  default: cn(
    "border-lark-border bg-lark-canvas text-lark-title",
    "hover:border-lark-primary-content hover:bg-[var(--lark-primary-fill-transparent-01)] hover:text-lark-primary-content",
    "focus-visible:border-lark-primary-content focus-visible:bg-[var(--lark-primary-fill-transparent-01)] focus-visible:text-lark-primary-content",
    "active:border-[var(--lark-primary-content-pressed)] active:bg-[var(--lark-primary-fill-transparent-03)] active:text-[var(--lark-primary-content-pressed)]",
    "data-[current]:border-lark-primary-content data-[current]:bg-lark-canvas data-[current]:text-lark-primary-content",
  ),
  small: cn(
    "border-transparent bg-transparent text-lark-title",
    "hover:bg-lark-hover",
    "focus-visible:bg-lark-hover",
    "active:bg-lark-pressed",
    "data-[current]:border-transparent data-[current]:bg-transparent data-[current]:text-lark-primary-content",
  ),
};

const disabledPageColors: Record<PaginationSize, string> = {
  default: "cursor-not-allowed border-lark-border bg-lark-canvas text-lark-disabled",
  small: "cursor-not-allowed border-transparent bg-transparent text-lark-disabled",
};

const stepColors: Record<PaginationSize, string> = {
  default: cn(
    "border-lark-border bg-lark-canvas text-lark-icon-2",
    "hover:border-lark-primary-content hover:bg-[var(--lark-primary-fill-transparent-01)] hover:text-lark-primary-content",
    "focus-visible:border-lark-primary-content focus-visible:bg-[var(--lark-primary-fill-transparent-01)] focus-visible:text-lark-primary-content",
    "active:border-[var(--lark-primary-content-pressed)] active:bg-[var(--lark-primary-fill-transparent-03)] active:text-[var(--lark-primary-content-pressed)]",
  ),
  small: cn(
    "border-transparent bg-transparent text-lark-icon-2",
    "hover:bg-lark-hover",
    "focus-visible:bg-lark-hover",
    "active:bg-lark-pressed",
  ),
};

/** A step at the end it points to. */
const boundaryDisabledStepColors: Record<PaginationSize, string> = {
  default: "cursor-not-allowed border-lark-border bg-lark-canvas text-lark-icon-disabled",
  small: "cursor-not-allowed border-transparent bg-transparent text-lark-icon-disabled",
};

/** Every control while the whole pagination is disabled. */
const disabledStepColors: Record<PaginationSize, string> = {
  default: "cursor-not-allowed border-lark-border bg-lark-canvas text-lark-disabled",
  small: "cursor-not-allowed border-transparent bg-transparent text-lark-disabled",
};

const totalStyles: Record<PaginationSize, string> = {
  default: "me-3 inline-flex h-7 shrink-0 items-center whitespace-nowrap leading-[26px]",
  small: "me-3 inline-flex h-6 shrink-0 items-center whitespace-nowrap leading-[24px]",
};

/* The UD simple pager keeps a 24px row whichever size the page links use. */
const simpleTextStyles: Record<PaginationSize, string> = {
  default: "inline-flex h-6 select-none items-center px-2 tabular-nums",
  small: "inline-flex h-6 select-none items-center px-2 tabular-nums",
};

function stepClassName(size: PaginationSize, disabled: boolean, simple = false) {
  return (state: { disabled: boolean }) =>
    cn(
      controlStyles({ size, kind: "step" }),
      simple && "h-6 min-w-6",
      disabled
        ? disabledStepColors[size]
        : state.disabled
          ? boundaryDisabledStepColors[size]
          : stepColors[size],
    );
}

/**
 * Splits content into pages. Follows the universe design 普通分页 and 小型分页
 * sizes, and the `@ui-sdk/react` pagination behaviour and ARIA.
 */
export function Pagination({
  total,
  pageSize,
  current,
  defaultCurrent,
  onPageChange,
  showTotal,
  siblingCount,
  simple = false,
  disabled = false,
  size = "default",
  className,
  ref,
  "aria-label": ariaLabel,
}: PaginationProps) {
  const totalValue = total ?? 0;
  const effectivePageSize = pageSize ?? 10;

  const previous = (
    <PaginationItem>
      <PaginationPrevious aria-label="上一页" className={stepClassName(size, disabled, simple)}>
        <ChevronLeftIcon size={16} />
      </PaginationPrevious>
    </PaginationItem>
  );

  const next = (
    <PaginationItem>
      <PaginationNext aria-label="下一页" className={stepClassName(size, disabled, simple)}>
        <ChevronRightIcon size={16} />
      </PaginationNext>
    </PaginationItem>
  );

  return (
    <UiPagination
      ref={ref}
      aria-label={ariaLabel ?? "分页"}
      page={current}
      defaultPage={defaultCurrent}
      total={total}
      pageSize={pageSize}
      siblings={siblingCount ?? 2}
      disabled={disabled}
      onPageChange={onPageChange}
      className={cn("inline-flex flex-wrap items-center text-lark-14 text-lark-title", className)}
    >
      {(state) => {
        const start = totalValue === 0 ? 0 : (state.page - 1) * effectivePageSize + 1;
        const end = Math.min(state.page * effectivePageSize, totalValue);

        return (
          <>
            {showTotal ? (
              <span className={totalStyles[size]}>{showTotal(totalValue, [start, end])}</span>
            ) : null}
            <PaginationList className="m-0 flex list-none flex-wrap items-center p-0">
              {simple ? (
                <>
                  {previous}
                  <PaginationItem>
                    <span className={cn(simpleTextStyles[size], disabled && "text-lark-disabled")}>
                      {state.page} / {state.pageCount}
                    </span>
                  </PaginationItem>
                  {next}
                </>
              ) : (
                <>
                  {previous}
                  {state.items.map((item) => (
                    <PaginationItem key={item}>
                      {typeof item === "number" ? (
                        <PaginationLink
                          page={item}
                          className={cn(
                            controlStyles({ size, kind: "page" }),
                            disabled ? disabledPageColors[size] : pageColors[size],
                          )}
                        />
                      ) : (
                        <PaginationEllipsis
                          className={cn(
                            controlStyles({ size, kind: "ellipsis" }),
                            disabled ? "text-lark-disabled" : "text-lark-icon-2",
                          )}
                        >
                          <MoreHorizontalIcon size={16} />
                        </PaginationEllipsis>
                      )}
                    </PaginationItem>
                  ))}
                  {next}
                </>
              )}
            </PaginationList>
          </>
        );
      }}
    </UiPagination>
  );
}
