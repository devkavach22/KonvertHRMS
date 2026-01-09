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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const initialFormState = {
    name: "",
    location_type: "office",
  };

  const [formData, setFormData] = useState<any>(initialFormState);

  // --- 1. BOOTSTRAP EVENT LISTENER (Force clear on close) ---
  useEffect(() => {
    const modalElement = document.getElementById("add_work_location");
    const handleHidden = () => resetForm();
    modalElement?.addEventListener("hidden.bs.modal", handleHidden);
    return () =>
      modalElement?.removeEventListener("hidden.bs.modal", handleHidden);
  }, []);

  // --- 2. DATA POPULATION ---
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        location_type: data.location_type || "office",
      });
    } else {
      resetForm();
    }
  }, [data]);

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    let tempErrors: any = {};
    if (!formData.name?.trim()) {
      tempErrors.name = "Work Location Name is required";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const apiPayload = {
        name: formData.name.trim(),
        location_type: formData.location_type,
      };

      if (data && data.id) {
        await updateWorkLocation(data.id, apiPayload);
        toast.success("Location updated successfully!");
      } else {
        await addWorkLocation(apiPayload);
        toast.success("Location created successfully!");
      }

      onSuccess();
      document.getElementById("close-btn-work-loc")?.click();
    } catch (error: any) {
      console.error("Failed to save work location", error);
      toast.error(error.response?.data?.message || "Error saving data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal fade" id="add_work_location" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          {/* Header */}
          <div className="modal-header border-bottom bg-light py-2">
            <h5 className="modal-title fw-bold text-dark fs-16">
              <i className="ti ti-map-pin me-2 text-primary"></i>
              {data ? "Edit Work Location" : "Create Work Location"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-btn-work-loc"
              onClick={resetForm}
            ></button>
          </div>

          <div className="modal-body p-4">
            <form noValidate onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="mb-4">
                <label className="form-label fs-13 fw-bold">
                  Work Location Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={`form-control ${
                    isSubmitted ? (errors.name ? "is-invalid" : "is-valid") : ""
                  }`}
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Head Office, Remote Hub"
                />
                {isSubmitted && errors.name && (
                  <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                    <i className="ti ti-info-circle me-1"></i>
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Location Type Radio Buttons */}
              <div className="mb-3">
                <label className="form-label fs-13 fw-bold mb-2">
                  Location Type
                </label>
                <div className="d-flex gap-4 p-2 border rounded bg-light">
                  {["office", "home", "other"].map((type) => (
                    <div className="form-check" key={type}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="location_type"
                        id={`type_${type}`}
                        value={type}
                        checked={formData.location_type === type}
                        onChange={handleInputChange}
                      />
                      <label
                        className="form-check-label text-capitalize fs-13"
                        htmlFor={`type_${type}`}
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="modal-footer border-0 px-0 mt-4 pb-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 me-2"
                  data-bs-dismiss="modal"
                  onClick={resetForm}
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
                    "Save Location"
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

export default AddEditWorkLocationModal;
