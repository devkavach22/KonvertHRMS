import React, { useEffect, useState } from "react";
import { Select } from "antd";

import {
  addAttendancePolicy,
  updateAttendancePolicy,
  AttendancePolicy,
} from "./GeoServices";

interface Props {
  onSuccess: () => void;
  data: AttendancePolicy | null;
}

const { Option } = Select;

const AddEditAttendancePolicyModal: React.FC<Props> = ({ onSuccess, data }) => {
  const initialFormState = {
    name: "",
    latitude: "",
    longitude: "",
    radius_km: "",
    employees_selection: [] as any[],
  };

  const [formData, setFormData] = useState<any>(initialFormState);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const employeesList = [
    { id: 1, name: "John Doe", role: "Developer" },
    { id: 2, name: "Jane Smith", role: "UI/UX Designer" },
    { id: 3, name: "Michael Brown", role: "Project Manager" },
    { id: 4, name: "Emily Johnson", role: "QA Engineer" },
    { id: 5, name: "Robert Wilson", role: "Backend Developer" },
  ];

  // Populate form in edit mode
  useEffect(() => {
    if (data) {
      let employees: any[] = [];

      if (Array.isArray((data as any).employees_selection)) {
        employees = (data as any).employees_selection;
      } else if (typeof (data as any).employees_selection === "string") {
        try {
          const parsed = JSON.parse((data as any).employees_selection);
          if (Array.isArray(parsed)) employees = parsed;
        } catch {
          employees = [];
        }
      }

      setFormData({
        name: data.name === "-" ? "" : data.name || "",
        latitude: (data as any).latitude ?? "",
        longitude: (data as any).longitude ?? "",
        radius_km: (data as any).radius_km ?? "",
        employees_selection: employees,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [data]);

  // Reset on modal close
  useEffect(() => {
    const modalElement = document.getElementById("add_attendance_policy");

    const handleModalClose = () => {
      setValidated(false);
      setErrors({});
      setFormData(initialFormState);
    };

    modalElement?.addEventListener("hidden.bs.modal", handleModalClose);
    return () => {
      modalElement?.removeEventListener("hidden.bs.modal", handleModalClose);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // 🔐 VALIDATION ONLY
  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (
      (formData.latitude && !formData.longitude) ||
      (!formData.latitude && formData.longitude)
    ) {
      newErrors.location =
        "Both latitude and longitude must be provided together";
    }

    if (formData.radius_km && Number(formData.radius_km) <= 0) {
      newErrors.radius_km = "Radius must be greater than 0";
    }

    if (
      !formData.employees_selection ||
      formData.employees_selection.length === 0
    ) {
      newErrors.employees_selection =
        "Please select at least one employee";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ❗ API LOGIC NOT TOUCHED
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);

    if (!validateForm()) return;

    const apiPayload: any = { ...formData };

    apiPayload.latitude =
      apiPayload.latitude === "" ? null : Number(apiPayload.latitude);
    apiPayload.longitude =
      apiPayload.longitude === "" ? null : Number(apiPayload.longitude);
    apiPayload.radius_km =
      apiPayload.radius_km === "" ? null : Number(apiPayload.radius_km);

    if (!Array.isArray(apiPayload.employees_selection)) {
      apiPayload.employees_selection = [];
    }

    try {
      if (data && data.id) {
        await updateAttendancePolicy(data.id, apiPayload);
      } else {
        await addAttendancePolicy(apiPayload);
      }

      document.getElementById("close-btn-policy")?.click();
      onSuccess();
    } catch (error) {
      console.error("Failed to save policy", error);
      alert("Error saving data.");
    }
  };

  return (
    <div className="modal fade" id="add_attendance_policy" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {data ? "Edit Geo Configurations" : "Add Geo Configurations"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-btn-policy"
            />
          </div>

          <div className="modal-body">
            <form
              noValidate
              className={`needs-validation ${
                validated ? "was-validated" : ""
              }`}
              onSubmit={handleSubmit}
            >
              <div className="row">
                {/* Name */}
                <div className="col-md-12 mb-3">
                  <label className="form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <div className="text-danger mt-1">{errors.name}</div>
                  )}
                </div>

                {/* Latitude */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Latitude</label>
                  <input
                    type="number"
                    name="latitude"
                    className="form-control"
                    value={formData.latitude}
                    onChange={handleChange}
                  />
                </div>

                {/* Longitude */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Longitude</label>
                  <input
                    type="number"
                    name="longitude"
                    className="form-control"
                    value={formData.longitude}
                    onChange={handleChange}
                  />
                </div>

                {/* Radius */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Radius (Km)</label>
                  <input
                    type="number"
                    name="radius_km"
                    className="form-control"
                    value={formData.radius_km}
                    onChange={handleChange}
                  />
                  {errors.radius_km && (
                    <div className="text-danger mt-1">
                      {errors.radius_km}
                    </div>
                  )}
                </div>

                {errors.location && (
                  <div className="col-md-12 mb-2">
                    <div className="text-danger">{errors.location}</div>
                  </div>
                )}

                {/* Employees */}
                <div className="col-md-12 mb-3">
                  <label className="form-label">Employees Selection</label>
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    value={formData.employees_selection.map((e: any) => e.id)}
                    onChange={(ids: number[]) => {
                      const selected = employeesList.filter((emp) =>
                        ids.includes(emp.id)
                      );
                      setFormData({
                        ...formData,
                        employees_selection: selected,
                      });
                    }}
                  >
                    {employeesList.map((emp) => (
                      <Option key={emp.id} value={emp.id}>
                        {emp.name} — {emp.role}
                      </Option>
                    ))}
                  </Select>

                  {errors.employees_selection && (
                    <div className="text-danger mt-1">
                      {errors.employees_selection}
                    </div>
                  )}
                </div>
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
                  {data ? "Update Changes" : "Save"}
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
