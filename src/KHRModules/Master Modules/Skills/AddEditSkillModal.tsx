import React, { useEffect, useState } from "react";
import { addSkill, updateSkill, Skill } from "./SkillServices";
import { toast } from "react-toastify";

interface Props {
  onSuccess: () => void;
  data: Skill | null;
}

const AddEditSkillModal: React.FC<Props> = ({ onSuccess, data }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Form State
  const [skillTypeName, setSkillTypeName] = useState("");
  const [skillNames, setSkillNames] = useState<string[]>([]);
  const [currentSkillInput, setCurrentSkillInput] = useState("");
  const [levelName, setLevelName] = useState("Intermediate");
  const [progress, setProgress] = useState(50);

  // --- 1. Populate / Reset Logic ---
  useEffect(() => {
    if (data) {
      setSkillTypeName(data.skill_type_name || "");
      setSkillNames(data.skill_names || []);
      setLevelName(data.skill_level_name || "Intermediate");
      setProgress(data.level_progress || 50);
    } else {
      resetForm();
    }
  }, [data]);

  const resetForm = () => {
    setSkillTypeName("");
    setSkillNames([]);
    setCurrentSkillInput("");
    setLevelName("Intermediate");
    setProgress(50);
    setErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  // --- 2. Modal Close Listener ---
  useEffect(() => {
    const modalElement = document.getElementById("add_skill_modal");
    const handleHidden = () => resetForm();
    modalElement?.addEventListener("hidden.bs.modal", handleHidden);
    return () =>
      modalElement?.removeEventListener("hidden.bs.modal", handleHidden);
  }, []);

  // --- 3. Tag Handling ---
  const addSkillTag = () => {
    const val = currentSkillInput.trim();
    if (val && !skillNames.includes(val)) {
      setSkillNames([...skillNames, val]);
      setCurrentSkillInput("");
      // Clear error if it exists
      if (errors.skillNames) {
        setErrors({ ...errors, skillNames: "" });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkillTag();
    }
  };

  const removeSkillTag = (index: number) => {
    setSkillNames(skillNames.filter((_, i) => i !== index));
  };

  // --- 4. Validation & Submit ---
  const validate = () => {
    let tempErrors: any = {};
    let isValid = true;

    if (!skillTypeName.trim()) {
      tempErrors.skillTypeName = "Skill Type Name is required";
      isValid = false;
    }
    if (skillNames.length === 0) {
      tempErrors.skillNames = "At least one skill tag is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validate()) return;

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
        toast.success("Skill Group updated successfully");
      } else {
        await addSkill(payload);
        toast.success("Skill Group created successfully");
      }
      onSuccess();
      document.getElementById("close-btn-skill")?.click();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error saving skill");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal fade" id="add_skill_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          {/* Standard Header */}
          <div className="modal-header border-bottom bg-light py-2">
            <h5 className="modal-title fw-bold text-dark fs-16">
              <i className="ti ti-award me-2 text-primary"></i>
              {data ? "Edit Skill Group" : "Create Skill Group"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-btn-skill"
              onClick={resetForm}
            ></button>
          </div>

          <div className="modal-body p-4">
            <form noValidate onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* Skill Type Name */}
                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">
                    Skill Type Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      isSubmitted
                        ? errors.skillTypeName
                          ? "is-invalid"
                          : "is-valid"
                        : ""
                    }`}
                    value={skillTypeName}
                    onChange={(e) => {
                      setSkillTypeName(e.target.value);
                      if (errors.skillTypeName)
                        setErrors({ ...errors, skillTypeName: "" });
                    }}
                    placeholder="e.g. Technical HR, Design Tools"
                  />
                  {isSubmitted && errors.skillTypeName && (
                    <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                      <i className="ti ti-info-circle me-1"></i>{" "}
                      {errors.skillTypeName}
                    </div>
                  )}
                </div>

                {/* Level Name */}
                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">
                    Default Level
                  </label>
                  <select
                    className="form-select"
                    value={levelName}
                    onChange={(e) => setLevelName(e.target.value)}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>

                {/* Skills Tag Input */}
                <div className="col-md-12">
                  <label className="form-label fs-13 fw-bold">
                    Add Skills <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className={`form-control ${
                        isSubmitted && errors.skillNames ? "is-invalid" : ""
                      }`}
                      value={currentSkillInput}
                      onChange={(e) => setCurrentSkillInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type skill name and press Enter (e.g. React)"
                    />
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={addSkillTag}
                    >
                      <i className="ti ti-plus"></i> Add
                    </button>
                  </div>
                  {isSubmitted && errors.skillNames && (
                    <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                      <i className="ti ti-info-circle me-1"></i>{" "}
                      {errors.skillNames}
                    </div>
                  )}

                  {/* Badges Display */}
                  <div className="mt-3 d-flex flex-wrap gap-2">
                    {skillNames.map((skill, index) => (
                      <span
                        key={index}
                        className="badge bg-soft-primary text-primary border p-2 d-flex align-items-center gap-2"
                      >
                        {skill}
                        <i
                          className="ti ti-x cursor-pointer hover-danger"
                          onClick={() => removeSkillTag(index)}
                          title="Remove"
                        ></i>
                      </span>
                    ))}
                    {skillNames.length === 0 && !errors.skillNames && (
                      <span className="text-muted fs-12 fst-italic">
                        No skills added yet.
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Slider */}
                <div className="col-md-12 mt-4">
                  <label className="form-label fs-13 fw-bold d-flex justify-content-between">
                    <span>Default Proficiency</span>
                    <span className="text-primary">{progress}%</span>
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="100"
                    step="5"
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                  />
                  <div className="d-flex justify-content-between fs-11 text-muted">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Standard Footer */}
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
                    "Save Skill Group"
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

export default AddEditSkillModal;

// import React, { useEffect, useState } from "react";
// import { addSkill, updateSkill, Skill } from "./SkillServices";
// import { toast } from "react-toastify";

// interface Props {
//   onSuccess: () => void;
//   data: Skill | null;
// }

// const AddEditSkillModal: React.FC<Props> = ({ onSuccess, data }) => {
//   const [skillTypeName, setSkillTypeName] = useState("");
//   const [skillNames, setSkillNames] = useState<string[]>([]);
//   const [currentSkillInput, setCurrentSkillInput] = useState("");
//   const [levelName, setLevelName] = useState("Intermediate");
//   const [progress, setProgress] = useState(50);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [validated, setValidated] = useState(false); // Validation State

//   useEffect(() => {
//     if (data) {
//       setSkillTypeName(data.skill_type_name || "");
//       setSkillNames(data.skill_names || []);
//       setLevelName(data.skill_level_name || "Intermediate");
//       setProgress(data.level_progress || 50);
//     } else {
//       resetForm();
//     }
//     setValidated(false);
//   }, [data]);

//   // Listener to clear state and validation when modal is closed
//   useEffect(() => {
//     const modalElement = document.getElementById("add_skill_modal");
//     const handleHidden = () => {
//       resetForm();
//       setValidated(false);
//     };
//     modalElement?.addEventListener("hidden.bs.modal", handleHidden);
//     return () =>
//       modalElement?.removeEventListener("hidden.bs.modal", handleHidden);
//   }, []);

//   const resetForm = () => {
//     setSkillTypeName("");
//     setSkillNames([]);
//     setCurrentSkillInput("");
//     setLevelName("Intermediate");
//     setProgress(50);
//   };

//   const addSkillTag = () => {
//     if (
//       currentSkillInput.trim() &&
//       !skillNames.includes(currentSkillInput.trim())
//     ) {
//       setSkillNames([...skillNames, currentSkillInput.trim()]);
//       setCurrentSkillInput("");
//     }
//   };

//   const removeSkillTag = (index: number) => {
//     setSkillNames(skillNames.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const form = e.currentTarget;
//     setValidated(true);

//     // Validate standard fields and ensure at least one skill tag exists
//     if (form.checkValidity() === false || skillNames.length === 0) {
//       if (skillNames.length === 0) {
//         toast.error("Please add at least one skill tag using the 'Add' button");
//       }
//       return;
//     }

//     setIsSubmitting(true);
//     const payload = {
//       skill_type_name: skillTypeName.trim(),
//       skill_names: skillNames,
//       skill_level_name: levelName,
//       level_progress: Number(progress),
//       default_level: true,
//     };

//     try {
//       if (data && data.id) {
//         await updateSkill(data.id, payload);
//         toast.success("Skill Group updated!");
//       } else {
//         await addSkill(payload);
//         toast.success("Skill Group created!");
//       }
//       document.getElementById("close-btn-skill")?.click();
//       onSuccess();
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Error saving skill");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="modal custom-modal fade" id="add_skill_modal" role="dialog">
//       <div className="modal-dialog modal-dialog-centered modal-lg">
//         <div className="modal-content">
//           <div className="modal-header border-0">
//             <h5 className="modal-title">
//               {data ? "Edit Skill Group" : "Add Skill Group"}
//             </h5>
//             <button
//               type="button"
//               className="btn-close"
//               data-bs-dismiss="modal"
//               id="close-btn-skill"
//             ></button>
//           </div>
//           <div className="modal-body">
//             <form
//               className={`needs-validation ${validated ? "was-validated" : ""}`}
//               noValidate
//               onSubmit={handleSubmit}
//             >
//               <div className="row">
//                 {/* Skill Type Name */}
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Skill Type Name <span className="text-danger">*</span>
//                   </label>
//                   <input
//                     className="form-control"
//                     required
//                     value={skillTypeName}
//                     onChange={(e) => setSkillTypeName(e.target.value)}
//                     placeholder="e.g. Technical HR"
//                   />
//                   <div className="invalid-feedback">
//                     Please enter a skill type.
//                   </div>
//                 </div>

//                 {/* Level Name */}
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Level Name</label>
//                   <select
//                     className="form-select"
//                     value={levelName}
//                     onChange={(e) => setLevelName(e.target.value)}
//                   >
//                     <option value="Beginner">Beginner</option>
//                     <option value="Intermediate">Intermediate</option>
//                     <option value="Advanced">Advanced</option>
//                   </select>
//                 </div>

//                 {/* Skill Tags Input */}
//                 <div className="col-md-12 mb-3">
//                   <label className="form-label">
//                     Add Skills <span className="text-danger">*</span> (Type and
//                     click Add)
//                   </label>
//                   <div className="input-group">
//                     <input
//                       className={`form-control ${
//                         validated && skillNames.length === 0 ? "is-invalid" : ""
//                       }`}
//                       value={currentSkillInput}
//                       onChange={(e) => setCurrentSkillInput(e.target.value)}
//                       placeholder="Enter skill name (e.g. React)"
//                     />
//                     <button
//                       className="btn btn-primary"
//                       type="button"
//                       onClick={addSkillTag}
//                     >
//                       Add
//                     </button>
//                     <div className="invalid-feedback">
//                       At least one skill tag is required.
//                     </div>
//                   </div>

//                   {/* Badges Display */}
//                   <div className="mt-2 d-flex flex-wrap gap-2">
//                     {skillNames.map((skill, index) => (
//                       <span
//                         key={index}
//                         className="badge bg-soft-info text-info p-2 border border-info-light"
//                       >
//                         {skill}
//                         <i
//                           className="ti ti-x ms-2 cursor-pointer"
//                           onClick={() => removeSkillTag(index)}
//                         ></i>
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Progress Slider */}
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Progress ({progress}%)</label>
//                   <input
//                     type="range"
//                     className="form-range"
//                     min="0"
//                     max="100"
//                     value={progress}
//                     onChange={(e) => setProgress(Number(e.target.value))}
//                   />
//                 </div>
//               </div>

//               <div className="modal-footer border-0">
//                 <button
//                   type="button"
//                   className="btn btn-light"
//                   data-bs-dismiss="modal"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn btn-primary"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? "Saving..." : "Save Skill Group"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddEditSkillModal;
