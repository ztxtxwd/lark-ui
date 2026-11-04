import { describe, expect, test } from "vite-plus/test";
import { render } from "@testing-library/react";
import { MenuBar } from "./menubar";

function getOptions(container: HTMLElement) {
  return [...container.querySelectorAll('[data-lark-part="option"]')];
}

describe("MenuBar", () => {
  test("renders one option per entry", () => {
    const { container } = render(
      <MenuBar
        isActive={0}
        options={[
          { icon: <span>a</span>, tooltip: "List", onClick: () => {} },
          { icon: <span>b</span>, tooltip: "Grid", onClick: () => {} },
        ]}
      />,
    );

    expect(getOptions(container)).toHaveLength(2);
  });

  test("follows Feishu's item states", () => {
    const { container } = render(
      <MenuBar
        isActive={0}
        options={[
          { icon: <span>a</span>, tooltip: "List", onClick: () => {} },
          { icon: <span>b</span>, tooltip: "Grid", onClick: () => {} },
        ]}
      />,
    );
    const [active, inactive] = getOptions(container);

    // Feishu drops the focus ring — the hovered fill is the indicator.
    expect(active.className).toContain("focus-visible:outline-none");
    expect(active.className).not.toContain("focus-visible:ring-2");
    expect(active.className).not.toContain("focus-visible:ring-lark-brand");

    // A free item hovers with the neutral fill.
    expect(inactive.className).toContain("hover:bg-lark-fill-hover");
    expect(inactive.className).toContain("focus-visible:bg-lark-fill-hover");
    expect(inactive.className).not.toContain("bg-lark-base");

    // The selected item is the raised pill.
    expect(active.className).toContain("bg-lark-base");
    expect(active.className).toContain("shadow-lark-xs");
    expect(active.className).toContain("hover:bg-lark-base");

    // Feishu eases the item colours over 100ms and nothing else.
    expect(active.className).toContain("transition-colors");
    expect(active.className).toContain("duration-100");
  });
});
