import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DatePicker } from "antd";
import moment from "moment";
import {
  Expense,
  createExpense,
  fileToBase64,
  getExpenseAccounts,
} from "./ExpenseKHRService";
// Ensure this path matches where your Category service is located
import { getExpenseCategories } from "@/KHRModules/Master Modules/ExpenseCategory/ExpenseCategoryKHRService";
import CommonSelect from "@/core/common/commonSelect";

interface Props {
  onSuccess: () => void;
  data: Expense | null;
  onClose: () => void; // <--- NEW PROP
}

const AddEditExpenseKHRModal: React.FC<Props> = ({
  onSuccess,
  data,
  onClose,
}) => {
  const initialFormState = {
    name: "", // Description
    product_id: "", // Category
    total_amount_currency: "",
    payment_mode: "own_account",
    date: moment().format("YYYY-MM-DD"),
    fileName: "",
    attachment: "", // Base64
  };

  const [formData, setFormData] = useState<any>(initialFormState);
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Dropdown States
  const [categories, setCategories] = useState<any[]>([]);

  // --- 1. Fetch Dropdowns ---
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const catResult: any = await getExpenseCategories();
        // Handle array inside .data or .data.data
        const rawCats = Array.isArray(catResult.data)
          ? catResult.data
          : catResult.data?.data || [];

        setCategories(
          rawCats.map((c: any) => ({
            value: String(c.id),
            label: c.name,
          })),
        );
      } catch (error) {
        console.error("Error loading categories", error);
      }
    };
    fetchDropdowns();
  }, []);

  // --- 2. Populate Data (Edit Mode) ---
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        product_id: data.product_id ? String(data.product_id) : "",
        total_amount_currency: data.total_amount_currency || "",
        payment_mode: data.payment_mode || "own_account",
        date: data.date || moment().format("YYYY-MM-DD"),
        fileName: data.fileName || "",
        attachment: "", // Keep empty unless new file selected
      });
    } else {
      resetForm();
    }
  }, [data]);

  // --- 3. BOOTSTRAP EVENT LISTENER (Reset on Close) ---
  useEffect(() => {
    const modalElement = document.getElementById("add_expense_modal");
    const handleHidden = () => {
      resetForm();
      onClose(); // <--- CALL PARENT TO RESET STATE
    };
    modalElement?.addEventListener("hidden.bs.modal", handleHidden);
    return () =>
      modalElement?.removeEventListener("hidden.bs.modal", handleHidden);
  }, [onClose]);

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
    // Reset file input manually
    const fileInput = document.getElementById(
      "expense_file",
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  // --- 4. Handlers ---
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await fileToBase64(file);
        setFormData((prev: any) => ({
          ...prev,
          fileName: file.name,
          attachment: base64,
        }));
      } catch (err) {
        toast.error("Error processing file");
      }
    }
  };

  const validate = () => {
    let tempErrors: any = {};
    let isValid = true;

    if (!formData.name?.trim()) {
      tempErrors.name = "Description is required";
      isValid = false;
    }
    if (!formData.product_id) {
      tempErrors.product_id = "Category is required";
      isValid = false;
    }
    if (
      !formData.total_amount_currency ||
      Number(formData.total_amount_currency) <= 0
    ) {
      tempErrors.total_amount_currency = "Valid amount is required";
      isValid = false;
    }
    if (!formData.date) {
      tempErrors.date = "Date is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validate()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        product_id: Number(formData.product_id),
        total_amount_currency: Number(formData.total_amount_currency),
      };

      // NOTE: Ensure you have an updateExpense function in your service if editing is supported
      if (data?.id) {
        // await updateExpense(data.id, payload);
        // For now using create if update isn't available, or uncomment above if added
        await createExpense(payload);
        toast.success("Expense updated successfully");
      } else {
        await createExpense(payload);
        toast.success("Expense created successfully");
      }

      onSuccess();
      document.getElementById("close-btn-expense")?.click();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI Helpers
  const getInputClass = (fieldName: string) => {
    if (isSubmitted && errors[fieldName]) return "form-control is-invalid";
    if (isSubmitted && !errors[fieldName] && formData[fieldName])
      return "form-control is-valid";
    return "form-control";
  };

  return (
    <div
      className="modal fade"
      id="add_expense_modal"
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          {/* Header */}
          <div className="modal-header border-bottom bg-light py-2">
            <h5 className="modal-title fw-bold text-dark fs-16">
              <i className="ti ti-receipt me-2 text-primary"></i>
              {data ? "Edit Expense" : "Create Expense"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-btn-expense"
              onClick={resetForm}
            ></button>
          </div>

          <div className="modal-body p-4">
            <form onSubmit={handleSubmit} noValidate>
              {/* Description */}
              <div className="mb-4">
                <label className="form-label fs-13 fw-bold">
                  Description <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={getInputClass("name")}
                  placeholder="e.g. Client Lunch at Downtown"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {isSubmitted && errors.name && (
                  <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                    <i className="ti ti-info-circle me-1"></i> {errors.name}
                  </div>
                )}
              </div>

              <div className="row g-3 mb-4">
                {/* Category / Product */}
                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">
                    Category <span className="text-danger">*</span>
                  </label>
                  <div
                    className={
                      isSubmitted && errors.product_id
                        ? "border border-danger rounded"
                        : ""
                    }
                  >
                    <CommonSelect
                      options={categories}
                      placeholder="Select Category"
                      // Use 'key' to force re-render on reset
                      key={formData.product_id}
                      defaultValue={categories.find(
                        (c) => c.value === formData.product_id,
                      )}
                      onChange={(opt) => {
                        setFormData({
                          ...formData,
                          product_id: opt?.value || "",
                        });
                        if (errors.product_id)
                          setErrors({ ...errors, product_id: null });
                      }}
                    />
                  </div>
                  {isSubmitted && errors.product_id && (
                    <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                      <i className="ti ti-info-circle me-1"></i>{" "}
                      {errors.product_id}
                    </div>
                  )}
                </div>

                {/* Amount */}
                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">
                    Total Amount <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      ₹
                    </span>
                    <input
                      type="number"
                      name="total_amount_currency"
                      className={`form-control border-start-0 ${isSubmitted && errors.total_amount_currency ? "is-invalid" : ""}`}
                      placeholder="0.00"
                      value={formData.total_amount_currency}
                      onChange={handleInputChange}
                    />
                  </div>
                  {isSubmitted && errors.total_amount_currency && (
                    <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                      <i className="ti ti-info-circle me-1"></i>{" "}
                      {errors.total_amount_currency}
                    </div>
                  )}
                </div>
              </div>

              <div className="row g-3 mb-4">
                {/* Date */}
                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">
                    Expense Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    className={getInputClass("date")}
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                  {isSubmitted && errors.date && (
                    <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                      <i className="ti ti-info-circle me-1"></i> {errors.date}
                    </div>
                  )}
                </div>

                {/* Payment Mode */}
                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">Paid By</label>
                  <div className="d-flex gap-3 mt-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="payment_mode"
                        id="paid_own"
                        value="own_account"
                        checked={formData.payment_mode === "own_account"}
                        onChange={handleInputChange}
                      />
                      <label
                        className="form-check-label fs-13"
                        htmlFor="paid_own"
                      >
                        Employee (Reimburse)
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="payment_mode"
                        id="paid_company"
                        value="company_account"
                        checked={formData.payment_mode === "company_account"}
                        onChange={handleInputChange}
                      />
                      <label
                        className="form-check-label fs-13"
                        htmlFor="paid_company"
                      >
                        Company
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attachment */}
              <div className="mb-3">
                <label className="form-label fs-13 fw-bold">
                  Receipt / Bill
                </label>
                <div className="input-group">
                  <input
                    type="file"
                    id="expense_file"
                    className="form-control"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                  />
                  <label
                    className="input-group-text bg-light"
                    htmlFor="expense_file"
                  >
                    <i className="ti ti-upload"></i>
                  </label>
                </div>
                {formData.fileName && (
                  <div className="text-success fs-12 mt-1">
                    <i className="ti ti-check me-1"></i> {formData.fileName}
                  </div>
                )}
                <div className="form-text fs-11 text-muted">
                  Allowed formats: PDF, JPG, PNG. Max size: 5MB.
                </div>
              </div>

              {/* Footer */}
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
                    <>{data ? "Update Changes" : "Create Expense"}</>
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

export default AddEditExpenseKHRModal;

// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { DatePicker } from "antd";
// import moment from "moment";
// import { Expense, createExpense, fileToBase64 } from "./ExpenseKHRService";

// interface Props {
//   onSuccess: () => void;
//   data: Expense | null;
// }

// const AddEditExpenseKHRModal: React.FC<Props> = ({ onSuccess, data }) => {
//   const initialFormState = {
//     name: "", // Description
//     product_id: "",
//     account_id: "870", // Default as per your snippet, or make it dynamic
//     total_amount_currency: "",
//     payment_mode: "own_account",
//     date: moment().format("YYYY-MM-DD"),
//     fileName: "",
//     attachment: "",
//   };

//   const [formData, setFormData] = useState<any>(initialFormState);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState<any>({});
//   const [validated, setValidated] = useState(false);

//   // --- Reset/Populate Form ---
//   useEffect(() => {
//     if (data) {
//       setFormData({
//         name: data.name || "",
//         product_id: data.product_id || "",
//         account_id: data.account_id || "870",
//         total_amount_currency: data.total_amount_currency || "",
//         payment_mode: data.payment_mode || "own_account",
//         date: data.date || moment().format("YYYY-MM-DD"),
//         // Attachments usually aren't editable directly in the same way, resetting for new upload
//         fileName: "",
//         attachment: "",
//       });
//     } else {
//       setFormData(initialFormState);
//     }
//     setSelectedFile(null);
//     setValidated(false);
//     setErrors({});
//   }, [data]);

//   // --- Handlers ---
//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev: any) => ({ ...prev, [name]: value }));
//   };

//   const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev: any) => ({ ...prev, payment_mode: e.target.value }));
//   };

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setSelectedFile(file);

//       // Convert to Base64 immediately or on submit. Doing it here for preview/readiness.
//       try {
//         const base64 = await fileToBase64(file);
//         setFormData((prev: any) => ({
//           ...prev,
//           fileName: file.name,
//           attachment: base64,
//         }));
//       } catch (err) {
//         console.error("File conversion error", err);
//         toast.error("Error processing file");
//       }
//     }
//   };

//   // --- Validation ---
//   const validateForm = () => {
//     const err: any = {};
//     if (!formData.name) err.name = "Description is required";
//     if (!formData.product_id) err.product_id = "Product is required";
//     if (!formData.total_amount_currency)
//       err.total_amount_currency = "Amount is required";
//     if (!formData.date) err.date = "Date is required";

//     setErrors(err);
//     return Object.keys(err).length === 0;
//   };

//   // --- Submit ---
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setValidated(true);

//     if (!validateForm()) return;

//     setIsSubmitting(true);
//     try {
//       // Prepare payload exactly as requested
//       const payload = {
//         name: formData.name,
//         product_id: Number(formData.product_id), // Ensure number
//         account_id: Number(formData.account_id), // Ensure number
//         total_amount_currency: Number(formData.total_amount_currency),
//         payment_mode: formData.payment_mode,
//         date: formData.date,
//         fileName: formData.fileName,
//         attachment: formData.attachment, // This contains the "data:image/png;base64..." string
//       };

//       if (data?.id) {
//         // Update Logic (If needed, your snippet only provided CREATE)
//         // await updateExpense(data.id, payload);
//         toast.info("Update API not provided in snippet, logic skipped.");
//       } else {
//         // Create Logic
//         await createExpense(payload);
//         toast.success("Expense Created Successfully");
//       }

//       onSuccess();
//       document.getElementById("close-btn-expense")?.click();
//     } catch (error) {
//       console.error("API Error", error);
//       toast.error("Failed to save expense");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="modal fade" id="add_expense_modal">
//       <div className="modal-dialog modal-lg modal-dialog-centered">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">
//               {data ? "Edit Expense" : "Create Expense"}
//             </h5>
//             <button
//               id="close-btn-expense"
//               data-bs-dismiss="modal"
//               className="btn-close"
//             />
//           </div>

//           <form onSubmit={handleSubmit} noValidate>
//             <div className="modal-body">
//               {/* Description / Name */}
//               <div className="mb-3">
//                 <label className="form-label">
//                   Description / Name <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   className={`form-control ${
//                     validated && errors.name ? "is-invalid" : ""
//                   }`}
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="e.g. Lunch with Client"
//                 />
//                 {validated && errors.name && (
//                   <div className="invalid-feedback">{errors.name}</div>
//                 )}
//               </div>

//               <div className="row">
//                 {/* Product ID (Select Mockup) */}
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Product <span className="text-danger">*</span>
//                   </label>
//                   <select
//                     name="product_id"
//                     className={`form-select ${
//                       validated && errors.product_id ? "is-invalid" : ""
//                     }`}
//                     value={formData.product_id}
//                     onChange={handleChange}
//                   >
//                     <option value="">Select Product</option>
//                     {/* Ideally fetch these from a getProducts API */}
//                     <option value="45">45 - Expenses</option>
//                     <option value="46">46 - Travel</option>
//                   </select>
//                   {validated && errors.product_id && (
//                     <div className="invalid-feedback">{errors.product_id}</div>
//                   )}
//                 </div>

//                 {/* Account ID (Hidden or Readonly often, but making input for now) */}
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Account ID</label>
//                   <input
//                     type="number"
//                     name="account_id"
//                     className="form-control"
//                     value={formData.account_id}
//                     onChange={handleChange}
//                     readOnly // Making readOnly if it's always 870 or auto-determined
//                   />
//                 </div>
//               </div>

//               <div className="row">
//                 {/* Amount */}
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Total Amount <span className="text-danger">*</span>
//                   </label>
//                   <div className="input-group">
//                     <span className="input-group-text">₹</span>
//                     <input
//                       type="number"
//                       name="total_amount_currency"
//                       className={`form-control ${
//                         validated && errors.total_amount_currency
//                           ? "is-invalid"
//                           : ""
//                       }`}
//                       value={formData.total_amount_currency}
//                       onChange={handleChange}
//                     />
//                     {validated && errors.total_amount_currency && (
//                       <div className="invalid-feedback">
//                         {errors.total_amount_currency}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Date */}
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Expense Date <span className="text-danger">*</span>
//                   </label>
//                   <DatePicker
//                     className={`w-100 form-control ${
//                       validated && errors.date ? "is-invalid" : ""
//                     }`}
//                     value={formData.date ? moment(formData.date) : null}
//                     onChange={(_, dateString) => {
//                       // AntD returns string or object, ensuring string 'YYYY-MM-DD'
//                       const val =
//                         typeof dateString === "string" ? dateString : "";
//                       setFormData((prev: any) => ({ ...prev, date: val }));
//                     }}
//                     allowClear={false}
//                   />
//                   {validated && errors.date && (
//                     <div className="text-danger small mt-1">{errors.date}</div>
//                   )}
//                 </div>
//               </div>

//               {/* Payment Mode */}
//               <div className="mb-3">
//                 <label className="form-label d-block">Paid By</label>
//                 <div className="form-check form-check-inline">
//                   <input
//                     className="form-check-input"
//                     type="radio"
//                     name="payment_mode"
//                     id="mode_own"
//                     value="own_account"
//                     checked={formData.payment_mode === "own_account"}
//                     onChange={handleRadioChange}
//                   />
//                   <label className="form-check-label" htmlFor="mode_own">
//                     Employee (to reimburse)
//                   </label>
//                 </div>
//                 <div className="form-check form-check-inline">
//                   <input
//                     className="form-check-input"
//                     type="radio"
//                     name="payment_mode"
//                     id="mode_company"
//                     value="company_account"
//                     checked={formData.payment_mode === "company_account"}
//                     onChange={handleRadioChange}
//                   />
//                   <label className="form-check-label" htmlFor="mode_company">
//                     Company
//                   </label>
//                 </div>
//               </div>

//               {/* Attachment */}
//               <div className="mb-3">
//                 <label className="form-label">Receipt / Bill Attachment</label>
//                 <input
//                   type="file"
//                   className="form-control"
//                   onChange={handleFileChange}
//                   accept="image/*,.pdf"
//                 />
//                 {formData.fileName && (
//                   <div className="text-success small mt-1">
//                     <i className="ti ti-check" /> Selected: {formData.fileName}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="modal-footer">
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 data-bs-dismiss="modal"
//               >
//                 Close
//               </button>
//               <button
//                 type="submit"
//                 className="btn btn-primary"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Saving..." : "Create Expense"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddEditExpenseKHRModal;
