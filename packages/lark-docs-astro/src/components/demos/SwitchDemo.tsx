import { useState } from "react";
import { Switch } from "@lark-ui/core";

export function SwitchBasicDemo() {
  const [checked, setChecked] = useState(false);
  return <Switch label="开关" checked={checked} onCheckedChange={setChecked} />;
}

export function SwitchOffDemo() {
  return <Switch label="开关" checked={false} onCheckedChange={() => {}} />;
}

export function SwitchOnDemo() {
  return <Switch label="开关" checked={true} onCheckedChange={() => {}} />;
}

export function SwitchDisabledDemo() {
  return <Switch label="禁用" checked={false} disabled />;
}

/** 中性变体——单色开关，适用于不显眼、弱化强调的切换 */
export function SwitchNeutralDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <Switch
      label="中性开关"
      variant="neutral"
      checked={checked}
      onCheckedChange={setChecked}
    />
  );
}

/** 中性变体的不同状态 */
export function SwitchNeutralStatesDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Switch
        label="中性关闭"
        variant="neutral"
        checked={false}
        onCheckedChange={() => {}}
      />
      <Switch
        label="中性开启"
        variant="neutral"
        checked={true}
        onCheckedChange={() => {}}
      />
      <Switch label="中性禁用" variant="neutral" checked={false} disabled />
    </div>
  );
}

/** 所有变体对比——2×2 网格展示默认变体和中性变体的关闭/开启状态 */
export function SwitchVariantsDemo() {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
      <Switch label="默认关闭" checked={false} onCheckedChange={() => {}} />
      <Switch label="默认开启" checked={true} onCheckedChange={() => {}} />
      <Switch
        label="中性关闭"
        variant="neutral"
        checked={false}
        onCheckedChange={() => {}}
      />
      <Switch
        label="中性开启"
        variant="neutral"
        checked={true}
        onCheckedChange={() => {}}
      />
    </div>
  );
}

/** 带自定义 id 属性的开关（Switch）——点击标签仍应能切换开关。 */
export function SwitchCustomIdDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <Switch
      id="my-custom-switch"
      label="自定义 ID"
      checked={checked}
      onCheckedChange={setChecked}
    />
  );
}

/** 展示带图例的 Switch.Group，用于对相关开关分组 */
export function SwitchGroupDemo() {
  return (
    <Switch.Group legend="通知设置">
      <Switch.Item label="邮件通知" />
      <Switch.Item label="短信通知" />
      <Switch.Item label="推送通知" />
    </Switch.Group>
  );
}

/** 展示使用 sr-only 的 Switch.Legend，在保留无障碍语义的同时视觉隐藏图例；当父级 Field 已提供可见标签时非常有用 */
export function SwitchLegendSrOnlyDemo() {
  return (
    <Switch.Group>
      <Switch.Legend className="sr-only">通知设置</Switch.Legend>
      <Switch.Item label="邮件通知" />
      <Switch.Item label="短信通知" />
      <Switch.Item label="推送通知" />
    </Switch.Group>
  );
}

/** 展示使用自定义样式的 Switch.Legend，完全掌控图例的呈现方式 */
export function SwitchLegendCustomDemo() {
  return (
    <Switch.Group>
      <Switch.Legend className="text-sm font-normal text-lark-subtle">
        通知设置
      </Switch.Legend>
      <Switch.Item label="邮件通知" />
      <Switch.Item label="短信通知" />
      <Switch.Item label="推送通知" />
    </Switch.Group>
  );
}

/** 所有尺寸对比 */
export function SwitchSizesDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Switch label="小" size="sm" checked={true} onCheckedChange={() => {}} />
      <Switch
        label="常规（默认）"
        size="base"
        checked={true}
        onCheckedChange={() => {}}
      />
      <Switch label="大" size="lg" checked={true} onCheckedChange={() => {}} />
    </div>
  );
}
