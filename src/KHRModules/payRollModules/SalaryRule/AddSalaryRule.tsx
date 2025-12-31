import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
import CommonModal from "@/KHRModules/commanForm/CommanModal/CommanModal";
import FormInput from "@/KHRModules/commanForm/inputComman/FormInput";
import CommonSelect, { Option } from "@/core/common/commonSelect";
import { createSalaryRule } from "./SalaryRuleService";
import { toast } from "react-toastify";

interface Props {
  onSuccess: () => void;
}

/* ================= OPTIONS ================= */

const categoryOptions: Option[] = [
  { label: "Basic", value: 1 },
  { label: "Allowance", value: 2 },
  { label: "Deduction", value: 3 },
];

const structOptions: Option[] = [
  { label: "Worker Pay", value: 1 },
  { label: "Regular Pay", value: 2 },
  { label: "13th Month End of Year Bonus", value: 3 },
];

const booleanOptions: Option[] = [
  { label: "True", value: true },
  { label: "False", value: false },
];

const conditionOptions: Option[] = [
  { label: "Always True", value: "always_true" },
  { label: "Range", value: "range" },
  { label: "Other Input", value: "other_input" },
  { label: "Python Expression", value: "python" },
];

const amountTypeOptions: Option[] = [
  { label: "Percentage", value: "percentage" },
  { label: "Fixed Amount", value: "fix" },
  { label: "Other Input", value: "other_input" },
  { label: "Python Code", value: "python" },
];


const partnerOptions: Option[] = [
  { label: "(BIHAR) KAVACH GLOBAL KONNECTS PRIVATE LIMITED", value: 1 },
  { label: "(DELHI) KAVACH GLOBAL KONNECTS PRIVATE LIMITED", value: 2 },
  { label: "(HP) KALIBRE GLOBAL KONNECTS PRIVATE LIMITED", value: 3 },
  { label: "(HP) KAVACH GLOBAL KONNECTS PRIVATE LIMITED", value: 4 },
  { label: "(JH) KAVACH GLOBAL KONNECTS PRIVATE LIMITED", value: 5 },
  { label: "(MH) KAVACH GLOBAL KONNECTS PRIVATE LIMITED", value: 6 },
  { label: "(UK) KAVACH GLOBAL KONNECTS PRIVATE LIMITED", value: 7 },
  { label: "(UP) KAVACH GLOBAL KONNECTS PRIVATE LIMITED", value: 8 },
];

/* ================= COMPONENT ================= */

const AddSalaryRuleModal: React.FC<Props> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<any>({
    /* BASIC */
    name: "",
    code: "",
    category_id: "",
    sequence: 1,
    struct_id: "",
    active: true,

    /* VISIBILITY */
    appears_on_payslip: true,
    appears_on_employee_cost_dashboard: false,
    appears_on_payroll_report: false,

    /* CONDITIONS */
    condition_select: "always_true",
    condition_range: "",
    condition_range_min: "",
    condition_range_max: "",
    condition_other_input_id: "",
    condition_python: "",

    /* COMPUTATION */
    amount_select: "fix",
    amount_percentage_based: "",
    quantity: "1",
    amount_percentage: "",
    amount_fix: "",
    amount_other_input_id: "",
    amount_python_compute: "",

    /* COMPANY */
    partner_id: null,
    partner_name: "",
  });



  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    const payload = {
      ...formData,

      partner_id:
        formData.partner_id?.__isNew__ === true
          ? null
          : formData.partner_id?.value || null,

      partner_name:
        formData.partner_id?.__isNew__ === true
          ? formData.partner_id.label
          : null,
    };
    console.log(payload,"payloaddd");
    
    try {
      await createSalaryRule(payload);
      toast.success("Salary Rule created successfully");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create Salary Rule");
    }
  };

  return (
    <CommonModal
      id="add_salary_rule"
      title="Add Salary Rule"
      onSubmit={handleSubmit}
    >
      {/* ================= BASIC INFO ================= */}
      <h6 className="mb-3">Basic Information</h6>

      <div className="row">
        <div className="col-md-6">
          <FormInput
            label="Rule Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>
        <div className="col-md-6">
          <FormInput
            label="Code"
            value={formData.code}
            onChange={(e) =>
              setFormData({ ...formData, code: e.target.value })
            }
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <label className="form-label">Category</label>
          <CommonSelect
            options={categoryOptions}
            onChange={(opt) =>
              setFormData({ ...formData, category_id: opt?.value })
            }
          />
        </div>
        <div className="col-md-6">
          <FormInput
            label="Sequence"
            type="number"
            value={formData.sequence}
            onChange={(e) =>
              setFormData({ ...formData, sequence: e.target.value })
            }
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <label className="form-label">Salary Structure</label>
          <CommonSelect
            options={structOptions}
            onChange={(opt) =>
              setFormData({ ...formData, struct_id: opt?.value })
            }
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Active</label>
          <CommonSelect
            options={booleanOptions}
            defaultValue={booleanOptions[0]}
            onChange={(opt) =>
              setFormData({ ...formData, active: opt?.value })
            }
          />
        </div>
      </div>

      {/* ================= VISIBILITY ================= */}
      <div className="row mt-2">
        <div className="col-md-6">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={formData.appears_on_payslip}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  appears_on_payslip: e.target.checked,
                })
              }
            />
            <label className="form-check-label">Appears on Payslip</label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={formData.appears_on_employee_cost_dashboard}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  appears_on_employee_cost_dashboard: e.target.checked,
                })
              }
            />
            <label className="form-check-label">
              Appears on Employee Cost Dashboard
            </label>
          </div>
        </div>
      </div>

      <div className="row mt-1">
        <div className="col-md-6">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={formData.appears_on_payroll_report}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  appears_on_payroll_report: e.target.checked,
                })
              }
            />
            <label className="form-check-label">
              Appears on Payroll Report
            </label>
          </div>
        </div>
      </div>

      {/* ================= CONDITIONS ================= */}
      <h6 className="mt-4 mb-3">Conditions</h6>

      <div className="row">
        <div className="col-md-6">
          <label className="form-label">Condition Based On</label>
          <CommonSelect
            options={conditionOptions}
            defaultValue={conditionOptions[0]}
            onChange={(opt) =>
              setFormData({ ...formData, condition_select: opt?.value })
            }
          />
        </div>
      </div>

      {formData.condition_select === "range" && (
        <div className="row">
          <div className="col-md-6">
            <FormInput
              label="Range Based On"
              value={formData.condition_range}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  condition_range: e.target.value,
                })
              }
            />
          </div>
          <div className="col-md-3">
            <FormInput
              label="Min"
              type="number"
              value={formData.condition_range_min}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  condition_range_min: e.target.value,
                })
              }
            />
          </div>
          <div className="col-md-3">
            <FormInput
              label="Max"
              type="number"
              value={formData.condition_range_max}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  condition_range_max: e.target.value,
                })
              }
            />
          </div>
        </div>
      )}

      {formData.condition_select === "other_input" && (
        <FormInput
          label="Other Input"
          value={formData.condition_other_input_id}
          onChange={(e) =>
            setFormData({
              ...formData,
              condition_other_input_id: e.target.value,
            })
          }
        />
      )}

      {formData.condition_select === "python" && (
        <FormInput
          label="Python Condition"
          value={formData.condition_python}
          onChange={(e) =>
            setFormData({
              ...formData,
              condition_python: e.target.value,
            })
          }
        />
      )}

      {/* ================= COMPUTATION ================= */}
      <h6 className="mt-4 mb-3">Computation</h6>

      <div className="row">
        <div className="col-md-6">
          <label className="form-label">Amount Type</label>
          <CommonSelect
            options={amountTypeOptions}
            defaultValue={amountTypeOptions[1]}
            onChange={(opt) =>
              setFormData({ ...formData, amount_select: opt?.value })
            }
          />
        </div>
      </div>

      {formData.amount_select === "fix" && (
        <div className="row">
          <div className="col-md-6">
            <FormInput
              label="Quantity"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
            />
          </div>
          <div className="col-md-6">
            <FormInput
              label="Fixed Amount"
              type="number"
              value={formData.amount_fix}
              onChange={(e) =>
                setFormData({ ...formData, amount_fix: e.target.value })
              }
            />
          </div>
        </div>
      )}

      {formData.amount_select === "percentage" && (
        <div className="row">
          <div className="col-md-4">
            <FormInput
              label="Percentage Based On"
              value={formData.amount_percentage_based}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount_percentage_based: e.target.value,
                })
              }
            />
          </div>
          <div className="col-md-4">
            <FormInput
              label="Quantity"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
            />
          </div>
          <div className="col-md-4">
            <FormInput
              label="Percentage"
              type="number"
              value={formData.amount_percentage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount_percentage: e.target.value,
                })
              }
            />
          </div>
        </div>
      )}

      {formData.amount_select === "other_input" && (
        <FormInput
          label="Other Input"
          value={formData.amount_other_input_id}
          onChange={(e) =>
            setFormData({
              ...formData,
              amount_other_input_id: e.target.value,
            })
          }
        />
      )}

      {formData.amount_select === "python" && (
        <FormInput
          label="Python Code"
          value={formData.amount_python_compute}
          onChange={(e) =>
            setFormData({
              ...formData,
              amount_python_compute: e.target.value,
            })
          }
        />
      )}

      {/* ================= COMPANY CONTRIBUTION ================= */}
      <h6 className="mt-4 mb-3">Company Contribution</h6>

      <div className="row">
        <div className="col-md-6">
          <CreatableSelect
            options={partnerOptions}
            isClearable
            placeholder="Select or create partner"
            value={formData.partner_id}
            onChange={(option: any) => {
              setFormData({
                ...formData,
                partner_id: option,
                partner_name: "",
              });
            }}
            onCreateOption={(inputValue) => {
              const newOption = {
                label: inputValue,
                value: inputValue,
                __isNew__: true,
              };

              setFormData({
                ...formData,
                partner_id: newOption,
                partner_name: inputValue,
              });
            }}
          />
        </div>
      </div>
    </CommonModal>
  );
};

export default AddSalaryRuleModal;
