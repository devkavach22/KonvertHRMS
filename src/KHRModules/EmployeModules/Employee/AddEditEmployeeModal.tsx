import React, { useEffect, useState } from "react";
import { DatePicker, Radio, Slider, Checkbox } from "antd";
import dayjs from "dayjs";
import CommonSelect from "../../../core/common/commonSelect";
import { toast } from "react-toastify";
import {
  addEmployee,
  getAttendancePolicies,
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
  getApprovalGroups,
  getGroupUsers,
} from "./EmployeeServices";
import CommonAlertCard from "@/CommonComponent/AlertKHR/CommonAlertCard";
import { AddEditBankAccountModal } from "./AddEditBankAccountModal";
import { getBanks } from "@/KHRModules/Master Modules/BanksKHR/BanksServices";

interface Props {
  onSuccess: () => void;
  onClose: () => void;
  data: any | null;
}

const AddEditEmployeeModal: React.FC<Props> = ({
  onSuccess,
  onClose,
  data,
}) => {
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
  const [bankMasterList, setBankMasterList] = useState<any[]>([]);
  const [branches, setBranches] = useState<Option[]>([]);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [groupOptions, setGroupOptions] = useState<Option[]>([]);
  const [groupUserOptions, setGroupUserOptions] = useState<
    Record<string, Option[]>
  >({});
  const [showPassword, setShowPassword] = useState(false);
  const [groupAccessLines, setGroupAccessLines] = useState<any[]>([
    {
      model: "leave", // Added default
      group_id: "",
      approval_user_id: "",
      approval_sequance: 0,
    },
  ]);
  // Form State matching API Schema
  // Complete Form State matching all Tab fields and API Schema
  const [formData, setFormData] = useState<any>({
    // 1. Header Section
    name: "",
    father_name: "",
    name_of_client: "",
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
    probation_period: 6,
    probation_end_date: null,
    in_probation: true,
    confirmation_date: null,
    week_off: "",
    status: "active",
    hold_status: false,
    hold_remarks: "",
    reporting_manager_id: "",
    head_of_department_id: "",
    attendance_capture_mode: "",

    // 7. Banking Information
    // bank_account_id: "",
    bank_id: "", // New field from Bank Modal
    account_number: "", // New field from Bank Modal
    bank_iafc_code: "", // New field from Bank Modal
    bank_swift_code: "", // New field from Bank Modal
    currency: "INR", // New field from Bank Modal

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
  const todayStr = dayjs().format("YYYY-MM-DD");

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
    probation_period: 6,
    in_probation: true,
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
    joining_date: todayStr,
    emergency_contact_name: "",
    emergency_contact_relation: "",
    emergency_contact_mobile: "",
    emergency_contact_address: "",
    // bank_account_id: "",
    bank_id: "",
    account_number: "",
    bank_iafc_code: "",
    bank_swift_code: "",
    currency_id: "INR",
    attendance_capture_mode: "mobile",
    department_id: "",
    job_id: "",
    employment_type: "permanent",
    employee_password: "",
    status: "active",
    pin: "",
    latitude: "",
    longitude: "",
    device_id: "",
    device_unique_id: "",
    device_name: "",
    system_version: "",
    ip_address: "",
    device_platform: "",
  };

  const resetForm = () => {
    setFormData(initialFormData); // Resets all input values
    setImgPreview(null); // Clears the photo preview
    setErrors({}); // Clears validation error messages
    setIsSubmitted(false); // Resets our custom submission flag
    setValidated(false); // Removes Bootstrap's 'was-validated' green/red styles
    setActiveTab("legal"); // Always open back to the first tab
    setShowErrorAlert(false); // Hides the red Alert UI card
    setGroupAccessLines([
      {
        group_id: "",
        approval_user_id: "",
        approval_sequance: 0,
      },
    ]);
  };

  const getCurrentUserId = () => {
    const id = localStorage.getItem("user_id");
    return id ? Number(id) : null;
  };

  // ✅ USE THIS CONSOLIDATED EFFECT
  useEffect(() => {
    if (data) {
      // 1. Helper to handle API's [id, "name"] or false/null values
      const getVal = (field: any) => {
        if (Array.isArray(field)) return String(field[0]); // Extract ID from [123, "Name"]
        if (field === false || field === null || field === 0) return ""; // Convert false/null/0 to empty string
        return String(field);
      };

      const cId = getVal(data.country_id) || "104";
      const sId = getVal(data.state_id);

      loadStates(cId); // Load states so the dropdown can find the label
      if (sId) loadDistricts(cId, sId); // Load cities so the dropdown can find the label

      const bankDetails = data.bank_account_details || {};
      const imgUrl = data.image_url || null;
      const licenseUrl = data.driving_license_url || null;
      const passbookUrl = data.passbook_url || null;

      // 2. Set the Form Data
      setFormData({
        ...initialFormData, // Start with defaults
        ...data, // Spread API data

        // --- Explicitly map Dropdown/Select fields ---
        // This ensures the Select component gets a clean ID string, not an array
        work_phone: data.work_phone ? String(data.work_phone) : "",
        attendance_policy_id: getVal(data.attendance_policy_id),
        name_of_client: getVal(data.name_of_site || data.name_of_client), // Handle key mismatch
        resource_calendar_id: getVal(data.resource_calendar_id),
        shift_roster_id: getVal(data.shift_roster_id),
        // country_id: getVal(data.country_id),
        // state_id: getVal(data.state_id),
        // district_id: getVal(data.district_id),
        country_id: cId,
        state_id: sId,
        district_id: getVal(data.district_id),
        department_id: getVal(data.department_id),
        job_id: getVal(data.job_id),
        // bank_account_id: getVal(data.bank_account_id),

        bank_id: getVal(bankDetails.bank_id),
        account_number: bankDetails.account_number || "",
        bank_iafc_code: bankDetails.bank_iafc_code || "",
        bank_swift_code: bankDetails.bank_swift_code || "",
        currency_id: bankDetails.currency_name || "INR",

        reporting_manager_id: getVal(data.reporting_manager_id),
        head_of_department_id: getVal(data.head_of_department_id),
        employment_type: data.employment_type
          ? data.employment_type.toLowerCase()
          : "permanent",
        employee_category: data.employee_category
          ? data.employee_category.toLowerCase()
          : "staff",
        attendance_capture_mode: data.attendance_capture_mode,

        // --- Handle numeric fields ---
        pin_code: data.pin_code === 0 ? "" : data.pin_code,
        probation_period: data.probation_period || 6,
        notice_period_days: data.notice_period_days || 0,
        in_probation:
          data.in_probation !== undefined ? data.in_probation : true,
        birthday: data.birthday || null,
        joining_date: data.joining_date || null,
        confirmation_date: data.confirmation_date || null,
        resignation_date: data.resignation_date || null,
        notice_period_end_date: data.notice_period_end_date || null,
        probation_end_date: data.probation_end_date || null,
        group_company_joining_date: data.group_company_joining_date || null,
        date_of_marriage: data.date_of_marriage || null,

        // --- Handle Files/Images ---
        // Keep them as null or existing strings; do not overwrite with File objects yet
        // image_1920: data.image_1920 || null,
        // driving_license: data.driving_license || null,
        // upload_passbook: data.upload_passbook || null,
        image_1920: imgUrl,
        driving_license: licenseUrl,
        upload_passbook: passbookUrl,
        latitude: data.latitude || "",
        longitude: data.longitude || "",

        random_code_for_reg: data.random_code_for_reg || "", // Pre-fill from API

        // Ensure device fields are also mapped if they weren't already
        device_id: data.device_id || "",
        device_unique_id: data.device_unique_id || "",
        device_name: data.device_name || "",
        system_version: data.system_version || "",
        ip_address: data.ip_address || "",
        device_platform: data.device_platform || "",
      });

      // let loadedGroupAccess: any[] = [];

      // const cleanGroupId = getVal(data.group_id);

      // if (cleanGroupId) {
      //   // Create the row using cleaned IDs
      //   loadedGroupAccess = [
      //     {
      //       group_id: cleanGroupId,
      //       approval_user_id: getVal(data.approval_user_id), // Extracts "41" from [41, "Name"]
      //       approval_sequance: data.approval_sequance || 0,
      //     },
      //   ];
      // }
      // // Fallback: If old array format exists (legacy support)
      // else if (
      //   data.group_access &&
      //   Array.isArray(data.group_access) &&
      //   data.group_access.length > 0
      // ) {
      //   loadedGroupAccess = data.group_access;
      // }

      // // If we found data, load it and fetch the users for the dropdowns
      // if (loadedGroupAccess.length > 0) {
      //   const loadInitialUsers = async () => {
      //     const newOptions: Record<string, Option[]> = { ...groupUserOptions };

      //     for (const line of loadedGroupAccess) {
      //       const gId = String(line.group_id);
      //       if (gId && !newOptions[gId]) {
      //         try {
      //           // Fetch Users so the dropdown shows the name "Abhigna Desai" instead of just ID
      //           const response = await getGroupUsers(gId);

      //           // Robust Extraction
      //           let userList: any[] = [];
      //           if (response?.data?.users) userList = response.data.users;
      //           else if (response?.data?.data?.users)
      //             userList = response.data.data.users;
      //           else if (response?.users) userList = response.users;
      //           else if (Array.isArray(response)) userList = response;

      //           newOptions[gId] = userList.map((u: any) => ({
      //             value: String(u.user_id || u.id),
      //             label: u.name || u.login,
      //           }));
      //         } catch (e) {
      //           console.error("Error loading group users for edit:", e);
      //         }
      //       }
      //     }
      //     setGroupUserOptions(newOptions);
      //     setGroupAccessLines(loadedGroupAccess);
      //   };
      //   loadInitialUsers();
      // } else {
      //   // Reset to default empty row if no group data found
      //   setGroupAccessLines([
      //     { group_id: "", approval_user_id: "", approval_sequance: 0 },
      //   ]);
      // }
      // --- GROUP ACCESS LOGIC START ---

      let loadedGroupAccess: any[] = [];

      // A. Check for NEW 'approvals' array (Matches your JSON)
      if (
        data.approvals &&
        Array.isArray(data.approvals) &&
        data.approvals.length > 0
      ) {
        loadedGroupAccess = data.approvals.map((item: any) => ({
          model: item.model || "leave",
          group_id: getVal(item.group_id),
          approval_user_id: getVal(item.approval_user_id),
          approval_sequance: item.approval_sequance || 0,
        }));
      }
      // B. Fallback: Check for legacy 'group_access' array
      else if (data.group_access && Array.isArray(data.group_access)) {
        loadedGroupAccess = data.group_access.map((item: any) => ({
          ...item,
          model: item.model || "leave",
          group_id: getVal(item.group_id),
          approval_user_id: getVal(item.approval_user_id),
        }));
      }
      // C. Fallback: Check for flat structure
      else {
        const cleanGroupId = getVal(data.group_id);
        if (cleanGroupId) {
          loadedGroupAccess = [
            {
              model: "leave",
              group_id: cleanGroupId,
              approval_user_id: getVal(data.approval_user_id),
              approval_sequance: data.approval_sequance || 0,
            },
          ];
        }
      }

      // Load Users for the Group Dropdowns
      if (loadedGroupAccess.length > 0) {
        const loadInitialUsers = async () => {
          const newOptions: Record<string, any[]> = { ...groupUserOptions };

          for (const line of loadedGroupAccess) {
            const gId = String(line.group_id);
            // Only fetch if we haven't loaded users for this group yet
            if (gId && gId !== "0" && !newOptions[gId]) {
              try {
                const response = await getGroupUsers(gId);
                // ... (Your existing user extraction logic) ...
                let userList: any[] = [];
                if (response?.data?.users) userList = response.data.users;
                else if (response?.users) userList = response.users;
                else if (Array.isArray(response)) userList = response;

                newOptions[gId] = userList.map((u: any) => ({
                  value: String(u.user_id || u.id),
                  label: u.name || u.login,
                }));
              } catch (e) {
                console.error("Error loading group users:", e);
              }
            }
          }
          setGroupUserOptions(newOptions);
          setGroupAccessLines(loadedGroupAccess);
        };
        loadInitialUsers();
      } else {
        // Default empty row
        setGroupAccessLines([
          {
            model: "leave",
            group_id: "",
            approval_user_id: "",
            approval_sequance: 0,
          },
        ]);
      }
      // 3. Set Visual Previews
      if (imgUrl) {
        setImgPreview(imgUrl);
      } else if (data.image_1920 && typeof data.image_1920 === "string") {
        const prefix = data.image_1920.startsWith("data:")
          ? ""
          : "data:image/png;base64,";
        setImgPreview(`${prefix}${data.image_1920}`);
      } else {
        setImgPreview(null);
      }
    }
  }, [data]);

  // Add this inside your component to watch for date changes
  useEffect(() => {
    if (formData.joining_date && formData.probation_period > 0) {
      const calculatedDate = dayjs(formData.joining_date)
        .add(Number(formData.probation_period), "month")
        .format("YYYY-MM-DD");

      if (formData.probation_end_date !== calculatedDate) {
        setFormData((prev: any) => ({
          ...prev,
          probation_end_date: calculatedDate,
          in_probation: true, // Automatically check if period > 0
        }));
      }
    } else if (Number(formData.probation_period) === 0) {
      // If period is 0, they are likely not in probation
      if (formData.in_probation) {
        setFormData((prev: any) => ({ ...prev, in_probation: false }));
      }
    }
  }, [formData.joining_date, formData.probation_period]);
  useEffect(() => {
    const loadMasterBanks = async () => {
      try {
        // 1. Fetch the data
        const bankDataRaw = await getBanks();

        // 2. Cast to 'any' to bypass the "Property does not exist" type error
        const bankResponse = bankDataRaw as any;

        // 3. Extract the array using multiple fallback paths
        const rawBanks =
          bankResponse?.banks ||
          bankResponse?.data ||
          (Array.isArray(bankResponse) ? bankResponse : []);

        // 4. Map to your dropdown format
        setBankMasterList(
          rawBanks.map((b: any) => ({
            value: String(b.id),
            label: b.name,
            swift: b.swift_code || "",
          })),
        );
      } catch (error) {
        console.error("Error loading banks:", error);
      }
    };
    loadMasterBanks();
  }, []);
  useEffect(() => {
    const modalElement = document.getElementById("add_employee_modal");
    const handleModalHidden = () => {
      resetForm();
      onClose();
    };

    modalElement?.addEventListener("hidden.bs.modal", handleModalHidden);

    // Cleanup the listener when the component unmounts
    return () => {
      modalElement?.removeEventListener("hidden.bs.modal", handleModalHidden);
    };
  }, [onClose]);

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

  const modelOptions = [
    { value: "leave", label: "Leave" },
    { value: "attendance", label: "Attendance" },
    { value: "expense", label: "Expense" },
  ];

  // Function to strip all non-alphabetical characters
  // Reusable function to strip numbers and symbols
  const handleAlphaOnlyChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
  ) => {
    // Regex: [^a-zA-Z\s] removes anything that is NOT a letter or a space
    const val = e.target.value.replace(/[^a-zA-Z\s]/g, "");

    setFormData((prev: any) => ({
      ...prev,
      [fieldName]: val,
    }));

    // Clear errors for this field as the user types
    if (errors[fieldName]) {
      setErrors((prev: any) => ({ ...prev, [fieldName]: "" }));
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
    // Passport Validation (Optional but must be valid format if filled)
    if (formData.passport_no) {
      // Standard format: 1 Letter + 7 Digits (Total 8)
      const passportRegex = /^[A-Z][0-9]{7}$/;

      if (formData.passport_no.length !== 8) {
        tempErrors.passport_no =
          "Passport number must be exactly 8 characters.";
        isValid = false;
      } else if (!passportRegex.test(formData.passport_no)) {
        tempErrors.passport_no =
          "Invalid format (Expected 1 letter followed by 7 digits).";
        isValid = false;
      }
    }
    // Voter ID Validation (if provided)
    if (formData.voter_id) {
      // Standard format: 3 Letters + 7 Digits
      const voterRegex = /^[A-Z]{3}[0-9]{7}$/;

      if (formData.voter_id.length !== 10) {
        tempErrors.voter_id = "Voter ID must be exactly 10 characters.";
        isValid = false;
      } else if (!voterRegex.test(formData.voter_id)) {
        tempErrors.voter_id =
          "Invalid format (Expected: 3 Letters followed by 7 Digits).";
        isValid = false;
      }
    }

    // PAN Validation (if provided)
    if (formData.pan_number) {
      // Regex: 5 letters + 4 digits + 1 letter
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

      if (formData.pan_number.length !== 10) {
        tempErrors.pan_number = "PAN number must be exactly 10 characters.";
        isValid = false;
      } else if (!panRegex.test(formData.pan_number)) {
        tempErrors.pan_number =
          "Invalid PAN format (Expected: 5 Letters, 4 Digits, 1 Letter).";
        isValid = false;
      }
    }
    // 2. Category - Mandatory
    // if (!formData.category) {
    //   tempErrors.category = "Employee category selection is required.";
    //   isValid = false;
    // }

    // // 3. Driving License - Mandatory (File)
    // if (!formData.driving_license) {
    //   tempErrors.driving_license = "Driving License document is required.";
    //   isValid = false;
    // }

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

    // // Mandatory: Marital Status
    // if (!formData.marital) {
    //   tempErrors.marital = "Marital status is required.";
    //   isValid = false;
    // }

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
        tempErrors.spouse_name = "Spouse name is required.";
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

    // 1. Present Address - MANDATORY
    if (!formData.present_address?.trim()) {
      tempErrors.present_address = "Present Address is required.";
      isValid = false;
    }

    // 2. Permanent Address - MANDATORY
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

    // const requiredFields = [
    //   { key: "department_id", label: "Department" },
    //   { key: "job_id", label: "Designation" },
    //   { key: "joining_date", label: "Joining Date" },
    //   { key: "employee_password", label: "Login Password" },
    //   { key: "status", label: "Status" },
    // ];

    // requiredFields.forEach((field) => {
    //   if (!formData[field.key]) {
    //     tempErrors[field.key] = `${field.label} is required.`;
    //     isValid = false;
    //   }
    // });

    // Department Validation
    if (!formData.department_id) {
      tempErrors.department_id = "Department is required.";
      isValid = false;
    }
    // Designation Validation
    if (!formData.job_id) {
      tempErrors.job_id = "Designation is required.";
      isValid = false;
    }

    if (formData.hold_status && !formData.hold_remarks?.trim()) {
      tempErrors.hold_remarks =
        "Please provide a reason for placing the employee on hold.";
      isValid = false;
    }
    if (!formData.employee_password?.trim()) {
      tempErrors.employee_password = "Login Password is required.";
      isValid = false;
    }
    if (!formData.joining_date) {
      tempErrors.joining_date = "Joining Date is required.";
      isValid = false;
    }
    setErrors((prev: any) => ({ ...prev, ...tempErrors }));
    return isValid;
  };

  // const validateBankingTab = () => {
  //   let tempErrors: any = {};
  //   let isValid = true;

  //   // Mandatory check: Bank Account
  //   if (!formData.bank_account_id) {
  //     tempErrors.bank_account_id =
  //       "Please select a bank account for payroll processing.";
  //     isValid = false;
  //   }

  //   setErrors((prev: any) => ({ ...prev, ...tempErrors }));
  //   return isValid;
  // };

  const validateBankingTab = () => {
    let tempErrors: any = {};
    let isValid = true;
    const accNumRegex = /^\d+$/; // Regex to allow only digits
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

    if (!formData.bank_id) {
      tempErrors.bank_id = "Bank selection is required.";
      isValid = false;
    }
    // Account Number Validation
    if (!formData.account_number?.toString().trim()) {
      tempErrors.account_number = "Account number is required.";
      isValid = false;
    } else if (!accNumRegex.test(formData.account_number)) {
      tempErrors.account_number =
        "Invalid account number. Only digits are allowed.";
      isValid = false;
    } else if (formData.account_number.length < 9) {
      // Only check for minimum length, as maxLength handles the top limit
      tempErrors.account_number = "Account number must be at least 9 digits.";
      isValid = false;
    } else if (
      formData.account_number.length < 9 ||
      formData.account_number.length > 18
    ) {
      tempErrors.account_number =
        "Account number should be between 9 and 18 digits.";
      isValid = false;
    }

    if (!formData.bank_iafc_code?.trim()) {
      tempErrors.bank_iafc_code = "IFSC Code is required.";
      isValid = false;
    } else if (formData.bank_iafc_code.length !== 11) {
      tempErrors.bank_iafc_code = "IFSC Code must be exactly 11 characters.";
      isValid = false;
    } else if (!ifscRegex.test(formData.bank_iafc_code)) {
      tempErrors.bank_iafc_code = "Invalid IFSC format (e.g., ABCD0123456).";
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
    // if (!formData.device_unique_id?.trim()) {
    //   tempErrors.device_unique_id = "Device Unique ID is required.";
    //   isValid = false;
    // }

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
    // if (!formData.pin) {
    //   tempErrors.pin = "Employee Access PIN is required.";
    //   isValid = false;
    // } else if (formData.pin.length < 4) {
    //   tempErrors.pin = "PIN must be at least 4 digits.";
    //   isValid = false;
    // }

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
      try {
        const data = await getBranches();
        const branchList = Array.isArray(data) ? data : [];

        const formattedBranches = branchList.map((b: any) => ({
          value: b.id.toString(),
          label: `${b.RegisteredCompnany} | ${b.address}`,
        }));

        setBranches(formattedBranches);
        // ✅ NEW: Set the first branch as default if we are adding a NEW employee
        if (!data && formattedBranches.length > 0 && !formData.name_of_client) {
          setFormData((prev: any) => ({
            ...prev,
            name_of_client: formattedBranches[0].value,
          }));
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
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
        policies.map((p: any) => ({ value: p.id, label: p.name })),
      );
      setWorkingSchedules(
        schedules.map((s: any) => ({ value: s.id, label: s.name })),
      );
    };
    fetchDropdownData();
  }, []);

  // useEffect(() => {
  //   const fetchAddressData = async () => {
  //     const [stateData, districtData] = await Promise.all([
  //       getStates(),
  //       getDistricts(),
  //     ]);
  //     setStates(
  //       stateData.map((s: any) => ({ value: s.id.toString(), label: s.name })),
  //     );
  //     setDistricts(
  //       districtData.map((d: any) => ({
  //         value: d.id.toString(),
  //         label: d.name,
  //       })),
  //     );
  //   };
  //   fetchAddressData();
  // }, []);

  // --- FETCH GROUPS ON LOAD ---
  // --- FETCH GROUPS ON LOAD (Robust & Debug Version) ---
  const loadStates = async (countryId: string) => {
    const data = await getStates(countryId);
    setStates(
      data.map((s: any) => ({ value: s.id.toString(), label: s.name })),
    );
  };

  const loadDistricts = async (countryId: string, stateId: string) => {
    const data = await getDistricts(countryId, stateId);
    setDistricts(
      data.map((d: any) => ({ value: d.id.toString(), label: d.name })),
    );
  };

  // Load initial states for India on mount
  useEffect(() => {
    loadStates("104");
  }, []);

  useEffect(() => {
    const fetchGroupsData = async () => {
      try {
        const response = await getApprovalGroups();

        // 1. Determine where the array is hiding
        let groupsList: any[] = [];
        if (Array.isArray(response)) {
          groupsList = response;
        } else if (response && Array.isArray(response.data)) {
          groupsList = response.data;
        } else if (response?.data?.data && Array.isArray(response.data.data)) {
          groupsList = response.data.data;
        }

        console.log("Groups Found:", groupsList.length);
        if (groupsList.length > 0) {
          // This log will tell you the EXACT keys your API is sending
          console.log("First Group Item Keys:", Object.keys(groupsList[0]));
        }

        // 2. Map with Fallbacks (Checks multiple naming conventions)
        const options = groupsList.map((g: any) => ({
          // Try group_id, then id, then _id
          value: String(g.group_id || g.id || g._id || ""),
          // Try group_name, then name, then groupName
          label: g.group_name || g.name || g.groupName || "Unknown Group",
        }));

        setGroupOptions(options);
      } catch (err) {
        console.error("Error setting group options", err);
      }
    };
    fetchGroupsData();
  }, []);

  // --- HANDLER: Fetch Users when Group is selected ---
  const handleGroupSelect = async (index: number, groupId: string) => {
    const list = [...groupAccessLines];
    list[index].group_id = groupId;
    list[index].approval_user_id = ""; // Reset user when group changes
    setGroupAccessLines(list);

    // 2. Fetch users for the selected group
    if (groupId) {
      // Check if we already have users for this group to save an API call
      if (groupUserOptions[groupId]) return;

      try {
        const response = await getGroupUsers(groupId);
        console.log("Group Users API Response:", response); // Debug log

        let userList: any[] = [];

        // --- FIXED EXTRACTION LOGIC ---
        // 1. Check specific path from your JSON: { data: { users: [...] } }
        if (response?.data?.users && Array.isArray(response.data.users)) {
          userList = response.data.users;
        }
        // 2. Fallback: Sometimes Axios wraps it (response.data.data.users)
        else if (
          response?.data?.data?.users &&
          Array.isArray(response.data.data.users)
        ) {
          userList = response.data.data.users;
        }
        // 3. Fallback: If response is just { users: [...] }
        else if (response?.users && Array.isArray(response.users)) {
          userList = response.users;
        }
        // 4. Old fallbacks just in case structure changes
        else if (Array.isArray(response)) {
          userList = response;
        } else if (Array.isArray(response?.data)) {
          userList = response.data;
        }

        console.log("Extracted User List:", userList);

        const userOpts = userList.map((u: any) => ({
          // USE CORRECT KEY: user_id
          value: String(u.user_id),
          label: u.name || u.login || "Unknown User",
        }));

        setGroupUserOptions((prev) => ({
          ...prev,
          [groupId]: userOpts,
        }));
      } catch (error) {
        console.error("Failed to load group users", error);
      }
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      const data = await getCountries();
      setCountries(
        data.map((c: any) => ({ value: c.id.toString(), label: c.name })),
      );
    };
    fetchCountries();
  }, []);

  // FIX: Updated Banking Data Loader to handle 'bank_name'
  useEffect(() => {
    const loadBankingData = async () => {
      try {
        const bankList = await getBanks();

        // Transform API response to { value, label }
        const formattedBanks = bankList.map((b: any) => ({
          value: String(b.id),
          // FIX: Check 'b.bank_name' first, then fall back to array check
          label: `${b.account_number} - ${
            b.bank_name ||
            (Array.isArray(b.bank_id) ? b.bank_id[1] : "Unknown Bank")
          }`,
        }));

        setBanks(formattedBanks);
      } catch (error) {
        console.error("Error loading banks:", error);
      }
    };

    loadBankingData();
  }, []);

  useEffect(() => {
    const fetchEmploymentData = async () => {
      try {
        const [
          bTypes,
          bLocs,
          depts,
          // jobs,
          wLocs,
          empList,
        ] = await Promise.all([
          getBusinessTypes(), // /employee/business-types
          getBusinessLocations(), // /employee/business-locations
          getDepartments(), // /api/department
          // getDesignations(), // /api/job/list
          getWorkLocations(), // /api/work-location
          getReportingManagers(), // /employee/employees
        ]);

        setBusinessTypes(
          bTypes.map((i: any) => ({ value: i.id.toString(), label: i.name })),
        );
        setBusinessLocations(
          bLocs.map((i: any) => ({ value: i.id.toString(), label: i.name })),
        );
        setDepartments(
          depts.map((i: any) => ({ value: i.id.toString(), label: i.name })),
        );
        // setDesignations(
        //   jobs.map((i: any) => ({
        //     value: String(i.job_id || i.id),
        //     label: i.name,
        //   })),
        // );
        setWorkLocations(
          wLocs.map((i: any) => ({ value: i.id.toString(), label: i.name })),
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

  const loadFilteredDesignations = async (deptId: string) => {
    try {
      const jobs = await getDesignations(deptId);
      setDesignations(
        jobs.map((i: any) => ({
          value: String(i.job_id || i.id),
          label: i.name,
        })),
      );
    } catch (error) {
      console.error("Error loading filtered designations:", error);
    }
  };

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

  // useEffect(() => {
  //   if (data) {
  //     setFormData(data);
  //     if (data.image) setImgPreview(data.image);
  //   }
  // }, [data]);

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

  const urlToBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Strip the data:image/jpeg;base64, prefix for the API
        resolve(base64String.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
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

  // Example of adding a new line
  // Example: When adding a new line
  const addGroupAccessLine = () => {
    setGroupAccessLines([
      ...groupAccessLines,
      {
        model: "leave", // Default to first option
        group_id: "",
        approval_user_id: "",
        approval_sequance: 0,
      },
    ]);
  };

  // --- HELPER: Define fields per tab for validation tracking ---
  const tabFieldsMap: { [key: string]: string[] } = {
    legal: ["aadhaar_number", "uan_number"], // Add other fields if mandatory
    personal: [
      "gender",
      "birthday",
      "blood_group",
      "work_phone",
      "private_email",
      "spouse_name",
      "date_of_marriage",
    ],
    address: ["present_address", "permanent_address"],
    emergency: [
      "emergency_contact_name",
      "emergency_contact_relation",
      "emergency_contact_mobile",
    ],
    employment: ["employee_password", "hold_remarks"],
    banking: ["bank_id", "account_number", "bank_iafc_code"],
    notice: ["type_of_sepration", "resignation_date", "notice_period_days"],
    // header fields (name, father_name) are always visible, so no tab mapping needed for them
  };

  const hasTabErrors = (tabName: string) => {
    if (!isSubmitted) return false;
    const currentTabFields = tabFieldsMap[tabName] || [];
    // Check if any field in this tab matches a key in the 'errors' object
    return currentTabFields.some((field) => errors[field]);
  };

  // Helper to get a list of readable names of invalid tabs
  const getInvalidTabs = () => {
    const invalidTabs: string[] = [];
    Object.keys(tabFieldsMap).forEach((key) => {
      if (hasTabErrors(key)) {
        // Capitalize first letter
        invalidTabs.push(key.charAt(0).toUpperCase() + key.slice(1));
      }
    });
    return invalidTabs;
  };

  // const hasTabErrors = (tabName: string) => {
  //   if (!isSubmitted) return false;
  //   const errorKeys = Object.keys(errors);

  //   const tabFields: { [key: string]: string[] } = {
  //     legal: ["aadhaar_number", "category", "driving_license", "uan_number"],
  //     personal: [
  //       "gender",
  //       "marital",
  //       "birthday",
  //       "blood_group",
  //       "work_phone",
  //       "private_email",
  //       "spouse_name",
  //     ],
  //     address: ["present_address", "permanent_address"],
  //     emergency: [
  //       "emergency_contact_name",
  //       "emergency_contact_relation",
  //       "emergency_contact_mobile",
  //     ],
  //     employment: [
  //       "department_id",
  //       "job_id",
  //       "joining_date",
  //       "employee_password",
  //       "status",
  //     ],
  //     banking: ["bank_account_id"],
  //     setting: ["pin"],
  //     device: ["device_id", "device_unique_id", "device_name"],
  //   };

  //   return errorKeys.some((key) => tabFields[tabName]?.includes(key));
  // };

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

  const handleLineChange = (index: number, field: string, value: any) => {
    const list = [...groupAccessLines];
    list[index][field] = value;
    setGroupAccessLines(list);
  };

  // ===================================Final Handle Submit ==============================================================================
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
      // settings: validateSettingsTab(),
      device: validateDeviceTab(), // Add this
    };

    // Check if every single tab is valid
    const isFormValid = Object.values(validations).every(
      (isValid) => isValid === true,
    );

    console.log("Validation Results:", validations);

    if (!isFormValid) {
      // --- UX IMPROVEMENT: AUTO-SWITCH TO ERROR TAB ---
      // Define the order of tabs as they appear in UI
      const tabOrder = [
        "legal",
        "personal",
        "address",
        "emergency",
        "employment",
        "banking",
        "notice",
        "setting",
      ];

      // Find the first tab that has an error
      const firstErrorTab = tabOrder.find((tab) => hasTabErrors(tab));

      if (firstErrorTab) {
        setActiveTab(firstErrorTab); // <--- Auto-switch!
      }

      // Generate a helpful message
      const invalidTabNames = getInvalidTabs();
      const message =
        invalidTabNames.length > 0
          ? `Please check errors in: ${invalidTabNames.join(", ")}`
          : "Required fields are missing. Please check the form.";

      toast.error(message);
      setShowErrorAlert(true);

      // Smooth scroll to top to see the alert
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
      const processToPayload = async (fieldValue: any) => {
        if (!fieldValue) return null;

        // Case A: New local file upload
        if (fieldValue instanceof File) {
          return await fileToBase64(fieldValue);
        }

        // Case B: Existing CDN URL - Fetch and convert to Base64
        if (typeof fieldValue === "string" && fieldValue.startsWith("http")) {
          try {
            const response = await fetch(fieldValue);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64String = reader.result as string;
                resolve(base64String.split(",")[1]); // Strip data prefix
              };
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          } catch (error) {
            console.error("URL to Base64 conversion failed:", error);
            return null;
          }
        }

        // Case C: Already a Base64 string
        return fieldValue.includes("base64,")
          ? fieldValue.split("base64,")[1]
          : fieldValue;
      };
      // Handle File Conversions (OCR/Document logic)
      // let licenseBase64 = null;
      // let passbookBase64 = null;
      // let imageBase64 = null;

      // if (formData.driving_license instanceof File) {
      //   // Case A: User uploaded a NEW file
      //   licenseBase64 = await processToPayload(formData.driving_license);
      // } else if (typeof formData.driving_license === "string") {
      //   // Case B: Keeping the EXISTING file from API (which is a base64 string)
      //   licenseBase64 = formData.driving_license;
      // }

      // if (formData.upload_passbook instanceof File) {
      //   passbookBase64 = await processToPayload(formData.upload_passbook);
      // } else if (typeof formData.upload_passbook === "string") {
      //   passbookBase64 = formData.upload_passbook;
      // }
      // if (formData.image_1920 instanceof File) {
      //   imageBase64 = await processToPayload(formData.image_1920);
      // } else if (typeof formData.image_1920 === "string") {
      //   // API often sends image with or without prefix, ensure we send raw base64 if needed
      //   // If your API expects RAW base64 (no 'data:image...'), strip it if present:
      //   const imgStr = formData.image_1920;
      //   imageBase64 = imgStr.includes("base64,")
      //     ? imgStr.split("base64,")[1]
      //     : imgStr;
      // }
      const [licenseBase64, passbookBase64, imageBase64] = await Promise.all([
        processToPayload(formData.driving_license),
        processToPayload(formData.upload_passbook),
        processToPayload(formData.image_1920),
      ]);
      const groupData = groupAccessLines.length > 0 ? groupAccessLines[0] : {};

      // 4. Construct Final Payload (Mapping values as per your API requirements)
      const finalPayload = {
        name: formData.name,
        father_name: formData.father_name,
        gender: formData.gender,
        birthday: formData.birthday
          ? dayjs(formData.birthday).format("YYYY-MM-DD")
          : null,
        blood_group: formData.blood_group,
        work_phone: formData.work_phone ? Number(formData.work_phone) : 0,
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
        timezone: formData.timezone,
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
        // bank_account_id: Number(formData.bank_account_id),
        bank_id: Number(formData.bank_id),
        account_number: formData.account_number,
        bank_iafc_code: formData.bank_iafc_code,
        bank_swift_code: formData.bank_swift_code,
        currency_id: formData.currency_id,
        reporting_manager_id: formData.reporting_manager_id
          ? Number(formData.reporting_manager_id)
          : null,
        head_of_department_id: formData.head_of_department_id
          ? Number(formData.head_of_department_id)
          : null,
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

        // ...(imageBase64 && { image_1920: imageBase64 }),
        // ...(licenseBase64 && { driving_license: licenseBase64 }),
        // ...(passbookBase64 && { upload_passbook: passbookBase64 }),
        name_of_site: Number(formData.name_of_client), // Specific API mapping
        Spouse_name: formData.spouse_name, // Capitalized as per your requirements

        device_id: formData.device_id,
        device_name: formData.device_name,
        device_platform: formData.device_platform,
        device_unique_id: formData.device_unique_id,
        ip_address: formData.ip_address,
        random_code_for_reg: formData.random_code_for_reg,
        system_version: formData.system_version,
        // client_user_id: getCurrentUserId(),
        // group_id: groupAccessLines.map((line) =>
        //   line.group_id ? Number(line.group_id) : 0,
        // ),
        // approval_user_id: groupAccessLines.map((line) =>
        //   line.approval_user_id ? Number(line.approval_user_id) : 0,
        // ),
        // approval_sequance: groupAccessLines.map((line) =>
        //   line.approval_sequance ? Number(line.approval_sequance) : 0,
        // ),
        // model: groupAccessLines.map((line) => line.model || "leave"),
        approvals: groupAccessLines.map((line) => ({
          group_id: Number(line.group_id || 0),
          approval_user_id: Number(line.approval_user_id || 0),
          approval_sequance: Number(line.approval_sequance || 0),
          model: line.model || "leave",
        })),
      };
      console.log(">>> Final Payload:", finalPayload);
      let response;
      if (data?.id) {
        response = await updateEmployee(data.id, finalPayload);
      } else {
        response = await addEmployee(finalPayload);
      }

      toast.success(
        data?.id
          ? "Employee updated successfully"
          : "Employee created successfully",
      );
      onSuccess();
      document.getElementById("close-emp-modal")?.click();
    } catch (err: any) {
      // console.error(">>> API Error:", err.response?.data || err.message);
      // toast.error(err.response?.data?.message || "Error processing request");
      if (err.response) {
        // backend ne response diya (400,500 etc)
        console.error(">>> Backend Error:", err.response.data);
        toast.error(err.response.data?.message || "Server Error");
      } else if (err.request) {
        // request gaya but response nahi aya (CORS / Network)
        console.error(">>> No Response from Server:", err.request);
        toast.error("Server not responding / CORS issue");
      } else {
        // axios config error
        console.error(">>> Axios Error:", err.message);
        toast.error(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal fade" id="add_employee_modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content bg-white border-0 shadow-lg">
            {/* UPDATED MODAL HEADER */}
            <div className="modal-header border-bottom bg-light py-2">
              <h5 className="modal-title fw-bold fs-15">
                <i className="ti ti-user-plus me-2 text-primary"></i>
                {data ? "Edit Employee" : "Add Employee"}
              </h5>
              <button
                type="button"
                id="close-emp-modal"
                className="btn-close"
                data-bs-dismiss="modal"
                onClick={resetForm}
              ></button>
            </div>
            <div className="modal-body">
              <form
                className={`needs-validation ${
                  validated ? "was-validated" : ""
                }`}
                noValidate
                onSubmit={handleSubmit}
              >
                {/* --- TOP SECTION (ALIGNED HEADER) --- */}
                <div className="row g-3 mb-4 bg-light p-3 rounded mx-0 align-items-xcenter border shadow-sm">
                  <div className="col-md-10">
                    <div className="row g-3">
                      {/* 1. Name - MANDATORY */}
                      <div className="col-md-4">
                        <label className="form-label fs-13 fw-bold">
                          Full Name <span className="text-danger">*</span>
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
                          placeholder="Enter Fullname here"
                          value={formData.name}
                          // onChange={(e) => {
                          //   setFormData({ ...formData, name: e.target.value });
                          //   if (errors.name) setErrors({ ...errors, name: "" });
                          // }}
                          onChange={(e) => handleAlphaOnlyChange(e, "name")}
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
                          // onChange={(e) => {
                          //   setFormData({
                          //     ...formData,
                          //     father_name: e.target.value,
                          //   });
                          //   if (errors.father_name)
                          //     setErrors({ ...errors, father_name: "" });
                          // }}
                          onChange={(e) =>
                            handleAlphaOnlyChange(e, "father_name")
                          }
                        />
                        {isSubmitted && errors.father_name && (
                          <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                            <i className="ti ti-info-circle me-1"></i>
                            {errors.father_name}
                          </div>
                        )}
                      </div>

                      {/* 3. Branch - MANDATORY */}
                      {/* <div className="col-md-4">
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
                      </div> */}
                      {/* 3. Branch - NOW OPTIONAL */}
                      <div className="col-md-4">
                        <label className="form-label fs-13 fw-bold">
                          Branch
                        </label>
                        {/* Removed validation border classes */}
                        <div>
                          <CommonSelect
                            options={branches}
                            placeholder="Select Branch"
                            defaultValue={branches.find(
                              (b) => b.value === formData.name_of_client,
                            )}
                            // value={
                            //   branches.find(
                            //     (b) =>
                            //       b.value === String(formData.name_of_client),
                            //   ) || null
                            // }
                            formatOptionLabel={(option: any) => {
                              // Split the combined label back into Company and Address
                              const [company, address] =
                                option.label.split(" | ");

                              return (
                                <div className="d-flex flex-column py-1">
                                  <span className="fw-bold fs-13 text-dark mb-1">
                                    {company}
                                  </span>
                                  {address && (
                                    <small
                                      className="text-muted fs-11 lh-sm"
                                      style={{ display: "block" }}
                                    >
                                      <i className="ti ti-map-pin me-1 text-dark"></i>
                                      {address}
                                    </small>
                                  )}
                                </div>
                              );
                            }}
                            onChange={(opt) => {
                              setFormData({
                                ...formData,
                                name_of_client: opt?.value || "",
                              });
                            }}
                          />
                        </div>
                      </div>
                      {/* 4. Attendance Policy - OPTIONAL */}
                      {/* <div className="col-md-4">
                        <label className="form-label fs-13">
                          Attendance Policy
                        </label>
                        <CommonSelect
                          options={attendancePolicies}
                          placeholder="Select Policy"
                          defaultValue={attendancePolicies.find(
                            (opt) =>
                              opt.value === formData.attendance_policy_id,
                          )}
                          onChange={(opt) =>
                            setFormData({
                              ...formData,
                              attendance_policy_id: opt?.value || "",
                            })
                          }
                        />
                      </div> */}

                      {/* 5. Employee Category - OPTIONAL */}
                      <div className="col-md-3">
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
                        <label className="form-label fs-13">
                          Working Hours
                        </label>
                        <CommonSelect
                          options={workingSchedules}
                          placeholder="Select Hours"
                          defaultValue={workingSchedules.find(
                            (opt) =>
                              opt.value === formData.resource_calendar_id,
                          )}
                          onChange={(opt) =>
                            setFormData({
                              ...formData,
                              resource_calendar_id: opt?.value || "",
                            })
                          }
                        />
                      </div>

                      {/* <div className="col-md-4">
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
                      </div> */}
                      <div className="col-md-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <label className="form-label fs-13 fw-bold text-dark">
                            Experience (Years)
                          </label>
                          {/* Dynamic Badge with better styling */}
                          <span
                            className="badge rounded-pill px-3 py-2"
                            style={{
                              backgroundColor: "rgba(228, 33, 40, 0.1)",
                              color: "#E42128",
                              fontSize: "12px",
                              border: "1px solid rgba(228, 33, 40, 0.2)",
                            }}
                          >
                            {formData.total_experiance || 0} Years
                          </span>
                        </div>

                        <div className="px-2" style={{ height: "50px" }}>
                          <Slider
                            min={0}
                            max={30}
                            step={1}
                            // Marks add a professional scale look
                            marks={{
                              0: "0",
                              10: "10",
                              20: "20",
                              30: "30+",
                            }}
                            tooltip={{
                              formatter: (value) => `${value} Years`,
                              open: true, // Keep tooltip visible for better UX
                            }}
                            value={Number(formData.total_experiance) || 0}
                            onChange={(val) =>
                              setFormData({
                                ...formData,
                                total_experiance: val.toString(),
                              })
                            }
                            styles={{
                              track: { backgroundColor: "#E42128" },
                              handle: {
                                borderColor: "#E42128",
                                backgroundColor: "#fff",
                                width: "16px",
                                height: "16px",
                                marginTop: "-6px",
                              },
                            }}
                          />
                        </div>
                      </div>

                      {/* 7. Shift Roster - OPTIONAL */}
                      {/* <div className="col-md-3">
                        <label className="form-label fs-13">Shift Roster</label>
                        <CommonSelect
                          options={shiftRosters}
                          placeholder="Select Roster"
                          defaultValue={shiftRosters.find(
                            (opt) => opt.value === formData.shift_roster_id,
                          )}
                          onChange={(opt) =>
                            setFormData({
                              ...formData,
                              shift_roster_id: opt?.value || "",
                            })
                          }
                        />
                      </div> */}

                      {/* 8. Timezone - OPTIONAL */}
                      {/* <div className="col-md-3">
                        <label className="form-label fs-13">Timezone</label>
                        <CommonSelect
                          options={timezones}
                          placeholder="Select Timezone"
                          defaultValue={timezones.find(
                            (opt) => opt.value === formData.timezone,
                          )}
                          onChange={(opt) =>
                            setFormData({
                              ...formData,
                              timezone: opt?.value || "",
                            })
                          }
                        />
                      </div> */}

                      {/* 9. Geo Tracking - OPTIONAL */}
                      {/* <div className="col-md-3 d-flex align-items-center mt-4">
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
                      </div> */}
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
                {/* <div className="employee-tabs-scrollable border-bottom mb-3">
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
                      "Group Access",
                    ].map((tab) => (
                      <li className="nav-item" key={tab}>
                        <button
                          className={`nav-link fw-medium ${
                            activeTab === tab.toLowerCase() ? "active" : ""
                          }`}
                          onClick={() =>
                            setActiveTab(tab.toLowerCase().replace(" ", "_"))
                          }
                          type="button"
                        >
                          {/* {tab === "Legal"
                            ? "Legal / Identification"
                            : tab + " Information"} */}

                {/* {tab === "Legal"
                            ? "Legal / Identification"
                            : tab === "Group Access"
                              ? "Group Access"
                              : tab + " Information"}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div> */}
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
                      // "Setting",
                      "Device",
                      "Group Access",
                    ].map((tabLabel) => {
                      // Convert label "Group Access" -> key "group_access"
                      const tabKey = tabLabel.toLowerCase().replace(" ", "_");
                      const isError = hasTabErrors(tabKey);

                      return (
                        <li className="nav-item" key={tabKey}>
                          <button
                            className={`nav-link fw-medium d-flex align-items-center ${
                              activeTab === tabKey ? "active" : ""
                            } ${isError ? "text-danger border-danger-subtle bg-danger-subtle" : ""}`}
                            onClick={() => setActiveTab(tabKey)}
                            type="button"
                            style={
                              isError ? { borderBottomColor: "#dc3545" } : {}
                            }
                          >
                            {/* Tab Label */}
                            {tabLabel === "Legal"
                              ? "Legal / Identification"
                              : tabLabel === "Device"
                                ? "Mobile App Device" // Changed from "Device Information"
                                : tabLabel === "Group Access"
                                  ? "Group Access"
                                  : tabLabel + " Information"}

                            {/* Error Icon Indicator */}
                            {isError && (
                              <i
                                className="ti ti-alert-circle-filled ms-2 fs-16 animate__animated animate__pulse animate__infinite"
                                title="Contains Errors"
                              ></i>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* --- TABS CONTENT --- */}
                <div
                  className="tab-content bg-white"
                  style={{ minHeight: "130px" }}
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
                          <div className="col-md-3">
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
                                setFormData({
                                  ...formData,
                                  aadhaar_number: val,
                                });
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

                          {/* PAN Number - OPTIONAL (Validated) */}
                          <div className="col-md-3">
                            <label className="form-label fs-13">
                              PAN Number
                            </label>
                            <input
                              type="text"
                              className={`form-control text-uppercase ${
                                isSubmitted
                                  ? errors.pan_number
                                    ? "is-invalid"
                                    : formData.pan_number
                                      ? "is-valid"
                                      : ""
                                  : ""
                              }`}
                              maxLength={10}
                              placeholder="ABCDE1234F"
                              value={formData.pan_number}
                              onChange={(e) => {
                                // Force uppercase and remove anything that isn't a letter or number
                                const val = e.target.value
                                  .toUpperCase()
                                  .replace(/[^A-Z0-9]/g, "");
                                setFormData({ ...formData, pan_number: val });

                                // Clear error as user types
                                if (errors.pan_number) {
                                  setErrors((prev: any) => ({
                                    ...prev,
                                    pan_number: "",
                                  }));
                                }
                              }}
                            />
                            {isSubmitted && errors.pan_number && (
                              <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                                <i className="ti ti-info-circle me-1"></i>
                                {errors.pan_number}
                              </div>
                            )}
                          </div>

                          {/* Voter ID - OPTIONAL */}
                          <div className="col-md-3">
                            <label className="form-label fs-13">Voter ID</label>
                            <input
                              type="text"
                              className={`form-control text-uppercase ${
                                isSubmitted && errors.voter_id
                                  ? "is-invalid"
                                  : isSubmitted &&
                                      formData.voter_id &&
                                      !errors.voter_id
                                    ? "is-valid"
                                    : ""
                              }`}
                              placeholder="e.g. ABC1234567"
                              maxLength={10}
                              value={formData.voter_id}
                              onChange={(e) => {
                                // Force uppercase and remove special characters
                                const val = e.target.value
                                  .toUpperCase()
                                  .replace(/[^A-Z0-9]/g, "");
                                setFormData({ ...formData, voter_id: val });

                                if (errors.voter_id) {
                                  setErrors((prev: any) => ({
                                    ...prev,
                                    voter_id: "",
                                  }));
                                }
                              }}
                            />
                            {isSubmitted && errors.voter_id && (
                              <div className="invalid-feedback animate__animated animate__fadeIn">
                                {errors.voter_id}
                              </div>
                            )}
                          </div>

                          {/* Passport No - OPTIONAL */}
                          <div className="col-md-3">
                            <label className="form-label fs-13">
                              Passport No
                            </label>
                            <input
                              type="text"
                              maxLength={8}
                              className={`form-control text-uppercase ${
                                isSubmitted && errors.passport_no
                                  ? "is-invalid"
                                  : ""
                              }`}
                              placeholder="e.g. A1234567"
                              value={formData.passport_no}
                              onChange={(e) => {
                                // Convert to uppercase and remove non-alphanumeric characters
                                const val = e.target.value
                                  .toUpperCase()
                                  .replace(/[^A-Z0-9]/g, "");
                                setFormData({ ...formData, passport_no: val });

                                if (errors.passport_no) {
                                  setErrors((prev: any) => ({
                                    ...prev,
                                    passport_no: "",
                                  }));
                                }
                              }}
                            />
                            {isSubmitted && errors.passport_no && (
                              <div className="invalid-feedback animate__animated animate__fadeIn">
                                {errors.passport_no}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <hr className="my-3 opacity-25" />

                      {/* --- Section 2: Social Security & Welfare --- */}

                      <div className="form-section mb-4">
                        <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                          <i className="ti ti-shield-check fs-18 me-2"></i>{" "}
                          Statutory Compliance
                        </h6>
                        <div className="row g-3">
                          <div className="col-md-2">
                            <label className="form-label fs-13">Category</label>
                            <div className="">
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
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <label className="form-label fs-13">
                              ESI Number
                            </label>
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

                          <div className="col-md-2 d-flex align-items-center">
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

                          <div className="col-md-3">
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

                          <div className="col-md-2">
                            <label className="form-label fs-12 mb-1 text-truncate">
                              License Copy
                            </label>
                            <div className="d-flex align-items-center gap-1">
                              {/* Minimalist Upload Button */}
                              <div className="position-relative">
                                <label
                                  className={`btn btn-icon btn-xs mb-0 ${formData.driving_license ? "btn-soft-success" : "btn-soft-primary"} border-dashed`}
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "6px",
                                  }}
                                  title="Upload License"
                                >
                                  <i
                                    className={`ti ${formData.driving_license ? "ti-file-check" : "ti-upload"} fs-16`}
                                  ></i>
                                  <input
                                    type="file"
                                    className="position-absolute opacity-0 w-100 h-100 start-0 top-0"
                                    style={{ cursor: "pointer" }}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0] || null;
                                      setFormData({
                                        ...formData,
                                        driving_license: file,
                                      });
                                    }}
                                  />
                                </label>
                              </div>

                              {/* Small Status Indicators */}
                              {formData.driving_license && (
                                <div className="d-flex align-items-center animate__animated animate__fadeIn">
                                  {/* Existing file: View Icon */}
                                  {typeof formData.driving_license ===
                                    "string" && (
                                    <a
                                      href={formData.driving_license}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="btn btn-icon btn-xs btn-ghost-info"
                                      title="View Existing"
                                    >
                                      <i className="ti ti-eye fs-16"></i>
                                    </a>
                                  )}

                                  {/* New file: Checkmark indicator */}
                                  {formData.driving_license instanceof File && (
                                    <div className="ms-1" title="File selected">
                                      <i className="ti ti-circle-check-filled text-success fs-16"></i>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* <hr className="my-3 opacity-25" /> */}

                      {/* --- Section 3: Classification & Verification --- */}
                      {/* <div className="form-section">
                        <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                          <i className="ti ti-file-upload fs-18 me-2"></i>{" "}
                          Verification Documents
                        </h6>
                        <div className="row g-3"> */}
                      {/* <div className="col-md-6">
                                <label className="form-label fs-13">Category</label>
                                <div className="">
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
                                    }}
                                  />
                                </div>
                              </div> */}

                      {/* Driving License Upload - NOW OPTIONAL */}
                      {/* <div className="col-md-6">
                                <label className="form-label fs-13">
                                  Driving License (Copy)
                                </label>
                                <div className="upload-box border rounded p-1 bg-white">
                                  <input
                                    type="file"
                                    className="form-control border-0 shadow-none"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0] || null;
                                      setFormData({
                                        ...formData,
                                        driving_license: file,
                                      });
                                    }}
                                  />
                                </div>
                                {formData.driving_license && (
                                  <div className="text-success fs-11 mt-1">
                                    <i className="ti ti-check me-1"></i>Document
                                    attached: {formData.driving_license.name}
                                  </div>
                                )}
                              </div> */}
                      {/* ================================================================Last Changes */}
                      {/* <div className="col-md-4">
                                <label className="form-label fs-13">
                                  Driving License (Copy)
                                </label>
                                <div className="upload-box border rounded p-1 bg-white">
                                  <input
                                    type="file"
                                    className="form-control border-0 shadow-none"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0] || null;
                                      setFormData({
                                        ...formData,
                                        driving_license: file,
                                      });
                                    }}
                                  />
                                </div>
                                {typeof formData.driving_license === "string" && (
                                  <div className="mt-2">
                                    <a
                                      href={formData.driving_license}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="btn btn-xs btn-outline-success"
                                    >
                                      <i className="ti ti-eye me-1"></i> View
                                      Existing License
                                    </a>
                                  </div>
                                )}

                                {/* {typeof formData.driving_license === "string" &&
                                  formData.driving_license.length > 0 && (
                                    <div className="mt-2 p-2 bg-soft-success text-success rounded fs-12 d-flex align-items-center">
                                      <i className="ti ti-check-circle me-2 fs-16"></i>
                                      <span>
                                        Existing License Document Uploaded
                                      </span>
                                    </div>
                                  )} 

                                {formData.driving_license instanceof File && (
                                  <div className="text-success fs-11 mt-1">
                                    <i className="ti ti-check me-1"></i>New File:{" "}
                                    {formData.driving_license.name}
                                  </div>
                                )}
                              </div> */}
                      {/* =============================================================================Last changes */}
                      {/* </div>
                      </div> */}
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
                          <div className="col-md-2">
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

                          {/* <div className="col-md-4">
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
                          </div> */}

                          {/* Marital Status */}
                          <div className="col-md-3">
                            <label className="form-label fs-13">
                              Marital Status
                            </label>
                            <div>
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
                                }}
                              />
                            </div>
                          </div>

                          {/* Conditional Spouse Fields */}
                          {formData.marital === "married" && (
                            <>
                              <div className="col-md-3 animate__animated animate__fadeInDown">
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
                                  onChange={(e) => {
                                    setFormData({
                                      ...formData,
                                      spouse_name: e.target.value,
                                    });
                                    if (errors.spouse_name)
                                      setErrors({ ...errors, spouse_name: "" });
                                  }}
                                />
                                {isSubmitted && errors.spouse_name && (
                                  <div className="invalid-feedback">
                                    {errors.spouse_name}
                                  </div>
                                )}
                              </div>
                              <div className="col-md-2 animate__animated animate__fadeInDown">
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
                                  onChange={(_, dateStr) => {
                                    setFormData({
                                      ...formData,
                                      date_of_marriage: dateStr,
                                    });
                                    if (errors.date_of_marriage)
                                      setErrors({
                                        ...errors,
                                        date_of_marriage: "",
                                      });
                                  }}
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
                          <div className="col-md-2">
                            <label className="form-label fs-13">
                              Date of Birth{" "}
                              <span className="text-danger">*</span>
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
                          <div className="col-md-2">
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

                          {/* Gender - MANDATORY */}
                          <div className="col-md-3">
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
                        </div>
                      </div>

                      <hr className="my-2 opacity-25" />

                      {/* Section 2: Education (Optional) */}
                      <div className="form-section mb-4">
                        <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                          <i className="ti ti-school fs-18 me-2"></i> Education
                          & Experience
                        </h6>
                        <div className="row g-3">
                          <div className="col-md-3">
                            <label className="form-label fs-13">
                              Post Graduation
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="MBA, etc."
                              value={formData.name_of_post_graduation}
                              // onChange={(e) =>
                              //   setFormData({
                              //     ...formData,
                              //     name_of_post_graduation: e.target.value,
                              //   })
                              // }
                              onChange={(e) =>
                                handleAlphaOnlyChange(
                                  e,
                                  "name_of_post_graduation",
                                )
                              }
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label fs-13">
                              University Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.name_of_any_other_education}
                              // onChange={(e) =>
                              //   setFormData({
                              //     ...formData,
                              //     name_of_any_other_education: e.target.value,
                              //   })
                              // }
                              onChange={(e) =>
                                handleAlphaOnlyChange(
                                  e,
                                  "name_of_any_other_education",
                                )
                              }
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label fs-12 mb-1 text-truncate">
                              CV / Resume Attachment
                            </label>
                            <div className="d-flex align-items-center gap-1">
                              {/* Minimalist Upload Button */}
                              <div className="position-relative">
                                <label
                                  className={`btn btn-icon btn-xs mb-0 ${formData.cv_file ? "btn-soft-success" : "btn-soft-primary"} border-dashed`}
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "6px",
                                  }}
                                  title="Upload CV"
                                >
                                  <i
                                    className={`ti ${formData.cv_file ? "ti-file-text" : "ti-upload"} fs-16`}
                                  ></i>
                                  <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="position-absolute opacity-0 w-100 h-100 start-0 top-0"
                                    style={{ cursor: "pointer" }}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0] || null;
                                      setFormData({
                                        ...formData,
                                        cv_file: file,
                                      });
                                    }}
                                  />
                                </label>
                              </div>

                              {/* File Status Indicator */}
                              {formData.cv_file && (
                                <div className="d-flex align-items-center animate__animated animate__fadeIn">
                                  {/* If it's a new local file */}
                                  {formData.cv_file instanceof File && (
                                    <div
                                      className="ms-1 d-flex align-items-center"
                                      title={formData.cv_file.name}
                                    >
                                      <i className="ti ti-circle-check-filled text-success fs-16 me-1"></i>
                                      <span
                                        className="fs-10 text-muted text-truncate"
                                        style={{ maxWidth: "80px" }}
                                      >
                                        {formData.cv_file.name}
                                      </span>
                                    </div>
                                  )}

                                  {/* If it's an existing URL (for Edit mode) */}
                                  {typeof formData.cv_file === "string" && (
                                    <a
                                      href={formData.cv_file}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="btn btn-icon btn-xs btn-ghost-info"
                                      title="View Current CV"
                                    >
                                      <i className="ti ti-eye fs-16"></i>
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="mt-1">
                              <span className="fs-10 text-muted">
                                Supports PDF, DOCX (Max 5MB)
                              </span>
                            </div>
                          </div>
                          {/* <div className="col-md-4">
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
                          </div> */}
                        </div>
                      </div>

                      <hr className="my-2 opacity-25" />

                      {/* Section 3: Background & Contact - MANDATORY FIELDS */}
                      <div className="form-section">
                        <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                          <i className="ti ti-address-book fs-18 me-2"></i>{" "}
                          Contact Details
                        </h6>
                        <div className="row g-3">
                          {/* Mobile - MANDATORY - FIX: Added error clearing */}
                          <div className="col-md-2">
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
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    work_phone: e.target.value.replace(
                                      /\D/g,
                                      "",
                                    ),
                                  });
                                  // Clear error immediately on type
                                  if (errors.work_phone) {
                                    setErrors({ ...errors, work_phone: "" });
                                  }
                                }}
                              />
                            </div>
                            {isSubmitted && errors.work_phone && (
                              <div className="text-danger fs-11 mt-1">
                                {errors.work_phone}
                              </div>
                            )}
                          </div>

                          {/* Email - MANDATORY - FIX: Added error clearing */}
                          <div className="col-md-3">
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
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  private_email: e.target.value,
                                });
                                // Clear error immediately on type
                                if (errors.private_email) {
                                  setErrors({ ...errors, private_email: "" });
                                }
                              }}
                            />
                            {isSubmitted && errors.private_email && (
                              <div className="text-danger fs-11 mt-1">
                                {errors.private_email}
                              </div>
                            )}
                          </div>

                          <div className="col-md-2">
                            <label className="form-label fs-13">
                              Secondary Mobile
                            </label>
                            <div className="input-group">
                              {/* Matching prefix from Primary Mobile */}
                              <span className="input-group-text fs-12 bg-light">
                                +91
                              </span>
                              <input
                                type="text"
                                className={`form-control ${
                                  isSubmitted &&
                                  formData.mobile_phone &&
                                  !errors.mobile_phone
                                    ? "is-valid"
                                    : ""
                                }`}
                                maxLength={10}
                                placeholder="Mobile No."
                                value={formData.mobile_phone}
                                onChange={(e) => {
                                  // Sanitize to digits only
                                  const val = e.target.value.replace(/\D/g, "");
                                  setFormData({
                                    ...formData,
                                    mobile_phone: val,
                                  });
                                }}
                              />
                            </div>
                            {/* Optional: Add validation if you decide to make it mandatory later */}
                            {isSubmitted && errors.mobile_phone && (
                              <div className="text-danger fs-11 mt-1">
                                {errors.mobile_phone}
                              </div>
                            )}
                          </div>

                          <div className="col-md-2">
                            <label className="form-label fs-13">Religion</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.religion}
                              onChange={(e) =>
                                handleAlphaOnlyChange(e, "religion")
                              }
                              // onChange={(e) =>
                              //   setFormData({
                              //     ...formData,
                              //     religion: e.target.value,
                              //   })
                              // }
                            />
                          </div>

                          {/* <div className="col-md-4">
                            <label className="form-label fs-13">
                              Upload Passbook
                            </label>
                            <div className="upload-box border rounded p-1 bg-white">
                              <input
                                type="file"
                                className="form-control border-0 shadow-none"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    upload_passbook:
                                      e.target.files?.[0] || null,
                                  })
                                }
                              />
                            </div>
                            <div className="mt-1 d-flex align-items-center text-info">
                              <i className="ti ti-info-circle fs-14 me-1"></i>
                              <span className="fs-11 fw-medium">
                                Please upload the <strong>front page</strong>{" "}
                                only (showing A/C holder name & details).
                              </span>
                            </div>
                            {/* Show Existing File Indicator */}
                          {/* {typeof formData.upload_passbook === "string" &&
                              formData.upload_passbook.length > 0 && (
                                <div className="mt-2 p-2 bg-soft-success text-success rounded fs-12 d-flex align-items-center">
                                  <i className="ti ti-check-circle me-2 fs-16"></i>
                                  <span>Passbook Uploaded</span>
                                </div>
                              )} 

                            {typeof formData.upload_passbook === "string" && (
                              <div className="mt-2">
                                <a
                                  href={formData.upload_passbook}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-xs btn-outline-success"
                                >
                                  <i className="ti ti-eye me-1"></i> View
                                  Uploaded Passbook
                                </a>
                              </div>
                            )}
                          </div> */}

                          <div className="col-md-3">
                            <label className="form-label fs-12 mb-1 text-truncate">
                              Passbook Copy
                            </label>
                            <div className="d-flex align-items-center gap-1">
                              {/* Minimalist Upload Button */}
                              <div className="position-relative">
                                <label
                                  className={`btn btn-icon btn-xs mb-0 ${formData.upload_passbook ? "btn-soft-success" : "btn-soft-primary"} border-dashed`}
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "6px",
                                  }}
                                >
                                  <i
                                    className={`ti ${formData.upload_passbook ? "ti-book" : "ti-upload"} fs-16`}
                                  ></i>
                                  <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    className="position-absolute opacity-0 w-100 h-100 start-0 top-0"
                                    style={{ cursor: "pointer" }}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0] || null;
                                      setFormData({
                                        ...formData,
                                        upload_passbook: file,
                                      });
                                    }}
                                  />
                                </label>
                              </div>

                              {/* Small Status Indicators */}
                              {formData.upload_passbook && (
                                <div className="d-flex align-items-center animate__animated animate__fadeIn">
                                  {/* Existing file: View Icon */}
                                  {typeof formData.upload_passbook ===
                                    "string" && (
                                    <a
                                      href={formData.upload_passbook}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="btn btn-icon btn-xs btn-ghost-info"
                                      title="View Existing Passbook"
                                    >
                                      <i className="ti ti-eye fs-16"></i>
                                    </a>
                                  )}

                                  {/* New file: Checkmark indicator */}
                                  {formData.upload_passbook instanceof File && (
                                    <div
                                      className="ms-1"
                                      title={`File selected: ${formData.upload_passbook.name}`}
                                    >
                                      <i className="ti ti-circle-check-filled text-success fs-16"></i>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* IMPORTANT: Added back the instructional text from your original requirement */}
                            <div
                              className="mt-1 d-flex align-items-start text-info"
                              style={{ lineHeight: "1.2" }}
                            >
                              <i className="ti ti-info-circle fs-12 me-1 mt-1"></i>
                              <span className="fs-10 fw-medium">
                                Upload <strong>front page</strong> only (A/C
                                holder name & details).
                              </span>
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
                                  setErrors({
                                    ...errors,
                                    permanent_address: "",
                                  });
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

                      <hr className="my-2 opacity-25" />

                      {/* --- Section 2: Regional Geography (ALL OPTIONAL) --- */}
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
                              className="form-control"
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

                          {/* Country - OPTIONAL */}
                          <div className="col-md-3">
                            <label className="form-label fs-13">Country</label>
                            <CommonSelect
                              options={countries}
                              placeholder="Select Country"
                              // defaultValue={countries.find(
                              //   (c) => c.value === String(formData.country_id),
                              // )}
                              defaultValue={countries.find(
                                (c) => c.value === "104",
                              )}
                              // onChange={(opt) =>
                              //   setFormData({
                              //     ...formData,
                              //     country_id: opt?.value || "",
                              //   })
                              // }
                              onChange={(opt) => {
                                const countryId = opt?.value || "";
                                setFormData({
                                  ...formData,
                                  country_id: countryId,
                                  state_id: "",
                                  district_id: "",
                                });
                                loadStates(countryId); // Fetch states for new country
                              }}
                            />
                          </div>

                          {/* State - OPTIONAL */}
                          <div className="col-md-3">
                            <label className="form-label fs-13">State</label>
                            <CommonSelect
                              key={`state-${formData.country_id}`}
                              options={states}
                              placeholder="Select State"
                              defaultValue={states.find(
                                (s) => s.value === String(formData.state_id),
                              )}
                              // onChange={(opt) =>
                              //   setFormData({
                              //     ...formData,
                              //     state_id: opt?.value || "",
                              //   })
                              // }
                              onChange={(opt) => {
                                const stateId = opt?.value || "";
                                setFormData({
                                  ...formData,
                                  state_id: stateId,
                                  district_id: "",
                                });
                                loadDistricts(
                                  formData.country_id || "104",
                                  stateId,
                                ); // Fetch cities for new state
                              }}
                            />
                          </div>

                          {/* District - OPTIONAL */}
                          <div className="col-md-3">
                            <label className="form-label fs-13">District</label>
                            <CommonSelect
                              key={`city-${formData.state_id}`}
                              options={districts}
                              placeholder="Select City/District"
                              defaultValue={districts.find(
                                (d) => d.value === String(formData.district_id),
                              )}
                              // onChange={(opt) =>
                              //   setFormData({
                              //     ...formData,
                              //     district_id: opt?.value || "",
                              //   })
                              // }
                              onChange={(opt) =>
                                setFormData({
                                  ...formData,
                                  district_id: opt?.value || "",
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
                          <div className="col-md-3">
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
                              // onChange={(e) => {
                              //   setFormData({
                              //     ...formData,
                              //     emergency_contact_name: e.target.value,
                              //   });
                              //   if (errors.emergency_contact_name)
                              //     setErrors({
                              //       ...errors,
                              //       emergency_contact_name: "",
                              //     });
                              // }}
                              onChange={(e) =>
                                handleAlphaOnlyChange(
                                  e,
                                  "emergency_contact_name",
                                )
                              }
                            />
                            {isSubmitted && errors.emergency_contact_name && (
                              <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                                <i className="ti ti-info-circle me-1"></i>
                                {errors.emergency_contact_name}
                              </div>
                            )}
                          </div>

                          {/* Relation - MANDATORY */}
                          <div className="col-md-3">
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
                              // onChange={(e) => {
                              //   setFormData({
                              //     ...formData,
                              //     emergency_contact_relation: e.target.value,
                              //   });
                              //   if (errors.emergency_contact_relation)
                              //     setErrors({
                              //       ...errors,
                              //       emergency_contact_relation: "",
                              //     });
                              // }}
                              onChange={(e) =>
                                handleAlphaOnlyChange(
                                  e,
                                  "emergency_contact_relation",
                                )
                              }
                            />
                            {isSubmitted &&
                              errors.emergency_contact_relation && (
                                <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                                  <i className="ti ti-info-circle me-1"></i>
                                  {errors.emergency_contact_relation}
                                </div>
                              )}
                          </div>

                          {/* Mobile Number - MANDATORY */}
                          <div className="col-md-3">
                            <label className="form-label fs-13">
                              Mobile Number{" "}
                              <span className="text-danger">*</span>
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
                                isSubmitted &&
                                formData.emergency_contact_address
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
                          Please ensure the contact details provided are
                          accurate for use in case of emergencies.
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
                          {/* Department - OPTIONAL */}
                          <div className="col-md-2">
                            <label className="form-label fs-13">
                              Department <span className="text-danger">*</span>
                            </label>
                            <div>
                              <CommonSelect
                                options={departments}
                                placeholder="Select Department"
                                defaultValue={departments.find(
                                  (o) =>
                                    o.value === String(formData.department_id),
                                )}
                                // onChange={(opt) => {
                                //   setFormData({
                                //     ...formData,
                                //     department_id: opt?.value || "",
                                //   });
                                // }}
                                onChange={(opt) => {
                                  const deptId = opt?.value || "";
                                  setFormData({
                                    ...formData,
                                    department_id: deptId,
                                    job_id: "", // 1. Reset Designation when Department changes
                                  });

                                  if (deptId) {
                                    loadFilteredDesignations(deptId); // 2. Fetch new Designations
                                  } else {
                                    setDesignations([]); // Clear list if no department
                                  }
                                }}
                              />
                            </div>
                            {isSubmitted && errors.department_id && (
                              <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                                <i className="ti ti-info-circle me-1"></i>
                                {errors.department_id}
                              </div>
                            )}
                          </div>

                          {/* Designation - OPTIONAL */}
                          <div className="col-md-3">
                            <label className="form-label fs-13">
                              Designation <span className="text-danger">*</span>
                            </label>
                            <div>
                              <CommonSelect
                                key={`designation-list-${designations.length}-${formData.job_id}`}
                                options={designations}
                                placeholder={
                                  formData.department_id
                                    ? "Select Designation"
                                    : "Select Department First"
                                }
                                defaultValue={designations.find(
                                  (o) => o.value === String(formData.job_id),
                                )}
                                disabled={!formData.department_id}
                                onChange={(opt) => {
                                  setFormData({
                                    ...formData,
                                    job_id: opt?.value || "",
                                  });
                                }}
                              />
                            </div>
                            {isSubmitted && errors.job_id && (
                              <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                                <i className="ti ti-info-circle me-1"></i>
                                {errors.job_id}
                              </div>
                            )}
                          </div>
                          {/* 
                          <div className="col-md-2">
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
                                (opt) => opt.value === formData.employment_type,
                              )}
                              onChange={(opt) =>
                                setFormData({
                                  ...formData,
                                  employment_type: opt?.value || "",
                                })
                              }
                            />
                          </div> */}
                          {/* Employee Password - MANDATORY */}
                          <div className="col-md-3">
                            <label className="form-label fs-13">
                              Login Password{" "}
                              <span className="text-danger">*</span>
                            </label>

                            {/* WRAPPER: input-group handles the button positioning */}
                            <div className="input-group">
                              <input
                                // DYNAMIC TYPE: Switches between text and password
                                type={showPassword ? "text" : "password"}
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
                                  if (errors.employee_password) {
                                    setErrors({
                                      ...errors,
                                      employee_password: "",
                                    });
                                  }
                                }}
                              />

                              {/* TOGGLE BUTTON */}
                              <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ border: "1px solid #ced4da" }} // Optional: matches default input border
                              >
                                <i
                                  className={`ti ${showPassword ? "ti-eye" : "ti-eye-off"} fs-16`}
                                ></i>
                              </button>
                            </div>

                            {/* ERROR MESSAGE */}
                            {isSubmitted && errors.employee_password && (
                              <div className="text-danger fs-11 mt-1">
                                {errors.employee_password}
                              </div>
                            )}
                          </div>

                          {/* <div className="col-md-2">
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
                          </div> */}
                        </div>
                      </div>

                      <hr className="my-2 opacity-25" />

                      {/* --- Section 2: Tenure & Probation --- */}
                      <div className="form-section mb-4">
                        <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                          <i className="ti ti-calendar-event fs-18 me-2"></i>{" "}
                          Joining & Probation
                        </h6>
                        <div className="row g-3">
                          {/* Joining Date - OPTIONAL */}
                          <div className="col-md-3">
                            <label className="form-label fs-13">
                              Joining Date{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <DatePicker
                              className={`w-100 form-control ${
                                isSubmitted && errors.joining_date
                                  ? "is-invalid"
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
                                // Clear error as soon as a date is picked
                                if (errors.joining_date) {
                                  setErrors((prev: any) => ({
                                    ...prev,
                                    joining_date: "",
                                  }));
                                }
                              }}
                            />
                            {isSubmitted && errors.joining_date && (
                              <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
                                <i className="ti ti-info-circle me-1"></i>
                                {errors.joining_date}
                              </div>
                            )}
                          </div>

                          {/* <div className="col-md-3">
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
                          </div> */}

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
                          {/* <div className="col-md-3">
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
                                // Clear error immediately when user types
                                if (errors.employee_password) {
                                  setErrors({
                                    ...errors,
                                    employee_password: "",
                                  });
                                }
                              }}
                            />
                            {isSubmitted && errors.employee_password && (
                              <div className="text-danger fs-11 mt-1">
                                {errors.employee_password}
                              </div>
                            )}
                          </div> */}

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
                              placeholder="Auto-calculated"
                            />
                          </div>
                        </div>
                      </div>

                      <hr className="my-2 opacity-25" />

                      {/* --- Section 3: Administration --- */}
                      <div className="form-section">
                        <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                          <i className="ti ti-settings-cog fs-18 me-2"></i>{" "}
                          Administration & Reporting
                        </h6>
                        <div className="row g-3">
                          <div className="col-md-3">
                            <label className="form-label fs-13">
                              Reporting Manager
                            </label>
                            <CommonSelect
                              // FIX: 'key' forces re-render when managers list loads
                              key={`rep-manager-${managers.length}`}
                              options={managers}
                              defaultValue={managers.find(
                                (o) =>
                                  o.value ===
                                  String(formData.reporting_manager_id),
                              )}
                              onChange={(opt) =>
                                setFormData({
                                  ...formData,
                                  reporting_manager_id: opt?.value || "",
                                })
                              }
                            />
                          </div>

                          <div className="col-md-3">
                            <label className="form-label fs-13">
                              Head of Department
                            </label>
                            <CommonSelect
                              // FIX: 'key' forces re-render when managers list loads
                              key={`hod-manager-${managers.length}`}
                              options={managers}
                              defaultValue={managers.find(
                                (o) =>
                                  o.value ===
                                  String(formData.head_of_department_id),
                              )}
                              onChange={(opt) =>
                                setFormData({
                                  ...formData,
                                  head_of_department_id: opt?.value || "",
                                })
                              }
                            />
                          </div>

                          <div className="col-md-2">
                            <label className="form-label fs-13">
                              Attendance Mode
                            </label>
                            <CommonSelect
                              options={[
                                { value: "qr", label: "QR CODE" },
                                { value: "biometric", label: "BIOMETRIC" },
                                { value: "mobile", label: "MobileAPP" },
                              ]}
                              defaultValue={{
                                value: "mobile",
                                label: "MobileAPP",
                              }}
                              disabled={true}
                              placeholder="Capture Mode"
                              onChange={(opt) =>
                                setFormData({
                                  ...formData,
                                  attendance_capture_mode: opt?.value || "",
                                })
                              }
                            />
                          </div>

                          {/* Status - OPTIONAL */}
                          <div className="col-md-2">
                            <label className="form-label fs-13">Status</label>
                            <div>
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
                                }}
                              />
                            </div>
                          </div>

                          {/* <div className="col-md-2">
                            <label className="form-label fs-13">Week Off</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g. Sunday"
                              value={formData.week_off}
                              // onChange={(e) =>
                              //   setFormData({
                              //     ...formData,
                              //     week_off: e.target.value,
                              //   })
                              // }
                              onChange={(e) =>
                                handleAlphaOnlyChange(e, "week_off")
                              }
                            />
                          </div> */}

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
                  {/* 6. Banking Information Tab Content */}
                  {activeTab === "banking" && (
                    <div className="banking-info-wrapper animate__animated animate__fadeIn">
                      <div className="form-section mb-4">
                        <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                          <i className="ti ti-building-bank fs-18 me-2"></i>{" "}
                          Salary Payment Details
                        </h6>

                        <div className="row g-3">
                          {/* 1. Bank Name Dropdown */}
                          <div className="col-md-3">
                            <label className="form-label fs-13 fw-bold">
                              Bank Name <span className="text-danger">*</span>
                            </label>
                            <div
                              className={
                                isSubmitted && errors.bank_id
                                  ? "border border-danger rounded"
                                  : ""
                              }
                            >
                              <CommonSelect
                                // Force re-render when the list is loaded
                                key={`bank-master-${bankMasterList.length}-${formData.bank_id}`}
                                options={bankMasterList}
                                placeholder="Select Bank"
                                // Use String() to ensure comparison works regardless of type (12 vs "12")
                                defaultValue={bankMasterList.find(
                                  (b) =>
                                    String(b.value) ===
                                    String(formData.bank_id),
                                )}
                                onChange={(opt) => {
                                  setFormData({
                                    ...formData,
                                    bank_id: opt?.value || "",
                                    bank_swift_code: opt?.swift || "",
                                  });
                                  if (errors.bank_id)
                                    setErrors({ ...errors, bank_id: "" });
                                }}
                              />
                            </div>
                            {isSubmitted && errors.bank_id && (
                              <div className="text-danger fs-11 mt-1">
                                {errors.bank_id}
                              </div>
                            )}
                          </div>

                          {/* 2. Account Number */}
                          <div className="col-md-4">
                            <label className="form-label fs-13 fw-bold">
                              Account Number{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              // HTML constraint to stop typing at 18 characters
                              maxLength={18}
                              className={`form-control ${
                                isSubmitted && errors.account_number
                                  ? "is-invalid"
                                  : isSubmitted && formData.account_number
                                    ? "is-valid"
                                    : ""
                              }`}
                              value={formData.account_number}
                              placeholder="Enter Account Number (Max 18 digits)"
                              onChange={(e) => {
                                // 1. Remove non-numeric characters
                                // 2. Slice string to 18 characters as a failsafe
                                const val = e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 18);

                                setFormData({
                                  ...formData,
                                  account_number: val,
                                });

                                // Clear error as user types
                                if (errors.account_number) {
                                  setErrors((prev: any) => ({
                                    ...prev,
                                    account_number: "",
                                  }));
                                }
                              }}
                            />
                            {isSubmitted && errors.account_number && (
                              <div className="invalid-feedback animate__animated animate__fadeIn">
                                <i className="ti ti-info-circle me-1"></i>
                                {errors.account_number}
                              </div>
                            )}
                          </div>

                          {/* 3. IFSC Code */}
                          <div className="col-md-2">
                            <label className="form-label fs-13 fw-bold">
                              IFSC Code <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${isSubmitted && errors.bank_iafc_code ? "is-invalid" : ""}`}
                              value={formData.bank_iafc_code}
                              placeholder="e.g. SBIN0001234"
                              maxLength={11}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  bank_iafc_code: e.target.value.toUpperCase(),
                                });
                                if (errors.bank_iafc_code)
                                  setErrors({ ...errors, bank_iafc_code: "" });
                              }}
                            />
                            {isSubmitted && errors.bank_iafc_code && (
                              <div className="invalid-feedback">
                                {errors.bank_iafc_code}
                              </div>
                            )}
                          </div>

                          {/* 4. SWIFT Code (Read Only) */}
                          <div className="col-md-2">
                            <label className="form-label fs-13 fw-bold text-muted">
                              SWIFT Code
                            </label>
                            <input
                              type="text"
                              className="form-control bg-light"
                              value={formData.bank_swift_code}
                              readOnly
                              placeholder="Auto-populated"
                            />
                          </div>

                          {/* 5. Currency */}
                          <div className="col-md-1">
                            <label className="form-label fs-13 fw-bold">
                              Currency
                            </label>
                            <select
                              className="form-select"
                              value={formData.currency_id}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  currency_id: e.target.value,
                                })
                              }
                              disabled={true}
                            >
                              <option value="INR">INR</option>
                              {/* <option value="USD">USD</option>
                              <option value="EUR">EUR</option> */}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* FIX: Move the Modal component outside of the tab-content conditional check.
   If it's inside {activeTab === "banking" && ...}, it might unmount when you 
   switch tabs, causing issues. Place it at the very bottom of the main modal-body.*/}

                  {/* 7. Device Information */}
                  {activeTab === "device" && (
                    <div className="device-info-wrapper animate__animated animate__fadeIn">
                      <div className="form-section mb-4">
                        <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                          <i className="ti ti-device-mobile fs-18 me-2"></i>{" "}
                          {/* Registered Device Details */}
                          Mobile Device Binding Details
                        </h6>
                        <div className="row g-3">
                          {/* Device Unique ID - OPTIONAL */}
                          <div className="col-md-4">
                            <label className="form-label fs-13">
                              Mobile Device Unique ID
                            </label>
                            <input
                              type="text"
                              className="form-control"
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
                              Mobile Model Name
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
                            <label className="form-label fs-13">
                              Mobile Device ID
                            </label>
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
                            <label className="form-label fs-13">
                              Mobile OS Version Type
                            </label>
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
                              Mobile OS Version number{" "}
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
                          {/* <div className="col-md-3">
                            <label className="form-label fs-13">
                              IP Address
                            </label>
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
                          </div> */}

                          {/* Random Registration Code */}
                          <div className="col-md-3">
                            <label className="form-label fs-13 text-muted">
                              Reg. Code
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control bg-light border-dashed fw-bold text-primary"
                              value={formData.random_code_for_reg}
                              placeholder="No Code Assigned" // onChange={(e) =>
                              //   setFormData({
                              //     ...formData,
                              //     random_code_for_reg: e.target.value,
                              //   })
                              // }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="alert alert-soft-info d-flex align-items-center border-0 p-2 shadow-sm">
                        <i className="ti ti-info-circle-filled fs-20 me-2 text-info"></i>
                        <div className="fs-11">
                          This information is typically captured automatically
                          when an employee logs into the mobile app for the
                          first time.
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
                          <div className="col-md-3">
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
                                  {
                                    value: "involuntary",
                                    label: "Involuntary",
                                  },
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
                          <div className="col-md-3">
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
                                  setErrors({
                                    ...errors,
                                    resignation_date: "",
                                  });
                                // Trigger calculation helper if it exists in your component
                                if (
                                  typeof calculateNoticeEndDate === "function"
                                ) {
                                  calculateNoticeEndDate(
                                    Number(formData.notice_period_days),
                                    dateStr,
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
                          <div className="col-md-2">
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
                                    formData.resignation_date,
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

                          {/* Notice Period End Date (Read-only) */}
                          <div className="col-md-2">
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
                          {/* Status Checkbox (Calculated) */}
                          <div className="col-md-2 d-flex align-items-center pt-4">
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
                                In Notice Period
                              </label>
                            </div>
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
                          <em>Resigned</em> across payroll and attendance
                          modules upon reaching the end date.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 8. Settings */}
                  {/* {activeTab === "setting" && (
                    <div className="settings-info-wrapper animate__animated animate__fadeIn">
                      <div className="form-section mb-4">
                        <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                          <i className="ti ti-lock-access fs-18 me-2"></i>{" "}
                          Security & Access Credentials
                        </h6>
                        <div className="row g-3">
                          <div className="col-md-4">
                            <label className="form-label fs-13">
                              Employee PIN
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-light border-end-0">
                                <i className="ti ti-key fs-14 text-muted"></i>
                              </span>
                              <input
                                type="text"
                                className="form-control border-start-0"
                                placeholder="Enter 4-6 Digit PIN"
                                maxLength={6}
                                value={formData.pin}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, "");
                                  setFormData({ ...formData, pin: val });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

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
                            This PIN is used for employee authentication on
                            shared kiosks, QR-based attendance, and mobile app
                            verification. Please ensure the PIN is unique. For
                            security reasons, do not use simple sequences like
                            "1234".
                          </p>
                        </div>
                      </div>
                    </div>
                  )} */}

                  {/* 9. Group Access Tab */}
                  {/* {activeTab === "group_access" && (
                    <div className="group-access-wrapper animate__animated animate__fadeIn">
                      <div className="form-section mb-4">
                        <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                          <i className="ti ti-users-group fs-18 me-2"></i> Group
                          Access Rights
                        </h6>

                        {/* FIX 1: Removed 'table-responsive' and added style={{ overflow: "visible" }} 
                            This prevents the dropdown menu from being cut off/hidden */}
                  {/* <div
                          className="border rounded bg-white"
                          style={{ minHeight: "300px", overflow: "visible" }}
                        >
                          <table className="table table-borderless align-middle mb-0">
                            <thead className="bg-light border-bottom">
                              <tr>
                                <th
                                  scope="col"
                                  className="ps-4"
                                  style={{ width: "40%" }}
                                >
                                  Group
                                </th>
                                <th scope="col" style={{ width: "40%" }}>
                                  Approval User
                                </th>
                                <th scope="col" style={{ width: "20%" }}>
                                  Sequence
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {groupAccessLines.map((line, index) => (
                                <tr key={index} className="border-bottom">
                                  1. Group Dropdown */}
                  {/* <td
                                    className="ps-4 py-2"
                                    style={{ overflow: "visible" }}
                                  >
                                    <CommonSelect */}
                  {/* // FIX 2: Added 'key'. This forces the component to re-render
                                      // when the options are finally loaded from the API.
                                      // key={`group-select-${index}-${groupOptions.length}`}
                                      // options={groupOptions}
                                      // placeholder="Select Group"
                                      // FIX 3: Robust matching for string/number types
                                      // defaultValue={groupOptions.find( */}
                  {/* //       (g) =>
                                  //         String(g.value) ===
                                  //         String(line.group_id),
                                  //     )}
                                  //     onChange={(opt) => */}
                  {/* //       handleGroupSelect(
                                  //         index,
                                  //         opt?.value || "",
                                  //       )
                                  //     }
                                  //   />
                                  // </td> */}

                  {/* 2. User Dropdown */}
                  {/* <td
                                    className="py-2"
                                    style={{ overflow: "visible" }}
                                  >
                                    <CommonSelect
                                      // FIX 4: Added 'key' for users dependent dropdown
                                      key={`user-select-${index}-${
                                        line.group_id
                                      }-${
                                        (
                                          groupUserOptions[
                                            String(line.group_id)
                                          ] || []
                                        ).length
                                      }`}
                                      options={
                                        groupUserOptions[
                                          String(line.group_id)
                                        ] || []
                                      }
                                      placeholder={
                                        line.group_id
                                          ? "Select User"
                                          : "Select Group First"
                                      }
                                      defaultValue={(
                                        groupUserOptions[
                                          String(line.group_id)
                                        ] || []
                                      ).find(
                                        (u) =>
                                          String(u.value) ===
                                          String(line.approval_user_id),
                                      )}
                                      onChange={(opt) =>
                                        handleLineChange(
                                          index,
                                          "approval_user_id",
                                          opt?.value,
                                        )
                                      }
                                    />
                                  </td> */}

                  {/* 3. Sequence Input */}
                  {/* <td className="py-2 pe-4">
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder="0"
                                      value={line.approval_sequance}
                                      onChange={(e) =>
                                        handleLineChange(
                                          index,
                                          "approval_sequance",
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </td>
                                </tr>
                              ))} */}

                  {/* Empty State Check */}
                  {/* {groupAccessLines.length === 0 && (
                                <tr>
                                  <td
                                    colSpan={3}
                                    className="text-center py-4 text-muted"
                                  >
                                    No access groups configured.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div> */}
                  {/* )} */}
                  {/* 9. Group Access Tab */}
                  {activeTab === "group_access" && (
                    <div className="group-access-wrapper animate__animated animate__fadeIn">
                      <div className="form-section mb-4">
                        {/* Section Header */}
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <h6 className="fw-bold text-primary m-0 d-flex align-items-center">
                            <i className="ti ti-users-group fs-18 me-2"></i>{" "}
                            Group Access Rights
                          </h6>
                        </div>

                        {/* Main Card Container */}
                        <div className="border rounded shadow-sm bg-white overflow-visible">
                          {/* Table Container */}
                          <div style={{ overflow: "visible" }}>
                            <table className="table table-borderless align-middle mb-0">
                              <thead className="bg-light border-bottom">
                                <tr>
                                  <th
                                    scope="col"
                                    className="ps-4 py-3"
                                    style={{ width: "25%" }}
                                  >
                                    Model
                                  </th>
                                  <th
                                    scope="col"
                                    className="py-3"
                                    style={{ width: "30%" }}
                                  >
                                    Group
                                  </th>
                                  <th
                                    scope="col"
                                    className="py-3"
                                    style={{ width: "30%" }}
                                  >
                                    Approval User
                                  </th>
                                  <th
                                    scope="col"
                                    className="py-3"
                                    style={{ width: "15%" }}
                                  >
                                    Sequence
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {groupAccessLines.map((line, index) => (
                                  <tr key={index} className="border-bottom">
                                    {/* 1. Model Selection */}
                                    <td
                                      className="ps-4 py-3"
                                      style={{ overflow: "visible" }}
                                    >
                                      <CommonSelect
                                        options={[
                                          { value: "leave", label: "Leave" },
                                          {
                                            value: "attendance",
                                            label: "Attendance",
                                          },
                                          {
                                            value: "expense",
                                            label: "Expense",
                                          },
                                        ]}
                                        placeholder="Select Model"
                                        defaultValue={[
                                          { value: "leave", label: "Leave" },
                                          {
                                            value: "attendance",
                                            label: "Attendance",
                                          },
                                          {
                                            value: "expense",
                                            label: "Expense",
                                          },
                                        ].find((m) => m.value === line.model)}
                                        onChange={(opt) =>
                                          handleLineChange(
                                            index,
                                            "model",
                                            opt?.value || "",
                                          )
                                        }
                                      />
                                    </td>

                                    {/* 2. Group Selection */}
                                    <td
                                      className="py-3"
                                      style={{ overflow: "visible" }}
                                    >
                                      <CommonSelect
                                        key={`group-select-${index}-${groupOptions.length}`}
                                        options={groupOptions}
                                        placeholder="Select Group"
                                        defaultValue={groupOptions.find(
                                          (g) =>
                                            String(g.value) ===
                                            String(line.group_id),
                                        )}
                                        onChange={(opt) =>
                                          handleGroupSelect(
                                            index,
                                            opt?.value || "",
                                          )
                                        }
                                      />
                                    </td>

                                    {/* 3. User Selection */}
                                    <td
                                      className="py-3"
                                      style={{ overflow: "visible" }}
                                    >
                                      <CommonSelect
                                        key={`user-select-${index}-${line.group_id}-${
                                          (
                                            groupUserOptions[
                                              String(line.group_id)
                                            ] || []
                                          ).length
                                        }`}
                                        options={
                                          groupUserOptions[
                                            String(line.group_id)
                                          ] || []
                                        }
                                        placeholder={
                                          line.group_id
                                            ? "Select User"
                                            : "Select Group First"
                                        }
                                        defaultValue={(
                                          groupUserOptions[
                                            String(line.group_id)
                                          ] || []
                                        ).find(
                                          (u) =>
                                            String(u.value) ===
                                            String(line.approval_user_id),
                                        )}
                                        onChange={(opt) =>
                                          handleLineChange(
                                            index,
                                            "approval_user_id",
                                            opt?.value,
                                          )
                                        }
                                      />
                                    </td>

                                    {/* 4. Sequence Input */}
                                    <td className="py-3 pe-4">
                                      <input
                                        type="number"
                                        className="form-control"
                                        placeholder="0"
                                        value={line.approval_sequance}
                                        onChange={(e) =>
                                          handleLineChange(
                                            index,
                                            "approval_sequance",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </td>
                                  </tr>
                                ))}

                                {/* Empty State */}
                                {groupAccessLines.length === 0 && (
                                  <tr>
                                    <td
                                      colSpan={4}
                                      className="text-center py-5 text-muted fst-italic bg-light-subtle"
                                    >
                                      <div className="d-flex flex-column align-items-center">
                                        <i className="ti ti-list-details fs-24 mb-2 opacity-50" />
                                        <span>
                                          No access groups configured yet.
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>

                          {/* Card Footer for Actions */}
                          <div className="p-3 border-top bg-light rounded-bottom d-flex align-items-center">
                            <button
                              type="button"
                              className="btn btn-sm btn-primary d-flex align-items-center shadow-sm px-3"
                              onClick={addGroupAccessLine}
                            >
                              <i className="ti ti-plus me-1" /> Add New Line
                            </button>

                            {/* Optional: Add a helper text */}
                            <small className="text-muted ms-3">
                              Configure who can approve requests for specific
                              modules.
                            </small>
                          </div>
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
    </>
  );
};

export default AddEditEmployeeModal;
