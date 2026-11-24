import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it } from "vitest";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Progress } from "../components/Progress";
import { SegmentedControl, SegmentedControlItem } from "../components/SegmentedControl";
import { Select } from "../components/Select";
import { Tabs, TabsList, TabsPanel, TabsTab } from "../components/Tabs";
import { Tag } from "../components/Tag";
import { Timeline, TimelineItem } from "../components/Timeline";
import { TreeSelect } from "../components/TreeSelect";

async function contrastViolations(container: HTMLElement) {
  const result = await axe.run(container, {
    runOnly: { type: "rule", values: ["color-contrast"] },
    resultTypes: ["violations"],
  });
  return result.violations.map((violation) => ({
    id: violation.id,
    targets: violation.nodes.map((node) => node.target.join(" ")),
  }));
}

describe("color contrast", () => {
  it("keeps the danger button label above 4.5:1", async () => {
    const { container } = render(<Button tone="danger">删除</Button>);
    expect(await contrastViolations(container)).toEqual([]);
  });

  it("keeps success and selected button labels above 4.5:1", async () => {
    const { container } = render(
      <div>
        <Button tone="success">加入</Button>
        <Button tone="success" appearance="outlined">
          加入
        </Button>
        <Button tone="success" appearance="text">
          加入
        </Button>
        <Button selected>已订阅</Button>
        <Button selected tone="danger">
          已删除
        </Button>
        <Button selected tone="success">
          已加入
        </Button>
        <Button selected appearance="outlined">
          已订阅
        </Button>
        <Button selected appearance="text">
          已筛选
        </Button>
        <Button selected appearance="icon" aria-label="已筛选">
          <svg />
        </Button>
      </div>,
    );
    expect(await contrastViolations(container)).toEqual([]);
  });

  it("keeps every tag tone readable on its tinted fill", async () => {
    const { container } = render(
      <div>
        <Tag tone="neutral">neutral</Tag>
        <Tag tone="primary">primary</Tag>
        <Tag tone="success">success</Tag>
        <Tag tone="warning">warning</Tag>
        <Tag tone="danger">danger</Tag>
      </div>,
    );
    expect(await contrastViolations(container)).toEqual([]);
  });

  it("keeps every badge status readable with white text", async () => {
    const { container } = render(
      <div>
        <Badge count={3} status="default" />
        <Badge count={3} status="success" />
        <Badge count={3} status="warning" />
        <Badge count={3} status="danger" />
        <Badge count={3} status="info" />
      </div>,
    );
    expect(await contrastViolations(container)).toEqual([]);
  });

  it("keeps the select placeholder readable", async () => {
    const { container } = render(
      <Select
        label="角色"
        options={[{ value: "admin", label: "管理员" }]}
        placeholder="请选择角色"
      />,
    );
    expect(screen.getByRole("combobox", { name: "角色" })).toBeInTheDocument();
    expect(await contrastViolations(container)).toEqual([]);
  });

  it("keeps tabs and tags readable in dark mode", async () => {
    document.documentElement.dataset.theme = "dark";
    try {
      const { container } = render(
        <div>
          <Tabs defaultValue="a">
            <TabsList aria-label="视图">
              <TabsTab value="a">概览</TabsTab>
              <TabsTab value="b">成员</TabsTab>
            </TabsList>
            <TabsPanel value="a">内容</TabsPanel>
            <TabsPanel value="b">内容</TabsPanel>
          </Tabs>
          <Tabs defaultValue="a" variant="capsule">
            <TabsList aria-label="筛选">
              <TabsTab value="a">全部</TabsTab>
              <TabsTab value="b">未读</TabsTab>
            </TabsList>
            <TabsPanel value="a">内容</TabsPanel>
            <TabsPanel value="b">内容</TabsPanel>
          </Tabs>
          <Tag tone="primary">primary</Tag>
          <Tag tone="success">success</Tag>
          <Tag tone="warning">warning</Tag>
          <Tag tone="danger">danger</Tag>
          <Badge count={3} status="default" />
          <Badge count={3} status="success" />
          <Badge count={3} status="warning" />
          <Badge count={3} status="danger" />
          <Badge count={3} status="info" />
        </div>,
      );
      expect(await contrastViolations(container)).toEqual([]);
    } finally {
      delete document.documentElement.dataset.theme;
    }
  });

  it("keeps progress values and timeline times readable", async () => {
    const { container } = render(
      <div>
        <Progress value={40} />
        <Timeline>
          <TimelineItem title="提交订单" time="2026-11-10 09:00" />
          <TimelineItem title="商家接单" time="2026-11-10 09:12" />
        </Timeline>
      </div>,
    );
    expect(await contrastViolations(container)).toEqual([]);
  });

  it("keeps segmented control options readable on the track", async () => {
    const { container } = render(
      <SegmentedControl aria-label="对齐方式" defaultValue="left">
        <SegmentedControlItem value="left">左对齐</SegmentedControlItem>
        <SegmentedControlItem value="center">居中</SegmentedControlItem>
        <SegmentedControlItem value="right">右对齐</SegmentedControlItem>
      </SegmentedControl>,
    );
    expect(await contrastViolations(container)).toEqual([]);

    document.documentElement.dataset.theme = "dark";
    try {
      expect(await contrastViolations(container)).toEqual([]);
    } finally {
      delete document.documentElement.dataset.theme;
    }
  });

  it("keeps tree select chips, values and placeholders readable", async () => {
    const departments = [
      {
        value: "rd",
        title: "产品研发中心",
        children: [{ value: "ui", title: "UI 设计组" }],
      },
    ];
    const { container } = render(
      <div>
        <TreeSelect
          label="部门"
          treeData={departments}
          placeholder="请选择部门"
          aria-label="单选"
        />
        <TreeSelect
          label="多选部门"
          treeData={departments}
          multiple
          defaultValue={["ui"]}
          aria-label="多选"
        />
        <TreeSelect
          label="禁用部门"
          treeData={departments}
          defaultValue="ui"
          disabled
          aria-label="禁用"
        />
      </div>,
    );
    expect(screen.getByRole("combobox", { name: "多选部门" })).toHaveTextContent("UI 设计组");
    expect(await contrastViolations(container)).toEqual([]);
  });
});
