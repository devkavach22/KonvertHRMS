import React, { useEffect, useState } from "react";
import {
  createMandatoryDays,updateMandatoryDays,getBranches
} from "./mendetoryDaysServices";
import { DatePicker } from "antd";
import dayjs from "dayjs";

interface Props {
  onSuccess: () => void;
  data: any;
}

const AddEditPublicHolidayModal: React.FC<Props> = ({ onSuccess, data }) => {
  const initialFormState = {
  name: "",
  start_date: "",
  end_date: "",
  color: "",
  company: ""
};

  const [formData, setFormData] = useState<any>(initialFormState);
  const [validated, setValidated] = useState(false);
  const [companyOptions, setCompanyOptions] = useState<any[]>([]);

  const COLOR_OPTIONS = [
  { id: 1, label: "Red", hex: "#dc3545" },
  { id: 2, label: "Blue", hex: "#0d6efd" },
  { id: 3, label: "Green", hex: "#198754" },
  { id: 4, label: "Yellow", hex: "#ffc107" },
  { id: 5, label: "Purple", hex: "#6f42c1" },
];

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await getBranches();
        const branches = response || [];
        setCompanyOptions(branches.map((b: any) => ({ id: b.id, name: b.name })));
      } catch (err) {
        console.error("Error fetching branches:", err);
      }
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    if (data) {
      setFormData({
        name: (data as any).name ?? "",
        start_date: (data as any).start_date ?? "",
        end_date: (data as any).end_date ?? "",
        color: (data as any).color ?? "",
        company: (data as any).company_id ?? 12,
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
  start_date: formData.start_date,
  end_date: formData.end_date,
  color: Number(formData.color),
  company_id: 12,
};

    try {
      if (data) {
        await updateMandatoryDays(Number((data as any).id), payload);
      } else {
        await createMandatoryDays(payload);
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
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{data ? "Edit Mendetory Days" : "Add Mendetory Days"}</h5>
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

                {/* <div className="col-md-6 mb-3">
                  <label className="form-label">Company</label>
                  <select name="company" className="form-select" value={formData.company ?? ""} onChange={handleChange} required>
                    <option value="">Select Company</option>
                    {companyOptions.map((opt: any) => (
                      <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                  </select>
                  {validated && !(formData.company) && (
                    <span className="text-danger small">Required</span>
                  )}
                </div> */}

                {/* color field */}
                {/* <div className="col-md-6 mb-3">
                  <label className="form-label">Color</label>
                  <input type="number" name="color" className="form-control" value={formData.color ?? ""} onChange={handleChange} min="1" required />
                  {validated && !(formData.color) && (
                    <span className="text-danger small">Required</span>
                  )}
                </div> */}

                <div className="col-md-6 mb-3">
                  <label className="form-label">Start Date</label>
                  <DatePicker
                    className={`form-control w-100 ${validated && !formData.start_date ? "is-invalid" : ""}`}
                    value={formData.start_date ? dayjs(formData.start_date) : null}
                    onChange={(_, dateStr) => setFormData({ ...formData, start_date: dateStr })}
                  />
                  {validated && !(formData.start_date) && (
                    <span className="text-danger small">Required</span>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">End Date</label>
                  <DatePicker
                    className={`form-control w-100 ${validated && !formData.end_date ? "is-invalid" : ""}`}
                    value={formData.end_date ? dayjs(formData.end_date) : null}
                    onChange={(_, dateStr) => setFormData({ ...formData, end_date: dateStr })}
                  />
                  {validated && !(formData.end_date) && (
                    <span className="text-danger small">Required</span>
                  )}
                </div>


                <div className="col-md-6 mb-3">
  <label className="form-label">Color</label>

  <select
    name="color"
    className="form-select"
    value={formData.color}
    onChange={handleChange}
    required
  >
    <option value="">Select Color</option>

    {COLOR_OPTIONS.map((color) => (
      <option key={color.id} value={color.id}>
        {color.label}
      </option>
    ))}
  </select>

  {validated && !formData.color && (
    <span className="text-danger small">Required</span>
  )}

  {/* Color preview */}
  {formData.color && (
    <div
      className="mt-2"
      style={{
        width: "100%",
        height: "30px",
        borderRadius: "4px",
        backgroundColor:
          COLOR_OPTIONS.find(c => c.id === Number(formData.color))?.hex,
      }}
    />
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
