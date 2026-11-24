import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ColorPicker, type ColorPickerProps } from "./ColorPicker";

const presets = [
  "#1456f0",
  "#00b96b",
  "#ff8800",
  "#f54a45",
  "#8f5cf7",
  "#00bcd4",
  "#e91e63",
  "#ffc60a",
  "#34c724",
  "#646a73",
  "#1f2329",
  "#ffffff",
  "#3370eb",
  "#dee0e3",
];

const meta = {
  title: "Components/ColorPicker",
  component: ColorPicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "颜色选择器。触发器展示色块与当前色值，浮层内提供饱和度/明度选择区、色相滑块、" +
          "透明度滑块、十六进制输入与预设色板。\n\n" +
          "- 面板背景 float、描边 border-card、圆角 8px、阴影 shadow-4\n" +
          "- 选色区 188 × 120，圆角 4px；色相滑块 12px 高，指针为 10 × 8 白色手柄、顶部尖角\n" +
          "- 预设色块 18 × 18，圆角 4px，选中时 2px 主色描边\n" +
          "- 选择预设后立即收起面板；支持键盘方向键调整滑块与预设",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md"] },
    showInput: { control: "boolean" },
    disabledAlpha: { control: "boolean" },
    allowClear: { control: "boolean" },
    disabled: { control: "boolean" },
    presets: { control: "object" },
  },
  args: {
    defaultValue: "#1456f0",
    presets,
    showInput: true,
    allowClear: false,
    disabledAlpha: false,
    size: "md",
    disabled: false,
    "aria-label": "主题色",
  },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Presets: Story = {
  args: {
    allowClear: true,
  },
  parameters: {
    docs: {
      description: {
        story: "预设色板：在自定义选色区下方提供常用颜色，选择预设后立即收起。",
      },
    },
  },
};

export const WithInput: Story = {
  args: {
    showInput: true,
    presets: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: "自定义选色：拖拽选色区、色相/透明度滑块，或直接输入任意 CSS 颜色。",
      },
    },
  },
};

export const WithAlpha: Story = {
  args: {
    defaultValue: "rgba(20, 86, 240, 0.6)",
  },
  parameters: {
    docs: {
      description: {
        story: "透明度滑块位于色相滑块下方，轨道从全透明渐变到当前颜色。",
      },
    },
  },
};

export const WithoutAlpha: Story = {
  args: {
    defaultValue: "#1456f0",
    disabledAlpha: true,
  },
  parameters: {
    docs: {
      description: {
        story: "设置 `disabledAlpha` 后隐藏透明度滑块，颜色保持不透明。",
      },
    },
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <ColorPicker {...args} size="sm" defaultValue="#1456f0" aria-label="小尺寸主题色" />
      <ColorPicker {...args} size="md" defaultValue="#00b96b" aria-label="中尺寸主题色" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "触发器高度 28px（sm）与 32px（md），与输入框尺寸一致。",
      },
    },
  },
};

export const Clearable: Story = {
  args: {
    allowClear: true,
  },
  parameters: {
    docs: {
      description: {
        story: "允许清除颜色：触发器出现清除按钮，面板底部提供「取消颜色」。",
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

function ControlledColorPickerDemo(args: ColorPickerProps) {
  const [value, setValue] = useState("#1456f0");

  return (
    <div className="flex flex-col items-start gap-3">
      <ColorPicker {...args} value={value} onChange={(next) => setValue(next ?? "#000000")} />
      <span className="text-lark-12 text-lark-caption">当前色值：{value}</span>
    </div>
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledColorPickerDemo {...args} />,
  parameters: {
    docs: {
      description: {
        story: "受控用法：通过 `value` 与 `onChange` 保存并回显颜色。",
      },
    },
  },
};
