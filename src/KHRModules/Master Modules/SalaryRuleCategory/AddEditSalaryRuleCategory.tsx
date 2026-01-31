import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  addSalaryRuleCategory,
  updateSalaryRuleCategory,
  getSalaryRuleCategoriesForDropdown,
  SalaryRuleCategory,
} from "./SalaryRuleCategory";

interface Props {
  onSuccess: () => void;
  data: SalaryRuleCategory | null;
}

interface CategoryOption {
  label: string;
  value: string | number;
}

const AddEditSalaryRuleCategory: React.FC<Props> = ({ onSuccess, data }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [parentCategories, setParentCategories] = useState<CategoryOption[]>([]);
  const [loadingParents, setLoadingParents] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: "",
    parent_id: null,
    note: "",
  });

  // 1. BOOTSTRAP EVENT LISTENER - Ensures form clears on close
  useEffect(() => {
    const modalElement = document.getElementById("add_salary_rule_cat_modal");

    const handleModalHidden = () => {
      resetForm();
    };

    modalElement?.addEventListener("hidden.bs.modal", handleModalHidden);

    return () => {
      modalElement?.removeEventListener("hidden.bs.modal", handleModalHidden);
    };
  }, []);

  // 2. Load parent categories for dropdown
  useEffect(() => {
    fetchParentCategories();
  }, []);

  // 3. Populate form on Edit
  useEffect(() => {
    if (data) {
      // Strip HTML tags from note when editing
      const stripHtmlTags = (html: string): string => {
        if (!html) return "";
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || "";
      };

      setFormData({
        name: data.name || "",
        parent_id: data.parent_id || null,
        note: stripHtmlTags(data.note || ""),
      });
    } else {
      resetForm();
    }
  }, [data]);

  const fetchParentCategories = async () => {
    setLoadingParents(true);
    try {
      const categories = await getSalaryRuleCategoriesForDropdown();
      setParentCategories(categories);
    } catch (error) {
      console.error("Error fetching parent categories:", error);
      toast.error("Failed to load parent categories");
    } finally {
      setLoadingParents(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: "", 
      parent_id: null, 
      note: "" 
    });
    setErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let processedValue: any = value;
    if (name === "parent_id") {
      processedValue = value === "" ? null : Number(value);
    }
    
    setFormData({ ...formData, [name]: processedValue });

    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const validate = () => {
    let tempErrors: any = {};
    
    if (!formData.name?.trim()) {
      tempErrors.name = "Category name is required";
    } else if (formData.name.trim().length < 2) {
      tempErrors.name = "Category name must be at least 2 characters";
    }

    if (formData.note && formData.note.length > 500) {
      tempErrors.note = "Note cannot exceed 500 characters";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      let response;

      const payload = {
        name: formData.name.trim(),
        parent_id: formData.parent_id,
        note: formData.note?.trim() || "",
      };

      if (data?.id) {
        response = await updateSalaryRuleCategory(data.id, payload);
      } else {
        response = await addSalaryRuleCategory(payload);
      }

      const apiMessage = response.data?.message || "Operation successful";
      toast.success(apiMessage);

      onSuccess();
      document.getElementById("close-btn-salary-rule-cat")?.click();
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Error saving category";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter out current category from parent options (prevent self-reference)
  const filteredParentCategories = parentCategories.filter(
    cat => data?.id ? String(cat.value) !== String(data.id) : true
  );

  return (
    <div className="modal fade" id="add_salary_rule_cat_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-bottom bg-light py-3">
            <h5 className="modal-title fw-bold text-dark fs-16">
              <i className="ti ti-category me-2 text-primary"></i>
              {data ? "Edit Salary Rule Category" : "Add Salary Rule Category"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-btn-salary-rule-cat"
            ></button>
          </div>

          <div className="modal-body p-4">
            <form onSubmit={handleSubmit} noValidate>
              {/* Category Name */}
              <div className="mb-3">
                <label className="form-label fs-13 fw-bold">
                  Category Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={`form-control ${
                    isSubmitted && errors.name
                      ? "is-invalid"
                      : formData.name
                        ? "is-valid"
                        : ""
                  }`}
                  placeholder="e.g. Basic Salary, Allowances, Deductions"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {isSubmitted && errors.name && (
                  <div className="invalid-feedback fs-11">{errors.name}</div>
                )}
              </div>

              {/* Parent Category */}
              <div className="mb-3">
                <label className="form-label fs-13 fw-bold">
                  Parent Category <span className="text-muted">(Optional)</span>
                </label>
                <select
                  name="parent_id"
                  className="form-select"
                  value={formData.parent_id || ""}
                  onChange={handleInputChange}
                  disabled={loadingParents}
                >
                  <option value="">Select Parent Category</option>
                  {filteredParentCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {loadingParents && (
                  <small className="text-muted">Loading categories...</small>
                )}
              </div>

              {/* Note */}
              <div className="mb-3">
                <label className="form-label fs-13 fw-bold">
                  Note <span className="text-muted">(Optional)</span>
                </label>
                <textarea
                  name="note"
                  className={`form-control ${
                    isSubmitted && errors.note ? "is-invalid" : ""
                  }`}
                  rows={3}
                  placeholder="Add a description or note about this category..."
                  value={formData.note}
                  onChange={handleInputChange}
                  maxLength={500}
                />
                <div className="d-flex justify-content-between">
                  {isSubmitted && errors.note && (
                    <div className="invalid-feedback fs-11 d-block">{errors.note}</div>
                  )}
                  <small className="text-muted ms-auto">
                    {formData.note?.length || 0}/500 characters
                  </small>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="modal-footer border-0 px-0 mt-4 pb-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 me-2"
                  data-bs-dismiss="modal"
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
                  ) : data ? (
                    "Update Category"
                  ) : (
                    "Save Category"
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

export default AddEditSalaryRuleCategory;
