/**
 * Lark CLI configuration utilities
 * Handles reading and writing lark-ui.json config files
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Configuration schema for lark-ui.json
 */
export interface LarkConfig {
  /**
   * Directory where blocks will be installed (relative to project root)
   * @default "src/components/lark"
   */
  blocksDir: string;

  /**
   * Version of the config schema
   * @default "1.0.0"
   */
  version?: string;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Required<LarkConfig> = {
  blocksDir: "src/components/lark",
  version: "1.0.0",
};

/**
 * Read lark-ui.json from the specified directory
 * @param projectRoot - Path to project root (defaults to cwd)
 * @returns Parsed config or null if not found
 */
export function readConfig(
  projectRoot: string = process.cwd(),
): LarkConfig | null {
  const configPath = join(projectRoot, "lark-ui.json");

  if (!existsSync(configPath)) {
    return null;
  }

  try {
    const content = readFileSync(configPath, "utf-8");
    const config = JSON.parse(content) as LarkConfig;

    // Merge with defaults to ensure all fields are present
    return {
      ...DEFAULT_CONFIG,
      ...config,
    };
  } catch (error) {
    throw new Error(
      `Failed to parse lark-ui.json: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    );
  }
}

/**
 * Write lark-ui.json to the specified directory
 * @param config - Configuration to write
 * @param projectRoot - Path to project root (defaults to cwd)
 */
export function writeConfig(
  config: LarkConfig,
  projectRoot: string = process.cwd(),
): void {
  const configPath = join(projectRoot, "lark-ui.json");

  // Merge with defaults
  const fullConfig: Required<LarkConfig> = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  try {
    const content = JSON.stringify(fullConfig, null, 2) + "\n";
    writeFileSync(configPath, content, "utf-8");
  } catch (error) {
    throw new Error(
      `Failed to write lark-ui.json: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    );
  }
}

/**
 * Check if lark-ui.json exists in the specified directory
 * @param projectRoot - Path to project root (defaults to cwd)
 * @returns true if lark-ui.json exists
 */
export function configExists(projectRoot: string = process.cwd()): boolean {
  const configPath = join(projectRoot, "lark-ui.json");
  return existsSync(configPath);
}
