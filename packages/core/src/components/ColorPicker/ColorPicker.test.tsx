import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ColorPicker } from "./ColorPicker";

async function openPicker(name = /color/i) {
  const trigger = screen.getByRole("button", { name });
  await userEvent.click(trigger);
  const dialog = await screen.findByRole("dialog", { name: "颜色选择器" });
  return { trigger, dialog };
}

describe("ColorPicker", () => {
  it("shows the value in the trigger and opens the panel", async () => {
    render(<ColorPicker defaultValue="#1456f0" presets={["#ff0000", "#00ff00"]} showInput />);

    const trigger = screen.getByRole("button", { name: /颜色选择器/ });
    expect(trigger).toHaveTextContent("#1456F0");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    const dialog = await screen.findByRole("dialog", { name: "颜色选择器" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    expect(within(dialog).getByRole("slider", { name: "饱和度和亮度" })).toBeInTheDocument();
    expect(within(dialog).getByRole("slider", { name: "色相" })).toBeInTheDocument();
    expect(within(dialog).getByRole("slider", { name: "不透明度" })).toBeInTheDocument();
    expect(within(dialog).getByRole("textbox", { name: "十六进制色值" })).toHaveValue("#1456f0");
    expect(within(dialog).getByRole("listbox", { name: "预设颜色" })).toBeInTheDocument();
    expect(within(dialog).getByRole("option", { name: "#ff0000" })).toBeInTheDocument();
  });

  it("chooses a preset, reports the change and closes the panel", async () => {
    const onChange = vi.fn();
    const onValueChange = vi.fn();
    render(
      <ColorPicker
        defaultValue="#1456f0"
        presets={["#ff0000", "#00ff00"]}
        onChange={onChange}
        onValueChange={onValueChange}
      />,
    );

    const trigger = screen.getByRole("button", { name: /颜色选择器/ });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole("dialog", { name: "颜色选择器" });

    await userEvent.click(within(dialog).getByRole("option", { name: "#ff0000" }));

    expect(onChange).toHaveBeenCalledWith(expect.stringMatching(/^#ff0000$/i));
    expect(onValueChange).toHaveBeenCalledWith(
      expect.stringMatching(/^#ff0000$/i),
      expect.objectContaining({ reason: "item-press" }),
    );
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveTextContent("#FF0000");
  });

  it("closes when the already selected preset is pressed", async () => {
    render(<ColorPicker defaultValue="#1456f0" presets={["#1456f0"]} />);

    const { dialog } = await openPicker(/颜色选择器/);
    await userEvent.click(within(dialog).getByRole("option", { name: "#1456f0" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes when the selected preset is chosen with the keyboard", async () => {
    render(<ColorPicker defaultValue="#1456f0" presets={["#1456f0"]} />);

    const { dialog } = await openPicker(/颜色选择器/);
    const preset = within(dialog).getByRole("option", { name: "#1456f0" });
    preset.focus();
    await userEvent.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("commits a typed hex colour on Enter", async () => {
    const onChange = vi.fn();
    render(<ColorPicker defaultValue="#1456f0" onChange={onChange} showInput />);

    const { trigger, dialog } = await openPicker(/颜色选择器/);
    const input = within(dialog).getByRole("textbox", { name: "十六进制色值" });

    await userEvent.clear(input);
    await userEvent.type(input, "#00FF00{Enter}");

    expect(onChange).toHaveBeenLastCalledWith(expect.stringMatching(/^#00ff00$/i));
    expect(trigger).toHaveTextContent("#00FF00");
  });

  it("reverts an invalid typed colour", async () => {
    const onChange = vi.fn();
    render(<ColorPicker defaultValue="#1456f0" onChange={onChange} showInput />);

    const { trigger, dialog } = await openPicker(/颜色选择器/);
    const input = within(dialog).getByRole("textbox", { name: "十六进制色值" });
    await userEvent.clear(input);
    await userEvent.type(input, "not-a-color{Enter}");

    expect(input).toHaveValue("#1456f0");
    expect(onChange).not.toHaveBeenCalled();
    expect(trigger).toHaveTextContent("#1456F0");
  });

  it("clears the colour from the panel and the trigger", async () => {
    const onChange = vi.fn();
    render(<ColorPicker defaultValue="#1456f0" allowClear onChange={onChange} />);

    const { trigger, dialog } = await openPicker(/颜色选择器/);
    await userEvent.click(within(dialog).getByRole("button", { name: "取消颜色" }));

    expect(onChange).toHaveBeenCalledWith(undefined);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveTextContent("选择颜色");
    expect(trigger).not.toHaveTextContent("#1456F0");
  });

  it("clears from the trigger clear button", async () => {
    const onChange = vi.fn();
    render(<ColorPicker defaultValue="#1456f0" allowClear onChange={onChange} />);

    await userEvent.click(screen.getByRole("button", { name: "取消颜色" }));

    expect(onChange).toHaveBeenCalledWith(undefined);
    expect(screen.getByRole("button", { name: /颜色选择器/ })).toHaveTextContent("选择颜色");
  });

  it("hides the alpha slider when disabledAlpha is set", async () => {
    render(<ColorPicker defaultValue="rgba(20, 86, 240, 0.5)" disabledAlpha />);

    const { dialog } = await openPicker(/颜色选择器/);
    expect(within(dialog).queryByRole("slider", { name: "不透明度" })).not.toBeInTheDocument();
    expect(within(dialog).getByRole("slider", { name: "色相" })).toBeInTheDocument();
  });

  it("does not clip the area thumb or its focus outline", async () => {
    render(<ColorPicker defaultValue="#1456f0" />);

    const { dialog } = await openPicker(/颜色选择器/);
    const areaThumb = within(dialog).getByRole("slider", { name: "饱和度和亮度" });
    const area = areaThumb.parentElement as HTMLElement;

    expect(getComputedStyle(area).overflow).toBe("visible");
  });

  it("does not clip the alpha thumb's focus outline", async () => {
    render(<ColorPicker defaultValue="rgba(20, 86, 240, 0.5)" />);

    const { dialog } = await openPicker(/颜色选择器/);
    const alpha = within(dialog).getByRole("slider", { name: "不透明度" });
    const track = alpha.parentElement as HTMLElement;

    expect(getComputedStyle(track).overflow).toBe("visible");
  });

  it("uses the UD pentagonal slider pointer", async () => {
    render(<ColorPicker defaultValue="#1456f0" />);

    const { dialog } = await openPicker(/颜色选择器/);
    const hue = within(dialog).getByRole("slider", { name: "色相" });
    const body = getComputedStyle(hue);
    const peak = getComputedStyle(hue, "::before");

    // 10 × 8 body hanging 6px below the 12px track, 1px bottom radius.
    expect(body.width).toBe("10px");
    expect(body.height).toBe("8px");
    expect(body.bottom).toBe("-6px");
    expect(body.borderBottomLeftRadius).toBe("1px");
    // The white body hangs over the white panel, so it needs the UD shadow.
    expect(body.boxShadow).toContain("0px 2px 4px");
    // Pentagonal peak: a 7px square rotated 45° on the body's top edge, with
    // rounded corners so the tip is not sharp.
    expect(peak.width).toBe("7px");
    expect(peak.height).toBe("7px");
    expect(peak.rotate).toBe("45deg");
    expect(peak.borderTopLeftRadius).toBe("1.5px");
    expect(peak.bottom).toBe("8px");
  });

  it("draws the alpha track as one gradient from transparent to the colour", async () => {
    render(<ColorPicker defaultValue="rgba(20, 86, 240, 0.5)" />);

    const { dialog } = await openPicker(/颜色选择器/);
    const alpha = within(dialog).getByRole("slider", { name: "不透明度" });
    const background = getComputedStyle(alpha.parentElement as HTMLElement).backgroundImage;

    // One left-to-right gradient: fully transparent, then the current colour.
    expect(background).toMatch(/^linear-gradient\(to right, rgba\([^)]+, 0\), rgb\(/);
    expect(background).not.toContain("conic-gradient");
  });

  it("changes the colour from the hue slider with the keyboard", async () => {
    const onChange = vi.fn();
    render(<ColorPicker defaultValue="#1456f0" onChange={onChange} />);

    const { dialog } = await openPicker(/颜色选择器/);
    const hue = within(dialog).getByRole("slider", { name: "色相" });
    hue.focus();
    await userEvent.keyboard("{ArrowRight}");

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
    expect(onChange.mock.calls.at(-1)?.[0]).not.toBe("#1456f0");
  });

  it("closes with Escape and returns focus to the trigger", async () => {
    render(<ColorPicker defaultValue="#1456f0" />);

    const { trigger } = await openPicker(/颜色选择器/);
    await userEvent.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it("does not open while disabled", async () => {
    render(<ColorPicker defaultValue="#1456f0" disabled />);

    const trigger = screen.getByRole("button", { name: /颜色选择器/ });
    expect(trigger).toBeDisabled();

    await userEvent.click(trigger);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps a controlled value until the parent changes it", async () => {
    const onValueChange = vi.fn();
    render(<ColorPicker value="#1456f0" presets={["#ff0000"]} onValueChange={onValueChange} />);

    const trigger = screen.getByRole("button", { name: /颜色选择器/ });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole("dialog", { name: "颜色选择器" });
    await userEvent.click(within(dialog).getByRole("option", { name: "#ff0000" }));

    expect(onValueChange).toHaveBeenCalledWith(
      expect.stringMatching(/^#ff0000$/i),
      expect.anything(),
    );
    expect(trigger).toHaveTextContent("#1456F0");
  });

  it("uses the small trigger height", () => {
    render(<ColorPicker defaultValue="#1456f0" size="sm" />);
    const trigger = screen.getByRole("button", { name: /颜色选择器/ });
    expect(trigger.className).toContain("h-7");
    expect(trigger.className).toContain("text-lark-12");
  });
});
