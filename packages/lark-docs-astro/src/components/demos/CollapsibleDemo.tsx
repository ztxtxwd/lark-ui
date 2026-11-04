import { Button, Collapsible, Input, Text } from "@lark-ui/core";
import { useState } from "react";

/**
 * 使用 DefaultTrigger 和 DefaultPanel 的首屏示例，呈现经典的 Lark 样式。
 */
export function CollapsibleHeroDemo() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="w-full">
      <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
        <Collapsible.DefaultTrigger>Lark 是什么？</Collapsible.DefaultTrigger>
        <Collapsible.DefaultPanel>
          <Text>Lark 是飞书宇宙设计系统。</Text>
        </Collapsible.DefaultPanel>
      </Collapsible.Root>
    </div>
  );
}

/**
 * 使用默认样式组件的基本用法。
 */
export function CollapsibleBasicDemo() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-full">
      <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
        <Collapsible.DefaultTrigger>Lark 是什么？</Collapsible.DefaultTrigger>
        <Collapsible.DefaultPanel>
          <Text>Lark 是飞书宇宙设计系统。</Text>
        </Collapsible.DefaultPanel>
      </Collapsible.Root>
    </div>
  );
}

/**
 * 多个相互独立的折叠面板（Collapsible）。
 */
export function CollapsibleMultipleDemo() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  return (
    <div className="w-full space-y-2">
      <Collapsible.Root open={open1} onOpenChange={setOpen1}>
        <Collapsible.DefaultTrigger>Lark 是什么？</Collapsible.DefaultTrigger>
        <Collapsible.DefaultPanel>
          <Text>Lark 是飞书宇宙设计系统。</Text>
        </Collapsible.DefaultPanel>
      </Collapsible.Root>
      <Collapsible.Root open={open2} onOpenChange={setOpen2}>
        <Collapsible.DefaultTrigger>我该如何使用？</Collapsible.DefaultTrigger>
        <Collapsible.DefaultPanel>
          <Text>安装组件并导入到你的项目中。</Text>
        </Collapsible.DefaultPanel>
      </Collapsible.Root>
      <Collapsible.Root open={open3} onOpenChange={setOpen3}>
        <Collapsible.DefaultTrigger>它是开源的吗？</Collapsible.DefaultTrigger>
        <Collapsible.DefaultPanel>
          <Text>查看仓库以了解许可证信息。</Text>
        </Collapsible.DefaultPanel>
      </Collapsible.Root>
    </div>
  );
}

/**
 * 使用 render 属性自定义触发器，完全掌控其表现。
 */
export function CollapsibleCustomTriggerDemo() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-full">
      <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
        <Collapsible.Trigger render={<Button variant="secondary" size="sm" />}>
          {isOpen ? "隐藏详情" : "显示详情"}
        </Collapsible.Trigger>
        <Collapsible.Panel className="mt-3 rounded-lg bg-lark-tint p-4">
          <Text>此面板使用自定义样式，而不是默认的左侧边框强调样式。</Text>
        </Collapsible.Panel>
      </Collapsible.Root>
    </div>
  );
}

/**
 * 关闭时仍让面板保持在 DOM 中，以保留表单输入框等内部状态。
 */
export function CollapsibleKeepMountedDemo() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="w-full space-y-4">
      <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
        <Collapsible.DefaultTrigger>编辑详情</Collapsible.DefaultTrigger>
        <Collapsible.DefaultPanel keepMounted>
          <Text>
            在下方输入内容，然后折叠并重新展开——由于面板保持挂载，你的输入会被保留。
          </Text>
          <Input label="名称" placeholder="在此输入…" />
        </Collapsible.DefaultPanel>
      </Collapsible.Root>
    </div>
  );
}

/**
 * 在 DefaultPanel 内放置表单控件，用于测试焦点环是否被裁剪。
 */
export function CollapsibleFormDemo() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="w-full">
      <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
        <Collapsible.DefaultTrigger>联系设置</Collapsible.DefaultTrigger>
        <Collapsible.DefaultPanel>
          <form
            className="flex max-w-sm flex-col gap-4"
            onSubmit={(event) => event.preventDefault()}
          >
            <Input label="邮箱" placeholder="user@example.com" type="email" />
            <Input label="团队名称" placeholder="设计工程" />
            <Button type="submit">保存设置</Button>
          </form>
        </Collapsible.DefaultPanel>
      </Collapsible.Root>
    </div>
  );
}

/**
 * 手风琴模式，同一时间只能展开一个条目。
 */
export function CollapsibleAccordionDemo() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const items = [
    {
      title: "Lark 是什么？",
      content:
        "Lark 是基于 Base UI 和 Tailwind CSS v4 构建的飞书宇宙设计系统。",
    },
    {
      title: "如何安装？",
      content: "运行 `npm install @lark-ui/core` 并导入你需要的组件。",
    },
    {
      title: "它支持无障碍吗？",
      content: "支持！Lark 基于 Base UI 构建，开箱即提供优秀的无障碍支持。",
    },
  ];

  return (
    <div className="w-full space-y-2">
      {items.map((item, i) => (
        <Collapsible.Root
          key={i}
          open={activeIndex === i}
          onOpenChange={(open) => setActiveIndex(open ? i : null)}
        >
          <Collapsible.DefaultTrigger>{item.title}</Collapsible.DefaultTrigger>
          <Collapsible.DefaultPanel>
            <Text>{item.content}</Text>
          </Collapsible.DefaultPanel>
        </Collapsible.Root>
      ))}
    </div>
  );
}
