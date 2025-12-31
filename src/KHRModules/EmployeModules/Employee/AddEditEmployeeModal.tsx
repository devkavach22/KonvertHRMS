import React, { useEffect, useState } from "react";
import { DatePicker, Radio, Checkbox } from "antd";
import dayjs from "dayjs";
import CommonSelect from "../../../core/common/commonSelect";
import { toast } from "react-toastify";
import {
  addEmployee,
  getAttendancePolicies,
  getBanks,
  getBranches,
  getBusinessLocations,
  getBusinessTypes,
  getCountries,
  getDepartments,
  getDesignations,
  getDistricts,
  getReportingManagers,
  getShiftRosters,
  getStates,
  getTimezones,
  getWorkingSchedules,
  getWorkLocations,
  updateEmployee,
} from "./EmployeeServices";
import CommonAlertCard from "@/CommonComponent/AlertKHR/CommonAlertCard";
import { AddEditBankAccountModal } from "./AddEditBankAccountModal";

interface Props {
  onSuccess: () => void;
  data: any | null;
}

const AddEditEmployeeModal: React.FC<Props> = ({ onSuccess, data }) => {
  const [activeTab, setActiveTab] = useState("legal");
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imgPreview, setImgPreview] = useState<string | null>(null);

  const [attendancePolicies, setAttendancePolicies] = useState<
    { value: string; label: string }[]
  >([]);
  const [workingSchedules, setWorkingSchedules] = useState<
    { value: string; label: string }[]
  >([]);
  interface Option {
    value: string;
    label: string;
  }
  const [timezones, setTimezones] = useState<Option[]>([]);
  const [shiftRosters, setShiftRosters] = useState<Option[]>([]);
  const [countries, setCountries] = useState<Option[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [states, setStates] = useState<Option[]>([]);
  const [districts, setDistricts] = useState<Option[]>([]);
  const [businessTypes, setBusinessTypes] = useState<Option[]>([]);
  const [businessLocations, setBusinessLocations] = useState<Option[]>([]);
  const [departments, setDepartments] = useState<Option[]>([]);
  const [designations, setDesignations] = useState<Option[]>([]);
  const [workLocations, setWorkLocations] = useState<Option[]>([]);
  const [managers, setManagers] = useState<Option[]>([]);
  const [banks, setBanks] = useState<Option[]>([]);
  const [branches, setBranches] = useState<Option[]>([]);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  // Form State matching API Schema
  // Complete Form State matching all Tab fields and API Schema
  const [formData, setFormData] = useState<any>({
    // 1. Header Section
    name: "",
    father_name: "",
    name_of_client: "", // Branch
    attendance_policy_id: "",
    employee_category: "Staff",
    resource_calendar_id: "",
    shift_roster_id: "",
    next_shift_change: "",
    timezone: "Asia/Kolkata",
    is_geo_tracking: false,
    image_1920: null as File | null,

    // 2. Legal / Identification
    aadhaar_number: "",
    pan_number: "",
    voter_id: "",
    passport_no: "",
    driving_license: null as File | null,
    is_uan_number_applicable: false,
    uan_number: "",
    esi_number: "",
    category: "",

    // 3. Personal Information
    cd_employee_num: "",
    gender: "male",
    marital: "single",
    spouse_name: "",
    date_of_marriage: null,
    birthday: null,
    blood_group: "",
    name_of_post_graduation: "",
    name_of_any_other_education: "",
    total_experiance: "",
    country_id: "",
    religion: "",
    work_phone: "",
    mobile_phone: "",
    private_email: "",
    upload_passbook: null as File | null,

    // 4. Address Details
    present_address: "",
    permanent_address: "",
    pin_code: "",
    district_id: "",
    state_id: "",

    // 5. Emergency Contact
    emergency_contact_name: "",
    emergency_contact_relation: "",
    emergency_contact_mobile: "",
    emergency_contact_address: "",

    // 6. Employment Information
    department_id: "",
    job_id: "",
    employment_type: "Permanent",
    employee_password: "",
    grade_band: "",
    joining_date: null,
    group_company_joining_date: null,
    probation_period: 0,
    probation_end_date: null,
    in_probation: false,
    confirmation_date: null,
    week_off: "",
    status: "active",
    hold_status: false,
    hold_remarks: "",
    reporting_manager_id: "",
    head_of_department_id: "",
    attendance_capture_mode: "MobileAPP",

    // 7. Banking Information
    bank_account_id: "",

    // 8. Notice Period
    type_of_sepration: "",
    resignation_date: null,
    notice_period_days: 0,
    in_notice_period: false,
    notice_period_end_date: null,

    device_id: "",
    device_name: "",
    device_platform: "",
    device_unique_id: "",
    ip_address: "",
    random_code_for_reg: "",
    system_version: "",
    // 9. Setting
    pin: "",
  });

  const initialFormData = {
    name: "",
    father_name: "",
    name_of_client: "",
    attendance_policy_id: "",
    employee_category: "staff",
    resource_calendar_id: "",
    shift_roster_id: "",
    timezone: "Asia/Kolkata",
    is_geo_tracking: false,
    image_1920: null,
    aadhaar_number: "",
    pan_number: "",
    voter_id: "",
    passport_no: "",
    driving_license: null,
    is_uan_number_applicable: false,
    uan_number: "",
    esi_number: "",
    category: "general",
    cd_employee_num: "",
    gender: "male",
    marital: "single",
    spouse_name: "",
    date_of_marriage: null,
    birthday: null,
    blood_group: "",
    name_of_post_graduation: "",
    name_of_any_other_education: "",
    total_experiance: "",
    country_id: "",
    religion: "",
    work_phone: "",
    mobile_phone: "",
    private_email: "",
    upload_passbook: null,
    present_address: "",
    permanent_address: "",
    pin_code: "",
    district_id: "",
    state_id: "",
    emergency_contact_name: "",
    emergency_contact_relation: "",
    emergency_contact_mobile: "",
    emergency_contact_address: "",
    bank_account_id: "",
    department_id: "",
    job_id: "",
    employment_type: "permanent",
    employee_password: "",
    status: "active",
    pin: "",
  };

  const resetForm = () => {
    setFormData(initialFormData); // Resets all input values
    setImgPreview(null); // Clears the photo preview
    setErrors({}); // Clears validation error messages
    setIsSubmitted(false); // Resets our custom submission flag
    setValidated(false); // Removes Bootstrap's 'was-validated' green/red styles
    setActiveTab("legal"); // Always open back to the first tab
    setShowErrorAlert(false); // Hides the red Alert UI card
  };
  useEffect(() => {
    if (data) {
      // 1. Helper to handle API's [id, "name"] or false/null values
      const getVal = (field: any) => {
        if (Array.isArray(field)) return String(field[0]); // Extract ID from [123, "Name"]
        if (field === false || field === null) return ""; // Convert 'false' to empty string
        return String(field);
      };

      // 2. Set the Form Data
      setFormData({
        ...initialFormData, // Start with defaults to ensure all keys exist
        ...data, // Spread API data

        // Explicitly map/format dropdown fields
        attendance_policy_id: getVal(data.attendance_policy_id),
        name_of_client: getVal(data.name_of_site), // API uses name_of_site, form uses name_of_client
        resource_calendar_id: getVal(data.resource_calendar_id),
        shift_roster_id: getVal(data.shift_roster_id),
        country_id: getVal(data.country_id),
        state_id: getVal(data.state_id),
        district_id: getVal(data.district_id),
        department_id: getVal(data.department_id),
        job_id: getVal(data.job_id),
        bank_account_id: getVal(data.bank_account_id),
        reporting_manager_id: getVal(data.reporting_manager_id),
        head_of_department_id: getVal(data.head_of_department_id),

        // Handle numeric fields that come as 0 or false
        pin_code: data.pin_code === 0 ? "" : data.pin_code,

        // Handle Base64 strings (Keep them as strings in state for now)
        // We don't convert them to File objects here, just store the Base64
        image_1920: data.image_1920 || null,
        driving_license: data.driving_license || null,
        upload_passbook: data.upload_passbook || null,
      });

      // 3. Set Visual Previews for Base64 data
      // API returns raw base64, so we add the Data URI prefix
      if (data.image_1920) {
        setImgPreview(`data:image/png;base64,${data.image_1920}`);
      }
    }
  }, [data]);

  useEffect(() => {
    const modalElement = document.getElementById("add_employee_modal");

    // This function runs every time the modal finishes hiding
    const handleModalHidden = () => {
      resetForm();
    };

    modalElement?.addEventListener("hidden.bs.modal", handleModalHidden);

    // Cleanup the listener when the component unmounts
    return () => {
      modalElement?.removeEventListener("hidden.bs.modal", handleModalHidden);
    };
  }, []);

  const calculateNoticeEndDate = (days: number, resDate: any) => {
    if (resDate && days > 0) {
      const endDate = dayjs(resDate).add(days, "day").format("YYYY-MM-DD");
      setFormData((prev: any) => ({
        ...prev,
        notice_period_end_date: endDate,
        in_notice_period: true,
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        notice_period_end_date: null,
        in_notice_period: false,
      }));
    }
  };

  const validateHeader = () => {
    let tempErrors: any = {};
    let isValid = true;

    // Mandatory fields as per your requirement
    if (!formData.name?.trim()) {
      tempErrors.name = "Employee Name is required.";
      isValid = false;
    }
    if (!formData.father_name?.trim()) {
      tempErrors.father_name = "Father's Name is required.";
      isValid = false;
    }
    if (!formData.name_of_client) {
      tempErrors.name_of_client = "Operational Branch selection is required.";
      isValid = false;
    }

    setErrors((prev: any) => ({ ...prev, ...tempErrors }));
    return isValid;
  };

  const validateLegalTab = () => {
    let tempErrors: any = {};
    let isValid = true;

    // 1. Aadhaar - Mandatory (12 Digits)
    if (!formData.aadhaar_number || formData.aadhaar_number.length !== 12) {
      tempErrors.aadhaar_number =
        "A valid 12-digit Aadhaar number is required.";
      isValid = false;
    }

    // 2. Category - Mandatory
    if (!formData.category) {
      tempErrors.category = "Employee category selection is required.";
      isValid = false;
    }

    // 3. Driving License - Mandatory (File)
    if (!formData.driving_license) {
      tempErrors.driving_license = "Driving License document is required.";
      isValid = false;
    }

    // 4. UAN Dependency (Conditional Mandatory)
    if (formData.is_uan_number_applicable) {
      if (!formData.uan_number || formData.uan_number.length !== 12) {
        tempErrors.uan_number =
          "12-digit UAN number is required when applicable.";
        isValid = false;
      }
    }

    setErrors((prev: any) => ({ ...prev, ...tempErrors }));
    return isValid;
  };

  const validatePersonalTab = () => {
    let tempErrors: any = {};
    let isValid = true;

    // Mandatory: Gender
    if (!formData.gender) {
      tempErrors.gender = "Please select a gender.";
      isValid = false;
    }

    // Mandatory: Marital Status
    if (!formData.marital) {
      tempErrors.marital = "Marital status is required.";
      isValid = false;
    }

    // Mandatory: Date of Birth
    if (!formData.birthday) {
      tempErrors.birthday = "Date of birth is required.";
      isValid = false;
    }

    // Mandatory: Blood Group
    if (!formData.blood_group) {
      tempErrors.blood_group = "Blood group is required.";
      isValid = false;
    }

    // Mandatory: Primary Mobile (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!formData.work_phone || !mobileRegex.test(formData.work_phone)) {
      tempErrors.work_phone = "Valid 10-digit mobile number is required.";
      isValid = false;
    }

    // Mandatory: Personal Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.private_email || !emailRegex.test(formData.private_email)) {
      tempErrors.private_email = "Valid personal email is required.";
      isValid = false;
    }

    // Conditional Mandatory: Spouse details if Married
    if (formData.marital === "married") {
      if (!formData.spouse_name?.trim()) {
        tempErrors.spouse_name = "Spouse name is required for married status.";
        isValid = false;
      }
      if (!formData.date_of_marriage) {
        tempErrors.date_of_marriage = "Marriage date is required.";
        isValid = false;
      }
    }

    setErrors((prev: any) => ({ ...prev, ...tempErrors }));
    return isValid;
  };
  const validateAddressTab = () => {
    let tempErrors: any = {};
    let isValid = true;

    // Only these two are mandatory as per your latest list
    if (!formData.present_address?.trim()) {
      tempErrors.present_address = "Present Address is required.";
      isValid = false;
    }

    if (!formData.permanent_address?.trim()) {
      tempErrors.permanent_address = "Permanent Address is required.";
      isValid = false;
    }

    setErrors((prev: any) => ({ ...prev, ...tempErrors }));
    return isValid;
  };
  const validateEmergencyTab = () => {
    let tempErrors: any = {};
    let isValid = true;

    // 1. Mandatory Name
    if (!formData.emergency_contact_name?.trim()) {
      tempErrors.emergency_contact_name = "Emergency Contact Name is required.";
      isValid = false;
    }

    // 2. Mandatory Relation
    if (!formData.emergency_contact_relation?.trim()) {
      tempErrors.emergency_contact_relation =
        "Relation with Employee is required.";
      isValid = false;
    }

    // 3. Mandatory Mobile Number (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (
      !formData.emergency_contact_mobile ||
      !mobileRegex.test(formData.emergency_contact_mobile)
    ) {
      tempErrors.emergency_contact_mobile =
        "A valid 10-digit mobile number is required.";
      isValid = false;
    }

    setErrors((prev: any) => ({ ...prev, ...tempErrors }));
    return isValid;
  };

  const validateEmploymentTab = () => {
    let tempErrors: any = {};
    let isValid = true;

    const requiredFields = [
      { key: "department_id", label: "Department" },
      { key: "job_id", label: "Designation" },
      { key: "joining_date", label: "Joining Date" },
      { key: "employee_password", label: "Login Password" },
      { key: "status", label: "Status" },
    ];

    requiredFields.forEach((field) => {
      if (!formData[field.key]) {
        tempErrors[field.key] = `${field.label} is required.`;
        isValid = false;
      }
    });

    // Hold logic
    if (formData.hold_status && !formData.hold_remarks?.trim()) {
      tempErrors.hold_remarks =
        "Please provide a reason for placing the employee on hold.";
      isValid = false;
    }

    setErrors((prev: any) => ({ ...prev, ...tempErrors }));
    return isValid;
  };

  const validateBankingTab = () => {
    let tempErrors: any = {};
    let isValid = true;

    // Mandatory check: Bank Account
    if (!formData.bank_account_id) {
      tempErrors.bank_account_id =
        "Please select a bank account for payroll processing.";
      isValid = false;
    }

    setErrors((prev: any) => ({ ...prev, ...tempErrors }));
    return isValid;
  };

  const validateDeviceTab = () => {
    let tempErrors: any = {};
    let isValid = true;

    // You can make these mandatory or optional.
    // Example: Mandatory Device Unique ID
    if (!formData.device_unique_id?.trim()) {
      tempErrors.device_unique_id = "Device Unique ID is required.";
      isValid = false;
    }

    setErrors((prev: any) => ({ ...prev, ...tempErrors }));
    return isValid;
  };

  const validateNoticeTab = () => {
    let tempErrors: any = {};
    let isValid = true;

    // Logic: If one separation field is filled, others become mandatory
    if (
      formData.type_of_sepration ||
      formData.resignation_date ||
      formData.notice_period_days > 0
    ) {
      if (!formData.type_of_sepration) {
        tempErrors.type_of_sepration = "Separation type is required.";
        isValid = false;
      }
      if (!formData.resignation_date) {
        tempErrors.resignation_date = "Resignation date is required.";
        isValid = false;
      }
      if (!formData.notice_period_days || formData.notice_period_days <= 0) {
        tempErrors.notice_period_days = "Please enter valid notice days.";
        isValid = false;
      }
    }

    setErrors((prev: any) => ({ ...prev, ...tempErrors }));
    return isValid;
  };
  const validateSettingsTab = () => {
    let tempErrors: any = {};
    let isValid = true;

    // PIN Code - Mandatory (4-6 Digits)
    if (!formData.pin) {
      tempErrors.pin = "Employee Access PIN is required.";
      isValid = false;
    } else if (formData.pin.length < 4) {
      tempErrors.pin = "PIN must be at least 4 digits.";
      isValid = false;
    }

    setErrors((prev: any) => ({ ...prev, ...tempErrors }));
    return isValid;
  };

  // 1. Image Preview Logic
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Save the actual file to state for API processing
      setFormData((prev: any) => ({ ...prev, image_1920: file }));

      // Update the visual preview for the UI
      const reader = new FileReader();
      reader.onloadend = () => setImgPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 2. Probation End Date Calculation (Auto-calculation)
  const calculateProbationEnd = (months: number) => {
    if (formData.joining_date && months > 0) {
      const endDate = dayjs(formData.joining_date).add(months, "month");
      setFormData((prev: any) => ({ ...prev, probation_end_date: endDate }));
    }
  };

  const handleProbationChange = (months: number) => {
    const joiningDate = formData.joining_date;
    if (joiningDate && months > 0) {
      const endDate = dayjs(joiningDate)
        .add(months, "month")
        .format("YYYY-MM-DD");
      setFormData({
        ...formData,
        probation_period: months,
        probation_end_date: endDate,
      });
    } else {
      setFormData({ ...formData, probation_period: months });
    }
  };

  useEffect(() => {
    const fetchBranchData = async () => {
      const data = await getBranches();
      // Map API data to { value, label } format
      setBranches(
        data.map((b: any) => ({
          value: b.id.toString(),
          label: b.name,
        }))
      );
    };
    fetchBranchData();
  }, []);
  useEffect(() => {
    const fetchDropdownData = async () => {
      const [policies, schedules] = await Promise.all([
        getAttendancePolicies(),
        getWorkingSchedules(),
      ]);

      setAttendancePolicies(
        policies.map((p: any) => ({ value: p.id, label: p.name }))
      );
      setWorkingSchedules(
        schedules.map((s: any) => ({ value: s.id, label: s.name }))
      );
    };
    fetchDropdownData();
  }, []);

  useEffect(() => {
    const fetchAddressData = async () => {
      const [stateData, districtData] = await Promise.all([
        getStates(),
        getDistricts(),
      ]);
      setStates(
        stateData.map((s: any) => ({ value: s.id.toString(), label: s.name }))
      );
      setDistricts(
        districtData.map((d: any) => ({
          value: d.id.toString(),
          label: d.name,
        }))
      );
    };
    fetchAddressData();
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      const data = await getCountries();
      setCountries(
        data.map((c: any) => ({ value: c.id.toString(), label: c.name }))
      );
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const loadBankingData = async () => {
      const bankList = await getBanks();

      // Transform API response to { value, label }
      const formattedBanks = bankList.map((b: any) => ({
        value: String(b.id),
        // Combines Account Number and Bank Name for a unique label
        label: `${b.acc_number} - ${
          Array.isArray(b.bank_id) ? b.bank_id[1] : "Unknown Bank"
        }`,
      }));

      setBanks(formattedBanks);
    };

    loadBankingData();
  }, []);

  useEffect(() => {
    const fetchEmploymentData = async () => {
      try {
        const [bTypes, bLocs, depts, jobs, wLocs, empList] = await Promise.all([
          getBusinessTypes(), // /employee/business-types
          getBusinessLocations(), // /employee/business-locations
          getDepartments(), // /api/department
          getDesignations(), // /api/job/list
          getWorkLocations(), // /api/work-location
          getReportingManagers(), // /employee/employees
        ]);

        setBusinessTypes(
          bTypes.map((i: any) => ({ value: i.id.toString(), label: i.name }))
        );
        setBusinessLocations(
          bLocs.map((i: any) => ({ value: i.id.toString(), label: i.name }))
        );
        setDepartments(
          depts.map((i: any) => ({ value: i.id.toString(), label: i.name }))
        );
        setDesignations(
          jobs.map((i: any) => ({
            value: String(i.job_id || i.id),
            label: i.name,
          }))
        );
        setWorkLocations(
          wLocs.map((i: any) => ({ value: i.id.toString(), label: i.name }))
        );

        const managerOptions = empList.map((i: any) => ({
          value: i.id.toString(),
          label: i.name,
        }));
        setManagers(managerOptions);
      } catch (error) {
        console.error("Error loading employment dependencies:", error);
      }
    };

    if (activeTab === "employment") fetchEmploymentData();
  }, [activeTab]);

  useEffect(() => {
    const loadTimezones = async () => {
      const data = await getTimezones();
      setTimezones(data); // Directly setting the array of {value, label}
    };
    loadTimezones();
  }, []);

  useEffect(() => {
    const loadRosters = async () => {
      const data = await getShiftRosters();
      // Map the API response to the { value, label } format required by CommonSelect
      const formattedRosters = data.map((item: any) => ({
        value: item.id.toString(), // Ensure value is a string as per your Option type
        label: item.name,
      }));
      setShiftRosters(formattedRosters);
    };
    loadRosters();
  }, []);

  useEffect(() => {
    if (data) {
      setFormData(data);
      if (data.image) setImgPreview(data.image);
    }
  }, [data]);

  // Inside AddEditEmployeeModal.tsx

  // Helper to convert File objects to Base64 strings for the API
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(",")[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setIsSubmitted(true);
  //   console.log(">>> HandleSubmit Triggered"); // LOG 1
  //   // Validate all tabs before submission
  //   const isLegalValid = validateLegalTab();
  //   const isPersonalValid = validatePersonalTab();
  //   const isAddressValid = validateAddressTab();
  //   const isEmploymentValid = validateEmploymentTab();
  //   const isEmergencyValid = validateEmergencyTab();
  //   const isBankingValid = validateBankingTab();
  //   const isNoticeValid = validateNoticeTab();
  //   const isSettingsValid = validateSettingsTab();

  //   console.log("Validation Results:", {
  //     Legal: isLegalValid,
  //     Personal: isPersonalValid,
  //     Address: isAddressValid,
  //     Employment: isEmploymentValid,
  //     Emergency: isEmergencyValid,
  //     Banking: isBankingValid,
  //     Notice: isNoticeValid,
  //     Settings: isSettingsValid,
  //   }); // LOG 2

  //   if (
  //     !isLegalValid ||
  //     !isPersonalValid ||
  //     !isAddressValid ||
  //     !isEmploymentValid ||
  //     !isEmergencyValid ||
  //     !isBankingValid ||
  //     !isNoticeValid ||
  //     !isSettingsValid
  //   ) {
  //     console.error(
  //       ">>> Submission blocked by validation errors in one of the tabs."
  //     );
  //     toast.error("Please correct the errors in the respective tabs.");
  //     return;
  //   }
  //   console.log(">>> All validations passed. Preparing payload..."); // LOG 3
  //   setIsSubmitting(true);
  //   try {
  //     // 1. Handle File Conversions
  //     let licenseBase64 = null;
  //     let passbookBase64 = null;
  //     let imageBase64 = null;

  //     if (formData.driving_license instanceof File) {
  //       licenseBase64 = await fileToBase64(formData.driving_license);
  //     }
  //     if (formData.upload_passbook instanceof File) {
  //       passbookBase64 = await fileToBase64(formData.upload_passbook);
  //     }
  //     if (formData.image_1920 instanceof File) {
  //       imageBase64 = await fileToBase64(formData.image_1920);
  //     }

  //     // 2. Construct the Final Payload exactly as requested
  //     const finalPayload = {
  //       name: formData.name,
  //       father_name: formData.father_name,
  //       gender: formData.gender,
  //       birthday: formData.birthday
  //         ? dayjs(formData.birthday).format("YYYY-MM-DD")
  //         : null,
  //       blood_group: formData.blood_group,
  //       work_phone: Number(formData.work_phone), // Payload expects number
  //       private_email: formData.private_email,
  //       present_address: formData.present_address,
  //       permanent_address: formData.permanent_address,
  //       emergency_contact_name: formData.emergency_contact_name,
  //       emergency_contact_relation: formData.emergency_contact_relation,
  //       emergency_contact_mobile: formData.emergency_contact_mobile,
  //       emergency_contact_address: formData.emergency_contact_address,
  //       mobile_phone: formData.mobile_phone,
  //       pin_code: formData.pin_code,
  //       attendance_policy_id: Number(formData.attendance_policy_id),
  //       employee_category: formData.employee_category.toLowerCase(),
  //       shift_roster_id: Number(formData.shift_roster_id),
  //       resource_calendar_id: Number(formData.resource_calendar_id),
  //       district_id: Number(formData.district_id),
  //       state_id: Number(formData.state_id),
  //       job_id: Number(formData.job_id),
  //       department_id: Number(formData.department_id),
  //       country_id: Number(formData.country_id),
  //       is_geo_tracking: formData.is_geo_tracking,
  //       aadhaar_number: formData.aadhaar_number,
  //       pan_number: formData.pan_number,
  //       voter_id: formData.voter_id,
  //       passport_id: formData.passport_no, // Mapping passport_no to passport_id
  //       esi_number: formData.esi_number,
  //       category: formData.category,
  //       is_uan_number_applicable: formData.is_uan_number_applicable,
  //       uan_number: formData.uan_number,
  //       cd_employee_num: formData.cd_employee_num,
  //       name_of_post_graduation: formData.name_of_post_graduation,
  //       name_of_any_other_education: formData.name_of_any_other_education,
  //       total_experiance: formData.total_experiance,
  //       religion: formData.religion,
  //       date_of_marriage: formData.date_of_marriage
  //         ? dayjs(formData.date_of_marriage).format("YYYY-MM-DD")
  //         : null,
  //       probation_period: Number(formData.probation_period),
  //       confirmation_date: formData.confirmation_date
  //         ? dayjs(formData.confirmation_date).format("YYYY-MM-DD")
  //         : null,
  //       hold_remarks: formData.hold_remarks,
  //       is_lapse_allocation: formData.is_lapse_allocation || false,
  //       group_company_joining_date: formData.group_company_joining_date
  //         ? dayjs(formData.group_company_joining_date).format("YYYY-MM-DD")
  //         : null,
  //       week_off: formData.week_off,
  //       grade_band: formData.grade_band,
  //       status: formData.status,
  //       employee_password: formData.employee_password,
  //       hold_status: formData.hold_status,
  //       bank_account_id: Number(formData.bank_account_id),
  //       attendance_capture_mode: formData.attendance_capture_mode.toLowerCase(),
  //       barcode: formData.barcode || "", // Map if available
  //       pin: formData.pin,
  //       type_of_sepration: formData.type_of_sepration,
  //       resignation_date: formData.resignation_date
  //         ? dayjs(formData.resignation_date).format("YYYY-MM-DD")
  //         : null,
  //       notice_period_days: Number(formData.notice_period_days),
  //       joining_date: formData.joining_date
  //         ? dayjs(formData.joining_date).format("YYYY-MM-DD")
  //         : null,
  //       employment_type: formData.employment_type.toLowerCase(),
  //       driving_license: licenseBase64,
  //       upload_passbook: passbookBase64,
  //       image_1920: imageBase64,
  //       name_of_site: Number(formData.name_of_client), // Mapping name_of_client to name_of_site
  //       Spouse_name: formData.spouse_name, // Payload uses Capital 'S'
  //     };
  //     console.log(">>> Final Payload to API:", finalPayload); // LOG 4
  //     let response;
  //     if (data?.id) {
  //       console.log(">>> Calling updateEmployee API...");
  //       response = await updateEmployee(data.id, finalPayload);
  //       toast.success("Employee updated successfully");
  //     } else {
  //       console.log(">>> Calling addEmployee API...");
  //       response = await addEmployee(finalPayload);
  //       toast.success("Employee created successfully");
  //     }

  //     console.log(">>> API Response Success:", response); // LOG 5
  //     toast.success(
  //       data?.id
  //         ? "Employee updated successfully"
  //         : "Employee created successfully"
  //     );
  //     onSuccess(); // Refresh table
  //     document.getElementById("close-emp-modal")?.click(); // Close modal
  //   } catch (err: any) {
  //     console.error(">>> API Error:", err.response?.data || err.message); // LOG 6
  //     const errorMsg =
  //       err.response?.data?.message || "Error processing request";
  //     toast.error(errorMsg);
  //   } finally {
  //     setIsSubmitting(false);
  //     console.log(">>> Submission flow finished.");
  //   }
  // };

  const hasTabErrors = (tabName: string) => {
    if (!isSubmitted) return false;
    const errorKeys = Object.keys(errors);

    const tabFields: { [key: string]: string[] } = {
      legal: ["aadhaar_number", "category", "driving_license", "uan_number"],
      personal: [
        "gender",
        "marital",
        "birthday",
        "blood_group",
        "work_phone",
        "private_email",
        "spouse_name",
      ],
      address: ["present_address", "permanent_address"],
      emergency: [
        "emergency_contact_name",
        "emergency_contact_relation",
        "emergency_contact_mobile",
      ],
      employment: [
        "department_id",
        "job_id",
        "joining_date",
        "employee_password",
        "status",
      ],
      banking: ["bank_account_id"],
      setting: ["pin"],
      device: ["device_id", "device_unique_id", "device_name"],
    };

    return errorKeys.some((key) => tabFields[tabName]?.includes(key));
  };
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setIsSubmitted(true);

  //   const headerErrors = validateHeader();
  //   const legalErrors = validateLegalTab();
  //   const personalErrors = validatePersonalTab();
  //   const addressErrors = validateAddressTab();
  //   const emergencyErrors = validateEmergencyTab();
  //   const bankingErrors = validateBankingTab();
  //   console.log(">>> HandleSubmit Triggered"); // LOG 1

  //   // 1. Run and Log individual validations (keeping these so you can see errors in console)
  //   const isHeaderValid = validateHeader();
  //   const isLegalValid = validateLegalTab();
  //   const isPersonalValid = validatePersonalTab();
  //   const isAddressValid = validateAddressTab();
  //   const isEmploymentValid = validateEmploymentTab();
  //   const isEmergencyValid = validateEmergencyTab();
  //   const isBankingValid = validateBankingTab();
  //   const isNoticeValid = validateNoticeTab();
  //   const isSettingsValid = validateSettingsTab();

  //   console.log("Validation Results (Bypassing...):", {
  //     Legal: isLegalValid,
  //     Personal: isPersonalValid,
  //     Address: isAddressValid,
  //     Employment: isEmploymentValid,
  //     Emergency: isEmergencyValid,
  //     Banking: isBankingValid,
  //     Notice: isNoticeValid,
  //     Settings: isSettingsValid,
  //   }); // LOG 2

  //   if (
  //     !headerErrors ||
  //     !legalErrors ||
  //     !personalErrors ||
  //     !addressErrors ||
  //     !emergencyErrors ||
  //     !bankingErrors
  //   ) {
  //     setShowErrorAlert(true);
  //     toast.error("Required fields are missing");
  //     return;
  //   }
  //   /* --- TEMPORARY BYPASS START ---
  //   // We are commenting this out so the function doesn't STOP here.
  //   if (
  //     !isLegalValid ||
  //     !isPersonalValid ||
  //     !isAddressValid ||
  //     !isEmploymentValid ||
  //     !isEmergencyValid ||
  //     !isBankingValid ||
  //     !isNoticeValid ||
  //     !isSettingsValid
  //   ) {
  //     console.warn(">>> Validation errors detected, but continuing due to bypass.");
  //   }
  //   --- TEMPORARY BYPASS END --- */

  //   console.log(">>> Proceeding to prepare payload..."); // LOG 3
  //   setIsSubmitting(true);

  //   try {
  //     // 1. Handle File Conversions
  //     let licenseBase64 = null;
  //     let passbookBase64 = null;
  //     let imageBase64 = null;

  //     if (formData.driving_license instanceof File) {
  //       licenseBase64 = await fileToBase64(formData.driving_license);
  //     }
  //     if (formData.upload_passbook instanceof File) {
  //       passbookBase64 = await fileToBase64(formData.upload_passbook);
  //     }
  //     if (formData.image_1920 instanceof File) {
  //       imageBase64 = await fileToBase64(formData.image_1920);
  //     }

  //     // 2. Construct the Final Payload exactly as requested
  //     const finalPayload = {
  //       name: formData.name,
  //       father_name: formData.father_name,
  //       gender: formData.gender,
  //       birthday: formData.birthday
  //         ? dayjs(formData.birthday).format("YYYY-MM-DD")
  //         : null,
  //       blood_group: formData.blood_group,
  //       work_phone: Number(formData.work_phone),
  //       private_email: formData.private_email,
  //       present_address: formData.present_address,
  //       permanent_address: formData.permanent_address,
  //       emergency_contact_name: formData.emergency_contact_name,
  //       emergency_contact_relation: formData.emergency_contact_relation,
  //       emergency_contact_mobile: formData.emergency_contact_mobile,
  //       emergency_contact_address: formData.emergency_contact_address,
  //       mobile_phone: formData.mobile_phone,
  //       pin_code: formData.pin_code,
  //       attendance_policy_id: Number(formData.attendance_policy_id),
  //       employee_category: formData.employee_category?.toLowerCase(),
  //       shift_roster_id: Number(formData.shift_roster_id),
  //       resource_calendar_id: Number(formData.resource_calendar_id),
  //       district_id: Number(formData.district_id),
  //       state_id: Number(formData.state_id),
  //       job_id: Number(formData.job_id),
  //       department_id: Number(formData.department_id),
  //       country_id: Number(formData.country_id),
  //       is_geo_tracking: formData.is_geo_tracking,
  //       aadhaar_number: formData.aadhaar_number,
  //       pan_number: formData.pan_number,
  //       voter_id: formData.voter_id,
  //       passport_id: formData.passport_no,
  //       esi_number: formData.esi_number,
  //       category: formData.category,
  //       is_uan_number_applicable: formData.is_uan_number_applicable,
  //       uan_number: formData.uan_number,
  //       cd_employee_num: formData.cd_employee_num,
  //       name_of_post_graduation: formData.name_of_post_graduation,
  //       name_of_any_other_education: formData.name_of_any_other_education,
  //       total_experiance: formData.total_experiance,
  //       religion: formData.religion,
  //       date_of_marriage: formData.date_of_marriage
  //         ? dayjs(formData.date_of_marriage).format("YYYY-MM-DD")
  //         : null,
  //       probation_period: Number(formData.probation_period),
  //       confirmation_date: formData.confirmation_date
  //         ? dayjs(formData.confirmation_date).format("YYYY-MM-DD")
  //         : null,
  //       hold_remarks: formData.hold_remarks,
  //       is_lapse_allocation: formData.is_lapse_allocation || false,
  //       group_company_joining_date: formData.group_company_joining_date
  //         ? dayjs(formData.group_company_joining_date).format("YYYY-MM-DD")
  //         : null,
  //       week_off: formData.week_off,
  //       grade_band: formData.grade_band,
  //       status: formData.status,
  //       employee_password: formData.employee_password,
  //       hold_status: formData.hold_status,
  //       bank_account_id: Number(formData.bank_account_id),
  //       attendance_capture_mode:
  //         formData.attendance_capture_mode?.toLowerCase(),
  //       // barcode: formData.barcode || "",
  //       pin: formData.pin,
  //       type_of_sepration: formData.type_of_sepration,
  //       resignation_date: formData.resignation_date
  //         ? dayjs(formData.resignation_date).format("YYYY-MM-DD")
  //         : null,
  //       notice_period_days: Number(formData.notice_period_days),
  //       joining_date: formData.joining_date
  //         ? dayjs(formData.joining_date).format("YYYY-MM-DD")
  //         : null,
  //       employment_type: formData.employment_type?.toLowerCase(),
  //       driving_license: licenseBase64,
  //       upload_passbook: passbookBase64,
  //       image_1920: imageBase64,
  //       name_of_site: Number(formData.name_of_client),
  //       Spouse_name: formData.spouse_name,
  //     };

  //     console.log(">>> Final Payload to API:", finalPayload); // LOG 4

  //     let response;
  //     if (data?.id) {
  //       console.log(">>> Calling updateEmployee API...");
  //       response = await updateEmployee(data.id, finalPayload);
  //     } else {
  //       console.log(">>> Calling addEmployee API...");
  //       response = await addEmployee(finalPayload);
  //     }

  //     console.log(">>> API Response Success:", response); // LOG 5
  //     toast.success(
  //       data?.id
  //         ? "Employee updated successfully"
  //         : "Employee created successfully"
  //     );

  //     onSuccess(); // Refresh table
  //     document.getElementById("close-emp-modal")?.click(); // Close modal
  //   } catch (err: any) {
  //     console.error(">>> API Error:", err.response?.data || err.message); // LOG 6
  //     const errorMsg =
  //       err.response?.data?.message || "Error processing request";
  //     toast.error(errorMsg);
  //   } finally {
  //     setIsSubmitting(false);
  //     console.log(">>> Submission flow finished.");
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    // 1. Run all validations and store results in an object
    const validations = {
      header: validateHeader(),
      legal: validateLegalTab(),
      personal: validatePersonalTab(),
      address: validateAddressTab(),
      employment: validateEmploymentTab(),
      emergency: validateEmergencyTab(),
      banking: validateBankingTab(),
      notice: validateNoticeTab(),
      settings: validateSettingsTab(),
      device: validateDeviceTab(), // Add this
    };

    // Check if every single tab is valid
    const isFormValid = Object.values(validations).every(
      (isValid) => isValid === true
    );

    console.log("Validation Results:", validations);

    if (!isFormValid) {
      setShowErrorAlert(true);
      toast.error(
        "Required fields are missing. Please check the highlighted tabs."
      );

      // SMOOTH SCROLL: Jump to top of modal to show error alert
      const modalBody = document.querySelector(".modal-body");
      if (modalBody) {
        modalBody.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    // 3. If valid, proceed with submission
    console.log(">>> All validations passed. Preparing payload...");
    setIsSubmitting(true);
    setShowErrorAlert(false); // Hide alert if it was previously shown

    try {
      // Handle File Conversions (OCR/Document logic)
      let licenseBase64 = null;
      let passbookBase64 = null;
      let imageBase64 = null;

      if (formData.driving_license instanceof File) {
        licenseBase64 = await fileToBase64(formData.driving_license);
      }
      if (formData.upload_passbook instanceof File) {
        passbookBase64 = await fileToBase64(formData.upload_passbook);
      }
      if (formData.image_1920 instanceof File) {
        imageBase64 = await fileToBase64(formData.image_1920);
      }

      // 4. Construct Final Payload (Mapping values as per your API requirements)
      const finalPayload = {
        name: formData.name,
        father_name: formData.father_name,
        gender: formData.gender,
        birthday: formData.birthday
          ? dayjs(formData.birthday).format("YYYY-MM-DD")
          : null,
        blood_group: formData.blood_group,
        work_phone: Number(formData.work_phone),
        private_email: formData.private_email,
        present_address: formData.present_address,
        permanent_address: formData.permanent_address,
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_relation: formData.emergency_contact_relation,
        emergency_contact_mobile: formData.emergency_contact_mobile,
        emergency_contact_address: formData.emergency_contact_address,
        mobile_phone: formData.mobile_phone,
        pin_code: formData.pin_code,
        attendance_policy_id: Number(formData.attendance_policy_id),
        employee_category: formData.employee_category?.toLowerCase(),
        shift_roster_id: Number(formData.shift_roster_id),
        resource_calendar_id: Number(formData.resource_calendar_id),
        district_id: Number(formData.district_id),
        state_id: Number(formData.state_id),
        job_id: Number(formData.job_id),
        department_id: Number(formData.department_id),
        country_id: Number(formData.country_id),
        is_geo_tracking: formData.is_geo_tracking,
        aadhaar_number: formData.aadhaar_number,
        pan_number: formData.pan_number,
        voter_id: formData.voter_id,
        passport_id: formData.passport_no,
        esi_number: formData.esi_number,
        category: formData.category,
        is_uan_number_applicable: formData.is_uan_number_applicable,
        uan_number: formData.uan_number,
        cd_employee_num: formData.cd_employee_num,
        name_of_post_graduation: formData.name_of_post_graduation,
        name_of_any_other_education: formData.name_of_any_other_education,
        total_experiance: formData.total_experiance,
        religion: formData.religion,
        date_of_marriage: formData.date_of_marriage
          ? dayjs(formData.date_of_marriage).format("YYYY-MM-DD")
          : null,
        probation_period: Number(formData.probation_period),
        confirmation_date: formData.confirmation_date
          ? dayjs(formData.confirmation_date).format("YYYY-MM-DD")
          : null,
        hold_remarks: formData.hold_remarks,
        is_lapse_allocation: formData.is_lapse_allocation || false,
        group_company_joining_date: formData.group_company_joining_date
          ? dayjs(formData.group_company_joining_date).format("YYYY-MM-DD")
          : null,
        week_off: formData.week_off,
        grade_band: formData.grade_band,
        status: formData.status,
        employee_password: formData.employee_password,
        hold_status: formData.hold_status,
        bank_account_id: Number(formData.bank_account_id),
        attendance_capture_mode:
          formData.attendance_capture_mode?.toLowerCase(),
        pin: formData.pin,
        type_of_sepration: formData.type_of_sepration,
        resignation_date: formData.resignation_date
          ? dayjs(formData.resignation_date).format("YYYY-MM-DD")
          : null,
        notice_period_days: Number(formData.notice_period_days),
        joining_date: formData.joining_date
          ? dayjs(formData.joining_date).format("YYYY-MM-DD")
          : null,
        employment_type: formData.employment_type?.toLowerCase(),
        driving_license: licenseBase64,
        upload_passbook: passbookBase64,
        image_1920: imageBase64, // Update with base64 string
        name_of_site: Number(formData.name_of_client), // Specific API mapping
        Spouse_name: formData.spouse_name, // Capitalized as per your requirements

        device_id: formData.device_id,
        device_name: formData.device_name,
        device_platform: formData.device_platform,
        device_unique_id: formData.device_unique_id,
        ip_address: formData.ip_address,
        random_code_for_reg: formData.random_code_for_reg,
        system_version: formData.system_version,
      };

      let response;
      if (data?.id) {
        response = await updateEmployee(data.id, finalPayload);
      } else {
        response = await addEmployee(finalPayload);
      }

      toast.success(
        data?.id
          ? "Employee updated successfully"
          : "Employee created successfully"
      );
      onSuccess();
      document.getElementById("close-emp-modal")?.click();
    } catch (err: any) {
      console.error(">>> API Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Error processing request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal fade" id="add_employee_modal" role="dialog">
      {showErrorAlert && (
        <div className="mb-4">
          <CommonAlertCard
            alertType="danger"
            iconClass="ti ti-alert-triangle fs-30"
            title="Mandatory Fields Missing"
            message="Please fill in all required fields marked with * in the Header, Legal, Personal, Address, Emergency, and Banking tabs."
            buttons={[
              {
                label: "Review Form",
                className: "btn-danger",
                onClick: () => setShowErrorAlert(false),
              },
            ]}
          />
        </div>
      )}
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content bg-white border-0">
          <div className="modal-header border-0 bg-white pb-0">
            <h4 className="modal-title fw-bold">Employee Master Entry</h4>
            <button
              type="button"
              id="close-emp-modal"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div className="modal-body">
            <form
              className={`needs-validation ${validated ? "was-validated" : ""}`}
              noValidate
              onSubmit={handleSubmit}
            >
              {/* --- TOP SECTION (ALIGNED HEADER) --- */}
              <div className="row g-3 mb-4 bg-light p-3 rounded mx-0 align-items-center border shadow-sm">
                <div className="col-md-10">
                  <div className="row g-3">
                    {/* 1. Name - MANDATORY */}
                    <div className="col-md-4">
                      <label className="form-label fs-13 fw-bold">
                        Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          isSubmitted
                            ? errors.name
                              ? "is-invalid"
                              : formData.name
                              ? "is-valid"
                              : ""
                            : ""
                        }`}
                        placeholder="Enter Name"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: "" });
                        }}
                      />
                      {isSubmitted && errors.name && (
                        <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                          <i className="ti ti-info-circle me-1"></i>
                          {errors.name}
                        </div>
                      )}
                    </div>

                    {/* 2. Father's Name - MANDATORY */}
                    <div className="col-md-4">
                      <label className="form-label fs-13 fw-bold">
                        Father's Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          isSubmitted
                            ? errors.father_name
                              ? "is-invalid"
                              : formData.father_name
                              ? "is-valid"
                              : ""
                            : ""
                        }`}
                        placeholder="Enter Father's Name"
                        value={formData.father_name}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            father_name: e.target.value,
                          });
                          if (errors.father_name)
                            setErrors({ ...errors, father_name: "" });
                        }}
                      />
                      {isSubmitted && errors.father_name && (
                        <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                          <i className="ti ti-info-circle me-1"></i>
                          {errors.father_name}
                        </div>
                      )}
                    </div>

                    {/* 3. Branch - MANDATORY */}
                    <div className="col-md-4">
                      <label className="form-label fs-13 fw-bold">
                        Branch <span className="text-danger">*</span>
                      </label>
                      <div
                        className={
                          isSubmitted
                            ? errors.name_of_client
                              ? "border border-danger rounded shadow-sm"
                              : formData.name_of_client
                              ? "border border-success rounded shadow-sm"
                              : ""
                            : ""
                        }
                      >
                        <CommonSelect
                          options={branches}
                          placeholder="Select Branch"
                          defaultValue={branches.find(
                            (b) => b.value === formData.name_of_client
                          )}
                          onChange={(opt) => {
                            setFormData({
                              ...formData,
                              name_of_client: opt?.value || "",
                            });
                            if (errors.name_of_client)
                              setErrors({ ...errors, name_of_client: "" });
                          }}
                        />
                      </div>
                      {isSubmitted && errors.name_of_client && (
                        <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                          <i className="ti ti-info-circle me-1"></i>
                          {errors.name_of_client}
                        </div>
                      )}
                    </div>

                    {/* 4. Attendance Policy - OPTIONAL */}
                    <div className="col-md-4">
                      <label className="form-label fs-13">
                        Attendance Policy
                      </label>
                      <CommonSelect
                        options={attendancePolicies}
                        placeholder="Select Policy"
                        defaultValue={attendancePolicies.find(
                          (opt) => opt.value === formData.attendance_policy_id
                        )}
                        onChange={(opt) =>
                          setFormData({
                            ...formData,
                            attendance_policy_id: opt?.value || "",
                          })
                        }
                      />
                    </div>

                    {/* 5. Employee Category - OPTIONAL */}
                    <div className="col-md-4">
                      <label className="form-label fs-13">
                        Employee Category
                      </label>
                      <CommonSelect
                        options={[
                          { value: "staff", label: "Staff" },
                          { value: "contract", label: "Contract" },
                          { value: "intern", label: "Intern" },
                        ]}
                        defaultValue={[
                          { value: "staff", label: "Staff" },
                          { value: "contract", label: "Contract" },
                          { value: "intern", label: "Intern" },
                        ].find((o) => o.value === formData.employee_category)}
                        onChange={(opt) =>
                          setFormData({
                            ...formData,
                            employee_category: opt?.value || "",
                          })
                        }
                      />
                    </div>

                    {/* 6. Working Hours - OPTIONAL */}
                    <div className="col-md-4">
                      <label className="form-label fs-13">Working Hours</label>
                      <CommonSelect
                        options={workingSchedules}
                        placeholder="Select Hours"
                        defaultValue={workingSchedules.find(
                          (opt) => opt.value === formData.resource_calendar_id
                        )}
                        onChange={(opt) =>
                          setFormData({
                            ...formData,
                            resource_calendar_id: opt?.value || "",
                          })
                        }
                      />
                    </div>

                    {/* 7. Shift Roster - OPTIONAL */}
                    <div className="col-md-3">
                      <label className="form-label fs-13">Shift Roster</label>
                      <CommonSelect
                        options={shiftRosters}
                        placeholder="Select Roster"
                        defaultValue={shiftRosters.find(
                          (opt) => opt.value === formData.shift_roster_id
                        )}
                        onChange={(opt) =>
                          setFormData({
                            ...formData,
                            shift_roster_id: opt?.value || "",
                          })
                        }
                      />
                    </div>

                    {/* 8. Timezone - OPTIONAL */}
                    <div className="col-md-3">
                      <label className="form-label fs-13">Timezone</label>
                      <CommonSelect
                        options={timezones}
                        placeholder="Select Timezone"
                        defaultValue={timezones.find(
                          (opt) => opt.value === formData.timezone
                        )}
                        onChange={(opt) =>
                          setFormData({
                            ...formData,
                            timezone: opt?.value || "",
                          })
                        }
                      />
                    </div>

                    {/* 9. Geo Tracking - OPTIONAL */}
                    <div className="col-md-3 d-flex align-items-center mt-4">
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="geoCheckHeader"
                          checked={formData.is_geo_tracking}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              is_geo_tracking: e.target.checked,
                            })
                          }
                        />
                        <label
                          className="form-check-label fs-13 fw-bold text-primary ms-2"
                          htmlFor="geoCheckHeader"
                        >
                          Geo Tracking
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PHOTO BOX SECTION */}
                <div className="col-md-2 text-center border-start py-2">
                  <div
                    className="profile-pic-box border border-dashed rounded p-1 mx-auto bg-white shadow-sm"
                    style={{
                      width: "100px",
                      height: "100px",
                      position: "relative",
                    }}
                  >
                    {imgPreview ? (
                      <img
                        src={imgPreview}
                        className="img-fluid rounded w-100 h-100 object-fit-cover"
                        alt="Preview"
                      />
                    ) : (
                      <div className="d-flex flex-column align-items-center justify-content-center h-100">
                        <i className="ti ti-camera fs-32 text-muted"></i>
                        <span className="fs-10 text-muted">Photo</span>
                      </div>
                    )}
                    <label
                      htmlFor="emp_img_header"
                      className="btn btn-primary btn-icon btn-xs rounded-circle position-absolute"
                      style={{
                        bottom: "-10px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "26px",
                        height: "26px",
                        padding: 0,
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <i className="ti ti-upload fs-12"></i>
                    </label>
                    <input
                      type="file"
                      id="emp_img_header"
                      className="d-none"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              </div>

              {/* --- TABS NAVIGATION --- */}
              <div className="employee-tabs-scrollable border-bottom mb-3">
                <ul
                  className="nav nav-tabs flex-nowrap overflow-auto hide-scrollbar"
                  role="tablist"
                >
                  {[
                    "Legal",
                    "Personal",
                    "Address",
                    "Emergency",
                    "Employment",
                    "Banking",
                    "Notice",
                    "Setting",
                    "Device",
                  ].map((tab) => (
                    <li className="nav-item" key={tab}>
                      <button
                        className={`nav-link fw-medium ${
                          activeTab === tab.toLowerCase() ? "active" : ""
                        }`}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        type="button"
                      >
                        {tab === "Legal"
                          ? "Legal / Identification"
                          : tab + " Information"}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* --- TABS CONTENT --- */}
              <div
                className="tab-content bg-white"
                style={{ minHeight: "350px" }}
              >
                {/* 1. Legal / Identification */}
                {activeTab === "legal" && (
                  <div className="legal-info-wrapper animate__animated animate__fadeIn">
                    {/* --- Section 1: Government Identification --- */}
                    <div className="form-section mb-4">
                      <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                        <i className="ti ti-id fs-18 me-2"></i> Primary
                        Identification
                      </h6>
                      <div className="row g-3">
                        {/* Aadhaar Number - MANDATORY */}
                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Aadhaar Number{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              isSubmitted
                                ? errors.aadhaar_number
                                  ? "is-invalid"
                                  : formData.aadhaar_number
                                  ? "is-valid"
                                  : ""
                                : ""
                            }`}
                            placeholder="12 Digit Aadhaar"
                            value={formData.aadhaar_number}
                            onChange={(e) => {
                              const val = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 12);
                              setFormData({ ...formData, aadhaar_number: val });
                              if (errors.aadhaar_number)
                                setErrors({ ...errors, aadhaar_number: "" });
                            }}
                          />
                          {isSubmitted && errors.aadhaar_number && (
                            <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                              <i className="ti ti-info-circle me-1"></i>
                              {errors.aadhaar_number}
                            </div>
                          )}
                        </div>

                        {/* PAN Number - OPTIONAL */}
                        <div className="col-md-4">
                          <label className="form-label fs-13">PAN Number</label>
                          <input
                            type="text"
                            className={`form-control text-uppercase ${
                              isSubmitted && formData.pan_number
                                ? "is-valid"
                                : ""
                            }`}
                            maxLength={10}
                            placeholder="ABCDE1234F"
                            value={formData.pan_number}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pan_number: e.target.value
                                  .toUpperCase()
                                  .replace(/\s/g, ""),
                              })
                            }
                          />
                        </div>

                        {/* Voter ID - OPTIONAL */}
                        <div className="col-md-4">
                          <label className="form-label fs-13">Voter ID</label>
                          <input
                            type="text"
                            className={`form-control text-uppercase ${
                              isSubmitted && formData.voter_id ? "is-valid" : ""
                            }`}
                            placeholder="ABC1234567"
                            value={formData.voter_id}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                voter_id: e.target.value
                                  .toUpperCase()
                                  .replace(/\s/g, ""),
                              })
                            }
                          />
                        </div>

                        {/* Passport No - OPTIONAL */}
                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Passport No
                          </label>
                          <input
                            type="text"
                            className={`form-control text-uppercase ${
                              isSubmitted && formData.passport_no
                                ? "is-valid"
                                : ""
                            }`}
                            placeholder="A1234567"
                            value={formData.passport_no}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                passport_no: e.target.value
                                  .toUpperCase()
                                  .replace(/\s/g, ""),
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <hr className="my-4 opacity-25" />

                    {/* --- Section 2: Social Security & Welfare --- */}
                    <div className="form-section mb-4">
                      <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                        <i className="ti ti-shield-check fs-18 me-2"></i>{" "}
                        Statutory Compliance
                      </h6>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label fs-13">ESI Number</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter ESI Number"
                            value={formData.esi_number}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                esi_number: e.target.value.replace(/\D/g, ""),
                              })
                            }
                          />
                        </div>

                        <div className="col-md-4 d-flex align-items-center">
                          <div className="form-check pt-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="uanCheckLegal"
                              checked={formData.is_uan_number_applicable}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  is_uan_number_applicable: e.target.checked,
                                })
                              }
                            />
                            <label
                              className="form-check-label fs-13 ms-2"
                              htmlFor="uanCheckLegal"
                            >
                              Is UAN Applicable?
                            </label>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            UAN Number{" "}
                            {formData.is_uan_number_applicable && (
                              <span className="text-danger">*</span>
                            )}
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              isSubmitted && formData.is_uan_number_applicable
                                ? errors.uan_number
                                  ? "is-invalid"
                                  : "is-valid"
                                : ""
                            }`}
                            disabled={!formData.is_uan_number_applicable}
                            placeholder="12 Digit UAN"
                            value={formData.uan_number}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                uan_number: e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 12),
                              })
                            }
                          />
                          {isSubmitted && errors.uan_number && (
                            <div className="text-danger fs-11 mt-1">
                              {errors.uan_number}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <hr className="my-4 opacity-25" />

                    {/* --- Section 3: Classification & Verification --- */}
                    <div className="form-section">
                      <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                        <i className="ti ti-file-upload fs-18 me-2"></i>{" "}
                        Verification Documents
                      </h6>
                      <div className="row g-3">
                        {/* Category Dropdown - MANDATORY */}
                        <div className="col-md-6">
                          <label className="form-label fs-13">
                            Category <span className="text-danger">*</span>
                          </label>
                          <div
                            className={
                              isSubmitted
                                ? errors.category
                                  ? "border border-danger rounded"
                                  : formData.category
                                  ? "border border-success rounded"
                                  : ""
                                : ""
                            }
                          >
                            <CommonSelect
                              options={[
                                { value: "general", label: "General" },
                                { value: "sc", label: "SC" },
                                { value: "st", label: "ST" },
                                { value: "obc", label: "OBC" },
                                { value: "others", label: "Others" },
                              ]}
                              placeholder="Select Category"
                              defaultValue={
                                formData.category
                                  ? {
                                      value: formData.category,
                                      label: formData.category.toUpperCase(),
                                    }
                                  : undefined
                              }
                              onChange={(opt) => {
                                setFormData({
                                  ...formData,
                                  category: opt?.value || "",
                                });
                                if (errors.category)
                                  setErrors({ ...errors, category: "" });
                              }}
                            />
                          </div>
                          {isSubmitted && errors.category && (
                            <div className="text-danger fs-11 mt-1">
                              {errors.category}
                            </div>
                          )}
                        </div>

                        {/* Driving License Upload - MANDATORY */}
                        <div className="col-md-6">
                          <label className="form-label fs-13">
                            Driving License (Copy){" "}
                            <span className="text-danger">*</span>
                          </label>
                          <div
                            className={`upload-box border rounded p-1 bg-white ${
                              isSubmitted
                                ? errors.driving_license
                                  ? "border-danger"
                                  : formData.driving_license
                                  ? "border-success"
                                  : ""
                                : ""
                            }`}
                          >
                            <input
                              type="file"
                              className="form-control border-0 shadow-none"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setFormData({
                                  ...formData,
                                  driving_license: file,
                                });
                                if (file && errors.driving_license)
                                  setErrors({ ...errors, driving_license: "" });
                              }}
                            />
                          </div>
                          {isSubmitted && errors.driving_license && (
                            <div className="text-danger fs-11 mt-1">
                              {errors.driving_license}
                            </div>
                          )}
                          {formData.driving_license && (
                            <div className="text-success fs-11 mt-1">
                              <i className="ti ti-check me-1"></i>Document
                              attached: {formData.driving_license.name}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* 2. Personal Information */}
                {activeTab === "personal" && (
                  <div className="personal-info-wrapper animate__animated animate__fadeIn">
                    {/* --- Section 1: Basic Identity --- */}
                    <div className="form-section mb-4">
                      <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                        <i className="ti ti-user-circle fs-18 me-2"></i> Basic
                        Identity
                      </h6>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label fs-13 text-muted">
                            Employee Code
                          </label>
                          <input
                            type="text"
                            className="form-control bg-light border-dashed"
                            disabled
                            value="AUTO-GEN-2025"
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            CD Emp. No.
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.cd_employee_num}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                cd_employee_num: e.target.value,
                              })
                            }
                          />
                        </div>

                        {/* Gender - MANDATORY */}
                        <div className="col-md-4">
                          <label className="form-label fs-13 d-block">
                            Gender <span className="text-danger">*</span>
                          </label>
                          <div
                            className={`pt-1 ps-2 rounded ${
                              isSubmitted && errors.gender
                                ? "border border-danger"
                                : ""
                            }`}
                          >
                            <Radio.Group
                              className="custom-radio-group"
                              value={formData.gender}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  gender: e.target.value,
                                });
                                if (errors.gender)
                                  setErrors({ ...errors, gender: "" });
                              }}
                            >
                              <Radio value="male">Male</Radio>
                              <Radio value="female">Female</Radio>
                              <Radio value="other">Other</Radio>
                            </Radio.Group>
                          </div>
                          {isSubmitted && errors.gender && (
                            <div className="text-danger fs-11 mt-1">
                              {errors.gender}
                            </div>
                          )}
                        </div>

                        {/* Marital Status - MANDATORY */}
                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Marital Status{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <div
                            className={
                              isSubmitted
                                ? errors.marital
                                  ? "border border-danger rounded"
                                  : formData.marital
                                  ? "border border-success rounded"
                                  : ""
                                : ""
                            }
                          >
                            <CommonSelect
                              options={[
                                { value: "single", label: "Single" },
                                { value: "married", label: "Married" },
                                {
                                  value: "cohabitant",
                                  label: "Legal Cohabitant",
                                },
                                { value: "widower", label: "Widower" },
                                { value: "divorced", label: "Divorced" },
                              ]}
                              defaultValue={{
                                value: formData.marital,
                                label: formData.marital
                                  ? formData.marital.charAt(0).toUpperCase() +
                                    formData.marital.slice(1)
                                  : "Select",
                              }}
                              onChange={(opt) => {
                                setFormData({
                                  ...formData,
                                  marital: opt?.value || "",
                                  spouse_name:
                                    opt?.value !== "married"
                                      ? ""
                                      : formData.spouse_name,
                                  date_of_marriage:
                                    opt?.value !== "married"
                                      ? null
                                      : formData.date_of_marriage,
                                });
                                if (errors.marital)
                                  setErrors({ ...errors, marital: "" });
                              }}
                            />
                          </div>
                          {isSubmitted && errors.marital && (
                            <div className="text-danger fs-11 mt-1">
                              {errors.marital}
                            </div>
                          )}
                        </div>

                        {/* Conditional Spouse Fields */}
                        {formData.marital === "married" && (
                          <>
                            <div className="col-md-4 animate__animated animate__fadeInDown">
                              <label className="form-label fs-13">
                                Spouse Name{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className={`form-control ${
                                  isSubmitted
                                    ? errors.spouse_name
                                      ? "is-invalid"
                                      : formData.spouse_name
                                      ? "is-valid"
                                      : ""
                                    : ""
                                }`}
                                placeholder="Enter Spouse Name"
                                value={formData.spouse_name}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    spouse_name: e.target.value,
                                  })
                                }
                              />
                              {isSubmitted && errors.spouse_name && (
                                <div className="invalid-feedback">
                                  {errors.spouse_name}
                                </div>
                              )}
                            </div>
                            <div className="col-md-4 animate__animated animate__fadeInDown">
                              <label className="form-label fs-13">
                                Date of Marriage{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <DatePicker
                                className={`form-control w-100 ${
                                  isSubmitted
                                    ? errors.date_of_marriage
                                      ? "is-invalid"
                                      : formData.date_of_marriage
                                      ? "is-valid"
                                      : ""
                                    : ""
                                }`}
                                value={
                                  formData.date_of_marriage
                                    ? dayjs(formData.date_of_marriage)
                                    : null
                                }
                                onChange={(_, dateStr) =>
                                  setFormData({
                                    ...formData,
                                    date_of_marriage: dateStr,
                                  })
                                }
                              />
                              {isSubmitted && errors.date_of_marriage && (
                                <div className="text-danger fs-11 mt-1">
                                  {errors.date_of_marriage}
                                </div>
                              )}
                            </div>
                          </>
                        )}

                        {/* DOB - MANDATORY */}
                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Date of Birth <span className="text-danger">*</span>
                          </label>
                          <DatePicker
                            className={`form-control w-100 ${
                              isSubmitted
                                ? errors.birthday
                                  ? "is-invalid"
                                  : formData.birthday
                                  ? "is-valid"
                                  : ""
                                : ""
                            }`}
                            value={
                              formData.birthday
                                ? dayjs(formData.birthday)
                                : null
                            }
                            onChange={(_, dateStr) => {
                              setFormData({ ...formData, birthday: dateStr });
                              if (errors.birthday)
                                setErrors({ ...errors, birthday: "" });
                            }}
                          />
                          {isSubmitted && errors.birthday && (
                            <div className="text-danger fs-11 mt-1">
                              {errors.birthday}
                            </div>
                          )}
                        </div>

                        {/* Blood Group - MANDATORY */}
                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Blood Group <span className="text-danger">*</span>
                          </label>
                          <div
                            className={
                              isSubmitted
                                ? errors.blood_group
                                  ? "border border-danger rounded"
                                  : formData.blood_group
                                  ? "border border-success rounded"
                                  : ""
                                : ""
                            }
                          >
                            <CommonSelect
                              options={[
                                "A+",
                                "A-",
                                "B+",
                                "B-",
                                "AB+",
                                "AB-",
                                "O+",
                                "O-",
                              ].map((bg) => ({ value: bg, label: bg }))}
                              defaultValue={
                                formData.blood_group
                                  ? {
                                      value: formData.blood_group,
                                      label: formData.blood_group,
                                    }
                                  : undefined
                              }
                              onChange={(opt) => {
                                setFormData({
                                  ...formData,
                                  blood_group: opt?.value || "",
                                });
                                if (errors.blood_group)
                                  setErrors({ ...errors, blood_group: "" });
                              }}
                            />
                          </div>
                          {isSubmitted && errors.blood_group && (
                            <div className="text-danger fs-11 mt-1">
                              {errors.blood_group}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <hr className="my-4 opacity-25" />

                    {/* Section 2: Education (Optional) */}
                    <div className="form-section mb-4">
                      <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                        <i className="ti ti-school fs-18 me-2"></i> Education &
                        Experience
                      </h6>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Post Graduation
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="MBA, etc."
                            value={formData.name_of_post_graduation}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                name_of_post_graduation: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Other Education
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.name_of_any_other_education}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                name_of_any_other_education: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Experience (Years)
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            value={formData.total_experiance}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                total_experiance: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <hr className="my-4 opacity-25" />

                    {/* Section 3: Background & Contact - MANDATORY FIELDS */}
                    <div className="form-section">
                      <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                        <i className="ti ti-address-book fs-18 me-2"></i>{" "}
                        Contact Details
                      </h6>
                      <div className="row g-3">
                        {/* Mobile - MANDATORY */}
                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Primary Mobile{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <span className="input-group-text fs-12 bg-light">
                              +91
                            </span>
                            <input
                              type="text"
                              className={`form-control ${
                                isSubmitted
                                  ? errors.work_phone
                                    ? "is-invalid"
                                    : formData.work_phone
                                    ? "is-valid"
                                    : ""
                                  : ""
                              }`}
                              maxLength={10}
                              value={formData.work_phone}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  work_phone: e.target.value.replace(/\D/g, ""),
                                })
                              }
                            />
                          </div>
                          {isSubmitted && errors.work_phone && (
                            <div className="text-danger fs-11 mt-1">
                              {errors.work_phone}
                            </div>
                          )}
                        </div>

                        {/* Email - MANDATORY */}
                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Personal Email{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="email"
                            className={`form-control ${
                              isSubmitted
                                ? errors.private_email
                                  ? "is-invalid"
                                  : formData.private_email
                                  ? "is-valid"
                                  : ""
                                : ""
                            }`}
                            placeholder="example@gmail.com"
                            value={formData.private_email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                private_email: e.target.value,
                              })
                            }
                          />
                          {isSubmitted && errors.private_email && (
                            <div className="text-danger fs-11 mt-1">
                              {errors.private_email}
                            </div>
                          )}
                        </div>

                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Secondary Mobile
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            maxLength={10}
                            value={formData.mobile_phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                mobile_phone: e.target.value.replace(/\D/g, ""),
                              })
                            }
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label fs-13">Religion</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.religion}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                religion: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Upload Passbook
                          </label>
                          <div className="upload-box border rounded p-1 bg-white">
                            <input
                              type="file"
                              className="form-control border-0 shadow-none"
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  upload_passbook: e.target.files?.[0] || null,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* 3. Address Details */}
                {activeTab === "address" && (
                  <div className="address-info-wrapper animate__animated animate__fadeIn">
                    {/* --- Section 1: Residential Information --- */}
                    <div className="form-section mb-4">
                      <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                        <i className="ti ti-home fs-18 me-2"></i> Residential
                        Information
                      </h6>
                      <div className="row g-3">
                        {/* Present Address - MANDATORY */}
                        <div className="col-md-6">
                          <label className="form-label fs-13">
                            Present Address{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <textarea
                            rows={2}
                            className={`form-control ${
                              isSubmitted
                                ? errors.present_address
                                  ? "is-invalid"
                                  : formData.present_address
                                  ? "is-valid"
                                  : ""
                                : ""
                            }`}
                            placeholder="House no, Building, Street..."
                            value={formData.present_address}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                present_address: e.target.value,
                              });
                              if (errors.present_address)
                                setErrors({ ...errors, present_address: "" });
                            }}
                          />
                          {isSubmitted && errors.present_address && (
                            <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                              <i className="ti ti-info-circle me-1"></i>
                              {errors.present_address}
                            </div>
                          )}
                        </div>

                        {/* Permanent Address - MANDATORY */}
                        <div className="col-md-6">
                          <label className="form-label fs-13">
                            Permanent Address{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <textarea
                            rows={2}
                            className={`form-control ${
                              isSubmitted
                                ? errors.permanent_address
                                  ? "is-invalid"
                                  : formData.permanent_address
                                  ? "is-valid"
                                  : ""
                                : ""
                            }`}
                            placeholder="Same as present or different..."
                            value={formData.permanent_address}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                permanent_address: e.target.value,
                              });
                              if (errors.permanent_address)
                                setErrors({ ...errors, permanent_address: "" });
                            }}
                          />
                          {isSubmitted && errors.permanent_address && (
                            <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                              <i className="ti ti-info-circle me-1"></i>
                              {errors.permanent_address}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <hr className="my-4 opacity-25" />

                    {/* --- Section 2: Regional Geography --- */}
                    <div className="form-section">
                      <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                        <i className="ti ti-map-pin fs-18 me-2"></i> Regional
                        Details
                      </h6>
                      <div className="row g-3">
                        {/* Pin Code - OPTIONAL */}
                        <div className="col-md-3">
                          <label className="form-label fs-13">Pin Code</label>
                          <input
                            type="text"
                            className={`form-control ${
                              isSubmitted && formData.pin_code ? "is-valid" : ""
                            }`}
                            maxLength={6}
                            placeholder="6-Digits"
                            value={formData.pin_code}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pin_code: e.target.value.replace(/\D/g, ""),
                              })
                            }
                          />
                        </div>

                        {/* District - OPTIONAL */}
                        <div className="col-md-3">
                          <label className="form-label fs-13">District</label>
                          <CommonSelect
                            options={districts}
                            placeholder="Select City/District"
                            defaultValue={districts.find(
                              (d) => d.value === String(formData.district_id)
                            )}
                            onChange={(opt) =>
                              setFormData({
                                ...formData,
                                district_id: opt?.value || "",
                              })
                            }
                          />
                        </div>

                        {/* State - OPTIONAL */}
                        <div className="col-md-3">
                          <label className="form-label fs-13">State</label>
                          <CommonSelect
                            options={states}
                            placeholder="Select State"
                            defaultValue={states.find(
                              (s) => s.value === String(formData.state_id)
                            )}
                            onChange={(opt) =>
                              setFormData({
                                ...formData,
                                state_id: opt?.value || "",
                              })
                            }
                          />
                        </div>

                        {/* Country - OPTIONAL */}
                        <div className="col-md-3">
                          <label className="form-label fs-13">Country</label>
                          <CommonSelect
                            options={countries}
                            placeholder="Select Country"
                            defaultValue={countries.find(
                              (c) => c.value === String(formData.country_id)
                            )}
                            onChange={(opt) =>
                              setFormData({
                                ...formData,
                                country_id: opt?.value || "",
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* 4. Emergency Contact */}
                {activeTab === "emergency" && (
                  <div className="emergency-info-wrapper animate__animated animate__fadeIn">
                    {/* --- Section: Emergency Details --- */}
                    <div className="form-section mb-4">
                      <h6 className="fw-bold text-danger mb-3 d-flex align-items-center">
                        <i className="ti ti-phone-call fs-18 me-2"></i>{" "}
                        Immediate Contact Details
                      </h6>
                      <div className="row g-3">
                        {/* Contact Person Name - MANDATORY */}
                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Emergency Contact Name{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              isSubmitted
                                ? errors.emergency_contact_name
                                  ? "is-invalid"
                                  : formData.emergency_contact_name
                                  ? "is-valid"
                                  : ""
                                : ""
                            }`}
                            placeholder="Full Name"
                            value={formData.emergency_contact_name}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                emergency_contact_name: e.target.value,
                              });
                              if (errors.emergency_contact_name)
                                setErrors({
                                  ...errors,
                                  emergency_contact_name: "",
                                });
                            }}
                          />
                          {isSubmitted && errors.emergency_contact_name && (
                            <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                              <i className="ti ti-info-circle me-1"></i>
                              {errors.emergency_contact_name}
                            </div>
                          )}
                        </div>

                        {/* Relation - MANDATORY */}
                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Relation <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              isSubmitted
                                ? errors.emergency_contact_relation
                                  ? "is-invalid"
                                  : formData.emergency_contact_relation
                                  ? "is-valid"
                                  : ""
                                : ""
                            }`}
                            placeholder="e.g. Spouse, Father, Brother"
                            value={formData.emergency_contact_relation}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                emergency_contact_relation: e.target.value,
                              });
                              if (errors.emergency_contact_relation)
                                setErrors({
                                  ...errors,
                                  emergency_contact_relation: "",
                                });
                            }}
                          />
                          {isSubmitted && errors.emergency_contact_relation && (
                            <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                              <i className="ti ti-info-circle me-1"></i>
                              {errors.emergency_contact_relation}
                            </div>
                          )}
                        </div>

                        {/* Mobile Number - MANDATORY */}
                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Mobile Number <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <span className="input-group-text bg-light fs-12">
                              +91
                            </span>
                            <input
                              type="text"
                              className={`form-control ${
                                isSubmitted
                                  ? errors.emergency_contact_mobile
                                    ? "is-invalid"
                                    : formData.emergency_contact_mobile
                                    ? "is-valid"
                                    : ""
                                  : ""
                              }`}
                              maxLength={10}
                              placeholder="10-Digit Mobile"
                              value={formData.emergency_contact_mobile}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "");
                                setFormData({
                                  ...formData,
                                  emergency_contact_mobile: val,
                                });
                                if (errors.emergency_contact_mobile)
                                  setErrors({
                                    ...errors,
                                    emergency_contact_mobile: "",
                                  });
                              }}
                            />
                          </div>
                          {isSubmitted && errors.emergency_contact_mobile && (
                            <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                              <i className="ti ti-info-circle me-1"></i>
                              {errors.emergency_contact_mobile}
                            </div>
                          )}
                        </div>

                        {/* Contact Address - OPTIONAL */}
                        <div className="col-md-12">
                          <label className="form-label fs-13">
                            Contact Address
                          </label>
                          <textarea
                            rows={3}
                            className={`form-control ${
                              isSubmitted && formData.emergency_contact_address
                                ? "is-valid"
                                : ""
                            }`}
                            placeholder="Full Residential Address of the contact person"
                            value={formData.emergency_contact_address}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                emergency_contact_address: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      className="alert alert-soft-warning d-flex align-items-center border-0 p-2"
                      role="alert"
                    >
                      <i className="ti ti-info-circle fs-16 me-2"></i>
                      <div className="fs-12">
                        Please ensure the contact details provided are accurate
                        for use in case of emergencies.
                      </div>
                    </div>
                  </div>
                )}
                {/* 5. Employment Information */}
                {activeTab === "employment" && (
                  <div className="employment-wrapper animate__animated animate__fadeIn">
                    {/* --- Section 1: Organizational Role --- */}
                    <div className="form-section mb-4">
                      <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                        <i className="ti ti-briefcase fs-18 me-2"></i>{" "}
                        Organizational Role
                      </h6>
                      <div className="row g-3">
                        {/* Department - MANDATORY */}
                        <div className="col-md-3">
                          <label className="form-label fs-13">
                            Department <span className="text-danger">*</span>
                          </label>
                          <div
                            className={
                              isSubmitted
                                ? errors.department_id
                                  ? "border border-danger rounded shadow-sm"
                                  : formData.department_id
                                  ? "border border-success rounded shadow-sm"
                                  : ""
                                : ""
                            }
                          >
                            <CommonSelect
                              options={departments}
                              placeholder="Select Department"
                              defaultValue={departments.find(
                                (o) =>
                                  o.value === String(formData.department_id)
                              )}
                              onChange={(opt) => {
                                setFormData({
                                  ...formData,
                                  department_id: opt?.value || "",
                                });
                                if (errors.department_id)
                                  setErrors({ ...errors, department_id: "" });
                              }}
                            />
                          </div>
                          {isSubmitted && errors.department_id && (
                            <div className="text-danger fs-11 mt-1">
                              {errors.department_id}
                            </div>
                          )}
                        </div>

                        {/* Designation - MANDATORY */}
                        <div className="col-md-3">
                          <label className="form-label fs-13">
                            Designation <span className="text-danger">*</span>
                          </label>
                          <div
                            className={
                              isSubmitted
                                ? errors.job_id
                                  ? "border border-danger rounded shadow-sm"
                                  : formData.job_id
                                  ? "border border-success rounded shadow-sm"
                                  : ""
                                : ""
                            }
                          >
                            <CommonSelect
                              options={designations}
                              placeholder="Select Designation"
                              defaultValue={designations.find(
                                (o) => o.value === String(formData.job_id)
                              )}
                              onChange={(opt) => {
                                setFormData({
                                  ...formData,
                                  job_id: opt?.value || "",
                                });
                                if (errors.job_id)
                                  setErrors({ ...errors, job_id: "" });
                              }}
                            />
                          </div>
                          {isSubmitted && errors.job_id && (
                            <div className="text-danger fs-11 mt-1">
                              {errors.job_id}
                            </div>
                          )}
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fs-13">
                            Employment Type
                          </label>
                          <CommonSelect
                            options={[
                              { value: "permanent", label: "Permanent" },
                              { value: "fixed_term", label: "Fixed Term" },
                              { value: "temporary", label: "Temporary" },
                            ]}
                            placeholder="Select Type"
                            defaultValue={[
                              { value: "permanent", label: "Permanent" },
                              { value: "fixed_term", label: "Fixed Term" },
                              { value: "temporary", label: "Temporary" },
                            ].find(
                              (opt) => opt.value === formData.employment_type
                            )}
                            onChange={(opt) =>
                              setFormData({
                                ...formData,
                                employment_type: opt?.value || "",
                              })
                            }
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fs-13">
                            Grade / Band
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. A1, Senior"
                            value={formData.grade_band}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                grade_band: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <hr className="my-4 opacity-25" />

                    {/* --- Section 2: Tenure & Probation --- */}
                    <div className="form-section mb-4">
                      <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                        <i className="ti ti-calendar-event fs-18 me-2"></i>{" "}
                        Joining & Probation
                      </h6>
                      <div className="row g-3">
                        {/* Joining Date - MANDATORY */}
                        <div className="col-md-3">
                          <label className="form-label fs-13">
                            Joining Date <span className="text-danger">*</span>
                          </label>
                          <DatePicker
                            className={`w-100 form-control ${
                              isSubmitted
                                ? errors.joining_date
                                  ? "is-invalid"
                                  : formData.joining_date
                                  ? "is-valid"
                                  : ""
                                : ""
                            }`}
                            value={
                              formData.joining_date
                                ? dayjs(formData.joining_date)
                                : null
                            }
                            onChange={(_, dateStr) => {
                              setFormData({
                                ...formData,
                                joining_date: dateStr,
                              });
                              if (errors.joining_date)
                                setErrors({ ...errors, joining_date: "" });
                            }}
                          />
                          {isSubmitted && errors.joining_date && (
                            <div className="text-danger fs-11 mt-1">
                              {errors.joining_date}
                            </div>
                          )}
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fs-13">
                            Group Joining Date
                          </label>
                          <DatePicker
                            className="w-100 form-control"
                            value={
                              formData.group_company_joining_date
                                ? dayjs(formData.group_company_joining_date)
                                : null
                            }
                            onChange={(_, dateStr) =>
                              setFormData({
                                ...formData,
                                group_company_joining_date: dateStr,
                              })
                            }
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fs-13">
                            Confirmation Date
                          </label>
                          <DatePicker
                            className="w-100 form-control"
                            value={
                              formData.confirmation_date
                                ? dayjs(formData.confirmation_date)
                                : null
                            }
                            onChange={(_, dateStr) =>
                              setFormData({
                                ...formData,
                                confirmation_date: dateStr,
                              })
                            }
                          />
                        </div>

                        {/* Employee Password - MANDATORY */}
                        <div className="col-md-3">
                          <label className="form-label fs-13">
                            Login Password{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="password"
                            className={`form-control ${
                              isSubmitted
                                ? errors.employee_password
                                  ? "is-invalid"
                                  : formData.employee_password
                                  ? "is-valid"
                                  : ""
                                : ""
                            }`}
                            placeholder="System Access Password"
                            value={formData.employee_password}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                employee_password: e.target.value,
                              });
                              if (errors.employee_password)
                                setErrors({ ...errors, employee_password: "" });
                            }}
                          />
                          {isSubmitted && errors.employee_password && (
                            <div className="text-danger fs-11 mt-1">
                              {errors.employee_password}
                            </div>
                          )}
                        </div>

                        <div className="col-md-2">
                          <label className="form-label fs-13">
                            Probation (Months)
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            value={formData.probation_period}
                            onChange={(e) =>
                              handleProbationChange(Number(e.target.value))
                            }
                          />
                        </div>

                        <div className="col-md-2">
                          <label className="form-label fs-13 text-muted">
                            Probation End Date
                          </label>
                          <DatePicker
                            className="w-100 form-control bg-light"
                            value={
                              formData.probation_end_date
                                ? dayjs(formData.probation_end_date)
                                : null
                            }
                            disabled
                          />
                        </div>

                        <div className="col-md-2 d-flex align-items-center pt-4">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="probCheck"
                              checked={formData.in_probation}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  in_probation: e.target.checked,
                                })
                              }
                            />
                            <label
                              className="form-check-label fs-13 ms-1"
                              htmlFor="probCheck"
                            >
                              In Probation
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr className="my-4 opacity-25" />

                    {/* --- Section 3: Administration --- */}
                    <div className="form-section">
                      <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                        <i className="ti ti-settings-cog fs-18 me-2"></i>{" "}
                        Administration & Reporting
                      </h6>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Reporting Manager
                          </label>
                          <CommonSelect
                            options={managers}
                            defaultValue={managers.find(
                              (o) =>
                                o.value ===
                                String(formData.reporting_manager_id)
                            )}
                            onChange={(opt) =>
                              setFormData({
                                ...formData,
                                reporting_manager_id: opt?.value || "",
                              })
                            }
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Head of Department
                          </label>
                          <CommonSelect
                            options={managers}
                            defaultValue={managers.find(
                              (o) =>
                                o.value ===
                                String(formData.head_of_department_id)
                            )}
                            onChange={(opt) =>
                              setFormData({
                                ...formData,
                                head_of_department_id: opt?.value || "",
                              })
                            }
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Attendance Mode
                          </label>
                          <CommonSelect
                            options={[
                              { value: "qr", label: "QR CODE" },
                              { value: "biometric", label: "BIOMETRIC" },
                              { value: "mobile", label: "MobileAPP" },
                            ]}
                            placeholder="Capture Mode"
                            onChange={(opt) =>
                              setFormData({
                                ...formData,
                                attendance_capture_mode: opt?.value || "",
                              })
                            }
                          />
                        </div>

                        {/* Status - MANDATORY */}
                        <div className="col-md-3">
                          <label className="form-label fs-13">
                            Status <span className="text-danger">*</span>
                          </label>
                          <div
                            className={
                              isSubmitted
                                ? errors.status
                                  ? "border border-danger rounded shadow-sm"
                                  : formData.status
                                  ? "border border-success rounded shadow-sm"
                                  : ""
                                : ""
                            }
                          >
                            <CommonSelect
                              options={[
                                { value: "active", label: "Active" },
                                { value: "inactive", label: "Inactive" },
                              ]}
                              defaultValue={
                                formData.status
                                  ? {
                                      value: formData.status,
                                      label: formData.status.toUpperCase(),
                                    }
                                  : undefined
                              }
                              onChange={(opt) => {
                                setFormData({
                                  ...formData,
                                  status: opt?.value || "",
                                });
                                if (errors.status)
                                  setErrors({ ...errors, status: "" });
                              }}
                            />
                          </div>
                          {isSubmitted && errors.status && (
                            <div className="text-danger fs-11 mt-1">
                              {errors.status}
                            </div>
                          )}
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fs-13">Week Off</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. Sunday"
                            value={formData.week_off}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                week_off: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="col-md-2 d-flex align-items-center pt-4">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="holdCheck"
                              checked={formData.hold_status}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  hold_status: e.target.checked,
                                })
                              }
                            />
                            <label
                              className="form-check-label fs-13 ms-1 text-warning fw-bold"
                              htmlFor="holdCheck"
                            >
                              On Hold
                            </label>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Hold Remarks
                          </label>
                          <textarea
                            rows={1}
                            className={`form-control ${
                              isSubmitted &&
                              formData.hold_status &&
                              errors.hold_remarks
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder="Reason for hold..."
                            disabled={!formData.hold_status}
                            value={formData.hold_remarks}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                hold_remarks: e.target.value,
                              });
                              if (errors.hold_remarks)
                                setErrors({ ...errors, hold_remarks: "" });
                            }}
                          />
                          {isSubmitted &&
                            formData.hold_status &&
                            errors.hold_remarks && (
                              <div className="invalid-feedback">
                                {errors.hold_remarks}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* 6. Banking Information */}
                {/* 6. Banking Information Tab Content */}
                {activeTab === "banking" && (
                  <div className="banking-info-wrapper animate__animated animate__fadeIn">
                    <div className="form-section mb-4">
                      <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                        <i className="ti ti-building-bank fs-18 me-2"></i>{" "}
                        Salary Payment Details
                      </h6>

                      <div className="row g-3 align-items-end">
                        <div className="col-md-6">
                          <label className="form-label fs-13">
                            Bank Account <span className="text-danger">*</span>
                          </label>
                          <CommonSelect
                            options={banks}
                            placeholder="Select Bank Account"
                            defaultValue={banks.find(
                              (opt) =>
                                opt.value === String(formData.bank_account_id)
                            )}
                            onChange={(option) =>
                              setFormData({
                                ...formData,
                                bank_account_id: option?.value || "",
                              })
                            }
                          />
                        </div>

                        <div className="banking-info-wrapper">
                          {" "}
                          {/* FIX: Ensure data-bs-toggle and data-bs-target are present */}
                          <button
                            type="button"
                            className="btn btn-primary w-100 fs-12"
                            data-bs-toggle="modal"
                            data-bs-target="#add_bank_account_modal"
                          >
                            <i className="ti ti-plus me-1"></i> New Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* FIX: Move the Modal component outside of the tab-content conditional check.
   If it's inside {activeTab === "banking" && ...}, it might unmount when you 
   switch tabs, causing issues. Place it at the very bottom of the main modal-body.
*/}
                <AddEditBankAccountModal
                  onSuccess={async (newId: string) => {
                    // Refresh banks list and select new ID
                    const bankList = await getBanks();
                    const formatted = bankList.map((b: any) => ({
                      value: String(b.id),
                      label: `${b.acc_number} - ${
                        Array.isArray(b.bank_id) ? b.bank_id[1] : "Bank"
                      }`,
                    }));
                    setBanks(formatted);
                    setFormData({ ...formData, bank_account_id: newId });
                  }}
                />
                {/* 7.Device */}
                {activeTab === "device" && (
                  <div className="device-info-wrapper animate__animated animate__fadeIn">
                    <div className="form-section mb-4">
                      <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                        <i className="ti ti-device-mobile fs-18 me-2"></i>{" "}
                        Registered Device Details
                      </h6>
                      <div className="row g-3">
                        {/* Device Unique ID */}
                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Device Unique ID{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              isSubmitted && errors.device_unique_id
                                ? "is-invalid"
                                : ""
                            }`}
                            value={formData.device_unique_id}
                            placeholder="e.g. 3d60c7079ea1ea51"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                device_unique_id: e.target.value,
                              })
                            }
                          />
                        </div>

                        {/* Device Name */}
                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Device Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.device_name}
                            placeholder="e.g. Pixel 6 Pro"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                device_name: e.target.value,
                              })
                            }
                          />
                        </div>

                        {/* Device ID */}
                        <div className="col-md-4">
                          <label className="form-label fs-13">Device ID</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.device_id}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                device_id: e.target.value,
                              })
                            }
                          />
                        </div>

                        {/* Platform & Version */}
                        <div className="col-md-3">
                          <label className="form-label fs-13">Platform</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.device_platform}
                            placeholder="Android / iOS"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                device_platform: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fs-13">
                            System Version
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.system_version}
                            placeholder="e.g. 15"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                system_version: e.target.value,
                              })
                            }
                          />
                        </div>

                        {/* IP Address */}
                        <div className="col-md-3">
                          <label className="form-label fs-13">IP Address</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.ip_address}
                            placeholder="0.0.0.0"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                ip_address: e.target.value,
                              })
                            }
                          />
                        </div>

                        {/* Random Registration Code */}
                        <div className="col-md-3">
                          <label className="form-label fs-13">Reg. Code</label>
                          <input
                            type="text"
                            className="form-control bg-light"
                            value={formData.random_code_for_reg}
                            placeholder="!gGzd!"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                random_code_for_reg: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="alert alert-soft-info d-flex align-items-center border-0 p-2 shadow-sm">
                      <i className="ti ti-info-circle-filled fs-20 me-2 text-info"></i>
                      <div className="fs-11">
                        This information is typically captured automatically
                        when an employee logs into the mobile app for the first
                        time.
                      </div>
                    </div>
                  </div>
                )}
                {/* 7. Notice Information */}
                {activeTab === "notice" && (
                  <div className="notice-info-wrapper animate__animated animate__fadeIn">
                    {/* --- Section: Separation Details --- */}
                    <div className="form-section mb-4">
                      <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                        <i className="ti ti-door-exit fs-18 me-2"></i>{" "}
                        Separation & Notice Details
                      </h6>
                      <div className="row g-3">
                        {/* Type Of Separation */}
                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Type Of Separation
                          </label>
                          <div
                            className={
                              isSubmitted
                                ? errors.type_of_sepration
                                  ? "border border-danger rounded shadow-sm"
                                  : formData.type_of_sepration
                                  ? "border border-success rounded shadow-sm"
                                  : ""
                                : ""
                            }
                          >
                            <CommonSelect
                              options={[
                                { value: "voluntary", label: "Voluntary" },
                                { value: "involuntary", label: "Involuntary" },
                                { value: "absconding", label: "Absconding" },
                                { value: "retirement", label: "Retirement" },
                              ]}
                              placeholder="Select Type"
                              defaultValue={
                                formData.type_of_sepration
                                  ? {
                                      value: formData.type_of_sepration,
                                      label:
                                        formData.type_of_sepration
                                          .charAt(0)
                                          .toUpperCase() +
                                        formData.type_of_sepration.slice(1),
                                    }
                                  : undefined
                              }
                              onChange={(opt) => {
                                setFormData({
                                  ...formData,
                                  type_of_sepration: opt?.value || "",
                                });
                                if (errors.type_of_sepration)
                                  setErrors({
                                    ...errors,
                                    type_of_sepration: "",
                                  });
                              }}
                            />
                          </div>
                          {isSubmitted && errors.type_of_sepration && (
                            <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                              <i className="ti ti-info-circle me-1"></i>
                              {errors.type_of_sepration}
                            </div>
                          )}
                        </div>

                        {/* Resignation Date */}
                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Resignation Date
                          </label>
                          <DatePicker
                            className={`w-100 form-control ${
                              isSubmitted
                                ? errors.resignation_date
                                  ? "is-invalid"
                                  : formData.resignation_date
                                  ? "is-valid"
                                  : ""
                                : ""
                            }`}
                            value={
                              formData.resignation_date
                                ? dayjs(formData.resignation_date)
                                : null
                            }
                            onChange={(_, dateStr) => {
                              setFormData({
                                ...formData,
                                resignation_date: dateStr,
                              });
                              if (errors.resignation_date)
                                setErrors({ ...errors, resignation_date: "" });
                              // Trigger calculation helper if it exists in your component
                              if (
                                typeof calculateNoticeEndDate === "function"
                              ) {
                                calculateNoticeEndDate(
                                  Number(formData.notice_period_days),
                                  dateStr
                                );
                              }
                            }}
                          />
                          {isSubmitted && errors.resignation_date && (
                            <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                              <i className="ti ti-info-circle me-1"></i>
                              {errors.resignation_date}
                            </div>
                          )}
                        </div>

                        {/* Notice Period (Days) */}
                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Notice Period (Days)
                          </label>
                          <input
                            type="number"
                            className={`form-control ${
                              isSubmitted
                                ? errors.notice_period_days
                                  ? "is-invalid"
                                  : formData.notice_period_days > 0
                                  ? "is-valid"
                                  : ""
                                : ""
                            }`}
                            placeholder="e.g. 30"
                            value={formData.notice_period_days}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormData({
                                ...formData,
                                notice_period_days: Number(val),
                              });
                              if (errors.notice_period_days)
                                setErrors({
                                  ...errors,
                                  notice_period_days: "",
                                });
                              if (
                                typeof calculateNoticeEndDate === "function"
                              ) {
                                calculateNoticeEndDate(
                                  Number(val),
                                  formData.resignation_date
                                );
                              }
                            }}
                          />
                          {isSubmitted && errors.notice_period_days && (
                            <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                              <i className="ti ti-info-circle me-1"></i>
                              {errors.notice_period_days}
                            </div>
                          )}
                        </div>

                        {/* Status Checkbox (Calculated) */}
                        <div className="col-md-4 d-flex align-items-center pt-4">
                          <div className="form-check form-switch">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="noticeCheck"
                              checked={formData.in_notice_period}
                              disabled // Field is system-calculated based on dates
                            />
                            <label
                              className="form-check-label fs-13 ms-2 fw-bold text-info"
                              htmlFor="noticeCheck"
                            >
                              Currently In Notice Period
                            </label>
                          </div>
                        </div>

                        {/* Notice Period End Date (Read-only) */}
                        <div className="col-md-4">
                          <label className="form-label fs-13 text-muted italic">
                            Calculated Last Working Day
                          </label>
                          <DatePicker
                            className="w-100 form-control bg-light border-dashed"
                            value={
                              formData.notice_period_end_date
                                ? dayjs(formData.notice_period_end_date)
                                : null
                            }
                            disabled
                            placeholder="System Calculated"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Warning Footer */}
                    <div
                      className="alert alert-soft-danger d-flex align-items-center border-0 p-2 shadow-sm"
                      role="alert"
                    >
                      <i className="ti ti-alert-triangle-filled fs-20 me-2 text-danger"></i>
                      <div className="fs-11">
                        <strong>Warning:</strong> Entering separation details
                        will automatically update the employee's status to{" "}
                        <em>Resigned</em> across payroll and attendance modules
                        upon reaching the end date.
                      </div>
                    </div>
                  </div>
                )}
                {/* 8. Settings */}
                {activeTab === "setting" && (
                  <div className="settings-info-wrapper animate__animated animate__fadeIn">
                    {/* --- Section: Security & Access --- */}
                    <div className="form-section mb-4">
                      <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                        <i className="ti ti-lock-access fs-18 me-2"></i>{" "}
                        Security & Access Credentials
                      </h6>
                      <div className="row g-3">
                        {/* PIN Code Field - MANDATORY */}
                        <div className="col-md-4">
                          <label className="form-label fs-13">
                            Employee PIN <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <span
                              className={`input-group-text bg-light border-end-0 ${
                                isSubmitted
                                  ? errors.pin
                                    ? "border-danger"
                                    : formData.pin
                                    ? "border-success"
                                    : ""
                                  : ""
                              }`}
                            >
                              <i className="ti ti-key fs-14 text-muted"></i>
                            </span>
                            <input
                              type="text" // Changed to text to allow maxLength and manual masking if needed, or keep password
                              className={`form-control border-start-0 ${
                                isSubmitted
                                  ? errors.pin
                                    ? "is-invalid"
                                    : formData.pin
                                    ? "is-valid"
                                    : ""
                                  : ""
                              }`}
                              placeholder="Enter 4-6 Digit PIN"
                              maxLength={6}
                              value={formData.pin}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "");
                                setFormData({ ...formData, pin: val });
                                if (errors.pin)
                                  setErrors({ ...errors, pin: "" });
                              }}
                            />
                          </div>
                          {isSubmitted && errors.pin && (
                            <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                              <i className="ti ti-info-circle me-1"></i>
                              {errors.pin}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Security Advisory Card */}
                    <div
                      className="alert alert-soft-secondary d-flex align-items-start border-0 p-3 shadow-sm"
                      role="alert"
                    >
                      <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                        <i className="ti ti-shield-lock fs-24 text-success"></i>
                      </div>
                      <div>
                        <h6 className="fs-13 fw-bold mb-1 text-dark">
                          Access PIN Security
                        </h6>
                        <p className="fs-12 mb-0 text-muted lh-base">
                          This PIN is used for employee authentication on shared
                          kiosks, QR-based attendance, and mobile app
                          verification. Please ensure the PIN is unique. For
                          security reasons, do not use simple sequences like
                          "1234".
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer border-0 bg-white px-0 mt-4">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                  onClick={resetForm} // Explicitly reset state on click
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-5"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Save Employee Master"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditEmployeeModal;
