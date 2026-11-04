import { useRef, useState } from "react";
import { InputGroup, Loader } from "@lark-ui/core";
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  LinkIcon,
  QuestionIcon,
  XIcon,
} from "@phosphor-icons/react";

export function InputGroupDemo() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">(
    "success",
  );
  const [value, setValue] = useState("lark");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;

    setValue(next);

    if (timerRef.current) clearTimeout(timerRef.current);

    if (next.length > 0) {
      setStatus("loading");

      timerRef.current = setTimeout(() => setStatus("success"), 1500);
    } else {
      setStatus("idle");
    }
  };

  return (
    <div className="w-full max-w-2xs">
      <InputGroup>
        <InputGroup.Input
          maxLength={20}
          onChange={handleChange}
          value={value}
        />
        <InputGroup.Suffix>.workers.dev</InputGroup.Suffix>
        {status !== "idle" && (
          <InputGroup.Addon align="end">
            {status === "loading" ? (
              <Loader />
            ) : (
              <CheckCircleIcon weight="duotone" className="text-lark-success" />
            )}
          </InputGroup.Addon>
        )}
      </InputGroup>
    </div>
  );
}

export function InputGroupIconsDemo() {
  return (
    <InputGroup className="w-full max-w-3xs">
      <InputGroup.Addon>
        <LinkIcon />
      </InputGroup.Addon>
      <InputGroup.Input placeholder="粘贴链接…" aria-label="链接" />
    </InputGroup>
  );
}

export function InputGroupTextDemo() {
  return (
    <div className="flex flex-col gap-4">
      <InputGroup className="w-full max-w-3xs">
        <InputGroup.Addon>@</InputGroup.Addon>
        <InputGroup.Input placeholder="用户名" aria-label="用户名" />
      </InputGroup>

      <InputGroup className="w-full max-w-3xs">
        <InputGroup.Input placeholder="邮箱" aria-label="邮箱" />
        <InputGroup.Addon align="end">@example.com</InputGroup.Addon>
      </InputGroup>

      <InputGroup className="w-full max-w-3xs">
        <InputGroup.Addon>/api/</InputGroup.Addon>
        <InputGroup.Input placeholder="端点" aria-label="API 路径" />
        <InputGroup.Addon align="end">.json</InputGroup.Addon>
      </InputGroup>
    </div>
  );
}

export function InputGroupButtonsDemo() {
  const [show, setShow] = useState(false);
  const [searchValue, setSearchValue] = useState("search");

  return (
    <div className="flex flex-col gap-4">
      <InputGroup className="w-full max-w-3xs">
        <InputGroup.Input
          type={show ? "text" : "password"}
          defaultValue="password"
          aria-label="密码"
        />
        <InputGroup.Addon align="end">
          <InputGroup.Button
            shape="square"
            className="text-lark-subtle"
            icon={show ? EyeSlashIcon : EyeIcon}
            aria-label={show ? "隐藏密码" : "显示密码"}
            onClick={() => setShow(!show)}
          />
        </InputGroup.Addon>
      </InputGroup>

      <InputGroup className="w-full max-w-3xs">
        <InputGroup.Addon>
          <MagnifyingGlassIcon />
        </InputGroup.Addon>
        <InputGroup.Input
          value={searchValue}
          placeholder="搜索"
          aria-label="搜索"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {searchValue && (
          <InputGroup.Addon align="end" className="pr-1">
            <InputGroup.Button
              shape="square"
              icon={XIcon}
              aria-label="清除搜索"
              onClick={() => setSearchValue("")}
            />
          </InputGroup.Addon>
        )}
        <InputGroup.Button variant="secondary" onClick={() => {}}>
          搜索
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
}

export function InputGroupTooltipButtonDemo() {
  return (
    <InputGroup className="w-full max-w-2xs">
      <InputGroup.Addon>
        <MagnifyingGlassIcon />
      </InputGroup.Addon>
      <InputGroup.Input placeholder="使用查询语言搜索…" aria-label="搜索" />
      <InputGroup.Addon align="end">
        <InputGroup.Button
          shape="square"
          className="text-lark-subtle"
          icon={QuestionIcon}
          aria-label="查询语言帮助"
          tooltip="查询语言帮助"
          onClick={() => {}}
        />
      </InputGroup.Addon>
    </InputGroup>
  );
}

export function InputGroupKbdDemo() {
  return (
    <InputGroup className="w-full max-w-3xs">
      <InputGroup.Addon>
        <MagnifyingGlassIcon />
      </InputGroup.Addon>
      <InputGroup.Input placeholder="搜索…" aria-label="搜索" />
      <InputGroup.Addon align="end">
        <kbd className="border-none! bg-none!">⌘K</kbd>
      </InputGroup.Addon>
    </InputGroup>
  );
}

export function InputGroupLoadingDemo() {
  return (
    <InputGroup className="w-full max-w-3xs">
      <InputGroup.Input defaultValue="lark" aria-label="lark" />
      <InputGroup.Addon align="end">
        <Loader />
      </InputGroup.Addon>
    </InputGroup>
  );
}

export function InputGroupSuffixDemo() {
  return (
    <div className="flex w-full max-w-2xs flex-col gap-4">
      <InputGroup label="子域名">
        <InputGroup.Input
          aria-label="子域名"
          defaultValue="lark"
          maxLength={20}
        />
        <InputGroup.Suffix>.workers.dev</InputGroup.Suffix>
        <InputGroup.Addon align="end">
          <CheckCircleIcon weight="duotone" className="text-lark-success" />
        </InputGroup.Addon>
      </InputGroup>

      <InputGroup
        label="子域名"
        error={{ message: "该子域名不可用", match: true }}
      >
        <InputGroup.Input
          aria-label="子域名"
          defaultValue="lark"
          maxLength={20}
        />
        <InputGroup.Suffix>.workers.dev</InputGroup.Suffix>
        <InputGroup.Addon align="end">
          <XCircleIcon weight="duotone" className="text-lark-danger" />
        </InputGroup.Addon>
      </InputGroup>
    </div>
  );
}

export function InputGroupSizesDemo() {
  return (
    <div className="flex w-full max-w-3xs flex-col gap-4">
      <InputGroup size="xs" label="超小">
        <InputGroup.Addon>
          <MagnifyingGlassIcon />
        </InputGroup.Addon>
        <InputGroup.Input placeholder="超小尺寸输入框" />
        <InputGroup.Addon align="end">
          <InputGroup.Button
            className="text-lark-subtle"
            icon={QuestionIcon}
            shape="square"
            aria-label="帮助"
          />
        </InputGroup.Addon>
      </InputGroup>

      <InputGroup size="sm" label="小">
        <InputGroup.Addon>
          <MagnifyingGlassIcon />
        </InputGroup.Addon>
        <InputGroup.Input placeholder="小尺寸输入框" />
        <InputGroup.Addon align="end">
          <InputGroup.Button
            className="text-lark-subtle"
            icon={QuestionIcon}
            shape="square"
            aria-label="帮助"
          />
        </InputGroup.Addon>
      </InputGroup>

      <InputGroup label="基础（默认）">
        <InputGroup.Addon>
          <MagnifyingGlassIcon />
        </InputGroup.Addon>
        <InputGroup.Input placeholder="基础尺寸输入框" />
        <InputGroup.Addon align="end">
          <InputGroup.Button
            className="text-lark-subtle"
            icon={QuestionIcon}
            shape="square"
            aria-label="帮助"
          />
        </InputGroup.Addon>
      </InputGroup>

      <InputGroup size="lg" label="大">
        <InputGroup.Addon>
          <MagnifyingGlassIcon />
        </InputGroup.Addon>
        <InputGroup.Input placeholder="大尺寸输入框" />
        <InputGroup.Addon align="end">
          <InputGroup.Button
            className="text-lark-subtle"
            icon={QuestionIcon}
            shape="square"
            aria-label="帮助"
          />
        </InputGroup.Addon>
      </InputGroup>
    </div>
  );
}

export function InputGroupStatesDemo() {
  const [show, setShow] = useState(false);

  return (
    <div className="flex w-full max-w-3xs flex-col gap-4">
      <InputGroup
        label="错误状态"
        error={{ message: "请输入有效的邮箱地址", match: true }}
      >
        <InputGroup.Input type="email" defaultValue="invalid-email" />
        <InputGroup.Addon align="end">@example.com</InputGroup.Addon>
      </InputGroup>

      <InputGroup label="禁用" disabled>
        <InputGroup.Addon>
          <MagnifyingGlassIcon />
        </InputGroup.Addon>
        <InputGroup.Input placeholder="搜索…" />
      </InputGroup>

      <InputGroup label="可选字段" required={false}>
        <InputGroup.Addon>$</InputGroup.Addon>
        <InputGroup.Input placeholder="0.00" />
      </InputGroup>

      <InputGroup
        label="带描述"
        description="至少需要 8 个字符"
        labelTooltip="你的密码会被安全存储"
      >
        <InputGroup.Input
          type={show ? "text" : "password"}
          placeholder="密码"
        />
        <InputGroup.Addon align="end">
          <InputGroup.Button
            shape="square"
            className="text-lark-subtle"
            icon={show ? EyeSlashIcon : EyeIcon}
            aria-label={show ? "隐藏密码" : "显示密码"}
            onClick={() => setShow(!show)}
          />
        </InputGroup.Addon>
      </InputGroup>
    </div>
  );
}
