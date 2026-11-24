import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { NoticeTone } from "./Notice";
import { Notice } from "./Notice";

const tones: NoticeTone[] = ["info", "success", "warning", "danger", "neutral"];

describe("Notice", () => {
  it.each(tones)("renders the %s tone as a polite status with its icon", (tone) => {
    const { container } = render(<Notice tone={tone}>内容</Notice>);
    const notice = screen.getByRole("status");

    expect(notice).toHaveAttribute("data-tone", tone);
    expect(notice).toHaveTextContent("内容");
    expect(container.querySelector('[data-slot="notice-icon"] svg')).not.toBeNull();
  });

  it("supports an assertive alert when the host opts in", () => {
    render(
      <Notice tone="danger" role="alert">
        保存失败
      </Notice>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("保存失败");
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("hides the status icon on request", () => {
    const { container } = render(<Notice showIcon={false}>仅文本</Notice>);
    expect(container.querySelector('[data-slot="notice-icon"]')).toBeNull();
  });

  it("renders a custom icon instead of the tone icon", () => {
    const { container } = render(
      <Notice icon={<span data-testid="custom-icon">!</span>}>自定义</Notice>,
    );

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    expect(container.querySelector('[data-slot="notice-icon"] svg')).toBeNull();
  });

  it("renders a title, description and an actionable slot", async () => {
    const onAction = vi.fn();
    render(
      <Notice
        title="标题"
        description="描述"
        action={
          <button type="button" onClick={onAction}>
            查看详情
          </button>
        }
      />,
    );

    expect(screen.getByText("标题")).toBeInTheDocument();
    expect(screen.getByText("描述")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "查看详情" }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("uses children as the description", () => {
    render(<Notice>来自 children</Notice>);
    expect(screen.getByText("来自 children")).toBeInTheDocument();
  });

  it("closes on click and calls onClose", async () => {
    const onClose = vi.fn();
    render(
      <Notice closable onClose={onClose}>
        可关闭
      </Notice>,
    );

    const close = screen.getByRole("button", { name: "关闭" });
    expect(close).toHaveAttribute("type", "button");
    await userEvent.click(close);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("closes from the keyboard with Enter and Space", async () => {
    const onClose = vi.fn();
    const { unmount } = render(
      <Notice closable onClose={onClose}>
        键盘
      </Notice>,
    );

    await userEvent.tab();
    const close = screen.getByRole("button", { name: "关闭" });
    expect(close).toHaveFocus();
    // The tinted surface makes the hover fill too weak for a focus indicator.
    const focus = getComputedStyle(close);
    expect(focus.outlineStyle).toBe("solid");
    expect(focus.outlineWidth).toBe("2px");
    await userEvent.keyboard("{Enter}");
    expect(onClose).toHaveBeenCalledTimes(1);
    unmount();

    render(
      <Notice closable onClose={onClose}>
        键盘
      </Notice>,
    );
    await userEvent.tab();
    await userEvent.keyboard(" ");
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("stays mounted and announces nothing on a timer", async () => {
    render(<Notice>常驻提示</Notice>);
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(screen.getByRole("status")).toHaveTextContent("常驻提示");
  });

  it("renders the compact size with the 12px type step", () => {
    render(<Notice size="sm">紧凑</Notice>);
    expect(screen.getByRole("status")).toHaveClass("text-lark-12");
  });

  it("keeps the UD 40px single-line height with and without a close button", () => {
    const { container } = render(
      <>
        <Notice>单行提示</Notice>
        <Notice closable>单行提示</Notice>
      </>,
    );
    const [plain, closable] = container.querySelectorAll('[data-slot="notice"]');

    // `.ud__notice--filled` is 9 + 22 + 9; UD's close button is a 24px icon
    // button with -1px block margins, so it must not stretch the notice.
    expect(plain.getBoundingClientRect().height).toBe(40);
    expect(closable.getBoundingClientRect().height).toBe(40);
  });

  it("keeps the compact single-line height with a close button", () => {
    const { container } = render(
      <Notice size="sm" closable>
        单行提示
      </Notice>,
    );
    const notice = container.querySelector('[data-slot="notice"]');

    expect(notice?.getBoundingClientRect().height).toBe(28);
  });
});
