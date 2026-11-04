import { useState } from "react";
import { DropdownMenu, Button } from "@lark-ui/core";
import {
  PlusIcon,
  UserIcon,
  CreditCardIcon,
  MoonIcon,
  SignOutIcon,
  GearIcon,
  BookOpenIcon,
  ArrowSquareOutIcon,
  ArrowsClockwiseIcon,
  CopyIcon,
  PencilSimpleIcon,
  TrashIcon,
  GlobeIcon,
  ClockIcon,
} from "@phosphor-icons/react";

export function DropdownBasicDemo() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger render={<Button icon={PlusIcon}>添加</Button>} />
      <DropdownMenu.Content>
        <DropdownMenu.Item>Worker</DropdownMenu.Item>
        <DropdownMenu.Item>Pages</DropdownMenu.Item>
        <DropdownMenu.Item>KV 命名空间</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

const languages = [
  { code: "de", label: "Deutsch" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
  { code: "ko", label: "한국어" },
  { code: "ja", label: "日本語" },
  { code: "zh-CN", label: "简体中文" },
  { code: "zh-TW", label: "繁體中文" },
];

const timezones = [
  { value: "America/Los_Angeles", label: "太平洋时间（PT）" },
  { value: "America/Denver", label: "山地时间（MT）" },
  { value: "America/Chicago", label: "中部时间（CT）" },
  { value: "America/New_York", label: "东部时间（ET）" },
  { value: "Europe/London", label: "格林尼治标准时间（GMT）" },
  { value: "Europe/Paris", label: "中欧时间（CET）" },
  { value: "Asia/Tokyo", label: "日本标准时间（JST）" },
];

export function DropdownCheckboxDemo() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger render={<Button>查看选项</Button>} />
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Label>显示</DropdownMenu.Label>
          <DropdownMenu.CheckboxItem
            checked={showSidebar}
            onCheckedChange={setShowSidebar}
          >
            显示侧边栏
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem
            checked={showLineNumbers}
            onCheckedChange={setShowLineNumbers}
          >
            显示行号
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem
            checked={wordWrap}
            onCheckedChange={setWordWrap}
          >
            自动换行
          </DropdownMenu.CheckboxItem>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

export function DropdownNestedDemo() {
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("America/Los_Angeles");

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger render={<Button icon={UserIcon}>账户</Button>} />
      <DropdownMenu.Content>
        <DropdownMenu.Item icon={UserIcon}>个人资料</DropdownMenu.Item>
        <DropdownMenu.Item icon={CreditCardIcon}>账单</DropdownMenu.Item>
        <DropdownMenu.Item icon={MoonIcon}>深色模式</DropdownMenu.Item>

        {/* Language submenu with RadioGroup */}
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger icon={GlobeIcon}>
            语言
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Group>
              <DropdownMenu.RadioGroup
                value={language}
                onValueChange={setLanguage}
              >
                {languages.map((lang) => (
                  <DropdownMenu.RadioItem key={lang.code} value={lang.code}>
                    {lang.label}
                    <DropdownMenu.RadioItemIndicator />
                  </DropdownMenu.RadioItem>
                ))}
              </DropdownMenu.RadioGroup>
            </DropdownMenu.Group>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>

        {/* Timezone submenu with RadioGroup */}
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger icon={<ClockIcon weight="duotone" />}>
            设置时区
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Group>
              <DropdownMenu.RadioGroup
                value={timezone}
                onValueChange={setTimezone}
              >
                {timezones.map((tz) => (
                  <DropdownMenu.RadioItem key={tz.value} value={tz.value}>
                    {tz.label}
                    <DropdownMenu.RadioItemIndicator />
                  </DropdownMenu.RadioItem>
                ))}
              </DropdownMenu.RadioGroup>
            </DropdownMenu.Group>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>

        <DropdownMenu.Separator />
        <DropdownMenu.Item icon={SignOutIcon} variant="danger">
          退出登录
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

/**
 * 当同一菜单中的其他条目带有图标时，无图标的条目会自动缩进，
 * 使文字对齐。
 */
export function DropdownInsetDemo() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger render={<Button>编辑</Button>} />
      <DropdownMenu.Content>
        <DropdownMenu.Item icon={PencilSimpleIcon}>重命名</DropdownMenu.Item>
        <DropdownMenu.Item icon={CopyIcon}>创建副本</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>移动到文件夹</DropdownMenu.Item>
        <DropdownMenu.Item>添加到收藏夹</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item icon={TrashIcon} variant="danger">
          删除
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

/**
 * 在 `DropdownMenu.Item` 上使用 `onClick` 处理条目操作。
 * 每个条目都会收到标准的 React 鼠标事件处理函数。
 */
export function DropdownOnClickDemo() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-start gap-2">
      <DropdownMenu>
        <DropdownMenu.Trigger render={<Button>操作</Button>} />
        <DropdownMenu.Content>
          <DropdownMenu.Item
            icon={CopyIcon}
            onClick={() => setLastAction("已创建副本")}
          >
            创建副本
          </DropdownMenu.Item>
          <DropdownMenu.Item
            icon={PencilSimpleIcon}
            onClick={() => setLastAction("已重命名")}
          >
            重命名
          </DropdownMenu.Item>
          <DropdownMenu.Item
            icon={<ArrowsClockwiseIcon className="animate-spin" />}
            onClick={() => setLastAction("已刷新")}
          >
            刷新
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item
            icon={TrashIcon}
            variant="danger"
            onClick={() => setLastAction("已删除")}
          >
            删除
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      {lastAction && (
        <p className="text-sm text-lark-subtle">
          最近操作：<span className="text-lark-default">{lastAction}</span>
        </p>
      )}
    </div>
  );
}

/**
 * 演示结合 render 属性与 children 组合出包含其他元素的自定义触发器。
 * render 属性提供触发器元素，children 则渲染在其内部。
 */
export function DropdownAvatarTriggerDemo() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger
        render={<button type="button" className="rounded-full" />}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lark-brand text-sm font-medium text-white">
          MR
        </span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item icon={UserIcon}>个人资料</DropdownMenu.Item>
        <DropdownMenu.Item icon={GearIcon}>设置</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item icon={SignOutIcon} variant="danger">
          退出登录
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

/**
 * 包含超长条目列表的下拉菜单，用于演示最大高度行为——当内容超出可用视口空间时
 * 会滚动显示。
 */
export function DropdownLongListDemo() {
  const items = Array.from({ length: 30 }, (_, i) => `选项 ${i + 1}`);

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger render={<Button>打开长列表</Button>} />
      <DropdownMenu.Content>
        {items.map((item) => (
          <DropdownMenu.Item key={item}>{item}</DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
/**
 * 演示用于导航链接的 LinkItem 组件。
 * 使用带 href 的 Item 时改用 LinkItem，可获得更简洁、语义更明确的链接。
 */
export function DropdownLinkItemDemo() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger render={<Button>资源</Button>} />
      <DropdownMenu.Content>
        <DropdownMenu.LinkItem href="/settings" icon={GearIcon}>
          设置
        </DropdownMenu.LinkItem>
        <DropdownMenu.LinkItem href="/docs" icon={BookOpenIcon}>
          文档
        </DropdownMenu.LinkItem>
        <DropdownMenu.Separator />
        <DropdownMenu.LinkItem
          href="https://developers.cloudflare.com"
          target="_blank"
          icon={ArrowSquareOutIcon}
        >
          开发者文档
        </DropdownMenu.LinkItem>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
