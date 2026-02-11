import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditAttendancePolicyModal from "./AddEditAttendancePolicyModal";
import moment from "moment";
import { toast } from "react-toastify";

import {
  getAttendancePolicies,
  deleteAttendancePolicy,
  AttendancePolicy as AttendancePolicyType,
  APIAttendancePolicy,
} from "./AttendancePolicyServices";

interface GroupedData {
  groupName: string;
  items: AttendancePolicyType[];
  count: number;
  isGroup: boolean;
}

const AttendancePolicy = () => {
  const routes = all_routes;
  const [data, setData] = useState<AttendancePolicyType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPolicy, setSelectedPolicy] =
    useState<AttendancePolicyType | null>(null);

  // Group by functionality
  const [groupBy, setGroupBy] = useState<string>('none');
  const [groupedData, setGroupedData] = useState<GroupedData[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAttendancePolicies();
      const safeResult = Array.isArray(result) ? result : [];

      const mappedData: AttendancePolicyType[] = safeResult.map(
        (item: APIAttendancePolicy) => {
          const safeName = typeof item.name === "string" ? item.name : "-";

          return {
            id: String(item.id),
            key: String(item.id),
            name: safeName,
            type: item.type || "regular",
            absent_if: item.absent_if || "in_out_abs",
            day_after: item.day_after || 0,
            grace_minutes: item.grace_minutes || 0,
            no_pay_minutes: item.no_pay_minutes || 0,
            half_day_minutes: item.half_day_minutes || 0,
            early_grace_minutes: item.early_grace_minutes || 0,
            late_beyond_days: item.late_beyond_days || 0,
            late_beyond_time: item.late_beyond_time || 0,
            created_date: item.create_date || "-",
          };
        },
      );

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load policies", error);
      toast.error("Failed to load attendance policies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      try {
        await deleteAttendancePolicy(id);
        toast.success("Policy deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete policy");
      }
    }
  };

  // Group by functionality
  const groupByOptions = [
    { value: 'none', label: 'No Grouping' },
    { value: 'type', label: 'Group by Type' },
    { value: 'absent_condition', label: 'Group by Absent Condition' },
    { value: 'grace_time', label: 'Group by Grace Time' },
    { value: 'created_month', label: 'Group by Created Month' }
  ];

  const getCreatedMonth = (date: string) => {
    if (!date || date === "-") return "Unknown";
    return moment(date).format('MMMM YYYY');
  };

  const getGraceTimeCategory = (minutes: number) => {
    if (minutes === 0) return "No Grace Time";
    if (minutes <= 5) return "1-5 Minutes";
    if (minutes <= 15) return "6-15 Minutes";
    if (minutes <= 30) return "16-30 Minutes";
    return "30+ Minutes";
  };

  const groupDataByField = (data: AttendancePolicyType[], field: string): GroupedData[] => {
    if (field === 'none') return [];

    const grouped = data.reduce((acc: any, item) => {
      let groupKey = '';
      
      switch (field) {
        case 'type':
          groupKey = item.type.charAt(0).toUpperCase() + item.type.slice(1);
          break;
        case 'absent_condition':
          groupKey = item.absent_if.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          break;
        case 'grace_time':
          groupKey = getGraceTimeCategory(item.grace_minutes);
          break;
        case 'created_month':
          groupKey = getCreatedMonth(item.created_date || "-");
          break;
        default:
          groupKey = 'All Policies';
      }

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    }, {});

    return Object.entries(grouped).map(([groupName, items]: [string, any]): GroupedData => ({
      groupName,
      items,
      count: items.length,
      isGroup: true
    }));
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
      setExpandedGroups(new Set(groupedData.map(group => group.groupName)));
    } else {
      setExpandedGroups(new Set());
    }
  };

  const handleGroupByChange = (value: string) => {
    setGroupBy(value);
    if (value === 'none') {
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
    if (data.length > 0 && groupBy) {
      handleGroupByChange(groupBy);
    }
  }, [data, groupBy]);

  const renderGroupedTable = () => {
    if (groupBy === 'none') {
      return <DatatableKHR data={data} columns={columns} selection={true} textKey="name" />;
    }

    return (
      <div className="grouped-table">
        {groupedData.map((group: GroupedData, groupIndex: number) => (
          <div 
            key={`group-${groupIndex}-${group.groupName}`} 
            className="group-section mb-4" 
            style={{
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            {/* Group Header */}
            <div 
              className="group-header bg-light p-3 border rounded cursor-pointer d-flex justify-content-between align-items-center"
              onClick={() => toggleGroupExpansion(group.groupName)}
              style={{ 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid #e9ecef'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
            >
              <div className="d-flex align-items-center">
                <i className={`ti ${expandedGroups.has(group.groupName) ? 'ti-chevron-down' : 'ti-chevron-right'} me-2`}></i>
                <h6 className="mb-0 fw-bold">{group.groupName}</h6>
                <span className="badge badge-primary ms-2">{group.count} policies</span>
              </div>
              <div className="group-stats">
                <div className="d-flex gap-3">
                  <small className="text-muted">
                    <i className="ti ti-file-text me-1"></i>
                    Total: <strong>{group.count}</strong>
                  </small>
                  <small className="text-info">
                    <i className="ti ti-settings me-1"></i>
                    Regular: <strong>{group.items.filter((item: AttendancePolicyType) => item.type === 'regular').length}</strong>
                  </small>
                  <small className="text-warning">
                    <i className="ti ti-clock me-1"></i>
                    Flexible: <strong>{group.items.filter((item: AttendancePolicyType) => item.type === 'flexible').length}</strong>
                  </small>
                  {groupBy === 'grace_time' && (
                    <small className="text-success">
                      <i className="ti ti-hourglass me-1"></i>
                      Avg Grace: <strong>{Math.round(group.items.reduce((sum, item) => sum + item.grace_minutes, 0) / group.count)}min</strong>
                    </small>
                  )}
                </div>
              </div>
            </div>

            {/* Group Content */}
            {expandedGroups.has(group.groupName) && (
              <div className="group-content mt-2" style={{ borderTop: '1px solid #e9ecef' }}>
                <DatatableKHR 
                  data={group.items} 
                  columns={columns} 
                  selection={true}
                  textKey="name"
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
      title: "Policy Name",
      dataIndex: "name",
      render: (text: string) => (
        <h6 className="fs-14 fw-bold text-dark">{text}</h6>
      ),
      sorter: (a: AttendancePolicyType, b: AttendancePolicyType) =>
        a.name.localeCompare(b.name),
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (text: string) => (
        <span className="text-capitalize badge badge-soft-info">{text}</span>
      ),
    },
    {
      title: "Absent Condition",
      dataIndex: "absent_if",
      render: (text: string) => (
        <span className="text-muted">{text.replace(/_/g, " ")}</span>
      ),
    },
    // {
    //   title: "Created Date",
    //   dataIndex: "created_date",
    //   render: (date: string) => {
    //     if (!date || date === "-") return <span>-</span>;
    //     return <span>{moment(date).format("DD MMM YYYY")}</span>;
    //   },
    // },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: AttendancePolicyType) => (
        <div className="d-flex align-items-center">
          <Link
            to="#"
            className="btn btn-sm btn-light me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_attendance_policy"
            onClick={() => setSelectedPolicy(record)}
            title="Edit"
          >
            <i className="ti ti-edit text-blue" />
          </Link>
          <Link
            to="#"
            className="btn btn-sm btn-light"
            onClick={() => handleDelete(record.id!)}
            title="Delete"
          >
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
                title="Attendance Policy"
                parentMenu="HR"
                activeMenu="Policies"
                routes={routes}
                buttonText="Add Policy"
                modalTarget="#add_attendance_policy"
                rightActions={
                  <>
                    {/* Group By Dropdown */}
                    <div className="dropdown me-2">
                      <button
                        className="btn btn-outline-primary dropdown-toggle d-flex align-items-center"
                        data-bs-toggle="dropdown"
                      >
                        <i className="ti ti-layout-grid me-1" />
                        {groupByOptions.find(opt => opt.value === groupBy)?.label || 'Group By'}
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        {groupByOptions.map((option) => (
                          <li key={option.value}>
                            <button
                              className={`dropdown-item ${groupBy === option.value ? 'active' : ''}`}
                              onClick={() => handleGroupByChange(option.value)}
                            >
                              <i className={`ti ${groupBy === option.value ? 'ti-check' : 'ti-point'} me-2`} />
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
            <div className="card shadow-sm">
              <div className="card-body p-0">
                {loading ? (
                  <div className="text-center p-5">
                    <div
                      className="spinner-border text-primary"
                      role="status"
                    ></div>
                    <div className="mt-2">Loading Policies...</div>
                  </div>
                ) : (
                  <>
                    {/* Group By Info */}
                    {groupBy !== 'none' && (
                      <div className="alert alert-info m-3 mb-0 d-flex justify-content-between align-items-center">
                        <div>
                          <i className="ti ti-info-circle me-2"></i>
                          <strong>Grouped by:</strong> {groupByOptions.find(opt => opt.value === groupBy)?.label}
                          <span className="ms-2">
                            ({groupedData.length} groups, {data.length} total policies)
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
                    <div className="p-3">
                      {renderGroupedTable()}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <AddEditAttendancePolicyModal
          onSuccess={fetchData}
          data={selectedPolicy}
          onClose={() => setSelectedPolicy(null)} // <--- ADD THIS LINE
        />
      </div>
    </>
  );
};

export default AttendancePolicy;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { all_routes } from "../../../router/all_routes";
// import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
// import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
// import AddEditAttendancePolicyModal from "./AddEditAttendancePolicyModal";
// import moment from "moment";

// import {
//   getAttendancePolicies,
//   deleteAttendancePolicy,
//   AttendancePolicy as AttendancePolicyType,
//   APIAttendancePolicy,
// } from "./AttendancePolicyServices";

// const AttendancePolicy = () => {
//   const routes = all_routes;
//   const [data, setData] = useState<AttendancePolicyType[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [selectedPolicy, setSelectedPolicy] =
//     useState<AttendancePolicyType | null>(null);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const result = await getAttendancePolicies();
//       const safeResult = Array.isArray(result) ? result : [];

//       const mappedData: AttendancePolicyType[] = safeResult.map(
//         (item: APIAttendancePolicy) => {
//           const safeName = typeof item.name === "string" ? item.name : "-";

//           return {
//             id: String(item.id),
//             key: String(item.id),
//             name: safeName,
//             type: item.type || "regular",
//             absent_if: item.absent_if || "in_out_abs",
//             day_after: item.day_after || 0,
//             grace_minutes: item.grace_minutes || 0,
//             no_pay_minutes: item.no_pay_minutes || 0,
//             half_day_minutes: item.half_day_minutes || 0,
//             early_grace_minutes: item.early_grace_minutes || 0,
//             late_beyond_days: item.late_beyond_days || 0,
//             late_beyond_time: item.late_beyond_time || 0,
//             created_date: item.create_date || "-",
//           };
//         }
//       );

//       setData(mappedData);
//     } catch (error) {
//       console.error("Failed to load policies", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleDelete = async (id: string) => {
//     if (window.confirm("Are you sure you want to delete this policy?")) {
//       await deleteAttendancePolicy(id);
//       fetchData();
//     }
//   };

//   const columns = [
//     {
//       title: "Policy Name",
//       dataIndex: "name",
//       render: (text: string) => <h6 className="fs-14 fw-medium">{text}</h6>,
//       sorter: (a: AttendancePolicyType, b: AttendancePolicyType) =>
//         a.name.length - b.name.length,
//     },
//     {
//       title: "Type",
//       dataIndex: "type",
//       render: (text: string) => <span className="text-capitalize">{text}</span>,
//     },
//     {
//       title: "Absent Condition",
//       dataIndex: "absent_if",
//     },
//     {
//       title: "Created Date",
//       dataIndex: "created_date",
//       render: (date: string) => {
//         if (!date || date === "-") return <span>-</span>;
//         return <span>{moment(date).format("DD MMM YYYY")}</span>;
//       },
//     },
//     {
//       title: "Actions",
//       dataIndex: "id",
//       render: (_: any, record: AttendancePolicyType) => (
//         <div className="action-icon d-inline-flex">
//           <Link
//             to="#"
//             className="me-2"
//             data-bs-toggle="modal"
//             data-bs-target="#add_attendance_policy"
//             onClick={() => setSelectedPolicy(record)}
//           >
//             <i className="ti ti-edit" />
//           </Link>
//           <Link to="#" onClick={() => handleDelete(record.id!)}>
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
//             <div onClick={() => setSelectedPolicy(null)}>
//               <CommonHeader
//                 title="Attendance Policy"
//                 parentMenu="HR"
//                 activeMenu="Policies"
//                 routes={routes}
//                 buttonText="Add Policy"
//                 modalTarget="#add_attendance_policy"
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
//                     textKey="name"
//                   />
//                 )}
//               </div>
//             </div>
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

// export default AttendancePolicy;
