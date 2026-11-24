import { Rating as UiRating, RatingItem as UiRatingItem } from "@ui-sdk/react/rating";
import {
  type ComponentProps,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
  type SVGProps,
  useState,
} from "react";
import { cn } from "../../lib/cn";

type UiRatingProps = ComponentProps<typeof UiRating>;
type RatingValueChange = NonNullable<UiRatingProps["onValueChange"]>;

export type RateProps = Omit<
  UiRatingProps,
  | "children"
  | "className"
  | "max"
  | "step"
  | "deselectable"
  | "value"
  | "defaultValue"
  | "onValueChange"
  | "getValueLabel"
> & {
  /** Controlled score. `null` means nothing has been rated. */
  value?: number | null;
  /** Initial score when uncontrolled. */
  defaultValue?: number | null;
  onValueChange?: RatingValueChange;
  /** Number of stars. UD default is 5. */
  count?: number;
  /** UD 0.5 step: pressing the left half of a star picks the half score. */
  allowHalf?: boolean;
  /** Allows pressing the selected score again to clear it. */
  allowClear?: boolean;
  /** Custom glyph. It is painted with `currentColor` for both layers. */
  character?: ReactNode;
  /**
   * UD instant hint copy, one per star. The hint stays after selection and is
   * shown while hovering or keyboard-focusing a star.
   */
  tooltips?: string[];
  /** Names every radio and the read-only image, including the score. */
  getValueLabel?: (value: number, max: number) => string;
  className?: string;
  ref?: Ref<HTMLDivElement>;
};

const defaultGetValueLabel = (value: number, max: number) => `${value} / ${max} 星`;

export function Rate({
  value,
  defaultValue,
  onValueChange,
  count = 5,
  allowHalf = false,
  allowClear = false,
  character,
  tooltips,
  getValueLabel = defaultGetValueLabel,
  readOnly = false,
  disabled = false,
  className,
  ref,
  "aria-label": ariaLabel,
  ...props
}: RateProps) {
  const max = Math.max(1, Math.floor(count));
  const parts = allowHalf ? 2 : 1;

  const [innerValue, setInnerValue] = useState<number | null>(defaultValue ?? null);
  const [preview, setPreview] = useState<number | null>(null);

  const displayed = preview ?? (value !== undefined ? value : innerValue);

  function handleValueChange(next: number | null, details: Parameters<RatingValueChange>[1]) {
    onValueChange?.(next, details);
    if (value === undefined && !details.canceled) {
      setInnerValue(next);
    }
  }

  function scoreFromTarget(target: EventTarget | null, root: HTMLElement) {
    if (!(target instanceof Element)) return null;
    const radio = target.closest('[role="radio"]');
    if (!radio) return null;
    const radios = Array.from(root.querySelectorAll('[role="radio"]'));
    const index = radios.indexOf(radio);
    return index < 0 ? null : (index + 1) / parts;
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (readOnly || disabled) return;
    const score = scoreFromTarget(event.target, event.currentTarget);
    if (score !== null) setPreview(score);
  }

  function handleFocusCapture(event: FocusEvent<HTMLDivElement>) {
    if (readOnly || disabled) return;
    const score = scoreFromTarget(event.target, event.currentTarget);
    if (score !== null) setPreview(score);
  }

  function handleBlurCapture(event: FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget;
    if (!(next instanceof Node) || !event.currentTarget.contains(next)) {
      setPreview(null);
    }
  }

  const hint =
    tooltips && displayed !== null && displayed > 0
      ? (tooltips[Math.ceil(displayed) - 1] ?? null)
      : null;

  const { onPointerLeave: onRatingPointerLeave, ...ratingProps } = props;

  return (
    <div
      ref={ref}
      data-slot="rate"
      data-count={max}
      data-half={allowHalf ? "" : undefined}
      className={cn("inline-flex min-w-0 flex-col", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setPreview(null)}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
    >
      <UiRating
        {...ratingProps}
        aria-label={readOnly ? ariaLabel : (ariaLabel ?? "评分")}
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        max={max}
        step={allowHalf ? 0.5 : 1}
        deselectable={allowClear}
        disabled={disabled}
        readOnly={readOnly}
        getValueLabel={getValueLabel}
        onPointerLeave={(event) => {
          setPreview(null);
          onRatingPointerLeave?.(event);
        }}
        className="group/rate inline-flex items-center gap-4"
      >
        <UiRatingItem
          className={cn(
            "group/rate-item relative inline-flex size-8 shrink-0 items-center justify-center rounded-lark-sm",
            "outline-none",
            "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-lark-primary",
            "[&>[role=radio]:focus-visible]:outline-none",
            readOnly ? "cursor-default" : disabled ? "cursor-not-allowed" : "cursor-pointer",
          )}
        >
          <StarLayers character={character} interactive={!readOnly && !disabled} />
        </UiRatingItem>
      </UiRating>
      {tooltips ? (
        <span
          data-slot="rate-hint"
          className="mt-2 block min-h-5 w-0 min-w-full text-center text-lark-12 leading-5 text-lark-caption"
        >
          {hint}
        </span>
      ) : null}
    </div>
  );
}

function StarLayers({ character, interactive }: { character?: ReactNode; interactive: boolean }) {
  const glyph = character ?? <StarGlyph className="size-7" />;
  const scale = cn(
    "flex size-8 items-center justify-center",
    "transition-transform duration-100 ease-lark-linear motion-reduce:transition-none",
    interactive && "group-hover/rate-item:scale-[1.142857]",
  );

  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center text-lark-neutral-300"
      >
        <span className={scale}>{glyph}</span>
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 overflow-hidden",
          "text-[var(--lark-colorful-yellow)]",
          "[width:calc(var(--rating-fill)*100%)]",
        )}
      >
        <span className={cn("absolute left-0 top-0", scale)}>{glyph}</span>
      </span>
    </>
  );
}

function StarGlyph({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="currentColor"
      focusable="false"
      className={className}
      {...props}
    >
      <path d="M8 1.65c.2 0 .38.11.47.29l1.62 3.28 3.62.53c.2.03.36.16.44.34.07.18.04.39-.08.54L11.45 9.2l.62 3.6c.03.2-.05.4-.21.53-.16.13-.37.15-.55.05L8 11.68l-3.31 1.7c-.18.1-.39.08-.55-.05a.55.55 0 0 1-.21-.53l.62-3.6-2.62-2.57a.55.55 0 0 1-.08-.54c.08-.18.24-.31.44-.34l3.62-.53 1.62-3.28A.53.53 0 0 1 8 1.65Z" />
    </svg>
  );
}
