import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs"; // Make sure to import dayjs
import {
  Contract,
  Employee,
  WorkingSchedule,
  Department,
  createContract,
  updateContract,
  getEmployees,
  getWorkingSchedules,
  getDepartments,
} from "./contractService";
import CommonSelect from "@/core/common/commonSelect";
import { DatePicker } from "antd";
import { WorkEntryType } from "../Master Modules/WorkEntryType/WorkEntryTypeServices";

interface AddEditContractModalProps {
  onSuccess: () => void;
  data?: Contract | null;
  onClose: () => void;
}

const AddEditContractModal: React.FC<AddEditContractModalProps> = ({
  onSuccess,
  data,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Add this for validation
  const [activeTab, setActiveTab] = useState("basic");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [workingSchedules, setWorkingSchedules] = useState<WorkingSchedule[]>(
    [],
  );
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const [errors, setErrors] = useState<any>({});

  const [formData, setFormData] = useState<Omit<Contract, "id">>({
    name: "",
    employee_code: "",
    employee_id: 0,
    job_id: 0,
    date_start: "",
    date_end: "",
    work_entry_source: "calendar",
    resource_calendar_id: 0,
    structure_type_id: 0,
    department_id: 0,
    contract_type_id: 0,
    wage_type: "monthly",
    schedule_pay: "monthly",
    wage: 0,
    conveyance_allowances: 0,
    skill_allowances: 0,
    food_allowances: 0,
    washing_allowances: 0,
    special_allowances: 0,
    medial_allowances: 0,
    uniform_allowances: 0,
    child_education_allowances: 0,
    other_allowances: 0,
    variable_pay: 0,
    gratuity: 0,
    professional_tax: 0,
    lta: 0,
  });

  useEffect(() => {
    const loadDropdownData = async () => {
      setLoadingDropdowns(true);
      try {
        const [empData, scheduleData, deptData] = await Promise.all([
          getEmployees(),
          getWorkingSchedules(),
          getDepartments(),
        ]);
        setEmployees(empData);
        setWorkingSchedules(scheduleData);
        setDepartments(deptData);
      } catch (error) {
        toast.error("Failed to load schema data");
      } finally {
        setLoadingDropdowns(false);
      }
    };
    loadDropdownData();
  }, []);

  useEffect(() => {
    if (data) {
      setFormData({ ...data });
    }
  }, [data]);

  const handleEmployeeChange = (employeeId: number) => {
    const selectedEmployee = employees.find((emp) => emp.id === employeeId);
    if (selectedEmployee) {
      setFormData((prev) => ({
        ...prev,
        employee_id: employeeId,
        employee_code: selectedEmployee.employee_code,
        name: `Contract for ${selectedEmployee.name}`,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Simple Validation Check
    if (!formData.employee_id || !formData.date_start) {
      toast.error("Please fill required fields");
      return;
    }

    setLoading(true);
    try {
      if (data?.id) {
        await updateContract(data.id, formData);
        toast.success("Contract updated successfully");
      } else {
        await createContract(formData);
        toast.success("Contract created successfully");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to save contract");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade" id="add_contract" tabIndex={-1} role="dialog">
      <div
        className="modal-dialog modal-xl modal-dialog-centered"
        role="document"
      >
        <div className="modal-content bg-white border-0 shadow-lg">
          <div className="modal-header border-bottom bg-light py-2">
            <h5 className="modal-title fw-bold fs-15">
              <i className="ti ti-file-certificate me-2 text-primary"></i>
              {data ? "Edit Contract Detail" : "Add New Contract"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              onClick={onClose}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {loadingDropdowns ? (
                <div className="text-center p-5">
                  <div className="spinner-border text-primary" />
                  <div className="mt-2 text-muted">
                    Syncing contract data...
                  </div>
                </div>
              ) : (
                <>
                  <div className="employee-tabs-scrollable border-bottom mb-4">
                    <ul
                      className="nav nav-tabs flex-nowrap overflow-auto hide-scrollbar"
                      role="tablist"
                    >
                      <li className="nav-item">
                        <button
                          className={`nav-link fw-medium d-flex align-items-center ${activeTab === "basic" ? "active" : ""}`}
                          onClick={() => setActiveTab("basic")}
                          type="button"
                        >
                          <i className="ti ti-info-circle me-2 fs-16"></i> Basic
                          Information
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className={`nav-link fw-medium d-flex align-items-center ${activeTab === "salary" ? "active" : ""}`}
                          onClick={() => setActiveTab("salary")}
                          type="button"
                        >
                          <i className="ti ti-wallet me-2 fs-16"></i> Salary
                          Structure
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div
                    className="tab-content px-1"
                    style={{ minHeight: "420px" }}
                  >
                    {activeTab === "basic" && (
                      <div className="animate__animated animate__fadeIn">
                        <h6 className="fw-bold text-primary mb-3 fs-14">
                          <i className="ti ti-user-check me-2"></i> Employee
                          Assignment
                        </h6>
                        <div className="row g-3 mx-0 mb-4">
                          <div className="col-md-5 px-1">
                            <label className="form-label fs-13 fw-bold">
                              Employee Name{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <CommonSelect
                              options={employees.map((e) => ({
                                value: String(e.id),
                                label: e.name,
                              }))}
                              placeholder="Select Employee"
                              value={
                                formData.employee_id
                                  ? {
                                      value: String(formData.employee_id),
                                      label:
                                        employees.find(
                                          (e) => e.id === formData.employee_id,
                                        )?.name || "",
                                    }
                                  : null
                              }
                              onChange={(opt) =>
                                handleEmployeeChange(Number(opt?.value))
                              }
                            />
                          </div>
                          <div className="col-md-4 px-1">
                            <label className="form-label fs-13 fw-bold">
                              Contract Reference
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <hr className="my-4 opacity-25" />

                        <h6 className="fw-bold text-primary mb-3 fs-14">
                          <i className="ti ti-settings me-2"></i> Configuration
                          Details
                        </h6>
                        <div className="row g-3 mx-0">
                          <div className="col-md-4 px-1">
                            <label className="form-label fs-13 fw-bold">
                              Start Date <span className="text-danger">*</span>
                            </label>
                            <DatePicker
                              className={`form-control w-100 ${isSubmitted && !formData.date_start ? "is-invalid" : ""}`}
                              value={
                                formData.date_start
                                  ? dayjs(formData.date_start)
                                  : null
                              }
                              format="YYYY-MM-DD"
                              onChange={(date, dateStr) => {
                                setFormData({
                                  ...formData,
                                  date_start: Array.isArray(dateStr)
                                    ? dateStr[0]
                                    : dateStr,
                                });
                              }}
                            />
                          </div>

                          <div className="col-md-4 px-1">
                            <label className="form-label fs-13">
                              Work Entry Source
                            </label>
                            <CommonSelect
                              options={[
                                {
                                  value: "calendar",
                                  label: "Working Schedule",
                                },
                                { value: "attendances", label: "Attendances" },
                              ]}
                              value={
                                formData.work_entry_source
                                  ? {
                                      value: formData.work_entry_source,
                                      label:
                                        formData.work_entry_source ===
                                        "calendar"
                                          ? "Working Schedule"
                                          : "Attendances",
                                    }
                                  : null
                              }
                              onChange={(opt) =>
                                setFormData({
                                  ...formData,
                                  work_entry_source: opt?.value || "",
                                })
                              }
                            />
                          </div>
                          <div className="col-md-4 px-1">
                            <label className="form-label fs-13">
                              Working Schedule
                            </label>
                            <CommonSelect
                              options={workingSchedules.map((s) => ({
                                value: String(s.id),
                                label: s.name,
                              }))}
                              value={
                                formData.resource_calendar_id
                                  ? {
                                      value: String(
                                        formData.resource_calendar_id,
                                      ),
                                      label:
                                        workingSchedules.find(
                                          (s) =>
                                            s.id ===
                                            formData.resource_calendar_id,
                                        )?.name || "",
                                    }
                                  : null
                              }
                              onChange={(opt) =>
                                setFormData({
                                  ...formData,
                                  resource_calendar_id: Number(opt?.value),
                                })
                              }
                            />
                          </div>
                          <div className="col-md-4 px-1">
                            <label className="form-label fs-13">
                              Department
                            </label>
                            <CommonSelect
                              options={departments.map((d) => ({
                                value: String(d.id),
                                label: d.name,
                              }))}
                              value={
                                formData.department_id
                                  ? {
                                      value: String(formData.department_id),
                                      label:
                                        departments.find(
                                          (d) =>
                                            d.id === formData.department_id,
                                        )?.name || "",
                                    }
                                  : null
                              }
                              onChange={(opt) =>
                                setFormData({
                                  ...formData,
                                  department_id: Number(opt?.value),
                                })
                              }
                            />
                          </div>
                          <div className="col-md-4 px-1">
                            <label className="form-label fs-13">
                              Wage Type
                            </label>
                            <CommonSelect
                              options={[
                                { value: "monthly", label: "Fixed Wage" },
                                { value: "hourly", label: "Hourly Wage" },
                              ]}
                              value={
                                formData.wage_type
                                  ? {
                                      value: formData.wage_type,
                                      label:
                                        formData.wage_type === "monthly"
                                          ? "Fixed Wage"
                                          : "Hourly Wage",
                                    }
                                  : null
                              }
                              onChange={(opt) =>
                                setFormData({
                                  ...formData,
                                  wage_type: opt?.value || "",
                                })
                              }
                            />
                          </div>
                          <div className="col-md-4 px-1">
                            <label className="form-label fs-13 fw-bold">
                              Wage (CTC) <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-white fw-bold">
                                ₹
                              </span>
                              <input
                                type="number"
                                className="form-control border-primary fw-bold text-success"
                                value={formData.wage}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    wage: Number(e.target.value),
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: SALARY STRUCTURE */}
                    {activeTab === "salary" && (
                      <div className="animate__animated animate__fadeIn">
                        <div className="row g-4 mx-0">
                          {/* COLUMN 1: EARNINGS & ALLOWANCES */}
                          <div className="col-md-7 border-end pe-4">
                            <h6 className="fw-bold text-success mb-3 border-bottom pb-2 fs-14">
                              <i className="ti ti-circle-plus me-2"></i>{" "}
                              Allowances & Benefits
                            </h6>
                            <div className="row g-2">
                              {[
                                {
                                  label: "Conveyance",
                                  key: "conveyance_allowances",
                                },
                                { label: "Skill", key: "skill_allowances" },
                                { label: "Food", key: "food_allowances" },
                                { label: "Washing", key: "washing_allowances" },
                                { label: "Special", key: "special_allowances" },
                                { label: "Medical", key: "medial_allowances" },
                                { label: "Uniform", key: "uniform_allowances" },
                                {
                                  label: "Child Education",
                                  key: "child_education_allowances",
                                },
                                {
                                  label: "Other Allowances",
                                  key: "other_allowances",
                                },
                                { label: "LTA", key: "lta" },
                                { label: "Variable Pay", key: "variable_pay" },
                              ].map((item) => (
                                <div className="col-md-6" key={item.key}>
                                  <label className="form-label fs-12 mb-1">
                                    {item.label}
                                  </label>
                                  <div className="input-group input-group-sm">
                                    <span className="input-group-text bg-light text-muted">
                                      ₹
                                    </span>
                                    <input
                                      type="number"
                                      className="form-control"
                                      value={(formData as any)[item.key]}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          [item.key]: Number(e.target.value),
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* COLUMN 2: DEDUCTIONS */}
                          <div className="col-md-5 ps-4">
                            <h6 className="fw-bold text-danger mb-3 border-bottom pb-2 fs-14">
                              <i className="ti ti-circle-minus me-2"></i>{" "}
                              Deductions & Statutory
                            </h6>
                            <div className="row g-3">
                              <div className="col-12">
                                <label className="form-label fs-13">
                                  Professional Tax (PT)
                                </label>
                                <div className="input-group input-group-sm">
                                  <span className="input-group-text text-danger border-danger">
                                    ₹
                                  </span>
                                  <input
                                    type="number"
                                    className="form-control border-danger"
                                    value={formData.professional_tax}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        professional_tax: Number(
                                          e.target.value,
                                        ),
                                      })
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <label className="form-label fs-13">
                                  Gratuity Provision
                                </label>
                                <div className="input-group input-group-sm">
                                  <span className="input-group-text">₹</span>
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={formData.gratuity}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        gratuity: Number(e.target.value),
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer border-0 bg-white px-4">
              <button
                type="button"
                className="btn btn-light px-4"
                data-bs-dismiss="modal"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary px-5 shadow-sm"
                disabled={loading}
              >
                {loading && (
                  <span className="spinner-border spinner-border-sm me-2" />
                )}
                {data ? "Update Contract" : "Save Contract"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditContractModal;
// ===================================================================================================================================================
// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import {
//   Contract,
//   Employee,
//   WorkingSchedule,
//   Department,
//   createContract,
//   updateContract,
//   getEmployees,
//   getWorkingSchedules,
//   getDepartments,
// } from "./contractService";
// import CommonSelect from "@/core/common/commonSelect";

// interface AddEditContractModalProps {
//   onSuccess: () => void;
//   data?: Contract | null;
//   onClose: () => void;
// }

// const AddEditContractModal: React.FC<AddEditContractModalProps> = ({
//   onSuccess,
//   data,
//   onClose,
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("basic");
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [workingSchedules, setWorkingSchedules] = useState<WorkingSchedule[]>(
//     [],
//   );
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [loadingDropdowns, setLoadingDropdowns] = useState(true);

//   const [formData, setFormData] = useState<Omit<Contract, "id">>({
//     name: "",
//     employee_code: "",
//     employee_id: 0,
//     job_id: 0,
//     date_start: "",
//     work_entry_source: "calendar",
//     resource_calendar_id: 0,
//     structure_type_id: 0,
//     department_id: 0,
//     contract_type_id: 0,
//     wage_type: "monthly",
//     schedule_pay: "monthly",
//     wage: 0,
//     conveyance_allowances: 0,
//     skill_allowances: 0,
//     food_allowances: 0,
//     washing_allowances: 0,
//     special_allowances: 0,
//     medial_allowances: 0,
//     uniform_allowances: 0,
//     child_education_allowances: 0,
//     other_allowances: 0,
//     variable_pay: 0,
//     gratuity: 0,
//     professional_tax: 0,
//     lta: 0,
//   });

//   useEffect(() => {
//     const loadDropdownData = async () => {
//       setLoadingDropdowns(true);
//       try {
//         const [empData, scheduleData, deptData] = await Promise.all([
//           getEmployees(),
//           getWorkingSchedules(),
//           getDepartments(),
//         ]);
//         setEmployees(empData);
//         setWorkingSchedules(scheduleData);
//         setDepartments(deptData);
//       } catch (error) {
//         toast.error("Failed to load schema data");
//       } finally {
//         setLoadingDropdowns(false);
//       }
//     };
//     loadDropdownData();
//   }, []);

//   useEffect(() => {
//     if (data) {
//       setFormData({ ...data });
//     }
//   }, [data]);

//   const handleEmployeeChange = (employeeId: number) => {
//     const selectedEmployee = employees.find((emp) => emp.id === employeeId);
//     if (selectedEmployee) {
//       setFormData((prev) => ({
//         ...prev,
//         employee_id: employeeId,
//         employee_code: selectedEmployee.employee_code,
//         name: `Contract for ${selectedEmployee.name}`,
//       }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       if (data?.id) {
//         await updateContract(data.id, formData);
//         toast.success("Contract updated successfully");
//       } else {
//         await createContract(formData);
//         toast.success("Contract created successfully");
//       }
//       onSuccess();
//       onClose();
//     } catch (error: any) {
//       toast.error(error.message || "Failed to save contract");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal fade" id="add_contract" tabIndex={-1} role="dialog">
//       <div
//         className="modal-dialog modal-xl modal-dialog-centered"
//         role="document"
//       >
//         <div className="modal-content bg-white border-0 shadow-lg">
//           <div className="modal-header border-bottom bg-light py-2">
//             <h5 className="modal-title fw-bold fs-15">
//               <i className="ti ti-file-certificate me-2 text-primary"></i>
//               {data ? "Edit Contract Detail" : "Add New Contract"}
//             </h5>
//             <button
//               type="button"
//               className="btn-close"
//               data-bs-dismiss="modal"
//               onClick={onClose}
//             />
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="modal-body">
//               {loadingDropdowns ? (
//                 <div className="text-center p-5">
//                   <div className="spinner-border text-primary" />
//                   <div className="mt-2 text-muted">
//                     Syncing contract data...
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   <div className="employee-tabs-scrollable border-bottom mb-4">
//                     <ul
//                       className="nav nav-tabs flex-nowrap overflow-auto hide-scrollbar"
//                       role="tablist"
//                     >
//                       <li className="nav-item">
//                         <button
//                           className={`nav-link fw-medium d-flex align-items-center ${activeTab === "basic" ? "active" : ""}`}
//                           onClick={() => setActiveTab("basic")}
//                           type="button"
//                         >
//                           <i className="ti ti-info-circle me-2 fs-16"></i> Basic
//                           Information
//                         </button>
//                       </li>
//                       <li className="nav-item">
//                         <button
//                           className={`nav-link fw-medium d-flex align-items-center ${activeTab === "salary" ? "active" : ""}`}
//                           onClick={() => setActiveTab("salary")}
//                           type="button"
//                         >
//                           <i className="ti ti-wallet me-2 fs-16"></i> Salary
//                           Structure
//                         </button>
//                       </li>
//                     </ul>
//                   </div>

//                   <div
//                     className="tab-content px-1"
//                     style={{ minHeight: "420px" }}
//                   >
//                     {/* TAB 1: BASIC INFO */}
//                     {activeTab === "basic" && (
//                       <div className="animate__animated animate__fadeIn">
//                         <h6 className="fw-bold text-primary mb-3 fs-14">
//                           <i className="ti ti-user-check me-2"></i> Employee
//                           Assignment
//                         </h6>
//                         <div className="row g-3 mx-0 mb-4">
//                           <div className="col-md-5 px-1">
//                             <label className="form-label fs-13 fw-bold">
//                               Employee Name{" "}
//                               <span className="text-danger">*</span>
//                             </label>
//                             <CommonSelect
//                               options={employees.map((e) => ({
//                                 value: String(e.id),
//                                 label: e.name,
//                               }))}
//                               placeholder="Select Employee"
//                               defaultValue={
//                                 formData.employee_id
//                                   ? {
//                                       value: String(formData.employee_id),
//                                       label:
//                                         employees.find(
//                                           (e) => e.id === formData.employee_id,
//                                         )?.name || "",
//                                     }
//                                   : undefined
//                               }
//                               onChange={(opt) =>
//                                 handleEmployeeChange(Number(opt?.value))
//                               }
//                             />
//                           </div>
//                           {/* <div className="col-md-3 px-1">
//                             <label className="form-label fs-13 fw-bold">Employee Code</label>
//                             <input type="text" className="form-control bg-light border-dashed fw-bold text-primary" readOnly value={formData.employee_code || "---"} />
//                           </div> */}
//                           <div className="col-md-4 px-1">
//                             <label className="form-label fs-13 fw-bold">
//                               Contract Reference
//                             </label>
//                             <input
//                               type="text"
//                               className="form-control"
//                               value={formData.name}
//                               onChange={(e) =>
//                                 setFormData({
//                                   ...formData,
//                                   name: e.target.value,
//                                 })
//                               }
//                             />
//                           </div>
//                         </div>

//                         <hr className="my-4 opacity-25" />

//                         <h6 className="fw-bold text-primary mb-3 fs-14">
//                           <i className="ti ti-settings me-2"></i> Configuration
//                           Details
//                         </h6>
//                         <div className="row g-3 mx-0">
//                           <div className="col-md-4 px-1">
//                             <label className="form-label fs-13 fw-bold">
//                               Start Date <span className="text-danger">*</span>
//                             </label>
//                             <input
//                               type="date"
//                               className="form-control"
//                               value={formData.date_start}
//                               onChange={(e) =>
//                                 setFormData((prev) => ({
//                                   ...prev,
//                                   date_start: e.target.value,
//                                 }))
//                               }
//                               required
//                             />
//                           </div>

//                           <div className="col-md-4 px-1">
//                             <label className="form-label fs-13">
//                               Work Entry Source
//                             </label>
//                             <CommonSelect
//                               options={[
//                                 {
//                                   value: "calendar",
//                                   label: "Working Schedule",
//                                 },
//                                 { value: "attendances", label: "Attendances" },
//                               ]}
//                               defaultValue={{
//                                 value: formData.work_entry_source,
//                                 label:
//                                   formData.work_entry_source === "calendar"
//                                     ? "Working Schedule"
//                                     : "Attendances",
//                               }}
//                               onChange={(opt) =>
//                                 setFormData({
//                                   ...formData,
//                                   work_entry_source: opt?.value || "",
//                                 })
//                               }
//                             />
//                           </div>
//                           <div className="col-md-4 px-1">
//                             <label className="form-label fs-13">
//                               Working Schedule
//                             </label>
//                             <CommonSelect
//                               options={workingSchedules.map((s) => ({
//                                 value: String(s.id),
//                                 label: s.name,
//                               }))}
//                               defaultValue={
//                                 formData.resource_calendar_id
//                                   ? {
//                                       value: String(
//                                         formData.resource_calendar_id,
//                                       ),
//                                       label:
//                                         workingSchedules.find(
//                                           (s) =>
//                                             s.id ===
//                                             formData.resource_calendar_id,
//                                         )?.name || "",
//                                     }
//                                   : undefined
//                               }
//                               onChange={(opt) =>
//                                 setFormData({
//                                   ...formData,
//                                   resource_calendar_id: Number(opt?.value),
//                                 })
//                               }
//                             />
//                           </div>
//                           <div className="col-md-4 px-1">
//                             <label className="form-label fs-13">
//                               Department
//                             </label>
//                             <CommonSelect
//                               options={departments.map((d) => ({
//                                 value: String(d.id),
//                                 label: d.name,
//                               }))}
//                               defaultValue={
//                                 formData.department_id
//                                   ? {
//                                       value: String(formData.department_id),
//                                       label:
//                                         departments.find(
//                                           (d) =>
//                                             d.id === formData.department_id,
//                                         )?.name || "",
//                                     }
//                                   : undefined
//                               }
//                               onChange={(opt) =>
//                                 setFormData({
//                                   ...formData,
//                                   department_id: Number(opt?.value),
//                                 })
//                               }
//                             />
//                           </div>
//                           <div className="col-md-4 px-1">
//                             <label className="form-label fs-13">
//                               Wage Type
//                             </label>
//                             <CommonSelect
//                               options={[
//                                 { value: "monthly", label: "Fixed Wage" },
//                                 { value: "hourly", label: "Hourly Wage" },
//                               ]}
//                               defaultValue={{
//                                 value: formData.wage_type,
//                                 label:
//                                   formData.wage_type === "monthly"
//                                     ? "Fixed Wage"
//                                     : "Hourly Wage",
//                               }}
//                               onChange={(opt) =>
//                                 setFormData({
//                                   ...formData,
//                                   wage_type: opt?.value || "",
//                                 })
//                               }
//                             />
//                           </div>
//                           <div className="col-md-4 px-1">
//                             <label className="form-label fs-13 fw-bold">
//                               Wage (CTC) <span className="text-danger">*</span>
//                             </label>
//                             <div className="input-group">
//                               <span className="input-group-text bg-white fw-bold">
//                                 ₹
//                               </span>
//                               <input
//                                 type="number"
//                                 className="form-control border-primary fw-bold text-success"
//                                 value={formData.wage}
//                                 onChange={(e) =>
//                                   setFormData({
//                                     ...formData,
//                                     wage: Number(e.target.value),
//                                   })
//                                 }
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* TAB 2: SALARY STRUCTURE */}
//                     {activeTab === "salary" && (
//                       <div className="animate__animated animate__fadeIn">
//                         <div className="row g-4 mx-0">
//                           {/* COLUMN 1: EARNINGS & ALLOWANCES */}
//                           <div className="col-md-7 border-end pe-4">
//                             <h6 className="fw-bold text-success mb-3 border-bottom pb-2 fs-14">
//                               <i className="ti ti-circle-plus me-2"></i>{" "}
//                               Allowances & Benefits
//                             </h6>
//                             <div className="row g-2">
//                               {[
//                                 {
//                                   label: "Conveyance",
//                                   key: "conveyance_allowances",
//                                 },
//                                 { label: "Skill", key: "skill_allowances" },
//                                 { label: "Food", key: "food_allowances" },
//                                 { label: "Washing", key: "washing_allowances" },
//                                 { label: "Special", key: "special_allowances" },
//                                 { label: "Medical", key: "medial_allowances" },
//                                 { label: "Uniform", key: "uniform_allowances" },
//                                 {
//                                   label: "Child Education",
//                                   key: "child_education_allowances",
//                                 },
//                                 {
//                                   label: "Other Allowances",
//                                   key: "other_allowances",
//                                 },
//                                 { label: "LTA", key: "lta" },
//                                 { label: "Variable Pay", key: "variable_pay" },
//                               ].map((item) => (
//                                 <div className="col-md-6" key={item.key}>
//                                   <label className="form-label fs-12 mb-1">
//                                     {item.label}
//                                   </label>
//                                   <div className="input-group input-group-sm">
//                                     <span className="input-group-text bg-light text-muted">
//                                       ₹
//                                     </span>
//                                     <input
//                                       type="number"
//                                       className="form-control"
//                                       value={(formData as any)[item.key]}
//                                       onChange={(e) =>
//                                         setFormData({
//                                           ...formData,
//                                           [item.key]: Number(e.target.value),
//                                         })
//                                       }
//                                     />
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>

//                           {/* COLUMN 2: DEDUCTIONS */}
//                           <div className="col-md-5 ps-4">
//                             <h6 className="fw-bold text-danger mb-3 border-bottom pb-2 fs-14">
//                               <i className="ti ti-circle-minus me-2"></i>{" "}
//                               Deductions & Statutory
//                             </h6>
//                             <div className="row g-3">
//                               <div className="col-12">
//                                 <label className="form-label fs-13">
//                                   Professional Tax (PT)
//                                 </label>
//                                 <div className="input-group input-group-sm">
//                                   <span className="input-group-text text-danger border-danger">
//                                     ₹
//                                   </span>
//                                   <input
//                                     type="number"
//                                     className="form-control border-danger"
//                                     value={formData.professional_tax}
//                                     onChange={(e) =>
//                                       setFormData({
//                                         ...formData,
//                                         professional_tax: Number(
//                                           e.target.value,
//                                         ),
//                                       })
//                                     }
//                                   />
//                                 </div>
//                               </div>
//                               <div className="col-12">
//                                 <label className="form-label fs-13">
//                                   Gratuity Provision
//                                 </label>
//                                 <div className="input-group input-group-sm">
//                                   <span className="input-group-text">₹</span>
//                                   <input
//                                     type="number"
//                                     className="form-control"
//                                     value={formData.gratuity}
//                                     onChange={(e) =>
//                                       setFormData({
//                                         ...formData,
//                                         gratuity: Number(e.target.value),
//                                       })
//                                     }
//                                   />
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </>
//               )}
//             </div>

//             <div className="modal-footer border-0 bg-white px-4">
//               <button
//                 type="button"
//                 className="btn btn-light px-4"
//                 data-bs-dismiss="modal"
//                 onClick={onClose}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="btn btn-primary px-5 shadow-sm"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <span className="spinner-border spinner-border-sm me-2" />
//                 ) : (
//                   <i className="ti ti-device-floppy me-2"></i>
//                 )}
//                 {data ? "Update Contract" : "Save Contract"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddEditContractModal;

// =================================================================================================================================================

// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import {
//   Contract,
//   Employee,
//   WorkingSchedule,
//   Department,
//   createContract,
//   updateContract,
//   getEmployees,
//   getWorkingSchedules,
//   getDepartments,
// } from "./contractService";

// interface AddEditContractModalProps {
//   onSuccess: () => void;
//   data?: Contract | null;
//   onClose: () => void;
// }

// const AddEditContractModal: React.FC<AddEditContractModalProps> = ({
//   onSuccess,
//   data,
//   onClose,
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [workingSchedules, setWorkingSchedules] = useState<WorkingSchedule[]>([]);
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [loadingDropdowns, setLoadingDropdowns] = useState(true);

//   const [formData, setFormData] = useState<Omit<Contract, 'id'>>({
//     name: "",
//     employee_code: "",
//     employee_id: 0,
//     job_id: 0,
//     date_start: "",
//     work_entry_source: "calendar",
//     resource_calendar_id: 0,
//     structure_type_id: 0,
//     department_id: 0,
//     contract_type_id: 0,
//     wage_type: "monthly",
//     schedule_pay: "monthly",
//     wage: 0,
//     conveyance_allowances: 0,
//     skill_allowances: 0,
//     food_allowances: 0,
//     washing_allowances: 0,
//     special_allowances: 0,
//     medial_allowances: 0,
//     uniform_allowances: 0,
//     child_education_allowances: 0,
//     other_allowances: 0,
//     variable_pay: 0,
//     gratuity: 0,
//     professional_tax: 0,
//     lta: 0,
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   // Load dropdown data
//   useEffect(() => {
//     const loadDropdownData = async () => {
//       setLoadingDropdowns(true);
//       try {
//         const [employeesData, schedulesData, departmentsData] = await Promise.all([
//           getEmployees(),
//           getWorkingSchedules(),
//           getDepartments(),
//         ]);

//         setEmployees(employeesData);
//         setWorkingSchedules(schedulesData);
//         setDepartments(departmentsData);
//       } catch (error) {
//         console.error("Error loading dropdown data:", error);
//         toast.error("Failed to load form data");
//       } finally {
//         setLoadingDropdowns(false);
//       }
//     };

//     loadDropdownData();
//   }, []);

//   // Populate form when editing
//   useEffect(() => {
//     if (data) {
//       setFormData({
//         name: data.name || "",
//         employee_code: data.employee_code || "",
//         employee_id: data.employee_id || 0,
//         job_id: data.job_id || 0,
//         date_start: data.date_start || "",
//         work_entry_source: data.work_entry_source || "calendar",
//         resource_calendar_id: data.resource_calendar_id || 0,
//         structure_type_id: data.structure_type_id || 0,
//         department_id: data.department_id || 0,
//         contract_type_id: data.contract_type_id || 0,
//         wage_type: data.wage_type || "monthly",
//         schedule_pay: data.schedule_pay || "monthly",
//         wage: data.wage || 0,
//         conveyance_allowances: data.conveyance_allowances || 0,
//         skill_allowances: data.skill_allowances || 0,
//         food_allowances: data.food_allowances || 0,
//         washing_allowances: data.washing_allowances || 0,
//         special_allowances: data.special_allowances || 0,
//         medial_allowances: data.medial_allowances || 0,
//         uniform_allowances: data.uniform_allowances || 0,
//         child_education_allowances: data.child_education_allowances || 0,
//         other_allowances: data.other_allowances || 0,
//         variable_pay: data.variable_pay || 0,
//         gratuity: data.gratuity || 0,
//         professional_tax: data.professional_tax || 0,
//         lta: data.lta || 0,
//       });
//     } else {
//       // Reset form for new contract
//       setFormData({
//         name: "",
//         employee_code: "",
//         employee_id: 0,
//         job_id: 0,
//         date_start: "",
//         work_entry_source: "calendar",
//         resource_calendar_id: 0,
//         structure_type_id: 0,
//         department_id: 0,
//         contract_type_id: 0,
//         wage_type: "monthly",
//         schedule_pay: "monthly",
//         wage: 0,
//         conveyance_allowances: 0,
//         skill_allowances: 0,
//         food_allowances: 0,
//         washing_allowances: 0,
//         special_allowances: 0,
//         medial_allowances: 0,
//         uniform_allowances: 0,
//         child_education_allowances: 0,
//         other_allowances: 0,
//         variable_pay: 0,
//         gratuity: 0,
//         professional_tax: 0,
//         lta: 0,
//       });
//     }
//     setErrors({});
//   }, [data]);

//   // Handle employee selection
//   const handleEmployeeChange = (employeeId: number) => {
//     const selectedEmployee = employees.find(emp => emp.id === employeeId);
//     if (selectedEmployee) {
//       setFormData(prev => ({
//         ...prev,
//         employee_id: employeeId,
//         employee_code: selectedEmployee.employee_code,
//         name: `Contract for ${selectedEmployee.name}`,
//       }));
//     }
//   };

//   // Validation
//   const validateForm = (): boolean => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.employee_id) newErrors.employee_id = "Employee is required";
//     if (!formData.date_start) newErrors.date_start = "Contract start date is required";
//     if (!formData.wage || formData.wage <= 0) newErrors.wage = "Wage (CTC) is required and must be greater than 0";
//     if (!formData.work_entry_source) newErrors.work_entry_source = "Work entry source is required";
//     if (!formData.schedule_pay) newErrors.schedule_pay = "Schedule pay is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     setLoading(true);
//     try {
//       if (data?.id) {
//         await updateContract(data.id, formData);
//         toast.success("Contract updated successfully");
//       } else {
//         await createContract(formData);
//         toast.success("Contract created successfully");
//       }
//       onSuccess();
//       onClose();
//     } catch (error: any) {
//       toast.error(error.message || "Failed to save contract");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const schedulePayOptions = [
//     { value: "monthly", label: "Monthly" },
//     { value: "annually", label: "Annually" },
//     { value: "semi-annually", label: "Semi-annually" },
//     { value: "quarterly", label: "Quarterly" },
//     { value: "bi-monthly", label: "Bi-monthly" },
//     { value: "semi-monthly", label: "Semi-monthly" },
//     { value: "bi-weekly", label: "Bi-weekly" },
//     { value: "weekly", label: "Weekly" },
//     { value: "daily", label: "Daily" },
//   ];

//   const workEntrySourceOptions = [
//     { value: "calendar", label: "Working Schedule" },
//     { value: "attendances", label: "Attendances" },
//   ];

//   const wageTypeOptions = [
//     { value: "monthly", label: "Fixed Wage" },
//     { value: "hourly", label: "Hourly Wage" },
//     { value: "daily", label: "Daily Attendance" },
//   ];

//   return (
//     <div className="modal fade" id="add_contract" tabIndex={-1} role="dialog">
//       <div className="modal-dialog modal-lg" role="document">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">
//               {data ? "Edit Contract" : "Add New Contract"}
//             </h5>
//             <button
//               type="button"
//               className="btn-close"
//               data-bs-dismiss="modal"
//               onClick={onClose}
//             />
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="modal-body">
//               {loadingDropdowns ? (
//                 <div className="text-center p-4">
//                   <div className="spinner-border text-primary" />
//                   <div className="mt-2">Loading form data...</div>
//                 </div>
//               ) : (
//                 <div className="row">
//                   {/* Employee Selection */}
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">
//                       Employee <span className="text-danger">*</span>
//                     </label>
//                     <select
//                       className={`form-select ${errors.employee_id ? 'is-invalid' : ''}`}
//                       value={formData.employee_id}
//                       onChange={(e) => handleEmployeeChange(Number(e.target.value))}
//                       required
//                     >
//                       <option value="">Select Employee</option>
//                       {employees.map((employee) => (
//                         <option key={employee.id} value={employee.id}>
//                           {employee.name} ({employee.employee_code})
//                         </option>
//                       ))}
//                     </select>
//                     {errors.employee_id && (
//                       <div className="invalid-feedback">{errors.employee_id}</div>
//                     )}
//                   </div>

//                   {/* Employee Code (Read-only) */}
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Employee Code</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={formData.employee_code}
//                       readOnly
//                       style={{ backgroundColor: '#f8f9fa' }}
//                     />
//                   </div>

//                   {/* Contract Start Date */}
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">
//                       Contract Start Date <span className="text-danger">*</span>
//                     </label>
//                     <input
//                       type="date"
//                       className={`form-control ${errors.date_start ? 'is-invalid' : ''}`}
//                       value={formData.date_start}
//                       onChange={(e) => setFormData(prev => ({ ...prev, date_start: e.target.value }))}
//                       required
//                     />
//                     {errors.date_start && (
//                       <div className="invalid-feedback">{errors.date_start}</div>
//                     )}
//                   </div>

//                   {/* Work Entry Source */}
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">
//                       Work Entry Source <span className="text-danger">*</span>
//                     </label>
//                     <select
//                       className={`form-select ${errors.work_entry_source ? 'is-invalid' : ''}`}
//                       value={formData.work_entry_source}
//                       onChange={(e) => setFormData(prev => ({ ...prev, work_entry_source: e.target.value }))}
//                       required
//                     >
//                       {workEntrySourceOptions.map((option) => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                     {errors.work_entry_source && (
//                       <div className="invalid-feedback">{errors.work_entry_source}</div>
//                     )}
//                   </div>

//                   {/* Working Schedule */}
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Working Schedule</label>
//                     <select
//                       className="form-select"
//                       value={formData.resource_calendar_id}
//                       onChange={(e) => setFormData(prev => ({ ...prev, resource_calendar_id: Number(e.target.value) }))}
//                     >
//                       <option value="">Select Working Schedule</option>
//                       {workingSchedules.map((schedule) => (
//                         <option key={schedule.id} value={schedule.id}>
//                           {schedule.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Department */}
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Department</label>
//                     <select
//                       className="form-select"
//                       value={formData.department_id}
//                       onChange={(e) => setFormData(prev => ({ ...prev, department_id: Number(e.target.value) }))}
//                     >
//                       <option value="">Select Department</option>
//                       {departments.map((department) => (
//                         <option key={department.id} value={department.id}>
//                           {department.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Wage Type */}
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Wage Type</label>
//                     <select
//                       className="form-select"
//                       value={formData.wage_type}
//                       onChange={(e) => setFormData(prev => ({ ...prev, wage_type: e.target.value }))}
//                     >
//                       {wageTypeOptions.map((option) => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Schedule Pay */}
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">
//                       Schedule Pay <span className="text-danger">*</span>
//                     </label>
//                     <select
//                       className={`form-select ${errors.schedule_pay ? 'is-invalid' : ''}`}
//                       value={formData.schedule_pay}
//                       onChange={(e) => setFormData(prev => ({ ...prev, schedule_pay: e.target.value }))}
//                       required
//                     >
//                       {schedulePayOptions.map((option) => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                     {errors.schedule_pay && (
//                       <div className="invalid-feedback">{errors.schedule_pay}</div>
//                     )}
//                   </div>

//                   {/* Wage (CTC) */}
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">
//                       Wage (CTC) <span className="text-danger">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       className={`form-control ${errors.wage ? 'is-invalid' : ''}`}
//                       value={formData.wage}
//                       onChange={(e) => setFormData(prev => ({ ...prev, wage: Number(e.target.value) }))}
//                       min="0"
//                       step="0.01"
//                       required
//                     />
//                     {errors.wage && (
//                       <div className="invalid-feedback">{errors.wage}</div>
//                     )}
//                   </div>

//                   {/* Allowances Section */}
//                   <div className="col-12">
//                     <h6 className="mb-3 text-primary">Allowances</h6>
//                   </div>

//                   <div className="col-md-4 mb-3">
//                     <label className="form-label">Conveyance Allowances</label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={formData.conveyance_allowances}
//                       onChange={(e) => setFormData(prev => ({ ...prev, conveyance_allowances: Number(e.target.value) }))}
//                       min="0"
//                       step="0.01"
//                     />
//                   </div>

//                   <div className="col-md-4 mb-3">
//                     <label className="form-label">Skill Allowances</label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={formData.skill_allowances}
//                       onChange={(e) => setFormData(prev => ({ ...prev, skill_allowances: Number(e.target.value) }))}
//                       min="0"
//                       step="0.01"
//                     />
//                   </div>

//                   <div className="col-md-4 mb-3">
//                     <label className="form-label">Food Allowances</label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={formData.food_allowances}
//                       onChange={(e) => setFormData(prev => ({ ...prev, food_allowances: Number(e.target.value) }))}
//                       min="0"
//                       step="0.01"
//                     />
//                   </div>

//                   <div className="col-md-4 mb-3">
//                     <label className="form-label">Washing Allowances</label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={formData.washing_allowances}
//                       onChange={(e) => setFormData(prev => ({ ...prev, washing_allowances: Number(e.target.value) }))}
//                       min="0"
//                       step="0.01"
//                     />
//                   </div>

//                   <div className="col-md-4 mb-3">
//                     <label className="form-label">Special Allowances</label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={formData.special_allowances}
//                       onChange={(e) => setFormData(prev => ({ ...prev, special_allowances: Number(e.target.value) }))}
//                       min="0"
//                       step="0.01"
//                     />
//                   </div>

//                   <div className="col-md-4 mb-3">
//                     <label className="form-label">Medical Allowances</label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={formData.medial_allowances}
//                       onChange={(e) => setFormData(prev => ({ ...prev, medial_allowances: Number(e.target.value) }))}
//                       min="0"
//                       step="0.01"
//                     />
//                   </div>

//                   <div className="col-md-4 mb-3">
//                     <label className="form-label">Uniform Allowances</label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={formData.uniform_allowances}
//                       onChange={(e) => setFormData(prev => ({ ...prev, uniform_allowances: Number(e.target.value) }))}
//                       min="0"
//                       step="0.01"
//                     />
//                   </div>

//                   <div className="col-md-4 mb-3">
//                     <label className="form-label">Child Education Allowances</label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={formData.child_education_allowances}
//                       onChange={(e) => setFormData(prev => ({ ...prev, child_education_allowances: Number(e.target.value) }))}
//                       min="0"
//                       step="0.01"
//                     />
//                   </div>

//                   <div className="col-md-4 mb-3">
//                     <label className="form-label">Other Allowances</label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={formData.other_allowances}
//                       onChange={(e) => setFormData(prev => ({ ...prev, other_allowances: Number(e.target.value) }))}
//                       min="0"
//                       step="0.01"
//                     />
//                   </div>

//                   {/* Other Benefits Section */}
//                   <div className="col-12">
//                     <h6 className="mb-3 text-primary">Other Benefits & Deductions</h6>
//                   </div>

//                   <div className="col-md-3 mb-3">
//                     <label className="form-label">Variable Pay</label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={formData.variable_pay}
//                       onChange={(e) => setFormData(prev => ({ ...prev, variable_pay: Number(e.target.value) }))}
//                       min="0"
//                       step="0.01"
//                     />
//                   </div>

//                   <div className="col-md-3 mb-3">
//                     <label className="form-label">Gratuity</label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={formData.gratuity}
//                       onChange={(e) => setFormData(prev => ({ ...prev, gratuity: Number(e.target.value) }))}
//                       min="0"
//                       step="0.01"
//                     />
//                   </div>

//                   <div className="col-md-3 mb-3">
//                     <label className="form-label">Professional Tax</label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={formData.professional_tax}
//                       onChange={(e) => setFormData(prev => ({ ...prev, professional_tax: Number(e.target.value) }))}
//                       min="0"
//                       step="0.01"
//                     />
//                   </div>

//                   <div className="col-md-3 mb-3">
//                     <label className="form-label">LTA</label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={formData.lta}
//                       onChange={(e) => setFormData(prev => ({ ...prev, lta: Number(e.target.value) }))}
//                       min="0"
//                       step="0.01"
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="modal-footer">
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 data-bs-dismiss="modal"
//                 onClick={onClose}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="btn btn-primary"
//                 disabled={loading || loadingDropdowns}
//               >
//                 {loading ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" />
//                     {data ? "Updating..." : "Creating..."}
//                   </>
//                 ) : (
//                   data ? "Update Contract" : "Create Contract"
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddEditContractModal;
