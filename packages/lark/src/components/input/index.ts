export { Input, inputVariants, type InputProps } from "./input";
export { InputArea, Textarea, type InputAreaProps } from "./input-area";

// Re-export InputGroup from its new dedicated directory so that the subpath
// `@lark-ui/core/components/input` continues to resolve InputGroup.
export {
  InputGroup,
  LARK_INPUT_GROUP_VARIANTS,
  LARK_INPUT_GROUP_DEFAULT_VARIANTS,
} from "../input-group";

// Backward-compatible type aliases — the old `input-group.tsx` exported these
// names. External consumers importing from `@lark-ui/core/components/input`
// may reference them, so we keep the aliases to avoid breaking type imports.

/**
 * @deprecated `focusMode` is no longer a public prop — it is auto-detected by
 * `InputGroup` based on its children. This type will be removed in a future
 * major version.
 */
export type LarkInputGroupFocusMode = "container" | "individual";

/**
 * @deprecated `focusMode` is no longer a public prop — it is auto-detected by
 * `InputGroup` based on its children. Use `InputGroupRootProps` from
 * `@lark-ui/core` instead. This type will be removed in a future major
 * version.
 */
export interface LarkInputGroupVariantsProps {
  focusMode?: LarkInputGroupFocusMode;
}
