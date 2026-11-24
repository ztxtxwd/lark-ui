import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import type { FormEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "../Input";
import { Form, FormItem, FormSection } from "./Form";

async function contrastViolations(container: HTMLElement) {
  const result = await axe.run(container, {
    runOnly: { type: "rule", values: ["color-contrast"] },
    resultTypes: ["violations"],
  });
  return result.violations;
}

describe("Form", () => {
  it("labels its control and shows the required asterisk", async () => {
    render(
      <Form>
        <FormItem label="邮箱" required>
          <Input type="email" required />
        </FormItem>
      </Form>,
    );

    const input = await screen.findByRole("textbox", { name: "邮箱" });
    expect(input).toHaveAttribute("required");
    expect(input).toHaveAccessibleName("邮箱");

    const marker = document.querySelector('[data-slot="form-required"]');
    expect(marker).toBeInTheDocument();
    await waitFor(() => expect(marker).toBeVisible());

    const field = document.querySelector('[data-slot="field"]');
    if (!(field instanceof HTMLElement) || !(marker instanceof HTMLElement)) {
      throw new Error("Expected the field and its required marker");
    }
    expect(getComputedStyle(field).rowGap).toBe("8px");
    expect(getComputedStyle(marker).color).toBe("rgb(245, 74, 69)");

    await userEvent.click(screen.getByText(/邮箱/));
    expect(input).toHaveFocus();
  });

  it("hides the asterisk for an optional field", async () => {
    render(
      <Form>
        <FormItem label="备注">
          <Input />
        </FormItem>
      </Form>,
    );

    await screen.findByRole("textbox", { name: "备注" });
    const marker = document.querySelector('[data-slot="form-required"]');
    expect(marker).not.toBeVisible();
  });

  it("describes the control with its help text and error", async () => {
    render(
      <Form>
        <FormItem label="用户名" description="用于登录" error="用户名已存在" invalid>
          <Input />
        </FormItem>
      </Form>,
    );

    const input = await screen.findByRole("textbox", { name: "用户名" });
    const description = screen.getByText("用于登录");
    const error = screen.getByText("用户名已存在");

    await waitFor(() => {
      const ids = input.getAttribute("aria-describedby")?.split(/\s+/) ?? [];
      expect(ids).toContain(description.id);
      expect(ids).toContain(error.id);
    });

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(error.className).toContain("text-lark-danger-strong");
    expect(error.className).toContain("dark:text-lark-danger-content");
  });

  it("treats a supplied error as invalid so it shows right away", async () => {
    render(
      <Form>
        <FormItem label="邮箱" error="请输入邮箱">
          <Input type="email" />
        </FormItem>
      </Form>,
    );

    const input = await screen.findByRole("textbox", { name: "邮箱" });
    expect(screen.getByText("请输入邮箱")).toBeVisible();
    await waitFor(() => expect(input).toHaveAttribute("aria-invalid", "true"));
  });

  it("right-aligns labels in the horizontal layout", async () => {
    render(
      <Form layout="horizontal">
        <FormItem label="项目名称">
          <Input />
        </FormItem>
      </Form>,
    );

    const form = document.querySelector('[data-slot="form"]');
    expect(form).toHaveAttribute("data-layout", "horizontal");

    const field = document.querySelector('[data-slot="field"]');
    expect(field).toHaveAttribute("data-layout", "horizontal");
    expect(field?.className).toContain("grid-cols-[fit-content(50%)_minmax(0,1fr)]");

    const label = (await screen.findByText(/项目名称/)).closest("label");
    expect(label?.className).toContain("text-right");

    if (!(field instanceof HTMLElement) || !(label instanceof HTMLElement)) {
      throw new Error("Expected the horizontal field and its label");
    }
    expect(getComputedStyle(field).columnGap).toBe("16px");
    expect(getComputedStyle(label).textAlign).toBe("right");
  });

  it("submits the native form values through onSubmit", async () => {
    let submitted: FormDataEntryValue | null = null;
    const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      submitted = new FormData(event.currentTarget).get("project");
    });

    render(
      <Form onSubmit={onSubmit}>
        <FormItem label="项目名称" name="project">
          <Input name="project" />
        </FormItem>
        <button type="submit">保存</button>
      </Form>,
    );

    await userEvent.type(await screen.findByRole("textbox", { name: "项目名称" }), "Lark");
    await userEvent.click(screen.getByRole("button", { name: "保存" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(submitted).toBe("Lark");
  });

  it("shows the asterisk when only the control is required", async () => {
    render(
      <Form>
        <FormItem label="邮箱">
          <Input required />
        </FormItem>
      </Form>,
    );

    await screen.findByRole("textbox", { name: "邮箱" });
    const marker = document.querySelector('[data-slot="form-required"]');
    await waitFor(() => expect(marker).toBeVisible());
  });

  it("caps a horizontal label at half the row and two lines", async () => {
    render(
      <div style={{ width: 400 }}>
        <Form layout="horizontal">
          <FormItem label={"非常长的字段标题".repeat(15)}>
            <Input />
          </FormItem>
        </Form>
      </div>,
    );

    await screen.findByRole("textbox");
    const field = document.querySelector('[data-slot="field"]');
    const control = document.querySelector('[data-slot="form-control"]');
    const label = screen.getByText(/非常长的字段标题/).closest("label");
    if (
      !(field instanceof HTMLElement) ||
      !(control instanceof HTMLElement) ||
      !(label instanceof HTMLElement)
    ) {
      throw new Error("Expected the horizontal field, control and label");
    }

    expect(label.getBoundingClientRect().width).toBeLessThanOrEqual(200);
    expect(control.getBoundingClientRect().width).toBeGreaterThan(100);
    expect(field.scrollWidth).toBeLessThanOrEqual(field.clientWidth + 1);
    // Two 22px lines plus the 5px offset that aligns the label with a 32px control.
    expect(label.getBoundingClientRect().height).toBeLessThanOrEqual(49);
  });

  it("keeps error text above 4.5:1 in both themes", async () => {
    const { container } = render(
      <Form>
        <FormItem label="邮箱" invalid error="请输入有效的邮箱地址。">
          <Input />
        </FormItem>
      </Form>,
    );
    const error = screen.getByText("请输入有效的邮箱地址。");

    expect(await contrastViolations(container)).toEqual([]);

    document.documentElement.dataset.theme = "dark";
    try {
      await waitFor(() => expect(getComputedStyle(error).color).toBe("rgb(240, 91, 86)"));
      expect(await contrastViolations(container)).toEqual([]);
    } finally {
      delete document.documentElement.dataset.theme;
    }
  });

  it("keeps native required constraints and shows the browser error", async () => {
    const onSubmit = vi.fn();

    render(
      <Form onSubmit={onSubmit}>
        <FormItem label="姓名">
          <Input required />
        </FormItem>
        <button type="submit">提交</button>
      </Form>,
    );

    await userEvent.click(screen.getByRole("button", { name: "提交" }));

    expect(onSubmit).not.toHaveBeenCalled();

    const input = await screen.findByRole("textbox", { name: "姓名" });
    await waitFor(() => expect(input).toHaveAttribute("aria-invalid", "true"));

    const error = document.querySelector('[data-slot="field-error"]');
    await waitFor(() => expect(error).toBeVisible());
    expect(error?.textContent?.trim().length).toBeGreaterThan(0);
  });

  it("disables a field and its label", async () => {
    render(
      <Form>
        <FormItem label="名称" disabled>
          <Input />
        </FormItem>
      </Form>,
    );

    const input = await screen.findByRole("textbox", { name: "名称" });
    await waitFor(() => expect(input).toBeDisabled());

    const label = screen.getByText(/名称/).closest("label");
    expect(label).toHaveAttribute("data-disabled");
  });

  it("names a FormSection with its legend and disables the group", async () => {
    render(
      <Form>
        <FormSection title="基本信息" description="填写项目的基本信息" disabled>
          <FormItem label="名称">
            <Input />
          </FormItem>
        </FormSection>
      </Form>,
    );

    const group = await screen.findByRole("group", { name: "基本信息" });
    expect(group).toHaveTextContent("填写项目的基本信息");

    const input = await screen.findByRole("textbox", { name: "名称" });
    await waitFor(() => expect(input).toBeDisabled());
  });
});
