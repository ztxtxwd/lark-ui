import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@lark-ui/core";
import { Text } from "@lark-ui/core";

const GITHUB_COMMIT_URL = "https://github.com/ztxtxwd/lark-ui/commit/";

// Override prose defaults for rendered markdown inside changelog entries.
const proseStyles = cn(
  "lark-prose prose prose-sm max-w-none flex-1",
  "[&>:first-child]:mt-0 [&>:last-child]:mb-0",
  "[&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base",
  "[&_:is(h1,h2,h3)]:font-semibold [&_:is(h1,h2,h3)]:text-lark-default",
  "[&_pre]:overflow-x-auto [&_pre]:text-base",
);

interface ChangelogEntryProps {
  /** Short commit hash, or `null` when the changeset had no hash prefix. */
  hash: string | null;
  text: string;
}

export function ChangelogEntry({ hash, text }: ChangelogEntryProps) {
  return (
    <li className="mb-3 flex flex-col gap-1 last:mb-0 md:mb-0 md:flex-row md:items-baseline md:gap-3.5">
      {hash ? (
        <a
          href={`${GITHUB_COMMIT_URL}${hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs text-lark-subtle transition-colors hover:text-lark-default"
        >
          <Text as="span" variant="mono-secondary">
            {hash}
          </Text>
        </a>
      ) : null}
      <div className={proseStyles}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      </div>
    </li>
  );
}
