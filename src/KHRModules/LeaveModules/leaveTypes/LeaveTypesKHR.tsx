import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditAttendancePolicyModal from "./AddEditLeaveTypesModal";
import moment from "moment";

// service imports removed (not used here) — keep file focused on UI

const LeaveAdminKHR = () => { 
  const routes = all_routes;
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<any | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Dummy fetch implementation — replace with real API call when available
      // Example: const res = await fetch('/api/leave-types'); setData(res.data || []);
      setData([]);
    } catch (err) {
      console.error("Failed to fetch leave types:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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


  const columns: any[] = [
    {
      title: "Leave Name",
      dataIndex: "leave_name",
      render: (val: any) => <span>{val ? String(val) : "-"}</span>,
      sorter: (a: any, b: any) => String(a?.leave_name ?? "").localeCompare(String(b?.leave_name ?? "")),
    },
    {
      title: "Leave Type",
      dataIndex: "leave_type",
      render: (val: any) => <span>{val ? String(val) : "-"}</span>,
      sorter: (a: any, b: any) => String(a?.leave_type ?? "").localeCompare(String(b?.leave_type ?? "")),
    },
    {
      title: "Leave Category",
      dataIndex: "leave_category",
      render: (val: any) => <span>{val ? String(val) : "-"}</span>,
      sorter: (a: any, b: any) => String(a?.leave_category ?? "").localeCompare(String(b?.leave_category ?? "")),
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
            // onClick={() => handleDelete(String(record.id))}
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

          
          <DatatableKHR 
              columns={columns} 
              data={data} 
              />

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
