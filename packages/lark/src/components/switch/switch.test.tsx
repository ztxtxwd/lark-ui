import { describe, expect, it } from "vite-plus/test";
import { render } from "@testing-library/react";
import { Switch } from "./switch";

describe("Switch", () => {
  it("uses Feishu's pill geometry for the default size", () => {
    const { container } = render(<Switch label="Toggle" checked={false} />);

    const track = container.querySelector("[data-lark-component='Switch']");
    // Feishu's `md` switch is 40×22 with an 18px knob.
    expect(track?.className).toContain("h-5.5");
    expect(track?.className).toContain("w-10");
    expect(track?.className).toContain("rounded-full");
    // The off track is the component border colour.
    expect(track?.className).toContain("bg-lark-border");
    // Feishu draws no focus ring on the switch.
    expect(track?.className).not.toContain("focus-visible:ring-2");

    const knob = track?.firstElementChild;
    expect(knob?.className).toContain("h-4.5");
    expect(knob?.className).toContain("w-4.5");
    expect(knob?.className).toContain("shadow-lark-sm");
  });

  it("fills the checked track with the brand colour and slides the knob over", () => {
    const { container } = render(<Switch label="Toggle" checked />);

    const track = container.querySelector("[data-lark-component='Switch']");
    expect(track?.className).toContain("bg-lark-brand");

    const knob = track?.firstElementChild;
    // 100% - knob (18px) - 2px inset.
    expect(knob?.className).toContain("left-5");
    expect(knob?.className).toContain("bg-white");
  });

  it("mutes a disabled switch instead of fading it", () => {
    const { container } = render(
      <Switch label="Toggle" checked={false} disabled />,
    );

    const track = container.querySelector("[data-lark-component='Switch']");
    expect(track?.className).toContain("bg-lark-line");
    expect(track?.className).toContain("cursor-not-allowed");
    expect(track?.className).not.toContain("opacity-50");
  });
});
