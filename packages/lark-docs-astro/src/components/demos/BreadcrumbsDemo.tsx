import { Breadcrumbs } from "@lark-ui/core";
import { House } from "@phosphor-icons/react";

export function BreadcrumbsDemo() {
  return (
    <Breadcrumbs>
      <Breadcrumbs.Link href="#">首页</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Link href="#">文档</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Current>面包屑导航</Breadcrumbs.Current>
    </Breadcrumbs>
  );
}

export function BreadcrumbsWithIconsDemo() {
  return (
    <Breadcrumbs>
      <Breadcrumbs.Link href="#" icon={<House size={16} />}>
        首页
      </Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Link href="#">项目</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Current>当前项目</Breadcrumbs.Current>
    </Breadcrumbs>
  );
}

export function BreadcrumbsLoadingDemo() {
  return (
    <Breadcrumbs>
      <Breadcrumbs.Link href="#" icon={<House size={16} />}>
        首页
      </Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Link href="#">文档</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Current loading></Breadcrumbs.Current>
    </Breadcrumbs>
  );
}

export function BreadcrumbsRootDemo() {
  return (
    <Breadcrumbs>
      <Breadcrumbs.Current icon={<House size={16} />}>
        Worker 分析
      </Breadcrumbs.Current>
    </Breadcrumbs>
  );
}

export function BreadcrumbsWithClipboardDemo() {
  return (
    <Breadcrumbs>
      <Breadcrumbs.Link href="#">首页</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Current>面包屑导航</Breadcrumbs.Current>
      <Breadcrumbs.Clipboard text="#" />
    </Breadcrumbs>
  );
}
