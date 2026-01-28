import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  LeaveRequest,
  updateLeaveRequest,
  createLeaveRequest,
  getAllLeaveTypes,
} from "./LeaveRequestServices";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import CommonSelect from "../../../core/common/commonSelect";

interface Props {
  onSuccess: () => void;
  data: LeaveRequest | null;
}

const AddEditLeaveRequestModal: React.FC<Props> = ({ onSuccess, data }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [leaveTypesOptions, setLeaveTypesOptions] = useState<any[]>([]);

  // Initial State
  const initialFormState = {
    holiday_status_id: "",
    from_date: null as string | null, // Format: "YYYY-MM-DD"
    to_date: null as string | null, // Format: "YYYY-MM-DD"
    no_of_days: "0",
    reason: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  // 1. BOOTSTRAP EVENT LISTENER (Reset on Close)
  useEffect(() => {
    const modalElement = document.getElementById("add_leave_request");
    const handleModalHidden = () => {
      resetForm();
    };
    modalElement?.addEventListener("hidden.bs.modal", handleModalHidden);
    return () => {
      modalElement?.removeEventListener("hidden.bs.modal", handleModalHidden);
    };
  }, []);

  // 2. Fetch Leave Types
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const res = await getAllLeaveTypes();
        const rawData =
          res?.data?.data || res?.data || (Array.isArray(res) ? res : []);

        const opts = rawData.map((lt: any) => ({
          value: String(lt.id),
          label: lt.name,
        }));
        setLeaveTypesOptions(opts);
      } catch (error) {
        console.error("Failed to load leave types", error);
      }
    };
    fetchLeaveTypes();
  }, []);

  // 3. Populate Form on Edit
  useEffect(() => {
    if (data) {
      setFormData({
        holiday_status_id: data.leave_type ? String(data.leave_type) : "",
        from_date: data.from_date || null,
        to_date: data.to_date || null,
        no_of_days: data.no_of_days ? String(data.no_of_days) : "0",
        reason: data.reason || "",
      });
    } else {
      resetForm();
    }
  }, [data]);

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  // --- CALCULATION HELPER ---
  const calculateDays = (startStr: string | null, endStr: string | null) => {
    if (!startStr || !endStr) return "0";
    const start = dayjs(startStr);
    const end = dayjs(endStr);

    if (
      start.isValid() &&
      end.isValid() &&
      (end.isAfter(start) || end.isSame(start))
    ) {
      return String(end.diff(start, "day") + 1);
    }
    return "0";
  };

  // --- HANDLERS ---

  const handleDateChange = (
    field: "from_date" | "to_date",
    dateObj: dayjs.Dayjs | null,
  ) => {
    const dateStr = dateObj ? dateObj.format("YYYY-MM-DD") : null;
    const newData = { ...formData, [field]: dateStr };

    // Calculate Days
    const startStr = field === "from_date" ? dateStr : formData.from_date;
    const endStr = field === "to_date" ? dateStr : formData.to_date;
    newData.no_of_days = calculateDays(startStr, endStr);

    setFormData(newData);
    clearError(field);
    if (errors.to_date) clearError("to_date");
  };

  const clearError = (fieldName: string) => {
    setErrors((prev: any) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const getSelectWrapperClass = (fieldName: string) => {
    if (errors[fieldName]) return "border border-danger rounded";
    if (isSubmitted && formData.holiday_status_id && !errors[fieldName])
      return "border border-success rounded";
    return "";
  };

  const validate = () => {
    let tempErrors: any = {};
    if (!formData.holiday_status_id)
      tempErrors.holiday_status_id = "Leave Type is required";
    if (!formData.from_date) tempErrors.from_date = "From Date is required";
    if (!formData.to_date) {
      tempErrors.to_date = "To Date is required";
    } else if (
      formData.from_date &&
      dayjs(formData.to_date).isBefore(dayjs(formData.from_date))
    ) {
      tempErrors.to_date = "End date cannot be before start date";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        holiday_status_id: Number(formData.holiday_status_id),
        date_from: formData.from_date,
        date_to: formData.to_date,
        no_of_days: Number(formData.no_of_days),
        reason: formData.reason,
      };

      if (data?.id) {
        await updateLeaveRequest(Number(data.id), payload);
        toast.success("Leave Request Updated Successfully");
      } else {
        await createLeaveRequest(payload);
        toast.success("Leave Request Created Successfully");
      }
      onSuccess();
      document.getElementById("close-btn-leave")?.click();
    } catch (error: any) {
      console.error(error);

      // --- FIX: EXTRACT API ERROR MESSAGE ---
      const errorMsg =
        error.response?.data?.message || // e.g. "You don't have any allocation..."
        error.message || // Network Error
        "Failed to save leave request"; // Fallback

      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>
        {`
          #add_leave_request { z-index: 1080 !important; }
          .is-invalid + .invalid-feedback { display: block; }
          .ant-picker.ant-picker-status-error { border-color: #dc3545 !important; }
          .is-valid-picker { border-color: #198754 !important; }
        `}
      </style>

      <div
        className="modal fade"
        id="add_leave_request"
        data-bs-backdrop="static"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header border-bottom bg-light py-2">
              <h5 className="modal-title fw-bold text-dark fs-16">
                <i className="ti ti-calendar-event me-2 text-primary"></i>
                {data ? "Edit Leave Request" : "Create Leave Request"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="close-btn-leave"
                onClick={resetForm}
              ></button>
            </div>

            <div className="modal-body p-4">
              <form onSubmit={handleSubmit} noValidate>
                {/* Leave Type */}
                <div className="row g-3 mb-3">
                  <div className="col-md-12">
                    <label className="form-label fs-13 fw-bold">
                      Leave Type <span className="text-danger">*</span>
                    </label>
                    <div className={getSelectWrapperClass("holiday_status_id")}>
                      <CommonSelect
                        key={`leave-type-${leaveTypesOptions.length}`}
                        options={leaveTypesOptions}
                        placeholder="Select Leave Type"
                        defaultValue={leaveTypesOptions.find(
                          (opt) =>
                            opt.value === String(formData.holiday_status_id),
                        )}
                        onChange={(opt) => {
                          setFormData({
                            ...formData,
                            holiday_status_id: opt?.value || "",
                          });
                          clearError("holiday_status_id");
                        }}
                      />
                    </div>
                    {errors.holiday_status_id && (
                      <div className="text-danger fs-11 mt-1">
                        {errors.holiday_status_id}
                      </div>
                    )}
                  </div>
                </div>

                {/* Dates */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fs-13 fw-bold">
                      From Date <span className="text-danger">*</span>
                    </label>
                    <div>
                      <DatePicker
                        getPopupContainer={(trigger) => trigger.parentElement!}
                        className={`w-100 form-control ${isSubmitted && formData.from_date && !errors.from_date ? "is-valid-picker" : ""}`}
                        format="YYYY-MM-DD"
                        value={
                          formData.from_date
                            ? dayjs(formData.from_date, "YYYY-MM-DD")
                            : null
                        }
                        onChange={(date) => handleDateChange("from_date", date)}
                        placeholder="Select Start Date"
                        status={errors.from_date ? "error" : ""}
                      />
                    </div>
                    {errors.from_date && (
                      <div className="text-danger fs-11 mt-1">
                        {errors.from_date}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fs-13 fw-bold">
                      To Date <span className="text-danger">*</span>
                    </label>
                    <div>
                      <DatePicker
                        getPopupContainer={(trigger) => trigger.parentElement!}
                        className={`w-100 form-control ${isSubmitted && formData.to_date && !errors.to_date ? "is-valid-picker" : ""}`}
                        format="YYYY-MM-DD"
                        value={
                          formData.to_date
                            ? dayjs(formData.to_date, "YYYY-MM-DD")
                            : null
                        }
                        onChange={(date) => handleDateChange("to_date", date)}
                        placeholder="Select End Date"
                        status={errors.to_date ? "error" : ""}
                      />
                    </div>
                    {errors.to_date && (
                      <div className="text-danger fs-11 mt-1">
                        {errors.to_date}
                      </div>
                    )}
                  </div>
                </div>

                {/* Duration & Reason */}
                <div className="row g-3 mb-3">
                  <div className="col-md-12">
                    <label className="form-label fs-13 fw-bold">
                      Duration (Days)
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      value={formData.no_of_days}
                      readOnly
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label fs-13 fw-bold">Reason</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={formData.reason}
                      onChange={(e) =>
                        setFormData({ ...formData, reason: e.target.value })
                      }
                      placeholder="Optional description..."
                    />
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
                      : data
                        ? "Update Changes"
                        : "Save Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEditLeaveRequestModal;

// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import {
//   LeaveRequest,
//   updateLeaveRequest,
//   createLeaveRequest,
//   getAllLeaveTypes,
// } from "./LeaveRequestServices";
// import { DatePicker } from "antd";
// import moment from "moment";

// interface Props {
//   onSuccess: () => void;
//   data: LeaveRequest | null;
// }

// const AddEditLeaveRequestModal: React.FC<Props> = ({ onSuccess, data }) => {
//   // Removed unused fields (company, department, status) from initial state
//   const initialFormState = {
//     holiday_status_id: "",
//     from_date: "",
//     to_date: "",
//     no_of_days: "",
//     reason: "",
//   };

//   const [formData, setFormData] = useState<any>(initialFormState);
//   const [leaveTypesOptions, setLeaveTypesOptions] = useState<any[]>([]);
//   const [validated, setValidated] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState<any>({});

//   // Touched states for immediate validation feedback
//   const [fromDateTouched, setFromDateTouched] = useState(false);
//   const [toDateTouched, setToDateTouched] = useState(false);

//   /* -------------------- EDIT MODE -------------------- */
//   useEffect(() => {
//     if (data) {
//       setFormData({
//         holiday_status_id: data.leave_type ?? "",
//         from_date: data.from_date ?? "",
//         to_date: data.to_date ?? "",
//         no_of_days: data.no_of_days ?? "",
//         reason: data.reason ?? "",
//       });
//     } else {
//       setFormData(initialFormState);
//     }
//   }, [data]);

//   /* -------------------- LEAVE TYPES -------------------- */
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await getAllLeaveTypes();
//         if (res && res.data && Array.isArray(res.data)) {
//           const opts = res.data.map((lt: any) => ({
//             id: lt.id,
//             name: lt.name,
//           }));
//           setLeaveTypesOptions(opts);
//         }
//       } catch (error) {
//         console.error("Failed to load leave types", error);
//       }
//     })();
//   }, []);

//   /* -------------------- AUTO DAYS -------------------- */
//   useEffect(() => {
//     if (formData.from_date && formData.to_date) {
//       const days =
//         moment(formData.to_date).diff(moment(formData.from_date), "days") + 1;
//       setFormData((p: any) => ({ ...p, no_of_days: days }));
//       validateDates();
//     }
//   }, [formData.from_date, formData.to_date]);

//   /* -------------------- VALIDATE DATES -------------------- */
//   const validateDates = () => {
//     // Only validate if user has interacted with form
//     if (!validated && !fromDateTouched && !toDateTouched) return;

//     const err: any = {};
//     if (!formData.from_date) err.from_date = "From date required";
//     if (!formData.to_date) err.to_date = "To date required";

//     if (
//       formData.from_date &&
//       formData.to_date &&
//       moment(formData.from_date).isAfter(moment(formData.to_date))
//     ) {
//       err.to_date = "To date must be after or equal to From date";
//     }

//     setErrors((prev: any) => ({
//       ...prev,
//       from_date: err.from_date || "",
//       to_date: err.to_date || "",
//     }));
//   };

//   /* -------------------- CHANGE -------------------- */
//   const handleChange = (e: any) => {
//     const { name, value } = e.target;
//     setFormData((p: any) => ({ ...p, [name]: value }));
//   };

//   /* -------------------- VALIDATION -------------------- */
//   const validateForm = () => {
//     const err: any = {};

//     if (!formData.holiday_status_id)
//       err.holiday_status_id = "Leave Type is required";
//     if (!formData.from_date) err.from_date = "From Date is required";
//     if (!formData.to_date) err.to_date = "To Date is required";

//     // Reason is NOT mandatory anymore

//     if (
//       formData.from_date &&
//       formData.to_date &&
//       moment(formData.from_date).isAfter(moment(formData.to_date))
//     ) {
//       err.to_date = "To date must be after or equal to From date";
//     }

//     setErrors(err);
//     return Object.keys(err).length === 0;
//   };

//   /* -------------------- SUBMIT -------------------- */
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     setValidated(true);
//     setFromDateTouched(true);
//     setToDateTouched(true);

//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const payload = {
//         holiday_status_id: formData.holiday_status_id
//           ? Number(formData.holiday_status_id)
//           : null,
//         date_from: formData.from_date,
//         date_to: formData.to_date,
//         reason: formData.reason,
//       };

//       if (data?.id) {
//         await updateLeaveRequest(Number(data.id), payload);
//         toast.success("Leave updated");
//       } else {
//         await createLeaveRequest(payload);
//         toast.success("Leave created");
//       }

//       onSuccess();
//       document.getElementById("close-btn-leave")?.click();
//     } catch (error) {
//       console.error("API call failed", error);
//       toast.error("Failed to save leave request");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="modal fade" id="add_leave_request">
//       <div className="modal-dialog modal-lg modal-dialog-centered">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">
//               {data ? "Edit Leave Request" : "Add Leave Request"}
//             </h5>
//             <button
//               id="close-btn-leave"
//               data-bs-dismiss="modal"
//               className="btn-close"
//             />
//           </div>

//           <form onSubmit={handleSubmit} noValidate>
//             <div className="modal-body row">
//               {/* Leave Type - Mandatory */}
//               <div className="col-md-12 mb-3">
//                 <label className="form-label">
//                   Leave Type <span className="text-danger">*</span>
//                 </label>
//                 <select
//                   name="holiday_status_id"
//                   className={`form-select ${
//                     validated && errors.holiday_status_id
//                       ? "is-invalid"
//                       : validated && formData.holiday_status_id
//                       ? "is-valid"
//                       : ""
//                   }`}
//                   value={formData.holiday_status_id ?? ""}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select leave type</option>
//                   {leaveTypesOptions.map((lt) => (
//                     <option key={lt.id} value={lt.id}>
//                       {lt.name}
//                     </option>
//                   ))}
//                 </select>
//                 {validated && errors.holiday_status_id && (
//                   <div className="invalid-feedback">
//                     {errors.holiday_status_id}
//                   </div>
//                 )}
//               </div>

//               {/* Dates - Mandatory */}
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">
//                   From Date <span className="text-danger">*</span>
//                 </label>
//                 <DatePicker
//                   className={`w-100 form-control ${
//                     (validated || fromDateTouched) && errors.from_date
//                       ? "is-invalid"
//                       : (validated || fromDateTouched) && formData.from_date
//                       ? "is-valid"
//                       : ""
//                   }`}
//                   value={formData.from_date ? moment(formData.from_date) : null}
//                   onChange={(_, d) => {
//                     setFormData((p: any) => ({ ...p, from_date: d }));
//                     setFromDateTouched(true);
//                   }}
//                   onBlur={() => setFromDateTouched(true)}
//                   placeholder="Select Start Date"
//                 />
//                 {(validated || fromDateTouched) && errors.from_date && (
//                   <div className="text-danger small mt-1">
//                     {errors.from_date}
//                   </div>
//                 )}
//               </div>

//               <div className="col-md-6 mb-3">
//                 <label className="form-label">
//                   To Date <span className="text-danger">*</span>
//                 </label>
//                 <DatePicker
//                   className={`w-100 form-control ${
//                     (validated || toDateTouched) && errors.to_date
//                       ? "is-invalid"
//                       : (validated || toDateTouched) && formData.to_date
//                       ? "is-valid"
//                       : ""
//                   }`}
//                   value={formData.to_date ? moment(formData.to_date) : null}
//                   onChange={(_, d) => {
//                     setFormData((p: any) => ({ ...p, to_date: d }));
//                     setToDateTouched(true);
//                   }}
//                   onBlur={() => setToDateTouched(true)}
//                   placeholder="Select End Date"
//                 />
//                 {(validated || toDateTouched) && errors.to_date && (
//                   <div className="text-danger small mt-1">{errors.to_date}</div>
//                 )}
//               </div>

//               {/* Reason - Optional */}
//               <div className="col-md-12 mb-3">
//                 <label className="form-label">Reason</label>
//                 <textarea
//                   name="reason"
//                   rows={3}
//                   className="form-control"
//                   value={formData.reason}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             <div className="modal-footer">
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 data-bs-dismiss="modal"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="btn btn-primary"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Saving..." : "Save Leave"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddEditLeaveRequestModal;

// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import {
//   LeaveRequest,
//   getEmployeesForLeaveRequest,
//   updateLeaveRequest,
//   createLeaveRequest,
//   getAllLeaveTypes,
// } from "./LeaveRequestServices";
// import { DatePicker } from "antd";
// import moment from "moment";

// interface Props {
//   onSuccess: () => void;
//   data: LeaveRequest | null;
// }

// const AddEditLeaveRequestModal: React.FC<Props> = ({ onSuccess, data }) => {
//   console.log(data);

//   const initialFormState = {
//     holiday_status_id: "",
//     from_date: "",
//     to_date: "",
//     no_of_days: "",
//     reason: "",
//     company_name: "",
//     department_name: "",
//     employee_name: "",
//     leave_type: "",
//     status: "",
//   };

//   const [formData, setFormData] = useState<any>(initialFormState);
//   const [leaveTypesOptions, setLeaveTypesOptions] = useState<any[]>([]);
//   const [validated, setValidated] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState<any>({});
//   const [employeeTouched, setEmployeeTouched] = useState(false);
//   const [fromDateTouched, setFromDateTouched] = useState(false);
//   const [toDateTouched, setToDateTouched] = useState(false);

//   /* -------------------- EDIT MODE -------------------- */
//   useEffect(() => {
//     if (data) {
//       setFormData({
//         holiday_status_id: data.leave_type ?? "",
//         from_date: data.from_date ?? "",
//         to_date: data.to_date ?? "",
//         no_of_days: data.no_of_days ?? "",
//         reason: data.reason ?? "",
//         company_name: data.company_name ?? "",
//         department_name: data.department_name ?? "",
//         employee_name: data.employee_name ?? "",
//         leave_type: data.leave_type ?? "",
//         status: data.status ?? "",
//       });
//     } else {
//       setFormData(initialFormState);
//     }
//   }, [data]);

//   /* -------------------- LEAVE TYPES -------------------- */
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await getAllLeaveTypes();
//         console.log(res);
//         if (res && res.data && Array.isArray(res.data)) {
//           const opts = res.data.map((lt: any) => ({
//             id: lt.id,
//             name: lt.name,
//           }));
//           setLeaveTypesOptions(opts);
//         }
//       } catch (error) {
//         console.error("Failed to load leave types", error);
//       }
//     })();
//   }, []);

//   /* -------------------- AUTO DAYS -------------------- */
//   useEffect(() => {
//     if (formData.from_date && formData.to_date) {
//       const days =
//         moment(formData.to_date).diff(moment(formData.from_date), "days") + 1;
//       setFormData((p: any) => ({ ...p, no_of_days: days }));
//       validateDates();
//     }
//   }, [formData.from_date, formData.to_date]);

//   /* -------------------- VALIDATE DATES -------------------- */
//   const validateDates = () => {
//     if (!validated) return;
//     const err: any = {};
//     if (!formData.from_date) err.from_date = "From date required";
//     if (!formData.to_date) err.to_date = "To date required";
//     if (
//       formData.from_date &&
//       formData.to_date &&
//       moment(formData.from_date).isAfter(moment(formData.to_date))
//     ) {
//       err.to_date = "To date must be after or equal to From date";
//     }
//     setErrors((prev: any) => ({
//       ...prev,
//       from_date: err.from_date || "",
//       to_date: err.to_date || "",
//     }));
//   };

//   /* -------------------- CHANGE -------------------- */
//   const handleChange = (e: any) => {
//     const { name, value, type, checked } = e.target;

//     if (type === "checkbox") {
//       setFormData((p: any) => ({ ...p, [name]: checked }));
//       return;
//     }

//     // ✅ allow typing freely
//     setFormData((p: any) => ({ ...p, [name]: value }));
//   };

//   /* -------------------- VALIDATION -------------------- */
//   const validateForm = () => {
//     const err: any = {};

//     if (!data && !formData.holiday_status_id)
//       err.holiday_status_id = "Holiday status required";

//     if (!formData.from_date) err.from_date = "From date required";
//     if (!formData.to_date) err.to_date = "To date required";

//     if (
//       formData.from_date &&
//       formData.to_date &&
//       moment(formData.from_date).isAfter(moment(formData.to_date))
//     ) {
//       err.to_date = "To date must be after or equal to From date";
//     }

//     setErrors(err);
//     return Object.keys(err).length === 0;
//   };

//   /* -------------------- SUBMIT -------------------- */
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     setValidated(true);

//     // if (!validateForm()) {
//     //   console.log("Validation failed");
//     //   return;
//     // }

//     setIsSubmitting(true);
//     try {
//       const payload = {
//         holiday_status_id: formData.holiday_status_id
//           ? Number(formData.holiday_status_id)
//           : null,
//         date_from: formData.from_date,
//         date_to: formData.to_date,
//         reason: formData.reason,
//       };

//       if (data?.id) {
//         await updateLeaveRequest(Number(data.id), payload);
//         toast.success("Leave updated");
//       } else {
//         await createLeaveRequest(payload);
//         toast.success("Leave created");
//       }

//       onSuccess();
//       document.getElementById("close-btn-leave")?.click();
//     } catch (error) {
//       console.error("API call failed", error);
//       toast.error("API call failed");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="modal fade" id="add_leave_request">
//       <div className="modal-dialog modal-lg modal-dialog-centered">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5>{data ? "Edit Leave Request" : "Add Leave Request"}</h5>
//             <button
//               id="close-btn-leave"
//               data-bs-dismiss="modal"
//               className="btn-close"
//             />
//           </div>

//           <form onSubmit={handleSubmit} noValidate>
//             <div className="modal-body row">
//               {/* Company Name */}
//               <div className="col-md-6 mb-3">
//                 <label>Company Name</label>
//                 <input
//                   type="text"
//                   name="company_name"
//                   className="form-control"
//                   value={formData.company_name}
//                   onChange={handleChange}
//                   readOnly={!!data}
//                 />
//               </div>

//               {/* Department Name */}
//               <div className="col-md-6 mb-3">
//                 <label>Department Name</label>
//                 <input
//                   type="text"
//                   name="department_name"
//                   className="form-control"
//                   value={formData.department_name}
//                   onChange={handleChange}
//                   readOnly={!!data}
//                 />
//               </div>

//               {/* Status */}
//               <div className="col-md-6 mb-3">
//                 <label>Status</label>
//                 <input
//                   type="text"
//                   name="status"
//                   className="form-control"
//                   value={formData.status}
//                   onChange={handleChange}
//                   readOnly={!!data}
//                 />
//               </div>

//               {/* Holiday Status ID */}
//               <div className="col-md-6 mb-3">
//                 <label>Holiday Status</label>
//                 <select
//                   name="holiday_status_id"
//                   className={`form-select ${
//                     validated && errors.holiday_status_id
//                       ? "is-invalid"
//                       : validated && formData.holiday_status_id
//                       ? "is-valid"
//                       : ""
//                   }`}
//                   value={formData.holiday_status_id ?? ""}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select holiday status</option>
//                   {leaveTypesOptions.map((lt) => (
//                     <option key={lt.id} value={lt.id}>
//                       {lt.name}
//                     </option>
//                   ))}
//                 </select>
//                 {validated && errors.holiday_status_id && (
//                   <span className="text-danger small">
//                     {errors.holiday_status_id}
//                   </span>
//                 )}
//               </div>

//               {/* Dates */}
//               <div className="col-md-3 mb-3">
//                 <label>From</label>
//                 <DatePicker
//                   className={`w-100 ${
//                     fromDateTouched && errors.from_date
//                       ? "is-invalid"
//                       : fromDateTouched && formData.from_date
//                       ? "is-valid"
//                       : ""
//                   }`}
//                   value={formData.from_date ? moment(formData.from_date) : null}
//                   onChange={(_, d) => {
//                     setFormData((p: any) => ({ ...p, from_date: d }));
//                     setFromDateTouched(true);
//                   }}
//                   onBlur={() => setFromDateTouched(true)}
//                 />

//                 {fromDateTouched && errors.from_date && (
//                   <span className="text-danger small">{errors.from_date}</span>
//                 )}
//               </div>

//               <div className="col-md-3 mb-3">
//                 <label>To</label>
//                 <DatePicker
//                   className={`w-100 ${
//                     toDateTouched && errors.to_date
//                       ? "is-invalid"
//                       : toDateTouched && formData.to_date
//                       ? "is-valid"
//                       : ""
//                   }`}
//                   value={formData.to_date ? moment(formData.to_date) : null}
//                   onChange={(_, d) => {
//                     setFormData((p: any) => ({ ...p, to_date: d }));
//                     setToDateTouched(true);
//                   }}
//                   onBlur={() => setToDateTouched(true)}
//                 />

//                 {toDateTouched && errors.to_date && (
//                   <span className="text-danger small">{errors.to_date}</span>
//                 )}
//               </div>

//               {/* Reason */}
//               <div className="col-md-12 mb-3">
//                 <label>Reason</label>
//                 <textarea
//                   name="reason"
//                   className="form-control"
//                   value={formData.reason}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             <div className="modal-footer">
//               <button
//                 type="submit"
//                 className="btn btn-primary"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Saving..." : "Save Leave"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddEditLeaveRequestModal;
