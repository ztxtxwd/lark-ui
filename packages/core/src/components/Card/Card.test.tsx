import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Card,
  CardBody,
  CardCover,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Card";

describe("Card", () => {
  it("renders a composed card with heading, description, body and footer", () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>项目周报</CardTitle>
          <CardDescription>更新于今天 09:30</CardDescription>
        </CardHeader>
        <CardBody>本周完成了三个里程碑。</CardBody>
        <CardFooter>
          <span>查看详情</span>
        </CardFooter>
      </Card>,
    );

    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("data-slot", "card");
    expect(card).toHaveAttribute("data-variant", "outlined");
    expect(card).toHaveAttribute("data-size", "md");

    expect(screen.getByRole("heading", { level: 3, name: "项目周报" })).toHaveAttribute(
      "data-slot",
      "card-title",
    );
    expect(screen.getByText("更新于今天 09:30").tagName).toBe("P");
    expect(
      screen.getByText("本周完成了三个里程碑。").closest('[data-slot="card-body"]'),
    ).not.toBeNull();
    expect(screen.getByText("查看详情").closest('[data-slot="card-footer"]')).not.toBeNull();
    expect(card.querySelector('[data-slot="card-header"]')).not.toBeNull();
  });

  it("applies the three documented background and border treatments", () => {
    const { rerender } = render(<Card data-testid="card">卡片</Card>);

    expect(screen.getByTestId("card")).toHaveClass("border-lark-border-card");
    expect(screen.getByTestId("card")).toHaveClass("bg-lark-canvas");

    rerender(
      <Card data-testid="card" variant="borderless">
        卡片
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveClass("border-transparent");
    expect(screen.getByTestId("card")).toHaveClass("shadow-lark-1");

    rerender(
      <Card data-testid="card" variant="filled">
        卡片
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveClass("bg-lark-base");
    expect(screen.getByTestId("card")).not.toHaveClass("shadow-lark-1");
  });

  it("uses the 8 / 10 / 12px UD corner radii", () => {
    const { rerender } = render(
      <Card data-testid="card" size="sm">
        小卡片
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveClass("rounded-lark-lg");
    expect(screen.getByTestId("card")).toHaveAttribute("data-size", "sm");

    rerender(
      <Card data-testid="card" size="md">
        卡片
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveClass("rounded-[10px]");

    rerender(
      <Card data-testid="card" size="lg">
        大卡片
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveClass("rounded-lark-xl");
    expect(screen.getByTestId("card")).toHaveAttribute("data-size", "lg");
  });

  it("adds the UD hover elevation only when hoverable", () => {
    const { rerender } = render(<Card data-testid="card">普通卡片</Card>);
    expect(screen.getByTestId("card")).not.toHaveAttribute("data-hoverable");
    expect(screen.getByTestId("card")).not.toHaveClass("cursor-pointer");

    rerender(
      <Card data-testid="card" hoverable>
        可交互卡片
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveAttribute("data-hoverable");
    expect(screen.getByTestId("card")).toHaveClass("cursor-pointer");
    expect(screen.getByTestId("card")).toHaveClass("hover:shadow-lark-3");
  });

  it("bleeds the cover to the card edges and clips it", () => {
    render(
      <Card>
        <CardCover data-testid="cover">
          <span>封面</span>
        </CardCover>
        <CardBody>内容</CardBody>
      </Card>,
    );

    const cover = screen.getByTestId("cover");
    expect(cover).toHaveAttribute("data-slot", "card-cover");
    expect(cover).toHaveClass("-mx-3");
    expect(cover).toHaveClass("[&:first-child]:-mt-3");
  });

  it("uses the UD 12px padding, 1px N300 border and 10px medium radius", () => {
    render(<Card data-testid="card">内容</Card>);

    const style = getComputedStyle(screen.getByTestId("card"));
    expect(style.padding).toBe("12px");
    expect(style.borderWidth).toBe("1px");
    expect(style.borderColor).toBe("rgb(222, 224, 227)");
    expect(style.borderRadius).toBe("10px");
    expect(style.backgroundColor).toBe("rgb(255, 255, 255)");
  });

  it("forwards native props and merges consumer classes", () => {
    render(
      <Card id="project-card" className="max-w-sm" aria-label="项目卡片">
        内容
      </Card>,
    );

    const card = screen.getByLabelText("项目卡片");
    expect(card).toHaveAttribute("id", "project-card");
    expect(card).toHaveClass("max-w-sm");
    expect(card).toHaveClass("p-3");
  });
});
