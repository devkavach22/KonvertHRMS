// src/CommonComponent/DataTable/DatatableKHR.tsx
import React, { useState, useMemo } from "react";
import Table from "../../core/common/dataTable"; // Adjust path to your base Table

interface GenericTableProps<T> {
  data: T[];
  columns: any[];
  title?: string;
  showStatusFilter?: boolean;
  showSortFilter?: boolean;
  selection?: boolean;
  // Dynamic Keys
  statusKey?: keyof T;
  dateKey?: keyof T; // Key for "Recently Added" sort
  textKey?: keyof T; // Key for "Ascending/Descending" sort
}

const DatatableKHR = <T extends object>({
  data,
  columns,
  title = "List",
  showStatusFilter = true,
  showSortFilter = true,
  selection = true,
  statusKey = "Status" as keyof T,
  dateKey = "Created_Date" as keyof T, // Default date field
  textKey = "id" as keyof T, // Default text field
}: GenericTableProps<T>) => {
  const [activeStatus, setActiveStatus] = useState<string>("All");
  const [sortOption, setSortOption] = useState<string>("Newest");

  const processedData = useMemo(() => {
    let filtered = [...data];

    // 1. Filter by Status
    if (showStatusFilter && activeStatus !== "All") {
      filtered = filtered.filter((item) => {
        const itemStatus = String(item[statusKey]);
        return itemStatus.toLowerCase() === activeStatus.toLowerCase();
      });
    }

    // 2. Sort Logic
    if (showSortFilter) {
      if (sortOption === "Newest" && dateKey) {
        // Sort by Date (Newest First)
        filtered.sort(
          (a, b) =>
            new Date(String(b[dateKey])).getTime() -
            new Date(String(a[dateKey])).getTime()
        );
      } else if (sortOption === "Ascending" && textKey) {
        // Sort A-Z
        filtered.sort((a, b) =>
          String(a[textKey]).localeCompare(String(b[textKey]))
        );
      } else if (sortOption === "Descending" && textKey) {
        // Sort Z-A
        filtered.sort((a, b) =>
          String(b[textKey]).localeCompare(String(a[textKey]))
        );
      }
    }

    return filtered;
  }, [
    data,
    activeStatus,
    sortOption,
    showStatusFilter,
    showSortFilter,
    statusKey,
    dateKey,
    textKey,
  ]);

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-end flex-wrap row-gap-3">
        {/* <h5>{title}</h5> */}
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
          {/* Status Filter */}
          {showStatusFilter && (
            <div className="dropdown me-3">
              <button
                type="button"
                className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                <i className="ti ti-file-export me-1" />
                {activeStatus === "All" ? "Status" : activeStatus}
              </button>
              <ul className="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <button
                    onClick={() => setActiveStatus("All")}
                    className="dropdown-item rounded-1"
                  >
                    All
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveStatus("Active")}
                    className="dropdown-item rounded-1"
                  >
                    Active
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveStatus("Inactive")}
                    className="dropdown-item rounded-1"
                  >
                    Inactive
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Sort Filter */}
          {showSortFilter && (
            <div className="dropdown">
              <button
                type="button"
                className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                <i className="ti ti-file-export me-1" />
                Sort By : {sortOption}
              </button>
              <ul className="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <button
                    onClick={() => setSortOption("Newest")}
                    className="dropdown-item rounded-1"
                  >
                    Recently Added
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSortOption("Ascending")}
                    className="dropdown-item rounded-1"
                  >
                    Ascending
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSortOption("Descending")}
                    className="dropdown-item rounded-1"
                  >
                    Descending
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="card-body p-0">
        <Table
          dataSource={processedData}
          columns={columns}
          Selection={selection}
        />
      </div>
    </div>
  );
};

export default DatatableKHR;
