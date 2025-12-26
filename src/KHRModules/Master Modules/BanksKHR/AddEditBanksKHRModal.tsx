import React, { useEffect, useState } from "react";
import { addBank, updateBank, Bank } from "./BanksServices";
import {
  getCountries,
  getStates,
  getDistricts,
} from "@/KHRModules/EmployeModules/Employee/EmployeeServices"; //
import { toast } from "react-toastify";
import { all_routes } from "../../../router/all_routes";
import CommonSelect from "../../../core/common/commonSelect";

interface Props {
  onSuccess: () => void;
  data: Bank | null;
}

const AddEditBanksKHRModal: React.FC<Props> = ({ onSuccess, data }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Dropdown Options State
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  const [formData, setFormData] = useState<any>({
    name: "",
    bic: "",
    swift_code: "",
    micr_code: "",
    phone: "",
    email: "",
    street: "",
    street2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  // 1. BOOTSTRAP EVENT LISTENER - Ensures form clears on any close action
  useEffect(() => {
    const modalElement = document.getElementById("add_bank_modal");

    const handleModalHidden = () => {
      resetForm();
    };

    modalElement?.addEventListener("hidden.bs.modal", handleModalHidden);

    return () => {
      modalElement?.removeEventListener("hidden.bs.modal", handleModalHidden);
    };
  }, []);

  // 2. Fetch Address Dropdown Data
  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        const [countryData, stateData, districtData] = await Promise.all([
          getCountries(),
          getStates(),
          getDistricts(),
        ]);
        setCountries(
          countryData.map((c: any) => ({ value: String(c.id), label: c.name }))
        );
        setStates(
          stateData.map((s: any) => ({ value: String(s.id), label: s.name }))
        );
        setDistricts(
          districtData.map((d: any) => ({ value: String(d.id), label: d.name }))
        );
      } catch (error) {
        console.error("Error fetching address dropdowns", error);
      }
    };
    fetchAddressData();
  }, []);

  // 3. Populate form on Edit
  useEffect(() => {
    if (data) {
      setFormData({ ...data });
    } else {
      resetForm();
    }
  }, [data]);

  const resetForm = () => {
    setFormData({
      name: "",
      bic: "",
      swift_code: "",
      micr_code: "",
      phone: "",
      email: "",
      street: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    });
    setErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  // Real-time validation removal logic
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
    if (!formData.name?.trim()) tempErrors.name = "Bank Name is required";
    if (!formData.bic?.trim()) tempErrors.bic = "BIC is required";

    // Dynamic validation for Phone/Email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = "Invalid email format";
    }
    if (
      formData.phone &&
      !/^[0-9]{10,12}$/.test(formData.phone.replace(/\D/g, ""))
    ) {
      tempErrors.phone = "Invalid phone number";
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
      if (data?.id) {
        await updateBank(data.id, formData);
        toast.success("Bank updated successfully");
      } else {
        await addBank(formData);
        toast.success("Bank created successfully");
      }
      onSuccess();
      document.getElementById("close-btn-bank")?.click();
    } catch (err) {
      toast.error("Error saving data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal fade" id="add_bank_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-bottom bg-light py-2">
            <h5 className="modal-title fw-bold text-dark fs-16">
              <i className="ti ti-building-bank me-2 text-primary"></i>
              {data ? "Edit Bank Master" : "Create New Bank"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-btn-bank"
            ></button>
          </div>

          <div className="modal-body p-4">
            <form onSubmit={handleSubmit} noValidate>
              {/* Primary Identification */}
              <div className="mb-4">
                <h6 className="fw-bold text-primary mb-3 pb-2 border-bottom fs-14">
                  Primary Identification
                </h6>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fs-13 fw-bold">
                      Bank Name <span className="text-danger">*</span>
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
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    {isSubmitted && errors.name && (
                      <div className="invalid-feedback fs-11">
                        {errors.name}
                      </div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fs-13 fw-bold">
                      BIC / Identifier <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="bic"
                      className={`form-control ${
                        isSubmitted && errors.bic
                          ? "is-invalid"
                          : formData.bic
                          ? "is-valid"
                          : ""
                      }`}
                      value={formData.bic}
                      onChange={handleInputChange}
                    />
                    {isSubmitted && errors.bic && (
                      <div className="invalid-feedback fs-11">{errors.bic}</div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fs-13 fw-bold">
                      SWIFT Code
                    </label>
                    <input
                      type="text"
                      name="swift_code"
                      className="form-control"
                      value={formData.swift_code}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fs-13 fw-bold">
                      MICR Code
                    </label>
                    <input
                      type="text"
                      name="micr_code"
                      className="form-control"
                      value={formData.micr_code}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="row g-4">
                {/* --- Re-organized Bank Address Layout --- */}
                <div className="col-md-7">
                  <h6 className="fw-bold text-primary mb-3 pb-2 border-bottom fs-14">
                    Bank Address
                  </h6>
                  <div className="row g-2">
                    <div className="col-12 mb-2">
                      <input
                        type="text"
                        name="street"
                        className="form-control mb-1"
                        placeholder="Street Address..."
                        value={formData.street}
                        onChange={handleInputChange}
                      />
                      <input
                        type="text"
                        name="street2"
                        className="form-control"
                        placeholder="Street Address 2..."
                        value={formData.street2}
                        onChange={handleInputChange}
                      />
                    </div>
                    {/* Shared row: City and State */}
                    <div className="col-md-6 mb-2">
                      <CommonSelect
                        options={districts}
                        placeholder="Select City"
                        defaultValue={districts.find(
                          (d) => d.value === String(formData.city)
                        )}
                        onChange={(opt) =>
                          setFormData({ ...formData, city: opt?.value || "" })
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-2">
                      <CommonSelect
                        options={states}
                        placeholder="Select State"
                        defaultValue={states.find(
                          (s) => s.value === String(formData.state)
                        )}
                        onChange={(opt) =>
                          setFormData({ ...formData, state: opt?.value || "" })
                        }
                      />
                    </div>
                    {/* Shared row: Country and ZIP */}
                    <div className="col-md-6">
                      <CommonSelect
                        options={countries}
                        placeholder="Select Country"
                        defaultValue={countries.find(
                          (c) => c.value === String(formData.country)
                        )}
                        onChange={(opt) =>
                          setFormData({
                            ...formData,
                            country: opt?.value || "",
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="zip"
                        className="form-control"
                        placeholder="Zip Code"
                        value={formData.zip}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* --- Contact Details Section --- */}
                <div className="col-md-5 ps-md-4 border-start">
                  <h6 className="fw-bold text-primary mb-3 pb-2 border-bottom fs-14">
                    Contact Details
                  </h6>
                  <div className="mb-3">
                    <label className="form-label fs-13 fw-bold">
                      Phone Number
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="ti ti-phone fs-14"></i>
                      </span>
                      <input
                        type="text"
                        name="phone"
                        className={`form-control ${
                          isSubmitted && errors.phone
                            ? "is-invalid"
                            : formData.phone && !errors.phone
                            ? "is-valid"
                            : ""
                        }`}
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Optional"
                      />
                      {isSubmitted && errors.phone && (
                        <div className="invalid-feedback fs-11">
                          {errors.phone}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fs-13 fw-bold">
                      Email Address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="ti ti-mail fs-14"></i>
                      </span>
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${
                          isSubmitted && errors.email
                            ? "is-invalid"
                            : formData.email && !errors.email
                            ? "is-valid"
                            : ""
                        }`}
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Optional"
                      />
                      {isSubmitted && errors.email && (
                        <div className="invalid-feedback fs-11">
                          {errors.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons with Spinner */}
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
                    "Save Bank Master"
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

export default AddEditBanksKHRModal;
