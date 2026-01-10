import React, { useEffect, useState } from "react";
import {
  addContractType,
  updateContractType,
  ContractType,
} from "./HRContractTypeServices";
import { toast } from "react-toastify";

interface Props {
  onSuccess: () => void;
  data: ContractType | null;
}

const AddEditHRContractTypeModal: React.FC<Props> = ({ onSuccess, data }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    country_name: "",
  });

  const [errors, setErrors] = useState<any>({});

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      country_name: "",
    });
    setErrors({});
    setIsSubmitted(false);
  };

  // Load data on Edit
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        code: data.code || "",
        country_name: data.country_name || "",
      });
    } else {
      resetForm();
    }
  }, [data]);

  // Modal hidden event listener (Safety backup)
  useEffect(() => {
    const modalElement = document.getElementById("add_contract_type_modal");
    const handleHidden = () => resetForm();

    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", handleHidden);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("hidden.bs.modal", handleHidden);
      }
    };
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error immediately on type
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    let tempErrors: any = {};
    if (!formData.name.trim()) tempErrors.name = "Contract Name is required";
    if (!formData.code.trim()) tempErrors.code = "Code is required";
    if (!formData.country_name.trim())
      tempErrors.country_name = "Country Name is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validate()) {
      toast.error("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      country_name: formData.country_name.trim(),
    };

    try {
      if (data && data.id) {
        await updateContractType(data.id, payload);
        toast.success("Contract Type updated successfully");
      } else {
        await addContractType(payload);
        toast.success("Contract Type created successfully");
      }
      document.getElementById("close-btn-contract")?.click();
      onSuccess();
      resetForm();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error saving contract type"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for input visual state (Red/Green)
  const getInputClass = (field: string) => {
    if (errors[field]) return "form-control is-invalid";
    if (isSubmitted && (formData as any)[field] && !errors[field])
      return "form-control is-valid";
    return "form-control";
  };

  return (
    <>
      <style>
        {`
          #add_contract_type_modal { z-index: 1080 !important; }
          .is-invalid + .invalid-feedback { display: block; }
        `}
      </style>

      <div
        className="modal fade"
        id="add_contract_type_modal"
        tabIndex={-1}
        aria-hidden="true"
        data-bs-backdrop="static"
        style={{ background: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg border-0">
            {/* Header matches Bank Account style */}
            <div className="modal-header border-bottom bg-light py-2">
              <h5 className="modal-title fw-bold fs-15">
                <i className="ti ti-file-description me-2 text-primary"></i>
                {data ? "Edit Contract Type" : "Add Contract Type"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="close-btn-contract"
                onClick={resetForm}
              ></button>
            </div>

            <div className="modal-body p-4">
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label fs-13 fw-bold">
                    Contract Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={getInputClass("name")}
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="e.g. Full-Time Contract"
                  />
                  <div className="invalid-feedback">{errors.name}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label fs-13 fw-bold">
                    Code <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={getInputClass("code")}
                    value={formData.code}
                    onChange={(e) =>
                      handleChange(
                        "code",
                        e.target.value.toUpperCase().replace(/\s/g, "_")
                      )
                    }
                    placeholder="e.g. FT_CONTRACT"
                  />
                  <small className="text-muted fs-11">
                    Auto-converted to uppercase (e.g. ABC_XYZ)
                  </small>
                  <div className="invalid-feedback">{errors.code}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label fs-13 fw-bold">
                    Country Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={getInputClass("country_name")}
                    value={formData.country_name}
                    onChange={(e) =>
                      handleChange("country_name", e.target.value)
                    }
                    placeholder="e.g. India"
                  />
                  <div className="invalid-feedback">{errors.country_name}</div>
                </div>

                {/* Footer matches Bank Account style */}
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
                        Save Changes
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

export default AddEditHRContractTypeModal;

// import React, { useEffect, useState } from "react";
// import {
//   addContractType,
//   updateContractType,
//   ContractType,
// } from "./HRContractTypeServices";
// import { toast } from "react-toastify";

// interface Props {
//   onSuccess: () => void;
//   data: ContractType | null;
// }

// const AddEditHRContractTypeModal: React.FC<Props> = ({ onSuccess, data }) => {
//   const [name, setName] = useState("");
//   const [code, setCode] = useState("");
//   const [country, setCountry] = useState("");
//   const [validated, setValidated] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const resetForm = () => {
//     setName("");
//     setCode("");
//     setCountry("");
//     setValidated(false);
//   };

//   useEffect(() => {
//     if (data) {
//       setName(data.name || "");
//       setCode(data.code || "");
//       setCountry(data.country_name || "");
//     } else {
//       resetForm();
//     }
//   }, [data]);

//   useEffect(() => {
//     const modalElement = document.getElementById("add_contract_type_modal");
//     const handleHidden = () => resetForm();
//     modalElement?.addEventListener("hidden.bs.modal", handleHidden);
//     return () =>
//       modalElement?.removeEventListener("hidden.bs.modal", handleHidden);
//   }, []);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const form = e.currentTarget;
//     setValidated(true);

//     if (form.checkValidity() === false) return;

//     setIsSubmitting(true);
//     const payload = {
//       name: name.trim(),
//       code: code.trim(),
//       country_name: country.trim(),
//     };

//     try {
//       if (data && data.id) {
//         await updateContractType(data.id, payload);
//         toast.success("Contract Type updated successfully");
//       } else {
//         await addContractType(payload);
//         toast.success("Contract Type created successfully");
//       }
//       document.getElementById("close-btn-contract")?.click();
//       onSuccess();
//     } catch (error: any) {
//       toast.error(
//         error.response?.data?.message || "Error saving contract type"
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div
//       className="modal custom-modal fade"
//       id="add_contract_type_modal"
//       role="dialog"
//     >
//       <div className="modal-dialog modal-dialog-centered">
//         <div className="modal-content">
//           <div className="modal-header border-0">
//             <h5 className="modal-title">
//               {data ? "Edit Contract Type" : "Add Contract Type"}
//             </h5>
//             <button
//               type="button"
//               className="btn-close"
//               data-bs-dismiss="modal"
//               id="close-btn-contract"
//             ></button>
//           </div>
//           <div className="modal-body">
//             <form
//               className={`needs-validation ${validated ? "was-validated" : ""}`}
//               noValidate
//               onSubmit={handleSubmit}
//             >
//               <div className="mb-3">
//                 <label className="form-label">
//                   Contract Name <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   required
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="e.g. Full-Time Contract"
//                 />
//                 <div className="invalid-feedback">
//                   Please enter a contract name.
//                 </div>
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">
//                   Code <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   required
//                   value={code}
//                   onChange={(e) => setCode(e.target.value)}
//                   placeholder="e.g. FT_CONTRACT"
//                 />
//                 <div className="invalid-feedback">Please enter a code.</div>
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">
//                   Country Name <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   required
//                   value={country}
//                   onChange={(e) => setCountry(e.target.value)}
//                   placeholder="e.g. India"
//                 />
//                 <div className="invalid-feedback">Please enter a country.</div>
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
//                   {isSubmitting ? "Saving..." : "Save Contract Type"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddEditHRContractTypeModal;
