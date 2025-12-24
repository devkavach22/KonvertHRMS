import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditAttendancePolicyModal from "./AddEditLeaveModal";
import moment from "moment";

import {
  getAttendancePolicies,
  deleteAttendancePolicy,
  AttendancePolicy as AttendancePolicyType,
  APIAttendancePolicy,
} from "./LeaveServices";

const LeaveAdminKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<AttendancePolicyType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPolicy, setSelectedPolicy] =
    useState<AttendancePolicyType | null>(null);
  const [employeesOptions, setEmployeesOptions] = useState<Array<{id:any;name:string}>>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAttendancePolicies();
      const safeResult = Array.isArray(result) ? result : [];

      // Build a lookup map of employees by id if we fetched options earlier
      const empMap: Record<string,string> = {};
      employeesOptions.forEach((e) => { empMap[String(e.id)] = e.name; });

      const mappedData: AttendancePolicyType[] = safeResult.map((item: APIAttendancePolicy) => {
        // normalize employees selection to array of objects with id/name
        let employees_selection: any[] = [];
        const raw = (item as any).employees_selection ?? (item as any).employees ?? [];
        if (Array.isArray(raw)) {
          employees_selection = raw.map((v: any) => {
            if (v && typeof v === "object") return v;
            const id = v;
            return { id, name: empMap[String(id)] ?? String(id) };
          });
        } else if (typeof raw === "string") {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              employees_selection = parsed.map((v: any) => (v && typeof v === "object") ? v : { id: v, name: empMap[String(v)] ?? String(v) });
            }
          } catch (e) {
            employees_selection = [];
          }
        }

        return {
          id: String(item.id),
          key: String(item.id),
          employees_selection,
          type: item.type ?? "",
          from_date: (item as any).from_date ?? (item as any).start_date ?? null,
          to_date: (item as any).to_date ?? (item as any).end_date ?? null,
          no_of_days: (item as any).no_of_days ?? null,
          remaining_days: (item as any).remaining_days ?? null,
          reason: (item as any).reason ?? "",
          created_date: item.create_date ?? "-",
        } as any;
      });

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load policies", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      await deleteAttendancePolicy(id);
      fetchData();
    }
  };

  const columns: any[] = [
    {
      title: "Employee",
      dataIndex: "employees_selection",
      render: (employees: any) => {
        if (!Array.isArray(employees) || employees.length === 0) return <span>-</span>;
        const names = employees
          .map((e: any) => e?.name || e?.label || e?.full_name || e?.employee_name || "")
          .filter((n: string) => !!n);
        return <span>{names.length ? names.join(", ") : `${employees.length} employees`}</span>;
      },
      sorter: (a: any, b: any) => {
        const aName = Array.isArray(a?.employees_selection) && a.employees_selection[0]
          ? String(a.employees_selection[0].name || a.employees_selection[0].label || "")
          : "";
        const bName = Array.isArray(b?.employees_selection) && b.employees_selection[0]
          ? String(b.employees_selection[0].name || b.employees_selection[0].label || "")
          : "";
        return aName.localeCompare(bName);
      },
    },
    {
      title: "Leave Type",
      dataIndex: "type",
      render: (val: any) => <span>{typeof val === "string" && val ? String(val).replace(/_/g, " ") : "-"}</span>,
      sorter: (a: any, b: any) => String(a?.type ?? "").localeCompare(String(b?.type ?? "")),
    },
    {
      title: "From",
      dataIndex: "from_date",
      render: (val: any, record: any) => {
        const date = val ?? record.start_date ?? record.created_date ?? null;
        return <span>{date && moment(date).isValid() ? moment(date).format("YYYY-MM-DD") : "-"}</span>;
      },
      sorter: (a: any, b: any) => {
        const aDate = a?.from_date ?? a?.start_date ?? a?.created_date ?? null;
        const bDate = b?.from_date ?? b?.start_date ?? b?.created_date ?? null;
        const ad = moment(aDate);
        const bd = moment(bDate);
        if (ad.isValid() && bd.isValid()) return ad.valueOf() - bd.valueOf();
        if (ad.isValid()) return -1;
        if (bd.isValid()) return 1;
        return 0;
      },
    },
    {
      title: "To",
      dataIndex: "to_date",
      render: (val: any, record: any) => {
        const date = val ?? record.end_date ?? null;
        return <span>{date && moment(date).isValid() ? moment(date).format("YYYY-MM-DD") : "-"}</span>;
      },
      sorter: (a: any, b: any) => {
        const aDate = a?.to_date ?? a?.end_date ?? null;
        const bDate = b?.to_date ?? b?.end_date ?? null;
        const ad = moment(aDate);
        const bd = moment(bDate);
        if (ad.isValid() && bd.isValid()) return ad.valueOf() - bd.valueOf();
        if (ad.isValid()) return -1;
        if (bd.isValid()) return 1;
        return 0;
      },
    },
    {
      title: "No of Days",
      dataIndex: "no_of_days",
      render: (val: any, record: any) => {
        if (val !== undefined && val !== null) return <span>{Number(val)}</span>;
        const start = record.from_date ?? record.start_date ?? record.created_date ?? null;
        const end = record.to_date ?? record.end_date ?? null;
        if (start && end && moment(start).isValid() && moment(end).isValid()) {
          const diff = moment(end).endOf("day").diff(moment(start).startOf("day"), "days") + 1;
          return <span>{diff}</span>;
        }
        return <span>-</span>;
      },
      sorter: (a: any, b: any) => {
        const getDays = (r: any) => {
          if (r?.no_of_days !== undefined && r?.no_of_days !== null) return Number(r.no_of_days);
          const s = r?.from_date ?? r?.start_date ?? r?.created_date ?? null;
          const e = r?.to_date ?? r?.end_date ?? null;
          if (s && e && moment(s).isValid() && moment(e).isValid()) {
            return moment(e).endOf("day").diff(moment(s).startOf("day"), "days") + 1;
          }
          return 0;
        };
        return getDays(a) - getDays(b);
      },
    },
      {
        title: "Remaining Days",
        dataIndex: "remaining_days",
        render: (val: any) => (val !== undefined && val !== null ? <span>{Number(val)}</span> : <span>-</span>),
        sorter: (a: any, b: any) => (Number(a?.remaining_days ?? 0) - Number(b?.remaining_days ?? 0)),
      },
      {
        title: "Reason",
        dataIndex: "reason",
        render: (val: any) => <span>{val ? String(val) : "-"}</span>,
        sorter: (a: any, b: any) => String(a?.reason ?? "").localeCompare(String(b?.reason ?? "")),
      },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div>
          <button
            className="btn btn-sm btn-primary me-2"
            onClick={() => {
              setSelectedPolicy(record);
              const jq = (window as any).jQuery || (window as any).$;
              if (jq && typeof jq === "function" && jq("#add_attendance_policy").modal) {
                try {
                  jq("#add_attendance_policy").modal("show");
                } catch (e) {
                  // ignore if modal call fails
                }
              }
            }}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDelete(String(record.id))}
          >
            Delete
          </button>
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
