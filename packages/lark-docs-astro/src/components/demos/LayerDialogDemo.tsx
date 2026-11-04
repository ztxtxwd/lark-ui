import { useId, useState } from "react";
import {
  Button,
  DropdownMenu,
  Input,
  LayerDialog,
  Text,
  type LarkLayerDialogSize,
  type LarkLayerDialogVerticalAlign,
} from "@lark-ui/core";

function LongContent() {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-lg border border-lark-line p-4 text-lark-subtle">
        导航与命令快捷键
      </div>
      <Text variant="secondary">
        标题栏始终可见，内容滚动后会出现分隔线，滚动遮罩提示下方还有更多内容。
      </Text>
      <div className="h-96" />
    </div>
  );
}

export function LayerDialogInformationalDemo() {
  return (
    <LayerDialog.Root>
      <LayerDialog.Trigger
        render={(props) => <Button {...props}>打开键盘快捷键</Button>}
      />
      <LayerDialog.Content>
        <LayerDialog.Title>键盘快捷键</LayerDialog.Title>
        <LayerDialog.Description>
          查看可用快捷键，无需修改任何设置。
        </LayerDialog.Description>
        <LayerDialog.Body>
          <LongContent />
        </LayerDialog.Body>
      </LayerDialog.Content>
    </LayerDialog.Root>
  );
}

export function LayerDialogActionDemo() {
  const [name, setName] = useState("生产环境 API");
  const [hostname, setHostname] = useState("api.example.com");

  return (
    <LayerDialog.Root>
      <LayerDialog.Trigger
        render={(props) => <Button {...props}>打开设置</Button>}
      />
      <LayerDialog.Content>
        <LayerDialog.Title>配置自定义主机名</LayerDialog.Title>
        <LayerDialog.Description>
          将该主机名的请求路由到你的 Worker。
        </LayerDialog.Description>
        <LayerDialog.Body>
          <div className="flex flex-col gap-5">
            <Input
              label="主机名"
              onChange={(event) => setHostname(event.target.value)}
              value={hostname}
            />
            <Input
              label="显示名称"
              onChange={(event) => setName(event.target.value)}
              value={name}
            />
          </div>
        </LayerDialog.Body>
        <LayerDialog.Actions>
          <LayerDialog.Action
            disabled={!hostname || !name}
            onClick={() => undefined}
          >
            保存主机名
          </LayerDialog.Action>
        </LayerDialog.Actions>
      </LayerDialog.Content>
    </LayerDialog.Root>
  );
}

export function LayerDialogFormDemo() {
  const formId = useId();

  return (
    <LayerDialog.Root>
      <LayerDialog.Trigger
        render={(props) => <Button {...props}>创建部署</Button>}
      />
      <LayerDialog.Content>
        <LayerDialog.Title>创建部署</LayerDialog.Title>
        <LayerDialog.Description>
          表单原生的校验与提交状态由浏览器管理。
        </LayerDialog.Description>
        <LayerDialog.Body>
          <form
            id={formId}
            className="flex flex-col gap-5"
            onSubmit={(event) => event.preventDefault()}
          >
            <Input
              label="服务名称"
              name="serviceName"
              placeholder="production-api"
              required
            />
            <Input
              label="兼容日期"
              name="compatibilityDate"
              required
              type="date"
            />
          </form>
        </LayerDialog.Body>
        <LayerDialog.Actions dismissLabel="取消">
          <LayerDialog.Action form={formId} type="submit">
            创建部署
          </LayerDialog.Action>
        </LayerDialog.Actions>
      </LayerDialog.Content>
    </LayerDialog.Root>
  );
}

const WORKERS = [
  "production-api",
  "staging-api",
  "image-resizer",
  "auth-gateway",
  "email-router",
  "analytics-ingest",
];

/** 正文中的第一个控件是无标签的搜索输入框。 */
export function LayerDialogSearchDemo() {
  const [query, setQuery] = useState("");
  const matches = WORKERS.filter((worker) =>
    worker.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <LayerDialog.Root>
      <LayerDialog.Trigger
        render={(props) => <Button {...props}>选择 Worker</Button>}
      />
      <LayerDialog.Content>
        <LayerDialog.Title>选择 Worker</LayerDialog.Title>
        <LayerDialog.Description>
          选择处理该路由请求的 Worker。
        </LayerDialog.Description>
        <LayerDialog.Body>
          <div className="flex flex-col gap-3">
            <Input
              aria-label="搜索 Worker"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索 Worker"
              type="search"
              value={query}
            />
            {matches.length > 0 ? (
              <ul className="flex flex-col divide-y divide-lark-hairline rounded-lg border border-lark-hairline">
                {matches.map((worker) => (
                  <li key={worker} className="px-3 py-2 text-lark-default">
                    {worker}
                  </li>
                ))}
              </ul>
            ) : (
              <Text variant="secondary">没有匹配“{query}”的 Worker。</Text>
            )}
          </div>
        </LayerDialog.Body>
      </LayerDialog.Content>
    </LayerDialog.Root>
  );
}

export function LayerDialogSeparatorDemo() {
  return (
    <LayerDialog.Root>
      <LayerDialog.Trigger
        render={(props) => <Button {...props}>检查部署</Button>}
      />
      <LayerDialog.Content>
        <LayerDialog.Title>部署摘要</LayerDialog.Title>
        <LayerDialog.Description>部署前请检查配置。</LayerDialog.Description>
        <LayerDialog.Body>
          <Text variant="secondary">production-api 将部署到全球网络。</Text>
          <LayerDialog.Separator />
          <Text variant="secondary">本次部署使用兼容日期 2026-10-26。</Text>
        </LayerDialog.Body>
        <LayerDialog.Actions>
          <LayerDialog.Action>部署</LayerDialog.Action>
        </LayerDialog.Actions>
      </LayerDialog.Content>
    </LayerDialog.Root>
  );
}

export function LayerDialogSplitActionDemo() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <LayerDialog.Root>
        <LayerDialog.Trigger
          render={(props) => <Button {...props}>编辑部署</Button>}
        />
        <LayerDialog.Content>
          <LayerDialog.Title>保存部署</LayerDialog.Title>
          <LayerDialog.Description>
            立即部署这些更改，或把它们保存为草稿。
          </LayerDialog.Description>
          <LayerDialog.Body>
            <Text variant="secondary">
              另一种保存结果与主操作相关，因此它位于分裂按钮的菜单中，而不是作为无关的底部按钮。
            </Text>
          </LayerDialog.Body>
          <LayerDialog.Actions>
            <LayerDialog.Action
              menu={[
                <DropdownMenu.Item key="draft">保存为草稿</DropdownMenu.Item>,
              ]}
              menuLabel="保存选项"
            >
              保存并部署
            </LayerDialog.Action>
          </LayerDialog.Actions>
        </LayerDialog.Content>
      </LayerDialog.Root>

      <LayerDialog.Alert>
        <LayerDialog.Trigger
          render={(props) => (
            <Button {...props} variant="secondary">
              删除部署
            </Button>
          )}
        />
        <LayerDialog.Content>
          <LayerDialog.Title>删除部署</LayerDialog.Title>
          <LayerDialog.Description>
            这将永久删除该部署，且无法撤销。
          </LayerDialog.Description>
          <LayerDialog.Body>
            <Text variant="secondary">
              危险操作的分裂按钮让操作的各个部分（包括菜单触发器）保持视觉一致。
            </Text>
          </LayerDialog.Body>
          <LayerDialog.Actions>
            <LayerDialog.Action
              menu={[
                <DropdownMenu.Item key="delete-with-tokens">
                  删除并吊销令牌
                </DropdownMenu.Item>,
              ]}
              menuLabel="删除选项"
              variant="destructive"
            >
              删除部署
            </LayerDialog.Action>
          </LayerDialog.Actions>
        </LayerDialog.Content>
      </LayerDialog.Alert>
    </div>
  );
}

export function LayerDialogCancelDemo() {
  const [email, setEmail] = useState("alex@example.com");
  const [name, setName] = useState("亚历克斯·摩根");

  return (
    <LayerDialog.Root>
      <LayerDialog.Trigger
        render={(props) => <Button {...props}>编辑资料</Button>}
      />
      <LayerDialog.Content>
        <LayerDialog.Title>编辑资料</LayerDialog.Title>
        <LayerDialog.Description>
          更新向团队成员展示的个人资料。确认后更改才会保存。
        </LayerDialog.Description>
        <LayerDialog.Body>
          <div className="flex flex-col gap-5">
            <Input
              label="显示名称"
              onChange={(event) => setName(event.target.value)}
              value={name}
            />
            <Input
              label="邮箱地址"
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              value={email}
            />
          </div>
        </LayerDialog.Body>
        <LayerDialog.Actions dismissLabel="取消">
          <LayerDialog.Action
            disabled={!email || !name}
            onClick={() => undefined}
          >
            保存更改
          </LayerDialog.Action>
        </LayerDialog.Actions>
      </LayerDialog.Content>
    </LayerDialog.Root>
  );
}

export function LayerDialogAlertDemo() {
  const workerName = "example-worker";
  const [confirmation, setConfirmation] = useState("");

  return (
    <LayerDialog.Alert>
      <LayerDialog.Trigger
        render={(props) => (
          <Button variant="secondary-destructive" {...props}>
            删除 Worker
          </Button>
        )}
      />
      <LayerDialog.Content>
        <LayerDialog.Title>删除 Worker</LayerDialog.Title>
        <LayerDialog.Description>
          删除{" "}
          <strong className="font-medium text-lark-default">
            {workerName}
          </strong>{" "}
          是永久性操作。
        </LayerDialog.Description>
        <LayerDialog.Body>
          <div className="flex flex-col gap-5">
            <Text variant="secondary">
              这将删除该 Worker、部署和配置。如果该 Worker 使用了
              Queues，会先移除这些连接。Queues、D1
              数据库和消息仍保留在你的账户中。
            </Text>
            <Input
              label={
                <>
                  输入{" "}
                  <strong className="font-medium text-lark-default">
                    {workerName}
                  </strong>{" "}
                  以确认
                </>
              }
              onChange={(event) => setConfirmation(event.target.value)}
              placeholder={workerName}
              value={confirmation}
            />
          </div>
        </LayerDialog.Body>
        <LayerDialog.Actions>
          <LayerDialog.Action
            disabled={confirmation !== workerName}
            onClick={() => undefined}
            variant="destructive"
          >
            删除 Worker
          </LayerDialog.Action>
        </LayerDialog.Actions>
      </LayerDialog.Content>
    </LayerDialog.Alert>
  );
}

export function LayerDialogPendingDemo() {
  const [pending, setPending] = useState(false);
  return (
    <LayerDialog.Root dismissDisabled={pending}>
      <LayerDialog.Trigger
        render={(props) => <Button {...props}>保存设置</Button>}
      />
      <LayerDialog.Content>
        <LayerDialog.Title>保存设置</LayerDialog.Title>
        <LayerDialog.Description>
          保存过程中，关闭按钮、Esc 键、背景点击和移动端滑动关闭会被一同阻止。
        </LayerDialog.Description>
        <LayerDialog.Body>
          <Text variant="secondary">
            通过代码关闭仍然可用，因此保存成功后可以通过 `actionsRef` 或受控的
            `open` 属性关闭对话框。
          </Text>
        </LayerDialog.Body>
        <LayerDialog.Actions>
          <LayerDialog.Action
            loading={pending}
            onClick={() => {
              setPending(true);
              window.setTimeout(() => setPending(false), 1500);
            }}
          >
            保存更改
          </LayerDialog.Action>
        </LayerDialog.Actions>
      </LayerDialog.Content>
    </LayerDialog.Root>
  );
}

export function LayerDialogCleanupDemo() {
  const [open, setOpen] = useState(false);
  const [cleanupCount, setCleanupCount] = useState(0);
  return (
    <LayerDialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) setCleanupCount((count) => count + 1);
        setOpen(nextOpen);
      }}
    >
      <LayerDialog.Trigger
        render={(props) => <Button {...props}>打开草稿</Button>}
      />
      <LayerDialog.Content>
        <LayerDialog.Title>草稿设置</LayerDialog.Title>
        <LayerDialog.Body>
          <Text variant="secondary">清理已执行 {cleanupCount} 次。</Text>
        </LayerDialog.Body>
      </LayerDialog.Content>
    </LayerDialog.Root>
  );
}

export function LayerDialogNestedDemo() {
  return (
    <LayerDialog.Root>
      <LayerDialog.Trigger
        render={(props) => <Button {...props}>编辑部署</Button>}
      />
      <LayerDialog.Content>
        <LayerDialog.Title>编辑部署</LayerDialog.Title>
        <LayerDialog.Description>
          保存前请检查部署设置。
        </LayerDialog.Description>
        <LayerDialog.Body>
          <div className="flex flex-col gap-4">
            <Text variant="secondary">
              在此正文中打开第二个对话框时，第一个对话框会保留在其下方，并在关闭时恢复焦点。
            </Text>
            <LayerDialog.Alert>
              <LayerDialog.Trigger
                render={(props) => (
                  <Button variant="secondary-destructive" {...props}>
                    放弃更改
                  </Button>
                )}
              />
              <LayerDialog.Content size="sm">
                <LayerDialog.Title>放弃未保存的更改？</LayerDialog.Title>
                <LayerDialog.Description>
                  你对部署的修改将永久丢失。
                </LayerDialog.Description>
                <LayerDialog.Body>
                  <Text variant="secondary">
                    这个嵌套告警会独立渲染到 portal，关闭后应返回编辑对话框。
                  </Text>
                </LayerDialog.Body>
                <LayerDialog.Actions>
                  <LayerDialog.Action variant="destructive">
                    放弃更改
                  </LayerDialog.Action>
                </LayerDialog.Actions>
              </LayerDialog.Content>
            </LayerDialog.Alert>
          </div>
        </LayerDialog.Body>
        <LayerDialog.Actions>
          <LayerDialog.Action>保存更改</LayerDialog.Action>
        </LayerDialog.Actions>
      </LayerDialog.Content>
    </LayerDialog.Root>
  );
}

export function LayerDialogTopAlignDemo() {
  return (
    <LayerDialog.Root>
      <LayerDialog.Trigger
        render={(props) => <Button {...props}>打开顶部对齐的对话框</Button>}
      />
      <LayerDialog.Content verticalAlign="top">
        <LayerDialog.Title>顶部对齐的对话框</LayerDialog.Title>
        <LayerDialog.Body>
          <Text variant="secondary">移动端对话框仍为底部抽屉。</Text>
        </LayerDialog.Body>
      </LayerDialog.Content>
    </LayerDialog.Root>
  );
}

export function LayerDialogMaxHeightDemo() {
  const [verticalAlign, setVerticalAlign] =
    useState<LarkLayerDialogVerticalAlign>("center");
  const [open, setOpen] = useState(false);

  const openAt = (align: LarkLayerDialogVerticalAlign) => {
    setVerticalAlign(align);
    setOpen(true);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => openAt("center")}>居中，长内容</Button>
        <Button onClick={() => openAt("top")}>顶部对齐，长内容</Button>
      </div>
      <LayerDialog.Root open={open} onOpenChange={setOpen}>
        <LayerDialog.Content verticalAlign={verticalAlign}>
          <LayerDialog.Title>审计日志</LayerDialog.Title>
          <LayerDialog.Description>
            对话框会随内容增高，直到达到视口上限，此后仅正文部分滚动。
          </LayerDialog.Description>
          <LayerDialog.Body>
            <ol className="flex flex-col gap-2">
              {Array.from({ length: 40 }, (_, index) => (
                <li
                  key={index}
                  className="rounded-lg border border-lark-line px-3 py-2 text-lark-subtle"
                >
                  第 {index + 1} 条
                </li>
              ))}
            </ol>
          </LayerDialog.Body>
          <LayerDialog.Actions>
            <LayerDialog.Action>导出日志</LayerDialog.Action>
          </LayerDialog.Actions>
        </LayerDialog.Content>
      </LayerDialog.Root>
    </>
  );
}

export function LayerDialogSizeDemo() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<LarkLayerDialogSize>("base");

  const openAtSize = (nextSize: LarkLayerDialogSize) => {
    setSize(nextSize);
    setOpen(true);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => openAtSize("sm")}>小</Button>
        <Button onClick={() => openAtSize("base")}>默认</Button>
        <Button onClick={() => openAtSize("lg")}>大</Button>
        <Button onClick={() => openAtSize("xl")}>特大</Button>
      </div>
      <LayerDialog.Root open={open} onOpenChange={setOpen}>
        <LayerDialog.Content size={size}>
          <LayerDialog.Title>检查部署配置</LayerDialog.Title>
          <LayerDialog.Description>
            创建本次部署前，请确认服务信息和路由配置。
          </LayerDialog.Description>
          <LayerDialog.Body>
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="服务名称" defaultValue="production-api" />
              <Input label="环境" defaultValue="生产环境" />
              <Input label="主机名" defaultValue="api.example.com" />
              <Input label="兼容日期" defaultValue="2026-09-09" />
            </div>
          </LayerDialog.Body>
          <LayerDialog.Actions>
            <LayerDialog.Action>创建部署</LayerDialog.Action>
          </LayerDialog.Actions>
        </LayerDialog.Content>
      </LayerDialog.Root>
    </>
  );
}
