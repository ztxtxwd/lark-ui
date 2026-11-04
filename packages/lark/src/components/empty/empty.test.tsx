import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";
import { Empty } from "./empty";

describe("Empty", () => {
  it("renders the title in the default text colour with a caption-coloured description", () => {
    render(
      <Empty
        title="No results found"
        description="Try adjusting your search."
      />,
    );

    const title = screen.getByText("No results found");
    const description = screen.getByText("Try adjusting your search.");

    expect(title.tagName).toBe("H2");
    expect(title.className).toContain("text-base/[inherit]");
    expect(title.className).toContain("text-lark-default");
    expect(title.className).not.toContain("font-semibold");
    expect(description.className).toContain("text-base/[inherit]");
    expect(description.className).toContain("text-lark-subtle");
    expect(description.className).toContain("text-balance");
    expect(description.className).toContain("leading-normal");
    expect(title.parentElement).toBe(description.parentElement);
    // Feishu separates the title from the description by 4px
    expect(title.parentElement?.className).toContain("gap-1");
  });

  it("renders the title in the default text colour without a description", () => {
    render(<Empty title="Nothing here" />);

    const title = screen.getByText("Nothing here");

    expect(title.tagName).toBe("H2");
    expect(title.className).toContain("text-base/[inherit]");
    expect(title.className).toContain("text-lark-default");
    expect(title.className).not.toContain("font-semibold");
  });

  it("renders the command line with inset styling and without brand-colored text", () => {
    render(<Empty title="Install Lark" commandLine="npm install lark" />);

    const command = screen.getByText("npm install lark");
    const commandTextGroup = command.parentElement;
    const commandContainer = commandTextGroup?.parentElement;

    expect(command.className).not.toContain("text-lark-brand");
    expect(commandContainer?.className).toContain("bg-lark-overlay");
    expect(commandContainer?.className.split(" ")).toContain("border");
    expect(commandContainer?.className).toContain("border-white");
    expect(commandContainer?.className.split(" ")).toContain("ring");
    expect(commandContainer?.className).toContain("ring-lark-line");
    expect(commandContainer?.className).toContain("items-center");
    expect(commandTextGroup?.className).toContain("items-baseline");
    expect(commandContainer?.className).toContain("shadow-lark-xs");
    expect(commandContainer?.className).not.toContain("shadow-inner");
    expect(commandContainer?.className).not.toContain("hover:");

    const prompt = screen.getByText("$");
    expect(prompt.className).toContain("text-lark-subtle");
    expect(prompt.className).not.toContain("text-xs");

    const copyButton = screen.getByRole("button", { name: "Copy command" });
    expect(copyButton.className).toContain("text-lark-subtle");

    const copyIcon = copyButton.querySelector("svg");
    expect(copyIcon?.getAttribute("class") ?? "").not.toContain("group-hover:");
  });
});
