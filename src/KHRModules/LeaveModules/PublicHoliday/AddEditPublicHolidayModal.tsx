import React, { useEffect, useState } from "react";
import {
  AttendancePolicy,
  createHoliday
} from "./PublicHolidayServices";
import { DatePicker, Radio, Checkbox } from "antd";
import dayjs from "dayjs";

interface Props {
  onSuccess: () => void;
  data: AttendancePolicy | null;
}

const AddEditPublicHolidayModal: React.FC<Props> = ({ onSuccess, data }) => {
  const initialFormState = {
    name: "",
    start_date: "",
    end_date: "",
    calendar: "",
    work_entry_type: "",
  };

  const [formData, setFormData] = useState<any>(initialFormState);
  const [validated, setValidated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (data) {
      setFormData({
        name: (data as any).name ?? "",
        start_date: (data as any).start_date ?? "",
        end_date: (data as any).end_date ?? "",
        calendar: (data as any).calendar ?? "",
        work_entry_type: (data as any).work_entry_type ?? "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [data]);



  // reset on modal close
  useEffect(() => {
    const modalElement = document.getElementById("add_attendance_policy");
    const handleModalClose = () => {
      setValidated(false);
      setFormData(initialFormState);
    };
    if (modalElement) modalElement.addEventListener("hidden.bs.modal", handleModalClose);
    return () => { if (modalElement) modalElement.removeEventListener("hidden.bs.modal", handleModalClose); };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const name = target.name;
    const value = (target as HTMLInputElement).value;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);
    const form = e.currentTarget;
    if (form.checkValidity() === false) return;

    const payload = {
      name: formData.name,
      date_from: formData.start_date + " 00:00:00",
      date_to: formData.end_date + " 23:55:09",
      work_entry_type_id: parseInt(formData.work_entry_type),
      calendar_id: parseInt(formData.calendar)
    };

    try {
      await createHoliday(payload);
      // console.log("done here")
      const closeBtn = document.getElementById("close-btn-policy");
      closeBtn?.click();
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error saving data.");
    }
  };

  return (
    <div className="modal custom-modal fade" id="add_attendance_policy" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{data ? "Edit Public Holiday" : "Add Public Holiday"}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" id="close-btn-policy" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <form className={`needs-validation ${validated ? "was-validated" : ""}`} noValidate onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-12 mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" name="name" className="form-control" value={formData.name ?? ""} onChange={handleChange} required />
                  {validated && !(formData.name) && (
                    <span className="text-danger small">Required</span>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Start Date</label>
                  <DatePicker
                    className={`form-control w-100 ${
                      validated && !formData.start_date ? "is-invalid" : ""
                    }`}
                    value={formData.start_date ? dayjs(formData.start_date) : null}
                    onChange={(_, dateStr) =>
                      setFormData({
                        ...formData,
                        start_date: dateStr,
                      })
                    }
                  />
                  {validated && !(formData.start_date) && (
                    <span className="text-danger small">Required</span>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">End Date</label>
                  <DatePicker
                    className={`form-control w-100 ${
                      validated && !formData.end_date ? "is-invalid" : ""
                    }`}
                    value={formData.end_date ? dayjs(formData.end_date) : null}
                    onChange={(_, dateStr) =>
                      setFormData({
                        ...formData,
                        end_date: dateStr,
                      })
                    }
                  />
                  {validated && !(formData.end_date) && (
                    <span className="text-danger small">Required</span>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Calendar</label>
                  <input type="number" name="calendar" className="form-control" value={formData.calendar ?? ""} onChange={handleChange} min="1" required />
                  {validated && !(formData.calendar) && (
                    <span className="text-danger small">Required</span>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Work Entry Type</label>
                  <input type="number" name="work_entry_type" className="form-control" value={formData.work_entry_type ?? ""} onChange={handleChange} min="1" required />
                  {validated && !(formData.work_entry_type) && (
                    <span className="text-danger small">Required</span>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary">{data ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditPublicHolidayModal;
