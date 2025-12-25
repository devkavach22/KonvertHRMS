import CommonModal from "@/KHRModules/commanForm/CommanModal/CommanModal";
import { useFormValidation } from "@/KHRModules/commanForm/FormValidation";
import FormInput from "@/KHRModules/commanForm/inputComman/FormInput";
import MultiSelect from "@/KHRModules/commanForm/inputComman/MultiSelect";
import React, { useEffect, useState } from "react";

const employeesList = [
  { id: 1, name: "John Doe", role: "Developer" },
  { id: 2, name: "Jane Smith", role: "UI/UX Designer" },
];




const AddEditAttendancePolicyModal = ({ onSubmit }: any) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: "",
    latitude: "",
    longitude: "",
    radius_km: "",
    employees_selection: [],
  });


  console.log(formData,"formDaaatttaa");
  
  const [errors, setErrors] = useState<any>({});
  const { validateAttendancePolicy } = useFormValidation();

  const handleSubmit = () => {
    setIsSubmitted(true);
    const validationErrors = validateAttendancePolicy(formData);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    // ✅ API CALL IS OUTSIDE
    onSubmit(formData);

    


    
  };

  useEffect(() => {
    setIsSubmitted(false);
    setErrors({});
  }, []);


  return (
    <CommonModal
      id="add_attendance_policy"
      title="Add Attendance Policy"
      onSubmit={handleSubmit}
    >
      <FormInput
        label="Name"
        name="name"
        value={formData.name}
        error={errors.name}
        isSubmitted={isSubmitted}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
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

      {errors.location && (
        <div className="text-danger mb-2">{errors.location}</div>
      )}

      <MultiSelect
        label="Employees"
        value={formData.employees_selection.map((e: any) => e.id)}
        options={employeesList}
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
      />
    </CommonModal>
  );
};

export default AddEditAttendancePolicyModal;
