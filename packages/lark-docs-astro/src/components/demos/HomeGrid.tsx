import { useState } from "react";
import {
  Autocomplete,
  Badge,
  Banner,
  Button,
  ButtonGroup,
  Checkbox,
  ClipboardText,
  LarkLogo,
  Collapsible,
  Combobox,
  DatePicker,
  Dialog,
  DropdownMenu,
  Flow,
  Grid,
  GridItem,
  Input,
  InputArea,
  Label,
  LayerCard,
  LayerDialog,
  Link,
  Loader,
  Meter,
  Pagination,
  Popover,
  Radio,
  Select,
  SensitiveInput,
  SkeletonLine,
  Slider,
  Switch,
  Table,
  TableOfContents,
  TagInput,
  Tabs,
  Text,
  Toolbar,
  Toasty,
  Tooltip,
  TooltipProvider,
  useLarkToastManager,
} from "@lark-ui/core";
import { ShikiProvider, CodeHighlighted } from "@lark-ui/core/code";
import { CommandPaletteBasicDemo } from "~/components/demos/CommandPaletteDemo";
import { InputGroupDemo } from "~/components/demos/InputGroupDemo";
import {
  CaretDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TranslateIcon,
  WarningIcon,
  WarningOctagonIcon,
  XIcon,
} from "@phosphor-icons/react";

const componentRoutes: Record<string, string> = {
  badge: "/components/badge",
  banner: "/components/banner",
  breadcrumbs: "/components/breadcrumbs",
  button: "/components/button",
  "button-group": "/components/button-group",
  checkbox: "/components/checkbox",
  "clipboard-text": "/components/clipboard-text",
  "lark-logo": "/components/lark-logo",
  "code-highlighted": "/components/code-highlighted",
  collapsible: "/components/collapsible",
  autocomplete: "/components/autocomplete",
  combobox: "/components/combobox",
  "command-palette": "/components/command-palette",
  "date-picker": "/components/date-picker",
  dialog: "/components/dialog",
  dropdown: "/components/dropdown",
  empty: "/components/empty",
  flow: "/components/flow",
  grid: "/components/grid",
  input: "/components/input",
  "input-area": "/components/input-area",
  "input-group": "/components/input-group",
  "tag-input": "/components/tag-input",
  label: "/components/label",
  "layer-card": "/components/layer-card",
  "layer-dialog": "/components/layer-dialog",
  link: "/components/link",
  loader: "/components/loader",
  meter: "/components/meter",
  pagination: "/components/pagination",
  popover: "/components/popover",
  radio: "/components/radio",
  select: "/components/select",
  "sensitive-input": "/components/sensitive-input",
  "skeleton-line": "/components/skeleton-line",
  slider: "/components/slider",
  switch: "/components/switch",
  table: "/components/table",
  "table-of-contents": "/components/table-of-contents",
  tabs: "/components/tabs",
  text: "/components/text",
  toolbar: "/components/toolbar",
  toast: "/components/toast",
  tooltip: "/components/tooltip",
};

function ToastTriggerButton() {
  const toastManager = useLarkToastManager();
  return (
    <Button
      onClick={() =>
        toastManager.add({
          title: `已创建轻提示`,
          description: "这是一条轻提示通知。",
          variant: "warning",
        })
      }
    >
      给我一个轻提示
    </Button>
  );
}

export function HomeGrid() {
  const [switchToggled, setSwitchToggled] = useState(true);
  const [checked, setChecked] = useState(true);
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const [paginationPage, setPaginationPage] = useState(1);
  const [value, setValue] = useState<{ id: string; value: string } | null>(
    null,
  );

  const components: Array<{
    name: string;
    id: string;
    Component: React.ReactNode;
  }> = [
    {
      name: "Button 按钮",
      id: "button",
      Component: (
        <div className="grid gap-3">
          <Button icon={PlusIcon}>新建文档</Button>
          <Button variant="primary" icon={PlusIcon}>
            新建文档
          </Button>
          <Button loading>新建文档</Button>
        </div>
      ),
    },
    {
      name: "Button Group 按钮组",
      id: "button-group",
      Component: (
        <ButtonGroup>
          <Button variant="primary">发布</Button>
          <Button variant="primary" shape="square" aria-label="更多选项">
            <CaretDownIcon />
          </Button>
        </ButtonGroup>
      ),
    },
    {
      name: "Input 输入框",
      id: "input",
      Component: (
        <div className="grid gap-3">
          <Input placeholder="输入一些内容…" />
          <Input variant="error" value="无效！" />
        </div>
      ),
    },
    {
      name: "Tag Input 标签输入框",
      id: "tag-input",
      Component: (
        <TagInput
          className="w-[280px] max-w-full"
          defaultValue={["前端", "优先级"]}
          placeholder="添加标签"
        />
      ),
    },
    {
      name: "Select 选择器",
      id: "select",
      Component: (
        <Select
          aria-label="选择版本"
          className="w-[200px]"
          placeholder="选择版本"
          renderValue={(v) => {
            const labels: Record<string, string> = {
              all: "所有已部署版本",
              active: "生效中的版本",
              specific: "指定版本",
            };
            if (!v) return "选择一个版本…";
            return labels[v as string];
          }}
        >
          <Select.Option value="all">所有已部署版本</Select.Option>
          <Select.Option value="active">生效中的版本</Select.Option>
          <Select.Option value="specific">指定版本</Select.Option>
        </Select>
      ),
    },
    {
      name: "Toolbar 工具栏",
      id: "toolbar",
      Component: (
        <Toolbar className="max-w-full">
          <Toolbar.Input aria-label="搜索 DNS 记录" placeholder="搜索…" />
          <Toolbar.Button icon={MagnifyingGlassIcon} aria-label="搜索" />
          <Toolbar.Button icon={PlusIcon} aria-label="添加" />
        </Toolbar>
      ),
    },
    {
      name: "Autocomplete 自动补全",
      id: "autocomplete",
      Component: (
        <Autocomplete items={["苹果", "香蕉", "樱桃", "葡萄", "芒果", "橙子"]}>
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
      ),
    },
    {
      name: "Combobox 组合框",
      id: "combobox",
      Component: (
        <Combobox
          items={[
            { id: "bug", value: "bug" },
            { id: "docs", value: "documentation" },
            { id: "enhancement", value: "enhancement" },
            { id: "help-wanted", value: "help wanted" },
            { id: "good-first-issue", value: "good first issue" },
          ]}
          onValueChange={setValue}
          value={value}
        >
          <Combobox.TriggerInput placeholder="选择一个问题…" />
          <Combobox.Content>
            <Combobox.List>
              {(item: { id: string; value: string }) => (
                <Combobox.Item key={item.id} value={item.value}>
                  {item.value}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Content>
        </Combobox>
      ),
    },
    {
      name: "Switch 开关",
      id: "switch",
      Component: (
        <Switch
          checked={switchToggled}
          onClick={() => {
            setSwitchToggled(!switchToggled);
          }}
        />
      ),
    },
    {
      name: "Dialog 对话框",
      id: "dialog",
      Component: (
        <Dialog.Root>
          <Dialog.Trigger render={(p) => <Button {...p}>删除</Button>} />
          <Dialog className="p-8">
            <div className="mb-4 flex items-start justify-between gap-4">
              <Dialog.Title className="text-2xl font-semibold">
                删除资源？
              </Dialog.Title>
              <Dialog.Close
                aria-label="关闭"
                render={(props) => (
                  <Button
                    {...props}
                    variant="secondary"
                    shape="square"
                    icon={<XIcon />}
                    aria-label="关闭"
                  />
                )}
              />
            </div>
            <Dialog.Description className="text-lark-subtle">
              这是一段示例正文，用于展示对话框中的文字排版效果。
            </Dialog.Description>
            <div className="mt-8 flex justify-end gap-2">
              <Dialog.Close
                render={(props) => (
                  <Button variant="secondary" {...props}>
                    取消
                  </Button>
                )}
              />
              <Dialog.Close
                render={(props) => (
                  <Button variant="destructive" {...props}>
                    删除
                  </Button>
                )}
              />
            </div>
          </Dialog>
        </Dialog.Root>
      ),
    },
    {
      name: "Tooltip 工具提示",
      id: "tooltip",
      Component: (
        <TooltipProvider>
          <div className="flex gap-2">
            <Tooltip
              content="添加"
              open
              render={
                <Button shape="square" icon={PlusIcon} aria-label="添加" />
              }
            />
            <Tooltip
              content="切换语言"
              render={
                <Button
                  shape="square"
                  icon={TranslateIcon}
                  aria-label="切换语言"
                />
              }
            />
          </div>
        </TooltipProvider>
      ),
    },
    {
      name: "Dropdown 下拉菜单",
      id: "dropdown",
      Component: (
        <DropdownMenu>
          <DropdownMenu.Trigger
            render={<Button icon={PlusIcon}>添加</Button>}
          />
          <DropdownMenu.Content>
            <DropdownMenu.Item>文档</DropdownMenu.Item>
            <DropdownMenu.Item>Pages</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      ),
    },
    {
      name: "Collapsible 折叠面板",
      id: "collapsible",
      Component: (
        <Collapsible.Root
          open={collapsibleOpen}
          onOpenChange={setCollapsibleOpen}
        >
          <Collapsible.DefaultTrigger>Lark 是什么？</Collapsible.DefaultTrigger>
          <Collapsible.DefaultPanel>
            <Text>Lark 是飞书宇宙设计的组件库。</Text>
          </Collapsible.DefaultPanel>
        </Collapsible.Root>
      ),
    },
    {
      name: "Checkbox 复选框",
      id: "checkbox",
      Component: (
        <Checkbox
          label="最大带宽"
          checked={checked}
          onCheckedChange={(checked) => {
            setChecked(checked);
          }}
        />
      ),
    },
    {
      name: "LayerCard 分层卡片",
      id: "layer-card",
      Component: (
        <LayerCard className="w-[200px]">
          <LayerCard.Secondary>后续步骤</LayerCard.Secondary>
          <LayerCard.Primary>你好</LayerCard.Primary>
        </LayerCard>
      ),
    },
    {
      name: "LayerDialog 分层对话框",
      id: "layer-dialog",
      Component: (
        <LayerDialog.Root>
          <LayerDialog.Trigger
            render={(props) => <Button {...props}>打开对话框</Button>}
          />
          <LayerDialog.Content size="sm">
            <LayerDialog.Title>键盘快捷键</LayerDialog.Title>
            <LayerDialog.Description>
              搜索组件并跳转到指定页面。
            </LayerDialog.Description>
            <LayerDialog.Body>
              <div className="flex items-center justify-between gap-4 rounded-lg bg-lark-elevated px-3 py-2.5">
                <Text size="sm" variant="secondary">
                  打开命令面板
                </Text>
                <span
                  aria-label="Command K"
                  className="flex shrink-0 items-center gap-1"
                >
                  <kbd className="min-w-6 rounded-md bg-lark-base px-1.5 py-1 text-center text-xs font-medium text-lark-default ring ring-lark-line">
                    ⌘
                  </kbd>
                  <kbd className="min-w-6 rounded-md bg-lark-base px-1.5 py-1 text-center text-xs font-medium text-lark-default ring ring-lark-line">
                    K
                  </kbd>
                </span>
              </div>
            </LayerDialog.Body>
          </LayerDialog.Content>
        </LayerDialog.Root>
      ),
    },
    {
      name: "Loader 加载指示器",
      id: "loader",
      Component: <Loader />,
    },
    {
      name: "SkeletonLine 骨架行",
      id: "skeleton-line",
      Component: (
        <div className="mr-auto flex w-full max-w-[200px] flex-col gap-2">
          <SkeletonLine minWidth={50} maxWidth={100} />
          <SkeletonLine minWidth={100} />
          <SkeletonLine minWidth={50} maxWidth={75} />
        </div>
      ),
    },
    {
      name: "CodeHighlighted 代码高亮",
      id: "code-highlighted",
      Component: (
        <ShikiProvider engine="javascript" languages={["typescript"]}>
          <CodeHighlighted
            lang="typescript"
            code={`const sum = (a: number, b: number) => {
  return a + b;
};`}
          />
        </ShikiProvider>
      ),
    },
    {
      name: "Banner 通告栏",
      id: "banner",
      Component: (
        <div className="flex flex-col gap-2">
          <Banner description="这是一条默认通告栏。" />
          <Banner
            icon={<WarningIcon weight="fill" />}
            title="这是一条警告通告栏。"
            variant="alert"
          />
          <Banner
            icon={<WarningOctagonIcon weight="fill" />}
            title="这是一条错误通告栏。"
            variant="error"
          />
        </div>
      ),
    },
    {
      name: "Tabs 标签页",
      id: "tabs",
      Component: (
        <Tabs
          tabs={[
            { value: "home", label: "首页" },
            { value: "about", label: "关于" },
            { value: "contact", label: "联系我们" },
          ]}
        />
      ),
    },
    {
      name: "Badge 徽标",
      id: "badge",
      Component: (
        <div className="flex flex-col gap-2">
          <Badge variant="blue">蓝色</Badge>
          <Badge variant="green">绿色</Badge>
          <Badge variant="orange">橙色</Badge>
          <Badge variant="neutral">中性</Badge>
          <Badge variant="red">红色</Badge>
        </div>
      ),
    },
    {
      name: "LarkLogo Lark 标志",
      id: "lark-logo",
      Component: <LarkLogo className="w-48 max-w-full" />,
    },
    {
      name: "Toast 轻提示",
      id: "toast",
      Component: (
        <Toasty>
          <ToastTriggerButton />
        </Toasty>
      ),
    },
    {
      name: "Pagination 分页",
      id: "pagination",
      Component: (
        <Pagination
          page={paginationPage}
          perPage={10}
          totalCount={100}
          setPage={setPaginationPage}
          className="w-auto"
        >
          <Pagination.Controls />
        </Pagination>
      ),
    },
    {
      name: "InputArea 文本域",
      id: "input-area",
      Component: <InputArea placeholder="输入你的姓名" />,
    },
    {
      name: "InputGroup 输入框组",
      id: "input-group",
      Component: <InputGroupDemo />,
    },
    {
      name: "Meter 进度指示器",
      id: "meter",
      Component: (
        <Meter value={75} label="我的进度条" customValue="100 / 5,000" />
      ),
    },
    {
      name: "Slider 滑块",
      id: "slider",
      Component: (
        <Slider
          defaultValue={[25, 75]}
          getAriaLabel={(index) => (index === 0 ? "最小值" : "最大值")}
          className="w-48"
        />
      ),
    },
    {
      name: "DatePicker 日期选择器",
      id: "date-picker",
      Component: (
        <div className="scale-85 bg-lark-base p-4">
          <DatePicker mode="single" />
        </div>
      ),
    },
    {
      name: "Breadcrumbs 面包屑导航",
      id: "breadcrumbs",
      Component: (
        <div className="flex items-center gap-1 text-sm">
          <span className="text-lark-subtle">首页</span>
          <span className="text-lark-inactive">/</span>
          <span className="text-lark-subtle">文档</span>
          <span className="text-lark-inactive">/</span>
          <span className="font-medium">页面</span>
        </div>
      ),
    },
    {
      name: "ClipboardText 剪贴板文本",
      id: "clipboard-text",
      Component: <ClipboardText text="npx lark-ui add button" />,
    },
    {
      name: "CommandPalette 命令面板",
      id: "command-palette",
      Component: <CommandPaletteBasicDemo />,
    },
    {
      name: "Flow 流程图",
      id: "flow",
      Component: (
        <Flow>
          <Flow.Node>步骤 1</Flow.Node>
          <Flow.Node>步骤 2</Flow.Node>
        </Flow>
      ),
    },
    {
      name: "Link 链接",
      id: "link",
      Component: (
        <div className="flex flex-col gap-2 text-sm">
          <Link href="#">默认链接</Link>
          <Link href="#" variant="current">
            当前颜色链接
          </Link>
          <Link href="#" variant="plain">
            朴素链接
          </Link>
        </div>
      ),
    },
    {
      name: "Empty 空状态",
      id: "empty",
      Component: (
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-sm font-medium">无结果</span>
          <span className="text-xs text-lark-subtle">试试其他搜索词</span>
        </div>
      ),
    },
    {
      name: "Grid 栅格",
      id: "grid",
      Component: (
        <Grid variant="side-by-side" gap="sm" className="w-[140px]">
          <GridItem className="rounded bg-lark-control p-3 text-center text-xs">
            1
          </GridItem>
          <GridItem className="rounded bg-lark-control p-3 text-center text-xs">
            2
          </GridItem>
          <GridItem className="rounded bg-lark-control p-3 text-center text-xs">
            3
          </GridItem>
          <GridItem className="rounded bg-lark-control p-3 text-center text-xs">
            4
          </GridItem>
        </Grid>
      ),
    },
    {
      name: "Label 标签",
      id: "label",
      Component: (
        <div className="flex flex-col gap-2">
          <Label>默认标签</Label>
          <Label showOptional>可选字段</Label>
          <Label tooltip="更多信息">带工具提示</Label>
        </div>
      ),
    },
    {
      name: "Popover 气泡卡片",
      id: "popover",
      Component: (
        <Popover>
          <Popover.Trigger render={<Button />}>打开气泡卡片</Popover.Trigger>
          <Popover.Content>
            <Popover.Title>气泡卡片标题</Popover.Title>
            <Popover.Description>这是一个气泡卡片。</Popover.Description>
          </Popover.Content>
        </Popover>
      ),
    },
    {
      name: "Radio 单选按钮",
      id: "radio",
      Component: (
        <Radio.Group legend="选择一个选项" defaultValue="option1">
          <Radio.Item value="option1" label="选项 1" />
          <Radio.Item value="option2" label="选项 2" />
        </Radio.Group>
      ),
    },
    {
      name: "SensitiveInput 敏感信息输入框",
      id: "sensitive-input",
      Component: <SensitiveInput value="super-secret-api-key" readOnly />,
    },
    {
      name: "Table 表格",
      id: "table",
      Component: (
        <LayerCard className="w-full max-w-[280px] p-0">
          <Table className="text-sm">
            <Table.Header variant="compact">
              <Table.Row>
                <Table.Head>名称</Table.Head>
                <Table.Head className="text-center">状态</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>文档 1</Table.Cell>
                <Table.Cell className="text-center">
                  <Badge appearance="dot" variant="success">
                    进行中
                  </Badge>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>文档 2</Table.Cell>
                <Table.Cell className="text-center">
                  <Badge appearance="dot" variant="neutral">
                    已暂停
                  </Badge>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>文档 3</Table.Cell>
                <Table.Cell className="text-center">
                  <Badge appearance="dot" variant="success">
                    进行中
                  </Badge>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </LayerCard>
      ),
    },
    {
      name: "TableOfContents 目录",
      id: "table-of-contents",
      Component: (
        <TableOfContents>
          <TableOfContents.Title>本页内容</TableOfContents.Title>
          <TableOfContents.List>
            <TableOfContents.Item active>简介</TableOfContents.Item>
            <TableOfContents.Item>安装</TableOfContents.Item>
            <TableOfContents.Item>用法</TableOfContents.Item>
          </TableOfContents.List>
        </TableOfContents>
      ),
    },
    {
      name: "Text 文本",
      id: "text",
      Component: (
        <div className="flex flex-col gap-1">
          <Text size="lg" bold>
            大号加粗文本
          </Text>
          <Text size="base">常规文本内容</Text>
          <Text size="sm" color="subtle">
            小号弱化文本
          </Text>
        </div>
      ),
    },
  ];

  return (
    <ul
      data-vr-home-grid
      className="grid auto-rows-min grid-cols-1 gap-px bg-lark-hairline md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
    >
      {components.map((c) => {
        const route = componentRoutes[c.id] || null;
        return (
          <li
            className="relative flex aspect-square w-full min-w-0 items-center justify-center self-stretch bg-lark-canvas"
            key={c.name}
          >
            {route ? (
              <a
                href={route}
                className="absolute top-4 left-4 text-base font-medium text-lark-subtle hover:text-lark-default"
              >
                {c.name}
              </a>
            ) : (
              <span className="absolute top-4 left-4 text-base font-medium text-lark-subtle italic">
                {c.name}
              </span>
            )}
            <div className="flex w-full min-w-0 items-center justify-center p-8 leading-normal tracking-normal">
              {c.Component ?? (
                <p className="text-base font-medium text-lark-subtle">待定</p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
