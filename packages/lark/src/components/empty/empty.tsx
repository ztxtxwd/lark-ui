import { CheckIcon, CopyIcon } from "../../icons/phosphor";
import { useCallback } from "react";
import { Button } from "../../components/button";
import { Text } from "../../components/text";
import { cn } from "../../utils/cn";
import { resolveVariant } from "../../utils/resolve-variant";
import { useCopyFeedback } from "../../utils/use-copy-feedback";

/** Empty state size variant definitions mapping sizes to their Tailwind classes. */
export const LARK_EMPTY_VARIANTS = {
  size: {
    sm: {
      classes: "px-6 py-8 gap-4",
      description: "Compact empty state for smaller containers",
    },
    base: {
      classes: "px-10 py-16 gap-4",
      description: "Default empty state size",
    },
    lg: {
      classes: "px-12 py-20 gap-4",
      description: "Large empty state for prominent placement",
    },
  },
} as const;

export const LARK_EMPTY_DEFAULT_VARIANTS = {
  size: "base",
} as const;

export type LarkEmptySize = keyof typeof LARK_EMPTY_VARIANTS.size;

export interface LarkEmptyVariantsProps {
  /**
   * Size of the empty state container.
   * - `"sm"` — Compact empty state for smaller containers
   * - `"base"` — Default empty state size
   * - `"lg"` — Large empty state for prominent placement
   * @default "base"
   */
  size?: LarkEmptySize;
}

export function emptyVariants({
  size = LARK_EMPTY_DEFAULT_VARIANTS.size,
}: LarkEmptyVariantsProps = {}) {
  return cn(
    // Feishu empty states are centred, use the default text colour and keep a
    // 16px gap between the illustration, the copy and the actions.
    "mx-auto flex w-full flex-col items-center rounded-xl border border-lark-line bg-lark-control text-center text-base text-lark-default",
    resolveVariant(
      LARK_EMPTY_VARIANTS.size,
      size,
      LARK_EMPTY_DEFAULT_VARIANTS.size,
    ).classes,
  );
}

/**
 * Empty state component props.
 *
 * @example
 * ```tsx
 * <Empty
 *   icon={<PackageIcon size={48} />}
 *   title="No packages found"
 *   description="Get started by installing your first package."
 *   commandLine="npm install @lark-ui/core"
 * />
 * ```
 */
export interface EmptyProps extends LarkEmptyVariantsProps {
  /** Decorative icon displayed above the title (e.g. from `@phosphor-icons/react`). */
  icon?: React.ReactNode;
  /** Primary heading text for the empty state. */
  title: string;
  /** Secondary description text displayed below the title. */
  description?: string;
  /** Shell command displayed in a copyable code block. */
  commandLine?: string;
  /** Additional content (buttons, links) rendered below the description. */
  contents?: React.ReactNode;
  /** Additional CSS classes merged via `cn()`. */
  className?: string;
}

/**
 * Placeholder shown when a list, table, or page has no content to display.
 *
 * @example
 * ```tsx
 * <Empty title="No results found" description="Try adjusting your search." />
 * ```
 */
export function Empty({
  icon,
  title,
  description,
  commandLine,
  contents,
  size = "base",
  className,
}: EmptyProps) {
  const { copied: emptyStateCopied, runCopy } = useCopyFeedback(1000);

  const handleCopy = useCallback(async () => {
    if (!commandLine) return;

    await runCopy(
      () => navigator.clipboard.writeText(commandLine),
      (error) => console.warn("Clipboard copy failed", error),
    );
  }, [commandLine, runCopy]);

  return (
    <div className={cn(emptyVariants({ size }), className)}>
      {icon}
      {/* Feishu: the title uses the default text colour and the description the
          caption colour, separated by 4px. */}
      <div className="flex max-w-[250px] flex-col items-center gap-1">
        <Text variant="body" size="base" as="h2">
          {title}
        </Text>

        {description && (
          <Text
            variant="secondary"
            size="base"
            DANGEROUS_className="text-center text-balance leading-normal"
          >
            {description}
          </Text>
        )}
      </div>

      {commandLine && (
        <div
          className={cn(
            "relative inline-flex h-10 max-w-8/10 transform-gpu items-center gap-2 rounded-lg border border-white bg-lark-overlay pr-2 pl-3 font-mono shadow-lark-xs ring ring-lark-line",
          )}
        >
          <span className="inline-flex min-w-0 items-baseline gap-2">
            <span className="text-lark-subtle select-none">$</span>
            <span className="no-scrollbar overflow-scroll text-base whitespace-nowrap">
              {commandLine}
            </span>
          </span>
          <Button
            className="text-lark-subtle"
            size="sm"
            variant="ghost"
            shape="square"
            aria-label="Copy command"
            onClick={handleCopy}
          >
            {emptyStateCopied ? (
              <CheckIcon
                size={16}
                className="animate-bounce-in text-lark-success"
              />
            ) : (
              <CopyIcon size={16} />
            )}
          </Button>
        </div>
      )}

      {contents}
    </div>
  );
}
