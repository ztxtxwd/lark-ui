import { InlineCopyText } from "@lark-ui/core";

/** 用于短标识符的紧凑复制控件。 */
export function InlineCopyTextBasicDemo() {
  return (
    <InlineCopyText
      labels={{ copyAction: "复制数据库 ID", copied: "已复制数据库 ID" }}
    >
      f86b3f10-32e9-4db7-ae95-84a1b2c3d4e5
    </InlineCopyText>
  );
}

/** 位于紧凑、可悬停的资源行内的行内复制文本（InlineCopyText）。 */
export function InlineCopyTextResourceRowDemo() {
  return (
    <div className="group flex w-full max-w-xl items-center justify-between gap-4 rounded-lg bg-lark-base px-4 py-3 ring ring-lark-line">
      <span className="min-w-0 truncate text-sm text-lark-default">
        生产环境数据库
      </span>
      <InlineCopyText
        labels={{
          copyAction: "复制数据库 ID",
          copied: "已复制数据库 ID",
        }}
      >
        f86b3f10-32e9-4db7-ae95-84a1b2c3d4e5
      </InlineCopyText>
    </div>
  );
}

/** 显示富文本内容，复制时复制其底层值。 */
export function InlineCopyTextRichContentDemo() {
  return (
    <InlineCopyText
      value="f86b3f10-32e9-4db7-ae95-84a1b2c3d4e5"
      variant="body"
      labels={{ copyAction: "复制数据库 ID", copied: "已复制数据库 ID" }}
    >
      <span>
        数据库 ID：<strong>f86b3f10…</strong>
      </span>
    </InlineCopyText>
  );
}
