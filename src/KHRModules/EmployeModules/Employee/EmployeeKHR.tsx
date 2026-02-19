import React, { useEffect, useState } from "react";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditEmployeeModal from "./AddEditEmployeeModal";
import { getEmployees, deleteEmployee, Employee } from "./EmployeeServices";
import { toast } from "react-toastify";
import { all_routes } from "@/router/all_routes";
import EmployeeCard from "./EmployeeCard";
import DatatableKHR from "@/CommonComponent/DataTableKHR/DatatableKHR";

const EmployeeKHR = () => {
  const routes = all_routes;
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]); // ✅ Added for filtering
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState<any>(null);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  // ✅ Filter States
  const [searchText, setSearchText] = useState("");
  const [filterDept, setFilterDept] = useState("");

  // const fetchEmployees = async () => {
  //   setLoading(true);
  //   try {
  //     const data = await getEmployees();
  //     setEmployees(data);
  //     setFilteredEmployees(data); // ✅ Initialize filtered list
  //   } catch (error) {
  //     console.error("Fetch Error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchEmployees = async () => {
    setLoading(true);
    const loggedInUserId = localStorage.getItem("user_id");
    try {
      const data = await getEmployees();

      // ✅ SORTING LOGIC: Move Logged-in User to the top
      const sortedData = [...data].sort((a: any, b: any) => {
        const aId = Array.isArray(a.user_id)
          ? String(a.user_id[0])
          : String(a.user_id);
        const bId = Array.isArray(b.user_id)
          ? String(b.user_id[0])
          : String(b.user_id);

        if (aId === loggedInUserId) return -1;
        if (bId === loggedInUserId) return 1;
        return 0;
      });

      setEmployees(sortedData);
      setFilteredEmployees(sortedData);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ✅ Comprehensive Global Search Logic for EmployeeKHR.tsx
  useEffect(() => {
    const searchLower = searchText.toLowerCase().trim();

    const filtered = employees.filter((emp: any) => {
      // 1. First, apply the specific Department dropdown filter
      const deptValue = Array.isArray(emp.department_id)
        ? String(emp.department_id[1])
        : String(emp.department_id || "");
      const deptMatch = filterDept === "" || deptValue === filterDept;

      // 2. If the search box is empty, just return the department filter result
      if (!searchLower) return deptMatch;

      // 3. Perform a deep scan across all employee card properties
      const matchesSearch = Object.values(emp).some((value) => {
        if (value === null || value === undefined || value === false)
          return false;

        // Handle Odoo-style Arrays found in your card (e.g., [3148, "OMSPACE ROCKET"])
        if (Array.isArray(value)) {
          return value.some((v) =>
            String(v).toLowerCase().includes(searchLower),
          );
        }
        // Handle Nested Objects (like bank_account_details)
        if (typeof value === "object") {
          return Object.values(value).some((v) =>
            String(v).toLowerCase().includes(searchLower),
          );
        }
        // Standard search for strings (Name, Email, Code) and numbers (Phone)
        return String(value).toLowerCase().includes(searchLower);
      });

      return deptMatch && matchesSearch;
    });

    setFilteredEmployees(filtered);
  }, [searchText, filterDept, employees]);

  const handleDeleteEmployee = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    try {
      await deleteEmployee(id.toString());
      toast.success("Employee deleted successfully");
      fetchEmployees();
    } catch (error) {
      toast.error("Failed to delete employee");
    }
  };

  const handleEditClick = (employee: any) => {
    setEditData(employee);
    const modalElement = document.getElementById("add_employee_modal");
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text: string, record: any) => {
        const loggedInUserId = localStorage.getItem("user_id");
        const userRole = localStorage.getItem("user_role");
        const recordUserId = Array.isArray(record.user_id)
          ? String(record.user_id[0])
          : String(record.user_id);
        const isSelfAdmin =
          recordUserId === loggedInUserId && userRole === "REGISTER_ADMIN";

        return (
          <div className="d-flex align-items-center">
            <div className="avatar avatar-md me-2">
              <img
                src={record.image_url || "assets/img/profiles/avatar-02.jpg"}
                className="rounded-circle"
                alt="User"
              />
            </div>
            <div>
              <h6 className="fs-14 fw-medium mb-0">
                {text}{" "}
                {recordUserId === loggedInUserId && (
                  <small className="text-primary">(Me)</small>
                )}
              </h6>
              {/* ✅ ATTRACTIVE ADMIN BADGE IN LIST VIEW */}
              {isSelfAdmin && (
                <span
                  className="badge rounded-pill mt-1"
                  style={{
                    background:
                      "linear-gradient(135deg, #E42128 0%, #b21a1f 100%)",
                    color: "#fff",
                    fontSize: "9px",
                    padding: "2px 8px",
                    border: "1px solid #fff",
                  }}
                >
                  <i className="ti ti-shield-check me-1"></i> ADMIN
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Employee ID",
      dataIndex: "employee_code",
      sorter: (a: any, b: any) =>
        a.employee_code.localeCompare(b.employee_code),
    },
    {
      title: "Department",
      dataIndex: "department_id",
      render: (dept: any) => (Array.isArray(dept) ? dept[1] : dept || "N/A"),
    },
    {
      title: "Designation",
      dataIndex: "job_id",
      render: (job: any) => (Array.isArray(job) ? job[1] : job || "N/A"),
    },
    {
      title: "Email",
      dataIndex: "private_email",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <span
          className={`badge ${status === "active" ? "badge-soft-success" : "badge-soft-danger"} d-inline-flex align-items-center`}
        >
          <i className="ti ti-circle-filled me-1"></i>
          {status?.toUpperCase() || "ACTIVE"}
        </span>
      ),
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-icon btn-sm btn-soft-primary"
            onClick={() => handleEditClick(record)}
          >
            <i className="ti ti-edit"></i>
          </button>
          <button
            className="btn btn-icon btn-sm btn-soft-danger"
            onClick={() => handleDeleteEmployee(record.id)}
          >
            <i className="ti ti-trash"></i>
          </button>
        </div>
      ),
    },
  ];

  // Get unique departments for filter dropdown
  const uniqueDepts = Array.from(
    new Set(
      employees.map((emp: any) =>
        Array.isArray(emp.department_id)
          ? emp.department_id[1]
          : emp.department_id,
      ),
    ),
  ).filter(Boolean);

  return (
    <div className="page-wrapper">
      <div className="content">
        <CommonHeader
          title="Employee Directory"
          parentMenu="HR"
          activeMenu="Employees"
          routes={all_routes}
          showViewToggle={true}
          viewType={viewType}
          onViewChange={setViewType}
          buttonText="Add New Employee"
          modalTarget="#add_employee_modal"
        />

        {/* ✅ Filter Interface */}
        <div className="card mb-4 shadow-sm border-0">
          <div className="card-body p-3">
            <div className="row g-3 align-items-center">
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="ti ti-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search by name..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                >
                  <option value="">All Departments</option>
                  {uniqueDepts.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-auto ms-auto">
                <button
                  className="btn btn-light"
                  onClick={() => {
                    setSearchText("");
                    setFilterDept("");
                  }}
                >
                  <i className="ti ti-refresh me-1"></i> Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div
            className="row mt-4 position-relative"
            style={{ minHeight: "400px" }}
          >
            <div className="position-absolute top-50 start-50 translate-middle text-center w-100">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {viewType === "grid" ? (
              <div className="row mt-4">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp: any) => (
                    <EmployeeCard
                      key={emp.id}
                      employee={emp}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteEmployee}
                    />
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <h5 className="text-muted">No Matching Employees Found</h5>
                  </div>
                )}
              </div>
            ) : (
              <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                  <DatatableKHR
                    data={filteredEmployees} // ✅ Use filtered data
                    columns={columns}
                    selection={true}
                  />
                </div>
              </div>
            )}
          </>
        )}

        <AddEditEmployeeModal
          data={editData}
          onSuccess={() => {
            fetchEmployees();
            setEditData(null);
          }}
          onClose={() => setEditData(null)}
        />
      </div>
    </div>
  );
};

export default EmployeeKHR;

// =====================================================================================================================================================
// import React, { useEffect, useState } from "react";
// import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
// import AddEditEmployeeModal from "./AddEditEmployeeModal";
// import { getEmployees, deleteEmployee, Employee } from "./EmployeeServices";
// import { toast } from "react-toastify";
// import { all_routes } from "@/router/all_routes";
// import EmployeeCard from "./EmployeeCard";
// import DatatableKHR from "@/CommonComponent/DataTableKHR/DatatableKHR";

// const EmployeeKHR = () => {
//   const routes = all_routes;
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
//   const [editData, setEditData] = useState<any>(null);

//   // ✅ State for view toggle
//   const [viewType, setViewType] = useState<"grid" | "list">("grid");

//   const fetchEmployees = async () => {
//     setLoading(true);
//     try {
//       const data = await getEmployees();
//       setEmployees(data);
//     } catch (error) {
//       console.error("Fetch Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const handleDeleteEmployee = async (id: number) => {
//     if (!window.confirm("Are you sure you want to delete this employee?"))
//       return;
//     try {
//       await deleteEmployee(id.toString());
//       toast.success("Employee deleted successfully");
//       fetchEmployees();
//     } catch (error) {
//       toast.error("Failed to delete employee");
//     }
//   };

//   const handleEditClick = (employee: any) => {
//     setEditData(employee);
//     const modalElement = document.getElementById("add_employee_modal");
//     if (modalElement) {
//       const modal = new (window as any).bootstrap.Modal(modalElement);
//       modal.show();
//     }
//   };

//   // ✅ Define Table Columns for DatatableKHR
//   const columns = [
//     {
//       title: "Name",
//       dataIndex: "name",
//       render: (text: string, record: any) => (
//         <div className="d-flex align-items-center">
//           <div className="avatar avatar-md me-2">
//             <img
//               src={record.image_url || "assets/img/profiles/avatar-02.jpg"}
//               className="rounded-circle"
//               alt="User"
//             />
//           </div>
//           <h6 className="fs-14 fw-medium mb-0">{text}</h6>
//         </div>
//       ),
//       sorter: (a: any, b: any) => a.name.localeCompare(b.name),
//     },
//     {
//       title: "Employee ID",
//       dataIndex: "employee_code",
//       sorter: (a: any, b: any) =>
//         a.employee_code.localeCompare(b.employee_code),
//     },
//     {
//       title: "Department",
//       dataIndex: "department_id",
//       render: (dept: any) => (Array.isArray(dept) ? dept[1] : dept || "N/A"),
//     },
//     {
//       title: "Designation",
//       dataIndex: "job_id",
//       render: (job: any) => (Array.isArray(job) ? job[1] : job || "N/A"),
//     },
//     {
//       title: "Email",
//       dataIndex: "private_email",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       render: (status: string) => (
//         <span
//           className={`badge ${status === "active" ? "badge-soft-success" : "badge-soft-danger"} d-inline-flex align-items-center`}
//         >
//           <i className="ti ti-circle-filled me-1"></i>
//           {status?.toUpperCase() || "ACTIVE"}
//         </span>
//       ),
//     },
//     {
//       title: "Action",
//       render: (_: any, record: any) => (
//         <div className="d-flex align-items-center gap-2">
//           <button
//             className="btn btn-icon btn-sm btn-soft-primary"
//             onClick={() => handleEditClick(record)}
//           >
//             <i className="ti ti-edit"></i>
//           </button>
//           <button
//             className="btn btn-icon btn-sm btn-soft-danger"
//             onClick={() => handleDeleteEmployee(record.id)}
//           >
//             <i className="ti ti-trash"></i>
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="page-wrapper">
//       <div className="content">
//         {/* HEADER AREA */}
//         <div onClick={() => setSelectedEmp(null)}>
//           <CommonHeader
//             title="Employee Directory"
//             parentMenu="HR"
//             activeMenu="Employees"
//             routes={all_routes}
//             showViewToggle={true}
//             viewType={viewType}
//             onViewChange={setViewType}
//             buttonText="Add New Employee"
//             modalTarget="#add_employee_modal"
//           />
//         </div>

//         {loading ? (
//           <div
//             className="row mt-4 position-relative"
//             style={{ minHeight: "400px" }}
//           >
//             <div className="position-absolute top-50 start-50 translate-middle text-center w-100">
//               <div
//                 className="spinner-border text-primary"
//                 role="status"
//                 style={{ width: "2.5rem", height: "2.5rem" }}
//               >
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//               <p className="mt-2 text-muted fs-13">Loading data...</p>
//             </div>
//           </div>
//         ) : (
//           <>
//             {/* ✅ Conditional View Rendering */}
//             {viewType === "grid" ? (
//               <div className="row mt-4">
//                 {employees.length > 0 ? (
//                   employees.map((emp: any) => (
//                     <EmployeeCard
//                       key={emp.id}
//                       employee={emp}
//                       onEdit={handleEditClick}
//                       onDelete={handleDeleteEmployee}
//                     />
//                   ))
//                 ) : (
//                   <div className="col-12 text-center py-5">
//                     <h5 className="text-muted">No Employees Found</h5>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               // ✅ List View (DataTable)
//               <div className="card mt-4 shadow-sm border-0">
//                 <div className="card-body p-0">
//                   <DatatableKHR
//                     data={employees}
//                     columns={columns}
//                     selection={true}
//                   />
//                 </div>
//               </div>
//             )}
//           </>
//         )}

//         {/* MODAL */}
//         <AddEditEmployeeModal
//           data={editData}
//           onSuccess={() => {
//             fetchEmployees();
//             setEditData(null);
//           }}
//           onClose={() => setEditData(null)}
//         />
//       </div>
//     </div>
//   );
// };

// export default EmployeeKHR;

// ==========================================================================================================================================================

// import React, { useEffect, useState } from "react";
// import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
// import AddEditEmployeeModal from "./AddEditEmployeeModal";
// import { getEmployees, deleteEmployee, Employee } from "./EmployeeServices";
// import { toast } from "react-toastify";
// import { all_routes } from "@/router/all_routes";
// import EmployeeCard from "./EmployeeCard";

// const EmployeeKHR = () => {
//   const routes = all_routes;
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
//   const [editData, setEditData] = useState<any>(null);

//   const fetchEmployees = async () => {
//     setLoading(true);
//     try {
//       const data = await getEmployees();

//       setEmployees(data);
//     } catch (error) {
//       console.error("Fetch Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const handleDeleteEmployee = async (id: number) => {
//     if (!window.confirm("Are you sure you want to delete this employee?"))
//       return;
//     try {
//       await deleteEmployee(id.toString());
//       toast.success("Employee deleted successfully");
//       fetchEmployees();
//     } catch (error) {
//       toast.error("Failed to delete employee");
//     }
//   };

//   const handleEditClick = (employee: any) => {
//     setEditData(employee);
//     // Explicitly open modal
//     const modalElement = document.getElementById("add_employee_modal");
//     if (modalElement) {
//       const modal = new (window as any).bootstrap.Modal(modalElement);
//       modal.show();
//     }
//   };

//   return (
//     <div className="page-wrapper">
//       <div className="content">
//         {/* HEADER AREA */}
//         <div onClick={() => setSelectedEmp(null)}>
//           <CommonHeader
//             title="Employee Directory"
//             parentMenu="HR"
//             activeMenu="Employees"
//             routes={all_routes}
//             showViewToggle={true}
//             viewType={viewType} // Pass current state
//             onViewChange={setViewType} // Pass state setter
//             buttonText="Add New Employee"
//             modalTarget="#add_employee_modal"
//           />
//         </div>

//         {/* LOADING & CONTENT AREA */}
//         <div
//           className="row mt-4 position-relative"
//           style={{ minHeight: "400px" }}
//         >
//           {loading ? (
//             // --- CENTERED SPINNER ---
//             <div className="position-absolute top-50 start-50 translate-middle text-center w-100">
//               <div
//                 className="spinner-border text-primary"
//                 role="status"
//                 style={{ width: "2.5rem", height: "2.5rem" }}
//               >
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//               <p className="mt-2 text-muted fs-13">Loading data...</p>
//             </div>
//           ) : (
//             // --- GRID ---
//             <>
//               {employees.length > 0 ? (
//                 employees.map((emp: any) => (
//                   <EmployeeCard
//                     key={emp.id}
//                     employee={emp}
//                     onEdit={handleEditClick}
//                     onDelete={handleDeleteEmployee}
//                   />
//                 ))
//               ) : (
//                 <div className="col-12 text-center py-5">
//                   <h5 className="text-muted">No Employees Found</h5>
//                   <p className="text-muted fs-13">
//                     Add an employee to see them here.
//                   </p>
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         {/* MODAL */}
//         <AddEditEmployeeModal
//           data={editData}
//           onSuccess={() => {
//             fetchEmployees();
//             setEditData(null);
//           }}
//           onClose={() => setEditData(null)}
//         />
//       </div>
//     </div>
//   );
// };

// export default EmployeeKHR;
