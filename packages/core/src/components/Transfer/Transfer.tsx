import { type CSSProperties, type ReactNode, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "../../icons";
import { cn } from "../../lib/cn";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { Input } from "../Input";

export type TransferDirection = "left" | "right";

export type TransferItem = {
  key: string;
  title: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

export type TransferProps = {
  /** Every item that can be moved. Items whose key is in `targetKeys` render on the right. */
  dataSource: TransferItem[];
  /** Keys on the right, controlled. */
  targetKeys?: string[];
  /** Keys on the right at first, when uncontrolled. */
  defaultTargetKeys?: string[];
  /** Runs after a move with the next right-hand keys, the direction and the moved keys. */
  onChange?: (nextKeys: string[], direction: TransferDirection, movedKeys: string[]) => void;
  /** Panel titles: [source, target]. Defaults to `["全部选项", "已选"]`. */
  titles?: [string, string];
  /** Show the source-panel search box. */
  showSearch?: boolean;
  searchPlaceholder?: string;
  /** Dimensions passed to both panels. UD recommends at least 544 × 240px in total. */
  listStyle?: CSSProperties;
  /** Replace the item label. A string `item.title` still names the checkbox. */
  render?: (item: TransferItem) => ReactNode;
  disabled?: boolean;
  /** Only allows moving from the source to the target panel. */
  oneWay?: boolean;
  /** Shown in an empty panel. */
  emptyText?: ReactNode;
  className?: string;
};

const DEFAULT_TITLES: [string, string] = ["全部选项", "已选"];

function searchableText(item: TransferItem): string {
  return typeof item.title === "string" ? item.title : "";
}

/**
 * A two-panel selector. The left panel lists every option, the right panel the
 * chosen keys; the header checkbox selects everything currently visible.
 *
 * UD fixes 8px radii and 14/22 text, and suggests a 544 × 240px minimum size.
 * The client bundle in this repo carries no `.ud__transfer` CSS, so panel widths
 * use 240px panels around a 32px button rail to hit that 544px total exactly.
 */
export function Transfer({
  dataSource,
  targetKeys,
  defaultTargetKeys,
  onChange,
  titles = DEFAULT_TITLES,
  showSearch = false,
  searchPlaceholder = "搜索",
  listStyle,
  render,
  disabled = false,
  oneWay = false,
  emptyText = "暂无数据",
  className,
}: TransferProps) {
  const controlled = targetKeys !== undefined;
  const [innerTargetKeys, setInnerTargetKeys] = useState<string[]>(defaultTargetKeys ?? []);
  const [selectedSource, setSelectedSource] = useState<Set<string>>(new Set());
  const [selectedTarget, setSelectedTarget] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");

  const currentTargetKeys = controlled ? targetKeys : innerTargetKeys;
  const targetSet = new Set(currentTargetKeys);
  const itemByKey = new Map(dataSource.map((item) => [item.key, item]));

  const sourceItems = dataSource.filter((item) => !targetSet.has(item.key));
  const targetItems = currentTargetKeys
    .map((key) => itemByKey.get(key))
    .filter((item): item is TransferItem => item !== undefined);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleSource = normalizedQuery
    ? sourceItems.filter((item) => searchableText(item).toLowerCase().includes(normalizedQuery))
    : sourceItems;

  const sourceEnabled = visibleSource.filter((item) => !item.disabled);
  const selectedSourceEnabled = sourceEnabled.filter((item) => selectedSource.has(item.key));
  const sourceAllSelected =
    sourceEnabled.length > 0 && selectedSourceEnabled.length === sourceEnabled.length;
  const sourceSomeSelected = selectedSourceEnabled.length > 0 && !sourceAllSelected;

  const targetEnabled = targetItems.filter((item) => !item.disabled);
  const selectedTargetEnabled = targetEnabled.filter((item) => selectedTarget.has(item.key));
  const targetAllSelected =
    targetEnabled.length > 0 && selectedTargetEnabled.length === targetEnabled.length;
  const targetSomeSelected = selectedTargetEnabled.length > 0 && !targetAllSelected;

  const movableRight = visibleSource.filter(
    (item) => !item.disabled && selectedSource.has(item.key),
  );
  const movableLeft = targetItems.filter((item) => !item.disabled && selectedTarget.has(item.key));

  function commit(nextKeys: string[], direction: TransferDirection, movedKeys: string[]) {
    if (!controlled) {
      setInnerTargetKeys(nextKeys);
    }
    onChange?.(nextKeys, direction, movedKeys);
  }

  function toggleSourceItem(key: string, checked: boolean) {
    setSelectedSource((previous) => {
      const next = new Set(previous);
      if (checked) {
        next.add(key);
      } else {
        next.delete(key);
      }
      return next;
    });
  }

  function toggleTargetItem(key: string, checked: boolean) {
    setSelectedTarget((previous) => {
      const next = new Set(previous);
      if (checked) {
        next.add(key);
      } else {
        next.delete(key);
      }
      return next;
    });
  }

  function toggleAllSource(checked: boolean) {
    setSelectedSource((previous) => {
      const next = new Set(previous);
      for (const item of sourceEnabled) {
        if (checked) {
          next.add(item.key);
        } else {
          next.delete(item.key);
        }
      }
      return next;
    });
  }

  function toggleAllTarget(checked: boolean) {
    setSelectedTarget((previous) => {
      const next = new Set(previous);
      for (const item of targetEnabled) {
        if (checked) {
          next.add(item.key);
        } else {
          next.delete(item.key);
        }
      }
      return next;
    });
  }

  function moveRight() {
    if (disabled || movableRight.length === 0) {
      return;
    }
    const movedKeys = movableRight.map((item) => item.key);
    const nextKeys = [...currentTargetKeys];
    for (const key of movedKeys) {
      if (!nextKeys.includes(key)) {
        nextKeys.push(key);
      }
    }
    setSelectedSource((previous) => {
      const next = new Set(previous);
      for (const key of movedKeys) {
        next.delete(key);
      }
      return next;
    });
    commit(nextKeys, "right", movedKeys);
  }

  function moveLeft() {
    if (disabled || oneWay || movableLeft.length === 0) {
      return;
    }
    const movedKeys = movableLeft.map((item) => item.key);
    const nextKeys = currentTargetKeys.filter((key) => !movedKeys.includes(key));
    setSelectedTarget((previous) => {
      const next = new Set(previous);
      for (const key of movedKeys) {
        next.delete(key);
      }
      return next;
    });
    commit(nextKeys, "left", movedKeys);
  }

  function renderPanel({
    title,
    count,
    fraction,
    items,
    selected,
    allSelected,
    someSelected,
    headerCheckbox,
    selectionDisabled = false,
    onToggleItem,
    onToggleAll,
    search,
    empty,
  }: {
    title: string;
    count: number;
    fraction?: number;
    items: TransferItem[];
    selected: Set<string>;
    allSelected: boolean;
    someSelected: boolean;
    headerCheckbox: boolean;
    selectionDisabled?: boolean;
    onToggleItem: (key: string, checked: boolean) => void;
    onToggleAll: (checked: boolean) => void;
    search?: boolean;
    empty: ReactNode;
  }) {
    const countText = fraction === undefined ? `${count}` : `${count}/${fraction}`;

    return (
      <section
        aria-label={title}
        data-slot="transfer-panel"
        style={listStyle}
        className={cn(
          "flex h-60 w-60 shrink-0 flex-col overflow-hidden rounded-lark-lg border border-solid",
          "border-lark-border-card bg-lark-canvas",
        )}
      >
        <div className="flex h-10 shrink-0 items-center gap-2 border-b border-lark-border-card px-3">
          {headerCheckbox ? (
            <Checkbox
              aria-label={`全选${title}`}
              checked={allSelected ? true : someSelected ? "indeterminate" : false}
              disabled={disabled || selectionDisabled || !items.some((item) => !item.disabled)}
              onCheckedChange={(checked) => onToggleAll(checked === true)}
              className="shrink-0"
            />
          ) : null}
          <span className="min-w-0 truncate text-lark-14 text-lark-title">
            {title}（{countText}）
          </span>
        </div>

        {search ? (
          <div className="shrink-0 px-3 pt-2">
            <Input
              size="sm"
              allowClear
              startIcon={<SearchIcon />}
              value={query}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              disabled={disabled}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto p-1">
          {items.length > 0 ? (
            <div className="flex flex-col gap-0.5">
              {items.map((item) => (
                <Checkbox
                  key={item.key}
                  aria-label={render && typeof item.title === "string" ? item.title : undefined}
                  checked={selected.has(item.key)}
                  disabled={disabled || selectionDisabled || item.disabled}
                  description={item.description}
                  onCheckedChange={(checked) => onToggleItem(item.key, checked === true)}
                  className={cn(
                    "min-h-8 w-full rounded-lark-sm px-2 py-1",
                    "hover:bg-[var(--lark-fill-hover)]",
                    "transition-colors duration-100",
                    (disabled || selectionDisabled || item.disabled) && "hover:bg-transparent",
                  )}
                >
                  {render ? render(item) : item.title}
                </Checkbox>
              ))}
            </div>
          ) : (
            <div className="px-2 py-6 text-center text-lark-12 text-lark-caption">{empty}</div>
          )}
        </div>
      </section>
    );
  }

  return (
    <div className={cn("flex w-fit items-stretch gap-4", className)}>
      {renderPanel({
        title: titles[0],
        count: selectedSourceEnabled.length,
        fraction: visibleSource.length,
        items: visibleSource,
        selected: selectedSource,
        allSelected: sourceAllSelected,
        someSelected: sourceSomeSelected,
        headerCheckbox: true,
        onToggleItem: toggleSourceItem,
        onToggleAll: toggleAllSource,
        search: showSearch,
        empty: emptyText,
      })}

      <div className="flex w-8 shrink-0 flex-col justify-center gap-2">
        <Button
          appearance="outlined"
          tone="neutral"
          size="sm"
          aria-label="移到右侧"
          disabled={disabled || movableRight.length === 0}
          onClick={moveRight}
          className="w-8 min-w-0 px-0"
        >
          <ChevronRightIcon />
        </Button>
        {oneWay ? null : (
          <Button
            appearance="outlined"
            tone="neutral"
            size="sm"
            aria-label="移到左侧"
            disabled={disabled || movableLeft.length === 0}
            onClick={moveLeft}
            className="w-8 min-w-0 px-0"
          >
            <ChevronLeftIcon />
          </Button>
        )}
      </div>

      {renderPanel({
        title: titles[1],
        count: targetItems.length,
        items: targetItems,
        selected: selectedTarget,
        allSelected: targetAllSelected,
        someSelected: targetSomeSelected,
        headerCheckbox: !oneWay,
        selectionDisabled: oneWay,
        onToggleItem: toggleTargetItem,
        onToggleAll: toggleAllTarget,
        empty: oneWay ? "尚未选择" : emptyText,
      })}
    </div>
  );
}
