import {
  Tabs as UiTabs,
  TabsIndicator as UiTabsIndicator,
  TabsList as UiTabsList,
  TabsPanel as UiTabsPanel,
  TabsTab as UiTabsTab,
} from "@ui-sdk/react/tabs";
import { type ComponentProps, createContext, useContext } from "react";
import { cn } from "../../lib/cn";

export type TabsVariant = "line" | "capsule" | "card";
export type TabsSize = "sm" | "md" | "lg";

type TabsStyleContextValue = {
  variant: TabsVariant;
  size: TabsSize;
};

const TabsStyleContext = createContext<TabsStyleContextValue>({
  variant: "line",
  size: "md",
});

export type TabsProps = ComponentProps<typeof UiTabs> & {
  variant?: TabsVariant;
  size?: TabsSize;
};

export function Tabs({ variant = "line", size = "md", className, ...props }: TabsProps) {
  return (
    <TabsStyleContext.Provider value={{ variant, size }}>
      <UiTabs
        {...props}
        data-variant={variant}
        data-size={size}
        className={cn("flex min-w-0 flex-col", className)}
      />
    </TabsStyleContext.Provider>
  );
}

const lineText: Record<TabsSize, string> = {
  sm: "text-lark-12",
  md: "text-lark-14",
  lg: "text-lark-16",
};

const capsuleText: Record<TabsSize, string> = {
  sm: "h-6 px-2.5 text-lark-12",
  md: "h-7 px-3 text-lark-14",
  lg: "h-8 px-3.5 text-lark-16",
};

export type TabsListProps = ComponentProps<typeof UiTabsList>;

export function TabsList({ className, children, ...props }: TabsListProps) {
  const { variant } = useContext(TabsStyleContext);

  return (
    <UiTabsList
      {...props}
      className={(state) =>
        cn(
          "relative flex min-w-0 items-center",
          variant === "line" &&
            "gap-6 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-0 after:h-px after:bg-lark-divider",
          variant === "capsule" && "gap-2",
          variant === "card" &&
            "gap-1 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-0 after:h-px after:bg-lark-border-card",
          typeof className === "function" ? className(state) : className,
        )
      }
    >
      {(state) => (
        <>
          {typeof children === "function" ? children(state) : children}
          {variant === "line" ? (
            <UiTabsIndicator className="pointer-events-none absolute bottom-0 left-[var(--active-tab-left)] z-10 h-0.5 w-[var(--active-tab-width)] bg-lark-primary-content transition-[left,width] duration-300 ease-lark data-[activation-direction=none]:transition-none" />
          ) : null}
        </>
      )}
    </UiTabsList>
  );
}

export type TabsTabProps = ComponentProps<typeof UiTabsTab>;

export function TabsTab({ className, ...props }: TabsTabProps) {
  const { variant, size } = useContext(TabsStyleContext);

  return (
    <UiTabsTab
      {...props}
      className={(state) =>
        cn(
          "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap",
          "border-0 bg-transparent transition-colors duration-100 ease-lark-linear",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
          "data-[disabled]:cursor-not-allowed",
          variant === "line" && [
            "h-10",
            lineText[size],
            "text-lark-title hover:text-lark-primary-content",
            "data-[selected]:text-lark-primary-content",
            "data-[disabled]:text-lark-disabled",
          ],
          variant === "capsule" && [
            capsuleText[size],
            "rounded-lark-md bg-[var(--lark-fill-tag)] text-lark-title",
            "hover:text-lark-primary-content dark:hover:text-lark-blue-300",
            "data-[selected]:bg-lark-primary-soft data-[selected]:text-lark-primary-content dark:data-[selected]:text-lark-blue-300",
            "data-[disabled]:text-lark-neutral-500 data-[disabled]:hover:text-lark-neutral-500",
          ],
          variant === "card" && [
            "h-10 rounded-t-lark-md border border-transparent px-4 text-lark-14",
            "text-lark-title hover:text-lark-primary-content",
            "data-[selected]:z-10 data-[selected]:border-lark-border-card data-[selected]:border-b-transparent",
            "data-[selected]:bg-lark-base data-[selected]:text-lark-primary-content",
            "data-[disabled]:text-lark-disabled",
          ],
          typeof className === "function" ? className(state) : className,
        )
      }
    />
  );
}

export type TabsPanelProps = ComponentProps<typeof UiTabsPanel>;

export function TabsPanel({ className, ...props }: TabsPanelProps) {
  const { variant } = useContext(TabsStyleContext);

  return (
    <UiTabsPanel
      {...props}
      className={(state) =>
        cn(
          "min-h-0 outline-none",
          variant === "line" ? "pt-3" : "pt-2",
          variant === "card" && "rounded-b-lark-md bg-lark-base p-4",
          typeof className === "function" ? className(state) : className,
        )
      }
    />
  );
}

export { UiTabsIndicator as TabsIndicator };
