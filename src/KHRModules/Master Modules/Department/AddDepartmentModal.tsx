import React, { useEffect, useState } from "react";
import {
  addDepartment,
  updateDepartment,
  Department,
} from "./departmentService";
import { toast } from "react-toastify";

interface Props {
  onSuccess: () => void;
  data: Department | null; // Receive selected department data
}

const AddDepartmentModal: React.FC<Props> = ({ onSuccess, data }) => {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. CLEAR/POPULATE LOGIC
  // This runs whenever the 'data' prop changes (e.g., when clicking Edit or Add New)
  useEffect(() => {
    if (data) {
      // Edit Mode: Fill form with existing data
      setName(data.Department_Name || "");
    } else {
      // Add Mode / Modal Closed: Clear the form
      setName("");
    }
  }, [data]);

  // 2. BOOTSTRAP EVENT LISTENER (Extra Safety)
  // This ensures that even if the user clicks outside the modal to close it, the data clears
  useEffect(() => {
    const modalElement = document.getElementById("add_department");

    const handleHidden = () => {
      setName(""); // Reset name field
      // If you have a way to reset the parent's 'selectedDepartment' to null,
      // it's even better, but resetting local state here handles the UI.
    };

    modalElement?.addEventListener("hidden.bs.modal", handleHidden);
    return () => {
      modalElement?.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter a department name");

    setIsSubmitting(true);
    try {
      if (data && data.id) {
        // Update Logic
        await updateDepartment(data.id, { name: name.trim() });
        toast.success("Department updated successfully");
      } else {
        // Create Logic (Using your required payload structure)
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

      // CLOSE MODAL
      const closeBtn = document.getElementById("close-btn-dept");
      closeBtn?.click();

      // CLEAR FORM after successful save
      setName("");

      // REFRESH TABLE
      onSuccess();
    } catch (error: any) {
      console.error("Save Error:", error);
      toast.error(error.response?.data?.message || "Error saving data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal custom-modal fade" id="add_department" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title">
              {data ? "Edit Department" : "Add Department"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-btn-dept"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">
                  Department Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter department name"
                />
              </div>

              <div className="modal-footer border-0">
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
                  {isSubmitting
                    ? "Saving..."
                    : data
                    ? "Update Changes"
                    : "Save Department"}
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
