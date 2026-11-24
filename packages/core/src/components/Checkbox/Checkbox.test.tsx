import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("toggles with pointer and keyboard", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox onCheckedChange={onCheckedChange}>同意条款</Checkbox>);

    const checkbox = screen.getByRole("checkbox", { name: "同意条款" });
    expect(checkbox).toHaveAttribute("aria-checked", "false");

    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenLastCalledWith(true, expect.anything());

    await userEvent.keyboard(" ");
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  it("shows the indeterminate state and a minus indicator", () => {
    const { container } = render(<Checkbox checked="indeterminate">全选</Checkbox>);

    expect(screen.getByRole("checkbox", { name: "全选" })).toHaveAttribute("aria-checked", "mixed");
    expect(container.querySelector("svg path[d='M3.25 8h9.5']")).not.toBeNull();
  });

  it("cycles indeterminate → checked → unchecked", async () => {
    render(<Checkbox defaultChecked="indeterminate">全选</Checkbox>);

    const checkbox = screen.getByRole("checkbox", { name: "全选" });
    expect(checkbox).toHaveAttribute("aria-checked", "mixed");

    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "true");

    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  it("does not toggle when disabled", async () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox disabled onCheckedChange={onCheckedChange}>
        禁用选项
      </Checkbox>,
    );

    const checkbox = screen.getByRole("checkbox", { name: "禁用选项" });
    await userEvent.click(checkbox);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  it("renders a description and associates it with the control", () => {
    render(<Checkbox description="每周一发送摘要">订阅</Checkbox>);

    const description = screen.getByText("每周一发送摘要");
    const checkbox = screen.getByRole("checkbox", { name: "订阅" });
    expect(checkbox).toHaveAttribute("aria-describedby", description.id);
  });

  it("keeps a consumer aria-label and aria-describedby", () => {
    render(
      <>
        <Checkbox aria-label="选择第 1 行" aria-describedby="selection-hint">
          可见文案
        </Checkbox>
        <span id="selection-hint">提示</span>
      </>,
    );

    const checkbox = screen.getByRole("checkbox", { name: "选择第 1 行" });
    expect(checkbox).toHaveAttribute("aria-describedby", "selection-hint");
  });

  it("keeps the control and row in place when checked", async () => {
    render(
      <div className="flex flex-col gap-2">
        <Checkbox>同意条款</Checkbox>
        <Checkbox description="每周一发送摘要">订阅</Checkbox>
      </div>,
    );

    const plain = screen.getByRole("checkbox", { name: "同意条款" });
    const withDescription = screen.getByRole("checkbox", { name: "订阅" });
    const plainRow = plain.closest("label") as HTMLElement;
    const describedRow = withDescription.closest("label") as HTMLElement;

    const before = {
      plain: plain.getBoundingClientRect(),
      withDescription: withDescription.getBoundingClientRect(),
      plainRow: plainRow.getBoundingClientRect(),
      describedRow: describedRow.getBoundingClientRect(),
    };

    await userEvent.click(plain);
    await userEvent.click(withDescription);

    expect(plain).toHaveAttribute("aria-checked", "true");
    expect(withDescription).toHaveAttribute("aria-checked", "true");

    // The box must not move when the indicator appears.
    expect(plain.getBoundingClientRect().top).toBe(before.plain.top);
    expect(plain.getBoundingClientRect().left).toBe(before.plain.left);
    expect(withDescription.getBoundingClientRect().top).toBe(before.withDescription.top);
    expect(withDescription.getBoundingClientRect().left).toBe(before.withDescription.left);

    // Nor may the row itself shift.
    expect(plainRow.getBoundingClientRect().top).toBe(before.plainRow.top);
    expect(describedRow.getBoundingClientRect().top).toBe(before.describedRow.top);
    expect(plainRow.getBoundingClientRect().height).toBe(before.plainRow.height);
    expect(describedRow.getBoundingClientRect().height).toBe(before.describedRow.height);

    // Unchecking moves the box back to the same place too.
    await userEvent.click(plain);
    expect(plain).toHaveAttribute("aria-checked", "false");
    expect(plain.getBoundingClientRect().top).toBe(before.plain.top);
  });

  it("dims the label and description when disabled", () => {
    render(
      <Checkbox disabled description="每周一发送摘要">
        订阅
      </Checkbox>,
    );

    expect(getComputedStyle(screen.getByText("订阅")).color).toBe("rgb(187, 191, 196)");
    expect(getComputedStyle(screen.getByText("每周一发送摘要")).color).toBe("rgb(187, 191, 196)");
  });
});
