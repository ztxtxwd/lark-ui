import { Button, LinkButton, LarkIcon } from "@lark-ui/core";

export function ButtonBasicDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="secondary">按钮</Button>
      <Button
        variant="secondary"
        shape="square"
        icon={<LarkIcon name="plus" />}
        aria-label="添加"
      />
    </div>
  );
}

export function ButtonPrimaryDemo() {
  return <Button variant="primary">主要</Button>;
}

export function ButtonSecondaryDemo() {
  return <Button variant="secondary">次要</Button>;
}

export function ButtonGhostDemo() {
  return <Button variant="ghost">幽灵</Button>;
}

export function ButtonDestructiveDemo() {
  return <Button variant="destructive">危险</Button>;
}

export function ButtonOutlineDemo() {
  return <Button variant="outline">轮廓</Button>;
}

export function ButtonSecondaryDestructiveDemo() {
  return <Button variant="secondary-destructive">次要危险</Button>;
}

export function ButtonSizesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs" variant="secondary">
        极小
      </Button>
      <Button size="sm" variant="secondary">
        小
      </Button>
      <Button size="base" variant="secondary">
        标准
      </Button>
      <Button size="lg" variant="secondary">
        大
      </Button>
    </div>
  );
}

export function ButtonWithIconDemo() {
  return (
    <Button variant="secondary" icon={<LarkIcon name="plus" />}>
      新建文档
    </Button>
  );
}

export function ButtonIconOnlyDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="secondary"
        shape="square"
        icon={<LarkIcon name="plus" />}
        aria-label="添加项"
      />
      <Button
        variant="secondary"
        shape="circle"
        icon={<LarkIcon name="plus" />}
        aria-label="添加项"
      />
    </div>
  );
}

export function ButtonLoadingDemo() {
  return (
    <Button variant="primary" loading>
      加载中...
    </Button>
  );
}

export function ButtonDisabledDemo() {
  return (
    <Button variant="secondary" disabled>
      禁用
    </Button>
  );
}

export function ButtonUsageDemo() {
  return <Button variant="secondary">点击我</Button>;
}

/** 演示在启用状态、仅图标和禁用状态的按钮（Button）上使用 title 工具提示。 */
export function ButtonTitleDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="secondary" title="新建文档">
        新建文档
      </Button>
      <Button
        variant="secondary"
        shape="square"
        icon={<LarkIcon name="plus" />}
        aria-label="添加项"
        title="添加项"
      />
      <Button variant="secondary" title="你需要编辑权限才能创建文档" disabled>
        新建文档
      </Button>
    </div>
  );
}

/** 演示使用 LinkButton 实现外观类似按钮的导航操作。 */
export function ButtonLinkAsButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <LinkButton href="/components/link" variant="secondary">
        阅读 Link 文档
      </LinkButton>
      <LinkButton
        href="https://developers.cloudflare.com"
        variant="ghost"
        icon={<LarkIcon name="arrow-square-out" />}
        external
      >
        Lark 文档
      </LinkButton>
    </div>
  );
}

/** 演示在启用状态的 LinkButton 上使用 title 工具提示。 */
export function ButtonLinkTooltipDemo() {
  return (
    <LinkButton
      href="/components/link"
      variant="secondary"
      title="打开 Link 组件文档"
    >
      阅读 Link 文档
    </LinkButton>
  );
}

/** 演示禁用状态的 LinkButton，并用 title 工具提示说明禁用的原因。 */
export function ButtonDisabledLinkDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <LinkButton href="/components/link" variant="secondary" disabled>
        禁用的链接
      </LinkButton>
      <LinkButton
        href="/components/link"
        variant="secondary"
        disabled
        title="你需要编辑权限才能继续"
      >
        带提示的禁用状态
      </LinkButton>
    </div>
  );
}
