import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditAttendancePolicyModal from "./AddEditLeaveModal";
import moment from "moment";

import {
  getLeaveDashboard,
  AttendancePolicy as AttendancePolicyType,
  APIAttendancePolicy,
} from "./LeaveServices";

const LeaveAdminKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPolicy, setSelectedPolicy] =
    useState<AttendancePolicyType | null>(null);
  const [employeesOptions, setEmployeesOptions] = useState<Array<{id:any;name:string}>>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [displayedColumns, setDisplayedColumns] = useState<any[] | null>(null);
  const [displayedData, setDisplayedData] = useState<any[] | null>(null);

  const fetchData = async () => {
    setLoading(false);
    try {
      const result = await getLeaveDashboard();
      console.log(result,"result");
      
      const safeResult = Array.isArray(result.data) ? result?.data : [];

      // Build a lookup map of employees by id if we fetched options earlier
      const empMap: Record<string,string> = {};
      employeesOptions.forEach((e) => { empMap[String(e.id)] = e.name; });

      const mappedData = safeResult.map((item: any) => ({
        id: item.id,
        employee_name: Array.isArray(item.employee_id) ? item.employee_id[1] : item.employee_id,
        check_in: item.check_in,
        check_out: item.check_out,
        worked_hours: item.worked_hours,
        early_out_minutes: item.early_out_minutes,
        overtime_hours: item.overtime_hours,
        validated_overtime_hours: item.validated_overtime_hours,
        is_late_in: item.is_late_in,
        late_time_display: item.late_time_display,
        is_early_out: item.is_early_out,
        status_code: item.status_code,
        job_name: Array.isArray(item.job_id) ? item.job_id[1] : item.job_name,
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load policies", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
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

  // fetch employees list for name lookup
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const endpoints = ["/api/employees", "/api/users", "/employees", "/users"];
        let result: any = null;
        for (const ep of endpoints) {
          try {
            const res = await fetch(ep);
            if (!res.ok) continue;
            const json = await res.json();
            if (Array.isArray(json)) {
              result = json; break;
            }
            if (json && Array.isArray(json.data)) { result = json.data; break; }
          } catch (e) {
            // continue
          }
        }
        if (mounted && Array.isArray(result)) {
          const opts = result.map((r: any) => ({ id: r.id ?? r.user_id ?? r.value, name: r.name ?? r.full_name ?? r.label ?? r.username ?? String(r.id) }));
          setEmployeesOptions(opts);
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  // re-fetch policies after employee names are loaded so we can map ids to names
  useEffect(() => {
    if (employeesOptions.length > 0) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeesOptions.length]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      // await deleteAttendancePolicy(id);
      fetchData();
    }
  };

  const columns: any[] = [
    {
      title: "ID",
      dataIndex: "id",
      render: (val: any) => <span>{val || "-"}</span>,
      sorter: (a: any, b: any) => (a.id || 0) - (b.id || 0),
    },
    {
      title: "Employee Name",
      dataIndex: "employee_name",
      render: (val: any) => <span>{val || "-"}</span>,
      sorter: (a: any, b: any) => String(a.employee_name || "").localeCompare(String(b.employee_name || "")),
    },
    {
      title: "Check In",
      dataIndex: "check_in",
      render: (val: any) => <span>{val ? moment(val).format("YYYY-MM-DD HH:mm") : "-"}</span>,
      sorter: (a: any, b: any) => {
        const aDate = moment(a.check_in);
        const bDate = moment(b.check_in);
        return aDate.isValid() && bDate.isValid() ? aDate.valueOf() - bDate.valueOf() : 0;
      },
    },
    {
      title: "Check Out",
      dataIndex: "check_out",
      render: (val: any) => <span>{val ? moment(val).format("YYYY-MM-DD HH:mm") : "-"}</span>,
      sorter: (a: any, b: any) => {
        const aDate = moment(a.check_out);
        const bDate = moment(b.check_out);
        return aDate.isValid() && bDate.isValid() ? aDate.valueOf() - bDate.valueOf() : 0;
      },
    },
    {
      title: "Worked Hours",
      dataIndex: "worked_hours",
      render: (val: any) => <span>{val || "-"}</span>,
      sorter: (a: any, b: any) => (a.worked_hours || 0) - (b.worked_hours || 0),
    },
    {
      title: "Early Out Minutes",
      dataIndex: "early_out_minutes",
      render: (val: any) => <span>{val || "-"}</span>,
      sorter: (a: any, b: any) => (a.early_out_minutes || 0) - (b.early_out_minutes || 0),
    },
    {
      title: "Overtime Hours",
      dataIndex: "overtime_hours",
      render: (val: any) => <span>{val || "-"}</span>,
      sorter: (a: any, b: any) => (a.overtime_hours || 0) - (b.overtime_hours || 0),
    },
    {
      title: "Validated Overtime Hours",
      dataIndex: "validated_overtime_hours",
      render: (val: any) => <span>{val || "-"}</span>,
      sorter: (a: any, b: any) => (a.validated_overtime_hours || 0) - (b.validated_overtime_hours || 0),
    },
    {
      title: "Is Late In",
      dataIndex: "is_late_in",
      render: (val: any) => <span>{val ? "Yes" : "No"}</span>,
      sorter: (a: any, b: any) => (a.is_late_in ? 1 : 0) - (b.is_late_in ? 1 : 0),
    },
    {
      title: "Late Time Display",
      dataIndex: "late_time_display",
      render: (val: any) => <span>{val || "-"}</span>,
      sorter: (a: any, b: any) => String(a.late_time_display || "").localeCompare(String(b.late_time_display || "")),
    },
    {
      title: "Is Early Out",
      dataIndex: "is_early_out",
      render: (val: any) => <span>{val ? "Yes" : "No"}</span>,
      sorter: (a: any, b: any) => (a.is_early_out ? 1 : 0) - (b.is_early_out ? 1 : 0),
    },
    {
      title: "Status Code",
      dataIndex: "status_code",
      render: (val: any) => <span>{val || "-"}</span>,
      sorter: (a: any, b: any) => String(a.status_code || "").localeCompare(String(b.status_code || "")),
    },
    {
      title: "Job Name",
      dataIndex: "job_name",
      render: (val: any) => <span>{val || "-"}</span>,
      sorter: (a: any, b: any) => String(a.job_name || "").localeCompare(String(b.job_name || "")),
    }
  ];

  return (
    <>
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content">
            <div onClick={() => setSelectedPolicy(null)}>
              <CommonHeader
                title="Leave "
                parentMenu="HR"
                activeMenu="Leave Admin"
                routes={routes}
                buttonText="Add Leave"
                modalTarget="#add_attendance_policy"
              />
            </div>
          
          {/* Leaves Info */}
          <div className="row">
            <div className="col-xl-3 col-md-6">
              <div className="card bg-green-img">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0 me-2">
                        <span className="avatar avatar-md rounded-circle bg-white d-flex align-items-center justify-content-center">
                          <i className="ti ti-user-check text-success fs-18" />
                        </span>
                      </div>
                    </div>
                    <div className="text-end">
                      <p className="mb-1">Total Present</p>
                      <h4>180/200</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card bg-pink-img">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0 me-2">
                        <span className="avatar avatar-md rounded-circle bg-white d-flex align-items-center justify-content-center">
                          <i className="ti ti-user-edit text-pink fs-18" />
                        </span>
                      </div>
                    </div>
                    <div className="text-end">
                      <p className="mb-1">Planned Leaves</p>
                      <h4>10</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card bg-yellow-img">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0 me-2">
                        <span className="avatar avatar-md rounded-circle bg-white d-flex align-items-center justify-content-center">
                          <i className="ti ti-user-exclamation text-warning fs-18" />
                        </span>
                      </div>
                    </div>
                    <div className="text-end">
                      <p className="mb-1">Unplanned Leaves</p>
                      <h4>10</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card bg-blue-img">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0 me-2">
                        <span className="avatar avatar-md rounded-circle bg-white d-flex align-items-center justify-content-center">
                          <i className="ti ti-user-question text-info fs-18" />
                        </span>
                      </div>
                    </div>
                    <div className="text-end">
                      <p className="mb-1">Pending Requests</p>
                      <h4>15</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            <div className="card">
              <div className="card-body">
                {loading ? (
                  <div className="text-center p-4">Loading data...</div>
                ) : (
                  <DatatableKHR
                    data={data}
                    columns={columns}
                    selection={true}
                    // textKey="employees_selection"
                    title="Leave List"
                    showSortFilter={true}
                    showStatusFilter={true}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <AddEditAttendancePolicyModal
          onSuccess={fetchData}
          data={selectedPolicy}
        />
      </div>
    </>
  );
};

export default LeaveAdminKHR;
