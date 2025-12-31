import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditJobPositionModal from "./AddEditJobPosition";
import { getJobs, deleteJob, JobPosition as JobType } from "./jobService";
import { toast } from "react-toastify";

const JobPosition = () => {
  const routes = all_routes;

  const [data, setData] = useState<JobType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedJob, setSelectedJob] = useState<JobType | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getJobs();

      // Robust extraction based on your JSON object { status, message, data: [...] }
      const rawArray = Array.isArray(response)
        ? response
        : response?.data || [];

      const mapped = rawArray.map((item: any) => ({
        ...item,
        // Using job_id from your specific JSON object
        id: String(item.job_id),
        key: String(item.job_id),
        // Ensuring strings for display
        name: item.name || "N/A",
        department_name: item.department_name || "-",
        industry_name: item.industry_name || "-",
        contract_type_name: item.contract_type_name || "Not Set",
        no_of_recruitment: item.no_of_recruitment || 0,
        // Mapping skills if they exist in the response, otherwise empty array
        skill_names: item.skill_names || [],
      }));

      setData(mapped);
    } catch (error) {
      toast.error("Failed to load job positions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this job position?")) {
      try {
        await deleteJob(id);
        toast.success("Job position deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const columns = [
    {
      title: "Job Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: JobType, b: JobType) => a.name.localeCompare(b.name),
      render: (text: string) => (
        <span className="fw-bold text-dark">{text}</span>
      ),
    },
    {
      title: "Department",
      dataIndex: "department_name",
      key: "department_name",
      sorter: (a: any, b: any) =>
        a.department_name.localeCompare(b.department_name),
    },
    {
      title: "Industry",
      dataIndex: "industry_name",
      key: "industry_name",
      render: (text: string) => <span className="text-muted">{text}</span>,
    },
    {
      title: "Contract",
      dataIndex: "contract_type_name",
      key: "contract_type_name",
      render: (text: string) => (
        <span
          className={`badge ${
            text === "Not Set" ? "bg-light text-dark" : "bg-soft-info text-info"
          }`}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Openings",
      dataIndex: "no_of_recruitment",
      key: "no_of_recruitment",
      render: (num: number) => (
        <span className="badge bg-soft-secondary">{num}</span>
      ),
    },
    // {
    //   title: "Skills",
    //   dataIndex: "skill_names",
    //   key: "skill_names",
    //   render: (skills: string[]) => (
    //     <div className="d-flex flex-wrap gap-1">
    //       {skills && skills.length > 0 ? (
    //         skills.map((s, i) => (
    //           <span key={i} className="badge bg-soft-primary text-primary">
    //             {s}
    //           </span>
    //         ))
    //       ) : (
    //         <span className="text-muted fs-11">No skills listed</span>
    //       )}
    //     </div>
    //   ),
    // },
    {
      title: "Actions",
      dataIndex: "id",
      key: "id",
      render: (_: any, record: JobType) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_job_modal"
            onClick={() => setSelectedJob(record)}
          >
            <i className="ti ti-edit text-primary" />
          </Link>
          <Link to="#" onClick={() => handleDelete(record.id!)}>
            <i className="ti ti-trash text-danger" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content">
        <div onClick={() => setSelectedJob(null)}>
          <CommonHeader
            title="Job Positions"
            parentMenu="Master's"
            activeMenu="Job Positions"
            routes={routes}
            buttonText="Add Job Position"
            modalTarget="#add_job_modal"
          />
        </div>
        <div className="card">
          <div className="card-body">
            {loading ? (
              <div className="text-center p-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <DatatableKHR data={data} columns={columns} selection={true} />
            )}
          </div>
        </div>
      </div>
      <AddEditJobPositionModal onSuccess={fetchData} data={selectedJob} />
    </div>
  );
};

export default JobPosition;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { all_routes } from "../../../router/all_routes";
// import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
// import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
// import AddDepartmentModal from "../../Master Modules/Department/AddDepartmentModal";

// // Service Imports
// import {
//   getDepartments,
//   deleteDepartment,
//   // Department, // Removed import to redefine locally based on your payload
// } from "../../Master Modules/Department/departmentService";

// // Defined based on your JSON payload + UI requirements
// export interface Department {
//   id?: string;
//   name: string;
//   parent_id: number | null;
//   color: number;
//   unit_code: string;
//   range_start: number;
//   range_end: number;
//   is_no_range: boolean;
//   is_lapse_allocation: boolean;
//   wage: number;

//   // UI Specific fields for DataTable
//   Department_Name?: string;
//   Department_Head?: string;
//   Status?: string;
//   Created_Date?: string;
//   key?: string;
// }

// const JobPosition = () => {
//   const routes = all_routes;
//   const [data, setData] = useState<Department[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   // State to track the department being edited (null = Add Mode)
//   const [selectedDepartment, setSelectedDepartment] =
//     useState<Department | null>(null);

//   // 1. Fetch & Map Data
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const result = await getDepartments();
//       const safeResult = Array.isArray(result) ? result : [];

//       // Map data while KEEPING original fields for the Edit Modal
//       const mappedData: Department[] = safeResult.map((item: any) => ({
//         ...item, // Spread original data (wage, unit_code, color, etc.)
//         id: String(item.id),
//         key: String(item.id),

//         // Mapped UI fields for the Table
//         Department_Name: item.name || "-",
//         Department_Head: item.manager?.name || "-",
//         Created_Date: item.created_at || "-", // Assuming backend sends created_at
//         Status: "Active",
//       }));

//       setData(mappedData);
//     } catch (error) {
//       console.error("Failed to load departments", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleDelete = async (id: string) => {
//     if (window.confirm("Are you sure you want to delete this department?")) {
//       await deleteDepartment(id);
//       fetchData();
//     }
//   };

//   // 2. Define Columns
//   const columns = [
//     {
//       title: "Name",
//       dataIndex: "Department_Name",
//       render: (text: string, record: Department) => (
//         <div className="d-flex align-items-center gap-2">
//           {/* Visualizing the 'color' field as a dot */}
//           <span
//             style={{
//               width: "10px",
//               height: "10px",
//               borderRadius: "50%",
//               backgroundColor: record.color === 3 ? "green" : "gray", // Logic for color mapping
//               display: "inline-block",
//             }}
//             title={`Color Code: ${record.color}`}
//           ></span>
//           <h6 className="fs-14 fw-medium mb-0">{text}</h6>
//         </div>
//       ),
//       sorter: (a: Department, b: Department) =>
//         (a.Department_Name || "").length - (b.Department_Name || "").length,
//     },
//     {
//       title: "Unit Code",
//       dataIndex: "unit_code",
//       sorter: (a: Department, b: Department) =>
//         (a.unit_code || "").localeCompare(b.unit_code || ""),
//     },
//     {
//       title: "Wage",
//       dataIndex: "wage",
//       render: (wage: number) => <span>${wage?.toLocaleString()}</span>,
//       sorter: (a: Department, b: Department) => a.wage - b.wage,
//     },
//     {
//       title: "Range",
//       dataIndex: "range_start",
//       render: (_: any, record: Department) => (
//         <span>
//           {record.is_no_range
//             ? "No Range"
//             : `${record.range_start} - ${record.range_end}`}
//         </span>
//       ),
//     },
//     {
//       title: "Lapse Alloc.",
//       dataIndex: "is_lapse_allocation",
//       render: (isLapse: boolean) => (
//         <span
//           className={`badge ${
//             isLapse ? "bg-success-light" : "bg-danger-light"
//           }`}
//         >
//           {isLapse ? "Yes" : "No"}
//         </span>
//       ),
//     },
//     {
//       title: "Department Head",
//       dataIndex: "Department_Head",
//       sorter: (a: Department, b: Department) =>
//         (a.Department_Head || "").length - (b.Department_Head || "").length,
//     },
//     {
//       title: "Actions",
//       dataIndex: "id",
//       // Use 'record' to access the full Department object
//       render: (_: any, record: Department) => (
//         <div className="action-icon d-inline-flex">
//           <Link
//             to="#"
//             className="me-2"
//             data-bs-toggle="modal"
//             data-bs-target="#add_department"
//             onClick={() => setSelectedDepartment(record)} // Passes full object (inc. wage, color)
//           >
//             <i className="ti ti-edit" />
//           </Link>
//           <Link to="#" onClick={() => handleDelete(String(record.id))}>
//             <i className="ti ti-trash" />
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
//             {/* Wrapper to handle "Add" click: Reset state to null */}
//             <div onClick={() => setSelectedDepartment(null)}>
//               <CommonHeader
//                 title="Job Positions"
//                 parentMenu="Master's"
//                 activeMenu="Job Positions"
//                 routes={routes}
//                 buttonText="Add Job Positions"
//                 modalTarget="#job_PositionsModal"
//               />
//             </div>

//             <div className="card">
//               <div className="card-body">
//                 {loading ? (
//                   <div className="text-center p-4">Loading data...</div>
//                 ) : (
//                   <DatatableKHR
//                     data={data}
//                     columns={columns}
//                     selection={true}
//                     statusKey="Status"
//                     textKey="Department_Name"
//                     dateKey="Created_Date"
//                   />
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
//             <p className="mb-0">2014 - 2025 © Konvert HR.</p>
//           </div>
//         </div>

//         {/* Pass selectedDepartment (null for Add, Object for Edit) */}
//         {/* <AddDepartmentModal onSuccess={fetchData} data={selectedDepartment} /> */}
//       </div>
//     </>
//   );
// };

// export default JobPosition;
