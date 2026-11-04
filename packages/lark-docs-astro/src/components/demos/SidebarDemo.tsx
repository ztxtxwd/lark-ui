import {
  Sidebar,
  useSidebar,
  DropdownMenu,
  Breadcrumbs,
  type SidebarState,
} from "@lark-ui/core";
import {
  HouseIcon,
  GlobeIcon,
  GearIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  DatabaseIcon,
  CodeIcon,
  LockIcon,
  CubeIcon,
  BellIcon,
  CaretUpDownIcon,
  CheckIcon,
  StackIcon,
  StackSimpleIcon,
  UserIcon,
  ArrowsLeftRightIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  ClockCounterClockwiseIcon,
  FileMagnifyingGlassIcon,
  ChartPieIcon,
} from "@phosphor-icons/react";
import { Fragment, useState } from "react";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function DemoContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-[540px] w-full overflow-hidden rounded-lg border border-lark-line bg-lark-base">
      {children}
    </div>
  );
}

function DemoMain({ children }: { children?: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-base text-lark-subtle">
      {children ?? "主要内容区域"}
    </main>
  );
}

/**
 * Keeps the footer action aligned with the collapsed rail. The library footer
 * deliberately gains breathing room in its expanded state; these demos use a
 * single bottom-left action, so retaining its x-position makes the transition
 * easier to follow.
 */
function DemoSidebarFooter({ children }: { children: React.ReactNode }) {
  return <Sidebar.Footer className="!px-[11px]">{children}</Sidebar.Footer>;
}
DemoSidebarFooter.displayName = "Sidebar.Footer";

function BrandLogo() {
  return (
    <div className="flex w-full min-w-0 items-center gap-2 px-3 transition-[padding] duration-(--sidebar-animation-duration) ease-(--sidebar-easing) group-data-[state=collapsed]/sidebar:px-2">
      <CubeIcon className="size-4 shrink-0 text-lark-brand" weight="duotone" />
      <span className="flex-1 truncate text-sm font-semibold text-lark-strong">
        公司
      </span>
    </div>
  );
}

const accounts = [
  { id: "1", name: "公司", icon: CubeIcon },
  { id: "2", name: "个人", icon: StackIcon },
  { id: "3", name: "预发布", icon: StackSimpleIcon },
];

function AccountSwitcher() {
  const [active, setActive] = useState(accounts[0]);

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger
        render={
          <button
            type="button"
            className="flex w-full min-w-0 cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-lark-default transition-[padding] duration-(--sidebar-animation-duration) ease-(--sidebar-easing) outline-none hover:bg-lark-tint focus-visible:ring-1 focus-visible:ring-lark-line"
          >
            <active.icon
              className="size-4 shrink-0 text-lark-brand"
              weight="duotone"
            />
            <span className="flex min-w-0 flex-1 items-center overflow-hidden text-left">
              {active.name}
            </span>
            <span className="w-4 shrink-0 overflow-hidden transition-[width] duration-(--sidebar-animation-duration) ease-(--sidebar-easing) group-data-[state=collapsed]/sidebar:w-0">
              <CaretUpDownIcon className="size-4 text-lark-subtle" />
            </span>
          </button>
        }
      />
      <DropdownMenu.Content className="w-(--anchor-width)">
        {accounts.map((account) => (
          <DropdownMenu.Item
            key={account.id}
            className="cursor-pointer gap-2"
            onClick={() => setActive(account)}
          >
            <account.icon className="size-4 text-lark-brand" weight="duotone" />
            {account.name}
            {account.id === active.id && (
              <CheckIcon className="ml-auto size-4" />
            )}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

/** 从账号名称生成缩写，例如 "个人" → "个人"、"预发布" → "预发"。 */
function initialsFor(name: string) {
  const words = name.trim().split(/\s+/);
  return (
    words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)
  ).toUpperCase();
}

/**
 * Squircle avatar with a hairline ring, so it sits on the surface rather than
 * floating. Muted neutral fill. Reads as an identity
 * affordance rather than decoration. Sized to the header row rather than to
 * iOS touch-target minimums — the whole row is generous, and an oversized mark
 * competes with the breadcrumb trail that should carry the emphasis.
 */
function AccountAvatar({ name, size = 28 }: { name: string; size?: number }) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-[30%] bg-lark-control text-lark-default shadow-xs ring ring-lark-line"
    >
      <span
        className="leading-none font-semibold tracking-tight"
        style={{ fontSize: size * 0.4 }}
      >
        {initialsFor(name)}
      </span>
    </span>
  );
}

/**
 * Avatar account switcher. The account name lives one tap away in the dropdown,
 * freeing the header row for the breadcrumb trail.
 */
function CompactAccountSwitcher() {
  const [active, setActive] = useState(accounts[0]);

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger
        render={
          <button
            type="button"
            aria-label={`账号：${active.name}`}
            className="shrink-0 cursor-pointer rounded-full transition-opacity outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-lark-line"
          >
            <AccountAvatar name={active.name} />
          </button>
        }
      />
      <DropdownMenu.Content align="start">
        {accounts.map((account) => (
          <DropdownMenu.Item
            key={account.id}
            className="cursor-pointer gap-2"
            onClick={() => setActive(account)}
          >
            <AccountAvatar name={account.name} size={20} />
            {account.name}
            {account.id === active.id && (
              <CheckIcon className="ml-auto size-4" />
            )}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

// ---------------------------------------------------------------------------
// 1. Basic — absolute minimum: no header, no footer
// ---------------------------------------------------------------------------

/** 极简侧边栏（Sidebar），包含分组和激活状态，没有头部和页脚。 */
export function SidebarBasicDemo() {
  return (
    <DemoContainer>
      <Sidebar.Provider contained defaultOpen className="h-full min-h-0!">
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>概览</Sidebar.GroupLabel>
              <Sidebar.Menu>
                <Sidebar.MenuButton icon={HouseIcon} active>
                  首页
                </Sidebar.MenuButton>
                <Sidebar.MenuButton icon={ChartBarIcon}>
                  分析
                </Sidebar.MenuButton>
                <Sidebar.MenuButton icon={GlobeIcon}>域名</Sidebar.MenuButton>
              </Sidebar.Menu>
            </Sidebar.Group>

            <Sidebar.Group>
              <Sidebar.GroupLabel>构建</Sidebar.GroupLabel>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.Collapsible defaultOpen>
                    <Sidebar.CollapsibleTrigger
                      render={
                        <Sidebar.MenuButton icon={CodeIcon}>
                          计算
                          <Sidebar.MenuChevron />
                        </Sidebar.MenuButton>
                      }
                    />
                    <Sidebar.CollapsibleContent>
                      <Sidebar.MenuSub>
                        <Sidebar.MenuSubItem>
                          <Sidebar.Collapsible>
                            <Sidebar.CollapsibleTrigger
                              render={
                                <Sidebar.MenuSubButton>
                                  Workers & Pages
                                  <Sidebar.MenuChevron />
                                </Sidebar.MenuSubButton>
                              }
                            />
                            <Sidebar.CollapsibleContent>
                              <Sidebar.MenuSub>
                                <Sidebar.MenuSubButton>
                                  概览
                                </Sidebar.MenuSubButton>
                                <Sidebar.MenuSubButton>
                                  Workers
                                </Sidebar.MenuSubButton>
                                <Sidebar.MenuSubButton>
                                  Pages
                                </Sidebar.MenuSubButton>
                              </Sidebar.MenuSub>
                            </Sidebar.CollapsibleContent>
                          </Sidebar.Collapsible>
                        </Sidebar.MenuSubItem>
                        <Sidebar.MenuSubButton>
                          Durable Objects
                        </Sidebar.MenuSubButton>
                      </Sidebar.MenuSub>
                    </Sidebar.CollapsibleContent>
                  </Sidebar.Collapsible>
                </Sidebar.MenuItem>
                <Sidebar.MenuButton icon={DatabaseIcon}>
                  存储
                </Sidebar.MenuButton>
              </Sidebar.Menu>
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar>
        <DemoMain />
      </Sidebar.Provider>
    </DemoContainer>
  );
}

// ---------------------------------------------------------------------------
// 2. Toggle — expand/collapse with trigger + tooltips
// ---------------------------------------------------------------------------

function ToggleButton() {
  const { toggleSidebar, state } = useSidebar();
  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className="cursor-pointer rounded-lg border border-lark-line bg-lark-base px-3 py-1.5 text-base text-lark-default transition-colors hover:bg-lark-tint"
    >
      {state === "expanded" ? "折叠" : "展开"}
    </button>
  );
}

/** 交互式示例，展示展开/收起切换按钮，并在收起状态下显示工具提示。 */
export function SidebarToggleDemo() {
  return (
    <DemoContainer>
      <Sidebar.Provider contained defaultOpen className="h-full min-h-0!">
        <Sidebar>
          <Sidebar.Header>
            <BrandLogo />
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.Menu>
                <Sidebar.MenuButton icon={HouseIcon} tooltip="首页" active>
                  首页
                </Sidebar.MenuButton>
                <Sidebar.MenuButton icon={ChartBarIcon} tooltip="分析">
                  分析
                </Sidebar.MenuButton>
                <Sidebar.MenuButton icon={CodeIcon} tooltip="计算">
                  计算
                </Sidebar.MenuButton>
                <Sidebar.MenuButton icon={DatabaseIcon} tooltip="存储">
                  存储
                </Sidebar.MenuButton>
              </Sidebar.Menu>
            </Sidebar.Group>
          </Sidebar.Content>
          <DemoSidebarFooter>
            <Sidebar.Trigger />
          </DemoSidebarFooter>
        </Sidebar>
        <DemoMain>
          <ToggleButton />
          <p>点击按钮或侧边栏触发器可切换</p>
        </DemoMain>
      </Sidebar.Provider>
    </DemoContainer>
  );
}

// ---------------------------------------------------------------------------
// Loading — nav-item-shaped skeleton shown while nav resolves
// ---------------------------------------------------------------------------

/** 加载状态：在导航就绪前显示导航项形状的骨架行。 */
export function SidebarLoadingDemo() {
  const [loading, setLoading] = useState(true);
  return (
    <DemoContainer>
      <Sidebar.Provider contained defaultOpen className="h-full min-h-0!">
        <Sidebar>
          <Sidebar.Header>
            <BrandLogo />
          </Sidebar.Header>
          {loading ? (
            <Sidebar.Loading />
          ) : (
            <Sidebar.Content>
              <Sidebar.Group>
                <Sidebar.Menu>
                  <Sidebar.MenuButton icon={HouseIcon} active>
                    首页
                  </Sidebar.MenuButton>
                  <Sidebar.MenuButton icon={ChartBarIcon}>
                    分析
                  </Sidebar.MenuButton>
                  <Sidebar.MenuButton icon={CodeIcon}>计算</Sidebar.MenuButton>
                  <Sidebar.MenuButton icon={DatabaseIcon}>
                    存储
                  </Sidebar.MenuButton>
                </Sidebar.Menu>
              </Sidebar.Group>
            </Sidebar.Content>
          )}
          <DemoSidebarFooter>
            <Sidebar.Trigger />
          </DemoSidebarFooter>
        </Sidebar>
        <DemoMain>
          <button
            type="button"
            onClick={() => setLoading((l) => !l)}
            className="cursor-pointer rounded-lg border border-lark-line bg-lark-base px-3 py-1.5 text-base text-lark-default transition-colors hover:bg-lark-tint"
          >
            {loading ? "显示已加载的导航" : "显示加载中"}
          </button>
          <p>切换以对比加载状态与已加载的导航</p>
        </DemoMain>
      </Sidebar.Provider>
    </DemoContainer>
  );
}

// ---------------------------------------------------------------------------
// 3. Resizable — drag handle with auto-collapse
// ---------------------------------------------------------------------------

/** 带拖拽手柄的可调整宽度侧边栏。拖动右边缘即可调整宽度。 */
export function SidebarResizableDemo() {
  return (
    <DemoContainer>
      <Sidebar.Provider
        contained
        defaultOpen
        resizable
        defaultWidth={240}
        minWidth={180}
        maxWidth={400}
        className="h-full min-h-0!"
      >
        <Sidebar>
          <Sidebar.Header>
            <BrandLogo />
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.Menu>
                <Sidebar.MenuButton icon={HouseIcon} active>
                  首页
                </Sidebar.MenuButton>
                <Sidebar.MenuButton icon={ChartBarIcon}>
                  分析
                </Sidebar.MenuButton>
                <Sidebar.MenuButton icon={DatabaseIcon}>
                  存储
                </Sidebar.MenuButton>
              </Sidebar.Menu>
            </Sidebar.Group>
          </Sidebar.Content>
          <DemoSidebarFooter>
            <Sidebar.Trigger />
          </DemoSidebarFooter>
          <Sidebar.ResizeHandle />
        </Sidebar>
        <DemoMain>
          <p>拖动侧边栏边缘可调整大小</p>
        </DemoMain>
      </Sidebar.Provider>
    </DemoContainer>
  );
}

// ---------------------------------------------------------------------------
// 4. Right Side — right-aligned, content only
// ---------------------------------------------------------------------------

/** 右侧侧边栏变体。 */
export function SidebarRightDemo() {
  return (
    <DemoContainer>
      <Sidebar.Provider
        contained
        defaultOpen
        side="right"
        className="h-full min-h-0!"
      >
        <DemoMain />
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>详情</Sidebar.GroupLabel>
              <Sidebar.Menu>
                <Sidebar.MenuButton icon={GearIcon} active>
                  属性
                </Sidebar.MenuButton>
                <Sidebar.MenuButton icon={ChartBarIcon}>
                  指标
                </Sidebar.MenuButton>
                <Sidebar.MenuButton icon={BellIcon}>告警</Sidebar.MenuButton>
              </Sidebar.Menu>
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar>
      </Sidebar.Provider>
    </DemoContainer>
  );
}

// ---------------------------------------------------------------------------
// 5. Peeking — hover to temporarily expand collapsed sidebar
// ---------------------------------------------------------------------------

function PeekStateIndicator() {
  const { state } = useSidebar();
  const labels: Record<SidebarState, string> = {
    expanded: "展开",
    collapsed: "折叠",
    peeking: "预览",
  };
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text font-medium text-lark-default">
        状态：{labels[state]}
      </span>
      <p>先折叠，然后悬停侧边栏即可预览</p>
    </div>
  );
}

/** 可预览的侧边栏，收起时悬停会临时展开。 */
export function SidebarPeekingDemo() {
  return (
    <DemoContainer>
      <Sidebar.Provider
        contained
        defaultOpen
        peekable
        className="h-full min-h-0!"
      >
        <Sidebar>
          <Sidebar.Header>
            <BrandLogo />
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.Menu>
                <Sidebar.MenuButton icon={HouseIcon} tooltip="首页" active>
                  首页
                </Sidebar.MenuButton>
                <Sidebar.MenuButton icon={ChartBarIcon} tooltip="分析">
                  分析
                </Sidebar.MenuButton>
                <Sidebar.MenuButton icon={CodeIcon} tooltip="计算">
                  计算
                </Sidebar.MenuButton>
                <Sidebar.MenuButton icon={DatabaseIcon} tooltip="存储">
                  存储
                </Sidebar.MenuButton>
              </Sidebar.Menu>
            </Sidebar.Group>
          </Sidebar.Content>
          <DemoSidebarFooter>
            <Sidebar.Trigger />
          </DemoSidebarFooter>
        </Sidebar>
        <DemoMain>
          <PeekStateIndicator />
        </DemoMain>
      </Sidebar.Provider>
    </DemoContainer>
  );
}

// ---------------------------------------------------------------------------
// 6. Auto Scroll — keep long collapsible content in view
// ---------------------------------------------------------------------------

/** 长侧边栏，展开下方的折叠区块时会自动把展开的内容滚动到可见区域。 */
export function SidebarAutoScrollDemo() {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-lg border border-lark-line bg-lark-base">
      <Sidebar.Provider contained defaultOpen className="h-full min-h-0!">
        <Sidebar>
          <Sidebar.Header>
            <BrandLogo />
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>概览</Sidebar.GroupLabel>
              <Sidebar.Menu>
                <Sidebar.MenuButton icon={HouseIcon} active>
                  首页
                </Sidebar.MenuButton>
                <Sidebar.MenuButton icon={ChartBarIcon}>
                  分析
                </Sidebar.MenuButton>
                <Sidebar.MenuButton icon={GlobeIcon}>域名</Sidebar.MenuButton>
              </Sidebar.Menu>
            </Sidebar.Group>

            <Sidebar.Group>
              <Sidebar.GroupLabel>平台</Sidebar.GroupLabel>
              <Sidebar.Menu>
                <Sidebar.MenuButton icon={DatabaseIcon}>
                  存储
                </Sidebar.MenuButton>
                <Sidebar.MenuButton icon={ShieldCheckIcon}>
                  安全
                </Sidebar.MenuButton>
                <Sidebar.MenuButton icon={LockIcon}>
                  Zero Trust
                </Sidebar.MenuButton>
                <Sidebar.MenuButton icon={GearIcon}>设置</Sidebar.MenuButton>
              </Sidebar.Menu>
            </Sidebar.Group>

            <Sidebar.Group>
              <Sidebar.GroupLabel>构建</Sidebar.GroupLabel>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.Collapsible autoScrollOnOpen>
                    <Sidebar.CollapsibleTrigger
                      render={
                        <Sidebar.MenuButton icon={CodeIcon}>
                          Workers
                          <Sidebar.MenuChevron />
                        </Sidebar.MenuButton>
                      }
                    />
                    <Sidebar.CollapsibleContent>
                      <Sidebar.MenuSub>
                        <Sidebar.MenuSubButton>概览</Sidebar.MenuSubButton>
                        <Sidebar.MenuSubButton>部署</Sidebar.MenuSubButton>
                        <Sidebar.MenuSubButton>可观测性</Sidebar.MenuSubButton>
                        <Sidebar.MenuSubButton>设置</Sidebar.MenuSubButton>
                      </Sidebar.MenuSub>
                    </Sidebar.CollapsibleContent>
                  </Sidebar.Collapsible>
                </Sidebar.MenuItem>
                <Sidebar.MenuButton icon={CubeIcon}>
                  容器
                  <Sidebar.MenuBadge>测试版</Sidebar.MenuBadge>
                </Sidebar.MenuButton>
              </Sidebar.Menu>
            </Sidebar.Group>
          </Sidebar.Content>
          <DemoSidebarFooter>
            <Sidebar.Trigger />
          </DemoSidebarFooter>
        </Sidebar>
        <DemoMain>
          <p>打开列表底部附近的 Workers</p>
        </DemoMain>
      </Sidebar.Provider>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 7. Transition completion — run work after sidebar and collapsible animations
// ---------------------------------------------------------------------------

/** 在侧边栏或折叠区块完成过渡动画后执行依赖布局的工作。 */
export function SidebarTransitionCompleteDemo() {
  const [completion, setCompletion] = useState("尚未完成任何过渡。");

  return (
    <DemoContainer>
      <Sidebar.Provider
        contained
        defaultOpen
        className="h-full min-h-0!"
        onOpenChangeComplete={(open) => {
          setCompletion(`侧边栏已${open ? "展开" : "折叠"}。`);
        }}
      >
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>概览</Sidebar.GroupLabel>
              <Sidebar.Menu>
                <Sidebar.MenuButton icon={HouseIcon} active>
                  首页
                </Sidebar.MenuButton>
                <Sidebar.MenuItem>
                  <Sidebar.Collapsible
                    onOpenChangeComplete={(open) => {
                      setCompletion(`计算分区已${open ? "展开" : "折叠"}。`);
                    }}
                  >
                    <Sidebar.CollapsibleTrigger
                      render={
                        <Sidebar.MenuButton icon={CodeIcon}>
                          计算
                          <Sidebar.MenuChevron />
                        </Sidebar.MenuButton>
                      }
                    />
                    <Sidebar.CollapsibleContent>
                      <Sidebar.MenuSub>
                        <Sidebar.MenuSubButton>Workers</Sidebar.MenuSubButton>
                        <Sidebar.MenuSubButton>Pages</Sidebar.MenuSubButton>
                      </Sidebar.MenuSub>
                    </Sidebar.CollapsibleContent>
                  </Sidebar.Collapsible>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.Group>
          </Sidebar.Content>
          <DemoSidebarFooter>
            <Sidebar.Trigger />
          </DemoSidebarFooter>
        </Sidebar>
        <DemoMain>
          <p aria-live="polite">{completion}</p>
          <p>切换侧边栏或打开「计算」以查看完成回调。</p>
        </DemoMain>
      </Sidebar.Provider>
    </DemoContainer>
  );
}

// ---------------------------------------------------------------------------
// 8. Sliding Views — animated horizontal transitions between surfaces
// ---------------------------------------------------------------------------

/** 侧边栏在 Account 与 Zone 导航之间使用滑动切换动画。 */
export function SidebarSlidingViewsDemo() {
  const [surface, setSurface] = useState<"account" | "zone">("account");

  return (
    <DemoContainer>
      <Sidebar.Provider contained defaultOpen className="h-full min-h-0!">
        <Sidebar>
          <Sidebar.Header>
            <button
              type="button"
              onClick={() =>
                setSurface((s) => (s === "account" ? "zone" : "account"))
              }
              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-lark-default transition-colors hover:bg-lark-tint"
            >
              <ArrowsLeftRightIcon className="size-4 shrink-0 text-lark-brand" />
              <span className="flex-1 text-left font-semibold text-lark-strong">
                {surface === "account" ? "账号导航" : "区域导航"}
              </span>
            </button>
          </Sidebar.Header>

          <Sidebar.SlidingViews
            activeKey={surface}
            direction={surface === "zone" ? "left" : "right"}
          >
            <Sidebar.SlidingView value="account">
              <Sidebar.Content>
                <Sidebar.Group>
                  <Sidebar.GroupLabel>账号</Sidebar.GroupLabel>
                  <Sidebar.Menu>
                    <Sidebar.MenuButton icon={HouseIcon} active>
                      首页
                    </Sidebar.MenuButton>
                    <Sidebar.MenuButton icon={UserIcon}>
                      成员
                    </Sidebar.MenuButton>
                    <Sidebar.MenuButton icon={ChartBarIcon}>
                      分析
                    </Sidebar.MenuButton>
                    <Sidebar.MenuButton icon={GearIcon}>
                      设置
                    </Sidebar.MenuButton>
                  </Sidebar.Menu>
                </Sidebar.Group>
              </Sidebar.Content>
            </Sidebar.SlidingView>

            <Sidebar.SlidingView value="zone">
              <Sidebar.Content>
                <Sidebar.Group>
                  <Sidebar.GroupLabel>区域</Sidebar.GroupLabel>
                  <Sidebar.Menu>
                    <Sidebar.MenuButton icon={GlobeIcon} active>
                      概览
                    </Sidebar.MenuButton>
                    <Sidebar.MenuButton icon={ShieldCheckIcon}>
                      安全
                    </Sidebar.MenuButton>
                    <Sidebar.MenuButton icon={LockIcon}>
                      SSL/TLS
                    </Sidebar.MenuButton>
                    <Sidebar.MenuButton icon={DatabaseIcon}>
                      缓存
                    </Sidebar.MenuButton>
                  </Sidebar.Menu>
                </Sidebar.Group>
              </Sidebar.Content>
            </Sidebar.SlidingView>
          </Sidebar.SlidingViews>
        </Sidebar>
        <DemoMain>
          <div className="flex flex-col items-center gap-2">
            <p className="font-medium text-lark-default">
              当前：{surface === "account" ? "账号" : "区域"}界面
            </p>
            <p>点击顶部按钮可在视图之间切换</p>
          </div>
        </DemoMain>
      </Sidebar.Provider>
    </DemoContainer>
  );
}

// ---------------------------------------------------------------------------
// 9. Full — kitchen sink showcasing every subcomponent
// ---------------------------------------------------------------------------

/** 大而全的侧边栏示例，展示所有子组件：带账户切换器的头部、带标签的分组、含嵌套可展开项的折叠区块、徽标、通过 Domains 实现的滑动视图，以及页脚触发器。 */
export function SidebarFullDemo() {
  const [surface, setSurface] = useState<"account" | "domain">("account");

  return (
    <DemoContainer>
      <Sidebar.Provider
        contained
        defaultOpen
        peekable
        className="h-full min-h-0!"
      >
        <Sidebar>
          <Sidebar.Header>
            <AccountSwitcher />
          </Sidebar.Header>
          <Sidebar.SlidingViews
            activeKey={surface}
            direction={surface === "domain" ? "left" : "right"}
          >
            <Sidebar.SlidingView value="account">
              <Sidebar.Content>
                <Sidebar.Group>
                  <Sidebar.Menu>
                    <Sidebar.MenuButton
                      icon={MagnifyingGlassIcon}
                      tooltip="搜索"
                      className="mb-3 ring ring-lark-line transition-[margin] duration-(--sidebar-animation-duration) group-data-[state=collapsed]/sidebar:mb-0 group-data-[state=collapsed]/sidebar:ring-transparent"
                    >
                      快速搜索……
                    </Sidebar.MenuButton>
                  </Sidebar.Menu>
                </Sidebar.Group>
                <Sidebar.Group>
                  <Sidebar.Menu>
                    <Sidebar.MenuButton icon={HouseIcon} active>
                      首页
                    </Sidebar.MenuButton>
                    <Sidebar.MenuButton icon={ChartBarIcon}>
                      分析与日志
                    </Sidebar.MenuButton>
                    <Sidebar.MenuButton
                      icon={GlobeIcon}
                      onClick={() => setSurface("domain")}
                    >
                      域名
                    </Sidebar.MenuButton>
                  </Sidebar.Menu>
                </Sidebar.Group>

                <Sidebar.Group>
                  <Sidebar.GroupLabel>构建</Sidebar.GroupLabel>
                  <Sidebar.Menu>
                    <Sidebar.MenuItem>
                      <Sidebar.Collapsible defaultOpen>
                        <Sidebar.CollapsibleTrigger
                          render={
                            <Sidebar.MenuButton icon={CodeIcon}>
                              计算
                              <Sidebar.MenuChevron />
                            </Sidebar.MenuButton>
                          }
                        />
                        <Sidebar.CollapsibleContent>
                          <Sidebar.MenuSub>
                            <Sidebar.MenuSubItem>
                              <Sidebar.Collapsible>
                                <Sidebar.CollapsibleTrigger
                                  render={
                                    <Sidebar.MenuSubButton>
                                      Workers & Pages
                                      <Sidebar.MenuChevron />
                                    </Sidebar.MenuSubButton>
                                  }
                                />
                                <Sidebar.CollapsibleContent>
                                  <Sidebar.MenuSub>
                                    <Sidebar.MenuSubButton>
                                      概览
                                    </Sidebar.MenuSubButton>
                                    <Sidebar.MenuSubButton>
                                      Workers
                                    </Sidebar.MenuSubButton>
                                    <Sidebar.MenuSubButton>
                                      Pages
                                    </Sidebar.MenuSubButton>
                                  </Sidebar.MenuSub>
                                </Sidebar.CollapsibleContent>
                              </Sidebar.Collapsible>
                            </Sidebar.MenuSubItem>
                            <Sidebar.MenuSubButton>
                              Durable Objects
                            </Sidebar.MenuSubButton>
                            <Sidebar.MenuSubButton>
                              容器
                              <Sidebar.MenuBadge>测试版</Sidebar.MenuBadge>
                            </Sidebar.MenuSubButton>
                          </Sidebar.MenuSub>
                        </Sidebar.CollapsibleContent>
                      </Sidebar.Collapsible>
                    </Sidebar.MenuItem>
                    <Sidebar.MenuButton icon={DatabaseIcon}>
                      存储
                    </Sidebar.MenuButton>
                  </Sidebar.Menu>
                </Sidebar.Group>

                <Sidebar.Group>
                  <Sidebar.GroupLabel>防护与连接</Sidebar.GroupLabel>
                  <Sidebar.Menu>
                    <Sidebar.MenuButton icon={ShieldCheckIcon}>
                      安全
                    </Sidebar.MenuButton>
                    <Sidebar.MenuButton icon={LockIcon}>
                      Zero Trust
                      <Sidebar.MenuBadge>测试版</Sidebar.MenuBadge>
                    </Sidebar.MenuButton>
                  </Sidebar.Menu>
                </Sidebar.Group>
              </Sidebar.Content>
            </Sidebar.SlidingView>

            <Sidebar.SlidingView value="domain">
              <Sidebar.Content>
                <Sidebar.Group>
                  <Sidebar.Menu>
                    <Sidebar.MenuButton
                      icon={ArrowLeftIcon}
                      onClick={() => setSurface("account")}
                    >
                      返回
                    </Sidebar.MenuButton>
                  </Sidebar.Menu>
                </Sidebar.Group>
                <Sidebar.Group>
                  <Sidebar.GroupLabel>example.com</Sidebar.GroupLabel>
                  <Sidebar.Menu>
                    <Sidebar.MenuButton icon={GlobeIcon} active>
                      概览
                    </Sidebar.MenuButton>
                    <Sidebar.MenuButton icon={ShieldCheckIcon}>
                      安全
                    </Sidebar.MenuButton>
                    <Sidebar.MenuButton icon={LockIcon}>
                      SSL/TLS
                    </Sidebar.MenuButton>
                    <Sidebar.MenuButton icon={ChartBarIcon}>
                      分析
                    </Sidebar.MenuButton>
                    <Sidebar.MenuButton icon={DatabaseIcon}>
                      缓存
                    </Sidebar.MenuButton>
                  </Sidebar.Menu>
                </Sidebar.Group>
              </Sidebar.Content>
            </Sidebar.SlidingView>
          </Sidebar.SlidingViews>

          <DemoSidebarFooter>
            <Sidebar.Trigger />
          </DemoSidebarFooter>
        </Sidebar>
        <DemoMain />
      </Sidebar.Provider>
    </DemoContainer>
  );
}

// ---------------------------------------------------------------------------
// 9. scrollToItem — imperative scroll to a tagged nav item
// ---------------------------------------------------------------------------

const LONG_NAV_ITEMS = [
  "首页",
  "分析",
  "域名",
  "SSL/TLS",
  "防火墙",
  "缓存",
  "Workers",
  "Pages",
  "R2",
  "KV",
  "D1",
  "AI Gateway",
  "队列",
  "Zaraz",
  "Turnstile",
  "负载均衡",
  "Zero Trust",
  "访问",
  "网关",
  "隧道",
  "日志",
  "通知",
  "成员",
  "API 令牌",
  "计费",
  "设置",
] as const;

const ANCHOR_ID_BY_LABEL: Record<string, string> = {
  首页: "home",
  Workers: "workers",
  "Zero Trust": "zero-trust",
  设置: "settings",
};

function ScrollToItemControls() {
  const { scrollToItem } = useSidebar();
  return (
    <div className="flex flex-col items-center gap-2">
      <p>跳转到任意带标记的条目。</p>
      <div className="flex flex-wrap justify-center gap-2">
        {(["home", "workers", "zero-trust", "settings"] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() =>
              scrollToItem(id, { align: "center", behavior: "smooth" })
            }
            className="cursor-pointer rounded-lg border border-lark-line bg-lark-base px-3 py-1.5 text-base text-lark-default transition-colors hover:bg-lark-tint"
          >
            滚动到 {id}
          </button>
        ))}
      </div>
    </div>
  );
}

/** 通过 `useSidebar().scrollToItem(id, options)` 命令式滚动到 `itemId` 属性对应的条目。 */
export function SidebarScrollToItemDemo() {
  return (
    <DemoContainer>
      <Sidebar.Provider contained defaultOpen className="h-full min-h-0!">
        <Sidebar>
          <Sidebar.Header>
            <BrandLogo />
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.Menu>
                {LONG_NAV_ITEMS.map((label, idx) => (
                  <Sidebar.MenuButton
                    key={label}
                    icon={idx === 0 ? HouseIcon : GlobeIcon}
                    active={idx === 0}
                    itemId={ANCHOR_ID_BY_LABEL[label]}
                  >
                    {label}
                  </Sidebar.MenuButton>
                ))}
              </Sidebar.Menu>
            </Sidebar.Group>
          </Sidebar.Content>
          <DemoSidebarFooter>
            <Sidebar.Trigger />
          </DemoSidebarFooter>
        </Sidebar>
        <DemoMain>
          <ScrollToItemControls />
        </DemoMain>
      </Sidebar.Provider>
    </DemoContainer>
  );
}

// ---------------------------------------------------------------------------
// 10. Mobile — navigation drawer with Escape to close
// ---------------------------------------------------------------------------

function MobileToggleButton() {
  const { toggleSidebar, openMobile } = useSidebar();
  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className="cursor-pointer rounded-lg border border-lark-line bg-lark-base px-3 py-1.5 text-base text-lark-default transition-colors hover:bg-lark-tint"
    >
      {openMobile ? "关闭侧边栏" : "打开侧边栏"}
    </button>
  );
}

/** 移动端侧边栏示例。使用较大的 `mobileBreakpoint`，在任何视口宽度下都强制进入移动端模式。 */
export function SidebarMobileDemo() {
  return (
    <div className="relative h-[540px] w-full overflow-hidden rounded-lg border border-lark-line bg-lark-base">
      <Sidebar.Provider contained mobileBreakpoint={9999} className="h-full">
        <Sidebar>
          <Sidebar.Header>
            <BrandLogo />
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>概览</Sidebar.GroupLabel>
              <Sidebar.Menu>
                <Sidebar.MenuButton icon={HouseIcon} active>
                  首页
                </Sidebar.MenuButton>
                <Sidebar.MenuButton icon={ChartBarIcon}>
                  分析
                </Sidebar.MenuButton>
                <Sidebar.MenuButton icon={GlobeIcon}>域名</Sidebar.MenuButton>
              </Sidebar.Menu>
            </Sidebar.Group>

            <Sidebar.Group>
              <Sidebar.GroupLabel>构建</Sidebar.GroupLabel>
              <Sidebar.Menu>
                <Sidebar.MenuButton icon={CodeIcon}>计算</Sidebar.MenuButton>
                <Sidebar.MenuButton icon={DatabaseIcon}>
                  存储
                </Sidebar.MenuButton>
              </Sidebar.Menu>
            </Sidebar.Group>
          </Sidebar.Content>
          <DemoSidebarFooter>
            <Sidebar.Trigger />
          </DemoSidebarFooter>
        </Sidebar>
        <DemoMain>
          <MobileToggleButton />
          <p>点击按钮打开移动端侧边栏</p>
          <p className="text-sm text-lark-subtle">按 Esc 键或点击遮罩层关闭</p>
        </DemoMain>
      </Sidebar.Provider>
    </div>
  );
}
// ---------------------------------------------------------------------------
// 11. Full-screen mobile — nav fills the viewport, route lives in breadcrumbs
// ---------------------------------------------------------------------------

/** A node in the nav tree. Leaves are navigable; branches expand. */
interface NavNode {
  label: string;
  icon?: React.ElementType;
  /** Small status pill, e.g. "Beta" / "New". */
  badge?: string;
  children?: NavNode[];
}

/** Status pill used beside nav labels. */
function NavBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-1.5 shrink-0 rounded-full border border-dashed border-lark-line px-1.5 py-px text-[10px] font-medium text-lark-subtle">
      {children}
    </span>
  );
}

/** Quick search affordance pinned above the nav list. */
function QuickSearch() {
  return (
    <button
      type="button"
      className="group flex h-8 w-full shrink-0 cursor-pointer items-center gap-2 overflow-x-clip rounded-lg border-0 bg-lark-base px-3 text-left text-sm font-normal !text-lark-default shadow-xs ring ring-lark-line transition-[color,background,border,box-shadow] duration-250 select-none not-disabled:hover:bg-lark-tint focus:ring-lark-focus/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-lark-brand"
    >
      <MagnifyingGlassIcon className="size-4 shrink-0" />
      <span className="flex-1 text-left">快速搜索……</span>
      <kbd className="shrink-0 font-sans text-xs text-lark-subtle">⌘K</kbd>
    </button>
  );
}

/**
 * The nav tree. Breadcrumbs are derived from this, so the trail can never drift
 * out of sync with the sidebar — selecting a leaf yields its full ancestry.
 */
const NAV_TREE: { group: string | null; items: NavNode[] }[] = [
  {
    group: null,
    items: [
      { label: "账号首页", icon: HouseIcon },
      { label: "最近访问", icon: ClockCounterClockwiseIcon },
      { label: "域名", icon: GlobeIcon },
    ],
  },
  {
    group: "观测",
    items: [
      {
        label: "调查",
        icon: FileMagnifyingGlassIcon,
        children: [
          { label: "日志浏览器" },
          { label: "链路追踪", badge: "测试版" },
          { label: "Logpush" },
        ],
      },
      {
        label: "分析",
        icon: ChartPieIcon,
        children: [
          { label: "仪表板", badge: "全新" },
          { label: "账号分析" },
          { label: "网站分析" },
        ],
      },
    ],
  },
  {
    group: "构建",
    items: [
      {
        label: "计算",
        icon: CodeIcon,
        children: [
          { label: "Workers & Pages" },
          { label: "可观测性" },
          { label: "Workers for Platforms" },
          { label: "容器" },
          { label: "Durable Objects" },
          { label: "队列" },
          { label: "工作流" },
          { label: "Browser Run" },
          { label: "VPC", badge: "测试版" },
        ],
      },
      {
        label: "存储与数据库",
        icon: DatabaseIcon,
        children: [
          { label: "R2 对象存储" },
          { label: "KV" },
          { label: "D1 SQL 数据库" },
          { label: "Hyperdrive" },
        ],
      },
    ],
  },
  {
    group: "安全",
    items: [
      {
        label: "访问",
        icon: LockIcon,
        children: [{ label: "应用" }, { label: "服务授权" }],
      },
      { label: "WAF", icon: ShieldCheckIcon },
    ],
  },
];

/**
 * Renders a nav subtree. Branches are collapsible and auto-open when they are
 * on the selected path; leaves select and close the nav.
 */
function NavSubtree({
  nodes,
  path,
  selected,
  onSelect,
}: {
  nodes: NavNode[];
  path: string[];
  selected: string[];
  onSelect: (path: string[]) => void;
}) {
  return (
    <Sidebar.MenuSub>
      {nodes.map((node) => {
        const nodePath = [...path, node.label];
        const onSelectedPath = nodePath.every((p, i) => selected[i] === p);

        if (!node.children) {
          return (
            <Sidebar.MenuSubItem key={node.label}>
              <Sidebar.MenuSubButton
                active={onSelectedPath && selected.length === nodePath.length}
                onClick={() => onSelect(nodePath)}
              >
                {node.label}
                {node.badge && <NavBadge>{node.badge}</NavBadge>}
              </Sidebar.MenuSubButton>
            </Sidebar.MenuSubItem>
          );
        }

        return (
          <Sidebar.MenuSubItem key={node.label}>
            <Sidebar.Collapsible defaultOpen={onSelectedPath}>
              <Sidebar.CollapsibleTrigger
                render={
                  <Sidebar.MenuSubButton>
                    {node.label}
                    <Sidebar.MenuChevron />
                  </Sidebar.MenuSubButton>
                }
              />
              <Sidebar.CollapsibleContent>
                <NavSubtree
                  nodes={node.children}
                  path={nodePath}
                  selected={selected}
                  onSelect={onSelect}
                />
              </Sidebar.CollapsibleContent>
            </Sidebar.Collapsible>
          </Sidebar.MenuSubItem>
        );
      })}
    </Sidebar.MenuSub>
  );
}

/** Closes the mobile nav after a leaf is chosen, mirroring real navigation. */
function NavTree({
  selected,
  onSelect,
}: {
  selected: string[];
  onSelect: (path: string[]) => void;
}) {
  const { setOpenMobile } = useSidebar();
  const select = (path: string[]) => {
    onSelect(path);
    setOpenMobile(false);
  };

  return (
    <>
      {NAV_TREE.map(({ group, items }) => (
        <Sidebar.Group key={group ?? "root"}>
          {group && <Sidebar.GroupLabel>{group}</Sidebar.GroupLabel>}
          <Sidebar.Menu>
            {items.map((node) => {
              const nodePath = [node.label];
              const onSelectedPath = selected[0] === node.label;

              if (!node.children) {
                return (
                  <Sidebar.MenuButton
                    key={node.label}
                    icon={node.icon}
                    active={onSelectedPath && selected.length === 1}
                    onClick={() => select(nodePath)}
                  >
                    {node.label}
                  </Sidebar.MenuButton>
                );
              }

              return (
                <Sidebar.MenuItem key={node.label}>
                  <Sidebar.Collapsible defaultOpen={onSelectedPath}>
                    <Sidebar.CollapsibleTrigger
                      render={
                        <Sidebar.MenuButton icon={node.icon}>
                          {node.label}
                          <Sidebar.MenuChevron />
                        </Sidebar.MenuButton>
                      }
                    />
                    <Sidebar.CollapsibleContent>
                      <NavSubtree
                        nodes={node.children}
                        path={nodePath}
                        selected={selected}
                        onSelect={select}
                      />
                    </Sidebar.CollapsibleContent>
                  </Sidebar.Collapsible>
                </Sidebar.MenuItem>
              );
            })}
          </Sidebar.Menu>
        </Sidebar.Group>
      ))}
    </>
  );
}

/**
 * 全屏移动端导航。抽屉覆盖整个视口而不是在后方留下一条页面边，
 * 因此导航项可以获得更舒适的触控区域。当前路由由基于导航树本身生成的面包屑导航承载。
 */
export function SidebarFullScreenMobileDemo() {
  // Deep default selection, so the trail starts in a realistic overflow state.
  const [selected, setSelected] = useState(["分析", "账号分析"]);
  // Narrower than the demo box, so overflow collapsing is visible without
  // needing to resize the browser.
  const [width, setWidth] = useState(390);

  // Trail derived from the selection: ancestors collapse, leaf is current.
  const ancestors = selected.slice(0, -1);
  const current = selected[selected.length - 1];
  // No overflow machinery: render the trail plainly and let the leaf truncate
  // when it runs out of room. Simpler, and the route stays readable because it
  // is the only thing allowed to shrink.
  // No account crumb — the avatar to the left already carries it, and at phone
  // widths every crumb spent on context is width taken from the actual route.
  const trail = ancestors;

  return (
    <div className="flex flex-col gap-3">
      {/* Width control — stands in for resizing a real phone viewport. */}
      <label className="flex items-center gap-3 text-sm text-lark-subtle">
        <span className="shrink-0">视口</span>
        <input
          type="range"
          min={280}
          max={720}
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          className="flex-1 cursor-pointer"
        />
        <span className="w-14 shrink-0 text-right tabular-nums">{width}px</span>
      </label>

      <div
        className="relative h-[540px] overflow-hidden rounded-lg border border-lark-line bg-lark-base"
        style={{ width }}
      >
        <Sidebar.Provider contained mobileBreakpoint={9999} className="h-full">
          <Sidebar fullScreenOnMobile>
            {/* Single row: avatar, then the trail takes the rest of the width.
                Mirrors the product header — account mark, then breadcrumbs. */}
            <Sidebar.Header className="gap-2 px-3.5">
              <CompactAccountSwitcher />
              <div className="min-w-0 flex-1">
                <Breadcrumbs size="sm">
                  {trail.map((label) => (
                    <Fragment key={label}>
                      <Breadcrumbs.Link href="#">{label}</Breadcrumbs.Link>
                      <Breadcrumbs.Separator />
                    </Fragment>
                  ))}
                  <Breadcrumbs.Current>{current}</Breadcrumbs.Current>
                </Breadcrumbs>
              </div>
              <Sidebar.Close />
            </Sidebar.Header>
            <Sidebar.Content>
              <div className="pt-1 pb-2">
                <QuickSearch />
              </div>
              <NavTree selected={selected} onSelect={setSelected} />
            </Sidebar.Content>
          </Sidebar>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex h-12 shrink-0 items-center gap-2 border-b border-lark-line px-3">
              <Sidebar.Trigger />
              <div className="min-w-0 flex-1">
                <Breadcrumbs size="sm">
                  {trail.map((label) => (
                    <Fragment key={label}>
                      <Breadcrumbs.Link href="#">{label}</Breadcrumbs.Link>
                      <Breadcrumbs.Separator />
                    </Fragment>
                  ))}
                  <Breadcrumbs.Current>{current}</Breadcrumbs.Current>
                </Breadcrumbs>
              </div>
            </header>
            <DemoMain>
              <p className="text-lark-default">{current}</p>
              <p className="text-sm text-lark-subtle">
                在导航中逐层进入 ——
                面包屑由导航树推导，因此始终与你当前所在的位置一致。
              </p>
            </DemoMain>
          </div>
        </Sidebar.Provider>
      </div>
    </div>
  );
}
