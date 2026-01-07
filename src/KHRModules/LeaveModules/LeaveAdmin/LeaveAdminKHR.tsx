import React, { useEffect, useState } from "react";
import moment from "moment";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import { getLeaveDashboard } from "./LeaveAdminServices"; // Ensure this service returns the response as is
import { all_routes } from "@/router/all_routes";

type TabType =
  | "total_present_employee"
  | "planned_leaves"
  | "unplanned_leaves"
  | "pending_requests";

// --- Types based on your REAL API response ---
interface DashboardCounts {
  present_today: number;
  planned_leaves: number;
  absent_unplanned: number;
  pending_approvals: number;
}

interface TableRow {
  employee_id: number | null;
  employee_name: string | null;
  leave_type?: string;
  from?: string;
  to?: string;
  number_of_days?: number;
  status?: string;
  check_in?: string;
  check_out?: string;
  designation?: string;
}

interface TableData {
  present_today?: TableRow[]; // Optional as it was missing in your snippet, but likely exists
  planned_leaves: TableRow[];
  absent_unplanned: TableRow[];
  pending_approvals: TableRow[];
}

interface DashboardResponse {
  success: boolean;
  dashboard: DashboardCounts;
  tables: TableData;
}

const LeaveAdminKHR = () => {
  const routes = all_routes;
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>("total_present_employee");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await getLeaveDashboard();
      if (response && response.success) {
        setDashboardData(response);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Dynamic Columns ---
  const getColumns = () => {
    if (activeTab === "total_present_employee") {
      return [
        {
          title: "Employee",
          dataIndex: "employee_name",
          render: (text: string) => (
            <span className="fw-bold text-dark">{text || "Unknown"}</span>
          ),
        },
        {
          title: "Check In",
          dataIndex: "check_in",
          render: (text: string) =>
            text ? (
              <span className="text-success fw-medium">
                {moment(text).format("hh:mm A")}
              </span>
            ) : (
              "---"
            ),
        },
        {
          title: "Check Out",
          dataIndex: "check_out",
          render: (text: string) =>
            text ? (
              <span className="text-danger">
                {moment(text).format("hh:mm A")}
              </span>
            ) : (
              <span className="badge bg-success-light">Active</span>
            ),
        },
        {
          title: "Status",
          dataIndex: "status",
          render: (text: string) => (
            <span className="badge badge-soft-success">
              {text || "Present"}
            </span>
          ),
        },
      ];
    }
    if (activeTab === "planned_leaves") {
      return [
        {
          title: "Employee",
          dataIndex: "employee_name",
          render: (t: string) => (
            <span className="fw-bold">{t || "Unknown"}</span>
          ),
        },
        { title: "Leave Type", dataIndex: "leave_type" },
        {
          title: "Dates",
          render: (_: any, r: TableRow) => (
            <span className="fs-13">
              {r.from ? moment(r.from).format("DD MMM") : "-"} -{" "}
              {r.to ? moment(r.to).format("DD MMM") : "-"}
            </span>
          ),
        },
        {
          title: "Days",
          dataIndex: "number_of_days", // Updated key
          render: (d: any) => (
            <span className="badge bg-light text-dark border">{d} Days</span>
          ),
        },
        {
          title: "Status",
          dataIndex: "status",
          render: (t: string) => (
            <span className="badge badge-soft-info">{t}</span>
          ),
        },
      ];
    }
    if (activeTab === "unplanned_leaves") {
      return [
        {
          title: "Employee",
          dataIndex: "employee_name",
          render: (t: string | null) => (
            <span
              className={`fw-bold ${
                !t ? "text-muted fst-italic" : "text-danger"
              }`}
            >
              {t || "Unknown Employee"}
            </span>
          ),
        },
        { title: "Type", dataIndex: "leave_type" },
        {
          title: "Date",
          dataIndex: "from",
          render: (t: string) => (t ? moment(t).format("DD MMM YYYY") : "-"),
        },
        {
          title: "Status",
          dataIndex: "status",
          render: (t: string) => (
            <span className="badge badge-soft-danger">{t}</span>
          ),
        },
      ];
    }
    if (activeTab === "pending_requests") {
      return [
        {
          title: "Employee",
          dataIndex: "employee_name",
          render: (t: string) => (
            <span className="fw-bold">{t || "Unknown"}</span>
          ),
        },
        { title: "Type", dataIndex: "leave_type" },
        {
          title: "Dates",
          render: (_: any, r: TableRow) => (
            <span className="fs-12">
              {r.from ? moment(r.from).format("DD MMM") : "-"} -{" "}
              {r.to ? moment(r.to).format("DD MMM") : "-"}
            </span>
          ),
        },
        { title: "Days", dataIndex: "number_of_days" }, // Updated key
        {
          title: "Status",
          dataIndex: "status",
          render: (t: string) => {
            // Map 'confirm' to 'Pending' visually if needed
            const display = t === "confirm" ? "Pending Approval" : t;
            return (
              <span className="badge bg-light-warning text-warning border">
                {display}
              </span>
            );
          },
        },
        // Note: Action buttons removed temporarily as 'leave_id' is missing in your API response.
        // If you have an ID to approve/reject, add the column back here.
      ];
    }
    return [];
  };

  const getCurrentTableData = () => {
    if (!dashboardData || !dashboardData.tables) return [];

    let rawData: TableRow[] = [];

    switch (activeTab) {
      case "total_present_employee":
        // Fallback to empty array if present_today is missing in API tables
        rawData = dashboardData.tables.present_today || [];
        break;
      case "planned_leaves":
        rawData = dashboardData.tables.planned_leaves || [];
        break;
      case "unplanned_leaves":
        rawData = dashboardData.tables.absent_unplanned || [];
        break;
      case "pending_requests":
        rawData = dashboardData.tables.pending_approvals || [];
        break;
    }

    return rawData.map((item, idx) => ({
      ...item,
      // Create a unique key using employee_id + index since some IDs might be null or duplicate
      key: `${item.employee_id || "unknown"}_${idx}`,
    }));
  };

  // --- STYLES FOR CARDS ---
  const getCardStyle = (
    tab: TabType,
    gradient: string,
    borderColor: string
  ) => {
    const isActive = activeTab === tab;
    return {
      background: gradient,
      color: "#fff",
      cursor: "pointer",
      transition: "all 0.3s ease",
      transform: isActive ? "translateY(-5px) scale(1.02)" : "scale(1)",
      boxShadow: isActive
        ? "0 10px 20px rgba(0,0,0,0.15)"
        : "0 2px 5px rgba(0,0,0,0.05)",
      borderBottom: isActive ? `4px solid ${borderColor}` : "none",
      position: "relative" as "relative",
      overflow: "hidden",
      borderRadius: "12px",
    };
  };

  const bgIconStyle = {
    position: "absolute" as "absolute",
    right: "-15px",
    bottom: "-15px",
    fontSize: "80px",
    opacity: 0.2,
    transform: "rotate(-15deg)",
    color: "#fff",
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <CommonHeader
          title="Leave & Attendance Dashboard"
          parentMenu="HR"
          activeMenu="Leaves"
          routes={routes}
        />

        {/* --- CREATIVE CARDS ROW --- */}
        <div className="row mb-4">
          {/* Card 1: Present (Green Gradient) */}
          <div className="col-xl-3 col-md-6 mb-3">
            <div
              className="h-100 p-4"
              onClick={() => setActiveTab("total_present_employee")}
              style={getCardStyle(
                "total_present_employee",
                "linear-gradient(135deg, #23bdb8 0%, #43e794 100%)",
                "#168b87"
              )}
            >
              <div style={{ position: "relative", zIndex: 2 }}>
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-white bg-opacity-25 rounded-circle p-2 me-2">
                    <i className="ti ti-users fs-20 text-white"></i>
                  </div>
                  <h6 className="fs-14 fw-bold mb-0 text-white text-uppercase tracking-wider">
                    Present Today
                  </h6>
                </div>
                <h2 className="mb-1 fw-bold text-white">
                  {dashboardData?.dashboard.present_today || 0}
                </h2>
                <p className="fs-12 mb-0 text-white text-opacity-75">
                  Employees active now
                </p>
              </div>
              <i className="ti ti-user-check" style={bgIconStyle}></i>
            </div>
          </div>

          {/* Card 2: Planned Leaves (Blue Gradient) */}
          <div className="col-xl-3 col-md-6 mb-3">
            <div
              className="h-100 p-4"
              onClick={() => setActiveTab("planned_leaves")}
              style={getCardStyle(
                "planned_leaves",
                "linear-gradient(135deg, #2196F3 0%, #00BCD4 100%)",
                "#0d47a1"
              )}
            >
              <div style={{ position: "relative", zIndex: 2 }}>
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-white bg-opacity-25 rounded-circle p-2 me-2">
                    <i className="ti ti-calendar-event fs-20 text-white"></i>
                  </div>
                  <h6 className="fs-14 fw-bold mb-0 text-white text-uppercase tracking-wider">
                    Planned Leaves
                  </h6>
                </div>
                <h2 className="mb-1 fw-bold text-white">
                  {dashboardData?.dashboard.planned_leaves || 0}
                </h2>
                <p className="fs-12 mb-0 text-white text-opacity-75">
                  Approved upcoming
                </p>
              </div>
              <i className="ti ti-calendar-time" style={bgIconStyle}></i>
            </div>
          </div>

          {/* Card 3: Unplanned / Absent (Red/Orange Gradient) */}
          <div className="col-xl-3 col-md-6 mb-3">
            <div
              className="h-100 p-4"
              onClick={() => setActiveTab("unplanned_leaves")}
              style={getCardStyle(
                "unplanned_leaves",
                "linear-gradient(135deg, #FF5252 0%, #FF1744 100%)",
                "#b71c1c"
              )}
            >
              <div style={{ position: "relative", zIndex: 2 }}>
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-white bg-opacity-25 rounded-circle p-2 me-2">
                    <i className="ti ti-alert-circle fs-20 text-white"></i>
                  </div>
                  <h6 className="fs-14 fw-bold mb-0 text-white text-uppercase tracking-wider">
                    Absent / Unplanned
                  </h6>
                </div>
                <h2 className="mb-1 fw-bold text-white">
                  {dashboardData?.dashboard.absent_unplanned || 0}
                </h2>
                <p className="fs-12 mb-0 text-white text-opacity-75">
                  Needs attention
                </p>
              </div>
              <i className="ti ti-user-x" style={bgIconStyle}></i>
            </div>
          </div>

          {/* Card 4: Pending Requests (Purple/Pink Gradient) */}
          <div className="col-xl-3 col-md-6 mb-3">
            <div
              className="h-100 p-4"
              onClick={() => setActiveTab("pending_requests")}
              style={getCardStyle(
                "pending_requests",
                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "#4527a0"
              )}
            >
              <div style={{ position: "relative", zIndex: 2 }}>
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-white bg-opacity-25 rounded-circle p-2 me-2">
                    <i className="ti ti-clock fs-20 text-white"></i>
                  </div>
                  <h6 className="fs-14 fw-bold mb-0 text-white text-uppercase tracking-wider">
                    Pending Approvals
                  </h6>
                </div>
                <h2 className="mb-1 fw-bold text-white">
                  {dashboardData?.dashboard.pending_approvals || 0}
                </h2>
                <p className="fs-12 mb-0 text-white text-opacity-75">
                  Requests awaiting action
                </p>
              </div>
              <i className="ti ti-file-analytics" style={bgIconStyle}></i>
            </div>
          </div>
        </div>

        {/* --- DETAILS TABLE --- */}
        <div
          className="card shadow-sm border-0"
          style={{ borderRadius: "12px" }}
        >
          <div className="card-header bg-white border-bottom pt-4 pb-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h5 className="card-title fw-bold text-dark mb-1">
                  {activeTab === "total_present_employee" && (
                    <>
                      <i className="ti ti-user-check text-success me-2"></i>{" "}
                      Attendance Log
                    </>
                  )}
                  {activeTab === "planned_leaves" && (
                    <>
                      <i className="ti ti-calendar text-info me-2"></i> Upcoming
                      Approved Leaves
                    </>
                  )}
                  {activeTab === "unplanned_leaves" && (
                    <>
                      <i className="ti ti-alert-triangle text-danger me-2"></i>{" "}
                      Absenteeism Report
                    </>
                  )}
                  {activeTab === "pending_requests" && (
                    <>
                      <i className="ti ti-clock text-primary me-2"></i> Pending
                      Leave Approvals
                    </>
                  )}
                </h5>
                <p className="text-muted fs-12 mb-0">
                  Details for{" "}
                  <strong>{activeTab.replace(/_/g, " ").toUpperCase()}</strong>
                </p>
              </div>
              <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">
                Total: {getCurrentTableData().length}
              </span>
            </div>
          </div>
          <div className="card-body p-0">
            {loading ? (
              <div className="d-flex justify-content-center align-items-center p-5">
                <div
                  className="spinner-border text-primary"
                  role="status"
                ></div>
              </div>
            ) : (
              <DatatableKHR
                data={getCurrentTableData()}
                columns={getColumns()}
                selection={false}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveAdminKHR;
