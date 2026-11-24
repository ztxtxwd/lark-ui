import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "./Pagination";

function Controlled({ initial = 1 }: { initial?: number }) {
  const [page, setPage] = useState(initial);
  return (
    <Pagination total={50} pageSize={10} current={page} onPageChange={(next) => setPage(next)} />
  );
}

describe("Pagination", () => {
  it("is a named navigation landmark with a list and a current page", () => {
    render(<Pagination total={95} pageSize={10} />);

    const nav = screen.getByRole("navigation", { name: "分页" });
    expect(nav.tagName).toBe("NAV");
    expect(within(nav).getByRole("list")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1" })).toHaveAttribute("aria-current", "page");
  });

  it("accepts a custom accessible name", () => {
    render(<Pagination total={30} pageSize={10} aria-label="搜索结果分页" />);

    expect(screen.getByRole("navigation", { name: "搜索结果分页" })).toBeInTheDocument();
  });

  it("moves to a clicked page and reports the change details", async () => {
    const onPageChange = vi.fn();
    render(<Pagination total={50} pageSize={10} onPageChange={onPageChange} />);

    await userEvent.click(screen.getByRole("button", { name: "3" }));

    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange.mock.calls[0][0]).toBe(3);
    expect(onPageChange.mock.calls[0][1]).toMatchObject({
      reason: "item-press",
      canceled: false,
    });
    expect(typeof onPageChange.mock.calls[0][1].cancel).toBe("function");
    expect(screen.getByRole("button", { name: "3" })).toHaveAttribute("aria-current", "page");
  });

  it("moves with Enter and Space on a focused page", async () => {
    render(<Pagination total={50} pageSize={10} />);

    screen.getByRole("button", { name: "3" }).focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "3" })).toHaveAttribute("aria-current", "page");

    screen.getByRole("button", { name: "4" }).focus();
    await userEvent.keyboard(" ");
    expect(screen.getByRole("button", { name: "4" })).toHaveAttribute("aria-current", "page");
  });

  it("follows controlled page changes", async () => {
    const onPageChange = vi.fn();
    render(<Pagination total={30} pageSize={10} current={2} onPageChange={onPageChange} />);

    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute("aria-current", "page");
    await userEvent.click(screen.getByRole("button", { name: "3" }));
    expect(onPageChange).toHaveBeenCalledWith(3, expect.objectContaining({ reason: "item-press" }));
    // The owner decides, so the current page does not move on its own.
    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute("aria-current", "page");
  });

  it("updates a controlled pagination through its owner", async () => {
    render(<Controlled initial={1} />);

    await userEvent.click(screen.getByRole("button", { name: "2" }));
    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute("aria-current", "page");
  });

  it("disables previous on the first page and next on the last page", async () => {
    const onPageChange = vi.fn();
    const { rerender } = render(
      <Pagination total={30} pageSize={10} current={1} onPageChange={onPageChange} />,
    );

    const previous = screen.getByRole("button", { name: "上一页" });
    expect(previous).toHaveAttribute("aria-disabled", "true");
    expect(previous).toHaveAttribute("data-disabled");
    await userEvent.click(previous);
    expect(onPageChange).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: "下一页" }));
    expect(onPageChange).toHaveBeenCalledWith(2, expect.objectContaining({ reason: "next-press" }));

    rerender(<Pagination total={30} pageSize={10} current={3} onPageChange={onPageChange} />);

    const next = screen.getByRole("button", { name: "下一页" });
    expect(next).toHaveAttribute("aria-disabled", "true");
    expect(next).toHaveAttribute("data-disabled");
    await userEvent.click(next);
    expect(onPageChange).toHaveBeenCalledTimes(1);

    expect(screen.getByRole("button", { name: "上一页" })).not.toHaveAttribute("aria-disabled");
  });

  it("truncates many pages with the UD five-page window and keeps the ends", () => {
    const { container } = render(<Pagination total={200} pageSize={10} defaultCurrent={10} />);

    expect(container.querySelectorAll('[data-slot="pagination-ellipsis"]')).toHaveLength(2);
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "20" })).toBeInTheDocument();
    for (const page of [8, 9, 10, 11, 12]) {
      expect(screen.getByRole("button", { name: String(page) })).toBeInTheDocument();
    }
    expect(screen.queryByRole("button", { name: "7" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "13" })).not.toBeInTheDocument();
  });

  it("widens or narrows the range with siblingCount", () => {
    const { rerender } = render(
      <Pagination total={200} pageSize={10} defaultCurrent={10} siblingCount={1} />,
    );

    expect(screen.getByRole("button", { name: "9" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "11" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "8" })).not.toBeInTheDocument();

    rerender(<Pagination total={200} pageSize={10} defaultCurrent={10} siblingCount={3} />);
    expect(screen.getByRole("button", { name: "7" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "13" })).toBeInTheDocument();
  });

  it("renders a compact simple pager", async () => {
    render(<Pagination simple total={50} pageSize={10} defaultCurrent={2} />);

    expect(screen.getByText("2 / 5")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "1" })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "下一页" }));
    expect(screen.getByText("3 / 5")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "上一页" }));
    expect(screen.getByText("2 / 5")).toBeInTheDocument();
  });

  it("keeps the simple pager on the UD 24px row and dims it when disabled", () => {
    const { rerender } = render(<Pagination simple total={50} pageSize={10} defaultCurrent={2} />);

    expect(getComputedStyle(screen.getByRole("button", { name: "上一页" })).height).toBe("24px");
    expect(getComputedStyle(screen.getByRole("button", { name: "下一页" })).height).toBe("24px");
    expect(getComputedStyle(screen.getByText("2 / 5")).height).toBe("24px");

    rerender(<Pagination simple disabled total={50} pageSize={10} defaultCurrent={2} />);
    expect(getComputedStyle(screen.getByText("2 / 5")).color).toBe("rgb(187, 191, 196)");
  });

  it("keeps control spacing at the inline end in RTL", () => {
    render(
      <div dir="rtl">
        <Pagination total={30} pageSize={10} />
      </div>,
    );

    const previous = screen.getByRole("button", { name: "上一页" });
    const style = getComputedStyle(previous);
    expect(style.marginLeft).toBe("8px");
    expect(style.marginRight).toBe("0px");
  });

  it("shows a visible focus ring on a step that stays focusable at an end", async () => {
    render(<Pagination total={30} pageSize={10} />);

    await userEvent.tab();
    const previous = screen.getByRole("button", { name: "上一页" });
    expect(previous).toHaveFocus();
    expect(previous).toHaveAttribute("aria-disabled", "true");
    expect(previous.matches(":focus-visible")).toBe(true);

    const style = getComputedStyle(previous);
    expect(style.outlineStyle).toBe("solid");
    expect(style.outlineWidth).toBe("2px");
  });

  it("disables every control when the root is disabled", async () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        disabled
        total={50}
        pageSize={10}
        defaultCurrent={1}
        onPageChange={onPageChange}
      />,
    );

    const page2 = screen.getByRole("button", { name: "2" });
    expect(page2).toHaveAttribute("aria-disabled", "true");
    expect(page2).toHaveAttribute("data-disabled");
    await userEvent.click(page2);
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("shows the total and the visible range", () => {
    render(
      <Pagination
        total={95}
        pageSize={10}
        defaultCurrent={2}
        showTotal={(total, range) => `共 ${total} 条，第 ${range[0]}-${range[1]} 条`}
      />,
    );

    expect(screen.getByText("共 95 条，第 11-20 条")).toBeInTheDocument();
  });

  it("uses the UD 28px and 24px control sizes", () => {
    const { rerender } = render(<Pagination total={30} pageSize={10} />);

    expect(getComputedStyle(screen.getByRole("button", { name: "1" })).height).toBe("28px");
    expect(getComputedStyle(screen.getByRole("button", { name: "上一页" })).height).toBe("28px");

    rerender(<Pagination total={30} pageSize={10} size="small" />);

    expect(getComputedStyle(screen.getByRole("button", { name: "1" })).height).toBe("24px");
    expect(getComputedStyle(screen.getByRole("button", { name: "上一页" })).height).toBe("24px");
  });
});
