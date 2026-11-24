import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { TimePicker } from "./TimePicker";

function trigger() {
  return screen.getByRole("button", { name: /选择时间/ });
}

function column(name: string) {
  return screen.getByRole("listbox", { name });
}

function expectAlignedWithControl(dialog: HTMLElement) {
  const control = document.querySelector<HTMLElement>('[data-slot="time-picker-control"]');
  if (!control) {
    throw new Error("time picker control not found");
  }
  expect(
    Math.abs(parseFloat(getComputedStyle(dialog).left) - control.getBoundingClientRect().left),
  ).toBeLessThanOrEqual(1);
}

function ControlledTimePicker() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        打开时间
      </button>
      <TimePicker label="时间" open={open} onOpenChange={setOpen} />
    </>
  );
}

describe("TimePicker", () => {
  it("opens and selects hours and minutes from the columns", async () => {
    const onChange = vi.fn();
    render(<TimePicker label="时间" defaultValue="09:30" onChange={onChange} />);

    const [hour, minute] = screen.getAllByRole("spinbutton") as HTMLInputElement[];
    expect(hour.value).toBe("09");
    expect(minute.value).toBe("30");

    await userEvent.click(trigger());
    const dialog = await screen.findByRole("dialog", { name: "选择时间" });
    expect(dialog).toBeInTheDocument();

    await userEvent.click(within(column("时")).getByRole("option", { name: "14" }));
    expect(onChange).toHaveBeenLastCalledWith("14:30", expect.anything());

    await userEvent.click(within(column("分")).getByRole("option", { name: "45" }));
    expect(onChange).toHaveBeenLastCalledWith("14:45", expect.anything());
    expect(dialog).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(trigger()).toHaveFocus());
  });

  it("opens the panel when the field is clicked and keeps focus there", async () => {
    render(<TimePicker label="时间" defaultValue="09:30" />);

    const [hour] = screen.getAllByRole("spinbutton") as HTMLInputElement[];
    await userEvent.click(hour);

    expect(await screen.findByRole("dialog", { name: "选择时间" })).toBeInTheDocument();
    await waitFor(() => expect(hour).toHaveFocus());
  });

  it("aligns the panel with the field's left edge", async () => {
    render(
      <div className="ml-10 w-80">
        <TimePicker label="时间" defaultValue="09:30" />
      </div>,
    );

    await userEvent.click(trigger());
    expectAlignedWithControl(await screen.findByRole("dialog"));
  });

  it("aligns the panel with the field when it starts open", async () => {
    render(
      <div className="ml-10 w-80">
        <TimePicker label="时间" defaultOpen />
      </div>,
    );

    expectAlignedWithControl(await screen.findByRole("dialog"));
  });

  it("names the segmented field when no label is given", () => {
    render(<TimePicker defaultValue="09:30" />);
    expect(screen.getByRole("group", { name: "时间" })).toBeInTheDocument();
  });

  it("types a time into the segmented field", async () => {
    const onChange = vi.fn();
    render(<TimePicker label="时间" onChange={onChange} />);

    const [hour] = screen.getAllByRole("spinbutton");
    await userEvent.click(hour);
    await userEvent.type(hour, "1430");

    const segments = screen.getAllByRole("spinbutton") as HTMLInputElement[];
    expect(segments[0].value).toBe("14");
    expect(segments[1].value).toBe("30");
    expect(onChange).toHaveBeenLastCalledWith("14:30", expect.anything());
  });

  it("reverts an out-of-range typed time", async () => {
    const onChange = vi.fn();
    render(<TimePicker label="时间" minTime="09:00" maxTime="11:00" onChange={onChange} />);

    const [hour] = screen.getAllByRole("spinbutton");
    await userEvent.click(hour);
    await userEvent.type(hour, "1430");

    const segments = screen.getAllByRole("spinbutton") as HTMLInputElement[];
    expect(segments[0].value).toBe("");
    expect(segments[1].value).toBe("");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("moves through a column with arrow keys and commits with Enter", async () => {
    const onChange = vi.fn();
    render(<TimePicker label="时间" defaultValue="09:30" onChange={onChange} />);

    await userEvent.click(trigger());
    await screen.findByRole("dialog");

    const hours = column("时");
    const selected = within(hours).getByRole("option", { name: "09" });
    await waitFor(() => expect(selected).toHaveFocus());

    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenLastCalledWith("10:30", expect.anything());
  });

  it("clears the value and returns focus to the first segment", async () => {
    const onChange = vi.fn();
    render(<TimePicker label="时间" defaultValue="09:30" onChange={onChange} />);

    await userEvent.click(screen.getByRole("button", { name: "清除" }));

    expect(onChange).toHaveBeenLastCalledWith(null, expect.anything());
    const segments = screen.getAllByRole("spinbutton");
    expect(segments[0]).toHaveFocus();
  });

  it("disables times outside min and max", async () => {
    render(<TimePicker label="时间" minTime="09:00" maxTime="11:00" />);

    await userEvent.click(trigger());
    await screen.findByRole("dialog");
    const hours = column("时");

    expect(within(hours).getByRole("option", { name: "08" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(within(hours).getByRole("option", { name: "12" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(within(hours).getByRole("option", { name: "10" })).not.toHaveAttribute("aria-disabled");
  });

  it("keeps an hour selectable while part of it is within maxTime", async () => {
    render(<TimePicker label="时间" defaultValue="10:30" maxTime="11:00" />);

    await userEvent.click(trigger());
    await screen.findByRole("dialog");
    const hours = column("时");

    expect(within(hours).getByRole("option", { name: "11" })).not.toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(within(hours).getByRole("option", { name: "12" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("clamps the minute when the picked hour crosses maxTime", async () => {
    const onChange = vi.fn();
    render(<TimePicker label="时间" defaultValue="10:30" maxTime="11:00" onChange={onChange} />);

    await userEvent.click(trigger());
    await screen.findByRole("dialog");
    await userEvent.click(within(column("时")).getByRole("option", { name: "11" }));

    expect(onChange).toHaveBeenLastCalledWith("11:00", expect.anything());
  });

  it("clamps the minute when the picked hour crosses minTime", async () => {
    const onChange = vi.fn();
    render(<TimePicker label="时间" defaultValue="09:30" minTime="10:45" onChange={onChange} />);

    await userEvent.click(trigger());
    await screen.findByRole("dialog");
    await userEvent.click(within(column("时")).getByRole("option", { name: "10" }));

    expect(onChange).toHaveBeenLastCalledWith("10:45", expect.anything());
  });

  it("clamps the seconds when the picked minute crosses maxTime", async () => {
    const onChange = vi.fn();
    render(
      <TimePicker
        label="时间"
        format="HH:mm:ss"
        defaultValue="11:29:50"
        maxTime="11:30:45"
        onChange={onChange}
      />,
    );

    await userEvent.click(trigger());
    await screen.findByRole("dialog");
    await userEvent.click(within(column("分")).getByRole("option", { name: "30" }));

    expect(onChange).toHaveBeenLastCalledWith("11:30:45", expect.anything());
  });

  it("keeps an hour selectable while part of it is within minTime", async () => {
    render(<TimePicker label="时间" defaultValue="10:30" minTime="10:45" />);

    await userEvent.click(trigger());
    await screen.findByRole("dialog");
    const hours = column("时");

    expect(within(hours).getByRole("option", { name: "10" })).not.toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(within(hours).getByRole("option", { name: "09" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("keeps a minute selectable while part of it is within maxTime with seconds", async () => {
    render(
      <TimePicker label="时间" format="HH:mm:ss" defaultValue="11:30:50" maxTime="11:30:45" />,
    );

    await userEvent.click(trigger());
    await screen.findByRole("dialog");
    const minutes = column("分");

    expect(within(minutes).getByRole("option", { name: "30" })).not.toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(within(minutes).getByRole("option", { name: "31" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("disables times named by disabledTime", async () => {
    render(<TimePicker label="时间" disabledTime={(time) => time.hour === 10} />);

    await userEvent.click(trigger());
    await screen.findByRole("dialog");
    const hours = column("时");

    expect(within(hours).getByRole("option", { name: "10" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(within(hours).getByRole("option", { name: "09" })).not.toHaveAttribute("aria-disabled");
  });

  it("applies hour and minute steps to the columns", async () => {
    render(<TimePicker label="时间" hourStep={2} minuteStep={15} />);

    await userEvent.click(trigger());
    await screen.findByRole("dialog");
    const hours = column("时");
    const minutes = column("分");

    expect(within(hours).getByRole("option", { name: "00" })).toBeInTheDocument();
    expect(within(hours).getByRole("option", { name: "02" })).toBeInTheDocument();
    expect(within(hours).queryByRole("option", { name: "01" })).not.toBeInTheDocument();

    expect(within(minutes).getByRole("option", { name: "15" })).toBeInTheDocument();
    expect(within(minutes).queryByRole("option", { name: "10" })).not.toBeInTheDocument();
  });

  it("supports a 12-hour clock with a day-period column", async () => {
    const onChange = vi.fn();
    render(<TimePicker label="时间" format="hh:mm A" defaultValue="14:30" onChange={onChange} />);

    await userEvent.click(trigger());
    await screen.findByRole("dialog");

    expect(within(column("上午/下午")).getByRole("option", { name: "下午" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await userEvent.click(within(column("上午/下午")).getByRole("option", { name: "上午" }));
    expect(onChange).toHaveBeenLastCalledWith("02:30", expect.anything());
  });

  it("keeps the day period selectable when part of it is within minTime", async () => {
    render(<TimePicker label="时间" format="hh:mm A" defaultValue="12:30" minTime="12:45" />);

    await userEvent.click(trigger());
    await screen.findByRole("dialog");
    const periods = column("上午/下午");

    expect(within(periods).getByRole("option", { name: "上午" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(within(periods).getByRole("option", { name: "下午" })).not.toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(within(column("时")).getByRole("option", { name: "12" })).not.toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("disables a day period whose current hour is unavailable", async () => {
    render(
      <TimePicker
        label="时间"
        format="hh:mm A"
        defaultValue="10:30"
        disabledTime={(time) => time.hour === 22}
      />,
    );

    await userEvent.click(trigger());
    await screen.findByRole("dialog");
    const periods = column("上午/下午");

    expect(within(periods).getByRole("option", { name: "下午" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("shows a seconds column when the format has seconds", async () => {
    const onChange = vi.fn();
    render(
      <TimePicker label="时间" format="HH:mm:ss" defaultValue="09:30:15" onChange={onChange} />,
    );

    await userEvent.click(trigger());
    await screen.findByRole("dialog");
    expect(column("秒")).toBeInTheDocument();

    await userEvent.click(within(column("秒")).getByRole("option", { name: "45" }));
    expect(onChange).toHaveBeenLastCalledWith("09:30:45", expect.anything());
  });

  it("honours a controlled open prop", async () => {
    render(<ControlledTimePicker />);

    await userEvent.click(screen.getByRole("button", { name: "打开时间" }));
    expect(await screen.findByRole("dialog", { name: "选择时间" })).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("closes on an outside press", async () => {
    render(<TimePicker label="时间" defaultValue="09:30" />);

    await userEvent.click(trigger());
    await screen.findByRole("dialog");
    await userEvent.click(document.body);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("does not open or change when disabled", async () => {
    render(<TimePicker label="时间" disabled defaultValue="09:30" />);

    for (const segment of screen.getAllByRole("spinbutton")) {
      expect(segment).toBeDisabled();
    }
    const openTrigger = trigger();
    expect(openTrigger).toBeDisabled();
    expect(screen.getByRole("button", { name: "清除" })).toBeDisabled();

    await userEvent.click(openTrigger);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps its value but blocks edits when read-only", async () => {
    const onChange = vi.fn();
    render(<TimePicker label="时间" readOnly defaultValue="09:30" onChange={onChange} />);

    const segments = screen.getAllByRole("spinbutton");
    expect(segments[0]).toHaveAttribute("readonly");

    // Clicking the field opens the panel; it just can't change the value.
    await userEvent.click(segments[0]);
    await screen.findByRole("dialog");
    await userEvent.keyboard("{ArrowUp}");
    expect(onChange).not.toHaveBeenCalled();

    const hourTen = within(column("时")).getByRole("option", { name: "10" });
    expect(hourTen).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(hourTen);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("shows a controlled value and updates when the prop changes", () => {
    const { rerender } = render(<TimePicker label="时间" value="09:30" />);
    let segments = screen.getAllByRole("spinbutton") as HTMLInputElement[];
    expect([segments[0].value, segments[1].value]).toEqual(["09", "30"]);

    rerender(<TimePicker label="时间" value="14:45" />);
    segments = screen.getAllByRole("spinbutton") as HTMLInputElement[];
    expect([segments[0].value, segments[1].value]).toEqual(["14", "45"]);
  });

  it("renders the documented trigger heights", () => {
    const { rerender } = render(<TimePicker label="时间" size="sm" />);
    expect(document.querySelector('[data-slot="time-picker-control"]')).toHaveClass("h-7");

    rerender(<TimePicker label="时间" size="md" />);
    expect(document.querySelector('[data-slot="time-picker-control"]')).toHaveClass("h-8");

    rerender(<TimePicker label="时间" size="lg" />);
    expect(document.querySelector('[data-slot="time-picker-control"]')).toHaveClass("h-10");
  });
});
