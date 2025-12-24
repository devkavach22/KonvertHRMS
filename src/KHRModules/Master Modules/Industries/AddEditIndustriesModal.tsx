import React, { useEffect, useState } from "react";
import { addIndustry, updateIndustry, Industry } from "./IndustriesServices";
import { toast } from "react-toastify";

interface Props {
  onSuccess: () => void;
  data: Industry | null;
}

const AddEditIndustriesModal: React.FC<Props> = ({ onSuccess, data }) => {
  const [name, setName] = useState("");
  const [fullName, setFullName] = useState("");
  const [validated, setValidated] = useState(false); // Validation State
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state with data prop
  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setFullName(data.full_name || "");
    } else {
      setName("");
      setFullName("");
    }
    setValidated(false); // Reset validation when data changes
  }, [data]);

  // Listener to clear state when modal is closed (X, Backdrop, or Escape)
  useEffect(() => {
    const modalElement = document.getElementById("add_industry_modal");
    const handleHidden = () => {
      setName("");
      setFullName("");
      setValidated(false);
    };
    modalElement?.addEventListener("hidden.bs.modal", handleHidden);
    return () =>
      modalElement?.removeEventListener("hidden.bs.modal", handleHidden);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;
    setValidated(true); // Trigger Bootstrap's visual validation

    // If HTML5 validation (required attribute) fails, stop here
    if (form.checkValidity() === false) {
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name: name.trim(),
      full_name: fullName.trim(),
    };

    try {
      if (data && data.id) {
        await updateIndustry(data.id, payload);
        toast.success("Industry updated successfully");
      } else {
        await addIndustry(payload);
        toast.success("Industry created successfully");
      }

      // Close modal and refresh
      document.getElementById("close-industry-btn")?.click();
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save industry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal custom-modal fade"
      id="add_industry_modal"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title">
              {data ? "Edit Industry" : "Add Industry"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-industry-btn"
            ></button>
          </div>
          <div className="modal-body">
            <form
              className={`needs-validation ${validated ? "was-validated" : ""}`}
              noValidate
              onSubmit={handleSubmit}
            >
              {/* Industry Name */}
              <div className="mb-3">
                <label className="form-label">
                  Industry Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  required // HTML5 Required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. IT Services"
                />
                <div className="invalid-feedback">
                  Please provide an industry name.
                </div>
              </div>

              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Information Technology Services"
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
                  {isSubmitting ? "Saving..." : "Save Industry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditIndustriesModal;
