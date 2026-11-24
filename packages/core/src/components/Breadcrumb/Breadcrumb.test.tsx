import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { MouseEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./Breadcrumb";

const trail = [
  { label: "首页", href: "/" },
  { label: "项目", href: "/projects" },
  { label: "详情" },
];

describe("Breadcrumb", () => {
  it("is a named navigation landmark containing an ordered list", () => {
    render(<Breadcrumb items={trail} />);

    const nav = screen.getByRole("navigation", { name: "面包屑" });
    expect(nav.tagName).toBe("NAV");
    expect(within(nav).getByRole("list")).toBeInTheDocument();
    expect(nav.querySelector("ol")).not.toBeNull();
  });

  it("accepts a custom accessible name", () => {
    render(<Breadcrumb label="当前位置" items={trail} />);

    expect(screen.getByRole("navigation", { name: "当前位置" })).toBeInTheDocument();
  });

  it("renders ancestors as links and the last level as the current page", () => {
    render(<Breadcrumb items={trail} />);

    const home = screen.getByRole("link", { name: "首页" });
    expect(home).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "项目" })).toHaveAttribute("href", "/projects");

    expect(screen.queryByRole("link", { name: "详情" })).not.toBeInTheDocument();
    expect(screen.getByText("详情")).toHaveAttribute("aria-current", "page");
  });

  it("honours an explicit current item", () => {
    render(
      <Breadcrumb
        items={[
          { label: "首页", href: "/" },
          { label: "项目", current: true },
          { label: "详情", href: "/projects/1" },
        ]}
      />,
    );

    expect(screen.getByText("项目")).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "详情" })).toHaveAttribute("href", "/projects/1");
  });

  it("activates links with the keyboard and pointer", async () => {
    const onClick = vi.fn((event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
    });
    render(<Breadcrumb items={[{ label: "首页", href: "#home", onClick }, { label: "详情" }]} />);

    await userEvent.tab();
    expect(screen.getByRole("link", { name: "首页" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole("link", { name: "首页" }));
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("hides separators from assistive tech", () => {
    render(<Breadcrumb items={trail} />);

    const nav = screen.getByRole("navigation");
    expect(within(nav).getAllByRole("listitem")).toHaveLength(3);
    expect(nav.querySelectorAll('[role="presentation"]')).toHaveLength(2);
    expect(nav.querySelectorAll("svg")).toHaveLength(2);
  });

  it("accepts a custom separator", () => {
    render(<Breadcrumb items={trail} separator="/" />);

    expect(screen.getAllByText("/")).toHaveLength(2);
  });

  it("collapses middle levels with an ellipsis when maxItems is set", () => {
    const items = ["首页", "工作台", "项目", "文档", "文件夹", "详情"].map((label, index) => ({
      label,
      href: index < 5 ? `/${index}` : undefined,
    }));

    render(<Breadcrumb items={items} maxItems={4} />);

    expect(screen.getByRole("link", { name: "首页" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "文件夹" })).toBeInTheDocument();
    expect(screen.getByText("详情")).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("link", { name: "工作台" })).not.toBeInTheDocument();
    expect(screen.queryByText("文档")).not.toBeInTheDocument();

    const ellipsis = screen.getByRole("img", { name: /已折叠 3 个层级/ });
    expect(ellipsis).toHaveAttribute("title", "工作台、项目、文档");
  });

  it("keeps an explicit current page visible when collapsing", () => {
    render(
      <Breadcrumb
        items={[
          { label: "首页", href: "/" },
          { label: "工作台", href: "/work" },
          { label: "当前", current: true },
          { label: "文档", href: "/docs" },
          { label: "详情", href: "/docs/1" },
        ]}
        maxItems={3}
      />,
    );

    expect(screen.getByText("当前")).toHaveAttribute("aria-current", "page");
    expect(screen.queryByText("文档")).not.toBeInTheDocument();
    expect(screen.queryByText("详情")).not.toBeInTheDocument();
  });

  it("does not collapse at or below maxItems", () => {
    render(<Breadcrumb items={trail} maxItems={3} />);

    expect(screen.getByRole("link", { name: "首页" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "项目" })).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("uses UD metrics for levels", () => {
    render(<Breadcrumb items={trail} />);

    const home = screen.getByRole("link", { name: "首页" });
    const styles = getComputedStyle(home);
    expect(styles.fontSize).toBe("14px");
    expect(styles.lineHeight).toBe("22px");
    expect(styles.maxWidth).toBe("162px");
    expect(styles.borderRadius).toBe("6px");
  });

  it("composes from the parts", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">首页</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>详情</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    const nav = screen.getByRole("navigation", { name: "面包屑" });
    expect(within(nav).getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "首页" })).toHaveAttribute("href", "/");
    expect(screen.getByText("详情")).toHaveAttribute("aria-current", "page");
    expect(nav.querySelector("svg")).not.toBeNull();
  });
});
