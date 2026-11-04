import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const sourcePath = resolve(
  projectRoot,
  process.argv[2] ?? "src/components/skill/design-tips.tsx",
);
const outputPaths = [
  resolve(projectRoot, "public/skill.md"),
  resolve(projectRoot, "../../skills/lark-design/SKILL.md"),
];

function parseDesignTips(sourceText) {
  const sourceFile = ts.createSourceFile(
    sourcePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  function fail(node, message) {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(
      node.getStart(sourceFile),
    );
    throw new Error(
      `${relative(projectRoot, sourcePath)}:${line + 1}:${character + 1} ${message}`,
    );
  }

  function unwrapExpression(expression) {
    let current = expression;
    while (
      ts.isParenthesizedExpression(current) ||
      ts.isSatisfiesExpression(current) ||
      ts.isAsExpression(current)
    ) {
      current = current.expression;
    }
    return current;
  }

  function getProperty(object, name) {
    const property = object.properties.find(
      (candidate) =>
        ts.isPropertyAssignment(candidate) &&
        ((ts.isIdentifier(candidate.name) && candidate.name.text === name) ||
          (ts.isStringLiteral(candidate.name) && candidate.name.text === name)),
    );

    if (!property || !ts.isPropertyAssignment(property)) {
      fail(object, `Expected a ${name} property`);
    }
    return property.initializer;
  }

  function readString(expression, label) {
    const value = unwrapExpression(expression);
    if (
      !ts.isStringLiteral(value) &&
      !ts.isNoSubstitutionTemplateLiteral(value)
    ) {
      fail(value, `Expected ${label} to be a static string`);
    }
    return value.text;
  }

  function readCodeExample(expression) {
    const element = unwrapExpression(expression);
    const openingElement = ts.isJsxSelfClosingElement(element)
      ? element
      : ts.isJsxElement(element)
        ? element.openingElement
        : undefined;

    if (
      !openingElement ||
      openingElement.tagName.getText(sourceFile) !== "CodeExample"
    ) {
      return undefined;
    }

    const codeAttribute = openingElement.attributes.properties
      .filter(ts.isJsxAttribute)
      .find(
        (attribute) =>
          ts.isIdentifier(attribute.name) && attribute.name.text === "code",
      );
    if (!codeAttribute) {
      fail(openingElement, "Expected CodeExample to have a code prop");
    }

    const initializer = codeAttribute.initializer;
    if (!initializer) {
      fail(codeAttribute, "Expected CodeExample code prop to have a value");
    }
    if (ts.isStringLiteral(initializer)) {
      return initializer.text;
    }
    if (ts.isJsxExpression(initializer) && initializer.expression) {
      return readString(initializer.expression, "CodeExample code prop");
    }

    fail(initializer, "Expected CodeExample code prop to be a static string");
  }

  function readExample(expression) {
    const value = unwrapExpression(expression);
    if (!ts.isObjectLiteralExpression(value)) {
      fail(value, "Expected each example to be an object");
    }

    const variant = readString(
      getProperty(value, "variant"),
      "example variant",
    );
    if (variant !== "good" && variant !== "bad") {
      fail(value, 'Expected example variant to be "good" or "bad"');
    }

    const jsx = getProperty(value, "jsx");
    const exampleCodeProperty = value.properties.find(
      (property) =>
        ts.isPropertyAssignment(property) &&
        ts.isIdentifier(property.name) &&
        property.name.text === "exampleCode",
    );
    const exampleCode =
      exampleCodeProperty && ts.isPropertyAssignment(exampleCodeProperty)
        ? readString(exampleCodeProperty.initializer, "example code")
        : undefined;
    const codeExample = readCodeExample(jsx);
    if (codeExample !== undefined && exampleCode !== undefined) {
      fail(value, "CodeExample entries must not have an exampleCode property");
    }
    const jsxExpression = unwrapExpression(jsx);
    const { line } = sourceFile.getLineAndCharacterOfPosition(
      jsxExpression.getStart(sourceFile),
    );
    const lineStart = sourceFile.getPositionOfLineAndCharacter(line, 0);
    const linePrefix = sourceText.slice(
      lineStart,
      jsxExpression.getStart(sourceFile),
    );
    const sourceIndentation = linePrefix.match(/^[\t ]*/)?.[0] ?? "";
    const jsxSource = jsxExpression
      .getText(sourceFile)
      .split("\n")
      .map((sourceLine, lineIndex) =>
        lineIndex > 0 && sourceLine.startsWith(sourceIndentation)
          ? sourceLine.slice(sourceIndentation.length)
          : sourceLine,
      )
      .join("\n");

    return {
      variant,
      code: exampleCode ?? codeExample ?? jsxSource,
    };
  }

  let designTipsInitializer;
  function findDesignTips(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === "designTips"
    ) {
      designTipsInitializer = node.initializer;
      return;
    }
    ts.forEachChild(node, findDesignTips);
  }
  findDesignTips(sourceFile);

  if (!designTipsInitializer) {
    throw new Error(
      `${relative(projectRoot, sourcePath)}: Could not find designTips declaration`,
    );
  }

  const tipsArray = unwrapExpression(designTipsInitializer);
  if (!ts.isArrayLiteralExpression(tipsArray)) {
    fail(tipsArray, "Expected designTips to be an array literal");
  }

  return tipsArray.elements.map((tipExpression) => {
    const tip = unwrapExpression(tipExpression);
    if (!ts.isObjectLiteralExpression(tip)) {
      fail(tip, "Expected each design tip to be an object");
    }

    const examples = unwrapExpression(getProperty(tip, "examples"));
    if (!ts.isArrayLiteralExpression(examples)) {
      fail(examples, "Expected examples to be an array literal");
    }

    const descriptionProperty = tip.properties.find(
      (property) =>
        ts.isPropertyAssignment(property) &&
        ts.isIdentifier(property.name) &&
        property.name.text === "description",
    );

    return {
      id: readString(getProperty(tip, "id"), "tip id"),
      title: readString(getProperty(tip, "title"), "tip title"),
      description:
        descriptionProperty && ts.isPropertyAssignment(descriptionProperty)
          ? readString(descriptionProperty.initializer, "tip description")
          : undefined,
      examples: examples.elements.map(readExample),
    };
  });
}

function renderCodeFence(code) {
  const longestBacktickRun = Math.max(
    0,
    ...(code.match(/`+/g) ?? []).map((run) => run.length),
  );
  const fence = "`".repeat(Math.max(3, longestBacktickRun + 1));
  return `${fence}tsx\n${code}${code.endsWith("\n") ? "" : "\n"}${fence}`;
}

function renderDesignSkill(tips) {
  const sections = tips.map((tip) => {
    const examples = [
      ["good", "推荐"],
      ["bad", "避免"],
    ]
      .map(([variant, label]) => {
        const codeBlocks = tip.examples
          .filter((example) => example.variant === variant)
          .map((example) => renderCodeFence(example.code))
          .join("\n\n");
        return codeBlocks ? `**${label}**\n\n${codeBlocks}` : undefined;
      })
      .filter(Boolean)
      .join("\n\n");

    return [`### \`${tip.id}\` ${tip.title}`, tip.description, examples]
      .filter(Boolean)
      .join("\n\n");
  });

  return `---
name: lark-design
description: Cloudflare 产品设计规范。在设计、实现或评审 Cloudflare 控制台界面、Lark UI、响应式样式、对话框或前端测试时使用。
---

# Cloudflare 设计规范

在设计、实现或评审 Cloudflare 产品界面时，请遵循以下规则。请参照标为「推荐」的示例，并避开标为「避免」的模式。

## 规则

${sections.join("\n\n")}\n`;
}

const sourceText = await readFile(sourcePath, "utf8");
const tips = parseDesignTips(sourceText);
const skill = renderDesignSkill(tips);
await Promise.all(
  outputPaths.map(async (outputPath) => {
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, skill);
  }),
);
console.log(
  `Generated ${outputPaths.map((outputPath) => relative(projectRoot, outputPath)).join(" and ")} from ${tips.length} design tips.`,
);
