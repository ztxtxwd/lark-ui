import { useState } from "react";
import { Select } from "@lark-ui/core";

// ============================================================================
// STRESS TEST: TypeScript Generic Inference
// ============================================================================

interface User {
  id: string;
  name: string;
  email: string;
}

const users: User[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com" },
  { id: "2", name: "Bob Smith", email: "bob@example.com" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com" },
];

/**
 * 测试：在 strictNullChecks 下使用 `value={objectOrNull}`。
 * 该缺陷会导致 T 被推断为 `never`，使回调无法使用。
 */
export function SelectStrictNullChecksDemo() {
  const [selected, setSelected] = useState<User | null>(null);

  return (
    <div className="space-y-4">
      <Select<User>
        label="选择用户（Object | Null）"
        placeholder="请选择用户……"
        value={selected}
        onValueChange={(value) => {
          // This callback should receive User | null, not never
          setSelected(value);
        }}
        renderValue={(user) => (
          <span>
            {user.name} ({user.email})
          </span>
        )}
      >
        {users.map((user) => (
          <Select.Option key={user.id} value={user}>
            {user.name}
          </Select.Option>
        ))}
      </Select>

      <div className="rounded bg-lark-tint p-3 text-sm">
        <strong>已选择：</strong>{" "}
        {selected ? `${selected.name} (${selected.email})` : "无"}
      </div>
    </div>
  );
}

// ============================================================================
// STRESS TEST: renderValue + placeholder interaction
// ============================================================================

interface Country {
  code: string;
  name: string;
  flag: string;
}

const countries: Country[] = [
  { code: "us", name: "美国", flag: "🇺🇸" },
  { code: "uk", name: "英国", flag: "🇬🇧" },
  { code: "de", name: "德国", flag: "🇩🇪" },
  { code: "fr", name: "法国", flag: "🇫🇷" },
  { code: "jp", name: "日本", flag: "🇯🇵" },
];

/**
 * 测试：renderValue 不应传入 null 调用。
 * 未选中任何值时应显示占位符。
 */
export function SelectRenderValuePlaceholderDemo() {
  const [country, setCountry] = useState<Country | null>(null);

  return (
    <div className="space-y-4">
      <Select<Country>
        label="选择国家"
        placeholder="选择国家……"
        value={country}
        onValueChange={setCountry}
        renderValue={(c) => (
          <span>
            {c.flag} {c.name}
          </span>
        )}
      >
        {countries.map((c) => (
          <Select.Option key={c.code} value={c}>
            {c.flag} {c.name}
          </Select.Option>
        ))}
      </Select>

      <div className="rounded bg-lark-tint p-3 text-sm">
        <strong>状态：</strong>{" "}
        {country
          ? `已选择：${country.flag} ${country.name}`
          : "未选择（上方应显示占位符）"}
      </div>
    </div>
  );
}

// ============================================================================
// STRESS TEST: items prop with { label, value } array
// ============================================================================

interface Priority {
  level: number;
  name: string;
  color: string;
}

const priorities: Priority[] = [
  { level: 1, name: "紧急", color: "text-lark-danger" },
  { level: 2, name: "高", color: "text-lark-warning" },
  { level: 3, name: "中", color: "text-lark-default" },
  { level: 4, name: "低", color: "text-lark-subtle" },
];

/**
 * 测试：items 属性传入由 { label, value } 对象组成的数组。
 */
export function SelectItemsArrayDemo() {
  const [priority, setPriority] = useState<Priority | null>(null);

  return (
    <div className="space-y-4">
      <Select<Priority>
        label="优先级（items 数组）"
        placeholder="选择优先级……"
        value={priority}
        onValueChange={setPriority}
        items={priorities.map((p) => ({
          label: (
            <span className={p.color}>
              [{p.level}] {p.name}
            </span>
          ),
          value: p,
        }))}
        renderValue={(p) => (
          <span className={p.color}>
            [{p.level}] {p.name}
          </span>
        )}
      />

      <div className="rounded bg-lark-tint p-3 text-sm">
        <strong>已选择：</strong>{" "}
        {priority ? `等级 ${priority.level}：${priority.name}` : "无"}
      </div>
    </div>
  );
}

// ============================================================================
// STRESS TEST: items prop with object map (string keys)
// ============================================================================

/**
 * 测试：items 属性传入对象映射，并配合 renderValue 使用。
 */
export function SelectItemsObjectMapDemo() {
  const [status, setStatus] = useState<string | null>(null);

  const statusItems = {
    active: "🟢 启用",
    pending: "🟡 待处理",
    inactive: "🔴 未启用",
    archived: { label: "📦 已归档", disabled: true },
  };

  return (
    <div className="space-y-4">
      <Select
        label="状态（对象映射）"
        placeholder="选择状态……"
        value={status}
        onValueChange={setStatus}
        items={statusItems}
      />

      <div className="rounded bg-lark-tint p-3 text-sm">
        <strong>已选择：</strong> {status || "无"}
      </div>
    </div>
  );
}

// ============================================================================
// STRESS TEST: Multiple selection mode
// ============================================================================

/**
 * 测试：使用对象值进行多选。
 */
export function SelectMultipleDemo() {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  return (
    <div className="space-y-4">
      <Select<User, true>
        label="选择用户（多选）"
        placeholder="请选择用户……"
        multiple
        value={selectedUsers}
        onValueChange={setSelectedUsers}
        renderValue={(users) => (
          <span>{users.map((u) => u.name).join("、") || "未选择"}</span>
        )}
      >
        {users.map((user) => (
          <Select.Option key={user.id} value={user}>
            {user.name}
          </Select.Option>
        ))}
      </Select>

      <div className="rounded bg-lark-tint p-3 text-sm">
        <strong>已选择（{selectedUsers.length}）：</strong>{" "}
        {selectedUsers.length > 0
          ? selectedUsers.map((u) => u.name).join("、")
          : "无"}
      </div>
    </div>
  );
}

// ============================================================================
// STRESS TEST: Controlled vs Uncontrolled
// ============================================================================

/**
 * 测试：在受控模式与非受控模式之间切换。
 */
export function SelectControlledVsUncontrolledDemo() {
  const [controlled, setControlled] = useState<string | null>(null);
  const [isControlled, setIsControlled] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isControlled}
            onChange={(e) => setIsControlled(e.target.checked)}
          />
          受控模式
        </label>
      </div>

      {isControlled ? (
        <Select
          label="受控选择器"
          placeholder="选择一种水果……"
          value={controlled}
          onValueChange={setControlled}
          items={{
            apple: "苹果",
            banana: "香蕉",
            cherry: "樱桃",
          }}
        />
      ) : (
        <Select
          label="非受控选择器"
          placeholder="选择一种水果……"
          defaultValue="banana"
          items={{
            apple: "苹果",
            banana: "香蕉",
            cherry: "樱桃",
          }}
        />
      )}

      <div className="rounded bg-lark-tint p-3 text-sm">
        {isControlled ? (
          <>
            <strong>受控值：</strong> {controlled || "无"}
          </>
        ) : (
          <span className="text-lark-subtle">非受控模式 —— 状态由内部管理</span>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// STRESS TEST: Groups and Separators
// ============================================================================

/**
 * 测试：带分隔线的分组选项。
 */
export function SelectGroupedOptionsDemo() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <Select
        label="分组选项"
        placeholder="请选择一个选项……"
        value={selected}
        onValueChange={setSelected}
      >
        <Select.Group>
          <Select.GroupLabel>水果</Select.GroupLabel>
          <Select.Option value="apple">苹果</Select.Option>
          <Select.Option value="banana">香蕉</Select.Option>
          <Select.Option value="cherry">樱桃</Select.Option>
        </Select.Group>
        <Select.Separator />
        <Select.Group>
          <Select.GroupLabel>蔬菜</Select.GroupLabel>
          <Select.Option value="carrot">胡萝卜</Select.Option>
          <Select.Option value="broccoli">西兰花</Select.Option>
          <Select.Option value="spinach">菠菜</Select.Option>
        </Select.Group>
      </Select>

      <div className="rounded bg-lark-tint p-3 text-sm">
        <strong>已选择：</strong> {selected || "无"}
      </div>
    </div>
  );
}

// ============================================================================
// STRESS TEST: Error and Description states
// ============================================================================

/**
 * 测试：Field 同时集成错误与描述。
 * Field 组件将描述和错误视为互斥——存在错误时，它会在界面上取代描述。
 * 该压力测试验证在两种状态之间切换时行为正确。
 */
export function SelectFieldIntegrationDemo() {
  const [value, setValue] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showError}
            onChange={(e) => setShowError(e.target.checked)}
          />
          显示校验错误
        </label>
      </div>

      <Select
        label="必填字段"
        placeholder="此字段为必填项……"
        required
        value={value}
        onValueChange={setValue}
        description="请从列表中选择一个选项。"
        error={showError && !value ? "此字段为必填项" : undefined}
        labelTooltip="这是一个解释该字段的辅助工具提示。"
        items={{
          option1: "选项 1",
          option2: "选项 2",
          option3: "选项 3",
        }}
      />

      <div className="rounded bg-lark-tint p-3 text-sm">
        <strong>值：</strong> {value || "无"} | <strong>有效：</strong>{" "}
        {value ? "是" : "否"}
      </div>
    </div>
  );
}

// ============================================================================
// STRESS TEST: Size variants
// ============================================================================

/**
 * 测试：所有尺寸变体均能正确渲染。
 */
export function SelectSizeVariantsDemo() {
  const items = { a: "选项 A", b: "选项 B", c: "选项 C" };

  return (
    <div className="space-y-4">
      <Select
        size="xs"
        label="极小（xs）"
        placeholder="xs 尺寸"
        items={items}
      />
      <Select size="sm" label="小（sm）" placeholder="sm 尺寸" items={items} />
      <Select
        size="base"
        label="常规（默认）"
        placeholder="base 尺寸"
        items={items}
      />
      <Select size="lg" label="大（lg）" placeholder="lg 尺寸" items={items} />
    </div>
  );
}

// ============================================================================
// STRESS TEST: Loading state
// ============================================================================

/**
 * 测试：加载状态显示骨架屏。
 */
export function SelectLoadingStateDemo() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={loading}
            onChange={(e) => setLoading(e.target.checked)}
          />
          加载状态
        </label>
      </div>

      <Select
        label="数据加载"
        placeholder="加载完成后选择……"
        loading={loading}
        items={{
          data1: "已加载数据 1",
          data2: "已加载数据 2",
          data3: "已加载数据 3",
        }}
      />
    </div>
  );
}

// ============================================================================
// STRESS TEST: Disabled options
// ============================================================================

/**
 * 测试：单个禁用选项。
 */
export function SelectDisabledOptionsDemo() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <Select
        label="包含禁用选项"
        placeholder="请选择一个选项……"
        value={value}
        onValueChange={setValue}
        items={{
          available1: "可用选项 1",
          disabled1: { label: "禁用选项 1", disabled: true },
          available2: "可用选项 2",
          disabled2: { label: "禁用选项 2", disabled: true },
          available3: "可用选项 3",
        }}
      />

      <div className="rounded bg-lark-tint p-3 text-sm">
        <strong>已选择：</strong> {value || "无"}
      </div>
    </div>
  );
}

// ============================================================================
// STRESS TEST: No explicit generic (inference test)
// ============================================================================

/**
 * 测试：不显式指定泛型参数时的 TypeScript 类型推断。
 */
export function SelectInferenceDemo() {
  // No explicit type - should infer from items
  const [value, setValue] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <Select
        label="推断类型"
        placeholder="请选择……"
        value={value}
        onValueChange={(v) => {
          // v should be inferred correctly
          setValue(v);
        }}
        items={{
          foo: "Foo",
          bar: "Bar",
          baz: "Baz",
        }}
      />

      <div className="rounded bg-lark-tint p-3 text-sm">
        <strong>推断值：</strong> {value || "无"}
      </div>
    </div>
  );
}
