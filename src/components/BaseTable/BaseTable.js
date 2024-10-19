import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import ss from "./BaseTable.module.scss";

const BaseTable = ({ columns = [], data = [] }) => {
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
  });

  // 페이지 번호 리스트 생성 함수
  const pageNumbers = () => {
    const pages = [];
    for (let i = 0; i < table.getPageCount(); i++) {
      pages.push(i);
    }
    return pages;
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
            ))}
          </tbody>
        </table>
      </div>
      {/* 페이징 컨트롤 */}
      <div className={ss.pagination_controls}>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          Previous
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        {/* 페이지 번호 표시 */}
        {pageNumbers().map((pageIndex) => (
          <button
            key={pageIndex}
            onClick={() => table.setPageIndex(pageIndex)}
            disabled={
              pageIndex ===
              table.getState().pagination.pageIndex
            } // 현재 페이지는 비활성화
            className={
              pageIndex ===
              table.getState().pagination.pageIndex
                ? ss.active_page
                : ""
            }>
            {pageIndex + 1}
          </button>
        ))}
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          Next
        </button>{" "}
        <select
          className={ss.page_size_selector}
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}>
          {[10, 20, 50].map((pageSize) => (
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
