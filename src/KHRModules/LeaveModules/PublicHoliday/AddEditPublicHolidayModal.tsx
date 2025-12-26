import React, { useEffect, useState } from "react";
import {
  addAttendancePolicy,
  updateAttendancePolicy,
  AttendancePolicy,
} from "./PublicHolidayServices";

interface Props {
  onSuccess: () => void;
  data: AttendancePolicy | null;
}

const AddEditPublicHolidayModal: React.FC<Props> = ({ onSuccess, data }) => {
  const initialFormState = {
    name: "",
    start_date: "",
    end_date: "",
    working: "",
    work_entry_type: "",
  };

  const [formData, setFormData] = useState<any>(initialFormState);
  const [validated, setValidated] = useState(false);
  const [workingOptions, setWorkingOptions] = useState<any[]>([]);
  const [workEntryTypeOptions, setWorkEntryTypeOptions] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setFormData({
        name: (data as any).name ?? "",
        start_date: (data as any).start_date ?? "",
        end_date: (data as any).end_date ?? "",
        working: (data as any).working ?? "",
        work_entry_type: (data as any).work_entry_type ?? "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [data]);

  // fetch working options
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const endpoints = ["/api/working", "/working", "/api/working-options", "/api/working_statuses"];
        let result: any = null;
        for (const ep of endpoints) {
          try {
            const res = await fetch(ep);
            if (!res.ok) continue;
            const json = await res.json();
            if (Array.isArray(json)) { result = json; break; }
            if (json && Array.isArray(json.data)) { result = json.data; break; }
            if (json && (json.id || json.name)) { result = [json]; break; }
          } catch (e) {
            // continue
          }
        }
        if (mounted && Array.isArray(result)) {
          const opts = result.map((r: any) => ({ id: r.id ?? r.value, name: r.name ?? r.label ?? String(r.id) }));
          setWorkingOptions(opts);
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  // fetch work entry type options
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const endpoints = ["/api/work-entry-types", "/work-entry-types", "/api/work_entry_types", "/api/entry-types"];
        let result: any = null;
        for (const ep of endpoints) {
          try {
            const res = await fetch(ep);
            if (!res.ok) continue;
            const json = await res.json();
            if (Array.isArray(json)) { result = json; break; }
            if (json && Array.isArray(json.data)) { result = json.data; break; }
            if (json && (json.id || json.name)) { result = [json]; break; }
          } catch (e) {
            // continue
          }
        }
        if (mounted && Array.isArray(result)) {
          const opts = result.map((r: any) => ({ id: r.id ?? r.value, name: r.name ?? r.label ?? String(r.id) }));
          setWorkEntryTypeOptions(opts);
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
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

    const payload: any = {
      name: formData.name || null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      working: formData.working || null,
      work_entry_type: formData.work_entry_type || null,
    };

    try {
      if (data && data.id) await updateAttendancePolicy(data.id, payload);
      else await addAttendancePolicy(payload);
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
                  <input type="date" name="start_date" className="form-control" value={formData.start_date ?? ""} onChange={handleChange} required />
                  {validated && !(formData.start_date) && (
                    <span className="text-danger small">Required</span>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">End Date</label>
                  <input type="date" name="end_date" className="form-control" value={formData.end_date ?? ""} onChange={handleChange} required />
                  {validated && !(formData.end_date) && (
                    <span className="text-danger small">Required</span>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Working</label>
                  <select name="working" className="form-select" value={formData.working ?? ""} onChange={handleChange} required>
                    <option value="">Select</option>
                    {workingOptions.map((o) => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                  {validated && !(formData.working) && (
                    <span className="text-danger small">Required</span>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Work Entry Type</label>
                  <select name="work_entry_type" className="form-select" value={formData.work_entry_type ?? ""} onChange={handleChange} required>
                    <option value="">Select</option>
                    {workEntryTypeOptions.map((o) => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
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

