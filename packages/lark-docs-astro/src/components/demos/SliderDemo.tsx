import { useState } from "react";
import { Slider } from "@lark-ui/core";

export function SliderBasicDemo() {
  return <Slider label="音量" defaultValue={40} className="w-72" />;
}

export function SliderRangeDemo() {
  return (
    <Slider
      label="价格区间"
      defaultValue={[25, 75]}
      getAriaLabel={(index) => (index === 0 ? "最低价格" : "最高价格")}
      className="w-72"
    />
  );
}

export function SliderStepDemo() {
  return <Slider label="匹配数量" defaultValue={2} max={5} className="w-72" />;
}

export function SliderFormatDemo() {
  return (
    <Slider
      label="采样率"
      defaultValue={0.25}
      min={0}
      max={1}
      step={0.05}
      format={{ style: "percent" }}
      className="w-72"
    />
  );
}

export function SliderSizesDemo() {
  return (
    <div className="flex w-72 flex-col gap-6">
      <Slider label="小" size="sm" defaultValue={30} />
      <Slider label="常规" defaultValue={30} />
    </div>
  );
}

export function SliderControlledDemo() {
  const [value, setValue] = useState(50);

  return (
    <div className="flex w-72 flex-col gap-3">
      <Slider
        label="亮度"
        value={value}
        onValueChange={(next) => setValue(next)}
      />
      <p className="text-sm text-lark-subtle">亮度：{value}%</p>
    </div>
  );
}

export function SliderDisabledDemo() {
  return <Slider label="已锁定" defaultValue={70} disabled className="w-72" />;
}
