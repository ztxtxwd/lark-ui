import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { DatePicker } from "./DatePicker";

function day(value: string) {
  return document.querySelector<HTMLElement>(`[role="gridcell"][data-value="${value}"]`);
}

function trigger() {
  return screen.getByRole("button", { name: /选择日期/ });
}

function expectAlignedWithControl(dialog: HTMLElement) {
  const control = document.querySelector<HTMLElement>('[data-slot="date-picker-control"]');
  if (!control) {
    throw new Error("date picker control not found");
  }
  expect(
    Math.abs(parseFloat(getComputedStyle(dialog).left) - control.getBoundingClientRect().left),
  ).toBeLessThanOrEqual(1);
}

function ControlledDatePicker() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        打开日历
      </button>
      <DatePicker label="日期" open={open} onOpenChange={setOpen} />
    </>
  );
}

describe("DatePicker", () => {
  it("opens from the trigger and selects a single date", async () => {
    const onChange = vi.fn();
    render(<DatePicker label="日期" defaultValue="2026-10-16" onChange={onChange} />);

    const input = screen.getByRole("textbox", { name: "日期" });
    expect(input).toHaveValue("2026/10/16");
    expect(input).toHaveAttribute("aria-haspopup", "dialog");

    await userEvent.click(trigger());
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    const target = day("2026-10-20");
    expect(target).not.toBeNull();
    await userEvent.click(target as HTMLElement);

    expect(input).toHaveValue("2026/10/20");
    expect(onChange).toHaveBeenCalledTimes(1);
    const [value, formatted] = onChange.mock.calls[0];
    expect(value).toBeInstanceOf(Date);
    expect(formatted).toBe("2026-10-20");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(trigger()).toHaveFocus());
  });

  it("shows plain day numbers without the locale's day suffix", async () => {
    render(<DatePicker label="日期" defaultValue="2026-10-16" />);

    await userEvent.click(trigger());
    await screen.findByRole("dialog");

    const selected = day("2026-10-16") as HTMLElement;
    expect(selected).toHaveTextContent(/^16$/);
    expect(day("2026-10-01")).toHaveTextContent(/^1$/);
    // The full date stays available to assistive technology.
    expect(selected.getAttribute("aria-label")).toContain("2026年10月16日");
  });

  it("opens the calendar when the field is clicked", async () => {
    render(<DatePicker label="日期" defaultValue="2026-10-16" />);

    const input = screen.getByRole("textbox", { name: "日期" });
    await userEvent.click(input);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    // Focus lands on the calendar's tab stop, as when opening from the icon.
    await waitFor(() => expect(day("2026-10-16")).toHaveFocus());
  });

  it("aligns the calendar with the field's left edge", async () => {
    render(
      <div className="ml-10 w-80">
        <DatePicker label="日期" defaultValue="2026-10-16" />
      </div>,
    );

    await userEvent.click(screen.getByRole("textbox", { name: "日期" }));
    expectAlignedWithControl(await screen.findByRole("dialog"));
  });

  it("aligns the calendar with the field when it starts open", async () => {
    render(
      <div className="ml-10 w-80">
        <DatePicker label="日期" defaultOpen />
      </div>,
    );

    expectAlignedWithControl(await screen.findByRole("dialog"));
  });

  it("opens the calendar when either input of a range is clicked", async () => {
    render(<DatePicker mode="range" label="入住" />);

    await userEvent.click(screen.getByRole("textbox", { name: "入住 结束" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("names the calendar dialog like the field", async () => {
    render(<DatePicker label="日期" />);

    await userEvent.click(trigger());
    expect(await screen.findByRole("dialog", { name: "日期，选择日期" })).toBeInTheDocument();
  });

  it("uses a rendered label as the field's accessible name", () => {
    render(<DatePicker label={<span>入住日期</span>} />);
    expect(screen.getByRole("textbox", { name: "入住日期" })).toBeInTheDocument();
  });

  it("uses a rendered label as the range start's accessible name", () => {
    render(<DatePicker mode="range" label={<span>入住日期</span>} />);
    expect(screen.getByRole("textbox", { name: "入住日期" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "结束日期" })).toBeInTheDocument();
  });

  it("names the range dialog like the field", async () => {
    render(<DatePicker mode="range" label="入住" />);

    await userEvent.click(trigger());
    expect(await screen.findByRole("dialog", { name: "入住，选择日期范围" })).toBeInTheDocument();
  });

  it("types a date and commits it on Enter", async () => {
    const onChange = vi.fn();
    render(<DatePicker label="日期" defaultValue="2026-10-16" onChange={onChange} />);

    const input = screen.getByRole("textbox", { name: "日期" });
    await userEvent.clear(input);
    // A click opens the calendar and moves focus to it; typing starts from the
    // field itself, as when tabbing to it.
    await userEvent.type(input, "2026/10/21{Enter}", { skipClick: true });

    expect(input).toHaveValue("2026/10/21");
    expect(onChange).toHaveBeenLastCalledWith(expect.any(Date), "2026-10-21", undefined);
  });

  it("reverts invalid typed text", async () => {
    const onChange = vi.fn();
    render(<DatePicker label="日期" defaultValue="2026-10-16" onChange={onChange} />);

    const input = screen.getByRole("textbox", { name: "日期" });
    await userEvent.clear(input);
    await userEvent.type(input, "not-a-date{Enter}", { skipClick: true });

    expect(input).toHaveValue("2026/10/16");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("rejects typed text with trailing letters", async () => {
    const onChange = vi.fn();
    render(<DatePicker label="日期" defaultValue="2026-10-16" onChange={onChange} />);

    const input = screen.getByRole("textbox", { name: "日期" });
    await userEvent.clear(input);
    await userEvent.type(input, "2026/10/21abc{Enter}", { skipClick: true });

    expect(input).toHaveValue("2026/10/16");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("moves through the calendar with arrow keys and picks with Enter", async () => {
    render(<DatePicker label="日期" defaultValue="2026-10-16" />);

    await userEvent.click(trigger());
    await screen.findByRole("dialog");
    await waitFor(() => expect(day("2026-10-16")).toHaveFocus());

    await userEvent.keyboard("{ArrowRight}{Enter}");
    expect(screen.getByRole("textbox", { name: "日期" })).toHaveValue("2026/10/17");
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    render(<DatePicker label="日期" defaultValue="2026-10-16" />);

    const openTrigger = trigger();
    await userEvent.click(openTrigger);
    await screen.findByRole("dialog");
    await userEvent.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(openTrigger).toHaveFocus());
  });

  it("disables days outside min and max", async () => {
    render(<DatePicker label="日期" defaultValue="2026-10-16" min="2026-10-10" max="2026-10-20" />);

    await userEvent.click(trigger());
    await screen.findByRole("dialog");

    const beforeMin = day("2026-10-09") as HTMLElement;
    const afterMax = day("2026-10-21") as HTMLElement;
    expect(beforeMin).toHaveAttribute("aria-disabled", "true");
    expect(afterMax).toHaveAttribute("aria-disabled", "true");
    expect(day("2026-10-15")).not.toHaveAttribute("aria-disabled");

    await userEvent.click(beforeMin);
    expect(screen.getByRole("textbox", { name: "日期" })).toHaveValue("2026/10/16");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("keeps dates named by disabledDate unpickable", async () => {
    const onChange = vi.fn();
    render(
      <DatePicker
        label="日期"
        defaultValue="2026-10-16"
        disabledDate={(date) => date.getDay() === 0}
        onChange={onChange}
      />,
    );

    await userEvent.click(trigger());
    await screen.findByRole("dialog");

    const sunday = day("2026-10-18") as HTMLElement;
    expect(sunday).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(sunday);

    expect(screen.getByRole("textbox", { name: "日期" })).toHaveValue("2026/10/16");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("displays and reports dates in the configured formats", async () => {
    const onChange = vi.fn();
    render(
      <DatePicker
        label="日期"
        format="YYYY.MM.DD"
        valueFormat="YYYY/MM/DD"
        defaultValue="2026/10/16"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole("textbox", { name: "日期" });
    expect(input).toHaveValue("2026.10.16");

    await userEvent.clear(input);
    await userEvent.type(input, "2026.10.20{Enter}", { skipClick: true });

    expect(input).toHaveValue("2026.10.20");
    expect(onChange).toHaveBeenLastCalledWith(expect.any(Date), "2026/10/20", undefined);
  });

  it("clears the value and returns focus to the field", async () => {
    const onChange = vi.fn();
    render(<DatePicker label="日期" defaultValue="2026-10-16" onChange={onChange} />);

    const input = screen.getByRole("textbox", { name: "日期" });
    await userEvent.click(screen.getByRole("button", { name: "清除" }));

    expect(input).toHaveValue("");
    expect(onChange).toHaveBeenLastCalledWith(null, null, expect.anything());
    expect(input).toHaveFocus();
  });

  it("types both ends of a range and commits the sorted range", async () => {
    const onChange = vi.fn();
    render(<DatePicker mode="range" label="入住" onChange={onChange} />);

    const start = screen.getByRole("textbox", { name: "入住 开始" });
    const end = screen.getByRole("textbox", { name: "入住 结束" });
    start.focus();
    await userEvent.type(start, "2026/10/20", { skipClick: true });
    // Moving to the end field commits the start draft, then the end is typed.
    end.focus();
    await userEvent.type(end, "2026/10/16{Enter}", { skipClick: true });

    expect(start).toHaveValue("2026/10/16");
    expect(end).toHaveValue("2026/10/20");
    expect(onChange).toHaveBeenLastCalledWith(
      [expect.any(Date), expect.any(Date)],
      ["2026-10-16", "2026-10-20"],
      undefined,
    );
  });

  it("selects a range and closes after the end date", async () => {
    const onChange = vi.fn();
    render(
      <DatePicker
        mode="range"
        label="入住"
        defaultValue={["2026-10-12", "2026-10-16"]}
        onChange={onChange}
      />,
    );

    const start = screen.getByRole("textbox", { name: "入住 开始" });
    const end = screen.getByRole("textbox", { name: "入住 结束" });
    expect(start).toHaveValue("2026/10/12");
    expect(end).toHaveValue("2026/10/16");

    await userEvent.click(trigger());
    await screen.findByRole("dialog");

    await userEvent.click(day("2026-10-20") as HTMLElement);
    expect(start).toHaveValue("2026/10/12");
    expect(end).toHaveValue("2026/10/16");

    await userEvent.click(day("2026-10-23") as HTMLElement);

    expect(start).toHaveValue("2026/10/20");
    expect(end).toHaveValue("2026/10/23");
    expect(onChange).toHaveBeenCalledTimes(1);
    const [value, formatted] = onChange.mock.calls[0];
    expect(value).toEqual([expect.any(Date), expect.any(Date)]);
    expect(formatted).toEqual(["2026-10-20", "2026-10-23"]);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("shows the Today and Clear footer actions", async () => {
    const onChange = vi.fn();
    render(<DatePicker label="日期" footer onChange={onChange} />);

    await userEvent.click(trigger());
    await screen.findByRole("dialog");
    expect(screen.getByRole("button", { name: "今天" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "清除" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "今天" }));

    const input = screen.getByRole("textbox", { name: "日期" });
    expect(input).not.toHaveValue("");
    expect(onChange).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("makes the footer Today action pick today as a range", async () => {
    const onChange = vi.fn();
    const now = new Date();
    const today = `${String(now.getFullYear()).padStart(4, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    render(<DatePicker mode="range" label="入住" footer onChange={onChange} />);

    await userEvent.click(trigger());
    await screen.findByRole("dialog");
    const todayButton = screen.getByRole("button", { name: "今天" });
    expect(todayButton).not.toHaveAttribute("aria-disabled", "true");

    await userEvent.click(todayButton);

    expect(onChange).toHaveBeenLastCalledWith(
      [expect.any(Date), expect.any(Date)],
      [today, today],
      expect.anything(),
    );
    expect(screen.getByRole("textbox", { name: "入住 开始" })).not.toHaveValue("");
    expect(screen.getByRole("textbox", { name: "入住 结束" })).not.toHaveValue("");
  });

  it("does not open or change when disabled", async () => {
    render(<DatePicker label="日期" disabled defaultValue="2026-10-16" />);

    const input = screen.getByRole("textbox", { name: "日期" });
    const openTrigger = trigger();
    expect(input).toBeDisabled();
    expect(openTrigger).toBeDisabled();
    expect(screen.getByRole("button", { name: "清除" })).toBeDisabled();

    await userEvent.click(openTrigger);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens but does not change when read-only", async () => {
    const onChange = vi.fn();
    render(<DatePicker label="日期" readOnly defaultValue="2026-10-16" onChange={onChange} />);

    const input = screen.getByRole("textbox", { name: "日期" });
    expect(input).toHaveAttribute("readonly");

    await userEvent.click(trigger());
    await screen.findByRole("dialog");
    await userEvent.click(day("2026-10-20") as HTMLElement);

    expect(input).toHaveValue("2026/10/16");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("honours a controlled open prop", async () => {
    render(<ControlledDatePicker />);
    await userEvent.click(screen.getByRole("button", { name: "打开日历" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("shows a controlled value and updates when the prop changes", () => {
    const { rerender } = render(<DatePicker label="日期" value="2026-10-16" />);
    expect(screen.getByRole("textbox", { name: "日期" })).toHaveValue("2026/10/16");

    rerender(<DatePicker label="日期" value="2026-10-20" />);
    expect(screen.getByRole("textbox", { name: "日期" })).toHaveValue("2026/10/20");
  });

  it("renders the documented trigger heights", () => {
    const { rerender } = render(<DatePicker label="日期" size="sm" />);
    expect(document.querySelector('[data-slot="date-picker-control"]')).toHaveClass("h-7");

    rerender(<DatePicker label="日期" size="md" />);
    expect(document.querySelector('[data-slot="date-picker-control"]')).toHaveClass("h-8");

    rerender(<DatePicker label="日期" size="lg" />);
    expect(document.querySelector('[data-slot="date-picker-control"]')).toHaveClass("h-10");
  });
});
