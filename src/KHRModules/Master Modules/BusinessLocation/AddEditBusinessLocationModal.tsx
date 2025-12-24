import React, { useEffect, useState } from "react";
import {
  addBusinessLocation,
  updateBusinessLocation,
  BusinessLocation,
} from "./BusinessLocationServices";
import { toast } from "react-toastify";

interface Props {
  onSuccess: () => void;
  data: BusinessLocation | null;
}

const AddEditBusinessLocationModal: React.FC<Props> = ({ onSuccess, data }) => {
  const [name, setName] = useState("");
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state with data prop
  useEffect(() => {
    if (data) {
      setName(data.name === "-" ? "" : data.name);
    } else {
      setName("");
    }
    setValidated(false);
  }, [data]);

  // Listener to clear state when modal is closed via backdrop or escape key
  useEffect(() => {
    const modalElement = document.getElementById("add_business_location");
    const handleHidden = () => {
      setName("");
      setValidated(false);
    };
    modalElement?.addEventListener("hidden.bs.modal", handleHidden);
    return () =>
      modalElement?.removeEventListener("hidden.bs.modal", handleHidden);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);

    if (e.currentTarget.checkValidity() === false) return;

    setIsSubmitting(true);
    try {
      if (data && data.id) {
        await updateBusinessLocation(data.id, { name: name.trim() });
        toast.success("Location updated successfully");
      } else {
        await addBusinessLocation({ name: name.trim() });
        toast.success("Location created successfully");
      }

      document.getElementById("close-btn-loc")?.click();
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error saving location");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal custom-modal fade"
      id="add_business_location"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title">
              {data ? "Edit Business Location" : "Add Business Location"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-btn-loc"
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
                  Location Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Delhi Office"
                />
                <div className="invalid-feedback">
                  Please provide a location name.
                </div>
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
                  {isSubmitting ? "Saving..." : "Save Location"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditBusinessLocationModal;
