import { describe, expect, it } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import { Banner, bannerVariants } from "./banner";
import { Link } from "../link/link";

describe("Banner", () => {
  it("supports secondary variant", () => {
    const className = bannerVariants({ variant: "secondary" });

    expect(className).toContain("bg-lark-contrast/5");
    // Feishu's `ud__notice` keeps the copy on `--text-title`; only the status
    // icon carries the accent colour.
    expect(className).toContain("text-lark-default");
    expect(className).not.toContain("text-lark-default/70");
  });

  it("keeps the notice text on the title colour and the icon on the accent", () => {
    render(
      <Banner
        data-testid="banner"
        icon={<svg data-testid="icon" />}
        title="System status"
        description="All systems are operational."
      />,
    );

    const banner = screen.getByTestId("banner");
    // Feishu `ud__notice` -> `color: var(--text-title)`.
    expect(banner.className).toContain("text-lark-default");
    expect(banner.className).not.toContain("text-lark-info");
    // The status icon keeps the variant accent.
    const iconWrapper = screen.getByTestId("icon").parentElement;
    expect(iconWrapper?.className).toContain("text-lark-info");
  });

  it("uses the Feishu notice radius and filled padding", () => {
    const className = bannerVariants({ variant: "default" });

    // `ud__notice` -> `border-radius: 6px`, `--filled` -> `padding: 9px 0 9px 16px`.
    expect(className).toContain("rounded-md");
    expect(className).not.toContain("rounded-lg");
    expect(className).toContain("py-[9px]");
    expect(className).toContain("pl-4");
    // The status icon sits 8px away from the copy.
    expect(className).toContain("gap-2");
    // The container has no right padding — the trailing gutter belongs to the
    // copy and the action (Feishu `ud__notice--filled`).
    expect(className.split(" ")).not.toContain("pr-4");
  });

  it("clips overflowing copy and breaks long words like ud__notice", () => {
    const className = bannerVariants();

    // `ud__notice` -> `overflow: hidden; overflow-wrap: anywhere`.
    expect(className).toContain("overflow-hidden");
    expect(className).toContain("wrap-anywhere");
  });

  it("keeps the filled theme free of the outlined frame", () => {
    const className = bannerVariants({ theme: "filled" });

    expect(className.split(" ")).not.toContain("border");
    // The outlined overrides stay in the variant/size classes but only apply
    // when the root carries `data-banner-theme="outlined"`.
    expect(className).toContain(
      "data-[banner-theme=outlined]:bg-lark-banner-info-outlined",
    );
  });

  it("renders the outlined theme as a bordered, pale surface", () => {
    render(
      <Banner
        theme="outlined"
        variant="error"
        data-testid="banner"
        title="Save failed"
      />,
    );

    const banner = screen.getByTestId("banner");
    expect(banner.getAttribute("data-banner-theme")).toBe("outlined");
    // `ud__notice--outlined` -> 1px border in the status colour over the
    // `--function-danger-50` tint.
    expect(banner.className.split(" ")).toContain("border");
    expect(banner.className).toContain(
      "data-[banner-theme=outlined]:bg-lark-banner-danger-outlined",
    );
    expect(banner.className).toContain(
      "data-[banner-theme=outlined]:border-lark-danger-outline",
    );
  });

  it("pads the outlined theme like ud__notice--outlined", () => {
    const className = bannerVariants({ theme: "outlined" });

    // `ud__notice--outlined` -> `padding: 15px 3px 15px 19px`.
    expect(className).toContain("data-[banner-theme=outlined]:py-[15px]");
    expect(className).toContain("data-[banner-theme=outlined]:pl-[19px]");
    expect(className).toContain("data-[banner-theme=outlined]:pr-[3px]");
  });

  it("reserves Feishu's 32px gutter after the copy and the action", () => {
    render(
      <Banner
        title="Heads up"
        description="More details here"
        action={<Banner.Action data-testid="cta">Retry</Banner.Action>}
      />,
    );

    // `ud__notice__description-content` / `__description-action` ->
    // `padding-right: 32px`.
    const content = screen.getByText("Heads up").parentElement;
    expect(content?.className).toContain("pr-8");
    const actionGroup = screen.getByTestId("cta").parentElement;
    expect(actionGroup?.className).toContain("pr-8");
  });

  it("sets the message in semibold", () => {
    render(<Banner title="System status" />);

    // Feishu's notice message is set semibold.
    const title = screen.getByText("System status");
    expect(title.className).toContain("font-semibold");
  });

  it("forwards root div props", () => {
    render(
      <Banner
        role="status"
        data-testid="banner"
        aria-live="polite"
        title="System status"
      />,
    );

    const banner = screen.getByTestId("banner");
    expect(banner.getAttribute("role")).toBe("status");
    expect(banner.getAttribute("aria-live")).toBe("polite");
    expect(banner.textContent).toBe("System status");
  });

  it("styles a solid Banner.Action from the banner variant accent", () => {
    render(
      <Banner
        variant="error"
        title="Save failed"
        action={<Banner.Action data-testid="cta">Retry</Banner.Action>}
      />,
    );

    const cta = screen.getByTestId("cta");
    expect(cta.tagName).toBe("BUTTON");
    expect(cta.getAttribute("data-lark-component")).toBe("Button");
    expect(cta.className).toContain("text-white");
    expect(cta.className).toContain("bg-(--lark-button-emphasis-bg)");
    expect(cta.style.getPropertyValue("--lark-button-emphasis-bg")).toBe(
      "var(--color-lark-danger)",
    );
    expect(cta.style.getPropertyValue("--lark-button-emphasis-hover")).toBe(
      "color-mix(in oklch, var(--color-lark-danger), white 14%)",
    );
    expect(cta.parentElement?.className).toContain("gap-2");
  });

  it("styles a ghost Banner.Action with accent text and a tinted hover", () => {
    render(
      <Banner
        variant="alert"
        title="Session expiring"
        action={
          <Banner.Action variant="ghost" data-testid="cta">
            Dismiss
          </Banner.Action>
        }
      />,
    );

    const cta = screen.getByTestId("cta");
    expect(cta.className).toContain("fill-lark-warning");
    expect(cta.className).toContain("hover:bg-lark-warning/10");
  });

  it("styles a secondary Banner.Action as an accent-hued outline", () => {
    render(
      <Banner
        variant="error"
        title="Save failed"
        action={
          <Banner.Action variant="secondary" data-testid="cta">
            Retry
          </Banner.Action>
        }
      />,
    );

    const cta = screen.getByTestId("cta");
    // Transparent bg + accent-hued ring in the same hue as the error banner accent.
    expect(cta.className).toContain("ring-lark-danger/50");
    expect(cta.className).toContain("hover:bg-lark-danger/10");
    expect(cta.className).toContain("hover:!ring-lark-danger/50");
    expect(cta.className).toContain("hover:!text-inherit");
    // Not the filled primary CTA.
    expect(cta.className).toContain("bg-transparent");
    expect(cta.className).not.toContain("text-white");
    expect(
      cta.style.getPropertyValue("--lark-button-emphasis-gradient-end"),
    ).toBe("");
  });

  it("renders an icon-only Banner.Action with standard button sizing", () => {
    render(
      <Banner
        variant="default"
        title="Heads up"
        action={
          <Banner.Action
            variant="ghost"
            icon={<svg data-testid="icon" />}
            aria-label="Dismiss"
            data-testid="cta"
          />
        }
      />,
    );

    const cta = screen.getByTestId("cta");
    expect(cta.className).toContain("h-7");
    expect(cta.className).toContain("px-[7px]");
    expect(cta.getAttribute("aria-label")).toBe("Dismiss");
    expect(screen.getByTestId("icon")).toBeTruthy();
  });

  it("defaults Banner.Action children to sm in a base banner", () => {
    render(
      <Banner
        variant="default"
        title="Heads up"
        action={<Banner.Action data-testid="cta">Details</Banner.Action>}
      />,
    );

    const cta = screen.getByTestId("cta");
    expect(cta.className).toContain("h-7");
    expect(cta.className).toContain("px-[7px]");
    expect(cta.className).toContain("text-xs");
  });

  it("applies compact spacing for the sm banner size", () => {
    const className = bannerVariants({ size: "sm" });

    expect(className).toContain("px-3");
    expect(className).toContain("py-2");
    expect(className).toContain("text-sm");
    // Compact banners align everything on one centered row.
    expect(className).toContain("items-center");
    // Base-size spacing/alignment must not leak in.
    expect(className).not.toContain("px-4");
    expect(className).not.toContain("items-start");
  });

  it("defaults Banner.Action children to xs in an sm banner", () => {
    render(
      <Banner
        size="sm"
        variant="default"
        title="Heads up"
        action={<Banner.Action data-testid="cta">Details</Banner.Action>}
      />,
    );

    const cta = screen.getByTestId("cta");
    // Inherits the banner's size => xs (h-6), not the standalone sm default (h-7).
    expect(cta.className).toContain("h-6");
    expect(cta.className).toContain("px-[7px]");
  });

  it("matches an icon-only action to the text action height in an sm banner", () => {
    render(
      <Banner
        size="sm"
        title="Update available"
        action={
          <Banner.Action
            variant="ghost"
            icon={<svg />}
            aria-label="Dismiss"
            data-testid="cta"
          />
        }
      />,
    );

    const cta = screen.getByTestId("cta");
    expect(cta.className).toContain("h-6");
    expect(cta.className).toContain("px-[7px]");
    expect(cta.className).not.toContain("size-3.5");
  });

  it("renders title and description inline in an sm banner", () => {
    render(
      <Banner size="sm" title="Heads up" description="More details here" />,
    );

    const title = screen.getByText("Heads up");
    const description = screen.getByText("More details here");
    // Inline: both are spans sharing one baseline-aligned flex row.
    expect(title.tagName).toBe("SPAN");
    expect(description.tagName).toBe("SPAN");
    expect(title.parentElement).toBe(description.parentElement);
    expect(title.parentElement?.className).toContain("items-baseline");
  });

  it("renders a Link action inline at text-sm in an sm banner", () => {
    render(
      <Banner
        size="sm"
        description="A DNS record already exists."
        action={
          <Link href="#manage" data-testid="action">
            Manage DNS
          </Link>
        }
      />,
    );

    const description = screen.getByText("A DNS record already exists.");
    const action = screen.getByTestId("action");
    const actionGroup = action.parentElement;

    expect(actionGroup?.parentElement).toBe(description);
    expect(actionGroup?.className).toContain("ml-1.5");
    expect(description.className).toContain("text-sm");
  });

  it("keeps a Banner.Action trailing in an sm banner", () => {
    render(
      <Banner
        size="sm"
        description="A DNS record already exists."
        action={<Banner.Action data-testid="action">Manage DNS</Banner.Action>}
      />,
    );

    const description = screen.getByText("A DNS record already exists.");
    const actionGroup = screen.getByTestId("action").parentElement;

    expect(actionGroup?.className).toContain("shrink-0");
    expect(actionGroup?.parentElement).toBe(
      description.parentElement?.parentElement,
    );
  });

  it("keeps the action trailing in a base banner", () => {
    render(
      <Banner
        description="A DNS record already exists."
        action={
          <a href="#manage" data-testid="action">
            Manage DNS
          </a>
        }
      />,
    );

    const actionGroup = screen.getByTestId("action").parentElement;

    expect(actionGroup?.className).toContain("shrink-0");
  });

  it("stacks title and description in a base banner", () => {
    render(<Banner title="Heads up" description="More details here" />);

    const title = screen.getByText("Heads up");
    const description = screen.getByText("More details here");
    // Stacked: title is a <p>, and they do not share the same parent.
    expect(title.tagName).toBe("P");
    expect(title.parentElement).not.toBe(description.parentElement);
  });
});
