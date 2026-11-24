import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ToastProvider, toast } from "./Toast";

function dismissAll() {
  toast.dismiss();
  for (const region of document.querySelectorAll("[data-ui-sdk-announcer]")) {
    region.remove();
  }
}

afterEach(dismissAll);

function Trigger({ onPress }: { onPress: () => void }) {
  return (
    <button type="button" onClick={onPress}>
      触发
    </button>
  );
}

describe("Toast", () => {
  it("shows a success toast in the Notifications region and announces it politely", async () => {
    render(
      <ToastProvider>
        <Trigger onPress={() => toast.success("保存成功", { description: "所有更改已同步" })} />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));

    const region = await screen.findByRole("region", { name: "通知" });
    expect(region).toHaveAttribute("data-side", "top");
    expect(region).toHaveAttribute("data-align", "center");
    expect(within(region).getByText("保存成功")).toBeInTheDocument();
    expect(within(region).getByText("所有更改已同步")).toBeInTheDocument();
    expect(within(region).getByRole("listitem")).toHaveAttribute("data-type", "success");

    const status = screen.getByRole("status");
    await waitFor(() => expect(status).toHaveTextContent("保存成功"));
    expect(status).toHaveTextContent("所有更改已同步");
  });

  it("announces errors assertively", async () => {
    render(
      <ToastProvider>
        <Trigger onPress={() => toast.error("保存失败")} />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));

    const alert = screen.getByRole("alert");
    await waitFor(() => expect(alert).toHaveTextContent("保存失败"));
  });

  it("runs an action and closes the toast", async () => {
    const onAction = vi.fn();
    render(
      <ToastProvider>
        <Trigger
          onPress={() =>
            toast("已删除 1 个文件", {
              action: { label: "撤销", onAction },
            })
          }
        />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));

    const region = await screen.findByRole("region", { name: "通知" });
    await userEvent.click(within(region).getByRole("button", { name: "撤销" }));

    expect(onAction).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(document.querySelector('[data-slot="toast"]')).toBeNull();
    });
  });

  it("closes from the close button", async () => {
    render(
      <ToastProvider>
        <Trigger
          onPress={() => toast.info("这条提示可以关闭", { closable: true, duration: Infinity })}
        />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));

    const region = await screen.findByRole("region", { name: "通知" });
    await userEvent.click(within(region).getByRole("button", { name: "关闭" }));

    await waitFor(() => {
      expect(document.querySelector('[data-slot="toast"]')).toBeNull();
    });
  });

  it("disappears after its duration", async () => {
    render(
      <ToastProvider>
        <Trigger onPress={() => toast("短暂提示", { duration: 200 })} />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));
    expect(await screen.findByText("短暂提示")).toBeInTheDocument();

    await waitFor(
      () => {
        expect(document.querySelector('[data-slot="toast"]')).toBeNull();
      },
      { timeout: 2000 },
    );
  });

  it("stacks up to maxVisible toasts, newest at the bottom", async () => {
    render(
      <ToastProvider maxVisible={2}>
        <Trigger
          onPress={() => {
            toast("提示 1", { duration: Infinity });
            toast("提示 2", { duration: Infinity });
            toast("提示 3", { duration: Infinity });
          }}
        />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));

    const region = await screen.findByRole("region", { name: "通知" });
    await waitFor(() => {
      expect(within(region).getAllByRole("listitem")).toHaveLength(2);
    });
    expect(within(region).getByText("提示 3")).toBeInTheDocument();
    expect(within(region).getByText("提示 2")).toBeInTheDocument();
    expect(within(region).queryByText("提示 1")).toBeNull();

    const [newest, older] = within(region).getAllByRole("listitem");
    expect(newest.getBoundingClientRect().top).toBeGreaterThan(older.getBoundingClientRect().top);
  });

  it("renders each tone with its UD surface and icon", async () => {
    render(
      <ToastProvider>
        <Trigger onPress={() => toast.warning("存储空间不足")} />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));

    const item = (await waitFor(() => {
      const found = document.querySelector('[data-slot="toast"]');
      expect(found).not.toBeNull();
      return found;
    })) as HTMLElement;

    expect(item).toHaveAttribute("data-type", "warning");
    expect(item.className).toContain("bg-lark-warning-soft");
    expect(item.className).toContain("border-lark-warning-content");
    expect(item.className).toContain("shadow-lark-float-4");
    expect(item.querySelector("svg")).not.toBeNull();

    const styles = getComputedStyle(item);
    expect(styles.maxWidth).toBe(`${Math.min(600, window.innerWidth - 32)}px`);
    expect(styles.borderRadius).toBe("6px");
    expect(styles.fontSize).toBe("14px");
    expect(styles.borderTopWidth).toBe("1px");
    // `.ud__notice--outlined` borders with the tone's content colour.
    expect(styles.borderTopColor).toBe("rgb(237, 109, 12)");
    expect(styles.backgroundColor).toBe("rgb(255, 243, 229)");
  });

  it("offsets the region horizontally when aligned to an edge", async () => {
    render(
      <ToastProvider side="bottom" align="end" offset={24}>
        <Trigger onPress={() => toast.success("已保存到草稿箱", { duration: Infinity })} />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));
    const region = await screen.findByRole("region", { name: "通知" });

    await waitFor(() => expect(region.getBoundingClientRect().height).toBeGreaterThan(0));
    const rect = region.getBoundingClientRect();
    expect(rect.right).toBeCloseTo(window.innerWidth - 24);
    expect(rect.bottom).toBeCloseTo(window.innerHeight - 24);
  });

  it("announces a pending action in Chinese by default", async () => {
    render(
      <ToastProvider>
        <Trigger
          onPress={() =>
            toast("处理中", {
              duration: Infinity,
              action: { label: "执行", onAction: () => new Promise<void>(() => {}) },
            })
          }
        />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));
    const region = await screen.findByRole("region", { name: "通知" });
    await userEvent.click(within(region).getByRole("button", { name: "执行" }));

    // ui-sdk announces once the action has been pending for a second.
    await waitFor(
      () => {
        const polite = document.querySelector('[data-ui-sdk-announcer=""]');
        expect(polite).not.toBeNull();
        expect(polite).toHaveTextContent("加载中");
      },
      { timeout: 3000 },
    );
  });

  it("turns a loading toast into a success toast in place", async () => {
    render(
      <ToastProvider>
        <Trigger
          onPress={() => {
            const id = toast.loading("正在上传…", { duration: Infinity });
            window.setTimeout(() => {
              toast.update(id, "上传完成", { type: "success", duration: Infinity });
            }, 50);
          }}
        />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));

    const region = await screen.findByRole("region", { name: "通知" });
    expect(within(region).getByText("正在上传…")).toBeInTheDocument();
    expect(region.querySelector(".lark-spinner")).not.toBeNull();

    await waitFor(() => {
      expect(within(region).getByText("上传完成")).toBeInTheDocument();
    });
    expect(within(region).getByRole("listitem")).toHaveAttribute("data-type", "success");
  });

  it("reuses the outer region when providers are nested", async () => {
    render(
      <ToastProvider>
        <ToastProvider>
          <Trigger onPress={() => toast.info("只提示一次")} />
        </ToastProvider>
      </ToastProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));
    await screen.findByRole("region", { name: "通知" });

    expect(document.querySelectorAll('[data-slot="toast-region"]')).toHaveLength(1);
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("renders on the server without creating live regions", () => {
    const html = renderToString(
      <ToastProvider>
        <span>SSR content</span>
      </ToastProvider>,
    );

    expect(html).toContain("SSR content");
    expect(document.querySelector("[data-ui-sdk-announcer]")).toBeNull();
  });
});
