import MultiSelect from "@/KHRModules/commanForm/inputComman/MultiSelect";
import React, { useEffect, useState } from "react";
import { addGeoConfig, updateGeoConfig } from "./GeoServices";
import { getEmployees } from "@/KHRModules/EmployeModules/Employee/EmployeeServices";
import { toast } from "react-toastify";

interface Props {
  data: any | null;
  onSuccess: () => void;
  onClose?: () => void;
}

interface Option {
  id: number;
  name: string;
  role: string;
}

const AddEditGeoModal: React.FC<Props> = ({ data, onSuccess, onClose }) => {
  const [formData, setFormData] = useState<any>({
    name: "",
    latitude: "",
    longitude: "",
    radius_km: "",
    employees_selection: [],
  });

  const [errors, setErrors] = useState<any>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employeesList, setEmployeeList] = useState<Option[]>([]);

  useEffect(() => {
    const fetchEmploymentData = async () => {
      try {
        const employees = await getEmployees();
        setEmployeeList(employees || []);
      } catch (error) {
        console.error("Error loading employees:", error);
      }
    };
    fetchEmploymentData();
  }, []);

  // Handle Data Population (Edit Mode) vs Reset (Add Mode)
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        latitude: data.latitude || "",
        longitude: data.longitude || "",
        radius_km: data.radius_km || "",
        employees_selection: data.employees_selection || [],
      });
    } else {
      resetForm();
    }
  }, [data]);

  // FIX: Listen for Bootstrap's hidden event to clear form on backdrop click / Esc key
  useEffect(() => {
    const modalElement = document.getElementById("add_geo_config");
    const handleHidden = () => {
      resetForm();
    };

    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", handleHidden);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("hidden.bs.modal", handleHidden);
      }
    };
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      latitude: "",
      longitude: "",
      radius_km: "",
      employees_selection: [],
    });
    setErrors({});
    setIsSubmitted(false);
  };

  const getInputClass = (fieldName: string) => {
    if (errors[fieldName]) return "form-control is-invalid";
    if (isSubmitted && formData[fieldName] && !errors[fieldName])
      return "form-control is-valid";
    return "form-control";
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    let tempErrors: any = {};
    let isValid = true;

    if (!formData.name?.toString().trim()) {
      tempErrors.name = "Location Name is required";
      isValid = false;
    }
    if (!formData.latitude) {
      tempErrors.latitude = "Latitude is required";
      isValid = false;
    }
    if (!formData.longitude) {
      tempErrors.longitude = "Longitude is required";
      isValid = false;
    }
    if (!formData.radius_km || Number(formData.radius_km) <= 0) {
      tempErrors.radius_km = "Valid Radius is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validate()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    const payload: any = {
      name: formData.name,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      radius_km: Number(formData.radius_km),
      hr_employee_ids: formData.employees_selection.map((e: any) => e.id),
    };

    try {
      if (data && data.id) {
        await updateGeoConfig(data.id, payload);
        toast.success("Geo Configuration Updated Successfully");
      } else {
        await addGeoConfig(payload);
        toast.success("Geo Configuration Created Successfully");
      }

      // Close Modal Logic
      const modalElement = document.getElementById("add_geo_config");
      const closeBtn = modalElement?.querySelector(
        '[data-bs-dismiss="modal"]'
      ) as HTMLElement;
      if (closeBtn) closeBtn.click();

      onSuccess();
      if (onClose) onClose();
      // resetForm(); // Handled by hidden.bs.modal event now
    } catch (error) {
      console.error("Error saving geo config:", error);
      toast.error("Failed to save configuration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>
        {`
          #add_geo_config { z-index: 1055 !important; }
          #add_geo_config .modal-content, 
          #add_geo_config .modal-body { 
            overflow: visible !important; 
          }
          .react-select__menu { z-index: 9999 !important; }
          .css-1nmdiq5-menu { z-index: 9999 !important; } 
          .is-invalid + .invalid-feedback { display: block; }
        `}
      </style>

      <div
        className="modal fade"
        id="add_geo_config"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header border-bottom bg-light py-2">
              <h5 className="modal-title fw-bold fs-15">
                <i className="ti ti-map-pin me-2 text-primary"></i>
                {data ? "Edit Geo Configuration" : "Add Geo Configuration"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                onClick={resetForm}
              ></button>
            </div>

            <div className="modal-body p-4">
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label fs-13 fw-bold">
                    Location Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={getInputClass("name")}
                    placeholder="e.g. Head Office Zone"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      clearError("name");
                    }}
                  />
                  <div className="invalid-feedback">{errors.name}</div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-4">
                    <label className="form-label fs-13 fw-bold">
                      Latitude <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className={getInputClass("latitude")}
                      placeholder="e.g. 23.0225"
                      value={formData.latitude}
                      onChange={(e) => {
                        setFormData({ ...formData, latitude: e.target.value });
                        clearError("latitude");
                      }}
                    />
                    <div className="invalid-feedback">{errors.latitude}</div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fs-13 fw-bold">
                      Longitude <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className={getInputClass("longitude")}
                      placeholder="e.g. 72.5714"
                      value={formData.longitude}
                      onChange={(e) => {
                        setFormData({ ...formData, longitude: e.target.value });
                        clearError("longitude");
                      }}
                    />
                    <div className="invalid-feedback">{errors.longitude}</div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fs-13 fw-bold">
                      Radius (Km) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className={getInputClass("radius_km")}
                      placeholder="e.g. 0.5"
                      value={formData.radius_km}
                      onChange={(e) => {
                        setFormData({ ...formData, radius_km: e.target.value });
                        clearError("radius_km");
                      }}
                    />
                    <div className="invalid-feedback">{errors.radius_km}</div>
                  </div>
                </div>

                <div
                  className="mb-3"
                  style={{ position: "relative", zIndex: 100 }}
                >
                  <MultiSelect
                    label="Assigned Employees"
                    value={formData.employees_selection.map(
                      (e: { id: any }) => e.id
                    )}
                    options={employeesList || []}
                    onChange={(selectedIds: number[]) =>
                      setFormData({
                        ...formData,
                        employees_selection: employeesList?.filter((e) =>
                          selectedIds.includes(e.id)
                        ),
                      })
                    }
                  />
                  <div className="form-text text-muted">
                    Leave empty to apply globally or select specific employees.
                  </div>
                </div>

                <div className="modal-footer border-0 px-0 mt-4 pb-0">
                  <button
                    type="button"
                    className="btn btn-light px-4 me-2"
                    data-bs-dismiss="modal"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-5 shadow-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="ti ti-device-floppy me-1"></i>
                        Save Configuration
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEditGeoModal;

// import CommonModal from "@/KHRModules/commanForm/CommanModal/CommanModal";
// import { useFormValidation } from "@/KHRModules/commanForm/FormValidation";
// import FormInput from "@/KHRModules/commanForm/inputComman/FormInput";
// import MultiSelect from "@/KHRModules/commanForm/inputComman/MultiSelect";
// import React, { useEffect, useState } from "react";
// import { addGeoConfig, updateGeoConfig } from "./GeoServices";
// import { getEmployees } from "@/KHRModules/EmployeModules/Employee/EmployeeServices";
// import { Modal } from "react-bootstrap";

// const employeesList = [
//   { id: 16674, name: "John Doe", role: "Developer" },
//   { id: 16675, name: "Jane Smith", role: "UI/UX Designer" },
// ];

// interface Props {
//   data: any | null; // null for add, object for edit
//   onSuccess: () => void; // refresh parent table
//   onClose?: () => void;
// }

// interface Option {
//   id: number;
//   name: string;
//   role: string;
// }

// const AddEditGeoModal: React.FC<Props> = ({ data, onSuccess, onClose }) => {
//   const [formData, setFormData] = useState<any>({
//     name: "",
//     latitude: "",
//     longitude: "",
//     radius_km: "",
//     employees_selection: [],
//   });
//   const [errors, setErrors] = useState<any>({});
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const { validateAttendancePolicy } = useFormValidation();
//   const [employeesList, setEmployeeList] = useState<Option[]>();
//   const user_id = Number(localStorage.getItem("user_id") || 0);

//   useEffect(() => {
//     const fetchEmploymentData = async () => {
//       try {
//         const employees = await getEmployees();
//         setEmployeeList(employees || []);
//       } catch (error) {
//         console.error("Error loading employees:", error);
//       }
//     };
//     fetchEmploymentData();
//   }, []);

//   useEffect(() => {
//     if (data) {
//       // Prefill for edit
//       setFormData({
//         name: data.name || "",
//         latitude: data.latitude || "",
//         longitude: data.longitude || "",
//         radius_km: data.radius_km || "",
//         employees_selection: data.employees_selection || [],
//       });
//     } else {
//       // Reset for add
//       setFormData({
//         name: "",
//         latitude: "",
//         longitude: "",
//         radius_km: "",
//         employees_selection: [],
//       });
//       setErrors({});
//       setIsSubmitted(false);
//     }
//   }, [data]);

//   // const handleSubmit = async () => {
//   //   setIsSubmitted(true);
//   //   console.log("handle SUbnmit Called ");

//   //   const validationErrors = validateAttendancePolicy(formData);
//   //   if (Object.keys(validationErrors).length) {
//   //     setErrors(validationErrors);
//   //     console.log("handle SUbnmit Validate", validationErrors);
//   //     return;
//   //   }

//   //   // Payload
//   //   const payload: any = {
//   //     name: formData.name,
//   //     latitude: Number(formData.latitude),
//   //     longitude: Number(formData.longitude),
//   //     radius_km: Number(formData.radius_km),
//   //     hr_employee_ids: formData.employees_selection.map((e: any) => e.id),
//   //   };
//   //   console.log("Payload", payload);

//   //   try {
//   //     if (data && data.id) {
//   //       await updateGeoConfig(data.id, payload);
//   //       console.log("UpdateGEO CONFIGUR", payload);
//   //     } else {
//   //       await addGeoConfig(payload);
//   //       console.log("add GEO COnfigur", payload);
//   //     }
//   //     const modalElement = document.getElementById("add_geo_config");
//   //     if (modalElement) {
//   //       const modalInstance = bootstrap.Modal.getInstance(modalElement);
//   //       if (modalInstance) {
//   //         modalInstance.hide();
//   //       }
//   //     }

//   //     onSuccess();
//   //     handleClose();
//   //   } catch (error) {
//   //     console.error("Error saving geo config:", error);
//   //   }
//   // };

//   const handleSubmit = async () => {
//     setIsSubmitted(true);
//     console.log("handle SUbnmit Called ");

//     const validationErrors = validateAttendancePolicy(formData);
//     if (Object.keys(validationErrors).length) {
//       setErrors(validationErrors);
//       console.log("handle SUbnmit Validate", validationErrors);
//       return;
//     }

//     // Payload
//     const payload: any = {
//       name: formData.name,
//       latitude: Number(formData.latitude),
//       longitude: Number(formData.longitude),
//       radius_km: Number(formData.radius_km),
//       hr_employee_ids: formData.employees_selection.map((e: any) => e.id),
//     };
//     console.log("Payload", payload);

//     try {
//       if (data && data.id) {
//         await updateGeoConfig(data.id, payload);
//         console.log("UpdateGEO CONFIGUR", payload);
//       } else {
//         await addGeoConfig(payload);
//         console.log("add GEO COnfigur", payload);
//       }

//       // --- FIX START: Use the 'Click' Trick ---
//       const modalElement = document.getElementById("add_geo_config");

//       // Find the "close" button (the 'x' or 'Cancel' button) inside the modal
//       // These buttons usually have the attribute data-bs-dismiss="modal"
//       const closeBtn = modalElement?.querySelector(
//         '[data-bs-dismiss="modal"]'
//       ) as HTMLElement;

//       if (closeBtn) {
//         // Clicking this button triggers Bootstrap's native close & cleanup
//         closeBtn.click();
//       }
//       // --- FIX END ---

//       onSuccess();
//       handleClose();
//     } catch (error) {
//       console.error("Error saving geo config:", error);
//     }
//   };

//   const handleClose = () => {
//     setFormData({
//       name: "",
//       latitude: "",
//       longitude: "",
//       radius_km: "",
//       employees_selection: [],
//     });
//     setErrors({});
//     setIsSubmitted(false);
//     onClose && onClose();
//   };

//   return (
//     <CommonModal
//       id="add_geo_config"
//       title={data ? "Edit Geo Configuration" : "Add Geo Configuration"}
//       onSubmit={handleSubmit}
//       // onClose={handleClose}
//     >
//       <FormInput
//         label="Name"
//         name="name"
//         value={formData.name}
//         error={errors.name}
//         isSubmitted={isSubmitted}
//         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//       />

//       <div className="row">
//         <div className="col-md-4">
//           <FormInput
//             label="Latitude"
//             type="number"
//             name="latitude"
//             value={formData.latitude}
//             error={errors.latitude}
//             isSubmitted={isSubmitted}
//             onChange={(e) =>
//               setFormData({ ...formData, latitude: e.target.value })
//             }
//           />
//         </div>
//         <div className="col-md-4">
//           <FormInput
//             label="Longitude"
//             type="number"
//             name="longitude"
//             value={formData.longitude}
//             error={errors.longitude}
//             isSubmitted={isSubmitted}
//             onChange={(e) =>
//               setFormData({ ...formData, longitude: e.target.value })
//             }
//           />
//         </div>
//         <div className="col-md-4">
//           <FormInput
//             label="Radius (Km)"
//             type="number"
//             name="radius_km"
//             value={formData.radius_km}
//             error={errors.radius_km}
//             isSubmitted={isSubmitted}
//             onChange={(e) =>
//               setFormData({ ...formData, radius_km: e.target.value })
//             }
//           />
//         </div>
//       </div>

//       {/* <MultiSelect
// label="Employees"
// value={formData.employees_selection.map((e: any) => e.id)}
// options={employeesList || []}
// isSubmitted={isSubmitted}
// error={errors.employees_selection}
// onChange={(ids) =>
// setFormData({
// ...formData,
// employees_selection: employeesList.filter((e) =>
// ids.includes(e.id)
// ),
// })
// }
// /> */}
//       <MultiSelect
//         label="Employees"
//         value={formData.employees_selection.map((e: { id: any }) => e.id)}
//         options={employeesList || []} // always defined as array
//         // isSubmitted={false}
//         // error={""}
//         onChange={(selectedIds: number[]) =>
//           setFormData({
//             ...formData,
//             employees_selection: employeesList?.filter((e) =>
//               selectedIds.includes(e.id)
//             ),
//           })
//         }
//       />
//     </CommonModal>
//   );
// };

// export default AddEditGeoModal;
