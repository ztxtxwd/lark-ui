import { ClipboardText } from "@lark-ui/core";

export function ClipboardTextBasicDemo() {
  return <ClipboardText text="0c239dd2" />;
}

export function ClipboardTextShortDemo() {
  return <ClipboardText text="abc123" />;
}

export function ClipboardTextApiKeyDemo() {
  return <ClipboardText text="sk_live_51H8..." />;
}

/** 在点击显示按钮之前遮蔽敏感值。 */
export function ClipboardTextMaskedDemo() {
  return (
    <div className="w-full max-w-xs">
      <ClipboardText className="w-full" text="sk_live_51H8_abc123" masked />
    </div>
  );
}

export function ClipboardTextAlternateTextToCopyDemo() {
  return (
    <ClipboardText
      text="sk_live_***********"
      textToCopy="sk_live_51H8_abc123"
    />
  );
}

export function ClipboardTextLongDemo() {
  return <ClipboardText text="https://example.com/very/long/url/path" />;
}

/** 悬停时显示「复制」工具提示，点击时显示锚定到触发元素的「已复制」轻提示 */
export function ClipboardTextWithTooltipDemo() {
  return (
    <ClipboardText
      text="npx lark-ui add button"
      tooltip={{ text: "复制", copiedText: "已复制！", side: "top" }}
    />
  );
}
