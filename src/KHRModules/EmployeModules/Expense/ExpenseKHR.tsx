import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditExpenseKHRModal from "./AddEditExpenseKHRModal";
import moment from "moment";
import { getExpenses, deleteExpense } from "./ExpenseKHRService";

const ExpenseKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading State

  const [selectedExpense, setSelectedExpense] = useState<any | null>(null);
  const [previewFile, setPreviewFile] = useState<{
    src: string;
    type: string;
    name: string;
  } | null>(null);

  // --- Fetch Data ---
  const fetchData = async () => {
    setLoading(true); // 1. Start Loading
    try {
      const result: any = await getExpenses();
      const list = Array.isArray(result.data?.data)
        ? result.data.data
        : Array.isArray(result.data)
          ? result.data
          : [];

      const mappedData = list.map((item: any, index: number) => ({
        ...item,
        key: String(item.id || index),
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load expenses", error);
    } finally {
      setLoading(false); // 2. Stop Loading (Success or Error)
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(id);
        fetchData();
      } catch (error) {
        alert("Failed to delete expense");
      }
    }
  };

  // ... (Your handlePreview, closePreview, base64ToBlob functions remain the same) ...
  const base64ToBlob = (base64: string, mimeType: string) => {
    try {
      const byteCharacters = atob(base64.split(",")[1] || base64);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      return new Blob(byteArrays, { type: mimeType });
    } catch (e) {
      return null;
    }
  };

  const handlePreview = (file: any) => {
    let rawBase64 = file.base64 || "";
    if (!rawBase64 || rawBase64 === "Base URL " || rawBase64.length < 50) {
      alert("No valid file data found.");
      return;
    }
    const isPdf = file.mimetype === "application/pdf";
    let finalSrc = "";

    if (isPdf) {
      const blob = base64ToBlob(rawBase64, "application/pdf");
      if (blob) finalSrc = URL.createObjectURL(blob);
      else return;
    } else {
      finalSrc = rawBase64.startsWith("data:")
        ? rawBase64
        : `data:${file.mimetype};base64,${rawBase64}`;
    }

    setPreviewFile({ src: finalSrc, type: file.mimetype, name: file.name });

    // Open Modal logic...
    const modal = document.getElementById("preview_modal");
    if (modal) {
      modal.classList.add("show");
      modal.style.display = "block";
      document.body.classList.add("modal-open");
      if (!document.getElementById("preview_backdrop")) {
        const backdrop = document.createElement("div");
        backdrop.className = "modal-backdrop fade show";
        backdrop.id = "preview_backdrop";
        document.body.appendChild(backdrop);
      }
    }
  };

  const closePreview = () => {
    if (
      previewFile?.type === "application/pdf" &&
      previewFile.src.startsWith("blob:")
    ) {
      URL.revokeObjectURL(previewFile.src);
    }
    setPreviewFile(null);
    const modal = document.getElementById("preview_modal");
    if (modal) {
      modal.classList.remove("show");
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
      const backdrop = document.getElementById("preview_backdrop");
      if (backdrop) backdrop.remove();
    }
  };

  // ... (Your Columns remain the same) ...
  const columns: any[] = [
    {
      title: "Date",
      dataIndex: "date",
      render: (val: any) => (
        <span>{val ? moment(val).format("YYYY-MM-DD") : "-"}</span>
      ),
      sorter: (a: any, b: any) =>
        moment(a.date).valueOf() - moment(b.date).valueOf(),
    },
    {
      title: "Description",
      dataIndex: "name",
      render: (val: any) => (
        <span className="fw-medium text-dark">{val || "-"}</span>
      ),
    },
    {
      title: "Product",
      dataIndex: "product_id",
      render: (val: any) => {
        if (Array.isArray(val) && val.length > 1) {
          const rawName = val[1];
          const cleanName =
            typeof rawName === "string"
              ? rawName.replace(/^\[.*?\]\s*/, "")
              : rawName;
          return <span>{cleanName}</span>;
        }
        return <span>-</span>;
      },
    },
    {
      title: "Paid By",
      dataIndex: "payment_mode",
      render: (val: string) => (
        <span
          className={`badge ${val === "own_account" ? "bg-soft-info text-info" : "bg-soft-primary text-primary"}`}
        >
          {val === "own_account" ? "Employee" : "Company"}
        </span>
      ),
    },
    {
      title: "Total",
      dataIndex: "total_amount",
      render: (val: any) => <span className="fw-bold text-dark">₹ {val}</span>,
      sorter: (a: any, b: any) =>
        Number(a.total_amount) - Number(b.total_amount),
    },
    {
      title: "Receipts",
      dataIndex: "attachment_ids",
      render: (attachments: any[]) => {
        if (!attachments || attachments.length === 0)
          return <span className="text-muted">-</span>;
        return (
          <div className="d-flex align-items-center gap-2">
            {attachments.map((file: any, index: number) => {
              const isImage =
                file.mimetype && file.mimetype.startsWith("image/");
              const isPdf = file.mimetype === "application/pdf";
              let iconClass = "ti-file text-secondary";
              if (isImage) iconClass = "ti-photo text-primary";
              if (isPdf) iconClass = "ti-file-type-pdf text-danger";
              return (
                <div
                  key={index}
                  className="cursor-pointer d-flex align-items-center justify-content-center border rounded bg-white shadow-sm"
                  onClick={() => handlePreview(file)}
                  title={`View ${file.name}`}
                  style={{
                    cursor: "pointer",
                    width: "32px",
                    height: "32px",
                    transition: "all 0.2s",
                  }}
                >
                  <i className={`ti ${iconClass} fs-18`} />
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "state",
      render: (val: any) => {
        const status = val
          ? val.charAt(0).toUpperCase() + val.slice(1)
          : "Draft";
        let badgeClass = "bg-light text-dark border";
        if (val === "submitted") badgeClass = "bg-soft-warning text-warning";
        if (val === "approved") badgeClass = "bg-soft-success text-success";
        if (val === "refused") badgeClass = "bg-soft-danger text-danger";
        if (val === "reported") badgeClass = "bg-soft-info text-info";
        return <span className={`badge ${badgeClass}`}>{status}</span>;
      },
    },
    // {
    //   title: "Actions",
    //   dataIndex: "id",
    //   render: (_: any, record: any) => (
    //     <div className="action-icon d-inline-flex">
    //       <Link
    //         to="#"
    //         className="me-2"
    //         data-bs-toggle="modal"
    //         data-bs-target="#add_expense_modal"
    //         onClick={() => setSelectedExpense(record)}
    //       >
    //         <i className="ti ti-edit text-blue" />
    //       </Link>
    //       <Link to="#" onClick={() => handleDelete(record.id)}>
    //         <i className="ti ti-trash text-danger" />
    //       </Link>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">
          <div onClick={() => setSelectedExpense(null)}>
            <CommonHeader
              title="My Expenses"
              parentMenu="Expenses"
              activeMenu="My Expenses"
              routes={routes}
              buttonText="Create Expense"
              modalTarget="#add_expense_modal"
            />
          </div>

          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title mb-3">Expense List</h5>

              {/* --- LOADER LOGIC ADDED HERE --- */}
              {loading ? (
                <div className="d-flex flex-column align-items-center justify-content-center p-5">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                    style={{ width: "3rem", height: "3rem" }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted fw-medium">
                    Loading Expenses...
                  </p>
                </div>
              ) : (
                <DatatableKHR columns={columns} data={data} />
              )}
              {/* ------------------------------- */}
            </div>
          </div>
        </div>
      </div>

      <AddEditExpenseKHRModal
        onSuccess={fetchData}
        data={selectedExpense}
        onClose={() => setSelectedExpense(null)}
      />

      {/* Preview Modal (Same as before) */}
      <div
        className="modal fade"
        id="preview_modal"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
        style={{ zIndex: 1060 }}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: "500px" }}
        >
          <div
            className="modal-content shadow-lg border-0"
            style={{ height: "80vh", display: "flex", flexDirection: "column" }}
          >
            <div className="modal-header border-bottom bg-light py-2">
              <h5
                className="modal-title fs-15 fw-bold text-dark text-truncate"
                style={{ maxWidth: "90%" }}
              >
                <i className="ti ti-eye me-2 text-primary"></i>{" "}
                {previewFile?.name || "Preview"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closePreview}
                aria-label="Close"
              ></button>
            </div>
            <div
              className="modal-body p-0 bg-light d-flex align-items-center justify-content-center"
              style={{ flex: 1, overflow: "hidden" }}
            >
              {previewFile ? (
                previewFile.type.startsWith("image/") ? (
                  <img
                    src={previewFile.src}
                    alt="Preview"
                    className="img-fluid"
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <embed
                    src={previewFile.src}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                  />
                )
              ) : (
                <div className="text-muted">Loading preview...</div>
              )}
            </div>
            <div className="modal-footer py-2 px-3 border-top-0 justify-content-center bg-white">
              <a
                href={previewFile?.src}
                download={previewFile?.name}
                className="btn btn-primary btn-sm w-100"
              >
                <i className="ti ti-download me-1"></i> Download File
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseKHR;
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { all_routes } from "../../../router/all_routes";
// import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
// import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
// import AddEditExpenseKHRModal from "./AddEditExpenseKHRModal";
// import moment from "moment";
// import { getExpenses, deleteExpense } from "./ExpenseKHRService";

// const ExpenseKHR = () => {
//   const routes = all_routes;
//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [selectedExpense, setSelectedExpense] = useState<any | null>(null);

//   // --- Fetch Data ---
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const result = await getExpenses();

//       // Handle the data structure based on your JSON response
//       const list = Array.isArray(result.data?.data)
//         ? result.data.data
//         : Array.isArray(result.data)
//         ? result.data
//         : [];

//       const mappedData = list.map((item: any, index: number) => ({
//         ...item,
//         key: item.id || index,
//       }));

//       setData(mappedData);
//     } catch (error) {
//       console.error("Failed to load expenses", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // --- Delete Handler ---
//   const handleDelete = async (id: string | number) => {
//     if (window.confirm("Are you sure you want to delete this expense?")) {
//       try {
//         await deleteExpense(id);
//         fetchData();
//       } catch (error) {
//         console.error("Error deleting expense", error);
//         alert("Failed to delete expense");
//       }
//     }
//   };

//   // --- Modal Helper ---
//   const openModal = (record: any | null) => {
//     setSelectedExpense(record);
//     const jq = (window as any).jQuery || (window as any).$;
//     if (jq && typeof jq === "function") {
//       try {
//         jq("#add_expense_modal").modal("show");
//       } catch (e) {
//         // ignore
//       }
//     }
//   };

//   // --- FIXED COLUMNS ---
//   const columns: any[] = [
//     {
//       title: "Date",
//       dataIndex: "date",
//       render: (val: any) => (
//         <span>{val ? moment(val).format("YYYY-MM-DD") : "-"}</span>
//       ),
//       sorter: (a: any, b: any) =>
//         moment(a.date).valueOf() - moment(b.date).valueOf(),
//     },
//     {
//       title: "Description",
//       dataIndex: "name",
//       render: (val: any) => <span className="fw-medium">{val || "-"}</span>,
//       sorter: (a: any, b: any) =>
//         String(a.name || "").localeCompare(String(b.name || "")),
//     },
//     {
//       title: "Product", // Renamed from Product ID for clarity
//       dataIndex: "product_id",
//       // FIX 1: Handle Array data [id, "Name"]
//       render: (val: any) => {
//         if (Array.isArray(val) && val.length > 1) {
//           return <span>{val[1]}</span>;
//         }
//         return <span>-</span>;
//       },
//     },
//     {
//       title: "Paid By",
//       dataIndex: "payment_mode",
//       render: (val: string) => (
//         <span
//           className={`badge ${
//             val === "own_account" ? "bg-info" : "bg-primary"
//           }`}
//         >
//           {val === "own_account" ? "Employee" : "Company"}
//         </span>
//       ),
//     },
//     {
//       title: "Total",
//       dataIndex: "total_amount_currency",
//       render: (val: any) => <span className="fw-bold">₹ {val}</span>,
//       sorter: (a: any, b: any) =>
//         Number(a.total_amount_currency) - Number(b.total_amount_currency),
//     },
//     {
//       title: "Status",
//       // FIX 2: Changed 'status' to 'state' to match API response
//       dataIndex: "state",
//       render: (val: any) => {
//         // Optional: Capitalize the first letter
//         const displayStatus = val
//           ? val.charAt(0).toUpperCase() + val.slice(1)
//           : "Draft";
//         return (
//           <span className="badge bg-light text-dark border">
//             {displayStatus}
//           </span>
//         );
//       },
//     },
//     {
//       title: "Actions",
//       dataIndex: "id",
//       render: (_: any, record: any) => (
//         <div className="action-icon d-inline-flex">
//           <Link to="#" className="me-2" onClick={() => openModal(record)}>
//             <i className="ti ti-edit text-blue" />
//           </Link>
//           <Link to="#" onClick={() => handleDelete(record.id)}>
//             <i className="ti ti-trash text-danger" />
//           </Link>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="main-wrapper">
//       <div className="page-wrapper">
//         <div className="content">
//           <div onClick={() => setSelectedExpense(null)}>
//             <CommonHeader
//               title="My Expenses"
//               parentMenu="Expenses"
//               activeMenu="My Expenses"
//               routes={routes}
//               buttonText="Create Expenses"
//               modalTarget="#add_expense_modal"
//             />
//           </div>

//           <div className="card mb-3">
//             <div className="card-body">
//               <h5 className="card-title">Expense List</h5>
//               <div className="mt-3">
//                 <DatatableKHR columns={columns} data={data} />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <AddEditExpenseKHRModal onSuccess={fetchData} data={selectedExpense} />
//     </div>
//   );
// };

// export default ExpenseKHR;
