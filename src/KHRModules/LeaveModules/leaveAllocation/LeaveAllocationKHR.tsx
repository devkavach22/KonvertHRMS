import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditLeaveAllocationModal from "./AddEditLeaveAllocationModal";
import {
  getLeaveAllocations,
  deleteLeaveAllocation,
} from "./LeaveAllocationServices";

const LeaveAllocationKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAllocation, setSelectedAllocation] = useState(null);

  // --- Fetch Data ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await getLeaveAllocations();

      // Fix: Extract array from the "data" key based on your JSON: { status: "success", data: [...] }
      const rawArray =
        response?.data || (Array.isArray(response) ? response : []);

      const mappedData = rawArray.map((item: any) => ({
        ...item,
        key: String(item.id), // Required for Datatable unique row
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load allocations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Delete Handler ---
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this allocation?")) {
      try {
        await deleteLeaveAllocation(id);
        toast.success("Allocation deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete allocation");
      }
    }
  };

  // --- Table Columns ---
  const columns = [
    {
      title: "Employee",
      dataIndex: "employee_name", // Matches JSON
      sorter: (a: any, b: any) =>
        (a.employee_name || "").localeCompare(b.employee_name || ""),
      render: (text: string) => (
        <span className="fw-medium text-dark">{text || "-"}</span>
      ),
    },
    {
      title: "Leave Type",
      dataIndex: "leave_type_name", // Matches JSON
      sorter: (a: any, b: any) =>
        (a.leave_type_name || "").localeCompare(b.leave_type_name || ""),
    },
    {
      title: "Allocation Type",
      dataIndex: "allocation_type", // Matches JSON ("accrual", "regular", etc.)
      render: (text: string) => (
        <span
          className={`badge ${
            text?.toLowerCase() === "accrual"
              ? "bg-soft-info text-info"
              : text?.toLowerCase() === "regular"
              ? "bg-soft-success text-success"
              : "bg-soft-warning text-warning"
          }`}
        >
          {text ? text.charAt(0).toUpperCase() + text.slice(1) : "-"}
        </span>
      ),
    },
    {
      title: "From Date",
      dataIndex: "date_from", // Matches JSON
    },
    {
      title: "To Date",
      dataIndex: "date_to", // Matches JSON
    },
    {
      title: "Days",
      dataIndex: "number_of_days", // Matches JSON
      render: (text: any) => <span className="fw-bold">{text}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <span
          className={`badge ${
            text === "confirm" ? "bg-success" : "bg-secondary"
          }`}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: any) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_leave_allocation_modal"
            onClick={() => setSelectedAllocation(record)}
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
      <div className="page-wrapper">
        <div className="content">
          {/* Header wraps click to reset selected item when adding new */}
          <div onClick={() => setSelectedAllocation(null)}>
            <CommonHeader
              title="Leave Allocation"
              parentMenu="HR"
              activeMenu="Allocations"
              routes={routes}
              buttonText="Add Allocation"
              modalTarget="#add_leave_allocation_modal"
            />
          </div>

          <div className="card">
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center p-5">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>
                  <div className="mt-2">Fetching Records...</div>
                </div>
              ) : (
                <DatatableKHR data={data} columns={columns} selection={true} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Component */}
      <AddEditLeaveAllocationModal
        show={false} // This prop might be redundant if you rely on Bootstrap's data-bs-target, but kept for type safety if needed
        onHide={() => {}} // handled by bootstrap
        onSuccess={fetchData}
        data={selectedAllocation}
      />
    </>
  );
};

export default LeaveAllocationKHR;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { all_routes } from "../../../router/all_routes";
// import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
// import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
// import AddEditAttendancePolicyModal from "./AddEditLeaveAllocationModal";
// import moment from "moment";

// import {
//   AttendancePolicy as AttendancePolicyType,
//   getLeaveAllocations,
//   deleteLeaveAllocation,
// } from "./LeaveAllocationServices";
// import { toast } from "react-toastify";

// const LeaveAdminKHR = () => {
//   const routes = all_routes;
//   const [data, setData] = useState<AttendancePolicyType[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [selectedPolicy, setSelectedPolicy] =
//     useState<AttendancePolicyType | null>(null);
//   const [employeesOptions, setEmployeesOptions] = useState<
//     Array<{ id: any; name: string }>
//   >([]);
//   // New form state for Leave Type settings
//   const [leaveName, setLeaveName] = useState<string>("");
//   const [approvalLeaveRequests, setApprovalLeaveRequests] =
//     useState<string>("");
//   const [isEarnedLeave, setIsEarnedLeave] = useState<boolean>(false);
//   const [allocationRequires, setAllocationRequires] = useState<string>("");
//   const [leaveTypeCode, setLeaveTypeCode] = useState<number | string>("");
//   const [leaveCategory, setLeaveCategory] = useState<string>("");
//   const [employeeRequests, setEmployeeRequests] = useState<string>("");
//   const [approvalAllocationRequests, setApprovalAllocationRequests] =
//     useState<string>("");
//   // Configuration & other fields
//   const [notifiedLeaveOfficer, setNotifiedLeaveOfficer] = useState<string>("");
//   const [hrApproval, setHrApproval] = useState<string>("");
//   const [takeLeaveIn, setTakeLeaveIn] = useState<string>("day");
//   const [deductExtraHours, setDeductExtraHours] = useState<boolean>(false);
//   const [publicHolidayIncluded, setPublicHolidayIncluded] =
//     useState<boolean>(false);
//   const [showOnDashboard, setShowOnDashboard] = useState<boolean>(false);
//   const [sandwichLeaves, setSandwichLeaves] = useState<boolean>(false);
//   const [allowAttachSupportingDocument, setAllowAttachSupportingDocument] =
//     useState<boolean>(false);
//   const [kindOfLeave, setKindOfLeave] = useState<string>("");
//   const [company, setCompany] = useState<string>("");
//   const [negativeCap, setNegativeCap] = useState<boolean>(false);
//   const [allowCarryForward, setAllowCarryForward] = useState<boolean>(false);
//   const [allowLapse, setAllowLapse] = useState<boolean>(false);
//   const [allowEncashment, setAllowEncashment] = useState<boolean>(false);
//   // New fields: Leave Encashment & Payroll
//   const [allowLeaveEncashment, setAllowLeaveEncashment] =
//     useState<boolean>(false);
//   const [maxAllowLeaveCarryForward, setMaxAllowLeaveCarryForward] = useState<
//     number | string
//   >("");
//   const [workEntryType, setWorkEntryType] = useState<string>("");
//   const [applicableEmployeeCategory, setApplicableEmployeeCategory] =
//     useState<string>("");
//   const [applicableLocations, setApplicableLocations] = useState<string>("");
//   const [genderRestriction, setGenderRestriction] = useState<string>("all");
//   const [eligibleAfter, setEligibleAfter] =
//     useState<string>("day_after_joining");
//   const [daysRequired, setDaysRequired] = useState<number | string>("");
//   const [backdatedAllowed, setBackdatedAllowed] = useState<boolean>(false);
//   const [maxBackdatedDays, setMaxBackdatedDays] = useState<number | string>("");
//   const [futureDatedAllowed, setFutureDatedAllowed] = useState<boolean>(false);
//   const [minimumWorkingDays, setMinimumWorkingDays] = useState<number | string>(
//     ""
//   );
//   const [daysPerMonth, setDaysPerMonth] = useState<number | string>("");
//   const [maximumAnnualLeave, setMaximumAnnualLeave] = useState<number | string>(
//     ""
//   );

//   // Options loaded from API
//   const [companiesOptions, setCompaniesOptions] = useState<
//     Array<{ id: any; name: string }>
//   >([]);
//   const [locationsOptions, setLocationsOptions] = useState<
//     Array<{ id: any; name: string }>
//   >([]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       // Prefer fetching leave allocations from API
//       const arr = await getLeaveAllocations();
//       const safeResult = Array.isArray(arr) ? arr : [];

//       // Build employee name lookup from fetched options
//       const empMap: Record<string, string> = {};
//       employeesOptions.forEach((e) => {
//         empMap[String(e.id)] = e.name;
//       });

//       const mappedData: AttendancePolicyType[] = safeResult.map((item: any) => {
//         // employee name detection
//         let employee_name = "-";
//         if (item.employee && (item.employee.name || item.employee.full_name)) {
//           employee_name = item.employee.name || item.employee.full_name;
//         } else if (item.employee_name) {
//           employee_name = String(item.employee_name);
//         } else if (item.employee_id) {
//           employee_name =
//             empMap[String(item.employee_id)] ?? String(item.employee_id);
//         }

//         const leaveTypeLabel =
//           item.holiday_status_name ??
//           item.leave_type_name ??
//           item.leave_type ??
//           (item.holiday_status_id ? String(item.holiday_status_id) : "");

//         return {
//           id: String(
//             item.id ??
//               item.allocation_id ??
//               item._id ??
//               item.employee_id ??
//               Math.random()
//           ),
//           key: String(
//             item.id ??
//               item.allocation_id ??
//               item._id ??
//               item.employee_id ??
//               Math.random()
//           ),
//           employee_name,
//           leave_type: leaveTypeLabel,
//           from_date: item.date_from ?? item.from_date ?? null,
//           to_date: item.date_to ?? item.to_date ?? null,
//           allocation_date: item.number_of_days ?? null,
//           status: item.status ?? item.state ?? item.approval_status ?? null,

//           // Raw fields for editing
//           holiday_status_id: item.holiday_status_id ?? null,
//           allocation_type: item.allocation_type ?? null,
//           number_of_days: item.number_of_days ?? null,
//           description: item.description ?? null,

//           // keep some legacy fields
//           approved_by: item.approved_by ?? item.created_by ?? null,
//         } as any;
//       });

//       setData(mappedData);
//     } catch (error) {
//       console.error("Failed to load leave allocations", error);
//       toast.error("Failed to load leave allocations");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // fetch companies and locations
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const fetchList = async (endpoints: string[]) => {
//           for (const ep of endpoints) {
//             try {
//               const res = await fetch(ep);
//               if (!res.ok) continue;
//               const json = await res.json();
//               if (Array.isArray(json)) return json;
//               if (json && Array.isArray(json.data)) return json.data;
//             } catch (e) {
//               // continue
//             }
//           }
//           return null;
//         };

//         const companies = await fetchList([
//           "/api/companies",
//           "/companies",
//           "/api/organizations",
//         ]);
//         const locations = await fetchList([
//           "/api/locations",
//           "/locations",
//           "/api/branches",
//         ]);

//         if (mounted && Array.isArray(companies)) {
//           setCompaniesOptions(
//             companies.map((c: any) => ({
//               id: c.id ?? c.value,
//               name: c.name ?? c.label ?? String(c.id),
//             }))
//           );
//         }
//         if (mounted && Array.isArray(locations)) {
//           setLocationsOptions(
//             locations.map((l: any) => ({
//               id: l.id ?? l.value,
//               name: l.name ?? l.label ?? String(l.id),
//             }))
//           );
//         }
//       } catch (e) {
//         // ignore
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // fetch employees list for name lookup
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const endpoints = [
//           "/api/employees",
//           "/api/users",
//           "/employees",
//           "/users",
//         ];
//         let result: any = null;
//         for (const ep of endpoints) {
//           try {
//             const res = await fetch(ep);
//             if (!res.ok) continue;
//             const json = await res.json();
//             if (Array.isArray(json)) {
//               result = json;
//               break;
//             }
//             if (json && Array.isArray(json.data)) {
//               result = json.data;
//               break;
//             }
//           } catch (e) {
//             // continue
//           }
//         }
//         if (mounted && Array.isArray(result)) {
//           const opts = result.map((r: any) => ({
//             id: r.id ?? r.user_id ?? r.value,
//             name:
//               r.name ?? r.full_name ?? r.label ?? r.username ?? String(r.id),
//           }));
//           setEmployeesOptions(opts);
//         }
//       } catch (e) {
//         // ignore
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // re-fetch policies after employee names are loaded so we can map ids to names
//   useEffect(() => {
//     if (employeesOptions.length > 0) fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [employeesOptions.length]);

//   const handleDelete = async (id: string) => {
//     if (
//       window.confirm("Are you sure you want to delete this leave allocation?")
//     ) {
//       try {
//         // console.log("Deleting leave allocation with ID:", id);
//         await deleteLeaveAllocation(Number(id));
//         // console.log("Leave allocation deleted successfully")
//         fetchData();
//       } catch (error) {
//         console.error("Error deleting leave allocation:", error);
//         toast.error("Failed to delete leave allocation.");
//       }
//     }
//   };

//   const columns: any[] = [
//     {
//       title: "Leave type",
//       dataIndex: "leave_type",
//       render: (val: any) => (
//         <span>
//           {typeof val === "string" && val
//             ? String(val).replace(/_/g, " ")
//             : "-"}
//         </span>
//       ),
//       sorter: (a: any, b: any) =>
//         String(a?.leave_type ?? "").localeCompare(String(b?.leave_type ?? "")),
//     },
//     {
//       title: "From Date",
//       dataIndex: "from_date",
//       render: (val: any, record: any) => {
//         const date = val ?? record.start_date ?? record.created_date ?? null;
//         return (
//           <span>
//             {date && moment(date).isValid()
//               ? moment(date).format("YYYY-MM-DD")
//               : "-"}
//           </span>
//         );
//       },
//       sorter: (a: any, b: any) => {
//         const aDate = a?.from_date ?? a?.start_date ?? a?.created_date ?? null;
//         const bDate = b?.from_date ?? b?.start_date ?? b?.created_date ?? null;
//         const ad = moment(aDate);
//         const bd = moment(bDate);
//         if (ad.isValid() && bd.isValid()) return ad.valueOf() - bd.valueOf();
//         if (ad.isValid()) return -1;
//         if (bd.isValid()) return 1;
//         return 0;
//       },
//     },
//     {
//       title: "To date",
//       dataIndex: "to_date",
//       render: (val: any, record: any) => {
//         const date = val ?? record.end_date ?? null;
//         return (
//           <span>
//             {date && moment(date).isValid()
//               ? moment(date).format("YYYY-MM-DD")
//               : "-"}
//           </span>
//         );
//       },
//       sorter: (a: any, b: any) => {
//         const aDate = a?.to_date ?? a?.end_date ?? null;
//         const bDate = b?.to_date ?? b?.end_date ?? null;
//         const ad = moment(aDate);
//         const bd = moment(bDate);
//         if (ad.isValid() && bd.isValid()) return ad.valueOf() - bd.valueOf();
//         if (ad.isValid()) return -1;
//         if (bd.isValid()) return 1;
//         return 0;
//       },
//     },
//     // add one more is allocation date
//     {
//       title: "Allocation date",
//       dataIndex: "allocation_date",
//       key: "actions",
//     },
//     {
//       title: "status",
//       dataIndex: "status",
//       render: (val: any, record: any) => {
//         const s =
//           val ??
//           record.approval_status ??
//           record.state ??
//           record.status ??
//           null;
//         return <span>{s ? String(s) : "-"}</span>;
//       },
//       sorter: (a: any, b: any) =>
//         String(a?.status ?? a?.approval_status ?? a?.state ?? "").localeCompare(
//           String(b?.status ?? b?.approval_status ?? b?.state ?? "")
//         ),
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
//             data-bs-target="#add_attendance_policy"
//             onClick={() => setSelectedPolicy({ ...record })}
//           >
//             <i className="ti ti-edit text-blue" />
//           </Link>
//           <Link to="#" onClick={() => handleDelete(record.id!)}>
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
//                 title="Leave Allocation"
//                 parentMenu="HR"
//                 activeMenu="Leave Allocation"
//                 routes={routes}
//                 buttonText="Add Leave Allocation"
//                 modalTarget="#add_attendance_policy"
//               />
//             </div>

//             <DatatableKHR columns={columns} data={data} />
//           </div>
//         </div>

//         <AddEditAttendancePolicyModal
//           onSuccess={fetchData}
//           data={selectedPolicy}
//         />
//       </div>
//     </>
//   );
// };

// export default LeaveAdminKHR;
