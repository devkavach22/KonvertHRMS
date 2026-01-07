import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  LeaveRequest,
  updateLeaveRequest,
  createLeaveRequest,
  getAllLeaveTypes,
} from "./LeaveRequestServices";
import { DatePicker } from "antd";
import moment from "moment";

interface Props {
  onSuccess: () => void;
  data: LeaveRequest | null;
}

const AddEditLeaveRequestModal: React.FC<Props> = ({ onSuccess, data }) => {
  // Removed unused fields (company, department, status) from initial state
  const initialFormState = {
    holiday_status_id: "",
    from_date: "",
    to_date: "",
    no_of_days: "",
    reason: "",
  };

  const [formData, setFormData] = useState<any>(initialFormState);
  const [leaveTypesOptions, setLeaveTypesOptions] = useState<any[]>([]);
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Touched states for immediate validation feedback
  const [fromDateTouched, setFromDateTouched] = useState(false);
  const [toDateTouched, setToDateTouched] = useState(false);

  /* -------------------- EDIT MODE -------------------- */
  useEffect(() => {
    if (data) {
      setFormData({
        holiday_status_id: data.leave_type ?? "",
        from_date: data.from_date ?? "",
        to_date: data.to_date ?? "",
        no_of_days: data.no_of_days ?? "",
        reason: data.reason ?? "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [data]);

  /* -------------------- LEAVE TYPES -------------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllLeaveTypes();
        if (res && res.data && Array.isArray(res.data)) {
          const opts = res.data.map((lt: any) => ({
            id: lt.id,
            name: lt.name,
          }));
          setLeaveTypesOptions(opts);
        }
      } catch (error) {
        console.error("Failed to load leave types", error);
      }
    })();
  }, []);

  /* -------------------- AUTO DAYS -------------------- */
  useEffect(() => {
    if (formData.from_date && formData.to_date) {
      const days =
        moment(formData.to_date).diff(moment(formData.from_date), "days") + 1;
      setFormData((p: any) => ({ ...p, no_of_days: days }));
      validateDates();
    }
  }, [formData.from_date, formData.to_date]);

  /* -------------------- VALIDATE DATES -------------------- */
  const validateDates = () => {
    // Only validate if user has interacted with form
    if (!validated && !fromDateTouched && !toDateTouched) return;

    const err: any = {};
    if (!formData.from_date) err.from_date = "From date required";
    if (!formData.to_date) err.to_date = "To date required";

    if (
      formData.from_date &&
      formData.to_date &&
      moment(formData.from_date).isAfter(moment(formData.to_date))
    ) {
      err.to_date = "To date must be after or equal to From date";
    }

    setErrors((prev: any) => ({
      ...prev,
      from_date: err.from_date || "",
      to_date: err.to_date || "",
    }));
  };

  /* -------------------- CHANGE -------------------- */
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((p: any) => ({ ...p, [name]: value }));
  };

  /* -------------------- VALIDATION -------------------- */
  const validateForm = () => {
    const err: any = {};

    if (!formData.holiday_status_id)
      err.holiday_status_id = "Leave Type is required";
    if (!formData.from_date) err.from_date = "From Date is required";
    if (!formData.to_date) err.to_date = "To Date is required";

    // Reason is NOT mandatory anymore

    if (
      formData.from_date &&
      formData.to_date &&
      moment(formData.from_date).isAfter(moment(formData.to_date))
    ) {
      err.to_date = "To date must be after or equal to From date";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setValidated(true);
    setFromDateTouched(true);
    setToDateTouched(true);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        holiday_status_id: formData.holiday_status_id
          ? Number(formData.holiday_status_id)
          : null,
        date_from: formData.from_date,
        date_to: formData.to_date,
        reason: formData.reason,
      };

      if (data?.id) {
        await updateLeaveRequest(Number(data.id), payload);
        toast.success("Leave updated");
      } else {
        await createLeaveRequest(payload);
        toast.success("Leave created");
      }

      onSuccess();
      document.getElementById("close-btn-leave")?.click();
    } catch (error) {
      console.error("API call failed", error);
      toast.error("Failed to save leave request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal fade" id="add_leave_request">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {data ? "Edit Leave Request" : "Add Leave Request"}
            </h5>
            <button
              id="close-btn-leave"
              data-bs-dismiss="modal"
              className="btn-close"
            />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body row">
              {/* Leave Type - Mandatory */}
              <div className="col-md-12 mb-3">
                <label className="form-label">
                  Leave Type <span className="text-danger">*</span>
                </label>
                <select
                  name="holiday_status_id"
                  className={`form-select ${
                    validated && errors.holiday_status_id
                      ? "is-invalid"
                      : validated && formData.holiday_status_id
                      ? "is-valid"
                      : ""
                  }`}
                  value={formData.holiday_status_id ?? ""}
                  onChange={handleChange}
                >
                  <option value="">Select leave type</option>
                  {leaveTypesOptions.map((lt) => (
                    <option key={lt.id} value={lt.id}>
                      {lt.name}
                    </option>
                  ))}
                </select>
                {validated && errors.holiday_status_id && (
                  <div className="invalid-feedback">
                    {errors.holiday_status_id}
                  </div>
                )}
              </div>

              {/* Dates - Mandatory */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  From Date <span className="text-danger">*</span>
                </label>
                <DatePicker
                  className={`w-100 form-control ${
                    (validated || fromDateTouched) && errors.from_date
                      ? "is-invalid"
                      : (validated || fromDateTouched) && formData.from_date
                      ? "is-valid"
                      : ""
                  }`}
                  value={formData.from_date ? moment(formData.from_date) : null}
                  onChange={(_, d) => {
                    setFormData((p: any) => ({ ...p, from_date: d }));
                    setFromDateTouched(true);
                  }}
                  onBlur={() => setFromDateTouched(true)}
                  placeholder="Select Start Date"
                />
                {(validated || fromDateTouched) && errors.from_date && (
                  <div className="text-danger small mt-1">
                    {errors.from_date}
                  </div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  To Date <span className="text-danger">*</span>
                </label>
                <DatePicker
                  className={`w-100 form-control ${
                    (validated || toDateTouched) && errors.to_date
                      ? "is-invalid"
                      : (validated || toDateTouched) && formData.to_date
                      ? "is-valid"
                      : ""
                  }`}
                  value={formData.to_date ? moment(formData.to_date) : null}
                  onChange={(_, d) => {
                    setFormData((p: any) => ({ ...p, to_date: d }));
                    setToDateTouched(true);
                  }}
                  onBlur={() => setToDateTouched(true)}
                  placeholder="Select End Date"
                />
                {(validated || toDateTouched) && errors.to_date && (
                  <div className="text-danger small mt-1">{errors.to_date}</div>
                )}
              </div>

              {/* Reason - Optional */}
              <div className="col-md-12 mb-3">
                <label className="form-label">Reason</label>
                <textarea
                  name="reason"
                  rows={3}
                  className="form-control"
                  value={formData.reason}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
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
