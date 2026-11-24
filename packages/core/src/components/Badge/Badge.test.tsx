import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders a numeric count", () => {
    render(<Badge count={5} />);

    const content = screen.getByText("5");
    const badge = content.closest('[data-slot="badge"]');
    expect(badge).not.toBeNull();
    expect(badge).toHaveAttribute("data-status", "danger");
    expect(badge).toHaveClass("bg-lark-danger-strong");
  });

  it("caps the visible count and exposes the full total", () => {
    render(<Badge count={120} />);

    const visible = screen.getByText("99+");
    expect(visible).toHaveAttribute("aria-hidden", "true");

    const accessible = screen.getByText("120");
    expect(accessible).toHaveClass("sr-only");
  });

  it("supports a custom overflow count", () => {
    render(<Badge count={12} overflowCount={9} />);

    expect(screen.getByText("9+")).toBeInTheDocument();
    expect(screen.getByText("12")).toHaveClass("sr-only");
  });

  it("renders nothing for an empty badge or a zero count", () => {
    const { container, rerender } = render(<Badge />);
    expect(container).toBeEmptyDOMElement();

    rerender(<Badge count={0} />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("hides a zero count but keeps the wrapped content", () => {
    render(
      <Badge count={0}>
        <span>收件箱</span>
      </Badge>,
    );

    expect(screen.getByText("收件箱")).toBeInTheDocument();
    expect(screen.queryByText("0")).not.toBeInTheDocument();
    expect(document.querySelector('[data-slot="badge"]')).toBeNull();
  });

  it("hides a dot paired with a zero count", () => {
    const { container } = render(<Badge dot count={0} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders a dot instead of text", () => {
    const { container } = render(<Badge dot label="有新消息" />);

    const dot = container.querySelector('[data-slot="badge"]');
    expect(dot).toHaveAttribute("data-dot");
    expect(dot).toHaveClass("size-2");
    expect(dot).toHaveTextContent("有新消息");
    expect(screen.getByText("有新消息")).toHaveClass("sr-only");
  });

  it("wraps children with an offset badge", () => {
    render(
      <Badge count={3}>
        <span>收件箱</span>
      </Badge>,
    );

    expect(screen.getByText("收件箱")).toBeInTheDocument();
    const badge = screen.getByText("3").closest('[data-slot="badge"]');
    expect(badge).toHaveAttribute("data-overlay");
    expect(badge).toHaveClass("absolute");
    expect(badge).toHaveClass("translate-x-1/2");
    expect(badge).toHaveClass("ring-lark-canvas");
  });

  it("stays in flow when standalone", () => {
    render(<Badge count={3} standalone />);

    const badge = screen.getByText("3").closest('[data-slot="badge"]');
    expect(badge).not.toHaveAttribute("data-overlay");
    expect(badge).not.toHaveClass("absolute");
  });

  it("renders a character badge", () => {
    render(<Badge text="New" />);

    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("New").closest('[data-slot="badge"]')).toHaveClass("rounded-lark-full");
  });

  it.each([
    ["default", "bg-[var(--lark-neutral-650)]"],
    ["success", "bg-[var(--lark-success-content-pressed)]"],
    ["warning", "bg-[var(--lark-warning-content-pressed)]"],
    ["danger", "bg-lark-danger-strong"],
    ["info", "bg-lark-primary"],
  ] as const)("applies the %s status colour", (status, className) => {
    render(<Badge count={1} status={status} />);

    expect(screen.getByText("1").closest('[data-slot="badge"]')).toHaveClass(className);
  });

  it("does not leak an overflowing count when text is shown", () => {
    render(<Badge text="New" count={120} />);

    expect(screen.getByText("New")).not.toHaveAttribute("aria-hidden");
    expect(screen.queryByText("120")).not.toBeInTheDocument();
  });

  it("does not announce a count for a dot", () => {
    const { container } = render(<Badge dot count={120} />);

    expect(container.querySelector('[data-slot="badge"]')).toBeEmptyDOMElement();
    expect(screen.queryByText("120")).not.toBeInTheDocument();
  });

  it("uses a custom accessible label for the count", () => {
    render(<Badge count={120} label="120 条未读消息" />);

    expect(screen.getByText("99+")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("120 条未读消息")).toHaveClass("sr-only");
  });
});
