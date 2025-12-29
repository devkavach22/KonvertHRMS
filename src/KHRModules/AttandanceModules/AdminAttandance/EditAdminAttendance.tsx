import CommonModal from "@/KHRModules/commanForm/CommanModal/CommanModal";
import FormInput from "@/KHRModules/commanForm/inputComman/FormInput";
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { updateAdminAttendance } from "./AdminAttandanceServices";


interface Props {
  attendance: any;
  onClose: () => void;
  onSuccess: () => void;
}

const EditAttendanceModal: React.FC<Props> = ({ attendance, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<any>({
    date: null,
    check_in: null,
    check_out: null,
    late_time_display: "",
    // production_hours: "",
  });

  /* =====================
     PREFILL DATA
  ===================== */
  useEffect(() => {
    if (attendance) {
      console.log(attendance, "attendance");

      setFormData({
        date: attendance.Attendance_Date
          ? dayjs(attendance.Attendance_Date)
          : dayjs(),
        check_in:
          attendance.CheckIn && attendance.CheckIn !== "-"
            ? dayjs(attendance.CheckIn, "hh:mm A")
            : null,
        check_out:
          attendance.CheckOut && attendance.CheckOut !== "-"
            ? dayjs(attendance.CheckOut, "hh:mm A")
            : null,
        late_time_display: attendance.Late
          ? Number(attendance.Late.replace(/\D/g, ""))
          : "",
        // production_hours: attendance.ProductionHours ?? "",
      });
    }
  }, [attendance]);


  console.log(formData, "formdattatt");




  /* =====================
     SUBMIT
  ===================== */
  const handleSubmit = async () => {
    const date = formData.date?.format("YYYY-MM-DD");

    const checkIn = formData.check_in
      ? `${date} ${formData.check_in.format("HH:mm:ss")}`
      : null;

    const checkOut = formData.check_out
      ? `${date} ${formData.check_out.format("HH:mm:ss")}`
      : null;

    const payload = {
      check_in: checkIn,
      check_out: checkOut,
      late_minutes: Number(formData.late_time_display),
      // production_hours: Number(formData.production_hours),
    };

    console.log("EDIT ATTENDANCE PAYLOAD 👉", payload);

    try {
      await updateAdminAttendance(attendance.id, payload);
      onClose()
      onSuccess();
    } catch (error) {
      console.error("Failed to update attendance");
    }

    onClose();
  };


  return (
    <CommonModal
      id="edit_attendance"
      title="Edit Attendance"
      onSubmit={handleSubmit}
    >
      {/* Date */}
      <div className="mb-3">
        <label className="form-label">Date</label>
        <DatePicker
          className="w-100"
          value={formData.date}
          onChange={(value) =>
            setFormData({ ...formData, date: value })
          }
        />
      </div>

      {/* Check In & Check Out */}
      <div className="row">
        <div className="col-md-6">
          <label className="form-label">Check In</label>
          <TimePicker
            className="w-100"
            format="hh:mm A"
            value={formData.check_in}
            onChange={(value) =>
              setFormData({ ...formData, check_in: value })
            }
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Check Out</label>
          <TimePicker
            className="w-100"
            format="hh:mm A"
            value={formData.check_out}
            onChange={(value) =>
              setFormData({ ...formData, check_out: value })
            }
          />
        </div>
      </div>

      {/* Late */}
      <div className="row mt-3">
        <div className="col-md-6">
          <FormInput
            label="Late (minutes)"
            name="late_time_display"
            type="number"
            value={formData.
              late_time_display}
            onChange={(e) =>
              setFormData({
                ...formData,
                late_time_display: e.target.value,
              })
            }
          />


        </div>
      </div>

      {/* Production Hours */}
      {/* <FormInput
        label="Production Hours"
        name="production_hours"
        value={formData.production_hours}
        onChange={(e) =>
          setFormData({
            ...formData,
            production_hours: e.target.value,
          })
        }
      /> */}
    </CommonModal>
  );
};

export default EditAttendanceModal;
