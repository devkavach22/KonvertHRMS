import React, { useEffect, useState } from "react";
import {
  addWorkEntryType,
  updateWorkEntryType,
  WorkEntryType,
} from "./WorkEntryTypeServices";
import { toast } from "react-toastify";

interface Props {
  onSuccess: () => void;
  data: WorkEntryType | null;
  onClose: () => void; // <--- Parent reset trigger
}

const AddEditWorkEntryTypeModal: React.FC<Props> = ({
  onSuccess,
  data,
  onClose,
}) => {
  const initialFormState = {
    name: "",
    code: "",
    external_code: "",
    sequence: 0,
    color: 1,
    is_unforeseen: false,
    is_leave: false,
    round_days: "NO",
  };

  const [formData, setFormData] = useState<any>(initialFormState);
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 1. DATA SYNC: Populate form when editing
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        code: data.code || "",
        external_code: data.external_code || "",
        sequence: data.sequence || 0,
        color: data.color || 1,
        is_unforeseen: data.is_unforeseen || false,
        is_leave: data.is_leave || false,
        round_days: data.round_days || "NO",
      });
    } else {
      resetForm();
    }
  }, [data]);

  // 2. BOOTSTRAP EVENT LISTENER: Force clear on close
  useEffect(() => {
    const modalElement = document.getElementById("add_work_entry_type");

    const handleModalHidden = () => {
      resetForm();
      onClose(); // <--- CALL PARENT TO RESET STATE
    };

    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", handleModalHidden);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("hidden.bs.modal", handleModalHidden);
      }
    };
  }, [onClose]);

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    // Handle Checkboxes
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev: any) => ({ ...prev, [name]: checked }));
    }
    // Handle Numbers
    else if (type === "number") {
      setFormData((prev: any) => ({ ...prev, [name]: Number(value) }));
    }
    // Handle Text/Select
    else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }

    // Clear Error
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    let tempErrors: any = {};
    let isValid = true;

    if (!formData.name?.trim()) {
      tempErrors.name = "Name is required";
      isValid = false;
    }
    if (!formData.code?.trim()) {
      tempErrors.code = "Code is required";
      isValid = false;
    }
    if (!formData.external_code?.trim()) {
      tempErrors.external_code = "External Code is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validate()) return;

    setIsSubmitting(true);

    const apiPayload = {
      ...formData,
      name: formData.name.trim(),
      code: formData.code.trim(),
      external_code: formData.external_code.trim(),
      sequence: Number(formData.sequence),
      color: Number(formData.color),
    };

    try {
      if (data && data.id) {
        await updateWorkEntryType(data.id, apiPayload);
        toast.success("Work Entry updated successfully!");
      } else {
        await addWorkEntryType(apiPayload);
        toast.success("New Work Entry created!");
      }

      onSuccess();
      document.getElementById("close-btn-entry")?.click();
    } catch (error: any) {
      console.error("Save Error:", error);
      toast.error(error.response?.data?.message || "Failed to save data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for input class
  const getInputClass = (fieldName: string) => {
    if (isSubmitted && errors[fieldName]) return "form-control is-invalid";
    if (isSubmitted && !errors[fieldName] && formData[fieldName])
      return "form-control is-valid";
    return "form-control";
  };

  return (
    <div
      className="modal fade"
      id="add_work_entry_type"
      role="dialog"
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          {/* Header */}
          <div className="modal-header border-bottom bg-light py-2">
            <h5 className="modal-title fw-bold text-dark fs-16">
              <i className="ti ti-file   me-2 text-primary"></i>
              {data ? "Edit Work Entry Type" : "Add Work Entry Type"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-btn-entry"
              onClick={resetForm}
            ></button>
          </div>

          <div className="modal-body p-4">
            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3">
                {/* Name */}
                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={getInputClass("name")}
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Regular Work"
                  />
                  {isSubmitted && errors.name && (
                    <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                      <i className="ti ti-info-circle me-1"></i>
                      {errors.name}
                    </div>
                  )}
                </div>

                {/* Code */}
                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">
                    Code <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="code"
                    className={getInputClass("code")}
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="e.g. REG"
                  />
                  {isSubmitted && errors.code && (
                    <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                      <i className="ti ti-info-circle me-1"></i>
                      {errors.code}
                    </div>
                  )}
                </div>

                {/* External Code */}
                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">
                    External Code <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="external_code"
                    className={getInputClass("external_code")}
                    value={formData.external_code}
                    onChange={handleInputChange}
                    placeholder="e.g. EXT_001"
                  />
                  {isSubmitted && errors.external_code && (
                    <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                      <i className="ti ti-info-circle me-1"></i>
                      {errors.external_code}
                    </div>
                  )}
                </div>

                {/* Round Days */}
                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">Round Days</label>
                  <select
                    name="round_days"
                    className="form-select"
                    value={formData.round_days}
                    onChange={handleInputChange}
                  >
                    <option value="NO">NO</option>
                    <option value="HALF">HALF</option>
                    <option value="FULL">FULL</option>
                  </select>
                </div>

                {/* Sequence */}
                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">Sequence</label>
                  <input
                    type="number"
                    name="sequence"
                    className="form-control"
                    value={formData.sequence}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Color */}
                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">
                    Color (1-10)
                  </label>
                  <input
                    type="number"
                    name="color"
                    min="1"
                    max="10"
                    className="form-control"
                    value={formData.color}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Switches */}
                <div className="col-md-6 pt-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isUnforeseen"
                      name="is_unforeseen"
                      checked={formData.is_unforeseen}
                      onChange={handleInputChange}
                    />
                    <label
                      className="form-check-label fw-bold fs-13"
                      htmlFor="isUnforeseen"
                    >
                      Is Unforeseen?
                    </label>
                  </div>
                </div>

                <div className="col-md-6 pt-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isLeave"
                      name="is_leave"
                      checked={formData.is_leave}
                      onChange={handleInputChange}
                    />
                    <label
                      className="form-check-label fw-bold fs-13"
                      htmlFor="isLeave"
                    >
                      Is Leave?
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
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
                    <>{data ? "Update Changes" : "Save Entry Type"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditWorkEntryTypeModal;

// import React, { useEffect, useState } from "react";
// import {
//   addWorkEntryType,
//   updateWorkEntryType,
//   WorkEntryType,
// } from "./WorkEntryTypeServices";
// import { toast } from "react-toastify";

// interface Props {
//   onSuccess: () => void;
//   data: WorkEntryType | null;
// }

// const AddEditWorkEntryTypeModal: React.FC<Props> = ({ onSuccess, data }) => {
//   const [name, setName] = useState("");
//   const [code, setCode] = useState("");
//   const [externalCode, setExternalCode] = useState("");
//   const [sequence, setSequence] = useState(0);
//   const [color, setColor] = useState(1);
//   const [isUnforeseen, setIsUnforeseen] = useState(false);
//   const [isLeave, setIsLeave] = useState(false);
//   const [roundDays, setRoundDays] = useState<"NO" | "HALF" | "FULL">("NO");
//   const [validated, setValidated] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // 1. Helper to reset form to initial state
//   const resetForm = () => {
//     setName("");
//     setCode("");
//     setExternalCode("");
//     setSequence(0);
//     setColor(1);
//     setIsUnforeseen(false);
//     setIsLeave(false);
//     setRoundDays("NO");
//     setValidated(false);
//   };

//   // 2. DATA SYNC: Populate form when editing
//   useEffect(() => {
//     if (data) {
//       setName(data.name || "");
//       setCode(data.code || "");
//       setExternalCode(data.external_code || "");
//       setSequence(data.sequence || 0);
//       setColor(data.color || 1);
//       setIsUnforeseen(data.is_unforeseen || false);
//       setIsLeave(data.is_leave || false);
//       setRoundDays(data.round_days || "NO");
//     } else {
//       resetForm();
//     }
//   }, [data]);

//   // 3. BOOTSTRAP EVENT LISTENER: Force clear when modal is closed
//   // This handles backdrop clicks, Escape key, and the Close button
//   useEffect(() => {
//     const modalElement = document.getElementById("add_work_entry_type");

//     const handleModalHidden = () => {
//       resetForm();
//     };

//     if (modalElement) {
//       modalElement.addEventListener("hidden.bs.modal", handleModalHidden);
//     }

//     return () => {
//       if (modalElement) {
//         modalElement.removeEventListener("hidden.bs.modal", handleModalHidden);
//       }
//     };
//   }, []);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setValidated(true);

//     if (e.currentTarget.checkValidity() === false) return;

//     setIsSubmitting(true);

//     const apiPayload = {
//       name: name.trim(),
//       code: code.trim(),
//       external_code: externalCode.trim() || name.trim(),
//       sequence: Number(sequence),
//       color: Number(color),
//       is_unforeseen: !!isUnforeseen,
//       is_leave: !!isLeave,
//       round_days: roundDays,
//     };

//     try {
//       if (data && data.id) {
//         await updateWorkEntryType(data.id, apiPayload);
//         toast.success("Work Entry updated successfully!");
//       } else {
//         await addWorkEntryType(apiPayload);
//         toast.success("New Work Entry created!");
//       }

//       // Close modal using the button ID
//       document.getElementById("close-btn-entry")?.click();

//       // Trigger parent refresh
//       onSuccess();
//     } catch (error: any) {
//       console.error("Save Error:", error);
//       toast.error(error.response?.data?.message || "Failed to save data.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div
//       className="modal custom-modal fade"
//       id="add_work_entry_type"
//       role="dialog"
//     >
//       <div className="modal-dialog modal-dialog-centered modal-lg">
//         <div className="modal-content">
//           <div className="modal-header border-0">
//             <h5 className="modal-title">{data ? "Edit Type" : "Add Type"}</h5>
//             <button
//               type="button"
//               className="btn-close"
//               data-bs-dismiss="modal"
//               id="close-btn-entry"
//             ></button>
//           </div>
//           <div className="modal-body">
//             <form
//               className={`needs-validation ${validated ? "was-validated" : ""}`}
//               noValidate
//               onSubmit={handleSubmit}
//             >
//               <div className="row">
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Name <span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                   />
//                 </div>
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Code <span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={code}
//                     onChange={(e) => setCode(e.target.value)}
//                   />
//                 </div>
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     External Code <span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={externalCode}
//                     onChange={(e) => setExternalCode(e.target.value)}
//                   />
//                 </div>
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Round Days <span className="text-danger">*</span>
//                   </label>
//                   <select
//                     className="form-select"
//                     required
//                     value={roundDays}
//                     onChange={(e) => setRoundDays(e.target.value as any)}
//                   >
//                     <option value="NO">NO</option>
//                     <option value="HALF">HALF</option>
//                     <option value="FULL">FULL</option>
//                   </select>
//                 </div>
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Sequence</label>
//                   <input
//                     type="number"
//                     className="form-control"
//                     value={sequence}
//                     onChange={(e) => setSequence(parseInt(e.target.value) || 0)}
//                   />
//                 </div>
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Color (1-10)</label>
//                   <input
//                     type="number"
//                     min="1"
//                     max="10"
//                     className="form-control"
//                     value={color}
//                     onChange={(e) => setColor(parseInt(e.target.value) || 1)}
//                   />
//                 </div>
//                 <div className="col-md-6 mb-3">
//                   <div className="form-check form-switch mt-4">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       checked={isUnforeseen}
//                       onChange={(e) => setIsUnforeseen(e.target.checked)}
//                     />
//                     <label className="form-check-label">Is Unforeseen?</label>
//                   </div>
//                 </div>
//                 <div className="col-md-6 mb-3">
//                   <div className="form-check form-switch mt-4">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       checked={isLeave}
//                       onChange={(e) => setIsLeave(e.target.checked)}
//                     />
//                     <label className="form-check-label">Is Leave?</label>
//                   </div>
//                 </div>
//               </div>
//               <div className="modal-footer border-0">
//                 <button
//                   type="submit"
//                   className="btn btn-primary w-100"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? "Processing..." : "Save Changes"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddEditWorkEntryTypeModal;
