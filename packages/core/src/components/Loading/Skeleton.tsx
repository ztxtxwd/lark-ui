import { cva } from "class-variance-authority";
import type { ComponentProps, CSSProperties, ReactNode, Ref } from "react";
import { createContext, useContext } from "react";
import { cn } from "../../lib/cn";

/**
 * UD 骨架屏（Skeleton screen）— one of the three Loading animations, next to
 * Spin and the illustration. It stands in for content whose final shape can be
 * estimated and is only used for the initial empty-page load.
 *
 * Evidence:
 * - Design spec: avatars keep the real avatar's size and shape, images keep the
 *   real image's size and shape, text is as tall as its font size with
 *   Radius-XS (2px).
 * - Client CSS: `.ud__skeleton .ud__skeleton__item-content` is 14px tall;
 *   `.ud__skeleton .ud__skeleton__item-avatar` is a 32px circle; the fill is
 *   N900 at 5%, shimmering to N900 8% every 2s.
 */

/** `animation` is inherited from the nearest Skeleton so a whole screen can be static. */
const SkeletonAnimationContext = createContext(true);

export type SkeletonAvatarShape = "circle" | "square";

const avatarStyles = cva("lark-skeleton inline-flex shrink-0", {
  variants: {
    shape: {
      circle: "rounded-lark-full",
      square: "rounded-[12.5%]",
    },
  },
  defaultVariants: {
    shape: "circle",
  },
});

export type SkeletonContentShape = "text" | "image";

const contentStyles = cva("lark-skeleton", {
  variants: {
    shape: {
      /* UD text skeleton: 14px tall (same as the 14px type size), Radius-XS. */
      text: "h-3.5 w-full rounded-lark-xs",
      /* UD image skeleton: same size and shape as the image it replaces. */
      image: "w-full rounded-lark-md",
    },
  },
  defaultVariants: {
    shape: "text",
  },
});

export type SkeletonProps = Omit<ComponentProps<"div">, "children" | "ref"> & {
  /** Render the placeholder. When false the wrapped `children` are shown. */
  loading?: boolean;
  /** Run the UD 2s shimmer. Inherited by the skeleton elements. */
  animation?: boolean;
  /** Skeleton layout shown while loading. Defaults to one text line. */
  placeholder?: ReactNode;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
};

/**
 * Wraps content that is still loading. The placeholder is decorative and
 * hidden from assistive technology; the wrapper itself announces a polite
 * status, mirroring the Spin loading state.
 */
export function Skeleton({
  loading = true,
  animation = true,
  placeholder,
  children,
  className,
  ref,
  ...props
}: SkeletonProps) {
  const ariaLabel = props["aria-label"];

  if (!loading) {
    return (
      <div {...props} ref={ref} data-slot="skeleton" className={className}>
        {children}
      </div>
    );
  }

  return (
    <div
      {...props}
      ref={ref}
      data-slot="skeleton"
      data-loading=""
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={ariaLabel ?? "加载中"}
      className={className}
    >
      <SkeletonAnimationContext.Provider value={animation}>
        <div aria-hidden="true" data-slot="skeleton-placeholder">
          {placeholder ?? <SkeletonContent />}
        </div>
      </SkeletonAnimationContext.Provider>
    </div>
  );
}

export type SkeletonContentProps = Omit<ComponentProps<"div">, "children"> & {
  /** Text line (14px, 2px radius) or an image block (6px radius). */
  shape?: SkeletonContentShape;
  /** Match the real content's width. */
  width?: CSSProperties["width"];
  /** Match the real content's height; text defaults to 14px. */
  height?: CSSProperties["height"];
  /** Overrides the inherited shimmer setting. */
  animation?: boolean;
  ref?: Ref<HTMLDivElement>;
};

/** A single text line or image block in a skeleton screen. */
export function SkeletonContent({
  shape = "text",
  width,
  height,
  animation,
  className,
  style,
  ref,
  ...props
}: SkeletonContentProps) {
  const inheritedAnimation = useContext(SkeletonAnimationContext);
  const animate = animation ?? inheritedAnimation;

  return (
    <div
      {...props}
      ref={ref}
      aria-hidden="true"
      data-slot="skeleton-content"
      data-shape={shape}
      className={cn(contentStyles({ shape }), className)}
      style={{ width, height, ...style }}
    >
      {animate ? <span className="lark-skeleton-layer" /> : null}
    </div>
  );
}

export type SkeletonAvatarProps = Omit<ComponentProps<"div">, "children"> & {
  /** UD's default avatar skeleton is 32px; match the real avatar instead. */
  size?: number;
  /** Match the real avatar: people use circles, apps use squares. */
  shape?: SkeletonAvatarShape;
  /** Overrides the inherited shimmer setting. */
  animation?: boolean;
  ref?: Ref<HTMLDivElement>;
};

/** Avatar-shaped skeleton: a circle by default, 32px like the UD client. */
export function SkeletonAvatar({
  size = 32,
  shape = "circle",
  animation,
  className,
  style,
  ref,
  ...props
}: SkeletonAvatarProps) {
  const inheritedAnimation = useContext(SkeletonAnimationContext);
  const animate = animation ?? inheritedAnimation;

  return (
    <div
      {...props}
      ref={ref}
      aria-hidden="true"
      data-slot="skeleton-avatar"
      data-shape={shape}
      className={cn(avatarStyles({ shape }), className)}
      style={{ width: size, height: size, ...style }}
    >
      {animate ? <span className="lark-skeleton-layer" /> : null}
    </div>
  );
}
