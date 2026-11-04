import { Combobox as ComboboxBase } from "@base-ui/react/combobox";
import { CaretUpDownIcon, CheckIcon, XIcon } from "../../icons/phosphor";
import {
  Fragment,
  createContext,
  useContext,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import {
  inputVariants,
  LARK_INPUT_VARIANTS,
  type LarkInputSize,
} from "../input/input";
import { cn } from "../../utils/cn";
import { resolveVariant } from "../../utils/resolve-variant";
import { Field, type FieldErrorMatch } from "../field/field";
import {
  usePortalContainer,
  type PortalContainer,
} from "../../utils/portal-provider";

/** Combobox variant definitions. */
export const LARK_COMBOBOX_VARIANTS = {
  size: LARK_INPUT_VARIANTS.size,
  inputSide: {
    right: {
      classes: "",
      description: "Input positioned inline to the right of chips",
    },
    top: {
      classes: "",
      description: "Input positioned above chips",
    },
  },
} as const;

export const LARK_COMBOBOX_DEFAULT_VARIANTS = {
  size: "base",
  inputSide: "right",
} as const;

// Context to pass size and error state down to sub-components
const ComboboxContext = createContext<{
  size: LarkInputSize;
  hasError: boolean;
}>({ size: "base", hasError: false });

// Derived types from LARK_COMBOBOX_VARIANTS
export type LarkComboboxSize = keyof typeof LARK_COMBOBOX_VARIANTS.size;
export type LarkComboboxInputSide =
  keyof typeof LARK_COMBOBOX_VARIANTS.inputSide;

export interface LarkComboboxVariantsProps {
  /**
   * Size of the combobox trigger. Matches Input component sizes.
   * - `"xs"` — Extra small for compact UIs (h-5 / 20px)
   * - `"sm"` — Small for secondary fields (h-6.5 / 26px)
   * - `"base"` — Default size (h-9 / 36px)
   * - `"lg"` — Large for prominent fields (h-10 / 40px)
   * @default "base"
   */
  size?: LarkComboboxSize;
  /**
   * Position of the text input relative to chips in multi-select mode.
   * - `"right"` — Input inline to the right of chips
   * - `"top"` — Input above chips
   * @default "right"
   */
  inputSide?: LarkComboboxInputSide;
}

export function comboboxVariants({
  inputSide = LARK_COMBOBOX_DEFAULT_VARIANTS.inputSide,
}: LarkComboboxVariantsProps = {}) {
  return cn(
    resolveVariant(
      LARK_COMBOBOX_VARIANTS.inputSide,
      inputSide,
      LARK_COMBOBOX_DEFAULT_VARIANTS.inputSide,
    ).classes,
  );
}

// Legacy type alias for backwards compatibility
export type ComboboxInputSide = LarkComboboxInputSide;
export type ComboboxSize = LarkComboboxSize;

export type ComboboxRootProps<
  Value = unknown,
  Multiple extends boolean | undefined = false,
> = ComboboxBase.Root.Props<Value, Multiple>;

/**
 * Combobox component props (simplified for documentation; the actual Root is generic).
 *
 * Combobox provides an autocomplete/typeahead input with a filterable dropdown.
 * Supports single-select, multi-select with chips, grouped items, and Field wrapper integration.
 *
 * @example
 * ```tsx
 * // Single-select with search input
 * <Combobox value={value} onValueChange={setValue} items={options}>
 *   <Combobox.TriggerInput placeholder="Search…" />
 *   <Combobox.Content>
 *     <Combobox.List>
 *       {(item) => <Combobox.Item value={item}>{item.label}</Combobox.Item>}
 *     </Combobox.List>
 *     <Combobox.Empty>No results</Combobox.Empty>
 *   </Combobox.Content>
 * </Combobox>
 *
 * // Multi-select with chips
 * <Combobox multiple items={options} label="Tags">
 *   <Combobox.TriggerMultipleWithInput
 *     placeholder="Add tag…"
 *     renderItem={(item) => <Combobox.Chip value={item}>{item.label}</Combobox.Chip>}
 *   />
 *   <Combobox.Content>
 *     <Combobox.List>
 *       {(item) => <Combobox.Item value={item}>{item.label}</Combobox.Item>}
 *     </Combobox.List>
 *   </Combobox.Content>
 * </Combobox>
 * ```
 */
export interface ComboboxProps extends LarkComboboxVariantsProps {
  /** Array of items to display in the dropdown */
  items: unknown[];
  /** Currently selected value(s) */
  value?: unknown;
  /** Callback when selection changes */
  onValueChange?: (value: unknown) => void;
  /** Enable multi-select mode */
  multiple?: boolean;
  /** Combobox content (trigger, content, items) */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Label content for the combobox (enables Field wrapper) - can be a string or any React node */
  label?: ReactNode;
  /** Whether the combobox is required */
  required?: boolean;
  /** Tooltip content to display next to the label via an info icon */
  labelTooltip?: ReactNode;
  /** Helper text displayed below the combobox */
  description?: ReactNode;
  /** Error message or validation error object */
  error?: string | { message: ReactNode; match: FieldErrorMatch };
}

function Root<Value, Multiple extends boolean | undefined = false>({
  label,
  required,
  labelTooltip,
  description,
  error,
  children,
  size = "base",
  ...props
}: ComboboxBase.Root.Props<Value, Multiple> & {
  label?: ReactNode;
  required?: boolean;
  labelTooltip?: ReactNode;
  description?: ReactNode;
  error?: string | { message: ReactNode; match: FieldErrorMatch };
  size?: LarkComboboxSize;
}) {
  const comboboxControl = (
    <ComboboxContext.Provider value={{ size, hasError: Boolean(error) }}>
      <ComboboxBase.Root {...props} required={required}>
        {children}
      </ComboboxBase.Root>
    </ComboboxContext.Provider>
  );

  // Render with Field wrapper if label, description, or error are provided
  if (label) {
    return (
      <Field
        label={label}
        required={required}
        labelTooltip={labelTooltip}
        description={description}
        error={
          error
            ? typeof error === "string"
              ? { message: error, match: true }
              : error
            : undefined
        }
      >
        {comboboxControl}
      </Field>
    );
  }

  // Render bare combobox without Field wrapper
  return comboboxControl;
}

function Content({
  children,
  className,
  align = "start",
  sideOffset = 4,
  alignOffset,
  side,
  anchor,
  positionMethod,
  collisionAvoidance,
  collisionBoundary,
  collisionPadding,
  sticky,
  disableAnchorTracking,
  container: containerProp,
}: PropsWithChildren<{
  className?: string;
  align?: ComboboxBase.Positioner.Props["align"];
  alignOffset?: ComboboxBase.Positioner.Props["alignOffset"];
  side?: ComboboxBase.Positioner.Props["side"];
  sideOffset?: ComboboxBase.Positioner.Props["sideOffset"];
  anchor?: ComboboxBase.Positioner.Props["anchor"];
  positionMethod?: ComboboxBase.Positioner.Props["positionMethod"];
  collisionAvoidance?: ComboboxBase.Positioner.Props["collisionAvoidance"];
  collisionBoundary?: ComboboxBase.Positioner.Props["collisionBoundary"];
  collisionPadding?: ComboboxBase.Positioner.Props["collisionPadding"];
  sticky?: ComboboxBase.Positioner.Props["sticky"];
  disableAnchorTracking?: ComboboxBase.Positioner.Props["disableAnchorTracking"];
  /**
   * Container element for the portal. Use this to render the combobox inside
   * a Shadow DOM or custom container. Overrides `LarkPortalProvider` context.
   * @default document.body (or LarkPortalProvider container if set)
   */
  container?: PortalContainer;
}>) {
  const contextContainer = usePortalContainer();
  const container = containerProp ?? contextContainer ?? undefined;

  return (
    <ComboboxBase.Portal container={container}>
      <ComboboxBase.Positioner
        className=""
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        side={side}
        anchor={anchor}
        positionMethod={positionMethod}
        collisionAvoidance={collisionAvoidance}
        collisionBoundary={collisionBoundary}
        collisionPadding={collisionPadding}
        sticky={sticky}
        disableAnchorTracking={disableAnchorTracking}
      >
        <ComboboxBase.Popup
          className={cn(
            "flex flex-col", // flexbox layout for sticky input + scrollable list
            "max-h-[min(var(--available-height),24rem)] max-w-(--available-width) min-w-(--anchor-width)",
            // Feishu `.ud__select__list`: floating surface, 6px radius,
            // `--line-border-card` border, 2px menu padding
            "py-0.5",
            "bg-lark-elevated text-lark-default", // background
            "rounded-md shadow-lark-popover ring ring-lark-line", // border part
            "overflow-hidden",
            className,
          )}
        >
          {children}
        </ComboboxBase.Popup>
      </ComboboxBase.Positioner>
    </ComboboxBase.Portal>
  );
}

// Size-dependent styles for TriggerValue icon.
//
// Feishu `.ud__select__selector__arrow` is sized 10 / 12 / 16px and sits
// 8px away from the value with the field's own right padding (11px at md)
// beyond it.
const triggerValueIconStyles: Record<
  LarkComboboxSize,
  { padding: string; iconSize: number; iconRight: string }
> = {
  xs: { padding: "pr-5", iconSize: 10, iconRight: "right-0.5" },
  sm: { padding: "pr-6", iconSize: 10, iconRight: "right-1.5" },
  base: { padding: "pr-8", iconSize: 12, iconRight: "right-3" },
  lg: { padding: "pr-9", iconSize: 16, iconRight: "right-3" },
};

function TriggerValue({
  className,
  render,
  ...props
}: ComboboxBase.Value.Props & {
  className?: string;
  /** Replaces the trigger element while preserving Combobox behavior. */
  render?: ComboboxBase.Trigger.Props["render"];
}) {
  const { size, hasError } = useContext(ComboboxContext);
  const iconStyles = triggerValueIconStyles[size];

  return (
    <ComboboxBase.Trigger
      data-lark-component="Combobox"
      data-lark-part="trigger"
      render={render}
      className={cn(
        inputVariants({ size, variant: hasError ? "error" : "default" }),
        "group relative flex items-center",
        // Feishu transitions the border colour over 100ms and nothing else;
        // the border is drawn with a ring, so animate the shadow.
        "transition-[box-shadow] duration-100 ease-linear",
        // Feishu disabled selects swap to the recessed fill and mute the text,
        // and the border stays put (no hover reaction)
        "data-[disabled]:cursor-not-allowed",
        "data-[disabled]:bg-lark-control",
        "data-[disabled]:text-lark-placeholder",
        "data-[disabled]:hover:ring-lark-border",
        "data-[placeholder]:text-lark-placeholder",
        iconStyles.padding,
        className,
      )}
    >
      <ComboboxBase.Value {...props} />
      <ComboboxBase.Icon
        className={cn(
          // Feishu draws the arrow with `--icon-n2`, `--icon-disabled` when the
          // select is disabled
          "absolute top-1/2 flex -translate-y-1/2 items-center text-lark-subtle",
          "group-data-[disabled]:text-lark-inactive",
          iconStyles.iconRight,
        )}
      >
        <CaretUpDownIcon size={iconStyles.iconSize} className="fill-current" />
      </ComboboxBase.Icon>
    </ComboboxBase.Trigger>
  );
}

// Size-dependent styles for TriggerInput icons.
//
// Feishu `.ud__select__selector__clear` and `__arrow` share the arrow's
// size and are separated by 8px; the field reserves room for both.
const triggerInputIconStyles: Record<
  LarkComboboxSize,
  { padding: string; iconSize: number; clearRight: string; caretRight: string }
> = {
  xs: {
    padding: "pr-10",
    iconSize: 10,
    clearRight: "right-5",
    caretRight: "right-0.5",
  },
  sm: {
    padding: "pr-11",
    iconSize: 10,
    clearRight: "right-6",
    caretRight: "right-1.5",
  },
  base: {
    padding: "pr-13",
    iconSize: 12,
    clearRight: "right-8",
    caretRight: "right-3",
  },
  lg: {
    padding: "pr-15",
    iconSize: 16,
    clearRight: "right-9",
    caretRight: "right-3",
  },
};

function TriggerInput({
  clearLabel = "Clear selection",
  showOptionsLabel = "Show options",
  ...props
}: ComboboxBase.Input.Props & {
  /** Accessible label for the clear button. Pass a translated string for i18n.
   * @default "Clear selection"
   */
  clearLabel?: string;
  /** Accessible label for the dropdown trigger. Pass a translated string for i18n.
   * @default "Show options"
   */
  showOptionsLabel?: string;
}) {
  const { size, hasError } = useContext(ComboboxContext);
  const iconStyles = triggerInputIconStyles[size];

  return (
    <div
      className={cn(
        "relative inline-block w-full",
        "has-[:disabled]:cursor-not-allowed",
        props.className,
      )}
    >
      <ComboboxBase.Input
        {...props}
        className={cn(
          inputVariants({ size, variant: hasError ? "error" : "default" }),
          "w-full",
          iconStyles.padding,
          "disabled:cursor-not-allowed",
          // Feishu disabled fields keep the border colour (no hover reaction)
          "disabled:hover:ring-lark-border",
          // Feishu transitions the border colour over 100ms and nothing else;
          // the border is drawn with a ring, so animate the shadow.
          "transition-[box-shadow] duration-100 ease-linear",
        )}
      />

      <ComboboxBase.Clear
        data-lark-component="Combobox"
        data-lark-part="clear"
        aria-label={clearLabel}
        className={cn(
          "absolute top-1/2 flex -translate-y-1/2 cursor-pointer bg-transparent p-0",
          // Feishu `.ud__select__selector__clear`: `--icon-n2`, brand on hover,
          // brand-pressed on press
          "text-lark-subtle hover:text-lark-brand active:text-lark-brand-pressed",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-0",
          iconStyles.clearRight,
        )}
      >
        <XIcon size={iconStyles.iconSize} />
      </ComboboxBase.Clear>

      <ComboboxBase.Trigger
        data-lark-component="Combobox"
        data-lark-part="trigger"
        aria-label={showOptionsLabel}
        className={cn(
          "absolute top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center text-lark-subtle",
          "m-0 bg-transparent p-0", // Reset Stratus global button styles
          iconStyles.caretRight,
        )}
      >
        <ComboboxBase.Icon className="flex items-center">
          <CaretUpDownIcon
            size={iconStyles.iconSize}
            className="fill-current"
          />
        </ComboboxBase.Icon>
      </ComboboxBase.Trigger>
    </div>
  );
}

function Item({
  children,
  className,
  ...props
}: ComboboxBase.Item.Props & { className?: string }) {
  return (
    <ComboboxBase.Item
      data-lark-component="Combobox"
      data-lark-part="item"
      {...props}
      className={cn(
        // Feishu `.ud__select__list__item`: 1px/3px margins, 4px/8px padding,
        // 4px radius, `--fill-hover` on hover, brand text when selected
        "group mx-[3px] my-px grid grid-cols-[1fr_16px] gap-2 rounded px-2 py-1 text-base",
        "cursor-pointer data-highlighted:bg-lark-fill-hover data-selected:text-lark-brand",
        // Disabled rows: muted text, no pointer, suppress highlight bg even
        // when keyboard nav lands on them. Base UI sets `data-disabled` on
        // the element when the `disabled` prop is true.
        "data-[disabled]:cursor-not-allowed data-[disabled]:text-lark-inactive data-[disabled]:data-highlighted:bg-transparent",
        className,
      )}
    >
      <div className="col-start-1">{children}</div>
      <ComboboxBase.ItemIndicator className="col-start-2 flex items-center">
        <CheckIcon size={12} />
      </ComboboxBase.ItemIndicator>
    </ComboboxBase.Item>
  );
}

function Empty(props: ComboboxBase.Empty.Props) {
  return (
    <ComboboxBase.Empty
      {...props}
      className={cn(
        // Feishu `.ud__select__list__empty`: `--text-placeholder`, 13px/11px
        "shrink-0 px-[11px] py-[13px] text-base text-lark-placeholder",
        "empty:m-0 empty:p-0",
      )}
      children={props.children ?? "No labels found."}
    />
  );
}

function Input(props: ComboboxBase.Input.Props) {
  return (
    <ComboboxBase.Input
      {...props}
      className={cn(
        inputVariants(),
        "mx-0 -mt-1.5 w-full shrink-0 rounded-b-none first:mb-2",
        "transition-[box-shadow] duration-100 ease-linear",
        props.className,
      )}
    />
  );
}

function List({
  className,
  ...props
}: ComboboxBase.List.Props & { className?: string }) {
  return (
    <ComboboxBase.List
      {...props}
      className={cn(
        "min-h-0 flex-1 scroll-pt-2 scroll-pb-2 overflow-y-auto overscroll-contain",
        className,
      )}
    />
  );
}

function GroupLabel(props: ComboboxBase.GroupLabel.Props) {
  return (
    <ComboboxBase.GroupLabel
      {...props}
      className={cn(
        // Feishu `.ud__select__list__group__title`: 4px/11px padding, muted
        "px-[11px] py-1 text-base text-lark-placeholder",
        props.className,
      )}
    />
  );
}

function Group(props: ComboboxBase.Group.Props) {
  return (
    <ComboboxBase.Group
      {...props}
      className="mt-1.5 border-t border-lark-line pt-1.5 first:mt-0 first:border-t-0 first:pt-0"
    />
  );
}

function Chip({
  removeLabel = "Remove",
  ...props
}: ComboboxBase.Chip.Props & {
  /** Accessible label for the chip remove button. Pass a translated string for i18n.
   * @default "Remove"
   */
  removeLabel?: string;
}) {
  return (
    <ComboboxBase.Chip
      {...props}
      className={cn(
        "flex items-center gap-1", // Layout
        "h-6 pr-[3px] pl-2", // Dimensions
        // Feishu `.ud__tag` (neutral): translucent neutral fill, no border
        "rounded-sm bg-lark-overlay", // Background
        "text-sm text-lark-default", // Typography
        // Feishu `.ud__select__selector__tag`: 2px/4px margin
        "mt-0.5 mr-1 mb-0.5",
      )}
    >
      {props.children}
      <ComboboxBase.ChipRemove
        data-lark-component="Combobox"
        data-lark-part="chip-remove"
        aria-label={removeLabel}
        className={cn(
          "cursor-pointer rounded-md p-1 hover:bg-lark-fill-hover",
          "flex bg-transparent",
        )}
      >
        <XIcon size={10} />
      </ComboboxBase.ChipRemove>
    </ComboboxBase.Chip>
  );
}

// Map size to min-height class for TriggerMultipleWithInput
// Feishu `.ud__select__selector--size-*`: 24 / 28 / 32 / 40px
const sizeToMinHeight: Record<LarkComboboxSize, string> = {
  xs: "min-h-6",
  sm: "min-h-7",
  base: "min-h-8",
  lg: "min-h-10",
};

function TriggerMultipleWithInput<ValueType>({
  placeholder,
  renderItem,
  className,
  inputSide = "right",
  value: controlledValue,
}: {
  placeholder?: string;
  renderItem: (value: ValueType) => React.ReactNode;
  className?: string;
  inputSide?: "right" | "top";
  /** Optional controlled value for rendering chips (use when pre-selecting values) */
  value?: ValueType[];
}) {
  const { size, hasError } = useContext(ComboboxContext);
  // Determine which value to use for rendering chips
  const chipsToRender = controlledValue;
  const renderTriggerInput = (className: string) => (
    <ComboboxBase.Input placeholder={placeholder} className={className} />
  );

  return (
    <ComboboxBase.Chips
      className={cn(
        inputVariants({ size, variant: hasError ? "error" : "default" }),
        "flex flex-col",
        // Feishu `.ud__select__selector-multiple`: 3px padding, tags carry
        // their own 2px/4px margin
        "gap-1 px-[3px] py-1",
        sizeToMinHeight[size],
        "h-auto",
        // Feishu transitions the border colour over 100ms and nothing else
        "transition-[box-shadow] duration-100 ease-linear",
        // Feishu disabled selects swap to the recessed fill and mute the text,
        // and the border stays put (no hover reaction)
        "data-[disabled]:cursor-not-allowed",
        "data-[disabled]:bg-lark-control",
        "data-[disabled]:text-lark-placeholder",
        "data-[disabled]:hover:ring-lark-border",
        className,
      )}
    >
      {inputSide === "top" &&
        renderTriggerInput("w-full border-0 bg-inherit px-2 py-1")}
      {/* Chips container */}
      <div className="flex flex-1 flex-wrap items-center gap-1.5">
        {/* Render chips from controlled value if provided */}
        {chipsToRender !== undefined &&
          chipsToRender.length > 0 &&
          chipsToRender.map((item) => renderItem(item))}
        {/* Also render from BaseUI's internal value for user selections */}
        <ComboboxBase.Value>
          {(internalValue: ValueType[]) => {
            // Skip rendering if using controlled value (to avoid duplicates)
            if (chipsToRender !== undefined) return null;
            return (
              <Fragment>
                {internalValue.map((item) => renderItem(item))}
              </Fragment>
            );
          }}
        </ComboboxBase.Value>
        {inputSide === "right" &&
          renderTriggerInput(
            "min-w-[100px] flex-1 border-0 bg-inherit px-2 py-1",
          )}
      </div>
    </ComboboxBase.Chips>
  );
}

Root.displayName = "Combobox.Root";
Content.displayName = "Combobox.Content";
TriggerValue.displayName = "Combobox.TriggerValue";
TriggerInput.displayName = "Combobox.TriggerInput";
Item.displayName = "Combobox.Item";
Chip.displayName = "Combobox.Chip";
TriggerMultipleWithInput.displayName = "Combobox.TriggerMultipleWithInput";

/**
 * Combobox — autocomplete input with filterable dropdown list.
 *
 * Compound component: `Combobox` (Root), `.TriggerInput`, `.TriggerValue`,
 * `.TriggerMultipleWithInput`, `.Content`, `.Item`, `.Chip`, `.Input`,
 * `.Empty`, `.GroupLabel`, `.Group`, `.List`, `.Collection`.
 *
 * @example
 * ```tsx
 * <Combobox items={fruits} label="Fruit">
 *   <Combobox.TriggerInput placeholder="Pick a fruit…" />
 *   <Combobox.Content>
 *     <Combobox.List>
 *       {(item) => <Combobox.Item value={item}>{item}</Combobox.Item>}
 *     </Combobox.List>
 *   </Combobox.Content>
 * </Combobox>
 * ```
 *
 * @see https://base-ui.com/react/components/combobox
 */
export const Combobox = Object.assign(Root, {
  // Helper components
  Content,
  TriggerValue,
  TriggerInput,
  TriggerMultipleWithInput,

  // Slightly modified BaseUI
  Chip,
  Item,

  // Styled BaseUI
  Input,
  Empty,
  GroupLabel,
  Group,

  // Styled BaseUI
  List,

  // BaseUI
  Collection: ComboboxBase.Collection,

  Trigger: ComboboxBase.Trigger,
  Value: ComboboxBase.Value,
  Icon: ComboboxBase.Icon,

  // Filtering
  useFilter: ComboboxBase.useFilter,
  createItems: ComboboxBase.createItems,
});
