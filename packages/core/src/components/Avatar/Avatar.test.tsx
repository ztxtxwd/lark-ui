import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Avatar } from "./Avatar";

const imageSrc = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

describe("Avatar", () => {
  it("renders a native image with the required alt text", () => {
    render(<Avatar src={imageSrc} alt="林七七" />);

    const image = screen.getByRole("img", { name: "林七七" });
    expect(image.tagName).toBe("IMG");
    expect(image).toHaveAttribute("src", imageSrc);
    expect(image).toHaveAttribute("alt", "林七七");
    // UD paints the image surface with --bg-body so transparent images do not
    // inherit the avatar's fallback colour.
    expect(image).toHaveClass("bg-lark-canvas");
  });

  it("lets a top-level aria-label name the image", () => {
    render(<Avatar src={imageSrc} alt="林七七" aria-label="七七的账号头像" />);

    expect(screen.getByRole("img", { name: "七七的账号头像" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "林七七" })).not.toBeInTheDocument();
  });

  it("derives Chinese initials from the last two characters", () => {
    render(<Avatar alt="林七七" />);

    expect(screen.getByText("七七")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "林七七" })).toHaveAttribute("data-slot", "avatar");
  });

  it("derives English initials from the given name and surname", () => {
    render(<Avatar alt="John Smith" />);

    expect(screen.getByText("JS")).toBeInTheDocument();
  });

  it("derives square (application/department) initials from the start of the name", () => {
    render(
      <div>
        <Avatar shape="square" alt="设计部" />
        <Avatar shape="square" alt="John Smith" />
        <Avatar shape="square" alt="Acme" />
      </div>,
    );

    expect(screen.getByText("设计")).toBeInTheDocument();
    expect(screen.queryByText("计部")).not.toBeInTheDocument();
    expect(screen.getByText("JO")).toBeInTheDocument();
    expect(screen.getByText("AC")).toBeInTheDocument();
  });

  it("shows the fallback initials while the image is loading", () => {
    const { container } = render(<Avatar src={imageSrc} alt="林七七" />);

    const image = screen.getByRole("img", { name: "林七七" });
    expect(image.tagName).toBe("IMG");
    expect(image).toHaveClass("opacity-0");
    expect(screen.getByText("七七")).toBeInTheDocument();
    expect(container.querySelector('[data-slot="avatar-fallback"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("reveals the image and removes the fallback once it loads", () => {
    const { container } = render(<Avatar src={imageSrc} alt="林七七" />);

    fireEvent.load(screen.getByRole("img", { name: "林七七" }));

    expect(screen.getByRole("img", { name: "林七七" }).tagName).toBe("IMG");
    expect(screen.getByRole("img", { name: "林七七" })).not.toHaveClass("opacity-0");
    expect(screen.queryByText("七七")).not.toBeInTheDocument();
    expect(container.querySelector('[data-slot="avatar-fallback"]')).toBeNull();
  });

  it("falls back to initials with the full name after an image error", async () => {
    const onError = vi.fn();
    const { container } = render(<Avatar src={imageSrc} alt="林七七" imgProps={{ onError }} />);

    fireEvent.error(screen.getByRole("img", { name: "林七七" }));

    expect(await screen.findByText("七七")).toBeInTheDocument();
    expect(container.querySelector('[data-slot="avatar-image"]')).toBeNull();
    expect(screen.getByRole("img", { name: "林七七" }).tagName).toBe("SPAN");
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("renders custom fallback content", () => {
    render(<Avatar alt="应用" fallback="APP" />);

    expect(screen.getByText("APP")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "应用" })).toBeInTheDocument();
  });

  it("renders an icon fallback", () => {
    render(<Avatar alt="应用" icon={<svg data-testid="avatar-icon" />} />);

    expect(screen.getByTestId("avatar-icon")).toBeInTheDocument();
  });

  it("keeps an explicit role instead of turning the fallback into an image", () => {
    render(<Avatar alt="打开个人资料" role="button" tabIndex={0} />);

    expect(screen.getByRole("button", { name: "打开个人资料" })).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders a default person icon without content", () => {
    const { container } = render(<Avatar />);

    expect(container.querySelector('[data-slot="avatar-fallback"] svg')).not.toBeNull();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("applies shape and named size variants", () => {
    render(<Avatar alt="张三" shape="square" size="lg" />);

    const avatar = screen.getByRole("img", { name: "张三" });
    expect(avatar).toHaveAttribute("data-shape", "square");
    expect(avatar).toHaveClass("rounded-[12.5%]");
    expect(avatar).toHaveClass("size-10");
  });

  it("accepts a pixel size and scales the fallback type", () => {
    render(<Avatar alt="张三" size={64} />);

    const avatar = screen.getByRole("img", { name: "张三" });
    expect(avatar).toHaveAttribute("data-size", "64");
    expect(avatar).toHaveStyle({ width: "64px", height: "64px", fontSize: "28px" });
  });
});
