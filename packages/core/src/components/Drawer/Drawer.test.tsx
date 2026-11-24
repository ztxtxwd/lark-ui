import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { Button } from "../Button";
import { Drawer, DrawerClose, DrawerContent, type DrawerSize, DrawerTrigger } from "./Drawer";

function openTrigger(name = "打开抽屉") {
  return screen.getByRole("button", { name });
}

function ControlledDrawer() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        外部打开
      </button>
      <Drawer open={open} onOpenChange={(next) => setOpen(next)}>
        <DrawerContent title="受控抽屉">受控内容</DrawerContent>
      </Drawer>
    </div>
  );
}

const longRows = Array.from({ length: 30 }, (_, index) => `第 ${index + 1} 行内容`);

describe("Drawer", () => {
  it("opens from its trigger, is named by the title, and shows description and footer", async () => {
    render(
      <Drawer>
        <DrawerTrigger>打开抽屉</DrawerTrigger>
        <DrawerContent
          title="成员详情"
          description="查看并管理项目成员"
          footer={
            <>
              <DrawerClose
                render={
                  <Button appearance="outlined" tone="neutral">
                    取消
                  </Button>
                }
              />
              <Button>保存</Button>
            </>
          }
        >
          成员列表
        </DrawerContent>
      </Drawer>,
    );

    await userEvent.click(openTrigger());

    const dialog = await screen.findByRole("dialog", { name: "成员详情" });
    expect(dialog).toHaveAttribute("data-side", "right");
    expect(within(dialog).getByText("查看并管理项目成员")).toBeInTheDocument();
    expect(within(dialog).getByText("成员列表")).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "保存" })).toBeInTheDocument();
  });

  it("closes from the close button and returns focus to the trigger", async () => {
    render(
      <Drawer>
        <DrawerTrigger>打开设置</DrawerTrigger>
        <DrawerContent title="设置">内容</DrawerContent>
      </Drawer>,
    );

    const trigger = openTrigger("打开设置");
    await userEvent.click(trigger);

    const dialog = await screen.findByRole("dialog", { name: "设置" });
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));

    await userEvent.click(within(dialog).getByRole("button", { name: "关闭" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("closes with Escape and returns focus", async () => {
    render(
      <Drawer defaultOpen>
        <DrawerContent title="按 ESC 关闭">内容</DrawerContent>
      </Drawer>,
    );

    const dialog = await screen.findByRole("dialog", { name: "按 ESC 关闭" });
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));

    await userEvent.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes when the mask is pressed", async () => {
    render(
      <Drawer defaultOpen>
        <DrawerContent title="点击遮罩关闭" description="模态抽屉">
          内容
        </DrawerContent>
      </Drawer>,
    );

    await screen.findByRole("dialog", { name: "点击遮罩关闭" });

    const mask = document.querySelector('[data-slot="drawer-backdrop"]');
    expect(mask).not.toBeNull();

    await userEvent.click(mask as HTMLElement);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("keeps keyboard focus inside a modal drawer", async () => {
    render(
      <Drawer defaultOpen>
        <DrawerContent title="焦点陷阱" footer={<Button>保存</Button>}>
          内容
        </DrawerContent>
      </Drawer>,
    );

    const dialog = await screen.findByRole("dialog", { name: "焦点陷阱" });
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));

    for (let index = 0; index < 8; index += 1) {
      await userEvent.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }

    await userEvent.tab({ shift: true });
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  const sizes: { size: DrawerSize; className: string }[] = [
    { size: "sm", className: "w-[350px]" },
    { size: "md", className: "w-[480px]" },
    { size: "lg", className: "w-[680px]" },
  ];

  for (const { size, className } of sizes) {
    it(`uses the documented ${size} width (${className}) for side drawers`, async () => {
      const view = render(
        <Drawer defaultOpen side="right">
          <DrawerContent title={`${size} 抽屉`} size={size}>
            内容
          </DrawerContent>
        </Drawer>,
      );

      const dialog = await screen.findByRole("dialog", { name: `${size} 抽屉` });
      expect(dialog.className).toContain(className);
      expect(dialog.className).toContain("h-dvh");
      view.unmount();
    });
  }

  it("uses the size as height for top and bottom drawers", async () => {
    const view = render(
      <Drawer defaultOpen side="bottom">
        <DrawerContent title="底部抽屉" size="md">
          内容
        </DrawerContent>
      </Drawer>,
    );

    const bottom = await screen.findByRole("dialog", { name: "底部抽屉" });
    expect(bottom).toHaveAttribute("data-side", "bottom");
    expect(bottom.className).toContain("h-[480px]");
    expect(bottom.className).toContain("w-full");
    expect(bottom.className).toContain("max-h-dvh");
    expect(getComputedStyle(bottom).maxHeight).toBe(`${window.innerHeight}px`);
    view.unmount();

    const topView = render(
      <Drawer defaultOpen side="top">
        <DrawerContent title="顶部抽屉" size="lg">
          内容
        </DrawerContent>
      </Drawer>,
    );

    const top = await screen.findByRole("dialog", { name: "顶部抽屉" });
    expect(top).toHaveAttribute("data-side", "top");
    expect(top.className).toContain("h-[680px]");
    topView.unmount();
  });

  it("keeps the header and footer fixed while the body scrolls", async () => {
    render(
      <Drawer defaultOpen>
        <DrawerContent title="长内容" description="辅助信息" footer={<Button>保存</Button>}>
          {longRows.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </DrawerContent>
      </Drawer>,
    );

    const dialog = await screen.findByRole("dialog", { name: "长内容" });
    const header = dialog.querySelector('[data-slot="drawer-header"]') as HTMLElement;
    const body = dialog.querySelector('[data-slot="drawer-body"]') as HTMLElement;
    const footer = dialog.querySelector('[data-slot="drawer-footer"]') as HTMLElement;

    expect(getComputedStyle(header).flexShrink).toBe("0");
    expect(getComputedStyle(body).overflowY).toBe("auto");
    expect(getComputedStyle(body).flexGrow).toBe("1");
    expect(getComputedStyle(footer).flexShrink).toBe("0");

    const title = within(dialog).getByRole("heading", { name: "长内容" });
    expect(getComputedStyle(title).fontSize).toBe("16px");
    expect(getComputedStyle(title).lineHeight).toBe("24px");
    expect(getComputedStyle(title).fontWeight).toBe("500");
    expect(getComputedStyle(header).paddingTop).toBe("16px");
    expect(getComputedStyle(header).paddingLeft).toBe("24px");

    const description = within(dialog).getByText("辅助信息");
    expect(getComputedStyle(description).fontSize).toBe("14px");
    expect(getComputedStyle(description).color).toBe("rgb(100, 106, 115)");
  });

  it("renders an accessible grabber for snap-point drawers", async () => {
    render(
      <Drawer defaultOpen side="bottom" snapPoints={[0.3, 0.6]} defaultSnapPoint={0.3}>
        <DrawerContent title="可拖拽抽屉" size="md" resizable>
          内容
        </DrawerContent>
      </Drawer>,
    );

    const dialog = await screen.findByRole("dialog", { name: "可拖拽抽屉" });
    expect(within(dialog).getByRole("button", { name: "调整大小" })).toBeInTheDocument();
  });

  it("can hide the close button and the mask", async () => {
    render(
      <Drawer defaultOpen modal={false} closeOnOutsidePress={false}>
        <DrawerContent title="非模态抽屉" closable={false} mask={false}>
          内容
        </DrawerContent>
      </Drawer>,
    );

    const dialog = await screen.findByRole("dialog", { name: "非模态抽屉" });
    expect(within(dialog).queryByRole("button", { name: "关闭" })).toBeNull();
    expect(document.querySelector('[data-slot="drawer-backdrop"]')).toBeNull();

    await userEvent.click(document.body);
    expect(screen.getByRole("dialog", { name: "非模态抽屉" })).toBeInTheDocument();
  });

  it("supports controlled open state", async () => {
    render(<ControlledDrawer />);

    expect(screen.queryByRole("dialog")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "外部打开" }));
    expect(await screen.findByRole("dialog", { name: "受控抽屉" })).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
