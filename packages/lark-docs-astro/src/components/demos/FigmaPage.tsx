import { PencilRulerIcon } from "@phosphor-icons/react";
import { Empty, Button } from "@lark-ui/core";

export function FigmaPage() {
  return (
    <div className="p-8">
      <Empty
        icon={<PencilRulerIcon size={48} className="text-lark-subtle" />}
        title="Figma 资源即将上线"
        description="我们正在准备与所有 Lark 组件一一对应的完整 Figma 资源，敬请期待设计文件、组件库和设计 token。"
        contents={
          <Button variant="outline" disabled>
            查看 Figma 库
          </Button>
        }
      />
    </div>
  );
}
