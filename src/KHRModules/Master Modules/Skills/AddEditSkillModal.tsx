import React, { useEffect, useState } from "react";
import { addSkill, updateSkill, Skill } from "./SkillServices";
import { toast } from "react-toastify";

interface Props {
  onSuccess: () => void;
  data: Skill | null;
}

const AddEditSkillModal: React.FC<Props> = ({ onSuccess, data }) => {
  const [skillTypeName, setSkillTypeName] = useState("");
  const [skillNames, setSkillNames] = useState<string[]>([]);
  const [currentSkillInput, setCurrentSkillInput] = useState("");
  const [levelName, setLevelName] = useState("Intermediate");
  const [progress, setProgress] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validated, setValidated] = useState(false); // Validation State

  useEffect(() => {
    if (data) {
      setSkillTypeName(data.skill_type_name || "");
      setSkillNames(data.skill_names || []);
      setLevelName(data.skill_level_name || "Intermediate");
      setProgress(data.level_progress || 50);
    } else {
      resetForm();
    }
    setValidated(false);
  }, [data]);

  // Listener to clear state and validation when modal is closed
  useEffect(() => {
    const modalElement = document.getElementById("add_skill_modal");
    const handleHidden = () => {
      resetForm();
      setValidated(false);
    };
    modalElement?.addEventListener("hidden.bs.modal", handleHidden);
    return () =>
      modalElement?.removeEventListener("hidden.bs.modal", handleHidden);
  }, []);

  const resetForm = () => {
    setSkillTypeName("");
    setSkillNames([]);
    setCurrentSkillInput("");
    setLevelName("Intermediate");
    setProgress(50);
  };

  const addSkillTag = () => {
    if (
      currentSkillInput.trim() &&
      !skillNames.includes(currentSkillInput.trim())
    ) {
      setSkillNames([...skillNames, currentSkillInput.trim()]);
      setCurrentSkillInput("");
    }
  };

  const removeSkillTag = (index: number) => {
    setSkillNames(skillNames.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;
    setValidated(true);

    // Validate standard fields and ensure at least one skill tag exists
    if (form.checkValidity() === false || skillNames.length === 0) {
      if (skillNames.length === 0) {
        toast.error("Please add at least one skill tag using the 'Add' button");
      }
      return;
    }

    setIsSubmitting(true);
    const payload = {
      skill_type_name: skillTypeName.trim(),
      skill_names: skillNames,
      skill_level_name: levelName,
      level_progress: Number(progress),
      default_level: true,
    };

    try {
      if (data && data.id) {
        await updateSkill(data.id, payload);
        toast.success("Skill Group updated!");
      } else {
        await addSkill(payload);
        toast.success("Skill Group created!");
      }
      document.getElementById("close-btn-skill")?.click();
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error saving skill");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal custom-modal fade" id="add_skill_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title">
              {data ? "Edit Skill Group" : "Add Skill Group"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-btn-skill"
            ></button>
          </div>
          <div className="modal-body">
            <form
              className={`needs-validation ${validated ? "was-validated" : ""}`}
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="row">
                {/* Skill Type Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Skill Type Name <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    required
                    value={skillTypeName}
                    onChange={(e) => setSkillTypeName(e.target.value)}
                    placeholder="e.g. Technical HR"
                  />
                  <div className="invalid-feedback">
                    Please enter a skill type.
                  </div>
                </div>

                {/* Level Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Level Name</label>
                  <select
                    className="form-select"
                    value={levelName}
                    onChange={(e) => setLevelName(e.target.value)}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                {/* Skill Tags Input */}
                <div className="col-md-12 mb-3">
                  <label className="form-label">
                    Add Skills <span className="text-danger">*</span> (Type and
                    click Add)
                  </label>
                  <div className="input-group">
                    <input
                      className={`form-control ${
                        validated && skillNames.length === 0 ? "is-invalid" : ""
                      }`}
                      value={currentSkillInput}
                      onChange={(e) => setCurrentSkillInput(e.target.value)}
                      placeholder="Enter skill name (e.g. React)"
                    />
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={addSkillTag}
                    >
                      Add
                    </button>
                    <div className="invalid-feedback">
                      At least one skill tag is required.
                    </div>
                  </div>

                  {/* Badges Display */}
                  <div className="mt-2 d-flex flex-wrap gap-2">
                    {skillNames.map((skill, index) => (
                      <span
                        key={index}
                        className="badge bg-soft-info text-info p-2 border border-info-light"
                      >
                        {skill}
                        <i
                          className="ti ti-x ms-2 cursor-pointer"
                          onClick={() => removeSkillTag(index)}
                        ></i>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress Slider */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Progress ({progress}%)</label>
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                  />
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
                  {isSubmitting ? "Saving..." : "Save Skill Group"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditSkillModal;
