import { useState } from "react";
import { SensitiveInput, Button } from "@lark-ui/core";

export function SensitiveInputDemo() {
  return (
    <div className="w-80">
      <SensitiveInput label="API 密钥" defaultValue="sk_live_abc123xyz789" />
    </div>
  );
}

export function SensitiveInputSizesDemo() {
  const sizes = ["xs", "sm", "base", "lg"] as const;
  return (
    <div className="flex flex-col gap-4">
      {sizes.map((size) => (
        <div key={size} className="flex items-center gap-2">
          <span className="w-12 text-sm text-lark-subtle">{size}</span>
          <SensitiveInput
            label={`${size} 尺寸`}
            size={size}
            defaultValue="secret-api-key-123"
          />
        </div>
      ))}
    </div>
  );
}

export function SensitiveInputControlledDemo() {
  const [value, setValue] = useState("my-secret-value");

  return (
    <div className="flex w-80 flex-col gap-4">
      <SensitiveInput label="受控密钥" value={value} onValueChange={setValue} />
      <div className="text-sm text-lark-subtle">
        当前值：<code className="text-lark-default">{value}</code>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => setValue("new-secret-" + Date.now())}
          variant="primary"
          size="sm"
        >
          修改值
        </Button>
        <Button onClick={() => setValue("")} variant="secondary" size="sm">
          清空
        </Button>
      </div>
    </div>
  );
}

export function SensitiveInputStatesDemo() {
  return (
    <div className="flex w-80 flex-col gap-4">
      <SensitiveInput
        label="错误状态"
        variant="error"
        defaultValue="invalid-key"
        error="此 API 密钥无效"
      />
      <SensitiveInput label="禁用" defaultValue="cannot-edit" disabled />
      <SensitiveInput
        label="只读"
        defaultValue="view-only-secret-key"
        readOnly
      />
      <SensitiveInput
        label="带说明"
        defaultValue="my-secret-value"
        description="请妥善保管此值，不要分享"
      />
    </div>
  );
}
