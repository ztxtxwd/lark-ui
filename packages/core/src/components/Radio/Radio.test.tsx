import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Radio, RadioGroup } from "./Radio";

describe("Radio", () => {
  it("selects one option and reports the value", async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup aria-label="最小请假单位" onValueChange={onValueChange}>
        <Radio value="day">按天</Radio>
        <Radio value="hour">按小时</Radio>
      </RadioGroup>,
    );

    const day = screen.getByRole("radio", { name: "按天" });
    const hour = screen.getByRole("radio", { name: "按小时" });

    await userEvent.click(hour);
    expect(hour).toHaveAttribute("aria-checked", "true");
    expect(day).toHaveAttribute("aria-checked", "false");
    expect(onValueChange).toHaveBeenCalledWith("hour", expect.anything());
  });

  it("moves the selection with arrow keys", async () => {
    render(
      <RadioGroup aria-label="定价方式" defaultValue="monthly">
        <Radio value="monthly">按月</Radio>
        <Radio value="yearly">按年</Radio>
      </RadioGroup>,
    );

    const monthly = screen.getByRole("radio", { name: "按月" });
    await userEvent.click(monthly);
    await userEvent.keyboard("{ArrowDown}");

    expect(screen.getByRole("radio", { name: "按年" })).toHaveAttribute("aria-checked", "true");
  });

  it("disables the whole group", async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup aria-label="不可用" disabled onValueChange={onValueChange}>
        <Radio value="a">选项 A</Radio>
        <Radio value="b">选项 B</Radio>
      </RadioGroup>,
    );

    const option = screen.getByRole("radio", { name: "选项 A" });
    await userEvent.click(option);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(option).toHaveAttribute("aria-disabled", "true");
  });

  it("dims labels and descriptions when the group is disabled", () => {
    render(
      <RadioGroup aria-label="不可用" disabled>
        <Radio value="a" description="说明">
          选项 A
        </Radio>
      </RadioGroup>,
    );

    const label = screen.getByText("选项 A");
    expect(getComputedStyle(label).color).toBe("rgb(187, 191, 196)");
    expect(getComputedStyle(screen.getByText("说明")).color).toBe("rgb(187, 191, 196)");
    expect(getComputedStyle(label.closest("label") as HTMLElement).cursor).toBe("not-allowed");
  });

  it("keeps the control and row in place when selected", async () => {
    render(
      <RadioGroup aria-label="通知方式" defaultValue="all">
        <Radio value="all">全部消息</Radio>
        <Radio value="mention" description="只有被 @ 时通知">
          仅提及我的消息
        </Radio>
      </RadioGroup>,
    );

    const option = screen.getByRole("radio", { name: "仅提及我的消息" });
    const row = option.closest("label") as HTMLElement;
    const before = {
      control: option.getBoundingClientRect(),
      row: row.getBoundingClientRect(),
    };

    await userEvent.click(option);

    expect(option).toHaveAttribute("aria-checked", "true");
    // The box must not move when the dot appears.
    expect(option.getBoundingClientRect().top).toBe(before.control.top);
    expect(option.getBoundingClientRect().left).toBe(before.control.left);
    // Nor may the row itself shift.
    expect(row.getBoundingClientRect().top).toBe(before.row.top);
    expect(row.getBoundingClientRect().height).toBe(before.row.height);
  });

  it("keeps a consumer aria-label and aria-describedby", () => {
    render(
      <RadioGroup aria-label="通知方式">
        <Radio value="daily" aria-label="每天通知" aria-describedby="radio-hint">
          可见文案
        </Radio>
        <span id="radio-hint">提示</span>
      </RadioGroup>,
    );

    const radio = screen.getByRole("radio", { name: "每天通知" });
    expect(radio).toHaveAttribute("aria-describedby", "radio-hint");
  });

  it("lays options out horizontally when asked", () => {
    const { container } = render(
      <RadioGroup aria-label="方向" orientation="horizontal">
        <Radio value="a">A</Radio>
        <Radio value="b">B</Radio>
      </RadioGroup>,
    );

    const group = container.querySelector('[data-slot="radio-group"]');
    expect(group).toHaveClass("flex-row");
    // UD uses a 24px column gap and an 8px row gap when horizontal options wrap.
    expect(group).toHaveClass("gap-x-6", "gap-y-2");
    expect(group).not.toHaveClass("gap-6");
  });
});
