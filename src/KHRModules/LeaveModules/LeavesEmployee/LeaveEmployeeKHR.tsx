import React, { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import { getEmployeeLeaveDashboard } from "./LeaveEmployeeServices";
import { all_routes } from "../../../router/all_routes";

// Define interfaces based on your JSON response
interface LeaveCard {
  leave_type: string;
  total: number;
  used: number;
  remaining: number;
}

interface LeaveRecord {
  id: number;
  leave_type: string;
  from: string;
  to: string;
  no_of_days: number;
  status: string;
  key?: string;
}

// --- FIXED: Single definition with all properties ---
const getCardStyles = (type: string) => {
  switch (type) {
    case "Annual Leave":
      return {
        cls: "bg-black-le",
        icon: "ti ti-calendar-event",
        fallbackColor: "#1B1B1B", // Deep Black/Grey
      };
    case "Medical Leave":
      return {
        cls: "bg-blue-le",
        icon: "ti ti-vaccine",
        fallbackColor: "#007BFF", // Vibrant Blue
      };
    case "Casual Leave":
      return {
        cls: "bg-purple-le",
        icon: "ti ti-hexagon-letter-c",
        fallbackColor: "#6F42C1", // Deep Purple
      };
    default:
      return {
        cls: "bg-pink-le",
        icon: "ti ti-hexagonal-prism-plus",
        fallbackColor: "#E83E8C", // Pink/Crimson
      };
  }
};

const LeaveEmployeeKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<LeaveRecord[]>([]);
  const [cards, setCards] = useState<LeaveCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getEmployeeLeaveDashboard();

      if (response && response.success) {
        setCards(response.cards || []);

        const rawList = Array.isArray(response.tableData)
          ? response.tableData
          : [];
        const mapped = rawList.map((item: any) => ({
          ...item,
          key: item.id ? String(item.id) : Math.random().toString(),
          type_name: item.leave_type,
          from_date: item.from,
          to_date: item.to,
        }));

        setData(mapped);
      }
    } catch (err) {
      console.error("CRITICAL ERROR calling API:", err);
      toast.error("Network Error: Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const modal = document.getElementById("add_leave_modal");
    const handleHidden = () => setSelectedPolicy(null);
    modal?.addEventListener("hidden.bs.modal", handleHidden);
    return () => modal?.removeEventListener("hidden.bs.modal", handleHidden);
  }, []);

  const columns = [
    {
      title: "Leave Type",
      dataIndex: "leave_type",
      render: (val: string) => (
        <span className="fw-bold text-dark">{val || "-"}</span>
      ),
    },
    {
      title: "From",
      dataIndex: "from",
      render: (val: string) => (val ? moment(val).format("DD MMM YYYY") : "-"),
    },
    {
      title: "To",
      dataIndex: "to",
      render: (val: string) => (val ? moment(val).format("DD MMM YYYY") : "-"),
    },
    {
      title: "No of Days",
      dataIndex: "no_of_days",
      render: (val: number) => (
        <span className="badge bg-soft-info text-info">{val || 0} Days</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        let className = "bg-soft-warning text-warning";
        if (status === "validate") className = "bg-soft-success text-success";
        if (status === "confirm") className = "bg-soft-info text-info";

        return (
          <span className={`badge ${className}`}>
            {status.charAt(0).toUpperCase() + status.slice(1) || "Pending"}
          </span>
        );
      },
    },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <div className="action-icon d-inline-flex">
          <button
            className="btn btn-sm text-primary"
            data-bs-toggle="modal"
            data-bs-target="#add_leave_modal"
            onClick={() => setSelectedPolicy(record)}
          >
            <i className="ti ti-edit" />
          </button>
        </div>
      ),
    },
  ];

  // REMOVED THE DUPLICATE getCardStyles FUNCTION HERE

  return (
    <div className="page-wrapper">
      <div className="content">
        <CommonHeader
          title="My Leaves"
          parentMenu="Employee"
          activeMenu="Leaves"
          routes={routes}
          // buttonText="Apply Leave"
          // modalTarget="#add_leave_modal"
        />

        <div className="row">
          {cards.map((card, i) => {
            // This now calls the correct function at the top
            const style = getCardStyles(card.leave_type);
            return (
              <div className="col-xl-3 col-md-6" key={i}>
                <div
                  className={`card border-0 ${style.cls}`}
                  style={{
                    borderRadius: "10px",
                    minHeight: "130px",
                    // This will now work because style contains fallbackColor
                    backgroundColor: style.fallbackColor,
                  }}
                >
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="text-start">
                        <p className="mb-1 text-white fw-medium opacity-75">
                          {card.leave_type}
                        </p>
                        <h4 className="text-white fw-bold mb-0">
                          {String(card.used || 0).padStart(2, "0")} /{" "}
                          {card.total}
                        </h4>
                      </div>
                      <div className="avatar avatar-lg bg-white-transparent-10">
                        <i className={`${style.icon} fs-24 text-white`} />
                      </div>
                    </div>

                    <div className="mt-3">
                      <span
                        className="badge"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          color: "#fff",
                          border: "1px solid rgba(255, 255, 255, 0.3)",
                        }}
                      >
                        Remaining : {card.remaining || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card mt-4">
          <div className="card-body">
            <DatatableKHR data={data} columns={columns} selection={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveEmployeeKHR;

// import React, { useEffect, useState } from "react";
// import moment from "moment";
// import { toast } from "react-toastify";
// import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
// import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";

// import {
//   getEmployeeLeaveDashboard,
//   deleteAttendancePolicy,
//   EmployeeLeaveRecord,
//   EmployeeLeaveMeta,
// } from "./LeaveEmployeeServices";
// import { all_routes } from "../../../router/all_routes";

// const LeaveEmployeeKHR = () => {
//   const routes = all_routes;
//   const [data, setData] = useState<EmployeeLeaveRecord[]>([]);
//   const [meta, setMeta] = useState<EmployeeLeaveMeta | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [selectedPolicy, setSelectedPolicy] = useState<any>(null);

//   const fetchData = async () => {
//     setLoading(true);
//     console.log("fetchData started");
//     try {
//       const response = await getEmployeeLeaveDashboard();
//       console.log("API Response received:", response);

//       if (response && (response.status === "success" || response.success)) {
//         setMeta(response.meta || null);

//         // Ensure we always have an array even if data is missing
//         const rawList = Array.isArray(response.data) ? response.data : [];

//         const mapped = rawList.map((item: any) => ({
//           ...item,
//           key: item.id ? String(item.id) : Math.random().toString(),
//           type_name: Array.isArray(item.type) ? item.type[1] : item.type,
//           from_date: item.from_date || item.start_date,
//           to_date: item.to_date || item.end_date,
//           approved_by_name: Array.isArray(item.approved_by)
//             ? item.approved_by[1]
//             : item.approved_by,
//         }));

//         setData(mapped);
//       }
//     } catch (err) {
//       console.error("CRITICAL ERROR calling API:", err);
//       toast.error("Network Error: Could not connect to server");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     console.log("Component mounted, calling API..."); // Add this log to verify
//     fetchData();

//     // Standardize the Modal ID to "add_leave_modal"
//     const modal = document.getElementById("add_leave_modal");
//     const handleHidden = () => setSelectedPolicy(null);

//     modal?.addEventListener("hidden.bs.modal", handleHidden);
//     return () => modal?.removeEventListener("hidden.bs.modal", handleHidden);
//   }, []);

//   const columns = [
//     {
//       title: "Leave Type",
//       dataIndex: "type_name",
//       render: (val: string) => (
//         <span className="fw-bold text-dark">
//           {val?.replace(/_/g, " ") || "-"}
//         </span>
//       ),
//     },
//     {
//       title: "From",
//       dataIndex: "from_date",
//       render: (val: string) => (val ? moment(val).format("DD MMM YYYY") : "-"),
//     },
//     {
//       title: "To",
//       dataIndex: "to_date",
//       render: (val: string) => (val ? moment(val).format("DD MMM YYYY") : "-"),
//     },
//     {
//       title: "No of Days",
//       dataIndex: "no_of_days",
//       render: (val: number) => (
//         <span className="badge bg-soft-info text-info">{val || 0} Days</span>
//       ),
//     },
//     {
//       title: "Approved By",
//       dataIndex: "approved_by_name",
//       render: (val: string) => <span>{val || "Pending"}</span>,
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       render: (status: string) => (
//         <span
//           className={`badge ${
//             status === "Approved"
//               ? "bg-soft-success text-success"
//               : "bg-soft-warning text-warning"
//           }`}
//         >
//           {status || "Pending"}
//         </span>
//       ),
//     },
//     {
//       title: "Actions",
//       render: (_: any, record: any) => (
//         <div className="action-icon d-inline-flex">
//           <button
//             className="btn btn-sm text-primary"
//             data-bs-toggle="modal"
//             data-bs-target="#add_leave_modal"
//             onClick={() => setSelectedPolicy(record)}
//           >
//             <i className="ti ti-edit" />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="page-wrapper">
//       <div className="content">
//         <CommonHeader
//           title="My Leaves"
//           parentMenu="Employee"
//           activeMenu="Leaves"
//           routes={routes}
//           buttonText="Apply Leave"
//           modalTarget="#add_leave_modal"
//         />

//         {/* Dynamic Cards */}
//         <div className="row">
//           {[
//             {
//               label: "Annual Leaves",
//               val: meta?.annual_taken,
//               rem: meta?.annual_remaining,
//               cls: "bg-black-le",
//               badge: "bg-secondary-transparent",
//               icon: "ti-calendar-event",
//             },
//             {
//               label: "Medical Leaves",
//               val: meta?.medical_taken,
//               rem: meta?.medical_remaining,
//               cls: "bg-blue-le",
//               badge: "bg-info-transparent",
//               icon: "ti-vaccine",
//             },
//             {
//               label: "Casual Leaves",
//               val: meta?.casual_taken,
//               rem: meta?.casual_remaining,
//               cls: "bg-purple-le",
//               badge: "bg-transparent-purple",
//               icon: "ti-hexagon-letter-c",
//             },
//             {
//               label: "Other Leaves",
//               val: meta?.other_taken,
//               rem: meta?.other_remaining,
//               cls: "bg-pink-le",
//               badge: "bg-pink-transparent",
//               icon: "ti-hexagonal-prism-plus",
//             },
//           ].map((card, i) => (
//             <div className="col-xl-3 col-md-6" key={i}>
//               <div className={`card ${card.cls}`}>
//                 <div className="card-body">
//                   <div className="d-flex align-items-center justify-content-between">
//                     <div className="text-start">
//                       <p className="mb-1 text-white">{card.label}</p>
//                       <h4 className="text-white">
//                         {String(card.val || 0).padStart(2, "0")}
//                       </h4>
//                     </div>
//                     <i className={`${card.icon} fs-32 text-white opacity-50`} />
//                   </div>
//                   <span className={`badge ${card.badge} mt-2`}>
//                     Remaining : {card.rem || 0}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="card mt-4">
//           <div className="card-body">
//             <DatatableKHR data={data} columns={columns} selection={true} />
//           </div>
//         </div>
//       </div>
//       {/* <AddEditLeaveModal onSuccess={fetchData} data={selectedPolicy} /> */}
//     </div>
//   );
// };

// export default LeaveEmployeeKHR;
