import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import type { TabsTab } from "@base-ui/react/tabs";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "../../utils/cn";

/** Tabs variant definitions. */
export const LARK_TABS_VARIANTS = {
  variant: ["segmented", "underline"],
  size: ["base", "sm"],
} as const;

export const LARK_TABS_DEFAULT_VARIANTS = {
  variant: "segmented",
  size: "base",
} as const;

export const LARK_TABS_STYLING = {
  container: {
    height: 32,
    borderRadius: 8,
    background: "color-accent",
    padding: 1,
  },
  tab: {
    paddingX: 10,
    verticalMargin: 1,
    fontSize: 14,
    fontWeight: 500,
    borderRadius: 8,
    activeColor: "text-color-brand",
    inactiveColor: "text-color-label",
  },
  indicator: {
    background: "color-surface-secondary",
    ring: "color-color-2",
    borderRadius: 6,
    shadow: "shadow-lark-xs",
  },
  /** Feishu line tabs: the active tab and its hover state use the brand colour. */
  underline: {
    activeColor: "text-color-brand",
    inactiveColor: "text-color-title",
    indicatorHeight: 2,
    indicatorColor: "color-brand",
    paddingY: 8,
  },
} as const;

/** Labels for internationalization of Tabs component. */
export interface TabsLabels {
  /** Aria label for the button that scrolls to earlier tabs. @default "Scroll tabs left" */
  scrollStart?: string;
  /** Aria label for the button that scrolls to later tabs. @default "Scroll tabs right" */
  scrollEnd?: string;
}

const DEFAULT_LABELS: Required<TabsLabels> = {
  scrollStart: "Scroll tabs left",
  scrollEnd: "Scroll tabs right",
};

// Derived types from LARK_TABS_VARIANTS
export interface LarkTabsVariantsProps {
  /**
   * Tab style.
   * - `"segmented"` — Pill-shaped indicator on a filled track
   * - `"underline"` — Underline indicator below tab text
   * @default "segmented"
   */
  variant?: (typeof LARK_TABS_VARIANTS.variant)[number];
  /**
   * Tab size.
   * - `"base"` — Default size (h-8, text-base)
   * - `"sm"` — Compact size (h-6, text-xs) — matches Input size="sm"
   * @default "base"
   */
  size?: (typeof LARK_TABS_VARIANTS.size)[number];
}

/** Configuration for a single tab within the Tabs component. */
export type TabsItem = {
  /** Unique identifier for the tab, used as the controlled value. */
  value: string;
  /** Display content for the tab trigger. */
  label: ReactNode;
  /** Additional CSS classes for this tab trigger. */
  className?: string;
  /**
   * Custom render function or element to replace the tab element (e.g. for link-based tabs).
   * When using a function, it receives the props to spread on the element and the tab's state.
   */
  render?: TabsTab.Props["render"];
  /**
   * Whether the rendered tab is a native button. Set to `false` when `render` produces a non-button element, such as a link.
   * @default true
   */
  nativeButton?: TabsTab.Props["nativeButton"];
};

/**
 * Tabs component props.
 *
 * @example
 * ```tsx
 * <Tabs
 *   tabs={[
 *     { value: "overview", label: "Overview" },
 *     { value: "settings", label: "Settings" },
 *   ]}
 *   value={activeTab}
 *   onValueChange={setActiveTab}
 * />
 * ```
 */
export type TabsProps = LarkTabsVariantsProps & {
  /** Array of tab items to render. */
  tabs?: TabsItem[];
  /** Controlled value. When set, component becomes controlled. */
  value?: string;
  /** Default selected value for uncontrolled mode. Ignored when `value` is set. */
  selectedValue?: string;
  /** Callback fired when the active tab changes. */
  onValueChange?: (value: string) => void;
  /**
   * When `true`, tabs are activated immediately upon receiving focus via arrow keys.
   * When `false` (default), tabs receive focus but require Enter/Space to activate.
   */
  activateOnFocus?: boolean;
  /** Additional CSS classes for the root element. */
  className?: string;
  /** Additional CSS classes for the tab list element. */
  listClassName?: string;
  /** Additional CSS classes for the indicator element. */
  indicatorClassName?: string;
  /** Labels for internationalization of aria-labels. All labels have English defaults. */
  labels?: TabsLabels;
  /**
   * Segmented tabs share the track equally and stretch to the parent width
   * instead of hugging their labels. Use it for form rows, popovers and
   * toolbars where the control has a fixed width to fill.
   *
   * Long labels keep their intrinsic width (flex items never shrink below
   * their content) and the list scrolls horizontally instead of squashing.
   * Has no effect on `variant="underline"`.
   * @default false
   */
  fill?: boolean;
};

/**
 * Tab navigation component with segmented or underline style.
 * Built on Base UI Tabs with animated active indicator.
 *
 * @example
 * ```tsx
 * <Tabs
 *   variant="segmented"
 *   tabs={[{ value: "tab1", label: "Tab 1" }, { value: "tab2", label: "Tab 2" }]}
 *   value={active}
 *   onValueChange={setActive}
 * />
 * ```
 */
export function Tabs({
  tabs,
  value,
  selectedValue,
  onValueChange,
  activateOnFocus,
  className,
  listClassName,
  indicatorClassName,
  labels: labelsProp,
  variant = LARK_TABS_DEFAULT_VARIANTS.variant,
  size = LARK_TABS_DEFAULT_VARIANTS.size,
  fill = false,
}: TabsProps) {
  const items: TabsItem[] = tabs ?? [];

  if (items.length === 0) {
    return null;
  }

  const fallbackValue = items[0]?.value;
  const isControlled = value !== undefined;
  const rootProps = {
    value: isControlled ? value : undefined,
    defaultValue: isControlled ? undefined : (selectedValue ?? fallbackValue),
  };

  const isSegmented = variant === "segmented";
  const isUnderline = variant === "underline";
  const isSm = size === "sm";
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const overflowWatchKey = items.map((item) => item.value).join("|");
  const {
    ref: listRef,
    isOverflowing,
    canScrollStart,
    canScrollEnd,
  } = useOverflowDetect(true, overflowWatchKey);
  const bindDrag = useHorizontalDragScroll(listRef, isOverflowing);

  return (
    <TabsPrimitive.Root
      {...rootProps}
      className={cn(
        "relative isolate min-w-0 font-medium",
        isSegmented &&
          (isSm ? "rounded-md" : "rounded-lg") + " ring ring-lark-hairline/70",
        // A segmented group is a control, not a layout band: by default the
        // track hugs its labels. Leaving it block-level made the track span the
        // parent and paint a dead grey rail after the last tab, which reads as
        // a broken control. `fill` opts into the full-width track instead — and
        // then the tabs share it equally (see the tab classes below).
        isSegmented && (fill ? "w-full" : "w-fit max-w-full"),
        className,
      )}
      onValueChange={(nextValue) => {
        const stringValue = String(nextValue);
        onValueChange?.(stringValue);
      }}
    >
      <TabsPrimitive.List
        ref={listRef}
        activateOnFocus={activateOnFocus}
        data-overflowing={isOverflowing ? "" : undefined}
        data-overflow-start={canScrollStart ? "" : undefined}
        data-overflow-end={canScrollEnd ? "" : undefined}
        {...bindDrag()}
        className={cn(
          "lark-tabs-list relative flex min-w-0 shrink scroll-px-(--scroll-fade-width) items-stretch overflow-x-auto overflow-y-hidden [--scroll-fade-width:3rem]",
          isSegmented && "rounded-lg bg-lark-control px-0.5",
          isSegmented && (isSm ? "h-6 rounded-md" : "h-8"),
          isOverflowing && "cursor-grab active:cursor-grabbing",
          // Feishu line tabs: 1px divider under the bar, tabs carry their own
          // vertical padding so the bar sizes to the content.
          isUnderline && "gap-4 border-b border-lark-line",
          listClassName,
        )}
      >
        {items.map((tab) => (
          <TabsPrimitive.Tab
            key={tab.value}
            data-lark-component="Tabs"
            data-lark-part="tab"
            value={tab.value}
            render={tab.render}
            nativeButton={tab.nativeButton}
            onClick={(e) => {
              e.currentTarget.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "nearest",
              });
            }}
            className={cn(
              // Feishu tabs drop the focus outline entirely — the hovered /
              // selected state doubles as the focus indicator.
              "relative z-2 flex items-center rounded bg-transparent whitespace-nowrap transition-colors duration-100 ease-linear focus:outline-none focus-visible:outline-none",
              isOverflowing
                ? "cursor-grab active:cursor-grabbing"
                : "cursor-pointer",
              isSm ? "text-xs" : "text-base",
              // Segmented tabs: inactive tabs use the subtle label colour, the
              // selected pill keeps the default text colour.
              isSegmented &&
                "my-0.5 text-lark-subtle hover:text-lark-default focus-visible:text-lark-default aria-selected:text-lark-default",
              isSegmented && (isSm ? "rounded-sm px-2" : "rounded-md px-2.5"),
              // `fill`: every segment takes an equal share of the full-width
              // track. The label stays centred inside its share.
              isSegmented && fill && "flex-1 justify-center",
              // Feishu line tabs: the active tab and its hover state are brand
              // blue, there is no hover background.
              isUnderline &&
                "text-lark-default hover:text-lark-brand focus-visible:text-lark-brand aria-selected:text-lark-brand",
              isUnderline && (isSm ? "px-1.5 py-1.5" : "px-2 py-2"),
              tab.className,
            )}
          >
            {tab.label}
          </TabsPrimitive.Tab>
        ))}
        <TabsPrimitive.Indicator
          render={(props) => (
            <div
              {...props}
              className={cn(
                "absolute left-0 z-1",
                "w-(--active-tab-width) translate-x-(--active-tab-left) transition-[transform,width] duration-200",
                isSegmented &&
                  cn(
                    "top-(--active-tab-top) h-(--active-tab-height) bg-lark-base shadow-lark-xs ring ring-lark-line",
                    isSm ? "rounded" : "rounded-md",
                  ),
                isUnderline && "bottom-0 h-0.5 bg-lark-brand",
                indicatorClassName,
              )}
            />
          )}
        />
      </TabsPrimitive.List>
      {isSegmented && (
        <>
          <TabsOverflowControl
            side="start"
            visible={canScrollStart}
            variant={variant}
            size={size}
            label={labels.scrollStart}
            onClick={() => scrollTabs(listRef, "start")}
          />
          <TabsOverflowControl
            side="end"
            visible={canScrollEnd}
            variant={variant}
            size={size}
            label={labels.scrollEnd}
            onClick={() => scrollTabs(listRef, "end")}
          />
        </>
      )}
    </TabsPrimitive.Root>
  );
}

function TabsOverflowControl({
  side,
  visible,
  variant,
  size,
  label,
  onClick,
}: {
  side: "start" | "end";
  visible: boolean;
  variant: NonNullable<TabsProps["variant"]>;
  size: NonNullable<TabsProps["size"]>;
  label: string;
  onClick: () => void;
}) {
  const isStart = side === "start";
  const isSegmented = variant === "segmented";

  return (
    <button
      type="button"
      data-lark-component="Tabs"
      data-lark-part="overflow-control"
      data-side={side}
      aria-label={label}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={onClick}
      className={cn(
        "absolute inset-y-0 z-3 flex items-center border-0 bg-transparent p-0 transition-opacity duration-150 focus:outline-none focus-visible:[&>span]:text-lark-brand",
        isStart
          ? "left-0 justify-start bg-linear-to-r"
          : "right-0 justify-end bg-linear-to-l",
        visible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
        isSegmented
          ? "from-lark-control via-lark-control/95 to-transparent"
          : "from-lark-base via-lark-base/95 to-transparent",
        isSegmented && (size === "sm" ? "w-8 rounded-md" : "w-10 rounded-lg"),
        !isSegmented && "w-8",
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center text-lark-subtle transition-colors hover:text-lark-brand",
          size === "sm" ? "size-5" : "size-6",
          isSegmented
            ? size === "sm"
              ? "rounded-sm"
              : "rounded-md"
            : "rounded",
          isStart ? "ml-1" : "mr-1",
        )}
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className="size-3.5"
          aria-hidden="true"
        >
          <path
            d={
              isStart
                ? "M9.25 4.25L5.75 8L9.25 11.75"
                : "M6.75 4.25L10.25 8L6.75 11.75"
            }
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </span>
    </button>
  );
}

function scrollTabs(
  ref: React.RefObject<HTMLElement | null>,
  direction: "start" | "end",
) {
  const el = ref.current;
  if (!el) return;

  const tabEls = Array.from(
    el.querySelectorAll<HTMLElement>('[data-lark-part="tab"]'),
  );
  const distance = getTabsScrollSize(el.clientWidth, tabEls);

  el.scrollBy({
    left: direction === "start" ? -distance : distance,
    behavior: "smooth",
  });
}

function getTabsScrollSize(containerWidth: number, tabs: HTMLElement[]) {
  let totalWidth = 0;

  for (const tab of tabs) {
    const tabWidth = tab.offsetWidth;
    if (totalWidth + tabWidth > containerWidth) {
      return totalWidth || containerWidth;
    }
    totalWidth += tabWidth;
  }

  return Math.max(80, Math.floor(containerWidth * 0.8));
}

// ─── Horizontal drag-to-scroll ────────────────────────────────────────

/**
 * Enables mouse drag to horizontally scroll the tab list.
 * Touch devices keep native horizontal overflow scrolling and inertia.
 */
function useHorizontalDragScroll(
  ref: React.RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const dragState = useRef<{
    pointerId: number;
    startX: number;
    scrollLeft: number;
    dragging: boolean;
  } | null>(null);
  const shouldSuppressClick = useRef(false);

  return () => ({
    onPointerDownCapture: (event: PointerEvent<HTMLElement>) => {
      const el = ref.current;
      if (!el || !enabled) return;
      if (event.pointerType !== "mouse" || event.button !== 0) return;

      dragState.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        scrollLeft: el.scrollLeft,
        dragging: false,
      };
      shouldSuppressClick.current = false;
    },
    onPointerMoveCapture: (event: PointerEvent<HTMLElement>) => {
      const el = ref.current;
      const state = dragState.current;
      if (!el || !enabled || !state || state.pointerId !== event.pointerId)
        return;

      const movementX = event.clientX - state.startX;
      if (!state.dragging) {
        if (Math.abs(movementX) <= 3) return;
        state.dragging = true;
        shouldSuppressClick.current = true;
        el.setPointerCapture(event.pointerId);
      }

      event.preventDefault();
      el.scrollLeft = state.scrollLeft - movementX;
    },
    onPointerUpCapture: (event: PointerEvent<HTMLElement>) => {
      const el = ref.current;
      const state = dragState.current;
      if (!el || !state || state.pointerId !== event.pointerId) return;

      dragState.current = null;
      if (el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId);
      }
      if (shouldSuppressClick.current) {
        window.setTimeout(() => {
          shouldSuppressClick.current = false;
        }, 0);
      }
    },
    onPointerCancelCapture: (event: PointerEvent<HTMLElement>) => {
      const el = ref.current;
      const state = dragState.current;
      if (!el || !state || state.pointerId !== event.pointerId) return;

      dragState.current = null;
      if (el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId);
      }
    },
    onClickCapture: (event: MouseEvent<HTMLElement>) => {
      if (!shouldSuppressClick.current) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      shouldSuppressClick.current = false;
    },
  });
}

// ─── Overflow detection ───────────────────────────────────────────────

/**
 * Detects whether the element's content overflows horizontally.
 * Returns a ref to attach and a boolean for conditional rendering.
 * The `data-overflowing` attribute drives the scroll-fade CSS.
 */
function useOverflowDetect(enabled: boolean, watchKey: string) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflowState, setOverflowState] = useState({
    isOverflowing: false,
    canScrollStart: false,
    canScrollEnd: false,
  });

  useLayoutEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    setOverflowState((prevState) => getNextOverflowState(el, prevState));
  }, [enabled, watchKey]);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const check = () => {
      setOverflowState((prevState) => getNextOverflowState(el, prevState));
    };

    const ro = new ResizeObserver(check);
    ro.observe(el);
    const mo = new MutationObserver(check);
    mo.observe(el, { childList: true, characterData: true, subtree: true });
    el.addEventListener("scroll", check, { passive: true });
    check();

    return () => {
      ro.disconnect();
      mo.disconnect();
      el.removeEventListener("scroll", check);
    };
  }, [enabled]);

  return { ref, ...overflowState };
}

function getNextOverflowState(
  el: HTMLElement,
  prevState: {
    isOverflowing: boolean;
    canScrollStart: boolean;
    canScrollEnd: boolean;
  },
) {
  const maxScrollLeft = Math.max(0, el.scrollWidth - el.clientWidth);
  const scrollLeft = Math.min(Math.max(0, el.scrollLeft), maxScrollLeft);
  const nextState = {
    isOverflowing: maxScrollLeft > 1,
    canScrollStart: scrollLeft > 1,
    canScrollEnd: maxScrollLeft - scrollLeft > 1,
  };

  return prevState.isOverflowing === nextState.isOverflowing &&
    prevState.canScrollStart === nextState.canScrollStart &&
    prevState.canScrollEnd === nextState.canScrollEnd
    ? prevState
    : nextState;
}
