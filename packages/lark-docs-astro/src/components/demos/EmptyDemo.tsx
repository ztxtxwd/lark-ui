import { Empty, Button } from "@lark-ui/core";
import {
  Database,
  FolderOpen,
  CloudSlash,
  PackageIcon,
  CodeIcon,
  GlobeIcon,
} from "@phosphor-icons/react";

export function EmptyDemo() {
  return (
    <Empty
      icon={<PackageIcon size={48} />}
      title="未找到任何包"
      description="安装你的第一个包，立即开始使用。"
      commandLine="npm install @lark-ui/core"
      contents={
        <div className="flex items-center gap-2">
          <Button icon={<CodeIcon />}>查看示例</Button>
          <Button icon={<GlobeIcon />} variant="primary">
            查看文档
          </Button>
        </div>
      }
    />
  );
}

export function EmptySizesDemo() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-2 text-sm text-lark-subtle">小</p>
        <Empty
          size="sm"
          icon={<Database size={32} className="text-lark-inactive" />}
          title="暂无数据"
          description="没有可显示的数据。"
        />
      </div>
      <div>
        <p className="mb-2 text-sm text-lark-subtle">基础</p>
        <Empty
          size="base"
          icon={<Database size={48} className="text-lark-inactive" />}
          title="暂无数据"
          description="没有可显示的数据。"
        />
      </div>
      <div>
        <p className="mb-2 text-sm text-lark-subtle">大</p>
        <Empty
          size="lg"
          icon={<Database size={64} className="text-lark-inactive" />}
          title="暂无数据"
          description="没有可显示的数据。"
        />
      </div>
    </div>
  );
}

export function EmptyWithCommandDemo() {
  return (
    <Empty
      icon={<FolderOpen size={48} className="text-lark-inactive" />}
      title="未找到任何项目"
      description="使用下面的命令创建你的第一个项目，立即开始使用。"
      commandLine="npm create lark-project"
    />
  );
}

export function EmptyWithActionsDemo() {
  return (
    <Empty
      icon={<CloudSlash size={48} className="text-lark-inactive" />}
      title="无法连接"
      description="无法连接到服务器，请检查你的网络连接后重试。"
      contents={
        <div className="flex gap-2">
          <Button variant="primary">重试</Button>
          <Button variant="secondary">返回</Button>
        </div>
      }
    />
  );
}

export function EmptyMinimalDemo() {
  return <Empty title="暂无内容" />;
}

export function EmptyBasicDemo() {
  return (
    <Empty
      title="未找到结果"
      description="试试调整搜索或筛选条件，以找到你想要的内容。"
    />
  );
}
