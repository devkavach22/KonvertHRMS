import Instance from "../../../api/axiosInstance";

// --- Standardized Interface (CamelCase to match API) ---
export interface SalaryStructure {
  id?: string | number;
  name: string;

  // IDs for Forms
  typeId: string | number;
  countryId: string | number;
  reportId?: string | number | null;

  // Display Names (from API)
  typeName?: string;
  countryName?: string;
  reportName?: string;

  // Config
  schedulePay: string;
  payslipName: string;
  useWorkedDayLines: boolean;
  ytdComputation: boolean;
  hideBasicOnPdf: boolean;

  // Meta
  clientId?: number;
  createdAt?: string;
}

// Interface for the Dropdown Data
export interface StructureTypeOption {
  id: number;
  name: string;
  default_schedule_pay: string; // Keep snake_case if Dropdown API returns it this way
}

const getAuthDetails = () => {
  const user_id = localStorage.getItem("user_id");
  return { user_id: user_id ? Number(user_id) : null };
};

// --- API Calls ---

// GET - List Salary Structures
export const getSalaryStructures = async (): Promise<SalaryStructure[]> => {
  try {
    const { user_id } = getAuthDetails();
    const response = await Instance.get("/api/salary-structure", {
      params: { user_id },
    });
    return response.data.data || [];
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};

// POST - Create Salary Structure
export const createSalaryStructure = async (formData: SalaryStructure) => {
  const { user_id } = getAuthDetails();

  const payload = {
    name: formData.name,
    typeId: Number(formData.typeId),
    countryId: Number(formData.countryId),
    schedulePay: formData.schedulePay,
    payslipName: formData.payslipName,
    useWorkedDayLines: formData.useWorkedDayLines,
    ytdComputation: formData.ytdComputation,
    hideBasicOnPdf: formData.hideBasicOnPdf,
    reportId: formData.reportId ? Number(formData.reportId) : null,
    user_id: user_id,
  };

  return await Instance.post("/api/create/salary-structure", payload);
};

// UPDATE - Salary Structure
export const updateSalaryStructure = async (
  id: string | number,
  formData: SalaryStructure,
) => {
  const { user_id } = getAuthDetails();
  const payload = {
    name: formData.name,
    typeId: Number(formData.typeId),
    countryId: Number(formData.countryId),
    schedulePay: formData.schedulePay,
    payslipName: formData.payslipName,
    useWorkedDayLines: formData.useWorkedDayLines,
    ytdComputation: formData.ytdComputation,
    hideBasicOnPdf: formData.hideBasicOnPdf,
    reportId: formData.reportId ? Number(formData.reportId) : null,
    user_id: user_id,
  };
  return await Instance.put(`/api/salary-structure/update/${id}`, payload);
};

// DELETE - Salary Structure
export const deleteSalaryStructure = async (id: string) => {
  const { user_id } = getAuthDetails();
  return await Instance.delete(`/api/salary-structure/delete/${id}`, {
    params: { user_id },
  });
};

// --- Dropdown Fetchers ---

export const getStructureTypesList = async (): Promise<
  StructureTypeOption[]
> => {
  try {
    const { user_id } = getAuthDetails();
    const response = await Instance.get("/api/structure-types", {
      params: { user_id },
    });
    const rawData = response.data.data || response.data || [];
    return rawData.map((item: any) => ({
      id: item.id,
      name: item.name,
      default_schedule_pay: item.default_schedule_pay,
    }));
  } catch (error) {
    return [];
  }
};

export const getReports = async () => {
  return [
    { id: 12, name: "Salary Slip Report" },
    { id: 13, name: "Wages Report" },
  ];
};
