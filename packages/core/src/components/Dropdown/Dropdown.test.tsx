import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Dropdown,
  DropdownContent,
  DropdownContextTrigger,
  DropdownGroup,
  DropdownGroupLabel,
  DropdownItem,
  DropdownSeparator,
  DropdownSubmenu,
  DropdownSubmenuContent,
  DropdownSubmenuTrigger,
  DropdownTrigger,
} from "./Dropdown";

function ActionsMenu({
  onAction,
  onOpenChange,
}: {
  onAction?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Dropdown onAction={onAction} onOpenChange={onOpenChange}>
      <DropdownTrigger>更多操作</DropdownTrigger>
      <DropdownContent>
        <DropdownItem value="edit">编辑</DropdownItem>
        <DropdownItem value="duplicate" shortcut="mod+d">
          复制
        </DropdownItem>
        <DropdownItem value="delete" danger>
          删除
        </DropdownItem>
        <DropdownItem value="unavailable" disabled>
          不可用
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}

describe("Dropdown", () => {
  it("opens on click with a named menu and focuses the first item", async () => {
    render(<ActionsMenu />);

    const trigger = screen.getByRole("button", { name: "更多操作" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);

    const menu = await screen.findByRole("menu", { name: "更多操作" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(menu).toHaveAttribute("data-slot", "menu-content");
    expect(within(menu).getAllByRole("menuitem")).toHaveLength(4);

    // A pointer open keeps focus on the menu container (ui-sdk avoids stealing
    // focus that is already inside the popup); keyboard entry starts on item one.
    await waitFor(() => expect(menu).toHaveFocus());
    await userEvent.keyboard("{Home}");
    expect(within(menu).getByRole("menuitem", { name: "编辑" })).toHaveFocus();
  });

  it("moves with arrows, Home and End, and runs the item with Enter", async () => {
    const onAction = vi.fn();
    render(<ActionsMenu onAction={onAction} />);

    const trigger = screen.getByRole("button", { name: "更多操作" });
    await userEvent.click(trigger);
    const menu = await screen.findByRole("menu");
    const edit = within(menu).getByRole("menuitem", { name: "编辑" });
    const duplicate = within(menu).getByRole("menuitem", { name: "复制" });
    const remove = within(menu).getByRole("menuitem", { name: "不可用" });

    await waitFor(() => expect(menu).toHaveFocus());
    await userEvent.keyboard("{Home}");
    expect(edit).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(duplicate).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    expect(edit).toHaveFocus();
    await userEvent.keyboard("{End}");
    expect(remove).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(edit).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(onAction.mock.calls[0]?.[0]).toBe("edit");
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it("selects an item by pointer, closes and returns focus to the trigger", async () => {
    const onAction = vi.fn();
    render(<ActionsMenu onAction={onAction} />);

    const trigger = screen.getByRole("button", { name: "更多操作" });
    await userEvent.click(trigger);
    const menu = await screen.findByRole("menu");

    await userEvent.click(within(menu).getByRole("menuitem", { name: "复制" }));
    expect(onAction.mock.calls[0]?.[0]).toBe("duplicate");
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it("marks danger and disabled items and ignores disabled presses", async () => {
    const onAction = vi.fn();
    render(<ActionsMenu onAction={onAction} />);

    await userEvent.click(screen.getByRole("button", { name: "更多操作" }));
    const menu = await screen.findByRole("menu");
    const remove = within(menu).getByRole("menuitem", { name: "删除" });
    const unavailable = within(menu).getByRole("menuitem", { name: "不可用" });

    expect(remove).toHaveAttribute("data-destructive");
    expect(remove.className).toContain("data-[destructive]:text-lark-danger-strong");
    expect(unavailable).toHaveAttribute("data-disabled");
    expect(unavailable).toHaveAttribute("aria-disabled", "true");
    expect(unavailable.className).toContain("data-[disabled]:text-lark-disabled");

    await userEvent.click(unavailable);
    expect(onAction).not.toHaveBeenCalled();
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("supports onSelect as a choosing-item convenience", async () => {
    const onSelect = vi.fn();
    render(
      <Dropdown onSelect={onSelect}>
        <DropdownTrigger>选择</DropdownTrigger>
        <DropdownContent>
          <DropdownItem value="first">第一项</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );

    await userEvent.click(screen.getByRole("button", { name: "选择" }));
    const menu = await screen.findByRole("menu");
    await userEvent.click(within(menu).getByRole("menuitem", { name: "第一项" }));
    expect(onSelect).toHaveBeenCalledWith("first");
  });

  it("closes with Escape and returns focus to the trigger", async () => {
    render(<ActionsMenu />);

    const trigger = screen.getByRole("button", { name: "更多操作" });
    await userEvent.click(trigger);
    await screen.findByRole("menu");

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it("jumps to an item with typeahead", async () => {
    render(
      <Dropdown>
        <DropdownTrigger>文件</DropdownTrigger>
        <DropdownContent>
          <DropdownItem value="rename">Rename</DropdownItem>
          <DropdownItem value="duplicate">Duplicate</DropdownItem>
          <DropdownItem value="delete">Delete</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );

    await userEvent.click(screen.getByRole("button", { name: "文件" }));
    const menu = await screen.findByRole("menu");
    const remove = within(menu).getByRole("menuitem", { name: "Delete" });
    await waitFor(() => expect(menu).toHaveFocus());

    await userEvent.keyboard("de");
    expect(remove).toHaveFocus();
  });

  it("keeps the menu open for keepOpen and shows a selected check", async () => {
    const onSelect = vi.fn();
    render(
      <Dropdown>
        <DropdownTrigger>视图</DropdownTrigger>
        <DropdownContent>
          <DropdownItem value="list" selected onSelect={onSelect} keepOpen>
            列表
          </DropdownItem>
          <DropdownItem value="grid">网格</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );

    await userEvent.click(screen.getByRole("button", { name: "视图" }));
    const menu = await screen.findByRole("menu");
    const item = within(menu).getByRole("menuitem", { name: "列表" });

    expect(item.querySelector('[data-slot="dropdown-item-check"]')).not.toBeNull();

    await userEvent.click(item);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("opens a submenu with the keyboard and closes only the submenu", async () => {
    render(
      <Dropdown>
        <DropdownTrigger>分享</DropdownTrigger>
        <DropdownContent>
          <DropdownItem value="copy">复制链接</DropdownItem>
          <DropdownSubmenu>
            <DropdownSubmenuTrigger>分享到</DropdownSubmenuTrigger>
            <DropdownSubmenuContent>
              <DropdownItem value="chat">聊天</DropdownItem>
              <DropdownItem value="docs">文档</DropdownItem>
            </DropdownSubmenuContent>
          </DropdownSubmenu>
        </DropdownContent>
      </Dropdown>,
    );

    await userEvent.click(screen.getByRole("button", { name: "分享" }));
    const menu = await screen.findByRole("menu");
    const copy = within(menu).getByRole("menuitem", { name: "复制链接" });
    const shareTo = within(menu).getByRole("menuitem", { name: "分享到" });
    await waitFor(() => expect(menu).toHaveFocus());

    await userEvent.keyboard("{Home}");
    expect(copy).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(shareTo).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");

    const chat = await screen.findByRole("menuitem", { name: "聊天" });
    await waitFor(() => expect(chat).toHaveFocus());

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("menuitem", { name: "聊天" })).not.toBeInTheDocument();
    });
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(shareTo).toHaveFocus();
  });

  it("aligns a submenu's top edge with its parent item", async () => {
    render(
      <Dropdown>
        <DropdownTrigger>分享</DropdownTrigger>
        <DropdownContent>
          <DropdownItem value="copy">复制链接</DropdownItem>
          <DropdownSubmenu>
            <DropdownSubmenuTrigger>分享到</DropdownSubmenuTrigger>
            <DropdownSubmenuContent>
              <DropdownItem value="chat">聊天</DropdownItem>
            </DropdownSubmenuContent>
          </DropdownSubmenu>
        </DropdownContent>
      </Dropdown>,
    );

    await userEvent.click(screen.getByRole("button", { name: "分享" }));
    const menu = await screen.findByRole("menu");
    const shareTo = within(menu).getByRole("menuitem", { name: "分享到" });
    await waitFor(() => expect(menu).toHaveFocus());
    await userEvent.keyboard("{Home}");
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{ArrowRight}");

    const chat = await screen.findByRole("menuitem", { name: "聊天" });
    const submenu = chat.closest('[data-slot="menu-content"]') as HTMLElement;
    await vi.waitFor(() => expect(getComputedStyle(submenu).opacity).toBe("1"));

    const itemTop = shareTo.getBoundingClientRect().top;
    const submenuTop = submenu.getBoundingClientRect().top;
    expect(Math.abs(submenuTop - itemTop)).toBeLessThanOrEqual(1);
  });

  it("mirrors a submenu to the inline end in RTL text", async () => {
    render(
      // A narrow RTL area near the page's left edge leaves room on the
      // submenu's physical right, so a forced side would not be masked by a
      // collision flip.
      <div dir="rtl" style={{ width: 220 }}>
        <Dropdown>
          <DropdownTrigger>分享</DropdownTrigger>
          <DropdownContent>
            <DropdownItem value="copy">复制链接</DropdownItem>
            <DropdownSubmenu>
              <DropdownSubmenuTrigger>分享到</DropdownSubmenuTrigger>
              <DropdownSubmenuContent>
                <DropdownItem value="chat">聊天</DropdownItem>
              </DropdownSubmenuContent>
            </DropdownSubmenu>
          </DropdownContent>
        </Dropdown>
      </div>,
    );

    await userEvent.click(screen.getByRole("button", { name: "分享" }));
    const menu = await screen.findByRole("menu");
    await waitFor(() => expect(menu).toHaveFocus());
    await userEvent.keyboard("{Home}");
    await userEvent.keyboard("{ArrowDown}");
    // In RTL the inline end is the left, so the left arrow opens the submenu.
    await userEvent.keyboard("{ArrowLeft}");

    const chat = await screen.findByRole("menuitem", { name: "聊天" });
    const submenu = chat.closest('[data-slot="menu-content"]') as HTMLElement;
    expect(submenu).not.toBeNull();
    expect(submenu).not.toBe(menu);
    expect(submenu).toHaveAttribute("data-side", "left");
  });

  it("runs a submenu item and closes the whole menu", async () => {
    const onAction = vi.fn();
    render(
      <Dropdown onAction={onAction}>
        <DropdownTrigger>分享</DropdownTrigger>
        <DropdownContent>
          <DropdownItem value="copy">复制链接</DropdownItem>
          <DropdownSubmenu>
            <DropdownSubmenuTrigger>分享到</DropdownSubmenuTrigger>
            <DropdownSubmenuContent>
              <DropdownItem value="chat">聊天</DropdownItem>
            </DropdownSubmenuContent>
          </DropdownSubmenu>
        </DropdownContent>
      </Dropdown>,
    );

    const trigger = screen.getByRole("button", { name: "分享" });
    await userEvent.click(trigger);
    const menu = await screen.findByRole("menu");
    const copy = within(menu).getByRole("menuitem", { name: "复制链接" });
    await waitFor(() => expect(menu).toHaveFocus());
    await userEvent.keyboard("{Home}");
    expect(copy).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{ArrowRight}");

    const chat = await screen.findByRole("menuitem", { name: "聊天" });
    await waitFor(() => expect(chat).toHaveFocus());
    await userEvent.keyboard("{Enter}");

    expect(onAction.mock.calls[0]?.[0]).toBe("chat");
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it("renders groups with a label and a full-width separator", async () => {
    render(
      <Dropdown>
        <DropdownTrigger>操作</DropdownTrigger>
        <DropdownContent>
          <DropdownGroup>
            <DropdownGroupLabel>文件</DropdownGroupLabel>
            <DropdownItem value="open">打开</DropdownItem>
          </DropdownGroup>
          <DropdownSeparator />
          <DropdownItem value="settings">设置</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );

    await userEvent.click(screen.getByRole("button", { name: "操作" }));
    const menu = await screen.findByRole("menu");
    expect(within(menu).getByRole("group", { name: "文件" })).toBeInTheDocument();
    expect(within(menu).getByRole("separator")).toHaveClass("-mx-1");
  });

  it("uses UD surface and item metrics in light and dark themes", async () => {
    render(<ActionsMenu />);
    await userEvent.click(screen.getByRole("button", { name: "更多操作" }));
    const menu = await screen.findByRole("menu");
    const menuStyle = getComputedStyle(menu);
    expect(menuStyle.backgroundColor).toBe("rgb(255, 255, 255)");
    expect(menuStyle.borderRadius).toBe("8px");
    expect(menuStyle.boxShadow).not.toBe("none");
    expect(menuStyle.maxHeight).toBe("480px");
    expect(menuStyle.maxWidth).toBe("420px");

    const item = within(menu).getByRole("menuitem", { name: "编辑" });
    const itemStyle = getComputedStyle(item);
    expect(itemStyle.minHeight).toBe("28px");
    expect(itemStyle.paddingLeft).toBe("8px");
    expect(itemStyle.paddingTop).toBe("4px");
    expect(itemStyle.borderRadius).toBe("4px");

    const danger = within(menu).getByRole("menuitem", { name: "删除" });
    expect(getComputedStyle(danger).color).toBe("rgb(226, 46, 40)");
    const disabled = within(menu).getByRole("menuitem", { name: "不可用" });
    expect(getComputedStyle(disabled).color).toBe("rgb(187, 191, 196)");

    document.documentElement.classList.add("dark");
    try {
      await vi.waitFor(() => {
        expect(getComputedStyle(menu).backgroundColor).toBe("rgb(41, 41, 41)");
      });
      await vi.waitFor(() => {
        expect(getComputedStyle(danger).color).toBe("rgb(246, 130, 126)");
      });
    } finally {
      document.documentElement.classList.remove("dark");
    }
  });

  it("opens a documented context menu on right-click", async () => {
    render(
      <Dropdown>
        <DropdownContextTrigger data-testid="context-area">右键此处</DropdownContextTrigger>
        <DropdownContent>
          <DropdownItem value="paste">粘贴</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );

    fireEvent.contextMenu(screen.getByTestId("context-area"));
    const menu = await screen.findByRole("menu");
    expect(within(menu).getByRole("menuitem", { name: "粘贴" })).toBeInTheDocument();
  });

  it("keeps the context area in the tab order for its keyboard trigger", async () => {
    render(
      <Dropdown>
        <DropdownContextTrigger data-testid="context-area">右键此处</DropdownContextTrigger>
        <DropdownContent>
          <DropdownItem value="paste">粘贴</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );

    const area = screen.getByTestId("context-area");
    expect(area).toHaveAttribute("tabindex", "0");

    await userEvent.tab();
    expect(area).toHaveFocus();
    expect(getComputedStyle(area).outlineStyle).toBe("solid");
    expect(getComputedStyle(area).outlineWidth).toBe("2px");

    // The browser turns Shift+F10 on the focused area into a contextmenu event.
    fireEvent.contextMenu(area);
    expect(await screen.findByRole("menu")).toBeInTheDocument();
  });

  it("allows the context area to opt out of the tab order", () => {
    render(
      <Dropdown>
        <DropdownContextTrigger data-testid="context-area" tabIndex={-1}>
          右键此处
        </DropdownContextTrigger>
        <DropdownContent>
          <DropdownItem value="paste">粘贴</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );

    expect(screen.getByTestId("context-area")).toHaveAttribute("tabindex", "-1");
  });

  it("supports inline and full-width triggers", () => {
    const { rerender } = render(
      <Dropdown>
        <DropdownTrigger>菜单</DropdownTrigger>
        <DropdownContent>
          <DropdownItem value="a">一</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );
    expect(screen.getByRole("button", { name: "菜单" }).className).toContain("inline-flex");

    rerender(
      <Dropdown>
        <DropdownTrigger inline={false}>菜单</DropdownTrigger>
        <DropdownContent>
          <DropdownItem value="a">一</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );
    const trigger = screen.getByRole("button", { name: "菜单" });
    expect(trigger.className).toContain("w-full");
    expect(trigger.className).toContain("justify-between");
  });

  it("writes the danger icon colour and shortcut text styles", async () => {
    render(
      <Dropdown>
        <DropdownTrigger>更多</DropdownTrigger>
        <DropdownContent>
          <DropdownItem value="delete" danger shortcut="mod+backspace" icon={<span>×</span>}>
            删除
          </DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );

    await userEvent.click(screen.getByRole("button", { name: "更多" }));
    const menu = await screen.findByRole("menu");
    const item = within(menu).getByRole("menuitem", { name: "删除" });

    expect(item.querySelector('[data-slot="menu-item-icon"]')).not.toBeNull();
    expect(item.querySelector('[data-slot="menu-shortcut"]')?.textContent).toBeTruthy();
    expect(item).toHaveAttribute("aria-keyshortcuts");
  });
});
