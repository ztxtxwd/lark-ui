import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@ui-sdk/react/field";
import { cva } from "class-variance-authority";
import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  createContext,
  type ReactNode,
  useContext,
} from "react";
import { cn } from "../../lib/cn";

export type FormLayout = "vertical" | "horizontal";

const FormLayoutContext = createContext<FormLayout>("vertical");

/**
 * The native form. UD uses 14/22 text and 28px between vertical fields
 * (20px in the horizontal layout); pass `noValidate` to rely only on Field's
 * in-page errors, or leave it off to keep the browser's native constraints.
 */
export type FormProps = Omit<ComponentProps<"form">, "children"> & {
  /** Field labels above the control (default) or to its right. */
  layout?: FormLayout;
  children?: ReactNode;
};

export function Form({ layout = "vertical", className, children, ...props }: FormProps) {
  return (
    <FormLayoutContext.Provider value={layout}>
      <form
        {...props}
        data-slot="form"
        data-layout={layout}
        className={cn("m-0 box-border p-0 text-lark-14 text-lark-title", className)}
      >
        {children}
      </form>
    </FormLayoutContext.Provider>
  );
}

export const formItemStyles = cva("box-border", {
  variants: {
    layout: {
      vertical: "mb-7 flex flex-col gap-2 last:mb-0",
      horizontal:
        "mb-5 grid grid-cols-[fit-content(50%)_minmax(0,1fr)] items-start gap-x-4 gap-y-1 last:mb-0",
    },
  },
  defaultVariants: { layout: "vertical" },
});

export type FormLabelProps = Omit<ComponentProps<typeof FieldLabel>, "children"> & {
  children?: ReactNode;
  /**
   * The red asterisk. `true` shows it, `false` hides it, and leaving it out
   * follows the control's native `required` / `aria-required` state.
   */
  required?: boolean;
  /** Replaces the asterisk glyph. */
  requiredMark?: ReactNode;
};

/**
 * The field label. The asterisk is decorative and hidden from the accessible
 * name; add `required` to the control itself for native validation.
 */
export function FormLabel({
  required,
  requiredMark = "*",
  className,
  children,
  ...props
}: FormLabelProps) {
  const markerDisplay =
    required === true
      ? "inline-block"
      : required === false
        ? "hidden"
        : "hidden group-data-[required]:inline-block";

  return (
    <FieldLabel
      {...props}
      className={(state) =>
        cn(
          "group flex items-baseline text-lark-14 text-lark-title",
          "data-[disabled]:text-lark-placeholder data-[disabled]:cursor-not-allowed",
          typeof className === "function" ? className(state) : className,
        )
      }
    >
      <span className="line-clamp-2 min-w-0 max-w-full">{children}</span>
      {requiredMark === null ? null : (
        <span
          aria-hidden="true"
          data-slot="form-required"
          className={cn(
            "ml-0.5 w-2 shrink-0 text-lark-danger-content [font-family:SimSun,serif]",
            markerDisplay,
          )}
        >
          {requiredMark}
        </span>
      )}
    </FieldLabel>
  );
}

export type FormDescriptionProps = ComponentProps<typeof FieldDescription>;

/** Help text under the control, using UD's placeholder colour at 14/22. */
export function FormDescription({ className, ...props }: FormDescriptionProps) {
  return (
    <FieldDescription
      {...props}
      className={(state) =>
        cn(
          "mt-0.5 text-lark-14 text-lark-caption",
          typeof className === "function" ? className(state) : className,
        )
      }
    />
  );
}

export type FormErrorProps = ComponentProps<typeof FieldError>;

/**
 * Error text under the control, using UD's danger colour. Without children it
 * shows the browser's own message once the field is invalid.
 */
export function FormError({ className, ...props }: FormErrorProps) {
  return (
    <FieldError
      {...props}
      className={(state) =>
        cn(
          "mt-0.5 text-lark-14 text-lark-danger-strong dark:text-lark-danger-content",
          typeof className === "function" ? className(state) : className,
        )
      }
    />
  );
}

type FieldClassName = ComponentProps<typeof Field>["className"];

export type FormItemProps = Omit<
  ComponentProps<typeof Field>,
  "children" | "invalid" | "className"
> & {
  children?: ReactNode;
  label?: ReactNode;
  /** Help text shown under the control. */
  description?: ReactNode;
  /**
   * Error text shown under the control. Supplying it marks the field invalid,
   * so the text and its `aria-describedby` wiring appear immediately. For
   * native validation, leave it set and the browser's message is used until
   * the form is submitted.
   */
  error?: ReactNode;
  /** Shows the UD required asterisk. */
  required?: boolean;
  /** Marks the field invalid from your own validation or a server error. */
  invalid?: boolean;
  /** Overrides the form's layout for this item. */
  layout?: FormLayout;
  requiredMark?: ReactNode;
  labelClassName?: ComponentProps<typeof FormLabel>["className"];
  contentClassName?: string;
  className?: FieldClassName;
};

/**
 * A labelled field row. Label, description and error ids are wired by
 * ui-sdk's Field, so native constraints and the `invalid` prop both drive the
 * danger text and `aria-describedby`.
 */
export function FormItem({
  label,
  description,
  error,
  required,
  invalid,
  layout,
  requiredMark,
  labelClassName,
  contentClassName,
  className,
  children,
  ...props
}: FormItemProps) {
  const formLayout = useContext(FormLayoutContext);
  const resolvedLayout = layout ?? formLayout;
  const horizontal = resolvedLayout === "horizontal";
  const hasLabel = label !== undefined && label !== null;
  const hasError = error !== undefined && error !== null && error !== false && error !== "";
  const fieldInvalid = invalid ?? (hasError ? true : undefined);

  return (
    <Field
      {...props}
      invalid={fieldInvalid}
      data-layout={resolvedLayout}
      className={(state) =>
        cn(
          formItemStyles({ layout: resolvedLayout }),
          typeof className === "function" ? className(state) : className,
        )
      }
    >
      {hasLabel ? (
        <FormLabel
          required={required}
          requiredMark={requiredMark}
          className={(state) =>
            cn(
              horizontal ? "pt-[5px] text-right" : "text-left",
              typeof labelClassName === "function" ? labelClassName(state) : labelClassName,
            )
          }
        >
          {label}
        </FormLabel>
      ) : null}

      <div
        data-slot="form-control"
        className={cn(
          "flex min-w-0 flex-col",
          horizontal && (hasLabel ? "col-start-2" : "col-span-2 col-start-1"),
          contentClassName,
        )}
      >
        {children}
        {description !== undefined && description !== null ? (
          <FormDescription>{description}</FormDescription>
        ) : null}
        <FormError>{error}</FormError>
      </div>
    </Field>
  );
}

export type FormGroupProps = ComponentPropsWithoutRef<"div">;

/** Stacks related fields. It has no role; a FormSection names the group. */
export function FormGroup({ className, ...props }: FormGroupProps) {
  return <div {...props} data-slot="form-group" className={cn("flex flex-col", className)} />;
}

export type FormSectionProps = Omit<ComponentProps<typeof FieldSet>, "children" | "className"> & {
  children?: ReactNode;
  /** The group's legend. Keep it the section's first content. */
  title?: ReactNode;
  /** Text that describes the group, read as focus enters it. */
  description?: ReactNode;
  legendClassName?: ComponentProps<typeof FieldLegend>["className"];
  contentClassName?: string;
  className?: ComponentProps<typeof FieldSet>["className"];
};

/**
 * A native fieldset with a legend, for grouped forms. `disabled` disables
 * every control inside and leaves them out of the submitted values.
 */
export function FormSection({
  title,
  description,
  legendClassName,
  contentClassName,
  className,
  children,
  ...props
}: FormSectionProps) {
  return (
    <FieldSet
      {...props}
      className={(state) =>
        cn(
          "m-0 min-w-0 border-0 p-0",
          typeof className === "function" ? className(state) : className,
        )
      }
    >
      {title !== undefined && title !== null ? (
        <FieldLegend
          className={(state) =>
            cn(
              "mb-2 p-0 text-lark-16 font-medium text-lark-title",
              "data-[disabled]:text-lark-placeholder",
              typeof legendClassName === "function" ? legendClassName(state) : legendClassName,
            )
          }
        >
          {title}
        </FieldLegend>
      ) : null}

      {description !== undefined && description !== null ? (
        <FormDescription className="mb-4">{description}</FormDescription>
      ) : null}

      <FormGroup className={contentClassName}>{children}</FormGroup>
    </FieldSet>
  );
}
