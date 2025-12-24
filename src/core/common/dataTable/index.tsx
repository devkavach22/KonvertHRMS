// index.tsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Table } from "antd";
import type { DatatableProps } from "../../data/types";

function Datatable<T extends object = object>({
  columns,
  dataSource,
  Selection,
}: DatatableProps<T>) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [Selections, setSelections] = useState<boolean>(true);
  const [filteredDataSource, setFilteredDataSource] = useState<T[]>(dataSource);

  // Memoize the filtered data to prevent recalculation on every render
  const filteredData = useMemo(() => {
    if (!searchText) return dataSource;
    return dataSource.filter((record: T) =>
      Object.values(record).some((field) =>
        String(field).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [dataSource, searchText]);

  // Memoize the row selection configuration
  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: setSelectedRowKeys,
    }),
    [selectedRowKeys]
  );

  // Memoize pagination configuration
  const paginationConfig = useMemo(
    () => ({
      locale: { items_per_page: "" },
      nextIcon: <i className="ti ti-chevron-right" />,
      prevIcon: <i className="ti ti-chevron-left" />,
      defaultPageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "30"],
    }),
    []
  );

  // Memoize pagination config with selection
  const paginationConfigWithSelection = useMemo(
    () => ({
      ...paginationConfig,
      showTotal: (total: number, range: [number, number]) =>
        `Showing ${range[0]} - ${range[1]} of ${total} entries`,
    }),
    [paginationConfig]
  );

  // Debounced search handler
  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
  }, []);

  // Memoize the search input change handler
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleSearch(e.target.value);
    },
    [handleSearch]
  );

  useEffect(() => {
    setSelections(Selection ?? true);
  }, [Selection]);

  // Update filtered data when search text changes
  useEffect(() => {
    setFilteredDataSource(filteredData);
  }, [filteredData]);

  return (
    <>
      <div className="table-top-data">
        <div className="row p-3">
          <div className="col-sm-12 col-md-6">
            <div
              className="dataTables_length"
              id="DataTables_Table_0_length"
            ></div>
          </div>
          <div className="col-sm-12 col-md-6">
            <div
              id="DataTables_Table_0_filter"
              className="dataTables_filter text-end mb-0"
            >
              <label>
                {" "}
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder="Search"
                  aria-controls="DataTables_Table_0"
                  value={searchText}
                  onChange={handleSearchChange}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {!Selections ? (
        <Table
          className="table datanew dataTable no-footer"
          columns={columns}
          rowHoverable={false}
          dataSource={filteredDataSource}
          pagination={paginationConfig}
        />
      ) : (
        <Table
          className="table datanew dataTable no-footer"
          rowSelection={rowSelection}
          columns={columns}
          rowHoverable={false}
          dataSource={filteredDataSource}
          pagination={paginationConfigWithSelection}
        />
      )}
    </>
  );
}

export default React.memo(Datatable) as typeof Datatable;
