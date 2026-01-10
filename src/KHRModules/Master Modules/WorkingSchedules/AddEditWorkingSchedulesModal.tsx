import React, { useEffect, useState } from "react";
import {
  addWorkingSchedule,
  updateWorkingSchedule,
  getTimezones,
  WorkingSchedule,
} from "./WorkingSchedulesServices";
import { getWorkEntryTypes } from "../WorkEntryType/WorkEntryTypeServices";
import { toast } from "react-toastify";
import CommonSelect from "../../../core/common/commonSelect";

interface Props {
  onSuccess: () => void;
  data: WorkingSchedule | null;
}

const AddEditWorkingSchedulesModal: React.FC<Props> = ({ onSuccess, data }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Dropdown States
  const [timezoneOptions, setTimezoneOptions] = useState<any[]>([]);
  const [workEntryTypeOptions, setWorkEntryTypeOptions] = useState<any[]>([]);

  // Static Options
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

  const initialFormState = {
    // Main
    name: "",
    full_time_required_hours: 40,
    tz: "",
    flexible_hours: false,
    is_night_shift: false,
    // Details (Conditional)
    line_name: "",
    dayofweek: "0",
    day_period: "morning",
    hour_from: 8.0,
    hour_to: 17.0,
    duration_days: 1.0,
    work_entry_type_id: "",
  };

  const [formData, setFormData] = useState<any>(initialFormState);

  // --- 1. Fetch Dropdowns ---
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [tzs, types] = await Promise.all([
          getTimezones(),
          getWorkEntryTypes(),
        ]);

        // Map Timezones (Handle both strings and objects if API changes)
        const mappedTzs = tzs.map((t: any) => {
          const val = typeof t === "object" ? t.value : t;
          const lbl = typeof t === "object" ? t.label : t;
          return { value: val, label: lbl };
        });
        setTimezoneOptions(mappedTzs);

        // Map Work Entry Types
        const mappedTypes = Array.isArray(types)
          ? types.map((t: any) => ({
              value: String(t.id),
              label: t.name || t.code || `Type ${t.id}`,
            }))
          : [];
        setWorkEntryTypeOptions(mappedTypes);
      } catch (error) {
        console.error("Error loading dropdowns", error);
      }
    };
    fetchDropdowns();
  }, []);

  // --- 2. Populate Data ---
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        full_time_required_hours: data.full_time_required_hours || 40,
        tz: data.tz || "",
        flexible_hours: data.flexible_hours || false,
        is_night_shift: data.is_night_shift || false,
        // Details
        line_name: "", // Usually API doesn't return this for top-level, kept blank or mapped if needed
        dayofweek: data.dayofweek ? String(data.dayofweek) : "0",
        day_period: data.day_period || "morning",
        hour_from: data.hour_from ?? 8.0,
        hour_to: data.hour_to ?? 17.0,
        duration_days: data.duration_days ?? 1.0,
        work_entry_type_id: data.work_entry_type_id
          ? String(data.work_entry_type_id)
          : "",
      });
    } else {
      resetForm();
    }
  }, [data]);

  // --- 3. Reset Logic ---
  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  useEffect(() => {
    const modalElement = document.getElementById("add_working_schedule");
    const handleHidden = () => resetForm();
    modalElement?.addEventListener("hidden.bs.modal", handleHidden);
    return () =>
      modalElement?.removeEventListener("hidden.bs.modal", handleHidden);
  }, []);

  // --- 4. Validation ---
  const validate = () => {
    let tempErrors: any = {};
    let isValid = true;

    if (!formData.name?.trim()) {
      tempErrors.name = "Schedule Name is required";
      isValid = false;
    }
    if (!formData.tz) {
      tempErrors.tz = "Timezone is required";
      isValid = false;
    }

    // Conditional Validation for Flexible Hours
    if (formData.flexible_hours) {
      if (!formData.line_name?.trim()) {
        tempErrors.line_name = "Detail Name is required";
        isValid = false;
      }
      if (!formData.work_entry_type_id) {
        tempErrors.work_entry_type_id = "Work Entry Type is required";
        isValid = false;
      }
    }

    setErrors(tempErrors);
    return isValid;
  };

  // --- 5. Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload: any = {
        name: formData.name,
        flexible_hours: formData.flexible_hours,
        is_night_shift: formData.is_night_shift,
        full_time_required_hours: Number(formData.full_time_required_hours),
        tz: formData.tz,
      };

      if (formData.flexible_hours) {
        Object.assign(payload, {
          line_name: formData.line_name,
          dayofweek: formData.dayofweek,
          day_period: formData.day_period,
          hour_from: Number(formData.hour_from),
          hour_to: Number(formData.hour_to),
          duration_days: Number(formData.duration_days),
          work_entry_type_id: Number(formData.work_entry_type_id),
        });
      }

      if (data && data.id) {
        await updateWorkingSchedule(data.id, payload);
        toast.success("Schedule updated successfully");
      } else {
        await addWorkingSchedule(payload);
        toast.success("Schedule created successfully");
      }

      onSuccess();
      document.getElementById("close-btn-ws")?.click();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error saving schedule");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData({ ...formData, [name]: val });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  return (
    <div className="modal fade" id="add_working_schedule" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          {/* Header */}
          <div className="modal-header border-bottom bg-light py-2">
            <h5 className="modal-title fw-bold text-dark fs-16">
              <i className="ti ti-clock-hour-4 me-2 text-primary"></i>
              {data ? "Edit Working Schedule" : "Create Working Schedule"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-btn-ws"
              onClick={resetForm}
            ></button>
          </div>

          <div className="modal-body p-4">
            <form onSubmit={handleSubmit} noValidate>
              {/* --- Core Info --- */}
              <div className="row g-3 mb-4">
                <div className="col-md-12">
                  <label className="form-label fs-13 fw-bold">
                    Schedule Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${
                      isSubmitted && errors.name ? "is-invalid" : ""
                    }`}
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Standard 40 Hours"
                  />
                  {isSubmitted && errors.name && (
                    <div className="text-danger fs-11 mt-1">
                      <i className="ti ti-info-circle me-1"></i> {errors.name}
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">
                    Full Time Hours
                  </label>
                  <input
                    type="number"
                    name="full_time_required_hours"
                    className="form-control"
                    value={formData.full_time_required_hours}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">
                    Timezone <span className="text-danger">*</span>
                  </label>
                  <div
                    className={
                      isSubmitted && errors.tz
                        ? "border border-danger rounded"
                        : ""
                    }
                  >
                    <CommonSelect
                      options={timezoneOptions}
                      placeholder="Select Timezone"
                      defaultValue={timezoneOptions.find(
                        (t) => t.value === formData.tz
                      )}
                      onChange={(opt) =>
                        setFormData({ ...formData, tz: opt?.value || "" })
                      }
                    />
                  </div>
                  {isSubmitted && errors.tz && (
                    <div className="text-danger fs-11 mt-1">
                      <i className="ti ti-info-circle me-1"></i> {errors.tz}
                    </div>
                  )}
                </div>

                {/* Toggles */}
                <div className="col-md-6">
                  <div className="form-check form-switch mt-3 p-3 border rounded bg-light">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="flexibleSwitch"
                      name="flexible_hours"
                      checked={formData.flexible_hours}
                      onChange={handleInputChange}
                    />
                    <label
                      className="form-check-label fs-13 fw-bold ms-2"
                      htmlFor="flexibleSwitch"
                    >
                      Flexible Hours
                    </label>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-check form-switch mt-3 p-3 border rounded bg-light">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="nightSwitch"
                      name="is_night_shift"
                      checked={formData.is_night_shift}
                      onChange={handleInputChange}
                    />
                    <label
                      className="form-check-label fs-13 fw-bold ms-2"
                      htmlFor="nightSwitch"
                    >
                      Night Shift
                    </label>
                  </div>
                </div>
              </div>

              {/* --- Conditional Details --- */}
              {formData.flexible_hours && (
                <div className="bg-soft-secondary p-3 rounded border border-dashed animate__animated animate__fadeIn">
                  <h6 className="text-primary fw-bold mb-3 fs-14 border-bottom pb-2">
                    Schedule Details
                  </h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fs-13">
                        Detail Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="line_name"
                        className={`form-control ${
                          isSubmitted && errors.line_name ? "is-invalid" : ""
                        }`}
                        value={formData.line_name}
                        onChange={handleInputChange}
                        placeholder="e.g. Morning Shift"
                      />
                      {isSubmitted && errors.line_name && (
                        <div className="text-danger fs-11 mt-1">
                          {errors.line_name}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fs-13">Day of Week</label>
                      <select
                        name="dayofweek"
                        className="form-select"
                        value={formData.dayofweek}
                        onChange={handleInputChange}
                      >
                        {daysOfWeek.map((d) => (
                          <option key={d.value} value={d.value}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fs-13">Day Period</label>
                      <select
                        name="day_period"
                        className="form-select"
                        value={formData.day_period}
                        onChange={handleInputChange}
                      >
                        {dayPeriods.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label fs-13">Hour From</label>
                      <input
                        type="number"
                        step="0.1"
                        name="hour_from"
                        className="form-control"
                        value={formData.hour_from}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label fs-13">Hour To</label>
                      <input
                        type="number"
                        step="0.1"
                        name="hour_to"
                        className="form-control"
                        value={formData.hour_to}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fs-13">
                        Duration (Days)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        name="duration_days"
                        className="form-control"
                        value={formData.duration_days}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fs-13">
                        Work Entry Type <span className="text-danger">*</span>
                      </label>
                      <div
                        className={
                          isSubmitted && errors.work_entry_type_id
                            ? "border border-danger rounded"
                            : ""
                        }
                      >
                        <CommonSelect
                          options={workEntryTypeOptions}
                          placeholder="Select Type"
                          defaultValue={workEntryTypeOptions.find(
                            (t) =>
                              t.value === String(formData.work_entry_type_id)
                          )}
                          onChange={(opt) =>
                            setFormData({
                              ...formData,
                              work_entry_type_id: opt?.value || "",
                            })
                          }
                        />
                      </div>
                      {isSubmitted && errors.work_entry_type_id && (
                        <div className="text-danger fs-11 mt-1">
                          {errors.work_entry_type_id}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
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
                    "Save Schedule"
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
