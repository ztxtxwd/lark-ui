import {
  Label,
  Input,
  Select,
  Checkbox,
  LarkLocaleProvider,
} from "@lark-ui/core";

export function LabelBasicDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Label>默认标签</Label>
      <Label showOptional>可选标签</Label>
      <Label tooltip="关于此字段的更多信息">带工具提示的标签</Label>
      <LarkLocaleProvider
        translations={{
          label: {
            optional: "（可选）",
            tooltip: "更多信息",
          },
        }}
      >
        <Label showOptional>翻译后的标签</Label>
        <Label tooltip="关于此字段的更多信息">带工具提示的标签</Label>
      </LarkLocaleProvider>
    </div>
  );
}

export function LabelOptionalFieldDemo() {
  return <Input label="手机号码" required={false} placeholder="+1 555-0000" />;
}

export function LabelWithTooltipDemo() {
  return (
    <Input
      label="API 密钥"
      labelTooltip="可在仪表盘设置的 API > 密钥中找到"
      placeholder="sk_live_..."
    />
  );
}

export function LabelReactNodeDemo() {
  return (
    <Checkbox
      label={
        <span>
          我同意 <strong>服务条款</strong>
        </span>
      }
    />
  );
}

export function LabelFormMixedDemo() {
  return (
    <div className="flex max-w-md flex-col gap-4">
      <Input label="姓名" placeholder="John Doe" />
      <Input
        label="邮箱"
        labelTooltip="收据会发送到这个邮箱"
        placeholder="john@example.com"
        type="email"
      />
      <Input label="公司" required={false} placeholder="Acme Inc." />
      <Select label="国家/地区" placeholder="请选择国家/地区">
        <Select.Option value="us">美国</Select.Option>
        <Select.Option value="uk">英国</Select.Option>
        <Select.Option value="ca">加拿大</Select.Option>
      </Select>
    </div>
  );
}

export function LabelStandaloneDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Label>默认</Label>
      <Label showOptional>可选</Label>
      <Label tooltip="重要字段">带工具提示</Label>
    </div>
  );
}
