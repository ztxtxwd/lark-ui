import { Surface, Code } from "@lark-ui/core";
import { DatabaseIcon } from "@phosphor-icons/react";

// Note: In a real project, ResourceListPage would be installed via CLI
// npx @lark-ui/core add ResourceListPage
// For this demo, we're using a simplified inline version

interface ResourceListPageProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  usage?: React.ReactNode;
  additionalContent?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

function ResourceListPage({
  title,
  description,
  icon,
  usage,
  additionalContent,
  children,
  className,
}: ResourceListPageProps) {
  return (
    <div className={`min-h-[400px] w-full bg-lark-overlay ${className || ""}`}>
      <div className="mx-auto flex max-w-[1400px] flex-col p-6 md:gap-4 md:p-8">
        <div className="flex flex-col">
          <div className="mb-1.5 flex items-center gap-1.5">
            {icon}
            <h1 className="font-heading m-0 p-0 text-3xl font-semibold">
              {title}
            </h1>
          </div>
          <p className="hidden p-0 text-lg leading-normal text-pretty text-lark-subtle md:block">
            {description}
          </p>
        </div>

        <div className="flex flex-col-reverse gap-6 xl:grid xl:grid-cols-[1fr_2fr] xl:gap-8">
          <div className="min-w-0">{children}</div>

          {(usage || additionalContent) && (
            <div className="top-22 flex h-fit w-full min-w-0 flex-col gap-4 xl:sticky">
              {usage}
              {additionalContent && (
                <div className={usage ? "mt-6" : ""}>{additionalContent}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ResourceListBasicDemo() {
  return (
    <ResourceListPage
      title="数据库"
      description="管理你的数据库实例和配置"
      icon={<DatabaseIcon size={32} className="text-lark-subtle" />}
    >
      <Surface className="p-6">
        <p>主要内容区域 —— 资源列表将显示在这里</p>
      </Surface>
    </ResourceListPage>
  );
}

export function ResourceListWithUsageDemo() {
  return (
    <ResourceListPage
      title="API 密钥"
      description="为你的应用创建和管理 API 密钥"
      usage={
        <Surface className="p-4">
          <h3 className="mb-2 font-semibold">快速开始</h3>
          <p className="mb-3 text-sm text-lark-subtle">
            生成 API 密钥来认证你的请求
          </p>
          <Code
            className="overflow-x-auto"
            lang="bash"
            code='curl -H "Authorization: Bearer YOUR_API_KEY" https://api.example.com'
          />
        </Surface>
      }
    >
      <Surface className="p-6">
        <p>API 密钥列表将显示在这里</p>
      </Surface>
    </ResourceListPage>
  );
}

export function ResourceListCompleteDemo() {
  return (
    <ResourceListPage
      title="KV 命名空间"
      description="以低延迟在全球范围存储键值数据"
      icon={<DatabaseIcon size={32} className="text-lark-subtle" />}
      usage={
        <Surface className="p-4">
          <h3 className="mb-2 font-semibold">使用示例</h3>
          <Code
            className="overflow-x-auto"
            lang="ts"
            code={`// Read from KV
const value = await KV.get('key');

// Write to KV
await KV.put('key', 'value');`}
          />
        </Surface>
      }
      additionalContent={
        <Surface className="p-4">
          <h3 className="mb-2 font-semibold">了解更多</h3>
          <p className="text-sm text-lark-subtle">
            查看我们的文档，了解更多关于 KV 存储的信息。
          </p>
        </Surface>
      }
    >
      <div className="space-y-4">
        <Surface className="p-6">
          <h4 className="mb-2 truncate font-semibold">production-kv</h4>
          <p className="text-sm text-lark-subtle">2 天前创建</p>
        </Surface>
        <Surface className="p-6">
          <h4 className="mb-2 truncate font-semibold">staging-kv</h4>
          <p className="text-sm text-lark-subtle">1 周前创建</p>
        </Surface>
      </div>
    </ResourceListPage>
  );
}
