import { type FC, useState, useRef, useEffect, useCallback } from "react";
import { larkRegistryJson } from "virtual:lark-registry";

// Types for the registry
interface PropInfo {
  type: string;
  optional?: boolean;
  required?: boolean;
  values?: string[];
  descriptions?: Record<string, string>;
  default?: string;
  description?: string;
}

interface SubComponent {
  description?: string;
  props?: Record<string, PropInfo>;
  renderElement?: string;
}

interface ComponentInfo {
  name: string;
  description: string;
  importPath: string;
  category: string;
  props: Record<string, PropInfo>;
  examples: string[];
  colors: string[];
  subComponents?: Record<string, SubComponent>;
}

interface BlockInfo {
  name: string;
  type: string;
  description: string;
  importPath: string;
  category: string;
  props: Record<string, PropInfo>;
  examples: string[];
  colors: string[];
  files: string[];
  dependencies: string[];
}

interface ComponentRegistry {
  version: string;
  components: Record<string, ComponentInfo>;
  blocks?: Record<string, BlockInfo>;
}

// Terminal line types
type LineType = "input" | "output" | "error";

interface TerminalLine {
  type: LineType;
  content: string;
}

const HELP_TEXT = `Lark 命令行工具 - 组件注册表与区块分发

区块：
  lark-ui init            初始化 lark-ui.json 配置文件
  lark-ui blocks          列出所有可通过命令行工具安装的区块
  lark-ui add <block>     将区块安装到你的项目

组件注册表：
  lark-ui ls              按分类列出所有 Lark 组件
  lark-ui doc <name>      获取某个组件的详细文档
  lark-ui docs            获取所有组件的文档

通用：
  lark-ui help            显示此帮助信息
  clear                清空终端

示例：
  lark-ui init
  lark-ui blocks
  lark-ui add PageHeader
  lark-ui ls
  lark-ui doc Button
  lark-ui docs`;

/**
 * Format a prop for display
 */
function formatProp(name: string, prop: PropInfo): string[] {
  const lines: string[] = [];

  // Type
  let typeStr = prop.type;
  if (prop.values && prop.values.length > 0) {
    typeStr = prop.values.map((v) => `"${v}"`).join(" | ");
  }

  // Required/optional
  const required = prop.required === true || prop.optional === false;
  const requiredStr = required ? "（必填）" : "";

  // Default
  const defaultStr = prop.default ? `[默认值：${prop.default}]` : "";

  lines.push(`  ${name}: ${typeStr} ${requiredStr} ${defaultStr}`.trim());

  // Variant descriptions
  if (prop.descriptions && Object.keys(prop.descriptions).length > 0) {
    for (const [value, desc] of Object.entries(prop.descriptions)) {
      lines.push(`    - "${value}": ${desc}`);
    }
  }

  return lines;
}

/**
 * Format documentation for a single component
 */
function formatComponentDoc(component: ComponentInfo): string[] {
  const lines: string[] = [];

  lines.push(`# ${component.name}`);
  lines.push("");
  lines.push(component.description);
  lines.push("");
  lines.push(
    `导入：import { ${component.name} } from "${component.importPath}";`,
  );
  lines.push("");
  lines.push(`分类：${component.category}`);
  lines.push("");

  // Props (only show variant/size/shape props for brevity)
  const importantProps = ["variant", "size", "shape"];
  const propsToShow = Object.entries(component.props).filter(
    ([name]) =>
      importantProps.includes(name) ||
      component.props[name].values ||
      component.props[name].required,
  );

  if (propsToShow.length > 0) {
    lines.push("## 属性");
    lines.push("");
    for (const [propName, propInfo] of propsToShow.slice(0, 8)) {
      lines.push(...formatProp(propName, propInfo));
      lines.push("");
    }
    if (propsToShow.length > 8) {
      lines.push(`  ... 还有 ${propsToShow.length - 8} 个属性`);
      lines.push("");
    }
  }

  // Sub-components
  if (component.subComponents) {
    lines.push("## 子组件");
    lines.push("");
    for (const [subName, subInfo] of Object.entries(component.subComponents)) {
      lines.push(`  ${component.name}.${subName}`);
      if (subInfo.description) {
        lines.push(`    ${subInfo.description}`);
      }
    }
    lines.push("");
  }

  // Examples (just first 2)
  if (component.examples && component.examples.length > 0) {
    lines.push("## 示例");
    lines.push("");
    for (const example of component.examples.slice(0, 2)) {
      lines.push("  " + example);
    }
    if (component.examples.length > 2) {
      lines.push("");
      lines.push(`  （还有 ${component.examples.length - 2} 个可用示例）`);
    }
    lines.push("");
  }

  // Colors
  if (component.colors && component.colors.length > 0) {
    lines.push("## 语义化 token");
    lines.push("");
    lines.push("  " + component.colors.join(", "));
  }

  return lines;
}

/**
 * Execute a CLI command and return output lines
 */
function executeCommand(
  input: string,
  registry: ComponentRegistry,
): { output: string[]; isError: boolean } {
  const trimmed = input.trim();
  const parts = trimmed.split(/\s+/);
  const baseCommand = parts[0]?.toLowerCase();

  // Handle clear command
  if (baseCommand === "clear") {
    return { output: ["__CLEAR__"], isError: false };
  }

  // Handle non-lark commands
  if (baseCommand !== "lark-ui" && baseCommand !== "npx") {
    if (!trimmed) {
      return { output: [], isError: false };
    }
    return {
      output: [`找不到命令：${baseCommand}`, '请尝试 "lark-ui help"'],
      isError: true,
    };
  }

  // Parse lark command
  let commandIndex = 1;
  if (baseCommand === "npx") {
    // Skip "@lark-ui/core" part
    if (parts[1] === "@lark-ui/core") {
      commandIndex = 2;
    } else {
      return {
        output: [`未知包：${parts[1]}`],
        isError: true,
      };
    }
  }

  const command = parts[commandIndex]?.toLowerCase();
  const arg = parts[commandIndex + 1];

  switch (command) {
    case "ls": {
      const components = Object.values(registry.components);

      // Group by category
      const byCategory = new Map<string, ComponentInfo[]>();
      for (const component of components) {
        const category = component.category || "其他";
        if (!byCategory.has(category)) {
          byCategory.set(category, []);
        }
        byCategory.get(category)!.push(component);
      }

      // Sort categories and components
      const sortedCategories = [...byCategory.keys()].sort();

      const output: string[] = [];
      output.push(`Lark 组件（共 ${components.length} 个）`);
      output.push("");

      for (const category of sortedCategories) {
        const categoryComponents = [...byCategory.get(category)!].sort((a, b) =>
          a.name.localeCompare(b.name),
        );

        output.push(`${category}：`);
        for (const component of categoryComponents) {
          // Truncate long descriptions
          const desc =
            component.description.length > 50
              ? component.description.slice(0, 47) + "..."
              : component.description;
          output.push(`  ${component.name} - ${desc}`);
        }
        output.push("");
      }

      return { output, isError: false };
    }

    case "doc":
    case "docs": {
      if (!arg && command === "doc") {
        // Show all docs briefly
        const output: string[] = [];
        output.push(`# Lark 组件文档`);
        output.push("");
        output.push(`共 ${Object.keys(registry.components).length} 个组件可用`);
        output.push("");
        output.push('使用 "lark-ui doc <ComponentName>" 查看详细文档');
        output.push("");
        output.push("组件：");
        for (const name of Object.keys(registry.components).sort()) {
          output.push(`  - ${name}`);
        }
        return { output, isError: false };
      }

      if (arg) {
        // Find component (case-insensitive)
        const lowerArg = arg.toLowerCase();
        const component = Object.values(registry.components).find(
          (c) => c.name.toLowerCase() === lowerArg,
        );

        if (!component) {
          // Find similar
          const similar = Object.keys(registry.components)
            .filter(
              (n) =>
                n.toLowerCase().includes(lowerArg) ||
                lowerArg.includes(n.toLowerCase()),
            )
            .slice(0, 5);

          const output = [`未找到组件 "${arg}"。`];
          if (similar.length > 0) {
            output.push("");
            output.push(`你是想找：${similar.join(", ")} 吗？`);
          }
          output.push("");
          output.push('运行 "lark-ui ls" 查看所有可用组件。');
          return { output, isError: true };
        }

        return { output: formatComponentDoc(component), isError: false };
      }

      // docs - show all (abbreviated)
      const output: string[] = [];
      output.push(`# Lark 组件文档`);
      output.push("");
      output.push(`共 ${Object.keys(registry.components).length} 个组件可用`);
      output.push("");
      output.push("---");

      for (const component of Object.values(registry.components).slice(0, 3)) {
        output.push("");
        output.push(...formatComponentDoc(component));
        output.push("");
        output.push("---");
      }

      output.push("");
      output.push(
        `... 还有 ${Object.keys(registry.components).length - 3} 个组件`,
      );
      output.push("");
      output.push('使用 "lark-ui doc <name>" 查看指定组件。');

      return { output, isError: false };
    }

    case "init": {
      const output: string[] = [];
      output.push("正在初始化 Lark 配置……");
      output.push("");
      output.push(
        "区块应安装到哪个目录？(src/components/lark)：src/components/lark",
      );
      output.push("");
      output.push("已创建 lark-ui.json，配置如下：");
      output.push("   区块目录：src/components/lark");
      output.push("");
      output.push("后续步骤：");
      output.push('  1. 运行 "lark-ui blocks" 查看可用区块');
      output.push('  2. 运行 "lark-ui add <block-name>" 安装区块');
      return { output, isError: false };
    }

    case "blocks": {
      if (!registry.blocks) {
        return {
          output: ["此版本没有可用的区块。"],
          isError: true,
        };
      }

      const blocks = Object.values(registry.blocks);

      // Group by category
      const byCategory = new Map<string, BlockInfo[]>();
      for (const block of blocks) {
        const category = block.category || "其他";
        if (!byCategory.has(category)) {
          byCategory.set(category, []);
        }
        byCategory.get(category)!.push(block);
      }

      // Sort categories
      const sortedCategories = [...byCategory.keys()].sort();

      const output: string[] = [];
      output.push(`Lark 区块（共 ${blocks.length} 个）`);
      output.push("");

      for (const category of sortedCategories) {
        const categoryBlocks = [...byCategory.get(category)!].sort((a, b) =>
          a.name.localeCompare(b.name),
        );

        output.push(`${category}：`);
        for (const block of categoryBlocks) {
          // Truncate long descriptions
          const desc =
            block.description.length > 60
              ? block.description.slice(0, 57) + "..."
              : block.description;
          output.push(`  ${block.name} - ${desc}`);
        }
        output.push("");
      }

      output.push("安装区块请运行：");
      output.push("  lark-ui add <block-name>");
      output.push("");
      output.push("示例：");
      output.push("  lark-ui add PageHeader");

      return { output, isError: false };
    }

    case "add": {
      if (!arg) {
        return {
          output: [
            "错误：必须指定区块名称。",
            "",
            "用法：lark-ui add <block-name>",
            '运行 "lark-ui blocks" 查看可用区块。',
          ],
          isError: true,
        };
      }

      // Check if block exists
      const blockName = arg;
      const block = registry.blocks?.[blockName];

      if (!block) {
        // Try case-insensitive match
        const lowerArg = arg.toLowerCase();
        const matchedBlock = Object.values(registry.blocks || {}).find(
          (b) => b.name.toLowerCase() === lowerArg,
        );

        if (matchedBlock) {
          return executeCommand(`lark-ui add ${matchedBlock.name}`, registry);
        }

        const output = [`错误：未找到区块 '${blockName}'。`];
        output.push('运行 "lark-ui blocks" 查看可用区块。');
        return { output, isError: true };
      }

      // Simulate successful installation
      const output: string[] = [];
      output.push(`正在安装区块：${block.name}`);

      for (const file of block.files) {
        output.push(`  ${file}`);
      }
      output.push("");

      if (block.dependencies && block.dependencies.length > 0) {
        output.push("此区块依赖以下 Lark 组件：");
        for (const dep of block.dependencies) {
          output.push(`  - ${dep}（来自 @lark-ui/core）`);
        }
        output.push("");
        output.push("请确认你的项目中已安装 @lark-ui/core：");
        output.push("  pnpm add @lark-ui/core");
        output.push("");
      }

      output.push(`成功安装 ${block.name}！`);
      output.push("");
      output.push("现在你可以在项目中导入它：");

      // Calculate import path (simplified for demo)
      const mainFile = block.files.find(
        (f) =>
          f.endsWith(".tsx") && !f.includes(".stories") && !f.includes(".test"),
      );
      if (mainFile) {
        const importPath = mainFile.replace(/\.tsx$/, "").replace(/\//g, "/");
        output.push(
          `  import { ${block.name} } from "src/components/lark/${importPath}";`,
        );
      }

      return { output, isError: false };
    }

    case "help":
    case "--help":
    case "-h":
    case undefined: {
      return { output: HELP_TEXT.split("\n"), isError: false };
    }

    default: {
      return {
        output: [`未知命令：${command}`, "", HELP_TEXT],
        isError: true,
      };
    }
  }
}

/**
 * Interactive CLI Terminal component
 */
export const CLITerminal: FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      type: "output",
      content:
        "Lark 命令行工具 v" +
        larkRegistryJson.version +
        ' - 输入 "lark-ui help" 查看命令',
    },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const registry = larkRegistryJson as unknown as ComponentRegistry;

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input on click
  const handleTerminalClick = useCallback(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const handleSubmit = useCallback(() => {
    if (!currentInput.trim() && !currentInput) {
      // Empty enter, just add new prompt
      setLines((prev) => [...prev, { type: "input", content: "" }]);
      return;
    }

    const input = currentInput;
    setCurrentInput("");

    // Add to history
    if (input.trim()) {
      setCommandHistory((prev) => [...prev, input]);
    }
    setHistoryIndex(-1);

    // Add input line
    const newLines: TerminalLine[] = [{ type: "input", content: input }];

    // Execute command
    const { output, isError } = executeCommand(input, registry);

    // Handle clear
    if (output[0] === "__CLEAR__") {
      setLines([]);
      return;
    }

    // Add output lines
    for (const line of output) {
      newLines.push({
        type: isError ? "error" : "output",
        content: line,
      });
    }

    setLines((prev) => [...prev, ...newLines]);
  }, [currentInput, registry]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex =
            historyIndex === -1
              ? commandHistory.length - 1
              : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1;
          if (newIndex >= commandHistory.length) {
            setHistoryIndex(-1);
            setCurrentInput("");
          } else {
            setHistoryIndex(newIndex);
            setCurrentInput(commandHistory[newIndex]);
          }
        }
      } else if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        setLines([]);
      }
    },
    [handleSubmit, commandHistory, historyIndex],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm text-lark-default">
        <div className="flex flex-wrap gap-2">
          {[
            "lark-ui help",
            "lark-ui blocks",
            "lark-ui add PageHeader",
            "lark-ui ls",
            "lark-ui doc Button",
          ].map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => {
                setCurrentInput(cmd);
                inputRef.current?.focus({ preventScroll: true });
              }}
              className="rounded bg-lark-overlay px-2 py-1 font-mono text-xs text-lark-default transition-colors hover:bg-lark-recessed"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={terminalRef}
        onClick={handleTerminalClick}
        onKeyDown={undefined}
        className="relative h-[500px] w-full max-w-[800px] cursor-text overflow-x-auto overflow-y-auto overscroll-contain rounded-lg bg-black p-4 font-mono text-sm text-white"
      >
        {/* Output lines */}
        {lines.map((line, i) => {
          // Add spacing before output that follows an input line
          const prevLine = lines[i - 1];
          const isFirstOutputAfterInput =
            line.type !== "input" && prevLine?.type === "input";
          return (
            <div
              key={i}
              className={`whitespace-pre-wrap ${isFirstOutputAfterInput ? "mt-1" : ""}`}
            >
              {line.type === "input" ? (
                <span className="text-lark-success">
                  <span>$</span> {line.content}
                </span>
              ) : line.type === "error" ? (
                <span className="text-lark-danger">{line.content}</span>
              ) : (
                <span className="text-lark-success opacity-90">
                  {line.content}
                </span>
              )}
            </div>
          );
        })}

        {/* Current input line */}
        <div className="flex items-center">
          <span className="text-lark-success">$</span>
          <span className="mx-1 text-lark-success">{currentInput}</span>
          <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-white" />
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="absolute opacity-0"
            aria-label="终端输入"
          />
        </div>
      </div>

      <p className="text-xs text-lark-subtle">
        提示：使用方向键翻阅命令历史，Ctrl+L 清空终端
      </p>
    </div>
  );
};
