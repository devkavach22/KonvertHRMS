import React, { useEffect, useState } from "react";
import {
  createSalaryStructure,
  updateSalaryStructure,
  getStructureTypesList,
  SalaryStructure,
  StructureTypeOption,
} from "./SalaryStructureService";
import { getCountries } from "@/KHRModules/EmployeModules/Employee/EmployeeServices";
import { toast } from "react-toastify";
import CommonSelect from "../../../core/common/commonSelect";

interface Props {
  onSuccess: () => void;
  data: SalaryStructure | null;
  onClose: () => void;
}

const AddEditSalaryStructureModal: React.FC<Props> = ({
  onSuccess,
  data,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Dropdown Options
  const [countries, setCountries] = useState<any[]>([]);
  const [structureTypes, setStructureTypes] = useState<StructureTypeOption[]>(
    [],
  );

  // Static Options for Schedule Pay
  const schedulePayOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "semi-annually", label: "Semi-Annually" },
    { value: "annually", label: "Annually" },
    { value: "weekly", label: "Weekly" },
    { value: "bi-weekly", label: "Bi-Weekly" },
    { value: "bi-monthly", label: "Bi-Monthly" },
  ];

  const initialFormState: SalaryStructure = {
    name: "",
    typeId: "",
    countryId: "",
    schedulePay: "",
    payslipName: "",
    useWorkedDayLines: false,
    ytdComputation: false,
    hideBasicOnPdf: false,
  };

  const [formData, setFormData] = useState<SalaryStructure>(initialFormState);

  // 1. Lifecycle - Reset on Close
  useEffect(() => {
    const modalElement = document.getElementById("add_salary_structure_modal");
    const handleModalHidden = () => {
      resetForm();
      onClose();
    };
    modalElement?.addEventListener("hidden.bs.modal", handleModalHidden);
    return () => {
      modalElement?.removeEventListener("hidden.bs.modal", handleModalHidden);
    };
  }, [onClose]);

  // 2. Fetch Dropdowns
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [countryData, typeData] = await Promise.all([
          getCountries(),
          getStructureTypesList(),
        ]);

        setCountries(
          countryData.map((c: any) => ({ value: String(c.id), label: c.name })),
        );
        setStructureTypes(typeData);
      } catch (error) {
        console.error("Error loading dropdowns", error);
      }
    };
    fetchDropdowns();
  }, []);

  // 3. Populate on Edit
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        typeId: data.typeId ? String(data.typeId) : "",
        countryId: data.countryId ? String(data.countryId) : "",
        schedulePay: data.schedulePay || "",
        payslipName: data.payslipName || "",
        useWorkedDayLines: data.useWorkedDayLines || false,
        ytdComputation: data.ytdComputation || false,
        hideBasicOnPdf: data.hideBasicOnPdf || false,
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

  // --- HANDLERS & VALIDATION HELPERS ---

  // FIX: Use functional update to prevent stale state issues when multiple errors are cleared at once
  const clearError = (fieldName: string) => {
    setErrors((prev: any) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  // Validation Styles
  const getInputClass = (fieldName: string) => {
    if (errors[fieldName]) return "form-control is-invalid";
    if (
      isSubmitted &&
      formData[fieldName as keyof SalaryStructure] &&
      !errors[fieldName]
    )
      return "form-control is-valid";
    return "form-control";
  };

  const getSelectWrapperClass = (fieldName: string) => {
    if (errors[fieldName]) return "border border-danger rounded";
    if (
      isSubmitted &&
      formData[fieldName as keyof SalaryStructure] &&
      !errors[fieldName]
    )
      return "border border-success rounded";
    return "";
  };

  const handleTypeChange = (selectedOption: any) => {
    const typeIdVal = selectedOption?.value;
    const selectedType = structureTypes.find(
      (t) => String(t.id) === String(typeIdVal),
    );

    setFormData((prev) => ({
      ...prev,
      typeId: typeIdVal || "",
      schedulePay: selectedType ? selectedType.default_schedule_pay : "",
    }));

    clearError("typeId");
    // Even if we clear schedulePay error here, the functional update in clearError ensures typeId error removal isn't lost
    if (selectedType?.default_schedule_pay) {
      clearError("schedulePay");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: val });
    clearError(name);
  };

  const validate = () => {
    let tempErrors: any = {};
    if (!formData.name?.trim()) tempErrors.name = "Structure Name is required";
    if (!formData.typeId) tempErrors.typeId = "Structure Type is required";
    if (!formData.countryId) tempErrors.countryId = "Country is required";
    // Removed schedulePay validation
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = { ...formData };

      if (data?.id) {
        await updateSalaryStructure(data.id, payload);
        toast.success("Salary Structure updated successfully");
      } else {
        await createSalaryStructure(payload);
        toast.success("Salary Structure created successfully");
      }
      onSuccess();
      document.getElementById("close-btn-sal-struct")?.click();
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
      <div className="modal fade" id="add_salary_structure_modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header border-bottom bg-light py-2">
              <h5 className="modal-title fw-bold text-dark fs-16">
                <i className="ti ti-file-dollar me-2 text-primary"></i>
                {data ? "Edit Salary Structure" : "Create Salary Structure"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="close-btn-sal-struct"
                onClick={resetForm}
              ></button>
            </div>

            <div className="modal-body p-4">
              <form onSubmit={handleSubmit} noValidate>
                {/* Row 1: Name & Type */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fs-13 fw-bold">
                      Structure Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      className={getInputClass("name")}
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fs-13 fw-bold">
                      Type <span className="text-danger">*</span>
                    </label>
                    <div className={getSelectWrapperClass("typeId")}>
                      <CommonSelect
                        key={formData.typeId}
                        options={structureTypes.map((t) => ({
                          value: String(t.id),
                          label: t.name,
                        }))}
                        placeholder="Select Type"
                        defaultValue={structureTypes
                          .map((t) => ({ value: String(t.id), label: t.name }))
                          .find((opt) => opt.value === String(formData.typeId))}
                        onChange={handleTypeChange}
                      />
                    </div>
                    {errors.typeId && (
                      <div className="text-danger fs-11 mt-1">
                        {errors.typeId}
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 2: Country & Schedule Pay */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fs-13 fw-bold">
                      Country <span className="text-danger">*</span>
                    </label>
                    <div className={getSelectWrapperClass("countryId")}>
                      <CommonSelect
                        key={formData.countryId}
                        options={countries}
                        defaultValue={countries.find(
                          (c) => c.value === String(formData.countryId),
                        )}
                        onChange={(opt) => {
                          setFormData({
                            ...formData,
                            countryId: opt?.value || "",
                          });
                          clearError("countryId");
                        }}
                      />
                    </div>
                    {errors.countryId && (
                      <div className="text-danger fs-11 mt-1">
                        {errors.countryId}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    {/* Removed asterisk and validation class for Schedule Pay */}
                    <label className="form-label fs-13 fw-bold">
                      Scheduled Pay
                    </label>
                    <div>
                      <CommonSelect
                        key={formData.schedulePay}
                        options={schedulePayOptions}
                        disabled={true}
                        value={schedulePayOptions.find(
                          (s) => s.value === formData.schedulePay,
                        )}
                        onChange={(opt) =>
                          setFormData({
                            ...formData,
                            schedulePay: opt?.value || "",
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Payslip Name */}
                <div className="row g-3 mb-4">
                  <div className="col-md-12">
                    <label className="form-label fs-13 fw-bold">
                      Payslip Name
                    </label>
                    <input
                      type="text"
                      name="payslipName"
                      className="form-control"
                      value={formData.payslipName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <h6 className="fw-bold text-primary mb-3 pb-2 border-bottom fs-14">
                  Configuration
                </h6>

                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="useWorkedDayLines"
                        name="useWorkedDayLines"
                        checked={formData.useWorkedDayLines}
                        onChange={handleInputChange}
                      />
                      <label
                        className="form-check-label fs-13"
                        htmlFor="useWorkedDayLines"
                      >
                        Use Worked Day Lines
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="ytdComputation"
                        name="ytdComputation"
                        checked={formData.ytdComputation}
                        onChange={handleInputChange}
                      />
                      <label
                        className="form-check-label fs-13"
                        htmlFor="ytdComputation"
                      >
                        YTD Computation
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="hideBasicOnPdf"
                        name="hideBasicOnPdf"
                        checked={formData.hideBasicOnPdf}
                        onChange={handleInputChange}
                      />
                      <label
                        className="form-check-label fs-13"
                        htmlFor="hideBasicOnPdf"
                      >
                        Hide Basic on PDF
                      </label>
                    </div>
                  </div>
                </div>

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
                      "Save Structure"
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

export default AddEditSalaryStructureModal;

// import React, { useEffect, useState } from "react";
// import {
//   createSalaryStructure,
//   updateSalaryStructure,
//   getStructureTypesList,
//   SalaryStructure,
//   StructureTypeOption,
// } from "./SalaryStructureService";
// import { getCountries } from "@/KHRModules/EmployeModules/Employee/EmployeeServices";
// import { toast } from "react-toastify";
// import CommonSelect from "../../../core/common/commonSelect";

// interface Props {
//   onSuccess: () => void;
//   data: SalaryStructure | null;
//   onClose: () => void;
// }

// const AddEditSalaryStructureModal: React.FC<Props> = ({
//   onSuccess,
//   data,
//   onClose,
// }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [errors, setErrors] = useState<any>({});

//   // Dropdown Options
//   const [countries, setCountries] = useState<any[]>([]);
//   const [structureTypes, setStructureTypes] = useState<StructureTypeOption[]>(
//     [],
//   );

//   // Static Options for Schedule Pay
//   const schedulePayOptions = [
//     { value: "monthly", label: "Monthly" },
//     { value: "quarterly", label: "Quarterly" },
//     { value: "semi-annually", label: "Semi-Annually" },
//     { value: "annually", label: "Annually" },
//     { value: "weekly", label: "Weekly" },
//     { value: "bi-weekly", label: "Bi-Weekly" },
//     { value: "bi-monthly", label: "Bi-Monthly" },
//   ];

//   const initialFormState: SalaryStructure = {
//     name: "",
//     typeId: "",
//     countryId: "",
//     schedulePay: "",
//     payslipName: "",
//     // reportId removed
//     useWorkedDayLines: false,
//     ytdComputation: false,
//     hideBasicOnPdf: false,
//   };

//   const [formData, setFormData] = useState<SalaryStructure>(initialFormState);

//   // 1. Lifecycle - Reset on Close
//   useEffect(() => {
//     const modalElement = document.getElementById("add_salary_structure_modal");
//     const handleModalHidden = () => {
//       resetForm();
//       onClose();
//     };
//     modalElement?.addEventListener("hidden.bs.modal", handleModalHidden);
//     return () => {
//       modalElement?.removeEventListener("hidden.bs.modal", handleModalHidden);
//     };
//   }, [onClose]);

//   // 2. Fetch Dropdowns
//   useEffect(() => {
//     const fetchDropdowns = async () => {
//       try {
//         const [countryData, typeData] = await Promise.all([
//           getCountries(),
//           getStructureTypesList(),
//         ]);

//         setCountries(
//           countryData.map((c: any) => ({ value: String(c.id), label: c.name })),
//         );
//         setStructureTypes(typeData);
//       } catch (error) {
//         console.error("Error loading dropdowns", error);
//       }
//     };
//     fetchDropdowns();
//   }, []);

//   // 3. Populate on Edit
//   useEffect(() => {
//     if (data) {
//       setFormData({
//         name: data.name || "",
//         typeId: data.typeId ? String(data.typeId) : "",
//         countryId: data.countryId ? String(data.countryId) : "",
//         schedulePay: data.schedulePay || "",
//         payslipName: data.payslipName || "",
//         // reportId removed
//         useWorkedDayLines: data.useWorkedDayLines || false,
//         ytdComputation: data.ytdComputation || false,
//         hideBasicOnPdf: data.hideBasicOnPdf || false,
//       });
//     } else {
//       resetForm();
//     }
//   }, [data]);

//   const resetForm = () => {
//     setFormData(initialFormState);
//     setErrors({});
//     setIsSubmitted(false);
//     setIsSubmitting(false);
//   };

//   // --- HANDLERS ---

//   const clearError = (fieldName: string) => {
//     if (errors[fieldName]) {
//       const newErrors = { ...errors };
//       delete newErrors[fieldName];
//       setErrors(newErrors);
//     }
//   };

//   const handleTypeChange = (selectedOption: any) => {
//     const typeIdVal = selectedOption?.value;
//     const selectedType = structureTypes.find(
//       (t) => String(t.id) === String(typeIdVal),
//     );

//     setFormData((prev) => ({
//       ...prev,
//       typeId: typeIdVal || "",
//       schedulePay: selectedType ? selectedType.default_schedule_pay : "",
//     }));

//     clearError("typeId");
//     if (selectedType?.default_schedule_pay) {
//       clearError("schedulePay");
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     const val = type === "checkbox" ? checked : value;
//     setFormData({ ...formData, [name]: val });
//     clearError(name);
//   };

//   const validate = () => {
//     let tempErrors: any = {};
//     if (!formData.name?.trim()) tempErrors.name = "Structure Name is required";
//     if (!formData.typeId) tempErrors.typeId = "Structure Type is required";
//     if (!formData.countryId) tempErrors.countryId = "Country is required";
//     if (!formData.schedulePay)
//       tempErrors.schedulePay = "Schedule Pay is required";
//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitted(true);
//     if (!validate()) return;

//     setIsSubmitting(true);
//     try {
//       // Create a clean payload (optional, if you need to strictly remove reportId from API call)
//       const payload = { ...formData };
//       // delete payload.reportId; // Uncomment if your API strictness requires it

//       if (data?.id) {
//         await updateSalaryStructure(data.id, payload);
//         toast.success("Salary Structure updated successfully");
//       } else {
//         await createSalaryStructure(payload);
//         toast.success("Salary Structure created successfully");
//       }
//       onSuccess();
//       document.getElementById("close-btn-sal-struct")?.click();
//     } catch (err) {
//       toast.error("Error saving data");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="modal fade" id="add_salary_structure_modal" role="dialog">
//       <div className="modal-dialog modal-dialog-centered modal-lg">
//         <div className="modal-content border-0 shadow-lg">
//           <div className="modal-header border-bottom bg-light py-2">
//             <h5 className="modal-title fw-bold text-dark fs-16">
//               <i className="ti ti-file-dollar me-2 text-primary"></i>
//               {data ? "Edit Salary Structure" : "Create Salary Structure"}
//             </h5>
//             <button
//               type="button"
//               className="btn-close"
//               data-bs-dismiss="modal"
//               id="close-btn-sal-struct"
//               onClick={resetForm}
//             ></button>
//           </div>

//           <div className="modal-body p-4">
//             <form onSubmit={handleSubmit} noValidate>
//               {/* Row 1: Name & Type */}
//               <div className="row g-3 mb-3">
//                 <div className="col-md-6">
//                   <label className="form-label fs-13 fw-bold">
//                     Structure Name <span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     className={`form-control ${
//                       isSubmitted
//                         ? errors.name
//                           ? "is-invalid"
//                           : "is-valid"
//                         : ""
//                     }`}
//                     value={formData.name}
//                     onChange={handleInputChange}
//                   />
//                   {isSubmitted && errors.name && (
//                     <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
//                       <i className="ti ti-info-circle me-1"></i>
//                       {errors.name}
//                     </div>
//                   )}
//                 </div>

//                 <div className="col-md-6">
//                   <label className="form-label fs-13 fw-bold">
//                     Type <span className="text-danger">*</span>
//                   </label>
//                   <div
//                     className={
//                       isSubmitted && errors.typeId
//                         ? "border border-danger rounded"
//                         : ""
//                     }
//                   >
//                     <CommonSelect
//                       key={formData.typeId}
//                       options={structureTypes.map((t) => ({
//                         value: String(t.id),
//                         label: t.name,
//                       }))}
//                       placeholder="Select Type"
//                       defaultValue={structureTypes
//                         .map((t) => ({ value: String(t.id), label: t.name }))
//                         .find((opt) => opt.value === String(formData.typeId))}
//                       onChange={handleTypeChange}
//                     />
//                   </div>
//                   {isSubmitted && errors.typeId && (
//                     <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
//                       <i className="ti ti-info-circle me-1"></i>
//                       {errors.typeId}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Row 2: Country & Schedule Pay */}
//               <div className="row g-3 mb-3">
//                 <div className="col-md-6">
//                   <label className="form-label fs-13 fw-bold">
//                     Country <span className="text-danger">*</span>
//                   </label>
//                   <div
//                     className={
//                       isSubmitted && errors.countryId
//                         ? "border border-danger rounded"
//                         : ""
//                     }
//                   >
//                     <CommonSelect
//                       key={formData.countryId}
//                       options={countries}
//                       defaultValue={countries.find(
//                         (c) => c.value === String(formData.countryId),
//                       )}
//                       onChange={(opt) => {
//                         setFormData({
//                           ...formData,
//                           countryId: opt?.value || "",
//                         });
//                         clearError("countryId");
//                       }}
//                     />
//                   </div>
//                   {isSubmitted && errors.countryId && (
//                     <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
//                       <i className="ti ti-info-circle me-1"></i>
//                       {errors.countryId}
//                     </div>
//                   )}
//                 </div>

//                 <div className="col-md-6">
//                   <label className="form-label fs-13 fw-bold">
//                     Scheduled Pay <span className="text-danger">*</span>
//                   </label>
//                   <div
//                     className={
//                       isSubmitted && errors.schedulePay
//                         ? "border border-danger rounded"
//                         : ""
//                     }
//                   >
//                     <CommonSelect
//                       key={formData.schedulePay}
//                       options={schedulePayOptions}
//                       disabled={true}
//                       value={schedulePayOptions.find(
//                         (s) => s.value === formData.schedulePay,
//                       )}
//                       onChange={(opt) =>
//                         setFormData({
//                           ...formData,
//                           schedulePay: opt?.value || "",
//                         })
//                       }
//                     />
//                   </div>
//                   {isSubmitted && errors.schedulePay && (
//                     <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
//                       <i className="ti ti-info-circle me-1"></i>
//                       {errors.schedulePay}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Row 3: Payslip Name (Report Removed) */}
//               <div className="row g-3 mb-4">
//                 <div className="col-md-12">
//                   <label className="form-label fs-13 fw-bold">
//                     Payslip Name
//                   </label>
//                   <input
//                     type="text"
//                     name="payslipName"
//                     className="form-control"
//                     value={formData.payslipName}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//               </div>

//               <h6 className="fw-bold text-primary mb-3 pb-2 border-bottom fs-14">
//                 Configuration
//               </h6>

//               <div className="row g-3">
//                 <div className="col-md-4">
//                   <div className="form-check form-switch">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id="useWorkedDayLines"
//                       name="useWorkedDayLines"
//                       checked={formData.useWorkedDayLines}
//                       onChange={handleInputChange}
//                     />
//                     <label
//                       className="form-check-label fs-13"
//                       htmlFor="useWorkedDayLines"
//                     >
//                       Use Worked Day Lines
//                     </label>
//                   </div>
//                 </div>
//                 <div className="col-md-4">
//                   <div className="form-check form-switch">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id="ytdComputation"
//                       name="ytdComputation"
//                       checked={formData.ytdComputation}
//                       onChange={handleInputChange}
//                     />
//                     <label
//                       className="form-check-label fs-13"
//                       htmlFor="ytdComputation"
//                     >
//                       YTD Computation
//                     </label>
//                   </div>
//                 </div>
//                 <div className="col-md-4">
//                   <div className="form-check form-switch">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id="hideBasicOnPdf"
//                       name="hideBasicOnPdf"
//                       checked={formData.hideBasicOnPdf}
//                       onChange={handleInputChange}
//                     />
//                     <label
//                       className="form-check-label fs-13"
//                       htmlFor="hideBasicOnPdf"
//                     >
//                       Hide Basic on PDF
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               <div className="modal-footer border-0 px-0 mt-4 pb-0">
//                 <button
//                   type="button"
//                   className="btn btn-outline-secondary px-4 me-2"
//                   data-bs-dismiss="modal"
//                   onClick={resetForm}
//                 >
//                   Discard
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn btn-primary px-5 shadow-sm"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <span
//                         className="spinner-border spinner-border-sm me-2"
//                         role="status"
//                         aria-hidden="true"
//                       ></span>
//                       Saving...
//                     </>
//                   ) : data ? (
//                     "Update Changes"
//                   ) : (
//                     "Save Structure"
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddEditSalaryStructureModal;
