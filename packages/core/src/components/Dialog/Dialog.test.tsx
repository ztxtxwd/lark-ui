import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "../Button";
import { Dialog, DialogContent, DialogTrigger } from "./Dialog";

describe("Dialog", () => {
  it("opens from its trigger and is named by the title", async () => {
    render(
      <Dialog>
        <DialogTrigger>打开对话框</DialogTrigger>
        <DialogContent
          title="删除文档"
          description="删除后将无法恢复。"
          footer={<Button tone="danger">删除</Button>}
        >
          确定要删除这份文档吗？
        </DialogContent>
      </Dialog>,
    );

    await userEvent.click(screen.getByRole("button", { name: "打开对话框" }));

    const dialog = await screen.findByRole("dialog", { name: "删除文档" });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText("删除后将无法恢复。")).toBeInTheDocument();
    expect(screen.getByText("确定要删除这份文档吗？")).toBeInTheDocument();
  });

  it("closes from the close button and Escape", async () => {
    render(
      <Dialog defaultOpen>
        <DialogContent title="设置">内容</DialogContent>
      </Dialog>,
    );

    expect(await screen.findByRole("dialog", { name: "设置" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "关闭" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("dismisses with Escape", async () => {
    render(
      <Dialog defaultOpen>
        <DialogContent title="可按 ESC 关闭">内容</DialogContent>
      </Dialog>,
    );

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("uses the UD 24px title area padding", async () => {
    render(
      <Dialog defaultOpen>
        <DialogContent title="标题" description="说明">
          内容
        </DialogContent>
      </Dialog>,
    );

    const dialog = await screen.findByRole("dialog", { name: "标题" });
    const header = dialog.querySelector('[data-slot="dialog-header"]') as HTMLElement;
    const body = dialog.querySelector('[data-slot="dialog-body"]') as HTMLElement;
    expect(getComputedStyle(header).paddingTop).toBe("24px");
    expect(getComputedStyle(header).paddingRight).toBe("24px");
    expect(getComputedStyle(header).paddingBottom).toBe("24px");
    expect(getComputedStyle(header).paddingLeft).toBe("24px");
    expect(getComputedStyle(body).paddingTop).toBe("0px");
  });

  it("pads the content area when the dialog has no header", async () => {
    render(
      <Dialog defaultOpen>
        <DialogContent aria-label="只有内容" closable={false}>
          只有内容
        </DialogContent>
      </Dialog>,
    );

    const dialog = await screen.findByRole("dialog", { name: "只有内容" });
    expect(dialog.querySelector('[data-slot="dialog-header"]')).toBeNull();
    const body = dialog.querySelector('[data-slot="dialog-body"]') as HTMLElement;
    expect(getComputedStyle(body).paddingTop).toBe("24px");
    expect(getComputedStyle(body).paddingLeft).toBe("24px");
  });

  it("can hide the mask for a non-modal dialog", async () => {
    render(
      <Dialog defaultOpen modal={false} closeOnOutsidePress={false}>
        <DialogContent title="非模态对话框" mask={false} closable={false}>
          内容
        </DialogContent>
      </Dialog>,
    );

    const dialog = await screen.findByRole("dialog", { name: "非模态对话框" });
    expect(document.querySelector('[data-slot="dialog-backdrop"]')).toBeNull();

    await userEvent.click(document.body);
    expect(screen.getByRole("dialog", { name: "非模态对话框" })).toBeInTheDocument();
    expect(dialog).toBeInTheDocument();
  });

  it("supports the documented size widths", async () => {
    render(
      <Dialog defaultOpen>
        <DialogContent title="中尺寸" size="md">
          内容
        </DialogContent>
      </Dialog>,
    );

    const dialog = await screen.findByRole("dialog", { name: "中尺寸" });
    expect(dialog.className).toContain("w-[600px]");
  });
});
