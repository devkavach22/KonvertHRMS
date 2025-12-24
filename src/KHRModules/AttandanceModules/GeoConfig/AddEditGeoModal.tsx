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

const AddEditAttendancePolicyModal: React.FC<Props> = ({ onSuccess, data }) => {
  // Initial state for the new geofence-style attendance fields
  const initialFormState = {
    name: "",
    latitude: "",
    longitude: "",
    radius_km: "",
    employees_selection: [] as any[],
  };

  const { Option } = Select;


  const [formData, setFormData] = useState<any>(initialFormState);
  const [validated, setValidated] = useState(false);

  // 1. DATA SYNC: Populate form when editing
  useEffect(() => {
    if (data) {
      // Map incoming `data` to the new form shape.
      let employees: any[] = [];
      if (Array.isArray((data as any).employees_selection)) {
        employees = (data as any).employees_selection;
      } else if (typeof (data as any).employees_selection === "string") {
        try {
          const parsed = JSON.parse((data as any).employees_selection);
          if (Array.isArray(parsed)) employees = parsed;
        } catch (e) {
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


  const employeesList = [
    { id: 1, name: "John Doe", role: "Developer" },
    { id: 2, name: "Jane Smith", role: "UI/UX Designer" },
    { id: 3, name: "Michael Brown", role: "Project Manager" },
    { id: 4, name: "Emily Johnson", role: "QA Engineer" },
    { id: 5, name: "Robert Wilson", role: "Backend Developer" },
  ];


  // 2. RESET LOGIC: Listen for Modal Close
  useEffect(() => {
    const modalElement = document.getElementById("add_attendance_policy");
    const handleModalClose = () => {
      setValidated(false);
      setFormData(initialFormState);
    };
    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", handleModalClose);
    }
    return () => {
      if (modalElement) {
        modalElement.removeEventListener("hidden.bs.modal", handleModalClose);
      }
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;

    // Special handling for employees_selection textarea: always store as an array of objects
    if (name === "employees_selection") {
      // If the user clears the textarea, set to empty array
      if (!value || value.trim() === "") {
        setFormData((prev: any) => ({ ...prev, [name]: [] }));
        return;
      }

      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          setFormData((prev: any) => ({ ...prev, [name]: parsed }));
          return;
        }
      } catch (err) {
        // If invalid JSON, set empty array to avoid storing raw string
        setFormData((prev: any) => ({ ...prev, [name]: [] }));
        return;
      }

      // If parsed but not an array, set empty array
      setFormData((prev: any) => ({ ...prev, [name]: [] }));
      return;
    }

    // For numeric fields (latitude, longitude, radius_km) keep as string but allow empty
    if (name === "latitude" || name === "longitude" || name === "radius_km") {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
      return;
    }

    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;
    setValidated(true);

    if (form.checkValidity() === false) {
      return;
    }

    // Prepare Payload: convert numeric fields and ensure employees_selection is an array
    const apiPayload: any = { ...formData };

    apiPayload.latitude = apiPayload.latitude === "" ? null : Number(apiPayload.latitude);
    apiPayload.longitude = apiPayload.longitude === "" ? null : Number(apiPayload.longitude);
    apiPayload.radius_km = apiPayload.radius_km === "" ? null : Number(apiPayload.radius_km);

    if (!Array.isArray(apiPayload.employees_selection)) {
      apiPayload.employees_selection = [];
    }

    try {
      if (data && data.id) {
        await updateAttendancePolicy(data.id, apiPayload);
      } else {
        await addAttendancePolicy(apiPayload);
      }

      const closeBtn = document.getElementById("close-btn-policy");
      closeBtn?.click();
      onSuccess();
    } catch (error) {
      console.error("Failed to save policy", error);
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
              {data ? "Edit Geo Configurations" : "Add Geo Configurations"}
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
                {/* Name - MANDATORY */}
                <div className="col-md-12 mb-3">
                  <label className="form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    required
                    value={String(formData.name ?? "")}
                    onChange={handleChange}
                    placeholder="e.g. Main Office Geofence"
                  />
                  <div className="invalid-feedback">Please provide a name.</div>
                </div>

                {/* Latitude - float */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    className="form-control"
                    value={formData.latitude ?? ""}
                    onChange={handleChange}
                    placeholder="e.g. 23.780887"
                  />
                </div>

                {/* Longitude - float */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    className="form-control"
                    value={formData.longitude ?? ""}
                    onChange={handleChange}
                    placeholder="e.g. 90.279237"
                  />
                </div>

                {/* Radius Km - float */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Radius (Km)</label>
                  <input
                    type="number"
                    step="any"
                    name="radius_km"
                    className="form-control"
                    value={formData.radius_km ?? ""}
                    onChange={handleChange}
                    placeholder="e.g. 0.5"
                  />
                </div>

                {/* Employees Selection - list of objects (JSON textarea) */}
                <div className="col-md-12 mb-3">
                  <label className="form-label">Employees Selection</label>

                  <Select
                    className="antd-form-select text-black"
                    mode="multiple"
                    allowClear
                    placeholder="Select Employees"
                    value={formData.employees_selection?.map((emp: any) => emp.id)}
                    getPopupContainer={(triggerNode) => triggerNode.parentElement!}
                    onChange={(selectedIds: number[]) => {
                      const selectedEmployees = employeesList.filter((emp) =>
                        selectedIds.includes(emp.id)
                      );

                      setFormData({
                        ...formData,
                        employees_selection: selectedEmployees,
                      });
                    }}
                    style={{ width: "100%" }}
                  >
                    {employeesList.map((emp) => (
                      <Option key={emp.id} value={emp.id}>
                        {emp.name} — {emp.role}
                      </Option>
                    ))}
                  </Select>


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


