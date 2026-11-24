import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./Input";

function pointerDown(target: Element | Document, x: number) {
  fireEvent.pointerDown(target, {
    pointerId: 1,
    isPrimary: true,
    button: 0,
    buttons: 1,
    clientX: x,
    clientY: 10,
  });
}

function pointerMove(target: Element | Document, x: number) {
  fireEvent.pointerMove(target, {
    pointerId: 1,
    isPrimary: true,
    buttons: 1,
    clientX: x,
    clientY: 10,
  });
}

function pointerUp(target: Element | Document, x: number) {
  fireEvent.pointerUp(target, {
    pointerId: 1,
    isPrimary: true,
    button: 0,
    buttons: 0,
    clientX: x,
    clientY: 10,
  });
}

describe("Input", () => {
  it("renders a labelled text field and forwards typing", async () => {
    const onValueChange = vi.fn();
    render(<Input aria-label="邮箱" onValueChange={onValueChange} />);

    const input = screen.getByRole("textbox", { name: "邮箱" });
    await userEvent.type(input, "ada@example.com");

    expect(input).toHaveValue("ada@example.com");
    expect(onValueChange).toHaveBeenCalled();
  });

  it("clears the value and returns focus to the field", async () => {
    render(<Input aria-label="搜索" defaultValue="飞书" allowClear />);

    const input = screen.getByRole("textbox", { name: "搜索" });
    const clear = await screen.findByRole("button", { name: "清除" });
    await userEvent.click(clear);

    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
  });

  it("shows an invalid border and aria-invalid", () => {
    const { container } = render(<Input aria-label="邮箱" invalid />);

    expect(screen.getByRole("textbox", { name: "邮箱" })).toHaveAttribute("aria-invalid", "true");
    expect(container.querySelector('[data-slot="input-group"]')).toHaveAttribute("data-invalid");
  });

  it("does not accept typing when disabled", async () => {
    render(<Input aria-label="邮箱" disabled />);

    const input = screen.getByRole("textbox", { name: "邮箱" });
    expect(input).toBeDisabled();
    await userEvent.type(input, "blocked");
    expect(input).toHaveValue("");
  });

  it("renders the documented heights for each size", () => {
    const { rerender } = render(<Input aria-label="输入" size="sm" />);
    const group = document.querySelector('[data-slot="input-group"]');
    expect(group).toHaveClass("h-7");
    // UD keeps an 8px gap between icons and the field at every size.
    expect(group).toHaveClass("gap-2");

    rerender(<Input aria-label="输入" size="md" />);
    expect(document.querySelector('[data-slot="input-group"]')).toHaveClass("h-8");

    rerender(<Input aria-label="输入" size="lg" />);
    expect(document.querySelector('[data-slot="input-group"]')).toHaveClass("h-10");
  });

  it("keeps the neutral border when a disabled field is also invalid", async () => {
    const { container } = render(<Input aria-label="邮箱" invalid disabled />);
    const group = container.querySelector('[data-slot="input-group"]') as HTMLElement;

    await vi.waitFor(() => {
      expect(group).toHaveAttribute("data-disabled");
    });
    await vi.waitFor(() => {
      expect(getComputedStyle(group).borderColor).toBe("rgb(208, 211, 214)");
    });

    await userEvent.hover(group);
    await vi.waitFor(() => {
      expect(getComputedStyle(group).borderColor).toBe("rgb(208, 211, 214)");
    });
  });

  it("sizes and tones affix icons for each size", () => {
    const { rerender } = render(
      <Input
        aria-label="搜索"
        size="sm"
        startIcon={<svg data-testid="start" />}
        endIcon={<svg data-testid="end" />}
      />,
    );

    expect(getComputedStyle(screen.getByTestId("start")).width).toBe("14px");
    expect(getComputedStyle(screen.getByTestId("end")).color).toBe("rgb(100, 106, 115)");

    rerender(
      <Input
        aria-label="搜索"
        size="lg"
        startIcon={<svg data-testid="start" />}
        endIcon={<svg data-testid="end" />}
      />,
    );
    expect(getComputedStyle(screen.getByTestId("start")).width).toBe("20px");
  });

  it("dims affix icons when disabled", async () => {
    const { container } = render(
      <Input aria-label="搜索" disabled startIcon={<svg data-testid="start" />} />,
    );

    const group = container.querySelector('[data-slot="input-group"]') as HTMLElement;
    await vi.waitFor(() => {
      expect(group).toHaveAttribute("data-disabled");
    });
    expect(getComputedStyle(screen.getByTestId("start")).color).toBe("rgb(187, 191, 196)");
  });

  it("sizes the clear icon for the input size", async () => {
    const { rerender } = render(
      <Input aria-label="搜索" size="sm" defaultValue="飞书" allowClear />,
    );

    let clear = await screen.findByRole("button", { name: "清除" });
    expect(getComputedStyle(clear.querySelector("svg") as SVGElement).width).toBe("10px");
    expect(getComputedStyle(clear).color).toBe("rgb(100, 106, 115)");

    rerender(<Input aria-label="搜索" size="lg" defaultValue="飞书" allowClear />);
    clear = await screen.findByRole("button", { name: "清除" });
    expect(getComputedStyle(clear.querySelector("svg") as SVGElement).width).toBe("16px");
  });

  it("supports a start icon and end icon", () => {
    render(
      <Input
        aria-label="搜索"
        startIcon={<svg data-testid="start" />}
        endIcon={<svg data-testid="end" />}
      />,
    );

    expect(screen.getByTestId("start")).toBeInTheDocument();
    expect(screen.getByTestId("end")).toBeInTheDocument();
  });

  describe("numeric", () => {
    it("renders a number field and reports numeric values", async () => {
      const onValueChange = vi.fn();
      render(
        <Input
          numeric
          aria-label="字号"
          defaultValue={14}
          min={12}
          max={72}
          onValueChange={onValueChange}
        />,
      );

      const input = screen.getByRole("textbox", { name: "字号" });
      expect(input).toHaveValue("14");
      // Integer steps ask for a numeric keypad; fractional steps use decimal.
      expect(input).toHaveAttribute("inputmode", "numeric");

      await userEvent.clear(input);
      await userEvent.type(input, "36");
      expect(onValueChange).toHaveBeenLastCalledWith(36, expect.anything());
    });

    it("drags the leading icon to scrub the value", async () => {
      const onValueChange = vi.fn();
      const onValueCommit = vi.fn();
      render(
        <Input
          numeric
          aria-label="字号"
          defaultValue={10}
          min={0}
          max={100}
          onValueChange={onValueChange}
          onValueCommit={onValueCommit}
        />,
      );

      const input = screen.getByRole("textbox", { name: "字号" });
      const handle = screen.getByTitle("拖动调整数值");

      pointerDown(handle, 100);
      pointerMove(document, 108);
      await vi.waitFor(() => expect(input).toHaveValue("14"));
      // 2px per step by default: +8px is four steps.
      expect(onValueChange).toHaveBeenLastCalledWith(14, expect.anything());
      expect(onValueCommit).not.toHaveBeenCalled();

      pointerUp(document, 108);
      expect(onValueCommit).toHaveBeenCalledWith(14, expect.anything());
    });

    it("respects pixelsPerStep while scrubbing", async () => {
      render(
        <Input numeric aria-label="字号" defaultValue={10} min={0} max={100} pixelsPerStep={4} />,
      );

      const input = screen.getByRole("textbox", { name: "字号" });
      const handle = screen.getByTitle("拖动调整数值");

      pointerDown(handle, 100);
      pointerMove(document, 108);
      await vi.waitFor(() => expect(input).toHaveValue("12"));
      pointerUp(document, 108);
    });

    it("focuses and selects the field when the handle is clicked without moving", async () => {
      render(<Input numeric aria-label="数量" defaultValue={7} min={0} max={10} />);

      const input = screen.getByRole("textbox", { name: "数量" }) as HTMLInputElement;
      const handle = screen.getByTitle("拖动调整数值");

      pointerDown(handle, 40);
      pointerUp(document, 40);

      await vi.waitFor(() => expect(input).toHaveFocus());
      expect(input.selectionStart).toBe(0);
      expect(input.selectionEnd).toBe(1);
    });

    it("steps with the keyboard and takes a large step with Shift", async () => {
      render(<Input numeric aria-label="数量" defaultValue={5} min={0} max={100} />);

      const input = screen.getByRole("textbox", { name: "数量" });
      input.focus();

      await userEvent.keyboard("{ArrowUp}");
      expect(input).toHaveValue("6");

      await userEvent.keyboard("{Shift>}{ArrowUp}{/Shift}");
      expect(input).toHaveValue("16");

      await userEvent.keyboard("{ArrowDown}");
      expect(input).toHaveValue("15");
    });

    it("clamps a scrub to min and max", async () => {
      render(<Input numeric aria-label="数量" defaultValue={10} min={0} max={12} />);

      const input = screen.getByRole("textbox", { name: "数量" });
      const handle = screen.getByTitle("拖动调整数值");

      pointerDown(handle, 50);
      pointerMove(document, 150);
      pointerUp(document, 150);
      await vi.waitFor(() => expect(input).toHaveValue("12"));

      pointerDown(handle, 50);
      pointerMove(document, -50);
      pointerUp(document, -50);
      await vi.waitFor(() => expect(input).toHaveValue("0"));
    });

    it("does not scrub while disabled", () => {
      render(<Input numeric aria-label="数量" defaultValue={5} min={0} max={10} disabled />);

      const input = screen.getByRole("textbox", { name: "数量" });
      const handle = screen.getByTitle("拖动调整数值");
      expect(input).toBeDisabled();
      expect(handle).toHaveAttribute("data-disabled");
      expect(getComputedStyle(handle).color).toBe("rgb(187, 191, 196)");

      pointerDown(handle, 40);
      pointerMove(document, 60);
      pointerUp(document, 60);
      expect(input).toHaveValue("5");
    });

    it("does not scrub while read-only", () => {
      render(<Input numeric aria-label="数量" defaultValue={5} min={0} max={10} readOnly />);

      const input = screen.getByRole("textbox", { name: "数量" });
      const handle = screen.getByTitle("拖动调整数值");
      expect(input).toHaveAttribute("readonly");
      expect(handle).toHaveAttribute("data-readonly");

      pointerDown(handle, 40);
      pointerMove(document, 60);
      pointerUp(document, 60);
      expect(input).toHaveValue("5");
    });

    it("clears the number and keeps focus in the field", async () => {
      render(<Input numeric aria-label="数量" defaultValue={8} min={0} max={10} allowClear />);

      const input = screen.getByRole("textbox", { name: "数量" });
      const clear = screen.getByRole("button", { name: "清除" });
      await userEvent.click(clear);

      expect(input).toHaveValue("");
      expect(input).toHaveFocus();
      expect(screen.queryByRole("button", { name: "清除" })).not.toBeInTheDocument();
    });

    it("marks a numeric field invalid", () => {
      render(<Input numeric invalid aria-label="价格" defaultValue={1} />);

      expect(screen.getByRole("textbox", { name: "价格" })).toHaveAttribute("aria-invalid", "true");
      expect(document.querySelector('[data-slot="number-input-group"]')).toHaveAttribute(
        "data-invalid",
      );
    });

    it("renders the documented heights and icon sizes", () => {
      const { rerender } = render(
        <Input
          numeric
          aria-label="数量"
          size="sm"
          defaultValue={1}
          endIcon={<svg data-testid="end" />}
        />,
      );

      let group = document.querySelector('[data-slot="number-input-group"]') as HTMLElement;
      expect(group).toHaveClass("h-7");
      expect(group).toHaveClass("gap-2");
      expect(
        getComputedStyle(screen.getByTitle("拖动调整数值").querySelector("svg") as SVGElement)
          .width,
      ).toBe("14px");
      expect(getComputedStyle(screen.getByTestId("end")).width).toBe("14px");

      rerender(
        <Input
          numeric
          aria-label="数量"
          size="lg"
          defaultValue={1}
          endIcon={<svg data-testid="end" />}
        />,
      );
      group = document.querySelector('[data-slot="number-input-group"]') as HTMLElement;
      expect(group).toHaveClass("h-10");
      expect(
        getComputedStyle(screen.getByTitle("拖动调整数值").querySelector("svg") as SVGElement)
          .width,
      ).toBe("20px");
    });

    it("uses a custom start icon as the drag handle", () => {
      render(
        <Input
          numeric
          aria-label="数量"
          defaultValue={1}
          dragLabel="拖动调整数量"
          startIcon={<svg data-testid="grip" />}
        />,
      );

      const handle = screen.getByTitle("拖动调整数量");
      expect(handle).toContainElement(screen.getByTestId("grip"));
    });

    it("prefers dragIcon over startIcon for the drag handle", () => {
      render(
        <Input
          numeric
          aria-label="数量"
          defaultValue={1}
          dragIcon={<svg data-testid="drag" />}
          startIcon={<svg data-testid="start" />}
        />,
      );

      const handle = screen.getByTitle("拖动调整数值");
      expect(handle).toContainElement(screen.getByTestId("drag"));
      expect(screen.queryByTestId("start")).not.toBeInTheDocument();
    });

    it("submits the number under its name", () => {
      render(
        <form data-testid="form">
          <Input numeric aria-label="字号" name="fontSize" defaultValue={14} />
        </form>,
      );

      expect(screen.getByTestId("form")).toHaveFormValues({ fontSize: "14" });
    });
  });
});
