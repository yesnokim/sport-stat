import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  flexRender,
} from "@tanstack/react-table";
import ss from "./BaseTable.module.scss";

const BaseTable = ({
  columns = [],
  data = [],
  getRowCanExpand = () => false,
  renderSubComponent = () => null,
}) => {
  // 테이블 생성
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10, // 기본 페이지 사이즈 설정
      },
    },
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand,
  });
  // 페이지 수 및 현재 페이지를 가져옴
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  // 페이지 번호를 최대 5개만 보여주도록 하는 함수
  const renderPageNumbers = () => {
    const maxPagesToShow = 5; // 최대 페이지 번호 버튼 수
    const pageNumbers = [];

    // 시작 페이지 번호 계산
    let startPage = Math.max(
      0,
      Math.min(
        currentPage - Math.floor(maxPagesToShow / 2),
        pageCount - maxPagesToShow
      )
    );

    // 끝 페이지 번호 계산
    let endPage = Math.min(
      startPage + maxPagesToShow,
      pageCount
    );

    // 페이지 번호 배열 생성
    for (let i = startPage; i < endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => table.setPageIndex(i)}
          className={
            i === currentPage ? ss.active_page : ""
          }>
          {i + 1}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className={ss.bg}>
      {/* 테이블 렌더링 */}
      <div className={ss.table_box}>
        <table className={ss.base_table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className={ss.table_header}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={ss.table_header_cell}
                    onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted()
                      ? header.column.getIsSorted() ===
                        "desc"
                        ? " 🔽"
                        : " 🔼"
                      : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={ss.table_body}>
            {table.getRowModel().rows.map((row) => (
              <>
                <tr
                  key={row.id}
                  className={ss.table_row}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={ss.table_cell}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
                {row.getIsExpanded() && (
                  <tr>
                    {/* 2nd row is a custom 1 cell row */}
                    <td
                      colSpan={
                        row.getVisibleCells().length
                      }>
                      {renderSubComponent({ row })}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
      {/* 페이징 컨트롤 */}
      <div className={ss.pagination_controls}>
        {/* 이전 5페이지로 이동하는 버튼 */}
        {currentPage > 4 && (
          <button
            onClick={() =>
              table.setPageIndex(
                Math.max(currentPage - 5, 0)
              )
            }>
            {"<<"}
          </button>
        )}
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          {"<"}
        </button>{" "}
        {/* 페이지 번호 표시 */}
        {renderPageNumbers()}
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          {">"}
        </button>
        {/* 다음 5페이지로 이동하는 버튼 */}
        {currentPage < pageCount - 5 && (
          <button
            onClick={() =>
              table.setPageIndex(
                Math.min(currentPage + 5, pageCount - 1)
              )
            }>
            {">>"}
          </button>
        )}{" "}
        <select
          className={ss.page_size_selector}
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}>
          {[5, 10, 20, 50, 100].map((pageSize) => (
            <option
              key={pageSize}
              value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BaseTable;
