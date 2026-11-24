import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";
import { Select, type SelectOption } from "./Select";

const roles: SelectOption[] = [
  { value: "owner", label: "所有者" },
  { value: "admin", label: "管理员" },
  { value: "member", label: "成员" },
  { value: "guest", label: "访客", disabled: true },
];

describe("Select", () => {
  it("opens on press, selects a value and reports it", async () => {
    const onValueChange = vi.fn();
    render(
      <Select
        label="角色"
        options={roles}
        placeholder="请选择角色"
        onValueChange={onValueChange}
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "角色" });
    expect(trigger).toHaveTextContent("请选择角色");

    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("option", { name: "管理员" }));

    expect(onValueChange).toHaveBeenCalledWith("admin", expect.anything());
    expect(trigger).toHaveTextContent("管理员");
  });

  it("supports keyboard selection", async () => {
    render(<Select label="角色" options={roles} />);

    const trigger = screen.getByRole("combobox", { name: "角色" });
    await userEvent.click(trigger);
    await userEvent.keyboard("{ArrowDown}{Enter}");

    expect(trigger).toHaveTextContent("管理员");
  });

  it("skips disabled options", async () => {
    render(<Select label="角色" options={roles} />);

    await userEvent.click(screen.getByRole("combobox", { name: "角色" }));
    const guest = await screen.findByRole("option", { name: "访客" });
    expect(guest).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(guest);
    expect(screen.getByRole("combobox", { name: "角色" })).toHaveTextContent("请选择");
  });

  it("dims a disabled compound option as a whole", async () => {
    render(
      <Select
        label="角色"
        options={[{ value: "guest", label: "访客", description: "仅可查看", disabled: true }]}
      />,
    );

    await userEvent.click(screen.getByRole("combobox", { name: "角色" }));
    const guest = await screen.findByRole("option", { name: /访客/ });

    expect(getComputedStyle(guest).opacity).toBe("0.5");
  });

  it("clears the selection from the clear button", async () => {
    const onValueChange = vi.fn();
    render(
      <Select label="角色" options={roles} defaultValue="admin" onValueChange={onValueChange} />,
    );

    const trigger = screen.getByRole("combobox", { name: "角色" });
    expect(trigger).toHaveTextContent("管理员");
    await userEvent.click(screen.getByRole("button", { name: "清除" }));

    expect(trigger).toHaveTextContent("请选择");
    expect(onValueChange).toHaveBeenCalledWith(null, expect.anything());
  });

  it("selects several values when multiple is set", async () => {
    const onValueChange = vi.fn();
    render(
      <Select
        label="角色"
        options={roles}
        multiple
        defaultValue={["owner"]}
        onValueChange={onValueChange}
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "角色" });
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("option", { name: "成员" }));

    expect(onValueChange).toHaveBeenLastCalledWith(["owner", "member"], expect.anything());
    expect(trigger).toHaveTextContent("所有者");
    expect(trigger).toHaveTextContent("成员");
  });

  it("summarises more selections than maxDisplayLabels without English text", () => {
    render(
      <Select
        label="角色"
        options={roles.slice(0, 3)}
        multiple
        defaultValue={["owner", "admin", "member"]}
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "角色" });
    expect(trigger).toHaveTextContent("所有者、管理员、+1");
    expect(trigger).not.toHaveTextContent("more");
  });

  it("shows the empty text when there are no options", async () => {
    render(<Select label="角色" options={[]} emptyText="暂无可选角色" />);

    await userEvent.click(screen.getByRole("combobox", { name: "角色" }));

    const empty = document.querySelector('[data-slot="select-empty"]') as HTMLElement;
    expect(await screen.findByText("暂无可选角色")).toBeInTheDocument();
    expect(empty).toHaveAttribute("data-empty");
    expect(empty.getBoundingClientRect().height).toBeGreaterThan(0);
  });

  it("leaves no blank row above the options", async () => {
    render(<Select label="角色" options={roles} />);

    await userEvent.click(screen.getByRole("combobox", { name: "角色" }));
    await screen.findByRole("option", { name: "所有者" });

    // ui-sdk keeps the empty part mounted; it must not add its padding while a list is shown.
    const empty = document.querySelector('[data-slot="select-empty"]') as HTMLElement;
    expect(empty).toBeInTheDocument();
    expect(empty).not.toHaveAttribute("data-empty");
    expect(empty).toHaveTextContent("");
    expect(empty.getBoundingClientRect().height).toBe(0);
  });

  it("names the trigger when no label or aria-label is provided", () => {
    render(<Select options={roles} />);

    expect(screen.getByRole("combobox", { name: "选择器" })).toBeInTheDocument();
  });

  it("filters options when searchable", async () => {
    render(<Select label="角色" options={roles} searchable />);

    await userEvent.click(screen.getByRole("combobox", { name: "角色" }));
    const search = await screen.findByRole("combobox", { name: "搜索选项" });
    await userEvent.type(search, "管理");

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "管理员" })).toBeInTheDocument();
      expect(screen.queryByRole("option", { name: "成员" })).not.toBeInTheDocument();
    });
  });

  it("shows the empty text when a search has no matches", async () => {
    render(<Select label="角色" options={roles} searchable emptyText="没有匹配角色" />);

    await userEvent.click(screen.getByRole("combobox", { name: "角色" }));
    const search = await screen.findByRole("combobox", { name: "搜索选项" });
    const empty = document.querySelector('[data-slot="select-empty"]') as HTMLElement;
    expect(empty.getBoundingClientRect().height).toBe(0);

    await userEvent.type(search, "zzz");

    await waitFor(() => expect(empty).toHaveAttribute("data-empty"));
    expect(empty).toHaveTextContent("没有匹配角色");
    expect(empty.getBoundingClientRect().height).toBeGreaterThan(0);
  });

  it("keeps the listbox structure valid when open", async () => {
    render(<Select label="角色" options={roles} />);

    await userEvent.click(screen.getByRole("combobox", { name: "角色" }));
    await screen.findByRole("option", { name: "所有者" });

    const result = await axe.run(document.body, {
      runOnly: { type: "rule", values: ["aria-required-children"] },
      resultTypes: ["violations"],
    });

    expect(result.violations).toEqual([]);
  });

  it("does not open when disabled", async () => {
    render(<Select label="角色" options={roles} disabled />);

    const trigger = screen.getByRole("combobox", { name: "角色" });
    expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("marks the trigger invalid and applies the documented heights", () => {
    const { rerender } = render(<Select label="角色" options={roles} invalid size="sm" />);
    let trigger = screen.getByRole("combobox", { name: "角色" });
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveClass("min-h-7");

    rerender(<Select label="角色" options={roles} size="lg" />);
    trigger = screen.getByRole("combobox", { name: "角色" });
    expect(trigger).toHaveClass("min-h-10");
  });
});
