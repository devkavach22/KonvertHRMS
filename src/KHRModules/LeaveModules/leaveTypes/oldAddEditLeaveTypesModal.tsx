import React, { useEffect, useState } from "react";
import {
  addAttendancePolicy,
  updateAttendancePolicy,
  AttendancePolicy,
} from "./LeavetypesServices";
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

  // Additional local states used by the Leave Type form snippet
  const [leaveName, setLeaveName] = useState<string>("");
  const [leaveTypeCode, setLeaveTypeCode] = useState<number | "">("");
  const [isEarnedLeave, setIsEarnedLeave] = useState<boolean>(false);
  const [approvalLeaveRequests, setApprovalLeaveRequests] = useState<string>("");
  const [allocationRequires, setAllocationRequires] = useState<string>("");
  const [leaveCategory, setLeaveCategory] = useState<string>("");
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

  // 2. RESET LOGIC: Listen for Modal Close
  useEffect(() => {
    const modalElement = document.getElementById("add_attendance_policy");
    const handleModalClose = () => {
      setValidated(false);
      setFormData(initialFormState);
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
        await updateAttendancePolicy(data.id, apiPayload);
      } else {
        await addAttendancePolicy(apiPayload);
      }

      const closeBtn = document.getElementById("close-btn-policy");
      closeBtn?.click();
      onSuccess();
    } catch (error) {
      console.error("Failed to save policy", error);
      alert("Error saving data.");
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
                      placeholder="Enter leave type name"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Leave Type Code</label>
                    <input
                      type="number"
                      className="form-control"
                      value={leaveTypeCode}
                      onChange={(e) => setLeaveTypeCode(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="Numeric code"
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isEarned"
                      checked={isEarnedLeave}
                      onChange={(e) => setIsEarnedLeave(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="isEarned">Is Earned Leave</label>
                  </div>
                </div>
              </div>

              {/* <h6 className="mt-3">Leave Requests</h6> */}
              <br />
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Approval</label>
                    <select
                      className="form-select"
                      value={approvalLeaveRequests}
                      onChange={(e) => setApprovalLeaveRequests(e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="no_validation">No Validation</option>
                      <option value="by_officer">By Leave Officer</option>
                      <option value="by_approver">By Employee's Approver</option>
                      <option value="by_approver_officer">By Employee's Approver and Leave Officer</option>
                      <option value="multi_level">Multi Level Approval</option>
                    </select>
                  </div>
                </div>
              </div>

              <h6 className="mt-3">Allocation Requests</h6>
              <br />
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Requires allocation?</label>
                    <select
                      className="form-select"
                      value={allocationRequires}
                      onChange={(e) => setAllocationRequires(e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no_limit">No Limit</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Leave Category</label>
                    <select className="form-select" value={leaveCategory} onChange={(e) => setLeaveCategory(e.target.value)}>
                      <option value="">Select</option>
                      <option value="statutory">statutory</option>
                      <option value="non_statutory">non statutory</option>
                      <option value="custom">custom</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Employee Requests?</label>
                    <select className="form-select" value={employeeRequests} onChange={(e) => setEmployeeRequests(e.target.value)}>
                      <option value="">Select</option>
                      <option value="extra_days">Extra Days Requests Allowed</option>
                      <option value="not_allowed">Not Allowed</option>
                    </select>
                  </div>
                </div>

                {/* <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Approval?</label>
                    <select className="form-select" value={approvalAllocationRequests} onChange={(e) => setApprovalAllocationRequests(e.target.value)}>
                      <option value="">Select</option>
                      <option value="no_validation">No Validation</option>
                      <option value="by_officer">By Leave Officer</option>
                      <option value="by_approver">By Employee's Approver</option>
                      <option value="by_approver_officer">By Employee's Approver and Leave Officer</option>
                    </select>
                  </div>
                </div> */}
              </div>

              {/* Configuration section */}
              {/* <h6 className="mt-3">Configuration</h6> */}
              <br />
              <div className="row">
                {/* <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Notified Leave Officer?</label>
                    <select className="form-select" value={notifiedLeaveOfficer} onChange={(e) => setNotifiedLeaveOfficer(e.target.value)}>
                      <option value="">Select</option>
                      {employeesOptions.map((o) => (
                        <option key={o.id} value={o.id}>{o.name}</option>
                      ))}
                    </select>
                  </div>
                </div> */}

                {/* <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">HR Approval</label>
                    <select className="form-select" value={hrApproval} onChange={(e) => setHrApproval(e.target.value)}>
                      <option value="">Select</option>
                      {employeesOptions.map((o) => (
                        <option key={o.id} value={o.id}>{o.name}</option>
                      ))}
                    </select>
                  </div>
                </div> */}

                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label className="form-label">Take Leave in</label>
                    <select className="form-select" value={takeLeaveIn} onChange={(e) => setTakeLeaveIn(e.target.value)}>
                      <option value="day">day</option>
                      <option value="half_day">half day</option>
                      <option value="hours">hours</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-check mb-3 mt-3">
                    <input className="form-check-input" type="checkbox" id="deductExtraHours" checked={deductExtraHours} onChange={(e) => setDeductExtraHours(e.target.checked)} />
                    <label className="form-check-label" htmlFor="deductExtraHours">Deduct Extra Hours?</label>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-check mb-3 mt-3">
                    <input className="form-check-input" type="checkbox" id="publicHolidayIncluded" checked={publicHolidayIncluded} onChange={(e) => setPublicHolidayIncluded(e.target.checked)} />
                    <label className="form-check-label" htmlFor="publicHolidayIncluded">Public Holiday Included?</label>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-check mb-3 mt-3">
                    <input className="form-check-input" type="checkbox" id="showOnDashboard" checked={showOnDashboard} onChange={(e) => setShowOnDashboard(e.target.checked)} />
                    <label className="form-check-label" htmlFor="showOnDashboard">Show On Dashboard?</label>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-check mb-3 mt-3">
                    <input className="form-check-input" type="checkbox" id="sandwichLeaves" checked={sandwichLeaves} onChange={(e) => setSandwichLeaves(e.target.checked)} />
                    <label className="form-check-label" htmlFor="sandwichLeaves">Sandwich Leaves?</label>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-check mb-3 mt-3">
                    <input className="form-check-input" type="checkbox" id="allowAttach" checked={allowAttachSupportingDocument} onChange={(e) => setAllowAttachSupportingDocument(e.target.checked)} />
                    <label className="form-check-label" htmlFor="allowAttach">Allow To Attach Supporting Document</label>
                  </div>
                </div>

                <div className="col-md-6 mt-2">
                  <div className="form-group mb-3">
                    <label className="form-label">Kind of Leave?</label>
                    <select className="form-select" value={kindOfLeave} onChange={(e) => setKindOfLeave(e.target.value)}>
                      <option value="">Select</option>
                      <option value="worked_time">worked time</option>
                      <option value="absence">absence</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6 mt-2">
                  <div className="form-group mb-3">
                    <label className="form-label">Company</label>
                    <select className="form-select" value={company} onChange={(e) => setCompany(e.target.value)}>
                      <option value="">Select</option>
                      {companiesOptions.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <h6 className="mt-3">Negative Cap</h6>
              <br />
              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" id="negativeCap" checked={negativeCap} onChange={(e) => setNegativeCap(e.target.checked)} />
                <label className="form-check-label" htmlFor="negativeCap">negative_cap</label>
              </div>

              <h6 className="mt-3">Carry Forward Rules</h6>
              <br />
              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" id="carryForward" checked={allowCarryForward} onChange={(e) => setAllowCarryForward(e.target.checked)} />
                <label className="form-check-label" htmlFor="carryForward">Allow Carry Forward?</label>
              </div>

              <h6 className="mt-3">Lapse Rules</h6>
              <br />
              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" id="lapse" checked={allowLapse} onChange={(e) => setAllowLapse(e.target.checked)} />
                <label className="form-check-label" htmlFor="lapse">Allow Lapse?</label>
              </div>

              <h6 className="mt-3">Encashment Configuration</h6>
              <br />
              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" id="encashment" checked={allowEncashment} onChange={(e) => setAllowEncashment(e.target.checked)} />
                <label className="form-check-label" htmlFor="encashment">Allow Encashment?</label>
              </div>

              <h6 className="mt-3">Employee Restrictions</h6>
              <br />
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">Applicable Employee Category?</label>
                  <select className="form-select" value={applicableEmployeeCategory} onChange={(e) => setApplicableEmployeeCategory(e.target.value)}>
                    <option value="">Select</option>
                    <option value="staff">staff</option>
                    <option value="contract">contract</option>
                    <option value="intern">intern</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Applicable Locations?</label>
                  <ul className="nav nav-tabs flex-wrap">
                    {locationsOptions.length === 0 && (
                      <li className="nav-item">
                        <span className="form-text">No locations</span>
                      </li>
                    )}
                    {locationsOptions.map((l) => (
                      <li className="nav-item" key={l.id}>
                        <button
                          type="button"
                          className={"nav-link " + (String(applicableLocations) === String(l.id) ? "active" : "")}
                          onClick={() => setApplicableLocations(String(l.id))}
                        >
                          {l.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-6">
                  <label className="form-label">Gender Restriction?</label>
                  <select className="form-select" value={genderRestriction} onChange={(e) => setGenderRestriction(e.target.value)}>
                    <option value="note_selected">note selected</option>
                    <option value="all">all</option>
                    <option value="male">male</option>
                    <option value="female">female</option>
                    <option value="other">other</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Eligibility Timing - Eligible After?</label>
                  <select className="form-select" value={eligibleAfter} onChange={(e) => setEligibleAfter(e.target.value)}>
                    <option value="day_after_joining">day after joining</option>
                    <option value="confirmation_date">confirmation date</option>
                  </select>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-4">
                  <label className="form-label">Days Required?</label>
                  <input type="number" className="form-control" value={daysRequired} onChange={(e) => setDaysRequired(e.target.value === "" ? "" : Number(e.target.value))} />
                </div>

                <div className="col-md-4">
                  <div className="form-check mt-4">
                    <input className="form-check-input" type="checkbox" id="backdatedAllowed" checked={backdatedAllowed} onChange={(e) => setBackdatedAllowed(e.target.checked)} />
                    <label className="form-check-label" htmlFor="backdatedAllowed">Backdated Application Allowed?</label>
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Max Backdated Days?</label>
                  <input type="number" className="form-control" value={maxBackdatedDays} onChange={(e) => setMaxBackdatedDays(e.target.value === "" ? "" : Number(e.target.value))} />
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-6">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="futureDatedAllowed" checked={futureDatedAllowed} onChange={(e) => setFutureDatedAllowed(e.target.checked)} />
                    <label className="form-check-label" htmlFor="futureDatedAllowed">Future Dated Application Allowed?</label>
                  </div>
                </div>
              </div>

              <h6 className="mt-3">Leave Calculation</h6>
              <br />
              <div className="row">
                <div className="col-md-4">
                  <label className="form-label">Minimum Working Days?</label>
                  <input type="number" className="form-control" value={minimumWorkingDays} onChange={(e) => setMinimumWorkingDays(e.target.value === "" ? "" : Number(e.target.value))} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Days Per Month?</label>
                  <input step="0.1" type="number" className="form-control" value={daysPerMonth} onChange={(e) => setDaysPerMonth(e.target.value === "" ? "" : Number(e.target.value))} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Maximum Annual Leave?</label>
                  <input type="number" className="form-control" value={maximumAnnualLeave} onChange={(e) => setMaximumAnnualLeave(e.target.value === "" ? "" : Number(e.target.value))} />
                </div>
              </div>

              <h6 className="mt-3">Leave Encashment</h6>
              <br />
              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" id="allowLeaveEncashment" checked={allowLeaveEncashment} onChange={(e) => setAllowLeaveEncashment(e.target.checked)} />
                <label className="form-check-label" htmlFor="allowLeaveEncashment">Allow Leave Encashment?</label>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Maximum Allow Leave Carry Forward?</label>
                  <input step="0.1" type="number" className="form-control" value={maxAllowLeaveCarryForward} onChange={(e) => setMaxAllowLeaveCarryForward(e.target.value === "" ? "" : Number(e.target.value))} />
                </div>
              </div>

              <h6 className="mt-3">Payroll</h6>
              <br />
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Work Entry Type?</label>
                  <select className="form-select" value={workEntryType} onChange={(e) => setWorkEntryType(e.target.value)}>
                    <option value="">Select</option>
                    <option value="attendance">Attendance</option>
                    <option value="overtime_hours">Overtime Hours</option>
                    <option value="generic_time_off">Generic Time Off</option>
                    <option value="compensatory_time_off">Compensatory Time Off</option>
                    <option value="home_working">Home Working</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="sick_time_off">Sick Time Off</option>
                    <option value="paid_time_off">Paid Time Off</option>
                  </select>
                </div>
              </div>

              <div className="mt-3">
                <button
                  className="btn btn-primary me-2"
                  onClick={() => {
                    // placeholder save - wire to API if needed
                    // console.log('Save', { leaveName, approvalLeaveRequests, isEarnedLeave });
                    alert('Save action not implemented — state captured locally.');
                  }}
                >
                  Save
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setLeaveName("");
                    setApprovalLeaveRequests("");
                    setIsEarnedLeave(false);
                    setAllocationRequires("");
                    setLeaveTypeCode("");
                    setLeaveCategory("");
                    setEmployeeRequests("");
                    setApprovalAllocationRequests("");
                    // reset new fields
                    setNotifiedLeaveOfficer("");
                    setHrApproval("");
                    setTakeLeaveIn("day");
                    setDeductExtraHours(false);
                    setPublicHolidayIncluded(false);
                    setShowOnDashboard(false);
                    setSandwichLeaves(false);
                    setAllowAttachSupportingDocument(false);
                    setKindOfLeave("");
                    setCompany("");
                    setNegativeCap(false);
                    setAllowCarryForward(false);
                    setAllowLapse(false);
                    setAllowEncashment(false);
                    setApplicableEmployeeCategory("");
                    setApplicableLocations("");
                    setAllowLeaveEncashment(false);
                    setMaxAllowLeaveCarryForward("");
                    setWorkEntryType("");
                    setGenderRestriction("all");
                    setEligibleAfter("day_after_joining");
                    setDaysRequired("");
                    setBackdatedAllowed(false);
                    setMaxBackdatedDays("");
                    setFutureDatedAllowed(false);
                    setMinimumWorkingDays("");
                    setDaysPerMonth("");
                    setMaximumAnnualLeave("");
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


