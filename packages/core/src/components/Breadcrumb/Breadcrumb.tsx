import type { ComponentProps, Key, MouseEventHandler, ReactNode } from "react";
import { Fragment } from "react";
import { ChevronRightIcon, MoreHorizontalIcon } from "../../icons";
import { cn } from "../../lib/cn";

/**
 * One level in the `items` API. The last item is the current page unless an
 * item sets `current: true`.
 */
export type BreadcrumbItemData = {
  key?: Key;
  label: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  current?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export type BreadcrumbProps = Omit<ComponentProps<"nav">, "children"> & {
  /** Accessible name of the navigation landmark. Defaults to `面包屑`. */
  label?: string;
  /** Data-driven API; when omitted, render the composable parts as children. */
  items?: BreadcrumbItemData[];
  /**
   * Maximum number of visible entries, including the ellipsis. The first and
   * last levels are always kept. Collapsing needs at least 3.
   */
  maxItems?: number;
  /** Separator used by the `items` API. Defaults to a chevron. */
  separator?: ReactNode;
  children?: ReactNode;
};

const itemStyles =
  "box-border inline-block max-w-[162px] truncate rounded-lark-md px-1 text-lark-14 text-lark-title";

const linkStyles = cn(
  itemStyles,
  "cursor-pointer text-lark-caption no-underline transition-colors duration-100 ease-lark-linear",
  "hover:bg-[var(--lark-primary-fill-transparent-01)] hover:text-lark-primary-content hover:no-underline",
  "focus-visible:bg-[var(--lark-primary-fill-transparent-01)] focus-visible:text-lark-primary-content focus-visible:outline-none",
  "active:bg-[var(--lark-primary-fill-transparent-03)] active:text-[var(--lark-primary-content-pressed)]",
);

const listStyles = "m-0 flex list-none flex-wrap items-center p-0";
const breadcrumbItemStyles = "inline-flex min-w-0 items-center";

const separatorStyles =
  "box-border inline-flex h-[22px] shrink-0 select-none items-center px-1 text-lark-12 text-lark-icon-3";

const ellipsisStyles =
  "box-border inline-flex h-[22px] cursor-default select-none items-center px-1 text-lark-icon-2";

/** The ordered list of breadcrumb levels. */
export function BreadcrumbList({ className, ...props }: ComponentProps<"ol">) {
  return <ol {...props} className={cn(listStyles, className)} />;
}

/** One level in the trail, as a list item. */
export function BreadcrumbItem({ className, ...props }: ComponentProps<"li">) {
  return <li {...props} className={cn(breadcrumbItemStyles, className)} />;
}

/** A link to an ancestor level. */
export function BreadcrumbLink({ className, ...props }: ComponentProps<"a">) {
  return <a {...props} className={cn(linkStyles, className)} />;
}

/** The current level. It is not a link and carries `aria-current="page"`. */
export function BreadcrumbPage({ className, ...props }: ComponentProps<"span">) {
  return (
    <span {...props} aria-current="page" className={cn(itemStyles, "text-lark-title", className)} />
  );
}

/** The divider between levels. Decorative, so it is hidden from assistive tech. */
export function BreadcrumbSeparator({ children, className, ...props }: ComponentProps<"li">) {
  return (
    <li
      {...props}
      aria-hidden="true"
      role="presentation"
      className={cn(separatorStyles, className)}
    >
      {children ?? <ChevronRightIcon size={16} />}
    </li>
  );
}

function labelText(label: ReactNode): string | undefined {
  return typeof label === "string" || typeof label === "number" ? String(label) : undefined;
}

function BreadcrumbEllipsis({ hidden }: { hidden: BreadcrumbItemData[] }) {
  const labels = hidden.map((item) => labelText(item.label));
  const complete = labels.every((label) => label !== undefined);
  const visibleLabels = labels.filter((label): label is string => label !== undefined);
  const description = complete
    ? `已折叠 ${hidden.length} 个层级：${visibleLabels.join("、")}`
    : `已折叠 ${hidden.length} 个层级`;

  return (
    <li className={breadcrumbItemStyles}>
      <span
        role="img"
        aria-label={description}
        title={complete ? visibleLabels.join("、") : undefined}
        className={ellipsisStyles}
      >
        <MoreHorizontalIcon size={16} />
      </span>
    </li>
  );
}

type VisibleEntry =
  | { kind: "item"; item: BreadcrumbItemData; index: number }
  | { kind: "ellipsis"; hidden: BreadcrumbItemData[] };

function collapseItems(items: BreadcrumbItemData[], maxItems: number | undefined): VisibleEntry[] {
  const all: VisibleEntry[] = items.map((item, index) => ({ kind: "item", item, index }));

  if (maxItems === undefined || maxItems < 3 || items.length <= maxItems) {
    return all;
  }

  // An explicit current page ends the trail. Keep the path up to it so
  // collapsing can never remove the only `aria-current="page"`.
  const active = currentIndex(items);
  const trail = active < items.length - 1 ? all.slice(0, active + 1) : all;
  if (trail.length <= maxItems) {
    return trail;
  }

  const tailCount = maxItems - 2;
  const hidden = items.slice(1, trail.length - tailCount);
  const tail = trail.slice(trail.length - tailCount);

  return hidden.length > 0
    ? [trail[0], { kind: "ellipsis", hidden }, ...tail]
    : [trail[0], ...tail];
}

function currentIndex(items: BreadcrumbItemData[]): number {
  const explicit = items.findIndex((item) => item.current === true);
  return explicit >= 0 ? explicit : items.length - 1;
}

function BreadcrumbItems({
  items,
  maxItems,
  separator,
}: {
  items: BreadcrumbItemData[];
  maxItems?: number;
  separator: ReactNode;
}) {
  const entries = collapseItems(items, maxItems);
  const active = currentIndex(items);

  return (
    <BreadcrumbList>
      {entries.map((entry, position) => (
        <Fragment
          key={entry.kind === "ellipsis" ? "ellipsis" : String(entry.item.key ?? entry.index)}
        >
          {position > 0 ? <BreadcrumbSeparator>{separator}</BreadcrumbSeparator> : null}
          {entry.kind === "ellipsis" ? (
            <BreadcrumbEllipsis hidden={entry.hidden} />
          ) : (
            <BreadcrumbItem>
              {entry.index === active ? (
                <BreadcrumbPage>{entry.item.label}</BreadcrumbPage>
              ) : entry.item.href !== undefined ? (
                <BreadcrumbLink
                  href={entry.item.href}
                  target={entry.item.target}
                  rel={entry.item.rel}
                  onClick={entry.item.onClick}
                >
                  {entry.item.label}
                </BreadcrumbLink>
              ) : (
                <span
                  className={cn(itemStyles, "text-lark-title")}
                  title={labelText(entry.item.label)}
                >
                  {entry.item.label}
                </span>
              )}
            </BreadcrumbItem>
          )}
        </Fragment>
      ))}
    </BreadcrumbList>
  );
}

/**
 * Shows where the current page sits in a hierarchy and lets people walk back up.
 * Pass `items` for the data-driven API or compose the parts as children.
 */
export function Breadcrumb({
  label,
  items,
  maxItems,
  separator = <ChevronRightIcon size={16} />,
  className,
  children,
  "aria-label": ariaLabel,
  ...props
}: BreadcrumbProps) {
  return (
    <nav
      {...props}
      aria-label={ariaLabel ?? label ?? "面包屑"}
      className={cn("text-lark-14 text-lark-title", className)}
    >
      {items ? (
        <BreadcrumbItems items={items} maxItems={maxItems} separator={separator} />
      ) : (
        children
      )}
    </nav>
  );
}
