import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CommonSelect from "../../../core/common/commonSelect";
import { Radio } from "antd";
import {
  createExpenseCategory,
  updateExpenseCategory,
  getCategoriesDropdown,
  getAccountsDropdown,
  getTaxesDropdown,
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
  category_name: "", // Stores the name or ID depending on your backend requirement
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

  // Dropdown Options
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
  const [accountOptions, setAccountOptions] = useState<any[]>([]);
  const [taxOptions, setTaxOptions] = useState<any[]>([]);

  // --- 1. Fetch Dropdowns ---
  useEffect(() => {
    const loadOptions = async () => {
      const cats = await getCategoriesDropdown();
      const accs = await getAccountsDropdown();
      const taxes = await getTaxesDropdown();

      // Mapping to value/label for CommonSelect
      setCategoryOptions(
        cats.map((c: any) => ({ value: c.name, label: c.name }))
      );
      setAccountOptions(
        accs.map((a: any) => ({ value: a.name, label: a.name }))
      );
      setTaxOptions(taxes.map((t: any) => ({ value: t.name, label: t.name })));
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
        // Ensure arrays are initialized
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
    // Stores the selected Name directly as per your JSON structure request
    setFormData((prev: any) => ({ ...prev, [key]: option?.value || "" }));
  };

  // Helper for Multi-Select Taxes
  const handleTaxChange = (key: string, selectedOptions: any) => {
    // If CommonSelect returns array of objects for multi, map to string array
    const values = selectedOptions ? selectedOptions.value : "";
    // Simple handling for single select simulating array,
    // Use a MultiSelect component if you need multiple tags.
    // Here we assume single select adding to array for structure compliance.
    setFormData((prev: any) => ({ ...prev, [key]: values ? [values] : [] }));
  };

  const validate = () => {
    const err: any = {};
    if (!formData.name.trim()) err.name = "Product Name is required";
    if (formData.cost < 0) err.cost = "Cost cannot be negative";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = { ...formData, cost: Number(formData.cost) };

      if (data?.id) {
        await updateExpenseCategory(data.id, payload);
        toast.success("Updated successfully");
      } else {
        await createExpenseCategory(payload);
        toast.success("Created successfully");
      }

      onSuccess();
      document.getElementById("close-expense-category-modal")?.click();
    } catch (error: any) {
      console.error("Save error", error);
      toast.error("Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal fade" id="add_expense_category" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">
              {data ? "Edit Expense Product" : "Create Expense Product"}
            </h5>
            <button
              type="button"
              id="close-expense-category-modal"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div className="modal-body pt-3">
            <form onSubmit={handleSubmit}>
              {/* --- HEADER: Product Name --- */}
              <div className="mb-4">
                <label className="form-label fs-13 text-danger fw-bold">
                  Product Name ?
                </label>
                <input
                  type="text"
                  name="name"
                  className={`form-control form-control-lg fs-3 px-2 ${
                    errors.name ? "is-invalid" : ""
                  }`}
                  placeholder="e.g. Office Internet Expense"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    backgroundColor: "#fff0f0",
                    borderLeft: "4px solid #dc3545",
                  }}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name}</small>
                )}
              </div>

              {/* --- 2-COLUMN GRID --- */}
              <div className="row g-4">
                {/* LEFT COLUMN */}
                <div className="col-md-6">
                  {/* Cost */}
                  <div className="row mb-3 align-items-center">
                    <label className="col-sm-4 col-form-label fw-bold text-dark fs-13">
                      Cost
                    </label>
                    <div className="col-sm-8">
                      <div className="input-group input-group-sm">
                        <span className="input-group-text bg-light border-end-0">
                          ₹
                        </span>
                        <input
                          type="number"
                          name="cost"
                          className="form-control border-start-0 ps-1"
                          value={formData.cost}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reference */}
                  <div className="row mb-3 align-items-center">
                    <label className="col-sm-4 col-form-label fw-bold text-dark fs-13">
                      Reference
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        name="reference"
                        className="form-control form-control-sm"
                        value={formData.reference}
                        onChange={handleChange}
                        placeholder="e.g. EXP-INT-001"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="row mb-3 align-items-center">
                    <label className="col-sm-4 col-form-label fw-bold text-dark fs-13">
                      Category
                    </label>
                    <div className="col-sm-8">
                      <CommonSelect
                        options={categoryOptions}
                        placeholder="All"
                        defaultValue={categoryOptions.find(
                          (o) => o.value === formData.category_name
                        )}
                        onChange={(opt) =>
                          handleSelectChange("category_name", opt)
                        }
                        className="form-control-sm p-0 border-0"
                      />
                    </div>
                  </div>

                  {/* Guideline (Description) */}
                  <div className="row mb-3">
                    <label className="col-sm-4 col-form-label fw-bold text-dark fs-13">
                      Guideline
                    </label>
                    <div className="col-sm-8">
                      <textarea
                        name="description"
                        rows={2}
                        className="form-control form-control-sm text-muted"
                        placeholder="Internal notes..."
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="col-md-6">
                  {/* Expense Account */}
                  <div className="row mb-3 align-items-center">
                    <label className="col-sm-5 col-form-label fw-bold text-dark fs-13">
                      Expense Account
                    </label>
                    <div className="col-sm-7">
                      <CommonSelect
                        options={accountOptions}
                        placeholder="Select Account"
                        defaultValue={accountOptions.find(
                          (o) => o.value === formData.expense_account_name
                        )}
                        onChange={(opt) =>
                          handleSelectChange("expense_account_name", opt)
                        }
                      />
                    </div>
                  </div>

                  {/* Purchase Taxes */}
                  <div className="row mb-3 align-items-center">
                    <label className="col-sm-5 col-form-label fw-bold text-dark fs-13">
                      Purchase Taxes
                    </label>
                    <div className="col-sm-7">
                      {/* Using CommonSelect to pick tax name */}
                      <CommonSelect
                        options={taxOptions}
                        placeholder="Select Tax"
                        defaultValue={taxOptions.find((o) =>
                          formData.purchase_tax_names.includes(o.value)
                        )}
                        onChange={(opt) =>
                          handleTaxChange("purchase_tax_names", opt)
                        }
                      />
                      {/* Display selected tags */}
                      <div className="mt-1">
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
                  </div>

                  {/* Sales Taxes */}
                  <div className="row mb-3 align-items-center">
                    <label className="col-sm-5 col-form-label fw-bold text-dark fs-13">
                      Sales Taxes
                    </label>
                    <div className="col-sm-7">
                      <CommonSelect
                        options={taxOptions}
                        placeholder="Select Tax"
                        defaultValue={taxOptions.find((o) =>
                          formData.sales_tax_names.includes(o.value)
                        )}
                        onChange={(opt) =>
                          handleTaxChange("sales_tax_names", opt)
                        }
                      />
                      <div className="mt-1">
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
              </div>

              <hr className="my-4 text-muted" />

              {/* --- INVOICING SECTION --- */}
              <div className="row">
                <div className="col-12 mb-3">
                  <h6 className="fw-bold text-uppercase fs-12 text-secondary">
                    Invoicing
                  </h6>
                </div>
                <div className="col-md-12">
                  <div className="row">
                    <label className="col-sm-3 col-form-label fw-bold text-dark fs-13">
                      Re-Invoice Costs
                    </label>
                    <div className="col-sm-9">
                      <Radio.Group
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            re_invoice_policy: e.target.value,
                          })
                        }
                        value={formData.re_invoice_policy}
                        className="d-flex flex-column gap-2"
                      >
                        <Radio value="no">No</Radio>
                        <Radio value="cost">At cost</Radio>
                        <Radio value="sales_price">Sales price</Radio>
                      </Radio.Group>
                      <div className="text-muted fst-italic mt-2 fs-12">
                        * Expenses will be added to the Sales Order at their
                        actual cost when posted.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- FOOTER --- */}
              <div className="modal-footer border-0 px-0 mt-4">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Product"}
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
