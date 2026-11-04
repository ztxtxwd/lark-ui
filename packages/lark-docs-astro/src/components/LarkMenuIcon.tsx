import { LarkLogo } from "@lark-ui/core";
import { cn } from "@lark-ui/core";

interface LarkMenuIconProps {
  className?: string;
}

/** Brand mark used in the docs header and mobile menu trigger. */
export function LarkMenuIcon({ className }: LarkMenuIconProps) {
  return <LarkLogo className={cn("size-5", className)} label="Lark" />;
}
