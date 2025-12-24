import React, { useEffect, useState } from "react";
import //   addDepartment,
//   updateDepartment,
// Department,
"./JobPosition";
import {
  addDepartment,
  updateDepartment,
} from "../Department/departmentService";

// Define the interface locally if not exported from service
interface Department {
  id?: string | number;
  name: string;
  parent_id: number | null;
  color: number;
  unit_code: string;
  range_start: number;
  range_end: number;
  is_no_range: boolean;
  is_lapse_allocation: boolean;
  wage: number;
  // UI legacy fields
  Department_Head?: string;
  Status?: string;
}

interface Props {
  onSuccess: () => void;
  data: Department | null; // Receive selected department data
}

const AddDepartmentModal: React.FC<Props> = ({ onSuccess, data }) => {
  // Initialize state with all fields from your JSON payload
  const [formData, setFormData] = useState({
    name: "",
    unit_code: "",
    Department_Head: "", // Kept for UI, though payload uses parent_id
    color: 0,
    wage: 0,
    range_start: 0,
    range_end: 0,
    is_no_range: false,
    is_lapse_allocation: false,
    Status: "Active",
  });

  // 1. WATCH FOR DATA CHANGES: Populate form if editing, reset if adding
  useEffect(() => {
    if (data) {
      // Edit Mode: Fill form from selected row
      setFormData({
        name: data.name || "",
        unit_code: data.unit_code || "",
        Department_Head: data.Department_Head || "",
        color: data.color || 0,
        wage: data.wage || 0,
        range_start: data.range_start || 0,
        range_end: data.range_end || 0,
        is_no_range: data.is_no_range || false,
        is_lapse_allocation: data.is_lapse_allocation || false,
        Status: (data.Status as string) || "Active",
      });
    } else {
      // Add Mode: Reset form
      setFormData({
        name: "",
        unit_code: "",
        Department_Head: "",
        color: 0,
        wage: 0,
        range_start: 0,
        range_end: 0,
        is_no_range: false,
        is_lapse_allocation: false,
        Status: "Active",
      });
    }
  }, [data]);

  // Helper to handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // PREPARE PAYLOAD: Map State to specific API JSON structure
    const apiPayload = {
      name: formData.name,
      parent_id: null, // You can map Department_Head logic here if needed
      color: Number(formData.color), // Ensure number
      unit_code: formData.unit_code,
      range_start: Number(formData.range_start),
      range_end: Number(formData.range_end),
      is_no_range: formData.is_no_range,
      is_lapse_allocation: formData.is_lapse_allocation,
      wage: Number(formData.wage),
      // status: formData.Status, // Add if API supports it
    };

    try {
      if (data && data.id) {
        // 2. EDIT LOGIC
        // await updateDepartment(data.id, apiPayload);
      } else {
        // 3. ADD LOGIC
        await addDepartment(apiPayload);
      }

      // Close modal & Refresh
      const closeBtn = document.getElementById("close-btn-dept");
      closeBtn?.click();
      onSuccess();
    } catch (error) {
      console.error("Failed to save department", error);
      alert("Error saving data. Check console.");
    }
  };

  return (
    <div
      className="modal custom-modal fade"
      id="job_PositionsModal"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        {" "}
        {/* Increased width to modal-lg */}
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {data ? "Edit Department" : "Add Department"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-btn-dept"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Department Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Department Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                {/* Unit Code */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Unit Code</label>
                  <input
                    type="text"
                    name="unit_code"
                    className="form-control"
                    required
                    value={formData.unit_code}
                    onChange={handleChange}
                  />
                </div>

                {/* Department Head */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Department Head</label>
                  <input
                    type="text"
                    name="Department_Head"
                    className="form-control"
                    value={formData.Department_Head}
                    onChange={handleChange}
                  />
                </div>

                {/* Wage */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Wage</label>
                  <input
                    type="number"
                    name="wage"
                    className="form-control"
                    value={formData.wage}
                    onChange={handleChange}
                  />
                </div>

                {/* Color Code */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Color ID</label>
                  <input
                    type="number"
                    name="color"
                    className="form-control"
                    value={formData.color}
                    onChange={handleChange}
                  />
                </div>

                {/* Empty Col for spacing if needed */}
                <div className="col-md-6 mb-3"></div>

                <div className="col-12">
                  <hr />
                </div>

                {/* Range Section */}
                <div className="col-md-12 mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="is_no_range"
                      id="is_no_range"
                      checked={formData.is_no_range}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="is_no_range">
                      Is No Range?
                    </label>
                  </div>
                </div>

                {/* Show Ranges only if 'is_no_range' is false */}
                {!formData.is_no_range && (
                  <>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Range Start</label>
                      <input
                        type="number"
                        name="range_start"
                        className="form-control"
                        value={formData.range_start}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Range End</label>
                      <input
                        type="number"
                        name="range_end"
                        className="form-control"
                        value={formData.range_end}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}

                {/* Lapse Allocation */}
                <div className="col-md-12 mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="is_lapse_allocation"
                      id="is_lapse_allocation"
                      checked={formData.is_lapse_allocation}
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="is_lapse_allocation"
                    >
                      Is Lapse Allocation?
                    </label>
                  </div>
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
                  {data ? "Update Changes" : "Save Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDepartmentModal;
