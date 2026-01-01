import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  LeaveRequest,
  getEmployeesForLeaveRequest,
  updateLeaveRequest,
  createLeaveRequest,
} from "./LeaveRequestServices";
import { DatePicker } from "antd";
import moment from "moment";

interface Props {
  onSuccess: () => void;
  data: LeaveRequest | null;
}

const AddEditLeaveRequestModal: React.FC<Props> = ({ onSuccess, data }) => {
  const initialFormState = {
    employees_selection: [] as any[],
    holiday_status_id: "",
    from_date: "",
    to_date: "",
    no_of_days: "",
    reason: "",
    responsible_ids: "", // ✅ keep as string
    include_public_holidays: false,
    overtime_deductible: false,
    is_earned_leave: false,
  };

  const [formData, setFormData] = useState<any>(initialFormState);
  const [employeesOptions, setEmployeesOptions] = useState<any[]>([]);
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});

  /* -------------------- EDIT MODE -------------------- */
  useEffect(() => {
    if (data) {
      setFormData({
        employees_selection: [],
        holiday_status_id: data.holiday_status_id ?? "",
        from_date: data.from_date ?? "",
        to_date: data.to_date ?? "",
        no_of_days: data.no_of_days ?? "",
        reason: data.reason ?? "",
        responsible_ids: data.responsible_ids
          ? String(data.responsible_ids)
          : "",
        include_public_holidays: Boolean(data.include_public_holidays),
        overtime_deductible: Boolean(data.overtime_deductible),
        is_earned_leave: Boolean(data.is_earned_leave),
      });
    } else {
      setFormData(initialFormState);
    }
  }, [data]);

  /* -------------------- EMPLOYEES -------------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await getEmployeesForLeaveRequest();
        const opts = res.map((e: any) => ({
          id: e.id ?? e.user_id,
          name: e.name ?? e.full_name,
        }));
        setEmployeesOptions(opts);
      } catch {
        toast.error("Failed to load employees");
      }
    })();
  }, []);

  /* -------------------- AUTO DAYS -------------------- */
  useEffect(() => {
    if (formData.from_date && formData.to_date) {
      const days =
        moment(formData.to_date).diff(
          moment(formData.from_date),
          "days"
        ) + 1;
      setFormData((p: any) => ({ ...p, no_of_days: days }));
    }
  }, [formData.from_date, formData.to_date]);

  /* -------------------- CHANGE -------------------- */
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    if (name === "employees_selection") {
      const emp = employeesOptions.find((e) => String(e.id) === value);
      setFormData((p: any) => ({
        ...p,
        employees_selection: emp ? [emp] : [],
      }));
      return;
    }

    if (type === "checkbox") {
      setFormData((p: any) => ({ ...p, [name]: checked }));
      return;
    }

    // ✅ allow typing freely
    setFormData((p: any) => ({ ...p, [name]: value }));
  };

  /* -------------------- VALIDATION -------------------- */
  const validateForm = () => {
    const err: any = {};

    if (!formData.employees_selection.length)
      err.employees_selection = "Employee required";

    if (!formData.holiday_status_id)
      err.holiday_status_id = "Holiday status required";

    if (!formData.from_date) err.from_date = "From date required";
    if (!formData.to_date) err.to_date = "To date required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidated(true);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        holiday_status_id: Number(formData.holiday_status_id),
        date_from: formData.from_date,
        date_to: formData.to_date,
        reason: formData.reason,
        responsible_ids: formData.responsible_ids
          ? Number(formData.responsible_ids)
          : null,
        include_public_holidays: formData.include_public_holidays,
        overtime_deductible: formData.overtime_deductible,
        is_earned_leave: formData.is_earned_leave,
      };

      if (data?.id) {
        await updateLeaveRequest(Number(data.id), payload);
        toast.success("Leave updated");
      } else {
        await createLeaveRequest({
          employee_id: formData.employees_selection[0].id,
          ...payload,
        });
        toast.success("Leave created");
      }

      onSuccess();
      document.getElementById("close-btn-leave")?.click();
    } catch {
      toast.error("API call failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal fade" id="add_leave_request">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5>{data ? "Edit Leave" : "Add Leave"}</h5>
            <button
              id="close-btn-leave"
              data-bs-dismiss="modal"
              className="btn-close"
            />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body row">
              {/* Employee */}
              <div className="col-md-6 mb-3">
                <label>Employee</label>
                <select
                  name="employees_selection"
                  className={`form-select ${
                    validated && errors.employees_selection
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  {employeesOptions.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Holiday */}
              <div className="col-md-6 mb-3">
                <label>Holiday Status</label>
                <input
                  type="number"
                  name="holiday_status_id"
                  className={`form-control ${
                    validated && errors.holiday_status_id
                      ? "is-invalid"
                      : ""
                  }`}
                  value={formData.holiday_status_id}
                  onChange={handleChange}
                />
              </div>

              {/* Dates */}
              <div className="col-md-3 mb-3">
                <label>From</label>
                <DatePicker
                  className="w-100"
                  value={
                    formData.from_date
                      ? moment(formData.from_date)
                      : null
                  }
                  onChange={(_, d) =>
                    setFormData((p: any) => ({ ...p, from_date: d }))
                  }
                />
              </div>

              <div className="col-md-3 mb-3">
                <label>To</label>
                <DatePicker
                  className="w-100"
                  value={
                    formData.to_date ? moment(formData.to_date) : null
                  }
                  onChange={(_, d) =>
                    setFormData((p: any) => ({ ...p, to_date: d }))
                  }
                />
              </div>

              {/* Reason */}
              <div className="col-md-12 mb-3">
                <label>Reason</label>
                <textarea
                  name="reason"
                  className="form-control"
                  value={formData.reason}
                  onChange={handleChange}
                />
              </div>

              {/* Responsible IDs */}
              <div className="col-md-6 mb-3">
                <label>Responsible IDs</label>
                <input
                  type="number"
                  name="responsible_ids"
                  className="form-control"
                  value={formData.responsible_ids}
                  onChange={(e) => setFormData((p: any) => ({ ...p, responsible_ids: e.target.value }))}
                />
              </div>

              {/* Checkboxes */}
              <div className="col-md-6 mb-3">
                <div className="form-check d-flex align-items-center gap-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="include_public_holidays"
                    checked={formData.include_public_holidays}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">
                    Include Public Holidays in Duration
                  </label>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div className="form-check d-flex align-items-center gap-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="overtime_deductible"
                    checked={formData.overtime_deductible}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">
                    Overtime Deductible
                  </label>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div className="form-check d-flex align-items-center gap-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="is_earned_leave"
                    checked={formData.is_earned_leave}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">
                    Is Earned Leave
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Leave"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditLeaveRequestModal;
