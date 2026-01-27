import Instance from "../../../api/axiosInstance";

// --- Types ---
export interface SalaryStructureType {
  id?: string;
  name: string;
  wage_type: "monthly" | "hourly";
  default_schedule_pay: string;
  default_work_entry_type_id: string | number; // ID from dropdown
  default_resource_calendar_id: string | number; // ID from dropdown
  default_struct_id: string | number; // ID from dropdown
  country_id: string | number;
  key?: string; // For Datatable
}

// --- Helper: Get Auth Headers ---
const getAuthDetails = () => {
  const user_id = localStorage.getItem("user_id");
  return {
    user_id: user_id ? Number(user_id) : null,
  };
};

// --- Main API Calls ---

// GET - List Structure Types
// Route: http://localhost:4000/api/structure-types?user_id=3318
export const getSalaryStructureTypes = async (): Promise<
  SalaryStructureType[]
> => {
  try {
    const { user_id } = getAuthDetails();
    const response = await Instance.get("/api/structure-types", {
      params: { user_id },
    });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};

// POST - Create Structure Type
// Route: http://localhost:4000/api/create/structure-type?user_id=3318
export const createSalaryStructureType = async (
  formData: Omit<SalaryStructureType, "id">,
) => {
  const { user_id } = getAuthDetails();
  const payload = {
    ...formData,
    // Ensure IDs are numbers if API requires integers
    default_work_entry_type_id: Number(formData.default_work_entry_type_id),
    default_resource_calendar_id: Number(formData.default_resource_calendar_id),
    default_struct_id: Number(formData.default_struct_id),
    country_id: Number(formData.country_id),
  };
  // Passing user_id as query param as per your route description,
  // though typically it might be in body. Adjust if needed.
  return await Instance.post(
    `/api/create/structure-type?user_id=${user_id}`,
    payload,
  );
};

// PUT - Update Structure Type (Placeholder - assuming standard pattern)
export const updateSalaryStructureType = async (
  id: string,
  formData: Partial<SalaryStructureType>,
) => {
  const { user_id } = getAuthDetails();
  const payload = { ...formData, user_id };
  return await Instance.put(`/api/structure-type/update/${id}`, payload);
};

// DELETE - Delete Structure Type (Placeholder)
export const deleteSalaryStructureType = async (id: string) => {
  const { user_id } = getAuthDetails();
  return await Instance.delete(`/api/structure-type/delete/${id}`, {
    params: { user_id },
  });
};

export const getRegularPayStructures = async () => {
  // Example: return await Instance.get("/api/payroll/structures");
  return [
    { id: 20, name: "Base Salary Structure" },
    { id: 21, name: "Contractor Structure" },
  ];
};
