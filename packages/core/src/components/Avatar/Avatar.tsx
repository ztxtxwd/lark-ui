import { cva } from "class-variance-authority";
import type { ComponentProps, ComponentPropsWithoutRef, ReactNode } from "react";
import { useState } from "react";
import { cn } from "../../lib/cn";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | number;
export type AvatarShape = "circle" | "square";

const avatarStyles = cva(
  [
    "relative box-border inline-flex shrink-0 select-none items-center justify-center",
    "overflow-hidden bg-lark-blue-500 align-middle font-medium text-lark-on-primary",
    "leading-none",
  ],
  {
    variants: {
      shape: {
        circle: "rounded-lark-full",
        square: [
          "rounded-[12.5%]",
          "before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[12.5%]",
          "before:shadow-[inset_0_0_0_1px_var(--lark-fill-tag)] before:content-['']",
        ],
      },
      size: {
        xs: "size-5 text-[10px]",
        sm: "size-6 text-[11px]",
        md: "size-8 text-lark-14",
        lg: "size-10 text-lark-18",
        xl: "size-12 text-lark-20",
        custom: "",
      },
    },
    defaultVariants: {
      shape: "circle",
      size: "md",
    },
  },
);

const CJK_PATTERN = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/;

/**
 * UD initials rules. Circle avatars are people: CJK names keep the last two
 * characters, Latin names the given-name initial plus the surname's (for
 * example "JS"). Square avatars are apps and departments: they keep the first
 * two characters of the name ("设计部" → "设计", "Acme" → "AC").
 */
function getInitials(name: string | undefined, shape: AvatarShape) {
  const trimmed = name?.trim();
  if (!trimmed) {
    return "";
  }

  if (shape === "square") {
    return Array.from(trimmed.replace(/\s+/g, "")).slice(0, 2).join("").toUpperCase();
  }

  if (CJK_PATTERN.test(trimmed)) {
    return Array.from(trimmed.replace(/\s+/g, "")).slice(-2).join("");
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return "";
  }
  if (words.length === 1) {
    return (Array.from(words[0])[0] ?? "").toUpperCase();
  }

  const first = Array.from(words[0])[0] ?? "";
  const last = Array.from(words[words.length - 1])[0] ?? "";
  return (first + last).toUpperCase();
}

function UserIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12.5a4.75 4.75 0 1 0 0-9.5 4.75 4.75 0 0 0 0 9.5Zm0 1.75c-4.28 0-7.75 2.4-7.75 5.35V21h15.5v-1.4c0-2.95-3.47-5.35-7.75-5.35Z" />
    </svg>
  );
}

type AvatarCommonProps = Omit<ComponentProps<"span">, "children"> & {
  /** Named size (20 / 24 / 32 / 40 / 48px) or a custom pixel size. */
  size?: AvatarSize;
  shape?: AvatarShape;
  /** Custom fallback content. Defaults to initials derived from `alt`. */
  fallback?: ReactNode;
  /** Icon shown when there is no image, fallback or initials. */
  icon?: ReactNode;
  children?: ReactNode;
  /** Extra props for the native image element. */
  imgProps?: Omit<ComponentPropsWithoutRef<"img">, "src" | "alt">;
};

export type AvatarProps = AvatarCommonProps &
  ({ src: string; alt: string } | { src?: undefined; alt?: string });

export function Avatar(props: AvatarProps) {
  const {
    src,
    alt,
    size = "md",
    shape = "circle",
    fallback,
    icon,
    children,
    imgProps,
    className,
    style,
    ref,
    "aria-label": ariaLabel,
    role: roleProp,
    ...rest
  } = props;

  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const hasImage = Boolean(src) && failedSrc !== src;
  const imageLoaded = hasImage && loadedSrc === src;
  const showFallback = !hasImage || !imageLoaded;

  const initials = getInitials(alt, shape);
  const content = children ?? fallback ?? icon ?? (initials || <UserIcon />);
  const accessibleLabel = ariaLabel ?? (alt?.trim() ? alt.trim() : undefined);

  const {
    className: imageClassName,
    onError: onImageError,
    onLoad: onImageLoad,
    "aria-label": imageAriaLabel,
    ...imageProps
  } = imgProps ?? {};

  const namedSize = typeof size === "number" ? undefined : size;
  const numericSize = typeof size === "number" ? Math.max(1, size) : undefined;
  const sizeVariant = namedSize ?? "custom";
  const dimensionStyle =
    numericSize === undefined
      ? undefined
      : {
          width: numericSize,
          height: numericSize,
          fontSize: Math.max(8, Math.round(numericSize * 0.44)),
        };
  const mergedStyle = dimensionStyle ? { ...dimensionStyle, ...style } : style;
  const isFallback = !hasImage;
  // An explicit role wins, so an interactive avatar (role="button") stays a
  // button when the image fails. Otherwise a labelled fallback is an image.
  const accessibilityProps = roleProp
    ? { role: roleProp, ...(accessibleLabel ? { "aria-label": accessibleLabel } : {}) }
    : isFallback && accessibleLabel
      ? { role: "img" as const, "aria-label": accessibleLabel }
      : {};

  return (
    <span
      {...rest}
      {...accessibilityProps}
      ref={ref}
      data-slot="avatar"
      data-shape={shape}
      data-size={numericSize ?? namedSize ?? "md"}
      className={cn(avatarStyles({ shape, size: sizeVariant }), className)}
      style={mergedStyle}
    >
      {hasImage ? (
        <img
          {...imageProps}
          data-slot="avatar-image"
          src={src}
          alt={alt ?? ""}
          aria-label={ariaLabel ?? imageAriaLabel}
          onLoad={(event) => {
            if (src) {
              setLoadedSrc(src);
            }
            onImageLoad?.(event);
          }}
          onError={(event) => {
            if (src) {
              setFailedSrc(src);
            }
            onImageError?.(event);
          }}
          className={cn(
            "absolute inset-0 size-full bg-lark-canvas object-cover object-[center_top]",
            imageLoaded ? "" : "opacity-0",
            imageClassName,
          )}
        />
      ) : null}
      {showFallback ? (
        <span
          data-slot="avatar-fallback"
          aria-hidden={hasImage ? "true" : undefined}
          className="flex size-full items-center justify-center whitespace-nowrap [&>svg]:size-1/2"
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
