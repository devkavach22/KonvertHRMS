import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CommonSelect from "../../../core/common/commonSelect";
import { addJob, updateJob, JobPosition, getContractTypes } from "./jobService";
import Instance from "../../../api/axiosInstance";
import { getSkills } from "../Skills/SkillServices";

interface Props {
  onSuccess: () => void;
  data: JobPosition | null;
}

interface DropdownOption {
  value: string;
  label: string;
}

const AddEditJobPositionModal: React.FC<Props> = ({ onSuccess, data }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Dropdown States
  const [departments, setDepartments] = useState<DropdownOption[]>([]);
  const [industries, setIndustries] = useState<DropdownOption[]>([]);
  const [contractTypes, setContractTypes] = useState<DropdownOption[]>([]);
  const [availableSkills, setAvailableSkills] = useState<DropdownOption[]>([]);

  const initialFormState = {
    name: "",
    department_id: "",
    industry_id: "",
    no_of_recruitment: 1,
    skill_ids: [] as string[],
    contract_type_id: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  // --- 1. Fetch Dropdowns ---
  useEffect(() => {
    const fetchDropdowns = async () => {
      const user_id = localStorage.getItem("user_id") || "219";
      try {
        const [deptRes, indRes, skillData, contractRes] = await Promise.all([
          Instance.get(`/api/department?user_id=${user_id}`),
          Instance.get(`/api/industries?user_id=${user_id}`),
          getSkills(),
          getContractTypes(),
        ]);

        const deptList = deptRes.data.data || deptRes.data || [];
        const indList = indRes.data.data || indRes.data || [];
        const contractList = Array.isArray(contractRes)
          ? contractRes
          : contractRes.data?.data || contractRes.data || [];

        const skillOptions: DropdownOption[] = [];
        const processSkill = (s: any) => {
          if (!skillOptions.find((opt) => opt.value === String(s.id))) {
            skillOptions.push({ value: String(s.id), label: s.name });
          }
        };

        if (Array.isArray(skillData)) {
          skillData.forEach((group: any) => {
            if (Array.isArray(group.skills)) group.skills.forEach(processSkill);
            else if (group.id && group.name) processSkill(group);
          });
        }

        setDepartments(
          deptList.map((d: any) => ({ value: String(d.id), label: d.name }))
        );
        setIndustries(
          indList.map((i: any) => ({ value: String(i.id), label: i.name }))
        );
        setContractTypes(
          contractList.map((c: any) => ({
            value: String(c.id),
            label: c.name,
          }))
        );
        setAvailableSkills(skillOptions);
      } catch (error) {
        console.error("Error fetching dropdowns", error);
      }
    };
    fetchDropdowns();
  }, []);

  // --- 2. Populate Data on Edit ---
  useEffect(() => {
    if (data) {
      // Helper to safely extract ID from various formats
      const getVal = (val: any) => {
        if (!val) return "";
        if (Array.isArray(val)) return String(val[0]);
        if (typeof val === "object" && val.id) return String(val.id);
        return String(val);
      };

      setFormData({
        name: data.name || "",
        department_id: getVal(data.department_id),
        industry_id: getVal(data.industry_id),
        no_of_recruitment: data.no_of_recruitment || 1,
        skill_ids: data.skill_ids ? data.skill_ids.map((id) => String(id)) : [],
        contract_type_id: getVal(data.contract_type_id),
      });
    } else {
      resetForm();
    }
  }, [data]);

  // --- 3. Reset & Close Logic ---
  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  useEffect(() => {
    const modalElement = document.getElementById("add_job_modal");
    const handleHidden = () => resetForm();
    modalElement?.addEventListener("hidden.bs.modal", handleHidden);
    return () =>
      modalElement?.removeEventListener("hidden.bs.modal", handleHidden);
  }, []);

  // --- 4. Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSkillChange = (selectedOptions: any) => {
    const values = selectedOptions
      ? selectedOptions.map((opt: any) => opt.value)
      : [];
    setFormData({ ...formData, skill_ids: values });
    if (errors.skill_ids)
      setErrors((prev: any) => ({ ...prev, skill_ids: "" }));
  };

  const validateForm = () => {
    let tempErrors: any = {};
    let isValid = true;

    if (!formData.name?.trim()) {
      tempErrors.name = "Job Title is required";
      isValid = false;
    }
    if (!formData.department_id) {
      tempErrors.department_id = "Department is required";
      isValid = false;
    }
    // Skills mandatory per previous code, kept here
    if (formData.skill_ids.length === 0) {
      tempErrors.skill_ids = "At least one skill is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload: Partial<JobPosition> = {
        name: formData.name,
        department_id: Number(formData.department_id),
        industry_id: formData.industry_id
          ? Number(formData.industry_id)
          : undefined,
        no_of_recruitment: Number(formData.no_of_recruitment),
        skill_ids: formData.skill_ids.map((id) => Number(id)),
        contract_type_id: formData.contract_type_id
          ? Number(formData.contract_type_id)
          : undefined,
      };

      if (data?.id) {
        await updateJob(data.id, payload);
        toast.success("Job Position updated successfully");
      } else {
        await addJob(payload);
        toast.success("Job Position created successfully");
      }
      onSuccess();
      document.getElementById("close-job-modal")?.click();
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Error saving job position data"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal fade" id="add_job_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-bottom bg-light py-2">
            <h5 className="modal-title fw-bold text-dark fs-16">
              <i className="ti ti-briefcase me-2 text-primary"></i>
              {data ? "Edit Job Position" : "Create Job Position"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-job-modal"
              onClick={resetForm}
            ></button>
          </div>

          <div className="modal-body p-4">
            <form noValidate onSubmit={handleSubmit}>
              {/* Header Info Section */}
              <div className="mb-4">
                <h6 className="fw-bold text-primary mb-3 pb-2 border-bottom fs-14">
                  Core Details
                </h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fs-13 fw-bold">
                      Job Title <span className="text-danger">*</span>
                    </label>
                    <input
                      name="name"
                      className={`form-control ${
                        isSubmitted
                          ? errors.name
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                      placeholder="e.g. Senior Software Engineer"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    {isSubmitted && errors.name && (
                      <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                        <i className="ti ti-info-circle me-1"></i>
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fs-13 fw-bold">
                      Department <span className="text-danger">*</span>
                    </label>
                    <div
                      className={
                        isSubmitted && errors.department_id
                          ? "border border-danger rounded"
                          : ""
                      }
                    >
                      <CommonSelect
                        // KEY PROP ADDED: Forces re-render when department_id changes (e.g. resets to "")
                        key={formData.department_id}
                        options={departments}
                        placeholder="Select Department"
                        defaultValue={departments.find(
                          (d) => d.value === formData.department_id
                        )}
                        onChange={(opt) =>
                          setFormData({
                            ...formData,
                            department_id: opt?.value || "",
                          })
                        }
                      />
                    </div>
                    {isSubmitted && errors.department_id && (
                      <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                        <i className="ti ti-info-circle me-1"></i>
                        {errors.department_id}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Secondary Info Section */}
              <div className="mb-4">
                <h6 className="fw-bold text-primary mb-3 pb-2 border-bottom fs-14">
                  Position Specifics
                </h6>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fs-13 fw-bold">Industry</label>
                    <CommonSelect
                      key={formData.industry_id} // KEY PROP ADDED
                      options={industries}
                      placeholder="Select Industry"
                      defaultValue={industries.find(
                        (i) => i.value === formData.industry_id
                      )}
                      onChange={(opt) =>
                        setFormData({
                          ...formData,
                          industry_id: opt?.value || "",
                        })
                      }
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fs-13 fw-bold">
                      Contract Type
                    </label>
                    <CommonSelect
                      key={formData.contract_type_id} // KEY PROP ADDED
                      options={contractTypes}
                      placeholder="Select Contract"
                      defaultValue={contractTypes.find(
                        (i) => i.value === formData.contract_type_id
                      )}
                      onChange={(opt) =>
                        setFormData({
                          ...formData,
                          contract_type_id: opt?.value || "",
                        })
                      }
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fs-13 fw-bold">
                      Target Recruitment
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="ti ti-users fs-14 text-muted"></i>
                      </span>
                      <input
                        type="number"
                        name="no_of_recruitment"
                        className="form-control border-start-0"
                        min="1"
                        value={formData.no_of_recruitment}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="mb-3">
                <h6 className="fw-bold text-primary mb-3 pb-2 border-bottom fs-14">
                  Requirements
                </h6>
                <div className="col-md-12">
                  <label className="form-label fs-13 fw-bold">
                    Required Skills <span className="text-danger">*</span>
                  </label>
                  <div
                    className={
                      isSubmitted && errors.skill_ids
                        ? "border border-danger rounded"
                        : ""
                    }
                  >
                    <CommonSelect
                      isMulti={true}
                      options={availableSkills}
                      placeholder="Search and select skills..."
                      // Controlled value (doesn't require key, but relies on formData update)
                      value={availableSkills.filter((opt) =>
                        formData.skill_ids.includes(opt.value)
                      )}
                      onChange={handleSkillChange}
                    />
                  </div>
                  {isSubmitted && errors.skill_ids && (
                    <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                      <i className="ti ti-info-circle me-1"></i>
                      {errors.skill_ids}
                    </div>
                  )}
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
                  ) : data?.id ? (
                    "Update Changes"
                  ) : (
                    "Save Job Position"
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

export default AddEditJobPositionModal;
