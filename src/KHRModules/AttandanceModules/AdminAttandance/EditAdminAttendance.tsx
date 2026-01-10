import CommonModal from "@/KHRModules/commanForm/CommanModal/CommanModal";
import FormInput from "@/KHRModules/commanForm/inputComman/FormInput";
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TBSelector,
  UpdateAdminAttendanceApi,
  updateState,
} from "@/Store/Reducers/TBSlice";

interface Props {
  attendance: any;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormErrors {
  date?: string;
  check_in?: string;
  check_out?: string;
  late_time_display?: string;
}

const EditAttendanceModal: React.FC<Props> = ({
  attendance,
  onClose,
  onSuccess,
}) => {
  const {
    isUpdateAdminAttendanceApi,
    isUpdateAdminAttendanceApiFetching,
  } = useSelector(TBSelector);

  const dispatch = useDispatch();
  const [formData, setFormData] = useState<any>({
    date: null,
    check_in: null,
    check_out: null,
    late_time_display: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  /* =====================
     PREFILL DATA
  ===================== */
  useEffect(() => {
    if (attendance) {
      // Parse time string like "09:30 AM" or "09:30"
      const parseTime = (timeStr: string) => {
        if (!timeStr || timeStr === "-") return null;
        let parsed = dayjs(timeStr, "hh:mm A");
        if (!parsed.isValid()) {
          parsed = dayjs(timeStr, "HH:mm");
        }
        return parsed.isValid() ? parsed : null;
      };

      // Parse late value
      const parseLate = (lateStr: string | number) => {
        if (!lateStr || lateStr === "-") return "";
        if (typeof lateStr === "number") return lateStr;
        const num = lateStr.replace(/\D/g, "");
        return num || "";
      };

      setFormData({
        date: attendance.Attendance_Date
          ? dayjs(attendance.Attendance_Date)
          : dayjs(),
        check_in: parseTime(attendance.CheckIn),
        check_out: parseTime(attendance.CheckOut),
        late_time_display: parseLate(attendance.Late),
      });
      
      // Reset validation state when attendance changes
      setErrors({});
      setIsSubmitted(false);
    }
  }, [attendance]);

  /* =====================
     VALIDATION
  ===================== */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Date validation
    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    // Check In validation
    if (!formData.check_in) {
      newErrors.check_in = "Check In time is required";
    }

    // Check Out validation
    if (!formData.check_out) {
      newErrors.check_out = "Check Out time is required";
    }

    // Check Out should be after Check In
    if (formData.check_in && formData.check_out) {
      if (formData.check_out.isBefore(formData.check_in)) {
        newErrors.check_out = "Check Out must be after Check In";
      }
    }

    // Late minutes validation (optional but must be valid if provided)
    if (formData.late_time_display !== "" && formData.late_time_display !== null) {
      const lateValue = Number(formData.late_time_display);
      if (isNaN(lateValue) || lateValue < 0) {
        newErrors.late_time_display = "Late minutes must be a positive number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    
    if (!validateForm()) {
      return;
    }

    const date = formData.date?.format("YYYY-MM-DD") || dayjs().format("YYYY-MM-DD");

    const checkIn = formData.check_in
      ? `${date} ${formData.check_in.format("HH:mm:ss")}`
      : null;

    const checkOut = formData.check_out
      ? `${date} ${formData.check_out.format("HH:mm:ss")}`
      : null;

    const payload = {
      check_in: checkIn,
      check_out: checkOut,
      late_minutes: Number(formData.late_time_display) || 0,
    };

    console.log("EDIT ATTENDANCE PAYLOAD 👉", payload);
    dispatch(
      UpdateAdminAttendanceApi({
        payload: payload,
        attendanceId: attendance.id,
      }) as any
    );
  };

  // Close modal when API succeeds
  useEffect(() => {
    if (isUpdateAdminAttendanceApi) {
      // Close modal programmatically
      const closeModal = (window as any)["closeModal_edit_attendance"];
      if (closeModal) closeModal();
      
      onSuccess();
      onClose();
      dispatch(updateState({ isUpdateAdminAttendanceApi: false }));
    }
  }, [isUpdateAdminAttendanceApi]);

  return (
    <CommonModal
      id="edit_attendance"
      title="Edit Attendance"
      onSubmit={handleSubmit}
      isLoading={isUpdateAdminAttendanceApiFetching}
    >
      {/* Date */}
      <div className="mb-3">
        <label className="form-label">
          Date <span className="text-danger">*</span>
        </label>
        <DatePicker
          className={`w-100 ${isSubmitted && errors.date ? "border-danger" : ""}`}
          value={formData.date}
          onChange={(value) => {
            setFormData({ ...formData, date: value });
            if (isSubmitted) setErrors({ ...errors, date: value ? undefined : "Date is required" });
          }}
          disabled={isUpdateAdminAttendanceApiFetching}
          status={isSubmitted && errors.date ? "error" : undefined}
        />
        {isSubmitted && errors.date && (
          <div className="text-danger fs-11 mt-1">
            <i className="ti ti-info-circle me-1"></i>
            {errors.date}
          </div>
        )}
      </div>

      {/* Check In & Check Out */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">
            Check In <span className="text-danger">*</span>
          </label>
          <TimePicker
            className="w-100"
            format="hh:mm A"
            value={formData.check_in}
            onChange={(value) => {
              setFormData({ ...formData, check_in: value });
              if (isSubmitted) setErrors({ ...errors, check_in: value ? undefined : "Check In time is required" });
            }}
            disabled={isUpdateAdminAttendanceApiFetching}
            status={isSubmitted && errors.check_in ? "error" : undefined}
          />
          {isSubmitted && errors.check_in && (
            <div className="text-danger fs-11 mt-1">
              <i className="ti ti-info-circle me-1"></i>
              {errors.check_in}
            </div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">
            Check Out <span className="text-danger">*</span>
          </label>
          <TimePicker
            className="w-100"
            format="hh:mm A"
            value={formData.check_out}
            onChange={(value) => {
              setFormData({ ...formData, check_out: value });
              if (isSubmitted) {
                let error = undefined;
                if (!value) error = "Check Out time is required";
                else if (formData.check_in && value.isBefore(formData.check_in)) {
                  error = "Check Out must be after Check In";
                }
                setErrors({ ...errors, check_out: error });
              }
            }}
            disabled={isUpdateAdminAttendanceApiFetching}
            status={isSubmitted && errors.check_out ? "error" : undefined}
          />
          {isSubmitted && errors.check_out && (
            <div className="text-danger fs-11 mt-1">
              <i className="ti ti-info-circle me-1"></i>
              {errors.check_out}
            </div>
          )}
        </div>
      </div>

      {/* Late */}
      <div className="row">
        <div className="col-md-6">
          <FormInput
            label="Late (minutes)"
            name="late_time_display"
            type="number"
            value={formData.late_time_display}
            onChange={(e) => {
              setFormData({
                ...formData,
                late_time_display: e.target.value,
              });
              if (isSubmitted) {
                const val = Number(e.target.value);
                setErrors({
                  ...errors,
                  late_time_display: e.target.value && (isNaN(val) || val < 0) 
                    ? "Late minutes must be a positive number" 
                    : undefined
                });
              }
            }}
            disabled={isUpdateAdminAttendanceApiFetching}
            error={errors.late_time_display}
            isSubmitted={isSubmitted}
          />
        </div>
      </div>
    </CommonModal>
  );
};

export default EditAttendanceModal;
