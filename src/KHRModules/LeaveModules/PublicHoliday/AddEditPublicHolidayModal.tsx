import React, { useEffect, useState } from "react";
import {
  AttendancePolicy,
  createHoliday,
  updateHoliday,
  getCalenderId,
  getWorkEntryType,
} from "./PublicHolidayServices";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import CommonSelect from "../../../core/common/commonSelect";
import { toast } from "react-toastify";

interface Props {
  onSuccess: () => void;
  data: AttendancePolicy | null;
}

const AddEditPublicHolidayModal: React.FC<Props> = ({ onSuccess, data }) => {
  const initialFormState = {
    name: "",
    start_date: null as string | null,
    end_date: null as string | null,
    calendar: "",
    work_entry_type: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [calendarOptions, setCalendarOptions] = useState<any[]>([]);
  const [workEntryOptions, setWorkEntryOptions] = useState<any[]>([]);

  // 1. Fetch Dropdown Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [calendarResponse, workEntryResponse] = await Promise.all([
          getCalenderId(),
          getWorkEntryType(),
        ]);

        const calendars = calendarResponse?.data?.data || [];
        setCalendarOptions(
          calendars.map((c: any) => ({ value: String(c.id), label: c.name })),
        );

        const workEntries = workEntryResponse?.data?.data || [];
        setWorkEntryOptions(
          workEntries.map((w: any) => ({ value: String(w.id), label: w.name })),
        );
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // 2. Populate Form on Edit
  useEffect(() => {
    if (data) {
      setFormData({
        name: (data as any).name ?? "",
        start_date: (data as any).date_from
          ? dayjs((data as any).date_from).format("YYYY-MM-DD")
          : null,
        end_date: (data as any).date_to
          ? dayjs((data as any).date_to).format("YYYY-MM-DD")
          : null,
        calendar: (data as any).calendar_id
          ? String((data as any).calendar_id[0])
          : "",
        work_entry_type: (data as any).work_entry_type_id
          ? String((data as any).work_entry_type_id[0])
          : "",
      });
    } else {
      resetForm();
    }
  }, [data]);

  // 3. Reset on Close
  useEffect(() => {
    const modalElement = document.getElementById("add_attendance_policy");
    const handleModalClose = () => {
      resetForm();
    };
    modalElement?.addEventListener("hidden.bs.modal", handleModalClose);
    return () => {
      modalElement?.removeEventListener("hidden.bs.modal", handleModalClose);
    };
  }, []);

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  // --- VALIDATION HELPERS ---
  const clearError = (fieldName: string) => {
    setErrors((prev: any) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const getInputClass = (fieldName: keyof typeof formData) => {
    if (errors[fieldName]) return "form-control is-invalid";
    if (isSubmitted && formData[fieldName] && !errors[fieldName])
      return "form-control is-valid";
    return "form-control";
  };

  // Only used for optional fields now, or if you add logic back
  const getSelectWrapperClass = (fieldName: string) => {
    if (errors[fieldName]) return "border border-danger rounded";
    // Optional fields don't turn green or red usually, but if you want consistency:
    if (isSubmitted && (formData as any)[fieldName] && !errors[fieldName])
      return "border border-success rounded";
    return "";
  };

  const validate = () => {
    let tempErrors: any = {};

    // Only Name, Start Date, and End Date are mandatory
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.start_date) tempErrors.start_date = "Start Date is required";
    if (!formData.end_date) tempErrors.end_date = "End Date is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (!validate()) return;

    setIsSubmitting(true);

    const payload = {
      name: formData.name,
      // Append specific times
      date_from: formData.start_date ? `${formData.start_date} 00:00:00` : null,
      date_to: formData.end_date ? `${formData.end_date} 23:55:09` : null,
      work_entry_type_id: formData.work_entry_type
        ? parseInt(formData.work_entry_type)
        : null,
      calendar_id: formData.calendar ? parseInt(formData.calendar) : null,
    };

    try {
      if (data && data.id) {
        await updateHoliday(Number(data.id), payload);
        toast.success("Public Holiday Updated Successfully");
      } else {
        await createHoliday(payload);
        toast.success("Public Holiday Created Successfully");
      }
      onSuccess();
      const closeBtn = document.getElementById("close-btn-policy");
      closeBtn?.click();
    } catch (err) {
      console.error(err);
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
          .ant-picker.ant-picker-status-error { border-color: #dc3545 !important; }
          .is-valid-picker { border-color: #198754 !important; }
          /* Ensure modal z-index is correct */
          #add_attendance_policy { z-index: 1055 !important; }
        `}
      </style>
      <div
        className="modal custom-modal fade"
        id="add_attendance_policy"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header border-bottom bg-light py-2">
              <h5 className="modal-title fw-bold text-dark fs-16">
                <i className="ti ti-calendar-plus me-2 text-primary fs-20"></i>
                {data ? "Edit Public Holiday" : "Add Public Holiday"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="close-btn-policy"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-4">
              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  {/* Name */}
                  <div className="col-md-12">
                    <label className="form-label fs-13 fw-bold">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      className={getInputClass("name")}
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        clearError("name");
                      }}
                      placeholder="e.g. Republic Day"
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>

                  {/* Start Date */}
                  <div className="col-md-6">
                    <label className="form-label fs-13 fw-bold">
                      Start Date <span className="text-danger">*</span>
                    </label>
                    {/* REMOVED: Wrapper with error border to fix double box issue */}
                    <div>
                      <DatePicker
                        getPopupContainer={(trigger) => trigger.parentElement!}
                        className={`form-control w-100 ${
                          isSubmitted &&
                          formData.start_date &&
                          !errors.start_date
                            ? "is-valid-picker"
                            : ""
                        }`}
                        format="YYYY-MM-DD"
                        placeholder="YYYY-MM-DD"
                        value={
                          formData.start_date
                            ? dayjs(formData.start_date, "YYYY-MM-DD")
                            : null
                        }
                        onChange={(_, dateStr) => {
                          setFormData({
                            ...formData,
                            start_date: dateStr as string,
                          });
                          clearError("start_date");
                        }}
                        status={errors.start_date ? "error" : ""}
                      />
                    </div>
                    {errors.start_date && (
                      <div className="text-danger fs-11 mt-1">
                        {errors.start_date}
                      </div>
                    )}
                  </div>

                  {/* End Date */}
                  <div className="col-md-6">
                    <label className="form-label fs-13 fw-bold">
                      End Date <span className="text-danger">*</span>
                    </label>
                    {/* REMOVED: Wrapper with error border to fix double box issue */}
                    <div>
                      <DatePicker
                        getPopupContainer={(trigger) => trigger.parentElement!}
                        className={`form-control w-100 ${
                          isSubmitted && formData.end_date && !errors.end_date
                            ? "is-valid-picker"
                            : ""
                        }`}
                        format="YYYY-MM-DD"
                        placeholder="YYYY-MM-DD"
                        value={
                          formData.end_date
                            ? dayjs(formData.end_date, "YYYY-MM-DD")
                            : null
                        }
                        onChange={(_, dateStr) => {
                          setFormData({
                            ...formData,
                            end_date: dateStr as string,
                          });
                          clearError("end_date");
                        }}
                        status={errors.end_date ? "error" : ""}
                      />
                    </div>
                    {errors.end_date && (
                      <div className="text-danger fs-11 mt-1">
                        {errors.end_date}
                      </div>
                    )}
                  </div>

                  {/* Working Hours (Optional) */}
                  <div className="col-md-6">
                    <label className="form-label fs-13 fw-bold">
                      Working Hours
                    </label>
                    <div>
                      <CommonSelect
                        key={`calendar-${calendarOptions.length}`}
                        options={calendarOptions}
                        value={calendarOptions.find(
                          (opt) => opt.value === formData.calendar,
                        )}
                        onChange={(opt: any) => {
                          setFormData((prev: any) => ({
                            ...prev,
                            calendar: opt?.value || "",
                          }));
                        }}
                        placeholder="Select Working Hours"
                      />
                    </div>
                  </div>

                  {/* Work Entry Type (Optional) */}
                  <div className="col-md-6">
                    <label className="form-label fs-13 fw-bold">
                      Work Entry Type
                    </label>
                    <div>
                      <CommonSelect
                        key={`work-entry-${workEntryOptions.length}`}
                        options={workEntryOptions}
                        value={workEntryOptions.find(
                          (opt) => opt.value === formData.work_entry_type,
                        )}
                        onChange={(opt: any) => {
                          setFormData((prev: any) => ({
                            ...prev,
                            work_entry_type: opt?.value || "",
                          }));
                        }}
                        placeholder="Select Work Entry Type"
                      />
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
                    {isSubmitting ? "Saving..." : data ? "Update" : "Save"}
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

export default AddEditPublicHolidayModal;
