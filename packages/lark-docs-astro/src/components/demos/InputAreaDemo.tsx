import { InputArea } from "@lark-ui/core";

export function InputAreaBasicDemo() {
  return (
    <InputArea
      label="描述"
      placeholder="请输入描述…"
      description="提供你的项目详细信息"
    />
  );
}

export function InputAreaWithLabelDemo() {
  return (
    <InputArea
      label="个人简介"
      placeholder="介绍一下你自己"
      description="最多 500 个字符"
    />
  );
}

export function InputAreaErrorStringDemo() {
  return (
    <InputArea
      label="消息"
      placeholder="请输入你的消息"
      value="你好"
      error="消息至少需要 10 个字符"
    />
  );
}

export function InputAreaErrorObjectDemo() {
  return (
    <InputArea
      label="反馈"
      value="不好"
      error={{
        message: "反馈至少需要 20 个字符",
        match: "tooShort",
      }}
      minLength={20}
    />
  );
}

export function InputAreaSizesDemo() {
  return (
    <div className="flex flex-col gap-4">
      <InputArea size="xs" label="极小" placeholder="极小尺寸文本域" />
      <InputArea size="sm" label="小" placeholder="小尺寸文本域" />
      <InputArea label="基础" placeholder="基础尺寸文本域（默认）" />
      <InputArea size="lg" label="大" placeholder="大尺寸文本域" />
    </div>
  );
}

export function InputAreaDisabledDemo() {
  return <InputArea label="禁用字段" placeholder="无法编辑" disabled />;
}

export function InputAreaBareDemo() {
  return <InputArea placeholder="添加备注…" aria-label="备注" rows={3} />;
}

export function InputAreaRowsDemo() {
  return (
    <div className="flex flex-col gap-4">
      <InputArea label="2 行" placeholder="小区域" rows={2} />
      <InputArea label="4 行（默认）" placeholder="中等区域" rows={4} />
      <InputArea label="8 行" placeholder="大区域" rows={8} />
    </div>
  );
}

export function InputAreaAutoResizeDemo() {
  return (
    <InputArea
      label="配置值"
      defaultValue={"查看配置变更。\n\n在此添加后续说明。\n\n"}
      autoResize
      minRows={2}
      maxRows={8}
      description="根据内容高度自动调整，最多 8 行"
    />
  );
}

export function InputAreaOptionalFieldDemo() {
  return (
    <InputArea label="补充说明" required={false} placeholder="任何补充信息…" />
  );
}

export function InputAreaLabelTooltipDemo() {
  return (
    <InputArea
      label="Worker 脚本"
      labelTooltip="在此输入你的 Lark 机器人脚本代码"
      placeholder="export default { async fetch(request) { ... } }"
      rows={4}
    />
  );
}

export function InputAreaReactNodeLabelDemo() {
  return (
    <InputArea
      label={
        <span>
          供<strong>审阅</strong>使用的备注
        </span>
      }
      required
      placeholder="为审阅者添加备注…"
      rows={3}
    />
  );
}
