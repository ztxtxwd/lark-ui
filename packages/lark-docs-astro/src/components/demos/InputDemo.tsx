import { useState } from "react";
import { Input } from "@lark-ui/core";

export function InputBasicDemo() {
  return (
    <Input
      label="邮箱"
      placeholder="you@example.com"
      description="我们绝不会共享你的邮箱"
    />
  );
}

export function InputWithLabelDemo() {
  return (
    <Input
      label="用户名"
      placeholder="选择一个用户名"
      description="3-20 个字符，仅支持字母和数字"
    />
  );
}

export function InputErrorStringDemo() {
  return (
    <Input
      label="邮箱"
      placeholder="you@example.com"
      value="invalid-email"
      error="请输入有效的邮箱地址"
    />
  );
}

export function InputErrorObjectDemo() {
  return (
    <Input
      label="密码"
      type="password"
      value="short"
      error={{
        message: "密码至少需要 8 个字符",
        match: "tooShort",
      }}
      minLength={8}
    />
  );
}

export function InputSizesDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Input size="xs" label="极小" placeholder="极小尺寸输入框" />
      <Input size="sm" label="小" placeholder="小尺寸输入框" />
      <Input label="基础" placeholder="基础尺寸输入框（默认）" />
      <Input size="lg" label="大" placeholder="大尺寸输入框" />
    </div>
  );
}

export function InputDisabledDemo() {
  return <Input label="禁用字段" placeholder="无法编辑" disabled />;
}

export function InputBareDemo() {
  return <Input placeholder="搜索…" aria-label="搜索产品" />;
}

/** 没有可见标签的输入框（Input），通过 `aria-label` 传达错误和描述信息。 */
export function InputErrorWithoutLabelDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Input
        aria-label="主机名"
        placeholder="example.com"
        value="not a host"
        error="请输入有效的主机名"
      />
      <Input
        aria-label="路径"
        placeholder="/api/v1/users"
        value="missing-slash"
        error={{ message: "路径必须以 / 开头", match: true }}
      />
    </div>
  );
}

/** 并排对比：Keeper 在默认输入框上显示图标，在忽略密码管理的输入框上则不显示。 */
export function InputPasswordManagerIgnoreDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="API 密钥（默认）"
        type="password"
        placeholder="sk_live_..."
      />
      <Input
        label="API 密钥（passwordManagerIgnore）"
        type="password"
        placeholder="sk_live_..."
        passwordManagerIgnore
      />
    </div>
  );
}

export function InputTypesDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Input type="email" label="邮箱" placeholder="you@example.com" />
      <Input type="password" label="密码" placeholder="••••••••" />
      <Input type="number" label="年龄" placeholder="18" />
      <Input type="tel" label="电话" placeholder="+1 (555) 000-0000" />
    </div>
  );
}

export function InputOptionalFieldDemo() {
  return (
    <Input label="电话号码" required={false} placeholder="+1 (555) 000-0000" />
  );
}

export function InputLabelTooltipDemo() {
  return (
    <Input
      label="API 密钥"
      labelTooltip="可在控制台的 设置 > API 密钥 中找到"
      placeholder="sk_live_..."
    />
  );
}

export function InputReactNodeLabelDemo() {
  return (
    <Input
      label={
        <span>
          用于<strong>账单</strong>的邮箱
        </span>
      }
      required
      placeholder="billing@company.com"
      type="email"
    />
  );
}

/** 使用 `onChange`（原生 React 事件）的受控输入框。 */
export function InputControlledOnChangeDemo() {
  const [value, setValue] = useState("");
  return (
    <Input
      label="使用 onChange"
      placeholder="输入一些内容…"
      description={value ? `值：${value}` : "使用 e.target.value"}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

/** 使用 `onValueChange` 的受控输入框（Base UI 的便捷写法——直接提供字符串）。 */
export function InputControlledOnValueChangeDemo() {
  const [value, setValue] = useState("");
  return (
    <Input
      label="使用 onValueChange"
      placeholder="输入一些内容…"
      description={value ? `值：${value}` : "直接接收值"}
      value={value}
      onValueChange={(v) => setValue(v)}
    />
  );
}
