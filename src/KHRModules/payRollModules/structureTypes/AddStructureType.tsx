import React, { useEffect, useState } from "react";
import CommonModal from "@/KHRModules/commanForm/CommanModal/CommanModal";
import FormInput from "@/KHRModules/commanForm/inputComman/FormInput";
import CommonSelect, { Option } from "@/core/common/commonSelect";
import { useFormValidation } from "@/KHRModules/commanForm/FormValidation";
import { getCountries, getRegularPayStructure, getWorkEntryType, getWorkingHours } from "./StructureTypeService";

interface Props {
  onSubmit: (data: any) => void;
}

/* ================= COMPONENT ================= */

const AddStructureTypeModal: React.FC<Props> = ({ onSubmit }) => {
  const { validateStructureType } = useFormValidation();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [countryOptions, setCountryOptions] = useState<Option[]>([]);
  const [workingHoursOptions, setWorkingHoursOptions] = useState<Option[]>([]);
  const [workEntryTypeOptions, setWorkEntryTypeOptions] = useState<Option[]>([]);
  const [regularPayStructureOptions, setRegularPayStructureOptions] = useState<Option[]>([]);

  const [formData, setFormData] = useState<any>({
    name: "",
    country: "", // stores COUNTRY ID
    default_wage_type: "",
    default_schedule_pay: "",
    default_working_hours: "",
    regular_pay_structure: "",
    default_work_entry_type: "",
  });

  /* ================= FETCH COUNTRIES ================= */

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await getCountries();

        const mapped: Option[] = (response || []).map((item: any) => ({
          label: item.name, // 👈 PRINTED IN UI
          value: item.id,   // 👈 STORED IN FORM
        }));

        setCountryOptions(mapped);
      } catch (error) {
        console.error("Failed to load countries", error);
      }
    };

    fetchCountries();
  }, []);

  

  useEffect(() => {
    const fetchgetWorkingHours = async () => {
      try {
        const response = await getWorkingHours();

        const mapped: Option[] = (response || []).map((item: any) => ({
          label: item.name, // 👈 PRINTED IN UI
          value: item.id,   // 👈 STORED IN FORM
        }));

        setWorkingHoursOptions(mapped);
      } catch (error) {
        console.error("Failed to load working hours", error);
      }
    };

    fetchgetWorkingHours();
  }, []);

  console.log(workingHoursOptions,"working");
  

   useEffect(() => {
    const fetchgetWorkEntryType = async () => {
      try {
        const response = await getWorkEntryType();
        console.log(response,"...81");
        

        const mapped: Option[] = (response || []).map((item: any) => ({
          label: item.name, // 👈 PRINTED IN UI
          value: item.id,   // 👈 STORED IN FORM
        }));

        setWorkEntryTypeOptions(mapped);
      } catch (error) {
        console.error("Failed to load work entry types", error);
      }
    };

    fetchgetWorkEntryType();
  }, []);
  

    useEffect(() => {
    const fetchgetRegularPayStructure = async () => {
      try {
        const response = await getRegularPayStructure();
        console.log(response,"...105");
        

        const mapped: Option[] = (response || []).map((item: any) => ({
          label: item.name, // 👈 PRINTED IN UI
          value: item.id,   // 👈 STORED IN FORM
        }));

        setRegularPayStructureOptions(mapped);
      } catch (error) {
        console.error("Failed to load work entry types", error);
      }
    };

    fetchgetRegularPayStructure();
  }, []);

  

  /* ================= OPTIONS ================= */

  const wageTypeOptions: Option[] = [
    { label: "Fixed Wage", value: "fixed" },
    { label: "Hourly Wage", value: "hourly" },
  ];

  const schedulePayOptions: Option[] = [
    { label: "Monthly", value: "monthly" },
    { label: "Bi-Weekly", value: "bi_weekly" },
    { label: "Weekly", value: "weekly" },
  ];





  /* ================= SUBMIT ================= */

  const handleSubmit = () => {
    setIsSubmitted(true);

    const validationErrors = validateStructureType(formData);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
  };

  /* ================= UI ================= */

  return (
    <CommonModal
      id="add_structure_type"
      title="Add Structure Type"
      onSubmit={handleSubmit}
    >
      {/* ================= BASIC INFO ================= */}
      <h6 className="mb-3">Structure Information</h6>

      <FormInput
        name="name"
        label="Structure Type"
        value={formData.name}
        isSubmitted={isSubmitted}
        error={errors.name}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
      />

      <div className="row">
        <div className="col-md-6">
          <label className="form-label">Country</label>
          <CommonSelect
            options={countryOptions}
            placeholder="Select Country"
            defaultValue={countryOptions.find(
              (o) => o.value === formData.country
            )}
            onChange={(opt) =>
              setFormData({ ...formData, country: opt?.value || "" })
            }
          />
          {isSubmitted && errors.country && (
            <small className="text-danger">{errors.country}</small>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label">Default Wage Type</label>
          <CommonSelect
            options={wageTypeOptions}
            placeholder="Select Wage Type"
            defaultValue={wageTypeOptions.find(
              (o) => o.value === formData.default_wage_type
            )}
            onChange={(opt) =>
              setFormData({
                ...formData,
                default_wage_type: opt?.value || "",
              })
            }
          />
          {isSubmitted && errors.default_wage_type && (
            <small className="text-danger">
              {errors.default_wage_type}
            </small>
          )}
        </div>
      </div>

      {/* ================= PAY RULES ================= */}
      <h6 className="mt-4 mb-3">Pay Rules</h6>

      <div className="row">
        <div className="col-md-6">
          <label className="form-label">Default Scheduled Pay</label>
          <CommonSelect
            options={schedulePayOptions}
            placeholder="Select Scheduled Pay"
            defaultValue={schedulePayOptions.find(
              (o) => o.value === formData.default_schedule_pay
            )}
            onChange={(opt) =>
              setFormData({
                ...formData,
                default_schedule_pay: opt?.value || "",
              })
            }
          />
          {isSubmitted && errors.default_schedule_pay && (
            <small className="text-danger">
              {errors.default_schedule_pay}
            </small>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label">Default Working Hours</label>
          <CommonSelect
            options={workingHoursOptions}
            placeholder="Select Working Hours"
            defaultValue={workingHoursOptions.find(
              (o) => o.value === formData.default_working_hours
            )}
            onChange={(opt) =>
              setFormData({
                ...formData,
                default_working_hours: opt?.value || "",
              })
            }
          />
          {isSubmitted && errors.default_working_hours && (
            <small className="text-danger">
              {errors.default_working_hours}
            </small>
          )}
        </div>
      </div>

      {/* ================= STRUCTURE LINKS ================= */}
      <h6 className="mt-4 mb-3">Structure Links</h6>

      <div className="row">
        <div className="col-md-6">
          <label className="form-label">Regular Pay Structure</label>
          <CommonSelect
            options={regularPayStructureOptions}
            placeholder="Select Regular Pay Structure"
            defaultValue={regularPayStructureOptions.find(
              (o) => o.value === formData.regular_pay_structure
            )}
            onChange={(opt) =>
              setFormData({
                ...formData,
                regular_pay_structure: opt?.value || "",
              })
            }
          />
          {isSubmitted && errors.regular_pay_structure && (
            <small className="text-danger">
              {errors.regular_pay_structure}
            </small>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label">Default Work Entry Type</label>
          <CommonSelect
            options={workEntryTypeOptions}
            placeholder="Select Work Entry Type"
            defaultValue={workEntryTypeOptions.find(
              (o) => o.value === formData.default_work_entry_type
            )}
            onChange={(opt) =>
              setFormData({
                ...formData,
                default_work_entry_type: opt?.value || "",
              })
            }
          />
          {isSubmitted && errors.default_work_entry_type && (
            <small className="text-danger">
              {errors.default_work_entry_type}
            </small>
          )}
        </div>
      </div>
    </CommonModal>
  );
};

export default AddStructureTypeModal;
