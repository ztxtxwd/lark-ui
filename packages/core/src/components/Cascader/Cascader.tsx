import {
  Popover as UiPopover,
  PopoverContent as UiPopoverContent,
  PopoverTitle as UiPopoverTitle,
  PopoverTrigger as UiPopoverTrigger,
} from "@ui-sdk/react/popover";
import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { CheckIcon, ChevronDownIcon, ChevronRightIcon, SearchIcon, XIcon } from "../../icons";
import { cn } from "../../lib/cn";

export type CascaderSize = "sm" | "md" | "lg";

export type CascaderOption = {
  value: string;
  label: string;
  disabled?: boolean;
  children?: CascaderOption[];
  /** Marks a node with no children as selectable, for lazily loaded data. */
  isLeaf?: boolean;
};

export type CascaderValue = string[] | null;

export type CascaderProps = {
  options: CascaderOption[];
  /** A full path, either as an array or joined with `/`. */
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: CascaderValue, selectedOptions: CascaderOption[]) => void;
  /** Whether a parent expands on click or on hover. Defaults to `"click"`. */
  expandTrigger?: "click" | "hover";
  /** Selects a parent as soon as it is pressed, and keeps the panel open. */
  changeOnSelect?: boolean;
  /** Shows a search field that filters full label paths. */
  showSearch?: boolean;
  allowClear?: boolean;
  clearLabel?: string;
  placeholder?: string;
  size?: CascaderSize;
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

const triggerSize: Record<CascaderSize, string> = {
  sm: "min-h-7 gap-1.5 py-0.5 pr-2 pl-2 text-lark-12",
  md: "min-h-8 gap-2 py-1 pr-2 pl-[11px] text-lark-14",
  lg: "min-h-10 gap-2 py-2 pr-2 pl-[11px] text-lark-16",
};

type SearchEntry = {
  option: CascaderOption;
  path: string[];
  labels: string[];
};

function toPath(value: string | string[] | null | undefined): string[] {
  if (value == null) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.filter((segment) => segment !== "");
  }
  return value ? value.split("/").filter(Boolean) : [];
}

function isLeafOption(option: CascaderOption): boolean {
  return option.isLeaf === true || !option.children?.length;
}

function resolveOptions(options: CascaderOption[], path: string[]): CascaderOption[] {
  const resolved: CascaderOption[] = [];
  let level = options;
  for (const segment of path) {
    const match = level.find((option) => option.value === segment);
    if (!match) {
      break;
    }
    resolved.push(match);
    level = match.children ?? [];
  }
  return resolved;
}

function collectEntries(
  options: CascaderOption[],
  path: string[] = [],
  labels: string[] = [],
  entries: SearchEntry[] = [],
): SearchEntry[] {
  for (const option of options) {
    const nextPath = [...path, option.value];
    const nextLabels = [...labels, option.label];
    entries.push({ option, path: nextPath, labels: nextLabels });
    if (option.children?.length) {
      collectEntries(option.children, nextPath, nextLabels, entries);
    }
  }
  return entries;
}

function firstEnabled(options: CascaderOption[]): CascaderOption | undefined {
  return options.find((option) => !option.disabled);
}

function lastEnabled(options: CascaderOption[]): CascaderOption | undefined {
  for (let index = options.length - 1; index >= 0; index -= 1) {
    if (!options[index].disabled) {
      return options[index];
    }
  }
  return undefined;
}

/**
 * UD cascader. The panel keeps one column per level, each 160px wide, with the
 * active path highlighted and the outermost column scrolling on its own.
 */
export function Cascader({
  options,
  value,
  defaultValue,
  onChange,
  expandTrigger = "click",
  changeOnSelect = false,
  showSearch = false,
  allowClear = true,
  clearLabel = "清除",
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
}: CascaderProps) {
  const baseId = useId();
  const labelId = useId();
  const resultsId = `${baseId}-search-results`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [internalValue, setInternalValue] = useState<string[]>(() => toPath(defaultValue));
  const [activePath, setActivePath] = useState<string[]>(() =>
    toPath(value !== undefined ? value : defaultValue),
  );
  const [focusLevel, setFocusLevel] = useState(0);
  const [pendingFocus, setPendingFocus] = useState<number | null>(null);
  const [searchIndex, setSearchIndex] = useState(0);

  const columnRefs = useRef<Array<HTMLDivElement | null>>([]);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const selectedPath = useMemo(
    () => (value === undefined ? internalValue : toPath(value)),
    [value, internalValue],
  );
  const selectedOptions = useMemo(
    () => resolveOptions(options, selectedPath),
    [options, selectedPath],
  );
  const displayText = useMemo(() => {
    if (!selectedPath.length) {
      return "";
    }
    if (selectedOptions.length === selectedPath.length) {
      return selectedOptions.map((option) => option.label).join("/");
    }
    return selectedPath.join("/");
  }, [selectedOptions, selectedPath]);
  const hasValue = selectedPath.length > 0;
  const interactive = !disabled && !readOnly;

  const columns = useMemo(() => {
    const result: CascaderOption[][] = [options];
    let level = options;
    for (let index = 0; index < activePath.length; index += 1) {
      const node = level.find((option) => option.value === activePath[index]);
      if (!node || node.isLeaf) {
        break;
      }
      const children = node.children ?? [];
      if (!children.length) {
        break;
      }
      result.push(children);
      level = children;
    }
    return result;
  }, [options, activePath]);

  const searchEntries = useMemo(() => collectEntries(options), [options]);
  const searching = showSearch && query.trim().length > 0;
  const searchResults = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return [];
    }
    return searchEntries.filter(
      (entry) =>
        (changeOnSelect || isLeafOption(entry.option)) &&
        entry.labels.join("/").toLowerCase().includes(term),
    );
  }, [changeOnSelect, query, searchEntries]);

  useEffect(() => {
    if (pendingFocus == null) {
      return;
    }
    columnRefs.current[pendingFocus]?.focus({ preventScroll: true });
    setPendingFocus(null);
  }, [pendingFocus]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (next) {
        // With nothing selected, activate the first option: the panel takes
        // focus, and a focusable listbox needs an active option to show it.
        const first = firstEnabled(options);
        setActivePath(selectedPath.length || !first ? selectedPath : [first.value]);
        setFocusLevel(0);
        setSearchIndex(0);
        setQuery("");
      } else {
        setQuery("");
      }
    },
    [options, selectedPath],
  );

  const commit = useCallback(
    (path: string[]) => {
      if (!interactive) {
        return;
      }
      if (value === undefined) {
        setInternalValue(path);
      }
      onChange?.(path.length ? path : null, resolveOptions(options, path));
    },
    [interactive, onChange, options, value],
  );

  const setActiveAt = useCallback(
    (level: number, segment: string) => {
      setActivePath([...activePath.slice(0, level), segment]);
    },
    [activePath],
  );

  const expandOption = useCallback(
    (level: number, option: CascaderOption, moveFocus: boolean) => {
      if (option.disabled || option.isLeaf) {
        return;
      }
      const children = option.children ?? [];
      const current = activePath[level + 1];
      const child =
        children.find((candidate) => candidate.value === current && !candidate.disabled) ??
        firstEnabled(children);
      if (!child) {
        return;
      }
      setActivePath([...activePath.slice(0, level), option.value, child.value]);
      if (moveFocus) {
        setFocusLevel(level + 1);
        setPendingFocus(level + 1);
      }
    },
    [activePath],
  );

  const moveActive = useCallback(
    (level: number, direction: 1 | -1) => {
      const column = columns[level] ?? [];
      if (!column.length) {
        return;
      }
      const current = activePath[level];
      const index =
        current === undefined ? -1 : column.findIndex((option) => option.value === current);
      for (let step = 1; step <= column.length; step += 1) {
        const candidate =
          column[(((index + direction * step) % column.length) + column.length) % column.length];
        if (!candidate.disabled) {
          setActiveAt(level, candidate.value);
          return;
        }
      }
    },
    [activePath, columns, setActiveAt],
  );

  const selectOption = useCallback(
    (level: number, option: CascaderOption) => {
      if (option.disabled) {
        return;
      }
      const path = [...activePath.slice(0, level), option.value];
      setActivePath(path);
      if (!interactive) {
        return;
      }
      if (changeOnSelect || isLeafOption(option)) {
        commit(path);
        if (!changeOnSelect) {
          setOpen(false);
        }
      }
    },
    [activePath, changeOnSelect, commit, interactive],
  );

  const handleColumnKeyDown = (level: number) => (event: KeyboardEvent<HTMLDivElement>) => {
    const column = columns[level] ?? [];
    if (!column.length) {
      return;
    }
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveActive(level, 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveActive(level, -1);
        break;
      case "Home": {
        event.preventDefault();
        const first = firstEnabled(column);
        if (first) {
          setActiveAt(level, first.value);
        }
        break;
      }
      case "End": {
        event.preventDefault();
        const last = lastEnabled(column);
        if (last) {
          setActiveAt(level, last.value);
        }
        break;
      }
      case "ArrowRight": {
        event.preventDefault();
        const option = column.find((candidate) => candidate.value === activePath[level]);
        if (option) {
          expandOption(level, option, true);
        }
        break;
      }
      case "ArrowLeft":
        if (level > 0) {
          event.preventDefault();
          setFocusLevel(level - 1);
          setPendingFocus(level - 1);
        }
        break;
      case "Enter":
      case " ": {
        event.preventDefault();
        const current = column.find((candidate) => candidate.value === activePath[level]);
        const option = current ?? firstEnabled(column);
        if (!option || option.disabled) {
          return;
        }
        const path = [...activePath.slice(0, level), option.value];
        setActivePath(path);
        if (changeOnSelect || isLeafOption(option)) {
          commit(path);
          if (!changeOnSelect) {
            setOpen(false);
          }
        } else {
          expandOption(level, option, true);
        }
        break;
      }
      default:
        break;
    }
  };

  const selectSearchResult = (entry: SearchEntry) => {
    if (!interactive || entry.option.disabled) {
      return;
    }
    setActivePath(entry.path);
    commit(entry.path);
    setOpen(false);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!searchResults.length) {
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      for (let step = 1; step <= searchResults.length; step += 1) {
        const candidate =
          searchResults[
            (((searchIndex + direction * step) % searchResults.length) + searchResults.length) %
              searchResults.length
          ];
        if (!candidate.option.disabled) {
          setSearchIndex(
            (((searchIndex + direction * step) % searchResults.length) + searchResults.length) %
              searchResults.length,
          );
          return;
        }
      }
    } else if (event.key === "Enter") {
      event.preventDefault();
      const entry = searchResults[searchIndex] ?? searchResults[0];
      if (entry) {
        selectSearchResult(entry);
      }
    }
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (open || disabled || (event.key !== "ArrowDown" && event.key !== "ArrowUp")) {
      return;
    }
    // A combobox opens from the trigger with the arrow keys, as Select does.
    event.preventDefault();
    handleOpenChange(true);
    if (!selectedPath.length) {
      const candidate = event.key === "ArrowDown" ? firstEnabled(options) : lastEnabled(options);
      setActivePath(candidate ? [candidate.value] : []);
    }
  };

  const handleClear = () => {
    commit([]);
    triggerRef.current?.focus();
  };

  const dialogLabel = ariaLabel ?? (typeof label === "string" && label ? label : "级联选择");
  const showClear = allowClear && hasValue && !disabled && !readOnly;

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
        <div className="relative flex min-w-0 items-center">
          <UiPopoverTrigger
            ref={triggerRef}
            role="combobox"
            disabled={disabled}
            aria-label={ariaLabel ?? (label ? undefined : "级联选择")}
            aria-labelledby={label ? labelId : undefined}
            aria-readonly={readOnly || undefined}
            onKeyDown={handleTriggerKeyDown}
            className={cn(
              "group/cascader flex w-full min-w-0 flex-1 cursor-pointer items-center rounded-lark-md",
              "border border-solid border-lark-border bg-lark-canvas text-left text-lark-title",
              "transition-[border-color,background-color] duration-100 ease-lark-linear",
              "hover:border-lark-primary focus-visible:border-lark-primary focus-visible:outline-none",
              "data-[open]:border-lark-primary",
              "data-[disabled]:cursor-not-allowed data-[disabled]:border-lark-border",
              "data-[disabled]:bg-lark-disabled-bg data-[disabled]:text-lark-placeholder",
              "data-[disabled]:hover:border-lark-border",
              triggerSize[size],
            )}
          >
            <span
              className={cn(
                "min-w-0 flex-1 truncate text-left",
                hasValue ? "text-lark-title" : "text-lark-caption",
              )}
            >
              {hasValue ? displayText : placeholder}
            </span>
            {showClear ? <span aria-hidden="true" className="size-4 shrink-0" /> : null}
            <ChevronDownIcon
              className={cn(
                "pointer-events-none size-4 shrink-0 text-lark-icon-2",
                "transition-transform duration-200 ease-lark",
                "group-data-[open]/cascader:rotate-180",
              )}
            />
          </UiPopoverTrigger>

          {showClear ? (
            <button
              type="button"
              aria-label={clearLabel}
              onClick={handleClear}
              className={cn(
                "absolute top-1/2 right-7 flex size-4 -translate-y-1/2 cursor-pointer items-center justify-center",
                "rounded-full text-lark-icon-3 transition-colors duration-100",
                "hover:bg-[var(--lark-fill-hover)] hover:text-lark-primary-content",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
              )}
            >
              <XIcon size={14} />
            </button>
          ) : null}
        </div>

        <UiPopoverContent
          align="start"
          sideOffset={4}
          initialFocus={showSearch ? () => searchRef.current : () => columnRefs.current[0] ?? null}
          className={cn(
            "z-50 flex max-h-[320px] w-max max-w-[720px] flex-col overflow-hidden",
            "rounded-lark-lg border border-solid border-lark-border-card bg-lark-float p-1",
            "shadow-lark-4 outline-none",
            "origin-(--transform-origin) transition-[opacity,scale] duration-100 ease-lark",
            "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
            contentClassName,
          )}
        >
          <UiPopoverTitle className="sr-only">{dialogLabel}</UiPopoverTitle>

          {showSearch ? (
            <div className="relative mb-1 shrink-0">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-lark-icon-3" />
              <input
                ref={searchRef}
                type="search"
                aria-label={searchLabel}
                aria-controls={searching && searchResults.length ? resultsId : undefined}
                placeholder={searchPlaceholder}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSearchIndex(0);
                }}
                onKeyDown={handleSearchKeyDown}
                className={cn(
                  "h-8 w-full rounded-lark-md border border-solid border-lark-border",
                  "bg-lark-canvas pr-2 pl-8 text-lark-14 text-lark-title outline-none",
                  "placeholder:text-lark-placeholder focus:border-lark-primary",
                  "[&::-webkit-search-cancel-button]:hidden",
                )}
              />
            </div>
          ) : null}

          {showSearch ? (
            <span className="sr-only" role="status">
              {searching
                ? searchResults.length
                  ? `${searchResults[searchIndex]?.labels.join("/") ?? ""}，共 ${searchResults.length} 个结果`
                  : "0 个结果"
                : ""}
            </span>
          ) : null}

          {searching ? (
            searchResults.length ? (
              <div
                id={resultsId}
                role="listbox"
                aria-label="搜索结果"
                className="max-h-[224px] overflow-y-auto p-0.5"
              >
                {searchResults.map((entry, index) => {
                  const selected =
                    entry.path.length === selectedPath.length &&
                    entry.path.every((segment, position) => segment === selectedPath[position]);
                  const active = index === searchIndex;
                  return (
                    <div
                      key={entry.path.join("/")}
                      id={`${baseId}-search-option-${index}`}
                      role="option"
                      tabIndex={-1}
                      aria-selected={selected}
                      aria-disabled={entry.option.disabled || undefined}
                      data-active={active ? "" : undefined}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setSearchIndex(index)}
                      onClick={() => selectSearchResult(entry)}
                      className={cn(
                        "flex min-h-8 cursor-pointer items-center rounded-lark-sm px-2 py-1",
                        "text-lark-14 leading-[22px] text-lark-title",
                        "transition-colors duration-100",
                        active && "bg-[var(--lark-fill-hover)]",
                        selected && "text-lark-primary",
                        entry.option.disabled &&
                          "cursor-not-allowed text-lark-disabled hover:bg-transparent",
                      )}
                    >
                      <span className="min-w-0 flex-1 truncate">{entry.labels.join("/")}</span>
                      {selected ? (
                        <CheckIcon className="ml-2 size-3 shrink-0 text-lark-primary" />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="px-2 py-3 text-lark-14 leading-[22px] text-lark-caption">
                {emptyText}
              </div>
            )
          ) : columns[0]?.length ? (
            <div className="flex min-h-0 overflow-hidden">
              {columns.map((column, level) => {
                const activeIndex = column.findIndex(
                  (option) => option.value === activePath[level],
                );
                return (
                  <div
                    key={level === 0 ? "root-column" : `column-${level}-${activePath[level - 1]}`}
                    ref={(element) => {
                      columnRefs.current[level] = element;
                    }}
                    role="listbox"
                    aria-label={`第 ${level + 1} 级选项`}
                    aria-activedescendant={
                      activeIndex >= 0 ? `${baseId}-option-${level}-${activeIndex}` : undefined
                    }
                    tabIndex={level === focusLevel ? 0 : -1}
                    onFocus={() => setFocusLevel(level)}
                    onKeyDown={handleColumnKeyDown(level)}
                    className={cn(
                      "max-h-[256px] w-40 shrink-0 overflow-y-auto py-0.5 outline-none",
                      level > 0 && "border-l border-solid border-lark-divider",
                    )}
                  >
                    {column.map((option, index) => {
                      const active = option.value === activePath[level];
                      // UD colours only the chosen node itself; its ancestors are
                      // merely active, so browsing another branch never leaves a
                      // stale blue row in a column that shows someone else's data.
                      const selected =
                        selectedPath.length - 1 === level && selectedPath[level] === option.value;
                      const leaf = isLeafOption(option);
                      return (
                        <div
                          key={option.value}
                          id={`${baseId}-option-${level}-${index}`}
                          role="option"
                          tabIndex={-1}
                          aria-selected={selected}
                          aria-disabled={option.disabled || undefined}
                          data-active={active ? "" : undefined}
                          onMouseDown={(event) => event.preventDefault()}
                          onMouseEnter={
                            expandTrigger === "hover"
                              ? () => {
                                  if (!option.disabled) {
                                    setActiveAt(level, option.value);
                                  }
                                }
                              : undefined
                          }
                          onClick={() => selectOption(level, option)}
                          className={cn(
                            "mx-[3px] my-px flex min-h-[30px] cursor-pointer items-center",
                            "rounded-lark-sm px-2 py-1 text-lark-14 leading-[22px] text-lark-title",
                            "transition-colors duration-100",
                            "hover:bg-[var(--lark-fill-hover)]",
                            active && !(selected && leaf) && "bg-[var(--lark-fill-hover)]",
                            selected && "text-lark-primary",
                            option.disabled &&
                              "cursor-not-allowed bg-transparent text-lark-disabled hover:bg-transparent",
                          )}
                        >
                          <span className="min-w-0 flex-1 truncate">{option.label}</span>
                          {leaf ? (
                            selected ? (
                              <CheckIcon className="ml-2 size-3 shrink-0 text-lark-primary" />
                            ) : null
                          ) : (
                            <ChevronRightIcon className="ml-2 size-3 shrink-0 text-lark-icon-3" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-2 py-3 text-lark-14 leading-[22px] text-lark-caption">
              {emptyText}
            </div>
          )}
        </UiPopoverContent>
      </UiPopover>
    </div>
  );
}
