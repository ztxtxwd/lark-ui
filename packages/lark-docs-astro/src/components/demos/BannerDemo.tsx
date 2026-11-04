import { Banner, Text, Link } from "@lark-ui/core";
import { Info, WarningCircle, Warning, X } from "@phosphor-icons/react";

/** 展示所有通告栏（Banner）变体，包含结构化的标题和描述。 */
export function BannerVariantsDemo() {
  return (
    <div className="w-full space-y-3">
      <Banner
        icon={<Info weight="fill" />}
        title="有可用更新"
        description="新版本已可安装。"
      />
      <Banner
        icon={<Warning weight="fill" />}
        variant="alert"
        title="会话即将过期"
        description="您的会话将在 5 分钟后过期。"
      />
      <Banner
        icon={<WarningCircle weight="fill" />}
        variant="error"
        title="保存失败"
        description="无法保存您的更改，请重试。"
      />
      <Banner
        icon={<Info weight="fill" />}
        variant="secondary"
        title="已安排维护"
        description="此服务将中断 10 分钟。"
      />
    </div>
  );
}

/** 默认的信息类通告栏，包含标题和描述。 */
export function BannerDefaultDemo() {
  return (
    <Banner
      icon={<Info weight="fill" />}
      title="有可用更新"
      description="新版本已可安装。"
    />
  );
}

/** 警示类通告栏，用于需要用户关注的警告。 */
export function BannerAlertDemo() {
  return (
    <Banner
      icon={<Warning weight="fill" />}
      variant="alert"
      title="会话即将过期"
      description="您的会话将在 5 分钟后过期。"
    />
  );
}

/** 错误类通告栏，用于严重问题。 */
export function BannerErrorDemo() {
  return (
    <Banner
      icon={<WarningCircle weight="fill" />}
      variant="error"
      title="保存失败"
      description="无法保存您的更改，请重试。"
    />
  );
}

/** 中性的次要通告栏，用于上下文提示信息。 */
export function BannerSecondaryDemo() {
  return (
    <Banner
      icon={<Info weight="fill" />}
      variant="secondary"
      title="已安排维护"
      description="此服务将中断 10 分钟。"
    />
  );
}

/** 只有标题、没有描述的通告栏。 */
export function BannerTitleOnlyDemo() {
  return <Banner icon={<Info weight="fill" />} title="您的更改已保存。" />;
}

/**
 * 描边主题：浅色底 + 1px 状态色描边，对应飞书 `ud__notice--outlined`。
 */
export function BannerOutlinedDemo() {
  return (
    <div className="w-full space-y-3">
      <Banner
        theme="outlined"
        icon={<Info weight="fill" />}
        title="有可用更新"
        description="新版本已可安装。"
      />
      <Banner
        theme="outlined"
        variant="alert"
        icon={<Warning weight="fill" />}
        title="会话即将过期"
        description="您的会话将在 5 分钟后过期。"
      />
      <Banner
        theme="outlined"
        variant="error"
        icon={<WarningCircle weight="fill" />}
        title="保存失败"
        description="无法保存您的更改，请重试。"
      />
      <Banner
        theme="outlined"
        variant="secondary"
        icon={<Info weight="fill" />}
        title="已安排维护"
        description="此服务将中断 10 分钟。"
      />
    </div>
  );
}

/** 带自定义图标和结构化内容的通告栏。 */
export function BannerWithIconDemo() {
  return (
    <Banner
      icon={<Warning weight="fill" />}
      variant="alert"
      title="需要复核"
      description="请在继续之前核对您的账单信息。"
    />
  );
}

/** 描述中使用自定义 React 内容的通告栏。 */
export function BannerCustomContentDemo() {
  return (
    <Banner
      icon={<Info weight="fill" />}
      title="支持自定义内容"
      description={
        <Text DANGEROUS_className="text-inherit">
          此通告栏支持使用 Text 渲染<strong>自定义内容</strong>。
        </Text>
      }
    />
  );
}

/** 带操作按钮的通告栏：主要操作按钮和可关闭按钮。 */
export function BannerWithActionDemo() {
  return (
    <div className="w-full space-y-3">
      <Banner
        icon={<Info weight="fill" />}
        title="有可用更新"
        description="新版本已可安装。"
        action={
          <>
            <Banner.Action>更新</Banner.Action>
            <Banner.Action variant="ghost" icon={<X />} aria-label="关闭" />
          </>
        }
      />
      <Banner
        variant="error"
        icon={<WarningCircle weight="fill" />}
        title="保存失败"
        description="无法保存您的更改，请重试。"
        action={
          <>
            <Banner.Action>重试</Banner.Action>
            <Banner.Action variant="ghost" icon={<X />} aria-label="关闭" />
          </>
        }
      />
      <Banner
        variant="alert"
        icon={<WarningCircle weight="fill" />}
        title="保存失败"
        description="无法保存您的更改，请重试。"
        action={
          <>
            <Banner.Action>重试</Banner.Action>
            <Banner.Action variant="ghost" icon={<X />} aria-label="关闭" />
          </>
        }
      />
      <Banner
        variant="secondary"
        icon={<WarningCircle weight="fill" />}
        title="保存失败"
        description="无法保存您的更改，请重试。"
        action={
          <>
            <Banner.Action>重试</Banner.Action>
            <Banner.Action variant="ghost" icon={<X />} aria-label="关闭" />
          </>
        }
      />
    </div>
  );
}

/** 带多个操作按钮的通告栏。 */
export function BannerWithActionsDemo() {
  return (
    <div className="w-full space-y-3">
      <Banner
        icon={<Warning weight="fill" />}
        variant="error"
        title="您的账户已逾期 90 天。"
        description="请立即支付以避免服务中断。"
        action={
          <>
            <Banner.Action>立即支付</Banner.Action>
            <Banner.Action variant="secondary">前往账单</Banner.Action>
          </>
        }
      />
    </div>
  );
}

/* Accent-aware CTAs via the `Banner.Action` compound. */
export function BannerActionCompoundDemo() {
  return (
    <div className="w-full space-y-3">
      <Banner
        icon={<Info weight="fill" />}
        title="有可用更新"
        description="新版本已可安装。"
        action={
          <>
            <Banner.Action>更新</Banner.Action>
            <Banner.Action variant="ghost" icon={<X />} aria-label="关闭" />
          </>
        }
      />
      <Banner
        variant="alert"
        icon={<Warning weight="fill" />}
        title="会话即将过期"
        description="您的会话将在 5 分钟后过期。"
        action={
          <>
            <Banner.Action>延长</Banner.Action>
            <Banner.Action variant="ghost" icon={<X />} aria-label="关闭" />
          </>
        }
      />
      <Banner
        variant="error"
        icon={<WarningCircle weight="fill" />}
        title="保存失败"
        description="无法保存您的更改，请重试。"
        action={
          <>
            <Banner.Action>重试</Banner.Action>
            <Banner.Action variant="ghost" icon={<X />} aria-label="关闭" />
          </>
        }
      />
      <Banner
        variant="secondary"
        icon={<Info weight="fill" />}
        title="请注意"
        description="这是一个次要的信息类通告栏。"
        action={
          <>
            <Banner.Action>知道了</Banner.Action>
            <Banner.Action variant="ghost" icon={<X />} aria-label="关闭" />
          </>
        }
      />
    </div>
  );
}

/**
 * 紧凑型 `size="sm"` 通告栏，适用于对话框等空间有限的场景。
 */
export function BannerCompactDemo() {
  return (
    <Banner
      size="sm"
      description="此区域中已存在 puppies.cloudflare.dev 的 DNS 记录。"
      action={<Link href="#">管理 puppies.cloudflare.dev 的 DNS</Link>}
    />
  );
}

/** 带尾部主要操作按钮的紧凑型通告栏。 */
export function BannerCompactWithCtaDemo() {
  return (
    <Banner
      size="sm"
      description="此区域中已存在 puppies.cloudflare.dev 的 DNS 记录。"
      action={
        <>
          <Banner.Action>管理 DNS</Banner.Action>
          <Banner.Action variant="ghost">
            <X />
          </Banner.Action>
        </>
      }
    />
  );
}

/** 不带操作按钮的紧凑型通告栏。 */
export function BannerCompactWithoutActionDemo() {
  return (
    <Banner
      size="sm"
      description="此区域中已存在 puppies.cloudflare.dev 的 DNS 记录。"
    />
  );
}

/** 使用 children 属性的旧版通告栏，保持向后兼容。 */
export function BannerLegacyDemo() {
  return <Banner icon={<Info />}>这是一个使用 children 的简单通告栏。</Banner>;
}
