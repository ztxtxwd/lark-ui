import { Button as UiButton } from "@ui-sdk/react/button";
import { cva } from "class-variance-authority";
import type { ComponentProps, ReactNode, Ref } from "react";
import { SpinnerIcon } from "../../icons";
import { cn } from "../../lib/cn";

export type ButtonAppearance = "filled" | "outlined" | "text" | "link" | "icon";
export type ButtonTone = "primary" | "neutral" | "danger" | "success";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ButtonShape = "default" | "round" | "circle";

/**
 * UD button states shared by every form under `Button`:
 *
 * - `aria-expanded` keeps a menu trigger in its hover look while the panel is
 *   open (client: `.ud__button--*[aria-expanded]` shares the `:hover` rule).
 * - `aria-pressed` is the Selected type used by toggle buttons (UD spec
 *   "状态切换按钮"): tinted fill, tone border and tone text. Basic, text and
 *   icon buttons all support it.
 */
const buttonStyles = cva(
  [
    "relative box-border inline-flex select-none items-center justify-center gap-2",
    "whitespace-nowrap border border-solid rounded-lark-md font-normal",
    "transition-colors duration-100 ease-lark-linear",
    "outline-none focus-visible:outline-none",
    "cursor-pointer",
    "[&[data-pending]]:cursor-default data-[loading]:cursor-default",
    "data-[disabled]:cursor-not-allowed disabled:cursor-not-allowed",
  ],
  {
    variants: {
      appearance: {
        filled: "",
        outlined: "",
        text: "border-transparent bg-transparent",
        link: "h-auto border-transparent bg-transparent p-0",
        icon: "border-transparent bg-transparent",
      },
      tone: {
        primary: "",
        neutral: "",
        danger: "",
        success: "",
      },
    },
    compoundVariants: [
      {
        appearance: "filled",
        tone: "primary",
        class: [
          "border-lark-primary bg-lark-primary text-lark-on-primary",
          "hover:border-lark-primary-hover hover:bg-lark-primary-hover",
          "aria-expanded:border-lark-primary-hover aria-expanded:bg-lark-primary-hover",
          "focus-visible:border-lark-primary-hover focus-visible:bg-lark-primary-hover",
          "active:border-lark-primary-pressed active:bg-lark-primary-pressed",
          "data-[loading]:border-lark-primary-loading data-[loading]:bg-lark-primary-loading",
          "data-[pending]:border-lark-primary-loading data-[pending]:bg-lark-primary-loading",
          "data-[disabled]:border-lark-fill-disabled data-[disabled]:bg-lark-fill-disabled data-[disabled]:text-lark-on-primary",
          // Selected type, from the UD toggle sheet: tinted fill + tone border.
          "aria-pressed:border-lark-primary aria-pressed:bg-lark-primary-soft aria-pressed:text-lark-primary-content",
          "aria-pressed:hover:bg-lark-primary-softer aria-pressed:active:bg-[var(--lark-primary-fill-transparent-03)]",
          "dark:aria-pressed:bg-[var(--lark-primary-fill-transparent-01)] dark:aria-pressed:text-[var(--lark-primary-content-pressed)]",
          "dark:aria-pressed:hover:bg-[var(--lark-primary-fill-solid-02)] dark:aria-pressed:active:bg-[var(--lark-primary-fill-solid-03)]",
          "aria-pressed:data-[disabled]:border-[var(--lark-primary-loading)] aria-pressed:data-[disabled]:bg-lark-canvas aria-pressed:data-[disabled]:text-[var(--lark-primary-loading)]",
        ],
      },
      {
        appearance: "filled",
        tone: "danger",
        class: [
          "border-lark-danger-strong bg-lark-danger-strong text-lark-on-danger",
          "hover:border-lark-danger-strong-hover hover:bg-lark-danger-strong-hover",
          "aria-expanded:border-lark-danger-strong-hover aria-expanded:bg-lark-danger-strong-hover",
          "focus-visible:border-lark-danger-strong-hover focus-visible:bg-lark-danger-strong-hover",
          "active:border-lark-danger-strong-pressed active:bg-lark-danger-strong-pressed",
          "data-[loading]:border-lark-danger-loading data-[loading]:bg-lark-danger-loading",
          "data-[pending]:border-lark-danger-loading data-[pending]:bg-lark-danger-loading",
          "data-[disabled]:border-lark-fill-disabled data-[disabled]:bg-lark-fill-disabled data-[disabled]:text-lark-on-danger",
          "aria-pressed:border-[var(--lark-danger-strong-hover)] aria-pressed:bg-lark-danger-soft aria-pressed:text-[var(--lark-danger-strong-pressed)]",
          "aria-pressed:hover:bg-[var(--lark-danger-fill-solid-03)] aria-pressed:active:bg-[var(--lark-danger-fill-solid-03)]",
          "dark:aria-pressed:bg-lark-danger-soft dark:aria-pressed:text-[var(--lark-tag-text-danger)]",
          "aria-pressed:data-[disabled]:border-[var(--lark-danger-content-loading)] aria-pressed:data-[disabled]:bg-lark-canvas aria-pressed:data-[disabled]:text-[var(--lark-danger-content-loading)]",
        ],
      },
      {
        appearance: "filled",
        tone: "success",
        class: [
          // G500 keeps the white label at 4.52:1 (UD's #35bd4b is 2.46:1).
          "border-[var(--lark-success-content-pressed)] bg-[var(--lark-success-content-pressed)] text-lark-on-success",
          "hover:border-[var(--lark-tag-text-success)] hover:bg-[var(--lark-tag-text-success)]",
          "aria-expanded:border-[var(--lark-tag-text-success)] aria-expanded:bg-[var(--lark-tag-text-success)]",
          "focus-visible:border-[var(--lark-tag-text-success)] focus-visible:bg-[var(--lark-tag-text-success)]",
          "active:border-[var(--lark-tag-text-success)] active:bg-[var(--lark-tag-text-success)]",
          "dark:border-[var(--lark-success-fill-loading)] dark:bg-[var(--lark-success-fill-loading)]",
          "dark:hover:border-[var(--lark-success-fill-hover)] dark:hover:bg-[var(--lark-success-fill-hover)]",
          "dark:aria-expanded:border-[var(--lark-success-fill-hover)] dark:aria-expanded:bg-[var(--lark-success-fill-hover)]",
          "dark:focus-visible:border-[var(--lark-success-fill-hover)] dark:focus-visible:bg-[var(--lark-success-fill-hover)]",
          "dark:active:border-[var(--lark-success-fill-hover)] dark:active:bg-[var(--lark-success-fill-hover)]",
          "data-[loading]:border-[var(--lark-success-content-pressed)] data-[loading]:bg-[var(--lark-success-content-pressed)]",
          "dark:data-[loading]:border-[var(--lark-success-fill-loading)] dark:data-[loading]:bg-[var(--lark-success-fill-loading)]",
          "data-[pending]:border-[var(--lark-success-content-pressed)] data-[pending]:bg-[var(--lark-success-content-pressed)]",
          "dark:data-[pending]:border-[var(--lark-success-fill-loading)] dark:data-[pending]:bg-[var(--lark-success-fill-loading)]",
          "data-[disabled]:border-lark-fill-disabled data-[disabled]:bg-lark-fill-disabled data-[disabled]:text-lark-on-success",
          "aria-pressed:border-[var(--lark-success-content-pressed)] aria-pressed:bg-lark-success-soft aria-pressed:text-[var(--lark-tag-text-success)]",
          "aria-pressed:hover:bg-[var(--lark-tag-fill-success)] aria-pressed:active:bg-[var(--lark-tag-fill-success)]",
          "dark:aria-pressed:border-[var(--lark-tag-text-success)] dark:aria-pressed:bg-lark-success-soft dark:aria-pressed:text-[var(--lark-tag-text-success)]",
          "aria-pressed:data-[disabled]:border-[var(--lark-success-content-loading)] aria-pressed:data-[disabled]:bg-lark-canvas aria-pressed:data-[disabled]:text-[var(--lark-success-content-loading)]",
        ],
      },
      {
        appearance: "filled",
        tone: "neutral",
        class: [
          "border-lark-filler bg-lark-filler text-lark-title",
          "hover:border-lark-neutral-300 hover:bg-lark-neutral-300",
          "aria-expanded:border-lark-neutral-300 aria-expanded:bg-lark-neutral-300",
          "focus-visible:border-lark-neutral-300 focus-visible:bg-lark-neutral-300",
          "active:border-lark-neutral-350 active:bg-lark-neutral-350",
          "data-[loading]:bg-lark-neutral-200 data-[pending]:bg-lark-neutral-200",
          "data-[disabled]:border-lark-fill-disabled data-[disabled]:bg-lark-fill-disabled data-[disabled]:text-lark-on-primary",
          "aria-pressed:border-lark-border aria-pressed:bg-lark-filler aria-pressed:text-lark-title",
          "aria-pressed:hover:bg-lark-neutral-300 aria-pressed:active:bg-lark-neutral-350",
          "aria-pressed:data-[disabled]:border-lark-border aria-pressed:data-[disabled]:bg-lark-canvas aria-pressed:data-[disabled]:text-lark-disabled",
        ],
      },
      {
        appearance: "outlined",
        tone: "primary",
        class: [
          "border-lark-primary bg-lark-canvas text-lark-primary-content",
          "hover:bg-lark-primary-soft aria-expanded:bg-lark-primary-soft",
          "focus-visible:bg-lark-primary-soft",
          "active:bg-lark-primary-softer",
          "data-[loading]:border-lark-primary-loading data-[loading]:bg-lark-canvas data-[loading]:text-lark-primary-loading",
          "data-[pending]:border-lark-primary-loading data-[pending]:bg-lark-canvas data-[pending]:text-lark-primary-loading",
          "data-[disabled]:border-lark-border data-[disabled]:bg-lark-canvas data-[disabled]:text-lark-disabled",
          "aria-pressed:border-lark-primary aria-pressed:bg-lark-primary-soft aria-pressed:text-lark-primary-content",
          "aria-pressed:hover:bg-lark-primary-softer aria-pressed:active:bg-[var(--lark-primary-fill-transparent-03)]",
          "dark:aria-pressed:bg-[var(--lark-primary-fill-transparent-01)] dark:aria-pressed:text-[var(--lark-primary-content-pressed)]",
          "aria-pressed:data-[disabled]:border-[var(--lark-primary-loading)] aria-pressed:data-[disabled]:bg-lark-canvas aria-pressed:data-[disabled]:text-[var(--lark-primary-loading)]",
        ],
      },
      {
        appearance: "outlined",
        tone: "neutral",
        class: [
          "border-lark-border bg-lark-canvas text-lark-title",
          "hover:bg-[var(--lark-fill-hover)] aria-expanded:bg-[var(--lark-fill-hover)]",
          "focus-visible:bg-[var(--lark-fill-hover)]",
          "active:bg-[var(--lark-fill-pressed)]",
          "data-[loading]:text-lark-placeholder data-[pending]:text-lark-placeholder",
          "data-[disabled]:border-lark-border data-[disabled]:bg-lark-canvas data-[disabled]:text-lark-disabled",
          "aria-pressed:border-lark-border aria-pressed:bg-lark-filler aria-pressed:text-lark-title",
          "aria-pressed:hover:bg-lark-neutral-300 aria-pressed:active:bg-lark-neutral-350",
          "aria-pressed:data-[disabled]:border-lark-border aria-pressed:data-[disabled]:bg-lark-canvas aria-pressed:data-[disabled]:text-lark-disabled",
        ],
      },
      {
        appearance: "outlined",
        tone: "danger",
        class: [
          "border-lark-danger bg-lark-canvas text-lark-danger-strong",
          "hover:bg-lark-danger-soft aria-expanded:bg-lark-danger-soft",
          "focus-visible:bg-lark-danger-soft",
          "active:bg-lark-danger-solid-03",
          "data-[loading]:border-lark-danger-loading data-[loading]:text-lark-danger-loading",
          "data-[pending]:border-lark-danger-loading data-[pending]:text-lark-danger-loading",
          "data-[disabled]:border-lark-border data-[disabled]:text-lark-disabled",
          "aria-pressed:border-[var(--lark-danger-strong-hover)] aria-pressed:bg-lark-danger-soft aria-pressed:text-[var(--lark-danger-strong-pressed)]",
          "dark:aria-pressed:text-[var(--lark-tag-text-danger)]",
          "aria-pressed:data-[disabled]:border-[var(--lark-danger-content-loading)] aria-pressed:data-[disabled]:bg-lark-canvas aria-pressed:data-[disabled]:text-[var(--lark-danger-content-loading)]",
        ],
      },
      {
        appearance: "outlined",
        tone: "success",
        class: [
          "border-[var(--lark-success-content-pressed)] bg-lark-canvas text-[var(--lark-success-content-pressed)]",
          "hover:bg-lark-success-soft hover:text-[var(--lark-tag-text-success)]",
          "aria-expanded:bg-lark-success-soft aria-expanded:text-[var(--lark-tag-text-success)]",
          "focus-visible:bg-lark-success-soft focus-visible:text-[var(--lark-tag-text-success)]",
          "active:bg-[var(--lark-tag-fill-success)]",
          "dark:border-[var(--lark-tag-text-success)] dark:text-[var(--lark-tag-text-success)]",
          "data-[loading]:border-[var(--lark-success-content-loading)] data-[loading]:text-[var(--lark-success-content-loading)]",
          "data-[pending]:border-[var(--lark-success-content-loading)] data-[pending]:text-[var(--lark-success-content-loading)]",
          "data-[disabled]:border-lark-border data-[disabled]:text-lark-disabled",
          "aria-pressed:border-[var(--lark-success-content-pressed)] aria-pressed:bg-lark-success-soft aria-pressed:text-[var(--lark-tag-text-success)]",
          "dark:aria-pressed:border-[var(--lark-tag-text-success)] dark:aria-pressed:text-[var(--lark-tag-text-success)]",
          "aria-pressed:data-[disabled]:border-[var(--lark-success-content-loading)] aria-pressed:data-[disabled]:bg-lark-canvas aria-pressed:data-[disabled]:text-[var(--lark-success-content-loading)]",
        ],
      },
      {
        appearance: "text",
        tone: "primary",
        class: [
          "text-lark-primary-content",
          "hover:bg-[var(--lark-primary-fill-transparent-01)]",
          "aria-expanded:bg-[var(--lark-primary-fill-transparent-01)]",
          "focus-visible:bg-[var(--lark-primary-fill-transparent-01)]",
          "active:bg-[var(--lark-primary-fill-transparent-03)]",
          "data-[loading]:text-lark-primary-loading data-[pending]:text-lark-primary-loading",
          "data-[disabled]:text-lark-disabled",
          "aria-pressed:bg-lark-primary-soft aria-pressed:text-lark-primary-content",
          "dark:aria-pressed:bg-[var(--lark-primary-fill-transparent-01)] dark:aria-pressed:text-[var(--lark-primary-content-pressed)]",
          "aria-pressed:hover:bg-lark-primary-softer dark:aria-pressed:hover:bg-[var(--lark-primary-fill-solid-02)]",
        ],
      },
      {
        appearance: "text",
        tone: "neutral",
        class: [
          "text-lark-title",
          "hover:bg-[var(--lark-fill-hover)] aria-expanded:bg-[var(--lark-fill-hover)]",
          "focus-visible:bg-[var(--lark-fill-hover)]",
          "active:bg-[var(--lark-fill-pressed)]",
          "data-[loading]:text-lark-placeholder data-[pending]:text-lark-placeholder",
          "data-[disabled]:text-lark-disabled",
          "aria-pressed:bg-[var(--lark-fill-hover)] aria-pressed:text-lark-title",
          "aria-pressed:hover:bg-[var(--lark-fill-pressed)]",
        ],
      },
      {
        appearance: "text",
        tone: "danger",
        class: [
          "text-lark-danger-strong",
          "hover:bg-[var(--lark-danger-fill-transparent-01)]",
          "aria-expanded:bg-[var(--lark-danger-fill-transparent-01)]",
          "focus-visible:bg-[var(--lark-danger-fill-transparent-01)]",
          "active:bg-[var(--lark-danger-fill-transparent-03)]",
          "data-[loading]:text-lark-danger-loading data-[pending]:text-lark-danger-loading",
          "data-[disabled]:text-lark-disabled",
          "aria-pressed:bg-lark-danger-soft aria-pressed:text-[var(--lark-danger-strong-pressed)]",
          "dark:aria-pressed:text-[var(--lark-tag-text-danger)]",
          "aria-pressed:hover:bg-[var(--lark-danger-fill-solid-03)]",
        ],
      },
      {
        appearance: "text",
        tone: "success",
        class: [
          "text-[var(--lark-success-content-pressed)] dark:text-[var(--lark-tag-text-success)]",
          "hover:bg-[var(--lark-success-fill-transparent-01)] hover:text-[var(--lark-tag-text-success)]",
          "aria-expanded:bg-[var(--lark-success-fill-transparent-01)]",
          "focus-visible:bg-[var(--lark-success-fill-transparent-01)]",
          "active:bg-[var(--lark-tag-fill-success)]",
          "data-[loading]:text-[var(--lark-success-content-loading)] data-[pending]:text-[var(--lark-success-content-loading)]",
          "data-[disabled]:text-lark-disabled",
          "aria-pressed:bg-lark-success-soft aria-pressed:text-[var(--lark-tag-text-success)]",
          "aria-pressed:hover:bg-[var(--lark-tag-fill-success)]",
        ],
      },
      {
        appearance: "link",
        tone: "primary",
        class: [
          "text-lark-link",
          "hover:text-lark-link-hover aria-expanded:text-lark-link-hover",
          "focus-visible:text-lark-link-hover",
          "active:text-lark-link-pressed",
          "data-[loading]:text-lark-primary-loading data-[pending]:text-lark-primary-loading",
          "data-[disabled]:text-lark-disabled",
          "aria-pressed:text-lark-link-hover",
        ],
      },
      {
        appearance: "link",
        tone: "neutral",
        class: [
          "text-lark-title",
          "hover:text-lark-caption aria-expanded:text-lark-caption",
          "focus-visible:text-lark-caption",
          "active:text-lark-title",
          "data-[loading]:text-lark-placeholder data-[pending]:text-lark-placeholder",
          "data-[disabled]:text-lark-disabled",
          "aria-pressed:text-lark-caption",
        ],
      },
      {
        appearance: "link",
        tone: "danger",
        class: [
          "text-lark-danger-strong",
          "hover:text-lark-danger-strong-hover aria-expanded:text-lark-danger-strong-hover",
          "focus-visible:text-lark-danger-strong-hover",
          "active:text-lark-danger-pressed",
          "data-[loading]:text-lark-danger-loading data-[pending]:text-lark-danger-loading",
          "data-[disabled]:text-lark-disabled",
          "aria-pressed:text-lark-danger-strong-pressed",
        ],
      },
      {
        appearance: "link",
        tone: "success",
        class: [
          "text-[var(--lark-success-content-pressed)] dark:text-[var(--lark-tag-text-success)]",
          "hover:text-[var(--lark-tag-text-success)] aria-expanded:text-[var(--lark-tag-text-success)]",
          "focus-visible:text-[var(--lark-tag-text-success)]",
          "active:text-[var(--lark-success-content-default)]",
          "data-[loading]:text-[var(--lark-success-content-loading)] data-[pending]:text-[var(--lark-success-content-loading)]",
          "data-[disabled]:text-lark-disabled",
          "aria-pressed:text-[var(--lark-tag-text-success)]",
        ],
      },
      {
        appearance: "icon",
        tone: "primary",
        class: [
          "text-lark-primary-content",
          "hover:bg-[var(--lark-primary-fill-transparent-01)]",
          "aria-expanded:bg-[var(--lark-primary-fill-transparent-01)]",
          "focus-visible:bg-[var(--lark-primary-fill-transparent-01)]",
          "active:bg-[var(--lark-primary-fill-transparent-03)]",
          "data-[loading]:text-lark-primary-loading data-[pending]:text-lark-primary-loading",
          "data-[disabled]:text-lark-icon-disabled",
          "aria-pressed:bg-lark-primary-soft aria-pressed:text-lark-primary-content",
          "dark:aria-pressed:bg-[var(--lark-primary-fill-transparent-01)] dark:aria-pressed:text-[var(--lark-primary-content-pressed)]",
          "aria-pressed:hover:bg-lark-primary-softer dark:aria-pressed:hover:bg-[var(--lark-primary-fill-solid-02)]",
        ],
      },
      {
        appearance: "icon",
        tone: "neutral",
        class: [
          "text-lark-icon-1",
          "hover:bg-[var(--lark-fill-hover)] aria-expanded:bg-[var(--lark-fill-hover)]",
          "focus-visible:bg-[var(--lark-fill-hover)]",
          "active:bg-[var(--lark-fill-pressed)]",
          "data-[loading]:text-lark-placeholder data-[pending]:text-lark-placeholder",
          "data-[disabled]:text-lark-icon-disabled",
          "aria-pressed:bg-[var(--lark-fill-hover)] aria-pressed:text-lark-icon-1",
          "aria-pressed:hover:bg-[var(--lark-fill-pressed)]",
        ],
      },
      {
        appearance: "icon",
        tone: "danger",
        class: [
          "text-lark-danger-strong",
          "hover:bg-[var(--lark-danger-fill-transparent-01)]",
          "aria-expanded:bg-[var(--lark-danger-fill-transparent-01)]",
          "focus-visible:bg-[var(--lark-danger-fill-transparent-01)]",
          "active:bg-[var(--lark-danger-fill-transparent-03)]",
          "data-[loading]:text-lark-danger-loading data-[pending]:text-lark-danger-loading",
          "data-[disabled]:text-lark-icon-disabled",
          "aria-pressed:bg-lark-danger-soft aria-pressed:text-[var(--lark-danger-strong-pressed)]",
          "dark:aria-pressed:text-[var(--lark-tag-text-danger)]",
          "aria-pressed:hover:bg-[var(--lark-danger-fill-solid-03)]",
        ],
      },
      {
        appearance: "icon",
        tone: "success",
        class: [
          "text-[var(--lark-success-content-pressed)] dark:text-[var(--lark-tag-text-success)]",
          "hover:bg-[var(--lark-success-fill-transparent-01)] hover:text-[var(--lark-tag-text-success)]",
          "aria-expanded:bg-[var(--lark-success-fill-transparent-01)]",
          "focus-visible:bg-[var(--lark-success-fill-transparent-01)]",
          "active:bg-[var(--lark-tag-fill-success)]",
          "data-[loading]:text-[var(--lark-success-content-loading)] data-[pending]:text-[var(--lark-success-content-loading)]",
          "data-[disabled]:text-lark-icon-disabled",
          "aria-pressed:bg-lark-success-soft aria-pressed:text-[var(--lark-tag-text-success)]",
          "aria-pressed:hover:bg-[var(--lark-tag-fill-success)]",
        ],
      },
    ],
  },
);

const controlMetrics: Record<ButtonSize, string> = {
  xs: "h-6 min-w-12 px-[7px] py-px text-lark-12",
  sm: "h-7 min-w-12 px-[7px] py-[3px] text-lark-12",
  md: "h-8 min-w-20 px-[11px] py-1 text-lark-14",
  lg: "h-10 min-w-24 px-[15px] py-[7px] text-lark-16",
  xl: "h-12 min-w-[100px] px-[15px] py-[10px] text-lark-18",
};

const textMetrics: Record<ButtonSize, string> = {
  xs: "px-1 py-0.5 text-lark-12",
  sm: "px-1 py-0.5 text-lark-12",
  md: "px-1 py-0.5 text-lark-14",
  lg: "px-1 py-0.5 text-lark-16",
  xl: "px-1 py-0.5 text-lark-18",
};

const linkMetrics: Record<ButtonSize, string> = {
  xs: "text-lark-12",
  sm: "text-lark-12",
  md: "text-lark-14",
  lg: "text-lark-16",
  xl: "text-lark-18",
};

const iconMetrics: Record<ButtonSize, string> = {
  xs: "size-6 p-0 text-lark-12",
  sm: "size-7 p-0 text-lark-12",
  md: "size-8 p-0 text-lark-14",
  lg: "size-10 p-0 text-lark-16",
  xl: "size-12 p-0 text-lark-18",
};

const spinnerSize: Record<ButtonSize, number> = {
  xs: 12,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
};

export type ButtonVisualProps = {
  appearance?: ButtonAppearance;
  tone?: ButtonTone;
  size?: ButtonSize;
  shape?: ButtonShape;
  block?: boolean;
};

/**
 * Shared metrics and UD state styles for every button form. `Button` and
 * `ToggleButton` both render through this, so a segmented toggle matches the
 * plain button in the same row.
 */
export function getButtonClassName({
  appearance = "filled",
  tone = "primary",
  size = "md",
  shape = "default",
  block = false,
}: ButtonVisualProps) {
  const square = appearance === "icon" || shape === "circle";
  const metrics = square
    ? iconMetrics[size]
    : appearance === "link"
      ? linkMetrics[size]
      : appearance === "text"
        ? textMetrics[size]
        : controlMetrics[size];

  const shapeClass =
    shape === "round" || shape === "circle" ? "rounded-lark-full" : "rounded-lark-md";

  return cn(
    buttonStyles({ appearance, tone }),
    metrics,
    shapeClass,
    block && "w-full",
    appearance === "icon" && "gap-0",
  );
}

type UiButtonProps = ComponentProps<typeof UiButton>;

export type ButtonProps = Omit<UiButtonProps, "children"> &
  ButtonVisualProps & {
    loading?: boolean;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    children?: ReactNode;
    /**
     * The UD Selected type for toggle buttons. Sets `aria-pressed`; hover then
     * stacks on the selected fill, as the design spec asks.
     */
    selected?: boolean;
    ref?: Ref<HTMLButtonElement>;
  };

export function Button({
  appearance = "filled",
  tone = "primary",
  size = "md",
  shape = "default",
  block = false,
  loading = false,
  selected,
  startIcon,
  endIcon,
  className,
  children,
  ref,
  onClick,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <UiButton
      {...props}
      ref={ref}
      disabled={disabled}
      aria-pressed={selected ?? props["aria-pressed"]}
      onClick={
        loading
          ? (event) => {
              event.preventDefault();
              event.stopPropagation();
            }
          : onClick
      }
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      data-loading={loading ? "" : undefined}
      className={(state) =>
        cn(
          getButtonClassName({ appearance, tone, size, shape, block }),
          typeof className === "function" ? className(state) : className,
        )
      }
    >
      {(state) => {
        const busy = loading || state.pending;
        return (
          <>
            {busy ? <SpinnerIcon size={spinnerSize[size]} /> : startIcon}
            {appearance === "icon" && busy ? null : children}
            {!busy && endIcon}
          </>
        );
      }}
    </UiButton>
  );
}
