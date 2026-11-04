import { type FC, useMemo, useSyncExternalStore } from "react";
import { larkColors, type ColorToken } from "virtual:lark-colors";
import { larkRegistryJson } from "virtual:lark-registry";
import { WarningIcon } from "@phosphor-icons/react";

/**
 * Extract the actual color value from a CSS variable fallback.
 * e.g., "var(--color-neutral-900, oklch(21% 0.006 285.885))" -> "oklch(21% 0.006 285.885)"
 */
function extractColorValue(value: string): string {
  // Match var(--name, fallback) and extract the fallback
  const varMatch = value.match(/^var\([^,]+,\s*(.+)\)$/);
  return varMatch ? varMatch[1] : value;
}

/**
 * Convert a color string to hex.
 * Uses the browser's canvas API for accurate color conversion.
 */
function colorToHex(color: string): string | null {
  if (typeof document === "undefined") return null;

  const actualColor = extractColorValue(color);

  // Skip if already hex or simple values
  if (actualColor.startsWith("#") || actualColor === "transparent") return null;

  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = actualColor;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  } catch {
    return null;
  }
}

/**
 * Displays a color swatch with both the original value and converted hex.
 */
const ColorSwatch: FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  const hex = useMemo(() => colorToHex(value), [value]);

  return (
    <div className="flex min-w-0 items-start gap-2">
      <span
        className="inline-flex h-8 w-8 shrink-0 rounded border border-lark-fill"
        style={{ background: value }}
      />
      <div className="flex min-w-0 flex-col text-xs text-lark-default">
        <span className="text-[10px] tracking-wide uppercase opacity-70">
          {label}
        </span>
        <span className="text-[10px] leading-tight break-normal opacity-60">
          {value}
          {hex && (
            <span className="ml-1 font-mono font-medium text-lark-default">
              {hex}
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

type TokenCategory = "colors" | "text-colors";

function getTokenCategory(name: string): TokenCategory {
  const lower = name.toLowerCase();
  return lower.startsWith("--text-color-") ? "text-colors" : "colors";
}

// Subscribe to data-theme attribute changes on document.body
function subscribeToTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getTheme(): string {
  return document.body.getAttribute("data-theme") ?? "lark";
}

function useCurrentTheme(): string {
  return useSyncExternalStore(subscribeToTheme, getTheme, () => "lark");
}

/**
 * Build a set of lowercase component names from the registry.
 * Cached once — the registry doesn't change at runtime.
 */
const componentNames: Set<string> = new Set(
  Object.keys(larkRegistryJson.components).map((n) => n.toLowerCase()),
);

/**
 * Extract the component name from a token, if it matches a known component.
 *
 * Token format: `--color-lark-{component}-{variant}` or `--text-color-lark-{component}-{variant}`
 * Returns the matched component name (lowercase) or null.
 */
function getComponentFromToken(tokenName: string): string | null {
  // Strip the CSS variable prefix to get the semantic name
  // "--color-lark-badge-red" → "lark-badge-red"
  // "--text-color-lark-badge-red-subtle" → "lark-badge-red-subtle"
  const semantic = tokenName
    .replace(/^--text-color-/, "")
    .replace(/^--color-/, "");

  // Must start with "lark-"
  if (!semantic.startsWith("lark-")) return null;

  // "lark-badge-red" → "badge-red" → check if "badge" is a component
  const afterLark = semantic.slice("lark-".length);
  const segments = afterLark.split("-");

  // Require at least 2 segments: component name + variant.
  // This avoids matching standalone semantic tokens like "lark-link" or "lark-surface".
  if (segments.length < 2) return null;

  return componentNames.has(segments[0]) ? segments[0] : null;
}

type ComponentColorGroup = {
  component: string;
  displayName: string;
  tokens: ColorToken[];
};

type ColorsByCategory = {
  textColors: ColorToken[];
  colors: ColorToken[];
  componentGroups: ComponentColorGroup[];
};

/**
 * Get effective colors for the current theme, organized by category.
 *
 * Returns:
 * - All semantic tokens (base lark tokens)
 * - All global tokens (always shown - these are explicit opt-in classes)
 * - Semantic overrides applied when theme !== "lark"
 */
function getColorsForTheme(theme: string): ColorsByCategory {
  // Get base semantic tokens
  const semanticTokens = larkColors.filter(
    (c) => c.tokenType === "semantic" && c.theme === "lark",
  );

  // Get ALL global tokens (they're always available as explicit Tailwind classes)
  const globalTokens = larkColors.filter((c) => c.tokenType === "global");

  let effectiveTokens: ColorToken[];

  // For lark theme, just return semantic + global tokens
  if (theme === "lark") {
    effectiveTokens = [...semanticTokens, ...globalTokens];
  } else {
    // For other themes, apply semantic overrides
    const overrideTokens = larkColors.filter(
      (c) => c.tokenType === "override" && c.theme === theme,
    );

    // Create a map of overrides for quick lookup
    const overrideMap = new Map(overrideTokens.map((c) => [c.name, c]));

    // Replace semantic tokens with overrides where they exist
    const effectiveSemanticTokens = semanticTokens.map(
      (base) => overrideMap.get(base.name) ?? base,
    );

    effectiveTokens = [...effectiveSemanticTokens, ...globalTokens];
  }

  // Partition: component-specific tokens vs semantic tokens
  const componentTokenMap = new Map<string, ColorToken[]>();
  const semanticTokens2: ColorToken[] = [];

  for (const token of effectiveTokens) {
    const comp = getComponentFromToken(token.name);
    if (comp) {
      const list = componentTokenMap.get(comp) ?? [];
      list.push(token);
      componentTokenMap.set(comp, list);
    } else {
      semanticTokens2.push(token);
    }
  }

  // Build sorted component groups with display names from the registry
  const componentGroups: ComponentColorGroup[] = [
    ...componentTokenMap.entries(),
  ]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([comp, tokens]) => {
      // Find the proper-cased name from the registry
      const registryName = Object.keys(larkRegistryJson.components).find(
        (n) => n.toLowerCase() === comp,
      );
      return {
        component: comp,
        displayName:
          registryName ?? comp.charAt(0).toUpperCase() + comp.slice(1),
        tokens,
      };
    });

  // Split remaining semantic tokens by category
  return {
    textColors: semanticTokens2.filter(
      (c) => getTokenCategory(c.name) === "text-colors",
    ),
    colors: semanticTokens2.filter(
      (c) => getTokenCategory(c.name) === "colors",
    ),
    componentGroups,
  };
}

const TokenGrid: FC<{ tokens: ColorToken[] }> = ({ tokens }) => (
  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-2">
    {tokens.map((token: ColorToken) => (
      <div
        key={token.name}
        className={`flex min-w-0 items-center gap-3 rounded-md border bg-lark-base px-3 py-2 text-xs ${
          token.tokenType === "global"
            ? "border border-lark-info ring-1 ring-lark-info/30"
            : "border-lark-fill"
        }`}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-medium break-normal">
              {token.name}
            </span>
            {token.tokenType === "global" && (
              <span className="rounded bg-lark-info/20 px-1.5 py-0.5 text-[10px] font-medium text-lark-link">
                全局
              </span>
            )}
          </div>
          <ColorSwatch label="浅色" value={token.light} />
          <ColorSwatch label="深色" value={token.dark} />
        </div>
      </div>
    ))}
  </div>
);

export const TailwindColorTokens: FC = () => {
  const currentTheme = useCurrentTheme();
  const { textColors, colors, componentGroups } =
    getColorsForTheme(currentTheme);

  const componentTokenCount = componentGroups.reduce(
    (sum, g) => sum + g.tokens.length,
    0,
  );
  const allTokens = [...textColors, ...colors];

  // Count override tokens for display
  const overrideCount =
    currentTheme !== "lark"
      ? larkColors.filter(
          (c) => c.tokenType === "override" && c.theme === currentTheme,
        ).length
      : 0;

  return (
    <div className="flex flex-col gap-6 text-lark-default">
      <div className="flex flex-col gap-1">
        <h2 className="m-0 text-2xl font-semibold">颜色</h2>
        <div className="text-sm text-lark-default">
          共显示 {allTokens.length + componentTokenCount} 个 token
          {overrideCount > 0 && (
            <span className="ml-1">
              — {overrideCount} 个已被{" "}
              <code className="rounded bg-lark-brand p-1">{currentTheme}</code>{" "}
              覆盖
            </span>
          )}
        </div>
      </div>

      {/* Text Colors Section */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">
          文本颜色（{textColors.length}）
        </h2>
        <TokenGrid tokens={textColors} />
      </section>

      {/* Surface, State, and Theme Colors Section */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">
          表面层级、状态与主题颜色（{colors.length}）
        </h2>
        <TokenGrid tokens={colors} />
      </section>

      {/* Component Colors Section */}
      {componentGroups.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold">
            组件颜色（{componentTokenCount}）
          </h2>
          {componentGroups.map((group) => (
            <div key={group.component} className="flex flex-col gap-3">
              <h3 className="!m-0 text-xs font-semibold text-lark-subtle">
                {group.displayName} ({group.tokens.length})
              </h3>
              <TokenGrid tokens={group.tokens} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export function StatusBannerDemo() {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-lark-danger-tint/70 p-4">
      <WarningIcon weight="fill" className="fill-lark-danger" />
      <span className="text-sm text-lark-danger">出错了。</span>
    </div>
  );
}
