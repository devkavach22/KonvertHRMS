import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditLeaveRequestModal from "./AddEditLeaveRequestModal";
import moment from "moment";

import {
  getLeaveRequests,
  deleteLeaveRequest
} from "./LeaveRequestServices";

const LeaveAdminKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPolicy, setSelectedPolicy] = useState<any | null>(null);
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
      const result = await getLeaveRequests();
      const safeResult = Array.isArray(result.data.data) ? result.data?.data : [];


      const mappedData = safeResult.map((item: any) => ({
        id: item.id,
        employee_name: item.employee_name || item.employee_id,
        company_name: item.company_name || item.company_id,
        department_name: item.department_name || item.department_id,
        leave_type: item.leave_type_name,
        from_date: item.from_date,
        to_date: item.to_date,
        status: item.status,
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load leave requests", error);
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

  const handleDelete = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this leave request?")) {
      try {
        await deleteLeaveRequest(Number(id));
        fetchData(); // Refresh the list after successful deletion
      } catch (error) {
        console.error("Error deleting leave request:", error);
        alert("Failed to delete leave request.");
      }
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
      title: "Company Name",
      dataIndex: "company_name",
      render: (val: any) => <span>{val || "-"}</span>,
      sorter: (a: any, b: any) => String(a.company_name || "").localeCompare(String(b.company_name || "")),
    },
    {
      title: "Department Name",
      dataIndex: "department_name",
      render: (val: any) => <span>{val || "-"}</span>,
      sorter: (a: any, b: any) => String(a.department_name || "").localeCompare(String(b.department_name || "")),
    },
    {
      title: "Leave Type",
      dataIndex: "leave_type",
      render: (val: any) => <span>{val || "-"}</span>,
      sorter: (a: any, b: any) => String(a.leave_type || "").localeCompare(String(b.leave_type || "")),
    },
    {
      title: "From Date",
      dataIndex: "from_date",
      render: (val: any) => <span>{val ? moment(val).format("YYYY-MM-DD") : "-"}</span>,
      sorter: (a: any, b: any) => {
        const aDate = moment(a.from_date);
        const bDate = moment(b.from_date);
        return aDate.isValid() && bDate.isValid() ? aDate.valueOf() - bDate.valueOf() : 0;
      },
    },
    {
      title: "To Date",
      dataIndex: "to_date",
      render: (val: any) => <span>{val ? moment(val).format("YYYY-MM-DD") : "-"}</span>,
      sorter: (a: any, b: any) => {
        const aDate = moment(a.to_date);
        const bDate = moment(b.to_date);
        return aDate.isValid() && bDate.isValid() ? aDate.valueOf() - bDate.valueOf() : 0;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (val: any) => <span>{val || "-"}</span>,
      sorter: (a: any, b: any) => String(a.status || "").localeCompare(String(b.status || "")),
    },
     {
          title: "Actions",
          dataIndex: "id",
          render: (_: any, record: any) => (
            <div className="action-icon d-inline-flex">
              <Link
                to="#"
                className="me-2"
                data-bs-toggle="modal"
                data-bs-target="#add_leave_request"
              onClick={() => {
              setSelectedPolicy(record);
              const jq = (window as any).jQuery || (window as any).$;
              if (jq && typeof jq === "function" && jq("#add_leave_request").modal) {
                try {
                  jq("#add_leave_request").modal("show");
                } catch (e) {
                  // ignore if modal call fails
                }
              }
            }}              >
                <i className="ti ti-edit text-blue" />
              </Link>
              <Link
                to="#"
                onClick={() => handleDelete(record.id)}
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
                title="Leave Request"
                parentMenu="HR"
                activeMenu="Leave Request"
                routes={routes}
                buttonText="Add leave Request"
                modalTarget="#add_leave_request"
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

        <AddEditLeaveRequestModal
          onSuccess={fetchData}
          data={selectedPolicy}
        />
      </div>
    </>
  );
};

export default LeaveAdminKHR;
