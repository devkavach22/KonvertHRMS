import React, { useEffect, useState } from "react";
import {
  addWorkingSchedule,
  updateWorkingSchedule,
  getTimezones,
  WorkingSchedule,
  AttendanceItem,
} from "./WorkingSchedulesServices";
import { getWorkEntryTypes } from "../WorkEntryType/WorkEntryTypeServices";
import { toast } from "react-toastify";
import CommonSelect from "../../../core/common/commonSelect";

interface Props {
  onSuccess: () => void;
  onClose: () => void;
  data: WorkingSchedule | null;
}

const AddEditWorkingSchedulesModal: React.FC<Props> = ({
  onSuccess,
  onClose,
  data,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [timezoneOptions, setTimezoneOptions] = useState<any[]>([]);
  const [workEntryTypeOptions, setWorkEntryTypeOptions] = useState<any[]>([]);

  const daysOfWeek = [
    { value: "0", label: "Monday" },
    { value: "1", label: "Tuesday" },
    { value: "2", label: "Wednesday" },
    { value: "3", label: "Thursday" },
    { value: "4", label: "Friday" },
    { value: "5", label: "Saturday" },
    { value: "6", label: "Sunday" },
  ];

  const dayPeriods = [
    { value: "morning", label: "Morning" },
    { value: "lunch", label: "Lunch" },
    { value: "afternoon", label: "Afternoon" },
  ];

  const initialAttendance: AttendanceItem = {
    name: "",
    dayofweek: "0",
    day_period: "morning",
    hour_from: 8.0,
    hour_to: 17.0,
    work_entry_type_id: 1,
  };

  const initialFormState: WorkingSchedule = {
    name: "",
    full_time_required_hours: 40,
    total_overtime_hours_allowed: 0,
    tz: "Asia/Kolkata",
    flexible_hours: false,
    is_night_shift: false,
    attendances: [{ ...initialAttendance }],
  };

  const [formData, setFormData] = useState<WorkingSchedule>(initialFormState);

  // 1. Load Dropdowns
  useEffect(() => {
    const loadData = async () => {
      try {
        const [tzs, types] = await Promise.all([
          getTimezones(),
          getWorkEntryTypes(),
        ]);

        setTimezoneOptions(
          tzs.map((t: any) => ({
            value: t.value || t,
            label: t.label || t,
          })),
        );

        const typeOpts = Array.isArray(types)
          ? types.map((t: any) => ({
              value: t.id,
              label: t.name || t.code || `Type ${t.id}`,
            }))
          : [];
        setWorkEntryTypeOptions(typeOpts);
      } catch (e) {
        console.error(e);
      }
    };
    loadData();
  }, []);

  // 2. Populate Data
  useEffect(() => {
    if (data) {
      const cleanAttendances =
        data.attendances && data.attendances.length > 0
          ? data.attendances.map((att) => ({
              ...att,
              work_entry_type_id: Array.isArray(att.work_entry_type_id)
                ? att.work_entry_type_id[0]
                : att.work_entry_type_id,
            }))
          : [{ ...initialAttendance }];

      setFormData({
        id: data.id,
        name: data.name,
        full_time_required_hours: data.full_time_required_hours,
        total_overtime_hours_allowed: data.total_overtime_hours_allowed || 0,
        tz: data.tz,
        flexible_hours: data.flexible_hours,
        is_night_shift: data.is_night_shift,
        attendances: cleanAttendances,
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [data]);

  // 3. Actions
  const handleModalClose = () => {
    setFormData(initialFormState);
    setErrors({});
    onClose();
  };

  const handleAddRow = () => {
    setFormData((prev) => ({
      ...prev,
      attendances: [...prev.attendances, { ...initialAttendance }],
    }));
  };

  const handleRemoveRow = (idx: number) => {
    const list = [...formData.attendances];
    list.splice(idx, 1);
    setFormData({ ...formData, attendances: list });
  };

  const handleRowChange = (
    idx: number,
    field: keyof AttendanceItem,
    val: any,
  ) => {
    const list = [...formData.attendances];
    list[idx] = { ...list[idx], [field]: val };

    if (field === "hour_from" || field === "hour_to") {
      if (Number(list[idx].hour_from) < Number(list[idx].hour_to)) {
        const newErrors = { ...errors };
        delete newErrors[`row_${idx}_time`];
        setErrors(newErrors);
      }
    }
    setFormData({ ...formData, attendances: list });
  };

  // 4. Validation
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Required";
      isValid = false;
    }
    if (!formData.tz) {
      newErrors.tz = "Required";
      isValid = false;
    }
    if (formData.full_time_required_hours <= 0) {
      newErrors.hours = "Invalid";
      isValid = false;
    }

    if (!formData.flexible_hours) {
      if (formData.attendances.length === 0) {
        toast.error("Fixed schedules need at least one time slot.");
        isValid = false;
      }
      formData.attendances.forEach((row, idx) => {
        if (row.hour_from >= row.hour_to) {
          newErrors[`row_${idx}_time`] = "Check time";
          isValid = false;
        }
      });
    }

    setErrors(newErrors);
    return isValid;
  };

  // 5. Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload: any = { ...formData };
      payload.attendance_ids = formData.flexible_hours
        ? []
        : formData.attendances;

      if (data && data.id) {
        await updateWorkingSchedule(data.id, payload);
        toast.success("Updated Successfully");
      } else {
        await addWorkingSchedule(payload);
        toast.success("Created Successfully");
      }
      onSuccess();
      document.getElementById("close-btn-ws")?.click();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error saving");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="add_working_schedule"
      data-bs-backdrop="static"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow-lg">
          {/* --- HEADER --- */}
          <div className="modal-header bg-white border-bottom py-3">
            <div className="d-flex align-items-center">
              {/* FIX 1: Custom Style for Header Icon
                   Using explicit style for background color to ensure it shows.
                   Using fs-2 (larger font size) for the icon.
                */}
              <div
                className="d-flex align-items-center justify-content-center rounded-circle me-3"
                style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "#eef2ff",
                  color: "#4361ee",
                }}
              >
                <i
                  className="ti ti-clock-edit"
                  style={{ fontSize: "26px" }}
                ></i>
              </div>

              <div>
                <h5 className="modal-title fw-bold text-dark mb-0">
                  {data ? "Edit Working Schedule" : "New Working Schedule"}
                </h5>
                <p className="text-muted small mb-0">
                  Define working hours and attendance rules
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-btn-ws"
              onClick={handleModalClose}
            ></button>
          </div>

          <div className="modal-body bg-light p-4">
            <form onSubmit={handleSubmit}>
              {/* General Info */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white fw-bold text-primary border-bottom-0 pt-3">
                  <i className="ti ti-info-circle me-1"></i> General Information
                </div>
                <div className="card-body pt-0">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        Schedule Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        placeholder="e.g. Regular Shift"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (e.target.value)
                            setErrors({ ...errors, name: "" });
                        }}
                      />
                      {errors.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        Timezone <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        className={
                          errors.tz ? "border border-danger rounded" : ""
                        }
                        options={timezoneOptions}
                        defaultValue={timezoneOptions.find(
                          (t) => t.value === formData.tz,
                        )}
                        onChange={(o) => {
                          setFormData({ ...formData, tz: o?.value });
                          if (o?.value) setErrors({ ...errors, tz: "" });
                        }}
                      />
                      {errors.tz && (
                        <small className="text-danger fs-12">{errors.tz}</small>
                      )}
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-bold">Weekly Hours</label>
                      <div className="input-group">
                        <input
                          type="number"
                          className={`form-control ${errors.hours ? "is-invalid" : ""}`}
                          value={formData.full_time_required_hours}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              full_time_required_hours: Number(e.target.value),
                            })
                          }
                        />
                        <span className="input-group-text bg-white text-muted">
                          Hrs
                        </span>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-bold">Max Overtime</label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control"
                          value={formData.total_overtime_hours_allowed}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              total_overtime_hours_allowed: Number(
                                e.target.value,
                              ),
                            })
                          }
                        />
                        <span className="input-group-text bg-white text-muted">
                          Hrs
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div
                    className={`card border-0 shadow-sm h-100 cursor-pointer ${formData.flexible_hours ? "bg-soft-success border-success" : "bg-white"}`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        flexible_hours: !formData.flexible_hours,
                      })
                    }
                    style={{
                      transition: "0.2s",
                      border: formData.flexible_hours
                        ? "1px solid #28c76f"
                        : "1px solid transparent",
                    }}
                  >
                    <div className="card-body d-flex align-items-center p-3">
                      <div className={`form-check form-switch me-3`}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={formData.flexible_hours}
                          readOnly
                        />
                      </div>
                      <div>
                        <h6 className="mb-1 fw-bold text-dark">
                          Flexible Schedule
                        </h6>
                        <small className="text-muted">
                          Employees determine their own hours.
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className={`card border-0 shadow-sm h-100 cursor-pointer ${formData.is_night_shift ? "bg-soft-dark border-dark" : "bg-white"}`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        is_night_shift: !formData.is_night_shift,
                      })
                    }
                  >
                    <div className="card-body d-flex align-items-center p-3">
                      <div className={`form-check form-switch me-3`}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={formData.is_night_shift}
                          readOnly
                        />
                      </div>
                      <div>
                        <h6 className="mb-1 fw-bold text-dark">Night Shift</h6>
                        <small className="text-muted">
                          Schedule includes overnight hours.
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              {!formData.flexible_hours && (
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0 fw-bold text-primary">
                        <i className="ti ti-calendar-time me-1"></i> Time Slots
                      </h6>
                      <small className="text-muted">
                        Define fixed working hours.
                      </small>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleAddRow}
                    >
                      <i className="ti ti-plus me-1"></i> Add Slot
                    </button>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="bg-light text-muted">
                        <tr>
                          <th style={{ width: "20%", paddingLeft: "20px" }}>
                            Label
                          </th>
                          <th style={{ width: "15%" }}>Day</th>
                          <th style={{ width: "15%" }}>Period</th>
                          <th style={{ width: "15%" }}>Time Range</th>
                          <th style={{ width: "15%" }}>Type</th>
                          <th className="text-center" style={{ width: "10%" }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.attendances.map((row, i) => (
                          <tr key={i}>
                            <td style={{ paddingLeft: "20px" }}>
                              <input
                                type="text"
                                className="form-control"
                                value={row.name}
                                onChange={(e) =>
                                  handleRowChange(i, "name", e.target.value)
                                }
                                placeholder="Label"
                              />
                            </td>
                            <td>
                              <select
                                className="form-select"
                                value={row.dayofweek}
                                onChange={(e) =>
                                  handleRowChange(
                                    i,
                                    "dayofweek",
                                    e.target.value,
                                  )
                                }
                              >
                                {daysOfWeek.map((d) => (
                                  <option key={d.value} value={d.value}>
                                    {d.label}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <select
                                className="form-select"
                                value={row.day_period}
                                onChange={(e) =>
                                  handleRowChange(
                                    i,
                                    "day_period",
                                    e.target.value,
                                  )
                                }
                              >
                                {dayPeriods.map((d) => (
                                  <option key={d.value} value={d.value}>
                                    {d.label}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-1">
                                <input
                                  type="number"
                                  step="0.5"
                                  className={`form-control px-1 text-center ${errors[`row_${i}_time`] ? "is-invalid" : ""}`}
                                  value={row.hour_from}
                                  onChange={(e) =>
                                    handleRowChange(
                                      i,
                                      "hour_from",
                                      Number(e.target.value),
                                    )
                                  }
                                />
                                <span>-</span>
                                <input
                                  type="number"
                                  step="0.5"
                                  className={`form-control px-1 text-center ${errors[`row_${i}_time`] ? "is-invalid" : ""}`}
                                  value={row.hour_to}
                                  onChange={(e) =>
                                    handleRowChange(
                                      i,
                                      "hour_to",
                                      Number(e.target.value),
                                    )
                                  }
                                />
                              </div>
                              {errors[`row_${i}_time`] && (
                                <div
                                  className="text-danger small mt-1"
                                  style={{ fontSize: "10px" }}
                                >
                                  {errors[`row_${i}_time`]}
                                </div>
                              )}
                            </td>
                            <td>
                              <select
                                className="form-select"
                                value={
                                  Array.isArray(row.work_entry_type_id)
                                    ? row.work_entry_type_id[0]
                                    : row.work_entry_type_id
                                }
                                onChange={(e) =>
                                  handleRowChange(
                                    i,
                                    "work_entry_type_id",
                                    Number(e.target.value),
                                  )
                                }
                              >
                                {workEntryTypeOptions.map((t) => (
                                  <option key={t.value} value={t.value}>
                                    {t.label}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="text-center">
                              {/* FIX 2: Larger Delete Button 
                                    Removed 'btn-sm'. Using a transparent button with a large text-danger icon.
                                 */}
                              {formData.attendances.length > 1 && (
                                <button
                                  type="button"
                                  className="btn text-danger p-2"
                                  onClick={() => handleRemoveRow(i)}
                                  title="Remove Slot"
                                >
                                  <i
                                    className="ti ti-trash"
                                    style={{ fontSize: "1.25rem" }}
                                  ></i>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {formData.attendances.length === 0 && (
                    <div className="p-4 text-center text-danger bg-soft-danger">
                      <i className="ti ti-alert-circle me-1"></i> No slots
                      added.
                    </div>
                  )}
                </div>
              )}

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-light px-4"
                  data-bs-dismiss="modal"
                  onClick={handleModalClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditWorkingSchedulesModal;

// import React, { useEffect, useState } from "react";
// import {
//   addWorkingSchedule,
//   updateWorkingSchedule,
//   getTimezones,
//   WorkingSchedule,
// } from "./WorkingSchedulesServices";
// import { getWorkEntryTypes } from "../WorkEntryType/WorkEntryTypeServices";

// interface Props {
//   onSuccess: () => void;
//   data: WorkingSchedule | null;
// }

// const AddEditWorkingSchedulesModal: React.FC<Props> = ({ onSuccess, data }) => {
//   // Main Fields
//   const [name, setName] = useState("");
//   const [flexibleHours, setFlexibleHours] = useState(false);
//   const [isNightShift, setIsNightShift] = useState(false);
//   const [fullTimeHours, setFullTimeHours] = useState(40);
//   const [timezone, setTimezone] = useState("");

//   // "Bottom" Fields (Conditional)
//   const [lineName, setLineName] = useState("");
//   const [dayOfWeek, setDayOfWeek] = useState("0");
//   const [dayPeriod, setDayPeriod] = useState("morning");
//   const [hourFrom, setHourFrom] = useState(8.0);
//   const [hourTo, setHourTo] = useState(12.0);
//   const [durationDays, setDurationDays] = useState(1.0);
//   const [workEntryTypeId, setWorkEntryTypeId] = useState<number | string>("");

//   // Aux State
//   const [validated, setValidated] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // FIX: Use any[] to handle mixed types (objects or strings) safely
//   const [timezoneList, setTimezoneList] = useState<any[]>([]);
//   const [workEntryTypes, setWorkEntryTypes] = useState<any[]>([]);

//   // Static Dropdown Options
//   const daysOfWeek = [
//     { value: "0", label: "Monday" },
//     { value: "1", label: "Tuesday" },
//     { value: "2", label: "Wednesday" },
//     { value: "3", label: "Thursday" },
//     { value: "4", label: "Friday" },
//     { value: "5", label: "Saturday" },
//     { value: "6", label: "Sunday" },
//   ];

//   const dayPeriods = [
//     { value: "morning", label: "Morning" },
//     { value: "lunch", label: "Lunch" },
//     { value: "afternoon", label: "Afternoon" },
//   ];

//   // 1. Fetch Dropdowns (Timezones & Work Entry Types)
//   useEffect(() => {
//     const fetchDropdowns = async () => {
//       try {
//         // Fetch Timezones
//         const tzs = await getTimezones();
//         setTimezoneList(tzs);

//         // Auto-select first timezone if none selected
//         if (tzs.length > 0 && !timezone) {
//           // FIX: Cast to 'any' to avoid "Property value does not exist on type never"
//           const firstItem = tzs[0] as any;
//           const firstVal =
//             typeof firstItem === "object" && firstItem !== null
//               ? firstItem.value
//               : firstItem;
//           setTimezone(firstVal);
//         }

//         // Fetch Work Entry Types
//         const types = await getWorkEntryTypes();
//         setWorkEntryTypes(types);
//       } catch (error) {
//         console.error("Error loading dropdowns", error);
//       }
//     };
//     fetchDropdowns();
//   }, []);

//   // 2. DATA SYNC: Populate form
//   useEffect(() => {
//     if (data) {
//       setName(data.name || "");
//       setFlexibleHours(data.flexible_hours || false);
//       setIsNightShift(data.is_night_shift || false);
//       setFullTimeHours(data.full_time_required_hours || 40);
//       setTimezone(data.tz || "");

//       if (data.flexible_hours) {
//         setLineName(""); // Map specific name if available
//         setDayOfWeek(data.dayofweek || "0");
//         setDayPeriod(data.day_period || "morning");
//         setHourFrom(data.hour_from || 8.0);
//         setHourTo(data.hour_to || 12.0);
//         setDurationDays(data.duration_days || 1.0);
//         setWorkEntryTypeId(data.work_entry_type_id || "");
//       }
//     } else {
//       resetForm();
//     }
//   }, [data]);

//   const resetForm = () => {
//     setName("");
//     setFlexibleHours(false);
//     setIsNightShift(false);
//     setFullTimeHours(40);
//     // Note: We do NOT reset timezoneList/workEntryTypes as those are global

//     setLineName("");
//     setDayOfWeek("0");
//     setDayPeriod("morning");
//     setHourFrom(8.0);
//     setHourTo(17.0);
//     setDurationDays(1.0);
//     setWorkEntryTypeId("");
//     setValidated(false);
//     setIsSubmitting(false);
//   };

//   // 3. RESET LOGIC
//   useEffect(() => {
//     const modalElement = document.getElementById("add_working_schedule");
//     const handleModalClose = () => {
//       resetForm();
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

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const form = e.currentTarget;
//     setValidated(true);

//     if (form.checkValidity() === false) {
//       return;
//     }

//     setIsSubmitting(true);

//     let apiPayload: any = {
//       name: name,
//       flexible_hours: flexibleHours,
//       is_night_shift: isNightShift,
//       full_time_required_hours: Number(fullTimeHours),
//       tz: timezone,
//     };

//     if (flexibleHours) {
//       apiPayload = {
//         ...apiPayload,
//         line_name: lineName,
//         dayofweek: dayOfWeek,
//         day_period: dayPeriod,
//         hour_from: Number(hourFrom),
//         hour_to: Number(hourTo),
//         duration_days: Number(durationDays),
//         work_entry_type_id: Number(workEntryTypeId),
//       };
//     }

//     try {
//       if (data && data.id) {
//         await updateWorkingSchedule(data.id, apiPayload);
//       } else {
//         await addWorkingSchedule(apiPayload);
//       }

//       const closeBtn = document.getElementById("close-btn-ws");
//       if (closeBtn) closeBtn.click();

//       onSuccess();
//     } catch (error) {
//       console.error("Failed to save schedule", error);
//       alert("Error saving data.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div
//       className="modal custom-modal fade"
//       id="add_working_schedule"
//       role="dialog"
//     >
//       <div className="modal-dialog modal-dialog-centered modal-lg">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">
//               {data ? "Edit Working Schedule" : "Add Working Schedule"}
//             </h5>
//             <button
//               type="button"
//               className="btn-close"
//               data-bs-dismiss="modal"
//               id="close-btn-ws"
//               aria-label="Close"
//             >
//               <span aria-hidden="true">×</span>
//             </button>
//           </div>
//           <div className="modal-body">
//             <form
//               className={`needs-validation ${validated ? "was-validated" : ""}`}
//               noValidate
//               onSubmit={handleSubmit}
//             >
//               {/* --- TOP SECTION --- */}
//               <div className="row">
//                 <div className="col-md-12 mb-3">
//                   <label className="form-label">
//                     Name <span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     placeholder="e.g. Standard 40 Hours"
//                   />
//                   <div className="invalid-feedback">Required</div>
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Full Time Hours</label>
//                   <input
//                     type="number"
//                     className="form-control"
//                     required
//                     value={fullTimeHours}
//                     onChange={(e) => setFullTimeHours(Number(e.target.value))}
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Timezone <span className="text-danger">*</span>
//                   </label>
//                   <select
//                     className="form-select"
//                     required
//                     value={timezone}
//                     onChange={(e) => setTimezone(e.target.value)}
//                   >
//                     <option value="">Select Timezone</option>
//                     {timezoneList.map((tz, index) => {
//                       // Safe extraction for both Object and String types
//                       const item = tz as any;
//                       const val =
//                         typeof item === "object" && item !== null
//                           ? item.value
//                           : item;
//                       const lbl =
//                         typeof item === "object" && item !== null
//                           ? item.label
//                           : item;

//                       return (
//                         <option key={`${val}-${index}`} value={val}>
//                           {lbl}
//                         </option>
//                       );
//                     })}
//                   </select>
//                   <div className="invalid-feedback">Required</div>
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <div className="form-check form-switch mt-4">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id="flexibleSwitch"
//                       checked={flexibleHours}
//                       onChange={(e) => setFlexibleHours(e.target.checked)}
//                     />
//                     <label
//                       className="form-check-label"
//                       htmlFor="flexibleSwitch"
//                     >
//                       Flexible Hours? (Enables Schedule Details)
//                     </label>
//                   </div>
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <div className="form-check form-switch mt-4">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id="nightSwitch"
//                       checked={isNightShift}
//                       onChange={(e) => setIsNightShift(e.target.checked)}
//                     />
//                     <label className="form-check-label" htmlFor="nightSwitch">
//                       Is Night Shift?
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               {/* --- BOTTOM SECTION (Conditional) --- */}
//               {flexibleHours && (
//                 <div className="bg-light p-3 rounded border mt-3">
//                   <h6 className="text-primary mb-3">
//                     Schedule Details (Required for Flexible Hours)
//                   </h6>
//                   <div className="row">
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">
//                         Detail Name <span className="text-danger">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         required
//                         value={lineName}
//                         onChange={(e) => setLineName(e.target.value)}
//                         placeholder="e.g. Morning Shift"
//                       />
//                       <div className="invalid-feedback">Required</div>
//                     </div>

//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">Day of Week</label>
//                       <select
//                         className="form-select"
//                         value={dayOfWeek}
//                         onChange={(e) => setDayOfWeek(e.target.value)}
//                       >
//                         {daysOfWeek.map((d) => (
//                           <option key={d.value} value={d.value}>
//                             {d.label}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">Day Period</label>
//                       <select
//                         className="form-select"
//                         value={dayPeriod}
//                         onChange={(e) => setDayPeriod(e.target.value)}
//                       >
//                         {dayPeriods.map((p) => (
//                           <option key={p.value} value={p.value}>
//                             {p.label}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div className="col-md-3 mb-3">
//                       <label className="form-label">Hour From</label>
//                       <input
//                         type="number"
//                         step="0.1"
//                         className="form-control"
//                         required
//                         value={hourFrom}
//                         onChange={(e) => setHourFrom(Number(e.target.value))}
//                       />
//                     </div>

//                     <div className="col-md-3 mb-3">
//                       <label className="form-label">Hour To</label>
//                       <input
//                         type="number"
//                         step="0.1"
//                         className="form-control"
//                         required
//                         value={hourTo}
//                         onChange={(e) => setHourTo(Number(e.target.value))}
//                       />
//                     </div>

//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">Duration Days</label>
//                       <input
//                         type="number"
//                         step="0.1"
//                         className="form-control"
//                         value={durationDays}
//                         onChange={(e) =>
//                           setDurationDays(Number(e.target.value))
//                         }
//                       />
//                     </div>

//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">Work Entry Type</label>
//                       <select
//                         className="form-select"
//                         required
//                         value={workEntryTypeId}
//                         onChange={(e) =>
//                           setWorkEntryTypeId(Number(e.target.value))
//                         }
//                       >
//                         <option value="">Select Work Entry Type</option>
//                         {workEntryTypes.map((type, idx) => (
//                           <option key={type.id || idx} value={type.id}>
//                             {type.name ||
//                               type.code ||
//                               type.id ||
//                               `Type ${type.id}`}
//                           </option>
//                         ))}
//                       </select>
//                       <div className="invalid-feedback">Required</div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="modal-footer">
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
//                   {isSubmitting
//                     ? "Saving..."
//                     : data
//                     ? "Update Changes"
//                     : "Save Schedule"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddEditWorkingSchedulesModal;
