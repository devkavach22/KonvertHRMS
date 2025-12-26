import React, { useEffect, useState } from "react";
import {
  AttendancePolicy,
  createLeaveType,
  LeaveTypePayload,
  getLeaveTypesCode
} from "./LeavetypesServices";
import toast from 'react-hot-toast';
import moment from "moment";

interface Props {
  onSuccess: () => void;
  data: AttendancePolicy | null;
}

const AddEditAttendancePolicyModal: React.FC<Props> = ({ onSuccess, data }) => {
  // Initial state for the new geofence-style attendance fields
  const initialFormState = {
    employees_selection: [] as any[],
    // leave specific fields
    type: "",
    from_date: "",
    to_date: "",
    no_of_days: "",
    remaining_days: "",
    reason: "",
  };

  const [formData, setFormData] = useState<any>(initialFormState);
  const [validated, setValidated] = useState(false);
  const [employeesOptions, setEmployeesOptions] = useState<any[]>([]);
  const [isSavingLeaveType, setIsSavingLeaveType] = useState(false);

  // Additional local states used by the Leave Type form snippet
  const [leaveName, setLeaveName] = useState<string>("");
  const [leaveNameTouched, setLeaveNameTouched] = useState<boolean>(false);
  const [leaveTypeCode, setLeaveTypeCode] = useState<number | string | "">("");
  const [leaveTypeOptions, setLeaveTypeOptions] = useState<Array<{id:any;name:string;leave_type_code:any}>>([]);
  const [leaveTypeCodeTouched, setLeaveTypeCodeTouched] = useState<boolean>(false);
  const [isEarnedLeave, setIsEarnedLeave] = useState<boolean>(false);
  const [approvalLeaveRequests, setApprovalLeaveRequests] = useState<string>("");
  const [approvalTouched, setApprovalTouched] = useState<boolean>(false);
  const [allocationRequires, setAllocationRequires] = useState<string>("");
  const [allocationRequiresTouched, setAllocationRequiresTouched] = useState<boolean>(false);
  const [leaveCategory, setLeaveCategory] = useState<string>("");
  const [leaveCategoryTouched, setLeaveCategoryTouched] = useState<boolean>(false);
  const [employeeRequests, setEmployeeRequests] = useState<string>("");
  const [approvalAllocationRequests, setApprovalAllocationRequests] = useState<string>("");
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
  const [companiesOptions, setCompaniesOptions] = useState<any[]>([]);
  const [negativeCap, setNegativeCap] = useState<boolean>(false);
  const [allowCarryForward, setAllowCarryForward] = useState<boolean>(false);
  const [allowLapse, setAllowLapse] = useState<boolean>(false);
  const [allowEncashment, setAllowEncashment] = useState<boolean>(false);
  const [applicableEmployeeCategory, setApplicableEmployeeCategory] = useState<string>("");
  const [locationsOptions, setLocationsOptions] = useState<any[]>([]);
  const [applicableLocations, setApplicableLocations] = useState<string>("");
  const [genderRestriction, setGenderRestriction] = useState<string>("all");
  const [eligibleAfter, setEligibleAfter] = useState<string>("day_after_joining");
  const [daysRequired, setDaysRequired] = useState<number | "">("");
  const [backdatedAllowed, setBackdatedAllowed] = useState<boolean>(false);
  const [maxBackdatedDays, setMaxBackdatedDays] = useState<number | "">("");
  const [futureDatedAllowed, setFutureDatedAllowed] = useState<boolean>(false);
  const [minimumWorkingDays, setMinimumWorkingDays] = useState<number | "">("");
  const [daysPerMonth, setDaysPerMonth] = useState<number | "">("");
  const [maximumAnnualLeave, setMaximumAnnualLeave] = useState<number | "">("");
  const [allowLeaveEncashment, setAllowLeaveEncashment] = useState<boolean>(false);
  const [maxAllowLeaveCarryForward, setMaxAllowLeaveCarryForward] = useState<number | "">("");
  const [workEntryType, setWorkEntryType] = useState<string>("");

  // 1. DATA SYNC: Populate form when editing
  useEffect(() => {
    if (data) {
      // Map incoming `data` to the new form shape.
      let employees: any[] = [];
      if (Array.isArray((data as any).employees_selection)) {
        employees = (data as any).employees_selection;
      } else if (typeof (data as any).employees_selection === "string") {
        try {
          const parsed = JSON.parse((data as any).employees_selection);
          if (Array.isArray(parsed)) employees = parsed;
        } catch (e) {
          employees = [];
        }
      }

      setFormData({
        employees_selection: employees,
        type: (data as any).type ?? "",
        from_date: (data as any).from_date ?? (data as any).start_date ?? "",
        to_date: (data as any).to_date ?? (data as any).end_date ?? "",
        no_of_days: (data as any).no_of_days ?? "",
        remaining_days: (data as any).remaining_days ?? "",
        reason: (data as any).reason ?? "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [data]);

  // Fetch employee list for the Employee Name select
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // try common endpoints; adjust if your API differs
        const endpoints = ["/api/employees", "/api/users", "/employees", "/users"];
        let result: any = null;
        for (const ep of endpoints) {
          try {
            const res = await fetch(ep);
            if (!res.ok) continue;
            const json = await res.json();
            if (Array.isArray(json)) {
              result = json;
              break;
            }
            // some APIs wrap data
            if (json && Array.isArray(json.data)) {
              result = json.data;
              break;
            }
          } catch (e) {
            // continue to next endpoint
          }
        }
        if (mounted && Array.isArray(result)) {
          // normalize to objects with id and name
          const opts = result.map((r: any) => ({ id: r.id ?? r.user_id ?? r.value, name: r.name ?? r.full_name ?? r.label ?? r.username ?? String(r.id) }));
          setEmployeesOptions(opts);
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  // fetch companies for Company select
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const endpoints = ["/api/companies", "/companies", "/api/organizations", "/api/company"];
        let result: any = null;
        for (const ep of endpoints) {
          try {
            const res = await fetch(ep);
            if (!res.ok) continue;
            const json = await res.json();
            if (Array.isArray(json)) { result = json; break; }
            if (json && Array.isArray(json.data)) { result = json.data; break; }
            if (json && (json.id || json.name)) { result = [json]; break; }
          } catch (e) {
            // continue
          }
        }
        if (mounted && Array.isArray(result)) {
          const opts = result.map((r: any) => ({ id: r.id ?? r.value, name: r.name ?? r.company_name ?? r.label ?? String(r.id) }));
          setCompaniesOptions(opts);
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  // fetch locations for Applicable Locations
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const endpoints = ["/api/locations", "/locations", "/api/branches"];
        let result: any = null;
        for (const ep of endpoints) {
          try {
            const res = await fetch(ep);
            if (!res.ok) continue;
            const json = await res.json();
            if (Array.isArray(json)) { result = json; break; }
            if (json && Array.isArray(json.data)) { result = json.data; break; }
          } catch (e) {
            // continue
          }
        }
        if (mounted && Array.isArray(result)) {
          const opts = result.map((r: any) => ({ id: r.id ?? r.value, name: r.name ?? r.label ?? String(r.id) }));
          setLocationsOptions(opts);
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  // fetch leave types to populate Leave Type Code select
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await getLeaveTypesCode();
        console.log({ list })
        if (!mounted) return;
        if (Array.isArray(list)) {
          const opts = list.map((l: any) => ({ id: l.id, name: l.name ?? String(l.id), leave_type_code: l.leave_type_code }));
          setLeaveTypeOptions(opts);
          // if there's a numeric code available and leaveTypeCode is empty, try to set a default
          if ((leaveTypeCode === "" || leaveTypeCode === undefined) && opts.length > 0) {
            // prefer a real code string if present, otherwise use id
            const first = opts[0];
            const val = first.leave_type_code ? String(first.leave_type_code) : String(first.id);
            setLeaveTypeCode(val);
          }
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  // 2. RESET LOGIC: Listen for Modal Close
  useEffect(() => {
    const modalElement = document.getElementById("add_attendance_policy");
    const handleModalClose = () => {
      setValidated(false);
      setFormData(initialFormState);
      // reset the visible fields only
      setLeaveName("");
      setLeaveTypeCode("");
      setApprovalLeaveRequests("");
      setAllocationRequires("");
      setLeaveCategory("");
      setTakeLeaveIn("day");
    };
    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", handleModalClose);
    }
    return () => {
      if (modalElement) {
        modalElement.removeEventListener("hidden.bs.modal", handleModalClose);
      }
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const name = target.name;
    const value = (target as HTMLInputElement).value;

    // Special handling for employees_selection: select element (single select)
    if (name === "employees_selection") {
      // if it's a select element, map selected value to employee object
      if (target instanceof HTMLSelectElement) {
        const selectedValue = target.value;
        if (!selectedValue) {
          setFormData((prev: any) => ({ ...prev, employees_selection: [] }));
        } else {
          const found = employeesOptions.find((o) => String(o.id) === String(selectedValue));
          setFormData((prev: any) => ({ ...prev, employees_selection: found ? [found] : [] }));
        }
        return;
      }

      // fallback to textarea/json handling
      if (!value || value.trim() === "") {
        setFormData((prev: any) => ({ ...prev, [name]: [] }));
        return;
      }
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          setFormData((prev: any) => ({ ...prev, [name]: parsed }));
          return;
        }
      } catch (err) {
        setFormData((prev: any) => ({ ...prev, [name]: [] }));
        return;
      }
      setFormData((prev: any) => ({ ...prev, [name]: [] }));
      return;
    }

    // no geo numeric fields handled here anymore

    // numeric fields for leave
    if (name === "no_of_days" || name === "remaining_days") {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
      return;
    }

    // date fields
    if (name === "from_date" || name === "to_date") {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
      return;
    }

    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // auto-calc no_of_days when dates change
  useEffect(() => {
    const f = formData.from_date;
    const t = formData.to_date;
    if (f && t && moment(f).isValid() && moment(t).isValid()) {
      const diff = moment(t).endOf("day").diff(moment(f).startOf("day"), "days") + 1;
      setFormData((prev: any) => ({ ...prev, no_of_days: String(diff) }));
    }
  }, [formData.from_date, formData.to_date]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;
    setValidated(true);

    if (form.checkValidity() === false) {
      return;
    }

    // Prepare Payload: convert numeric fields and ensure employees_selection is an array
    const apiPayload: any = { ...formData };

    // geo fields removed

    // ensure employees_selection is array of objects
    if (!Array.isArray(apiPayload.employees_selection)) {
      apiPayload.employees_selection = [];
    }

    // convert numeric leave fields
    apiPayload.no_of_days = apiPayload.no_of_days === "" ? null : Number(apiPayload.no_of_days);
    apiPayload.remaining_days = apiPayload.remaining_days === "" ? null : Number(apiPayload.remaining_days);


    try {
      if (data && data.id) {
        // await updateAttendancePolicy(data.id, apiPayload);
      } else {
        // await addAttendancePolicy(apiPayload);
      }

      const closeBtn = document.getElementById("close-btn-policy");
      closeBtn?.click();
      onSuccess();
    } catch (error) {
      console.error("Failed to save policy", error);
      alert("Error saving data.");
    }
  };

  // Save handler for the Leave Type section (calls createLeaveType)
  const handleSaveLeaveType = async () => {
    // mark all required fields as touched so validation shows
    setLeaveNameTouched(true);
    setLeaveTypeCodeTouched(true);
    setApprovalTouched(true);
    setAllocationRequiresTouched(true);
    setLeaveCategoryTouched(true);
    setTakeLeaveIn("day");

    // validate required fields
    if (!leaveName || !leaveTypeCode || !approvalLeaveRequests || !allocationRequires || !leaveCategory) {
      toast.error("Please fill all required fields.");
      return;
    }
    setIsSavingLeaveType(true);
    try {
      const rawUserId =
        localStorage.getItem("user_id") ||
        localStorage.getItem("userId") ||
        localStorage.getItem("id");
      const userId = rawUserId ? Number(rawUserId) : undefined;

      if (!userId) {
        toast.error("You must be logged in to create a leave type.");
        setIsSavingLeaveType(false);
        return; 
      }

      const payload: LeaveTypePayload = {
        name: leaveName,
        leave_type_code: leaveTypeCode === "" ? undefined : String(leaveTypeCode),
        leave_validation_type: approvalLeaveRequests || undefined,
        allocation_validation_type: approvalAllocationRequests || undefined,
        requires_allocation: allocationRequires || undefined,
        employee_requests: employeeRequests || undefined,
        responsible_ids: [],
        leave_category: leaveCategory || undefined,
        request_unit: takeLeaveIn || undefined,
        include_public_holidays_in_duration: publicHolidayIncluded,
        overtime_deductible: deductExtraHours,
        is_earned_leave: isEarnedLeave,
        show_on_dashboard: showOnDashboard,
        sandwich_leaves: sandwichLeaves,
        allow_attach_supporting_document: allowAttachSupportingDocument,
        company_id: company || undefined,
        negative_cap: negativeCap,
        allow_carry_forward: allowCarryForward,
        allow_lapse: allowLapse,
        allow_encashment: allowEncashment,
        applicable_employee_category: applicableEmployeeCategory || undefined,
        applicable_locations: applicableLocations || undefined,
        gender_restriction: genderRestriction || undefined,
        eligible_after: eligibleAfter || undefined,
        days_required: daysRequired === "" ? undefined : Number(daysRequired),
        backdated_allowed: backdatedAllowed,
        max_backdated_days: maxBackdatedDays === "" ? undefined : Number(maxBackdatedDays),
        future_dated_allowed: futureDatedAllowed,
        minimum_working_days: minimumWorkingDays === "" ? undefined : Number(minimumWorkingDays),
        days_per_month: daysPerMonth === "" ? undefined : Number(daysPerMonth),
        maximum_annual_leave: maximumAnnualLeave === "" ? undefined : Number(maximumAnnualLeave),
        allow_leave_encashment: allowLeaveEncashment,
        max_allow_leave_carry_forward: maxAllowLeaveCarryForward === "" ? undefined : Number(maxAllowLeaveCarryForward),
        work_entry_type: workEntryType || undefined,
      };

      await createLeaveType(payload);
      toast.success("Leave type created.");
      document.getElementById("close-btn-policy")?.click();
      onSuccess();
    } catch (err) {
      console.error("Error creating leave type", err);
      toast.error("Failed to create leave type.");
    } finally {
      setIsSavingLeaveType(false);
    }
  };

  return (
    <div
      className="modal custom-modal fade"
      id="add_attendance_policy"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {data ? "Edit Leave Type" : "Add Leave Type"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-btn-policy"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

                    {/* Leave Type Form */}
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Leave Type</h5>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Name</label>
                    <input
                      className="form-control"
                      value={leaveName}
                      onChange={(e) => setLeaveName(e.target.value)}
                      onBlur={() => setLeaveNameTouched(true)}
                      placeholder="Enter leave type name"
                      style={{ borderColor: leaveNameTouched ? (leaveName ? "green" : "red") : undefined }}
                    />
                    {leaveNameTouched && !leaveName && (
                      <span style={{ color: "red", fontSize: 12, display: "block", marginTop: 6 }}>
                        Please enter leave type name.
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Leave Type Code</label>
                    <select
                      className="form-select"
                      value={leaveTypeCode as any}
                      onChange={(e) => setLeaveTypeCode(e.target.value)}
                      onBlur={() => setLeaveTypeCodeTouched(true)}
                      style={{ borderColor: leaveTypeCodeTouched ? (leaveTypeCode ? "green" : "red") : undefined }}
                    >
                      <option value="">Select code</option>
                      {leaveTypeOptions.map((opt) => (
                        <option key={opt.id} value={opt.leave_type_code ? String(opt.leave_type_code) : String(opt.id)}>
                          {opt.name}{opt.leave_type_code ? ` (${opt.leave_type_code})` : ` (${opt.id})`}
                        </option>
                      ))}
                    </select>
                    {leaveTypeCodeTouched && !leaveTypeCode && (
                      <span style={{ color: "red", fontSize: 12, display: "block", marginTop: 6 }}>
                        Please select a leave type code.
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Approval</label>
                    <select
                      className="form-select"
                      value={approvalLeaveRequests}
                      onChange={(e) => setApprovalLeaveRequests(e.target.value)}
                      onBlur={() => setApprovalTouched(true)}
                      style={{ borderColor: approvalTouched ? (approvalLeaveRequests ? "green" : "red") : undefined }}
                    >
                      <option value="">Select</option>
                      <option value="no_validation">No Validation</option>
                      <option value="by_officer">By Leave Officer</option>
                      <option value="by_approver">By Employee's Approver</option>
                      <option value="by_approver_officer">By Employee's Approver and Leave Officer</option>
                      <option value="multi_level">Multi Level Approval</option>
                    </select>
                    {approvalTouched && !approvalLeaveRequests && (
                      <span style={{ color: "red", fontSize: 12, display: "block", marginTop: 6 }}>
                        Please select an approval type.
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Requires allocation?</label>
                    <select
                      className="form-select"
                      value={allocationRequires}
                      onChange={(e) => setAllocationRequires(e.target.value)}
                      onBlur={() => setAllocationRequiresTouched(true)}
                      style={{ borderColor: allocationRequiresTouched ? (allocationRequires ? "green" : "red") : undefined }}
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no_limit">No Limit</option>
                    </select>
                    {allocationRequiresTouched && !allocationRequires && (
                      <span style={{ color: "red", fontSize: 12, display: "block", marginTop: 6 }}>
                        Please select allocation requirement.
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Leave Category</label>
                    <select className="form-select" value={leaveCategory} onChange={(e) => setLeaveCategory(e.target.value)} onBlur={() => setLeaveCategoryTouched(true)} style={{ borderColor: leaveCategoryTouched ? (leaveCategory ? "green" : "red") : undefined }}>
                      <option value="">Select</option>
                      <option value="statutory">statutory</option>
                      <option value="non_statutory">non statutory</option>
                      <option value="custom">custom</option>
                    </select>
                    {leaveCategoryTouched && !leaveCategory && (
                      <span style={{ color: "red", fontSize: 12, display: "block", marginTop: 6 }}>
                        Please select a leave category.
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Take Leave in</label>
                    <select className="form-select" value={takeLeaveIn} onChange={(e) => setTakeLeaveIn(e.target.value)}>
                      <option value="day">day</option>
                      <option value="half_day">half day</option>
                      <option value="hours">hours</option>
                    </select>
                  </div>
                </div>
              </div>

                <div className="mt-3">
                <button
                  className="btn btn-primary me-2"
                  onClick={handleSaveLeaveType}
                  disabled={isSavingLeaveType}
                >
                  {isSavingLeaveType ? 'Saving...' : 'Save'}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setLeaveName("");
                    setApprovalLeaveRequests("");
                    setAllocationRequires("");
                    setLeaveTypeCode("");
                    setLeaveCategory("");
                    setTakeLeaveIn("day");
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddEditAttendancePolicyModal;


