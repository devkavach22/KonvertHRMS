import React, { useEffect, useState } from "react";
import {
  createSalaryStructureType,
  updateSalaryStructureType,
  SalaryStructureType,
} from "./SalaryStructureTypeServices";
// Assumed path for SalaryStructureService based on standard structure
import { getSalaryStructures } from "../SalaryStructure/SalaryStructureService";
import { getWorkingSchedules } from "@/KHRModules/EmployeModules/Employee/EmployeeServices";
import { toast } from "react-toastify";
import CommonSelect from "../../../core/common/commonSelect";
import { getWorkEntryTypes } from "@/KHRModules/Master Modules/WorkEntryType/WorkEntryTypeServices";

interface Props {
  onSuccess: () => void;
  data: SalaryStructureType | null;
  onClose: () => void;
}

const AddEditSalaryStructureTypeModal: React.FC<Props> = ({
  onSuccess,
  data,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Dropdown Options State
  const [resourceCalendars, setResourceCalendars] = useState<any[]>([]);
  const [payStructures, setPayStructures] = useState<any[]>([]);
  const [workEntryTypes, setWorkEntryTypes] = useState<any[]>([]);

  // Static Dropdown Options
  const wageTypeOptions = [
    { value: "monthly", label: "Fixed Wage" },
    { value: "hourly", label: "Hourly Wage" },
  ];

  const schedulePayOptions = [
    { value: "annually", label: "Annually" },
    { value: "semi-annually", label: "Semi-Annually" },
    { value: "quarterly", label: "Quarterly" },
    { value: "bi-monthly", label: "Bi-Monthly" },
    { value: "monthly", label: "Monthly" },
    { value: "semi-monthly", label: "Semi-Monthly" },
    { value: "bi-weekly", label: "Bi-Weekly" },
    { value: "weekly", label: "Weekly" },
    { value: "daily", label: "Daily" },
  ];

  const initialFormState = {
    name: "",
    wage_type: "monthly",
    default_schedule_pay: "monthly",
    default_work_entry_type_id: "",
    default_resource_calendar_id: "",
    default_struct_id: "",
    // Country removed
  };

  const [formData, setFormData] = useState<any>(initialFormState);

  // 1. BOOTSTRAP EVENT LISTENER
  useEffect(() => {
    const modalElement = document.getElementById("add_structure_type_modal");
    const handleModalHidden = () => {
      resetForm();
      onClose();
    };
    modalElement?.addEventListener("hidden.bs.modal", handleModalHidden);
    return () => {
      modalElement?.removeEventListener("hidden.bs.modal", handleModalHidden);
    };
  }, [onClose]);

  // 2. Fetch Dropdown Data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [calendarData, structData, workEntryData] = await Promise.all([
          getWorkingSchedules(),
          getSalaryStructures(), // UPDATED: Calls getSalaryStructures API
          getWorkEntryTypes(),
        ]);

        // Map data for CommonSelect
        setResourceCalendars(
          (Array.isArray(calendarData) ? calendarData : []).map((c: any) => ({
            value: String(c.id),
            label: c.name,
          })),
        );
        setPayStructures(
          (Array.isArray(structData) ? structData : []).map((s: any) => ({
            value: String(s.id),
            label: s.name,
          })),
        );
        setWorkEntryTypes(
          (Array.isArray(workEntryData) ? workEntryData : []).map((w: any) => ({
            value: String(w.id),
            label: w.name,
          })),
        );
      } catch (error) {
        console.error("Error fetching dropdowns", error);
      }
    };
    fetchDropdownData();
  }, []);

  // 3. Populate form on Edit
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        wage_type: data.wage_type || "monthly",
        default_schedule_pay: data.default_schedule_pay || "monthly",
        default_work_entry_type_id: data.default_work_entry_type_id
          ? String(data.default_work_entry_type_id)
          : "",
        default_resource_calendar_id: data.default_resource_calendar_id
          ? String(data.default_resource_calendar_id)
          : "",
        default_struct_id: data.default_struct_id
          ? String(data.default_struct_id)
          : "",
        // Country removed
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

  // --- VALIDATION HELPERS ---

  const clearError = (fieldName: string) => {
    setErrors((prev: any) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const getInputClass = (fieldName: string) => {
    if (errors[fieldName]) return "form-control is-invalid";
    if (isSubmitted && formData[fieldName] && !errors[fieldName])
      return "form-control is-valid";
    return "form-control";
  };

  const getSelectWrapperClass = (fieldName: string) => {
    if (errors[fieldName]) return "border border-danger rounded";
    if (isSubmitted && formData[fieldName] && !errors[fieldName])
      return "border border-success rounded";
    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    clearError(name);
  };

  const validate = () => {
    let tempErrors: any = {};

    // 1. Structure Name *
    if (!formData.name?.trim()) tempErrors.name = "Structure Name is required";

    // 2. Wage Type *
    if (!formData.wage_type) tempErrors.wage_type = "Wage Type is required";

    // 3. Work Entry Type *
    if (!formData.default_work_entry_type_id)
      tempErrors.default_work_entry_type_id = "Work Entry Type is required";

    // NOTE: Country, Working Hours, Regular Pay Structure, and Schedule Pay are NOT mandatory.

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
        await updateSalaryStructureType(data.id, formData);
        toast.success("Structure Type updated successfully");
      } else {
        await createSalaryStructureType(formData);
        toast.success("Structure Type created successfully");
      }
      onSuccess();
      document.getElementById("close-btn-structure")?.click();
    } catch (err) {
      toast.error("Error saving data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>
        {`
          .is-invalid + .invalid-feedback { display: block; }
        `}
      </style>
      <div className="modal fade" id="add_structure_type_modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header border-bottom bg-light py-2">
              <h5 className="modal-title fw-bold text-dark fs-16">
                <i className="ti ti-settings me-2 text-primary"></i>
                {data
                  ? "Edit Salary Structure Type"
                  : "Create Salary Structure Type"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="close-btn-structure"
                onClick={resetForm}
              ></button>
            </div>

            <div className="modal-body p-4">
              <form onSubmit={handleSubmit} noValidate>
                {/* Row 1: Name (Full Width) */}
                <div className="row g-3 mb-3">
                  <div className="col-md-12">
                    <label className="form-label fs-13 fw-bold">
                      Structure Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      className={getInputClass("name")}
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Monthly Payroll Structure"
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>
                </div>

                {/* Wage Type and Schedule Pay Row */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fs-13 fw-bold">
                      Wage Type <span className="text-danger">*</span>
                    </label>
                    <div className={getSelectWrapperClass("wage_type")}>
                      <CommonSelect
                        options={wageTypeOptions}
                        placeholder="Select Wage Type"
                        defaultValue={wageTypeOptions.find(
                          (w) => w.value === formData.wage_type,
                        )}
                        onChange={(opt) => {
                          setFormData({
                            ...formData,
                            wage_type: opt?.value || "monthly",
                          });
                          clearError("wage_type");
                        }}
                      />
                    </div>
                    {errors.wage_type && (
                      <div className="text-danger fs-11 mt-1">
                        {errors.wage_type}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fs-13 fw-bold">
                      Scheduled Pay
                    </label>
                    <div>
                      <CommonSelect
                        options={schedulePayOptions}
                        placeholder="Select Schedule"
                        defaultValue={schedulePayOptions.find(
                          (s) => s.value === formData.default_schedule_pay,
                        )}
                        onChange={(opt) =>
                          setFormData({
                            ...formData,
                            default_schedule_pay: opt?.value || "monthly",
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* API Driven Dropdowns Row */}
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fs-13 fw-bold">
                      Work Entry Type <span className="text-danger">*</span>
                    </label>
                    <div
                      className={getSelectWrapperClass(
                        "default_work_entry_type_id",
                      )}
                    >
                      <CommonSelect
                        options={workEntryTypes}
                        placeholder="Select Entry Type"
                        defaultValue={workEntryTypes.find(
                          (w) =>
                            w.value ===
                            String(formData.default_work_entry_type_id),
                        )}
                        onChange={(opt) => {
                          setFormData({
                            ...formData,
                            default_work_entry_type_id: opt?.value || "",
                          });
                          clearError("default_work_entry_type_id");
                        }}
                      />
                    </div>
                    {errors.default_work_entry_type_id && (
                      <div className="text-danger fs-11 mt-1">
                        {errors.default_work_entry_type_id}
                      </div>
                    )}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fs-13 fw-bold">
                      Working Hours
                    </label>
                    <div>
                      <CommonSelect
                        options={resourceCalendars}
                        placeholder="Select Calendar"
                        defaultValue={resourceCalendars.find(
                          (c) =>
                            c.value ===
                            String(formData.default_resource_calendar_id),
                        )}
                        onChange={(opt) => {
                          setFormData({
                            ...formData,
                            default_resource_calendar_id: opt?.value || "",
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fs-13 fw-bold">
                      Regular Pay Structure
                    </label>
                    <div>
                      <CommonSelect
                        options={payStructures}
                        placeholder="Select Structure"
                        defaultValue={payStructures.find(
                          (p) => p.value === String(formData.default_struct_id),
                        )}
                        onChange={(opt) => {
                          setFormData({
                            ...formData,
                            default_struct_id: opt?.value || "",
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
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
                      "Save Structure Type"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEditSalaryStructureTypeModal;
