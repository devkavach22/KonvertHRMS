import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import CommonSelect from "../../../core/common/commonSelect";

import {
  createLeaveAllocation,
  updateLeaveAllocation,
} from "./LeaveAllocationServices";
import { getEmployeesBasicInfo } from "@/KHRModules/EmployeModules/Employee/EmployeeServices";
import { getLeaveTypesCode } from "../leaveTypes/LeavetypesServices";
import { getAccruralPlans } from "@/KHRModules/Master Modules/AccruralPlan/AccruralPlanServices";

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  data: any | null;
}

const initialFormState = {
  employee_id: "",
  allocation_type: "regular",
  leave_type_id: "",
  accrual_plan_id: "",
  from_date: "",
  to_date: "",
  allocation_days: "",
  description: "",
};

const AddEditLeaveAllocationModal: React.FC<Props> = ({
  onSuccess,
  data,
  onHide,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Dropdowns
  const [employeeOptions, setEmployeeOptions] = useState<any[]>([]);
  const [leaveTypeOptions, setLeaveTypeOptions] = useState<any[]>([]);
  const [accruralPlanOptions, setAccruralPlanOptions] = useState<any[]>([]);

  const [formData, setFormData] = useState(initialFormState);

  // --- Reset Helper ---
  const resetForm = useCallback(() => {
    setFormData(initialFormState);
    setErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
    if (onHide) onHide(); // Notify parent to clear selection
  }, [onHide]);

  // --- Event Listener for Modal Close ---
  useEffect(() => {
    const modalElement = document.getElementById("add_leave_allocation_modal");
    const handleModalHidden = () => {
      resetForm();
    };

    modalElement?.addEventListener("hidden.bs.modal", handleModalHidden);
    return () => {
      modalElement?.removeEventListener("hidden.bs.modal", handleModalHidden);
    };
  }, [resetForm]);

  // --- Fetch Dropdowns ---
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [emps, lTypes, plans] = await Promise.all([
          getEmployeesBasicInfo(),
          getLeaveTypesCode(),
          getAccruralPlans(),
        ]);

        setEmployeeOptions(
          emps.map((e: any) => ({ value: String(e.id), label: e.name }))
        );
        setLeaveTypeOptions(
          lTypes.map((l: any) => ({ value: String(l.id), label: l.name }))
        );
        setAccruralPlanOptions(
          plans.map((p: any) => ({ value: String(p.id), label: p.name }))
        );
      } catch (err) {
        console.error("Dropdown load error", err);
      }
    };
    fetchDropdowns();
  }, []);

  // --- Load Data for Edit Mode ---
  useEffect(() => {
    if (data) {
      // Robust ID Extractor: Handles Array [1, "Name"], Object {id: 1}, or primitive "1"
      const getId = (val: any) => {
        if (!val) return "";
        if (Array.isArray(val)) return String(val[0]);
        if (typeof val === "object" && val.id) return String(val.id);
        return String(val);
      };

      setFormData({
        employee_id: getId(data.employee_id),
        allocation_type: data.allocation_type || "regular",
        leave_type_id: getId(data.leave_type_id),
        accrual_plan_id: getId(data.accrual_plan_id),

        // Dates (Handling the flat fields we mapped in parent)
        from_date: data.from_date
          ? dayjs(data.from_date).format("YYYY-MM-DD")
          : "",
        to_date: data.to_date ? dayjs(data.to_date).format("YYYY-MM-DD") : "",

        allocation_days: data.number_of_days || data.allocation_days || "",
        description: data.description || "",
      });
    } else {
      // Ensure form is clean if data prop becomes null
      setFormData(initialFormState);
    }
  }, [data]);

  // --- Validation Logic ---
  const validateForm = () => {
    let tempErrors: any = {};
    let isValid = true;

    if (!formData.employee_id) {
      tempErrors.employee_id = "Employee is required";
      isValid = false;
    }
    if (!formData.leave_type_id) {
      tempErrors.leave_type_id = "Leave Type is required";
      isValid = false;
    }

    if (formData.allocation_type === "accrual" && !formData.accrual_plan_id) {
      tempErrors.accrual_plan_id = "Accrual Plan is required";
      isValid = false;
    }

    if (!formData.from_date) {
      tempErrors.from_date = "From Date is required";
      isValid = false;
    }
    if (!formData.to_date) {
      tempErrors.to_date = "To Date is required";
      isValid = false;
    }

    if (!formData.allocation_days || Number(formData.allocation_days) < 0) {
      tempErrors.allocation_days = "Valid allocation days required";
      isValid = false;
    }

    if (
      formData.from_date &&
      formData.to_date &&
      dayjs(formData.to_date).isBefore(dayjs(formData.from_date))
    ) {
      tempErrors.to_date = "To Date cannot be before From Date";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validateForm()) {
      toast.error("Please fill required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: any = {
        employee_id: Number(formData.employee_id),
        leave_type: Number(formData.leave_type_id),
        holiday_status_id: Number(formData.leave_type_id),
        allocation_type: formData.allocation_type || "regular",
        date_from: formData.from_date,
        date_to: formData.to_date,
        number_of_days: Number(formData.allocation_days),
        description: formData.description,
      };

      if (formData.allocation_type === "accrual") {
        payload.accrual_plan_id = Number(formData.accrual_plan_id);
      }

      if (data?.id) {
        await updateLeaveAllocation(data.id, payload);
        toast.success("Leave Allocation Updated");
      } else {
        await createLeaveAllocation(payload);
        toast.success("Leave Allocation Created");
      }

      onSuccess();
      document.getElementById("close-leave-modal")?.click();
    } catch (error: any) {
      console.error("API Error:", error);
      toast.error(error.response?.data?.message || "Error saving allocation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal fade" id="add_leave_allocation_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-bottom bg-light py-2">
            <h5 className="modal-title fw-bold text-dark fs-16">
              <i className="ti ti-calendar-plus me-2 text-primary"></i>
              {data?.id ? "Edit Leave Allocation" : "Create Leave Allocation"}
            </h5>
            <button
              type="button"
              id="close-leave-modal"
              className="btn-close"
              data-bs-dismiss="modal"
              onClick={resetForm}
            ></button>
          </div>

          <div className="modal-body p-4">
            <form
              className={`needs-validation ${
                isSubmitted ? "was-validated" : ""
              }`}
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="row g-3">
                {/* 1. Employee */}
                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">
                    Employee <span className="text-danger">*</span>
                  </label>
                  <div
                    className={
                      isSubmitted && errors.employee_id
                        ? "border border-danger rounded shadow-sm"
                        : ""
                    }
                  >
                    <CommonSelect
                      options={employeeOptions}
                      placeholder="Select employee"
                      defaultValue={employeeOptions.find(
                        (o) => o.value === formData.employee_id
                      )}
                      onChange={(opt) => {
                        setFormData({
                          ...formData,
                          employee_id: opt?.value || "",
                        });
                        if (errors.employee_id)
                          setErrors({ ...errors, employee_id: "" });
                      }}
                    />
                  </div>
                  {isSubmitted && errors.employee_id && (
                    <div className="text-danger fs-11 mt-1">
                      {errors.employee_id}
                    </div>
                  )}
                </div>

                {/* 2. Allocation Type */}
                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">
                    Allocation Type
                  </label>
                  <div>
                    <CommonSelect
                      options={[
                        { value: "regular", label: "Regular Allocation" },
                        { value: "accrual", label: "Accrual Allocation" },
                      ]}
                      defaultValue={
                        formData.allocation_type === "accrual"
                          ? { value: "accrual", label: "Accrual Allocation" }
                          : { value: "regular", label: "Regular Allocation" }
                      }
                      onChange={(opt) =>
                        setFormData({
                          ...formData,
                          allocation_type: opt?.value || "regular",
                        })
                      }
                    />
                  </div>
                </div>

                {/* 3. Leave Type */}
                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">
                    Leave Type <span className="text-danger">*</span>
                  </label>
                  <div
                    className={
                      isSubmitted && errors.leave_type_id
                        ? "border border-danger rounded shadow-sm"
                        : ""
                    }
                  >
                    <CommonSelect
                      options={leaveTypeOptions}
                      placeholder="Select type"
                      defaultValue={leaveTypeOptions.find(
                        (o) => o.value === formData.leave_type_id
                      )}
                      onChange={(opt) => {
                        setFormData({
                          ...formData,
                          leave_type_id: opt?.value || "",
                        });
                        if (errors.leave_type_id)
                          setErrors({ ...errors, leave_type_id: "" });
                      }}
                    />
                  </div>
                  {isSubmitted && errors.leave_type_id && (
                    <div className="text-danger fs-11 mt-1">
                      {errors.leave_type_id}
                    </div>
                  )}
                </div>

                {/* 4. Accrual Plan (Conditional) */}
                {formData.allocation_type === "accrual" && (
                  <div className="col-md-6 animate__animated animate__fadeIn">
                    <label className="form-label fs-13 fw-bold">
                      Accrual Plan <span className="text-danger">*</span>
                    </label>
                    <div
                      className={
                        isSubmitted && errors.accrual_plan_id
                          ? "border border-danger rounded shadow-sm"
                          : ""
                      }
                    >
                      <CommonSelect
                        options={accruralPlanOptions}
                        placeholder="Select Accrual Plan"
                        defaultValue={accruralPlanOptions.find(
                          (o) => o.value === formData.accrual_plan_id
                        )}
                        onChange={(opt) => {
                          setFormData({
                            ...formData,
                            accrual_plan_id: opt?.value || "",
                          });
                          if (errors.accrual_plan_id)
                            setErrors({ ...errors, accrual_plan_id: "" });
                        }}
                      />
                    </div>
                    {isSubmitted && errors.accrual_plan_id && (
                      <div className="text-danger fs-11 mt-1">
                        {errors.accrual_plan_id}
                      </div>
                    )}
                  </div>
                )}

                {/* 5. From Date */}
                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">
                    From Date <span className="text-danger">*</span>
                  </label>
                  <DatePicker
                    className={`w-100 form-control ${
                      isSubmitted && errors.from_date ? "is-invalid" : ""
                    }`}
                    placeholder="Select Date"
                    value={
                      formData.from_date ? dayjs(formData.from_date) : null
                    }
                    onChange={(_, dateStr) => {
                      setFormData({ ...formData, from_date: String(dateStr) });
                      if (errors.from_date)
                        setErrors({ ...errors, from_date: "" });
                    }}
                  />
                  {isSubmitted && errors.from_date && (
                    <div className="text-danger fs-11 mt-1">
                      {errors.from_date}
                    </div>
                  )}
                </div>

                {/* 6. To Date */}
                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">
                    To Date <span className="text-danger">*</span>
                  </label>
                  <DatePicker
                    className={`w-100 form-control ${
                      isSubmitted && errors.to_date ? "is-invalid" : ""
                    }`}
                    placeholder="Select Date"
                    value={formData.to_date ? dayjs(formData.to_date) : null}
                    onChange={(_, dateStr) => {
                      setFormData({ ...formData, to_date: String(dateStr) });
                      if (errors.to_date) setErrors({ ...errors, to_date: "" });
                    }}
                  />
                  {isSubmitted && errors.to_date && (
                    <div className="text-danger fs-11 mt-1">
                      {errors.to_date}
                    </div>
                  )}
                </div>

                {/* 7. Allocation Days */}
                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">
                    Allocation Days <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${
                      isSubmitted && errors.allocation_days ? "is-invalid" : ""
                    }`}
                    placeholder="Enter Days"
                    value={formData.allocation_days}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        allocation_days: e.target.value,
                      });
                      if (errors.allocation_days)
                        setErrors({ ...errors, allocation_days: "" });
                    }}
                  />
                  {isSubmitted && errors.allocation_days && (
                    <div className="text-danger fs-11 mt-1">
                      {errors.allocation_days}
                    </div>
                  )}
                </div>

                {/* 8. Description */}
                <div className="col-12">
                  <label className="form-label fs-13 fw-bold">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Enter remarks..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer border-0 px-0 mt-4 pb-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 me-2"
                  data-bs-dismiss="modal"
                  onClick={resetForm}
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-5 shadow-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving..."
                    : data?.id
                    ? "Update Allocation"
                    : "Save Allocation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditLeaveAllocationModal;

// import React, { useEffect, useState } from "react";
// import {
//   addAttendancePolicy,
//   AttendancePolicy,
//   createLeaveAllocation,
//   updateLeaveAllocation,
// } from "./LeaveAllocationServices";
// import toast from 'react-hot-toast';
// import moment from "moment";
// import { DatePicker, Radio, Checkbox } from "antd";
// import dayjs from "dayjs";
// import {getHolidays } from "@/KHRModules/LeaveModules/PublicHoliday/PublicHolidayServices"
// import { getEmployees } from "../../EmployeModules/Employee/EmployeeServices";

// interface Props {
//   onSuccess: () => void;
//   data: AttendancePolicy | null;
// }

// const AddEditAttendancePolicyModal: React.FC<Props> = ({ onSuccess, data }) => {
//   // Initial state for the new geofence-style attendance fields

//   const initialFormState = {
//     // new simplified allocation form
//     employee_id: "",
//     leave_type: "",
//     holiday_status_id: "",
//     allocation_type: "regular",
//     date_from: "",
//     date_to: "",
//     allocation_days: 0,
//     description: "",
//   };

//   const [formData, setFormData] = useState<any>(initialFormState);
//   const [validated, setValidated] = useState(false);
//   const [employeesOptions, setEmployeesOptions] = useState<any[]>([]);
//   const [holidaysOptions, setHolidaysOptions] = useState<any[]>([]);
//     const [isSubmitted, setIsSubmitted] = useState(false);
//     const [errors, setErrors] = useState<any>({});

//   // console.log({employeesOptions})

//   const computeAllocationDays = (from?: string | null, to?: string | null): number => {
//     if (!from || !to) return 0;

//     // Parse dates consistently
//     const fromDate = dayjs(from);
//     const toDate = dayjs(to);

//     // Validate both dates
//     if (!fromDate.isValid() || !toDate.isValid()) return 0;

//     // Calculate the difference in days (inclusive)
//     const diffDays = toDate.diff(fromDate, 'day');

//     // Return inclusive count (adding 1 to include both start and end date)
//     // If end date is before start date, return 0
//     return diffDays >= 0 ? diffDays + 1 : 0;
//   };

//   // 1. DATA SYNC: Populate form when editing
//   useEffect(() => {
//   if (!data) {
//     setFormData(initialFormState);
//     return;
//   }

//   // Leave type mapping (string → select value)
//   const leaveTypeMapping: Record<string, string> = {
//     "Paid Time Off": "1",
//     "Compensatory Days": "2",
//     "Earned Leave (EL)": "3",
//     "Sick Leave": "4",
//     "Annual Leave": "5",
//     "Casual Leave (CL)": "6",
//   };

//   const mappedLeaveType =
//     typeof data.leave_type === "string"
//       ? leaveTypeMapping[data.leave_type] ?? ""
//       : String(data.leave_type ?? "");

//   const fromDate = data.from_date ? dayjs(data.from_date).format("YYYY-MM-DD") : "";
//   const toDate = data.to_date ? dayjs(data.to_date).format("YYYY-MM-DD") : "";

//   setFormData({
//     employee_id: data.employee_id ?? "", // stays empty if not provided
//     leave_type: mappedLeaveType,
//     holiday_status_id: mappedLeaveType,
//     allocation_type: data.allocation_type ?? "regular",
//     date_from: fromDate,
//     date_to: toDate,
//     allocation_days:
//       data.number_of_days ??
//       computeAllocationDays(fromDate, toDate),
//     description: data.description ?? "",
//   });
// }, [data]);

//   // Fetch employees
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await getEmployees();
//         console.log(res)
//         if (res) {
//           const opts = res.map((e: any) => ({ id: e.id, name: e.employee_name || e.name || e.full_name || String(e.id) }));
//           setEmployeesOptions(opts);
//         }
//       } catch (error) {
//         console.error("Failed to fetch employees", error);
//       }
//     })();
//   }, []);

//   // Fetch holidays
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await getHolidays();
//         if (res && res.data && Array.isArray(res.data.data)) {
//           const opts = res.data?.data.map((h: any) => ({ id: h.id, name: h.name }));
//           setHolidaysOptions(opts);
//         }
//       } catch (error) {
//         console.error("Failed to fetch holidays", error);
//       }
//     })();
//   }, []);

//   // 2. RESET LOGIC: Listen for Modal Close
//   useEffect(() => {
//     const modalElement = document.getElementById("add_attendance_policy");
//     const handleModalClose = () => {
//       setValidated(false);
//       setFormData(initialFormState);
//       setIsSubmitted(false);
//       setErrors({});
//     };
//     if (modalElement) {
//       modalElement.addEventListener("hidden.bs.modal", handleModalClose);
//     }
//     return () => {
//       if (modalElement) {
//         modalElement.removeEventListener("hidden.bs.modal", handleModalClose);
//       }
//     };
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
//     setFormData((prev: any) => {
//       const newData = { ...prev, [name]: value };
//       // If leave_type changes, update holiday_status_id with the same value
//       if (name === "leave_type") {
//         newData.holiday_status_id = value;
//       }
//       return newData;
//     });
//     // Clear error for the changed field
//     setErrors((prev: any) => ({ ...prev, [name]: "" }));
//   };

//   // No date range auto-calculation for the simplified allocation form

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     e.stopPropagation();

//     setIsSubmitted(true);

//     const newErrors: any = {};
//     if (!formData.employee_id) newErrors.employee_id = "Employee is required.";
//     if (!formData.leave_type) newErrors.leave_type = "Leave type is required.";
//     if (!formData.holiday_status_id) newErrors.holiday_status_id = "Holiday status is required.";
//     if (!formData.allocation_type) newErrors.allocation_type = "Allocation type is required.";
//     if (!formData.date_from) newErrors.date_from = "From date is required.";
//     if (!formData.date_to) newErrors.date_to = "To date is required.";
//     // if (!formData.description) newErrors.description = "Description is required.";

//     setErrors(newErrors);
//     console.log(newErrors)

//     if (Object.keys(newErrors).length > 0) {
//       console.log("debug here re")
//       return;
//     }

//     // Prepare Payload: convert and validate fields
//     const apiPayload: any = { ...formData };

//     // convert numeric allocation_days robustly
//     apiPayload.allocation_days = apiPayload.allocation_days === "" || apiPayload.allocation_days === null || apiPayload.allocation_days === undefined
//       ? null
//       : Number(apiPayload.allocation_days);

//     try {
//       // Map form fields to API expected payload
//       const allocationPayload: any = {
//         employee_id: apiPayload.employee_id && !isNaN(Number(apiPayload.employee_id)) ? Number(apiPayload.employee_id) : undefined,
//         leave_type: apiPayload.leave_type && !isNaN(Number(apiPayload.leave_type)) ? Number(apiPayload.leave_type) : undefined,
//         holiday_status_id: apiPayload.leave_type && !isNaN(Number(apiPayload.leave_type)) ? Number(apiPayload.leave_type) : undefined,
//         allocation_type: apiPayload.allocation_type || undefined,
//         date_from: apiPayload.date_from || undefined,
//         date_to: apiPayload.date_to || undefined,
//         number_of_days: apiPayload.allocation_days === null ? undefined : Number(apiPayload.allocation_days),
//         description: apiPayload.description || undefined,
//       };

//       if (data && data.id) {
//         await updateLeaveAllocation(Number(data.id), allocationPayload);
//         toast.success("Leave allocation updated.");
//       } else {
//         await createLeaveAllocation(allocationPayload);
//         toast.success("Leave allocation created.");
//       }

//       const closeBtn = document.getElementById("close-btn-policy");
//       closeBtn?.click();
//       onSuccess();
//     } catch (error) {
//       console.error("Failed to save policy", error);
//       toast.error("Error saving data.");
//     }
//   };

//   return (
//     <div
//       className="modal custom-modal fade"
//       id="add_attendance_policy"
//       role="dialog"
//     >
//       <div className="modal-dialog modal-dialog-centered modal-lg">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">
//               {data ? "Edit Leave Allocation" : "Add Leave Allocation"}
//             </h5>
//             <button
//               type="button"
//               className="btn-close"
//               data-bs-dismiss="modal"
//               id="close-btn-policy"
//               aria-label="Close"
//             >
//               <span aria-hidden="true">×</span>
//             </button>
//           </div>
//           <div className="modal-body">
//             <form
//               className={`needs-validation ${validated ? "was-validated" : ""}`}
//               noValidate
//               onSubmit={handleSubmit}
//             >
//               <div className="row">

//                 {/* New Leave Allocation fields */}
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Employee</label>
//                   <select
//                     name="employee_id"
//                     className={`form-select ${isSubmitted ? (formData.employee_id ? "is-valid" : "is-invalid") : ""}`}
//                     value={formData.employee_id ?? ""}
//                     onChange={handleChange}
//                   >
//                     <option value="">Select employee</option>
//                     {employeesOptions.map((e) => (
//                       <option key={e.id} value={e.id}>
//                         {e.name}
//                       </option>
//                     ))}
//                   </select>
//                   {isSubmitted && errors.employee_id && (
//                     <span style={{ color: "red", fontSize: 12, display: "block", marginTop: 6 }}>
//                       {errors.employee_id}
//                     </span>
//                   )}
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Allocation Type</label>
//                   <select
//                     name="allocation_type"
//                     className={`form-select ${isSubmitted ? (formData.allocation_type ? "is-valid" : "is-invalid") : ""}`}
//                     value={formData.allocation_type ?? ""}
//                     onChange={handleChange}
//                   >
//                     <option value="">Select type</option>
//                     <option value="regular">Regular</option>
//                     <option value="annual">Annual</option>
//                     <option value="sick">Sick</option>
//                     <option value="compensatory">Compensatory</option>
//                   </select>
//                   {isSubmitted && errors.allocation_type && (
//                     <span style={{ color: "red", fontSize: 12, display: "block", marginTop: 6 }}>
//                       {errors.allocation_type}
//                     </span>
//                   )}
//                 </div>

//                                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Leave Type</label>
//                   <select
//                     name="leave_type"
//                     className={`form-select ${isSubmitted ? (formData.leave_type ? "is-valid" : "is-invalid") : ""}`}
//                     value={formData.leave_type ?? ""}
//                     onChange={handleChange}
//                   >
//                     <option value="">Select type</option>
//                     <option value="1">Paid Time Off</option>
//                     <option value="2">Compensatory Days</option>
//                     <option value="3">Earned Leave (EL)</option>
//                     <option value="4">Sick Leave</option>
//                     <option value="5">Annual Leave</option>
//                     <option value="6">Casual Leave (CL)</option>
//                   </select>
//                   {isSubmitted && errors.leave_type && (
//                     <span style={{ color: "red", fontSize: 12, display: "block", marginTop: 6 }}>
//                       {errors.leave_type}
//                     </span>
//                   )}
//                 </div>

//                 {/* <div className="col-md-6 mb-3">
//                   <label className="form-label">Holiday Status</label>
//                   <select
//                     name="holiday_status_id"
//                     className="form-select"
//                     value={formData.holiday_status_id ?? ""}
//                     onChange={handleChange}
//                     style={{ borderColor: isSubmitted ? (formData.holiday_status_id ? "green" : "red") : undefined }}
//                   >
//                     <option value="">Select holiday</option>
//                     {holidaysOptions.map((h) => (
//                       <option key={h.id} value={h.id}>
//                         {h.name}
//                       </option>
//                     ))}
//                   </select>
//                   {isSubmitted && errors.holiday_status_id && (
//                     <span style={{ color: "red", fontSize: 12, display: "block", marginTop: 6 }}>
//                       {errors.holiday_status_id}
//                     </span>
//                   )}
//                 </div> */}

//                 <div className="col-md-4 mb-3">
//                   <label className="form-label">From Date</label>
//                   <DatePicker
//                     className="form-control w-100"
//                     value={formData.date_from ? dayjs(formData.date_from) : null}
//                     onChange={(value, dateStr) => {
//                       const newFrom = (dateStr as string) || "";
//                       setFormData((prev: any) => {
//                         const alloc = computeAllocationDays(newFrom, prev.date_to);
//                         return { ...prev, date_from: newFrom, allocation_days: alloc };
//                       });
//                     }}
//                     style={{ borderColor: isSubmitted ? (formData.date_from ? "green" : "red") : undefined }}
//                   />
//                   {isSubmitted && errors.date_from && (
//                     <span style={{ color: "red", fontSize: 12, display: "block", marginTop: 6 }}>
//                       {errors.date_from}
//                     </span>
//                   )}
//                 </div>

//                 <div className="col-md-4 mb-3">
//                   <label className="form-label">To Date</label>
//                   <DatePicker
//                     className="form-control w-100"
//                     value={formData.date_to ? dayjs(formData.date_to) : null}
//                     onChange={(value, dateStr) => {
//                       const newTo = (dateStr as string) || "";
//                       setFormData((prev: any) => {
//                         const alloc = computeAllocationDays(prev.date_from, newTo);
//                         return { ...prev, date_to: newTo, allocation_days: alloc };
//                       });
//                     }}
//                     style={{ borderColor: isSubmitted ? (formData.date_to ? "green" : "red") : undefined }}
//                   />
//                   {isSubmitted && errors.date_to && (
//                     <span style={{ color: "red", fontSize: 12, display: "block", marginTop: 6 }}>
//                       {errors.date_to}
//                     </span>
//                   )}
//                 </div>

//                 <div className="col-md-4 mb-3">
//                   <label className="form-label">Allocation Days</label>
//                   <input
//                     type="number"
//                     name="allocation_days"
//                     className="form-control"
//                     value={formData.allocation_days ?? ""}
//                     readOnly
//                   />
//                 </div>

//                 {/* Description */}
//                 <div className="col-md-12 mb-3">
//                   <label className="form-label">Description</label>
//                   <textarea
//                     name="description"
//                     className="form-control"
//                     rows={3}
//                     value={formData.description ?? ""}
//                     onChange={handleChange}
//                     style={{ borderColor: isSubmitted ? (formData.description ? "green" : "") : undefined }}
//                   />
//                   {/* {isSubmitted && errors.description && (
//                     <span style={{ color: "red", fontSize: 12, display: "block", marginTop: 6 }}>
//                       {errors.description}
//                     </span>
//                   )} */}
//                 </div>

//                 {/* removed geo fields and JSON textarea per request */}
//               </div>

//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-light"
//                   data-bs-dismiss="modal"
//                 >
//                   Cancel
//                 </button>
//                 <button type="submit" className="btn btn-primary">
//                   {data ? "Update Changes" : "Save Leave Allocation"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddEditAttendancePolicyModal;
