import { Button, ButtonGroup, DropdownMenu } from "@lark-ui/core";
import { CaretDownIcon } from "@phosphor-icons/react";

/**
 * 分裂按钮：主操作与下拉触发器组合在一起，用于承载相关的次要操作。
 * 箭头按钮使用 `shape="square"` 并带有 `aria-label`。
 */
export function ButtonGroupSplitDemo() {
  return (
    <ButtonGroup aria-label="部署">
      <Button variant="primary">部署</Button>
      <DropdownMenu>
        <DropdownMenu.Trigger
          render={
            <Button variant="primary" shape="square" aria-label="更多部署选项">
              <CaretDownIcon />
            </Button>
          }
        />
        <DropdownMenu.Content>
          <DropdownMenu.Item>部署到预发布环境</DropdownMenu.Item>
          <DropdownMenu.Item>部署并跟踪日志</DropdownMenu.Item>
          <DropdownMenu.Item>安排部署…</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </ButtonGroup>
  );
}

/**
 * 分裂按钮适用于任何按钮变体——这里使用次要样式来承载弱化强调的操作。
 */
export function ButtonGroupSecondaryDemo() {
  return (
    <ButtonGroup aria-label="保存">
      <Button variant="secondary">保存</Button>
      <DropdownMenu>
        <DropdownMenu.Trigger
          render={
            <Button
              variant="secondary"
              shape="square"
              aria-label="更多保存选项"
            >
              <CaretDownIcon />
            </Button>
          }
        />
        <DropdownMenu.Content>
          <DropdownMenu.Item>保存为草稿</DropdownMenu.Item>
          <DropdownMenu.Item>保存并发布</DropdownMenu.Item>
          <DropdownMenu.Item>保存副本…</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </ButtonGroup>
  );
}

/**
 * 两个按钮使用相同的 `size`，以保证分裂按钮对齐。
 */
export function ButtonGroupSizesDemo() {
  const sizes = ["sm", "base", "lg"] as const;
  return (
    <div className="flex flex-wrap items-center gap-4">
      {sizes.map((size) => (
        <ButtonGroup key={size} aria-label="部署">
          <Button size={size} variant="primary">
            部署
          </Button>
          <DropdownMenu>
            <DropdownMenu.Trigger
              render={
                <Button
                  size={size}
                  variant="primary"
                  shape="square"
                  aria-label="更多部署选项"
                >
                  <CaretDownIcon />
                </Button>
              }
            />
            <DropdownMenu.Content>
              <DropdownMenu.Item>部署到预发布环境</DropdownMenu.Item>
              <DropdownMenu.Item>安排部署…</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </ButtonGroup>
      ))}
    </div>
  );
}
