import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CommonSelect from "../../../core/common/commonSelect";
import CommonAlertCard from "@/CommonComponent/AlertKHR/CommonAlertCard";
import {
  addAttendancePolicy,
  LeaveRequest,
  getEmployeesForLeaveRequest,
  updateLeaveRequest,
} from "./LeaveRequestServices";
import moment from "moment";
import { DatePicker, Radio, Checkbox } from "antd";
import dayjs from "dayjs";

interface Props {
  onSuccess: () => void;
  data: LeaveRequest | null;
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
    // removed remaining_days in favor of `requested` and `holiday_status_id`
    holiday_status_id: "",
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  // 1. DATA SYNC: Populate form when editing
  useEffect(() => {
  if (data) {
    setFormData({
      employees_selection: [],
      type: data.leave_type || "",
      from_date: data.from_date || "",
      to_date: data.to_date || "",
      no_of_days: data.no_of_days || "",
      holiday_status_id: data.holiday_status_id || "",
      requested: data.requested || "",
      company: data.company_name || "",
      department: data.department_name || "",
      payslip_state: data.payslip_state || "",
      hod_document: null,
      reason: data.reason || "",
    });
  }
}, [data]);


  // Update employee selection when employeesOptions are loaded
  useEffect(() => {
    if (data && employeesOptions.length > 0 && formData.employees_selection.length > 0) {
      const employeeId = (data as any).employee_id || (data as any).employee_name;
      if (employeeId) {
        const foundEmployee = employeesOptions.find(emp => String(emp.id) === String(employeeId) || emp.name === employeeId);
        if (foundEmployee && String(foundEmployee.id) !== String(formData.employees_selection[0]?.id)) {
          setFormData((prev: any) => ({
            ...prev,
            employees_selection: [foundEmployee]
          }));
        }
      }
    }
  }, [employeesOptions, data]);

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
      resetForm();
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
    if (name === "no_of_days" || name === "holiday_status_id" || name === "requested") {
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

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsSubmitted(false);
    setShowErrorAlert(false);
  };

  const validateForm = () => {
    let tempErrors: any = {};
    let isValid = true;

    if (!formData.employees_selection || formData.employees_selection.length === 0) {
      tempErrors.employees_selection = "Employee is required.";
      isValid = false;
    }
    if (!formData.holiday_status_id) {
      tempErrors.holiday_status_id = "Holiday status is required.";
      isValid = false;
    }
    if (!formData.from_date) {
      tempErrors.from_date = "From date is required.";
      isValid = false;
    }
    if (!formData.to_date) {
      tempErrors.to_date = "To date is required.";
      isValid = false;
    }
    if (!formData.reason?.trim()) {
      tempErrors.reason = "Reason is required.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validateForm()) {
      setShowErrorAlert(true);
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare Payload: convert numeric fields and ensure employees_selection is an array
      const apiPayload: any = { ...formData };

      // ensure employees_selection is array of objects
      if (!Array.isArray(apiPayload.employees_selection)) {
        apiPayload.employees_selection = [];
      }

      // convert numeric leave fields
      apiPayload.no_of_days = apiPayload.no_of_days === "" ? null : Number(apiPayload.no_of_days);
      apiPayload.holiday_status_id = apiPayload.holiday_status_id === "" ? null : Number(apiPayload.holiday_status_id);
      apiPayload.requested = apiPayload.requested === "" ? null : Number(apiPayload.requested);

      // ensure simple scalar fields
      apiPayload.company = apiPayload.company || companyName || null;
      apiPayload.department = apiPayload.department || null;
      apiPayload.payslip_state = apiPayload.payslip_state || null;

      if (data?.id) {
        const updatePayload = {
          ...apiPayload,
          user_id: localStorage.getItem("user_id") || localStorage.getItem("userId") || localStorage.getItem("id")
        };
        await updateLeaveRequest(Number(data.id), updatePayload);
        toast.success("Leave request updated!");
      } else {
        await addAttendancePolicy(apiPayload);
        toast.success("Leave request created!");
      }
      onSuccess();
      document.getElementById("close-btn-leave")?.click();
    } catch (err: any) {
      toast.error("Error saving leave request");
    } finally {
      setIsSubmitting(false);
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
            {showErrorAlert && Object.keys(errors).length > 0 && (
              <CommonAlertCard
                alertType="danger"
                message={Object.values(errors).join(', ')}
                iconClass="ti ti-alert-circle"
                title="Validation Error"
              />
            )}
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

                {/* Holiday Status ID */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Holiday status</label>
                  <input
                    type="number"
                    name="holiday_status_id"
                    className={`form-control ${formData.holiday_status_id !== "" && formData.holiday_status_id !== null && formData.holiday_status_id !== undefined ? 'is-valid' : (validated ? 'is-invalid' : '')}`}
                    value={formData.holiday_status_id ?? ""}
                    onChange={handleChange}
                  />
                  {validated && (formData.holiday_status_id === "" || formData.holiday_status_id === null || formData.holiday_status_id === undefined) && (
                    <span className="text-danger small">Required — enter Holiday status </span>
                  )}
                </div>


                {/* From */}
                <div className="col-md-3 mb-3">
                  <label className="form-label">From</label>
                  <DatePicker
                    className={`form-control w-100 ${
                      formData.from_date ? 'is-valid' : (validated ? 'is-invalid' : '')
                    }`}
                    value={formData.from_date ? dayjs(formData.from_date) : null}
                    onChange={(_, dateStr) =>
                      setFormData({
                        ...formData,
                        from_date: dateStr,
                      })
                    }
                  />
                  {validated && !formData.from_date && (
                    <span className="text-danger small">Required — select start date</span>
                  )}
                </div>

                {/* To */}
                <div className="col-md-3 mb-3">
                  <label className="form-label">To</label>
                  <DatePicker
                    className={`form-control w-100 ${
                      formData.to_date ? 'is-valid' : (validated ? 'is-invalid' : '')
                    }`}
                    value={formData.to_date ? dayjs(formData.to_date) : null}
                    onChange={(_, dateStr) =>
                      setFormData({
                        ...formData,
                        to_date: dateStr,
                      })
                    }
                  />
                  {validated && !formData.to_date && (
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
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : (data ? "Update Changes" : "Save Policy")}
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
