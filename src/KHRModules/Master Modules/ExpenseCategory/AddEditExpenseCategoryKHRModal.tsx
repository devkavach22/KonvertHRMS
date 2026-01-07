import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CommonSelect from "../../../core/common/commonSelect";
import { Radio } from "antd";
import {
  createExpenseCategory,
  updateExpenseCategory,
  getCategoriesDropdown,
  getAccountsDropdown,
  getSalesTaxesDropdown, // New import
  getPurchaseTaxesDropdown, // New import
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
  const [salesTaxOptions, setSalesTaxOptions] = useState<any[]>([]); // Separate state
  const [purchaseTaxOptions, setPurchaseTaxOptions] = useState<any[]>([]); // Separate state

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

        // Helper to map API data to Select options
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

  // --- 2. Populate Data (Edit Mode) ---
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
      setFormData(initialFormState);
    }
    setErrors({});
    setIsSubmitted(false);
  }, [data]);

  // --- 3. Handlers ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev: any) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (key: string, option: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: option?.value || "" }));
  };

  const handleTaxChange = (key: string, selectedOption: any) => {
    // Handling single select as push to array for API structure compliance
    const value = selectedOption?.value;
    setFormData((prev: any) => ({
      ...prev,
      [key]: value ? [value] : [],
    }));
  };

  const validate = () => {
    const err: any = {};
    if (!formData.name.trim()) err.name = "Product Name is required";
    if (Number(formData.cost) < 0) err.cost = "Cost cannot be negative";

    setErrors(err);
    return Object.keys(err).length === 0;
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

      onSuccess();
      document.getElementById("close-expense-category-modal")?.click();
    } catch (error: any) {
      console.error("Save error", error);
      toast.error(error.response?.data?.message || "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal fade" id="add_expense_category" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content bg-white border-0">
          {/* --- HEADER --- */}
          <div className="modal-header border-0 bg-white pb-0">
            <h4 className="modal-title fw-bold">
              {data ? "Edit Expense Product" : "Expense Product Entry"}
            </h4>
            <button
              type="button"
              id="close-expense-category-modal"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div className="modal-body">
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
                    className={`form-control ${
                      isSubmitted
                        ? errors.name
                          ? "is-invalid"
                          : "is-valid"
                        : ""
                    }`}
                    placeholder="e.g. Office Internet Expense"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {isSubmitted && errors.name && (
                    <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                      <i className="ti ti-info-circle me-1"></i>
                      {errors.name}
                    </div>
                  )}
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
                      <span className="input-group-text bg-light fs-12">₹</span>
                      <input
                        type="number"
                        name="cost"
                        className={`form-control ${
                          isSubmitted && errors.cost ? "is-invalid" : ""
                        }`}
                        placeholder="0.00"
                        value={formData.cost}
                        onChange={handleChange}
                      />
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
                  <i className="ti ti-building-bank fs-18 me-2"></i> Accounting
                  & Taxes
                </h6>
                <div className="row g-3">
                  {/* Expense Account */}
                  <div className="col-md-12">
                    <label className="form-label fs-13">Expense Account</label>
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

                  {/* Purchase Taxes - Uses purchaseTaxOptions */}
                  <div className="col-md-6">
                    <label className="form-label fs-13">Purchase Taxes</label>
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

                  {/* Sales Taxes - Uses salesTaxOptions */}
                  <div className="col-md-6">
                    <label className="form-label fs-13">Sales Taxes</label>
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
                    <div className="mt-2">
                      {formData.sales_tax_names.map((t: string, i: number) => (
                        <span
                          key={i}
                          className="badge bg-light text-dark border me-1"
                        >
                          {t}
                        </span>
                      ))}
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
              <div className="modal-footer border-0 bg-white px-0 mt-4">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    setFormData(initialFormState);
                    setIsSubmitted(false);
                    setErrors({});
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-5"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditExpenseCategoryKHRModal;
