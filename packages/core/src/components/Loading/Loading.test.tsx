import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Loading } from "./Loading";

describe("Loading", () => {
  it("announces a live status with a spinner and a default name", () => {
    const { container } = render(<Loading />);

    const status = screen.getByRole("status", { name: "加载中" });
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(container.querySelector(".lark-spinner")).not.toBeNull();
  });

  it("shows the tip and maps size, tone and vertical spacing", () => {
    const { container } = render(<Loading tip="正在加载文件" size="lg" tone="neutral" />);

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("正在加载文件");

    const spinner = container.querySelector(".lark-spinner");
    expect(spinner?.className).toContain("size-10");
    expect(spinner?.className).toContain("text-lark-neutral-400");
    expect(screen.getByText("正在加载文件").className).toContain("mt-3");
  });

  it("uses an 8px gap for horizontal layout", () => {
    render(<Loading tip="同步中" direction="horizontal" />);

    expect(screen.getByText("同步中").className).toContain("ml-2");
  });

  it("accepts a custom accessible name", () => {
    render(<Loading aria-label="正在同步" />);

    expect(screen.getByRole("status", { name: "正在同步" })).toBeInTheDocument();
  });

  it("centres itself across the parent when centered", () => {
    render(<Loading centered />);

    expect(screen.getByRole("status").className).toContain("w-full");
  });

  it("covers content with a mask and makes the content inert", () => {
    const { container } = render(
      <Loading overlay tip="加载中">
        <p>模块内容</p>
      </Loading>,
    );

    const wrapper = screen.getByText("模块内容").parentElement;
    expect(wrapper).toHaveAttribute("inert");
    expect(container.querySelector("[data-loading-overlay]")).toHaveAttribute("aria-busy", "true");

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("加载中");
    expect(status.className).toContain("bg-lark-canvas/60");
  });
});
