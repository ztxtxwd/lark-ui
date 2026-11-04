import { Button, Toasty, useLarkToastManager, Link } from "@lark-ui/core";
import { CheckCircleIcon } from "@phosphor-icons/react/dist/ssr";

function ToastTriggerButton() {
  const toastManager = useLarkToastManager();

  return (
    <Button
      onClick={() =>
        toastManager.add({
          title: "轻提示已创建",
          description: "这是一条轻提示通知。",
        })
      }
    >
      显示轻提示
    </Button>
  );
}

export function ToastBasicDemo() {
  return (
    <Toasty>
      <ToastTriggerButton />
    </Toasty>
  );
}

function ToastFunctionalUpdateButton() {
  const toastManager = useLarkToastManager();

  return (
    <Button
      onClick={() => {
        const id = toastManager.add({
          id: "functional-update",
          title: "正在部署 Worker",
          description: "正在上传你的更改。",
          variant: "info",
          data: { deployment: "进行中" },
        });

        setTimeout(() => {
          toastManager.update(id, (toast) => ({
            title: "Worker 已部署",
            description: `部署${toast.data.deployment}。`,
            variant: "success",
          }));
        }, 1200);
      }}
    >
      部署 Worker
    </Button>
  );
}

/** 演示基于当前状态更新轻提示（Toast）。 */
export function ToastFunctionalUpdateDemo() {
  return (
    <Toasty>
      <ToastFunctionalUpdateButton />
    </Toasty>
  );
}

function ToastTitleOnlyButton() {
  const toastManager = useLarkToastManager();

  return (
    <Button
      onClick={() =>
        toastManager.add({
          title: "设置已保存",
        })
      }
    >
      仅标题
    </Button>
  );
}

export function ToastTitleOnlyDemo() {
  return (
    <Toasty>
      <ToastTitleOnlyButton />
    </Toasty>
  );
}

function ToastDescriptionOnlyButton() {
  const toastManager = useLarkToastManager();

  return (
    <Button
      onClick={() =>
        toastManager.add({
          description: "你的更改已成功保存。",
        })
      }
    >
      仅描述
    </Button>
  );
}

export function ToastDescriptionOnlyDemo() {
  return (
    <Toasty>
      <ToastDescriptionOnlyButton />
    </Toasty>
  );
}

/** Success toast with green accent border and check icon. */
function ToastSuccessButton() {
  const toastManager = useLarkToastManager();

  return (
    <Button
      variant="primary"
      onClick={() =>
        toastManager.add({
          title: "部署成功",
          description: "你的 Worker 已上线。",
          variant: "success",
        })
      }
    >
      部署 Worker
    </Button>
  );
}

export function ToastSuccessDemo() {
  return (
    <Toasty>
      <ToastSuccessButton />
    </Toasty>
  );
}

function ToastMultipleButton() {
  const toastManager = useLarkToastManager();

  return (
    <Button
      onClick={() => {
        toastManager.add({
          title: "第一条轻提示",
          description: "这是第一条通知。",
        });
        setTimeout(() => {
          toastManager.add({
            title: "第二条轻提示",
            description: "这是第二条通知。",
          });
        }, 500);
        setTimeout(() => {
          toastManager.add({
            title: "第三条轻提示",
            description: "这是第三条通知。",
          });
        }, 1000);
      }}
    >
      显示多条轻提示
    </Button>
  );
}

export function ToastMultipleDemo() {
  return (
    <Toasty>
      <ToastMultipleButton />
    </Toasty>
  );
}

function ToastDeduplicatedButton() {
  const toastManager = useLarkToastManager();

  return (
    <Button
      onClick={() =>
        toastManager.add({
          id: "deduplicated-toast",
          title: "连接已断开",
          description: "再次点击：这条轻提示会置顶，而不是叠加新的副本。",
        })
      }
    >
      显示相同的轻提示
    </Button>
  );
}

/** 复用固定的 ID，使重复触发只会更新同一条轻提示，而不是新增副本。 */
export function ToastDeduplicatedDemo() {
  return (
    <Toasty>
      <ToastDeduplicatedButton />
    </Toasty>
  );
}

function ToastErrorButton() {
  const toastManager = useLarkToastManager();

  return (
    <Button
      onClick={() =>
        toastManager.add({
          title: "部署失败",
          description: "无法连接到服务器。",
          variant: "error",
        })
      }
    >
      显示错误轻提示
    </Button>
  );
}

export function ToastErrorDemo() {
  return (
    <Toasty>
      <ToastErrorButton />
    </Toasty>
  );
}

function ToastWarningButton() {
  const toastManager = useLarkToastManager();

  return (
    <Button
      onClick={() =>
        toastManager.add({
          title: "速率限制警告",
          description: "你的 API 配额即将用尽。",
          variant: "warning",
        })
      }
    >
      显示警告轻提示
    </Button>
  );
}

export function ToastWarningDemo() {
  return (
    <Toasty>
      <ToastWarningButton />
    </Toasty>
  );
}

/** Info toast with blue accent border and info icon. */
function ToastInfoButton() {
  const toastManager = useLarkToastManager();

  return (
    <Button
      onClick={() =>
        toastManager.add({
          title: "有新版本可用",
          description: "Lark v4.2 包含性能改进。",
          variant: "info",
        })
      }
    >
      显示信息轻提示
    </Button>
  );
}

export function ToastInfoDemo() {
  return (
    <Toasty>
      <ToastInfoButton />
    </Toasty>
  );
}

function ToastCustomContentButton() {
  const toastManager = useLarkToastManager();

  return (
    <Button
      onClick={() =>
        toastManager.add({
          content: (
            <div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon />
                <Link href="/">my-first-worker</Link> 已创建！
              </div>
            </div>
          ),
        })
      }
    >
      显示自定义内容
    </Button>
  );
}

export function ToastCustomContentDemo() {
  return (
    <Toasty>
      <ToastCustomContentButton />
    </Toasty>
  );
}

function ToastActionsButton() {
  const toastManager = useLarkToastManager();

  return (
    <Button
      onClick={() =>
        toastManager.add({
          title: "需要帮助？",
          description: "获取部署方面的协助。",
          actions: [
            {
              children: "获取支持",
              variant: "secondary",
              onClick: () => console.log("Support clicked"),
            },
            {
              children: "询问 AI",
              variant: "primary",
              onClick: () => console.log("Ask AI clicked"),
            },
          ],
        })
      }
    >
      显示带操作按钮的轻提示
    </Button>
  );
}

export function ToastActionsDemo() {
  return (
    <Toasty>
      <ToastActionsButton />
    </Toasty>
  );
}

function ToastPromiseButton() {
  const toastManager = useLarkToastManager();

  const simulateDeployment = () => {
    return new Promise<{ name: string }>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.3) {
          resolve({ name: "my-worker" });
        } else {
          reject(new Error("Network error"));
        }
      }, 2000);
    });
  };

  return (
    <Button
      onClick={() =>
        toastManager.promise(simulateDeployment(), {
          loading: {
            title: "正在部署……",
            description: "请稍候，我们正在部署你的 Worker。",
          },
          success: (data) => ({
            title: "部署成功！",
            description: `Worker「${data.name}」已上线。`,
          }),
          error: (err) => ({
            title: "部署失败",
            description: err.message,
            variant: "error",
          }),
        })
      }
    >
      以 Promise 方式部署
    </Button>
  );
}

export function ToastPromiseDemo() {
  return (
    <Toasty>
      <ToastPromiseButton />
    </Toasty>
  );
}
