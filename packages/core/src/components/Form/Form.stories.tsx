import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { Input } from "../Input";
import { Form, FormGroup, FormItem, FormSection } from "./Form";

const meta = {
  title: "Components/Form",
  component: Form,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "表单 Form，用于添加或编辑一系列数据。\n\n" +
          "- 默认字段标题在上、控件在下；horizontal 布局标题在左且右对齐，与控件间距 16px\n" +
          "- 字段间距：纵向页面级 28px，横向与弹窗场景 20px；标题与控件间距 8px\n" +
          "- 必填星号使用 danger 色并隐藏于无障碍名称；帮助文本使用 placeholder 色\n" +
          "- 报错文本使用 danger 色，由 ui-sdk Field 关联 aria-describedby 与 aria-invalid\n" +
          "- 支持原生 required/type/pattern 约束与受控 invalid，不重新实现校验",
      },
    },
  },
  argTypes: {
    layout: { control: "select", options: ["vertical", "horizontal"] },
  },
  args: {
    layout: "vertical",
  },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: (args) => (
    <Form {...args} className="w-[420px] p-6" onSubmit={(event) => event.preventDefault()}>
      <FormItem
        label="项目名称"
        required
        description="项目会展示在团队空间中，名称最多 40 个字符。"
      >
        <Input name="name" placeholder="请输入项目名称" required />
      </FormItem>

      <FormItem label="项目描述" description="简要说明项目目标与范围。">
        <Input name="description" placeholder="选填" />
      </FormItem>

      <FormItem label="负责人" required>
        <Input name="owner" placeholder="请选择或输入负责人" required />
      </FormItem>

      <Button type="submit">保存</Button>
    </Form>
  ),
};

export const Horizontal: Story = {
  args: { layout: "horizontal" },
  render: (args) => (
    <Form {...args} className="w-[560px] p-6" onSubmit={(event) => event.preventDefault()}>
      <FormItem label="项目名称" required description="最多 40 个字符。">
        <Input name="name" placeholder="请输入项目名称" required />
      </FormItem>

      <FormItem label="所属团队" description="项目创建后仍可转移团队。">
        <Input name="team" placeholder="请选择团队" />
      </FormItem>

      <FormItem label="负责人" required>
        <Input name="owner" placeholder="请选择负责人" required />
      </FormItem>

      <Button type="submit">保存</Button>
    </Form>
  ),
};

export const Validation: Story = {
  render: (args) => (
    <Form {...args} className="w-[420px] p-6" onSubmit={(event) => event.preventDefault()}>
      <FormItem
        label="邮箱"
        required
        invalid
        error="请输入有效的邮箱地址。"
        description="用于接收项目通知。"
      >
        <Input type="email" name="email" defaultValue="not-an-email" required />
      </FormItem>

      <FormItem
        label="登录密码"
        required
        description="至少 8 位，包含字母和数字。"
        error="密码长度至少 8 位。"
        invalid
      >
        <Input type="password" name="password" defaultValue="123" required />
      </FormItem>

      <FormItem label="备注" error="备注最多 200 个字符。" invalid>
        <Input name="note" defaultValue="超出长度限制的备注内容" />
      </FormItem>
    </Form>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Form {...args} className="w-[420px] p-6" onSubmit={(event) => event.preventDefault()}>
      <FormSection title="账户信息" description="管理员已停用该账户，以下字段不可编辑。" disabled>
        <FormItem label="用户名" required>
          <Input name="username" defaultValue="lark-user" required />
        </FormItem>

        <FormItem label="邮箱" description="用于接收账户相关通知。">
          <Input type="email" name="email" defaultValue="user@example.com" />
        </FormItem>

        <FormItem label="部门">
          <Input name="department" defaultValue="产品设计" />
        </FormItem>
      </FormSection>

      <Button type="submit" disabled>
        保存
      </Button>
    </Form>
  ),
};

export const WithSections: Story = {
  render: (args) => (
    <Form {...args} className="w-[440px] p-6" onSubmit={(event) => event.preventDefault()}>
      <FormSection title="基本信息" description="用于在团队中标识这个项目。">
        <FormItem label="项目名称" required>
          <Input name="name" placeholder="请输入项目名称" required />
        </FormItem>

        <FormItem label="项目编号">
          <Input name="code" placeholder="例如 LARK-2026" />
        </FormItem>
      </FormSection>

      <FormSection title="联系方式" description="项目更新会发送到以下地址。">
        <FormGroup>
          <FormItem label="联系人">
            <Input name="contact" placeholder="请输入联系人姓名" />
          </FormItem>

          <FormItem label="邮箱" description="我们会发送一封确认邮件。">
            <Input type="email" name="email" placeholder="name@example.com" />
          </FormItem>
        </FormGroup>
      </FormSection>

      <Button type="submit">创建项目</Button>
    </Form>
  ),
};
