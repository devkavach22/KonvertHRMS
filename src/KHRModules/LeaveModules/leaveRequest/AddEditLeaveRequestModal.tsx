import React, { useEffect, useState } from "react";
import {
  addAttendancePolicy,
  updateAttendancePolicy,
  AttendancePolicy,
} from "./LeaveRequestServices";
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
    // removed remaining_days in favor of `requested` and `leave_balance`
    leave_balance: "",
    requested: "",
    company: "",
    department: "",
    payslip_state: "",
    hod_document: null as File | null,
    reason: "",
  };

  const [formData, setFormData] = useState<any>(initialFormState);
  const [validated, setValidated] = useState(false);
  const [employeesOptions, setEmployeesOptions] = useState<any[]>([]);
  const [departmentsOptions, setDepartmentsOptions] = useState<any[]>([]);
  const [companyName, setCompanyName] = useState<string>("");

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
          leave_balance: (data as any).leave_balance ?? "",
          requested: (data as any).requested ?? "",
          company: (data as any).company ?? "",
          department: (data as any).department ?? "",
          payslip_state: (data as any).payslip_state ?? "",
          hod_document: (data as any).hod_document ?? null,
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
          // fetch departments and company (best-effort endpoints)
          try {
            const depRes = await fetch('/api/departments');
            if (depRes.ok) {
              const depJson = await depRes.json();
              const deps = Array.isArray(depJson) ? depJson : (Array.isArray(depJson.data) ? depJson.data : []);
              const depOpts = deps.map((d: any) => ({ id: d.id ?? d.value, name: d.name ?? d.title ?? String(d.id) }));
              setDepartmentsOptions(depOpts);
            }
          } catch (e) {
            // ignore
          }

          try {
            const compRes = await fetch('/api/company');
            if (compRes.ok) {
              const compJson = await compRes.json();
              const comp = compJson && (compJson.name ?? compJson.company_name ?? (compJson.data && compJson.data.name));
              if (comp) setCompanyName(comp);
            }
          } catch (e) {
            // ignore
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

    // file input (HOD approval document)
    if (target instanceof HTMLInputElement && target.type === 'file') {
      const file = (target as HTMLInputElement).files && (target as HTMLInputElement).files![0];
      setFormData((prev: any) => ({ ...prev, [name]: file || null }));
      return;
    }

    // no geo numeric fields handled here anymore

    // numeric fields for leave
    if (name === "no_of_days" || name === "leave_balance" || name === "requested") {
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
    apiPayload.leave_balance = apiPayload.leave_balance === "" ? null : Number(apiPayload.leave_balance);
    apiPayload.requested = apiPayload.requested === "" ? null : Number(apiPayload.requested);

    // ensure simple scalar fields
    apiPayload.company = apiPayload.company || companyName || null;
    apiPayload.department = apiPayload.department || null;
    apiPayload.payslip_state = apiPayload.payslip_state || null;

    // hod document: include file object if provided (backend must support multipart)
    // We'll include as-is; the service may need to use FormData when sending if file is present.
    if (apiPayload.hod_document && apiPayload.hod_document instanceof File) {
      // leave it in payload; caller/service should handle file uploads
    }


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
              {data ? "Edit Leave Request" : "Add Leave Request"}
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
          <div className="modal-body">
            <form
              className={`needs-validation ${validated ? "was-validated" : ""}`}
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="row">
                {/* Employee (search/list) */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Employee</label>
                  <select
                    name="employees_selection"
                    className={`form-select ${formData.employees_selection && formData.employees_selection[0] ? 'is-valid' : (validated ? 'is-invalid' : '')}`}
                    value={formData.employees_selection && formData.employees_selection[0] ? String(formData.employees_selection[0].id) : ""}
                    onChange={handleChange}
                  >
                    <option value="">Select employee</option>
                    {employeesOptions.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                  {validated && (!formData.employees_selection || formData.employees_selection.length === 0) && (
                    <span className="text-danger small">Required — select an employee</span>
                  )}
                </div>

                {/* Leave Balance */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Leave Balance</label>
                  <input
                    type="number"
                    name="leave_balance"
                    className={`form-control ${formData.leave_balance !== "" && formData.leave_balance !== null && formData.leave_balance !== undefined ? 'is-valid' : (validated ? 'is-invalid' : '')}`}
                    value={formData.leave_balance ?? ""}
                    onChange={handleChange}
                  />
                  {validated && (formData.leave_balance === "" || formData.leave_balance === null || formData.leave_balance === undefined) && (
                    <span className="text-danger small">Required — enter leave balance</span>
                  )}
                </div>

                {/* Company (static from API) */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Company</label>
                  <input
                    type="text"
                    name="company"
                    className={`form-control ${ (formData.company || companyName) ? 'is-valid' : (validated ? 'is-invalid' : '')}`}
                    value={formData.company ?? companyName ?? ""}
                    readOnly
                  />
                  {validated && !(formData.company || companyName) && (
                    <span className="text-danger small">Required — company not found</span>
                  )}
                </div>

                {/* Department */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Department</label>
                  <select
                    name="department"
                    className={`form-select ${formData.department ? 'is-valid' : (validated ? 'is-invalid' : '')}`}
                    value={formData.department ?? ""}
                    onChange={handleChange}
                  >
                    {/* <option value="">Select department</option>
                    {departmentsOptions.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))} */}
                  </select>
                  {validated && !(formData.department) && (
                    <span className="text-danger small">Required — select department</span>
                  )}
                </div>

                {/* Leave Type */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Leave Type</label>
                  <select
                    name="type"
                    className={`form-select ${formData.type ? 'is-valid' : (validated ? 'is-invalid' : '')}`}
                    value={formData.type ?? ""}
                    onChange={handleChange}
                  >
                    <option value="">Select type</option>
                    <option value="sick">Sick Time Off</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="extra_hours">Extra Hours</option>
                  </select>
                  {validated && !(formData.type) && (
                    <span className="text-danger small">Required — select leave type</span>
                  )}
                </div>

                {/* From */}
                <div className="col-md-3 mb-3">
                  <label className="form-label">From</label>
                  <input
                    type="date"
                    name="from_date"
                    className={`form-control ${formData.from_date ? 'is-valid' : (validated ? 'is-invalid' : '')}`}
                    value={formData.from_date ?? ""}
                    onChange={handleChange}
                  />
                  {validated && !(formData.from_date) && (
                    <span className="text-danger small">Required — select start date</span>
                  )}
                </div>

                {/* To */}
                <div className="col-md-3 mb-3">
                  <label className="form-label">To</label>
                  <input
                    type="date"
                    name="to_date"
                    className={`form-control ${formData.to_date ? 'is-valid' : (validated ? 'is-invalid' : '')}`}
                    value={formData.to_date ?? ""}
                    onChange={handleChange}
                  />
                  {validated && !(formData.to_date) && (
                    <span className="text-danger small">Required — select end date</span>
                  )}
                </div>

                {/* No of Days (auto-calc) */}
                <div className="col-md-3 mb-3">
                  <label className="form-label">No of Days</label>
                  <input
                    type="number"
                    name="no_of_days"
                    className={`form-control ${formData.no_of_days !== "" && formData.no_of_days !== null && formData.no_of_days !== undefined ? 'is-valid' : (validated ? 'is-invalid' : '')}`}
                    value={formData.no_of_days ?? ""}
                    onChange={handleChange}
                  />
                  {validated && (formData.no_of_days === "" || formData.no_of_days === null || formData.no_of_days === undefined) && (
                    <span className="text-danger small">Required — enter number of days</span>
                  )}
                </div>

                {/* Requested (Days/Hours) */}
                <div className="col-md-3 mb-3">
                  <label className="form-label">Requested (Days/Hours)</label>
                  <input
                    type="number"
                    name="requested"
                    className={`form-control ${formData.requested !== "" && formData.requested !== null && formData.requested !== undefined ? 'is-valid' : (validated ? 'is-invalid' : '')}`}
                    value={formData.requested ?? ""}
                    onChange={handleChange}
                  />
                  {validated && (formData.requested === "" || formData.requested === null || formData.requested === undefined) && (
                    <span className="text-danger small">Required — enter requested amount</span>
                  )}
                </div>

                {/* HOD Approval Document (upload) */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">HOD Approval Document</label>
                  <input
                    type="file"
                    name="hod_document"
                    className={`form-control ${formData.hod_document ? 'is-valid' : (validated ? 'is-invalid' : '')}`}
                    onChange={handleChange}
                  />
                  {validated && !(formData.hod_document) && (
                    <span className="text-danger small">Required — upload HOD approval document</span>
                  )}
                </div>

                {/* Payslip State */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Payslip State</label>
                  <select
                    name="payslip_state"
                    className={`form-select ${formData.payslip_state ? 'is-valid' : (validated ? 'is-invalid' : '')}`}
                    value={formData.payslip_state ?? ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="to_compute_next">To compute in next payslip</option>
                    <option value="computed_current">Computed in current payslip</option>
                    <option value="defer_next">To defer to next payslip</option>
                  </select>
                  {validated && !(formData.payslip_state) && (
                    <span className="text-danger small">Required — select payslip state</span>
                  )}
                </div>

                {/* Reason */}
                <div className="col-md-12 mb-3">
                  <label className="form-label">Reason</label>
                  <textarea
                    name="reason"
                    className={`form-control ${formData.reason ? 'is-valid' : (validated ? 'is-invalid' : '')}`}
                    rows={3}
                    value={formData.reason ?? ""}
                    onChange={handleChange}
                  />
                  {validated && !(formData.reason) && (
                    <span className="text-danger small">Required — enter reason</span>
                  )}
                </div>

                {/* removed geo fields and JSON textarea per request */}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {data ? "Update Changes" : "Save Policy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditAttendancePolicyModal;


