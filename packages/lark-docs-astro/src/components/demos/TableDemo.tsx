import { useState } from "react";
import { Badge, Button, DropdownMenu, LayerCard, Table } from "@lark-ui/core";
import {
  DotsThree,
  EnvelopeSimple,
  Eye,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react";

// Sample data for demos
const emailData = [
  {
    id: "1",
    subject: "Lark v1.0.0 已发布",
    from: "Visal In",
    date: "5 秒前",
  },
  {
    id: "2",
    subject: "新的工作机会",
    from: "Lark",
    date: "10 分钟前",
  },
  {
    id: "3",
    subject: "每日邮件摘要",
    from: "Lark",
    date: "1 小时前",
    tags: ["促销"],
  },
  {
    id: "4",
    subject: "GitLab - 新评论",
    from: "Rob Knecht",
    date: "1 天前",
  },
  {
    id: "5",
    subject: "不在办公室",
    from: "Johnnie Lappen",
    date: "3 天前",
  },
];

export function TableBasicDemo() {
  return (
    <LayerCard className="p-0">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>主题</Table.Head>
            <Table.Head>发件人</Table.Head>
            <Table.Head>日期</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {emailData.slice(0, 3).map((row) => (
            <Table.Row key={row.id}>
              <Table.Cell>{row.subject}</Table.Cell>
              <Table.Cell>{row.from}</Table.Cell>
              <Table.Cell>{row.date}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </LayerCard>
  );
}

export function TableWithCheckboxDemo() {
  const rows = emailData.slice(0, 3);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === rows.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(rows.map((r) => r.id)));
    }
  };

  return (
    <LayerCard className="p-0">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.CheckHead
              checked={selectedIds.size === rows.length}
              indeterminate={
                selectedIds.size > 0 && selectedIds.size < rows.length
              }
              onCheckedChange={toggleAll}
              aria-label="选择所有行"
            />
            <Table.Head>主题</Table.Head>
            <Table.Head>发件人</Table.Head>
            <Table.Head>日期</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row key={row.id}>
              <Table.CheckCell
                checked={selectedIds.has(row.id)}
                onCheckedChange={() => toggleRow(row.id)}
                aria-label={`选择 ${row.subject}`}
              />
              <Table.Cell>{row.subject}</Table.Cell>
              <Table.Cell>{row.from}</Table.Cell>
              <Table.Cell>{row.date}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </LayerCard>
  );
}

export function TableWithCompactHeaderDemo() {
  return (
    <LayerCard className="p-0">
      <Table>
        <Table.Header variant="compact">
          <Table.Row>
            <Table.Head>主题</Table.Head>
            <Table.Head>发件人</Table.Head>
            <Table.Head>日期</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {emailData.slice(0, 3).map((row) => (
            <Table.Row key={row.id}>
              <Table.Cell>{row.subject}</Table.Cell>
              <Table.Cell>{row.from}</Table.Cell>
              <Table.Cell>{row.date}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </LayerCard>
  );
}

export function TableSelectedRowDemo() {
  const rows = emailData.slice(0, 3);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(["2"]));

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === rows.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(rows.map((r) => r.id)));
    }
  };

  return (
    <LayerCard className="p-0">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.CheckHead
              checked={selectedIds.size === rows.length}
              indeterminate={
                selectedIds.size > 0 && selectedIds.size < rows.length
              }
              onCheckedChange={toggleAll}
              aria-label="选择所有行"
            />
            <Table.Head>主题</Table.Head>
            <Table.Head>发件人</Table.Head>
            <Table.Head>日期</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row
              key={row.id}
              variant={selectedIds.has(row.id) ? "selected" : "default"}
            >
              <Table.CheckCell
                checked={selectedIds.has(row.id)}
                onCheckedChange={() => toggleRow(row.id)}
                aria-label={`选择 ${row.subject}`}
              />
              <Table.Cell>{row.subject}</Table.Cell>
              <Table.Cell>{row.from}</Table.Cell>
              <Table.Cell>{row.date}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </LayerCard>
  );
}

export function TableFixedLayoutDemo() {
  return (
    <LayerCard className="p-0">
      <Table layout="fixed">
        <colgroup>
          <col />
          <col className="w-[150px]" />
          <col className="w-[150px]" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.Head>主题</Table.Head>
            <Table.Head>发件人</Table.Head>
            <Table.Head>日期</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {emailData.map((row) => (
            <Table.Row key={row.id}>
              <Table.Cell>{row.subject}</Table.Cell>
              <Table.Cell>{row.from}</Table.Cell>
              <Table.Cell>{row.date}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </LayerCard>
  );
}

/**
 * 演示紧凑表头与粘性列的组合。该组合可能导致紧凑表头背景（`bg-lark-elevated`）
 * 与粘性单元格背景（`bg-lark-base`）之间出现视觉不一致。
 */
export function TableCompactStickyDemo() {
  return (
    <LayerCard className="w-full max-w-md overflow-x-auto p-0">
      <Table>
        <Table.Header variant="compact">
          <Table.Row>
            <Table.Head>主题</Table.Head>
            <Table.Head>发件人</Table.Head>
            <Table.Head>日期</Table.Head>
            <Table.Head>标签</Table.Head>
            <Table.Head sticky="right">
              <span className="sr-only">操作</span>
            </Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {emailData.map((row) => (
            <Table.Row key={row.id}>
              <Table.Cell className="whitespace-nowrap">
                {row.subject}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap">{row.from}</Table.Cell>
              <Table.Cell className="whitespace-nowrap">{row.date}</Table.Cell>
              <Table.Cell className="whitespace-nowrap">
                {row.tags ? (
                  <div className="inline-flex gap-1">
                    {row.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                ) : (
                  "—"
                )}
              </Table.Cell>
              <Table.Cell sticky="right" className="text-right">
                <DropdownMenu>
                  <DropdownMenu.Trigger
                    render={
                      <Button
                        variant="ghost"
                        size="sm"
                        shape="square"
                        aria-label="更多选项"
                      >
                        <DotsThree weight="bold" size={16} />
                      </Button>
                    }
                  />
                  <DropdownMenu.Content>
                    <DropdownMenu.Item icon={Eye}>查看</DropdownMenu.Item>
                    <DropdownMenu.Item icon={PencilSimple}>
                      编辑
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item icon={Trash} variant="danger">
                      删除
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </LayerCard>
  );
}

/**
 * 演示固定在右侧的操作列，表格横向滚动时该列保持不动。
 * 在 `Table.Head` 和 `Table.Cell` 上使用 `sticky="right"`——渐变淡出和不透明背景
 * 会自动应用。
 */
export function TableStickyColumnDemo() {
  return (
    <LayerCard className="w-full max-w-md overflow-x-auto p-0">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>主题</Table.Head>
            <Table.Head>发件人</Table.Head>
            <Table.Head>日期</Table.Head>
            <Table.Head>标签</Table.Head>
            <Table.Head sticky="right">
              <span className="sr-only">操作</span>
            </Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {emailData.map((row) => (
            <Table.Row key={row.id}>
              <Table.Cell className="whitespace-nowrap">
                {row.subject}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap">{row.from}</Table.Cell>
              <Table.Cell className="whitespace-nowrap">{row.date}</Table.Cell>
              <Table.Cell className="whitespace-nowrap">
                {row.tags ? (
                  <div className="inline-flex gap-1">
                    {row.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                ) : (
                  "—"
                )}
              </Table.Cell>
              <Table.Cell sticky="right" className="text-right">
                <DropdownMenu>
                  <DropdownMenu.Trigger
                    render={
                      <Button
                        variant="ghost"
                        size="sm"
                        shape="square"
                        aria-label="更多选项"
                      >
                        <DotsThree weight="bold" size={16} />
                      </Button>
                    }
                  />
                  <DropdownMenu.Content>
                    <DropdownMenu.Item icon={Eye}>查看</DropdownMenu.Item>
                    <DropdownMenu.Item icon={PencilSimple}>
                      编辑
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item icon={Trash} variant="danger">
                      删除
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </LayerCard>
  );
}

export function TableFullDemo() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(["2"]));

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === emailData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(emailData.map((r) => r.id)));
    }
  };

  return (
    <LayerCard className="w-full overflow-x-auto p-0">
      <Table layout="fixed">
        <colgroup>
          <col />{" "}
          {/* Checkbox column - width handled by Table.CheckHead/CheckCell */}
          <col />
          <col style={{ width: "150px" }} />
          <col style={{ width: "120px" }} />
          <col style={{ width: "50px" }} />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.CheckHead
              checked={selectedIds.size === emailData.length}
              indeterminate={
                selectedIds.size > 0 && selectedIds.size < emailData.length
              }
              onCheckedChange={toggleAll}
              aria-label="选择所有行"
            />
            <Table.Head>主题</Table.Head>
            <Table.Head>发件人</Table.Head>
            <Table.Head>日期</Table.Head>
            <Table.Head></Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {emailData.map((row) => (
            <Table.Row
              key={row.id}
              variant={selectedIds.has(row.id) ? "selected" : "default"}
            >
              <Table.CheckCell
                checked={selectedIds.has(row.id)}
                onCheckedChange={() => toggleRow(row.id)}
                aria-label={`选择 ${row.subject}`}
              />
              <Table.Cell>
                <div className="flex items-center gap-2">
                  <EnvelopeSimple size={16} />
                  <span className="truncate">{row.subject}</span>
                  {row.tags && (
                    <div className="ml-2 inline-flex gap-1">
                      {row.tags.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Table.Cell>
              <Table.Cell>
                <span className="truncate">{row.from}</span>
              </Table.Cell>
              <Table.Cell>
                <span className="truncate">{row.date}</span>
              </Table.Cell>
              <Table.Cell className="text-right">
                <DropdownMenu>
                  <DropdownMenu.Trigger
                    render={
                      <Button
                        variant="ghost"
                        size="sm"
                        shape="square"
                        aria-label="更多选项"
                      >
                        <DotsThree weight="bold" size={16} />
                      </Button>
                    }
                  />
                  <DropdownMenu.Content>
                    <DropdownMenu.Item icon={Eye}>查看</DropdownMenu.Item>
                    <DropdownMenu.Item icon={PencilSimple}>
                      编辑
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item icon={Trash} variant="danger">
                      删除
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </LayerCard>
  );
}
