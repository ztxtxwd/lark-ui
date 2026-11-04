import { forwardRef, useState } from "react";
import { Flow } from "@lark-ui/core";
import { CaretDownIcon } from "@phosphor-icons/react";

const ExpandableNode = forwardRef<
  HTMLLIElement,
  { title: string; children: React.ReactNode }
>(function ExpandableNode({ title, children, ...props }, ref) {
  const [open, setOpen] = useState(false);
  return (
    <li
      ref={ref}
      {...props}
      className="overflow-hidden rounded-lg bg-lark-base shadow ring ring-lark-hairline"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm font-medium text-lark-default"
      >
        {title}
        <CaretDownIcon
          className={`size-4 text-lark-subtle transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-lark-hairline px-3 py-2 text-sm text-lark-subtle">
          {children}
        </div>
      )}
    </li>
  );
});

/** 带顺序节点的基础流程图（Flow） */
export function FlowBasicDemo() {
  return (
    <Flow>
      <Flow.Node>步骤 1</Flow.Node>
      <Flow.Node>步骤 2</Flow.Node>
      <Flow.Node>步骤 3</Flow.Node>
    </Flow>
  );
}

/** 带顺序节点的纵向流程图 */
export function FlowVerticalDemo() {
  return (
    <Flow orientation="vertical">
      <Flow.Node>步骤 1</Flow.Node>
      <Flow.Node>步骤 2</Flow.Node>
      <Flow.Node>步骤 3</Flow.Node>
    </Flow>
  );
}

/** 带并行分支的纵向流程图 */
export function FlowVerticalParallelDemo() {
  return (
    <Flow orientation="vertical" align="center">
      <Flow.Node>开始</Flow.Node>
      <Flow.Parallel>
        <Flow.Node>分支 A</Flow.Node>
        <Flow.Node>分支 B</Flow.Node>
        <Flow.Node>分支 C</Flow.Node>
      </Flow.Parallel>
      <Flow.Node>结束</Flow.Node>
    </Flow>
  );
}

/** 带并行分支的流程图 */
export function FlowParallelDemo() {
  return (
    <Flow>
      <Flow.Node>开始</Flow.Node>
      <Flow.Parallel>
        <Flow.List>
          <Flow.Node>分支 A1</Flow.Node>
          <Flow.Node>分支 A2</Flow.Node>
        </Flow.List>
        <Flow.Node>分支 B</Flow.Node>
        <Flow.Node>分支 C</Flow.Node>
      </Flow.Parallel>
      <Flow.Node>结束</Flow.Node>
    </Flow>
  );
}

/** 使用 render 属性自定义节点样式的流程图 */
export function FlowCustomContentDemo() {
  return (
    <Flow>
      <Flow.Node
        render={<li className="size-4 rounded-full bg-lark-hairline" />}
      />
      <Flow.Node
        render={
          <li className="rounded-lg bg-lark-contrast px-3 py-2 font-medium text-lark-inverse">
            my-worker
          </li>
        }
      />
    </Flow>
  );
}

/** 复杂流程图示例 */
export function FlowComplexDemo() {
  return (
    <Flow>
      <Flow.Parallel>
        <Flow.Node>HTTP 触发器</Flow.Node>
        <Flow.Node>定时触发器</Flow.Node>
      </Flow.Parallel>
      <Flow.Node>处理请求</Flow.Node>
      <Flow.Parallel>
        <Flow.Node>记录分析数据</Flow.Node>
        <Flow.Node>更新缓存</Flow.Node>
        <Flow.Node>发送通知</Flow.Node>
      </Flow.Parallel>
      <Flow.Node>完成</Flow.Node>
    </Flow>
  );
}

/** 带自定义锚点的流程图 */
export function FlowAnchorDemo() {
  return (
    <Flow>
      <Flow.Node>负载均衡器</Flow.Node>
      <Flow.Node
        render={
          <li className="rounded-lg bg-lark-overlay shadow-none ring ring-lark-hairline">
            <Flow.Anchor
              type="end"
              render={
                <div className="flex h-10 items-center px-2.5 text-lark-subtle">
                  my-worker
                </div>
              }
            />
            <Flow.Anchor
              type="start"
              render={
                <div className="m-1.5 mt-0 rounded bg-lark-base px-2 py-1.5 shadow ring ring-lark-hairline">
                  绑定
                  <span className="ml-3 w-5 text-lark-subtle">2</span>
                </div>
              }
            />
          </li>
        }
      />
      <Flow.Parallel>
        <Flow.Node>DATABASE</Flow.Node>
        <Flow.Node>OTHER_SERVICE</Flow.Node>
      </Flow.Parallel>
    </Flow>
  );
}

/** 节点垂直居中的流程图 */
export function FlowCenteredDemo() {
  return (
    <Flow align="center">
      <Flow.Node
        render={<li className="size-4 rounded-full bg-lark-hairline" />}
      />
      <Flow.Node>my-worker</Flow.Node>
      <Flow.Node
        render={
          <li className="rounded-md bg-lark-base px-3 py-6 shadow ring ring-lark-hairline">
            更高的节点
          </li>
        }
      />
    </Flow>
  );
}

/** 演示平移操作的大型流程图 */
export function FlowPanningDemo() {
  return (
    <Flow className="rounded-lg border border-lark-hairline">
      <Flow.Node>开始</Flow.Node>
      <Flow.Node>身份验证</Flow.Node>
      <Flow.Node>校验</Flow.Node>
      <Flow.Node>转换</Flow.Node>
      <Flow.Node>处理</Flow.Node>
      <Flow.Node>存储</Flow.Node>
      <Flow.Node>通知</Flow.Node>
      <Flow.Node>记录日志</Flow.Node>
      <Flow.Node>完成</Flow.Node>
      <Flow.Node>结束</Flow.Node>
    </Flow>
  );
}

/** 带禁用节点的流程图 */
export function FlowDisabledDemo() {
  return (
    <Flow>
      <Flow.Node>请求</Flow.Node>
      <Flow.Parallel>
        <Flow.Node>主处理器</Flow.Node>
        <Flow.Node disabled>备用处理器（已禁用）</Flow.Node>
      </Flow.Parallel>
      <Flow.Node>响应</Flow.Node>
    </Flow>
  );
}

/** 并行节点右对齐的流程图 */
export function FlowParallelAlignEndDemo() {
  return (
    <Flow>
      <Flow.Node>开始</Flow.Node>
      <Flow.Parallel align="end">
        <Flow.Node>短</Flow.Node>
        <Flow.Node>中等长度</Flow.Node>
        <Flow.Node>超长节点名称</Flow.Node>
      </Flow.Parallel>
      <Flow.Node>结束</Flow.Node>
    </Flow>
  );
}

/** 并行分支中包含嵌套节点序列的流程图 */
export function FlowParallelNestedListDemo() {
  return (
    <Flow>
      <Flow.Parallel>
        <Flow.List>
          <Flow.Node>客户端用户</Flow.Node>
          <Flow.Node>工程团队访问</Flow.Node>
        </Flow.List>
        <Flow.List>
          <Flow.Parallel>
            <Flow.Node>所有已认证用户</Flow.Node>
            <Flow.Node>客户端用户</Flow.Node>
            <Flow.Node>站点用户</Flow.Node>
          </Flow.Parallel>
          <Flow.Node>承包商访问</Flow.Node>
        </Flow.List>
      </Flow.Parallel>
      <Flow.Node>目标</Flow.Node>
    </Flow>
  );
}

/** 两个并行分组前后相接的流程图 */
export function FlowSequentialParallelDemo() {
  return (
    <Flow>
      <Flow.Node>传入请求</Flow.Node>
      <Flow.Parallel>
        <Flow.Node>校验请求头</Flow.Node>
        <Flow.Node>检查认证令牌</Flow.Node>
      </Flow.Parallel>
      <Flow.Parallel>
        <Flow.Node>写入数据库</Flow.Node>
        <Flow.Node>更新缓存</Flow.Node>
      </Flow.Parallel>
      <Flow.Node>返回响应</Flow.Node>
    </Flow>
  );
}

/** 可动态添加和移除节点的流程图 */
export function FlowDynamicNodeDemo() {
  const [showMiddle, setShowMiddle] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        type="button"
        onClick={() => setShowMiddle((v) => !v)}
        className="rounded-md bg-lark-elevated px-3 py-1.5 text-sm font-medium text-lark-default ring ring-lark-line transition-colors hover:bg-lark-base"
      >
        {showMiddle ? "移除中间节点" : "添加中间节点"}
      </button>
      <Flow>
        <Flow.Node>开始</Flow.Node>
        {showMiddle && <Flow.Node>中间</Flow.Node>}
        <Flow.Node>结束</Flow.Node>
      </Flow>
    </div>
  );
}

/** 并行分组中带可展开节点的流程图 */
export function FlowExpandableDemo() {
  return (
    <Flow>
      <Flow.Node>传入请求</Flow.Node>
      <Flow.Parallel>
        <Flow.Node
          render={
            <ExpandableNode title="认证服务">
              <p>校验 JWT 令牌和会话 Cookie。</p>
              <p className="mt-1">通过 OAuth 2.0 连接身份提供商。</p>
            </ExpandableNode>
          }
        />
        <Flow.Node
          render={
            <ExpandableNode title="速率限制器">
              <p>按 IP 限制请求频率。</p>
              <p className="mt-1">滑动窗口：100 次/分钟。</p>
            </ExpandableNode>
          }
        />
      </Flow.Parallel>
      <Flow.Node>路由到源站</Flow.Node>
    </Flow>
  );
}
