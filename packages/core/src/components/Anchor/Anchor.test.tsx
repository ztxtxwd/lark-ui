import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ComponentProps, useRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Anchor, type AnchorItem } from "./Anchor";

const items: AnchorItem[] = [
  { key: "overview", href: "#overview", title: "概览" },
  { key: "members", href: "#members", title: "成员" },
  {
    key: "settings",
    href: "#settings",
    title: "设置",
    children: [{ key: "security", href: "#security", title: "安全" }],
  },
];

function ScrollDemo({
  behavior = "auto",
  offsetTop = 0,
  onScrollTo,
  anchorProps,
  height = 100,
}: {
  behavior?: ScrollBehavior;
  offsetTop?: number;
  onScrollTo?: (key: string) => void;
  anchorProps?: Partial<ComponentProps<typeof Anchor>>;
  height?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <Anchor
        items={[
          { key: "one", href: "#one", title: "第一节" },
          { key: "two", href: "#two", title: "第二节" },
          { key: "three", href: "#three", title: "第三节" },
        ]}
        defaultActiveKey="one"
        behavior={behavior}
        offsetTop={offsetTop}
        getContainer={() => containerRef.current}
        onChange={onScrollTo}
        {...anchorProps}
      />
      <div
        ref={containerRef}
        data-testid="scroller"
        style={{ height, overflow: "auto", width: 320 }}
      >
        <section id="one" style={{ height: 150 }}>
          第一节内容
        </section>
        <section id="two" style={{ height: 150 }}>
          第二节内容
        </section>
        <section id="three" style={{ height: 150 }}>
          第三节内容
        </section>
      </div>
    </div>
  );
}

describe("Anchor", () => {
  it("renders a named navigation landmark with links and the first item active", () => {
    render(<Anchor items={items} />);

    const nav = screen.getByRole("navigation", { name: "锚点" });
    expect(nav.tagName).toBe("NAV");
    expect(nav.querySelector("ul")).not.toBeNull();

    const overview = screen.getByRole("link", { name: "概览" });
    expect(overview).toHaveAttribute("href", "#overview");
    expect(overview).toHaveAttribute("aria-current", "location");
    expect(overview).toHaveAttribute("data-active");
    expect(screen.getByRole("link", { name: "成员" })).not.toHaveAttribute("aria-current");
    expect(nav.querySelector('[data-slot="anchor-ink"]')).not.toBeNull();
  });

  it("accepts a custom accessible name", () => {
    render(<Anchor items={items} label="本页目录" />);

    expect(screen.getByRole("navigation", { name: "本页目录" })).toBeInTheDocument();
  });

  it("marks the controlled item and reports clicks without changing it", async () => {
    const onChange = vi.fn();
    const { rerender } = render(<Anchor items={items} activeKey="overview" onChange={onChange} />);

    expect(screen.getByRole("link", { name: "概览" })).toHaveAttribute("aria-current", "location");

    await userEvent.click(screen.getByRole("link", { name: "成员" }));
    expect(onChange).toHaveBeenCalledWith("members");
    expect(screen.getByRole("link", { name: "概览" })).toHaveAttribute("aria-current", "location");

    rerender(<Anchor items={items} activeKey="members" onChange={onChange} />);
    expect(screen.getByRole("link", { name: "成员" })).toHaveAttribute("aria-current", "location");
    expect(screen.getByRole("link", { name: "概览" })).not.toHaveAttribute("aria-current");
  });

  it("scrolls the target into the scrolling container on click", async () => {
    const onChange = vi.fn();
    render(<ScrollDemo onScrollTo={onChange} />);

    await userEvent.click(screen.getByRole("link", { name: "第二节" }));

    expect(onChange).toHaveBeenCalledWith("two");
    expect(screen.getByRole("link", { name: "第二节" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    expect(screen.getByTestId("scroller").scrollTop).toBeGreaterThan(0);
  });

  it("moves the active item as the container scrolls, through IntersectionObserver", async () => {
    render(<ScrollDemo />);

    const scroller = screen.getByTestId("scroller");
    scroller.scrollTop = 160;
    fireEvent.scroll(scroller);

    await vi.waitFor(() => {
      expect(screen.getByRole("link", { name: "第二节" })).toHaveAttribute(
        "aria-current",
        "location",
      );
    });

    scroller.scrollTop = 0;
    fireEvent.scroll(scroller);

    await vi.waitFor(() => {
      expect(screen.getByRole("link", { name: "第一节" })).toHaveAttribute(
        "aria-current",
        "location",
      );
    });
  });

  it("activates the last entry when the scroll range reaches the end", async () => {
    render(<ScrollDemo height={300} />);

    const scroller = screen.getByTestId("scroller");
    scroller.scrollTop = scroller.scrollHeight - scroller.clientHeight;
    fireEvent.scroll(scroller);

    await vi.waitFor(() => {
      expect(screen.getByRole("link", { name: "第三节" })).toHaveAttribute(
        "aria-current",
        "location",
      );
    });
  });

  it("indents nested levels by 16px and activates nested links", async () => {
    const onChange = vi.fn();
    render(<Anchor items={items} defaultActiveKey="overview" onChange={onChange} />);

    const nav = screen.getByRole("navigation");
    expect(within(nav).getAllByRole("listitem")).toHaveLength(4);

    const security = screen.getByRole("link", { name: "安全" });
    await userEvent.click(security);

    expect(onChange).toHaveBeenCalledWith("security");
    expect(security).toHaveAttribute("aria-current", "location");
    expect(getComputedStyle(security.parentElement as HTMLElement).paddingLeft).toBe("16px");
  });

  it("supports keyboard navigation with native link semantics", async () => {
    const onChange = vi.fn();
    render(<Anchor items={items} onChange={onChange} />);

    await userEvent.tab();
    const overview = screen.getByRole("link", { name: "概览" });
    expect(overview).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith("overview");
  });

  it("renders the horizontal layout with an underline ink", () => {
    render(<Anchor items={items} direction="horizontal" />);

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("data-direction", "horizontal");
    const ink = nav.querySelector('[data-slot="anchor-ink"]') as HTMLElement;
    expect(ink).not.toBeNull();
    expect(ink.className).toContain("h-0.5");
    expect(ink.className).toContain("bottom-0");
    expect(ink.style.left).not.toBe("");
  });

  it("drops the rail and ink for the simple variant", () => {
    const { container } = render(<Anchor items={items} variant="simple" />);

    expect(container.querySelector('[data-slot="anchor-rail"]')).toBeNull();
    expect(container.querySelector('[data-slot="anchor-ink"]')).toBeNull();
    expect(screen.getByRole("link", { name: "概览" })).toHaveAttribute("data-active");
  });

  it("uses the UD 14px type and 200px rail", () => {
    render(<Anchor items={items} />);

    const nav = screen.getByRole("navigation");
    const link = screen.getByRole("link", { name: "概览" });
    expect(getComputedStyle(nav).width).toBe("200px");
    expect(getComputedStyle(link).fontSize).toBe("14px");
    expect(getComputedStyle(link).lineHeight).toBe("22px");

    const ink = nav.querySelector('[data-slot="anchor-ink"]') as HTMLElement;
    expect(ink.getBoundingClientRect().height).toBeGreaterThan(0);
  });

  it("keeps the 2px rail beside the titles instead of under them", () => {
    render(<Anchor items={items} />);

    const nav = screen.getByRole("navigation");
    const rail = nav.querySelector('[data-slot="anchor-rail"]') as HTMLElement;
    const ink = nav.querySelector('[data-slot="anchor-ink"]') as HTMLElement;
    const link = screen.getByRole("link", { name: "概览" });

    const railRect = rail.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    expect(railRect.width).toBe(2);
    expect(railRect.right).toBeLessThanOrEqual(linkRect.left);
    expect(ink.getBoundingClientRect().left).toBe(railRect.left);
    expect(getComputedStyle(nav).width).toBe("200px");
  });

  it("supports sticky and fixed positioning", () => {
    const { rerender } = render(<Anchor items={items} sticky stickyTop={12} />);
    const nav = screen.getByRole("navigation");
    expect(getComputedStyle(nav).position).toBe("sticky");
    expect(nav.style.top).toBe("12px");

    rerender(<Anchor items={items} fixed />);
    expect(getComputedStyle(screen.getByRole("navigation")).position).toBe("fixed");
  });
});
