import React, { useEffect, useState } from "react";
import {
  addAttendancePolicy,
  updateAttendancePolicy,
  AttendancePolicy,
} from "./LeaveServices";
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
              {data ? "Edit Geo Configurations" : "Add Geo Configurations"}
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
                {/* Employee Name - from API */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Employee Name</label>
                  <select
                    name="employees_selection"
                    className="form-select"
                    value={formData.employees_selection && formData.employees_selection[0] ? String(formData.employees_selection[0].id) : ""}
                    onChange={handleChange}
                  >
                    <option value="">Select employee</option>
                    {employeesOptions.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>

                {/* Leave Type */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Leave Type</label>
                  <select
                    name="type"
                    className="form-select"
                    value={formData.type ?? ""}
                    onChange={handleChange}
                  >
                    <option value="">Select type</option>
                    <option value="medical">Medical</option>
                    <option value="casual">Casual</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>

                {/* From */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">From</label>
                  <input
                    type="date"
                    name="from_date"
                    className="form-control"
                    value={formData.from_date ?? ""}
                    onChange={handleChange}
                  />
                </div>

                {/* To */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">To</label>
                  <input
                    type="date"
                    name="to_date"
                    className="form-control"
                    value={formData.to_date ?? ""}
                    onChange={handleChange}
                  />
                </div>

                {/* No of Days */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">No of Days</label>
                  <input
                    type="number"
                    name="no_of_days"
                    className="form-control"
                    value={formData.no_of_days ?? ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Remaining Days */}
                <div className="col-md-12 mb-3">
                  <label className="form-label">Remaining Days</label>
                  <input
                    type="number"
                    name="remaining_days"
                    className="form-control"
                    value={formData.remaining_days ?? ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Reason */}
                <div className="col-md-12 mb-3">
                  <label className="form-label">Reason</label>
                  <textarea
                    name="reason"
                    className="form-control"
                    rows={3}
                    value={formData.reason ?? ""}
                    onChange={handleChange}
                  />
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


