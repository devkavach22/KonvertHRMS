import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Pagination from "./Pagination";
import MultiStepForm from "../employeeform/MultiStepForm";

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface ReusableDataTableProps {
  title: string;
  description?: string;
  columns: Column[];
  fetchDataHook: (
    limit: number,
    offset: number,
    search: string
  ) => { data: any[]; total: number; loading: boolean };
  rowKey?: string;
  placeholder?: string;
  rowsPerPageOptions?: number[];
}

const ReusableDataTable: React.FC<ReusableDataTableProps> = ({
  title,
  description = "Manage and view your data efficiently",
  columns,
  fetchDataHook,
  rowKey = "id",
  placeholder = "Search...",
  rowsPerPageOptions = [10, 25, 50, 100],
}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(rowsPerPageOptions[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, total, loading } = fetchDataHook(
    limit,
    (page - 1) * limit,
    debouncedSearch
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="text-center p-5">
        <div
          className="spinner-border"
          role="status"
          style={{
            width: "3rem",
            height: "3rem",
            color: "#ff6600",
            borderWidth: "4px",
          }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p
          className="mt-3"
          style={{ color: "#6c757d", fontSize: "1rem", fontWeight: "500" }}
        >
          Loading data...
        </p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f8f8faff", minHeight: "100vh", padding: "2rem 1rem" }}>
      <div className="content container-fluid">
        <div className="page-header mb-4">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="mb-1" style={{ fontSize: "1.75rem", fontWeight: "700", color: "#212529" }}>
                {title}
              </h3>
              <p style={{ color: "#6c757d", fontSize: "0.875rem", marginBottom: "0" }}>
                {description}
              </p>
            </div>
            <div className="col-auto">
              <button
                onClick={() => setIsModalOpen(true)}
                style={{
                  padding: "10px 24px",
                  backgroundColor: "#ff6b35",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(255, 107, 53, 0.3)",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#ff5722")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ff6b35")}
              >
                + Add Employee
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <div
              className="card"
              style={{
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                overflow: "hidden",
              }}
            >
              <div
                className="card-header"
                style={{
                  backgroundColor: "#fff",
                  borderBottom: "2px solid #f1f3f5",
                  padding: "1.5rem",
                }}
              >
                <h4 className="mb-1" style={{ color: "#CD5C5C", fontSize: "1.25rem", fontWeight: "700" }}>
                  {title}
                </h4>
                <p style={{ color: "#6c757d", fontSize: "0.875rem", marginBottom: "0" }}>
                  {description}
                </p>
              </div>

              <div className="card-body" style={{ padding: "1.5rem" }}>
                <div className="row mb-4 align-items-center">
                  <div className="col-sm-6 d-flex align-items-center">
                    <label
                      className="me-2 mb-0"
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#495057",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Rows Per Page
                    </label>
                    <select
                      className="form-select form-select-sm"
                      style={{
                        width: "auto",
                        borderRadius: "6px",
                        border: "1px solid #dee2e6",
                        padding: "6px 30px 6px 12px",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#495057",
                      }}
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                      }}
                    >
                      {rowsPerPageOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <span className="ms-2" style={{ fontSize: "0.875rem", color: "#6c757d" }}>
                      Entries
                    </span>
                  </div>

                  <div className="col-sm-6 d-flex justify-content-end">
                    <div style={{ position: "relative", width: "240px" }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={placeholder}
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #dee2e6",
                          padding: "8px 40px 8px 16px",
                          fontSize: "0.875rem",
                          transition: "all 0.2s ease",
                        }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <svg
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#adb5bd",
                          pointerEvents: "none",
                        }}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="table-responsive" style={{ borderRadius: "8px", overflow: "hidden" }}>
                  <table className="table table-hover align-middle mb-0" style={{ border: "1px solid #e9ecef" }}>
                    <thead style={{ backgroundColor: "#f8f9fa" }}>
                      <tr>
                        {columns.map((col) => (
                          <th
                            key={col.key}
                            style={{
                              borderBottom: "2px solid #dee2e6",
                              padding: "14px 16px",
                              fontWeight: "600",
                              fontSize: "0.875rem",
                              color: "#495057",
                            }}
                          >
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.length > 0 ? (
                        data.map((row: any, i: number) => (
                          <tr key={row[rowKey] || i}>
                            {columns.map((col) => (
                              <td key={col.key} style={{ padding: "14px 16px" }}>
                                {col.render ? col.render(row) : row[col.key] ?? "N/A"}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={columns.length} className="text-center py-5" style={{ color: "#6c757d" }}>
                            <p className="m-0">No data available</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {total > 0 && (
                  <Pagination total={total} limit={limit} currentPage={page} onPageChange={setPage} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {/* Modal */}
{isModalOpen && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      overflow: "hidden",
    }}
    onClick={() => setIsModalOpen(false)}
  >
    <div
      style={{
        width: "65%",
        maxWidth: "800px",
        maxHeight: "92vh",
        backgroundColor: "#fff", // pure white modal bg
        borderRadius: "12px",
        position: "relative",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
        overflow: "hidden",
        margin: "0 auto",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setIsModalOpen(false)}
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          border: "none",
          borderRadius: "50%",
          width: "36px",
          height: "36px",
          cursor: "pointer",
          fontSize: "20px",
          fontWeight: "bold",
          color: "#666",
          background: "#fff", // ensure button bg is white
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10001,
          transition: "all 0.2s",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "#f1f1f1";
          e.currentTarget.style.color = "#333";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "#fff";
          e.currentTarget.style.color = "#666";
        }}
      >
        ×
      </button>

      {/* ✅ Fix: Ensure background stays pure white & scrollbar hidden */}
      <div
        style={{
          maxHeight: "92vh",
          overflowY: "scroll",
          backgroundColor: "#fff",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
<MultiStepForm onCloseModal={() => setIsModalOpen(false)} />
      </div>
    </div>
  </div>
)}



    </div>
  );
};

export default ReusableDataTable;
