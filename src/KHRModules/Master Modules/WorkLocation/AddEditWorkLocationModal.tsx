import React, { useEffect, useState } from "react";
import {
  addWorkLocation,
  updateWorkLocation,
  WorkLocation,
} from "./WorkLocationServices";
import { toast } from "react-toastify";

interface Props {
  onSuccess: () => void;
  data: WorkLocation | null;
}

const AddEditWorkLocationModal: React.FC<Props> = ({ onSuccess, data }) => {
  const [name, setName] = useState("");
  const [locationType, setLocationType] = useState<"home" | "office" | "other">(
    "office"
  );
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to reset form to default state
  const resetForm = () => {
    setName("");
    setLocationType("office");
    setValidated(false);
  };

  // 1. DATA SYNC: Populate form when 'data' changes (Edit vs Add)
  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setLocationType(data.location_type || "office");
    } else {
      resetForm();
    }
  }, [data]);

  // 2. BOOTSTRAP EVENT LISTENER: Force clear when modal is closed
  useEffect(() => {
    const modalElement = document.getElementById("add_work_location");

    const handleModalHidden = () => {
      resetForm();
    };

    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", handleModalHidden);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("hidden.bs.modal", handleModalHidden);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;
    setValidated(true);

    if (form.checkValidity() === false) {
      return;
    }

    setIsSubmitting(true);

    const apiPayload = {
      name: name.trim(),
      location_type: locationType,
    };

    try {
      if (data && data.id) {
        await updateWorkLocation(data.id, apiPayload);
        toast.success("Location updated successfully!");
      } else {
        await addWorkLocation(apiPayload);
        toast.success("Location created successfully!");
      }

      // Close modal
      const closeBtn = document.getElementById("close-btn-work-loc");
      closeBtn?.click();

      onSuccess();
    } catch (error: any) {
      console.error("Failed to save work location", error);
      toast.error(error.response?.data?.message || "Error saving data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal custom-modal fade"
      id="add_work_location"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title">
              {data ? "Edit Work Location" : "Add Work Location"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-btn-work-loc"
              aria-label="Close"
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
                  Work Location Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Main Office"
                />
              </div>

              <div className="mb-3">
                <label className="form-label d-block">
                  Location Type <span className="text-danger">*</span>
                </label>
                <div className="d-flex gap-3 mt-2">
                  {["home", "office", "other"].map((type) => (
                    <div className="form-check" key={type}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="location_type"
                        id={`type_${type}`}
                        value={type}
                        checked={locationType === type}
                        onChange={() => setLocationType(type as any)}
                        required
                      />
                      <label
                        className="form-check-label text-capitalize"
                        htmlFor={`type_${type}`}
                      >
                        {type}
                      </label>
                    </div>
                  ))}
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

export default AddEditWorkLocationModal;
