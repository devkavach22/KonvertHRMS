import React, { useEffect, useState } from "react";
import moment from "moment";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import { getLeaveDashboard, DashboardCards } from "./LeaveAdminServices";
import { all_routes } from "@/router/all_routes";

type TabType =
  | "total_present_employee"
  | "planned_leaves"
  | "unplanned_leaves"
  | "pending_requests";

const LeaveAdminKHR = () => {
  const routes = all_routes;
  const [dashboardData, setDashboardData] = useState<DashboardCards | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>("total_present_employee");

  const fetchData = async () => {
    setLoading(true);
    const response = await getLeaveDashboard();
    if (response && response.success) {
      setDashboardData(response.cards);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Dynamic Columns (Same logic as before) ---
  const getColumns = () => {
    if (activeTab === "total_present_employee") {
      return [
        {
          title: "Employee",
          dataIndex: "employee_name",
          render: (text: string) => (
            <span className="fw-bold text-dark">{text}</span>
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
            <span className="badge badge-soft-success">{text}</span>
          ),
        },
      ];
    }
    if (activeTab === "planned_leaves") {
      return [
        {
          title: "Employee",
          dataIndex: "employee_name",
          render: (t: string) => <span className="fw-bold">{t}</span>,
        },
        { title: "Leave Type", dataIndex: "leave_type" },
        {
          title: "Dates",
          render: (_: any, r: any) => (
            <span className="fs-13">
              {moment(r.from).format("DD MMM")} -{" "}
              {moment(r.to).format("DD MMM")}
            </span>
          ),
        },
        {
          title: "Days",
          dataIndex: "no_of_days",
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
          render: (t: string) => (
            <span className="fw-bold text-danger">{t}</span>
          ),
        },
        { title: "Department", dataIndex: "department" },
        {
          title: "Last Seen",
          dataIndex: "last_attendance",
          render: (t: string) =>
            t ? moment(t).format("DD MMM YYYY") : "Never",
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
          render: (t: string) => <span className="fw-bold">{t}</span>,
        },
        { title: "Type", dataIndex: "leave_type" },
        {
          title: "Dates",
          render: (_: any, r: any) => (
            <span className="fs-12">
              {moment(r.from).format("DD MMM")} -{" "}
              {moment(r.to).format("DD MMM")}
            </span>
          ),
        },
        { title: "Days", dataIndex: "no_of_days" },
        {
          title: "Action",
          dataIndex: "leave_id",
          render: () => (
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-success btn-icon rounded-circle">
                <i className="ti ti-check"></i>
              </button>
              <button className="btn btn-sm btn-danger btn-icon rounded-circle">
                <i className="ti ti-x"></i>
              </button>
            </div>
          ),
        },
      ];
    }
    return [];
  };

  const getCurrentTableData = () => {
    if (!dashboardData) return [];
    return (
      dashboardData[activeTab]?.table?.map((item: any, idx: number) => ({
        ...item,
        key: item.leave_id || item.employee_id || idx,
      })) || []
    );
  };

  // --- STYLES FOR CARDS ---
  // We use inline styles here for the gradients and hover effects
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

  // Large background icon style
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
          buttonText="Add Leave Request"
          modalTarget="#add_leave_modal"
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
                "linear-gradient(135deg, #23bdb8 0%, #43e794 100%)", // Teal to Green
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
                  {dashboardData?.total_present_employee.count || "0"}
                </h2>
                <p className="fs-12 mb-0 text-white text-opacity-75">
                  {dashboardData?.total_present_employee.description}
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
                "linear-gradient(135deg, #2196F3 0%, #00BCD4 100%)", // Blue to Cyan
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
                  {dashboardData?.planned_leaves.count || 0}
                </h2>
                <p className="fs-12 mb-0 text-white text-opacity-75">
                  {dashboardData?.planned_leaves.description}
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
                "linear-gradient(135deg, #FF5252 0%, #FF1744 100%)", // Red Gradient
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
                  {dashboardData?.unplanned_leaves.count || 0}
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
                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Purple Gradient
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
                  {dashboardData?.pending_requests.count || 0}
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
                  Viewing details for{" "}
                  <strong>{dashboardData?.[activeTab]?.description}</strong>
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
