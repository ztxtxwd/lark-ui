import { Tooltip, TooltipProvider, Button } from "@lark-ui/core";
import { Info, PlusIcon, TranslateIcon } from "@phosphor-icons/react";

export function TooltipHeroDemo() {
  return (
    <TooltipProvider>
      <Tooltip
        content="添加新条目"
        render={
          <Button shape="square" icon={PlusIcon} aria-label="添加新条目" />
        }
      />
    </TooltipProvider>
  );
}

export function TooltipBasicDemo() {
  return (
    <TooltipProvider>
      <Tooltip
        content="添加"
        render={<Button shape="square" icon={PlusIcon} aria-label="添加" />}
      />
    </TooltipProvider>
  );
}

export function TooltipMultipleDemo() {
  return (
    <TooltipProvider>
      <div className="flex gap-2">
        <Tooltip
          content="添加"
          render={<Button shape="square" icon={PlusIcon} aria-label="添加" />}
        />
        <Tooltip
          content="更改语言"
          render={
            <Button shape="square" icon={TranslateIcon} aria-label="更改语言" />
          }
        />
      </div>
    </TooltipProvider>
  );
}

/**
 * 不使用 `render` 时，工具提示（Tooltip）会把 children 包裹在内部 button 元素中。
 * 默认会应用防御性样式，但你可以传入 className 完全自定义触发器——
 * 你的样式会覆盖默认样式。
 */
export function TooltipCustomTriggerDemo() {
  return (
    <TooltipProvider>
      <Tooltip
        content="点击了解更多"
        className="inline-flex items-center gap-1.5 rounded-full bg-lark-brand px-3 py-1.5 text-sm font-medium text-white shadow-md transition-transform hover:scale-105 active:scale-95"
      >
        <Info className="size-4" />
        <span>帮助</span>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Control the delay before opening and closing the tooltip.
 * `delay` controls open delay (default: 600ms), `closeDelay` controls close delay (default: 0ms).
 */
/**
 * 演示较长的工具提示内容会遵守可用的视口空间。
 * 靠近视口边缘的工具提示会将宽度限制为 `--available-width`，从而不会溢出。
 */
export function TooltipOverflowDemo() {
  const longContent =
    "这是一段用于验证工具提示在视口空间不足时如何换行与约束宽度的占位文本，内容需要足够长才能触发宽度上限与溢出处理，用来检查浮层不会超出屏幕边界。";
  return (
    <TooltipProvider>
      <div className="flex w-full justify-between">
        <Tooltip
          content={longContent}
          side="bottom"
          render={<Button variant="secondary" />}
        >
          靠近左边缘
        </Tooltip>
        <Tooltip
          content={longContent}
          side="bottom"
          render={<Button variant="secondary" />}
        >
          居中
        </Tooltip>
        <Tooltip
          content={longContent}
          side="bottom"
          render={<Button variant="secondary" />}
        >
          靠近右边缘
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export function TooltipDelayDemo() {
  return (
    <TooltipProvider>
      <div className="flex gap-4">
        <Tooltip
          content="1 秒后打开"
          delay={1000}
          render={<Button variant="secondary" />}
        >
          1 秒打开延迟
        </Tooltip>
        <Tooltip
          content="离开后保持打开 500 毫秒"
          closeDelay={500}
          render={<Button variant="secondary" />}
        >
          500 毫秒关闭延迟
        </Tooltip>
        <Tooltip
          content="立即打开，保持 1 秒"
          delay={0}
          closeDelay={1000}
          render={<Button variant="secondary" />}
        >
          立即打开 + 1 秒后关闭
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
