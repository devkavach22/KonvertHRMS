import React, { useState } from "react";
import {
  Step1BasicInformation,
  Step2LegalIdentification,
  Step3PersonalInformation,
  Step4AddressContact,
  Step5EmploymentDetails,
  Step6SalaryStructure,
  Step7NoticePeriodUniform,
  Step8Settings,
  Step9LWFDeductions,
} from "./FormSteps";

interface FormData {
  firstName: string;
  lastName: string;
  fatherName: string;
  clientName: string;
  workEmail: string;
  primaryMobile: string;
  aadhaar: string;
  pan: string;
  voterId?: string;
  passportNo?: string;
  drivingLicense?: File | null;
  uan?: string;
  esi?: string;
  category?: string;
  dob: string;
  gender: string;
  country: string;
  presentAddress: string;
  pinCode: string;
  department: string;
  designation: string;
  siteName?: string;
  unitBranch?: string;
  attendancePolicy?: string;
  employeeCategory?: string;
  workingHours?: number;
  shiftRoster?: string;
  nextShiftChange?: string;
  timezone?: string;
  employeeCode?: string;
  cdEmpNo?: string;
  bloodGroup: string;
  maritalStatus: string;
  religion: string;
  secondaryMobile?: string;
  officialEmail?: string;
  personalEmail?: string;
  passbook?: File | string;
  permanentAddress: string;
  district: string;
  stateEmp: string;
  countryEmp: string;
  emergencyContactName: string;
  relationWithEmployee: string;
  emergencyMobile: string;
  contactAddress: string;
  
}

interface MultiStepFormProps {
  onCloseModal?: () => void; // optional prop to close modal after submit
}

export default function MultiStepForm({ onCloseModal }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 9;

  const stepTitles = [
    "Basic Information",
    "Legal Identification",
    "Personal Information",
    "Address and Contact",
    "Employment Details",
    "Salary Structure",
    "Notice Period and Uniform",
    "Settings",
    "LWF Deductions",
  ];

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    fatherName: "",
    clientName: "",
    workEmail: "",
    primaryMobile: "",
    aadhaar: "",
    pan: "",
    dob: "",
    gender: "",
    country: "",
    presentAddress: "",
    pinCode: "",
    department: "",
    designation: "",
    siteName: "",
    unitBranch: "",
    attendancePolicy: "",
    employeeCategory: "",
    bloodGroup: "",
    maritalStatus: "",
    religion: "",
    secondaryMobile: "",
    officialEmail: "",
    personalEmail: "",
    passbook: "",
    permanentAddress: "",
    district: "",
    stateEmp: "",
    countryEmp: "",
    emergencyContactName: "",
    relationWithEmployee: "",
    emergencyMobile: "",
    contactAddress: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files?.[0] || ""
          : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // helper validators
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidName = (name: string) => /^[A-Za-z\s]+$/.test(name);
  const isValidPhone = (phone: string) => /^[0-9]{10}$/.test(phone);

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    const form = document.querySelector(".needs-validation") as HTMLFormElement;
    if (form) {
      form.classList.add("was-validated");
    }

    switch (currentStep) {
      case 1: // Basic Information
        if (!formData.firstName.trim())
          newErrors.firstName = "First Name is required.";
        else if (!isValidName(formData.firstName))
          newErrors.firstName = "Only alphabets allowed.";

        if (!formData.lastName.trim())
          newErrors.lastName = "Last Name is required.";
        else if (!isValidName(formData.lastName))
          newErrors.lastName = "Only alphabets allowed.";

        if (!formData.fatherName.trim())
          newErrors.fatherName = "Father's Name is required.";

        if (!formData.clientName.trim())
          newErrors.clientName = "Client Name is required.";

        if (!formData.siteName?.trim())
          newErrors.siteName = "Site Name is required.";

        if (!formData.workEmail.trim())
          newErrors.workEmail = "Work Email is required.";
        else if (!isValidEmail(formData.workEmail))
          newErrors.workEmail = "Invalid email format.";

        if (!formData.attendancePolicy?.trim())
          newErrors.attendancePolicy = "Attendance Policy is required.";

        if (!formData.unitBranch?.trim())
          newErrors.unitBranch = "Unit/Branch is required.";

        if (!formData.employeeCategory?.trim())
          newErrors.employeeCategory = "Employee Category is required.";

        if (!formData.workingHours?.toString().trim())
          newErrors.workingHours = "Working Hours is required.";

        if (!formData.shiftRoster?.trim())
          newErrors.shiftRoster = "Shift Roster is required.";

        if (!formData.nextShiftChange?.trim())
          newErrors.nextShiftChange = "Next Shift Change is required.";

        if (!formData.timezone?.trim())
          newErrors.timezone = "Timezone is required.";
        break;
      // ligal info
      case 2: // Legal Identification
        if (!formData.aadhaar.trim())
          newErrors.aadhaar = "Aadhaar Number is required.";
        else if (!/^[0-9]{12}$/.test(formData.aadhaar))
          newErrors.aadhaar = "Aadhaar must be 12 digits.";

        if (!formData.pan.trim()) newErrors.pan = "PAN Number is required.";
        else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan))
          newErrors.pan = "Invalid PAN format.";

        if (!formData.voterId?.trim())
          newErrors.voterId = "Voter ID is required.";

        if (!formData.passportNo?.trim())
          newErrors.passportNo = "Passport Number is required.";

        if (!formData.drivingLicense)
          newErrors.drivingLicense = "Driving License is required.";

        if (!formData.uan?.trim()) newErrors.uan = "UAN Number is required.";

        if (!formData.esi?.trim()) newErrors.esi = "ESI Number is required.";

        if (!formData.category?.trim())
          newErrors.category = "Category is required.";
        break;

      case 3: // Personal Information
        if (!formData.employeeCode?.trim())
          newErrors.employeeCode = "Employee Code is required.";

        if (!formData.cdEmpNo?.trim())
          newErrors.cdEmpNo = "CD Emp. No. is required.";

        if (!formData.dob.trim()) newErrors.dob = "Date of Birth is required.";

        if (!formData.gender.trim()) newErrors.gender = "Gender is required.";

        if (!formData.bloodGroup.trim())
          newErrors.bloodGroup = "Blood Group is required.";

        if (!formData.maritalStatus.trim())
          newErrors.maritalStatus = "Marital Status is required.";

        if (!formData.country.trim())
          newErrors.country = "Country is required.";

        if (!formData.religion.trim())
          newErrors.religion = "Religion is required.";

        if (!formData.primaryMobile.trim())
          newErrors.primaryMobile = "Primary Mobile is required.";
        else if (!/^[0-9]{10}$/.test(formData.primaryMobile))
          newErrors.primaryMobile = "Primary Mobile must be 10 digits.";

        if (
          formData.secondaryMobile?.trim() &&
          !/^[0-9]{10}$/.test(formData.secondaryMobile)
        )
          newErrors.secondaryMobile = "Secondary Mobile must be 10 digits.";

        if (!formData.officialEmail?.trim())
          newErrors.officialEmail = "Official Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.officialEmail))
          newErrors.officialEmail = "Official Email is invalid.";

        if (!formData.personalEmail?.trim())
          newErrors.personalEmail = "Personal Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalEmail))
          newErrors.personalEmail = "Personal Email is invalid.";
        break;

      case 4: // Address and Contact
        if (!formData.presentAddress.trim())
          newErrors.presentAddress = "Present Address is required.";

        if (!formData.permanentAddress.trim())
          newErrors.permanentAddress = "Permanent Address is required.";

        if (!formData.pinCode.trim())
          newErrors.pinCode = "PIN Code is required.";

        if (!formData.district.trim())
          newErrors.district = "District is required.";

        if (!formData.stateEmp.trim())
          newErrors.stateEmp = "State is required.";

        if (!formData.countryEmp.trim())
          newErrors.countryEmp = "Country is required.";

        if (!formData.emergencyContactName.trim())
          newErrors.emergencyContactName =
            "Emergency Contact Name is required.";

        if (!formData.relationWithEmployee.trim())
          newErrors.relationWithEmployee =
            "Relation with Employee is required.";

        if (!formData.emergencyMobile.trim())
          newErrors.emergencyMobile = "Emergency Mobile is required.";
        else if (!/^[0-9]{10}$/.test(formData.emergencyMobile))
          newErrors.emergencyMobile = "Emergency Mobile must be 10 digits.";

        if (!formData.contactAddress.trim())
          newErrors.contactAddress = "Contact Address is required.";

        break;

      case 5:
        if (!formData.department.trim())
          newErrors.department = "Department is required.";
        if (!formData.designation.trim())
          newErrors.designation = "Designation is required.";
        break;

      default:
        break;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep())
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    if (validateStep()) {
      console.log("✅ Form submitted successfully:", formData);
      alert("✅ Form submitted successfully!");
      if (onCloseModal) onCloseModal(); 
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "7px 12px",
    border: "1px solid #dee2e6",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
  };

  const labelStyle = {
    fontSize: "13px",
    color: "#495057",
    marginBottom: "6px",
    display: "block",
    fontWeight: "500",
  };

  const stepProps = {
    formData,
    handleInputChange,
    inputStyle,
    labelStyle,
    errors,
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInformation {...stepProps} />;
      case 2:
        return <Step2LegalIdentification {...stepProps} />;
      case 3:
        return <Step3PersonalInformation {...stepProps} />;
      case 4:
        return <Step4AddressContact {...stepProps} />;
      case 5:
        return <Step5EmploymentDetails {...stepProps} />;
      case 6:
        return <Step6SalaryStructure {...stepProps} />;
      case 7:
        return <Step7NoticePeriodUniform {...stepProps} />;
      case 8:
        return <Step8Settings {...stepProps} />;
      case 9:
        return <Step9LWFDeductions {...stepProps} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 30px 10px 30px",
            borderBottom: "1px solid #e9ecef",
            textAlign: "center",
          }}
        >
          <h5
            style={{
              margin: 0,
              fontSize: "18px",
              color: "#212529",
              fontWeight: "600",
            }}
          >
            Kavach Employee Page
          </h5>
          <h6
            style={{
              marginTop: "6px",
              fontSize: "15px",
              color: "#ff6b35",
              fontWeight: "600",
            }}
          >
            {stepTitles[currentStep - 1]}
          </h6>
        </div>

        {/* Step Content */}
        <div
          style={{
            padding: "30px",
            minHeight: "450px",
            maxHeight: "450px",
            overflowY: "scroll",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div
          style={{
            padding: "16px 30px",
            borderTop: "1px solid #e9ecef",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            background: "white",
            position: "sticky",
            bottom: 0,
          }}
        >
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            style={{
              padding: "9px 28px",
              border: "1px solid #dee2e6",
              borderRadius: "6px",
              background: "white",
              color: "#6c757d",
              fontSize: "14px",
              cursor: currentStep === 1 ? "not-allowed" : "pointer",
              opacity: currentStep === 1 ? 0.5 : 1,
              fontWeight: "500",
            }}
          >
            Back
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              style={{
                padding: "9px 28px",
                border: "none",
                borderRadius: "6px",
                background: "#ff6b35",
                color: "white",
                fontSize: "14px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              style={{
                padding: "9px 28px",
                border: "none",
                borderRadius: "6px",
                background: "#ff6b35",
                color: "white",
                fontSize: "14px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
