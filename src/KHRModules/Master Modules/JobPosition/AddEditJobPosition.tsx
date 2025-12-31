import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CommonSelect from "../../../core/common/commonSelect";
import CommonAlertCard from "@/CommonComponent/AlertKHR/CommonAlertCard";
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
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  // Dropdown States
  const [departments, setDepartments] = useState<DropdownOption[]>([]);
  const [industries, setIndustries] = useState<DropdownOption[]>([]);
  const [contractTypes, setContractTypes] = useState<DropdownOption[]>([]); // New state
  const [availableSkills, setAvailableSkills] = useState<DropdownOption[]>([]);

  const initialFormState = {
    name: "",
    department_id: "",
    industry_id: "",
    no_of_recruitment: 1,
    skill_ids: [] as string[], // Will store array of strings
    contract_type_id: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  // Fetch Dropdowns on Mount
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

        // Fix 1: Properly extract arrays from responses
        const deptList = deptRes.data.data || deptRes.data || [];
        const indList = indRes.data.data || indRes.data || [];

        // Fix 2: Handle the contractRes properly (if it's a direct array or wrapped in .data)
        const contractList = Array.isArray(contractRes)
          ? contractRes
          : contractRes.data?.data || contractRes.data || [];

        // Extract individual skill names
        const allSkillNames: string[] = [];
        const skillOptions: DropdownOption[] = [];
        skillData.forEach((group: any) => {
          // Check for 'skills' array (objects with id/name)
          if (Array.isArray(group.skills)) {
            group.skills.forEach((s: any) => {
              if (!skillOptions.find((opt) => opt.value === String(s.id))) {
                skillOptions.push({ value: String(s.id), label: s.name });
              }
            });
          }
          // Check for direct 'skill_ids' (if your API returns names only in some cases)
          else if (Array.isArray(group.skill_ids)) {
            group.skill_ids.forEach((name: string, index: number) => {
              skillOptions.push({ value: name, label: name });
            });
          }
        });

        // Set states with mapped values
        setDepartments(
          deptList.map((d: any) => ({ value: String(d.id), label: d.name }))
        );
        setIndustries(
          indList.map((i: any) => ({ value: String(i.id), label: i.name }))
        );
        setAvailableSkills(skillOptions);

        // Fix 3: Ensure contractTypes state is set correctly
        setContractTypes(
          contractList.map((c: any) => ({ value: String(c.id), label: c.name }))
        );
      } catch (error) {
        console.error("Error fetching dropdowns", error);
      }
    };
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        department_id: String(data.department_id || ""),
        industry_id: data.industry_id ? String(data.industry_id) : "",
        no_of_recruitment: data.no_of_recruitment || 1,
        // skill_ids: data.skill_ids || [],
        skill_ids: data.skill_ids ? data.skill_ids.map((id) => String(id)) : [],
        contract_type_id: data.contract_type_id
          ? String(data.contract_type_id)
          : "",
      });
    } else {
      resetForm();
    }
  }, [data]);

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsSubmitted(false);
    setShowErrorAlert(false);
  };

  const validateForm = () => {
    let tempErrors: any = {};
    let isValid = true;

    if (!formData.name?.trim()) {
      tempErrors.name = "Job Title is required.";
      isValid = false;
    }
    if (!formData.department_id) {
      tempErrors.department_id = "Department is required.";
      isValid = false;
    }
    if (formData.skill_ids.length === 0) {
      tempErrors.skill_ids = "At least one skill is required.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  // --- Multi-Select Skill Handler ---
  // const handleSkillChange = (selectedOptions: any) => {
  //   const values = selectedOptions
  //     ? selectedOptions.map((opt: any) => opt.value)
  //     : [];
  //   setFormData({ ...formData, skill_ids: values });
  //   if (errors.skill_ids) setErrors({ ...errors, skill_ids: "" });
  // };

  const handleSkillChange = (selectedOptions: any) => {
    const values = selectedOptions
      ? selectedOptions.map((opt: any) => opt.value)
      : [];
    setFormData({ ...formData, skill_ids: values });
    if (errors.skill_ids) setErrors({ ...errors, skill_ids: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validateForm()) {
      setShowErrorAlert(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<JobPosition> = {
        name: formData.name,
        department_id: Number(formData.department_id),
        industry_id: formData.industry_id
          ? Number(formData.industry_id)
          : undefined,
        no_of_recruitment: Number(formData.no_of_recruitment),
        // skill_ids: formData.skill_ids, // Sending array of strings
        skill_ids: formData.skill_ids.map((id) => Number(id)),
        // skill_ids: formData.contract_type_id,
        contract_type_id: formData.contract_type_id
          ? Number(formData.contract_type_id)
          : undefined,
      };

      if (data?.id) {
        await updateJob(data.id, payload);
        toast.success("Job Position updated!");
      } else {
        await addJob(payload);
        toast.success("Job Position created!");
      }
      onSuccess();
      document.getElementById("close-job-modal")?.click();
    } catch (err: any) {
      toast.error("Error saving job position");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal fade" id="add_job_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content bg-white border-0">
          <div className="modal-header border-0 bg-white pb-0">
            <h4 className="modal-title fw-bold">Job Position Master Entry</h4>
            <button
              type="button"
              id="close-job-modal"
              className="btn-close"
              data-bs-dismiss="modal"
              onClick={resetForm}
            ></button>
          </div>

          <div className="modal-body">
            <form noValidate onSubmit={handleSubmit}>
              {/* Header Info */}
              <div className="row g-3 mb-4 bg-light p-3 rounded mx-0 align-items-center border shadow-sm">
                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">
                    Job Title *
                  </label>
                  <input
                    className={`form-control ${
                      isSubmitted && errors.name ? "is-invalid" : ""
                    }`}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">
                    Department *
                  </label>
                  <CommonSelect
                    options={departments}
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
              </div>

              {/* Body Info */}
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fs-13">Industry</label>
                  <CommonSelect
                    options={industries}
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
                  <label className="form-label fs-13">Contract Type</label>
                  <CommonSelect
                    options={contractTypes}
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
                  <label className="form-label fs-13">Recruitments</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.no_of_recruitment}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        no_of_recruitment: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <hr className="my-4 opacity-25" />

                {/* --- MULTI-SELECT SKILLS --- */}
                <div className="col-md-12">
                  <label className="form-label fs-13 fw-bold">
                    Required Skills *
                  </label>
                  <CommonSelect
                    isMulti={true}
                    options={availableSkills}
                    placeholder="Search and select multiple skills..."
                    // Matches the string IDs stored in skill_ids to the available options
                    value={availableSkills.filter((opt) =>
                      formData.skill_ids.includes(opt.value)
                    )}
                    className={
                      isSubmitted && errors.skill_ids ? "border-danger" : ""
                    }
                    onChange={handleSkillChange}
                  />
                  {isSubmitted && errors.skill_ids && (
                    <div className="text-danger fs-11 mt-1">
                      {errors.skill_ids}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer border-0 bg-white px-0 mt-4">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-5"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Save Job Position"}
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
