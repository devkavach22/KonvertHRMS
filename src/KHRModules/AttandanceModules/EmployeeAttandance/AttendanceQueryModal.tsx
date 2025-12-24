import { TimePicker, Select } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { toast } from "react-toastify";

const { Option } = Select;

const AttendanceQueryModal = ({
  attendance,
  onClose,
  isAdmin = false,
}: any) => {
  const [formData, setFormData] = useState<any>({
    employee_id: attendance?.employee_id || "",
    category: "",
    reason: "",
    requested_check_in: "",
    requested_check_out: "",
    approval_logs: attendance?.approval_logs || [],
  });

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* Dummy Data */
  const employeesList = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
  ];

  const categories = [
    { id: "early_login", name: "Early Login" },
    { id: "late_login", name: "Late Login" },
    { id: "missed_checkout", name: "Missed Checkout" },
    { id: "leave", name: "Leave Approval" },
  ];

  /* =========================
     VALIDATION FUNCTION
     ========================= */
  const validateForm = () => {
    let tempErrors: any = {};
    let isValid = true;

    // Employee (always required)
    if (!formData.employee_id) {
      tempErrors.employee_id = "Employee is required.";
      isValid = false;
    }

    // Category
    if (!formData.category) {
      tempErrors.category = "Regularization category is required.";
      isValid = false;
    }

    // Reason
    if (!formData.reason || formData.reason.trim().length < 5) {
      tempErrors.reason = "Reason must be at least 5 characters.";
      isValid = false;
    }

    // Time validations (conditional)
    if (
      formData.category !== "leave" &&
      !formData.requested_check_in &&
      !formData.requested_check_out
    ) {
      tempErrors.requested_check_in =
        "Check-in or Check-out time is required.";
      tempErrors.requested_check_out =
        "Check-in or Check-out time is required.";
      isValid = false;
    }

    // Check-out must be after check-in
    if (
      formData.requested_check_in &&
      formData.requested_check_out
    ) {
      const inTime = dayjs(formData.requested_check_in, "HH:mm");
      const outTime = dayjs(formData.requested_check_out, "HH:mm");

      if (outTime.isBefore(inTime)) {
        tempErrors.requested_check_out =
          "Check-out time must be after Check-in time.";
        isValid = false;
      }
    }

    setErrors(tempErrors);
    return isValid;
  };

  /* =========================
     SUBMIT HANDLER
     ========================= */
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix validation errors");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      attendance_id: attendance.id,
      employee_id: formData.employee_id,
      category: formData.category,
      reason: formData.reason.trim(),
      requested_check_in: formData.requested_check_in || null,
      requested_check_out: formData.requested_check_out || null,
    };

    try {
      // API CALL
      // await submitAttendanceQuery(payload);

      toast.success("Attendance query sent to HR");
      onClose();
    } catch (error) {
      toast.error("Failed to submit query");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">Attendance Regularization</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            <div className="row">
              {/* Employee */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Employee</label>
                <Select className="w-100" value={formData.employee_id} disabled>
                  {employeesList.map((emp) => (
                    <Option key={emp.id} value={emp.id}>
                      {emp.name}
                    </Option>
                  ))}
                </Select>
                {errors.employee_id && (
                  <small className="text-danger">{errors.employee_id}</small>
                )}
              </div>

              {/* Category */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Regularization Category{" "}
                  <span className="text-danger">*</span>
                </label>
                <Select
                  className="w-100"
                  placeholder="Select Category"
                  onChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  {categories.map((cat) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
                {errors.category && (
                  <small className="text-danger">{errors.category}</small>
                )}
              </div>

              {/* Reason */}
              <div className="col-md-12 mb-3">
                <label className="form-label">
                  Reason <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                />
                {errors.reason && (
                  <small className="text-danger">{errors.reason}</small>
                )}
              </div>

              {/* Requested Check-in */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Requested Check-in</label>
                <TimePicker
                  className="w-100"
                  format="HH:mm"
                  onChange={(time) =>
                    setFormData({
                      ...formData,
                      requested_check_in: time
                        ? dayjs(time).format("HH:mm")
                        : "",
                    })
                  }
                />
                {errors.requested_check_in && (
                  <small className="text-danger">
                    {errors.requested_check_in}
                  </small>
                )}
              </div>

              {/* Requested Check-out */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Requested Check-out</label>
                <TimePicker
                  className="w-100"
                  format="HH:mm"
                  onChange={(time) =>
                    setFormData({
                      ...formData,
                      requested_check_out: time
                        ? dayjs(time).format("HH:mm")
                        : "",
                    })
                  }
                />
                {errors.requested_check_out && (
                  <small className="text-danger">
                    {errors.requested_check_out}
                  </small>
                )}
              </div>
            </div>

            {/* Approval Logs */}
            {isAdmin && formData.approval_logs.length > 0 && (
              <div className="mt-4">
                <h6>Approval History</h6>
                <ul className="list-group">
                  {formData.approval_logs.map((log: any, index: number) => (
                    <li key={index} className="list-group-item">
                      <strong>{log.action}</strong> by {log.approver_role}
                      <br />
                      <small className="text-muted">
                        {log.comment || "No comment"} •{" "}
                        {new Date(log.created_at).toLocaleString()}
                      </small>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button className="btn btn-light" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceQueryModal;
