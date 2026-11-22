import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vite-plus/test";
import { useEffect } from "react";
import {
  Toasty,
  createLarkToastManager,
  toastVariants,
  useLarkToastManager,
} from "./toast";

const surfaceOf = (text: string) =>
  screen
    .getByText(text)
    .closest('[role="dialog"]')
    ?.querySelector('[data-lark-part="surface"]');

const isBumping = (text: string) =>
  /animate-toast-bump/.test(surfaceOf(text)?.className ?? "");

describe("toastVariants", () => {
  it("paints the surface with the Feishu toast geometry", () => {
    const className = toastVariants();

    expect(className).toContain("rounded-lg");
    expect(className).toContain("border");
    expect(className).toContain("px-5");
    expect(className).toContain("py-4");
    expect(className).toContain("shadow-lark-popover");
  });

  it("uses a pale status tint with a 1px status border per variant", () => {
    for (const [variant, border, background] of [
      [
        "success",
        "border-lark-success-outline",
        "bg-lark-toast-success-outlined",
      ],
      ["error", "border-lark-danger-outline", "bg-lark-toast-danger-outlined"],
      [
        "warning",
        "border-lark-warning-outline",
        "bg-lark-toast-warning-outlined",
      ],
      ["info", "border-lark-info-outline", "bg-lark-toast-info-outlined"],
    ] as const) {
      const className = toastVariants({ variant });
      expect(className).toContain(border);
      expect(className).toContain(background);
    }

    // The neutral variant keeps the elevated surface with a hairline border.
    const neutral = toastVariants();
    expect(neutral).toContain("border-lark-line");
    expect(neutral).toContain("bg-lark-elevated");
  });

  it("drops the legacy notification accent bar and card surface", () => {
    const className = toastVariants({ variant: "error" });

    expect(className).not.toContain("bg-lark-notice-error");
    expect(className).not.toContain("ring-lark-line");
    expect(className).not.toContain("p-6");
  });
});

describe("Toasty", () => {
  // Feishu's toast manager dismisses toasts after `duration: 3e3`, not
  // Base UI's 5 second default.
  it("auto-dismisses after Feishu's 3 second timeout", () => {
    vi.useFakeTimers();
    try {
      const mgr = createLarkToastManager();

      render(
        <Toasty toastManager={mgr}>
          <div />
        </Toasty>,
      );

      act(() => {
        mgr.add({ title: "Short lived" });
      });

      const title = screen.getByText("Short lived");
      const root = title.closest('[role="dialog"]');
      expect(root).not.toBeNull();
      expect(root?.hasAttribute("data-ending-style")).toBe(false);

      act(() => {
        vi.advanceTimersByTime(2999);
      });
      expect(root?.hasAttribute("data-ending-style")).toBe(false);

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(root?.hasAttribute("data-ending-style")).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it("renders status toasts as bordered banners with a status icon", async () => {
    const mgr = createLarkToastManager();

    render(
      <Toasty toastManager={mgr}>
        <div />
      </Toasty>,
    );

    act(() => {
      mgr.add({
        title: "Deploy failed",
        description: "Could not connect to the server.",
        variant: "error",
      });
    });

    const title = await screen.findByText("Deploy failed");
    const surface = title.closest('[data-lark-part="surface"]');
    expect(surface?.className).toContain("border-lark-danger-outline");
    expect(surface?.className).toContain("bg-lark-toast-danger-outlined");
    expect(title.className).toContain("font-semibold");
    expect(document.querySelector("[data-toast-icon]")).toBeTruthy();
    // The old leading accent bar and default close control are gone.
    expect(document.querySelector('[data-lark-part="accent-bar"]')).toBeNull();
    expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
  });

  // Regression guard: existing callers that don't pass `toastManager`
  // must continue to work via the in-tree `useLarkToastManager` hook.
  it("renders without a toastManager prop and accepts in-tree dispatch", async () => {
    function TriggerOnMount() {
      const toasts = useLarkToastManager();
      useEffect(() => {
        toasts.add({ title: "from inside" });
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      return null;
    }

    render(
      <Toasty>
        <TriggerOnMount />
      </Toasty>,
    );

    expect(await screen.findByText("from inside")).toBeTruthy();
  });

  // Headline feature: an external manager passed via the prop allows
  // dispatch from outside the React tree.
  it("dispatches toasts via an external manager passed as a prop", async () => {
    const mgr = createLarkToastManager();

    render(
      <Toasty toastManager={mgr}>
        <div />
      </Toasty>,
    );

    act(() => {
      mgr.add({ title: "from outside" });
    });

    expect(await screen.findByText("from outside")).toBeTruthy();
  });

  it("updates toasts from their current state", async () => {
    const mgr = createLarkToastManager();

    render(
      <Toasty toastManager={mgr}>
        <div />
      </Toasty>,
    );

    act(() => {
      const id = mgr.add({ title: "Saving" });
      mgr.update(id, (toast) => {
        expect(toast.title).toBe("Saving");
        return { title: "Saving complete" };
      });
    });

    await screen.findByText("Saving complete");
    expect(isBumping("Saving complete")).toBe(false);
  });

  // Duplicate ids dispatched through an external manager must not
  // produce duplicate DOM nodes, and should bump the existing toast.
  it("bumps a single toast root for duplicate ids via an external manager", async () => {
    const mgr = createLarkToastManager();

    render(
      <Toasty toastManager={mgr}>
        <div />
      </Toasty>,
    );

    act(() => {
      mgr.add({ id: "dupe", title: "first" });
      mgr.add({ id: "dupe", title: "second" });
    });

    await screen.findByText("second");
    expect(document.querySelectorAll("[data-toast-title]")).toHaveLength(1);
    expect(isBumping("second")).toBe(true);
  });

  // Regression: the bump must run on the inner surface, so it never cancels
  // the root's slide-in, and repeated bumps must replay.
  it("bumps the surface, not the sliding root, on repeated in-tree adds", async () => {
    function DuplicateToastTrigger() {
      const toasts = useLarkToastManager();
      return (
        <button
          onClick={() =>
            toasts.add({ id: "rapid-dupe", title: "Repeated toast" })
          }
        >
          Show repeated toast
        </button>
      );
    }

    render(
      <Toasty>
        <DuplicateToastTrigger />
      </Toasty>,
    );

    const button = screen.getByRole("button", { name: "Show repeated toast" });
    fireEvent.click(button);
    const root = (await screen.findByText("Repeated toast")).closest(
      '[role="dialog"]',
    );

    fireEvent.click(button);
    const firstBump = surfaceOf("Repeated toast")?.className;
    fireEvent.click(button);

    expect(screen.getAllByText("Repeated toast")).toHaveLength(1);
    expect(screen.getByText("Repeated toast").closest('[role="dialog"]')).toBe(
      root,
    );
    expect(root?.className).not.toMatch(/animate-toast-bump/);
    expect(isBumping("Repeated toast")).toBe(true);
    expect(surfaceOf("Repeated toast")?.className).not.toBe(firstBump);
  });

  // `useLarkToastManager()` inside a tree wrapped with an external manager
  // must return that same manager — so in-tree and out-of-tree dispatch
  // converge on a single instance.
  it("exposes the same manager instance to useLarkToastManager inside the tree", async () => {
    const mgr = createLarkToastManager();
    let inTreeAdd: ((opts: { title: string }) => string) | undefined;

    function CaptureManager() {
      const toasts = useLarkToastManager();
      inTreeAdd = toasts.add;
      return null;
    }

    render(
      <Toasty toastManager={mgr}>
        <CaptureManager />
      </Toasty>,
    );

    // External dispatch.
    act(() => {
      mgr.add({ title: "external" });
    });
    expect(await screen.findByText("external")).toBeTruthy();

    // In-tree dispatch via the hook.
    act(() => {
      inTreeAdd?.({ title: "in-tree" });
    });
    expect(await screen.findByText("in-tree")).toBeTruthy();
  });
});
