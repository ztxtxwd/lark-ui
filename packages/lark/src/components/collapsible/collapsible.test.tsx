import { describe, expect, test } from "vite-plus/test";
import { render } from "@testing-library/react";
import { Collapsible } from "./collapsible";

function getTrigger(container: HTMLElement) {
  const trigger = container.querySelector('[data-lark-part="default-trigger"]');
  if (!trigger) {
    throw new Error("Collapsible test trigger not found");
  }
  return trigger;
}

describe("Collapsible", () => {
  test("renders the default trigger and panel", () => {
    const { container } = render(
      <Collapsible.Root defaultOpen>
        <Collapsible.DefaultTrigger>Details</Collapsible.DefaultTrigger>
        <Collapsible.DefaultPanel>Body</Collapsible.DefaultPanel>
      </Collapsible.Root>,
    );

    expect(getTrigger(container).textContent).toContain("Details");
    expect(container.textContent).toContain("Body");
  });

  test("follows Feishu's header states", () => {
    const { container } = render(
      <Collapsible.Root defaultOpen>
        <Collapsible.DefaultTrigger>Details</Collapsible.DefaultTrigger>
        <Collapsible.DefaultPanel>Body</Collapsible.DefaultPanel>
      </Collapsible.Root>,
    );
    const trigger = getTrigger(container);
    const icon = trigger.querySelector("[data-lark-icon]");
    const iconWrapper = icon?.parentElement;

    // Feishu drops the focus outline — the hovered fill is the indicator.
    expect(trigger.className).toContain("focus-visible:outline-none");
    expect(trigger.className).not.toContain("focus-visible:ring-");
    expect(trigger.className).toContain("hover:bg-lark-fill-hover");
    expect(trigger.className).toContain("focus-visible:bg-lark-fill-hover");
    // Feishu presses the header with the brand tint.
    expect(trigger.className).toContain("active:bg-lark-fill-selected");
    // Feishu eases the header's colours over 100ms and nothing else.
    expect(trigger.className).toContain("transition-colors");
    expect(trigger.className).toContain("duration-100");

    // The expand icon sits in `icon-n2` and flips over 200ms.
    expect(iconWrapper?.className).toContain("text-lark-subtle");
    expect(icon?.className).toContain("duration-200");
    expect(icon?.className).toContain("[[data-panel-open]_&]:rotate-180");
  });

  test("follows Feishu's panel states", () => {
    const { container } = render(
      <Collapsible.Root defaultOpen>
        <Collapsible.DefaultTrigger>Details</Collapsible.DefaultTrigger>
        <Collapsible.DefaultPanel>Body</Collapsible.DefaultPanel>
      </Collapsible.Root>,
    );
    const content = container.querySelector(".border-l-2");
    const panel = content?.parentElement;

    // Feishu eases the panel's height and opacity over 200ms.
    expect(panel?.className).toContain("transition-[height,opacity]");
    expect(panel?.className).toContain("duration-200");
    // Feishu pads the content box by 8px.
    expect(content?.className).toContain("p-2");
  });
});
