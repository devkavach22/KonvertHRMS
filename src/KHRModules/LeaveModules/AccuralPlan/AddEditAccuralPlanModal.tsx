import React, { useEffect, useState } from "react";
import {
  AttendancePolicy,
  createAccuralPlan,
  updateAccuralPlan,
} from "./AccuralPlanServices";

interface Props {
  onSuccess: () => void;
  data: AttendancePolicy | null;
}

const AddEditAttendancePolicyModal: React.FC<Props> = ({ onSuccess, data }) => {
  // console.log(data)
  const initialFormState = {
    name: "",
    accrued_gain_time: "",
    carry_over_time: "",
    based_on_worked_time: false,
    company: "",
  };

  const [formData, setFormData] = useState<any>(initialFormState);
  const [validated, setValidated] = useState(false);
  const [companiesOptions, setCompaniesOptions] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      const accruedGainTime =
        (data as any).accrued_gain_time === "start"
          ? "start_of_accrual"
          : "end_of_accrual";
      const carryOverTime =
        (data as any).carryover_date === "year_start"
          ? "start_of_year"
          : (data as any).carryover_date === "allocation_date"
          ? "allocation_date"
          : "other";
      setFormData({
        name: (data as any).name ?? "",
        accrued_gain_time: accruedGainTime,
        carry_over_time: carryOverTime,
        based_on_worked_time: Boolean((data as any).is_based_on_worked_time),
        company: Array.isArray((data as any).company_id)
          ? (data as any).company_id[1] ?? ""
          : "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [data]);

  // fetch companies
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const endpoints = [
          "/api/companies",
          "/companies",
          "/api/organizations",
          "/api/company",
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
            if (json && (json.id || json.name)) {
              result = [json];
              break;
            }
          } catch (e) {
            // continue
          }
        }
        if (mounted && Array.isArray(result)) {
          const opts = result.map((r: any) => ({
            id: r.id ?? r.value,
            name: r.name ?? r.company_name ?? r.label ?? String(r.id),
          }));
          setCompaniesOptions(opts);
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // reset on modal close
  useEffect(() => {
    const modalElement = document.getElementById("add_attendance_policy");
    const handleModalClose = () => {
      setValidated(false);
      setFormData(initialFormState);
    };
    if (modalElement)
      modalElement.addEventListener("hidden.bs.modal", handleModalClose);
    return () => {
      if (modalElement)
        modalElement.removeEventListener("hidden.bs.modal", handleModalClose);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
    const name = target.name;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setFormData((prev: any) => ({
        ...prev,
        [name]: (target as HTMLInputElement).checked,
      }));
      return;
    }

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
      carryover_date:
        formData.carry_over_time === "start_of_year"
          ? "year_start"
          : formData.carry_over_time === "allocation_date"
          ? "allocation_date"
          : "other",
      accrued_gain_time:
        formData.accrued_gain_time === "start_of_accrual" ? "start" : "end",
      // company_id: parseInt(formData.company),
      is_based_on_worked_time: Boolean(formData.based_on_worked_time),
    };

    try {
      if (data) {
        await updateAccuralPlan(Number(data.id), payload);
      } else {
        await createAccuralPlan(payload);
      }
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
    <div
      className="modal custom-modal fade"
      id="add_attendance_policy"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {data ? "Edit Accrual Plan" : "Add Accrual Plan"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-btn-policy"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form
              className={`needs-validation ${validated ? "was-validated" : ""}`}
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="row">
                <div className="col-md-12 mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name ?? ""}
                    onChange={handleChange}
                    required
                  />
                  {validated && !formData.name && (
                    <span className="text-danger small">
                      Required — please enter name
                    </span>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Accrued Gain Time</label>
                  <select
                    name="accrued_gain_time"
                    className="form-select"
                    value={formData.accrued_gain_time ?? ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="start_of_accrual">
                      At the start of the accrual period
                    </option>
                    <option value="end_of_accrual">
                      At the end of the accrual period
                    </option>
                  </select>
                  {validated && !formData.accrued_gain_time && (
                    <span className="text-danger small">
                      Required — select accrued gain time
                    </span>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Carry-Over Time</label>
                  <select
                    name="carry_over_time"
                    className="form-select"
                    value={formData.carry_over_time ?? ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="start_of_year">
                      At the start of the year
                    </option>
                    <option value="allocation_date">
                      At the allocation date
                    </option>
                    <option value="other">Other</option>
                  </select>
                  {validated && !formData.carry_over_time && (
                    <span className="text-danger small">
                      Required — select carry-over time
                    </span>
                  )}
                </div>

                <div className="col-md-6 mb-3 d-flex align-items-center">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="basedOnWorked"
                      name="based_on_worked_time"
                      checked={!!formData.based_on_worked_time}
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label ms-2"
                      htmlFor="basedOnWorked"
                    >
                      Based on worked time?
                    </label>
                  </div>
                </div>

                {/* <div className="col-md-6 mb-3">
                  <label className="form-label">Company</label>
                  <select name="company" className="form-select" value={formData.company ?? ""} onChange={handleChange} required>
                    <option value="">Select company</option>
                    {companiesOptions.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {validated && !(formData.company) && (
                    <span className="text-danger small">Required — select company</span>
                  )}
                </div> */}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {data ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditAttendancePolicyModal;
