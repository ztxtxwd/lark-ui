import { Badge, Link } from "@lark-ui/core";
import { CheckCircleIcon } from "@phosphor-icons/react";

export function BadgeSemanticVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="primary">主要</Badge>
      <Badge variant="secondary">次要</Badge>
      <Badge variant="error">错误</Badge>
      <Badge variant="success">成功</Badge>
      <Badge variant="warning">警告</Badge>
      <Badge variant="info">信息</Badge>
      <Badge variant="outline">轮廓</Badge>
      <Badge variant="beta">Beta</Badge>
    </div>
  );
}

export function BadgeColorVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="neutral">中性</Badge>
      <Badge variant="red">红色</Badge>
      <Badge variant="green">绿色</Badge>
      <Badge variant="orange">橙色</Badge>
      <Badge variant="teal">青色</Badge>
      <Badge variant="blue">蓝色</Badge>
      <Badge variant="purple">紫色</Badge>
    </div>
  );
}

export function BadgeInSentenceDemo() {
  return (
    <p className="flex items-center gap-2">
      Workers
      <Badge variant="secondary">全新</Badge>
    </p>
  );
}

export function BadgeIconDemo() {
  return (
    <Badge icon={CheckCircleIcon} variant="success">
      已验证
    </Badge>
  );
}

export function BadgeLinkDemo() {
  return (
    <Link href="/changelog" variant="plain">
      <Badge variant="outline">查看更新日志</Badge>
    </Link>
  );
}

export function BadgeDotDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="success" appearance="dot">
        健康
      </Badge>
      <Badge variant="warning" appearance="dot">
        警告
      </Badge>
      <Badge variant="error" appearance="dot">
        错误
      </Badge>
      <Badge variant="neutral" appearance="dot">
        中性
      </Badge>
    </div>
  );
}
