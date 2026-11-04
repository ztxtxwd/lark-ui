import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";
import { LarkLocaleProvider } from "../../utils/locale-provider";
import { Field } from "./field";

describe("Field", () => {
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
        <Field label="Nome" required={false} labelTooltip="Ajuda">
          <input />
        </Field>
      </LarkLocaleProvider>,
    );

    expect(screen.getByText("(opcional)")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Mais informações" }),
    ).toBeTruthy();
  });

  it.each([
    ["undefined", undefined],
    ["null", null],
    ["true", true],
    ["false", false],
    ["an empty string", ""],
  ])("renders no label element when label is %s", (_, label) => {
    const { container } = render(
      <Field label={label} description="Help text">
        <input aria-label="Name" />
      </Field>,
    );

    expect(container.querySelector("label")).toBeNull();
    expect(screen.getByText("Help text")).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Name" })).toBeTruthy();
  });

  it.each([
    ["text", "Name", {}],
    ["the number 0", 0, {}],
    ["only an optional indicator", undefined, { required: false }],
    ["only a tooltip", undefined, { labelTooltip: "More" }],
  ])("keeps the label element for %s", (_, label, props) => {
    const { container } = render(
      <Field label={label} {...props}>
        <input />
      </Field>,
    );

    expect(container.querySelector("label")).not.toBeNull();
  });

  it("renders no label element for an empty tooltip", () => {
    const { container } = render(
      <Field label={undefined} labelTooltip="">
        <input />
      </Field>,
    );

    expect(container.querySelector("label")).toBeNull();
  });

  it("still hides the label element with hideLabel", () => {
    const { container } = render(
      <Field label="Name" hideLabel>
        <input />
      </Field>,
    );

    expect(container.querySelector("label")).toBeNull();
  });

  it("marks required fields with a red asterisk before the label", () => {
    const { container } = render(
      <Field label="Email" required>
        <input />
      </Field>,
    );

    const label = container.querySelector("label");
    expect(label).not.toBeNull();
    // Feishu `ud__form__item__required-mark` uses `--function-danger-content-default`.
    const mark = label?.querySelector("span[aria-hidden='true']");
    expect(mark).not.toBeNull();
    expect(mark?.className).toContain("text-lark-danger");
  });

  it("does not mark optional or unspecified fields as required", () => {
    const { container, rerender } = render(
      <Field label="Email">
        <input />
      </Field>,
    );

    expect(
      container.querySelector("label span[aria-hidden='true']"),
    ).toBeNull();

    rerender(
      <Field label="Email" required={false}>
        <input />
      </Field>,
    );

    expect(
      container.querySelector("label span[aria-hidden='true']"),
    ).toBeNull();
  });

  it("keeps the description 2px below the control", () => {
    render(
      <Field label="Name" description="Help text">
        <input />
      </Field>,
    );

    const description = screen.getByText("Help text");
    // Feishu `ud__form__item__control__explain { margin: 2px 0 0 }` — the grid
    // gap is 8px, so the description pulls itself up by 6px.
    expect(description.className).toContain("-mt-1.5");
  });

  it("renders the validation error on the danger colour", () => {
    render(
      <Field label="Name" error={{ message: "Required", match: true }}>
        <input />
      </Field>,
    );

    const error = screen.getByText("Required");
    // Feishu `--function-danger-content-default`.
    expect(error.className).toContain("text-lark-danger");
  });
});
