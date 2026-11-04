---
"@lark-ui/core": patch
---

Serve the docs from lark-ui.tapeless.eu.org, and restore the `icon` prop to the registry

- The documentation links in the package and the docs site now point at
  `lark-ui.tapeless.eu.org`.
- `Badge.icon` and `Button.icon` are back in the component registry. The
  `Icon | ReactNode` prop type is not representable as a JSON schema, so the
  generator dropped the whole prop; they are now injected through
  `ADDITIONAL_COMPONENT_PROPS` like the other manual overrides. The registry
  cache version was bumped so the change takes effect without `--no-cache`.
- `Banner.theme`'s description no longer names the internal class it was
  modelled on.
