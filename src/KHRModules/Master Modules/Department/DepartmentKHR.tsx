import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddDepartmentModal from "./AddDepartmentModal";

// Service Imports
import {
  getDepartments,
  deleteDepartment,
  Department,
} from "./departmentService";
import { toast } from "react-toastify";

interface GroupedData {
  groupName: string;
  items: Department[];
  count: number;
  isGroup: boolean;
}

const DepartmentKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  // Group by functionality
  const [groupBy, setGroupBy] = useState<string>("none");
  const [groupedData, setGroupedData] = useState<GroupedData[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // 1. Fetch & Map Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await getDepartments();

      // Safety Check: Backend might return { data: [...] } or just [...]
      const rawArray = Array.isArray(response)
        ? response
        : response?.data && Array.isArray(response.data)
          ? response.data
          : [];

      const mappedData: Department[] = rawArray.map((item: any) => ({
        id: String(item.id),
        key: String(item.id), // Datatable often requires a unique key
        Department_Name: item.name || "-",
        Department_Head: item.manager?.name || "No Manager",
        Created_Date: item.created_at || "-",
        Status: "Active",
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load departments", error);
      toast.error("Failed to load department list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        const response = await deleteDepartment(id);
        const successMessage =
          response.data?.message || "Department deleted successfully";
        toast.success(successMessage);

        fetchData();
      } catch (error: any) {
        // Error handling (already added previously)
        const errorMessage =
          error.response?.data?.message || "Failed to delete department";
        toast.error(errorMessage);
        console.error("Delete failed:", error);
      }
    }
  };
  // Group by functionality
  const groupByOptions = [
    { value: "none", label: "No Grouping" },
    { value: "department_type", label: "Group by Department Type" },
    { value: "business_type", label: "Group by Business Type" },
    { value: "manager_status", label: "Group by Manager Status" },
    { value: "name_length", label: "Group by Name Length" },
    { value: "created_month", label: "Group by Created Month" },
    { value: "alphabetical", label: "Group by First Letter" },
  ];

  const getDepartmentType = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("hr") || lowerName.includes("human"))
      return "Human Resources";
    if (
      lowerName.includes("it") ||
      lowerName.includes("tech") ||
      lowerName.includes("development")
    )
      return "Technology";
    if (
      lowerName.includes("finance") ||
      lowerName.includes("accounting") ||
      lowerName.includes("budget")
    )
      return "Finance";
    if (
      lowerName.includes("sales") ||
      lowerName.includes("marketing") ||
      lowerName.includes("business")
    )
      return "Sales & Marketing";
    if (
      lowerName.includes("operation") ||
      lowerName.includes("admin") ||
      lowerName.includes("management")
    )
      return "Operations";
    if (lowerName.includes("legal") || lowerName.includes("compliance"))
      return "Legal & Compliance";
    if (
      lowerName.includes("support") ||
      lowerName.includes("service") ||
      lowerName.includes("help")
    )
      return "Support Services";
    return "General";
  };

  const getBusinessType = (name: string) => {
    const lowerName = name.toLowerCase();
    if (
      lowerName.includes("core") ||
      lowerName.includes("main") ||
      lowerName.includes("primary")
    )
      return "Core Business";
    if (
      lowerName.includes("support") ||
      lowerName.includes("auxiliary") ||
      lowerName.includes("service")
    )
      return "Support Functions";
    if (
      lowerName.includes("strategic") ||
      lowerName.includes("planning") ||
      lowerName.includes("executive")
    )
      return "Strategic";
    if (
      lowerName.includes("operational") ||
      lowerName.includes("production") ||
      lowerName.includes("delivery")
    )
      return "Operational";
    return "Standard";
  };

  const getNameLength = (name: string) => {
    const length = name.length;
    if (length <= 10) return "Short Names (≤10 chars)";
    if (length <= 20) return "Medium Names (11-20 chars)";
    if (length <= 30) return "Long Names (21-30 chars)";
    return "Very Long Names (>30 chars)";
  };

  const getCreatedMonth = (dateString: string) => {
    if (!dateString || dateString === "-") return "Unknown Date";
    try {
      const date = new Date(dateString);
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    } catch {
      return "Invalid Date";
    }
  };

  const getFirstLetter = (name: string) => {
    const letter = name.charAt(0).toUpperCase();
    if (letter >= "A" && letter <= "F") return "A-F";
    if (letter >= "G" && letter <= "L") return "G-L";
    if (letter >= "M" && letter <= "R") return "M-R";
    if (letter >= "S" && letter <= "Z") return "S-Z";
    return "Other";
  };

  const groupDataByField = (
    data: Department[],
    field: string,
  ): GroupedData[] => {
    if (field === "none") return [];

    const grouped = data.reduce((acc: any, item) => {
      let groupKey = "";

      switch (field) {
        case "department_type":
          groupKey = getDepartmentType(item.Department_Name);
          break;
        case "business_type":
          groupKey = getBusinessType(item.Department_Name);
          break;
        case "manager_status":
          groupKey =
            item.Department_Head === "No Manager"
              ? "Without Manager"
              : "With Manager";
          break;
        case "name_length":
          groupKey = getNameLength(item.Department_Name);
          break;
        case "created_month":
          groupKey = getCreatedMonth(item.Created_Date);
          break;
        case "alphabetical":
          groupKey = getFirstLetter(item.Department_Name);
          break;
        default:
          groupKey = "All Departments";
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
      return (
        <DatatableKHR
          data={data}
          columns={columns}
          selection={true}
          textKey="Department_Name"
        />
      );
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
                  {group.count} departments
                </span>
              </div>
              <div className="group-stats">
                <div className="d-flex gap-3">
                  <small className="text-muted">
                    <i className="ti ti-building me-1"></i>
                    Total: <strong>{group.count}</strong>
                  </small>
                  {groupBy === "name_length" && (
                    <small className="text-info">
                      <i className="ti ti-ruler me-1"></i>
                      Avg Length:{" "}
                      <strong>
                        {Math.round(
                          group.items.reduce(
                            (sum, item) => sum + item.Department_Name.length,
                            0,
                          ) / group.count,
                        )}{" "}
                        chars
                      </strong>
                    </small>
                  )}
                  {groupBy === "manager_status" && (
                    <small className="text-success">
                      <i className="ti ti-user-check me-1"></i>
                      With Manager:{" "}
                      <strong>
                        {
                          group.items.filter(
                            (item) => item.Department_Head !== "No Manager",
                          ).length
                        }
                      </strong>
                    </small>
                  )}
                  {groupBy === "department_type" && (
                    <small className="text-primary">
                      <i className="ti ti-category me-1"></i>
                      Type: <strong>{group.groupName}</strong>
                    </small>
                  )}
                  {groupBy === "business_type" && (
                    <small className="text-warning">
                      <i className="ti ti-briefcase me-1"></i>
                      Business: <strong>{group.groupName}</strong>
                    </small>
                  )}
                  {groupBy === "created_month" && (
                    <small className="text-info">
                      <i className="ti ti-calendar me-1"></i>
                      Period: <strong>{group.groupName}</strong>
                    </small>
                  )}
                  {groupBy === "alphabetical" && (
                    <small className="text-secondary">
                      <i className="ti ti-alphabet me-1"></i>
                      Range: <strong>{group.groupName}</strong>
                    </small>
                  )}
                  <small className="text-muted">
                    <i className="ti ti-list me-1"></i>
                    Sample:{" "}
                    <strong>
                      {group.items[0]?.Department_Name.substring(0, 15)}
                      {group.items[0]?.Department_Name.length > 15 ? "..." : ""}
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
                  textKey="Department_Name"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // 2. Define Columns - Ensure dataIndex matches the keys in mappedData
  const columns = [
    {
      title: "Department Name",
      dataIndex: "Department_Name",
      render: (text: string) => (
        <span className="fs-14 fw-medium text-dark">{text}</span>
      ),
      sorter: (a: Department, b: Department) =>
        a.Department_Name.localeCompare(b.Department_Name),
    },
    // {
    //   title: "Department Head",
    //   dataIndex: "Department_Head",
    //   sorter: (a: Department, b: Department) =>
    //     a.Department_Head.localeCompare(b.Department_Head),
    // },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: Department) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_department"
            onClick={() => setSelectedDepartment({ ...record })}
          >
            <i className="ti ti-edit text-blue" />
          </Link>
          <Link to="#" onClick={() => handleDelete(record.id!)}>
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
          <div onClick={() => setSelectedDepartment(null)}>
            <CommonHeader
              title="Department"
              parentMenu="HR"
              activeMenu="Department"
              routes={routes}
              buttonText="Add Department"
              modalTarget="#add_department"
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
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center p-5">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>
                  <div className="mt-2">Loading Departments...</div>
                </div>
              ) : (
                <>
                  {/* Group By Info */}
                  {groupBy !== "none" && (
                    <div className="alert alert-info m-3 mb-0 d-flex justify-content-between align-items-center">
                      <div>
                        <i className="ti ti-info-circle me-2"></i>
                        <strong>Grouped by:</strong>{" "}
                        {
                          groupByOptions.find((opt) => opt.value === groupBy)
                            ?.label
                        }
                        <span className="ms-2">
                          ({groupedData.length} groups, {data.length} total
                          departments)
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
                  <div className="p-3">{renderGroupedTable()}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Component */}
      <AddDepartmentModal
        onSuccess={fetchData}
        data={selectedDepartment}
        onClose={() => setSelectedDepartment(null)}
      />
    </>
  );
};

export default DepartmentKHR;
