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
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedExpense, setSelectedExpense] = useState<any | null>(null);

  // --- Fetch Data ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const result: any = await getExpenses();
      console.log("Expense API Result:", result); // Check this in Browser Console

      let list: any[] = [];

      // Logic to find the array based on your JSON structure
      if (result.data && Array.isArray(result.data.data)) {
        // Case 1: Standard Axios Response -> { data: { status: "success", data: [...] } }
        list = result.data.data;
      } else if (result.data && Array.isArray(result.data)) {
        // Case 2: Interceptor returns body directly -> { status: "success", data: [...] }
        list = result.data;
      } else if (Array.isArray(result)) {
        // Case 3: Result is the array directly
        list = result;
      } else if (result.data?.result && Array.isArray(result.data.result)) {
        // Case 4: Odoo/RPC style sometimes uses 'result'
        list = result.data.result;
      }

      console.log("Extracted List:", list); // Verify this is an array of objects

      const mappedData = list.map((item: any, index: number) => ({
        ...item,
        key: String(item.id || index), // Ensure key is a string
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load expenses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Delete Handler ---
  const handleDelete = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting expense", error);
        alert("Failed to delete expense");
      }
    }
  };

  // --- Modal Helper ---
  const openModal = (record: any | null) => {
    setSelectedExpense(record);
    const jq = (window as any).jQuery || (window as any).$;
    if (jq && typeof jq === "function") {
      try {
        jq("#add_expense_modal").modal("show");
      } catch (e) {
        // ignore
      }
    }
  };

  // --- Columns ---
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
      render: (val: any) => <span className="fw-medium">{val || "-"}</span>,
      sorter: (a: any, b: any) =>
        String(a.name || "").localeCompare(String(b.name || "")),
    },
    {
      title: "Product",
      dataIndex: "product_id",
      // Handle Array data [id, "Name"] from API
      render: (val: any) => {
        if (Array.isArray(val) && val.length > 1) {
          const rawName = val[1];
          // Regex Explanation:
          // ^\[       -> Starts with a '['
          // .*?       -> Matches any content inside (non-greedy)
          // \]        -> Ends with a ']'
          // \s* -> Matches any trailing whitespace after the bracket
          const cleanName =
            typeof rawName === "string"
              ? rawName.replace(/^\[.*?\]\s*/, "")
              : rawName;

          return <span className="text-primary">{cleanName}</span>;
        }
        return <span>{typeof val === "string" ? val : "-"}</span>;
      },
    },
    {
      title: "Paid By",
      dataIndex: "payment_mode",
      render: (val: string) => (
        <span
          className={`badge ${
            val === "own_account" ? "bg-info" : "bg-primary"
          }`}
        >
          {val === "own_account" ? "Employee" : "Company"}
        </span>
      ),
    },
    {
      title: "Total",
      dataIndex: "total_amount",
      render: (val: any) => <span className="fw-bold">₹ {val}</span>,
      sorter: (a: any, b: any) =>
        Number(a.total_amount) - Number(b.total_amount),
    },
    {
      title: "Status",
      dataIndex: "state", // Matches 'state': 'draft' in your JSON
      render: (val: any) => {
        const displayStatus = val
          ? val.charAt(0).toUpperCase() + val.slice(1)
          : "Draft";

        let badgeClass = "bg-light text-dark border";
        if (val === "approved") badgeClass = "bg-success-light text-success";
        if (val === "draft") badgeClass = "bg-warning-light text-warning";

        return <span className={`badge ${badgeClass}`}>{displayStatus}</span>;
      },
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: any) => (
        <div className="action-icon d-inline-flex">
          <Link to="#" className="me-2" onClick={() => openModal(record)}>
            <i className="ti ti-edit text-blue" />
          </Link>
          <Link to="#" onClick={() => handleDelete(record.id)}>
            <i className="ti ti-trash text-danger" />
          </Link>
        </div>
      ),
    },
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
              buttonText="Create Expenses"
              modalTarget="#add_expense_modal"
            />
          </div>

          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Expense List</h5>
              <div className="mt-3">
                <DatatableKHR columns={columns} data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddEditExpenseKHRModal onSuccess={fetchData} data={selectedExpense} />
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
