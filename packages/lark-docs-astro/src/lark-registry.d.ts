/**
 * Type declarations for virtual:lark-registry module.
 * Provides component registry data from the AI metadata.
 */
declare module "virtual:lark-registry" {
  import type { ComponentRegistry } from "@lark-ui/core";

  /** Component registry markdown content for documentation */
  export const larkRegistryMarkdown: string;

  /** Typed component registry JSON */
  export const larkRegistryJson: ComponentRegistry;
}
