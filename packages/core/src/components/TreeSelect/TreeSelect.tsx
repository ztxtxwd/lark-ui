import {
  Popover as UiPopover,
  PopoverContent as UiPopoverContent,
  PopoverTitle as UiPopoverTitle,
  PopoverTrigger as UiPopoverTrigger,
} from "@ui-sdk/react/popover";
import { matchRanges, matchSegments } from "@ui-sdk/react/text-match";
import {
  TreeGroup,
  TreeItem,
  TreeItemCheckbox,
  type TreeItemData,
  TreeItemIndicator,
  TreeItemLabel,
  Tree as UiTree,
} from "@ui-sdk/react/tree";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { CheckIcon, ChevronDownIcon, ChevronRightIcon, MinusIcon, XIcon } from "../../icons";
import { cn } from "../../lib/cn";

export type TreeSelectSize = "sm" | "md" | "lg";

export type TreeSelectNode = {
  value: string;
  title: string;
  disabled?: boolean;
  children?: TreeSelectNode[];
  /** Whether this node shows a checkbox in `treeCheckable` mode. Defaults to true. */
  checkable?: boolean;
};

export type TreeSelectValue = string | string[] | null;

export type TreeSelectProps = {
  treeData: TreeSelectNode[];
  /** A value for single mode, a list in multiple or checkable mode. */
  value?: TreeSelectValue;
  defaultValue?: TreeSelectValue;
  onChange?: (value: TreeSelectValue, selectedNodes: TreeSelectNode[]) => void;
  /** Selects several nodes without checkboxes. */
  multiple?: boolean;
  /** Adds cascading checkboxes, and reports checked values in multiple mode. */
  treeCheckable?: boolean;
  /** How many chips the trigger shows before an overflow count. Defaults to 2. */
  maxDisplayLabels?: number;
  treeDefaultExpandAll?: boolean;
  showSearch?: boolean;
  allowClear?: boolean;
  clearLabel?: string;
  removeLabel?: string;
  placeholder?: string;
  size?: TreeSelectSize;
  disabled?: boolean;
  readOnly?: boolean;
  label?: ReactNode;
  hideLabel?: boolean;
  searchPlaceholder?: string;
  searchLabel?: string;
  emptyText?: ReactNode;
  className?: string;
  contentClassName?: string;
  "aria-label"?: string;
};

const triggerSize: Record<TreeSelectSize, string> = {
  sm: "min-h-7 gap-1 py-0.5 pr-2 pl-2 text-lark-12",
  md: "min-h-8 gap-1 py-1 pr-2 pl-[11px] text-lark-14",
  lg: "min-h-10 gap-1 py-1.5 pr-2 pl-[11px] text-lark-16",
};

// The item wraps its label row and the group; only the label is a flex row.
// UD's selector tag is 24px in md/lg triggers and 20px in sm; the chip is
// the Tag fill wrapped with `margin: 2px 4px 2px 0`.
const chipSize: Record<TreeSelectSize, string> = {
  sm: "h-5 leading-5",
  md: "h-6 leading-6",
  lg: "h-6 leading-6",
};

const treeItemClass = cn(
  "group/treeitem relative z-0 block rounded-lark-sm",
  "mx-[3px] my-px",
  "text-lark-14 leading-[22px] text-lark-title",
  "transition-colors duration-100 ease-lark-linear",
  "focus-visible:outline-none",
);

// The row the user sees and presses: UD's 4px 8px padding, 30px minimum.
const treeRowClass = cn(
  "flex min-h-[30px] cursor-pointer items-center rounded-lark-sm",
  "py-1 pe-2 ps-[calc(8px_+_(var(--tree-level)_-_1)_*_16px)]",
  "transition-colors duration-100 ease-lark-linear",
  "hover:bg-[var(--lark-fill-hover)]",
  "data-[selected]:bg-transparent data-[selected]:text-lark-primary",
  "data-[selected]:hover:bg-[var(--lark-fill-hover)]",
  "data-[disabled]:cursor-not-allowed data-[disabled]:bg-transparent data-[disabled]:text-lark-disabled",
  "data-[disabled]:hover:bg-transparent",
  "group-focus-visible/treeitem:bg-[var(--lark-fill-hover)]",
);

const indicatorClass = cn(
  "mr-[3px] flex size-4 shrink-0 items-center justify-center text-lark-icon-2",
  "transition-transform duration-100 ease-lark-linear",
  "data-[expanded]:rotate-90",
);

const checkboxClass = cn(
  "group/check relative mr-1.5 flex size-4 shrink-0 cursor-pointer items-center justify-center",
  "rounded-[4px] border border-solid border-lark-neutral-500 bg-lark-canvas text-white",
  "transition-[background-color,border-color] duration-100 ease-lark-linear",
  "hover:border-lark-primary",
  "data-[checked]:border-transparent data-[checked]:bg-lark-primary",
  "data-[indeterminate]:border-transparent data-[indeterminate]:bg-lark-primary",
  "data-[disabled]:cursor-not-allowed data-[disabled]:border-lark-neutral-400",
  "data-[disabled]:bg-lark-neutral-200 data-[checked]:data-[disabled]:border-lark-fill-disabled",
  "data-[checked]:data-[disabled]:bg-lark-fill-disabled",
  "data-[indeterminate]:data-[disabled]:border-lark-fill-disabled",
  "data-[indeterminate]:data-[disabled]:bg-lark-fill-disabled",
);

type TreeIndex = {
  byValue: Map<string, TreeSelectNode>;
  ancestors: Map<string, string[]>;
  branches: string[];
};

function indexTree(nodes: TreeSelectNode[]): TreeIndex {
  const byValue = new Map<string, TreeSelectNode>();
  const ancestors = new Map<string, string[]>();
  const branches: string[] = [];

  const walk = (list: TreeSelectNode[], path: string[]) => {
    for (const node of list) {
      byValue.set(node.value, node);
      ancestors.set(node.value, path);
      if (node.children?.length) {
        branches.push(node.value);
        walk(node.children, [...path, node.value]);
      }
    }
  };

  walk(nodes, []);
  return { byValue, ancestors, branches };
}

function toTreeItems(nodes: TreeSelectNode[]): TreeItemData[] {
  return nodes.map((node) => ({
    value: node.value,
    label: node.title,
    disabled: node.disabled,
    children: node.children?.length ? toTreeItems(node.children) : undefined,
  }));
}

function countMatches(nodes: TreeSelectNode[], term: string): number {
  let total = 0;
  for (const node of nodes) {
    if (matchRanges(node.title, term, "contains").length > 0) {
      total += 1;
    }
    if (node.children?.length) {
      total += countMatches(node.children, term);
    }
  }
  return total;
}

function filterTree(
  nodes: TreeSelectNode[],
  query: string,
): { items: TreeSelectNode[]; expanded: string[] } {
  const expanded = new Set<string>();

  const walk = (
    list: TreeSelectNode[],
    path: string[],
  ): { items: TreeSelectNode[]; matched: boolean } => {
    const items: TreeSelectNode[] = [];
    let matched = false;
    for (const node of list) {
      const children = node.children ?? [];
      const childResult = children.length
        ? walk(children, [...path, node.value])
        : { items: [] as TreeSelectNode[], matched: false };
      const self = matchRanges(node.title, query, "contains").length > 0;
      if (self) {
        for (const ancestor of path) {
          expanded.add(ancestor);
        }
        items.push(node);
        matched = true;
      } else if (childResult.matched) {
        items.push({ ...node, children: childResult.items });
        matched = true;
      }
    }
    return { items, matched };
  };

  return { items: walk(nodes, []).items, expanded: [...expanded] };
}

function normalizeValue(value: TreeSelectValue | undefined, multiple: boolean): TreeSelectValue {
  if (multiple) {
    if (value == null) {
      return [];
    }
    return Array.isArray(value) ? value : [value];
  }
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }
  return value ?? null;
}

/** The matched and unmatched pieces of a title, for the UD search highlight. */
function HighlightedTitle({ title, query }: { title: string; query: string }) {
  const segments = useMemo(
    () => matchSegments(title, matchRanges(title, query, "contains")),
    [query, title],
  );
  return (
    <>
      {segments.map((segment) =>
        segment.match ? (
          // UD highlights what the search matched in the primary colour.
          <mark key={segment.text} className="bg-transparent text-lark-primary text-inherit">
            {segment.text}
          </mark>
        ) : (
          // A bare text node: wrapping segments in spans would make the
          // accessible-name algorithm trim the whitespace at the mark's
          // edges, silently renaming the row.
          segment.text
        ),
      )}
    </>
  );
}

function TreeRows({
  nodes,
  checkable,
  query,
}: {
  nodes: TreeSelectNode[];
  checkable: boolean;
  query: string;
}) {
  return (
    <>
      {nodes.map((node) => {
        const branch = Boolean(node.children?.length);
        return (
          <TreeItem
            key={node.value}
            value={node.value}
            disabled={node.disabled}
            className={treeItemClass}
          >
            <TreeItemLabel className={treeRowClass}>
              {branch ? (
                <TreeItemIndicator className={indicatorClass}>
                  <ChevronRightIcon size={16} />
                </TreeItemIndicator>
              ) : (
                <span aria-hidden="true" className="mr-[3px] size-4 shrink-0" />
              )}
              {checkable ? (
                node.checkable === false ? (
                  <span aria-hidden="true" className="mr-1.5 size-4 shrink-0" />
                ) : (
                  <TreeItemCheckbox className={checkboxClass}>
                    <CheckIcon className="hidden size-3 group-data-[checked]/check:block" />
                    <MinusIcon className="hidden size-3 group-data-[indeterminate]/check:block" />
                  </TreeItemCheckbox>
                )
              ) : null}
              <span className="min-w-0 flex-1 truncate">
                {query ? <HighlightedTitle title={node.title} query={query} /> : node.title}
              </span>
              {/* UD shows a check mark at the row's end on the chosen row. */}
              {!checkable ? (
                <CheckIcon
                  aria-hidden="true"
                  className="ml-2 hidden size-3 shrink-0 text-lark-primary group-data-[selected]/treeitem:block"
                />
              ) : null}
            </TreeItemLabel>
            {branch ? (
              <TreeGroup>
                <TreeRows nodes={node.children ?? []} checkable={checkable} query={query} />
              </TreeGroup>
            ) : null}
          </TreeItem>
        );
      })}
    </>
  );
}

/**
 * UD tree select. The trigger follows Select: 28 / 32 / 40px high, 6px radius,
 * with the search inside the trigger. Multiple and checkable modes show chips
 * (Tag fills, each with a remove button, plus an overflow count); single shows
 * the value dimmed to 50% while the panel is open. The panel caps at 256px
 * high and 420px wide; rows are 30px with a 16px indent per level.
 */
export function TreeSelect({
  treeData,
  value,
  defaultValue,
  onChange,
  multiple = false,
  treeCheckable = false,
  treeDefaultExpandAll = false,
  showSearch = false,
  allowClear = true,
  clearLabel = "清除",
  removeLabel = "移除",
  maxDisplayLabels = 2,
  placeholder = "请选择",
  size = "md",
  disabled = false,
  readOnly = false,
  label,
  hideLabel = false,
  searchPlaceholder = "搜索",
  searchLabel = "搜索选项",
  emptyText = "暂无匹配选项",
  className,
  contentClassName,
  "aria-label": ariaLabel,
}: TreeSelectProps) {
  const baseId = useId();
  const labelId = useId();
  const treeId = `${baseId}-tree`;

  const multipleMode = multiple || treeCheckable;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [internalValue, setInternalValue] = useState<TreeSelectValue>(() =>
    normalizeValue(defaultValue, multipleMode),
  );
  const [expanded, setExpanded] = useState<string[]>([]);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const index = useMemo(() => indexTree(treeData), [treeData]);

  useEffect(() => {
    if (!treeDefaultExpandAll) {
      return;
    }
    setExpanded((previous) => (previous.length ? previous : index.branches));
  }, [index.branches, treeDefaultExpandAll]);

  const rawValue = value !== undefined ? value : internalValue;
  const selectedValues = useMemo(() => {
    if (!multipleMode) {
      return [];
    }
    if (rawValue == null) {
      return [];
    }
    return Array.isArray(rawValue) ? rawValue : [rawValue];
  }, [multipleMode, rawValue]);
  const selectedValue = useMemo(() => {
    if (multipleMode) {
      return null;
    }
    if (Array.isArray(rawValue)) {
      return rawValue[0] ?? null;
    }
    return rawValue ?? null;
  }, [multipleMode, rawValue]);
  const selectedLabels = useMemo(
    () =>
      (multipleMode ? selectedValues : selectedValue ? [selectedValue] : []).map(
        (entry) => index.byValue.get(entry)?.title ?? entry,
      ),
    [index, multipleMode, selectedValue, selectedValues],
  );

  const searching = showSearch && query.trim().length > 0;
  const term = query.trim();
  const filtered = useMemo(
    () => (searching ? filterTree(treeData, term) : { items: treeData, expanded: [] as string[] }),
    [searching, term, treeData],
  );
  const displayNodes = filtered.items;
  const treeItems = useMemo(() => toTreeItems(displayNodes), [displayNodes]);
  const matchCount = useMemo(
    () => (searching ? countMatches(treeData, term) : 0),
    [searching, term, treeData],
  );

  useEffect(() => {
    if (!searching) {
      return;
    }
    setExpanded((previous) => {
      const next = new Set([...previous, ...filtered.expanded]);
      return next.size === previous.length ? previous : [...next];
    });
  }, [filtered.expanded, searching]);

  // Opening the panel again locates and expands the checked rows' levels.
  useEffect(() => {
    if (!open) {
      return;
    }
    const targets = multipleMode ? selectedValues : selectedValue ? [selectedValue] : [];
    const ancestors = new Set<string>();
    for (const target of targets) {
      for (const ancestor of index.ancestors.get(target) ?? []) {
        ancestors.add(ancestor);
      }
    }
    if (!ancestors.size) {
      return;
    }
    setExpanded((previous) => {
      const next = new Set([...previous, ...ancestors]);
      return next.size === previous.length ? previous : [...next];
    });
  }, [index.ancestors, multipleMode, open, selectedValue, selectedValues]);

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) {
      setQuery("");
    }
  }, []);

  const commitValue = useCallback(
    (next: TreeSelectValue) => {
      if (disabled || readOnly) {
        return;
      }
      const normalized = normalizeValue(next, multipleMode);
      if (value === undefined) {
        setInternalValue(normalized);
      }
      const values = multipleMode
        ? Array.isArray(normalized)
          ? normalized
          : normalized == null
            ? []
            : [normalized]
        : normalized == null
          ? []
          : [normalized as string];
      const nodes = values
        .map((entry) => index.byValue.get(entry))
        .filter((node): node is TreeSelectNode => node !== undefined);
      onChange?.(normalized, nodes);
    },
    [disabled, index, multipleMode, onChange, readOnly, value],
  );

  const removeValue = useCallback(
    (entry: string) => {
      if (multipleMode) {
        commitValue(selectedValues.filter((item) => item !== entry));
      } else {
        commitValue(null);
      }
    },
    [commitValue, multipleMode, selectedValues],
  );

  const handleClear = () => {
    commitValue(multipleMode ? [] : null);
    if (showSearch) {
      searchRef.current?.focus();
    } else {
      triggerRef.current?.focus();
    }
  };

  const handleChipRemove = (entry: string) => {
    removeValue(entry);
    searchRef.current?.focus();
  };

  const handleChipBackspace = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    // Backspace with an empty search removes the last selection, as UD does.
    if (event.key !== "Backspace" || query || !selectedValues.length) {
      return;
    }
    // Only when the trigger itself or the search field has focus; never while
    // the panel's tree is being navigated.
    const fromSearch = event.target === searchRef.current;
    const onTrigger = document.activeElement === event.currentTarget;
    if (!fromSearch && !onTrigger) {
      return;
    }
    event.preventDefault();
    removeValue(selectedValues.at(-1) as string);
  };

  const focusTree = () => {
    const root = document.getElementById(treeId);
    if (!root) {
      return;
    }
    const item =
      root.querySelector<HTMLElement>('[role="treeitem"][tabindex="0"]') ??
      root.querySelector<HTMLElement>('[role="treeitem"]');
    item?.focus();
  };

  // Opens onto the first row, as the tree's own tab stop does.
  const focusFirstTreeItem = () => {
    const root = document.getElementById(treeId);
    const item = root?.querySelector<HTMLElement>('[role="treeitem"]');
    item?.focus();
    return item ?? null;
  };

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (open || disabled || (event.key !== "ArrowDown" && event.key !== "ArrowUp")) {
      return;
    }
    // A combobox opens from the trigger with the arrow keys, as Select does.
    event.preventDefault();
    handleOpenChange(true);
  };

  const dialogLabel = ariaLabel ?? (typeof label === "string" && label ? label : "树选择");
  const treeLabel = ariaLabel ?? (typeof label === "string" && label ? label : "树选项");
  const hasValue = selectedLabels.length > 0;
  const showClear = allowClear && (hasValue || query.length > 0) && !disabled && !readOnly;
  const selectionMode = treeCheckable ? "none" : multiple ? "multiple" : "single";
  const interactive = !disabled && !readOnly;

  const searchInput = showSearch ? (
    // UD puts the search inside the trigger: overlaying the value in single
    // mode, flowing after the chips in multiple mode. Only one placeholder
    // renders at a time, and it is never this input's when a value or chip
    // already shows.
    <input
      ref={searchRef}
      type="search"
      aria-label={searchLabel}
      aria-controls={open && displayNodes.length ? treeId : undefined}
      placeholder={
        multipleMode ? (!hasValue ? placeholder : open ? searchPlaceholder : undefined) : undefined
      }
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      // While open, clicks and typing in the search must not reach the
      // trigger, whose press would toggle the panel closed again. While
      // closed, the click has to bubble so the trigger can open the panel.
      onClick={(event) => {
        if (open) {
          event.stopPropagation();
        }
      }}
      onKeyDown={(event) => {
        if (open) {
          event.stopPropagation();
        }
        if (event.key === "ArrowDown") {
          event.preventDefault();
          if (!open) {
            handleOpenChange(true);
          } else {
            focusTree();
          }
        }
      }}
      className={cn(
        "absolute inset-0 m-0 w-full border-0 bg-transparent p-0 text-left text-lark-title outline-none",
        "placeholder:text-lark-placeholder [&::-webkit-search-cancel-button]:hidden",
        "[font-size:inherit] [line-height:inherit]",
        multipleMode && "relative inset-auto h-6 min-w-[60px] flex-1",
      )}
    />
  ) : null;

  return (
    <div className={cn("flex min-w-0 flex-col gap-1", className)}>
      {label ? (
        <span
          id={labelId}
          className={hideLabel ? "sr-only" : "text-lark-14 leading-[22px] text-lark-title"}
        >
          {label}
        </span>
      ) : null}

      <UiPopover open={open} onOpenChange={handleOpenChange}>
        <UiPopoverTrigger
          disabled={disabled}
          render={
            // The trigger renders as a div so the chips can hold real remove
            // buttons; Enter and Space still toggle the panel.
            <div
              ref={triggerRef}
              role="combobox"
              aria-expanded={open}
              aria-haspopup="dialog"
              aria-readonly={readOnly || undefined}
              aria-disabled={disabled || undefined}
              aria-label={ariaLabel ?? (label ? undefined : "树选择")}
              aria-labelledby={label ? labelId : undefined}
              aria-controls={open ? treeId : undefined}
              tabIndex={disabled ? -1 : 0}
              data-open={open ? "" : undefined}
              data-disabled={disabled ? "" : undefined}
              data-readonly={readOnly ? "" : undefined}
              onKeyDown={(event) => {
                handleTriggerKeyDown(event);
                handleChipBackspace(event);
              }}
              className={cn(
                // Stretch, so the content row and the right-hand controls each
                // centre themselves in the trigger's full content height.
                "group/tree-select flex w-full min-w-0 flex-1 items-stretch rounded-lark-md",
                "border border-solid border-lark-border bg-lark-canvas text-left text-lark-title",
                "transition-[border-color,background-color] duration-100 ease-lark-linear",
                "hover:border-lark-primary focus-visible:border-lark-primary focus-visible:outline-none",
                "data-[open]:border-lark-primary",
                "data-[disabled]:cursor-not-allowed data-[disabled]:border-lark-border",
                "data-[disabled]:bg-lark-disabled-bg data-[disabled]:text-lark-placeholder",
                "data-[disabled]:hover:border-lark-border",
                multipleMode ? "max-h-[188px] overflow-y-auto" : "",
                triggerSize[size],
                // UD's selector with values drops its padding: 0, with a 3px
                // left inset for the first chip, which keeps its own 2px/4px
                // margins (`.ud__select__selector-multiple.-not-empty`).
                multipleMode ? "py-0" : "",
                multipleMode && hasValue ? "pl-[3px]" : "",
              )}
            >
              {/*
                UD's selector: the content flows and wraps on its own, while
                the arrow and the clear button stay pinned to the right of the
                first row (the arrow is a sticky flex item, not part of the
                chip flow).
              */}
              <div className="flex min-w-0 flex-1 flex-wrap items-center [font-size:inherit] [line-height:inherit]">
                {multipleMode ? (
                  <>
                    {selectedValues.slice(0, Math.max(maxDisplayLabels, 0)).map((entry) => {
                      const node = index.byValue.get(entry);
                      const text = node?.title ?? entry;
                      return (
                        <span
                          key={entry}
                          data-slot="tree-select-chip"
                          className={cn(
                            "my-0.5 me-1 inline-flex max-w-full shrink-0 items-center gap-1",
                            "rounded-lark-sm bg-[var(--lark-tag-fill-neutral)] px-1.5",
                            "text-lark-12 text-lark-tag-neutral select-none",
                            chipSize[size],
                          )}
                        >
                          <span className="min-w-0 truncate">{text}</span>
                          {interactive ? (
                            <button
                              type="button"
                              aria-label={`${removeLabel} ${text}`}
                              tabIndex={-1}
                              onClick={(event) => {
                                event.stopPropagation();
                                handleChipRemove(entry);
                              }}
                              className="inline-flex size-3 shrink-0 cursor-pointer items-center justify-center rounded-lark-xs border-0 bg-transparent p-0 text-current opacity-60 transition-opacity duration-100 ease-lark-linear hover:opacity-100 focus-visible:opacity-100"
                            >
                              <XIcon size={12} />
                            </button>
                          ) : null}
                        </span>
                      );
                    })}
                    {selectedValues.length > maxDisplayLabels ? (
                      <span
                        className={cn(
                          "my-0.5 me-1 inline-flex shrink-0 items-center rounded-lark-sm",
                          "bg-[var(--lark-tag-fill-neutral)] px-1.5",
                          "text-lark-12 text-lark-tag-neutral select-none",
                          chipSize[size],
                        )}
                      >
                        +{selectedValues.length - maxDisplayLabels}
                      </span>
                    ) : null}
                    {showSearch ? (
                      <span className="relative flex min-w-[60px] flex-1 items-center">
                        {searchInput}
                      </span>
                    ) : !hasValue && !query ? (
                      // Without a search input the placeholder is plain text.
                      <span className="min-w-0 flex-1 truncate text-lark-caption">
                        {placeholder}
                      </span>
                    ) : null}
                  </>
                ) : (
                  // min-h-[1lh] keeps the line box while the value hides to
                  // make room for the overlay search input's text.
                  <span className="relative flex min-h-[1lh] min-w-0 flex-1 items-center">
                    {query ? null : hasValue ? (
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate",
                          // UD dims the standing value to 50% while the panel
                          // is open; closing without a change restores it.
                          open && "opacity-50",
                        )}
                      >
                        {selectedLabels[0]}
                      </span>
                    ) : (
                      <span className="min-w-0 flex-1 truncate text-lark-caption">
                        {placeholder}
                      </span>
                    )}
                    {searchInput}
                  </span>
                )}
              </div>

              {showClear ? (
                <button
                  type="button"
                  aria-label={clearLabel}
                  tabIndex={-1}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleClear();
                  }}
                  className={cn(
                    // A square box centered on the row: the trigger stretches its
                    // controls, and a stretched pill would round into an ellipse.
                    "flex size-4 shrink-0 cursor-pointer items-center justify-center self-center",
                    "rounded-full text-lark-icon-3 opacity-0 transition-opacity duration-100",
                    "group-hover/tree-select:opacity-100 group-focus-within/tree-select:opacity-100 focus-visible:opacity-100",
                    "hover:bg-[var(--lark-fill-hover)] hover:text-lark-primary-content",
                  )}
                >
                  <XIcon size={14} />
                </button>
              ) : null}

              <span className={cn("flex shrink-0 items-center justify-center text-lark-icon-2")}>
                <ChevronDownIcon
                  className={cn(
                    "pointer-events-none size-4",
                    "transition-transform duration-200 ease-lark",
                    "group-data-[open]/tree-select:rotate-180",
                  )}
                />
              </span>
            </div>
          }
        />

        <UiPopoverContent
          align="start"
          sideOffset={4}
          initialFocus={showSearch ? () => searchRef.current : focusFirstTreeItem}
          className={cn(
            "z-50 flex max-h-[256px] w-[var(--anchor-width)] min-w-[240px] max-w-[420px] flex-col",
            "overflow-hidden rounded-lark-lg border border-solid border-lark-border-card",
            "bg-lark-float p-1 shadow-lark-4 outline-none",
            "origin-(--transform-origin) transition-[opacity,scale] duration-100 ease-lark",
            "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
            contentClassName,
          )}
        >
          <UiPopoverTitle className="sr-only">{dialogLabel}</UiPopoverTitle>

          {searching ? (
            <span className="sr-only" role="status">
              {matchCount} 个匹配项
            </span>
          ) : null}

          <div className="min-h-0 flex-1 overflow-y-auto">
            {displayNodes.length ? (
              <UiTree
                id={treeId}
                aria-label={treeLabel}
                items={treeItems}
                mode={selectionMode}
                value={treeCheckable ? undefined : multiple ? selectedValues : selectedValue}
                expanded={expanded}
                onExpandedChange={setExpanded}
                checkable={treeCheckable}
                checked={treeCheckable ? selectedValues : undefined}
                onCheckedChange={(next) => commitValue(next)}
                checkStrategy="trunk"
                onValueChange={(next, details) => {
                  if (treeCheckable) {
                    return;
                  }
                  if (multiple) {
                    commitValue(Array.isArray(next) ? next : []);
                    return;
                  }
                  commitValue(Array.isArray(next) ? (next[0] ?? null) : next);
                  if (!details.canceled) {
                    // A single choice is final: the panel closes, as Select does.
                    handleOpenChange(false);
                  }
                }}
                disabled={disabled}
                className="outline-none"
              >
                <TreeRows nodes={displayNodes} checkable={treeCheckable} query={term} />
              </UiTree>
            ) : (
              <div className="px-2 py-3 text-lark-14 leading-[22px] text-lark-caption">
                {emptyText}
              </div>
            )}
          </div>
        </UiPopoverContent>
      </UiPopover>
    </div>
  );
}
