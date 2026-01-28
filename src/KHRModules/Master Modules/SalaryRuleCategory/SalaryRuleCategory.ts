import Instance from "../../../api/axiosInstance";

export interface SalaryRuleCategory {
  id?: string;
  type: string;
  client_id?: any; // Based on your JSON response
  key?: string; // For Datatable
}

const getAuthDetails = () => {
  const user_id = localStorage.getItem("user_id");
  return {
    user_id: user_id ? Number(user_id) : null,
  };
};

// GET - List
export const getRegCategories = async (): Promise<SalaryRuleCategory[]> => {
  try {
    const { user_id } = getAuthDetails();
    // Adjust endpoint as per your actual backend route
    const response = await Instance.get("/api/salary-rule-categories", {
      params: { user_id },
    });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};

// POST - Create
export const addRegCategory = async (formData: Omit<SalaryRuleCategory, "id">) => {
  const { user_id } = getAuthDetails();
  const payload = {
    ...formData,
    user_id: user_id,
  };
  return await Instance.post("/api/create/salary-rule-category", payload);
};

// PUT - Update
// Updated to your specific URL: http://localhost:4000/api/regcategories/2?user_id=3145
export const updateRegCategory = async (
  id: string,
  formData: Partial<SalaryRuleCategory>,
) => {
  const { user_id } = getAuthDetails();
  const payload = {
    ...formData,
    user_id: user_id,
  };
  // Passing user_id in 'params' ensures it appears in the URL query string
  return await Instance.put(`/api/regcategories/${id}`, payload, {
    params: { user_id },
  });
};

// DELETE - Delete
// Updated to your specific URL: http://localhost:4000/api/regcategories/2?user_id=3145
export const deleteRegCategory = async (id: string) => {
  const { user_id } = getAuthDetails();
  return await Instance.delete(`/api/regcategories/${id}`, {
    params: { user_id },
  });
};
