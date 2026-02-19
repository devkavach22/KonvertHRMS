import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import CommonSelect from "../../../core/common/commonSelect";
import { toast } from "react-toastify";
import {
  createPayslip,
  computePayslip,
  confirmPayslip,
  markPaidPayslip,
} from "./PayslipServices";
import { getEmployeesBasicInfo } from "@/KHRModules/EmployeModules/Employee/EmployeeServices";
import { getContracts } from "@/KHRModules/EmployeeContract/contractService";
import { getSalaryStructures } from "../SalaryStructure/SalaryStructureService";

interface Props {
  onSuccess: () => void;
  onClose: () => void;
  data: any | null;
}

const AddEditPayslipModal: React.FC<Props> = ({ onSuccess, onClose, data }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Workflow Steps: 'create' | 'compute' | 'confirm' | 'pay'
  const [currentStep, setCurrentStep] = useState<
    "create" | "compute" | "confirm" | "pay"
  >("create");
  const [payslipId, setPayslipId] = useState<number | null>(null);
  const [computedData, setComputedData] = useState<any>(null);

  const [errors, setErrors] = useState<any>({});
  const [dropdowns, setDropdowns] = useState<any>({
    employees: [],
    contracts: [],
    contracts_raw: [],
    structures: [],
  });

  const initialFormState = {
    name: "",
    employee_id: "",
    contract_id: "",
    struct_id: "",
    date_from: dayjs().startOf("month").format("YYYY-MM-DD"),
    date_to: dayjs().endOf("month").format("YYYY-MM-DD"),
    employee_code: "",
  };

  const [formData, setFormData] = useState<any>(initialFormState);

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [e, c, s] = await Promise.all([
          getEmployeesBasicInfo(),
          getContracts(),
          getSalaryStructures(),
        ]);

        setDropdowns({
          employees: Array.isArray(e)
            ? e.map((i: any) => ({ value: i.id, label: i.name }))
            : [],
          contracts: Array.isArray(c)
            ? c.map((i: any) => ({
                value: i.contract_id || i.id,
                label: i.name,
              }))
            : [],
          contracts_raw: c || [],
          structures: Array.isArray(s)
            ? s.map((i: any) => ({ value: i.id, label: i.name }))
            : [],
        });
      } catch (error) {
        console.error("Dropdown error", error);
      }
    };
    loadDropdownData();
  }, []);

  const updateField = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    let tempErrors: any = {};
    if (!formData.name?.trim()) tempErrors.name = "Payslip title is required.";
    if (!formData.employee_id)
      tempErrors.employee_id = "Please select an employee.";
    if (!formData.date_from) tempErrors.date_from = "Start date is required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (currentStep === "create") {
        setIsSubmitted(true);
        if (!validateForm()) {
          toast.error("Please fill mandatory fields");
          return;
        }
        setIsSubmitting(true);
        const payload = {
          ...formData,
          employee_id: Number(formData.employee_id),
          contract_id: formData.contract_id
            ? Number(formData.contract_id)
            : null,
          struct_id: formData.struct_id ? Number(formData.struct_id) : null,
        };
        const response = await createPayslip(payload);
        setPayslipId(response.data?.payslip_id);
        setCurrentStep("compute");
        toast.success("Step 1: Created successfully!");
        onSuccess();
      } else if (currentStep === "compute") {
        setIsSubmitting(true);
        const res = await computePayslip(payslipId!);
        setComputedData(res.data?.data || res.data);
        setCurrentStep("confirm");
        toast.success("Step 2: Computed successfully!");
      } else if (currentStep === "confirm") {
        setIsSubmitting(true);
        await confirmPayslip(payslipId!);
        setCurrentStep("pay");
        toast.success("Step 3: Confirmed!");
      } else if (currentStep === "pay") {
        setIsSubmitting(true);
        await markPaidPayslip(payslipId!);
        toast.success("Step 4: Finalized successfully!");
        onSuccess();
        resetAndClose(); // FULL CLOSE AND CLEAR
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setFormData(initialFormState);
    setCurrentStep("create");
    setPayslipId(null);
    setComputedData(null);
    setIsSubmitted(false);
    setErrors({});
    onClose();
  };

  const getButtonConfig = () => {
    switch (currentStep) {
      case "create":
        return {
          text: "Save & Create Draft",
          class: "btn-primary",
          icon: "ti-save",
        };
      case "compute":
        return {
          text: "Compute Now",
          class: "btn-warning",
          icon: "ti-calculator",
        };
      case "confirm":
        return { text: "Confirm Details", class: "btn-info", icon: "ti-check" };
      case "pay":
        return {
          text: "Finalize Payment",
          class: "btn-success",
          icon: "ti-coin",
        };
    }
  };

  const btn = getButtonConfig();

  return (
    <div className="modal fade" id="add_payslip_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content bg-white border-0 shadow-lg">
          <div className="modal-header border-bottom bg-light py-2">
            <h5 className="modal-title fw-bold fs-15">
              <i className="ti ti-receipt-2 me-2 text-primary"></i>
              {currentStep === "create"
                ? "Process New Payslip"
                : `Payslip #${payslipId}`}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={resetAndClose}
            ></button>
          </div>

          <div className="modal-body p-4">
            {/* Step Indicators */}
            <div className="d-flex justify-content-between mb-4 bg-light p-2 rounded border small fw-bold text-uppercase">
              <div
                className={`px-2 py-1 rounded ${currentStep === "create" ? "bg-primary text-white" : "text-muted"}`}
              >
                1. Create
              </div>
              <div
                className={`px-2 py-1 rounded ${currentStep === "compute" ? "bg-warning text-dark" : "text-muted"}`}
              >
                2. Compute
              </div>
              <div
                className={`px-2 py-1 rounded ${currentStep === "confirm" ? "bg-info text-white" : "text-muted"}`}
              >
                3. Confirm
              </div>
              <div
                className={`px-2 py-1 rounded ${currentStep === "pay" ? "bg-success text-white" : "text-muted"}`}
              >
                4. Paid
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3">
                <div className="col-md-12">
                  <label className="form-label fs-13 fw-bold">
                    Title Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={currentStep !== "create"}
                    className={`form-control ${isSubmitted && (errors.name ? "is-invalid" : "is-valid")}`}
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                  />
                  {isSubmitted && errors.name && (
                    <div className="text-danger fs-11 mt-1">{errors.name}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">
                    Employee <span className="text-danger">*</span>
                  </label>
                  <CommonSelect
                    disabled={currentStep !== "create"}
                    options={dropdowns.employees}
                    value={
                      dropdowns.employees.find(
                        (opt: any) => opt.value === formData.employee_id,
                      ) || null
                    }
                    onChange={(opt: any) =>
                      updateField("employee_id", opt?.value || "")
                    }
                  />
                  {isSubmitted && errors.employee_id && (
                    <div className="text-danger fs-11 mt-1">
                      {errors.employee_id}
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">Contract</label>
                  <CommonSelect
                    disabled={currentStep !== "create"}
                    options={dropdowns.contracts}
                    value={
                      dropdowns.contracts.find(
                        (opt: any) => opt.value === formData.contract_id,
                      ) || null
                    }
                    onChange={(opt: any) => {
                      const val = opt?.value || "";
                      updateField("contract_id", val);
                      const raw = dropdowns.contracts_raw.find(
                        (c: any) => (c.contract_id || c.id) === val,
                      );
                      if (raw?.employee_code)
                        updateField("employee_code", raw.employee_code);
                    }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">
                    Salary Structure
                  </label>
                  <CommonSelect
                    disabled={currentStep !== "create"}
                    options={dropdowns.structures}
                    value={
                      dropdowns.structures.find(
                        (opt: any) => opt.value === formData.struct_id,
                      ) || null
                    }
                    onChange={(opt: any) =>
                      updateField("struct_id", opt?.value || "")
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">
                    Employee Code
                  </label>
                  <input
                    type="text"
                    disabled={currentStep !== "create"}
                    className="form-control"
                    value={formData.employee_code}
                    onChange={(e) =>
                      updateField("employee_code", e.target.value)
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">
                    Date From <span className="text-danger">*</span>
                  </label>
                  <DatePicker
                    disabled={currentStep !== "create"}
                    className={`w-100 form-control ${isSubmitted && (errors.date_from ? "is-invalid" : "is-valid")}`}
                    value={
                      formData.date_from ? dayjs(formData.date_from) : null
                    }
                    onChange={(_, d) => updateField("date_from", String(d))}
                  />
                  {isSubmitted && errors.date_from && (
                    <div className="text-danger fs-11 mt-1">
                      {errors.date_from}
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">Date To</label>
                  <DatePicker
                    disabled={currentStep !== "create"}
                    className="w-100 form-control"
                    value={formData.date_to ? dayjs(formData.date_to) : null}
                    onChange={(_, d) => updateField("date_to", String(d))}
                  />
                </div>

                {/* Calculation Summary Section */}
                {computedData && (
                  <div className="col-md-12 mt-4 animate__animated animate__fadeIn">
                    <div className="card bg-light border-dashed">
                      <div className="card-body">
                        <h6 className="fw-bold border-bottom pb-2">
                          Calculation Results
                        </h6>
                        <div className="d-flex justify-content-between mt-3">
                          <div>
                            <small className="text-muted d-block">
                              Basic Salary
                            </small>
                            <span className="fw-bold">
                              ₹ {computedData.basic_salary || "0.00"}
                            </span>
                          </div>
                          <div>
                            <small className="text-muted d-block text-success">
                              Total Allowance
                            </small>
                            <span className="fw-bold text-success">
                              +{computedData.total_allowance || "0.00"}
                            </span>
                          </div>
                          <div>
                            <small className="text-muted d-block text-danger">
                              Total Deduction
                            </small>
                            <span className="fw-bold text-danger">
                              -{computedData.total_deduction || "0.00"}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center">
                          <span className="fw-bold">Net Payable:</span>
                          <span className="h4 fw-bold text-primary mb-0">
                            ₹ {computedData.net_salary || "0.00"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer border-0 bg-white px-0 mt-4 pb-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 me-2"
                  onClick={resetAndClose}
                >
                  {currentStep === "create" ? "Cancel" : "Exit Process"}
                </button>
                <button
                  type="submit"
                  className={`btn ${btn.class} px-5 shadow-sm text-white`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className={`ti ${btn.icon} me-2`}></i>
                      {btn.text}
                    </>
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

export default AddEditPayslipModal;
