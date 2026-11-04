import { describe, expect, test } from "vite-plus/test";
import { render } from "@testing-library/react";
import { LarkIcon } from "./lark-icon";
import { LARK_ICON_NAMES } from "./icon-names";
import { IconContext } from "./phosphor";

describe("LarkIcon", () => {
  test("renders an inline SVG carrying the icon name", () => {
    const { container } = render(<LarkIcon name="check" />);
    const svg = container.querySelector("[data-lark-icon]");

    expect(svg).toBeTruthy();
    expect(svg!.tagName.toLowerCase()).toBe("svg");
    expect(svg!.getAttribute("data-lark-icon")).toBe("check");
    expect(svg!.getAttribute("aria-hidden")).toBe("true");
  });

  test("sizes relative to the surrounding font size by default", () => {
    const { container } = render(<LarkIcon name="check" />);
    const svg = container.querySelector("[data-lark-icon]")!;

    expect(svg.getAttribute("width")).toBe("1em");
    expect(svg.getAttribute("height")).toBe("1em");
  });

  test("honours an explicit size", () => {
    const { container } = render(<LarkIcon name="check" size={20} />);
    const svg = container.querySelector("[data-lark-icon]")!;

    expect(svg.getAttribute("width")).toBe("20");
    expect(svg.getAttribute("height")).toBe("20");
  });

  test("inherits the surrounding colour", () => {
    const { container } = render(<LarkIcon name="check" />);
    const svg = container.querySelector("[data-lark-icon]")!;

    expect(svg.getAttribute("fill")).toBe("currentColor");
  });

  test("takes its size from the icon context", () => {
    const { container } = render(
      <IconContext.Provider value={{ size: 18 }}>
        <LarkIcon name="check" />
      </IconContext.Provider>,
    );
    const svg = container.querySelector("[data-lark-icon]")!;

    expect(svg.getAttribute("width")).toBe("18");
  });

  test("every published name renders", () => {
    for (const name of LARK_ICON_NAMES) {
      const { container, unmount } = render(<LarkIcon name={name} />);
      const svg = container.querySelector("[data-lark-icon]");

      expect(svg, `icon "${name}" did not render`).toBeTruthy();
      expect(svg!.getAttribute("data-lark-icon")).toBe(name);
      unmount();
    }
  });
});
