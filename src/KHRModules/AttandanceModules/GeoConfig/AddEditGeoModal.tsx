import CommonModal from "@/KHRModules/commanForm/CommanModal/CommanModal";
import { useFormValidation } from "@/KHRModules/commanForm/FormValidation";
import FormInput from "@/KHRModules/commanForm/inputComman/FormInput";
import MultiSelect from "@/KHRModules/commanForm/inputComman/MultiSelect";
import React, { useEffect, useState } from "react";
import { addGeoConfig, updateGeoConfig } from "./GeoServices";
import { getEmployees } from "@/KHRModules/EmployeModules/Employee/EmployeeServices";

const employeesList = [
  { id: 16674, name: "John Doe", role: "Developer" },
  { id: 16675, name: "Jane Smith", role: "UI/UX Designer" },
];

interface Props {
  data: any | null; // null for add, object for edit
  onSuccess: () => void; // refresh parent table
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
  const { validateAttendancePolicy } = useFormValidation();
  const [employeesList, setEmployeeList] = useState<Option[]>();
  const user_id = Number(localStorage.getItem("user_id") || 0);

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

  useEffect(() => {
    if (data) {
      // Prefill for edit
      setFormData({
        name: data.name || "",
        latitude: data.latitude || "",
        longitude: data.longitude || "",
        radius_km: data.radius_km || "",
        employees_selection: data.employees_selection || [],
      });
    } else {
      // Reset for add
      setFormData({
        name: "",
        latitude: "",
        longitude: "",
        radius_km: "",
        employees_selection: [],
      });
      setErrors({});
      setIsSubmitted(false);
    }
  }, [data]);

  const handleSubmit = async () => {
    setIsSubmitted(true);
    console.log("handle SUbnmit Called ");

    const validationErrors = validateAttendancePolicy(formData);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      console.log("handle SUbnmit Validate", validationErrors);
      return;
    }

    // Payload
    const payload: any = {
      name: formData.name,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      radius_km: Number(formData.radius_km),
      hr_employee_ids: formData.employees_selection.map((e: any) => e.id),
    };
    console.log("Payload", payload);

    try {
      if (data && data.id) {
        await updateGeoConfig(data.id, payload);
        console.log("UpdateGEO CONFIGUR", payload);
      } else {
        await addGeoConfig(payload);
        console.log("add GEO COnfigur", payload);
      }
      const modalElement = document.getElementById("add_geo_config");
      if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      }

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error saving geo config:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      latitude: "",
      longitude: "",
      radius_km: "",
      employees_selection: [],
    });
    setErrors({});
    setIsSubmitted(false);
    onClose && onClose();
  };

  return (
    <CommonModal
      id="add_geo_config"
      title={data ? "Edit Geo Configuration" : "Add Geo Configuration"}
      onSubmit={handleSubmit}
      onClose={handleClose}
    >
      <FormInput
        label="Name"
        name="name"
        value={formData.name}
        error={errors.name}
        isSubmitted={isSubmitted}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />

      <div className="row">
        <div className="col-md-4">
          <FormInput
            label="Latitude"
            type="number"
            name="latitude"
            value={formData.latitude}
            error={errors.latitude}
            isSubmitted={isSubmitted}
            onChange={(e) =>
              setFormData({ ...formData, latitude: e.target.value })
            }
          />
        </div>
        <div className="col-md-4">
          <FormInput
            label="Longitude"
            type="number"
            name="longitude"
            value={formData.longitude}
            error={errors.longitude}
            isSubmitted={isSubmitted}
            onChange={(e) =>
              setFormData({ ...formData, longitude: e.target.value })
            }
          />
        </div>
        <div className="col-md-4">
          <FormInput
            label="Radius (Km)"
            type="number"
            name="radius_km"
            value={formData.radius_km}
            error={errors.radius_km}
            isSubmitted={isSubmitted}
            onChange={(e) =>
              setFormData({ ...formData, radius_km: e.target.value })
            }
          />
        </div>
      </div>

      {/* <MultiSelect
label="Employees"
value={formData.employees_selection.map((e: any) => e.id)}
options={employeesList || []}
isSubmitted={isSubmitted}
error={errors.employees_selection}
onChange={(ids) =>
setFormData({
...formData,
employees_selection: employeesList.filter((e) =>
ids.includes(e.id)
),
})
}
/> */}
      <MultiSelect
        label="Employees"
        value={formData.employees_selection.map((e: { id: any }) => e.id)}
        options={employeesList || []} // always defined as array
        // isSubmitted={false}
        // error={""}
        onChange={(selectedIds: number[]) =>
          setFormData({
            ...formData,
            employees_selection: employeesList?.filter((e) =>
              selectedIds.includes(e.id)
            ),
          })
        }
      />
    </CommonModal>
  );
};

export default AddEditGeoModal;
