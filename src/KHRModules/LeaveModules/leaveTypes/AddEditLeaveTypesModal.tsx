import React, { useEffect, useState } from "react";
import {
  createLeaveType,
  LeaveTypePayload,
  updateLeaveType,
} from "./LeavetypesServices";
import toast from "react-hot-toast";
import CommonSelect from "../../../core/common/commonSelect"; // Ensure this path is correct

interface Props {
  onSuccess: () => void;
  data: any;
}

const AddEditLeaveTypesModal: React.FC<Props> = ({ onSuccess, data }) => {
  const [isSavingLeaveType, setIsSavingLeaveType] = useState(false);

  // Leave Type form states
  const [leaveName, setLeaveName] = useState<string>("");
  const [leaveValidationType, setLeaveValidationType] = useState<string>("");
  const [allocationValidationType, setAllocationValidationType] =
    useState<string>("");
  const [requiresAllocation, setRequiresAllocation] = useState<string>("");
  const [employeeRequests, setEmployeeRequests] = useState<string>("");
  const [responsibleIds, setResponsibleIds] = useState<number[]>([]);
  const [leaveTypeCode, setLeaveTypeCode] = useState<string>("");
  const [leaveCategory, setLeaveCategory] = useState<string>("");
  const [requestUnit, setRequestUnit] = useState<string>("half_day");
  const [includePublicHolidaysInDuration, setIncludePublicHolidaysInDuration] =
    useState<boolean>(true);
  const [overtimeDeductible, setOvertimeDeductible] = useState<boolean>(false);
  const [isEarnedLeave, setIsEarnedLeave] = useState<boolean>(true);

  // Validation states (Touched)
  const [touched, setTouched] = useState({
    name: false,
    code: false,
    category: false,
  });

  // --- STATIC OPTIONS FOR COMMON SELECT ---
  const categoryOptions = [
    { value: "statutory", label: "Statutory" },
    { value: "non_statutory", label: "Non Statutory" },
    { value: "custom", label: "Custom" },
  ];

  const validationOptions = [
    { value: "manager", label: "Manager" },
    { value: "hr", label: "HR" },
    { value: "admin", label: "Both (Admin)" },
  ];

  const allocationOptions = [
    { value: "manager", label: "Manager" },
    { value: "hr", label: "HR" },
    { value: "admin", label: "Admin" },
  ];

  const yesNoOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const unitOptions = [
    { value: "half_day", label: "Half Day" },
    { value: "day", label: "Day" },
    { value: "hours", label: "Hours" },
  ];

  // --- POPULATE DATA ---
  useEffect(() => {
    if (data) {
      setLeaveName(data.name || "");
      setLeaveValidationType(data.leave_validation_type || "");
      setAllocationValidationType(data.allocation_validation_type || "");
      setRequiresAllocation(data.requires_allocation || "");
      setEmployeeRequests(data.employee_requests || "");
      setResponsibleIds(data.responsible_ids || []);
      setLeaveTypeCode(data.leave_type_code || "");
      setLeaveCategory(data.leave_category || "");
      setRequestUnit(data.request_unit || "half_day");
      setIncludePublicHolidaysInDuration(
        data.include_public_holidays_in_duration ?? true,
      );
      setOvertimeDeductible(data.overtime_deductible ?? false);
      setIsEarnedLeave(data.is_earned_leave ?? true);
    } else {
      resetFormState();
    }
  }, [data]);

  const resetFormState = () => {
    setLeaveName("");
    setLeaveValidationType("");
    setAllocationValidationType("");
    setRequiresAllocation("");
    setEmployeeRequests("");
    setResponsibleIds([]);
    setLeaveTypeCode("");
    setLeaveCategory("");
    setRequestUnit("half_day");
    setIncludePublicHolidaysInDuration(true);
    setOvertimeDeductible(false);
    setIsEarnedLeave(true);
    setTouched({ name: false, code: false, category: false });
  };

  // --- MODAL RESET LISTENER ---
  useEffect(() => {
    const modalElement = document.getElementById("add_leave_type_modal");
    const handleModalClose = () => {
      resetFormState();
    };
    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", handleModalClose);
    }
    return () => {
      if (modalElement) {
        modalElement.removeEventListener("hidden.bs.modal", handleModalClose);
      }
    };
  }, []);

  // --- SAVE HANDLER ---
  const handleSaveLeaveType = async () => {
    setTouched({
      name: true,
      code: true,
      category: true,
    });

    if (!leaveName || !leaveTypeCode || !leaveCategory) {
      toast.error("Please fill all required fields.");
      return;
    }

    setIsSavingLeaveType(true);
    try {
      const payload: LeaveTypePayload = {
        name: leaveName,
        leave_validation_type: leaveValidationType || undefined,
        allocation_validation_type: allocationValidationType || undefined,
        requires_allocation: requiresAllocation || undefined,
        employee_requests: employeeRequests || undefined,
        responsible_ids: responsibleIds.length > 0 ? responsibleIds : undefined,
        leave_type_code: leaveTypeCode,
        leave_category: leaveCategory,
        request_unit: requestUnit || undefined,
        include_public_holidays_in_duration: includePublicHolidaysInDuration,
        overtime_deductible: overtimeDeductible,
        is_earned_leave: isEarnedLeave,
      };

      if (data && data.id) {
        await updateLeaveType(data.id, payload);
        toast.success("Leave type updated.");
      } else {
        await createLeaveType(payload);
        toast.success("Leave type created.");
      }
      document.getElementById("close-btn-leave-type")?.click();
      onSuccess();
    } catch (err) {
      console.error("Error saving leave type", err);
      toast.error("Failed to save leave type.");
    } finally {
      setIsSavingLeaveType(false);
    }
  };

  // --- HELPER: GET VALIDATION CLASSES ---
  // Returns 'is-invalid' for errors, 'is-valid' for success (Standard Inputs)
  // Returns 'border-danger' or 'border-success' for CommonSelect wrappers
  const getValidationClass = (
    fieldTouched: boolean,
    value: any,
    isSelect = false,
  ) => {
    if (!fieldTouched) return "";

    if (!value) {
      return isSelect ? "border border-danger rounded" : "is-invalid";
    }
    return isSelect ? "border border-success rounded" : "is-valid";
  };

  return (
    <div
      className="modal custom-modal fade"
      id="add_leave_type_modal"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          {/* Header */}
          <div className="modal-header border-bottom bg-light py-2">
            <h5 className="modal-title fw-bold fs-15">
              <i className="ti ti-calendar-time me-2 text-primary"></i>
              {data ? "Edit Leave Type" : "Add Leave Type"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-btn-leave-type"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-3">
              {/* 1. NAME (Standard Input) */}
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label fs-13 fw-bold">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${getValidationClass(touched.name, leaveName)}`}
                    value={leaveName}
                    onChange={(e) => setLeaveName(e.target.value)}
                    onBlur={() => setTouched({ ...touched, name: true })}
                    placeholder="Enter leave type name"
                  />
                  {touched.name && !leaveName && (
                    <div className="invalid-feedback">Name is required</div>
                  )}
                </div>
              </div>

              {/* 2. CODE (Standard Input - Simple) */}
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label fs-13 fw-bold">
                    Leave Type Code <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${getValidationClass(touched.code, leaveTypeCode)}`}
                    value={leaveTypeCode}
                    onChange={(e) => setLeaveTypeCode(e.target.value)}
                    onBlur={() => setTouched({ ...touched, code: true })}
                    placeholder="e.g. SL, CL, PL"
                  />
                  {touched.code && !leaveTypeCode && (
                    <div className="invalid-feedback">
                      Leave Type Code is required
                    </div>
                  )}
                </div>
              </div>

              {/* 3. CATEGORY (Common Select) */}
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label fs-13 fw-bold">
                    Leave Category <span className="text-danger">*</span>
                  </label>
                  <div
                    className={getValidationClass(
                      touched.category,
                      leaveCategory,
                      true,
                    )}
                  >
                    <CommonSelect
                      options={categoryOptions}
                      placeholder="Select Category"
                      defaultValue={categoryOptions.find(
                        (o) => o.value === leaveCategory,
                      )}
                      onChange={(opt) => {
                        setLeaveCategory(opt?.value || "");
                        setTouched({ ...touched, category: true });
                      }}
                    />
                  </div>
                  {touched.category && !leaveCategory && (
                    <div className="text-danger fs-11 mt-1">
                      Leave Category is required
                    </div>
                  )}
                </div>
              </div>

              {/* 4. LEAVE VALIDATION (Common Select) */}
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label fs-13">
                    Leave Validation Type
                  </label>
                  <CommonSelect
                    options={validationOptions}
                    placeholder="Select Type"
                    defaultValue={validationOptions.find(
                      (o) => o.value === leaveValidationType,
                    )}
                    onChange={(opt) => setLeaveValidationType(opt?.value || "")}
                  />
                </div>
              </div>

              {/* 5. ALLOCATION VALIDATION (Common Select) */}
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label fs-13">
                    Allocation Validation Type
                  </label>
                  <CommonSelect
                    options={allocationOptions}
                    placeholder="Select Type"
                    defaultValue={allocationOptions.find(
                      (o) => o.value === allocationValidationType,
                    )}
                    onChange={(opt) =>
                      setAllocationValidationType(opt?.value || "")
                    }
                  />
                </div>
              </div>

              {/* 6. REQUIRES ALLOCATION (Common Select) */}
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label fs-13">
                    Requires Allocation
                  </label>
                  <CommonSelect
                    options={yesNoOptions}
                    placeholder="Select Option"
                    defaultValue={yesNoOptions.find(
                      (o) => o.value === requiresAllocation,
                    )}
                    onChange={(opt) => setRequiresAllocation(opt?.value || "")}
                  />
                </div>
              </div>

              {/* 7. EMPLOYEE REQUESTS (Common Select) */}
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label fs-13">Employee Requests</label>
                  <CommonSelect
                    options={yesNoOptions}
                    placeholder="Select Option"
                    defaultValue={yesNoOptions.find(
                      (o) => o.value === employeeRequests,
                    )}
                    onChange={(opt) => setEmployeeRequests(opt?.value || "")}
                  />
                </div>
              </div>

              {/* 8. REQUEST UNIT (Common Select) */}
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label fs-13">Request Unit</label>
                  <CommonSelect
                    options={unitOptions}
                    placeholder="Select Unit"
                    defaultValue={unitOptions.find(
                      (o) => o.value === requestUnit,
                    )}
                    onChange={(opt) => setRequestUnit(opt?.value || "half_day")}
                  />
                </div>
              </div>

              {/* 9. RESPONSIBLE IDs (Number Input) */}
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label fs-13">Responsible IDs</label>
                  <input
                    min={"1"}
                    type="number"
                    className="form-control"
                    value={responsibleIds.length ? responsibleIds[0] : ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setResponsibleIds(val ? [Number(val)] : []);
                    }}
                    placeholder="Enter ID"
                  />
                </div>
              </div>

              {/* 10. CHECKBOXES */}
              <div className="col-md-12 mt-4">
                <div className="row g-3 p-3 bg-light rounded border border-dashed mx-0">
                  <div className="col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="includeHolidays"
                        checked={includePublicHolidaysInDuration}
                        onChange={(e) =>
                          setIncludePublicHolidaysInDuration(e.target.checked)
                        }
                      />
                      <label
                        className="form-check-label fs-13"
                        htmlFor="includeHolidays"
                      >
                        Include Public Holidays
                      </label>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="overtimeDeductible"
                        checked={overtimeDeductible}
                        onChange={(e) =>
                          setOvertimeDeductible(e.target.checked)
                        }
                      />
                      <label
                        className="form-check-label fs-13"
                        htmlFor="overtimeDeductible"
                      >
                        Overtime Deductible
                      </label>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="earnedLeave"
                        checked={isEarnedLeave}
                        onChange={(e) => setIsEarnedLeave(e.target.checked)}
                      />
                      <label
                        className="form-check-label fs-13"
                        htmlFor="earnedLeave"
                      >
                        Is Earned Leave
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer border-0 px-0 mt-4 pb-0">
              <button
                type="button"
                className="btn btn-light me-2"
                onClick={resetFormState}
              >
                Reset
              </button>
              <button
                className="btn btn-primary px-4"
                onClick={handleSaveLeaveType}
                disabled={isSavingLeaveType}
              >
                {isSavingLeaveType ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Saving...
                  </>
                ) : (
                  "Save Leave Type"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditLeaveTypesModal;

// import React, { useEffect, useState } from "react";
// import {
//   createLeaveType,
//   LeaveTypePayload,
//   getLeaveTypesCode,
//   updateLeaveType,
// } from "./LeavetypesServices";
// import toast from "react-hot-toast";

// interface Props {
//   onSuccess: () => void;
//   data: any;
// }

// const AddEditLeaveTypesModal: React.FC<Props> = ({ onSuccess, data }) => {
//   const [isSavingLeaveType, setIsSavingLeaveType] = useState(false);

//   // Leave Type form states
//   const [leaveName, setLeaveName] = useState<string>("");
//   const [leaveNameTouched, setLeaveNameTouched] = useState<boolean>(false);
//   const [leaveValidationType, setLeaveValidationType] = useState<string>("");
//   const [allocationValidationType, setAllocationValidationType] =
//     useState<string>("");
//   const [requiresAllocation, setRequiresAllocation] = useState<string>("");
//   const [employeeRequests, setEmployeeRequests] = useState<string>("");
//   const [responsibleIds, setResponsibleIds] = useState<number[]>([]);
//   const [leaveTypeCode, setLeaveTypeCode] = useState<string>("");
//   const [leaveCategory, setLeaveCategory] = useState<string>("");
//   const [requestUnit, setRequestUnit] = useState<string>("half_day");
//   const [includePublicHolidaysInDuration, setIncludePublicHolidaysInDuration] =
//     useState<boolean>(true);
//   const [overtimeDeductible, setOvertimeDeductible] = useState<boolean>(false);
//   const [isEarnedLeave, setIsEarnedLeave] = useState<boolean>(true);

//   // Validation states
//   const [leaveNameTouchedValidation, setLeaveNameTouchedValidation] =
//     useState<boolean>(false);
//   const [leaveTypeCodeTouched, setLeaveTypeCodeTouched] =
//     useState<boolean>(false);
//   const [leaveCategoryTouched, setLeaveCategoryTouched] =
//     useState<boolean>(false);

//   // Options
//   const [leaveTypeOptions, setLeaveTypeOptions] = useState<
//     Array<{ id: any; name: string; leave_type_code: any }>
//   >([]);
//   const [employeesOptions, setEmployeesOptions] = useState<any[]>([]);

//   // Fetch leave types for code select
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const list = await getLeaveTypesCode();
//         if (!mounted) return;
//         if (Array.isArray(list)) {
//           const opts = list.map((l: any) => ({
//             id: l.id,
//             name: l.name ?? String(l.id),
//             leave_type_code: l.leave_type_code,
//           }));
//           setLeaveTypeOptions(opts);
//         }
//       } catch (e) {
//         // ignore
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // Fetch employees for responsible_ids
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const endpoints = [
//           "/api/employees",
//           "/api/users",
//           "/employees",
//           "/users",
//         ];
//         let result: any = null;
//         for (const ep of endpoints) {
//           try {
//             const res = await fetch(ep);
//             if (!res.ok) continue;
//             const json = await res.json();
//             if (Array.isArray(json)) {
//               result = json;
//               break;
//             }
//             if (json && Array.isArray(json.data)) {
//               result = json.data;
//               break;
//             }
//           } catch (e) {
//             // continue
//           }
//         }
//         if (mounted && Array.isArray(result)) {
//           const opts = result.map((r: any) => ({
//             id: r.id ?? r.user_id ?? r.value,
//             name:
//               r.name ?? r.full_name ?? r.label ?? r.username ?? String(r.id),
//           }));
//           setEmployeesOptions(opts);
//         }
//       } catch (e) {
//         // ignore
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // Populate form when data is provided (for edit)
//   useEffect(() => {
//     if (data) {
//       setLeaveName(data.name || "");
//       setLeaveValidationType(data.leave_validation_type || "");
//       setAllocationValidationType(data.allocation_validation_type || "");
//       setRequiresAllocation(data.requires_allocation || "");
//       setEmployeeRequests(data.employee_requests || "");
//       setResponsibleIds(data.responsible_ids || []);
//       setLeaveTypeCode(data.leave_type_code || "");
//       setLeaveCategory(data.leave_category || "");
//       setRequestUnit(data.request_unit || "half_day");
//       setIncludePublicHolidaysInDuration(
//         data.include_public_holidays_in_duration ?? true
//       );
//       setOvertimeDeductible(data.overtime_deductible ?? false);
//       setIsEarnedLeave(data.is_earned_leave ?? true);
//     } else {
//       // Reset for add
//       setLeaveName("");
//       setLeaveValidationType("");
//       setAllocationValidationType("");
//       setRequiresAllocation("");
//       setEmployeeRequests("");
//       setResponsibleIds([]);
//       setLeaveTypeCode("");
//       setLeaveCategory("");
//       setRequestUnit("half_day");
//       setIncludePublicHolidaysInDuration(true);
//       setOvertimeDeductible(false);
//       setIsEarnedLeave(true);
//     }
//   }, [data]);

//   // Reset logic on modal close
//   useEffect(() => {
//     const modalElement = document.getElementById("add_leave_type_modal");
//     const handleModalClose = () => {
//       setLeaveName("");
//       setLeaveValidationType("");
//       setAllocationValidationType("");
//       setRequiresAllocation("");
//       setEmployeeRequests("");
//       setResponsibleIds([]);
//       setLeaveTypeCode("");
//       setLeaveCategory("");
//       setRequestUnit("half_day");
//       setIncludePublicHolidaysInDuration(true);
//       setOvertimeDeductible(false);
//       setIsEarnedLeave(true);
//     };
//     if (modalElement) {
//       modalElement.addEventListener("hidden.bs.modal", handleModalClose);
//     }
//     return () => {
//       if (modalElement) {
//         modalElement.removeEventListener("hidden.bs.modal", handleModalClose);
//       }
//     };
//   }, []);

//   const handleSaveLeaveType = async () => {
//     setLeaveNameTouchedValidation(true);
//     setLeaveTypeCodeTouched(true);
//     setLeaveCategoryTouched(true);

//     if (!leaveName || !leaveTypeCode || !leaveCategory) {
//       toast.error("Please fill all required fields.");
//       return;
//     }
//     setIsSavingLeaveType(true);
//     try {
//       const payload: LeaveTypePayload = {
//         name: leaveName,
//         leave_validation_type: leaveValidationType || undefined,
//         allocation_validation_type: allocationValidationType || undefined,
//         requires_allocation: requiresAllocation || undefined,
//         employee_requests: employeeRequests || undefined,
//         responsible_ids: responsibleIds.length > 0 ? responsibleIds : undefined,
//         leave_type_code: leaveTypeCode || undefined,
//         leave_category: leaveCategory || undefined,
//         request_unit: requestUnit || undefined,
//         include_public_holidays_in_duration: includePublicHolidaysInDuration,
//         overtime_deductible: overtimeDeductible,
//         is_earned_leave: isEarnedLeave,
//       };

//       if (data && data.id) {
//         await updateLeaveType(data.id, payload);
//         console.log("done here");
//         toast.success("Leave type updated.");
//       } else {
//         await createLeaveType(payload);
//         toast.success("Leave type created.");
//       }
//       document.getElementById("close-btn-leave-type")?.click();
//       onSuccess();
//     } catch (err) {
//       console.error("Error saving leave type", err);
//       toast.error("Failed to save leave type.");
//     } finally {
//       setIsSavingLeaveType(false);
//     }
//   };

//   return (
//     <div
//       className="modal custom-modal fade"
//       id="add_leave_type_modal"
//       role="dialog"
//     >
//       <div className="modal-dialog modal-dialog-centered modal-lg">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">
//               {data ? "Edit Leave Type" : "Add Leave Type"}
//             </h5>
//             <button
//               type="button"
//               className="btn-close"
//               data-bs-dismiss="modal"
//               id="close-btn-leave-type"
//               aria-label="Close"
//             >
//               <span aria-hidden="true">×</span>
//             </button>
//           </div>

//           <div className="modal-body">
//             <div className="row">
//               <div className="col-md-6">
//                 <div className="form-group mb-3">
//                   <label className="form-label">Name *</label>
//                   <input
//                     className="form-control"
//                     value={leaveName}
//                     onChange={(e) => setLeaveName(e.target.value)}
//                     onBlur={() => setLeaveNameTouchedValidation(true)}
//                     placeholder="Enter leave type name"
//                   />
//                   {leaveNameTouchedValidation && !leaveName && (
//                     <span style={{ color: "red", fontSize: 12 }}>
//                       Name is required
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="col-md-6">
//                 <div className="form-group mb-3">
//                   <label className="form-label">Leave Validation Type</label>
//                   <select
//                     className="form-select"
//                     value={leaveValidationType}
//                     onChange={(e) => setLeaveValidationType(e.target.value)}
//                   >
//                     <option value="">Select</option>
//                     <option value="manager">Manager</option>
//                     <option value="hr">HR</option>
//                     <option value="admin">both</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="col-md-6">
//                 <div className="form-group mb-3">
//                   <label className="form-label">
//                     Allocation Validation Type
//                   </label>
//                   <select
//                     className="form-select"
//                     value={allocationValidationType}
//                     onChange={(e) =>
//                       setAllocationValidationType(e.target.value)
//                     }
//                   >
//                     <option value="">Select</option>
//                     <option value="manager">Manager</option>
//                     <option value="hr">HR</option>
//                     <option value="admin">Admin</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="col-md-6">
//                 <div className="form-group mb-3">
//                   <label className="form-label">Requires Allocation</label>
//                   <select
//                     className="form-select"
//                     value={requiresAllocation}
//                     onChange={(e) => setRequiresAllocation(e.target.value)}
//                   >
//                     <option value="">Select</option>
//                     <option value="yes">Yes</option>
//                     <option value="no">No</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="col-md-6">
//                 <div className="form-group mb-3">
//                   <label className="form-label">Employee Requests</label>
//                   <select
//                     className="form-select"
//                     value={employeeRequests}
//                     onChange={(e) => setEmployeeRequests(e.target.value)}
//                   >
//                     <option value="">Select</option>
//                     <option value="yes">Yes</option>
//                     <option value="no">No</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="col-md-6">
//                 <div className="form-group mb-3">
//                   <label className="form-label">Responsible IDs</label>
//                   <input
//                     min={"1"}
//                     type="number"
//                     className="form-control"
//                     value={responsibleIds.length ? responsibleIds[0] : ""}
//                     onChange={(e) => {
//                       const val = e.target.value;
//                       setResponsibleIds(val ? [Number(val)] : []);
//                     }}
//                   />
//                 </div>
//               </div>

//               <div className="col-md-6">
//                 <div className="form-group mb-3">
//                   <label className="form-label">Leave Type Code *</label>
//                   <select
//                     className="form-select"
//                     value={leaveTypeCode}
//                     onChange={(e) => setLeaveTypeCode(e.target.value)}
//                     onBlur={() => setLeaveTypeCodeTouched(true)}
//                   >
//                     <option value="">Select Leave Type Code</option>
//                     {leaveTypeOptions.map((opt) => (
//                       <option
//                         key={opt.id}
//                         value={opt.leave_type_code || String(opt.id)}
//                       >
//                         {opt.leave_type_code || opt.name} ({opt.name})
//                       </option>
//                     ))}
//                   </select>
//                   {leaveTypeCodeTouched && !leaveTypeCode && (
//                     <span style={{ color: "red", fontSize: 12 }}>
//                       Leave Type Code is required
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="col-md-6">
//                 <div className="form-group mb-3">
//                   <label className="form-label">Leave Category *</label>
//                   <select
//                     className="form-select"
//                     value={leaveCategory}
//                     onChange={(e) => setLeaveCategory(e.target.value)}
//                     onBlur={() => setLeaveCategoryTouched(true)}
//                   >
//                     <option value="">Select</option>
//                     <option value="statutory">Statutory</option>
//                     <option value="non_statutory">Non Statutory</option>
//                     <option value="custom">Custom</option>
//                   </select>
//                   {leaveCategoryTouched && !leaveCategory && (
//                     <span style={{ color: "red", fontSize: 12 }}>
//                       Leave Category is required
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="col-md-6">
//                 <div className="form-group mb-3">
//                   <label className="form-label">Request Unit</label>
//                   <select
//                     className="form-select"
//                     value={requestUnit}
//                     onChange={(e) => setRequestUnit(e.target.value)}
//                   >
//                     <option value="half_day">Half Day</option>
//                     <option value="day">Day</option>
//                     <option value="hours">Hours</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="col-md-6">
//                 <div className="form-group mb-3">
//                   <br />
//                   <br />
//                   <input
//                     type="checkbox"
//                     checked={includePublicHolidaysInDuration}
//                     onChange={(e) =>
//                       setIncludePublicHolidaysInDuration(e.target.checked)
//                     }
//                   />{" "}
//                   {"  "}{" "}
//                   <label className="form-label">
//                     Include Public Holidays in Duration
//                   </label>
//                 </div>
//               </div>

//               <div className="col-md-6">
//                 <div className="form-group mb-3">
//                   <br />
//                   <input
//                     type="checkbox"
//                     checked={overtimeDeductible}
//                     onChange={(e) => setOvertimeDeductible(e.target.checked)}
//                   />{" "}
//                   {"  "}{" "}
//                   <label className="form-label">Overtime Deductible</label>
//                 </div>
//               </div>

//               <div className="col-md-6">
//                 <div className="form-group mb-3">
//                   <br />
//                   <input
//                     type="checkbox"
//                     checked={isEarnedLeave}
//                     onChange={(e) => setIsEarnedLeave(e.target.checked)}
//                   />{" "}
//                   {"  "} <label className="form-label">Is Earned Leave</label>
//                 </div>
//               </div>
//             </div>

//             <div className="d-flex justify-content-end">
//               <button
//                 className="btn btn-primary me-2"
//                 onClick={handleSaveLeaveType}
//                 disabled={isSavingLeaveType}
//               >
//                 {isSavingLeaveType ? "Saving..." : "Save"}
//               </button>
//               <button
//                 className="btn btn-secondary"
//                 onClick={() => {
//                   setLeaveName("");
//                   setLeaveValidationType("");
//                   setAllocationValidationType("");
//                   setRequiresAllocation("");
//                   setEmployeeRequests("");
//                   setResponsibleIds([]);
//                   setLeaveTypeCode("");
//                   setLeaveCategory("");
//                   setRequestUnit("half_day");
//                   setIncludePublicHolidaysInDuration(true);
//                   setOvertimeDeductible(false);
//                   setIsEarnedLeave(true);
//                 }}
//               >
//                 Reset
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddEditLeaveTypesModal;
