import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import DatatableKHR from "../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditContractModal from "./AddEditContractModal";

// Service Imports
import { getContracts, deleteContract, Contract } from "./contractService";
import { toast } from "react-toastify";

interface GroupedData {
  groupName: string;
  items: Contract[];
  count: number;
  isGroup: boolean;
}

const EmployeeContractKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<Contract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null,
  );

  // Group by functionality
  const [groupBy, setGroupBy] = useState<string>("none");
  const [groupedData, setGroupedData] = useState<GroupedData[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // 1. Fetch & Map Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getContracts();

      // Map the data to include formatted fields
      const mappedData: Contract[] = response.map((item: any) => ({
        ...item,
        id: String(item.id),
        key: String(item.id),
        formatted_wage: `₹${item.wage?.toLocaleString() || "0"}`,
        formatted_date: item.date_start
          ? new Date(item.date_start).toLocaleDateString()
          : "-",
        employee_name: item.employee?.name || "Unknown Employee",
        department_name: item.department?.name || "No Department",
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load contracts", error);
      toast.error("Failed to load contract list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this contract?")) {
      try {
        await deleteContract(id);
        toast.success("Contract deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete contract");
      }
    }
  };

  // Group by functionality
  const groupByOptions = [
    { value: "none", label: "No Grouping" },
    { value: "department", label: "Group by Department" },
    { value: "wage_range", label: "Group by Wage Range" },
    { value: "contract_type", label: "Group by Contract Type" },
    { value: "schedule_pay", label: "Group by Schedule Pay" },
    { value: "work_entry_source", label: "Group by Work Entry Source" },
    { value: "start_month", label: "Group by Start Month" },
    { value: "wage_type", label: "Group by Wage Type" },
  ];

  const getWageTypeLabel = (wageType: string) => {
    switch (wageType) {
      case "monthly":
        return "Fixed Wage";
      case "hourly":
        return "Hourly Wage";
      case "daily":
        return "Daily Attendance";
      default:
        return wageType || "Fixed Wage";
    }
  };

  const getWageRange = (wage: number) => {
    if (wage <= 25000) return "Entry Level (≤25K)";
    if (wage <= 50000) return "Junior Level (25K-50K)";
    if (wage <= 100000) return "Mid Level (50K-100K)";
    if (wage <= 200000) return "Senior Level (100K-200K)";
    return "Executive Level (>200K)";
  };

  const getStartMonth = (dateString: string) => {
    if (!dateString) return "Unknown Date";
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

  const groupDataByField = (data: Contract[], field: string): GroupedData[] => {
    if (field === "none") return [];

    const grouped = data.reduce((acc: any, item) => {
      let groupKey = "";

      switch (field) {
        case "department":
          groupKey = (item as any).department_name || "No Department";
          break;
        case "wage_range":
          groupKey = getWageRange(item.wage);
          break;
        case "contract_type":
          groupKey = item.contract_type_id
            ? `Type ${item.contract_type_id}`
            : "No Type";
          break;
        case "schedule_pay":
          groupKey = item.schedule_pay || "No Schedule";
          break;
        case "work_entry_source":
          groupKey = item.work_entry_source || "No Source";
          break;
        case "start_month":
          groupKey = getStartMonth(item.date_start);
          break;
        case "wage_type":
          groupKey = getWageTypeLabel(item.wage_type);
          break;
        default:
          groupKey = "All Contracts";
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
          textKey="name"
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
                  {group.count} contracts
                </span>
              </div>
              <div className="group-stats">
                <div className="d-flex gap-3">
                  <small className="text-muted">
                    <i className="ti ti-file-text me-1"></i>
                    Total: <strong>{group.count}</strong>
                  </small>
                  {groupBy === "wage_range" && (
                    <small className="text-success">
                      <i className="ti ti-currency-rupee me-1"></i>
                      Avg Wage:{" "}
                      <strong>
                        ₹
                        {Math.round(
                          group.items.reduce(
                            (sum, item) => sum + item.wage,
                            0,
                          ) / group.count,
                        ).toLocaleString()}
                      </strong>
                    </small>
                  )}
                  {groupBy === "department" && (
                    <small className="text-info">
                      <i className="ti ti-building me-1"></i>
                      Dept: <strong>{group.groupName}</strong>
                    </small>
                  )}
                  {groupBy === "schedule_pay" && (
                    <small className="text-warning">
                      <i className="ti ti-calendar me-1"></i>
                      Schedule: <strong>{group.groupName}</strong>
                    </small>
                  )}
                  <small className="text-muted">
                    <i className="ti ti-user me-1"></i>
                    Sample:{" "}
                    <strong>
                      {group.items[0]?.name?.substring(0, 20)}
                      {group.items[0]?.name?.length > 20 ? "..." : ""}
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
                  textKey="name"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // 2. Define Columns
  const columns = [
    {
      title: "Contract Name",
      dataIndex: "name",
      render: (text: string) => (
        <span className="fs-14 fw-medium text-dark">{text}</span>
      ),
      sorter: (a: Contract, b: Contract) => a.name.localeCompare(b.name),
    },
    {
      title: "Employee",
      dataIndex: "employee_name",
      render: (text: string, record: Contract) => (
        <div>
          <div className="fw-medium">{text}</div>
          <small className="text-muted">{record.employee_code}</small>
        </div>
      ),
      sorter: (a: any, b: any) =>
        (a.employee_name || "").localeCompare(b.employee_name || ""),
    },
    {
      title: "Department",
      dataIndex: "department_name",
      sorter: (a: any, b: any) =>
        (a.department_name || "").localeCompare(b.department_name || ""),
    },
    {
      title: "Wage (CTC)",
      dataIndex: "formatted_wage",
      render: (text: string, record: Contract) => (
        <div>
          <div className="fw-medium text-success">{text}</div>
          <small className="text-muted">
            {getWageTypeLabel(record.wage_type)}
          </small>
        </div>
      ),
      sorter: (a: Contract, b: Contract) => a.wage - b.wage,
    },
    {
      title: "Start Date",
      dataIndex: "formatted_date",
      sorter: (a: Contract, b: Contract) =>
        new Date(a.date_start).getTime() - new Date(b.date_start).getTime(),
    },
    {
      title: "Work Entry",
      dataIndex: "work_entry_source",
      render: (text: string) => (
        <span
          className={`badge ${text === "calendar" ? "badge-info" : "badge-warning"}`}
        >
          {text === "calendar" ? "Working Schedule" : "Attendances"}
        </span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: Contract) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_contract"
            onClick={() => setSelectedContract({ ...record })}
          >
            <i className="ti ti-edit text-blue" />
          </Link>

          {/* <Link to="#" onClick={() => handleDelete(record.id!)}>
            <i className="ti ti-trash text-danger" />
          </Link> */}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div onClick={() => setSelectedContract(null)}>
            <CommonHeader
              title="Employee Contracts"
              parentMenu="HR"
              activeMenu="Employee Contracts"
              routes={routes}
              buttonText="Add Contract"
              modalTarget="#add_contract"
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
                  <div className="mt-2">Loading Contracts...</div>
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
                          contracts)
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
      <AddEditContractModal
        onSuccess={fetchData}
        data={selectedContract}
        onClose={() => setSelectedContract(null)}
      />
    </>
  );
};

export default EmployeeContractKHR;
