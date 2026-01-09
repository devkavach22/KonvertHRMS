import React, { useEffect, useState } from "react";
import {
  addAttendancePolicy,
  updateAttendancePolicy,
  AttendancePolicy,
} from "./AttendancePolicyServices";
import { toast } from "react-toastify";

interface Props {
  onSuccess: () => void;
  data: AttendancePolicy | null;
}

const AddEditAttendancePolicyModal: React.FC<Props> = ({ onSuccess, data }) => {
  // Initial state for all fields
  const initialFormState = {
    name: "",
    type: "regular", // Default: regular
    absent_if: "in_out_abs", // Default: in_out_abs
    day_after: 0,
    grace_minutes: 0,
    no_pay_minutes: 0,
    half_day_minutes: 0,
    early_grace_minutes: 0,
    late_beyond_days: 0,
    late_beyond_time: 0,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<any>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. DATA SYNC: Populate form when editing
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name === "-" ? "" : data.name,
        type: data.type || "regular",
        absent_if: data.absent_if || "in_out_abs",
        day_after: data.day_after || 0,
        grace_minutes: data.grace_minutes || 0,
        no_pay_minutes: data.no_pay_minutes || 0,
        half_day_minutes: data.half_day_minutes || 0,
        early_grace_minutes: data.early_grace_minutes || 0,
        late_beyond_days: data.late_beyond_days || 0,
        late_beyond_time: data.late_beyond_time || 0,
      });
    } else {
      resetForm();
    }
  }, [data]);

  // 2. RESET LOGIC: Listen for Modal Close (Backdrop click, etc.)
  useEffect(() => {
    const modalElement = document.getElementById("add_attendance_policy");
    const handleModalHidden = () => {
      resetForm();
    };
    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", handleModalHidden);
    }
    return () => {
      if (modalElement) {
        modalElement.removeEventListener("hidden.bs.modal", handleModalHidden);
      }
    };
  }, []);

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsSubmitted(false);
  };

  // Helper: Visual Input Class
  const getInputClass = (fieldName: string) => {
    if (errors[fieldName]) return "form-control is-invalid";
    if (
      isSubmitted &&
      (formData as any)[fieldName] !== "" &&
      !errors[fieldName]
    )
      return "form-control is-valid";
    return "form-control";
  };

  // Helper: Visual Select Class
  const getSelectClass = (fieldName: string) => {
    if (errors[fieldName]) return "form-select is-invalid";
    if (isSubmitted && (formData as any)[fieldName] && !errors[fieldName])
      return "form-select is-valid";
    return "form-select";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error immediately
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    let tempErrors: any = {};
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = "Policy Name is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validate()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    // Prepare Payload (ensure numbers are numbers)
    const apiPayload = {
      ...formData,
      day_after: Number(formData.day_after),
      grace_minutes: Number(formData.grace_minutes),
      no_pay_minutes: Number(formData.no_pay_minutes),
      half_day_minutes: Number(formData.half_day_minutes),
      early_grace_minutes: Number(formData.early_grace_minutes),
      late_beyond_days: Number(formData.late_beyond_days),
      late_beyond_time: Number(formData.late_beyond_time),
    };

    try {
      if (data && data.id) {
        await updateAttendancePolicy(data.id, apiPayload);
        toast.success("Policy Updated Successfully");
      } else {
        await addAttendancePolicy(apiPayload);
        toast.success("Policy Created Successfully");
      }

      // Close modal using button click to ensure Bootstrap cleanup
      const closeBtn = document.getElementById("close-btn-policy");
      closeBtn?.click();

      onSuccess();
      resetForm();
    } catch (error) {
      console.error("Failed to save policy", error);
      toast.error("Failed to save policy. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>
        {`
          #add_attendance_policy { z-index: 1080 !important; }
          .is-invalid + .invalid-feedback { display: block; }
        `}
      </style>

      <div
        className="modal fade"
        id="add_attendance_policy"
        tabIndex={-1}
        aria-hidden="true"
        data-bs-backdrop="static"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header border-bottom bg-light py-2">
              <h5 className="modal-title fw-bold fs-15">
                <i className="ti ti-calendar-time me-2 text-primary"></i>
                {data ? "Edit Attendance Policy" : "Add Attendance Policy"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="close-btn-policy"
                aria-label="Close"
                onClick={resetForm}
              ></button>
            </div>

            <div className="modal-body p-4">
              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  {/* Name - MANDATORY */}
                  <div className="col-md-12">
                    <label className="form-label fs-13 fw-bold">
                      Policy Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      className={getInputClass("name")}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Standard Office Policy"
                    />
                    <div className="invalid-feedback">{errors.name}</div>
                  </div>

                  {/* Type - SELECT */}
                  <div className="col-md-6">
                    <label className="form-label fs-13 fw-bold">Type</label>
                    <select
                      name="type"
                      className="form-select"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <option value="regular">Regular</option>
                      <option value="accrual">Accrual</option>
                    </select>
                  </div>

                  {/* Absent If - SELECT */}
                  <div className="col-md-6">
                    <label className="form-label fs-13 fw-bold">
                      Absent Condition
                    </label>
                    <select
                      name="absent_if"
                      className="form-select"
                      value={formData.absent_if}
                      onChange={handleChange}
                    >
                      <option value="in_out_abs">In & Out Absent</option>
                      <option value="in_abs">In Absent</option>
                      <option value="out_abs">Out Absent</option>
                    </select>
                  </div>

                  {/* Numeric Fields Section */}
                  <div className="col-12 mt-4">
                    <h6 className="fw-bold text-muted border-bottom pb-2 mb-3">
                      Time Configurations
                    </h6>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fs-13">Day After (Mins)</label>
                    <input
                      type="number"
                      name="day_after"
                      className="form-control"
                      value={formData.day_after}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fs-13">Grace Minutes</label>
                    <input
                      type="number"
                      name="grace_minutes"
                      className="form-control"
                      value={formData.grace_minutes}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fs-13">No Pay Minutes</label>
                    <input
                      type="number"
                      name="no_pay_minutes"
                      className="form-control"
                      value={formData.no_pay_minutes}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fs-13">Half Day Minutes</label>
                    <input
                      type="number"
                      name="half_day_minutes"
                      className="form-control"
                      value={formData.half_day_minutes}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fs-13">
                      Early Grace Minutes
                    </label>
                    <input
                      type="number"
                      name="early_grace_minutes"
                      className="form-control"
                      value={formData.early_grace_minutes}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fs-13">Late Beyond Days</label>
                    <input
                      type="number"
                      name="late_beyond_days"
                      className="form-control"
                      value={formData.late_beyond_days}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fs-13">Late Beyond Time</label>
                    <input
                      type="number"
                      name="late_beyond_time"
                      className="form-control"
                      value={formData.late_beyond_time}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="modal-footer border-0 px-0 mt-4 pb-0">
                  <button
                    type="button"
                    className="btn btn-light px-4 me-2"
                    data-bs-dismiss="modal"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-5 shadow-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="ti ti-device-floppy me-1"></i>
                        Save Policy
                      </>
                    )}
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

export default AddEditAttendancePolicyModal;

// import React, { useEffect, useState } from "react";
// import {
//   addAttendancePolicy,
//   updateAttendancePolicy,
//   AttendancePolicy,
// } from "./AttendancePolicyServices";

// interface Props {
//   onSuccess: () => void;
//   data: AttendancePolicy | null;
// }

// const AddEditAttendancePolicyModal: React.FC<Props> = ({ onSuccess, data }) => {
//   // Initial state for all fields
//   const initialFormState = {
//     name: "",
//     type: "regular", // Default: regular
//     absent_if: "in_out_abs", // Default: in_out_abs
//     day_after: 0,
//     grace_minutes: 0,
//     no_pay_minutes: 0,
//     half_day_minutes: 0,
//     early_grace_minutes: 0,
//     late_beyond_days: 0,
//     late_beyond_time: 0,
//   };

//   const [formData, setFormData] = useState(initialFormState);
//   const [validated, setValidated] = useState(false);

//   // 1. DATA SYNC: Populate form when editing
//   useEffect(() => {
//     if (data) {
//       setFormData({
//         name: data.name === "-" ? "" : data.name,
//         type: data.type || "regular",
//         absent_if: data.absent_if || "in_out_abs",
//         day_after: data.day_after || 0,
//         grace_minutes: data.grace_minutes || 0,
//         no_pay_minutes: data.no_pay_minutes || 0,
//         half_day_minutes: data.half_day_minutes || 0,
//         early_grace_minutes: data.early_grace_minutes || 0,
//         late_beyond_days: data.late_beyond_days || 0,
//         late_beyond_time: data.late_beyond_time || 0,
//       });
//     } else {
//       setFormData(initialFormState);
//     }
//   }, [data]);

//   // 2. RESET LOGIC: Listen for Modal Close
//   useEffect(() => {
//     const modalElement = document.getElementById("add_attendance_policy");
//     const handleModalClose = () => {
//       setValidated(false);
//       setFormData(initialFormState);
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

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const form = e.currentTarget;
//     setValidated(true);

//     if (form.checkValidity() === false) {
//       return;
//     }

//     // Prepare Payload (ensure numbers are numbers)
//     const apiPayload = {
//       ...formData,
//       day_after: Number(formData.day_after),
//       grace_minutes: Number(formData.grace_minutes),
//       no_pay_minutes: Number(formData.no_pay_minutes),
//       half_day_minutes: Number(formData.half_day_minutes),
//       early_grace_minutes: Number(formData.early_grace_minutes),
//       late_beyond_days: Number(formData.late_beyond_days),
//       late_beyond_time: Number(formData.late_beyond_time),
//     };

//     try {
//       if (data && data.id) {
//         await updateAttendancePolicy(data.id, apiPayload);
//       } else {
//         await addAttendancePolicy(apiPayload);
//       }

//       const closeBtn = document.getElementById("close-btn-policy");
//       closeBtn?.click();
//       onSuccess();
//     } catch (error) {
//       console.error("Failed to save policy", error);
//       alert("Error saving data.");
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
//               {data ? "Edit Attendance Policy" : "Add Attendance Policy"}
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
//                 {/* Name - MANDATORY */}
//                 <div className="col-md-12 mb-3">
//                   <label className="form-label">
//                     Policy Name <span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     className="form-control"
//                     required
//                     value={formData.name}
//                     onChange={handleChange}
//                     placeholder="e.g. Office Attendance Policy"
//                   />
//                   <div className="invalid-feedback">
//                     Please provide a policy name.
//                   </div>
//                 </div>

//                 {/* Type - SELECT */}
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Type</label>
//                   <select
//                     name="type"
//                     className="form-select"
//                     value={formData.type}
//                     onChange={handleChange}
//                   >
//                     <option value="regular">Regular</option>
//                     <option value="accrual">Accrual</option>
//                   </select>
//                 </div>

//                 {/* Absent If - SELECT */}
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Absent If</label>
//                   <select
//                     name="absent_if"
//                     className="form-select"
//                     value={formData.absent_if}
//                     onChange={handleChange}
//                   >
//                     <option value="in_out_abs">In & Out Absent</option>
//                     <option value="in_abs">In Absent</option>
//                     <option value="out_abs">Out Absent</option>
//                   </select>
//                 </div>

//                 {/* Numeric Fields */}
//                 <div className="col-md-4 mb-3">
//                   <label className="form-label">Day After</label>
//                   <input
//                     type="number"
//                     name="day_after"
//                     className="form-control"
//                     value={formData.day_after}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="col-md-4 mb-3">
//                   <label className="form-label">Grace Minutes</label>
//                   <input
//                     type="number"
//                     name="grace_minutes"
//                     className="form-control"
//                     value={formData.grace_minutes}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="col-md-4 mb-3">
//                   <label className="form-label">No Pay Minutes</label>
//                   <input
//                     type="number"
//                     name="no_pay_minutes"
//                     className="form-control"
//                     value={formData.no_pay_minutes}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="col-md-4 mb-3">
//                   <label className="form-label">Half Day Minutes</label>
//                   <input
//                     type="number"
//                     name="half_day_minutes"
//                     className="form-control"
//                     value={formData.half_day_minutes}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="col-md-4 mb-3">
//                   <label className="form-label">Early Grace Minutes</label>
//                   <input
//                     type="number"
//                     name="early_grace_minutes"
//                     className="form-control"
//                     value={formData.early_grace_minutes}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="col-md-4 mb-3">
//                   <label className="form-label">Late Beyond Days</label>
//                   <input
//                     type="number"
//                     name="late_beyond_days"
//                     className="form-control"
//                     value={formData.late_beyond_days}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="col-md-4 mb-3">
//                   <label className="form-label">Late Beyond Time</label>
//                   <input
//                     type="number"
//                     name="late_beyond_time"
//                     className="form-control"
//                     value={formData.late_beyond_time}
//                     onChange={handleChange}
//                   />
//                 </div>
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
//                   {data ? "Update Changes" : "Save Policy"}
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
