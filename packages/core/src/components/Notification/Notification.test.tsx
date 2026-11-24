import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NotificationProvider, notification } from "./Notification";

function dismissAll() {
  notification.destroy();
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

async function findRegion() {
  return screen.findByRole("region", { name: "通知提醒" });
}

describe("Notification", () => {
  it("shows a success notification in the top-right region and announces it politely", async () => {
    render(
      <NotificationProvider>
        <Trigger
          onPress={() =>
            notification.success({
              title: "保存成功",
              description: "所有更改已同步",
            })
          }
        />
      </NotificationProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));

    const region = await findRegion();
    expect(region).toHaveAttribute("data-side", "top");
    expect(region).toHaveAttribute("data-align", "end");

    const item = within(region).getByRole("listitem");
    expect(item).toHaveAttribute("data-type", "success");
    expect(item).toHaveAttribute("data-tone", "success");
    expect(within(item).getByText("保存成功")).toBeInTheDocument();
    expect(within(item).getByText("所有更改已同步")).toBeInTheDocument();
    expect(within(item).getByRole("button", { name: "关闭" })).toBeInTheDocument();
    expect(item.querySelector('[data-slot="notification-icon"] svg')).not.toBeNull();

    const status = screen.getByRole("status");
    await waitFor(() => expect(status).toHaveTextContent("保存成功"));
    expect(status).toHaveTextContent("所有更改已同步");
  });

  it("announces errors assertively", async () => {
    render(
      <NotificationProvider>
        <Trigger onPress={() => notification.error({ title: "保存失败" })} />
      </NotificationProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));

    const alert = screen.getByRole("alert");
    await waitFor(() => expect(alert).toHaveTextContent("保存失败"));
  });

  it("renders all four tones with their UD icon colours", async () => {
    render(
      <NotificationProvider>
        <Trigger
          onPress={() => {
            notification.info({ title: "普通通知", key: "info", duration: Infinity });
            notification.success({ title: "成功通知", key: "success", duration: Infinity });
            notification.warning({ title: "警告通知", key: "warning", duration: Infinity });
            notification.error({ title: "错误通知", key: "error", duration: Infinity });
          }}
        />
      </NotificationProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));

    const region = await findRegion();
    await waitFor(() => expect(within(region).getAllByRole("listitem")).toHaveLength(4));

    const expected = {
      info: "text-lark-info-content",
      success: "text-lark-success-content",
      warning: "text-lark-warning",
      error: "text-lark-danger-content",
    } as const;

    for (const [tone, className] of Object.entries(expected)) {
      const item = within(region)
        .getAllByRole("listitem")
        .find((candidate) => candidate.getAttribute("data-tone") === tone);
      expect(item).toBeTruthy();
      const icon = item?.querySelector('[data-slot="notification-icon"]');
      expect(icon?.className).toContain(className);
    }
  });

  it("paints the 4px accent with the tone's content colour", async () => {
    render(
      <NotificationProvider>
        <Trigger
          onPress={() => {
            notification.info({ title: "普通通知", key: "info", duration: Infinity });
            notification.success({ title: "成功通知", key: "success", duration: Infinity });
            notification.warning({ title: "警告通知", key: "warning", duration: Infinity });
            notification.error({ title: "错误通知", key: "error", duration: Infinity });
          }}
        />
      </NotificationProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));
    const region = await findRegion();
    await waitFor(() => expect(within(region).getAllByRole("listitem")).toHaveLength(4));

    const expected = {
      info: "rgb(20, 86, 240)",
      success: "rgb(50, 166, 69)",
      warning: "rgb(237, 109, 12)",
      error: "rgb(245, 74, 69)",
    } as const;

    for (const [tone, color] of Object.entries(expected)) {
      const item = within(region)
        .getAllByRole("listitem")
        .find((candidate) => candidate.getAttribute("data-tone") === tone);
      const accent = item?.querySelector('[data-slot="notification-accent"]') as HTMLElement;
      expect(getComputedStyle(accent).backgroundColor).toBe(color);
      expect(getComputedStyle(accent).width).toBe("4px");
    }
  });

  it("keeps body-only copy clear of the close button", async () => {
    render(
      <NotificationProvider>
        <Trigger
          onPress={() =>
            notification.info({
              description: "这条通知只有正文，没有标题。",
              closable: true,
              duration: Infinity,
            })
          }
        />
      </NotificationProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));
    const region = await findRegion();
    const item = within(region).getByRole("listitem");
    const description = item.querySelector('[data-slot="toast-description"]') as HTMLElement;

    expect(description).not.toBeNull();
    expect(getComputedStyle(description).paddingRight).toBe("16px");
  });

  it("honours the tone passed to open() in both call styles", async () => {
    render(
      <NotificationProvider>
        <Trigger
          onPress={() => {
            notification.open({ type: "warning", title: "维护提醒" });
            notification.open("连接中断", { type: "error", description: "请检查网络" });
          }}
        />
      </NotificationProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));
    const region = await findRegion();
    await waitFor(() => expect(within(region).getAllByRole("listitem")).toHaveLength(2));

    const tones = within(region)
      .getAllByRole("listitem")
      .map((item) => item.getAttribute("data-tone"));
    expect(tones).toEqual(expect.arrayContaining(["warning", "error"]));
  });

  it("uses the documented 360px card and 400px wide size", async () => {
    render(
      <NotificationProvider>
        <Trigger
          onPress={() => {
            notification.info({ title: "标准宽度", key: "sm", duration: Infinity });
            notification.info({ title: "宽通知", key: "md", size: "md", duration: Infinity });
          }}
        />
      </NotificationProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));
    const region = await findRegion();
    await waitFor(() => expect(within(region).getAllByRole("listitem")).toHaveLength(2));

    const standard = within(region)
      .getAllByRole("listitem")
      .find((item) => within(item).queryByText("标准宽度"));
    const wide = within(region)
      .getAllByRole("listitem")
      .find((item) => within(item).queryByText("宽通知"));

    expect(standard?.className).toContain("w-[360px]");
    expect(wide?.className).toContain("w-[400px]");
    expect(getComputedStyle(standard as HTMLElement).width).toBe("360px");
    // The card is responsive: on a narrow viewport it stops 32px short of the edge.
    expect(getComputedStyle(wide as HTMLElement).width).toBe(
      `${Math.min(400, window.innerWidth - 32)}px`,
    );
  });

  it("uses the UD surface, border, radius and type scale", async () => {
    render(
      <NotificationProvider>
        <Trigger
          onPress={() =>
            notification.warning({
              title: "存储空间不足",
              description: "清理一些文件后重试。",
              duration: Infinity,
            })
          }
        />
      </NotificationProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));
    const region = await findRegion();
    const item = within(region).getByRole("listitem");

    expect(item.className).toContain("bg-lark-float");
    expect(item.className).toContain("border-lark-border-card");
    expect(item.className).toContain("rounded-lark-lg");
    expect(item.className).toContain("shadow-lark-float-5");

    const styles = getComputedStyle(item);
    expect(styles.backgroundColor).toBe("rgb(255, 255, 255)");
    expect(styles.borderRadius).toBe("8px");
    expect(styles.borderTopWidth).toBe("1px");
    expect(styles.paddingTop).toBe("24px");
    expect(styles.paddingLeft).toBe("68px");

    const title = within(item).getByText("存储空间不足");
    expect(getComputedStyle(title).fontSize).toBe("16px");
    expect(getComputedStyle(title).lineHeight).toBe("24px");
    expect(getComputedStyle(title).fontWeight).toBe("500");

    const body = within(item).getByText("清理一些文件后重试。");
    expect(getComputedStyle(body).fontSize).toBe("14px");
    expect(getComputedStyle(body).lineHeight).toBe("22px");

    const accent = item.querySelector('[data-slot="notification-accent"]') as HTMLElement;
    expect(getComputedStyle(accent).width).toBe("4px");

    const icon = item.querySelector('[data-slot="notification-icon"]') as HTMLElement;
    expect(getComputedStyle(icon).top).toBe("24px");
    expect(getComputedStyle(icon).left).toBe("28px");

    // The 24px icon ends before the copy begins; it must not sit under it.
    const titleBox = title.getBoundingClientRect();
    const iconBox = icon.getBoundingClientRect();
    expect(titleBox.left).toBeGreaterThanOrEqual(iconBox.right);
  });

  it("positions the stack 24px from the top-right and spaces cards by 16px", async () => {
    render(
      <NotificationProvider>
        <Trigger
          onPress={() => {
            notification.info({ title: "通知 1", duration: Infinity, key: "one" });
            notification.info({ title: "通知 2", duration: Infinity, key: "two" });
          }}
        />
      </NotificationProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));
    const region = await findRegion();
    await waitFor(() => expect(within(region).getAllByRole("listitem")).toHaveLength(2));

    const regionStyles = getComputedStyle(region);
    expect(regionStyles.position).toBe("fixed");
    expect(regionStyles.top).toBe("24px");
    expect(regionStyles.right).toBe("24px");

    const list = region.querySelector("ol") as HTMLElement;
    expect(getComputedStyle(list).rowGap).toBe("16px");
    expect(getComputedStyle(list).flexDirection).toBe("column");
  });

  it("disappears after its duration", async () => {
    render(
      <NotificationProvider>
        <Trigger onPress={() => notification.info({ title: "短暂通知", duration: 150 })} />
      </NotificationProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));
    const region = await findRegion();
    expect(within(region).getByText("短暂通知")).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryAllByRole("listitem")).toHaveLength(0);
      },
      { timeout: 3000 },
    );
  });

  it("pauses its timer while hovered", async () => {
    render(
      <NotificationProvider>
        <Trigger
          onPress={() => notification.info({ title: "悬停暂停", duration: 150, key: "hover" })}
        />
      </NotificationProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));
    const region = await findRegion();
    const item = within(region).getByText("悬停暂停");

    await userEvent.hover(item);
    await new Promise((resolve) => window.setTimeout(resolve, 400));
    expect(within(region).getByText("悬停暂停")).toBeInTheDocument();

    await userEvent.unhover(item);
    await waitFor(
      () => {
        expect(screen.queryAllByRole("listitem")).toHaveLength(0);
      },
      { timeout: 3000 },
    );
  });

  it("closes from the close button", async () => {
    render(
      <NotificationProvider>
        <Trigger onPress={() => notification.info({ title: "可关闭通知", duration: Infinity })} />
      </NotificationProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));
    const region = await findRegion();

    await userEvent.click(within(region).getByRole("button", { name: "关闭" }));

    await waitFor(() => {
      expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    });
  });

  it("runs an action and closes the notification", async () => {
    const onAction = vi.fn();
    render(
      <NotificationProvider>
        <Trigger
          onPress={() =>
            notification.info({
              title: "已删除 1 个文件",
              action: { label: "撤销", onAction },
            })
          }
        />
      </NotificationProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));
    const region = await findRegion();
    await userEvent.click(within(region).getByRole("button", { name: "撤销" }));

    expect(onAction).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    });
  });

  it("updates a notification in place by key", async () => {
    render(
      <NotificationProvider>
        <Trigger
          onPress={() => {
            const key = notification.info({
              title: "正在上传…",
              key: "upload",
              duration: Infinity,
            });
            window.setTimeout(() => {
              notification.update(key, {
                type: "success",
                title: "上传完成",
                description: "报告已保存到云端",
              });
            }, 50);
          }}
        />
      </NotificationProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));
    const region = await findRegion();
    expect(within(region).getByText("正在上传…")).toBeInTheDocument();

    await waitFor(() => {
      expect(within(region).getByText("上传完成")).toBeInTheDocument();
    });
    expect(within(region).getByText("报告已保存到云端")).toBeInTheDocument();
    expect(within(region).getByRole("listitem")).toHaveAttribute("data-type", "success");
  });

  it("destroys one key or the whole queue", async () => {
    render(
      <NotificationProvider>
        <Trigger
          onPress={() => {
            notification.info({ title: "保留", key: "keep", duration: Infinity });
            notification.info({ title: "移除", key: "remove", duration: Infinity });
          }}
        />
      </NotificationProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));
    const region = await findRegion();
    await within(region).findByText("移除");

    notification.destroy("remove");
    await waitFor(() => expect(within(region).queryByText("移除")).not.toBeInTheDocument());
    expect(within(region).getByText("保留")).toBeInTheDocument();

    notification.destroy();
    await waitFor(() => expect(screen.queryAllByRole("listitem")).toHaveLength(0));
  });

  it("stacks newest first and respects maxVisible", async () => {
    render(
      <NotificationProvider maxVisible={2}>
        <Trigger
          onPress={() => {
            notification.info({ title: "通知 1", duration: Infinity, key: "one" });
            notification.info({ title: "通知 2", duration: Infinity, key: "two" });
            notification.info({ title: "通知 3", duration: Infinity, key: "three" });
          }}
        />
      </NotificationProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));
    const region = await findRegion();

    await waitFor(() => {
      expect(within(region).getAllByRole("listitem")).toHaveLength(2);
    });
    expect(within(region).getByText("通知 3")).toBeInTheDocument();
    expect(within(region).getByText("通知 2")).toBeInTheDocument();
    expect(within(region).queryByText("通知 1")).toBeNull();

    const [newest, older] = within(region).getAllByRole("listitem");
    expect(newest.getBoundingClientRect().top).toBeLessThan(older.getBoundingClientRect().top);
  });

  it("can hide the tone icon", async () => {
    render(
      <NotificationProvider>
        <Trigger
          onPress={() =>
            notification.info({ title: "无图标", showIcon: false, duration: Infinity })
          }
        />
      </NotificationProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));
    const region = await findRegion();
    const item = within(region).getByRole("listitem");

    expect(item.querySelector('[data-slot="notification-icon"]')).toBeNull();
    expect(getComputedStyle(item).paddingLeft).toBe("28px");
  });

  it("accepts a React node as the title as well as an options object", async () => {
    render(
      <NotificationProvider>
        <Trigger
          onPress={() => notification.info(<span>带标记的标题</span>, { duration: Infinity })}
        />
      </NotificationProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));
    expect(await screen.findByText("带标记的标题")).toBeInTheDocument();
  });

  it("reuses the outer region when providers are nested", async () => {
    render(
      <NotificationProvider>
        <NotificationProvider>
          <Trigger onPress={() => notification.info({ title: "只提示一次" })} />
        </NotificationProvider>
      </NotificationProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "触发" }));
    await findRegion();

    expect(document.querySelectorAll('[data-slot="toast-region"]')).toHaveLength(1);
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("renders on the server without creating live regions", () => {
    const html = renderToString(
      <NotificationProvider>
        <span>SSR content</span>
      </NotificationProvider>,
    );

    expect(html).toContain("SSR content");
    expect(document.querySelector("[data-ui-sdk-announcer]")).toBeNull();
  });
});
