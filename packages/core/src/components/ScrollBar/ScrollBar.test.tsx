import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ScrollBar } from "./ScrollBar";

function Rows({ count = 40, height = 40 }: { count?: number; height?: number }) {
  const rows = Array.from({ length: count }, (_, index) => index + 1);

  return (
    <div>
      {rows.map((row) => (
        <div key={row} style={{ height }}>
          第 {row} 行
        </div>
      ))}
    </div>
  );
}

function getBar(orientation: "vertical" | "horizontal" = "vertical"): HTMLElement {
  const bar = document.querySelector(
    `[data-slot="scroll-area-scrollbar"][data-orientation="${orientation}"]`,
  );
  if (!(bar instanceof HTMLElement)) {
    throw new Error(`Missing ${orientation} scrollbar`);
  }
  return bar;
}

function getThumb(orientation: "vertical" | "horizontal" = "vertical"): HTMLElement {
  const thumb = getBar(orientation).querySelector('[data-slot="scroll-area-thumb"]');
  if (!(thumb instanceof HTMLElement)) {
    throw new Error(`Missing ${orientation} thumb`);
  }
  return thumb;
}

describe("ScrollBar", () => {
  it("renders an accessible scroll region with the UD vertical bar and thumb", async () => {
    render(
      <ScrollBar label="版本列表" maxHeight={120}>
        <Rows />
      </ScrollBar>,
    );

    const region = screen.getByRole("region", { name: "版本列表" });
    expect(region).toHaveAttribute("data-slot", "scroll-area-viewport");
    expect(getComputedStyle(region).maxHeight).toBe("120px");
    expect(getComputedStyle(region).overflow).toBe("auto");

    const bar = getBar();
    const thumb = getThumb();
    expect(bar).toHaveAttribute("data-orientation", "vertical");
    expect(getComputedStyle(bar).width).toBe("11px");
    expect(getComputedStyle(thumb).borderTopWidth).toBe("2px");
    expect(getComputedStyle(thumb).borderLeftWidth).toBe("2px");
    expect(getComputedStyle(thumb).backgroundClip).toBe("padding-box");
    expect(getComputedStyle(thumb).backgroundColor).not.toBe("rgba(0, 0, 0, 0)");

    await vi.waitFor(() => {
      expect(bar).toHaveAttribute("data-visible");
      expect(getComputedStyle(bar).opacity).toBe("1");
    });
  });

  it("is a tab stop when it holds nothing focusable", async () => {
    render(
      <ScrollBar label="列表" maxHeight={120}>
        <Rows />
      </ScrollBar>,
    );

    const region = screen.getByRole("region", { name: "列表" });
    await vi.waitFor(() => expect(region).toHaveAttribute("data-overflow-y"));
    await userEvent.tab();
    await vi.waitFor(() => expect(region).toHaveFocus());
  });

  it("falls back to a generic region name", () => {
    render(
      <ScrollBar maxHeight={120}>
        <Rows />
      </ScrollBar>,
    );

    expect(screen.getByRole("region", { name: "可滚动区域" })).toBeInTheDocument();
  });

  it("scrolls natively and updates the progress variable and thumb", async () => {
    render(
      <ScrollBar label="列表" maxHeight={120}>
        <Rows />
      </ScrollBar>,
    );

    const region = screen.getByRole("region", { name: "列表" });
    const root = region.parentElement as HTMLElement;
    const thumb = getThumb();

    region.scrollTop = 200;
    fireEvent.scroll(region);

    await vi.waitFor(() => {
      const progress = Number.parseFloat(
        getComputedStyle(root).getPropertyValue("--scroll-area-progress-y"),
      );
      expect(progress).toBeGreaterThan(0);
    });
    expect(getComputedStyle(thumb).height).not.toBe("");
  });

  it("drags the thumb and marks the dragging state", async () => {
    render(
      <ScrollBar label="列表" maxHeight={120}>
        <Rows />
      </ScrollBar>,
    );

    const region = screen.getByRole("region", { name: "列表" });
    const bar = getBar();
    const thumb = getThumb();

    await vi.waitFor(() => {
      expect(bar).toHaveAttribute("data-visible");
      expect(thumb.getBoundingClientRect().height).toBeGreaterThan(0);
    });

    const box = thumb.getBoundingClientRect();
    const startY = box.top + box.height / 2;

    fireEvent.pointerDown(thumb, {
      pointerId: 1,
      pointerType: "mouse",
      isPrimary: true,
      button: 0,
      buttons: 1,
      clientX: box.left + box.width / 2,
      clientY: startY,
    });

    await vi.waitFor(() => {
      expect(thumb).toHaveAttribute("data-dragging");
    });

    fireEvent.pointerMove(document, {
      pointerId: 1,
      pointerType: "mouse",
      isPrimary: true,
      buttons: 1,
      clientX: box.left + box.width / 2,
      clientY: startY + 60,
    });
    await new Promise((resolve) => requestAnimationFrame(resolve));
    fireEvent.pointerUp(document, {
      pointerId: 1,
      pointerType: "mouse",
      isPrimary: true,
      clientX: box.left + box.width / 2,
      clientY: startY + 60,
    });

    await vi.waitFor(() => {
      expect(region.scrollTop).toBeGreaterThan(0);
    });
    expect(thumb).not.toHaveAttribute("data-dragging");
  });

  it("shows the bar on hover when visibility is hover", async () => {
    render(
      <ScrollBar label="列表" maxHeight={120} visibility="hover">
        <Rows />
      </ScrollBar>,
    );

    const bar = getBar();
    expect(bar).not.toHaveAttribute("data-visible");

    await userEvent.hover(screen.getByRole("region", { name: "列表" }));

    await vi.waitFor(() => {
      expect(bar).toHaveAttribute("data-visible");
    });
  });

  it("keeps the bar visible with visibility always", async () => {
    render(
      <ScrollBar label="列表" maxHeight={120} visibility="always">
        <Rows />
      </ScrollBar>,
    );

    const bar = getBar();
    await vi.waitFor(() => {
      expect(bar).toHaveAttribute("data-visible");
    });
    await userEvent.unhover(screen.getByRole("region", { name: "列表" }));
    expect(bar).toHaveAttribute("data-visible");
  });

  it("keeps a non-scrolling axis inert when visibility is always", async () => {
    render(
      <ScrollBar label="列表" maxHeight={400} visibility="always">
        <p>短内容</p>
      </ScrollBar>,
    );

    const bar = getBar();
    await vi.waitFor(() => {
      expect(bar).toHaveAttribute("data-visible");
    });
    expect(bar).not.toHaveAttribute("data-overflow-y");
    expect(getComputedStyle(bar).pointerEvents).toBe("none");
    await new Promise((resolve) => setTimeout(resolve, 250));
    expect(getComputedStyle(bar).opacity).toBe("0");
  });

  it("keeps an overflowing bar interactive with visibility always", async () => {
    render(
      <ScrollBar label="列表" maxHeight={120} visibility="always">
        <Rows />
      </ScrollBar>,
    );

    const bar = getBar();
    await vi.waitFor(() => {
      expect(bar).toHaveAttribute("data-overflow-y");
      expect(getComputedStyle(bar).opacity).toBe("1");
    });
    expect(getComputedStyle(bar).pointerEvents).not.toBe("none");
  });

  it("renders and scrolls a horizontal bar", async () => {
    render(
      <ScrollBar label="横向内容" orientation="horizontal" className="w-40">
        <div style={{ height: 40, width: 600 }}>横向滚动内容</div>
      </ScrollBar>,
    );

    const region = screen.getByRole("region", { name: "横向内容" });
    expect(screen.queryAllByRole("region")).toHaveLength(1);
    expect(document.querySelectorAll('[data-slot="scroll-area-scrollbar"]')).toHaveLength(1);

    const bar = getBar("horizontal");
    const root = region.parentElement as HTMLElement;
    expect(bar).toHaveAttribute("data-orientation", "horizontal");
    expect(getComputedStyle(bar).height).toBe("11px");

    region.scrollLeft = 150;
    fireEvent.scroll(region);

    await vi.waitFor(() => {
      const progress = Number.parseFloat(
        getComputedStyle(root).getPropertyValue("--scroll-area-progress-x"),
      );
      expect(progress).toBeGreaterThan(0);
    });
    expect(region.scrollLeft).toBeGreaterThan(0);
    expect(getThumb("horizontal").getBoundingClientRect().width).toBeGreaterThan(0);
  });

  it("honours a custom thickness and minimum thumb size", () => {
    render(
      <ScrollBar label="列表" maxHeight={120} thickness={9} minThumbSize={32}>
        <Rows />
      </ScrollBar>,
    );

    expect(getComputedStyle(getBar()).width).toBe("13px");
    expect(getComputedStyle(getThumb()).minHeight).toBe("32px");
    expect(getComputedStyle(getThumb()).borderTopWidth).toBe("2px");
  });

  it("renders both bars when both axes scroll", () => {
    render(
      <ScrollBar label="双向内容" orientation="both" maxHeight={120} className="w-40">
        <div style={{ height: 600, width: 600 }}>双向滚动内容</div>
      </ScrollBar>,
    );

    expect(getBar("vertical")).toBeInTheDocument();
    expect(getBar("horizontal")).toBeInTheDocument();
  });
});
