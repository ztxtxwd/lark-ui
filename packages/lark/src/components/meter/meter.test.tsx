import { describe, expect, it } from "vite-plus/test";
import { render } from "@testing-library/react";
import { Meter } from "./meter";

describe("Meter", () => {
  it("uses Feishu's 4px rail and brand fill", () => {
    const { container } = render(<Meter label="Storage" value={65} />);

    const track = container.querySelector(".h-1");
    expect(track?.className).toContain("rounded-full");
    expect(track?.className).toContain("bg-lark-line");

    const indicator = container.querySelector(".bg-lark-brand");
    expect(indicator?.className).toContain("rounded-full");
    expect(indicator?.className).toContain("transition-[width]");
    // The fill is a solid brand colour, not a gradient.
    expect(indicator?.className).not.toContain("bg-linear-to-r");
  });
});
