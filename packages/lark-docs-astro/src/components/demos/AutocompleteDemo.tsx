import { useCallback, useState } from "react";
import { Autocomplete } from "@lark-ui/core";
import { languages, type Language } from "./data/languages";

const fruits = [
  "苹果",
  "杏",
  "牛油果",
  "香蕉",
  "黑莓",
  "蓝莓",
  "哈密瓜",
  "樱桃",
  "椰子",
  "蔓越莓",
  "椰枣",
  "火龙果",
  "无花果",
  "葡萄",
  "西柚",
  "番石榴",
  "蜜瓜",
  "猕猴桃",
  "柠檬",
  "青柠",
  "荔枝",
  "芒果",
  "油桃",
  "橙子",
  "木瓜",
  "百香果",
  "桃子",
  "梨",
  "菠萝",
  "李子",
  "树莓",
  "草莓",
  "西瓜",
];

type Country = {
  code: string;
  label: string;
};

const countries: Country[] = [
  { code: "us", label: "美国" },
  { code: "gb", label: "英国" },
  { code: "de", label: "德国" },
  { code: "fr", label: "法国" },
  { code: "jp", label: "日本" },
  { code: "cn", label: "中国" },
  { code: "in", label: "印度" },
  { code: "br", label: "巴西" },
  { code: "ca", label: "加拿大" },
  { code: "au", label: "澳大利亚" },
  { code: "mx", label: "墨西哥" },
  { code: "kr", label: "韩国" },
  { code: "it", label: "意大利" },
  { code: "es", label: "西班牙" },
  { code: "nl", label: "荷兰" },
  { code: "se", label: "瑞典" },
  { code: "no", label: "挪威" },
  { code: "pl", label: "波兰" },
  { code: "ar", label: "阿根廷" },
  { code: "za", label: "南非" },
];

type ServerLocation = {
  label: string;
  value: string;
};

type ServerGroup = {
  value: string;
  items: ServerLocation[];
};

const servers: ServerGroup[] = [
  {
    value: "北美",
    items: [
      { label: "美国东部（弗吉尼亚）", value: "us-east-1" },
      { label: "美国西部（俄勒冈）", value: "us-west-2" },
      { label: "加拿大（中部）", value: "ca-central-1" },
    ],
  },
  {
    value: "欧洲",
    items: [
      { label: "欧盟西部（爱尔兰）", value: "eu-west-1" },
      { label: "欧盟中部（法兰克福）", value: "eu-central-1" },
      { label: "欧盟北部（斯德哥尔摩）", value: "eu-north-1" },
    ],
  },
  {
    value: "亚太",
    items: [
      { label: "亚太东南（新加坡）", value: "ap-southeast-1" },
      { label: "亚太东北（东京）", value: "ap-northeast-1" },
      { label: "亚太南部（孟买）", value: "ap-south-1" },
    ],
  },
];

/** 基础自动补全（Autocomplete），使用扁平字符串列表。 */
export function AutocompleteDemo() {
  return (
    <Autocomplete items={fruits}>
      <Autocomplete.InputGroup placeholder="搜索水果…" />
      <Autocomplete.Content>
        <Autocomplete.List>
          {(item: string) => (
            <Autocomplete.Item key={item} value={item}>
              {item}
            </Autocomplete.Item>
          )}
        </Autocomplete.List>
      </Autocomplete.Content>
    </Autocomplete>
  );
}

/** 带标签、描述文字和 Field 包装器的自动补全。 */
export function AutocompleteWithFieldDemo() {
  const { contains } = Autocomplete.useFilter();

  const filter = useCallback(
    (item: Language, query: string) => contains(item.label, query),
    [contains],
  );

  return (
    <div className="w-80">
      <Autocomplete
        items={languages}
        label="语言"
        description="开始输入以筛选语言"
        filter={filter}
      >
        <Autocomplete.InputGroup placeholder="搜索语言…" />
        <Autocomplete.Content>
          <Autocomplete.List>
            {(item: Language) => (
              <Autocomplete.Item key={item.value} value={item}>
                {item.emoji} {item.label}
              </Autocomplete.Item>
            )}
          </Autocomplete.List>
        </Autocomplete.Content>
      </Autocomplete>
    </div>
  );
}

/** 通过 Field 包装器展示错误状态的自动补全。 */
export function AutocompleteErrorDemo() {
  const { contains } = Autocomplete.useFilter();

  const filter = useCallback(
    (item: Country, query: string) => contains(item.label, query),
    [contains],
  );

  return (
    <div className="w-80">
      <Autocomplete
        items={countries}
        label="国家"
        error={{ message: "请输入有效的国家", match: true }}
        filter={filter}
      >
        <Autocomplete.InputGroup placeholder="搜索国家…" />
        <Autocomplete.Content>
          <Autocomplete.List>
            {(item: Country) => (
              <Autocomplete.Item key={item.code} value={item}>
                {item.label}
              </Autocomplete.Item>
            )}
          </Autocomplete.List>
        </Autocomplete.Content>
      </Autocomplete>
    </div>
  );
}

/** 使用 Group 和 GroupLabel 对条目分组的自动补全。 */
export function AutocompleteGroupedDemo() {
  return (
    <Autocomplete items={servers}>
      <Autocomplete.InputGroup placeholder="选择区域…" />
      <Autocomplete.Content>
        <Autocomplete.List>
          {(group: ServerGroup) => (
            <Autocomplete.Group key={group.value} items={group.items}>
              <Autocomplete.GroupLabel>{group.value}</Autocomplete.GroupLabel>
              <Autocomplete.Collection>
                {(item: ServerLocation) => (
                  <Autocomplete.Item key={item.value} value={item}>
                    {item.label}
                  </Autocomplete.Item>
                )}
              </Autocomplete.Collection>
            </Autocomplete.Group>
          )}
        </Autocomplete.List>
      </Autocomplete.Content>
    </Autocomplete>
  );
}

/** 演示自动补全的四种尺寸变体：xs、sm、base 和 lg。 */
export function AutocompleteSizesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Autocomplete items={fruits.slice(0, 10)}>
        <Autocomplete.InputGroup size="xs" placeholder="xs" />
        <Autocomplete.Content>
          <Autocomplete.List>
            {(item: string) => (
              <Autocomplete.Item key={item} value={item}>
                {item}
              </Autocomplete.Item>
            )}
          </Autocomplete.List>
        </Autocomplete.Content>
      </Autocomplete>
      <Autocomplete items={fruits.slice(0, 10)}>
        <Autocomplete.InputGroup size="sm" placeholder="sm" />
        <Autocomplete.Content>
          <Autocomplete.List>
            {(item: string) => (
              <Autocomplete.Item key={item} value={item}>
                {item}
              </Autocomplete.Item>
            )}
          </Autocomplete.List>
        </Autocomplete.Content>
      </Autocomplete>
      <Autocomplete items={fruits.slice(0, 10)}>
        <Autocomplete.InputGroup size="base" placeholder="base（默认）" />
        <Autocomplete.Content>
          <Autocomplete.List>
            {(item: string) => (
              <Autocomplete.Item key={item} value={item}>
                {item}
              </Autocomplete.Item>
            )}
          </Autocomplete.List>
        </Autocomplete.Content>
      </Autocomplete>
      <Autocomplete items={fruits.slice(0, 10)}>
        <Autocomplete.InputGroup size="lg" placeholder="lg" />
        <Autocomplete.Content>
          <Autocomplete.List>
            {(item: string) => (
              <Autocomplete.Item key={item} value={item}>
                {item}
              </Autocomplete.Item>
            )}
          </Autocomplete.List>
        </Autocomplete.Content>
      </Autocomplete>
    </div>
  );
}

/** 受控自动补全，通过 value 和 onValueChange 驱动。 */
export function AutocompleteControlledDemo() {
  const [value, setValue] = useState("");

  return (
    <div className="flex w-80 flex-col gap-3">
      <Autocomplete
        items={fruits}
        value={value}
        onValueChange={(v) => setValue(v)}
      >
        <Autocomplete.InputGroup placeholder="输入水果名称…" />
        <Autocomplete.Content>
          <Autocomplete.List>
            {(item: string) => (
              <Autocomplete.Item key={item} value={item}>
                {item}
              </Autocomplete.Item>
            )}
          </Autocomplete.List>
        </Autocomplete.Content>
      </Autocomplete>
      {value && (
        <p className="text-sm text-lark-subtle">
          值：<span className="font-medium text-lark-default">{value}</span>
        </p>
      )}
    </div>
  );
}
