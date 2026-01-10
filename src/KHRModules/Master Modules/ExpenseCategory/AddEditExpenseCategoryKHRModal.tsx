import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CommonSelect from "../../../core/common/commonSelect";
import { Radio } from "antd";
import {
  createExpenseCategory,
  updateExpenseCategory,
  getCategoriesDropdown,
  getAccountsDropdown,
  getSalesTaxesDropdown,
  getPurchaseTaxesDropdown,
} from "./ExpenseCategoryKHRService";

interface Props {
  onSuccess: () => void;
  data: any | null;
}

// Initial state matching your JSON
const initialFormState = {
  name: "",
  cost: 0,
  reference: "",
  category_name: "",
  description: "",
  expense_account_name: "",
  sales_tax_names: [] as string[],
  purchase_tax_names: [] as string[],
  re_invoice_policy: "no",
};

const AddEditExpenseCategoryKHRModal: React.FC<Props> = ({
  onSuccess,
  data,
}) => {
  const [formData, setFormData] = useState<any>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Dropdown Options State
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
  const [accountOptions, setAccountOptions] = useState<any[]>([]);
  const [salesTaxOptions, setSalesTaxOptions] = useState<any[]>([]);
  const [purchaseTaxOptions, setPurchaseTaxOptions] = useState<any[]>([]);

  // --- 1. Fetch Dropdowns ---
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [cats, accs, sTaxes, pTaxes] = await Promise.all([
          getCategoriesDropdown(),
          getAccountsDropdown(),
          getSalesTaxesDropdown(),
          getPurchaseTaxesDropdown(),
        ]);

        const mapToOption = (items: any[]) =>
          Array.isArray(items)
            ? items.map((i: any) => ({ value: i.name, label: i.name }))
            : [];

        setCategoryOptions(mapToOption(cats));
        setAccountOptions(mapToOption(accs));
        setSalesTaxOptions(mapToOption(sTaxes));
        setPurchaseTaxOptions(mapToOption(pTaxes));
      } catch (error) {
        console.error("Error loading dropdowns", error);
      }
    };
    loadOptions();
  }, []);

  // --- 2. Populate Data (Edit Mode) or Reset (Add Mode) ---
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        cost: data.cost || 0,
        reference: data.reference || "",
        category_name: data.category_name || "",
        description: data.description || "",
        expense_account_name: data.expense_account_name || "",
        sales_tax_names: Array.isArray(data.sales_tax_names)
          ? data.sales_tax_names
          : [],
        purchase_tax_names: Array.isArray(data.purchase_tax_names)
          ? data.purchase_tax_names
          : [],
        re_invoice_policy: data.re_invoice_policy || "no",
      });
    } else {
      resetForm();
    }
  }, [data]);

  // --- 3. Modal Clear Logic (Backdrop/Esc/Close) ---
  useEffect(() => {
    const modalElement = document.getElementById("add_expense_category");
    const handleHidden = () => {
      resetForm();
    };

    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", handleHidden);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("hidden.bs.modal", handleHidden);
      }
    };
  }, []);

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsSubmitted(false);
  };

  // --- 4. Helpers ---
  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }));
    }
  };

  const getInputClass = (field: string) => {
    if (errors[field]) return "form-control is-invalid";
    if (isSubmitted && formData[field] && !errors[field])
      return "form-control is-valid";
    return "form-control";
  };

  // --- 5. Handlers ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    clearError(name);
  };

  const handleSelectChange = (key: string, option: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: option?.value || "" }));
  };

  const handleTaxChange = (key: string, selectedOption: any) => {
    const value = selectedOption?.value;
    setFormData((prev: any) => ({
      ...prev,
      [key]: value ? [value] : [],
    }));
  };

  const validate = () => {
    let tempErrors: any = {};
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = "Product Name is required";
      isValid = false;
    }
    if (Number(formData.cost) < 0) {
      tempErrors.cost = "Cost cannot be negative";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validate()) {
      toast.error("Please fill in the required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { ...formData, cost: Number(formData.cost) };

      if (data?.id) {
        await updateExpenseCategory(data.id, payload);
        toast.success("Expense category updated successfully");
      } else {
        await createExpenseCategory(payload);
        toast.success("Expense category created successfully");
      }

      // Close modal programmatically
      const modalElement = document.getElementById("add_expense_category");
      const closeBtn = modalElement?.querySelector(
        '[data-bs-dismiss="modal"]'
      ) as HTMLElement;
      if (closeBtn) closeBtn.click();

      onSuccess();
      // resetForm(); // Handled by hidden.bs.modal listener
    } catch (error: any) {
      console.error("Save error", error);
      toast.error(error.response?.data?.message || "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>
        {`
          /* Fix for Dropdowns being clipped inside modal */
          #add_expense_category .modal-content,
          #add_expense_category .modal-body {
            overflow: visible !important;
          }
          #add_expense_category { z-index: 1055 !important; }
          .react-select__menu { z-index: 9999 !important; }
          .is-invalid + .invalid-feedback { display: block; }
        `}
      </style>

      <div
        className="modal fade"
        id="add_expense_category"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content bg-white border-0 shadow-lg">
            {/* --- HEADER --- */}
            <div className="modal-header border-bottom bg-light py-2">
              <h5 className="modal-title fw-bold fs-15">
                <i className="ti ti-file-invoice me-2 text-primary"></i>
                {data ? "Edit Expense Product" : "Expense Product Entry"}
              </h5>
              <button
                type="button"
                id="close-expense-category-modal"
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
                {/* --- TOP SECTION: Primary Info --- */}
                <div className="row g-3 mb-4 bg-light p-3 rounded mx-0 border shadow-sm align-items-center">
                  <div className="col-md-12">
                    <label className="form-label fs-13 fw-bold">
                      Product Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      className={getInputClass("name")}
                      placeholder="e.g. Office Internet Expense"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">{errors.name}</div>
                  </div>
                </div>

                {/* --- SECTION 1: General Information --- */}
                <div className="form-section mb-4 animate__animated animate__fadeIn">
                  <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                    <i className="ti ti-clipboard-list fs-18 me-2"></i> General
                    Information
                  </h6>
                  <div className="row g-3">
                    {/* Category */}
                    <div className="col-md-6">
                      <label className="form-label fs-13">Category</label>
                      <CommonSelect
                        options={categoryOptions}
                        placeholder="Select Category"
                        defaultValue={categoryOptions.find(
                          (o) => o.value === formData.category_name
                        )}
                        onChange={(opt) =>
                          handleSelectChange("category_name", opt)
                        }
                      />
                    </div>

                    {/* Reference */}
                    <div className="col-md-6">
                      <label className="form-label fs-13">Reference</label>
                      <input
                        type="text"
                        name="reference"
                        className="form-control"
                        placeholder="e.g. EXP-001"
                        value={formData.reference}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Cost */}
                    <div className="col-md-4">
                      <label className="form-label fs-13">Default Cost</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light fs-12">
                          ₹
                        </span>
                        <input
                          type="number"
                          name="cost"
                          className={getInputClass("cost")}
                          placeholder="0.00"
                          value={formData.cost}
                          onChange={handleChange}
                        />
                        <div className="invalid-feedback">{errors.cost}</div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="col-md-8">
                      <label className="form-label fs-13">Internal Notes</label>
                      <input
                        type="text"
                        name="description"
                        className="form-control"
                        placeholder="Guidelines for employees..."
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <hr className="my-4 opacity-25" />

                {/* --- SECTION 2: Accounting & Taxes --- */}
                <div className="form-section mb-4 animate__animated animate__fadeIn">
                  <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                    <i className="ti ti-building-bank fs-18 me-2"></i>{" "}
                    Accounting & Taxes
                  </h6>
                  <div className="row g-3">
                    {/* Expense Account */}
                    <div className="col-md-12">
                      <label className="form-label fs-13">
                        Expense Account
                      </label>
                      <CommonSelect
                        options={accountOptions}
                        placeholder="Select GL Account"
                        defaultValue={accountOptions.find(
                          (o) => o.value === formData.expense_account_name
                        )}
                        onChange={(opt) =>
                          handleSelectChange("expense_account_name", opt)
                        }
                      />
                    </div>

                    {/* Purchase Taxes */}
                    <div className="col-md-6">
                      <label className="form-label fs-13">Purchase Taxes</label>
                      <div style={{ position: "relative", zIndex: 100 }}>
                        <CommonSelect
                          options={purchaseTaxOptions}
                          placeholder="Select Tax"
                          defaultValue={purchaseTaxOptions.find((o) =>
                            formData.purchase_tax_names.includes(o.value)
                          )}
                          onChange={(opt) =>
                            handleTaxChange("purchase_tax_names", opt)
                          }
                        />
                      </div>
                      <div className="mt-2">
                        {formData.purchase_tax_names.map(
                          (t: string, i: number) => (
                            <span
                              key={i}
                              className="badge bg-light text-dark border me-1"
                            >
                              {t}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    {/* Sales Taxes */}
                    <div className="col-md-6">
                      <label className="form-label fs-13">Sales Taxes</label>
                      <div style={{ position: "relative", zIndex: 100 }}>
                        <CommonSelect
                          options={salesTaxOptions}
                          placeholder="Select Tax"
                          defaultValue={salesTaxOptions.find((o) =>
                            formData.sales_tax_names.includes(o.value)
                          )}
                          onChange={(opt) =>
                            handleTaxChange("sales_tax_names", opt)
                          }
                        />
                      </div>
                      <div className="mt-2">
                        {formData.sales_tax_names.map(
                          (t: string, i: number) => (
                            <span
                              key={i}
                              className="badge bg-light text-dark border me-1"
                            >
                              {t}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="my-4 opacity-25" />

                {/* --- SECTION 3: Invoicing Policy --- */}
                <div className="form-section animate__animated animate__fadeIn">
                  <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                    <i className="ti ti-file-invoice fs-18 me-2"></i> Invoicing
                    Policy
                  </h6>
                  <div className="row g-3">
                    <div className="col-md-12">
                      <div className="p-3 border rounded bg-light-subtle">
                        <label className="form-label fs-13 fw-bold mb-3">
                          Re-Invoice Expenses to Customer?
                        </label>
                        <Radio.Group
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              re_invoice_policy: e.target.value,
                            })
                          }
                          value={formData.re_invoice_policy}
                          className="d-flex flex-row gap-4"
                        >
                          <Radio value="no">No</Radio>
                          <Radio value="cost">At Cost</Radio>
                          <Radio value="sales_price">At Sales Price</Radio>
                        </Radio.Group>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- FOOTER --- */}
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
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="ti ti-device-floppy me-1"></i>
                        Save Product
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

export default AddEditExpenseCategoryKHRModal;

// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import CommonSelect from "../../../core/common/commonSelect";
// import { Radio } from "antd";
// import {
//   createExpenseCategory,
//   updateExpenseCategory,
//   getCategoriesDropdown,
//   getAccountsDropdown,
//   getSalesTaxesDropdown, // New import
//   getPurchaseTaxesDropdown, // New import
// } from "./ExpenseCategoryKHRService";

// interface Props {
//   onSuccess: () => void;
//   data: any | null;
// }

// // Initial state matching your JSON
// const initialFormState = {
//   name: "",
//   cost: 0,
//   reference: "",
//   category_name: "",
//   description: "",
//   expense_account_name: "",
//   sales_tax_names: [] as string[],
//   purchase_tax_names: [] as string[],
//   re_invoice_policy: "no",
// };

// const AddEditExpenseCategoryKHRModal: React.FC<Props> = ({
//   onSuccess,
//   data,
// }) => {
//   const [formData, setFormData] = useState<any>(initialFormState);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState<any>({});
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   // Dropdown Options State
//   const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
//   const [accountOptions, setAccountOptions] = useState<any[]>([]);
//   const [salesTaxOptions, setSalesTaxOptions] = useState<any[]>([]); // Separate state
//   const [purchaseTaxOptions, setPurchaseTaxOptions] = useState<any[]>([]); // Separate state

//   // --- 1. Fetch Dropdowns ---
//   useEffect(() => {
//     const loadOptions = async () => {
//       try {
//         const [cats, accs, sTaxes, pTaxes] = await Promise.all([
//           getCategoriesDropdown(),
//           getAccountsDropdown(),
//           getSalesTaxesDropdown(),
//           getPurchaseTaxesDropdown(),
//         ]);

//         // Helper to map API data to Select options
//         const mapToOption = (items: any[]) =>
//           Array.isArray(items)
//             ? items.map((i: any) => ({ value: i.name, label: i.name }))
//             : [];

//         setCategoryOptions(mapToOption(cats));
//         setAccountOptions(mapToOption(accs));
//         setSalesTaxOptions(mapToOption(sTaxes));
//         setPurchaseTaxOptions(mapToOption(pTaxes));
//       } catch (error) {
//         console.error("Error loading dropdowns", error);
//       }
//     };
//     loadOptions();
//   }, []);

//   // --- 2. Populate Data (Edit Mode) ---
//   useEffect(() => {
//     if (data) {
//       setFormData({
//         name: data.name || "",
//         cost: data.cost || 0,
//         reference: data.reference || "",
//         category_name: data.category_name || "",
//         description: data.description || "",
//         expense_account_name: data.expense_account_name || "",
//         sales_tax_names: Array.isArray(data.sales_tax_names)
//           ? data.sales_tax_names
//           : [],
//         purchase_tax_names: Array.isArray(data.purchase_tax_names)
//           ? data.purchase_tax_names
//           : [],
//         re_invoice_policy: data.re_invoice_policy || "no",
//       });
//     } else {
//       setFormData(initialFormState);
//     }
//     setErrors({});
//     setIsSubmitted(false);
//   }, [data]);

//   // --- 3. Handlers ---
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev: any) => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors((prev: any) => ({ ...prev, [name]: "" }));
//   };

//   const handleSelectChange = (key: string, option: any) => {
//     setFormData((prev: any) => ({ ...prev, [key]: option?.value || "" }));
//   };

//   const handleTaxChange = (key: string, selectedOption: any) => {
//     // Handling single select as push to array for API structure compliance
//     const value = selectedOption?.value;
//     setFormData((prev: any) => ({
//       ...prev,
//       [key]: value ? [value] : [],
//     }));
//   };

//   const validate = () => {
//     const err: any = {};
//     if (!formData.name.trim()) err.name = "Product Name is required";
//     if (Number(formData.cost) < 0) err.cost = "Cost cannot be negative";

//     setErrors(err);
//     return Object.keys(err).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitted(true);

//     if (!validate()) {
//       toast.error("Please fill in the required fields.");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const payload = { ...formData, cost: Number(formData.cost) };

//       if (data?.id) {
//         await updateExpenseCategory(data.id, payload);
//         toast.success("Expense category updated successfully");
//       } else {
//         await createExpenseCategory(payload);
//         toast.success("Expense category created successfully");
//       }

//       onSuccess();
//       document.getElementById("close-expense-category-modal")?.click();
//     } catch (error: any) {
//       console.error("Save error", error);
//       toast.error(error.response?.data?.message || "Failed to save category");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="modal fade" id="add_expense_category" role="dialog">
//       <div className="modal-dialog modal-dialog-centered modal-lg">
//         <div className="modal-content bg-white border-0">
//           {/* --- HEADER --- */}
//           <div className="modal-header border-0 bg-white pb-0">
//             <h4 className="modal-title fw-bold">
//               {data ? "Edit Expense Product" : "Expense Product Entry"}
//             </h4>
//             <button
//               type="button"
//               id="close-expense-category-modal"
//               className="btn-close"
//               data-bs-dismiss="modal"
//             ></button>
//           </div>

//           <div className="modal-body">
//             <form
//               className={`needs-validation ${
//                 isSubmitted ? "was-validated" : ""
//               }`}
//               noValidate
//               onSubmit={handleSubmit}
//             >
//               {/* --- TOP SECTION: Primary Info --- */}
//               <div className="row g-3 mb-4 bg-light p-3 rounded mx-0 border shadow-sm align-items-center">
//                 <div className="col-md-12">
//                   <label className="form-label fs-13 fw-bold">
//                     Product Name <span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     className={`form-control ${
//                       isSubmitted
//                         ? errors.name
//                           ? "is-invalid"
//                           : "is-valid"
//                         : ""
//                     }`}
//                     placeholder="e.g. Office Internet Expense"
//                     value={formData.name}
//                     onChange={handleChange}
//                   />
//                   {isSubmitted && errors.name && (
//                     <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
//                       <i className="ti ti-info-circle me-1"></i>
//                       {errors.name}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* --- SECTION 1: General Information --- */}
//               <div className="form-section mb-4 animate__animated animate__fadeIn">
//                 <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
//                   <i className="ti ti-clipboard-list fs-18 me-2"></i> General
//                   Information
//                 </h6>
//                 <div className="row g-3">
//                   {/* Category */}
//                   <div className="col-md-6">
//                     <label className="form-label fs-13">Category</label>
//                     <CommonSelect
//                       options={categoryOptions}
//                       placeholder="Select Category"
//                       defaultValue={categoryOptions.find(
//                         (o) => o.value === formData.category_name
//                       )}
//                       onChange={(opt) =>
//                         handleSelectChange("category_name", opt)
//                       }
//                     />
//                   </div>

//                   {/* Reference */}
//                   <div className="col-md-6">
//                     <label className="form-label fs-13">Reference</label>
//                     <input
//                       type="text"
//                       name="reference"
//                       className="form-control"
//                       placeholder="e.g. EXP-001"
//                       value={formData.reference}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   {/* Cost */}
//                   <div className="col-md-4">
//                     <label className="form-label fs-13">Default Cost</label>
//                     <div className="input-group">
//                       <span className="input-group-text bg-light fs-12">₹</span>
//                       <input
//                         type="number"
//                         name="cost"
//                         className={`form-control ${
//                           isSubmitted && errors.cost ? "is-invalid" : ""
//                         }`}
//                         placeholder="0.00"
//                         value={formData.cost}
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>

//                   {/* Description */}
//                   <div className="col-md-8">
//                     <label className="form-label fs-13">Internal Notes</label>
//                     <input
//                       type="text"
//                       name="description"
//                       className="form-control"
//                       placeholder="Guidelines for employees..."
//                       value={formData.description}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <hr className="my-4 opacity-25" />

//               {/* --- SECTION 2: Accounting & Taxes --- */}
//               <div className="form-section mb-4 animate__animated animate__fadeIn">
//                 <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
//                   <i className="ti ti-building-bank fs-18 me-2"></i> Accounting
//                   & Taxes
//                 </h6>
//                 <div className="row g-3">
//                   {/* Expense Account */}
//                   <div className="col-md-12">
//                     <label className="form-label fs-13">Expense Account</label>
//                     <CommonSelect
//                       options={accountOptions}
//                       placeholder="Select GL Account"
//                       defaultValue={accountOptions.find(
//                         (o) => o.value === formData.expense_account_name
//                       )}
//                       onChange={(opt) =>
//                         handleSelectChange("expense_account_name", opt)
//                       }
//                     />
//                   </div>

//                   {/* Purchase Taxes - Uses purchaseTaxOptions */}
//                   <div className="col-md-6">
//                     <label className="form-label fs-13">Purchase Taxes</label>
//                     <CommonSelect
//                       options={purchaseTaxOptions}
//                       placeholder="Select Tax"
//                       defaultValue={purchaseTaxOptions.find((o) =>
//                         formData.purchase_tax_names.includes(o.value)
//                       )}
//                       onChange={(opt) =>
//                         handleTaxChange("purchase_tax_names", opt)
//                       }
//                     />
//                     <div className="mt-2">
//                       {formData.purchase_tax_names.map(
//                         (t: string, i: number) => (
//                           <span
//                             key={i}
//                             className="badge bg-light text-dark border me-1"
//                           >
//                             {t}
//                           </span>
//                         )
//                       )}
//                     </div>
//                   </div>

//                   {/* Sales Taxes - Uses salesTaxOptions */}
//                   <div className="col-md-6">
//                     <label className="form-label fs-13">Sales Taxes</label>
//                     <CommonSelect
//                       options={salesTaxOptions}
//                       placeholder="Select Tax"
//                       defaultValue={salesTaxOptions.find((o) =>
//                         formData.sales_tax_names.includes(o.value)
//                       )}
//                       onChange={(opt) =>
//                         handleTaxChange("sales_tax_names", opt)
//                       }
//                     />
//                     <div className="mt-2">
//                       {formData.sales_tax_names.map((t: string, i: number) => (
//                         <span
//                           key={i}
//                           className="badge bg-light text-dark border me-1"
//                         >
//                           {t}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <hr className="my-4 opacity-25" />

//               {/* --- SECTION 3: Invoicing Policy --- */}
//               <div className="form-section animate__animated animate__fadeIn">
//                 <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
//                   <i className="ti ti-file-invoice fs-18 me-2"></i> Invoicing
//                   Policy
//                 </h6>
//                 <div className="row g-3">
//                   <div className="col-md-12">
//                     <div className="p-3 border rounded bg-light-subtle">
//                       <label className="form-label fs-13 fw-bold mb-3">
//                         Re-Invoice Expenses to Customer?
//                       </label>
//                       <Radio.Group
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             re_invoice_policy: e.target.value,
//                           })
//                         }
//                         value={formData.re_invoice_policy}
//                         className="d-flex flex-row gap-4"
//                       >
//                         <Radio value="no">No</Radio>
//                         <Radio value="cost">At Cost</Radio>
//                         <Radio value="sales_price">At Sales Price</Radio>
//                       </Radio.Group>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* --- FOOTER --- */}
//               <div className="modal-footer border-0 bg-white px-0 mt-4">
//                 <button
//                   type="button"
//                   className="btn btn-light"
//                   data-bs-dismiss="modal"
//                   onClick={() => {
//                     setFormData(initialFormState);
//                     setIsSubmitted(false);
//                     setErrors({});
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn btn-primary px-5"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? "Processing..." : "Save Product"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddEditExpenseCategoryKHRModal;
