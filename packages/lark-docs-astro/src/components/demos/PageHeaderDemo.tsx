import { PageHeader } from "../lark/page-header/page-header";
import { Breadcrumbs, Button } from "@lark-ui/core";
import {
  HouseIcon,
  GearIcon,
  CodeIcon,
  GlobeIcon,
  PlusIcon,
} from "@phosphor-icons/react";

// Full-featured hero demo matching original
export function PageHeaderHeroDemo() {
  return (
    <PageHeader
      className="w-full"
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumbs.Link icon={<HouseIcon size={16} />} href="#">
            Workers 与 Pages
          </Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>cloudflare-dev-platform</Breadcrumbs.Current>
        </Breadcrumbs>
      }
      tabs={[
        { label: "概览", value: "overview" },
        { label: "指标", value: "metrics" },
        { label: "部署", value: "deployments" },
        { label: "绑定", value: "bindings" },
        { label: "可观测性", value: "observability" },
        { label: "设置", value: "settings" },
      ]}
      defaultTab="overview"
      onValueChange={(v) => console.log(v)}
    >
      <Button icon={<CodeIcon />} className="h-8">
        编辑代码
      </Button>
      <Button icon={<GlobeIcon />} variant="primary" className="h-8">
        访问
      </Button>
    </PageHeader>
  );
}

// Basic breadcrumbs-only demo
export function PageHeaderBasicDemo() {
  return (
    <PageHeader
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumbs.Link href="#">首页</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>仪表板</Breadcrumbs.Current>
        </Breadcrumbs>
      }
    />
  );
}

// With icons in breadcrumbs
export function PageHeaderWithIconsDemo() {
  return (
    <PageHeader
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumbs.Link icon={<HouseIcon size={16} />} href="#">
            首页
          </Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current icon={<GearIcon size={16} />}>
            设置
          </Breadcrumbs.Current>
        </Breadcrumbs>
      }
    />
  );
}

// With tabs
export function PageHeaderWithTabsDemo() {
  return (
    <PageHeader
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumbs.Link href="#">首页</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>设置</Breadcrumbs.Current>
        </Breadcrumbs>
      }
      tabs={[
        { label: "常规", value: "general" },
        { label: "安全", value: "security" },
        { label: "通知", value: "notifications" },
      ]}
      defaultTab="general"
    />
  );
}

// With actions
export function PageHeaderWithActionsDemo() {
  return (
    <PageHeader
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumbs.Link href="#">首页</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Link href="#">项目</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>我的项目</Breadcrumbs.Current>
        </Breadcrumbs>
      }
      tabs={[
        { label: "概览", value: "overview" },
        { label: "设置", value: "settings" },
      ]}
      defaultTab="overview"
    >
      <Button variant="primary" size="base">
        部署
      </Button>
    </PageHeader>
  );
}

// With title only
export function PageHeaderWithTitleDemo() {
  return (
    <PageHeader
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumbs.Link href="#">首页</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Link href="#">产品</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>页面标题</Breadcrumbs.Current>
        </Breadcrumbs>
      }
      title="页面标题"
    />
  );
}

// With title and description
export function PageHeaderWithTitleDescriptionDemo() {
  return (
    <PageHeader
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumbs.Link href="#">首页</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Link href="#">产品</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>页面标题</Breadcrumbs.Current>
        </Breadcrumbs>
      }
      title="页面标题"
      description="以行动为导向、强调价值的描述，说明本页面的用途。可选的第二句用于补充使用场景或前置条件。"
    />
  );
}

// Complete example with all features
export function PageHeaderCompleteDemo() {
  return (
    <PageHeader
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumbs.Link href="#">首页</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Link href="#">产品</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>页面标题</Breadcrumbs.Current>
        </Breadcrumbs>
      }
      title="页面标题"
      description="以行动为导向、强调价值的描述，说明本页面的用途。"
      tabs={[
        { label: "概览", value: "overview" },
        { label: "分析", value: "analytics" },
        { label: "设置", value: "settings" },
      ]}
      defaultTab="overview"
    >
      <Button variant="outline" size="sm">
        导出
      </Button>
      <Button variant="primary" size="sm" icon={<PlusIcon size={16} />}>
        新建项
      </Button>
    </PageHeader>
  );
}
