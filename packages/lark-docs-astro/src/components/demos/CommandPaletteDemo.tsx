import { useState } from "react";
import { CommandPalette, Button } from "@lark-ui/core";
import {
  GearIcon,
  FileIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  HouseIcon,
  ChartLineIcon,
  UsersIcon,
} from "@phosphor-icons/react";

// Types for our demo data
interface CommandItem {
  id: string;
  title: string;
  icon?: React.ReactNode;
}

interface CommandGroup {
  id: string;
  label: string;
  items: CommandItem[];
}

// Sample data
const sampleGroups: CommandGroup[] = [
  {
    id: "commands",
    label: "命令",
    items: [
      {
        id: "new-project",
        title: "新建项目",
        icon: <FolderIcon size={16} />,
      },
      { id: "settings", title: "打开设置", icon: <GearIcon size={16} /> },
      {
        id: "search",
        title: "搜索文件",
        icon: <MagnifyingGlassIcon size={16} />,
      },
    ],
  },
  {
    id: "pages",
    label: "页面",
    items: [
      { id: "home", title: "首页", icon: <HouseIcon size={16} /> },
      {
        id: "dashboard",
        title: "仪表盘",
        icon: <ChartLineIcon size={16} />,
      },
      { id: "users", title: "用户", icon: <UsersIcon size={16} /> },
    ],
  },
];

// Helper to flatten groups into selectable items
const getSelectableItems = (groups: CommandGroup[]) =>
  groups.flatMap((group) => group.items);

// Helper to filter groups and their items based on search query
const filterGroupsWithItems = (
  groups: CommandGroup[],
  query: string,
): CommandGroup[] => {
  if (!query) return groups;
  const lowerQuery = query.toLowerCase();
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.title.toLowerCase().includes(lowerQuery),
      ),
    }))
    .filter((group) => group.items.length > 0);
};

export function CommandPaletteBasicDemo() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleSelect = (item: CommandItem) => {
    setSelectedItem(item.title);
    setOpen(false);
    setSearch("");
  };

  // Filter groups based on search
  const filteredGroups = filterGroupsWithItems(sampleGroups, search);

  return (
    <div className="flex flex-col items-start gap-4">
      <Button onClick={() => setOpen(true)}>打开命令面板</Button>
      {selectedItem && (
        <p className="text-sm text-lark-subtle">
          最近选择： <span className="text-lark-default">{selectedItem}</span>
        </p>
      )}

      <CommandPalette.Root
        open={open}
        onOpenChange={setOpen}
        items={filteredGroups}
        value={search}
        onValueChange={setSearch}
        itemToStringValue={(group) => group.label}
        onSelect={(item, { newTab }) => {
          console.log("Selected:", item.title, newTab ? "(new tab)" : "");
          handleSelect(item);
        }}
        getSelectableItems={getSelectableItems}
      >
        <CommandPalette.Input placeholder="输入命令或搜索内容…" />
        <CommandPalette.List>
          <CommandPalette.Results>
            {(group: CommandGroup) => (
              <CommandPalette.Group key={group.id} items={group.items}>
                <CommandPalette.GroupLabel>
                  {group.label}
                </CommandPalette.GroupLabel>
                <CommandPalette.Items>
                  {(item: CommandItem) => (
                    <CommandPalette.Item
                      key={item.id}
                      value={item}
                      onClick={() => handleSelect(item)}
                    >
                      <span className="flex items-center gap-3">
                        {item.icon && (
                          <span className="text-lark-subtle">{item.icon}</span>
                        )}
                        <span>{item.title}</span>
                      </span>
                    </CommandPalette.Item>
                  )}
                </CommandPalette.Items>
              </CommandPalette.Group>
            )}
          </CommandPalette.Results>
          <CommandPalette.Empty>未找到命令</CommandPalette.Empty>
        </CommandPalette.List>
        <CommandPalette.Footer>
          <span className="flex items-center gap-2">
            <kbd className="rounded border border-lark-hairline bg-lark-base px-1.5 py-0.5 text-[10px]">
              ↑↓
            </kbd>
            <span>导航</span>
          </span>
          <span className="flex items-center gap-2">
            <kbd className="rounded border border-lark-hairline bg-lark-base px-1.5 py-0.5 text-[10px]">
              ↵
            </kbd>
            <span>选择</span>
          </span>
        </CommandPalette.Footer>
      </CommandPalette.Root>
    </div>
  );
}

// Simple flat list example
interface SimpleItem {
  id: string;
  title: string;
}

const simpleItems: SimpleItem[] = [
  { id: "1", title: "复制" },
  { id: "2", title: "粘贴" },
  { id: "3", title: "剪切" },
  { id: "4", title: "删除" },
  { id: "5", title: "全选" },
];

export function CommandPaletteSimpleDemo() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div>
      <Button onClick={() => setOpen(true)}>打开简易面板</Button>

      <CommandPalette.Root
        open={open}
        onOpenChange={setOpen}
        items={simpleItems}
        value={search}
        onValueChange={setSearch}
        itemToStringValue={(item) => item.title}
        onSelect={(item) => {
          console.log("Selected:", item.title);
          setOpen(false);
        }}
        getSelectableItems={(items) => items}
      >
        <CommandPalette.Input placeholder="搜索操作…" />
        <CommandPalette.List>
          <CommandPalette.Results>
            {(item: SimpleItem) => (
              <CommandPalette.Item
                key={item.id}
                value={item}
                onClick={() => {
                  console.log("Clicked:", item.title);
                  setOpen(false);
                }}
              >
                {item.title}
              </CommandPalette.Item>
            )}
          </CommandPalette.Results>
          <CommandPalette.Empty>未找到操作</CommandPalette.Empty>
        </CommandPalette.List>
      </CommandPalette.Root>
    </div>
  );
}

// With loading state
export function CommandPaletteLoadingDemo() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleOpen = () => {
    setOpen(true);
    setLoading(true);
    // Simulate loading
    setTimeout(() => setLoading(false), 1500);
  };

  // Filter groups based on search
  const filteredGroups = filterGroupsWithItems(sampleGroups, search);

  return (
    <div>
      <Button onClick={handleOpen}>打开（带加载状态）</Button>

      <CommandPalette.Root
        open={open}
        onOpenChange={setOpen}
        items={loading ? [] : filteredGroups}
        value={search}
        onValueChange={setSearch}
        itemToStringValue={(group) => group.label}
        getSelectableItems={getSelectableItems}
      >
        <CommandPalette.Input placeholder="搜索…" />
        <CommandPalette.List>
          {loading ? (
            <CommandPalette.Loading />
          ) : (
            <>
              <CommandPalette.Results>
                {(group: CommandGroup) => (
                  <CommandPalette.Group key={group.id} items={group.items}>
                    <CommandPalette.GroupLabel>
                      {group.label}
                    </CommandPalette.GroupLabel>
                    <CommandPalette.Items>
                      {(item: CommandItem) => (
                        <CommandPalette.Item
                          key={item.id}
                          value={item}
                          onClick={() => setOpen(false)}
                        >
                          <span className="flex items-center gap-3">
                            {item.icon && (
                              <span className="text-lark-subtle">
                                {item.icon}
                              </span>
                            )}
                            <span>{item.title}</span>
                          </span>
                        </CommandPalette.Item>
                      )}
                    </CommandPalette.Items>
                  </CommandPalette.Group>
                )}
              </CommandPalette.Results>
              <CommandPalette.Empty>未找到结果</CommandPalette.Empty>
            </>
          )}
        </CommandPalette.List>
      </CommandPalette.Root>
    </div>
  );
}

/** 演示在命令面板（CommandPalette）输入框上关闭浏览器自动补全和拼写检查。 */
export function CommandPaletteNoAutocompleteDemo() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredGroups = filterGroupsWithItems(sampleGroups, search);

  return (
    <div className="flex flex-col items-start gap-4">
      <Button onClick={() => setOpen(true)}>打开面板（禁用自动补全）</Button>

      <CommandPalette.Root
        open={open}
        onOpenChange={setOpen}
        items={filteredGroups}
        value={search}
        onValueChange={setSearch}
        itemToStringValue={(group) => group.label}
        onSelect={(item) => {
          console.log("Selected:", item.title);
          setOpen(false);
          setSearch("");
        }}
        getSelectableItems={getSelectableItems}
      >
        <CommandPalette.Input
          placeholder="搜索命令…"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          data-1p-ignore="true"
          data-lpignore="true"
        />
        <CommandPalette.List>
          <CommandPalette.Results>
            {(group: CommandGroup) => (
              <CommandPalette.Group key={group.id} items={group.items}>
                <CommandPalette.GroupLabel>
                  {group.label}
                </CommandPalette.GroupLabel>
                <CommandPalette.Items>
                  {(item: CommandItem) => (
                    <CommandPalette.Item
                      key={item.id}
                      value={item}
                      onClick={() => {
                        setOpen(false);
                        setSearch("");
                      }}
                    >
                      <span className="flex items-center gap-3">
                        {item.icon && (
                          <span className="text-lark-subtle">{item.icon}</span>
                        )}
                        <span>{item.title}</span>
                      </span>
                    </CommandPalette.Item>
                  )}
                </CommandPalette.Items>
              </CommandPalette.Group>
            )}
          </CommandPalette.Results>
          <CommandPalette.Empty>未找到命令</CommandPalette.Empty>
        </CommandPalette.List>
      </CommandPalette.Root>
    </div>
  );
}

// ResultItem with breadcrumbs and highlights
interface SearchResult {
  id: string;
  title: string;
  breadcrumbs: string[];
  icon?: React.ReactNode;
}

const searchResults: SearchResult[] = [
  {
    id: "1",
    title: "按钮",
    breadcrumbs: ["组件"],
    icon: <FileIcon size={16} />,
  },
  {
    id: "2",
    title: "对话框",
    breadcrumbs: ["组件"],
    icon: <FileIcon size={16} />,
  },
  {
    id: "3",
    title: "页面头部",
    breadcrumbs: ["区块"],
    icon: <FileIcon size={16} />,
  },
];

export function CommandPaletteResultItemDemo() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div>
      <Button onClick={() => setOpen(true)}>打开（带 ResultItem）</Button>

      <CommandPalette.Root
        open={open}
        onOpenChange={setOpen}
        items={searchResults}
        value={search}
        onValueChange={setSearch}
        itemToStringValue={(item) => item.title}
        getSelectableItems={(items) => items}
      >
        <CommandPalette.Input placeholder="搜索文档…" />
        <CommandPalette.List>
          <CommandPalette.Results>
            {(item: SearchResult) => (
              <CommandPalette.ResultItem
                key={item.id}
                value={item}
                title={item.title}
                breadcrumbs={item.breadcrumbs}
                icon={item.icon}
                onClick={() => {
                  console.log("Navigate to:", item.title);
                  setOpen(false);
                }}
              />
            )}
          </CommandPalette.Results>
          <CommandPalette.Empty>未找到页面</CommandPalette.Empty>
        </CommandPalette.List>
        <CommandPalette.Footer>
          <span className="flex items-center gap-2">
            <kbd className="rounded border border-lark-hairline bg-lark-base px-1.5 py-0.5 text-[10px]">
              ↑↓
            </kbd>
            <span>导航</span>
          </span>
          <span className="flex items-center gap-2">
            <kbd className="rounded border border-lark-hairline bg-lark-base px-1.5 py-0.5 text-[10px]">
              ⌘↵
            </kbd>
            <span>在新标签页打开</span>
          </span>
        </CommandPalette.Footer>
      </CommandPalette.Root>
    </div>
  );
}
