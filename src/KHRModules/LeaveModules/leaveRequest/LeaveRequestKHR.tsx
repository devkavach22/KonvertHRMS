import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditAttendancePolicyModal from "./AddEditLeaveRequestModal";
import moment from "moment";

import {
  getAttendancePolicies,
  deleteAttendancePolicy,
  AttendancePolicy as AttendancePolicyType,
  APIAttendancePolicy,
} from "./LeaveRequestServices";

const LeaveAdminKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<AttendancePolicyType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPolicy, setSelectedPolicy] =
    useState<AttendancePolicyType | null>(null);
  const [employeesOptions, setEmployeesOptions] = useState<Array<{id:any;name:string}>>([]);
  // New form state for Leave Type settings
  const [leaveName, setLeaveName] = useState<string>("");
  const [approvalLeaveRequests, setApprovalLeaveRequests] = useState<string>("");
  const [isEarnedLeave, setIsEarnedLeave] = useState<boolean>(false);
  const [allocationRequires, setAllocationRequires] = useState<string>("");
  const [leaveTypeCode, setLeaveTypeCode] = useState<number | string>("");
  const [leaveCategory, setLeaveCategory] = useState<string>("");
  const [employeeRequests, setEmployeeRequests] = useState<string>("");
  const [approvalAllocationRequests, setApprovalAllocationRequests] = useState<string>("");
  // Configuration & other fields
  const [notifiedLeaveOfficer, setNotifiedLeaveOfficer] = useState<string>("");
  const [hrApproval, setHrApproval] = useState<string>("");
  const [takeLeaveIn, setTakeLeaveIn] = useState<string>("day");
  const [deductExtraHours, setDeductExtraHours] = useState<boolean>(false);
  const [publicHolidayIncluded, setPublicHolidayIncluded] = useState<boolean>(false);
  const [showOnDashboard, setShowOnDashboard] = useState<boolean>(false);
  const [sandwichLeaves, setSandwichLeaves] = useState<boolean>(false);
  const [allowAttachSupportingDocument, setAllowAttachSupportingDocument] = useState<boolean>(false);
  const [kindOfLeave, setKindOfLeave] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [negativeCap, setNegativeCap] = useState<boolean>(false);
  const [allowCarryForward, setAllowCarryForward] = useState<boolean>(false);
  const [allowLapse, setAllowLapse] = useState<boolean>(false);
  const [allowEncashment, setAllowEncashment] = useState<boolean>(false);
  // New fields: Leave Encashment & Payroll
  const [allowLeaveEncashment, setAllowLeaveEncashment] = useState<boolean>(false);
  const [maxAllowLeaveCarryForward, setMaxAllowLeaveCarryForward] = useState<number | string>("");
  const [workEntryType, setWorkEntryType] = useState<string>("");
  const [applicableEmployeeCategory, setApplicableEmployeeCategory] = useState<string>("");
  const [applicableLocations, setApplicableLocations] = useState<string>("");
  const [genderRestriction, setGenderRestriction] = useState<string>("all");
  const [eligibleAfter, setEligibleAfter] = useState<string>("day_after_joining");
  const [daysRequired, setDaysRequired] = useState<number | string>("");
  const [backdatedAllowed, setBackdatedAllowed] = useState<boolean>(false);
  const [maxBackdatedDays, setMaxBackdatedDays] = useState<number | string>("");
  const [futureDatedAllowed, setFutureDatedAllowed] = useState<boolean>(false);
  const [minimumWorkingDays, setMinimumWorkingDays] = useState<number | string>("");
  const [daysPerMonth, setDaysPerMonth] = useState<number | string>("");
  const [maximumAnnualLeave, setMaximumAnnualLeave] = useState<number | string>("");

  // Options loaded from API
  const [companiesOptions, setCompaniesOptions] = useState<Array<{id:any;name:string}>>([]);
  const [locationsOptions, setLocationsOptions] = useState<Array<{id:any;name:string}>>([]);

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
          // include approved_by and status fields so columns map correctly
          approved_by: (item as any).approved_by ?? (item as any).approver ?? (item as any).approved_by_name ?? null,
          status: (item as any).status ?? (item as any).approval_status ?? (item as any).state ?? null,
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

  // fetch companies and locations
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const fetchList = async (endpoints: string[]) => {
          for (const ep of endpoints) {
            try {
              const res = await fetch(ep);
              if (!res.ok) continue;
              const json = await res.json();
              if (Array.isArray(json)) return json;
              if (json && Array.isArray(json.data)) return json.data;
            } catch (e) {
              // continue
            }
          }
          return null;
        };

        const companies = await fetchList(["/api/companies", "/companies", "/api/organizations"]);
        const locations = await fetchList(["/api/locations", "/locations", "/api/branches"]);

        if (mounted && Array.isArray(companies)) {
          setCompaniesOptions(companies.map((c: any) => ({ id: c.id ?? c.value, name: c.name ?? c.label ?? String(c.id) })));
        }
        if (mounted && Array.isArray(locations)) {
          setLocationsOptions(locations.map((l: any) => ({ id: l.id ?? l.value, name: l.name ?? l.label ?? String(l.id) })));
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
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
      title: "Leave ",
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
      title: "Approved By",
      dataIndex: "approved_by",
      render: (_: any, record: any) => {
        const ap = (record.approved_by && (record.approved_by.name || record.approved_by)) || record.approver || record.approved_by_name || null;
        if (!ap) return <span>-</span>;
        return <span>{typeof ap === 'string' ? ap : String(ap)}</span>;
      },
      sorter: (a: any, b: any) => {
        const A = (a?.approved_by && (a.approved_by.name || a.approved_by)) || a?.approver || a?.approved_by_name || "";
        const B = (b?.approved_by && (b.approved_by.name || b.approved_by)) || b?.approver || b?.approved_by_name || "";
        return String(A).localeCompare(String(B));
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
      title: "Status",
      dataIndex: "status",
      render: (val: any, record: any) => {
        const s = val ?? record.approval_status ?? record.state ?? record.status ?? null;
        return <span>{s ? String(s) : "-"}</span>;
      },
      sorter: (a: any, b: any) => String(a?.status ?? a?.approval_status ?? a?.state ?? "").localeCompare(String(b?.status ?? b?.approval_status ?? b?.state ?? "")),
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
                title="Leave List"
                parentMenu="HR"
                activeMenu="Leave List"
                routes={routes}
                buttonText="Add leave Request"
                modalTarget="#add_attendance_policy"
              />
            </div>

          
          {/* Leave Type Form */}
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Leave List</h5>

                {/* Attendance Policy Form */}
              <div className="mt-3">
                <DatatableKHR
                  columns={columns}
                  data={data}
                />
              </div>



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
