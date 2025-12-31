import React, { useEffect, useState } from "react";
import {
  addAttendancePolicy,
  AttendancePolicy,
  getEmployeesForLeaveRequest,
} from "./LeaveRequestServices";
import moment from "moment";
import { DatePicker, Radio, Checkbox } from "antd";
import dayjs from "dayjs";

interface Props {
  onSuccess: () => void;
  data: AttendancePolicy | null;
}

const AddEditLeaveRequestModal: React.FC<Props> = ({ onSuccess, data }) => {
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
   const [isSubmitted, setIsSubmitted] = useState(false);
     const [errors, setErrors] = useState<any>({});

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
        const employees = await getEmployeesForLeaveRequest();
        if (mounted && Array.isArray(employees)) {
          // normalize to objects with id and name
          const opts = employees.map((emp: any) => ({ id: emp.id ?? emp.user_id, name: emp.name ?? emp.full_name ?? String(emp.id) }));
          setEmployeesOptions(opts);
        }
      } catch (e) {
        console.error("Error fetching employees:", e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // 2. RESET LOGIC: Listen for Modal Close
  useEffect(() => {
    const modalElement = document.getElementById("add_leave_request");
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
        // await updateAttendancePolicy(data.id, apiPayload);
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
      id="add_leave_request"
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
              id="close-btn-leave"
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
                  <label className="form-label">Holiday status</label>
                  <input
                    type="number"
                    name="Holiday_status_id"
                    className={`form-control ${formData.leave_balance !== "" && formData.leave_balance !== null && formData.leave_balance !== undefined ? 'is-valid' : (validated ? 'is-invalid' : '')}`}
                    value={formData.leave_balance ?? ""}
                    onChange={handleChange}
                  />
                  {validated && (formData.leave_balance === "" || formData.leave_balance === null || formData.leave_balance === undefined) && (
                    <span className="text-danger small">Required — enter Holiday status </span>
                  )}
                </div>


                {/* From */}
                <div className="col-md-3 mb-3">
                  <label className="form-label">From</label>
                                                <DatePicker
                                className={`form-control w-100 ${
                                  isSubmitted
                                    ? errors.date_of_marriage
                                      ? "is-invalid"
                                      : formData.date_of_marriage
                                      ? "is-valid"
                                      : ""
                                    : ""
                                }`}
                                value={
                                  formData.date_of_marriage
                                    ? dayjs(formData.date_of_marriage)
                                    : null
                                }
                                onChange={(_, dateStr) =>
                                  setFormData({
                                    ...formData,
                                    date_of_marriage: dateStr,
                                  })
                                }
                              />
                                                {validated && !(formData.to_date) && (
                    <span className="text-danger small">Required — select start date</span>
                  )}
                </div>

                {/* To */}
                <div className="col-md-3 mb-3">
                  <label className="form-label">To</label>
                          <DatePicker
                                className={`form-control w-100 ${
                                  isSubmitted
                                    ? errors.date_of_marriage
                                      ? "is-invalid"
                                      : formData.date_of_marriage
                                      ? "is-valid"
                                      : ""
                                    : ""
                                }`}
                                value={
                                  formData.date_of_marriage
                                    ? dayjs(formData.date_of_marriage)
                                    : null
                                }
                                onChange={(_, dateStr) =>
                                  setFormData({
                                    ...formData,
                                    date_of_marriage: dateStr,
                                  })
                                }
                              />
                  {validated && !(formData.to_date) && (
                    <span className="text-danger small">Required — select end date</span>
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

export default AddEditLeaveRequestModal;
