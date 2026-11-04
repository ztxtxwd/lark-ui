import { Link } from "@lark-ui/core";

export function LinkBasicDemo() {
  return (
    <div className="grid gap-x-6 gap-y-4 text-base md:grid-cols-3">
      <Link href="#">默认行内链接</Link>
      <Link href="#" variant="current">
        当前颜色链接
      </Link>
      <Link href="#" variant="plain">
        纯文本行内链接
      </Link>
    </div>
  );
}

export function LinkInParagraphDemo() {
  return (
    <p className="mx-auto max-w-md text-base leading-relaxed text-lark-default">
      这是一段包含<Link href="#">行内链接</Link>
      的段落，链接与周围的文字自然衔接。链接保留了合适的下划线偏移量，便于阅读。
    </p>
  );
}

export function LinkExternalDemo() {
  return (
    <Link
      href="https://cloudflare.com"
      target="_blank"
      rel="noopener noreferrer"
      className="text-base"
    >
      访问 Lark <Link.ExternalIcon />
    </Link>
  );
}

export function LinkCurrentVariantDemo() {
  return (
    <p className="text-base text-lark-danger">
      这条错误信息包含一个{" "}
      <Link href="#" variant="current">
        链接
      </Link>
      ，它继承父级的红色样式。
    </p>
  );
}

// Helper component simulating a framework link (e.g., React Router's Link)
const CustomRouterLink = ({
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a data-custom-router-link {...props}>
    {children}
  </a>
);

export function LinkRenderDemo() {
  return (
    <div className="flex flex-col gap-x-6 gap-y-4 text-base md:flex-row">
      <Link render={<CustomRouterLink href="/dashboard" />} variant="inline">
        仪表板（通过 render）
      </Link>
      <Link
        render={
          <CustomRouterLink
            href="https://developers.cloudflare.com"
            target="_blank"
            rel="noopener noreferrer"
          />
        }
        variant="inline"
      >
        Lark 文档 <Link.ExternalIcon />
      </Link>
    </div>
  );
}
