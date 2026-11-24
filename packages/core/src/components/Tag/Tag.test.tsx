import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tag } from "./Tag";

describe("Tag", () => {
  it("renders its label", () => {
    render(<Tag>部门</Tag>);

    const tag = screen.getByText("部门").closest('[data-slot="tag"]');
    expect(tag).not.toBeNull();
    expect(tag).toHaveAttribute("data-tone", "neutral");
    expect(tag).toHaveAttribute("data-size", "md");
  });

  it("applies tone and size variants", () => {
    render(
      <Tag tone="danger" size="sm">
        紧急
      </Tag>,
    );

    const tag = screen.getByText("紧急").closest('[data-slot="tag"]');
    expect(tag).toHaveClass("text-lark-tag-danger");
    expect(tag).toHaveClass("bg-[var(--lark-tag-fill-danger)]");
    expect(tag).toHaveClass("h-5");
  });

  it("centres the label vertically in both sizes", () => {
    render(
      <div>
        <Tag>标签</Tag>
        <Tag size="sm">标签</Tag>
      </div>,
    );

    for (const tag of document.querySelectorAll<HTMLElement>('[data-slot="tag"]')) {
      const label = tag.querySelector<HTMLElement>("span:not([aria-hidden])");
      expect(label).not.toBeNull();

      const tagRect = tag.getBoundingClientRect();
      const labelRect = label!.getBoundingClientRect();

      // Equal space above and below the label box, and a line box as tall as
      // the tag so `truncate` never clips the glyphs.
      expect(labelRect.top - tagRect.top).toBeCloseTo(tagRect.bottom - labelRect.bottom, 0);
      expect(Number.parseFloat(getComputedStyle(label!).lineHeight)).toBe(tagRect.height);
    }
  });

  it("renders a decorative start icon", () => {
    render(<Tag startIcon={<svg data-testid="tag-icon" />}>已完成</Tag>);

    const icon = screen.getByTestId("tag-icon");
    expect(icon).toBeInTheDocument();
    expect(icon.parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("does not render a close button unless closable", () => {
    render(<Tag>只读</Tag>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("exposes the close button with the default accessible name", () => {
    render(<Tag closable>可移除</Tag>);

    expect(screen.getByRole("button", { name: "移除" })).toBeInTheDocument();
  });

  it("supports a custom close label", () => {
    render(
      <Tag closable closeLabel="删除标签">
        可移除
      </Tag>,
    );

    expect(screen.getByRole("button", { name: "删除标签" })).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const onClose = vi.fn();
    render(
      <Tag closable onClose={onClose}>
        可移除
      </Tag>,
    );

    await userEvent.click(screen.getByRole("button", { name: "移除" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("supports keyboard activation of the close button", async () => {
    const onClose = vi.fn();
    render(
      <Tag closable onClose={onClose}>
        可移除
      </Tag>,
    );

    const close = screen.getByRole("button", { name: "移除" });
    await userEvent.tab();
    expect(close).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(onClose).toHaveBeenCalledTimes(1);

    await userEvent.keyboard(" ");
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("disables the tag and its close button", async () => {
    const onClose = vi.fn();
    render(
      <Tag closable disabled onClose={onClose}>
        不可用
      </Tag>,
    );

    const tag = screen.getByText("不可用").closest('[data-slot="tag"]');
    expect(tag).toHaveAttribute("data-disabled");
    expect(tag).toHaveAttribute("aria-disabled", "true");

    const close = screen.getByRole("button", { name: "移除" });
    expect(close).toBeDisabled();
    await userEvent.click(close);
    expect(onClose).not.toHaveBeenCalled();
  });
});
