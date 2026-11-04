import { useState } from "react";
import { TableOfContents, useTableOfContentsActiveId } from "@lark-ui/core";

const headings = [
  { text: "简介" },
  { text: "安装" },
  { text: "用法" },
  { text: "API 参考" },
  { text: "示例" },
];

function DemoWrapper({ children }: { children: React.ReactNode }) {
  return <div className="min-w-48">{children}</div>;
}

export function TableOfContentsBasicDemo() {
  return (
    <DemoWrapper>
      <TableOfContents>
        <TableOfContents.Title>本页内容</TableOfContents.Title>
        <TableOfContents.List>
          {headings.map((heading) => (
            <TableOfContents.Item
              key={heading.text}
              active={heading.text === "用法"}
              className="cursor-pointer"
            >
              {heading.text}
            </TableOfContents.Item>
          ))}
        </TableOfContents.List>
      </TableOfContents>
    </DemoWrapper>
  );
}

export function TableOfContentsInteractiveDemo() {
  const [active, setActive] = useState("简介");

  return (
    <DemoWrapper>
      <TableOfContents>
        <TableOfContents.Title>本页内容</TableOfContents.Title>
        <TableOfContents.List>
          {headings.map((heading) => (
            <TableOfContents.Item
              key={heading.text}
              active={heading.text === active}
              onClick={() => setActive(heading.text)}
              className="cursor-pointer"
            >
              {heading.text}
            </TableOfContents.Item>
          ))}
        </TableOfContents.List>
      </TableOfContents>
    </DemoWrapper>
  );
}

export function TableOfContentsNoActiveDemo() {
  return (
    <DemoWrapper>
      <TableOfContents>
        <TableOfContents.Title>本页内容</TableOfContents.Title>
        <TableOfContents.List>
          {headings.map((heading) => (
            <TableOfContents.Item key={heading.text} className="cursor-pointer">
              {heading.text}
            </TableOfContents.Item>
          ))}
        </TableOfContents.List>
      </TableOfContents>
    </DemoWrapper>
  );
}

/** 展示两种分组模式：可点击的分组标签（带 `href`）和纯文本标题标签（不带 `href`）。 */
export function TableOfContentsGroupDemo() {
  return (
    <DemoWrapper>
      <TableOfContents>
        <TableOfContents.Title>本页内容</TableOfContents.Title>
        <TableOfContents.List>
          <TableOfContents.Item active className="cursor-pointer">
            概览
          </TableOfContents.Item>
          <TableOfContents.Group label="示例" href="#examples-demo">
            <TableOfContents.Item className="cursor-pointer">
              基础示例
            </TableOfContents.Item>
            <TableOfContents.Item className="cursor-pointer">
              高级示例
            </TableOfContents.Item>
          </TableOfContents.Group>
          <TableOfContents.Group label="快速开始">
            <TableOfContents.Item className="cursor-pointer">
              安装
            </TableOfContents.Item>
            <TableOfContents.Item className="cursor-pointer">
              配置
            </TableOfContents.Item>
          </TableOfContents.Group>
          <TableOfContents.Group label="API" href="#api-demo">
            <TableOfContents.Item className="cursor-pointer">
              属性
            </TableOfContents.Item>
            <TableOfContents.Item className="cursor-pointer">
              事件
            </TableOfContents.Item>
          </TableOfContents.Group>
        </TableOfContents.List>
      </TableOfContents>
    </DemoWrapper>
  );
}

export function TableOfContentsWithoutTitleDemo() {
  return (
    <DemoWrapper>
      <TableOfContents>
        <TableOfContents.List>
          {headings.slice(0, 3).map((heading) => (
            <TableOfContents.Item
              key={heading.text}
              active={heading.text === "简介"}
              className="cursor-pointer"
            >
              {heading.text}
            </TableOfContents.Item>
          ))}
        </TableOfContents.List>
      </TableOfContents>
    </DemoWrapper>
  );
}

const scrollspySections = [
  { id: "scrollspy-demo-overview", title: "概览" },
  { id: "scrollspy-demo-install", title: "安装" },
  { id: "scrollspy-demo-usage", title: "用法" },
  { id: "scrollspy-demo-api", title: "API" },
];

/**
 * 通过 `useTableOfContentsActiveId` 实现实时滚动跟踪，并通过 `root` 选项将作用域
 * 限定到自定义滚动容器。滚动内容——当前条目会跟随高亮；点击某个条目即可跳转。
 */
export function TableOfContentsScrollspyDemo() {
  const [root, setRoot] = useState<HTMLDivElement | null>(null);

  const { activeId, selectSection } = useTableOfContentsActiveId({
    ids: scrollspySections.map((s) => s.id),
    root,
    trackHash: false,
  });

  return (
    <div className="flex w-full max-w-xl gap-6">
      <div className="min-w-40">
        <TableOfContents>
          <TableOfContents.Title>本页内容</TableOfContents.Title>
          <TableOfContents.List>
            {scrollspySections.map((section) => (
              <TableOfContents.Item
                key={section.id}
                render={<button type="button" />}
                active={activeId === section.id}
                onClick={() => {
                  selectSection(section.id);
                  root
                    ?.querySelector(`#${section.id}`)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                {section.title}
              </TableOfContents.Item>
            ))}
          </TableOfContents.List>
        </TableOfContents>
      </div>
      <div
        ref={setRoot}
        className="h-64 flex-1 overflow-y-auto rounded-lg border border-lark-hairline p-4"
      >
        {scrollspySections.map((section) => (
          <section key={section.id}>
            <h4
              id={section.id}
              className="mb-2 scroll-mt-2 text-sm font-semibold"
            >
              {section.title}
            </h4>
            <p className="mb-6 text-sm text-lark-subtle">
              {Array.from(
                { length: 6 },
                () => `用于 ${section.title} 分区的可滚动占位文本。 `,
              ).join("")}
            </p>
          </section>
        ))}
        <div className="h-40" />
      </div>
    </div>
  );
}

/** 演示使用 `render` 属性配合自定义链接组件。 */
export function TableOfContentsRenderPropDemo() {
  const [clicked, setClicked] = useState<string | null>(null);

  return (
    <DemoWrapper>
      <div className="space-y-3">
        <TableOfContents>
          <TableOfContents.List>
            {["简介", "安装", "用法"].map((text) => (
              <TableOfContents.Item
                key={text}
                render={<button type="button" />}
                onClick={() => setClicked(text)}
                active={text === "简介"}
              >
                {text}
              </TableOfContents.Item>
            ))}
          </TableOfContents.List>
        </TableOfContents>
        {clicked && (
          <p className="text-xs text-lark-subtle">已点击：{clicked}</p>
        )}
      </div>
    </DemoWrapper>
  );
}
