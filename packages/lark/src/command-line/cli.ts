#!/usr/bin/env node
/**
 * Lark CLI - Component registry and blocks distribution
 *
 * Usage:
 *   lark-ui init                 Initialize lark-ui.json configuration
 *   lark-ui ls                   List all components
 *   lark-ui doc <name>           Get documentation for a component
 *   lark-ui docs                 Get documentation for all components
 *   lark-ui help                 Show this help message
 */

import { ls } from "./commands/ls.js";
import { doc } from "./commands/doc.js";
import { init } from "./commands/init.js";
import { blocks } from "./commands/blocks.js";
import { add } from "./commands/add.js";
import { migrate } from "./commands/migrate.js";
import { ai } from "./commands/ai.js";

const HELP = `
Lark CLI - Component registry and blocks distribution

BLOCKS:
  lark-ui init            Initialize lark-ui.json configuration file
  lark-ui blocks          List all available blocks for CLI installation
  lark-ui add <block>     Install a block to your project

COMPONENT REGISTRY:
  lark-ui ls              List all Lark components with categories
  lark-ui doc <name>      Get detailed documentation for a component
  lark-ui docs            Get documentation for all components

MIGRATION:
  lark-ui migrate         Export token rename map for codebase migration
  lark-ui migrate --classes  Show class-level rename mappings
  lark-ui migrate --help     Show migration help

AI:
  lark-ui ai              Print the AI usage guide (component API reference)

GENERAL:
  lark-ui help            Show this help message

Examples:
  lark-ui init
  lark-ui blocks
  lark-ui add PageHeader
  lark-ui ls
  lark-ui doc Button
  lark-ui docs
  lark-ui migrate --json
`;

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0]?.toLowerCase();

  switch (command) {
    case "init":
      // Initialize lark-ui.json configuration
      await init();
      break;

    case "blocks":
      // List available blocks
      blocks();
      break;

    case "add":
      // Add a block to the project
      await add(args[1]);
      break;

    case "ls":
      // List components
      ls();
      break;

    case "doc":
    case "docs":
      // If no component name, show all docs; otherwise show specific component
      doc(args[1]);
      break;

    case "migrate":
      // Export token rename map for migration
      migrate(args.slice(1));
      break;

    case "ai":
      // Print AI usage guide
      ai();
      break;

    case "help":
    case "--help":
    case "-h":
    case undefined:
      console.log(HELP.trim());
      break;

    default:
      console.error(`Unknown command: ${command}`);
      console.log(HELP.trim());
      process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
