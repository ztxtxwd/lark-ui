import { Button, cn, LayerCard, Text } from "@lark-ui/core";
import { motion } from "motion/react";
import { useState } from "react";

interface CollapseSizeExampleProps {
  preserveContentSize?: boolean;
}

export function CollapseSizeExample({
  preserveContentSize = false,
}: CollapseSizeExampleProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className={cn("grid w-full gap-4")}>
      <Button
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        variant="secondary"
      >
        {open ? "收起" : "展开"}
      </Button>
      <motion.div
        animate={{ width: open ? 256 : 0 }}
        className={cn("overflow-hidden rounded-lg ring ring-lark-line")}
        initial={false}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <LayerCard
          className={cn(
            "grid gap-1 p-4 ring-0",
            preserveContentSize ? "w-64" : "w-full min-w-0",
          )}
        >
          <Text as="h3" variant="heading">
            Web Analytics
          </Text>
          <Text variant="secondary">无需改动代码即可衡量流量。</Text>
        </LayerCard>
      </motion.div>
    </div>
  );
}
