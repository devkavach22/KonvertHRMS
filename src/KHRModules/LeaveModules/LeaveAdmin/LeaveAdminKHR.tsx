import React, { useEffect, useState } from "react";
import moment from "moment";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import {
  getLeaveDashboard,
  LeaveDashboardRecord,
  LeaveDashboardMeta,
} from "./LeaveAdminServices";
import { all_routes } from "@/router/all_routes";

const LeaveAdminKHR = () => {
  const routes = all_routes;
  const [records, setRecords] = useState<LeaveDashboardRecord[]>([]);
  const [meta, setMeta] = useState<LeaveDashboardMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);
    const response = await getLeaveDashboard();

    if (response && response.status === "success") {
      // 1. Set the Counts (Meta)
      setMeta(response.meta);

      // 2. Map the Table Records (Data)
      const mapped = response.data.map((item: any, index: number) => ({
        ...item,
        // Use ID if exists, otherwise use index for uniqueness
        key: item.id ? String(item.id) : `row-${index}`,
        // Extract name from the [id, name] array
        emp_name: item.employee_id ? item.employee_id[1] : "N/A",
      }));
      setRecords(mapped);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // update displayed columns/data when a section is selected or when data changes
  useEffect(() => {
    if (!selectedSection) {
      setDisplayedColumns(null);
      setDisplayedData(null);
      return;
    }

    const buildSection = (section: string, src: any[]) => {
      // define column subsets for each card section
      const columnSets: Record<string, any[]> = {
        total_present: [
          columns[0], // Employee
          columns[2], // From
          columns[3], // To
          columns[4], // No of Days
        ],
        planned_leaves: [
          columns[1], // Leave Type
          columns[2], // From
          columns[3], // To
          columns[4], // No of Days
        ],
        unplanned_leaves: [
          columns[0], // Employee
          columns[1], // Leave Type
          columns[2], // From
          columns[3], // To
          columns[5], // Remaining Days
        ],
        pending_requests: [
          columns[0], // Employee
          columns[1], // Leave Type
          columns[8], // Reason
          columns[columns.length - 1], // Actions
        ],
      };

      // basic heuristics to filter rows by section using available fields
      const filters: Record<string, (r: any) => boolean> = {
        total_present: (r: any) => (r.type && String(r.type).toLowerCase().includes("present")) || (r.remaining_days && Number(r.remaining_days) > 0),
        planned_leaves: (r: any) => (r.type && String(r.type).toLowerCase().includes("planned")) || false,
        unplanned_leaves: (r: any) => (r.type && String(r.type).toLowerCase().includes("unplanned")) || false,
        pending_requests: (r: any) => (r.reason && String(r.reason).toLowerCase().includes("pending")) || false,
      };

      const cols = columnSets[section] ?? columns;
      const predicate = filters[section] ?? (() => true);
      const rows = Array.isArray(src) ? src.filter(predicate) : src;
      // fallback: if filter produced no rows, show all rows
      return { cols, rows: rows.length ? rows : src };
    };

    const { cols, rows } = buildSection(selectedSection, data);
    setDisplayedColumns(cols);
    setDisplayedData(rows);
  }, [selectedSection, data]);

  const columns = [
    {
      title: "Employee",
      dataIndex: "emp_name",
      render: (text: string, record: any) => (
        <div>
          <span className="fw-bold text-dark">{text}</span>
          <br />
          <span className="fs-12 text-muted">{record.job_name || "---"}</span>
        </div>
      ),
    },
    {
      title: "Check In",
      dataIndex: "check_in",
      render: (text: string) => (text ? moment(text).format("hh:mm A") : "---"),
    },
    {
      title: "Check Out",
      dataIndex: "check_out",
      render: (text: string) => (text ? moment(text).format("hh:mm A") : "---"),
    },
    {
      title: "Worked Hours",
      dataIndex: "worked_hours",
      render: (val: number) =>
        val ? (
          <span className="badge bg-soft-info text-info">{val} hrs</span>
        ) : (
          "---"
        ),
    },
    {
      title: "Late In",
      dataIndex: "late_time_display",
      render: (text: string, record: any) => (
        <span className={record.is_late_in ? "text-danger" : "text-success"}>
          {text || "On Time"}
        </span>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content">
        <CommonHeader
          title="Leave Admin Dashboard"
          parentMenu="HR"
          activeMenu="Leaves"
          routes={routes}
          buttonText="Add Leave"
          modalTarget="#add_leave_modal"
        />
        {/* Dashboard Cards using META object */}
        <div className="row mb-4">
          <div className="col-xl-3 col-md-6">
            <div className="card bg-blue-img text-white p-3 border-0">
              <h6>Total Employees</h6>
              <h3>{meta?.TotalEmployee || 0}</h3>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card bg-green-img text-white p-3 border-0">
              <h6>Present</h6>
              <h3>{meta?.Presentemployee || 0}</h3>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card bg-pink-img text-white p-3 border-0">
              <h6>Planned Leaves</h6>
              <h3>{meta?.plannedLeaves || 0}</h3>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card bg-yellow-img text-white p-3 border-0">
              <h6>Pending Requests</h6>
              <h3>{meta?.pendingRequests || 0}</h3>
            </div>
          </div>
        </div>

        {/* Table using DATA array */}
        <div className="card">
          <div className="card-body">
            <DatatableKHR data={records} columns={columns} selection={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveAdminKHR;
