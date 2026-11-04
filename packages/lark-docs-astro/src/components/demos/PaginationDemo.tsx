import { useState } from "react";
import { Pagination } from "@lark-ui/core";

export function PaginationBasicDemo() {
  const [page, setPage] = useState(1);

  return (
    <Pagination page={page} setPage={setPage} perPage={10} totalCount={100} />
  );
}

export function PaginationSimpleDemo() {
  const [page, setPage] = useState(1);

  return (
    <Pagination
      page={page}
      setPage={setPage}
      perPage={10}
      totalCount={100}
      controls="simple"
    />
  );
}

/** 分页（Pagination）适用于只告知是否还有下一页、但不返回总数的 API。 */
export function PaginationUnknownTotalDemo() {
  const [page, setPage] = useState(1);
  const hasNextPage = page < 3;

  return (
    <Pagination
      text={() => `第 ${page} 页`}
      page={page}
      setPage={setPage}
      hasNextPage={hasNextPage}
    />
  );
}

export function PaginationFullDemo() {
  const [page, setPage] = useState(1);

  return (
    <Pagination
      page={page}
      setPage={setPage}
      perPage={10}
      totalCount={100}
      controls="full"
    />
  );
}

export function PaginationMidPageDemo() {
  const [page, setPage] = useState(5);

  return (
    <Pagination page={page} setPage={setPage} perPage={10} totalCount={100} />
  );
}

/** 结果集为空时渲染单个空页面，并禁用翻页导航。 */
export function PaginationEmptyDemo() {
  const [page, setPage] = useState(1);

  return (
    <Pagination page={page} setPage={setPage} perPage={10} totalCount={0} />
  );
}

export function PaginationLargeDatasetDemo() {
  const [page, setPage] = useState(1);

  return (
    <Pagination page={page} setPage={setPage} perPage={25} totalCount={1250} />
  );
}

export function PaginationCustomTextDemo() {
  const [page, setPage] = useState(1);
  return (
    <Pagination
      text={({ perPage }: { perPage?: number }) =>
        `第 ${page} 页 - 每页显示 ${perPage} 条`
      }
      page={page}
      setPage={setPage}
      perPage={25}
      totalCount={100}
    />
  );
}

/** 使用复合组件实现每页条数选择器的分页。 */
export function PaginationPageSizeSelectorDemo() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);

  return (
    <Pagination
      page={page}
      setPage={setPage}
      perPage={perPage}
      totalCount={500}
    >
      <Pagination.Info />
      <Pagination.Separator />
      <Pagination.PageSize
        value={perPage}
        onChange={(size) => {
          setPerPage(size);
          setPage(1);
        }}
      />
      <Pagination.Controls />
    </Pagination>
  );
}

/** 使用复合组件实现自定义每页条数选项的分页。 */
export function PaginationCustomPageSizeOptionsDemo() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  return (
    <Pagination
      page={page}
      setPage={setPage}
      perPage={perPage}
      totalCount={200}
    >
      <Pagination.Info />
      <Pagination.Separator />
      <Pagination.PageSize
        value={perPage}
        onChange={(size) => {
          setPerPage(size);
          setPage(1);
        }}
        options={[10, 20, 50]}
      />
      <Pagination.Controls />
    </Pagination>
  );
}

/** 使用复合组件实现自定义信息文案的分页。 */
export function PaginationCompoundCustomInfoDemo() {
  const [page, setPage] = useState(1);

  return (
    <Pagination page={page} setPage={setPage} perPage={25} totalCount={100}>
      <Pagination.Info>
        {({ page, totalCount }) =>
          `第 ${page} 页，共 ${Math.ceil((totalCount ?? 1) / 25)} 页`
        }
      </Pagination.Info>
      <Pagination.Controls />
    </Pagination>
  );
}

/** 使用下拉选择器而非文本输入框翻页的分页。 */
export function PaginationDropdownSelectorDemo() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);

  return (
    <Pagination
      page={page}
      setPage={setPage}
      perPage={perPage}
      totalCount={500}
    >
      <Pagination.Info />
      <Pagination.Separator />
      <Pagination.PageSize
        value={perPage}
        onChange={(size) => {
          setPerPage(size);
          setPage(1);
        }}
      />
      <Pagination.Controls pageSelector="dropdown" />
    </Pagination>
  );
}

/** 每页条数选择器位于右侧的分页。 */
export function PaginationPageSizeRightDemo() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);

  return (
    <Pagination
      page={page}
      setPage={setPage}
      perPage={perPage}
      totalCount={500}
    >
      <Pagination.Info />
      <div className="flex items-center gap-2">
        <Pagination.Controls />
        <Pagination.Separator />
        <Pagination.PageSize
          value={perPage}
          onChange={(size) => {
            setPerPage(size);
            setPage(1);
          }}
        />
      </div>
    </Pagination>
  );
}

/** 支持自定义文案以实现国际化的分页。 */
export function PaginationI18nDemo() {
  const [page, setPage] = useState(1);

  return (
    <Pagination
      page={page}
      setPage={setPage}
      perPage={10}
      totalCount={100}
      labels={{
        firstPage: "首页",
        previousPage: "上一页",
        nextPage: "下一页",
        lastPage: "末页",
        pageNumber: "页码",
        pageSize: "每页条数",
      }}
    >
      <Pagination.Info>
        {({ pageShowingRange, totalCount }) => (
          <>
            显示 <span className="tabular-nums">{pageShowingRange}</span> 条，共{" "}
            <span className="tabular-nums">{totalCount}</span> 条
          </>
        )}
      </Pagination.Info>
      <Pagination.Controls />
    </Pagination>
  );
}
