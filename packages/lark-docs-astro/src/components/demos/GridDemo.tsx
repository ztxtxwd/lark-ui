import { Grid, GridItem, Surface, Text } from "@lark-ui/core";

export function GridDemo() {
  return (
    <Grid variant="2up" gap="base">
      <GridItem>
        <Surface className="rounded-lg p-4">
          <Text bold>项目 1</Text>
          <div className="mt-1">
            <Text variant="secondary">第一个栅格项</Text>
          </div>
        </Surface>
      </GridItem>
      <GridItem>
        <Surface className="rounded-lg p-4">
          <Text bold>项目 2</Text>
          <div className="mt-1">
            <Text variant="secondary">第二个栅格项</Text>
          </div>
        </Surface>
      </GridItem>
    </Grid>
  );
}

export function GridVariantsDemo() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-2 text-lark-subtle">variant="2up"</p>
        <Grid variant="2up" gap="sm">
          <GridItem>
            <Surface className="rounded-lg p-4 text-center">
              <Text>1</Text>
            </Surface>
          </GridItem>
          <GridItem>
            <Surface className="rounded-lg p-4 text-center">
              <Text>2</Text>
            </Surface>
          </GridItem>
        </Grid>
      </div>

      <div>
        <p className="mb-2 text-lark-subtle">variant="3up"</p>
        <Grid variant="3up" gap="sm">
          <GridItem>
            <Surface className="rounded-lg p-4 text-center">
              <Text>1</Text>
            </Surface>
          </GridItem>
          <GridItem>
            <Surface className="rounded-lg p-4 text-center">
              <Text>2</Text>
            </Surface>
          </GridItem>
          <GridItem>
            <Surface className="rounded-lg p-4 text-center">
              <Text>3</Text>
            </Surface>
          </GridItem>
        </Grid>
      </div>

      <div>
        <p className="mb-2 text-lark-subtle">variant="4up"</p>
        <Grid variant="4up" gap="sm">
          <GridItem>
            <Surface className="rounded-lg p-4 text-center">
              <Text>1</Text>
            </Surface>
          </GridItem>
          <GridItem>
            <Surface className="rounded-lg p-4 text-center">
              <Text>2</Text>
            </Surface>
          </GridItem>
          <GridItem>
            <Surface className="rounded-lg p-4 text-center">
              <Text>3</Text>
            </Surface>
          </GridItem>
          <GridItem>
            <Surface className="rounded-lg p-4 text-center">
              <Text>4</Text>
            </Surface>
          </GridItem>
        </Grid>
      </div>
    </div>
  );
}

export function GridAsymmetricDemo() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-2 text-lark-subtle">variant="2-1"（66% / 33%）</p>
        <Grid variant="2-1" gap="sm">
          <GridItem>
            <Surface className="rounded-lg p-4">
              <Text bold>主要内容</Text>
              <div className="mt-1">
                <Text variant="secondary">三分之二宽度</Text>
              </div>
            </Surface>
          </GridItem>
          <GridItem>
            <Surface className="rounded-lg p-4">
              <Text bold>侧边栏</Text>
              <div className="mt-1">
                <Text variant="secondary">三分之一宽度</Text>
              </div>
            </Surface>
          </GridItem>
        </Grid>
      </div>

      <div>
        <p className="mb-2 text-lark-subtle">variant="1-2"（33% / 66%）</p>
        <Grid variant="1-2" gap="sm">
          <GridItem>
            <Surface className="rounded-lg p-4">
              <Text bold>侧边栏</Text>
              <div className="mt-1">
                <Text variant="secondary">三分之一宽度</Text>
              </div>
            </Surface>
          </GridItem>
          <GridItem>
            <Surface className="rounded-lg p-4">
              <Text bold>主要内容</Text>
              <div className="mt-1">
                <Text variant="secondary">三分之二宽度</Text>
              </div>
            </Surface>
          </GridItem>
        </Grid>
      </div>
    </div>
  );
}

export function GridGapDemo() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-2 text-lark-subtle">gap="none"</p>
        <Grid variant="side-by-side" gap="none">
          <GridItem>
            <Surface className="rounded-lg p-4 text-center">
              <Text>1</Text>
            </Surface>
          </GridItem>
          <GridItem>
            <Surface className="rounded-lg p-4 text-center">
              <Text>2</Text>
            </Surface>
          </GridItem>
        </Grid>
      </div>

      <div>
        <p className="mb-2 text-lark-subtle">gap="sm"</p>
        <Grid variant="side-by-side" gap="sm">
          <GridItem>
            <Surface className="rounded-lg p-4 text-center">
              <Text>1</Text>
            </Surface>
          </GridItem>
          <GridItem>
            <Surface className="rounded-lg p-4 text-center">
              <Text>2</Text>
            </Surface>
          </GridItem>
        </Grid>
      </div>

      <div>
        <p className="mb-2 text-lark-subtle">gap="base"（默认，自适应）</p>
        <Grid variant="side-by-side" gap="base">
          <GridItem>
            <Surface className="rounded-lg p-4 text-center">
              <Text>1</Text>
            </Surface>
          </GridItem>
          <GridItem>
            <Surface className="rounded-lg p-4 text-center">
              <Text>2</Text>
            </Surface>
          </GridItem>
        </Grid>
      </div>

      <div>
        <p className="mb-2 text-lark-subtle">gap="lg"</p>
        <Grid variant="side-by-side" gap="lg">
          <GridItem>
            <Surface className="rounded-lg p-4 text-center">
              <Text>1</Text>
            </Surface>
          </GridItem>
          <GridItem>
            <Surface className="rounded-lg p-4 text-center">
              <Text>2</Text>
            </Surface>
          </GridItem>
        </Grid>
      </div>
    </div>
  );
}

export function GridMobileDividerDemo() {
  return (
    <Grid variant="4up" gap="base" mobileDivider>
      <GridItem>
        <Surface className="rounded-lg p-4">
          <Text bold>项目 1</Text>
          <div className="mt-1">
            <Text variant="secondary">移动端显示分隔线</Text>
          </div>
        </Surface>
      </GridItem>
      <GridItem>
        <Surface className="rounded-lg p-4">
          <Text bold>项目 2</Text>
          <div className="mt-1">
            <Text variant="secondary">移动端显示分隔线</Text>
          </div>
        </Surface>
      </GridItem>
      <GridItem>
        <Surface className="rounded-lg p-4">
          <Text bold>项目 3</Text>
          <div className="mt-1">
            <Text variant="secondary">移动端显示分隔线</Text>
          </div>
        </Surface>
      </GridItem>
      <GridItem>
        <Surface className="rounded-lg p-4">
          <Text bold>项目 4</Text>
          <div className="mt-1">
            <Text variant="secondary">移动端显示分隔线</Text>
          </div>
        </Surface>
      </GridItem>
    </Grid>
  );
}
