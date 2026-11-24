import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";
import { ButtonGroup } from "./ButtonGroup";

describe("ButtonGroup", () => {
  it("names the group and keeps each button operable", async () => {
    const onShare = vi.fn();
    render(
      <ButtonGroup aria-label="文档操作">
        <Button onClick={onShare}>分享</Button>
        <Button appearance="outlined" tone="neutral">
          权限
        </Button>
      </ButtonGroup>,
    );

    const group = screen.getByRole("group", { name: "文档操作" });
    expect(group).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "分享" }));
    expect(onShare).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "权限" })).toBeEnabled();
  });

  it("uses 8 / 12 / 16px gaps for sm / md / lg", () => {
    const { rerender } = render(
      <ButtonGroup spacing="sm">
        <Button>一</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole("group");
    expect(group.className).toContain("gap-2");

    rerender(
      <ButtonGroup spacing="md">
        <Button>一</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("group").className).toContain("gap-3");

    rerender(
      <ButtonGroup spacing="lg">
        <Button>一</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("group").className).toContain("gap-4");
  });

  it("stacks vertically and stretches its buttons", () => {
    render(
      <ButtonGroup orientation="vertical">
        <Button>一</Button>
        <Button>二</Button>
      </ButtonGroup>,
    );

    const group = screen.getByRole("group");
    expect(group.className).toContain("flex-col");
    expect(group.className).toContain("items-stretch");
  });
});
