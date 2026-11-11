import {
  createContext,
  useContext,
  type ReactNode,
  type RefObject,
} from "react";

/**
 * Portal container type - matches Base UI's FloatingPortal container prop.
 * Supports HTMLElement, ShadowRoot, or a ref to either.
 */
export type PortalContainer =
  HTMLElement | ShadowRoot | null | RefObject<HTMLElement | ShadowRoot | null>;

const PortalContainerContext = createContext<PortalContainer>(null);

/**
 * LarkPortalProvider — sets the default portal container for all Lark overlay components.
 *
 * Use this to render Lark overlays (Dialog, Tooltip, DropdownMenu, Select, Combobox,
 * Popover, CommandPalette, Toast) inside a Shadow DOM or custom container.
 *
 * When not provided, overlays portal to an out-of-flow host element that Lark
 * keeps at the document origin (see `getPortalHost`). This behaves like
 * `document.body` for consumers — overlay stacking, `fixed` backdrops and
 * viewport-relative positioning are unchanged — but the popups no longer add
 * scroll height to the document or get positioned against a container sitting
 * at the end of `<body>`.
 *
 * Individual components can override this via their own `container` prop.
 *
 * For app-wide portal stacking, consumers should set `isolation: isolate` on
 * their app root (not `<body>`). Do not add z-index workarounds to Lark's
 * portaled components or target Base UI internal data attributes.
 *
 * @example Shadow DOM usage
 * ```tsx
 * function WebComponent() {
 *   const shadowRef = useRef<ShadowRoot>(null);
 *
 *   useEffect(() => {
 *     shadowRef.current = hostElement.attachShadow({ mode: 'open' });
 *   }, []);
 *
 *   return (
 *     <LarkPortalProvider container={shadowRef.current}>
 *       <App />
 *     </LarkPortalProvider>
 *   );
 * }
 * ```
 *
 * @example Custom container
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 *
 * <div ref={containerRef}>
 *   <LarkPortalProvider container={containerRef}>
 *     <Dialog.Root>...</Dialog.Root>
 *   </LarkPortalProvider>
 * </div>
 * ```
 */
export function LarkPortalProvider({
  container,
  children,
}: {
  /** The container element or ShadowRoot to portal overlays into. */
  container: PortalContainer;
  children: ReactNode;
}) {
  return (
    <PortalContainerContext.Provider value={container}>
      {children}
    </PortalContainerContext.Provider>
  );
}

/** Marks the generated portal host so it can be reused after HMR. */
const PORTAL_HOST_ATTRIBUTE = "data-lark-portal-host";

/**
 * The default portal host is an out-of-flow anchor at the document origin.
 *
 * Portals used to be created straight into `<body>`, which put an empty block
 * element after the app root. The positioner inside it is `position: absolute`
 * and is measured one frame later, so on the first paint its coordinates were
 * resolved against a container sitting at the *end of the document*. Two things
 * went wrong because of that:
 *
 * 1. The popup was painted below the fold and grew the document scroll height,
 *    so a vertical scrollbar flashed in, the viewport got narrower and every
 *    right-aligned control shifted sideways. Hover-opened popups read that
 *    shift as the pointer leaving the trigger and closed themselves.
 * 2. The popup jumped from the wrong place to the right one on the next frame.
 *
 * An out-of-flow anchor at the origin adds no scroll height and is already at
 * the offset parent's origin, so the first computed position is the final one.
 *
 * The anchor must span the viewport, not be a 0×0 box: it is the containing
 * block for Base UI's absolutely positioned positioners, and an auto-width
 * popup inside a zero-width containing block collapses to its min-content
 * width — a Chinese tooltip ends up one character per line.
 */
const PORTAL_HOST_STYLE =
  "position:absolute;top:0;left:0;width:100%;height:0;";

let portalHost: HTMLElement | null = null;

/**
 * Returns the shared portal host, creating it on first use.
 *
 * Returns `null` outside the browser so overlays can fall back to Base UI's
 * default (`document.body`) during SSR.
 *
 * @internal
 */
export function getPortalHost(): HTMLElement | null {
  if (typeof document === "undefined") {
    return null;
  }

  if (portalHost?.isConnected) {
    return portalHost;
  }

  const existing = document.querySelector<HTMLElement>(
    `[${PORTAL_HOST_ATTRIBUTE}]`,
  );

  if (existing) {
    portalHost = existing;
    return existing;
  }

  const host = document.createElement("div");
  host.setAttribute(PORTAL_HOST_ATTRIBUTE, "");
  host.style.cssText = PORTAL_HOST_STYLE;
  document.body.appendChild(host);
  portalHost = host;

  return host;
}

/**
 * Hook to get the portal container from context.
 * Falls back to Lark's portal host (an out-of-flow anchor at the document
 * origin) when no `LarkPortalProvider` is present.
 *
 * @internal Used by overlay components to resolve their portal container.
 */
export function usePortalContainer(): PortalContainer {
  const container = useContext(PortalContainerContext);
  return container ?? getPortalHost();
}
