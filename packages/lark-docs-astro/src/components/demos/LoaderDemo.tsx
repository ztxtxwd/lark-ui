import { Loader } from "@lark-ui/core";

export function LoaderBasicDemo() {
  return <Loader />;
}

export function LoaderSizesDemo() {
  return (
    <div className="flex items-center gap-4">
      <Loader size="sm" />
      <Loader size="base" />
      <Loader size="lg" />
    </div>
  );
}

export function LoaderCustomSizeDemo() {
  return <Loader size={24} />;
}

/** 演示如何使用 className 更改加载指示器（Loader）的颜色 */
export function LoaderCustomColorDemo() {
  return <Loader className="text-lark-subtle" />;
}
