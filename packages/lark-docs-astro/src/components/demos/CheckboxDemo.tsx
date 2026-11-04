import { useState } from "react";
import { Checkbox } from "@lark-ui/core";

export function CheckboxBasicDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      label="接受服务条款"
      checked={checked}
      onCheckedChange={setChecked}
    />
  );
}

export function CheckboxDefaultDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox label="启用通知" checked={checked} onCheckedChange={setChecked} />
  );
}

export function CheckboxCheckedDemo() {
  const [checked, setChecked] = useState(true);
  return (
    <Checkbox label="我同意" checked={checked} onCheckedChange={setChecked} />
  );
}

export function CheckboxIndeterminateDemo() {
  const [indeterminate, setIndeterminate] = useState(true);
  return (
    <Checkbox
      label="全选"
      indeterminate={indeterminate}
      onCheckedChange={setIndeterminate}
    />
  );
}

export function CheckboxLabelFirstDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      label="记住我"
      controlFirst={false}
      checked={checked}
      onCheckedChange={setChecked}
    />
  );
}

export function CheckboxDisabledDemo() {
  return <Checkbox label="禁用的选项" disabled />;
}

export function CheckboxErrorDemo() {
  return <Checkbox label="无效的选项" variant="error" />;
}

export function CheckboxGroupDemo() {
  const [preferences, setPreferences] = useState<string[]>(["email"]);

  return (
    <Checkbox.Group
      legend="邮件通知偏好"
      description="选择你希望接收更新的方式"
      value={preferences}
      onValueChange={setPreferences}
    >
      <Checkbox.Item value="email" label="邮件通知" />
      <Checkbox.Item value="sms" label="短信通知" />
      <Checkbox.Item value="push" label="推送通知" />
    </Checkbox.Group>
  );
}

/** 展示使用 sr-only 的 Checkbox.Legend，在保留无障碍语义的同时视觉隐藏图例；当父级 Field 已提供可见标签时非常有用 */
export function CheckboxLegendSrOnlyDemo() {
  const [preferences, setPreferences] = useState<string[]>(["email"]);
  return (
    <Checkbox.Group value={preferences} onValueChange={setPreferences}>
      <Checkbox.Legend className="sr-only">通知偏好</Checkbox.Legend>
      <Checkbox.Item value="email" label="邮件通知" />
      <Checkbox.Item value="sms" label="短信通知" />
      <Checkbox.Item value="push" label="推送通知" />
    </Checkbox.Group>
  );
}

/** 展示使用自定义样式的 Checkbox.Legend，完全掌控图例的呈现方式 */
export function CheckboxLegendCustomDemo() {
  const [preferences, setPreferences] = useState<string[]>(["email"]);
  return (
    <Checkbox.Group value={preferences} onValueChange={setPreferences}>
      <Checkbox.Legend className="text-sm font-normal text-lark-subtle">
        通知偏好
      </Checkbox.Legend>
      <Checkbox.Item value="email" label="邮件通知" />
      <Checkbox.Item value="sms" label="短信通知" />
      <Checkbox.Item value="push" label="推送通知" />
    </Checkbox.Group>
  );
}

export function CheckboxGroupErrorDemo() {
  return (
    <Checkbox.Group
      legend="必填的通知方式"
      error="请至少选择一种通知方式"
      value={[]}
      onValueChange={() => {}}
    >
      <Checkbox.Item value="email" label="邮件" variant="error" />
      <Checkbox.Item value="sms" label="短信" variant="error" />
    </Checkbox.Group>
  );
}

export function CheckboxCardDemo() {
  const [products, setProducts] = useState<string[]>(["gateway"]);

  return (
    <Checkbox.Group
      legend="此配置文件应扫描哪些内容？"
      appearance="card"
      value={products}
      onValueChange={setProducts}
    >
      <Checkbox.Item
        value="gateway"
        label="Web 流量"
        description="通过 Gateway HTTP 策略进行的上传和下载。"
      />
      <Checkbox.Item
        value="ai"
        label="AI 提示词"
        description="发送给 AI 应用的提示词及其返回的响应。"
      />
      <Checkbox.Item
        value="casb"
        label="SaaS 与云存储"
        description="存储在已连接应用和云账户中的文件。"
      />
      <Checkbox.Item
        value="email"
        label="出站邮件"
        description="离开你所在组织的外发邮件。"
      />
    </Checkbox.Group>
  );
}

export function CheckboxCardHorizontalDemo() {
  const [products, setProducts] = useState<string[]>(["gateway"]);

  return (
    <Checkbox.Group
      legend="此配置文件应扫描哪些内容？"
      appearance="card"
      orientation="horizontal"
      value={products}
      onValueChange={setProducts}
    >
      <Checkbox.Item
        value="gateway"
        label="Web 流量"
        description="通过 Gateway HTTP 策略进行的上传和下载。"
      />
      <Checkbox.Item
        value="ai"
        label="AI 提示词"
        description="发送给 AI 应用的提示词及其返回的响应。"
      />
      <Checkbox.Item
        value="casb"
        label="SaaS 与云存储"
        description="存储在已连接应用和云账户中的文件。"
      />
      <Checkbox.Item
        value="email"
        label="出站邮件"
        description="离开你所在组织的外发邮件。"
      />
    </Checkbox.Group>
  );
}
