import { LayerCard, Button } from "@lark-ui/core";
import { ArrowRightIcon } from "@phosphor-icons/react";

export function LayerCardDemo() {
  return (
    <LayerCard>
      <LayerCard.Secondary className="flex items-center justify-between">
        <div>后续步骤</div>
        <Button
          variant="ghost"
          size="sm"
          shape="square"
          aria-label="前往后续步骤"
        >
          <ArrowRightIcon size={16} />
        </Button>
      </LayerCard.Secondary>

      <LayerCard.Primary>开始使用 Lark</LayerCard.Primary>
    </LayerCard>
  );
}

export function LayerCardBasicDemo() {
  return (
    <LayerCard className="w-[250px]">
      <LayerCard.Secondary>快速上手</LayerCard.Secondary>
      <LayerCard.Primary>
        <p className="text-sm text-lark-subtle">面向新用户的快速上手指南</p>
      </LayerCard.Primary>
    </LayerCard>
  );
}

export function LayerCardSurfaceDemo() {
  return (
    <LayerCard className="w-[250px] p-4">
      <p className="text-sm text-lark-subtle">面向新用户的快速上手指南</p>
    </LayerCard>
  );
}

/** 将 `data-testid` 等 HTML 属性传给 `Primary` 和 `Secondary`，便于测试。 */
export function LayerCardTestIdDemo() {
  return (
    <LayerCard className="w-[250px]">
      <LayerCard.Secondary data-testid="card-header">
        快速上手
      </LayerCard.Secondary>
      <LayerCard.Primary data-testid="card-body">
        <p className="text-sm text-lark-subtle">面向新用户的快速上手指南</p>
      </LayerCard.Primary>
    </LayerCard>
  );
}

export function LayerCardMultipleDemo() {
  return (
    <div className="flex gap-4">
      <LayerCard className="w-[200px]">
        <LayerCard.Secondary>组件</LayerCard.Secondary>
        <LayerCard.Primary>
          <p className="text-sm">浏览所有组件</p>
        </LayerCard.Primary>
      </LayerCard>
      <LayerCard className="w-[200px]">
        <LayerCard.Secondary>示例</LayerCard.Secondary>
        <LayerCard.Primary>
          <p className="text-sm">查看代码示例</p>
        </LayerCard.Primary>
      </LayerCard>
    </div>
  );
}
