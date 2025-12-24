import React, { useEffect, useState } from "react";
import {
  addAttendancePolicy,
  updateAttendancePolicy,
  AttendancePolicy,
} from "./LeaveSettingServices";

interface Props {
  onSuccess: () => void;
  data: AttendancePolicy | null;
}

const AddEditAttendancePolicyModal: React.FC<Props> = ({ onSuccess, data }) => {
  // Initial state: keep only requested fields
  const initialFormState = {
    employees_selection: [] as any[],
    type: "",
    policy_number: "",
    no_of_days: "",
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
        policy_number: (data as any).policy_number ?? "",
        no_of_days: (data as any).no_of_days ?? "",
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
        // support multi-select
        if (target.multiple) {
          const values = Array.from(target.selectedOptions).map((o) => o.value);
          const selected = values.map((v) => employeesOptions.find((o) => String(o.id) === String(v))).filter(Boolean);
          setFormData((prev: any) => ({ ...prev, employees_selection: selected }));
        } else {
          const selectedValue = target.value;
          if (!selectedValue) {
            setFormData((prev: any) => ({ ...prev, employees_selection: [] }));
          } else {
            const found = employeesOptions.find((o) => String(o.id) === String(selectedValue));
            setFormData((prev: any) => ({ ...prev, employees_selection: found ? [found] : [] }));
          }
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

    // numeric fields for leave
    if (name === "no_of_days") {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
      return;
    }

    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };
  // no auto-calc — user provides explicit No of Days

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

    // ensure employees_selection is array of objects
    if (!Array.isArray(apiPayload.employees_selection)) {
      apiPayload.employees_selection = [];
    }

    // include policy_number (string)
    apiPayload.policy_number = apiPayload.policy_number ?? "";

    // convert numeric leave fields
    apiPayload.no_of_days = apiPayload.no_of_days === "" ? null : Number(apiPayload.no_of_days);


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
              {data ? "Edit Leave Policy" : "Add Leave Policy"}
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

                {/* Policy Number */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Policy Number</label>
                  <input
                    type="text"
                    name="policy_number"
                    className="form-control"
                    value={formData.policy_number ?? ""}
                    onChange={handleChange}
                    placeholder="e.g. POL-001"
                  />
                </div>

                {/* No of Days */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">No of Days</label>
                  <input
                    type="number"
                    name="no_of_days"
                    className="form-control"
                    value={formData.no_of_days ?? ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Employees (multi-select) */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Add Employee</label>
                  <select
                    name="employees_selection"
                    className="form-select"
                    multiple
                    value={(formData.employees_selection || []).map((e: any) => String(e.id))}
                    onChange={handleChange}
                  >
                    <option value="">Select employee</option>
                    {employeesOptions.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
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


