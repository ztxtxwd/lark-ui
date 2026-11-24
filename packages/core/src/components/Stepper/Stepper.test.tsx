import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Stepper } from "./Stepper";

describe("Stepper", () => {
  it("renders a named spinbutton with labelled step buttons", () => {
    render(<Stepper label="数量" defaultValue={2} min={1} max={9} />);

    expect(screen.getByRole("textbox", { name: "数量" })).toHaveValue("2");
    expect(screen.getByRole("button", { name: "减少" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "增加" })).toBeInTheDocument();
  });

  it("increments and decrements by the step", async () => {
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    render(
      <Stepper
        label="数量"
        defaultValue={2}
        step={2}
        onValueChange={onValueChange}
        onChange={onChange}
      />,
    );

    const input = screen.getByRole("textbox", { name: "数量" });
    await userEvent.click(screen.getByRole("button", { name: "增加" }));
    expect(input).toHaveValue("4");
    await userEvent.click(screen.getByRole("button", { name: "减少" }));
    expect(input).toHaveValue("2");

    expect(onValueChange).toHaveBeenCalledWith(4, expect.anything());
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("disables the decrement button at the minimum", async () => {
    render(<Stepper label="数量" defaultValue={1} min={1} max={3} />);

    const decrement = screen.getByRole("button", { name: "减少" });
    expect(decrement).toBeDisabled();
    expect(screen.getByRole("button", { name: "增加" })).toBeEnabled();

    await userEvent.click(decrement);
    expect(screen.getByRole("textbox", { name: "数量" })).toHaveValue("1");
  });

  it("clamps at the maximum and disables its button", async () => {
    render(<Stepper label="数量" defaultValue={2} min={1} max={3} />);

    const increment = screen.getByRole("button", { name: "增加" });
    await userEvent.click(increment);
    expect(screen.getByRole("textbox", { name: "数量" })).toHaveValue("3");

    await waitFor(() => expect(increment).toBeDisabled());
    await userEvent.click(increment);
    expect(screen.getByRole("textbox", { name: "数量" })).toHaveValue("3");
  });

  it("clamps a typed value on commit", async () => {
    render(<Stepper label="数量" defaultValue={1} min={1} max={8} />);

    const input = screen.getByRole("textbox", { name: "数量" });
    await userEvent.clear(input);
    await userEvent.type(input, "20{Enter}");

    expect(input).toHaveValue("8");
  });

  it("restores the minimum when the field is cleared and left", async () => {
    render(<Stepper label="数量" defaultValue={3} min={2} max={9} />);

    const input = screen.getByRole("textbox", { name: "数量" });
    await userEvent.clear(input);
    await userEvent.tab();

    await waitFor(() => expect(input).toHaveValue("2"));
  });

  it("ignores invalid characters", async () => {
    render(<Stepper label="数量" defaultValue={1} min={0} max={9} />);

    const input = screen.getByRole("textbox", { name: "数量" });
    await userEvent.clear(input);
    await userEvent.type(input, "abc");
    await userEvent.tab();

    await waitFor(() => expect(input).toHaveValue("0"));
  });

  it("steps with the arrow keys", async () => {
    render(<Stepper label="数量" defaultValue={2} min={0} max={9} />);

    const input = screen.getByRole("textbox", { name: "数量" });
    await userEvent.tab();
    expect(input).toHaveFocus();

    await userEvent.keyboard("{ArrowUp}");
    expect(input).toHaveValue("3");
    await userEvent.keyboard("{ArrowDown}");
    expect(input).toHaveValue("2");
    await userEvent.keyboard("{Home}");
    expect(input).toHaveValue("0");
    await userEvent.keyboard("{End}");
    expect(input).toHaveValue("9");
  });

  it("shows the requested precision", () => {
    render(<Stepper label="时长" defaultValue={1.5} min={0} max={4} step={0.5} precision={1} />);

    expect(screen.getByRole("textbox", { name: "时长" })).toHaveValue("1.5");
  });

  it("uses the documented heights and type for each size", () => {
    const { rerender } = render(<Stepper label="数量" size="sm" defaultValue={1} />);
    let group = screen
      .getByRole("textbox", { name: "数量" })
      .closest('[data-slot="number-input-group"]');
    expect(group).toHaveClass("h-7", "text-lark-12");

    rerender(<Stepper label="数量" size="lg" defaultValue={1} />);
    group = screen
      .getByRole("textbox", { name: "数量" })
      .closest('[data-slot="number-input-group"]');
    expect(group).toHaveClass("h-10", "text-lark-16");
  });

  it("is disabled: no focus, no steps", async () => {
    render(<Stepper label="数量" defaultValue={2} disabled />);

    const input = screen.getByRole("textbox", { name: "数量" });
    expect(input).toBeDisabled();
    expect(screen.getByRole("button", { name: "增加" })).toBeDisabled();

    await userEvent.tab();
    expect(input).not.toHaveFocus();
    expect(input).toHaveValue("2");
  });

  it("is read-only: buttons refuse to step", async () => {
    render(<Stepper label="数量" defaultValue={2} readOnly />);

    const input = screen.getByRole("textbox", { name: "数量" });
    expect(input).toHaveAttribute("readonly");
    const increment = screen.getByRole("button", { name: "增加" });
    expect(increment).toHaveAttribute("aria-disabled", "true");

    await userEvent.click(increment);
    expect(input).toHaveValue("2");
  });

  it("uses the custom button labels and accessible name", () => {
    render(
      <Stepper
        aria-label="人数"
        defaultValue={1}
        decrementLabel="减一人"
        incrementLabel="加一人"
      />,
    );

    expect(screen.getByRole("textbox", { name: "人数" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "减一人" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "加一人" })).toBeInTheDocument();
  });
});
