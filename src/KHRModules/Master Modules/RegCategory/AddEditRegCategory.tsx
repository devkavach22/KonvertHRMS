import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  addRegCategory,
  updateRegCategory,
  RegCategory,
} from "./RegCategoryService";

interface Props {
  onSuccess: () => void;
  data: RegCategory | null;
}

const AddEditRegCategory: React.FC<Props> = ({ onSuccess, data }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const [formData, setFormData] = useState<any>({
    type: "",
  });

  // 1. BOOTSTRAP EVENT LISTENER - Ensures form clears on close
  useEffect(() => {
    const modalElement = document.getElementById("add_reg_cat_modal");

    const handleModalHidden = () => {
      resetForm();
    };

    modalElement?.addEventListener("hidden.bs.modal", handleModalHidden);

    return () => {
      modalElement?.removeEventListener("hidden.bs.modal", handleModalHidden);
    };
  }, []);

  // 2. Populate form on Edit
  useEffect(() => {
    if (data) {
      setFormData({
        type: data.type,
      });
    } else {
      resetForm();
    }
  }, [data]);

  const resetForm = () => {
    setFormData({ type: "" });
    setErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const validate = () => {
    let tempErrors: any = {};
    if (!formData.type?.trim()) tempErrors.type = "Category Type is required";

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

      // 1. Await the API call and capture the FULL response object
      if (data?.id) {
        response = await updateRegCategory(data.id, formData);
      } else {
        response = await addRegCategory(formData);
      }

      // 2. Extract the specific message from the backend response
      // Your backend structure: { status: "success", message: "...", ... }
      // Axios puts this inside 'response.data'
      const apiMessage = response.data?.message || "Operation successful";

      // 3. Pass the extracted message to the Toast
      toast.success(apiMessage);

      // 4. Close Modal & Refresh Data
      onSuccess();
      document.getElementById("close-btn-reg-cat")?.click();
    } catch (err: any) {
      console.error(err);

      // Optional: Handle backend error messages too
      const errorMsg = err.response?.data?.message || "Error saving data";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="modal fade" id="add_reg_cat_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-bottom bg-light py-2">
            <h5 className="modal-title fw-bold text-dark fs-16">
              <i className="ti ti-category me-2 text-primary"></i>
              {data ? "Edit Category" : "Add Regularization Category"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-btn-reg-cat"
            ></button>
          </div>

          <div className="modal-body p-4">
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label fs-13 fw-bold">
                  Category Type <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="type"
                  className={`form-control ${
                    isSubmitted && errors.type
                      ? "is-invalid"
                      : formData.type
                        ? "is-valid"
                        : ""
                  }`}
                  placeholder="e.g. Late Coming, Work From Home"
                  value={formData.type}
                  onChange={handleInputChange}
                />
                {isSubmitted && errors.type && (
                  <div className="invalid-feedback fs-11">{errors.type}</div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="modal-footer border-0 px-0 mt-4 pb-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 me-2"
                  data-bs-dismiss="modal"
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

export default AddEditRegCategory;
