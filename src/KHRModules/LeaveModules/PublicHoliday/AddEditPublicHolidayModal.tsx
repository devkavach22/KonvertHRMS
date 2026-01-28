import React, { useEffect, useState } from "react";
import {
  AttendancePolicy,
  createHoliday,
  updateHoliday,
  getCalenderId,
  getWorkEntryType
} from "./PublicHolidayServices";
import { DatePicker, Radio, Checkbox } from "antd";
import dayjs from "dayjs";
import CommonSelect from "../../../core/common/commonSelect";

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
  const [calendarOptions, setCalendarOptions] = useState<any[]>([]);
  const [workEntryOptions, setWorkEntryOptions] = useState<any[]>([]);


  useEffect(() => {
    if (data) {
      setFormData({
        name: (data as any).name ?? "",
        start_date: (data as any).date_from ? dayjs((data as any).date_from).format("YYYY-MM-DD") : "",
        end_date: (data as any).date_to ? dayjs((data as any).date_to).format("YYYY-MM-DD") : "",
        calendar: (data as any).calendar_id[0] ?? "",
        work_entry_type: (data as any).work_entry_type_id[0] ?? "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [calendarResponse, workEntryResponse] = await Promise.all([
          getCalenderId(),
          getWorkEntryType()
        ]);
        const calendars = calendarResponse.data.data;
        setCalendarOptions(calendars.map((c: any) => ({ value: c.id, label: c.name })));
        const workEntries = workEntryResponse.data.data;
        setWorkEntryOptions(workEntries.map((w: any) => ({ value: w.id, label: w.name })));
        // Set defaults if not set
        if (!formData.calendar && calendars.length > 0) {
          setFormData((prev: any) => ({ ...prev, calendar: calendars[0].id }));
        }
        if (!formData.work_entry_type && workEntries.length > 0) {
          setFormData((prev: any) => ({ ...prev, work_entry_type: workEntries[0].id }));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);



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
      date_from: formData.start_date ? `${formData.start_date} 00:00:00` : null,
      date_to: formData.end_date ? `${formData.end_date} 23:55:09` : null,
      work_entry_type_id: formData.work_entry_type ? parseInt(formData.work_entry_type) : null,
      calendar_id: formData.calendar ? parseInt(formData.calendar) : null
    };


    try {
      if (data && data.id) {
        await updateHoliday(Number(data.id), payload);
      } else {
        await createHoliday(payload);
        console.log("done here")
      }
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
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-bottom bg-light py-2">
            <i className="ti ti-calendar-plus me-2 text-primary fs-20"></i>
            <h5 className="modal-title fw-bold text-dark fs-16">{data ? "Edit Public Holiday" : "Add Public Holiday"}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" id="close-btn-policy" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <form className={`needs-validation ${validated ? "was-validated" : ""}`} noValidate onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-12 mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" name="name" className="form-control" value={formData.name ?? ""} onChange={handleChange} required />
                  {validated && !(formData.name) && (
                    <span className="text-danger small">Name is Required</span>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Start Date</label>
                  <div className="input-icon position-relative w-100">
                    <span className="input-icon-addon">
                      <i className="ti ti-calendar" />
                    </span>
                    <DatePicker
                      className={`form-control datetimepicker ${
                        validated && !formData.start_date ? "is-invalid" : ""
                      }`}
                      format="DD-MM-YYYY"
                      placeholder="DD-MM-YYYY"
                      value={formData.start_date ? dayjs(formData.start_date, "YYYY-MM-DD") : null}
                      onChange={(date) =>
                        setFormData({
                          ...formData,
                          start_date: date ? date.format("YYYY-MM-DD") : "",
                        })
                      }
                    />
                  </div>
                  {validated && !formData.start_date && (
                    <span className="text-danger small">Start Date is Required</span>
                  )}
                </div>

                  {/* new start date */}
                                <div className="col-md-6 mb-3">
                  <label className="form-label">Start Date</label>
                  <div className="input-icon position-relative w-100">
                    <span className="input-icon-addon">
                      <i className="ti ti-calendar" />
                    </span>
                    <DatePicker
                      className={`form-control datetimepicker ${
                        validated && !formData.start_date ? "is-invalid" : ""
                      }`}
                      format="DD-MM-YYYY"
                      placeholder="DD-MM-YYYY"
                      value={formData.start_date ? dayjs(formData.start_date, "YYYY-MM-DD") : null}
                      onChange={(date) =>
                        setFormData({
                          ...formData,
                          start_date: date ? date.format("YYYY-MM-DD") : "",
                        })
                      }
                    />
                  </div>
                  {validated && !formData.start_date && (
                    <span className="text-danger small">Start Date is Required</span>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">End Date</label>
                  <div className="input-icon position-relative w-100">
                    <span className="input-icon-addon">
                      <i className="ti ti-calendar" />
                    </span>
                    <DatePicker
                      className={`form-control datetimepicker ${
                        validated && !formData.end_date ? "is-invalid" : ""
                      }`}
                      format="DD-MM-YYYY"
                      placeholder="DD-MM-YYYY"
                      value={formData.end_date ? dayjs(formData.end_date, "YYYY-MM-DD") : null}
                      onChange={(date) =>
                        setFormData({
                          ...formData,
                          end_date: date ? date.format("YYYY-MM-DD") : "",
                        })
                      }
                    />
                  </div>
                  {validated && !(formData.end_date) && (
                    <span className="text-danger small">End Date is Required</span>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Working Hours</label>
                  <div>
                    <CommonSelect
                      options={calendarOptions}
                      value={calendarOptions.find(opt => opt.value === formData.calendar)}
                      onChange={(opt: any) => setFormData((prev: any) => ({ ...prev, calendar: opt?.value }))}
                      placeholder="Select Working Hours"
                    />
                  </div>
                  {validated && !(formData.calendar) && (
                    <span className="text-danger small">Working Hours is Required</span>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Work Entry Type</label>
                  <div>
                    <CommonSelect
                      options={workEntryOptions}
                      value={workEntryOptions.find(opt => opt.value === formData.work_entry_type)}
                      onChange={(opt: any) => setFormData((prev: any) => ({ ...prev, work_entry_type: opt?.value }))}
                      placeholder="Select Work Entry Type"
                    />
                  </div>
                  {validated && !(formData.work_entry_type) && (
                    <span className="text-danger small">Work Entry Type is Required</span>
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
