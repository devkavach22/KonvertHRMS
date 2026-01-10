import React, { useEffect, useState } from "react";
import { addIndustry, updateIndustry, Industry } from "./IndustriesServices";
import { toast } from "react-toastify";

interface Props {
  onSuccess: () => void;
  data: Industry | null;
}

const AddEditIndustriesModal: React.FC<Props> = ({ onSuccess, data }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const initialFormState = {
    name: "",
    full_name: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  // --- 1. Populate / Reset Logic ---
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        full_name: data.full_name || "",
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

  // --- 2. Bootstrap Event Listener (Clear on Close) ---
  useEffect(() => {
    const modalElement = document.getElementById("add_industry_modal");
    const handleHidden = () => resetForm();
    modalElement?.addEventListener("hidden.bs.modal", handleHidden);
    return () =>
      modalElement?.removeEventListener("hidden.bs.modal", handleHidden);
  }, []);

  // --- 3. Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    let tempErrors: any = {};
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = "Industry Name is required";
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
    const payload = {
      name: formData.name.trim(),
      full_name: formData.full_name.trim(),
    };

    try {
      if (data && data.id) {
        await updateIndustry(data.id, payload);
        toast.success("Industry updated successfully");
      } else {
        await addIndustry(payload);
        toast.success("Industry created successfully");
      }

      onSuccess();
      document.getElementById("close-industry-btn")?.click();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save industry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal fade" id="add_industry_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          {/* Header */}
          <div className="modal-header border-bottom bg-light py-2">
            <h5 className="modal-title fw-bold text-dark fs-16">
              <i className="ti ti-building-factory-2 me-2 text-primary"></i>
              {data ? "Edit Industry" : "Create Industry"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-industry-btn"
              onClick={resetForm}
            ></button>
          </div>

          <div className="modal-body p-4">
            <form noValidate onSubmit={handleSubmit}>
              {/* Industry Name */}
              <div className="mb-3">
                <label className="form-label fs-13 fw-bold">
                  Industry Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={`form-control ${
                    isSubmitted ? (errors.name ? "is-invalid" : "is-valid") : ""
                  }`}
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. IT Services"
                />
                {isSubmitted && errors.name && (
                  <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                    <i className="ti ti-info-circle me-1"></i> {errors.name}
                  </div>
                )}
              </div>

              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label fs-13 fw-bold">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  className="form-control"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="e.g. Information Technology Services"
                />
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
                  ) : data ? (
                    "Update Changes"
                  ) : (
                    "Save Industry"
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

export default AddEditIndustriesModal;
// import React, { useEffect, useState } from "react";
// import { addIndustry, updateIndustry, Industry } from "./IndustriesServices";
// import { toast } from "react-toastify";

// interface Props {
//   onSuccess: () => void;
//   data: Industry | null;
// }

// const AddEditIndustriesModal: React.FC<Props> = ({ onSuccess, data }) => {
//   const [name, setName] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [validated, setValidated] = useState(false); // Validation State
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Sync state with data prop
//   useEffect(() => {
//     if (data) {
//       setName(data.name || "");
//       setFullName(data.full_name || "");
//     } else {
//       setName("");
//       setFullName("");
//     }
//     setValidated(false); // Reset validation when data changes
//   }, [data]);

//   // Listener to clear state when modal is closed (X, Backdrop, or Escape)
//   useEffect(() => {
//     const modalElement = document.getElementById("add_industry_modal");
//     const handleHidden = () => {
//       setName("");
//       setFullName("");
//       setValidated(false);
//     };
//     modalElement?.addEventListener("hidden.bs.modal", handleHidden);
//     return () =>
//       modalElement?.removeEventListener("hidden.bs.modal", handleHidden);
//   }, []);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const form = e.currentTarget;
//     setValidated(true); // Trigger Bootstrap's visual validation

//     // If HTML5 validation (required attribute) fails, stop here
//     if (form.checkValidity() === false) {
//       return;
//     }

//     setIsSubmitting(true);
//     const payload = {
//       name: name.trim(),
//       full_name: fullName.trim(),
//     };

//     try {
//       if (data && data.id) {
//         await updateIndustry(data.id, payload);
//         toast.success("Industry updated successfully");
//       } else {
//         await addIndustry(payload);
//         toast.success("Industry created successfully");
//       }

//       // Close modal and refresh
//       document.getElementById("close-industry-btn")?.click();
//       onSuccess();
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to save industry");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div
//       className="modal custom-modal fade"
//       id="add_industry_modal"
//       role="dialog"
//     >
//       <div className="modal-dialog modal-dialog-centered">
//         <div className="modal-content">
//           <div className="modal-header border-0">
//             <h5 className="modal-title">
//               {data ? "Edit Industry" : "Add Industry"}
//             </h5>
//             <button
//               type="button"
//               className="btn-close"
//               data-bs-dismiss="modal"
//               id="close-industry-btn"
//             ></button>
//           </div>
//           <div className="modal-body">
//             <form
//               className={`needs-validation ${validated ? "was-validated" : ""}`}
//               noValidate
//               onSubmit={handleSubmit}
//             >
//               {/* Industry Name */}
//               <div className="mb-3">
//                 <label className="form-label">
//                   Industry Name <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   required // HTML5 Required
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="e.g. IT Services"
//                 />
//                 <div className="invalid-feedback">
//                   Please provide an industry name.
//                 </div>
//               </div>

//               {/* Full Name */}
//               <div className="mb-3">
//                 <label className="form-label">Full Name</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                   placeholder="e.g. Information Technology Services"
//                 />
//               </div>

//               <div className="modal-footer border-0">
//                 <button
//                   type="button"
//                   className="btn btn-light"
//                   data-bs-dismiss="modal"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn btn-primary"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? "Saving..." : "Save Industry"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddEditIndustriesModal;
