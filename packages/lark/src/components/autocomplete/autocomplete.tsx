import { Autocomplete as AutocompleteBase } from "@base-ui/react/autocomplete";
import { CheckIcon } from "../../icons/phosphor";
import { createContext, useContext, type ReactNode } from "react";
import { inputVariants, LARK_INPUT_VARIANTS } from "../input/input";
import { cn } from "../../utils/cn";
import { resolveVariant } from "../../utils/resolve-variant";
import { Field, type FieldErrorMatch } from "../field/field";

const AutocompleteContext = createContext<{ hasError: boolean }>({
  hasError: false,
});

/** Autocomplete variant definitions. */
export const LARK_AUTOCOMPLETE_VARIANTS = {
  size: LARK_INPUT_VARIANTS.size,
} as const;

export const LARK_AUTOCOMPLETE_DEFAULT_VARIANTS = {
  size: "base",
} as const;

// Derived types from LARK_AUTOCOMPLETE_VARIANTS
export type LarkAutocompleteSize = keyof typeof LARK_AUTOCOMPLETE_VARIANTS.size;

export interface LarkAutocompleteVariantsProps {
  /**
   * Size of the autocomplete input. Matches Input component sizes.
   * - `"xs"` — Extra small for compact UIs (h-5 / 20px)
   * - `"sm"` — Small for secondary fields (h-6.5 / 26px)
   * - `"base"` — Default size (h-9 / 36px)
   * - `"lg"` — Large for prominent fields (h-10 / 40px)
   * @default "base"
   */
  size?: LarkAutocompleteSize;
}

export function autocompleteVariants({
  size = LARK_AUTOCOMPLETE_DEFAULT_VARIANTS.size,
}: LarkAutocompleteVariantsProps = {}) {
  return cn(
    resolveVariant(
      LARK_INPUT_VARIANTS.size,
      size,
      LARK_AUTOCOMPLETE_DEFAULT_VARIANTS.size,
    ).classes,
  );
}

/**
 * Autocomplete component props.
 *
 * Autocomplete provides a free-form text input with optional suggestions in a
 * filterable dropdown. Unlike Combobox, the input value is not constrained to
 * the suggestion list items.
 *
 * @example
 * ```tsx
 * <Autocomplete label="Country" items={countries}>
 *   <Autocomplete.InputGroup />
 *   <Autocomplete.Content>
 *     <Autocomplete.List>
 *       {(item) => <Autocomplete.Item value={item}>{item}</Autocomplete.Item>}
 *     </Autocomplete.List>
 *   </Autocomplete.Content>
 * </Autocomplete>
 * ```
 */
export interface AutocompleteProps {
  /** Array of items to display in the dropdown */
  items: unknown[];
  /** The controlled input value */
  value?: string | number | string[];
  /** The uncontrolled default input value */
  defaultValue?: string | number | string[];
  /** Callback when the input value changes */
  onValueChange?: AutocompleteBase.Root.Props<unknown>["onValueChange"];
  /** Whether the popup is open (controlled) */
  open?: boolean;
  /** Callback when the popup opens or closes */
  onOpenChange?: AutocompleteBase.Root.Props<unknown>["onOpenChange"];
  /** Autocomplete content (input group, popup content) */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Label content (enables Field wrapper) */
  label?: ReactNode;
  /** Whether the field is required */
  required?: boolean;
  /** Tooltip content to display next to the label */
  labelTooltip?: ReactNode;
  /** Helper text displayed below the field */
  description?: ReactNode;
  /** Error message or validation error object */
  error?: string | { message: ReactNode; match: FieldErrorMatch };
}

function Root<ItemValue>({
  label,
  required,
  labelTooltip,
  description,
  error,
  children,
  ...props
}: AutocompleteBase.Root.Props<ItemValue> & {
  label?: ReactNode;
  required?: boolean;
  labelTooltip?: ReactNode;
  description?: ReactNode;
  error?: string | { message: ReactNode; match: FieldErrorMatch };
}) {
  const rootProps = props as Omit<
    AutocompleteBase.Root.Props<ItemValue>,
    "items"
  > & {
    items?: readonly ItemValue[];
  };
  const control = (
    <AutocompleteContext.Provider value={{ hasError: Boolean(error) }}>
      <AutocompleteBase.Root {...rootProps}>{children}</AutocompleteBase.Root>
    </AutocompleteContext.Provider>
  );

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
        {control}
      </Field>
    );
  }

  return control;
}

function InputGroup({
  className,
  size = LARK_AUTOCOMPLETE_DEFAULT_VARIANTS.size,
  placeholder,
}: {
  className?: string;
  size?: LarkAutocompleteSize;
  placeholder?: string;
}) {
  const { hasError } = useContext(AutocompleteContext);
  return (
    <AutocompleteBase.Input
      className={cn(
        inputVariants({
          size,
          variant: hasError ? "error" : "default",
          focusIndicator: true,
        }),
        "w-full",
        // Feishu transitions the border colour over 100ms and nothing else;
        // the border is drawn with a ring, so animate the shadow.
        "transition-[box-shadow] duration-100 ease-linear",
        className,
      )}
      placeholder={placeholder}
    />
  );
}

function Content({
  children,
  className,
  align = "start",
  sideOffset = 4,
  alignOffset,
  side,
}: {
  children?: ReactNode;
  className?: string;
  align?: AutocompleteBase.Positioner.Props["align"];
  alignOffset?: AutocompleteBase.Positioner.Props["alignOffset"];
  side?: AutocompleteBase.Positioner.Props["side"];
  sideOffset?: AutocompleteBase.Positioner.Props["sideOffset"];
}) {
  return (
    <AutocompleteBase.Portal>
      <AutocompleteBase.Positioner
        className="outline-none"
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        side={side}
      >
        <AutocompleteBase.Popup
          className={(state: AutocompleteBase.Popup.State) =>
            cn(
              "flex flex-col",
              "max-h-[min(var(--available-height),24rem)] max-w-(--available-width) min-w-(--anchor-width)",
              // Feishu `.ud__select__list`: floating surface, 6px radius,
              // `--line-border-card` border, 2px menu padding
              "py-0.5",
              "bg-lark-elevated text-lark-default",
              "rounded-md shadow-lark-popover ring ring-lark-line",
              "overflow-hidden",
              state.empty && "hidden",
              className,
            )
          }
        >
          {children}
        </AutocompleteBase.Popup>
      </AutocompleteBase.Positioner>
    </AutocompleteBase.Portal>
  );
}

function List({
  className,
  ...props
}: AutocompleteBase.List.Props & { className?: string }) {
  return (
    <AutocompleteBase.List
      {...props}
      className={cn(
        "min-h-0 flex-1 scroll-pt-2 scroll-pb-2 overflow-y-auto overscroll-contain",
        className,
      )}
    />
  );
}

function Item({
  children,
  className,
  ...props
}: AutocompleteBase.Item.Props & { className?: string }) {
  return (
    <AutocompleteBase.Item
      data-lark-component="Autocomplete"
      data-lark-part="item"
      {...props}
      className={cn(
        // Feishu `.ud__select__list__item`: 1px/3px margins, 4px/8px padding,
        // 4px radius, `--fill-hover` on hover, brand text when selected
        "group mx-[3px] my-px grid cursor-pointer grid-cols-[1fr_16px] gap-2 rounded px-2 py-1 text-base",
        "data-highlighted:bg-lark-fill-hover data-selected:text-lark-brand",
        className,
      )}
    >
      <div className="col-start-1">{children}</div>
      <span className="col-start-2 hidden items-center group-data-selected:flex">
        <CheckIcon size={12} />
      </span>
    </AutocompleteBase.Item>
  );
}

function GroupLabel(props: AutocompleteBase.GroupLabel.Props) {
  return (
    <AutocompleteBase.GroupLabel
      {...props}
      className={cn(
        // Feishu `.ud__select__list__group__title`: 4px/11px padding, muted
        "px-[11px] py-1 text-base text-lark-placeholder",
        props.className,
      )}
    />
  );
}

function Group(props: AutocompleteBase.Group.Props) {
  return (
    <AutocompleteBase.Group
      {...props}
      className="mt-1.5 border-t border-lark-line pt-1.5 first:mt-0 first:border-t-0 first:pt-0"
    />
  );
}

function Separator(props: AutocompleteBase.Separator.Props) {
  return (
    <AutocompleteBase.Separator
      {...props}
      className={cn("mx-0 my-1 h-px bg-lark-line", props.className)}
    />
  );
}

Root.displayName = "Autocomplete.Root";
InputGroup.displayName = "Autocomplete.InputGroup";
Content.displayName = "Autocomplete.Content";
Item.displayName = "Autocomplete.Item";
GroupLabel.displayName = "Autocomplete.GroupLabel";
Group.displayName = "Autocomplete.Group";
Separator.displayName = "Autocomplete.Separator";

/**
 * Autocomplete — free-form text input with an optional filtered suggestion list.
 *
 * Unlike Combobox, the input value is not restricted to items in the list.
 * Use Combobox when the selected value must come from the list.
 *
 * Compound component: `Autocomplete` (Root), `.InputGroup`, `.Content`, `.Item`,
 * `.GroupLabel`, `.Group`, `.Separator`, `.List`, `.Collection`.
 *
 * `InputGroup` renders the text input with Input component styling.
 * Pass a `size` prop to `InputGroup` to match the Input component sizes.
 *
 * @example
 * ```tsx
 * <Autocomplete items={fruits} label="Fruit">
 *   <Autocomplete.InputGroup size="base" />
 *   <Autocomplete.Content>
 *     <Autocomplete.List>
 *       {(item) => <Autocomplete.Item value={item}>{item}</Autocomplete.Item>}
 *     </Autocomplete.List>
 *   </Autocomplete.Content>
 * </Autocomplete>
 * ```
 *
 * @see https://base-ui.com/react/components/autocomplete
 */
export const Autocomplete = Object.assign(Root, {
  // Styled compound sub-components
  InputGroup,
  Content,
  Item,
  GroupLabel,
  Group,
  Separator,
  List,

  // Pass-through Base UI sub-components
  Empty: AutocompleteBase.Empty,
  Collection: AutocompleteBase.Collection,

  // Filtering
  useFilter: AutocompleteBase.useFilter,
});
