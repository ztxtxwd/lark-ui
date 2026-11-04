import { useState, useEffect } from "react";
import { Select, Text, Badge } from "@lark-ui/core";

/** 带可见标签的基础选择器（Select）——推荐用法。 */
export function SelectBasicDemo() {
  const [value, setValue] = useState("apple");

  return (
    <Select
      label="最喜爱的水果"
      className="w-[200px]"
      value={value}
      onValueChange={(v) => setValue(v ?? "apple")}
      items={{ apple: "苹果", banana: "香蕉", cherry: "樱桃" }}
    />
  );
}

/** 选择器触发器的尺寸（xs/sm/base/lg），与输入框（Input）和组合框（Combobox）保持一致。 */
export function SelectSizesDemo() {
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3">
        <span className="w-10 text-sm text-lark-subtle">xs</span>
        <Select
          aria-label="选择尺寸 xs"
          size="xs"
          className="w-[200px]"
          placeholder="请选择……"
          items={{ a: "选项 A", b: "选项 B" }}
        />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-10 text-sm text-lark-subtle">sm</span>
        <Select
          aria-label="选择尺寸 sm"
          size="sm"
          className="w-[200px]"
          placeholder="请选择……"
          items={{ a: "选项 A", b: "选项 B" }}
        />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-10 text-sm text-lark-subtle">base</span>
        <Select
          aria-label="选择尺寸 base"
          size="base"
          className="w-[200px]"
          placeholder="请选择……"
          items={{ a: "选项 A", b: "选项 B" }}
        />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-10 text-sm text-lark-subtle">lg</span>
        <Select
          aria-label="选择尺寸 lg"
          size="lg"
          className="w-[200px]"
          placeholder="请选择……"
          items={{ a: "选项 A", b: "选项 B" }}
        />
      </div>
    </div>
  );
}

/** 没有可见标签的选择器——请使用 aria-label 保证无障碍。 */
export function SelectWithoutLabelDemo() {
  const [value, setValue] = useState("apple");

  return (
    <Select
      aria-label="选择一种水果"
      className="w-[200px]"
      value={value}
      onValueChange={(v) => setValue(v ?? "apple")}
      items={{ apple: "苹果", banana: "香蕉", cherry: "樱桃" }}
    />
  );
}

/** 带标签和描述文字的选择器。 */
export function SelectWithDescriptionDemo() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <Select
      label="问题类型"
      description="选择最能描述你问题的分类"
      className="w-[280px]"
      value={value}
      onValueChange={(v) => setValue(v as string | null)}
      items={{
        bug: "缺陷",
        documentation: "文档",
        feature: "功能",
      }}
    />
  );
}

/** 带标签和校验错误的选择器。 */
export function SelectWithErrorDemo() {
  return (
    <Select
      label="问题类型"
      error="请选择问题类型"
      className="w-[280px]"
      value={null}
      items={{
        bug: "缺陷",
        documentation: "文档",
        feature: "功能",
      }}
    />
  );
}

/** 未选中任何值时显示占位符的选择器。 */
export function SelectPlaceholderDemo() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <Select
      label="分类"
      placeholder="请选择分类……"
      className="w-[200px]"
      value={value}
      onValueChange={(v) => setValue(v as string | null)}
      items={{
        bug: "缺陷",
        documentation: "文档",
        feature: "功能",
      }}
    />
  );
}

/** 带标签工具提示的选择器，用于补充说明。 */
export function SelectWithTooltipDemo() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <Select
      label="优先级"
      labelTooltip="优先级越高的问题越先得到处理"
      placeholder="选择优先级"
      className="w-[200px]"
      value={value}
      onValueChange={(v) => setValue(v as string | null)}
      items={{
        low: "低",
        medium: "中",
        high: "高",
        critical: "紧急",
      }}
    />
  );
}

const languages = [
  { value: "en", label: "英语", emoji: "🇬🇧" },
  { value: "fr", label: "法语", emoji: "🇫🇷" },
  { value: "de", label: "德语", emoji: "🇩🇪" },
  { value: "es", label: "西班牙语", emoji: "🇪🇸" },
  { value: "it", label: "意大利语", emoji: "🇮🇹" },
  { value: "pt", label: "葡萄牙语", emoji: "🇵🇹" },
];

/** 使用自定义渲染展示复杂选项的选择器。 */
export function SelectCustomRenderingDemo() {
  const [value, setValue] = useState(languages[0]);

  return (
    <Select
      label="语言"
      className="w-[200px]"
      renderValue={(v) => (
        <span>
          {v.emoji} {v.label}
        </span>
      )}
      value={value}
      onValueChange={(v) => setValue(v as (typeof languages)[0])}
    >
      {languages.map((language) => (
        <Select.Option key={language.value} value={language}>
          {language.emoji} {language.label}
        </Select.Option>
      ))}
    </Select>
  );
}

/** 处于加载状态的选择器。 */
export function SelectLoadingDemo() {
  return <Select aria-label="加载中的选择器" className="w-[200px]" loading />;
}

/** 异步加载数据的选择器。 */
export function SelectLoadingDataDemo() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<undefined | string[]>();
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setData(["Visal", "John", "Alice", "Michael", "Sok"]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const items = data?.reduce(
    (acc, item) => {
      acc[item] = item;
      return acc;
    },
    {} as Record<string, string>,
  );

  return (
    <Select
      label="负责人"
      className="w-[200px]"
      loading={loading}
      value={value}
      onValueChange={(v) => setValue(v as string | null)}
      placeholder="选择负责人"
      items={items}
    />
  );
}

/** 用于选择多个值的多选选择器。 */
export function SelectMultipleDemo() {
  const [value, setValue] = useState<string[]>(["Name", "Location", "Size"]);

  return (
    <Select
      label="可见列"
      className="w-[250px]"
      multiple
      renderValue={(value) => {
        if (value.length > 3) {
          return (
            <span className="line-clamp-1">
              {value.slice(0, 2).join("、") + ` 等 ${value.length - 2} 项`}
            </span>
          );
        }
        return <span>{value.join("、")}</span>;
      }}
      value={value}
      onValueChange={(v) => setValue(v as string[])}
    >
      <Select.Option value="Name">名称</Select.Option>
      <Select.Option value="Location">位置</Select.Option>
      <Select.Option value="Size">大小</Select.Option>
      <Select.Option value="Read">读取</Select.Option>
      <Select.Option value="Write">写入</Select.Option>
      <Select.Option value="CreatedAt">创建时间</Select.Option>
    </Select>
  );
}

/** 使用较长选项名称的多选选择器，用于测试溢出处理。 */
export function SelectMultipleOverflowDemo() {
  const [value, setValue] = useState<string[]>([
    "European Union Privacy Regulation",
    "California Consumer Protection Act",
  ]);

  return (
    <Select
      label="合规框架"
      className="w-[280px]"
      multiple
      value={value}
      onValueChange={(v) => setValue(v as string[])}
    >
      <Select.Option value="European Union Privacy Regulation">
        欧盟隐私条例
      </Select.Option>
      <Select.Option value="California Consumer Protection Act">
        加利福尼亚消费者保护法
      </Select.Option>
      <Select.Option value="Health Insurance Portability Act">
        健康保险可携性法案
      </Select.Option>
      <Select.Option value="Payment Card Industry Standard">
        支付卡行业标准
      </Select.Option>
    </Select>
  );
}

/** 带自定义计数徽标的多选选择器，用于显示已选数量。 */
export function SelectMultipleWithIndicatorDemo() {
  const [value, setValue] = useState<string[]>(["bug", "feature"]);

  const allOptions = [
    { value: "bug", label: "缺陷" },
    { value: "feature", label: "功能需求" },
    { value: "docs", label: "文档" },
    { value: "performance", label: "性能问题" },
    { value: "security", label: "安全漏洞" },
  ];

  return (
    <Select
      label="问题类型"
      className="w-[220px]"
      multiple
      renderValue={(selected) => (
        <span className="flex items-center gap-2">
          <span>问题类型</span>
          {selected.length > 0 && (
            <Badge variant="neutral">{selected.length}</Badge>
          )}
        </span>
      )}
      value={value}
      onValueChange={(v) => setValue(v as string[])}
    >
      {allOptions.map((option) => (
        <Select.Option key={option.value} value={option.value}>
          {option.label}
        </Select.Option>
      ))}
    </Select>
  );
}

const authors = [
  { id: 1, name: "John Doe", title: "程序员" },
  { id: 2, name: "Alice Smith", title: "软件工程师" },
  { id: 3, name: "Michael Chan", title: "UI/UX 设计师" },
  { id: 4, name: "Sok Dara", title: "DevOps 工程师" },
  { id: 5, name: "Emily Johnson", title: "产品经理" },
  { id: 6, name: "Visal In", title: "系统工程师" },
  { id: 7, name: "Laura Kim", title: "技术作者" },
];

/** 使用复杂对象值和自定义选项渲染的选择器。 */
export function SelectComplexDemo() {
  const [value, setValue] = useState<(typeof authors)[0] | null>(null);

  return (
    <Select
      label="作者"
      description="选择本文档的主要作者"
      placeholder="选择作者"
      className="w-[200px]"
      onValueChange={(v) => setValue(v as (typeof authors)[0] | null)}
      value={value}
      isItemEqualToValue={(item, value) => item?.id === value?.id}
      renderValue={(author) => author.name}
    >
      {authors.map((author) => (
        <Select.Option key={author.id} value={author}>
          <div className="flex w-[300px] items-center justify-between gap-2">
            <Text>{author.name}</Text>
            <Text variant="secondary">{author.title}</Text>
          </div>
        </Select.Option>
      ))}
    </Select>
  );
}

interface Region {
  value: string;
  label: string;
  disabled?: boolean;
}

const regions: Region[] = [
  { value: "us-east", label: "美国东部" },
  { value: "us-west", label: "美国西部" },
  { value: "eu-west", label: "欧洲西部", disabled: true },
  { value: "ap-south", label: "亚太南部", disabled: true },
];

/** 带禁用选项（无法被选中）的选择器。 */
export function SelectDisabledOptionsDemo() {
  const [value, setValue] = useState<Region | null>(null);

  return (
    <Select
      label="部署区域"
      placeholder="请选择区域……"
      className="w-[250px]"
      value={value}
      onValueChange={(v) => setValue(v as Region | null)}
      isItemEqualToValue={(item, val) => item.value === val.value}
    >
      {regions.map((region) => (
        <Select.Option
          key={region.value}
          value={region}
          disabled={region.disabled}
        >
          {region.label}
        </Select.Option>
      ))}
    </Select>
  );
}

/** 使用 items 属性并携带禁用描述符的选择器。 */
export function SelectDisabledItemsDemo() {
  const [value, setValue] = useState<string | null>("free");

  return (
    <Select
      label="套餐"
      className="w-[200px]"
      value={value}
      onValueChange={(v) => setValue(v as string | null)}
      items={{
        free: "免费版",
        pro: "专业版",
        business: { label: "商业版", disabled: true },
        enterprise: { label: "企业版", disabled: true },
      }}
    />
  );
}

/** Select with grouped options and separators. */
const foods = {
  fruits: [
    { value: "apple", label: "苹果" },
    { value: "banana", label: "香蕉" },
    { value: "cherry", label: "樱桃" },
  ],
  vegetables: [
    { value: "carrot", label: "胡萝卜" },
    { value: "broccoli", label: "西兰花" },
    { value: "spinach", label: "菠菜" },
  ],
};

type Food = (typeof foods.fruits)[0];

/** 按带标签的标题分组的选项组织方式的选择器。 */
export function SelectGroupedDemo() {
  const [value, setValue] = useState<Food | null>(null);

  return (
    <Select
      label="食物"
      placeholder="选择一种食物……"
      className="w-[220px]"
      value={value}
      onValueChange={(v) => setValue(v as Food | null)}
      isItemEqualToValue={(item, val) => item.value === val.value}
    >
      <Select.Group>
        <Select.GroupLabel>水果</Select.GroupLabel>
        {foods.fruits.map((food) => (
          <Select.Option key={food.value} value={food}>
            {food.label}
          </Select.Option>
        ))}
      </Select.Group>
      <Select.Separator />
      <Select.Group>
        <Select.GroupLabel>蔬菜</Select.GroupLabel>
        {foods.vegetables.map((food) => (
          <Select.Option key={food.value} value={food}>
            {food.label}
          </Select.Option>
        ))}
      </Select.Group>
    </Select>
  );
}

/** Select combining groups, separators, and disabled options. */
const serverRegions = {
  available: [
    { value: "us-east-1", label: "美国东部（弗吉尼亚北部）" },
    { value: "us-west-2", label: "美国西部（俄勒冈）" },
    { value: "eu-west-1", label: "欧洲西部（爱尔兰）" },
  ],
  unavailable: [
    { value: "ap-south-1", label: "亚太南部（孟买）" },
    { value: "sa-east-1", label: "南美东部（圣保罗）" },
  ],
};

type ServerRegion = (typeof serverRegions.available)[0];

/** 分组选择器，含禁用选项和信息工具提示。 */
export function SelectGroupedWithDisabledDemo() {
  const [value, setValue] = useState<ServerRegion | null>(null);

  return (
    <Select
      label="服务器区域"
      placeholder="选择区域……"
      className="w-[260px]"
      value={value}
      onValueChange={(v) => setValue(v as ServerRegion | null)}
      isItemEqualToValue={(item, val) => item.value === val.value}
    >
      <Select.Group>
        <Select.GroupLabel>可用</Select.GroupLabel>
        {serverRegions.available.map((region) => (
          <Select.Option key={region.value} value={region}>
            {region.label}
          </Select.Option>
        ))}
      </Select.Group>
      <Select.Separator />
      <Select.Group>
        <Select.GroupLabel>不可用</Select.GroupLabel>
        {serverRegions.unavailable.map((region) => (
          <Select.Option key={region.value} value={region} disabled>
            {region.label}
          </Select.Option>
        ))}
      </Select.Group>
    </Select>
  );
}

// Generate 50 items for long list scrolling test
const longListItems = Array.from({ length: 50 }, (_, i) => ({
  value: `item-${i + 1}`,
  label: `选项 ${i + 1}`,
}));

type LongListItem = (typeof longListItems)[0];

/** 使用长列表的选择器，用于测试弹层滚动行为。 */
export function SelectLongListDemo() {
  const [value, setValue] = useState<LongListItem | null>(null);

  return (
    <Select
      label="长列表选择器"
      description="测试大量选项时的滚动行为"
      placeholder="请选择一个选项……"
      className="w-[220px]"
      value={value}
      onValueChange={(v) => setValue(v as LongListItem | null)}
      isItemEqualToValue={(item, val) => item.value === val.value}
    >
      {longListItems.map((item) => (
        <Select.Option key={item.value} value={item}>
          {item.label}
        </Select.Option>
      ))}
    </Select>
  );
}

const planets = {
  mercury: "水星",
  venus: "金星",
  earth: "地球",
  mars: "火星",
  jupiter: "木星",
  saturn: "土星",
  uranus: "天王星",
};

/**
 * 使用 `side` 和 `align` 固定弹层位置。当所选方向空间不足时，位置仍会自动翻转。
 */
export function SelectPlacementDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Select
        label="side=bottom（默认）"
        className="w-[200px]"
        defaultValue="earth"
        items={planets}
      />
      <Select
        label="side=top"
        side="top"
        className="w-[200px]"
        defaultValue="earth"
        items={planets}
      />
      <Select
        label="align=end"
        align="end"
        className="w-[200px]"
        defaultValue="earth"
        items={planets}
      />
      <Select
        label="sideOffset=12"
        sideOffset={12}
        className="w-[200px]"
        defaultValue="earth"
        items={planets}
      />
    </div>
  );
}

/**
 * `alignItemWithTrigger` 会让弹层覆盖在触发器上，使选中的选项正好位于触发器上方，
 * 与原生 `<select>` 一致。选中项之前的选项渲染在触发器上方，其余选项在下方。
 * 打开第二个选择器——「Mars」选在列表中部，因此弹层向上下两个方向展开。
 * 空间不足时会回退到常规的锚定定位方式。
 */
export function SelectDynamicPlacementDemo() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <Select
        label="锚定（默认）"
        description="在触发器下方打开"
        className="w-[200px]"
        defaultValue="mars"
        items={planets}
      />
      <Select
        label="与选中项对齐"
        description="选中的选项与触发器对齐"
        alignItemWithTrigger
        className="w-[200px]"
        defaultValue="mars"
        items={planets}
      />
    </div>
  );
}
