import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vite-plus/test";
import type { ReactNode } from "react";
import {
  getPortalHost,
  LarkPortalProvider,
  usePortalContainer,
} from "./portal-provider";

describe("getPortalHost", () => {
  afterEach(() => {
    cleanup();
    document.querySelectorAll("[data-lark-portal-host]").forEach((host) => {
      host.remove();
    });
  });

  it("creates a zero-size anchor at the document origin", () => {
    const host = getPortalHost();

    expect(host).not.toBeNull();
    expect(host?.parentElement).toBe(document.body);
    expect(host?.getAttribute("data-lark-portal-host")).toBe("");
    // 必须在原点、且不占文档流：否则浮层会把文档撑高，滚动条一闪，
    // 整页横向位移，悬停打开的菜单会被误判成指针离开。
    expect(host?.style.position).toBe("absolute");
    expect(host?.style.top).toBe("0px");
    expect(host?.style.left).toBe("0px");
    expect(host?.style.width).toBe("0px");
    expect(host?.style.height).toBe("0px");
  });

  it("reuses the same host across calls", () => {
    expect(getPortalHost()).toBe(getPortalHost());
    expect(document.querySelectorAll("[data-lark-portal-host]")).toHaveLength(
      1,
    );
  });

  it("recreates the host when the previous one was detached", () => {
    const first = getPortalHost();
    first?.remove();

    const second = getPortalHost();

    expect(second).not.toBe(first);
    expect(second?.parentElement).toBe(document.body);
  });
});

describe("usePortalContainer", () => {
  afterEach(() => {
    cleanup();
    document.querySelectorAll("[data-lark-portal-host]").forEach((host) => {
      host.remove();
    });
  });

  it("falls back to the portal host when no provider is present", () => {
    const { result } = renderHook(() => usePortalContainer());

    expect(result.current).toBe(getPortalHost());
  });

  it("prefers the provider container", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const { result } = renderHook(() => usePortalContainer(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <LarkPortalProvider container={container}>{children}</LarkPortalProvider>
      ),
    });

    expect(result.current).toBe(container);
    expect(document.querySelector("[data-lark-portal-host]")).toBeNull();
  });
});
