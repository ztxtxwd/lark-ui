import type { Meta, StoryObj } from "@storybook/react-vite";
import { Upload, type UploadFile } from "./Upload";

const doneFiles: UploadFile[] = [
  { uid: "1", name: "产品需求文档.pdf", size: 2_400_000, status: "done", percent: 100 },
  { uid: "2", name: "界面标注.png", size: 860_000, status: "done", percent: 100 },
  { uid: "3", name: "会议纪要.docx", size: 128_000, status: "done", percent: 100 },
];

const meta = {
  title: "Components/Upload",
  component: Upload,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书上传。通过按钮或拖拽区域选择本地文件，展示名称、大小、状态与进度。\n\n" +
          "- 拖拽区域默认 552 × 156px，1px 虚线边框、8px 圆角，上/下内边距 32/28px\n" +
          "- 附件行常规 40px、最高 60px，8px 圆角；名称 14/22，辅助文字 12/20\n" +
          "- 未提供 `customRequest` / `onUpload` 时只收集文件，不会自动上传\n" +
          "- 支持受控 `fileList` 与非受控 `defaultFileList`",
      },
    },
  },
  argTypes: {
    drag: { control: "boolean" },
    multiple: { control: "boolean" },
    disabled: { control: "boolean" },
    showUploadList: { control: "boolean" },
    listType: { control: "select", options: ["text", "picture"] },
  },
  args: {
    drag: false,
    multiple: true,
    disabled: false,
    showUploadList: true,
    listType: "text",
    accept: ".pdf,.doc,.docx,.png,.jpg",
    maxSize: 10 * 1024 * 1024,
    maxCount: 5,
  },
} satisfies Meta<typeof Upload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Drag: Story = {
  args: { drag: true },
};

export const FileList: Story = {
  args: {
    defaultFileList: [
      ...doneFiles,
      { uid: "4", name: "设计规范.pdf", size: 4_800_000, status: "uploading", percent: 64 },
    ],
    progress: { showInfo: true },
  },
};

export const ErrorState: Story = {
  name: "Error",
  args: {
    defaultFileList: [
      { uid: "1", name: "合同扫描件.pdf", size: 6_200_000, status: "done", percent: 100 },
      {
        uid: "2",
        name: "财务报表.xlsx",
        size: 1_100_000,
        status: "error",
        error: "网络异常，请重试",
        originFile: new File([""], "财务报表.xlsx"),
      },
    ],
    customRequest: ({ onError }) => {
      onError(new Error("网络异常，请重试"));
    },
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultFileList: doneFiles },
};

export const Picture: Story = {
  args: {
    listType: "picture",
    defaultFileList: [
      { uid: "1", name: "封面.png", status: "done", percent: 100 },
      { uid: "2", name: "插图.jpg", status: "uploading", percent: 35 },
      { uid: "3", name: "二维码.png", status: "error", error: "上传失败" },
    ],
  },
};

export const Uploading: Story = {
  args: {
    defaultFileList: [
      { uid: "1", name: "大文件.zip", size: 12_000_000, status: "uploading", percent: 32 },
    ],
    progress: { showInfo: true, size: "md" },
  },
};
