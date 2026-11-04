import { describe, expect, it } from "vite-plus/test";

import { cn } from "./cn";

describe("cn", () => {
  it.each([
    [["p-2", "p-4"], "p-4"],
    [["px-2 py-1", "px-4"], "py-1 px-4"],
    [["text-lark-default", "text-lark-subtle"], "text-lark-subtle"],
    [["bg-lark-base", "bg-lark-elevated"], "bg-lark-elevated"],
    [["border-lark-line", "border-lark-strong"], "border-lark-strong"],
    [
      ["hover:bg-lark-base", "hover:bg-lark-elevated"],
      "hover:bg-lark-elevated",
    ],
    [["sm:p-2", "sm:p-4", "md:p-6"], "sm:p-4 md:p-6"],
    [
      ["data-[state=open]:bg-lark-base", "data-[state=open]:bg-lark-elevated"],
      "data-[state=open]:bg-lark-elevated",
    ],
    [["rounded-[10px]", "rounded-[12px]"], "rounded-[12px]"],
    [["!p-2", "p-4"], "!p-2 p-4"],
    [["p-2", "!p-4"], "p-2 !p-4"],
    [
      ["base", false, null, undefined, { active: true, disabled: false }],
      "base active",
    ],
    [[["flex", ["gap-2", "gap-4"]]], "flex gap-4"],
  ])(
    "merges classes without changing expected output for case %#",
    (inputs, expected) => {
      expect(cn(...inputs)).toBe(expected);
    },
  );
});
