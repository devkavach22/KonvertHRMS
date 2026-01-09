import React, { useEffect, useState } from "react";
import {
  addDepartment,
  updateDepartment,
  Department,
} from "./departmentService";
import { toast } from "react-toastify";

interface Props {
  onSuccess: () => void;
  data: Department | null;
}

const AddDepartmentModal: React.FC<Props> = ({ onSuccess, data }) => {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // 1. CLEAR/POPULATE LOGIC
  useEffect(() => {
    if (data) {
      setName(data.Department_Name || "");
    } else {
      resetForm();
    }
  }, [data]);

  // 2. BOOTSTRAP EVENT LISTENER
  useEffect(() => {
    const modalElement = document.getElementById("add_department");
    const handleHidden = () => resetForm();
    modalElement?.addEventListener("hidden.bs.modal", handleHidden);
    return () => {
      modalElement?.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, []);

  const resetForm = () => {
    setName("");
    setErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  const validate = () => {
    let tempErrors: any = {};
    if (!name.trim()) {
      tempErrors.name = "Department Name is required";
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
      if (data && data.id) {
        // Update Logic
        await updateDepartment(data.id, { name: name.trim() });
        toast.success("Department updated successfully");
      } else {
        // Create Logic
        const createPayload = {
          name: name.trim(),
          parent_id: null,
          color: 5,
          unit_code: "HO-001",
          range_start: 100,
          range_end: 200,
          is_no_range: false,
          is_lapse_allocation: false,
          wage: 50000,
        };
        await addDepartment(createPayload);
        toast.success("Department created successfully");
      }

      onSuccess();
      document.getElementById("close-btn-dept")?.click();
    } catch (error: any) {
      console.error("Save Error:", error);
      toast.error(error.response?.data?.message || "Error saving data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal fade" id="add_department" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          {/* Header Styles Matching Banks/Employee Modal */}
          <div className="modal-header border-bottom bg-light py-2">
            <h5 className="modal-title fw-bold text-dark fs-16">
              <i className="ti ti-sitemap me-2 text-primary"></i>
              {data ? "Edit Department" : "Create Department"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-btn-dept"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label fs-13 fw-bold">
                  Department Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    isSubmitted ? (errors.name ? "is-invalid" : "is-valid") : ""
                  }`}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({});
                  }}
                  placeholder="e.g. Human Resources"
                />
                {isSubmitted && errors.name && (
                  <div className="invalid-feedback fs-11">{errors.name}</div>
                )}
              </div>

              {/* Footer Styles Matching Banks/Employee Modal */}
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
                    "Save Department"
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

export default AddDepartmentModal;
