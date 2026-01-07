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

interface Props {
  onSuccess: () => void;
  data: Expense | null;
}

const AddEditExpenseKHRModal: React.FC<Props> = ({ onSuccess, data }) => {
  const initialFormState = {
    name: "",
    product_id: "",
    account_id: "", // Empty initially to force selection
    total_amount_currency: "",
    payment_mode: "own_account",
    date: moment().format("YYYY-MM-DD"),
    fileName: "",
    attachment: "",
  };

  const [formData, setFormData] = useState<any>(initialFormState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize as empty arrays to prevent .map errors
  const [products, setProducts] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);

  // --- 1. Load Dropdown Data ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, accRes] = await Promise.all([
          getExpenseCategories(), // Returns Axios Response object
          getExpenseAccounts(), // Returns Array (Service handles extraction)
        ]);

        // --- Fix: Robust Extraction for Categories ---
        let categoryList: any[] = [];
        if (prodRes?.data && Array.isArray(prodRes.data.data)) {
          // Case: { data: { data: [...] } }
          categoryList = prodRes.data.data;
        } else if (prodRes?.data && Array.isArray(prodRes.data)) {
          // Case: { data: [...] }
          categoryList = prodRes.data;
        } else if (Array.isArray(prodRes)) {
          // Case: [...]
          categoryList = prodRes;
        }

        setProducts(categoryList);

        // Accounts service usually extracts data, but safety check doesn't hurt
        setAccounts(Array.isArray(accRes) ? accRes : []);
      } catch (err) {
        console.error("Dropdown Load Error:", err);
        toast.error("Failed to load dropdown data");
      }
    };
    loadData();
  }, []);

  // --- 2. Set data if editing ---
  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        // Ensure Dropdown IDs are numbers or strings matching the options
        product_id: data.product_id ? data.product_id : "",
        account_id: data.account_id ? data.account_id : "",
        date: data.date
          ? moment(data.date).format("YYYY-MM-DD")
          : moment().format("YYYY-MM-DD"),
      });
    } else {
      setFormData(initialFormState);
    }
  }, [data]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      try {
        const base64 = await fileToBase64(file);
        // Ensure we send pure base64 without the data: prefix if required by API
        const cleanBase64 = base64.includes("base64,")
          ? base64.split("base64,")[1]
          : base64;

        setFormData((prev: any) => ({
          ...prev,
          attachment: cleanBase64,
          fileName: file.name,
        }));
      } catch (err) {
        toast.error("Error processing file");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Ensure numeric values are numbers
      const payload = {
        ...formData,
        product_id: Number(formData.product_id),
        account_id: Number(formData.account_id),
        total_amount_currency: Number(formData.total_amount_currency),
      };

      await createExpense(payload);
      toast.success("Expense created successfully");
      onSuccess();

      // Close modal
      const modalElement = document.getElementById("add_expense_modal");
      if (modalElement) {
        // @ts-ignore
        const modal = window.bootstrap?.Modal?.getInstance(modalElement);
        modal?.hide();
        // Fallback close
        document.getElementById("close-btn-expense")?.click();
      }
    } catch (error) {
      toast.error("Failed to save expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="add_expense_modal"
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {data ? "Edit Expense" : "Create New Expense"}
            </h5>
            <button
              type="button"
              id="close-btn-expense"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                {/* Description */}
                <div className="col-md-12 mb-3">
                  <label className="form-label">Description / Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    placeholder="e.g. Travel to HQ"
                  />
                </div>

                {/* Expense Account Dropdown */}
                <div className="col-md-12 mb-3">
                  <label className="form-label">Expense Account</label>
                  <select
                    className="form-select"
                    value={formData.account_id}
                    onChange={(e) =>
                      setFormData({ ...formData, account_id: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Account</option>
                    {accounts.map((acc: any) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category / Product Dropdown */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.product_id}
                    onChange={(e) =>
                      setFormData({ ...formData, product_id: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Category</option>
                    {products.map((p: any) => (
                      // Handle Odoo-style IDs (sometimes they are arrays [id, name]) or simple objects
                      <option key={p.id} value={p.id}>
                        {p.name || p.display_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.total_amount_currency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        total_amount_currency: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Date */}
                <div className="col-md-6 mb-3">
                  <label className="form-label d-block">Date</label>
                  <DatePicker
                    className="w-100"
                    value={formData.date ? moment(formData.date) : null}
                    onChange={(date) =>
                      setFormData({
                        ...formData,
                        date: date?.format("YYYY-MM-DD"),
                      })
                    }
                    allowClear={false}
                  />
                </div>

                {/* Payment Mode */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Payment Mode</label>
                  <select
                    className="form-select"
                    value={formData.payment_mode}
                    onChange={(e) =>
                      setFormData({ ...formData, payment_mode: e.target.value })
                    }
                  >
                    <option value="own_account">Employee (to reimburse)</option>
                    <option value="company_account">Company</option>
                  </select>
                </div>

                {/* Attachment */}
                <div className="col-md-12 mb-3">
                  <label className="form-label">Receipt Attachment</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                  />
                  {formData.fileName && (
                    <small className="text-success mt-1 d-block">
                      <i className="ti ti-check me-1" /> Selected:{" "}
                      {formData.fileName}
                    </small>
                  )}
                </div>
              </div>
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
                {isSubmitting ? "Saving..." : "Save Expense"}
              </button>
            </div>
          </form>
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
