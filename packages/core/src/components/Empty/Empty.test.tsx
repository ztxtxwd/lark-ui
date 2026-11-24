import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Empty } from "./Empty";

describe("Empty", () => {
  it("renders the title, description and default illustration", () => {
    const { container } = render(<Empty title="暂无内容" description="创建第一个文档开始使用" />);

    expect(screen.getByText("暂无内容")).toBeInTheDocument();
    expect(screen.getByText("创建第一个文档开始使用")).toBeInTheDocument();

    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("runs an action passed through the action slot", async () => {
    const onClick = vi.fn();
    render(
      <Empty
        title="暂无文件"
        description="上传或新建一个文件"
        action={
          <button type="button" onClick={onClick}>
            新建文件
          </button>
        }
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "新建文件" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("accepts a Button-like action as children", async () => {
    const onClick = vi.fn();
    render(
      <Empty title="还没有群聊">
        <button type="button" onClick={onClick}>
          发起群聊
        </button>
      </Empty>,
    );

    await userEvent.click(screen.getByRole("button", { name: "发起群聊" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("omits the illustration when illustration is null", () => {
    const { container } = render(
      <Empty title="暂无结果" description="换个关键词试试" illustration={null} />,
    );

    expect(container.querySelector("svg")).toBeNull();
  });

  it("renders a custom illustration at the requested size", () => {
    render(
      <Empty
        title="空"
        size="lg"
        illustration={<svg data-testid="empty-art" viewBox="0 0 10 10" />}
      />,
    );

    const art = screen.getByTestId("empty-art");
    expect(art).toBeInTheDocument();
    expect(art.parentElement?.className).toContain("size-[150px]");
  });

  it("uses the medium illustration by default", () => {
    const { container } = render(<Empty title="空" />);

    expect(container.querySelector("svg")?.parentElement?.className).toContain("size-[120px]");
  });
});
