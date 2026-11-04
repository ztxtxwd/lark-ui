import { useState } from "react";
import { CaretUpDownIcon } from "@phosphor-icons/react";
import { Combobox, Text, Button } from "@lark-ui/core";
import { languages, type Language } from "./data/languages";

// Basic fruits list for simple demos (expanded to test scrolling)
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
  "柿子",
  "菠萝",
  "李子",
  "石榴",
  "树莓",
  "杨桃",
  "草莓",
  "橘子",
  "西瓜",
];

// Server locations for grouped demo
type ServerLocation = {
  label: string;
  value: string;
};

type ServerLocationGroup = {
  value: string;
  items: ServerLocation[];
};

const servers: ServerLocationGroup[] = [
  {
    value: "亚洲",
    items: [
      { label: "日本", value: "japan" },
      { label: "中国", value: "china" },
      { label: "新加坡", value: "singapore" },
      { label: "韩国", value: "south-korea" },
      { label: "印度", value: "india" },
      { label: "中国香港", value: "hong-kong" },
      { label: "中国台湾", value: "taiwan" },
      { label: "泰国", value: "thailand" },
    ],
  },
  {
    value: "欧洲",
    items: [
      { label: "德国", value: "germany" },
      { label: "法国", value: "france" },
      { label: "意大利", value: "italy" },
      { label: "英国", value: "uk" },
      { label: "荷兰", value: "netherlands" },
      { label: "西班牙", value: "spain" },
      { label: "波兰", value: "poland" },
      { label: "瑞典", value: "sweden" },
    ],
  },
  {
    value: "北美",
    items: [
      { label: "美国（东部）", value: "us-east" },
      { label: "美国（西部）", value: "us-west" },
      { label: "加拿大", value: "canada" },
      { label: "墨西哥", value: "mexico" },
    ],
  },
  {
    value: "南美",
    items: [
      { label: "巴西", value: "brazil" },
      { label: "阿根廷", value: "argentina" },
      { label: "智利", value: "chile" },
    ],
  },
  {
    value: "大洋洲",
    items: [
      { label: "澳大利亚", value: "australia" },
      { label: "新西兰", value: "new-zealand" },
    ],
  },
];

type DatabaseItem = {
  value: string;
  label: string;
};

const databases: DatabaseItem[] = [
  { value: "postgres", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "mariadb", label: "MariaDB" },
  { value: "mongodb", label: "MongoDB" },
  { value: "redis", label: "Redis" },
  { value: "sqlite", label: "SQLite" },
  { value: "cassandra", label: "Apache Cassandra" },
  { value: "dynamodb", label: "Amazon DynamoDB" },
  { value: "couchdb", label: "CouchDB" },
  { value: "neo4j", label: "Neo4j" },
  { value: "elasticsearch", label: "Elasticsearch" },
  { value: "cockroachdb", label: "CockroachDB" },
  { value: "timescaledb", label: "TimescaleDB" },
  { value: "clickhouse", label: "ClickHouse" },
  { value: "firestore", label: "Google Firestore" },
  { value: "supabase", label: "Supabase" },
  { value: "planetscale", label: "PlanetScale" },
  { value: "fauna", label: "Fauna" },
  { value: "d1", label: "Lark Base" },
  { value: "turso", label: "Turso" },
];

const databaseItems = Combobox.createItems(databases, {
  getValue: (database) => database.value,
  getLabel: (database) => database.label,
});

// Basic demo with TriggerInput
export function ComboboxDemo() {
  const [value, setValue] = useState<string | null>("苹果");

  return (
    <Combobox
      value={value}
      onValueChange={(v) => setValue(v as string | null)}
      items={fruits}
    >
      <Combobox.TriggerInput placeholder="请选择" />
      <Combobox.Content>
        <Combobox.Empty />
        <Combobox.List>
          {(item: string) => (
            <Combobox.Item key={item} value={item}>
              {item}
            </Combobox.Item>
          )}
        </Combobox.List>
      </Combobox.Content>
    </Combobox>
  );
}

/** 演示从应用对象派生组合框（Combobox）的值和标签。 */
export function ComboboxCreateItemsDemo() {
  const [value, setValue] = useState<DatabaseItem | null>(null);

  return (
    <Combobox
      value={value}
      onValueChange={(nextValue) => setValue(nextValue as DatabaseItem | null)}
      items={databaseItems}
    >
      <Combobox.TriggerValue className="w-[240px]" placeholder="选择数据库" />
      <Combobox.Content>
        <Combobox.Input placeholder="搜索数据库" />
        <Combobox.Empty>未找到数据库。</Combobox.Empty>
        <Combobox.List>
          {(database: DatabaseItem) => (
            <Combobox.Item key={database.value} value={database}>
              {database.label}
            </Combobox.Item>
          )}
        </Combobox.List>
      </Combobox.Content>
    </Combobox>
  );
}

// Searchable inside popup with TriggerValue
export function ComboboxSearchableInsideDemo() {
  const [value, setValue] = useState<Language>(languages[0]);

  return (
    <Combobox
      value={value}
      onValueChange={(v) => setValue(v as Language)}
      items={languages}
    >
      <Combobox.TriggerValue className="w-[200px]" />
      <Combobox.Content>
        <Combobox.Input placeholder="搜索语言" />
        <Combobox.Empty />
        <Combobox.List>
          {(item: Language) => (
            <Combobox.Item key={item.value} value={item}>
              {item.emoji} {item.label}
            </Combobox.Item>
          )}
        </Combobox.List>
      </Combobox.Content>
    </Combobox>
  );
}

/** 演示使用带占位符的 TriggerValue，行为类似可搜索的选择器字段。
 * 在选中某个值之前始终显示占位符。 */
export function ComboboxSearchableSelectDemo() {
  const [value, setValue] = useState<Language | null>(null);

  return (
    <Combobox
      value={value}
      onValueChange={(v) => setValue(v as Language | null)}
      items={languages}
    >
      <Combobox.TriggerValue className="w-[200px]" placeholder="选择语言" />
      <Combobox.Content>
        <Combobox.Input placeholder="搜索语言" />
        <Combobox.Empty />
        <Combobox.List>
          {(item: Language) => (
            <Combobox.Item key={item.value} value={item}>
              {item.emoji} {item.label}
            </Combobox.Item>
          )}
        </Combobox.List>
      </Combobox.Content>
    </Combobox>
  );
}

// Grouped items demo
export function ComboboxGroupedDemo() {
  const [value, setValue] = useState<ServerLocation | null>(null);

  return (
    <Combobox
      value={value}
      onValueChange={(v) => setValue(v as ServerLocation | null)}
      items={servers}
    >
      <Combobox.TriggerInput className="w-[200px]" placeholder="选择服务器" />
      <Combobox.Content>
        <Combobox.Empty />
        <Combobox.List>
          {(group: ServerLocationGroup) => (
            <Combobox.Group key={group.value} items={group.items}>
              <Combobox.GroupLabel>{group.value}</Combobox.GroupLabel>
              <Combobox.Collection>
                {(item: ServerLocation) => (
                  <Combobox.Item key={item.value} value={item}>
                    {item.label}
                  </Combobox.Item>
                )}
              </Combobox.Collection>
            </Combobox.Group>
          )}
        </Combobox.List>
      </Combobox.Content>
    </Combobox>
  );
}

type BotItem = {
  value: string;
  label: string;
  author: string;
};

const bots: BotItem[] = [
  { value: "googlebot", label: "Googlebot", author: "Google" },
  { value: "bingbot", label: "Bingbot", author: "Microsoft" },
  { value: "yandexbot", label: "YandexBot", author: "Yandex" },
  { value: "duckduckbot", label: "DuckDuckBot", author: "DuckDuckGo" },
  { value: "baiduspider", label: "Baiduspider", author: "Baidu" },
  { value: "slurp", label: "Yahoo Slurp", author: "Yahoo" },
  { value: "applebot", label: "Applebot", author: "Apple" },
  { value: "facebookbot", label: "Facebookbot", author: "Meta" },
  { value: "twitterbot", label: "Twitterbot", author: "X" },
  { value: "linkedinbot", label: "LinkedInBot", author: "LinkedIn" },
  { value: "pinterestbot", label: "Pinterest", author: "Pinterest" },
  { value: "discordbot", label: "Discordbot", author: "Discord" },
  { value: "slackbot", label: "Slackbot", author: "Slack" },
  { value: "telegrambot", label: "TelegramBot", author: "Telegram" },
  { value: "whatsapp", label: "WhatsApp", author: "Meta" },
  { value: "semrushbot", label: "SemrushBot", author: "Semrush" },
  { value: "ahrefsbot", label: "AhrefsBot", author: "Ahrefs" },
  { value: "mj12bot", label: "MJ12bot", author: "Majestic" },
  { value: "dotbot", label: "DotBot", author: "Moz" },
  { value: "petalbot", label: "PetalBot", author: "Huawei" },
];

export function ComboboxMultipleDemo() {
  const [value, setValue] = useState<BotItem[]>([]);

  return (
    <div className="flex gap-2">
      <Combobox
        value={value}
        onValueChange={setValue}
        items={bots}
        isItemEqualToValue={(bot: BotItem, selected: BotItem) =>
          bot.value === selected.value
        }
        multiple
      >
        <Combobox.TriggerMultipleWithInput
          className="w-[400px]"
          placeholder="选择机器人"
          renderItem={(selected: BotItem) => (
            <Combobox.Chip key={selected.value}>{selected.label}</Combobox.Chip>
          )}
          inputSide="right"
        />
        <Combobox.Content className="max-h-[200px] min-w-auto overflow-y-auto">
          <Combobox.Empty />
          <Combobox.List>
            {(item: BotItem) => (
              <Combobox.Item key={item.value} value={item}>
                <div className="flex gap-2">
                  <Text>{item.label}</Text>
                  <Text variant="secondary">{item.author}</Text>
                </div>
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
      <Button variant="primary">提交</Button>
    </div>
  );
}

export function ComboboxWithFieldDemo() {
  const [value, setValue] = useState<DatabaseItem | null>(null);

  return (
    <div className="w-80">
      <Combobox
        items={databases}
        value={value}
        onValueChange={setValue}
        label="数据库"
        description="选择你偏好的数据库"
      >
        <Combobox.TriggerInput placeholder="选择数据库" />
        <Combobox.Content>
          <Combobox.Empty />
          <Combobox.List>
            {(item: DatabaseItem) => (
              <Combobox.Item key={item.value} value={item}>
                {item.label}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
    </div>
  );
}

export function ComboboxDisabledDemo() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <Combobox value="苹果" items={fruits} disabled>
        <Combobox.TriggerInput className="w-[200px]" placeholder="选择水果" />
        <Combobox.Content>
          <Combobox.Empty />
          <Combobox.List>
            {(item: string) => (
              <Combobox.Item key={item} value={item}>
                {item}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>

      <Combobox value={languages[0]} items={languages} disabled>
        <Combobox.TriggerValue className="w-[200px]" />
        <Combobox.Content>
          <Combobox.Input placeholder="搜索" />
          <Combobox.Empty />
          <Combobox.List>
            {(item: Language) => (
              <Combobox.Item key={item.value} value={item}>
                {item.emoji} {item.label}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
    </div>
  );
}

/** 演示禁用单个条目。`Combobox.Item` 上的 `disabled` 属性会阻止点击和键盘选择，
 * 并以弱化文字和禁止光标渲染该行。适用于展示存在但用户无法选择的选项
 * （例如受权限限制、只读或已在别处使用）。 */
export function ComboboxDisabledItemsDemo() {
  type DatabaseItemWithDisabled = DatabaseItem & {
    disabled?: boolean;
    reason?: string;
  };

  const items: DatabaseItemWithDisabled[] = [
    { value: "postgres", label: "PostgreSQL" },
    { value: "mysql", label: "MySQL" },
    { value: "mariadb", label: "MariaDB", disabled: true, reason: "Beta" },
    { value: "mongodb", label: "MongoDB" },
    {
      value: "cassandra",
      label: "Apache Cassandra",
      disabled: true,
      reason: "即将推出",
    },
    { value: "redis", label: "Redis" },
    { value: "d1", label: "Lark Base" },
  ];

  const [value, setValue] = useState<DatabaseItemWithDisabled | null>(null);

  return (
    <div className="w-80">
      <Combobox value={value} onValueChange={setValue} items={items}>
        <Combobox.TriggerInput placeholder="选择数据库" />
        <Combobox.Content>
          <Combobox.Empty />
          <Combobox.List>
            {(item: DatabaseItemWithDisabled) => (
              <Combobox.Item
                key={item.value}
                value={item}
                disabled={item.disabled}
              >
                <span>
                  {item.label}
                  {item.reason && (
                    <Text variant="secondary" size="xs" as="span">
                      {" — "}
                      {item.reason}
                    </Text>
                  )}
                </span>
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
    </div>
  );
}

export function ComboboxErrorDemo() {
  const [value, setValue] = useState<DatabaseItem | null>(null);

  return (
    <div className="w-80">
      <Combobox
        items={databases}
        value={value}
        onValueChange={setValue}
        label="数据库"
        error={{ message: "请选择一个数据库", match: true }}
      >
        <Combobox.TriggerInput placeholder="选择数据库" />
        <Combobox.Content>
          <Combobox.Empty />
          <Combobox.List>
            {(item: DatabaseItem) => (
              <Combobox.Item key={item.value} value={item}>
                {item.label}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
    </div>
  );
}

/** 演示组合框的不同尺寸变体：xs、sm、base 和 lg。 */
export function ComboboxSizesDemo() {
  const [smValue, setSmValue] = useState<string | null>(null);
  const [baseValue, setBaseValue] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Combobox
        size="sm"
        value={smValue}
        onValueChange={(v) => setSmValue(v as string | null)}
        items={fruits.slice(0, 8)}
      >
        <Combobox.TriggerInput placeholder="小（sm）" />
        <Combobox.Content>
          <Combobox.Empty />
          <Combobox.List>
            {(item: string) => (
              <Combobox.Item key={item} value={item}>
                {item}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
      <Combobox
        size="base"
        value={baseValue}
        onValueChange={(v) => setBaseValue(v as string | null)}
        items={fruits.slice(0, 8)}
      >
        <Combobox.TriggerInput placeholder="标准（默认）" />
        <Combobox.Content>
          <Combobox.Empty />
          <Combobox.List>
            {(item: string) => (
              <Combobox.Item key={item} value={item}>
                {item}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
    </div>
  );
}

/** 演示组合框使用 TriggerValue（内部可搜索）时的尺寸变体。 */
export function ComboboxSizesSearchableInsideDemo() {
  const [smValue, setSmValue] = useState<Language>(languages[0]);
  const [baseValue, setBaseValue] = useState<Language>(languages[1]);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Combobox
        size="sm"
        value={smValue}
        onValueChange={(v) => setSmValue(v as Language)}
        items={languages}
      >
        <Combobox.TriggerValue className="w-[160px]" />
        <Combobox.Content>
          <Combobox.Input placeholder="搜索" />
          <Combobox.Empty />
          <Combobox.List>
            {(item: Language) => (
              <Combobox.Item key={item.value} value={item}>
                {item.emoji} {item.label}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
      <Combobox
        size="base"
        value={baseValue}
        onValueChange={(v) => setBaseValue(v as Language)}
        items={languages}
      >
        <Combobox.TriggerValue className="w-[180px]" />
        <Combobox.Content>
          <Combobox.Input placeholder="搜索" />
          <Combobox.Empty />
          <Combobox.List>
            {(item: Language) => (
              <Combobox.Item key={item.value} value={item}>
                {item.emoji} {item.label}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
    </div>
  );
}

export function ComboboxCustomTriggerDemo() {
  const [value, setValue] = useState<Language>(languages[0]);

  return (
    <Combobox
      value={value}
      onValueChange={(v) => setValue(v as Language)}
      items={languages}
    >
      <Combobox.Trigger render={<Button variant="ghost" size="sm" />}>
        <Combobox.Value>
          <span className="truncate">
            {value.emoji} {value.label}
          </span>
        </Combobox.Value>
        <CaretUpDownIcon size={14} className="shrink-0 text-lark-subtle" />
      </Combobox.Trigger>
      <Combobox.Content>
        <Combobox.Input placeholder="搜索语言" />
        <Combobox.Empty />
        <Combobox.List>
          {(item: Language) => (
            <Combobox.Item key={item.value} value={item}>
              {item.emoji} {item.label}
            </Combobox.Item>
          )}
        </Combobox.List>
      </Combobox.Content>
    </Combobox>
  );
}
