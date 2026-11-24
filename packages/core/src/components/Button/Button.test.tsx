import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a native button and runs the click handler", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);

    const button = screen.getByRole("button", { name: "Save" });
    expect(button.tagName).toBe("BUTTON");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is reachable and operable with the keyboard", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Create</Button>);

    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Create" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not run the handler when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Disabled" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("shows a pointer cursor, and not-allowed when disabled", () => {
    const { rerender } = render(<Button>Save</Button>);
    expect(getComputedStyle(screen.getByRole("button", { name: "Save" })).cursor).toBe("pointer");

    rerender(<Button disabled>Save</Button>);
    expect(getComputedStyle(screen.getByRole("button", { name: "Save" })).cursor).toBe(
      "not-allowed",
    );
  });

  it("keeps the default cursor while loading or pending", async () => {
    const { rerender } = render(<Button loading>Save</Button>);
    expect(getComputedStyle(screen.getByRole("button", { name: "Save" })).cursor).toBe("default");

    let finish = () => {};
    rerender(
      <Button
        onClick={() =>
          new Promise<void>((resolve) => {
            finish = resolve;
          })
        }
      >
        Save
      </Button>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    const pending = screen.getByRole("button", { name: "Save" });
    expect(pending).toHaveAttribute("data-pending");
    expect(getComputedStyle(pending).cursor).toBe("default");

    finish();
  });

  it("keeps a disabled button focusable when asked", async () => {
    render(
      <Button disabled focusableWhenDisabled>
        Publish
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Publish" });
    await userEvent.tab();
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("shows a busy spinner and ignores presses while loading", async () => {
    const onClick = vi.fn();
    const { container } = render(
      <Button loading onClick={onClick}>
        Saving
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Saving" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(container.querySelector(".lark-spinner")).not.toBeNull();

    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("shows a spinner while a click handler is pending", async () => {
    let finish = () => {};
    const { container } = render(
      <Button
        onClick={() =>
          new Promise<void>((resolve) => {
            finish = resolve;
          })
        }
      >
        Submit
      </Button>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(screen.getByRole("button", { name: "Submit" })).toHaveAttribute("data-pending");
    expect(container.querySelector(".lark-spinner")).not.toBeNull();

    finish();
    await vi.waitFor(() => {
      expect(screen.getByRole("button", { name: "Submit" })).not.toHaveAttribute("data-pending");
    });
  });

  it("replaces an icon-only label with the spinner while loading", () => {
    const { container } = render(
      <Button appearance="icon" aria-label="删除" loading>
        <svg data-testid="trash" />
      </Button>,
    );

    expect(screen.getByRole("button", { name: "删除" })).toHaveAttribute("aria-busy", "true");
    expect(container.querySelector(".lark-spinner")).not.toBeNull();
    expect(screen.queryByTestId("trash")).not.toBeInTheDocument();
  });

  it("renders as a link when using render", () => {
    render(
      <Button render={<a href="#docs" />} appearance="link">
        Documentation
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Documentation" });
    expect(link).toHaveAttribute("href", "#docs");
  });

  it("supports block, round and size variants", () => {
    render(
      <Button block shape="round" size="lg">
        Full width
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Full width" });
    expect(button.className).toContain("w-full");
    expect(button.className).toContain("rounded-lark-full");
    expect(button.className).toContain("text-lark-16");
  });

  it("reports the UD Selected type through aria-pressed", async () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <Button selected onClick={onClick}>
        已订阅
      </Button>,
    );

    const button = screen.getByRole("button", { name: "已订阅" });
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button.className).toContain("aria-pressed:bg-lark-primary-soft");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button selected={false} onClick={onClick}>
        已订阅
      </Button>,
    );
    expect(screen.getByRole("button", { name: "已订阅" })).toHaveAttribute("aria-pressed", "false");
  });

  it("gives the selected filled button the tinted UD selection fill", () => {
    render(<Button selected>已订阅</Button>);

    const button = screen.getByRole("button", { name: "已订阅" });
    expect(getComputedStyle(button).backgroundColor).toBe("rgb(224, 233, 255)");
    expect(getComputedStyle(button).color).toBe("rgb(20, 86, 240)");
  });

  it("keeps a menu trigger in its hover look while aria-expanded", () => {
    render(<Button aria-expanded>更多</Button>);

    const button = screen.getByRole("button", { name: "更多" });
    expect(getComputedStyle(button).backgroundColor).toBe("rgb(51, 109, 244)");
  });

  it("renders the success tone with a contrast-safe fill", () => {
    render(<Button tone="success">加入</Button>);

    const button = screen.getByRole("button", { name: "加入" });
    expect(button.className).toContain("bg-[var(--lark-success-content-pressed)]");
    expect(getComputedStyle(button).backgroundColor).toBe("rgb(37, 136, 50)");
  });

  it("renders an outlined icon button at the icon size", () => {
    render(
      <Button appearance="outlined" tone="neutral" shape="circle" aria-label="添加成员">
        <svg />
      </Button>,
    );

    const button = screen.getByRole("button", { name: "添加成员" });
    expect(button.className).toContain("size-8");
    expect(button.className).toContain("rounded-lark-full");
  });
});
