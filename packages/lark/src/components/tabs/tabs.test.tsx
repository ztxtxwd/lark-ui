import { describe, expect, it, vi } from "vite-plus/test";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Tabs } from "./tabs";

const baseTabs = [
  { value: "overview", label: "Overview" },
  { value: "metrics", label: "Metrics" },
  { value: "deployments", label: "Deployments" },
  { value: "observability", label: "Observability" },
  { value: "domains", label: "Domains" },
  { value: "access", label: "Access" },
  { value: "settings", label: "Settings" },
];

const extraTabs = [
  { value: "analytics", label: "Analytics" },
  { value: "logs", label: "Logs" },
  { value: "security", label: "Security" },
];

describe("Tabs", () => {
  it("hugs its labels by default instead of painting a full-width track", () => {
    render(
      <Tabs
        variant="segmented"
        selectedValue="overview"
        tabs={[
          { value: "overview", label: "Overview" },
          { value: "metrics", label: "Metrics" },
          { value: "settings", label: "Settings" },
        ]}
      />,
    );

    const root = screen.getByRole("tablist").parentElement as HTMLElement;

    expect(root.classList.contains("w-fit")).toBe(true);
    expect(root.classList.contains("max-w-full")).toBe(true);
    expect(root.classList.contains("w-full")).toBe(false);
    for (const tab of screen.getAllByRole("tab")) {
      expect(tab.classList.contains("flex-1")).toBe(false);
    }
  });

  it("fill stretches the track and splits it evenly across the tabs", () => {
    render(
      <Tabs
        variant="segmented"
        fill
        selectedValue="overview"
        tabs={[
          { value: "overview", label: "Overview" },
          { value: "metrics", label: "Metrics" },
          { value: "settings", label: "Settings" },
        ]}
      />,
    );

    const root = screen.getByRole("tablist").parentElement as HTMLElement;

    expect(root.classList.contains("w-full")).toBe(true);
    expect(root.classList.contains("w-fit")).toBe(false);
    for (const tab of screen.getAllByRole("tab")) {
      expect(tab.classList.contains("flex-1")).toBe(true);
      expect(tab.classList.contains("justify-center")).toBe(true);
    }
  });

  it("keeps the underline bar full width when fill is set", () => {
    render(
      <Tabs
        variant="underline"
        fill
        selectedValue="overview"
        tabs={[
          { value: "overview", label: "Overview" },
          { value: "settings", label: "Settings" },
        ]}
      />,
    );

    const root = screen.getByRole("tablist").parentElement as HTMLElement;

    expect(root.classList.contains("w-fit")).toBe(false);
    expect(root.classList.contains("w-full")).toBe(false);
    for (const tab of screen.getAllByRole("tab")) {
      expect(tab.classList.contains("flex-1")).toBe(false);
    }
  });

  it("forwards nativeButton=false for link-rendered tabs", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <Tabs
        variant="underline"
        selectedValue="overview"
        tabs={[
          {
            value: "overview",
            label: "Overview",
            nativeButton: false,
            render: (props) => <a {...props} href="/settings/overview" />,
          },
          {
            value: "members",
            label: "Members",
            nativeButton: false,
            render: (props) => <a {...props} href="/settings/members" />,
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("tab", { name: "Overview" }).getAttribute("href"),
    ).toBe("/settings/overview");
    expect(
      warnSpy.mock.calls.some(([message]) =>
        String(message).includes("nativeButton"),
      ),
    ).toBe(false);

    warnSpy.mockRestore();
  });

  it("hides overflow controls when removed tabs leave the remaining tabs fitting", async () => {
    const { container, rerender } = render(
      <Tabs selectedValue="settings" tabs={[...baseTabs, ...extraTabs]} />,
    );
    const list = screen.getByRole("tablist");

    setTabListSize(list, {
      clientWidth: 600,
      scrollWidth: 800,
    });
    fireEvent.scroll(list);

    const endControl = container.querySelector(
      '[data-lark-part="overflow-control"][data-side="end"]',
    );

    await waitFor(() =>
      expect(endControl?.getAttribute("aria-hidden")).toBe("false"),
    );

    setTabListSize(list, {
      clientWidth: 588,
      scrollWidth: 588,
    });
    rerender(<Tabs selectedValue="settings" tabs={baseTabs} />);

    await waitFor(() =>
      expect(endControl?.getAttribute("aria-hidden")).toBe("true"),
    );
  });
});

function setTabListSize(
  list: HTMLElement,
  { clientWidth, scrollWidth }: { clientWidth: number; scrollWidth: number },
) {
  defineReadonlyNumber(list, "clientWidth", clientWidth);
  defineReadonlyNumber(list, "scrollWidth", scrollWidth);
}

function defineReadonlyNumber(
  element: HTMLElement,
  property: "clientWidth" | "scrollWidth",
  value: number,
) {
  Object.defineProperty(element, property, {
    configurable: true,
    value,
  });
}
