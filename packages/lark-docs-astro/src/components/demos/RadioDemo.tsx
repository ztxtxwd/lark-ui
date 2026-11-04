import { useState } from "react";
import { Badge, Radio } from "@lark-ui/core";

/** 展示基础的受控单选按钮组（Radio） */
export function RadioBasicDemo() {
  const [value, setValue] = useState("email");
  return (
    <Radio.Group legend="通知偏好" value={value} onValueChange={setValue}>
      <Radio.Item label="邮件" value="email" />
      <Radio.Item label="短信" value="sms" />
      <Radio.Item label="推送通知" value="push" />
    </Radio.Group>
  );
}

/** 展示默认的纵向单选按钮组布局 */
export function RadioDefaultDemo() {
  const [value, setValue] = useState("personal");
  return (
    <Radio.Group legend="账户类型" value={value} onValueChange={setValue}>
      <Radio.Item label="个人" value="personal" />
      <Radio.Item label="商业" value="business" />
      <Radio.Item label="企业版" value="enterprise" />
    </Radio.Group>
  );
}

/** 展示横向单选按钮组布局 */
export function RadioHorizontalDemo() {
  const [value, setValue] = useState("md");
  return (
    <Radio.Group
      legend="尺寸"
      orientation="horizontal"
      value={value}
      onValueChange={setValue}
    >
      <Radio.Item label="小" value="sm" />
      <Radio.Item label="中" value="md" />
      <Radio.Item label="大" value="lg" />
    </Radio.Group>
  );
}

export function RadioSegmentedDemo() {
  const [duration, setDuration] = useState("1");
  return (
    <Radio.Group
      appearance="segmented"
      legend="时长预设"
      value={duration}
      onValueChange={setDuration}
    >
      <Radio.Item label="1h" value="1" />
      <Radio.Item label="12h" value="12" />
      <Radio.Item label="24h" value="24" />
    </Radio.Group>
  );
}

export function RadioAppearanceComparisonDemo() {
  return (
    <div className="flex flex-wrap gap-8">
      <Radio.Group legend="默认外观" orientation="horizontal" defaultValue="1">
        <Radio.Item label="1h" value="1" />
        <Radio.Item label="12h" value="12" />
        <Radio.Item label="24h" value="24" />
      </Radio.Group>
      <Radio.Group appearance="segmented" legend="分段外观" defaultValue="1">
        <Radio.Item label="1h" value="1" />
        <Radio.Item label="12h" value="12" />
        <Radio.Item label="24h" value="24" />
      </Radio.Group>
    </div>
  );
}

export function RadioSegmentedDisabledDemo() {
  return (
    <div className="flex flex-wrap gap-8">
      <Radio.Group
        appearance="segmented"
        legend="禁用的单选组"
        defaultValue="12"
        disabled
      >
        <Radio.Item label="1h" value="1" />
        <Radio.Item label="12h" value="12" />
        <Radio.Item label="24h" value="24" />
      </Radio.Group>
      <Radio.Group appearance="segmented" legend="禁用的选项" defaultValue="1">
        <Radio.Item label="1h" value="1" />
        <Radio.Item label="12h" value="12" disabled />
        <Radio.Item label="24h" value="24" />
      </Radio.Group>
    </div>
  );
}

export function RadioSegmentedLegendDemo() {
  return (
    <Radio.Group appearance="segmented" defaultValue="automatic">
      <Radio.Legend className="text-sm font-normal text-lark-subtle">
        配置模式
      </Radio.Legend>
      <Radio.Item label="自动" value="automatic" />
      <Radio.Item label="手动" value="manual" />
    </Radio.Group>
  );
}

export function RadioSegmentedLongLabelsDemo() {
  return (
    <div className="w-48 max-w-full">
      <Radio.Group
        appearance="segmented"
        legend="处理偏好"
        defaultValue="automatic"
      >
        <Radio.Item label="自动处理" value="automatic" />
        <Radio.Item label="手动配置" value="manual" />
      </Radio.Group>
    </div>
  );
}

/** 展示带辅助说明文字的单选按钮组 */
export function RadioDescriptionDemo() {
  const [value, setValue] = useState("standard");
  return (
    <Radio.Group
      legend="配送方式"
      description="选择你希望接收订单的方式"
      value={value}
      onValueChange={setValue}
    >
      <Radio.Item label="标准（5-7 天）" value="standard" />
      <Radio.Item label="加急（2-3 天）" value="express" />
      <Radio.Item label="隔夜送达" value="overnight" />
    </Radio.Group>
  );
}

/** 展示默认样式和卡片样式单选按钮组的错误状态 */
export function RadioErrorDemo() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Radio.Group legend="支付方式" error="请选择一种支付方式以继续">
        <Radio.Item label="信用卡" value="card" variant="error" />
        <Radio.Item label="PayPal" value="paypal" variant="error" />
      </Radio.Group>
      <Radio.Group
        legend="支付方式"
        appearance="card"
        error="请选择一种支付方式以继续"
      >
        <Radio.Item
          label="信用卡"
          description="可使用 Visa、Mastercard、美国运通或 Elo 支付。"
          value="card"
          variant="error"
        />
        <Radio.Item
          label="PayPal"
          description="使用你的 PayPal 账户支付。"
          value="paypal"
          variant="error"
        />
      </Radio.Group>
    </div>
  );
}

/** 展示默认样式和卡片样式单选按钮组的禁用状态 */
export function RadioDisabledDemo() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Radio.Group legend="禁用的单选组" disabled defaultValue="a">
        <Radio.Item label="选项 A" value="a" />
        <Radio.Item label="选项 B" value="b" />
      </Radio.Group>
      <Radio.Group legend="单独禁用" defaultValue="available">
        <Radio.Item label="可用" value="available" />
        <Radio.Item label="不可用" value="unavailable" disabled />
      </Radio.Group>
      <Radio.Group
        legend="禁用的卡片单选组"
        appearance="card"
        disabled
        defaultValue="a"
      >
        <Radio.Item label="选项 A" description="该选项已禁用。" value="a" />
        <Radio.Item label="选项 B" description="该选项已禁用。" value="b" />
      </Radio.Group>
      <Radio.Group
        legend="单独禁用的卡片"
        appearance="card"
        defaultValue="available"
      >
        <Radio.Item
          label="可用"
          description="该选项可以选择。"
          value="available"
        />
        <Radio.Item
          label="不可用"
          description="该选项不可用。"
          value="unavailable"
          disabled
        />
      </Radio.Group>
    </div>
  );
}

/** 展示标签位于单选控件之前的单选按钮组 */
export function RadioControlPositionDemo() {
  return (
    <Radio.Group legend="偏好设置" controlPosition="end" defaultValue="a">
      <Radio.Item label="标签在单选按钮之前" value="a" />
      <Radio.Item label="另一个选项" value="b" />
    </Radio.Group>
  );
}

/** 展示带 Lark 套餐选项的单选卡片外观 */
export function RadioCardDemo() {
  const [value, setValue] = useState("free");
  return (
    <Radio.Group
      legend="选择套餐"
      appearance="card"
      value={value}
      onValueChange={setValue}
    >
      <Radio.Item
        label="免费版"
        description="适合个人或业余项目，不适合关键业务场景。"
        value="free"
      />
      <Radio.Item
        label="专业版"
        description="适合专业网站，不适合关键业务场景。"
        value="pro"
      />
      <Radio.Item
        label="商业版"
        description="适合线上运营的小型企业。"
        value="business"
      />
      <Radio.Item
        label="合约版"
        description="适合作为业务核心的关键应用。"
        value="contract"
      />
    </Radio.Group>
  );
}

/** 展示使用 sr-only 的 Radio.Legend，在保留无障碍语义的同时视觉隐藏图例；当父级 Field 已提供可见标签时非常有用 */
export function RadioLegendSrOnlyDemo() {
  const [value, setValue] = useState("all");
  return (
    <Radio.Group defaultValue="all" value={value} onValueChange={setValue}>
      <Radio.Legend className="sr-only">路径</Radio.Legend>
      <Radio.Item label="允许所有路径" value="all" />
      <Radio.Item label="限制为特定路径" value="specific" />
    </Radio.Group>
  );
}

/** 展示使用自定义样式的 Radio.Legend，完全掌控图例的呈现方式 */
export function RadioLegendCustomDemo() {
  const [value, setValue] = useState("email");
  return (
    <Radio.Group value={value} onValueChange={setValue}>
      <Radio.Legend className="text-sm font-normal text-lark-subtle">
        通知偏好
      </Radio.Legend>
      <Radio.Item label="邮件" value="email" />
      <Radio.Item label="短信" value="sms" />
      <Radio.Item label="推送通知" value="push" />
    </Radio.Group>
  );
}

/** 展示通过 controlPosition="start" 将控件置于左侧的单选卡片外观 */
export function RadioCardControlStartDemo() {
  const [value, setValue] = useState("free");
  return (
    <Radio.Group
      legend="选择套餐"
      appearance="card"
      controlPosition="start"
      value={value}
      onValueChange={setValue}
    >
      <Radio.Item
        label="免费版"
        description="适合个人或业余项目，不适合关键业务场景。"
        value="free"
      />
      <Radio.Item
        label="专业版"
        description="适合专业网站，不适合关键业务场景。"
        value="pro"
      />
    </Radio.Group>
  );
}

enum ThemeType {
  dark = "dark",
  light = "light",
  system = "system",
}

/** 展示使用类型化值的 Radio.Group：数字联合类型和 TypeScript 枚举。 */
export function RadioTypedValueDemo() {
  const [pageSize, setPageSize] = useState<number>(10);
  const [theme, setTheme] = useState<ThemeType>(ThemeType.system);
  return (
    <div className="grid grid-cols-2 gap-6">
      <Radio.Group<number>
        legend="每页条数"
        value={pageSize}
        onValueChange={setPageSize}
      >
        <Radio.Item<number> label="10" value={10} />
        <Radio.Item<number> label="25" value={25} />
        <Radio.Item<number> label="50" value={50} />
      </Radio.Group>
      <Radio.Group<ThemeType>
        legend="主题"
        value={theme}
        onValueChange={setTheme}
      >
        <Radio.Item<ThemeType> label="浅色" value={ThemeType.light} />
        <Radio.Item<ThemeType> label="深色" value={ThemeType.dark} />
        <Radio.Item<ThemeType> label="跟随系统" value={ThemeType.system} />
      </Radio.Group>
    </div>
  );
}

/** 展示 Radio.Item 标签中使用富文本 ReactNode 内容（图标、徽标或额外标记） */
export function RadioRichLabelDemo() {
  const [value, setValue] = useState("pro");
  return (
    <Radio.Group
      legend="选择套餐"
      appearance="card"
      value={value}
      onValueChange={setValue}
    >
      <Radio.Item
        label={
          <span className="flex items-center gap-2">
            免费版
            <Badge variant="neutral">$0</Badge>
          </span>
        }
        description="适合个人或业余项目。"
        value="free"
      />
      <Radio.Item
        label={
          <span className="flex items-center gap-2">
            专业版
            <Badge variant="primary">热门</Badge>
          </span>
        }
        description="适合专业网站。"
        value="pro"
      />
    </Radio.Group>
  );
}

/** 展示横向布局的单选卡片外观 */
export function RadioCardHorizontalDemo() {
  const [value, setValue] = useState("free");
  return (
    <Radio.Group
      legend="选择套餐"
      appearance="card"
      orientation="horizontal"
      value={value}
      onValueChange={setValue}
    >
      <Radio.Item
        label="免费版"
        description="适合个人或业余项目，不适合关键业务场景。"
        value="free"
      />
      <Radio.Item
        label="专业版"
        description="适合专业网站，不适合关键业务场景。"
        value="pro"
      />
      <Radio.Item
        label="商业版"
        description="适合线上运营的小型企业。"
        value="business"
      />
      <Radio.Item
        label="合约版"
        description="适合作为业务核心的关键应用。"
        value="contract"
      />
    </Radio.Group>
  );
}
