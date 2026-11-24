import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Placeholder } from "./Placeholder";

describe("Placeholder", () => {
  it("renders the default 36px image placeholder with a name", () => {
    const { container } = render(<Placeholder />);
    const placeholder = screen.getByRole("img", { name: "暂无图片" });

    expect(placeholder).toHaveStyle({ width: "36px", height: "36px" });
    expect(placeholder.querySelector("svg")).not.toBeNull();
    expect(container.querySelector('[data-variant="image"]')).not.toBeNull();
  });

  it("renders the failed-loading variant with its own label", () => {
    render(<Placeholder variant="error" />);
    expect(screen.getByRole("img", { name: "加载失败" })).toBeInTheDocument();
  });

  it("supports a custom size, label and muted surface", () => {
    render(<Placeholder size={64} label="没有封面" muted />);
    const placeholder = screen.getByRole("img", { name: "没有封面" });
    expect(placeholder).toHaveStyle({ width: "64px", height: "64px" });
    expect(placeholder).toHaveAttribute("data-muted");
    expect(placeholder.className).toContain("bg-lark-neutral-100");
  });

  it("paints the muted surface from the N100 token in both themes", () => {
    render(<Placeholder muted />);
    const placeholder = screen.getByRole("img", { name: "暂无图片" });
    expect(getComputedStyle(placeholder).backgroundColor).toBe("rgb(242, 243, 245)");

    document.documentElement.dataset.theme = "dark";
    try {
      expect(getComputedStyle(placeholder).backgroundColor).toBe("rgb(41, 41, 41)");
    } finally {
      delete document.documentElement.dataset.theme;
    }
  });

  it("can be decorative or replaced with custom content", () => {
    const { rerender } = render(<Placeholder decorative />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(document.querySelector('[data-slot="placeholder"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );

    rerender(
      <Placeholder label="自定义">
        <span data-testid="custom">x</span>
      </Placeholder>,
    );
    expect(screen.getByTestId("custom")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "自定义" })).toBeInTheDocument();
  });
});
