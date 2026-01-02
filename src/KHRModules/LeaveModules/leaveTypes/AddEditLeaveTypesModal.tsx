import React, { useEffect, useState } from "react";
import {
  createLeaveType,
  LeaveTypePayload,
  getLeaveTypesCode,
  updateLeaveType,
} from "./LeavetypesServices";
import toast from "react-hot-toast";

interface Props {
  onSuccess: () => void;
  data: any;
}

const AddEditLeaveTypesModal: React.FC<Props> = ({ onSuccess, data }) => {
  const [isSavingLeaveType, setIsSavingLeaveType] = useState(false);

  // Leave Type form states
  const [leaveName, setLeaveName] = useState<string>("");
  const [leaveNameTouched, setLeaveNameTouched] = useState<boolean>(false);
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

  // Validation states
  const [leaveNameTouchedValidation, setLeaveNameTouchedValidation] =
    useState<boolean>(false);
  const [leaveTypeCodeTouched, setLeaveTypeCodeTouched] =
    useState<boolean>(false);
  const [leaveCategoryTouched, setLeaveCategoryTouched] =
    useState<boolean>(false);

  // Options
  const [leaveTypeOptions, setLeaveTypeOptions] = useState<
    Array<{ id: any; name: string; leave_type_code: any }>
  >([]);
  const [employeesOptions, setEmployeesOptions] = useState<any[]>([]);

  // Fetch leave types for code select
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await getLeaveTypesCode();
        if (!mounted) return;
        if (Array.isArray(list)) {
          const opts = list.map((l: any) => ({
            id: l.id,
            name: l.name ?? String(l.id),
            leave_type_code: l.leave_type_code,
          }));
          setLeaveTypeOptions(opts);
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch employees for responsible_ids
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const endpoints = [
          "/api/employees",
          "/api/users",
          "/employees",
          "/users",
        ];
        let result: any = null;
        for (const ep of endpoints) {
          try {
            const res = await fetch(ep);
            if (!res.ok) continue;
            const json = await res.json();
            if (Array.isArray(json)) {
              result = json;
              break;
            }
            if (json && Array.isArray(json.data)) {
              result = json.data;
              break;
            }
          } catch (e) {
            // continue
          }
        }
        if (mounted && Array.isArray(result)) {
          const opts = result.map((r: any) => ({
            id: r.id ?? r.user_id ?? r.value,
            name:
              r.name ?? r.full_name ?? r.label ?? r.username ?? String(r.id),
          }));
          setEmployeesOptions(opts);
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Populate form when data is provided (for edit)
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
      setIncludePublicHolidaysInDuration(data.include_public_holidays_in_duration ?? true);
      setOvertimeDeductible(data.overtime_deductible ?? false);
      setIsEarnedLeave(data.is_earned_leave ?? true);
    } else {
      // Reset for add
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
    }
  }, [data]);

  // Reset logic on modal close
  useEffect(() => {
    const modalElement = document.getElementById("add_leave_type_modal");
    const handleModalClose = () => {
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

  const handleSaveLeaveType = async () => {
    setLeaveNameTouchedValidation(true);
    setLeaveTypeCodeTouched(true);
    setLeaveCategoryTouched(true);

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
        leave_type_code: leaveTypeCode || undefined,
        leave_category: leaveCategory || undefined,
        request_unit: requestUnit || undefined,
        include_public_holidays_in_duration: includePublicHolidaysInDuration,
        overtime_deductible: overtimeDeductible,
        is_earned_leave: isEarnedLeave,
      };

      if (data && data.id) {
        await updateLeaveType(data.id, payload);
        console.log("done here");
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

  return (
    <div
      className="modal custom-modal fade"
      id="add_leave_type_modal"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
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

          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label className="form-label">Name *</label>
                  <input
                    className="form-control"
                    value={leaveName}
                    onChange={(e) => setLeaveName(e.target.value)}
                    onBlur={() => setLeaveNameTouchedValidation(true)}
                    placeholder="Enter leave type name"
                  />
                  {leaveNameTouchedValidation && !leaveName && (
                    <span style={{ color: "red", fontSize: 12 }}>Required</span>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label className="form-label">Leave Validation Type</label>
                  <select
                    className="form-select"
                    value={leaveValidationType}
                    onChange={(e) => setLeaveValidationType(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="manager">Manager</option>
                    <option value="hr">HR</option>
                    <option value="admin">both</option>
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label className="form-label">
                    Allocation Validation Type
                  </label>
                  <select
                    className="form-select"
                    value={allocationValidationType}
                    onChange={(e) =>
                      setAllocationValidationType(e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    <option value="manager">Manager</option>
                    <option value="hr">HR</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label className="form-label">Requires Allocation</label>
                  <select
                    className="form-select"
                    value={requiresAllocation}
                    onChange={(e) => setRequiresAllocation(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label className="form-label">Employee Requests</label>
                  <select
                    className="form-select"
                    value={employeeRequests}
                    onChange={(e) => setEmployeeRequests(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label className="form-label">Responsible IDs</label>
                  <input
                  min={"1"}
      type="number"
      className="form-control"
      value={responsibleIds.length ? responsibleIds[0] : ""}
      onChange={(e) => {
        const val = e.target.value;
        setResponsibleIds(val ? [Number(val)] : []);
      }}
    />
                </div>
                
              </div>

              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label className="form-label">Leave Type Code *</label>
                  <select
                    className="form-select"
                    value={leaveTypeCode}
                    onChange={(e) => setLeaveTypeCode(e.target.value)}
                    onBlur={() => setLeaveTypeCodeTouched(true)}
                  >
                    <option value="">Select Leave Type Code</option>
                    {leaveTypeOptions.map((opt) => (
                      <option
                        key={opt.id}
                        value={opt.leave_type_code || String(opt.id)}
                      >
                        {opt.leave_type_code || opt.name} ({opt.name})
                      </option>
                    ))}
                  </select>
                  {leaveTypeCodeTouched && !leaveTypeCode && (
                    <span style={{ color: "red", fontSize: 12 }}>Required</span>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label className="form-label">Leave Category *</label>
                  <select
                    className="form-select"
                    value={leaveCategory}
                    onChange={(e) => setLeaveCategory(e.target.value)}
                    onBlur={() => setLeaveCategoryTouched(true)}
                  >
                    <option value="">Select</option>
                    <option value="statutory">Statutory</option>
                    <option value="non_statutory">Non Statutory</option>
                    <option value="custom">Custom</option>
                  </select>
                  {leaveCategoryTouched && !leaveCategory && (
                    <span style={{ color: "red", fontSize: 12 }}>Required</span>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label className="form-label">Request Unit</label>
                  <select
                    className="form-select"
                    value={requestUnit}
                    onChange={(e) => setRequestUnit(e.target.value)}
                  >
                    <option value="half_day">Half Day</option>
                    <option value="day">Day</option>
                    <option value="hours">Hours</option>
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group mb-3">
                  <br />
                  <br />
                  <input
                    type="checkbox"
                    checked={includePublicHolidaysInDuration}
                    onChange={(e) =>
                      setIncludePublicHolidaysInDuration(e.target.checked)
                    }
                  />
                  {" "}{"  "}{" "}
                  <label className="form-label">Include Public Holidays in Duration</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group mb-3">
                  <br />
                  <input
                    type="checkbox"
                    checked={overtimeDeductible}
                    onChange={(e) => setOvertimeDeductible(e.target.checked)}
                  />
                  {" "}{"  "}{" "}
                  <label className="form-label">Overtime Deductible</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group mb-3">
                  <br />
                  <input
                    type="checkbox"
                    checked={isEarnedLeave}
                    onChange={(e) => setIsEarnedLeave(e.target.checked)}
                  />
                  {" "}{"  "}{" "}
                  <label className="form-label">Is Earned Leave</label>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <button
                className="btn btn-primary me-2"
                onClick={handleSaveLeaveType}
                disabled={isSavingLeaveType}
              >
                {isSavingLeaveType ? "Saving..." : "Save"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
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
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditLeaveTypesModal;
