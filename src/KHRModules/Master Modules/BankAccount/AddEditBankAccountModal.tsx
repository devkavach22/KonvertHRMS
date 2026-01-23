import React, { useEffect, useState } from "react";
import { addBankAccount, updateBankAccount } from "./BankAccountServices";
import { toast } from "react-toastify";
import CommonSelect from "../../../core/common/commonSelect";
import { getBanks } from "../BanksKHR/BanksServices";

interface Props {
  onSuccess: (newId?: string) => void;
  data: any | null;
  onClose: () => void;
}

const AddEditBankAccountModal: React.FC<Props> = ({
  onSuccess,
  data,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [banks, setBanks] = useState<any[]>([]);

  // Using 'bank_id' directly for reliable binding
  const initialFormState = {
    bank_id: "",
    acc_number: "",
    bank_swift_code: "",
    bank_iafc_code: "",
    currency: "INR",
  };

  const [formData, setFormData] = useState<any>(initialFormState);

  // 1. BOOTSTRAP EVENT LISTENER (Force clear on close)
  useEffect(() => {
    const modalElement = document.getElementById("add_bank_account_modal");
    const handleHidden = () => {
      resetForm();
      onClose();
    };
    modalElement?.addEventListener("hidden.bs.modal", handleHidden);
    return () =>
      modalElement?.removeEventListener("hidden.bs.modal", handleHidden);
  }, [onClose]);

  // 2. Load Banks Dropdown (Fixed Data Extraction)
  useEffect(() => {
    const loadBanks = async () => {
      try {
        const bankDataRaw = await getBanks();
        const bankResponse = bankDataRaw as any;

        const rawBanks =
          bankResponse?.banks ||
          bankResponse?.data ||
          (Array.isArray(bankResponse) ? bankResponse : []);

        // Map ID as value for reliable matching, STORE SWIFT HERE
        setBanks(
          rawBanks.map((b: any) => ({
            value: String(b.id),
            label: b.name,
            swift: b.swift_code, // <--- Key for lookup
          })),
        );
      } catch (error) {
        console.error("Error loading banks:", error);
      }
    };
    loadBanks();
  }, []);

  // 3. Pre-fill form for Edit
  // ADDED 'banks' to dependency array so we can lookup SWIFT code once banks load
  useEffect(() => {
    if (data) {
      // Robust extraction of Bank ID
      let extractedBankId = "";
      if (Array.isArray(data.bank_id) && data.bank_id.length > 0) {
        extractedBankId = String(data.bank_id[0]);
      } else if (data.bank_id && data.bank_id !== false) {
        extractedBankId = String(data.bank_id);
      }

      // Robust extraction of Currency
      let extractedCurrency = "INR";
      if (Array.isArray(data.currency_id) && data.currency_id.length > 1) {
        extractedCurrency = data.currency_id[1];
      } else if (data.currency) {
        extractedCurrency = data.currency;
      }

      // --- FIX: LOOKUP SWIFT CODE ---
      // If data has it, use it. If not, find it in the loaded banks list.
      let finalSwift = data.bank_swift_code || "";
      if (!finalSwift && banks.length > 0 && extractedBankId) {
        const foundBank = banks.find((b) => b.value === extractedBankId);
        if (foundBank) {
          finalSwift = foundBank.swift;
        }
      }

      setFormData({
        bank_id: extractedBankId,
        acc_number: data.acc_number || "",
        bank_swift_code: finalSwift, // <--- Using the looked-up value
        bank_iafc_code:
          data.bank_iafc_code && data.bank_iafc_code !== false
            ? data.bank_iafc_code
            : "",
        currency: extractedCurrency,
      });
    } else {
      resetForm();
    }
  }, [data, banks]); // <--- Dependency on 'banks' ensures lookup runs after fetch

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }));
    }
  };

  const getInputClass = (fieldName: string) => {
    if (errors[fieldName]) return "form-control is-invalid";
    if (isSubmitted && formData[fieldName] && !errors[fieldName])
      return "form-control is-valid";
    return "form-control";
  };

  const getSelectWrapperClass = (fieldName: string) => {
    if (errors[fieldName]) return "border border-danger rounded";
    if (isSubmitted && formData[fieldName] && !errors[fieldName])
      return "border border-success rounded";
    return "";
  };

  const validate = () => {
    let tempErrors: any = {};
    const accNumRegex = /^\d+$/;

    if (!formData.bank_id) tempErrors.bank_id = "Bank is required";

    if (!formData.acc_number?.toString().trim()) {
      tempErrors.acc_number = "Account Number is required";
    } else if (!accNumRegex.test(formData.acc_number)) {
      tempErrors.acc_number = "Only digits allowed";
    }

    if (!formData.bank_iafc_code) {
      tempErrors.bank_iafc_code = "IFSC Code is required";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validate()) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    setIsSubmitting(true);

    // Prepare payload
    const apiPayload = {
      ...formData,
      bank_id: Number(formData.bank_id),
    };

    try {
      if (data?.id) {
        await updateBankAccount(data.id, apiPayload);
        toast.success("Bank Account Updated");
      } else {
        const res = await addBankAccount(apiPayload);
        toast.success("Bank Account Created");
        if (res.data?.id) onSuccess(res.data.id);
      }
      onSuccess();
      document.getElementById("close-bank-acc")?.click();
      resetForm();
    } catch (err: any) {
      console.error(err);
      toast.error("Process failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>
        {`
        #add_bank_account_modal { z-index: 1080 !important; }
        .is-invalid + .invalid-feedback { display: block; }
      `}
      </style>

      <div
        className="modal fade"
        id="add_bank_account_modal"
        tabIndex={-1}
        aria-hidden="true"
        data-bs-backdrop="static"
        style={{ background: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content shadow-lg border-0">
            <div className="modal-header border-bottom bg-light py-2">
              <h5 className="modal-title fw-bold fs-15">
                <i className="ti ti-building-bank me-2 text-primary"></i>
                {data ? "Edit Bank Account" : "Create Bank Account"}
              </h5>
              <button
                type="button"
                id="close-bank-acc"
                className="btn-close"
                data-bs-dismiss="modal"
                onClick={resetForm}
              ></button>
            </div>

            <div className="modal-body p-4">
              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-4">
                  {/* Left Column */}
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fs-13 fw-bold">
                        Bank Name <span className="text-danger">*</span>
                      </label>
                      <div className={getSelectWrapperClass("bank_id")}>
                        <CommonSelect
                          key={formData.bank_id}
                          options={banks}
                          placeholder="Select Bank"
                          defaultValue={banks.find(
                            (b) => String(b.value) === String(formData.bank_id),
                          )}
                          onChange={(opt) => {
                            setFormData({
                              ...formData,
                              bank_id: opt?.value || "",
                              bank_swift_code: opt?.swift || "", // Auto-fill on change
                            });
                            clearError("bank_id");
                          }}
                        />
                      </div>
                      {errors.bank_id && (
                        <div className="text-danger fs-12 mt-1">
                          {errors.bank_id}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label fs-13 fw-bold">
                        Account Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={getInputClass("acc_number")}
                        value={formData.acc_number}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            acc_number: e.target.value.replace(/\D/g, ""),
                          });
                          clearError("acc_number");
                        }}
                        placeholder="e.g. 123456789015"
                      />
                      <div className="invalid-feedback">
                        {errors.acc_number}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fs-13 fw-bold text-muted">
                        SWIFT Code
                      </label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        value={formData.bank_swift_code}
                        readOnly
                        placeholder="Auto-populated"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="col-md-6 border-start ps-md-4">
                    <div className="mb-3">
                      <label className="form-label fs-13 fw-bold">
                        IFSC Code <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={getInputClass("bank_iafc_code")}
                        value={formData.bank_iafc_code}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            bank_iafc_code: e.target.value.toUpperCase(),
                          });
                          clearError("bank_iafc_code");
                        }}
                        placeholder="e.g. SBIN0001234"
                        maxLength={11}
                      />
                      <div className="invalid-feedback">
                        {errors.bank_iafc_code}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fs-13 fw-bold">
                        Currency
                      </label>
                      <select
                        className="form-select"
                        value={formData.currency}
                        onChange={(e) =>
                          setFormData({ ...formData, currency: e.target.value })
                        }
                      >
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
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
                    {isSubmitting ? (
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      <i className="ti ti-device-floppy me-1"></i>
                    )}
                    {isSubmitting ? "Saving..." : "Save Account"}
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

export default AddEditBankAccountModal;

// import React, { useEffect, useState } from "react";
// import {
//   addBankAccount,
//   updateBankAccount,
//   getBranches,
// } from "./BankAccountServices";
// import { toast } from "react-toastify";
// import CommonSelect from "../../../core/common/commonSelect";
// import { getBanks } from "../BanksKHR/BanksServices";

// interface Props {
//   onSuccess: (newId?: string) => void;
//   data: any | null;
// }

// const AddEditBankAccountModal: React.FC<Props> = ({ onSuccess, data }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [errors, setErrors] = useState<any>({});
//   const [banks, setBanks] = useState<any[]>([]);
//   const [partners, setPartners] = useState<any[]>([]); // New Partner State

//   const [formData, setFormData] = useState<any>({
//     bank_name: "",
//     // partner_name: "", // Now a dropdown
//     acc_number: "",
//     bank_swift_code: "",
//     bank_iafc_code: "",
//     currency: "INR",
//   });

//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
//         const [bankDataRaw] = await Promise.all([
//           getBanks(),
//           // getBranches(),
//         ]);

//         // FIX: Handle the Type 'Bank[]' error by checking raw response structure
//         const bankResponse = bankDataRaw as any;
//         const rawBanks =
//           bankResponse?.banks ||
//           (Array.isArray(bankResponse) ? bankResponse : []);

//         setBanks(
//           rawBanks.map((b: any) => ({
//             value: b.name,
//             label: b.name,
//             swift: b.swift_code,
//           }))
//         );

//         // Set Partners from Branch API
//         // setPartners(
//         //   branchData.map((branch: any) => ({
//         //     value: branch.name,
//         //     label: branch.name,
//         //   }))
//         // );
//       } catch (error) {
//         console.error("Error loading data:", error);
//       }
//     };
//     loadInitialData();
//   }, []);

//   useEffect(() => {
//     if (data) {
//       setFormData({
//         bank_name: Array.isArray(data.bank_id)
//           ? data.bank_id[1]
//           : data.bank_name,
//         // partner_name: data.partner_name || "",
//         acc_number: data.acc_number || "",
//         bank_swift_code: data.bank_swift_code || "",
//         bank_iafc_code: data.bank_iafc_code || "",
//         currency: data.currency || "INR",
//       });
//     } else {
//       resetForm();
//     }
//   }, [data]);

//   const resetForm = () => {
//     setFormData({
//       bank_name: "",
//       // partner_name: "",
//       acc_number: "",
//       bank_swift_code: "",
//       bank_iafc_code: "",
//       currency: "INR",
//     });
//     setErrors({});
//     setIsSubmitted(false);
//   };

//   const validate = () => {
//     let tempErrors: any = {};
//     if (!formData.acc_number?.trim()) tempErrors.acc_number = true;
//     // if (!formData.partner_name) tempErrors.partner_name = true; // Required check
//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitted(true);
//     if (!validate()) {
//       toast.error("Account number and Partner are required.");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       if (data?.id) {
//         await updateBankAccount(data.id, formData);
//         toast.success("Bank Account Updated");
//       } else {
//         const res = await addBankAccount(formData);
//         toast.success("Bank Account Created");
//         onSuccess(res.data?.id);
//       }
//       onSuccess();
//       document.getElementById("close-bank-acc")?.click();
//     } catch (err: any) {
//       toast.error("Process failed");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <style>
//         {`
//         #add_bank_account_modal { z-index: 1080 !important; }
//         .error-pink { background-color: #fff0f3 !important; border: 1px solid #f1aeb5 !important; }
//       `}
//       </style>

//       <div
//         className="modal fade"
//         id="add_bank_account_modal"
//         tabIndex={-1}
//         aria-hidden="true"
//         data-bs-backdrop="static"
//         style={{ background: "rgba(0,0,0,0.5)" }}
//       >
//         <div className="modal-dialog modal-dialog-centered modal-lg">
//           <div className="modal-content shadow-lg border-0">
//             <div className="modal-header border-bottom bg-light py-2">
//               <h5 className="modal-title fw-bold fs-15">
//                 <i className="ti ti-credit-card me-2 text-primary"></i>
//                 {data ? "Edit Bank Account" : "Create Bank Account"}
//               </h5>
//               <button
//                 type="button"
//                 id="close-bank-acc"
//                 className="btn-close"
//                 data-bs-dismiss="modal"
//               ></button>
//             </div>

//             <div className="modal-body p-4">
//               <form onSubmit={handleSubmit}>
//                 <div className="row g-4">
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label fs-13 text-danger fw-bold">
//                         Account Number *
//                       </label>
//                       <input
//                         type="text"
//                         className={`form-control ${
//                           isSubmitted && errors.acc_number ? "error-pink" : ""
//                         }`}
//                         value={formData.acc_number}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             acc_number: e.target.value,
//                           })
//                         }
//                         placeholder="123456789015"
//                       />
//                     </div>

//                     <div className="mb-3">
//                       <label className="form-label fs-13 fw-bold">
//                         Bank Name
//                       </label>
//                       <CommonSelect
//                         options={banks}
//                         placeholder="Select Bank"
//                         defaultValue={banks.find(
//                           (b) => b.value === formData.bank_name
//                         )}
//                         onChange={(opt) =>
//                           setFormData({
//                             ...formData,
//                             bank_name: opt?.value || "",
//                             bank_swift_code: opt?.swift || "",
//                           })
//                         }
//                       />
//                     </div>

//                     <div className="mb-3">
//                       <label className="form-label fs-13 fw-bold">
//                         SWIFT Code
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control bg-light"
//                         value={formData.bank_swift_code}
//                         disabled
//                       />
//                     </div>
//                   </div>

//                   <div className="col-md-6 border-start ps-4">
//                     {/* <div className="mb-3">
//                       <label className="form-label fs-13 text-danger fw-bold">
//                         Account Holder Name *
//                       </label>
//                       <div
//                         className={
//                           isSubmitted && errors.partner_name
//                             ? "error-pink rounded"
//                             : ""
//                         }
//                       >
//                         <CommonSelect
//                           options={partners}
//                           placeholder="Select Branch"
//                           defaultValue={partners.find(
//                             (p) => p.value === formData.partner_name
//                           )}
//                           onChange={(opt) =>
//                             setFormData({
//                               ...formData,
//                               partner_name: opt?.value || "",
//                             })
//                           }
//                         />
//                       </div>
//                     </div> */}

//                     <div className="mb-3">
//                       <label className="form-label fs-13 fw-bold">
//                         IFSC Code
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         value={formData.bank_iafc_code}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             bank_iafc_code: e.target.value.toUpperCase(),
//                           })
//                         }
//                         placeholder="AXIS0001234"
//                       />
//                     </div>

//                     <div className="mb-3">
//                       <label className="form-label fs-13 fw-bold">
//                         Currency
//                       </label>
//                       <select
//                         className="form-select"
//                         value={formData.currency}
//                         onChange={(e) =>
//                           setFormData({ ...formData, currency: e.target.value })
//                         }
//                       >
//                         <option value="INR">INR</option>
//                         <option value="USD">USD</option>
//                         <option value="EUR">EUR</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="modal-footer border-0 px-0 mt-4 pb-0">
//                   <button
//                     type="button"
//                     className="btn btn-outline-secondary px-4 me-2"
//                     data-bs-dismiss="modal"
//                     onClick={resetForm}
//                   >
//                     Discard
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn btn-primary px-5 shadow"
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? "Processing..." : "Save Account"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AddEditBankAccountModal;
