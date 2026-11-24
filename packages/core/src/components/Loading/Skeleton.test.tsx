import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton, SkeletonAvatar, SkeletonContent } from "./Skeleton";

describe("Skeleton", () => {
  it("announces a busy status and hides the decorative placeholder", () => {
    const { container } = render(<Skeleton />);

    const status = screen.getByRole("status", { name: "加载中" });
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveAttribute("aria-busy", "true");
    expect(status).toHaveAttribute("data-loading");

    expect(container.querySelector('[data-slot="skeleton-placeholder"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );

    // Design spec: text skeletons are as tall as the font and use Radius-XS.
    const line = container.querySelector('[data-slot="skeleton-content"]') as HTMLElement;
    expect(getComputedStyle(line).height).toBe("14px");
    expect(getComputedStyle(line).borderRadius).toBe("2px");
  });

  it("accepts a local accessible name", () => {
    render(<Skeleton aria-label="正在加载成员" />);

    expect(screen.getByRole("status", { name: "正在加载成员" })).toBeInTheDocument();
  });

  it("swaps the placeholder for the wrapped content when loaded", () => {
    const { container, rerender } = render(<Skeleton loading>已加载内容</Skeleton>);

    expect(screen.queryByText("已加载内容")).toBeNull();
    expect(container.querySelector('[data-slot="skeleton-content"]')).not.toBeNull();

    rerender(<Skeleton loading={false}>已加载内容</Skeleton>);

    expect(screen.getByText("已加载内容")).toBeInTheDocument();
    expect(screen.queryByRole("status")).toBeNull();
    expect(container.querySelector('[data-slot="skeleton-content"]')).toBeNull();
    expect(screen.getByText("已加载内容").parentElement).not.toHaveAttribute("aria-busy");
  });

  it("renders a custom placeholder with image dimensions", () => {
    const { container } = render(
      <Skeleton placeholder={<SkeletonContent shape="image" width={180} height={120} />} />,
    );

    const image = container.querySelector('[data-slot="skeleton-content"]') as HTMLElement;
    expect(image).toHaveAttribute("data-shape", "image");
    expect(getComputedStyle(image).width).toBe("180px");
    expect(getComputedStyle(image).height).toBe("120px");
    // The client's base content radius is 6px; image skeletons keep that shape.
    expect(getComputedStyle(image).borderRadius).toBe("6px");
  });

  it("fills with N900 at 5% in both themes", () => {
    const { container } = render(<Skeleton />);
    const line = container.querySelector('[data-slot="skeleton-content"]') as HTMLElement;

    // N900 (#1f2329) at 5%, resolved from the color-mix token.
    expect(getComputedStyle(line).backgroundColor).toBe(
      "color(srgb 0.121569 0.137255 0.160784 / 0.05)",
    );

    document.documentElement.dataset.theme = "dark";
    try {
      // The dark theme inverts the neutral scale, so N900 becomes #ebebeb.
      expect(getComputedStyle(line).backgroundColor).toBe(
        "color(srgb 0.921569 0.921569 0.921569 / 0.05)",
      );
    } finally {
      delete document.documentElement.dataset.theme;
    }
  });

  it("uses the UD N900 shimmer and can be frozen", () => {
    const { container, rerender } = render(<Skeleton />);

    const layer = container.querySelector(".lark-skeleton-layer") as HTMLElement;
    expect(layer).not.toBeNull();
    expect(getComputedStyle(layer).animationName).toBe("lark-skeleton-shimmer");
    expect(getComputedStyle(layer).animationDuration).toBe("2s");
    expect(getComputedStyle(layer).animationTimingFunction).toBe("linear");
    expect(getComputedStyle(layer).animationIterationCount).toBe("infinite");

    // 5% → 5% 33.33% → 8% 50% → 5% 66.67% → 5%, exactly the client gradient.
    const gradient = getComputedStyle(layer).backgroundImage;
    expect(gradient).toContain("linear-gradient");
    expect(gradient).toContain("33.33%");
    expect(gradient).toContain("50%");
    expect(gradient).toContain("66.67%");
    expect(gradient).toContain("/ 0.05)");
    expect(gradient).toContain("/ 0.08)");

    rerender(<Skeleton animation={false} />);
    expect(container.querySelector(".lark-skeleton-layer")).toBeNull();
  });

  it("sweeps the highlight with the client's -66.67% → 0 keyframes", () => {
    const frames = Array.from(document.styleSheets)
      .flatMap((sheet) => Array.from(sheet.cssRules))
      .filter((rule): rule is CSSKeyframesRule => rule instanceof CSSKeyframesRule)
      .find((rule) => rule.name === "lark-skeleton-shimmer");

    expect(frames).toBeDefined();
    const stops = Array.from(frames?.cssRules ?? []).map((rule) => {
      const frame = rule as CSSKeyframeRule;
      return { offset: frame.keyText, transform: frame.style.transform };
    });

    expect(stops).toEqual([
      { offset: "0%", transform: "translateX(-66.67%)" },
      { offset: "100%", transform: "translateX(0px)" },
    ]);
  });

  it("inherits a frozen animation but lets elements opt back in", () => {
    render(
      <Skeleton
        animation={false}
        placeholder={
          <div>
            <SkeletonContent />
            <SkeletonContent animation />
          </div>
        }
      />,
    );

    const layers = document.querySelectorAll(".lark-skeleton-layer");
    expect(layers).toHaveLength(1);
  });

  it("sizes the avatar skeleton like the real avatar", () => {
    const { container, rerender } = render(<SkeletonAvatar />);

    const avatar = container.querySelector('[data-slot="skeleton-avatar"]') as HTMLElement;
    expect(getComputedStyle(avatar).width).toBe("32px");
    expect(getComputedStyle(avatar).height).toBe("32px");
    // `--lark-radius-full: 9999px` is the circle token used by Avatar too.
    expect(getComputedStyle(avatar).borderRadius).toBe("9999px");

    rerender(<SkeletonAvatar size={56} shape="square" />);
    const square = container.querySelector('[data-slot="skeleton-avatar"]') as HTMLElement;
    expect(getComputedStyle(square).width).toBe("56px");
    expect(getComputedStyle(square).height).toBe("56px");
    // Avatar squares use the same 12.5% radius as the Avatar component.
    expect(getComputedStyle(square).borderRadius).toBe("12.5%");
  });
});
