import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Progress } from "./Progress";

describe("Progress", () => {
  it("exposes the progressbar role, range, value and formatted text", () => {
    render(<Progress value={40} showInfo aria-label="上传进度" />);

    const bar = screen.getByRole("progressbar", { name: "上传进度" });
    expect(bar).toHaveAttribute("role", "progressbar");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuetext", "40%");
    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("uses a custom format for both the visible value and aria-valuetext", () => {
    render(
      <Progress
        value={3}
        max={12}
        showInfo
        aria-label="复制文件"
        format={(value) => `${value} / 12 个文件`}
      />,
    );

    const bar = screen.getByRole("progressbar", { name: "复制文件" });
    expect(bar).toHaveAttribute("aria-valuenow", "3");
    expect(bar).toHaveAttribute("aria-valuemax", "12");
    expect(bar).toHaveAttribute("aria-valuetext", "3 / 12 个文件");
    expect(screen.getByText("3 / 12 个文件")).toBeInTheDocument();
  });

  it("is named by its visible label", () => {
    render(<Progress value={30}>上传文件</Progress>);

    expect(screen.getByRole("progressbar", { name: "上传文件" })).toBeInTheDocument();
  });

  it("clamps a value above max for the fill and the announced value", () => {
    render(<Progress value={150} max={100} aria-label="超额" />);

    const bar = screen.getByRole("progressbar", { name: "超额" });
    expect(bar).toHaveAttribute("aria-valuenow", "100");
    expect(bar).toHaveAttribute("aria-valuetext", "100%");
  });

  it("has no value while indeterminate and shows the moving segment", () => {
    const { container } = render(<Progress indeterminate showInfo aria-label="连接中" />);

    const bar = screen.getByRole("progressbar", { name: "连接中" });
    expect(bar).toHaveAttribute("data-indeterminate");
    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar).not.toHaveAttribute("aria-valuetext");
    expect(container.querySelector(".lark-progress-indeterminate")).not.toBeNull();
  });

  it("treats a missing value as indeterminate", () => {
    render(<Progress aria-label="等待中" />);

    expect(screen.getByRole("progressbar", { name: "等待中" })).not.toHaveAttribute(
      "aria-valuenow",
    );
  });

  it("does not render an empty value slot while indeterminate", () => {
    const { container } = render(<Progress indeterminate showInfo aria-label="连接中" />);

    // An empty value would leave its 12px gap beside the track.
    expect(container.querySelector('[data-slot="progress-value"]')).toBeNull();
    expect(container.querySelector(".lark-progress-indeterminate")).not.toBeNull();
  });

  it("maps status and size to the documented track styles", () => {
    const { container } = render(<Progress value={50} status="success" size="lg" />);

    const bar = screen.getByRole("progressbar");
    const indicator = container.querySelector('[data-slot="progress-indicator"]');
    const track = container.querySelector('[data-slot="progress-track"]');

    expect(bar).toHaveAttribute("data-status", "success");
    expect(indicator?.className).toContain("bg-lark-success-content");
    expect(track?.className).toContain("h-2");
  });

  it("hides the value unless showInfo is set", () => {
    render(<Progress value={20} aria-label="静默进度" />);

    expect(screen.queryByText("20%")).not.toBeInTheDocument();
  });
});
