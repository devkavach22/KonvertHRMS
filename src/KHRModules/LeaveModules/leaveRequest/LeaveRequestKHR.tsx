import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditLeaveRequestModal from "./AddEditLeaveRequestModal";
import moment from "moment";
import { getLeaveRequests, deleteLeaveRequest } from "./LeaveRequestServices";

const LeaveRequestKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPolicy, setSelectedPolicy] = useState<any | null>(null);

  // --- 1. STATUS MAPPING (Raw Key -> Display Label) ---
  const STATUS_MAP: { [key: string]: string } = {
    draft: "To Submit",
    confirm: "To Approve",
    refuse: "Refused",
    validate1: "Second Approval",
    validate2: "Admin Approval",
    validate: "Approved",
    cancel: "Cancelled",
  };

  // --- 2. BADGE STYLING HELPER (Updated to your reference) ---
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "validate": // Approved
        return "bg-success-light text-success";

      case "confirm": // To Approve
      case "validate1": // Second Approval
      case "validate2": // Admin Approval
      case "draft": // Draft
        return "bg-warning-light text-warning";

      case "refuse":
      case "cancel":
        return "bg-danger-light text-danger";

      default:
        return "bg-light text-dark border";
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getLeaveRequests();
      const safeResult = Array.isArray(result.data.data)
        ? result.data?.data
        : [];

      // Extract raw data
      const mappedData = safeResult.map((item: any) => ({
        id: item.id,
        employee_name: item.employee_name || item.employee_id,
        company_name: item.company_name || item.company_id,
        department_name: item.department_name || item.department_id,
        leave_type: item.leave_type_name,
        // Map dates from validity object
        from_date: item?.from,
        to_date: item?.to,
        status: item.status, // Keep raw status for mapping logic
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load leave requests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this leave request?")) {
      try {
        await deleteLeaveRequest(Number(id));
        fetchData();
      } catch (error) {
        console.error("Error deleting leave request:", error);
      }
    }
  };

  const columns: any[] = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   sorter: (a: any, b: any) => (a.id || 0) - (b.id || 0),
    //   render: (val: any) => <span>{val || "-"}</span>,
    // },
    {
      title: "Employee Name",
      dataIndex: "employee_name",
      sorter: (a: any, b: any) =>
        String(a.employee_name || "").localeCompare(
          String(b.employee_name || ""),
        ),
      render: (val: any) => <span>{val || "-"}</span>,
    },
    {
      title: "Leave Type",
      dataIndex: "leave_type",
      sorter: (a: any, b: any) =>
        String(a.leave_type || "").localeCompare(String(b.leave_type || "")),
      render: (val: any) => <span>{val || "-"}</span>,
    },
    {
      title: "From Date",
      dataIndex: "from_date",
      render: (val: string) => (val ? moment(val).format("YYYY-MM-DD") : "-"),
      sorter: (a: any, b: any) =>
        moment(a.from_date).valueOf() - moment(b.from_date).valueOf(),
    },
    {
      title: "To Date",
      dataIndex: "to_date",
      render: (val: string) => (val ? moment(val).format("YYYY-MM-DD") : "-"),
      sorter: (a: any, b: any) =>
        moment(a.to_date).valueOf() - moment(b.to_date).valueOf(),
    },
    // --- UPDATED STATUS COLUMN ---
    {
      title: "Status",
      dataIndex: "status",
      render: (val: string) => {
        // 1. Get the display text (Mapped or Capitalized fallback)
        const displayStatus = STATUS_MAP[val]
          ? STATUS_MAP[val]
          : val
            ? val.charAt(0).toUpperCase() + val.slice(1)
            : "Draft";

        // 2. Get the specific classes
        const badgeClass = getStatusBadgeClass(val);

        // 3. Return the badge
        return <span className={`badge ${badgeClass}`}>{displayStatus}</span>;
      },
      sorter: (a: any, b: any) =>
        String(STATUS_MAP[a.status] || a.status).localeCompare(
          String(STATUS_MAP[b.status] || b.status),
        ),
    },
    // -----------------------------
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: any) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_leave_request"
            onClick={() => {
              setSelectedPolicy(record);
              const jq = (window as any).jQuery || (window as any).$;
              if (jq && jq("#add_leave_request").modal) {
                try {
                  jq("#add_leave_request").modal("show");
                } catch (e) {}
              }
            }}
          >
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
    <>
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content">
            <div onClick={() => setSelectedPolicy(null)}>
              <CommonHeader
                title="Leave Request"
                parentMenu="HR"
                activeMenu="Leave Request"
                routes={routes}
                buttonText="Add leave Request"
                modalTarget="#add_leave_request"
              />
            </div>

            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Leave List</h5>
                <div className="mt-3">
                  <DatatableKHR columns={columns} data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <AddEditLeaveRequestModal onSuccess={fetchData} data={selectedPolicy} />
      </div>
    </>
  );
};

export default LeaveRequestKHR;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { all_routes } from "../../../router/all_routes";
// import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
// import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
// import AddEditLeaveRequestModal from "./AddEditLeaveRequestModal";
// import moment from "moment";

// import { getLeaveRequests, deleteLeaveRequest } from "./LeaveRequestServices";

// const LeaveRequestKHR = () => {
//   const routes = all_routes;
//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [selectedPolicy, setSelectedPolicy] = useState<any | null>(null);

//   // --- Fetch Data ---
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const result = await getLeaveRequests();
//       const safeResult = Array.isArray(result.data.data)
//         ? result.data?.data
//         : [];

//       const mappedData = safeResult.map((item: any) => ({
//         id: item.id,
//         employee_name: item.employee_name || item.employee_id,
//         company_name: item.company_name || item.company_id,
//         department_name: item.department_name || item.department_id,
//         leave_type: item.leave_type_name,
//         from_date: item.from_date,
//         to_date: item.to_date,
//         status: item.status,
//       }));

//       setData(mappedData);
//     } catch (error) {
//       console.error("Failed to load leave requests", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Initial Load ---
//   useEffect(() => {
//     fetchData();
//   }, []);

//   // --- Delete Handler ---
//   const handleDelete = async (id: string | number) => {
//     if (window.confirm("Are you sure you want to delete this leave request?")) {
//       try {
//         await deleteLeaveRequest(Number(id));
//         fetchData(); // Refresh the list after successful deletion
//       } catch (error) {
//         console.error("Error deleting leave request:", error);
//         alert("Failed to delete leave request.");
//       }
//     }
//   };

//   // --- Columns Definition ---
//   const columns: any[] = [
//     {
//       title: "ID",
//       dataIndex: "id",
//       render: (val: any) => <span>{val || "-"}</span>,
//       sorter: (a: any, b: any) => (a.id || 0) - (b.id || 0),
//     },
//     {
//       title: "Employee Name",
//       dataIndex: "employee_name",
//       render: (val: any) => <span>{val || "-"}</span>,
//       sorter: (a: any, b: any) =>
//         String(a.employee_name || "").localeCompare(
//           String(b.employee_name || ""),
//         ),
//     },
//     // {
//     //   title: "Company Name",
//     //   dataIndex: "company_name",
//     //   render: (val: any) => <span>{val || "-"}</span>,
//     //   sorter: (a: any, b: any) =>
//     //     String(a.company_name || "").localeCompare(
//     //       String(b.company_name || "")
//     //     ),
//     // },
//     // {
//     //   title: "Department Name",
//     //   dataIndex: "department_name",
//     //   render: (val: any) => <span>{val || "-"}</span>,
//     //   sorter: (a: any, b: any) =>
//     //     String(a.department_name || "").localeCompare(
//     //       String(b.department_name || "")
//     //     ),
//     // },
//     {
//       title: "Leave Type",
//       dataIndex: "leave_type",
//       render: (val: any) => <span>{val || "-"}</span>,
//       sorter: (a: any, b: any) =>
//         String(a.leave_type || "").localeCompare(String(b.leave_type || "")),
//     },
//     {
//       title: "From Date",
//       dataIndex: ["validity", "from"],
//       render: (val: string) =>
//         val ? moment(val, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD") : "-",
//       sorter: (a: any, b: any) =>
//         moment(a.validity?.from).valueOf() - moment(b.validity?.from).valueOf(),
//     },

//     {
//       title: "To Date",
//       dataIndex: ["validity", "to"],
//       render: (val: string) =>
//         val ? moment(val, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD") : "-",
//       sorter: (a: any, b: any) =>
//         moment(a.validity?.to).valueOf() - moment(b.validity?.to).valueOf(),
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       render: (val: any) => <span>{val || "-"}</span>,
//       sorter: (a: any, b: any) =>
//         String(a.status || "").localeCompare(String(b.status || "")),
//     },
//     {
//       title: "Actions",
//       dataIndex: "id",
//       render: (_: any, record: any) => (
//         <div className="action-icon d-inline-flex">
//           <Link
//             to="#"
//             className="me-2"
//             data-bs-toggle="modal"
//             data-bs-target="#add_leave_request"
//             onClick={() => {
//               setSelectedPolicy(record);
//               const jq = (window as any).jQuery || (window as any).$;
//               if (
//                 jq &&
//                 typeof jq === "function" &&
//                 jq("#add_leave_request").modal
//               ) {
//                 try {
//                   jq("#add_leave_request").modal("show");
//                 } catch (e) {
//                   // ignore if modal call fails
//                 }
//               }
//             }}
//           >
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
//     <>
//       <div className="main-wrapper">
//         <div className="page-wrapper">
//           <div className="content">
//             <div onClick={() => setSelectedPolicy(null)}>
//               <CommonHeader
//                 title="Leave Request"
//                 parentMenu="HR"
//                 activeMenu="Leave Request"
//                 routes={routes}
//                 buttonText="Add leave Request"
//                 modalTarget="#add_leave_request"
//               />
//             </div>

//             {/* Leave Type List */}
//             <div className="card mb-3">
//               <div className="card-body">
//                 <h5 className="card-title">Leave List</h5>

//                 <div className="mt-3">
//                   <DatatableKHR columns={columns} data={data} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <AddEditLeaveRequestModal onSuccess={fetchData} data={selectedPolicy} />
//       </div>
//     </>
//   );
// };

// export default LeaveRequestKHR;
