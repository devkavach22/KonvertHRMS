import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditJobPositionModal from "./AddEditJobPosition";
// Service Imports
import { getJobs, deleteJob, JobPosition as JobType } from "./jobService";
import { toast } from "react-toastify";

// Extended interface for the component with mapped display properties
interface JobPositionDisplay extends JobType {
  key: string;
  department_name?: string;
  industry_name?: string;
  contract_type_name?: string;
  skill_names?: string[];
}

interface GroupedData {
  groupName: string;
  items: JobPositionDisplay[];
  count: number;
  isGroup: boolean;
}

const JobPosition = () => {
  const routes = all_routes;

  const [data, setData] = useState<JobPositionDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedJob, setSelectedJob] = useState<JobPositionDisplay | null>(
    null,
  );

  // Group by functionality
  const [groupBy, setGroupBy] = useState<string>("none");
  const [groupedData, setGroupedData] = useState<GroupedData[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

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
        const response = await deleteJob(id);
        const successMessage =
          response.data?.message || "Job position deleted successfully";
        toast.success(successMessage);

        fetchData();
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Delete failed";
        toast.error(errorMessage);
        console.error("Delete failed:", error);
      }
    }
  };
  // Group by functionality
  const groupByOptions = [
    { value: "none", label: "No Grouping" },
    { value: "department", label: "Group by Department" },
    { value: "industry", label: "Group by Industry" },
    { value: "contract_type", label: "Group by Contract Type" },
    { value: "openings_range", label: "Group by Openings Range" },
    { value: "alphabetical", label: "Group by First Letter" },
  ];

  const getFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase();
  };

  const getJobCategory = (name: string) => {
    const lowerName = name.toLowerCase();
    if (
      lowerName.includes("manager") ||
      lowerName.includes("director") ||
      lowerName.includes("head") ||
      lowerName.includes("lead")
    )
      return "Management";
    if (
      lowerName.includes("developer") ||
      lowerName.includes("engineer") ||
      lowerName.includes("programmer") ||
      lowerName.includes("tech")
    )
      return "Technology";
    if (
      lowerName.includes("sales") ||
      lowerName.includes("marketing") ||
      lowerName.includes("business")
    )
      return "Sales & Marketing";
    if (
      lowerName.includes("hr") ||
      lowerName.includes("human") ||
      lowerName.includes("recruiter")
    )
      return "Human Resources";
    if (
      lowerName.includes("finance") ||
      lowerName.includes("accounting") ||
      lowerName.includes("analyst")
    )
      return "Finance";
    if (
      lowerName.includes("designer") ||
      lowerName.includes("creative") ||
      lowerName.includes("ui") ||
      lowerName.includes("ux")
    )
      return "Design & Creative";
    if (
      lowerName.includes("support") ||
      lowerName.includes("service") ||
      lowerName.includes("help")
    )
      return "Support";
    if (
      lowerName.includes("admin") ||
      lowerName.includes("assistant") ||
      lowerName.includes("coordinator")
    )
      return "Administrative";
    if (
      lowerName.includes("intern") ||
      lowerName.includes("trainee") ||
      lowerName.includes("junior")
    )
      return "Entry Level";
    return "General";
  };

  const getOpeningsRange = (openings: number) => {
    if (openings === 0) return "No Openings";
    if (openings === 1) return "Single Opening";
    if (openings <= 5) return "Small Team (2-5)";
    if (openings <= 15) return "Medium Team (6-15)";
    if (openings <= 50) return "Large Team (16-50)";
    return "Mass Hiring (50+)";
  };

  const groupDataByField = (
    data: JobPositionDisplay[],
    field: string,
  ): GroupedData[] => {
    if (field === "none") return [];

    const grouped = data.reduce((acc: any, item) => {
      let groupKey = "";

      switch (field) {
        case "department":
          groupKey = item.department_name || "No Department";
          break;
        case "industry":
          groupKey = item.industry_name || "No Industry";
          break;
        case "contract_type":
          groupKey = item.contract_type_name || "Not Set";
          break;
        case "openings_range":
          groupKey = getOpeningsRange(item.no_of_recruitment);
          break;
        case "alphabetical":
          groupKey = getFirstLetter(item.name);
          break;
        case "job_category":
          groupKey = getJobCategory(item.name);
          break;
        default:
          groupKey = "All Jobs";
      }

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    }, {});

    // Sort groups alphabetically
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([groupName, items]: [string, any]): GroupedData => ({
          groupName,
          items,
          count: items.length,
          isGroup: true,
        }),
      );
  };

  const toggleGroupExpansion = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  const toggleAllGroups = (expand: boolean) => {
    if (expand) {
      setExpandedGroups(new Set(groupedData.map((group) => group.groupName)));
    } else {
      setExpandedGroups(new Set());
    }
  };

  const handleGroupByChange = (value: string) => {
    setGroupBy(value);
    if (value === "none") {
      setGroupedData([]);
      setExpandedGroups(new Set());
    } else {
      const grouped = groupDataByField(data, value);
      setGroupedData(grouped);
      // Expand first group by default
      if (grouped.length > 0) {
        setExpandedGroups(new Set([grouped[0].groupName]));
      }
    }
  };

  // Update grouped data when main data changes
  useEffect(() => {
    if (data.length > 0 && groupBy !== "none") {
      handleGroupByChange(groupBy);
    }
  }, [data]);

  const renderGroupedTable = () => {
    if (groupBy === "none") {
      return <DatatableKHR data={data} columns={columns} selection={true} />;
    }

    return (
      <div className="grouped-table">
        {groupedData.map((group: GroupedData, groupIndex: number) => (
          <div
            key={`group-${groupIndex}-${group.groupName}`}
            className="group-section mb-4"
            style={{
              border: "1px solid #e9ecef",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {/* Group Header */}
            <div
              className="group-header bg-light p-3 border rounded cursor-pointer d-flex justify-content-between align-items-center"
              onClick={() => toggleGroupExpansion(group.groupName)}
              style={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid #e9ecef",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f8f9fa";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f8f9fa";
              }}
            >
              <div className="d-flex align-items-center">
                <i
                  className={`ti ${expandedGroups.has(group.groupName) ? "ti-chevron-down" : "ti-chevron-right"} me-2`}
                ></i>
                <h6 className="mb-0 fw-bold">{group.groupName}</h6>
                <span className="badge badge-primary ms-2">
                  {group.count} positions
                </span>
              </div>
              <div className="group-stats">
                <div className="d-flex gap-3">
                  <small className="text-muted">
                    <i className="ti ti-briefcase me-1"></i>
                    Total: <strong>{group.count}</strong>
                  </small>
                  {groupBy === "openings_range" && (
                    <small className="text-info">
                      <i className="ti ti-users me-1"></i>
                      Total Openings:{" "}
                      <strong>
                        {group.items.reduce(
                          (sum, item) => sum + item.no_of_recruitment,
                          0,
                        )}
                      </strong>
                    </small>
                  )}
                  {groupBy === "contract_type" && (
                    <small className="text-success">
                      <i className="ti ti-file-text me-1"></i>
                      Avg Openings:{" "}
                      <strong>
                        {Math.round(
                          group.items.reduce(
                            (sum, item) => sum + item.no_of_recruitment,
                            0,
                          ) / group.count,
                        )}
                      </strong>
                    </small>
                  )}
                  <small className="text-warning">
                    <i className="ti ti-list me-1"></i>
                    Sample:{" "}
                    <strong>
                      {group.items[0]?.name.substring(0, 20)}
                      {group.items[0]?.name.length > 20 ? "..." : ""}
                    </strong>
                  </small>
                </div>
              </div>
            </div>

            {/* Group Content */}
            {expandedGroups.has(group.groupName) && (
              <div
                className="group-content mt-2"
                style={{ borderTop: "1px solid #e9ecef" }}
              >
                <DatatableKHR
                  data={group.items}
                  columns={columns}
                  selection={true}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const columns = [
    {
      title: "Job Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: JobPositionDisplay, b: JobPositionDisplay) =>
        a.name.localeCompare(b.name),
      render: (text: string) => (
        <span className="fw-bold text-dark">{text}</span>
      ),
    },
    {
      title: "Department",
      dataIndex: "department_name",
      key: "department_name",
      sorter: (a: JobPositionDisplay, b: JobPositionDisplay) =>
        (a.department_name || "").localeCompare(b.department_name || ""),
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
      render: (_: any, record: JobPositionDisplay) => (
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
            title="Designation"
            parentMenu="Master's"
            activeMenu="Designation"
            routes={routes}
            buttonText="Add Designation"
            modalTarget="#add_job_modal"
            rightActions={
              <>
                {/* Group By Dropdown */}
                <div className="dropdown me-2">
                  <button
                    className="btn btn-outline-primary dropdown-toggle d-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    <i className="ti ti-layout-grid me-1" />
                    {groupByOptions.find((opt) => opt.value === groupBy)
                      ?.label || "Group By"}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    {groupByOptions.map((option) => (
                      <li key={option.value}>
                        <button
                          className={`dropdown-item ${groupBy === option.value ? "active" : ""}`}
                          onClick={() => handleGroupByChange(option.value)}
                        >
                          <i
                            className={`ti ${groupBy === option.value ? "ti-check" : "ti-point"} me-2`}
                          />
                          {option.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            }
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
              <>
                {/* Group By Info */}
                {groupBy !== "none" && (
                  <div className="alert alert-info mb-3 d-flex justify-content-between align-items-center">
                    <div>
                      <i className="ti ti-info-circle me-2"></i>
                      <strong>Grouped by:</strong>{" "}
                      {
                        groupByOptions.find((opt) => opt.value === groupBy)
                          ?.label
                      }
                      <span className="ms-2">
                        ({groupedData.length} groups, {data.length} total
                        positions)
                      </span>
                    </div>
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => toggleAllGroups(true)}
                        title="Expand All Groups"
                      >
                        <i className="ti ti-chevrons-down me-1"></i>
                        Expand All
                      </button>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => toggleAllGroups(false)}
                        title="Collapse All Groups"
                      >
                        <i className="ti ti-chevrons-up me-1"></i>
                        Collapse All
                      </button>
                    </div>
                  </div>
                )}

                {/* Render Table or Grouped Table */}
                {renderGroupedTable()}
              </>
            )}
          </div>
        </div>
      </div>
      <AddEditJobPositionModal
        onSuccess={fetchData}
        data={selectedJob}
        onClose={() => setSelectedJob(null)}
      />
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
