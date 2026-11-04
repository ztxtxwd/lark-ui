import { describe, expect, it } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import { LarkLocaleProvider } from "../../utils/locale-provider";
import { Checkbox } from "./checkbox";

describe("Checkbox.Group", () => {
  it("resets inherited fieldset padding", () => {
    const { container } = render(
      <Checkbox.Group legend="Preferences">
        <Checkbox.Item label="Email notifications" value="email" />
      </Checkbox.Group>,
    );

    expect(screen.getByText("Preferences")).toBeTruthy();
    expect(container.querySelector("fieldset")?.className).toContain("p-0");
  });

  it("joins vertical card items into one card with dividers", () => {
    const { container } = render(
      <Checkbox.Group legend="Products" appearance="card">
        <Checkbox.Item label="Web traffic" value="gateway" />
        <Checkbox.Item label="AI prompts" value="ai" />
      </Checkbox.Group>,
    );

    const labels = container.querySelectorAll("label");
    expect(labels[0].parentElement?.className).toContain("rounded-lg");
    expect(labels[0].parentElement?.className).toContain("ring-lark-line");
    for (const label of labels) {
      expect(label.className).toContain("border-b");
      expect(label.className).not.toContain("rounded-lg");
      // Card items place the checkbox after the label by default.
      expect(label.firstElementChild?.getAttribute("data-lark-part")).not.toBe(
        "item",
      );
    }
  });

  it("joins horizontal card items into one two-column card", () => {
    const { container } = render(
      <Checkbox.Group
        legend="Products"
        appearance="card"
        orientation="horizontal"
      >
        <Checkbox.Item label="Web traffic" value="gateway" />
        <Checkbox.Item label="AI prompts" value="ai" />
        <Checkbox.Item label="Outbound email" value="email" />
      </Checkbox.Group>,
    );

    const labels = container.querySelectorAll("label");
    expect(labels[0].parentElement?.className).toContain("grid-cols-2");
    for (const label of labels) {
      expect(label.className).toContain("odd:border-r");
    }
  });

  it("renders card item descriptions", () => {
    render(
      <Checkbox.Group legend="Products" appearance="card">
        <Checkbox.Item
          label="Web traffic"
          description="Gateway HTTP policies"
          value="gateway"
        />
      </Checkbox.Group>,
    );

    expect(screen.getByText("Gateway HTTP policies")).toBeTruthy();
  });

  it("keeps the checkbox first in default appearance", () => {
    const { container } = render(
      <Checkbox.Group legend="Products">
        <Checkbox.Item label="Web traffic" value="gateway" />
      </Checkbox.Group>,
    );

    const label = container.querySelector("label");
    expect(label?.firstElementChild?.getAttribute("data-lark-part")).toBe(
      "item",
    );
    expect(label?.className).not.toContain("flex-row-reverse");
  });
});

describe("Checkbox", () => {
  it("forwards translated label text", () => {
    render(
      <LarkLocaleProvider
        translations={{
          label: {
            optional: "(opcional)",
            tooltip: "Mais informações",
          },
        }}
      >
        <Checkbox label="Atualizações" required={false} labelTooltip="Ajuda" />
      </LarkLocaleProvider>,
    );

    expect(screen.getByText("(opcional)")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Mais informações" }),
    ).toBeTruthy();
  });

  it("paints the control with Feishu's outline and brand fill", () => {
    const { container } = render(
      <Checkbox.Group legend="Products">
        <Checkbox.Item label="Web traffic" value="gateway" />
      </Checkbox.Group>,
    );

    const control = container.querySelector('[data-lark-part="item"]');
    // The outline uses the component border token, not a focus halo.
    expect(control?.className).toContain("ring-lark-outline");
    expect(control?.className).toContain(
      "hover:not-data-[checked]:ring-lark-brand",
    );
    expect(control?.className).toContain("data-[checked]:bg-lark-brand");
    expect(control?.className).not.toContain("focus:ring-2");
    expect(control?.className).not.toContain("ring-lark-focus");
  });

  it("mutes a disabled checkbox instead of fading the whole control", () => {
    const { container } = render(
      <Checkbox.Group legend="Products">
        <Checkbox.Item label="Web traffic" value="gateway" disabled />
      </Checkbox.Group>,
    );

    const control = container.querySelector('[data-lark-part="item"]');
    expect(control?.className).toContain("bg-lark-recessed");
    expect(control?.className).toContain("data-[checked]:bg-lark-disabled");
    expect(control?.className).not.toContain("opacity-50");
  });
});
