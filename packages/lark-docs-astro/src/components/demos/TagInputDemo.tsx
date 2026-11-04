import { useState } from "react";
import { Button, TagInput } from "@lark-ui/core";

export function TagInputDemo() {
  const [recipients, setRecipients] = useState(["ava@cloudflare.com"]);
  return (
    <TagInput
      label="收件人"
      description="粘贴以逗号或换行分隔的电子邮件地址。"
      placeholder="name@example.com"
      autoComplete="off"
      value={recipients}
      onValueChange={setRecipients}
      validateValue={(value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)}
    />
  );
}

export function TagInputUnrestrictedDemo() {
  return (
    <TagInput
      defaultValue={["frontend", "priority"]}
      label="标签"
      description="接受任意非空值。"
      placeholder="添加标签"
    />
  );
}

export function TagInputLimitedDemo() {
  return (
    <TagInput
      defaultValue={["alpha"]}
      label="访问组"
      maxValues={3}
      description="最多三个组。"
      placeholder="输入组名"
    />
  );
}

/** 每个标签都会作为独立的表单值提交，`required` 校验跟随标签生效。 */
export function TagInputFormDemo() {
  const [submitted, setSubmitted] = useState<string[] | null>(null);

  return (
    <form
      className="flex w-full max-w-md flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setSubmitted(data.getAll("topics").map(String));
      }}
    >
      <TagInput
        name="topics"
        required
        label="主题"
        description="至少添加一个主题，然后提交。"
        placeholder="添加主题"
      />
      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary">
          提交
        </Button>
        {submitted ? (
          <code className="text-sm text-lark-subtle">
            topics: {JSON.stringify(submitted)}
          </code>
        ) : null}
      </div>
    </form>
  );
}

export function TagInputReadOnlyDemo() {
  return (
    <TagInput
      readOnly
      defaultValue={["billing", "dns", "workers"]}
      label="已分配团队"
      description="由你所在组织的管理员管理。"
    />
  );
}

export function TagInputLocalizationDemo() {
  return (
    <TagInput
      defaultValue={["uno"]}
      label="Etiquetas"
      labels={{
        input: "Agregar etiqueta",
        removeValue: (value) => `Eliminar ${value}`,
        invalidValue: (value) => `${value} no es valido.`,
        maxValuesReached: (maxValues) => `Maximo de ${maxValues} etiquetas.`,
      }}
      maxValues={3}
      placeholder="Agregar una etiqueta"
    />
  );
}
