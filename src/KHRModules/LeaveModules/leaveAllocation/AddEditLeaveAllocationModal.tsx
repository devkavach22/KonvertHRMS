import React, { useEffect, useState } from "react";
import {
  addAttendancePolicy,
  updateAttendancePolicy,
  AttendancePolicy,
  createLeaveAllocation,
} from "./LeaveAllocationServices";
import toast from 'react-hot-toast';
import moment from "moment";

interface Props {
  onSuccess: () => void;
  data: AttendancePolicy | null;
}

const AddEditAttendancePolicyModal: React.FC<Props> = ({ onSuccess, data }) => {
  // Initial state for the new geofence-style attendance fields
  const initialFormState = {
    // new simplified allocation form
    leave_type: "",
    date_from: "",
    date_to: "",
    allocation_days: "",
    description: "",
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
        // map to new keys
        leave_type: (data as any).holiday_status_id ?? (data as any).leave_type ?? (data as any).type ?? "",
        date_from: (data as any).date_from ?? (data as any).from_date ?? (data as any).start_date ?? "",
        date_to: (data as any).date_to ?? (data as any).to_date ?? (data as any).end_date ?? "",
        allocation_days: (data as any).number_of_days ?? (data as any).allocation ?? (data as any).no_of_days ?? "",
        description: (data as any).description ?? (data as any).reason ?? "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [data]);

  // (Keep employeesOptions loader in case it's needed later)
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
            if (Array.isArray(json)) { result = json; break; }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // No date range auto-calculation for the simplified allocation form

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;
    setValidated(true);

    if (form.checkValidity() === false) {
      return;
    }

    // Prepare Payload: convert and validate fields
    const apiPayload: any = { ...formData };

    // convert numeric allocation_days
    apiPayload.allocation_days = apiPayload.allocation_days === "" ? null : Number(apiPayload.allocation_days);


    try {
      if (data && data.id) {
        await updateAttendancePolicy(data.id, apiPayload);
        toast.success("Leave allocation updated.");
      } else {
        // Map form fields to API expected payload
        const allocationPayload: any = {
          holiday_status_id: apiPayload.leave_type && !isNaN(Number(apiPayload.leave_type)) ? Number(apiPayload.leave_type) : undefined,
          allocation_type: "regular",
          date_from: apiPayload.date_from || undefined,
          date_to: apiPayload.date_to || undefined,
          number_of_days: apiPayload.allocation_days === null ? undefined : Number(apiPayload.allocation_days),
          description: apiPayload.description || undefined,
        };

        await createLeaveAllocation(allocationPayload);
        toast.success("Leave allocation created.");
      }

      const closeBtn = document.getElementById("close-btn-policy");
      closeBtn?.click();
      onSuccess();
    } catch (error) {
      console.error("Failed to save policy", error);
      toast.error("Error saving data.");
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
              {data ? "Edit Leave Allocation" : "Add Leave Allocation"}
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

                {/* New Leave Allocation fields */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Leave Type</label>
                  <select
                    name="leave_type"
                    className="form-select"
                    value={formData.leave_type ?? ""}
                    onChange={handleChange}
                  >
                    <option value="">Select type</option>
                    <option value="1">Paid Time Off</option>
                    <option value="2">Compensatory Days</option>
                    <option value="3">Earned Leave (EL)</option>
                    <option value="4">Sick Leave</option>
                    <option value="5">Annual Leave</option>
                    <option value="6">Casual Leave (CL)</option>
                  </select>
                </div>

                <div className="col-md-3 mb-3">
                  <label className="form-label">From Date</label>
                  <input
                    type="date"
                    name="date_from"
                    className="form-control"
                    value={formData.date_from ?? ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <label className="form-label">To Date</label>
                  <input
                    type="date"
                    name="date_to"
                    className="form-control"
                    value={formData.date_to ?? ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <label className="form-label">Allocation Days</label>
                  <input
                    type="number"
                    name="allocation_days"
                    className="form-control"
                    value={formData.allocation_days ?? ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Description */}
                <div className="col-md-12 mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows={3}
                    value={formData.description ?? ""}
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
                  {data ? "Update Changes" : "Save Leave Allocation"}
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


