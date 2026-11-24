import {
  type ComponentProps,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../../lib/cn";

export type AnchorDirection = "vertical" | "horizontal";
export type AnchorVariant = "line" | "simple";

/**
 * One anchor entry. Entries with `children` render a nested level, indented by
 * 16px as in the UD client.
 */
export type AnchorItem = {
  /** Identifies the entry for `activeKey` and `onChange`. */
  key: string;
  /** The section to jump to. In-page targets use a hash such as `#overview`. */
  href: string;
  title: ReactNode;
  /** Nested entries, for pages whose modules have a hierarchy. */
  children?: AnchorItem[];
};

type AnchorInk = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type AnchorProps = Omit<ComponentProps<"nav">, "children" | "onChange"> & {
  /** The modules of the page, in document order. */
  items: AnchorItem[];
  /** Controlled active key. */
  activeKey?: string;
  /** Initially active key. Defaults to the first entry. */
  defaultActiveKey?: string;
  /** Runs when an entry is chosen or the scroll spy moves to another section. */
  onChange?: (key: string) => void;
  /**
   * Returns the scrolling element that holds the sections. Return `null` to spy
   * on the whole page.
   */
  getContainer?: () => HTMLElement | null;
  /** Distance kept above the target and used as the scroll-spy line. Defaults to 0. */
  offsetTop?: number;
  /** Scroll animation used when an entry is chosen. Defaults to `smooth`. */
  behavior?: ScrollBehavior;
  /** Layout direction. Defaults to `vertical`. */
  direction?: AnchorDirection;
  /**
   * `line` draws the UD positioning rail and ink. `simple` only changes the
   * text colour, for article tables of contents.
   */
  variant?: AnchorVariant;
  /** Keeps the anchor in place while the page scrolls, the UD 常规型. */
  sticky?: boolean;
  /** Offset of the sticky anchor. Defaults to 0. */
  stickyTop?: number;
  /** Pins the anchor to the viewport. Position it with `className` / `style`. */
  fixed?: boolean;
  /** Accessible name of the navigation landmark. Defaults to `锚点`. */
  label?: string;
  style?: CSSProperties;
};

function sectionId(href: string): string | undefined {
  if (!href.startsWith("#") || href.length < 2) {
    return undefined;
  }
  try {
    return decodeURIComponent(href.slice(1));
  } catch {
    return href.slice(1);
  }
}

function flattenItems(items: AnchorItem[]): AnchorItem[] {
  return items.flatMap((item) => [
    item,
    ...(item.children !== undefined ? flattenItems(item.children) : []),
  ]);
}

function scrollToSection(
  target: HTMLElement,
  container: HTMLElement | null,
  offsetTop: number,
  behavior: ScrollBehavior,
) {
  if (container !== null) {
    const top =
      target.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop -
      offsetTop;
    container.scrollTo({ top: Math.max(0, top), behavior });
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - offsetTop;
  window.scrollTo({ top: Math.max(0, top), behavior });
}

/**
 * In-page navigation for long, sectioned content. Follows the UD anchor: 14px
 * captions, a 200px rail, a 2px primary ink for the current section, nested
 * levels at 16px, and an IntersectionObserver scroll spy.
 */
export function Anchor({
  items,
  activeKey,
  defaultActiveKey,
  onChange,
  getContainer,
  offsetTop = 0,
  behavior = "smooth",
  direction = "vertical",
  variant = "line",
  sticky = false,
  stickyTop = 0,
  fixed = false,
  label,
  className,
  style,
  "aria-label": ariaLabel,
  ...props
}: AnchorProps) {
  const [uncontrolledKey, setUncontrolledKey] = useState<string | undefined>(
    () => defaultActiveKey ?? items[0]?.key,
  );
  const currentKey = activeKey ?? uncontrolledKey;

  const listRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());
  const [ink, setInk] = useState<AnchorInk | null>(null);

  const onChangeRef = useRef(onChange);
  const getContainerRef = useRef(getContainer);
  const activeKeyRef = useRef(activeKey);
  const lastActiveRef = useRef(currentKey);
  const suppressUntilRef = useRef(0);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    getContainerRef.current = getContainer;
  }, [getContainer]);

  useEffect(() => {
    activeKeyRef.current = activeKey;
    lastActiveRef.current = currentKey;
  }, [activeKey, currentKey]);

  // Scroll spy. The observer is the trigger; the active section is the last one
  // whose top has crossed the offset line inside the scrolling container.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const container = getContainerRef.current?.() ?? null;
    const branches = flattenItems(items).flatMap((item) => {
      const id = sectionId(item.href);
      if (id === undefined) {
        return [];
      }
      const element = document.getElementById(id);
      return element === null ? [] : [{ key: item.key, element }];
    });

    if (branches.length === 0) {
      return;
    }

    const sync = () => {
      if (Date.now() < suppressUntilRef.current) {
        return;
      }

      const scroller = getContainerRef.current?.() ?? container;
      const rootTop = scroller === null ? 0 : scroller.getBoundingClientRect().top;
      let next: string | undefined;

      // A final section shorter than the viewport never crosses the line, so
      // the last entry would stay unreachable. At the end of the scroll range
      // the last section is the one being read.
      const scrollRoot =
        scroller ?? (document.scrollingElement as HTMLElement | null) ?? document.documentElement;
      const scrollable = scrollRoot.scrollHeight > scrollRoot.clientHeight + 1;
      const atBottom =
        scrollRoot.scrollTop + scrollRoot.clientHeight >= scrollRoot.scrollHeight - 1;

      if (atBottom && scrollable) {
        next = branches[branches.length - 1]?.key;
      } else {
        for (const branch of branches) {
          if (branch.element.getBoundingClientRect().top - rootTop <= offsetTop + 1) {
            next = branch.key;
          }
        }
      }

      next ??= branches[0]?.key;
      if (next === undefined || next === lastActiveRef.current) {
        return;
      }

      lastActiveRef.current = next;
      if (activeKeyRef.current === undefined) {
        setUncontrolledKey(next);
      }
      onChangeRef.current?.(next);
    };

    const observer = new IntersectionObserver(sync, {
      root: container,
      rootMargin: `-${offsetTop}px 0px 0px 0px`,
      threshold: [0, 0.01, 0.5, 1],
    });

    for (const branch of branches) {
      observer.observe(branch.element);
    }

    return () => observer.disconnect();
  }, [items, offsetTop]);

  const measure = useCallback(() => {
    const link = currentKey === undefined ? undefined : linkRefs.current.get(currentKey);
    if (link === undefined) {
      setInk(null);
      return;
    }

    setInk({
      top: link.offsetTop,
      left: link.offsetLeft,
      width: link.offsetWidth,
      height: link.offsetHeight,
    });
  }, [currentKey]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    if (typeof ResizeObserver === "undefined") {
      return;
    }
    const list = listRef.current;
    if (list === null) {
      return;
    }

    const observer = new ResizeObserver(() => measure());
    observer.observe(list);
    return () => observer.disconnect();
  }, [measure]);

  const commit = useCallback(
    (key: string) => {
      lastActiveRef.current = key;
      if (activeKey === undefined) {
        setUncontrolledKey(key);
      }
      onChangeRef.current?.(key);
    },
    [activeKey],
  );

  const handleNavigate = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>, item: AnchorItem) => {
      const id = sectionId(item.href);
      if (id !== undefined) {
        const target = document.getElementById(id);
        if (target !== null) {
          event.preventDefault();
          suppressUntilRef.current = Date.now() + 600;
          scrollToSection(target, getContainerRef.current?.() ?? null, offsetTop, behavior);
        }
      }
      commit(item.key);
    },
    [behavior, commit, offsetTop],
  );

  const renderItems = (entries: AnchorItem[], level: number): ReactNode =>
    entries.map((item) => {
      const active = item.key === currentKey;
      return (
        <li
          key={item.key}
          className={cn("m-0 min-w-0 p-0", direction === "vertical" && level > 0 && "pl-4")}
        >
          <a
            ref={(node) => {
              if (node === null) {
                linkRefs.current.delete(item.key);
              } else {
                linkRefs.current.set(item.key, node);
              }
            }}
            href={item.href}
            aria-current={active ? "location" : undefined}
            data-active={active ? "" : undefined}
            onClick={(event) => handleNavigate(event, item)}
            className={cn(
              "box-border block w-full truncate rounded-sm text-lark-14 text-lark-caption no-underline",
              "py-px transition-colors duration-100 ease-lark-linear",
              "hover:text-lark-primary-content",
              "active:text-[var(--lark-primary-content-pressed)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
              "data-[active]:text-lark-primary-content",
              direction === "horizontal" && "max-w-[320px]",
            )}
          >
            {item.title}
          </a>
          {item.children !== undefined && item.children.length > 0 ? (
            <ul
              className={cn(
                "m-0 flex list-none gap-3.5 p-0",
                direction === "vertical" ? "mt-3.5 flex-col" : "mt-2 flex-row gap-6",
              )}
            >
              {renderItems(item.children, level + 1)}
            </ul>
          ) : null}
        </li>
      );
    });

  const showLine = variant === "line";

  return (
    <nav
      {...props}
      aria-label={ariaLabel ?? label ?? "锚点"}
      data-direction={direction}
      data-variant={variant}
      data-fixed={fixed ? "" : undefined}
      data-sticky={sticky ? "" : undefined}
      className={cn(
        "box-border text-lark-14 text-lark-title",
        direction === "vertical" ? "w-[200px] max-w-[400px]" : "w-auto max-w-full",
        showLine && direction === "horizontal" && "pb-2",
        sticky && !fixed && "sticky z-10",
        fixed && "fixed z-10",
        className,
      )}
      style={sticky && !fixed ? { top: stickyTop, ...style } : style}
    >
      <ul
        ref={listRef}
        className={cn(
          "relative m-0 flex list-none p-0",
          direction === "vertical" ? "flex-col gap-3.5" : "flex-row items-center gap-6",
          // The 18px gutter holds the rail; it belongs to the list, not the
          // nav, so the absolutely positioned rail can sit before the titles
          // instead of underneath the first two pixels of their text.
          showLine && direction === "vertical" && "pl-[18px]",
        )}
      >
        {showLine ? (
          <span
            aria-hidden="true"
            data-slot="anchor-rail"
            className={cn(
              "pointer-events-none absolute rounded-full bg-lark-border-card",
              direction === "vertical"
                ? "left-0 top-0 h-full w-0.5"
                : "bottom-0 left-0 h-0.5 w-full",
            )}
          />
        ) : null}
        {showLine && ink !== null ? (
          <span
            aria-hidden="true"
            data-slot="anchor-ink"
            data-visible=""
            className={cn(
              "pointer-events-none absolute rounded-full bg-lark-primary-content",
              "transition-[top,height,left,width] duration-300 ease-[cubic-bezier(.34,.69,.1,1)]",
              direction === "vertical" ? "left-0 w-0.5" : "bottom-0 h-0.5",
            )}
            style={
              direction === "vertical"
                ? { top: ink.top, height: ink.height }
                : { left: ink.left, width: ink.width }
            }
          />
        ) : null}
        {renderItems(items, 0)}
      </ul>
    </nav>
  );
}
