import { useState } from "react";
import { Dialog, Button, Select, Combobox, DropdownMenu } from "@lark-ui/core";
import type { DialogProps } from "@lark-ui/core";
import { Warning, X } from "@phosphor-icons/react";

export function DialogBasicDemo() {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={(p) => <Button {...p}>点击我</Button>} />
      <Dialog className="p-8">
        <div className="mb-4 flex items-start justify-between gap-4">
          <Dialog.Title className="text-2xl font-semibold">
            模态框标题
          </Dialog.Title>
          <Dialog.Close
            aria-label="关闭"
            render={(props) => (
              <Button
                {...props}
                variant="secondary"
                shape="square"
                icon={<X />}
                aria-label="关闭"
              />
            )}
          />
        </div>
        <Dialog.Description className="text-lark-subtle">
          这是一段示例正文，用于展示对话框中的文字排版效果。
        </Dialog.Description>
      </Dialog>
    </Dialog.Root>
  );
}

export function DialogWithActionsDemo() {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={(p) => <Button {...p}>删除</Button>} />
      <Dialog className="p-8">
        <div className="mb-4 flex items-start justify-between gap-4">
          <Dialog.Title className="text-2xl font-semibold">
            模态框标题
          </Dialog.Title>
          <Dialog.Close
            aria-label="关闭"
            render={(props) => (
              <Button
                {...props}
                variant="secondary"
                shape="square"
                icon={<X />}
                aria-label="关闭"
              />
            )}
          />
        </div>
        <Dialog.Description className="text-lark-subtle">
          这是一段示例正文，用于展示对话框中的文字排版效果。
        </Dialog.Description>
        <div className="mt-8 flex justify-end gap-2">
          <Dialog.Close
            render={(props) => (
              <Button variant="secondary" {...props}>
                取消
              </Button>
            )}
          />
          <Dialog.Close
            render={(props) => (
              <Button variant="destructive" {...props}>
                删除
              </Button>
            )}
          />
        </div>
      </Dialog>
    </Dialog.Root>
  );
}

/**
 * 使用方提供最大宽度的对话框，内容本身较宽。
 * 在桌面端面板宽度应始终不超过 max-w-lg。
 */
export function DialogMaxWidthDemo() {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={(p) => <Button {...p}>打开限宽对话框</Button>} />
      <Dialog className="max-w-lg p-8">
        <div className="mb-4 flex items-start justify-between gap-4">
          <Dialog.Title className="text-2xl font-semibold">
            覆盖最大宽度
          </Dialog.Title>
          <Dialog.Close
            aria-label="关闭"
            render={(props) => (
              <Button
                {...props}
                variant="secondary"
                shape="square"
                icon={<X />}
                aria-label="关闭"
              />
            )}
          />
        </div>
        <Dialog.Description className="text-lark-subtle">
          此对话框使用 <code>className="max-w-lg"</code>，桌面端宽度应保持在
          512px 左右。
        </Dialog.Description>
        <div className="mt-4 truncate rounded-md border border-lark-line bg-lark-recessed p-3 font-mono text-sm">
          abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789
        </div>
      </Dialog>
    </Dialog.Root>
  );
}

export function DialogConfirmationDemo() {
  return (
    <Dialog.Root disablePointerDismissal>
      <Dialog.Trigger
        render={(p) => (
          <Button {...p} variant="destructive">
            删除项目
          </Button>
        )}
      />
      <Dialog className="p-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lark-danger/20">
            <Warning size={20} className="text-lark-danger" />
          </div>
          <Dialog.Title className="text-xl font-semibold">
            删除项目？
          </Dialog.Title>
        </div>
        <Dialog.Description className="text-lark-subtle">
          此操作无法撤销，将永久删除该项目及其所有关联数据。
        </Dialog.Description>
        <div className="mt-8 flex justify-end gap-2">
          <Dialog.Close
            render={(props) => (
              <Button variant="secondary" {...props}>
                取消
              </Button>
            )}
          />
          <Dialog.Close
            render={(props) => (
              <Button variant="destructive" {...props}>
                删除
              </Button>
            )}
          />
        </div>
      </Dialog>
    </Dialog.Root>
  );
}

/**
 * 用于破坏性操作的警示对话框，使用 role="alertdialog"。
 * 这为确认流程提供了正确的无障碍语义。
 */
export function DialogAlertDemo() {
  return (
    <Dialog.Root role="alertdialog">
      <Dialog.Trigger
        render={(p) => (
          <Button {...p} variant="destructive">
            删除账户
          </Button>
        )}
      />
      <Dialog className="p-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lark-danger/20">
            <Warning size={20} className="text-lark-danger" weight="fill" />
          </div>
          <Dialog.Title className="text-xl font-semibold">
            删除账户？
          </Dialog.Title>
        </div>
        <Dialog.Description className="text-lark-subtle">
          你的所有数据将从我们的服务器上永久删除。确定要继续吗？
        </Dialog.Description>
        <div className="mt-8 flex justify-end gap-2">
          <Dialog.Close
            render={(props) => (
              <Button variant="secondary" {...props}>
                取消
              </Button>
            )}
          />
          <Dialog.Close
            render={(props) => (
              <Button variant="destructive" {...props}>
                删除账户
              </Button>
            )}
          />
        </div>
      </Dialog>
    </Dialog.Root>
  );
}

const regions = [
  { value: "us-east", label: "美国东部" },
  { value: "us-west", label: "美国西部" },
  { value: "eu-west", label: "欧洲西部" },
  { value: "ap-south", label: "亚太南部" },
];

export function DialogWithSelectDemo() {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={(p) => <Button {...p}>打开表单</Button>} />
      <Dialog className="p-8">
        <div className="mb-4 flex items-start justify-between gap-4">
          <Dialog.Title className="text-2xl font-semibold">
            创建资源
          </Dialog.Title>
          <Dialog.Close
            aria-label="关闭"
            render={(props) => (
              <Button
                {...props}
                variant="secondary"
                shape="square"
                icon={<X />}
                aria-label="关闭"
              />
            )}
          />
        </div>
        <Dialog.Description className="mb-4 text-lark-subtle">
          为你的新资源选择一个区域。
        </Dialog.Description>
        <Select
          className="w-full"
          placeholder="选择区域…"
          renderValue={(v) => regions.find((r) => r.value === v)?.label}
        >
          {regions.map((region) => (
            <Select.Option key={region.value} value={region.value}>
              {region.label}
            </Select.Option>
          ))}
        </Select>
        <div className="mt-8 flex justify-end gap-2">
          <Dialog.Close
            render={(props) => (
              <Button variant="secondary" {...props}>
                取消
              </Button>
            )}
          />
          <Button variant="primary">创建</Button>
        </div>
      </Dialog>
    </Dialog.Root>
  );
}

export function DialogWithComboboxDemo() {
  const [value, setValue] = useState<{ value: string; label: string } | null>(
    null,
  );

  return (
    <Dialog.Root>
      <Dialog.Trigger render={(p) => <Button {...p}>打开表单</Button>} />
      <Dialog className="p-8">
        <div className="mb-4 flex items-start justify-between gap-4">
          <Dialog.Title className="text-2xl font-semibold">
            创建资源
          </Dialog.Title>
          <Dialog.Close
            aria-label="关闭"
            render={(props) => (
              <Button
                {...props}
                variant="secondary"
                shape="square"
                icon={<X />}
                aria-label="关闭"
              />
            )}
          />
        </div>
        <Dialog.Description className="mb-4 text-lark-subtle">
          搜索并为你的新资源选择一个区域。
        </Dialog.Description>
        <Combobox value={value} onValueChange={setValue} items={regions}>
          <Combobox.TriggerInput className="w-full" placeholder="搜索区域…" />
          <Combobox.Content>
            <Combobox.Empty>未找到区域</Combobox.Empty>
            <Combobox.List>
              {(item: { value: string; label: string }) => (
                <Combobox.Item key={item.value} value={item}>
                  {item.label}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Content>
        </Combobox>
        <div className="mt-8 flex justify-end gap-2">
          <Dialog.Close
            render={(props) => (
              <Button variant="secondary" {...props}>
                取消
              </Button>
            )}
          />
          <Button variant="primary">创建</Button>
        </div>
      </Dialog>
    </Dialog.Root>
  );
}

export function DialogWithDropdownDemo() {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={(p) => <Button {...p}>打开表单</Button>} />
      <Dialog className="p-8">
        <div className="mb-4 flex items-start justify-between gap-4">
          <Dialog.Title className="text-2xl font-semibold">
            资源操作
          </Dialog.Title>
          <Dialog.Close
            aria-label="关闭"
            render={(props) => (
              <Button
                {...props}
                variant="secondary"
                shape="square"
                icon={<X />}
                aria-label="关闭"
              />
            )}
          />
        </div>
        <Dialog.Description className="mb-4 text-lark-subtle">
          为选中的资源选择一项操作。
        </Dialog.Description>
        <DropdownMenu>
          <DropdownMenu.Trigger render={<Button>操作</Button>} />
          <DropdownMenu.Content>
            <DropdownMenu.Item>编辑</DropdownMenu.Item>
            <DropdownMenu.Item>创建副本</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item variant="danger">删除</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
        <div className="mt-8 flex justify-end">
          <Dialog.Close
            render={(props) => (
              <Button variant="secondary" {...props}>
                关闭
              </Button>
            )}
          />
        </div>
      </Dialog>
    </Dialog.Root>
  );
}

/**
 * 演示每种对话框尺寸都会保持固定宽度，不受内容影响。
 * 每个对话框都包含一张宽表格，之前会导致对话框被拉伸到超出预期尺寸。
 */
export function DialogSizesDemo() {
  const sizes: {
    size: NonNullable<DialogProps["size"]>;
    label: string;
    width: string;
  }[] = [
    { size: "sm", label: "小", width: "288px" },
    { size: "base", label: "基础", width: "384px" },
    { size: "lg", label: "大", width: "512px" },
    { size: "xl", label: "特大", width: "768px" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map(({ size, label, width }) => (
        <Dialog.Root key={size}>
          <Dialog.Trigger
            render={(p) => (
              <Button variant="secondary" {...p}>
                {label} ({width})
              </Button>
            )}
          />
          <Dialog size={size} className="p-8">
            <div className="mb-4 flex items-start justify-between gap-4">
              <Dialog.Title className="text-2xl font-semibold">
                {label} 对话框
              </Dialog.Title>
              <Dialog.Close
                aria-label="关闭"
                render={(props) => (
                  <Button
                    {...props}
                    variant="secondary"
                    shape="square"
                    icon={<X />}
                    aria-label="关闭"
                  />
                )}
              />
            </div>
            <Dialog.Description className="text-lark-subtle">
              此 <code>size="{size}"</code> 对话框宽度应始终保持 {width}。
            </Dialog.Description>
            <div className="mt-4 overflow-auto rounded-md border border-lark-line">
              <table className="w-max text-sm">
                <thead className="bg-lark-elevated text-left">
                  <tr>
                    <th className="px-3 py-2">资源</th>
                    <th className="px-3 py-2">区域</th>
                    <th className="px-3 py-2">状态</th>
                    <th className="px-3 py-2">延迟</th>
                    <th className="px-3 py-2">请求数</th>
                    <th className="px-3 py-2">最后部署时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lark-hairline">
                  <tr>
                    <td className="px-3 py-2">api-gateway-prod</td>
                    <td className="px-3 py-2">us-east-1</td>
                    <td className="px-3 py-2 text-lark-success">健康</td>
                    <td className="px-3 py-2">12ms</td>
                    <td className="px-3 py-2">1,234,567</td>
                    <td className="px-3 py-2">2026-06-23</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">worker-analytics</td>
                    <td className="px-3 py-2">eu-west-1</td>
                    <td className="px-3 py-2 text-lark-warning">降级</td>
                    <td className="px-3 py-2">89ms</td>
                    <td className="px-3 py-2">456,789</td>
                    <td className="px-3 py-2">2026-06-22</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Dialog.Close
                render={(props) => (
                  <Button variant="secondary" {...props}>
                    关闭
                  </Button>
                )}
              />
            </div>
          </Dialog>
        </Dialog.Root>
      ))}
    </div>
  );
}
