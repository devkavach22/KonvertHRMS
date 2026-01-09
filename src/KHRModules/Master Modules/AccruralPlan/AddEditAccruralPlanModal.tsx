import React, { useEffect, useState } from "react";
import {
  addAccruralPlan,
  updateAccruralPlan,
  AccruralPlan,
} from "./AccruralPlanServices";
import { toast } from "react-toastify";
// CommonSelect import removed as we are now using Radio buttons

interface Props {
  onSuccess: () => void;
  data: any | null;
}

const AddEditAccruralPlanModal: React.FC<Props> = ({ onSuccess, data }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Options for Radio Buttons
  const carryoverOptions = [
    { value: "year_start", label: "At the start of the year" },
    { value: "allocation", label: "At the allocation date" },
    { value: "other", label: "Other" },
  ];

  const gainTimeOptions = [
    { value: "start", label: "At the start of the accrual period" },
    { value: "end", label: "At the end of the accrual period" },
  ];

  const [formData, setFormData] = useState<any>({
    name: "",
    carryover_date: "year_start",
    accrued_gain_time: "start",
    is_based_on_worked_time: false,
    client_id: "",
    company_id: "",
  });

  // BOOTSTRAP EVENT LISTENER - Reset form on close
  useEffect(() => {
    const modalElement = document.getElementById("add_accrural_plan_modal");
    const handleModalHidden = () => resetForm();
    modalElement?.addEventListener("hidden.bs.modal", handleModalHidden);
    return () => {
      modalElement?.removeEventListener("hidden.bs.modal", handleModalHidden);
    };
  }, []);

  // Populate form on Edit with Helper Logic
  useEffect(() => {
    if (data) {
      // Helper to extract ID from [123, "Name"] or return value as is
      const getVal = (field: any) => {
        if (Array.isArray(field)) return String(field[0]);
        if (field === false || field === null || field === 0) return "";
        return String(field);
      };

      setFormData({
        name: data.name || "",
        carryover_date: data.carryover_date || "year_start",
        accrued_gain_time: data.accrued_gain_time || "start",
        is_based_on_worked_time: data.is_based_on_worked_time || false,
        client_id: getVal(data.client_id),
        company_id: getVal(data.company_id),
      });
    } else {
      resetForm();
    }
  }, [data]);

  const resetForm = () => {
    setFormData({
      name: "",
      carryover_date: "year_start",
      accrued_gain_time: "start",
      is_based_on_worked_time: false,
      client_id: "",
      company_id: "",
    });
    setErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    // Handle Checkbox vs Radio/Text
    const finalValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData({ ...formData, [name]: finalValue });

    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const validate = () => {
    let tempErrors: any = {};
    let isValid = true;

    if (!formData.name?.trim()) {
      tempErrors.name = "Plan Name is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Construct payload
      const payload = {
        name: formData.name,
        carryover_date: formData.carryover_date,
        accrued_gain_time: formData.accrued_gain_time,
        is_based_on_worked_time: formData.is_based_on_worked_time,
        company_id: formData.company_id
          ? Number(formData.company_id)
          : undefined,
      };

      if (data?.id) {
        await updateAccruralPlan(String(data.id), payload);
        toast.success("Accrual Plan updated successfully");
      } else {
        await addAccruralPlan(payload);
        toast.success("Accrual Plan created successfully");
      }
      onSuccess();
      document.getElementById("close-btn-accrural")?.click();
    } catch (err) {
      console.error(err);
      toast.error("Error saving data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal fade" id="add_accrural_plan_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-bottom bg-light py-2">
            <h5 className="modal-title fw-bold text-dark fs-16">
              <i className="ti ti-calendar-time me-2 text-primary"></i>
              {data ? "Edit Accrual Plan" : "Create Accrual Plan"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-btn-accrural"
            ></button>
          </div>

          <div className="modal-body p-4">
            <form onSubmit={handleSubmit} noValidate>
              {/* Plan Name Field */}
              <div className="mb-4">
                <label className="form-label fs-13 fw-bold">
                  Plan Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={`form-control ${
                    isSubmitted
                      ? errors.name
                        ? "is-invalid"
                        : formData.name
                        ? "is-valid"
                        : ""
                      : ""
                  }`}
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Annual Leave Plan 2025"
                />
                {isSubmitted && errors.name && (
                  <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                    <i className="ti ti-info-circle me-1"></i>
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Carryover Date - Radio Buttons */}
              <div className="mb-4">
                <label className="form-label fs-13 fw-bold mb-2">
                  Carry-Over Time
                </label>
                <div className="d-flex flex-column gap-2">
                  {carryoverOptions.map((opt) => (
                    <div className="form-check" key={opt.value}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="carryover_date"
                        id={`carryover_${opt.value}`}
                        value={opt.value}
                        checked={formData.carryover_date === opt.value}
                        onChange={handleInputChange}
                      />
                      <label
                        className="form-check-label fs-13 text-dark"
                        htmlFor={`carryover_${opt.value}`}
                      >
                        {opt.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accrued Gain Time - Radio Buttons */}
              <div className="mb-4">
                <label className="form-label fs-13 fw-bold mb-2">
                  Accrued Gain Time
                </label>
                <div className="d-flex flex-column gap-2">
                  {gainTimeOptions.map((opt) => (
                    <div className="form-check" key={opt.value}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="accrued_gain_time"
                        id={`gaintime_${opt.value}`}
                        value={opt.value}
                        checked={formData.accrued_gain_time === opt.value}
                        onChange={handleInputChange}
                      />
                      <label
                        className="form-check-label fs-13 text-dark"
                        htmlFor={`gaintime_${opt.value}`}
                      >
                        {opt.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Based on Worked Time Checkbox */}
              <div className="mb-3 d-flex align-items-center pt-2 border-top">
                <div className="form-check form-switch mt-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="is_based_on_worked_time"
                    name="is_based_on_worked_time"
                    checked={formData.is_based_on_worked_time}
                    onChange={handleInputChange}
                  />
                  <label
                    className="form-check-label fs-13 fw-bold text-dark ms-2"
                    htmlFor="is_based_on_worked_time"
                  >
                    Based on Worked Time
                  </label>
                </div>
              </div>

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
                    "Save Plan"
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

export default AddEditAccruralPlanModal;
