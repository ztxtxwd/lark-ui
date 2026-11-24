import { cva } from "class-variance-authority";
import {
  type ComponentProps,
  type CSSProperties,
  type Key,
  type ReactNode,
  type Ref,
  useMemo,
  useState,
} from "react";
import { cn } from "../../lib/cn";
import { Checkbox } from "../Checkbox";
import { Empty } from "../Empty";
import { Loading } from "../Loading";
import { Pagination, type PaginationProps } from "../Pagination";

export type TableSize = "sm" | "md" | "lg";
export type TableAlign = "left" | "center" | "right";
export type TableSortOrder = "ascend" | "descend";
export type TableLayout = "auto" | "fixed";

export type TableSortState = {
  /** `key` of the sorted column, or its `dataIndex` when no key was given. */
  columnKey: Key;
  order: TableSortOrder;
};

export type TableColumn<RecordType extends object = Record<string, unknown>> = {
  key?: Key;
  title: ReactNode;
  dataIndex?: keyof RecordType | readonly (string | number)[];
  width?: number | string;
  minWidth?: number | string;
  align?: TableAlign;
  /** Adds the two-caret sorter and makes the whole header cell a button. */
  sortable?: boolean;
  render?: (value: unknown, record: RecordType, index: number) => ReactNode;
  /** Pins the column while the table scrolls horizontally. */
  fixed?: "left" | "right";
  /** Single-line truncation with the raw value as the native title tooltip. */
  ellipsis?: boolean;
  className?: string;
  headerClassName?: string;
};

export type TableCheckboxProps = {
  disabled?: boolean;
  "aria-label"?: string;
};

export type TableRowSelection<RecordType extends object = Record<string, unknown>> = {
  selectedRowKeys?: readonly Key[];
  defaultSelectedRowKeys?: readonly Key[];
  onChange?: (selectedRowKeys: Key[], selectedRows: RecordType[]) => void;
  getCheckboxProps?: (record: RecordType, index: number) => TableCheckboxProps | undefined;
};

export type TablePaginationConfig = Omit<PaginationProps, "className"> & {
  position?: TableAlign;
  className?: string;
};

export type TableRowInteractionProps = Omit<ComponentProps<"tr">, "children" | "ref">;

export type TableProps<RecordType extends object = Record<string, unknown>> = Omit<
  ComponentProps<"table">,
  "children" | "ref" | "className"
> & {
  columns?: readonly TableColumn<RecordType>[];
  dataSource?: readonly RecordType[];
  /** Defaults to the record `key`, then to the row index. */
  rowKey?: keyof RecordType | ((record: RecordType) => Key);
  /** Visible caption. Provide this or `aria-label` so the table has a name. */
  caption?: ReactNode;
  /** Visually hides the caption while keeping it as the accessible name. */
  captionHidden?: boolean;
  /** Composable parts for a hand-built table. Ignored when `columns` is set. */
  children?: ReactNode;
  /** Wrapper class; `tableClassName` styles the `<table>` itself. */
  className?: string;
  tableClassName?: string;
  /** UD 紧凑型 (8px), 基础型 (12px) or 宽松型 (16px) cell padding. */
  size?: TableSize;
  bordered?: boolean;
  stickyHeader?: boolean;
  tableLayout?: TableLayout;
  /** Rows keep their hover highlight. Defaults to true. */
  hoverable?: boolean;
  loading?: boolean;
  /** Custom empty content. Defaults to the UD text-only empty state. */
  empty?: ReactNode;
  /** Controlled sort. Pass `null` for unsorted. */
  sort?: TableSortState | null;
  defaultSort?: TableSortState | null;
  onSortChange?: (sort: TableSortState | null) => void;
  rowSelection?: TableRowSelection<RecordType>;
  pagination?: TablePaginationConfig | false;
  /** Pointer handlers and attributes for a data row. */
  onRow?: (record: RecordType, index: number) => TableRowInteractionProps;
  /** Makes the table scroll vertically inside this height. */
  maxHeight?: number | string;
  ref?: Ref<HTMLDivElement>;
};

const tableStyles = cva(
  [
    "group/table w-full border-separate border-spacing-0 border-y border-lark-divider",
    "bg-lark-canvas text-left text-lark-14 text-lark-title",
  ],
  {
    variants: {
      bordered: {
        true: cn(
          "border-x border-lark-divider",
          "[&_th:not(:last-child)]:border-r [&_td:not(:last-child)]:border-r",
        ),
        false: "",
      },
      layout: {
        auto: "table-auto",
        fixed: "table-fixed",
      },
    },
    defaultVariants: { bordered: false, layout: "auto" },
  },
);

/* Client `.ud__table__divider--left` / `--right`: Shadow-S1 mirrored on the edge. */
const fixedEdgeStyles = cn(
  "data-[fixed-edge=left]:shadow-[1px_0_2px_-2px_rgba(31,35,41,0.02),2px_0_4px_rgba(31,35,41,0.02),2px_0_8px_2px_rgba(31,35,41,0.02)]",
  "data-[fixed-edge=right]:shadow-[-1px_0_2px_-2px_rgba(31,35,41,0.02),-2px_0_4px_rgba(31,35,41,0.02),-2px_0_8px_2px_rgba(31,35,41,0.02)]",
);

const headStyles = cva(
  [
    "relative box-border border-b border-lark-divider px-3 py-3 align-middle",
    "text-lark-14 font-medium leading-[22px] text-lark-caption",
    "group-data-[size=sm]/table:py-2 group-data-[size=lg]/table:py-4",
    "data-[fixed]:sticky data-[fixed]:z-[3] data-[fixed]:bg-inherit",
    fixedEdgeStyles,
  ],
  {
    variants: {
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: { align: "left" },
  },
);

const cellStyles = cva(
  [
    "box-border border-b border-lark-divider px-3 py-3 align-middle",
    "text-lark-14 leading-[22px] text-lark-title",
    "group-data-[size=sm]/table:py-2 group-data-[size=lg]/table:py-4",
    "transition-colors duration-100 ease-lark-linear",
    "data-[fixed]:sticky data-[fixed]:z-[2] data-[fixed]:bg-inherit",
    fixedEdgeStyles,
  ],
  {
    variants: {
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: { align: "left" },
  },
);

const sortButtonAlign = {
  left: "justify-start text-left",
  center: "justify-center text-center",
  right: "justify-end text-right",
} as const;

function SortIndicator({ order }: { order: TableSortOrder | null }) {
  return (
    <span
      aria-hidden="true"
      className="ml-2 inline-flex h-[22px] shrink-0 flex-col items-center justify-center text-lark-icon-2"
    >
      <svg
        aria-hidden="true"
        className={cn("h-[5px] w-2", order === "ascend" && "text-lark-primary-content")}
        fill="currentColor"
        focusable="false"
        viewBox="0 0 8 5"
      >
        <path d="M4 0 8 5H0Z" />
      </svg>
      <svg
        aria-hidden="true"
        className={cn("mt-px h-[5px] w-2", order === "descend" && "text-lark-primary-content")}
        fill="currentColor"
        focusable="false"
        viewBox="0 0 8 5"
      >
        <path d="M4 5 0 0h8Z" />
      </svg>
    </span>
  );
}

function getColumnKey<RecordType extends object>(
  column: TableColumn<RecordType>,
  index: number,
): Key {
  if (column.key !== undefined) {
    return column.key;
  }
  if (column.dataIndex !== undefined) {
    return Array.isArray(column.dataIndex) ? column.dataIndex.join(".") : String(column.dataIndex);
  }
  return `column-${index}`;
}

function getValue<RecordType extends object>(
  record: RecordType,
  dataIndex: TableColumn<RecordType>["dataIndex"],
): unknown {
  if (dataIndex === undefined) {
    return undefined;
  }
  if (Array.isArray(dataIndex)) {
    return dataIndex.reduce<unknown>(
      (value, key) => (value == null ? undefined : (value as Record<string, unknown>)[key]),
      record,
    );
  }
  return (record as Record<PropertyKey, unknown>)[dataIndex as PropertyKey];
}

function toText(value: unknown): string | undefined {
  if (typeof value === "string" || typeof value === "number" || typeof value === "bigint") {
    return String(value);
  }
  return undefined;
}

function toContent(value: unknown): ReactNode {
  if (value === null || value === undefined) {
    return null;
  }
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "bigint" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }
  return value as ReactNode;
}

function sortActionLabel(title: ReactNode, order: TableSortOrder | null): string {
  const name = toText(title) ?? "该列";
  if (order === "ascend") {
    return `按${name}降序排序`;
  }
  if (order === "descend") {
    return `恢复${name}默认排序`;
  }
  return `按${name}升序排序`;
}

function sortActionTitle(order: TableSortOrder | null): string {
  if (order === "ascend") {
    return "点击降序";
  }
  if (order === "descend") {
    return "恢复默认排序";
  }
  return "点击升序";
}

function columnWidth(column: { width?: number | string }): number {
  if (typeof column.width === "number") {
    return column.width;
  }
  return Number.parseFloat(column.width ?? "") || 0;
}

function cellStyle<RecordType extends object>(
  column: TableColumn<RecordType>,
  index: number,
  leftOffsets: readonly number[],
  rightOffsets: readonly number[],
): CSSProperties {
  const style: CSSProperties = {};
  if (column.width !== undefined) {
    style.width = column.width;
  }
  if (column.minWidth !== undefined) {
    style.minWidth = column.minWidth;
  }
  if (column.fixed === "left") {
    style.left = leftOffsets[index];
  }
  if (column.fixed === "right") {
    style.right = rightOffsets[index];
  }
  return style;
}

export type TableHeaderProps = ComponentProps<"thead"> & {
  /** Sticks the header to the top of the table's scroll container. */
  sticky?: boolean;
};

export function TableHeader({ sticky = false, className, ...props }: TableHeaderProps) {
  return (
    <thead
      {...props}
      data-slot="table-header"
      data-sticky={sticky ? "" : undefined}
      className={cn(
        sticky &&
          "bg-lark-canvas [&>tr>th]:sticky [&>tr>th]:top-0 [&>tr>th]:z-[3] [&>tr>th]:bg-lark-canvas",
        "group-data-[sticky-header]/table:bg-lark-canvas",
        "group-data-[sticky-header]/table:[&>tr>th]:sticky group-data-[sticky-header]/table:[&>tr>th]:top-0 group-data-[sticky-header]/table:[&>tr>th]:z-[3] group-data-[sticky-header]/table:[&>tr>th]:bg-lark-canvas",
        className,
      )}
    />
  );
}

export type TableBodyProps = ComponentProps<"tbody">;

export function TableBody({ className, ...props }: TableBodyProps) {
  return (
    <tbody
      {...props}
      data-slot="table-body"
      className={cn("[&>tr:last-child>*]:border-b-0", className)}
    />
  );
}

export type TableFooterProps = ComponentProps<"tfoot">;

export function TableFooter({ className, ...props }: TableFooterProps) {
  return (
    <tfoot
      {...props}
      data-slot="table-footer"
      className={cn(
        "[&>tr:first-child>th]:border-t [&>tr:first-child>th]:border-lark-divider",
        "[&>tr:first-child>td]:border-t [&>tr:first-child>td]:border-lark-divider",
        "[&>tr:last-child>th]:border-b-0 [&>tr:last-child>td]:border-b-0",
        className,
      )}
    />
  );
}

export type TableRowProps = ComponentProps<"tr"> & {
  /** Enables the row hover fill. Defaults to true. */
  hoverable?: boolean;
  selected?: boolean;
  /** Pointer cursor for rows with an `onClick`. */
  clickable?: boolean;
};

export function TableRow({
  hoverable = true,
  selected = false,
  clickable = false,
  className,
  ...props
}: TableRowProps) {
  return (
    <tr
      {...props}
      data-slot="table-row"
      data-hoverable={hoverable ? "" : undefined}
      data-selected={selected ? "" : undefined}
      data-clickable={clickable ? "" : undefined}
      className={cn(
        "group/row bg-lark-canvas transition-colors duration-100 ease-lark-linear",
        "data-[hoverable]:hover:bg-lark-hover",
        "data-[selected]:bg-lark-selected data-[selected]:hover:bg-lark-selected",
        "data-[clickable]:cursor-pointer",
        className,
      )}
    />
  );
}

export type TableHeadProps = Omit<ComponentProps<"th">, "align"> & {
  align?: TableAlign;
};

export function TableHead({ scope = "col", align = "left", className, ...props }: TableHeadProps) {
  return (
    <th
      {...props}
      scope={scope}
      data-slot="table-head"
      className={cn(headStyles({ align }), className)}
    />
  );
}

export type TableCellProps = Omit<ComponentProps<"td">, "align"> & {
  align?: TableAlign;
};

export function TableCell({ align = "left", className, ...props }: TableCellProps) {
  return <td {...props} data-slot="table-cell" className={cn(cellStyles({ align }), className)} />;
}

export type TableCaptionProps = ComponentProps<"caption"> & {
  side?: "top" | "bottom";
};

export function TableCaption({ side = "top", className, ...props }: TableCaptionProps) {
  return (
    <caption
      {...props}
      data-slot="table-caption"
      className={cn(
        "px-3 py-3 text-left text-lark-14 leading-[22px] text-lark-caption",
        side === "top" ? "[caption-side:top]" : "[caption-side:bottom]",
        className,
      )}
    />
  );
}

/**
 * UD table. Native `<table>` semantics with the 14/22 type scale, 12px cell
 * padding, 40px selection column and single-column sorting. Sorting only
 * reports the next state; the caller orders `dataSource` (server-side) itself.
 */
export function Table<RecordType extends object = Record<string, unknown>>({
  columns,
  dataSource,
  rowKey,
  caption,
  captionHidden = false,
  children,
  className,
  tableClassName,
  size = "md",
  bordered = false,
  stickyHeader = false,
  tableLayout = "auto",
  hoverable = true,
  loading = false,
  empty,
  sort,
  defaultSort = null,
  onSortChange,
  rowSelection,
  pagination = false,
  onRow,
  maxHeight,
  ref,
  ...tableProps
}: TableProps<RecordType>) {
  const [uncontrolledSort, setUncontrolledSort] = useState<TableSortState | null>(defaultSort);
  const [uncontrolledSelection, setUncontrolledSelection] = useState<readonly Key[]>(
    rowSelection?.defaultSelectedRowKeys ?? [],
  );

  const sortState = sort === undefined ? uncontrolledSort : sort;
  const selectedKeys = rowSelection?.selectedRowKeys ?? uncontrolledSelection;
  const selectedSet = useMemo(() => new Set(selectedKeys), [selectedKeys]);

  const records = dataSource ?? [];
  const isDataDriven = columns !== undefined;
  const columnList = columns ?? [];
  const selectionEnabled = rowSelection !== undefined;

  const leftOffsets: number[] = [];
  const rightOffsets: number[] = new Array(columnList.length).fill(0);
  const hasLeftFixed = columnList.some((column) => column.fixed === "left");
  const selectionFixed = selectionEnabled && hasLeftFixed;
  const selectionWidth = 40;

  let leftAcc = selectionFixed ? selectionWidth : 0;
  columnList.forEach((column, index) => {
    leftOffsets[index] = leftAcc;
    if (column.fixed === "left") {
      leftAcc += columnWidth(column);
    }
  });
  let rightAcc = 0;
  for (let index = columnList.length - 1; index >= 0; index -= 1) {
    rightOffsets[index] = rightAcc;
    const column = columnList[index];
    if (column.fixed === "right") {
      rightAcc += columnWidth(column);
    }
  }
  const lastLeftIndex = columnList.reduce(
    (last, column, index) => (column.fixed === "left" ? index : last),
    -1,
  );
  const firstRightIndex = columnList.findIndex((column) => column.fixed === "right");

  const resolveRowKey = (record: RecordType, index: number): Key => {
    if (typeof rowKey === "function") {
      return rowKey(record);
    }
    if (rowKey !== undefined) {
      return (record[rowKey] as Key | undefined) ?? index;
    }
    return ((record as { key?: Key }).key as Key | undefined) ?? index;
  };

  const getCheckboxProps = (record: RecordType, index: number) =>
    rowSelection?.getCheckboxProps?.(record, index) ?? {};

  const checkboxLabel = (record: RecordType, index: number): string => {
    const custom = rowSelection?.getCheckboxProps?.(record, index)?.["aria-label"];
    if (custom) {
      return custom;
    }
    const identityColumn = columnList.find((column) => column.dataIndex !== undefined);
    const identity = identityColumn
      ? toText(getValue(record, identityColumn.dataIndex))
      : toText((record as { name?: unknown }).name);
    return identity ? `选择 ${identity}` : `选择第 ${index + 1} 行`;
  };

  const commitSelection = (nextKeys: Key[]) => {
    if (rowSelection?.selectedRowKeys === undefined) {
      setUncontrolledSelection(nextKeys);
    }
    if (rowSelection?.onChange) {
      const nextSet = new Set(nextKeys);
      const nextRows = records.filter((record, index) => nextSet.has(resolveRowKey(record, index)));
      rowSelection.onChange(nextKeys, nextRows);
    }
  };

  const toggleRow = (key: Key, checked: boolean) => {
    const next = checked
      ? selectedSet.has(key)
        ? [...selectedKeys]
        : [...selectedKeys, key]
      : selectedKeys.filter((selected) => selected !== key);
    commitSelection(next);
  };

  const selectableKeys = records.flatMap((record, index) => {
    const key = resolveRowKey(record, index);
    return getCheckboxProps(record, index).disabled ? [] : [key];
  });
  const selectedSelectableCount = selectableKeys.filter((key) => selectedSet.has(key)).length;
  const allSelected =
    selectableKeys.length > 0 && selectedSelectableCount === selectableKeys.length;
  const someSelected = selectedSelectableCount > 0 && !allSelected;

  const toggleAll = (checked: boolean) => {
    if (checked) {
      const next = [...selectedKeys];
      const present = new Set(next);
      for (const key of selectableKeys) {
        if (!present.has(key)) {
          present.add(key);
          next.push(key);
        }
      }
      commitSelection(next);
      return;
    }
    const removed = new Set(selectableKeys);
    commitSelection(selectedKeys.filter((key) => !removed.has(key)));
  };

  const toggleSort = (column: TableColumn<RecordType>, index: number) => {
    const columnKey = getColumnKey(column, index);
    let next: TableSortState | null;
    if (!sortState || sortState.columnKey !== columnKey) {
      next = { columnKey, order: "ascend" };
    } else if (sortState.order === "ascend") {
      next = { columnKey, order: "descend" };
    } else {
      next = null;
    }
    if (sort === undefined) {
      setUncontrolledSort(next);
    }
    onSortChange?.(next);
  };

  const renderHeaderCell = (column: TableColumn<RecordType>, index: number) => {
    const columnKey = getColumnKey(column, index);
    const activeOrder = sortState && sortState.columnKey === columnKey ? sortState.order : null;
    const align = column.align ?? "left";
    const titleText = toText(column.title);
    const style = cellStyle(column, index, leftOffsets, rightOffsets);
    const fixedEdge =
      index === lastLeftIndex
        ? "left"
        : index === firstRightIndex && column.fixed === "right"
          ? "right"
          : undefined;
    const title = (
      <span className="block max-w-full truncate" title={titleText}>
        {column.title}
      </span>
    );

    if (column.sortable) {
      return (
        <TableHead
          key={`head-${String(columnKey)}-${index}`}
          align={align}
          aria-sort={
            activeOrder === "ascend"
              ? "ascending"
              : activeOrder === "descend"
                ? "descending"
                : undefined
          }
          className={cn(
            "p-0 group-data-[size=sm]/table:py-0 group-data-[size=lg]/table:py-0",
            "data-[fixed]:bg-lark-canvas",
            fixedEdge && "bg-lark-canvas",
            column.headerClassName,
          )}
          data-fixed={column.fixed}
          data-fixed-edge={fixedEdge}
          style={style}
        >
          <button
            type="button"
            title={sortActionTitle(activeOrder)}
            aria-label={sortActionLabel(column.title, activeOrder)}
            onClick={() => toggleSort(column, index)}
            className={cn(
              "flex w-full cursor-pointer items-center border-0 bg-transparent",
              "px-3 py-3 text-lark-14 font-medium leading-[22px] text-lark-caption",
              "group-data-[size=sm]/table:py-2 group-data-[size=lg]/table:py-4",
              "transition-colors duration-100 ease-lark-linear hover:bg-lark-hover",
              "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-lark-primary",
              sortButtonAlign[align],
            )}
          >
            <span className="min-w-0 max-w-full truncate" title={titleText}>
              {column.title}
            </span>
            <SortIndicator order={activeOrder} />
          </button>
        </TableHead>
      );
    }

    return (
      <TableHead
        key={`head-${String(columnKey)}-${index}`}
        align={align}
        className={cn(fixedEdge && "bg-lark-canvas", column.headerClassName)}
        data-fixed={column.fixed}
        data-fixed-edge={fixedEdge}
        style={style}
      >
        {title}
      </TableHead>
    );
  };

  const renderBodyCell = (
    column: TableColumn<RecordType>,
    columnIndex: number,
    record: RecordType,
    rowIndex: number,
  ) => {
    const value = getValue(record, column.dataIndex);
    const content = column.render ? column.render(value, record, rowIndex) : toContent(value);
    const fixedEdge =
      columnIndex === lastLeftIndex
        ? "left"
        : columnIndex === firstRightIndex && column.fixed === "right"
          ? "right"
          : undefined;

    return (
      <TableCell
        key={`cell-${String(resolveRowKey(record, rowIndex))}-${columnIndex}`}
        align={column.align}
        className={cn(column.ellipsis && "overflow-hidden", column.className)}
        data-fixed={column.fixed}
        data-fixed-edge={fixedEdge}
        style={cellStyle(column, columnIndex, leftOffsets, rightOffsets)}
      >
        {column.ellipsis ? (
          <span className="block max-w-full truncate" title={toText(value)}>
            {content}
          </span>
        ) : (
          content
        )}
      </TableCell>
    );
  };

  const selectionHeader = selectionEnabled ? (
    <TableHead
      align="center"
      className="w-10 min-w-10 p-0"
      data-fixed={selectionFixed ? "left" : undefined}
      style={selectionFixed ? { width: selectionWidth, left: 0 } : { width: selectionWidth }}
    >
      <Checkbox
        aria-label="全选"
        checked={allSelected ? true : someSelected ? "indeterminate" : false}
        disabled={selectableKeys.length === 0}
        onCheckedChange={(checked) => toggleAll(checked === true)}
        className="justify-center"
      />
    </TableHead>
  ) : null;

  const columnCount = Math.max(1, columnList.length + (selectionEnabled ? 1 : 0));
  const emptyContent =
    empty === undefined ? (
      <Empty
        className="py-7"
        illustration={null}
        size="sm"
        title={<span className="text-lark-caption">暂无数据</span>}
      />
    ) : (
      empty
    );

  let paginationNode: ReactNode = null;
  if (pagination !== false) {
    const {
      position = "right",
      className: paginationClassName,
      total: paginationTotal,
      ...paginationProps
    } = pagination;
    paginationNode = (
      <div
        data-slot="table-pagination"
        className={cn(
          "my-4 flex",
          position === "left"
            ? "justify-start"
            : position === "center"
              ? "justify-center"
              : "justify-end",
        )}
      >
        <Pagination
          {...paginationProps}
          total={paginationTotal ?? records.length}
          className={paginationClassName}
        />
      </div>
    );
  }

  const tableNode = (
    <div
      data-slot="table-container"
      className={cn(
        "relative w-full overflow-x-auto",
        maxHeight !== undefined && "overflow-y-auto",
      )}
      style={maxHeight !== undefined ? { maxHeight } : undefined}
    >
      <table
        {...tableProps}
        aria-busy={loading ? true : tableProps["aria-busy"]}
        data-slot="table"
        data-size={size}
        data-bordered={bordered ? "" : undefined}
        data-sticky-header={stickyHeader ? "" : undefined}
        className={cn(tableStyles({ bordered, layout: tableLayout }), tableClassName)}
      >
        {caption !== undefined ? (
          <TableCaption className={captionHidden ? "sr-only" : undefined}>{caption}</TableCaption>
        ) : null}

        {isDataDriven ? (
          <>
            {columnList.length + (selectionEnabled ? 1 : 0) > 0 ? (
              <TableHeader sticky={stickyHeader}>
                <TableRow hoverable={false}>
                  {selectionHeader}
                  {columnList.map(renderHeaderCell)}
                </TableRow>
              </TableHeader>
            ) : null}
            <TableBody>
              {records.map((record, rowIndex) => {
                const key = resolveRowKey(record, rowIndex);
                const checkboxProps = getCheckboxProps(record, rowIndex);
                const rowProps = onRow?.(record, rowIndex) ?? {};
                return (
                  <TableRow
                    {...rowProps}
                    key={String(key)}
                    selected={selectedSet.has(key)}
                    hoverable={hoverable}
                    clickable={Boolean(rowProps.onClick)}
                  >
                    {selectionEnabled ? (
                      <TableCell
                        align="center"
                        className="w-10 min-w-10"
                        data-fixed={selectionFixed ? "left" : undefined}
                        style={
                          selectionFixed
                            ? { width: selectionWidth, left: 0 }
                            : { width: selectionWidth }
                        }
                      >
                        <Checkbox
                          aria-label={checkboxLabel(record, rowIndex)}
                          checked={selectedSet.has(key)}
                          disabled={checkboxProps.disabled}
                          onCheckedChange={(checked) => toggleRow(key, checked === true)}
                          className="justify-center"
                        />
                      </TableCell>
                    ) : null}
                    {columnList.map((column, columnIndex) =>
                      renderBodyCell(column, columnIndex, record, rowIndex),
                    )}
                  </TableRow>
                );
              })}
              {records.length === 0 ? (
                loading ? (
                  <TableRow hoverable={false}>
                    <TableCell className="border-b-0 p-0" colSpan={columnCount}>
                      <div className="flex h-[68px] items-center justify-center">
                        <Loading />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow hoverable={false}>
                    <TableCell align="center" className="border-b-0 p-0" colSpan={columnCount}>
                      {emptyContent}
                    </TableCell>
                  </TableRow>
                )
              ) : null}
            </TableBody>
          </>
        ) : (
          children
        )}
      </table>
    </div>
  );

  return (
    <div ref={ref} data-slot="table-root" className={cn("w-full", className)}>
      {loading && (!isDataDriven || records.length > 0) ? (
        <Loading overlay className="w-full">
          {tableNode}
        </Loading>
      ) : (
        tableNode
      )}
      {paginationNode}
    </div>
  );
}
