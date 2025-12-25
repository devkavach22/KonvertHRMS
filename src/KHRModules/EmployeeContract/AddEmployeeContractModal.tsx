import React, { useEffect, useState } from "react";
import CommonModal from "@/KHRModules/commanForm/CommanModal/CommanModal";
import FormInput from "@/KHRModules/commanForm/inputComman/FormInput";
import { useFormValidation } from "@/KHRModules/commanForm/FormValidation";

interface Props {
    onSubmit: (data: any) => void;
}

const AddEmployeeContractModal: React.FC<Props> = ({ onSubmit }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const { validateEmployeeContract } = useFormValidation();

    const [formData, setFormData] = useState<any>({
        employee_code: "",
        employee_name: "",
        contract_start_date: "",
        contract_end_date: "",
        working_schedule: "",
        work_entry_source: "",

        salary_structure_type: "",
        department: "",
        job_position: "",
        contract_type: "",

        wage_type: "",
        schedule_pay: "",
        wage: "",

        allowances: {
            conveyance: 0,
            skill: 0,
            food: 0,
            washing: 0,
            special: 0,
            medical: 0,
            uniform: 0,
            child_education: 0,
            other: 0,
            gratuity: 0,
            lta: 0,
            variable_pay: 0,
            professional_tax: 0,
        },

        deductions: {
            tds: 0,
            pf: 0,
            voluntary_pf: 0,
            medical_insurance: 0,
            loan: 0,
            esi: 0,
        },
    });

    const handleSubmit = () => {
        setIsSubmitted(true);

        const validationErrors = validateEmployeeContract(formData);
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }

        onSubmit(formData);
    };

    useEffect(() => {
        setErrors({});
        setIsSubmitted(false);
    }, []);

    return (
        <CommonModal
            id="add_employee_contract"
            title="Employee Contract"
            onSubmit={handleSubmit}
        >
            {/* ================= Employee Information ================= */}
            <h6 className="mb-3">Employee Information</h6>

            <FormInput
                name="employee_code"
                label="Employee Code"
                value={formData.employee_code}
                onChange={(e) =>
                    setFormData({ ...formData, employee_code: e.target.value })
                }
            />

            <FormInput
                name="employee_name"
                label="Employee"
                value={formData.employee_name}
                isSubmitted={isSubmitted}
                error={errors.employee_name}
                onChange={(e) =>
                    setFormData({ ...formData, employee_name: e.target.value })
                }
            />

            <div className="row">
                <div className="col-md-6">
                    <FormInput
                        name="contract_start_date"
                        label="Contract Start Date"
                        type="date"
                        value={formData.contract_start_date}
                        isSubmitted={isSubmitted}
                        error={errors.contract_start_date}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                contract_start_date: e.target.value,
                            })
                        }
                    />
                </div>

                <div className="col-md-6">
                    <FormInput
                        name="contract_end_date"
                        label="Contract End Date"
                        type="date"
                        value={formData.contract_end_date}
                        isSubmitted={isSubmitted}
                        error={errors.contract_end_date}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                contract_end_date: e.target.value,
                            })
                        }
                    />
                </div>
            </div>


            <div className="row">
                <div className="col-md-6">
                    <FormInput
                        name="working_schedule"
                        label="Working Schedule"
                        value={formData.working_schedule}
                        isSubmitted={isSubmitted}
                        error={errors.working_schedule}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                working_schedule: e.target.value,
                            })
                        }
                    />
                </div>

                <div className="col-md-6">
                    <FormInput
                        name="work_entry_source"
                        label="Work Entry Source"
                        value={formData.work_entry_source}
                        isSubmitted={isSubmitted}
                        error={errors.work_entry_source}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                work_entry_source: e.target.value,
                            })
                        }
                    />
                </div>
            </div>


            {/* ================= Salary Structure ================= */}
            <h6 className="mt-4 mb-3">Salary Structure</h6>

            <div className="row">
                <div className="col-md-6">
                    <FormInput
                        name="salary_structure_type"
                        label="Salary Structure Type"
                        value={formData.salary_structure_type}
                        isSubmitted={isSubmitted}
                        error={errors.salary_structure_type}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                salary_structure_type: e.target.value,
                            })
                        }
                    />
                </div>

                <div className="col-md-6">
                    <FormInput
                        name="department"
                        label="Department"
                        value={formData.department}
                        isSubmitted={isSubmitted}
                        error={errors.department}
                        onChange={(e) =>
                            setFormData({ ...formData, department: e.target.value })
                        }
                    />
                </div>

                <div className="col-md-6">
                    <FormInput
                        name="job_position"
                        label="Job Position"
                        value={formData.job_position}
                        isSubmitted={isSubmitted}
                        error={errors.job_position}
                        onChange={(e) =>
                            setFormData({ ...formData, job_position: e.target.value })
                        }
                    />
                </div>

                <div className="col-md-6">
                    <FormInput
                        name="contract_type"
                        label="Contract Type"
                        value={formData.contract_type}
                        isSubmitted={isSubmitted}
                        error={errors.contract_type}
                        onChange={(e) =>
                            setFormData({ ...formData, contract_type: e.target.value })
                        }
                    />
                </div>
            </div>


            {/* ================= Salary Information ================= */}
            {/* ================= Salary Information ================= */}
            <h6 className="mt-4 mb-3">Salary Information</h6>

            <div className="row">
                <div className="col-md-6">
                    <FormInput
                        name="wage_type"
                        label="Wage Type"
                        value={formData.wage_type}
                        isSubmitted={isSubmitted}
                        error={errors.wage_type}
                        onChange={(e) =>
                            setFormData({ ...formData, wage_type: e.target.value })
                        }
                    />
                </div>

                <div className="col-md-6">
                    <FormInput
                        name="schedule_pay"
                        label="Schedule Pay"
                        value={formData.schedule_pay}
                        isSubmitted={isSubmitted}
                        error={errors.schedule_pay}
                        onChange={(e) =>
                            setFormData({ ...formData, schedule_pay: e.target.value })
                        }
                    />
                </div>

                <div className="col-md-6">
                    <FormInput
                        name="wage"
                        label="Wage (₹ / month)"
                        type="number"
                        value={formData.wage}
                        isSubmitted={isSubmitted}
                        error={errors.wage}
                        onChange={(e) =>
                            setFormData({ ...formData, wage: e.target.value })
                        }
                    />
                </div>

                <div className="col-md-6">
                    <FormInput
                        name="salary_structure_type"
                        label="Salary Structure Type"
                        value={formData.salary_structure_type}
                        isSubmitted={isSubmitted}
                        error={errors.salary_structure_type}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                salary_structure_type: e.target.value,
                            })
                        }
                    />
                </div>
            </div>

            {/* ================= Allowances ================= */}
            <h6 className="mt-4 mb-3">Allowances</h6>

            <div className="row">
                {Object.keys(formData.allowances).map((key) => (
                    <div className="col-md-4 mb-2" key={key}>
                        <FormInput
                            name={key}
                            label={key.replace(/_/g, " ").toUpperCase()}
                            type="number"
                            value={formData.allowances[key]}
                            isSubmitted={isSubmitted}
                            error={errors.allowances?.[key]}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    allowances: {
                                        ...formData.allowances,
                                        [key]: Number(e.target.value),
                                    },
                                })
                            }
                        />
                    </div>
                ))}
            </div>

            {/* ================= Deductions ================= */}
            <h6 className="mt-4 mb-3">Deductions</h6>

            <div className="row">
                {Object.keys(formData.deductions).map((key) => (
                    <div className="col-md-4 mb-2" key={key}>
                        <FormInput
                            name={key}
                            label={key.replace(/_/g, " ").toUpperCase()}
                            type="number"
                            value={formData.deductions[key]}
                            isSubmitted={isSubmitted}
                            error={errors.deductions?.[key]}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    deductions: {
                                        ...formData.deductions,
                                        [key]: Number(e.target.value),
                                    },
                                })
                            }
                        />
                    </div>
                ))}
            </div>
        </CommonModal>
    );
};

export default AddEmployeeContractModal;
