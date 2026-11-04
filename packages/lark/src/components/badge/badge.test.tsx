import { describe, expect, it, vi } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import { ArrowRightIcon } from "../../icons/phosphor";
import { Badge, badgeVariants, LARK_BADGE_VARIANTS } from "./badge";

describe("Badge", () => {
  it("renders children as text content", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeTruthy();
  });

  it("renders as a <span> element", () => {
    render(<Badge>Status</Badge>);
    const el = screen.getByText("Status");
    expect(el.tagName).toBe("SPAN");
    expect(el.getAttribute("data-lark-component")).toBe("Badge");
  });

  it("merges custom className", () => {
    render(<Badge className="my-custom">Tag</Badge>);
    const el = screen.getByText("Tag");
    expect(el.className).toContain("my-custom");
  });

  it("shows a ring when an ancestor link is hovered", () => {
    render(
      <a href="/docs">
        <Badge>Docs</Badge>
      </a>,
    );
    const badge = screen.getByText("Docs");
    expect(badge.classList.contains("[a:hover_&]:ring")).toBe(true);
    expect(badge.classList.contains("[a:hover_&]:ring-current")).toBe(true);
  });

  it("renders an icon", () => {
    render(<Badge icon={ArrowRightIcon}>Next</Badge>);
    expect(
      screen.getByText("Next").querySelector("[data-lark-icon]"),
    ).toBeTruthy();
  });

  describe("filled appearance (default)", () => {
    it("applies variant classes for filled badges", () => {
      render(<Badge variant="error">Error</Badge>);
      const el = screen.getByText("Error");
      expect(el.className).toContain("bg-lark-danger/20");
    });

    it("does not render a dot indicator", () => {
      render(<Badge variant="success">OK</Badge>);
      const el = screen.getByText("OK");
      expect(el.querySelector("[aria-hidden]")).toBeNull();
    });
  });

  describe("dot appearance", () => {
    it("renders a dot indicator for supported variants", () => {
      render(
        <Badge variant="success" appearance="dot">
          Healthy
        </Badge>,
      );
      const badge = screen.getByText("Healthy").closest("span")!;
      const dot = badge.querySelector("[aria-hidden='true']");
      expect(dot).toBeTruthy();
      expect(dot!.className).toContain("bg-lark-success");
    });

    it("applies dot appearance classes instead of variant classes", () => {
      render(
        <Badge variant="error" appearance="dot">
          Down
        </Badge>,
      );
      const badge = screen.getByText("Down").closest("span")!;
      // Dot appearance overrides variant bg/text
      expect(badge.className).toContain("bg-transparent");
      expect(badge.className).toContain("text-lark-default");
      // Should NOT contain the filled error classes
      expect(badge.className).not.toContain("bg-lark-danger/20");
    });

    it("renders correct dot color per variant", () => {
      const cases = [
        { variant: "success" as const, expected: "bg-lark-success" },
        { variant: "warning" as const, expected: "bg-lark-badge-orange" },
        { variant: "error" as const, expected: "bg-lark-badge-red" },
        { variant: "neutral" as const, expected: "bg-lark-badge-neutral" },
      ];

      for (const { variant, expected } of cases) {
        const { unmount } = render(
          <Badge variant={variant} appearance="dot">
            {variant}
          </Badge>,
        );
        const badge = screen.getByText(variant).closest("span")!;
        const dot = badge.querySelector("[aria-hidden='true']");
        expect(dot, `dot should exist for variant="${variant}"`).toBeTruthy();
        expect(dot!.className, `dot class for variant="${variant}"`).toContain(
          expected,
        );
        unmount();
      }
    });

    it("does not render a dot for unsupported variants", () => {
      // Suppress the expected dev warning from resolveVariant
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

      render(
        <Badge variant="primary" appearance="dot">
          No dot
        </Badge>,
      );
      const badge = screen.getByText("No dot").closest("span")!;
      const dot = badge.querySelector("[aria-hidden='true']");
      expect(dot).toBeNull();

      warn.mockRestore();
    });

    it("dot element is aria-hidden", () => {
      render(
        <Badge variant="error" appearance="dot">
          Err
        </Badge>,
      );
      const badge = screen.getByText("Err").closest("span")!;
      const dot = badge.querySelector("[aria-hidden='true']");
      expect(dot).toBeTruthy();
      expect(dot!.getAttribute("aria-hidden")).toBe("true");
    });
  });
});

describe("badgeVariants", () => {
  it("returns base styles with no arguments", () => {
    const result = badgeVariants();
    expect(result).toContain("inline-flex");
    expect(result).toContain("rounded");
  });

  it("includes variant classes for filled appearance", () => {
    const result = badgeVariants({ variant: "success" });
    expect(result).toContain("bg-lark-success/20");
  });

  it("omits variant classes for dot appearance", () => {
    const result = badgeVariants({ variant: "success", appearance: "dot" });
    expect(result).not.toContain("bg-lark-success/20");
    expect(result).toContain("bg-transparent");
  });

  it("survives invalid variant without throwing", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const BOGUS = "nope" as any;

    expect(() => badgeVariants({ variant: BOGUS })).not.toThrow();
    expect(typeof badgeVariants({ variant: BOGUS })).toBe("string");

    expect(() =>
      badgeVariants({ variant: BOGUS, appearance: BOGUS }),
    ).not.toThrow();
    expect(typeof badgeVariants({ appearance: BOGUS })).toBe("string");

    warn.mockRestore();
  });

  it("returns default classes for invalid variant", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(badgeVariants({ variant: "nope" as any })).toBe(badgeVariants());
    warn.mockRestore();
  });
});

describe("LARK_BADGE_VARIANTS", () => {
  it("has variant, appearance, and dotColor dimensions", () => {
    expect(LARK_BADGE_VARIANTS.variant).toBeDefined();
    expect(LARK_BADGE_VARIANTS.appearance).toBeDefined();
    expect(LARK_BADGE_VARIANTS.dotColor).toBeDefined();
  });

  it("every variant entry has classes and description", () => {
    for (const [dim, entries] of Object.entries(LARK_BADGE_VARIANTS)) {
      for (const [key, entry] of Object.entries(
        entries as Record<string, { classes: string; description: string }>,
      )) {
        expect(entry.classes, `${dim}.${key}.classes`).toBeDefined();
        expect(typeof entry.description, `${dim}.${key}.description`).toBe(
          "string",
        );
      }
    }
  });
});
