import { Meter } from "@lark-ui/core";

export function MeterBasicDemo() {
  return <Meter label="已用存储空间" value={65} />;
}

export function MeterCustomValueDemo() {
  return <Meter label="API 请求" value={75} customValue="750 / 1,000" />;
}

export function MeterHiddenValueDemo() {
  return <Meter label="进度" value={40} showValue={false} />;
}

export function MeterFullDemo() {
  return <Meter label="配额已达上限" value={100} />;
}

export function MeterLowDemo() {
  return <Meter label="内存使用量" value={15} />;
}

export function MeterCustomStyleDemo() {
  return (
    <Meter
      label="上传进度"
      value={80}
      indicatorClassName="from-lark-success via-lark-success to-lark-success"
    />
  );
}
