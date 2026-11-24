import {
  Accordion as UiAccordion,
  AccordionHeader as UiAccordionHeader,
  AccordionItem as UiAccordionItem,
  AccordionPanel as UiAccordionPanel,
  AccordionTrigger as UiAccordionTrigger,
} from "@ui-sdk/react/accordion";
import {
  type ComponentProps,
  createContext,
  type MouseEvent,
  type ReactNode,
  useContext,
  useRef,
} from "react";
import { ChevronDownIcon } from "../../icons";
import { cn } from "../../lib/cn";

export type CollapseIconPosition = "left" | "right";

type CollapseContextValue = {
  iconPosition: CollapseIconPosition;
  bordered: boolean;
};

const CollapseContext = createContext<CollapseContextValue>({
  iconPosition: "right",
  bordered: true,
});

type UiAccordionProps = ComponentProps<typeof UiAccordion>;

export type CollapseProps = Omit<UiAccordionProps, "multiple" | "className"> & {
  /**
   * Whether several panels may stay open. UD's basic collapse defaults to
   * multiple; pass `false` for the accordion (single panel) behaviour.
   */
  multiple?: boolean;
  /** 1px N900*15% dividers between items. */
  bordered?: boolean;
  /**
   * UD line arrow position. Right (default) uses a down/up chevron; left uses
   * the filled-arrow pattern, pointing right while closed and down while open.
   */
  iconPosition?: CollapseIconPosition;
  className?: string;
};

export function Collapse({
  multiple = true,
  bordered = true,
  iconPosition = "right",
  className,
  ...props
}: CollapseProps) {
  return (
    <CollapseContext.Provider value={{ iconPosition, bordered }}>
      <UiAccordion
        {...props}
        multiple={multiple}
        data-bordered={bordered ? "" : undefined}
        data-icon-position={iconPosition}
        className={cn(
          "box-border w-full bg-lark-canvas text-lark-14 leading-[22px] text-lark-title",
          className,
        )}
      />
    </CollapseContext.Provider>
  );
}

type UiAccordionHeaderProps = ComponentProps<typeof UiAccordionHeader>;

export type CollapseHeaderProps = UiAccordionHeaderProps;

export function CollapseHeader({ className, ...props }: CollapseHeaderProps) {
  return (
    <UiAccordionHeader
      {...props}
      className={(state) =>
        cn(
          "group/collapse-header relative flex min-w-0 cursor-pointer items-center",
          "data-[disabled]:cursor-not-allowed",
          typeof className === "function" ? className(state) : className,
        )
      }
    />
  );
}

type UiAccordionTriggerProps = ComponentProps<typeof UiAccordionTrigger>;

export type CollapseTriggerProps = UiAccordionTriggerProps;

export function CollapseTrigger({ className, ...props }: CollapseTriggerProps) {
  return (
    <UiAccordionTrigger
      {...props}
      className={(state) =>
        cn(
          "group/collapse-trigger flex min-h-10 min-w-0 flex-1 cursor-pointer items-center gap-2",
          "border-0 bg-transparent py-2 pl-2 pr-2 text-left text-lark-14 leading-[22px] text-lark-title",
          "transition-colors duration-100 ease-lark-linear",
          "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-lark-primary",
          "data-[disabled]:cursor-not-allowed data-[disabled]:text-lark-disabled",
          typeof className === "function" ? className(state) : className,
        )
      }
    />
  );
}

type UiAccordionPanelProps = ComponentProps<typeof UiAccordionPanel>;

export type CollapsePanelProps = UiAccordionPanelProps;

export function CollapsePanel({ className, children, ...props }: CollapsePanelProps) {
  const { iconPosition } = useContext(CollapseContext);

  return (
    <UiAccordionPanel
      {...props}
      className={(state) =>
        cn(
          "h-[var(--accordion-panel-height)] overflow-hidden text-lark-14 leading-[22px] text-lark-title",
          "transition-[height,opacity] duration-200 ease-lark motion-reduce:transition-none",
          "data-[starting-style]:h-0 data-[ending-style]:h-0",
          "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
          typeof className === "function" ? className(state) : className,
        )
      }
    >
      {(state) => (
        <div className={cn("py-2", iconPosition === "left" ? "ps-6 pe-2" : "px-2")}>
          {typeof children === "function" ? children(state) : children}
        </div>
      )}
    </UiAccordionPanel>
  );
}

type UiAccordionItemProps = ComponentProps<typeof UiAccordionItem>;

export type CollapseItemProps = Omit<UiAccordionItemProps, "children" | "className"> & {
  /** Header text. Omit it to compose `CollapseHeader`, `CollapseTrigger` and `CollapsePanel` yourself. */
  title?: ReactNode;
  /** Extra content placed before the arrow, outside the trigger so it can hold controls. */
  extra?: ReactNode;
  className?: string;
  children?: ReactNode;
};

export function CollapseItem({
  title,
  extra,
  disabled,
  className,
  children,
  ...props
}: CollapseItemProps) {
  const { iconPosition, bordered } = useContext(CollapseContext);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function handleHeaderClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest('[data-slot="accordion-trigger"]')) return;
    if (target.closest('[data-slot="collapse-extra"]')) return;
    triggerRef.current?.click();
  }

  const itemClasses = cn(
    "box-border",
    bordered ? "border-t border-lark-divider last:border-b" : "border-t-0 border-b-0",
    className,
  );

  return (
    <UiAccordionItem {...props} disabled={disabled} className={itemClasses}>
      {title === undefined ? (
        children
      ) : (
        <>
          <CollapseHeader onClick={handleHeaderClick}>
            {iconPosition === "left" ? <CollapseChevron position="left" /> : null}
            <CollapseTrigger
              ref={triggerRef}
              className={iconPosition === "left" ? "pl-0" : undefined}
            >
              <span className="min-w-0 flex-1 truncate">{title}</span>
            </CollapseTrigger>
            {extra !== undefined ? (
              <span
                data-slot="collapse-extra"
                className="ml-2 shrink-0 cursor-auto text-lark-14 leading-[22px] text-lark-caption"
              >
                {extra}
              </span>
            ) : null}
            {iconPosition === "right" ? <CollapseChevron position="right" /> : null}
          </CollapseHeader>
          <CollapsePanel>{children}</CollapsePanel>
        </>
      )}
    </UiAccordionItem>
  );
}

function CollapseChevron({ position }: { position: CollapseIconPosition }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none flex shrink-0 items-center justify-center text-lark-icon-2",
        position === "left" ? "ml-2 mr-2" : "mr-2",
      )}
    >
      {position === "left" ? (
        <CaretIcon
          className={cn(
            "transition-transform duration-200 ease-lark motion-reduce:transition-none",
            "group-data-[disabled]/collapse-header:text-lark-icon-disabled",
            "-rotate-90 group-data-[open]/collapse-header:rotate-0",
          )}
        />
      ) : (
        <ChevronDownIcon
          size={16}
          className={cn(
            "transition-transform duration-200 ease-lark motion-reduce:transition-none",
            "group-data-[disabled]/collapse-header:text-lark-icon-disabled",
            "group-data-[open]/collapse-header:rotate-180",
          )}
        />
      )}
    </span>
  );
}

/** UD's 10 × 10 filled arrow, used when the arrow sits on the left. */
function CaretIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 10 10"
      width={10}
      height={10}
      fill="currentColor"
      className={className}
    >
      <path d="M2.35 3.15 5 7.55l2.65-4.4A.5.5 0 0 0 7.22 2.4H2.78a.5.5 0 0 0-.43.75Z" />
    </svg>
  );
}
