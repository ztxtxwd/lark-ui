import { Text } from "@lark-ui/core";

export function TextVariantsDemo() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="flex flex-col justify-end gap-1 rounded-lg border border-lark-hairline bg-lark-base p-4">
        <Text variant="heading">标题</Text>
        <Text variant="mono-secondary">text-lg (16px)</Text>
      </div>
      <div className="flex flex-col justify-end gap-1 rounded-lg border border-lark-hairline bg-lark-base p-4">
        <Text variant="heading" size="lg" as="h2">
          大号标题
        </Text>
        <Text variant="mono-secondary">text-xl (20px)</Text>
      </div>
      <div className="flex flex-col justify-end gap-1 rounded-lg border border-lark-hairline bg-lark-base p-4">
        <Text>正文</Text>
        <Text variant="mono-secondary">text-base (14px)</Text>
      </div>
      <div className="flex flex-col justify-end gap-1 rounded-lg border border-lark-hairline bg-lark-base p-4">
        <Text bold>加粗正文</Text>
        <Text variant="mono-secondary">text-base (14px)</Text>
      </div>
      <div className="flex flex-col justify-end gap-1 rounded-lg border border-lark-hairline bg-lark-base p-4">
        <Text size="lg">大号正文</Text>
        <Text variant="mono-secondary">text-lg (16px)</Text>
      </div>
      <div className="flex flex-col justify-end gap-1 rounded-lg border border-lark-hairline bg-lark-base p-4">
        <Text size="sm">小号正文</Text>
        <Text variant="mono-secondary">text-sm (13px)</Text>
      </div>
      <div className="flex flex-col justify-end gap-1 rounded-lg border border-lark-hairline bg-lark-base p-4">
        <Text size="xs">极小正文</Text>
        <Text variant="mono-secondary">text-xs (12px)</Text>
      </div>
      <div className="flex flex-col justify-end gap-1 rounded-lg border border-lark-hairline bg-lark-base p-4">
        <Text variant="secondary">次要正文</Text>
        <Text variant="mono-secondary">text-base (14px)</Text>
      </div>
      <div className="flex flex-col justify-end gap-1 rounded-lg border border-lark-hairline bg-lark-base p-4">
        <Text variant="mono">等宽字体</Text>
        <Text variant="mono-secondary">text-sm (13px)</Text>
      </div>
      <div className="flex flex-col justify-end gap-1 rounded-lg border border-lark-hairline bg-lark-base p-4">
        <Text variant="mono" size="lg">
          大号等宽字体
        </Text>
        <Text variant="mono-secondary">text-base (14px)</Text>
      </div>
      <div className="flex flex-col justify-end gap-1 rounded-lg border border-lark-hairline bg-lark-base p-4">
        <Text variant="mono-secondary">次要等宽字体</Text>
        <Text variant="mono-secondary">text-sm (13px)</Text>
      </div>
      <div className="flex flex-col justify-end gap-1 rounded-lg border border-lark-hairline bg-lark-base p-4">
        <Text variant="success">成功</Text>
        <Text variant="mono-secondary">text-base (14px)</Text>
      </div>
      <div className="flex flex-col justify-end gap-1 rounded-lg border border-lark-hairline bg-lark-base p-4">
        <Text variant="error">错误</Text>
        <Text variant="mono-secondary">text-base (14px)</Text>
      </div>
    </div>
  );
}

export function TextTruncateDemo() {
  return (
    <div className="w-64 rounded-lg border border-lark-hairline bg-lark-base p-4">
      <Text truncate>这是一段较长的文本，当它超出容器时会被省略号截断。</Text>
    </div>
  );
}
