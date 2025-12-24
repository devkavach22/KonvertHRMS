import React, { useEffect, useState } from "react";
import {
  addBusinessType,
  updateBusinessType,
  BusinessType,
} from "./BusinessTypeServices";
import { toast } from "react-toastify"; // Added for better feedback

interface Props {
  onSuccess: () => void;
  data: BusinessType | null;
}

const AddEditBusinessType: React.FC<Props> = ({ onSuccess, data }) => {
  const [name, setName] = useState("");
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (data) {
      setName(data.name === "-" ? "" : data.name);
    } else {
      setName("");
    }
    setValidated(false);
  }, [data]);

  // Listener for clear form on manual modal close
  useEffect(() => {
    const modalElement = document.getElementById("add_business_type");
    const handleModalClose = () => {
      setValidated(false);
      setName("");
    };
    modalElement?.addEventListener("hidden.bs.modal", handleModalClose);
    return () =>
      modalElement?.removeEventListener("hidden.bs.modal", handleModalClose);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);

    if (e.currentTarget.checkValidity() === false) return;

    setIsSubmitting(true);
    try {
      const apiPayload = { name: name.trim() };

      if (data && data.id) {
        await updateBusinessType(data.id, apiPayload);
        toast.success("Business Type updated successfully!");
      } else {
        await addBusinessType(apiPayload);
        toast.success("Business Type created successfully!");
      }

      document.getElementById("close-btn-type")?.click();
      onSuccess();
    } catch (error: any) {
      console.error("Save error", error);
      toast.error(error.response?.data?.message || "Failed to save data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal custom-modal fade"
      id="add_business_type"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title">
              {data ? "Edit Business Type" : "Add Business Type"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-btn-type"
            ></button>
          </div>
          <div className="modal-body">
            <form
              className={`needs-validation ${validated ? "was-validated" : ""}`}
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="mb-3">
                <label className="form-label">
                  Business Type Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Public"
                />
                <div className="invalid-feedback">Please enter a name.</div>
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
                    : "Save Business Type"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditBusinessType;
