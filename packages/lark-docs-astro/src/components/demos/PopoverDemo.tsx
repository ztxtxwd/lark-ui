import { useState, useRef } from "react";
import { Popover, Button } from "@lark-ui/core";
import { BellIcon, DotsThree } from "@phosphor-icons/react";

export function PopoverHeroDemo() {
  return (
    <Popover.Root>
      <Popover.Trigger
        render={<Button shape="square" icon={BellIcon} aria-label="通知" />}
      />
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup>
            <Popover.Arrow />
            <Popover.Title>通知</Popover.Title>
            <Popover.Description>你已全部看完，干得漂亮！</Popover.Description>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function PopoverBasicDemo() {
  return (
    <Popover.Root>
      <Popover.Trigger render={<Button />}>打开气泡卡片</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup>
            <Popover.Arrow />
            <Popover.Title>气泡卡片标题</Popover.Title>
            <Popover.Description>
              这是一个包含标题和描述的基础气泡卡片。
            </Popover.Description>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function PopoverLegacyContentDemo() {
  return (
    <Popover>
      <Popover.Trigger render={<Button variant="secondary" />}>
        打开旧版 Content
      </Popover.Trigger>
      <Popover.Content className="w-72">
        <Popover.Title>兼容模式</Popover.Title>
        <Popover.Description>
          这个旧版包装器只做淡入，不做缩放或变换。
        </Popover.Description>
      </Popover.Content>
    </Popover>
  );
}

export function PopoverOverflowDemo() {
  return (
    <Popover.Root>
      <Popover.Trigger render={<Button variant="secondary" />}>
        打开可滚动的气泡卡片
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup className="w-72">
            <Popover.Arrow />
            <Popover.Title>最近通知</Popover.Title>
            <Popover.Description>
              列表可滚动，标题和箭头保持固定。
            </Popover.Description>
            <div
              aria-label="最近通知"
              className="mt-3 max-h-40 overflow-y-auto rounded-md border border-lark-hairline outline-none focus-visible:ring-2 focus-visible:ring-lark-brand"
              tabIndex={0}
            >
              {Array.from({ length: 10 }, (_, index) => (
                <div
                  key={index}
                  className="border-b border-lark-hairline px-3 py-2 last:border-b-0"
                >
                  通知 {index + 1}
                </div>
              ))}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function PopoverCssVariablesDemo() {
  return (
    <Popover.Root>
      <Popover.Trigger render={<Button />}>打开较高的气泡卡片</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup className="h-80 max-h-[var(--available-height)] w-72">
            <Popover.Arrow />
            <Popover.Title>自适应高度的浮层</Popover.Title>
            <Popover.Description>
              除非视口空间不足，否则该浮层高度为 320px。
            </Popover.Description>
            <div
              aria-label="气泡卡片行"
              className="mt-3 min-h-0 flex-1 overflow-y-auto rounded-md border border-lark-hairline outline-none focus-visible:ring-2 focus-visible:ring-lark-brand"
              tabIndex={0}
            >
              {Array.from({ length: 12 }, (_, index) => (
                <div
                  key={index}
                  className="border-b border-lark-hairline px-3 py-2 last:border-b-0"
                >
                  第 {index + 1} 行
                </div>
              ))}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function PopoverWithCloseDemo() {
  return (
    <Popover.Root>
      <Popover.Trigger render={<Button />}>打开设置</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup>
            <Popover.Arrow />
            <Popover.Title>设置</Popover.Title>
            <Popover.Description>在下方配置你的偏好设置。</Popover.Description>
            <div className="mt-3">
              <Popover.Close render={<Button variant="secondary" size="sm" />}>
                关闭
              </Popover.Close>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function PopoverPositionDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Popover.Root>
        <Popover.Trigger render={<Button variant="secondary" />}>
          底部
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner side="bottom">
            <Popover.Popup>
              <Popover.Arrow />
              <Popover.Title>底部</Popover.Title>
              <Popover.Description>
                气泡卡片显示在下方（默认）。
              </Popover.Description>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>

      <Popover.Root>
        <Popover.Trigger render={<Button variant="secondary" />}>
          顶部
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner side="top">
            <Popover.Popup>
              <Popover.Arrow />
              <Popover.Title>顶部</Popover.Title>
              <Popover.Description>气泡卡片显示在上方。</Popover.Description>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>

      <Popover.Root>
        <Popover.Trigger render={<Button variant="secondary" />}>
          左侧
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner side="left">
            <Popover.Popup>
              <Popover.Arrow />
              <Popover.Title>左侧</Popover.Title>
              <Popover.Description>气泡卡片显示在左侧。</Popover.Description>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>

      <Popover.Root>
        <Popover.Trigger render={<Button variant="secondary" />}>
          右侧
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner side="right">
            <Popover.Popup>
              <Popover.Arrow />
              <Popover.Title>右侧</Popover.Title>
              <Popover.Description>气泡卡片显示在右侧。</Popover.Description>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

export function PopoverCustomContentDemo() {
  return (
    <Popover.Root>
      <Popover.Trigger render={<Button />}>用户资料</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup className="w-64">
            <Popover.Arrow />
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-lark-recessed" />
              <div>
                <Popover.Title>简·多伊</Popover.Title>
                <p className="text-sm text-lark-subtle">jane@example.com</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2 border-t border-lark-hairline pt-3">
              <Button variant="secondary" size="sm" className="flex-1">
                个人资料
              </Button>
              <Popover.Close
                render={<Button variant="ghost" size="sm" className="flex-1" />}
              >
                退出登录
              </Popover.Close>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function PopoverOpenOnHoverDemo() {
  return (
    <Popover.Root>
      <Popover.Trigger
        openOnHover
        delay={200}
        render={<Button variant="secondary" />}
      >
        悬停试试
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup>
            <Popover.Arrow />
            <Popover.Title>悬停触发</Popover.Title>
            <Popover.Description>
              该气泡卡片在悬停时打开，延迟 200
              毫秒。内部仍可包含按钮、链接等可交互内容。
            </Popover.Description>
            <div className="mt-3">
              <Popover.Close render={<Button variant="secondary" size="sm" />}>
                知道了
              </Popover.Close>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

/** 锚定到虚拟元素（而非触发器）的 Popover。 */
export function PopoverVirtualAnchorDemo() {
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const rowRefs = useRef<Map<string, HTMLTableRowElement>>(new Map());

  const rows = [
    { id: "1", name: "api-gateway", status: "运行中" },
    { id: "2", name: "auth-service", status: "运行中" },
    { id: "3", name: "worker-prod", status: "已暂停" },
  ];

  const handleEdit = (id: string) => {
    const row = rowRefs.current.get(id);
    if (row) {
      setAnchorRect(row.getBoundingClientRect());
      setSelectedRow(id);
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-lg border border-lark-hairline">
        <table className="w-full text-sm">
          <thead className="bg-lark-elevated">
            <tr>
              <th className="px-4 py-2 text-left font-medium">名称</th>
              <th className="px-4 py-2 text-left font-medium">状态</th>
              <th className="w-12 px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-lark-hairline">
            {rows.map((row) => (
              <tr
                key={row.id}
                ref={(el) => {
                  if (el) rowRefs.current.set(row.id, el);
                }}
                className={
                  selectedRow === row.id ? "bg-lark-recessed" : "bg-lark-base"
                }
              >
                <td className="px-4 py-2 font-mono">{row.name}</td>
                <td className="px-4 py-2 text-lark-subtle">{row.status}</td>
                <td className="px-4 py-2">
                  <Button
                    size="xs"
                    variant="ghost"
                    shape="square"
                    icon={DotsThree}
                    aria-label={`${row.name} 的操作`}
                    onClick={() => handleEdit(row.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Popover.Root
        open={!!selectedRow}
        onOpenChange={(open) => !open && setSelectedRow(null)}
      >
        <Popover.Portal>
          <Popover.Positioner
            side="left"
            anchor={
              anchorRect
                ? { getBoundingClientRect: () => anchorRect }
                : undefined
            }
          >
            <Popover.Popup>
              <Popover.Arrow />
              <Popover.Title>
                编辑 {rows.find((r) => r.id === selectedRow)?.name}
              </Popover.Title>
              <Popover.Description>
                气泡卡片以选中的行为锚点，而不是图标按钮。
              </Popover.Description>
              <div className="mt-3">
                <Popover.Close
                  render={<Button size="sm" variant="secondary" />}
                >
                  关闭
                </Popover.Close>
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
