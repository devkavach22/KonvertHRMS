import React, { useEffect, useState } from "react";
import CommonSelect from "../../../core/common/commonSelect";
import { Checkbox, Switch } from "antd";
import { toast } from "react-toastify";
import {
  getSalaryRuleCategories,
  getStructureTypes,
  getInputTypes,
  addSalaryRule,
  updateSalaryRule,
} from "./SalaryRuleService";

const AddEditSalaryRuleModal = ({ onSuccess, data, onClose }: any) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [structures, setStructures] = useState<any[]>([]);
  const [inputTypes, setInputTypes] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: "",
    code: "",
    category_id: "",
    sequence: 1,
    struct_id: "",
    active: true,
    appears_on_payslip: true,
    appears_on_employee_cost_dashboard: false,
    appears_on_payroll_report: true,
    condition_select: "none",
    condition_range: "",
    condition_range_min: 0,
    condition_range_max: 0,
    condition_other_input_id: "",
    condition_python: "",
    amount_select: "fix",
    amount_percentage_base: "",
    quantity: 1,
    amount_percentage: 0,
    amount_fix: 0,
    amount_other_input_id: "",
    amount_python_compute: "",
    note: "",
  });

  const conditionOptions = [
    { value: "none", label: "Always True" },
    { value: "range", label: "Range" },
    { value: "input", label: "Other Input" },
    { value: "python", label: "Python Expression" },
  ];

  const amountOptions = [
    { value: "percentage", label: "Percentage (%)" },
    { value: "fix", label: "Fixed Amount" },
    { value: "input", label: "Other Input" },
    { value: "code", label: "Python Code" },
  ];

  useEffect(() => {
    const loadDropdowns = async () => {
      const [cats, structs, inputs] = await Promise.all([
        getSalaryRuleCategories(),
        getStructureTypes(),
        getInputTypes(),
      ]);
      setCategories(
        cats.map((c: any) => ({ value: String(c.id), label: c.name })),
      );
      setStructures(
        structs.map((s: any) => ({ value: String(s.id), label: s.name })),
      );
      setInputTypes(
        inputs.map((i: any) => ({ value: String(i.id), label: i.name })),
      );
    };
    loadDropdowns();
  }, []);

  // --- THIS SECTION HANDLES THE DATA SETTING ON EDIT ---
  useEffect(() => {
    if (data) {
      const parseValue = (val: any) =>
        Array.isArray(val) ? String(val[0]) : val ? String(val) : "";

      setFormData({
        ...data,
        category_id: parseValue(data.category_id),
        struct_id: parseValue(data.struct_id),
        condition_other_input_id: parseValue(data.condition_other_input_id),
        amount_other_input_id: parseValue(data.amount_other_input_id),
        // Ensure switches handle boolean correctly
        active: !!data.active,
        appears_on_payslip: !!data.appears_on_payslip,
        // Handle potentially null notes
        note: data.note?.replace(/<[^>]*>?/gm, "") || "",
      });
    } else {
      resetForm();
    }
  }, [data]);

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      category_id: "",
      sequence: 1,
      struct_id: "",
      active: true,
      appears_on_payslip: true,
      condition_select: "none",
      amount_select: "fix",
      quantity: 1,
      amount_fix: 0,
      note: "",
    });
    setIsSubmitted(false);
  };

  const getBorderClass = (value: any) => {
    if (!isSubmitted) return "border rounded";
    // Check if value exists to toggle Green (Success) or Red (Danger)
    return value && value !== "false"
      ? "border border-success rounded shadow-sm"
      : "border border-danger rounded shadow-sm";
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (
      !formData.name ||
      !formData.code ||
      !formData.category_id ||
      !formData.struct_id
    ) {
      toast.error("Required fields are missing");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        category_id: Number(formData.category_id),
        struct_id: Number(formData.struct_id),
        condition_other_input_id: formData.condition_other_input_id
          ? Number(formData.condition_other_input_id)
          : null,
        amount_other_input_id: formData.amount_other_input_id
          ? Number(formData.amount_other_input_id)
          : null,
      };
      if (data?.id) await updateSalaryRule(data.id, payload);
      else await addSalaryRule(payload);
      toast.success("Saved successfully");
      onSuccess();
      document.getElementById("close-rule-modal")?.click();
    } catch (error) {
      toast.error("Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal fade" id="add_salary_rule" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content">
          <div className="modal-header border-bottom bg-light">
            <h5 className="modal-title fw-bold fs-15">
              {data ? "Edit Salary Rule" : "Add Salary Rule"}
            </h5>
            <button
              type="button"
              id="close-rule-modal"
              className="btn-close"
              data-bs-dismiss="modal"
              onClick={resetForm}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSave}>
              {/* Header Info */}
              <div className="row g-3 mb-4 bg-light p-3 rounded mx-0 border">
                <div className="col-md-3">
                  <label className="form-label fs-13 fw-bold">
                    Rule Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${isSubmitted ? (formData.name ? "is-valid" : "is-invalid") : ""}`}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label fs-13 fw-bold">
                    Code <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${isSubmitted ? (formData.code ? "is-valid" : "is-invalid") : ""}`}
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fs-13 fw-bold">
                    Category <span className="text-danger">*</span>
                  </label>
                  <div className={getBorderClass(formData.category_id)}>
                    <CommonSelect
                      options={categories}
                      value={categories.find(
                        (c) => c.value === formData.category_id,
                      )}
                      onChange={(opt: any) =>
                        setFormData({ ...formData, category_id: opt?.value })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <label className="form-label fs-13 fw-bold">
                    Structure <span className="text-danger">*</span>
                  </label>
                  <div className={getBorderClass(formData.struct_id)}>
                    <CommonSelect
                      options={structures}
                      value={structures.find(
                        (s) => s.value === formData.struct_id,
                      )}
                      onChange={(opt: any) =>
                        setFormData({ ...formData, struct_id: opt?.value })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-1">
                  <label className="form-label fs-13 fw-bold">Seq</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.sequence}
                    onChange={(e) =>
                      setFormData({ ...formData, sequence: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Settings Switches */}
              {/* --- SETTINGS BAR --- */}
              <div className="row mb-4 mx-0 py-3 rounded bg-light border-top border-bottom d-flex align-items-center justify-content-between">
                <div className="col-12 d-flex flex-wrap align-items-center gap-4">
                  {/* Active Status Toggle */}
                  <div className="d-flex align-items-center gap-2 pe-4 border-end">
                    <label className="mb-0 fs-13 fw-bold text-secondary">
                      Status:
                    </label>
                    <div className="d-flex align-items-center gap-2">
                      <Switch
                        size="small"
                        checked={formData.active}
                        onChange={(c) =>
                          setFormData({ ...formData, active: c })
                        }
                      />
                      <span
                        className={`fs-13 fw-medium ${formData.active ? "text-success" : "text-danger"}`}
                      >
                        {formData.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  {/* Visibility Options */}
                  <div className="d-flex flex-wrap align-items-center gap-4 ps-2">
                    <Checkbox
                      className="custom-checkbox fs-13 fw-medium"
                      checked={formData.appears_on_payslip}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          appears_on_payslip: e.target.checked,
                        })
                      }
                    >
                      Show on Payslip
                    </Checkbox>

                    <Checkbox
                      className="custom-checkbox fs-13 fw-medium"
                      checked={formData.appears_on_employee_cost_dashboard}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          appears_on_employee_cost_dashboard: e.target.checked,
                        })
                      }
                    >
                      Employer Dashboard
                    </Checkbox>

                    <Checkbox
                      className="custom-checkbox fs-13 fw-medium"
                      checked={formData.appears_on_payroll_report}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          appears_on_payroll_report: e.target.checked,
                        })
                      }
                    >
                      Payroll Reporting
                    </Checkbox>
                  </div>
                </div>
              </div>

              {/* Condition Logic */}
              <div className="form-section mb-4">
                <h6 className="fw-bold text-primary mb-3">
                  <i className="ti ti-filter fs-18 me-2"></i>Condition
                </h6>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Condition Based on</label>
                    <CommonSelect
                      options={conditionOptions}
                      value={conditionOptions.find(
                        (o) => o.value === formData.condition_select,
                      )}
                      onChange={(opt: any) =>
                        setFormData({
                          ...formData,
                          condition_select: opt.value,
                        })
                      }
                    />
                  </div>
                  {formData.condition_select === "input" && (
                    <div className="col-md-4">
                      <label className="form-label fs-13">Other Input</label>
                      <div
                        className={getBorderClass(
                          formData.condition_other_input_id,
                        )}
                      >
                        <CommonSelect
                          options={inputTypes}
                          value={inputTypes.find(
                            (i) =>
                              i.value === formData.condition_other_input_id,
                          )}
                          onChange={(opt: any) =>
                            setFormData({
                              ...formData,
                              condition_other_input_id: opt?.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                  {formData.condition_select === "python" && (
                    <div className="col-md-8">
                      <label className="form-label fs-13 fw-bold text-success">
                        Python Expression
                      </label>
                      <textarea
                        className="form-control font-monospace fs-12 bg-dark text-info border-0"
                        rows={3}
                        value={formData.condition_python}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            condition_python: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Computation Logic */}
              <div className="form-section mb-4">
                <h6 className="fw-bold text-primary mb-3">
                  <i className="ti ti-adjustments fs-18 me-2"></i>Computation
                </h6>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Amount Type</label>
                    <CommonSelect
                      options={amountOptions}
                      value={amountOptions.find(
                        (o) => o.value === formData.amount_select,
                      )}
                      onChange={(opt: any) =>
                        setFormData({ ...formData, amount_select: opt.value })
                      }
                    />
                  </div>
                  {formData.amount_select === "input" && (
                    <div className="col-md-4">
                      <label className="form-label fs-13">Other Input</label>
                      <div
                        className={getBorderClass(
                          formData.amount_other_input_id,
                        )}
                      >
                        <CommonSelect
                          options={inputTypes}
                          value={inputTypes.find(
                            (i) => i.value === formData.amount_other_input_id,
                          )}
                          onChange={(opt: any) =>
                            setFormData({
                              ...formData,
                              amount_other_input_id: opt?.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                  {formData.amount_select === "code" && (
                    <div className="col-md-8">
                      <label className="form-label fs-13 fw-bold text-success">
                        Python Code
                      </label>
                      <textarea
                        className="form-control font-monospace fs-12 bg-dark text-info border-0"
                        rows={4}
                        value={formData.amount_python_compute}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            amount_python_compute: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="col-12 mt-3">
                <label className="form-label fs-13">Description</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                />
              </div>
            </form>
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
              className="btn btn-primary px-5"
              disabled={isSubmitting}
              onClick={handleSave}
            >
              Save Rule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditSalaryRuleModal;

// import React, { useEffect, useState } from "react";
// import CommonSelect from "../../../core/common/commonSelect";
// import { Checkbox, Switch } from "antd";
// import { toast } from "react-toastify";
// import {
//   getSalaryRuleCategories,
//   getStructureTypes,
//   getInputTypes,
//   addSalaryRule,
//   updateSalaryRule,
// } from "./SalaryRuleService";

// const AddEditSalaryRuleModal = ({ onSuccess, data, onClose }: any) => {
//   const [categories, setCategories] = useState([]);
//   const [structures, setStructures] = useState([]);
//   const [inputTypes, setInputTypes] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [errors, setErrors] = useState<any>({});

//   const [formData, setFormData] = useState<any>({
//     name: "",
//     code: "",
//     category_id: "",
//     sequence: 1,
//     struct_id: "",
//     active: true,
//     appears_on_payslip: true,
//     appears_on_employee_cost_dashboard: false,
//     appears_on_payroll_report: true,
//     condition_select: "none",
//     condition_range: "",
//     condition_range_min: 0,
//     condition_range_max: 0,
//     condition_other_input_id: "",
//     condition_python: "",
//     amount_select: "fix",
//     amount_percentage_base: "",
//     quantity: 1,
//     amount_percentage: 0,
//     amount_fix: 0,
//     amount_other_input_id: "",
//     amount_python_compute: "",
//     note: "",
//   });

//   const conditionOptions = [
//     { value: "none", label: "Always True" },
//     { value: "range", label: "Range" },
//     { value: "input", label: "Other Input" },
//     { value: "python", label: "Python Expression" },
//   ];

//   const amountOptions = [
//     { value: "percentage", label: "Percentage (%)" },
//     { value: "fix", label: "Fixed Amount" },
//     { value: "input", label: "Other Input" },
//     { value: "code", label: "Python Code" },
//   ];

//   useEffect(() => {
//     const loadDropdowns = async () => {
//       const [cats, structs, inputs] = await Promise.all([
//         getSalaryRuleCategories(),
//         getStructureTypes(),
//         getInputTypes(),
//       ]);
//       setCategories(
//         cats.map((c: any) => ({ value: String(c.id), label: c.name })),
//       );
//       setStructures(
//         structs.map((s: any) => ({ value: String(s.id), label: s.name })),
//       );
//       setInputTypes(
//         inputs.map((i: any) => ({ value: String(i.id), label: i.name })),
//       );
//     };
//     loadDropdowns();
//   }, []);

//   useEffect(() => {
//     if (data) {
//       setFormData({
//         ...data,
//         category_id: String(data.category_id),
//         struct_id: String(data.struct_id),
//         condition_other_input_id: data.condition_other_input_id
//           ? String(data.condition_other_input_id)
//           : "",
//         amount_other_input_id: data.amount_other_input_id
//           ? String(data.amount_other_input_id)
//           : "",
//       });
//     } else {
//       resetForm();
//     }
//   }, [data]);

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       code: "",
//       category_id: "",
//       sequence: 1,
//       struct_id: "",
//       active: true,
//       appears_on_payslip: true,
//       condition_select: "none",
//       amount_select: "fix",
//       quantity: 1,
//       amount_fix: 0,
//       note: "",
//     });
//     setErrors({});
//     setIsSubmitted(false);
//   };

//   const validate = () => {
//     let tempErrors: any = {};
//     if (!formData.name?.trim()) tempErrors.name = "Rule Name is required.";
//     if (!formData.code?.trim()) tempErrors.code = "Rule Code is required.";
//     if (!formData.category_id) tempErrors.category_id = "Category is required.";
//     if (!formData.struct_id) tempErrors.struct_id = "Structure is required.";
//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   const handleSave = async (e: any) => {
//     e.preventDefault();
//     setIsSubmitted(true);
//     if (!validate()) return;

//     setIsSubmitting(true);
//     try {
//       const payload = {
//         ...formData,
//         category_id: Number(formData.category_id),
//         struct_id: Number(formData.struct_id),
//         condition_other_input_id: formData.condition_other_input_id
//           ? Number(formData.condition_other_input_id)
//           : null,
//         amount_other_input_id: formData.amount_other_input_id
//           ? Number(formData.amount_other_input_id)
//           : null,
//       };
//       if (data?.id) await updateSalaryRule(data.id, payload);
//       else await addSalaryRule(payload);
//       toast.success("Salary Rule saved successfully");
//       onSuccess();
//       document.getElementById("close-rule-modal")?.click();
//     } catch (error) {
//       toast.error("Error saving salary rule");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getValidationClass = (value: any) => {
//     if (!isSubmitted) return "border rounded";
//     return value
//       ? "border border-success rounded shadow-sm"
//       : "border border-danger rounded shadow-sm";
//   };

//   return (
//     <div className="modal fade" id="add_salary_rule" role="dialog">
//       <div className="modal-dialog modal-dialog-centered modal-xl">
//         <div className="modal-content border-0 shadow-lg">
//           <div className="modal-header border-bottom bg-light py-2">
//             <h5 className="modal-title fw-bold fs-15">
//               <i className="ti ti-calculator me-2 text-primary"></i>
//               {data ? "Edit Salary Rule" : "Add Salary Rule"}
//             </h5>
//             <button
//               type="button"
//               id="close-rule-modal"
//               className="btn-close"
//               data-bs-dismiss="modal"
//               onClick={resetForm}
//             ></button>
//           </div>
//           <div className="modal-body">
//             <form onSubmit={handleSave} noValidate>
//               {/* --- HEADER SECTION --- */}
//               <div className="row g-3 mb-4 bg-light p-3 rounded mx-0 border shadow-sm align-items-end">
//                 <div className="col-md-3">
//                   <label className="form-label fs-13 fw-bold">
//                     Rule Name <span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className={`form-control ${isSubmitted ? (formData.name ? "is-valid" : "is-invalid") : ""}`}
//                     value={formData.name}
//                     onChange={(e) =>
//                       setFormData({ ...formData, name: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div className="col-md-2">
//                   <label className="form-label fs-13 fw-bold">
//                     Code <span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className={`form-control ${isSubmitted ? (formData.code ? "is-valid" : "is-invalid") : ""}`}
//                     value={formData.code}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         code: e.target.value.toUpperCase(),
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="col-md-3">
//                   <label className="form-label fs-13 fw-bold">
//                     Category <span className="text-danger">*</span>
//                   </label>
//                   <div className={getValidationClass(formData.category_id)}>
//                     <CommonSelect
//                       options={categories}
//                       value={categories.find(
//                         (c: any) => c.value === formData.category_id,
//                       )}
//                       onChange={(opt: any) =>
//                         setFormData({ ...formData, category_id: opt?.value })
//                       }
//                     />
//                   </div>
//                 </div>
//                 <div className="col-md-3">
//                   <label className="form-label fs-13 fw-bold">
//                     Structure <span className="text-danger">*</span>
//                   </label>
//                   <div className={getValidationClass(formData.struct_id)}>
//                     <CommonSelect
//                       options={structures}
//                       value={structures.find(
//                         (s: any) => s.value === formData.struct_id,
//                       )}
//                       onChange={(opt: any) =>
//                         setFormData({ ...formData, struct_id: opt?.value })
//                       }
//                     />
//                   </div>
//                 </div>
//                 <div className="col-md-1 text-center">
//                   <label className="form-label fs-13 fw-bold">Seq</label>
//                   <input
//                     type="number"
//                     className="form-control text-center"
//                     value={formData.sequence}
//                     onChange={(e) =>
//                       setFormData({ ...formData, sequence: e.target.value })
//                     }
//                   />
//                 </div>
//               </div>

//               {/* --- SETTINGS --- */}
//               <div className="row mb-4 px-2">
//                 <div className="col-md-12 d-flex flex-wrap gap-4 align-items-center py-2 border-bottom border-top bg-light-subtle">
//                   <div className="d-flex align-items-center gap-2">
//                     <label className="mb-0 fs-13 fw-bold">Active</label>
//                     <Switch
//                       checked={formData.active}
//                       onChange={(checked) =>
//                         setFormData({ ...formData, active: checked })
//                       }
//                     />
//                   </div>
//                   <Checkbox
//                     checked={formData.appears_on_payslip}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         appears_on_payslip: e.target.checked,
//                       })
//                     }
//                   >
//                     Appears on Payslip
//                   </Checkbox>
//                   <Checkbox
//                     checked={formData.appears_on_employee_cost_dashboard}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         appears_on_employee_cost_dashboard: e.target.checked,
//                       })
//                     }
//                   >
//                     Employer Dashboard
//                   </Checkbox>
//                   <Checkbox
//                     checked={formData.appears_on_payroll_report}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         appears_on_payroll_report: e.target.checked,
//                       })
//                     }
//                   >
//                     Payroll Reporting
//                   </Checkbox>
//                 </div>
//               </div>

//               {/* --- CONDITION SECTION --- */}
//               <div className="form-section mb-4">
//                 <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
//                   <i className="ti ti-filter fs-18 me-2"></i> Condition
//                 </h6>
//                 <div className="row g-3">
//                   <div className="col-md-4">
//                     <label className="form-label fs-13">
//                       Condition Based on
//                     </label>
//                     <CommonSelect
//                       options={conditionOptions}
//                       value={conditionOptions.find(
//                         (o) => o.value === formData.condition_select,
//                       )}
//                       onChange={(opt: any) =>
//                         setFormData({
//                           ...formData,
//                           condition_select: opt.value,
//                         })
//                       }
//                     />
//                   </div>
//                   {formData.condition_select === "range" && (
//                     <div className="col-md-8 row g-2">
//                       <div className="col-md-4">
//                         <label className="form-label fs-13">Range On</label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={formData.condition_range}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               condition_range: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div className="col-md-4">
//                         <label className="form-label fs-13">Min</label>
//                         <input
//                           type="number"
//                           className="form-control"
//                           value={formData.condition_range_min}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               condition_range_min: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div className="col-md-4">
//                         <label className="form-label fs-13">Max</label>
//                         <input
//                           type="number"
//                           className="form-control"
//                           value={formData.condition_range_max}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               condition_range_max: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                     </div>
//                   )}
//                   {formData.condition_select === "input" && (
//                     <div className="col-md-4">
//                       <label className="form-label fs-13">Other Input</label>
//                       <CommonSelect
//                         options={inputTypes}
//                         value={inputTypes.find(
//                           (i: any) =>
//                             i.value === formData.condition_other_input_id,
//                         )}
//                         onChange={(opt: any) =>
//                           setFormData({
//                             ...formData,
//                             condition_other_input_id: opt?.value,
//                           })
//                         }
//                       />
//                     </div>
//                   )}
//                   {formData.condition_select === "python" && (
//                     <div className="col-md-8">
//                       <label className="form-label fs-13 fw-bold text-success">
//                         Python Expression
//                       </label>
//                       <textarea
//                         className="form-control font-monospace fs-12 bg-dark text-info"
//                         rows={3}
//                         value={formData.condition_python}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             condition_python: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* --- COMPUTATION SECTION --- */}
//               <div className="form-section mb-4">
//                 <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
//                   <i className="ti ti-adjustments fs-18 me-2"></i> Computation
//                 </h6>
//                 <div className="row g-3">
//                   <div className="col-md-4">
//                     <label className="form-label fs-13">Amount Type</label>
//                     <CommonSelect
//                       options={amountOptions}
//                       value={amountOptions.find(
//                         (o) => o.value === formData.amount_select,
//                       )}
//                       onChange={(opt: any) =>
//                         setFormData({ ...formData, amount_select: opt.value })
//                       }
//                     />
//                   </div>
//                   {formData.amount_select === "percentage" && (
//                     <div className="col-md-8 row g-2">
//                       <div className="col-md-4">
//                         <label className="form-label fs-13">Based on</label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={formData.amount_percentage_base}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               amount_percentage_base: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div className="col-md-4">
//                         <label className="form-label fs-13">Qty</label>
//                         <input
//                           type="number"
//                           className="form-control"
//                           value={formData.quantity}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               quantity: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div className="col-md-4">
//                         <label className="form-label fs-13">Percent (%)</label>
//                         <input
//                           type="number"
//                           className="form-control"
//                           value={formData.amount_percentage}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               amount_percentage: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                     </div>
//                   )}
//                   {formData.amount_select === "fix" && (
//                     <div className="col-md-8 row g-2">
//                       <div className="col-md-6">
//                         <label className="form-label fs-13">Qty</label>
//                         <input
//                           type="number"
//                           className="form-control"
//                           value={formData.quantity}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               quantity: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div className="col-md-6">
//                         <label className="form-label fs-13">Fix Amt</label>
//                         <input
//                           type="number"
//                           className="form-control"
//                           value={formData.amount_fix}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               amount_fix: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                     </div>
//                   )}
//                   {formData.amount_select === "input" && (
//                     <div className="col-md-4">
//                       <label className="form-label fs-13">Other Input</label>
//                       <CommonSelect
//                         options={inputTypes}
//                         value={inputTypes.find(
//                           (i: any) =>
//                             i.value === formData.amount_other_input_id,
//                         )}
//                         onChange={(opt: any) =>
//                           setFormData({
//                             ...formData,
//                             amount_other_input_id: opt?.value,
//                           })
//                         }
//                       />
//                     </div>
//                   )}
//                   {formData.amount_select === "code" && (
//                     <div className="col-md-8">
//                       <label className="form-label fs-13 fw-bold text-success">
//                         Python Code
//                       </label>
//                       <textarea
//                         className="form-control font-monospace fs-12 bg-dark text-info"
//                         rows={4}
//                         value={formData.amount_python_compute}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             amount_python_compute: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* --- DESCRIPTION --- */}
//               <div className="form-section">
//                 <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
//                   <i className="ti ti-notes fs-18 me-2"></i> Additional Info
//                 </h6>
//                 <div className="row">
//                   <div className="col-12">
//                     <label className="form-label fs-13">Description</label>
//                     <textarea
//                       className="form-control"
//                       rows={2}
//                       value={formData.note}
//                       onChange={(e) =>
//                         setFormData({ ...formData, note: e.target.value })
//                       }
//                       placeholder="Internal notes..."
//                     />
//                   </div>
//                 </div>
//               </div>
//             </form>
//           </div>
//           <div className="modal-footer border-0 bg-white px-4 mt-2">
//             <button
//               type="button"
//               className="btn btn-light"
//               data-bs-dismiss="modal"
//               onClick={resetForm}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="btn btn-primary px-5"
//               disabled={isSubmitting}
//               onClick={handleSave}
//             >
//               {isSubmitting ? "Processing..." : "Save Salary Rule"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddEditSalaryRuleModal;
