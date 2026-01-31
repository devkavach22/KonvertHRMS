import Instance from "../../../api/axiosInstance";

export interface SalaryRuleCategory {
  id?: string;
  name: string;
  parent_id?: number | null;
  note?: string;
  client_id?: any; // Based on your JSON response
  key?: string; // For Datatable
}

const getAuthDetails = () => {
  const user_id = localStorage.getItem("user_id");
  return {
    user_id: user_id ? Number(user_id) : null,
  };
};

// GET - List Salary Rule Categories
export const getSalaryRuleCategories = async (): Promise<SalaryRuleCategory[]> => {
  try {
    const { user_id } = getAuthDetails();
    const response = await Instance.get("/api/salary-rule-categories", {
      params: { user_id },
    });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};
export const getSalaryRuleCategoriesForDropdown = async () => {
  try {
    const { user_id } = getAuthDetails();
    const response = await Instance.get("/api/salary-rule-categories", {
      params: { user_id },
    });
    const data = response.data.data || response.data || [];

    // Transform for dropdown usage
    return data.map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
  } catch (error) {
    console.error("Fetch Categories for Dropdown Error:", error);
    return [];
  }
};
// POST - Create Salary Rule Category
export const addSalaryRuleCategory = async (formData: Omit<SalaryRuleCategory, "id">) => {
  const { user_id } = getAuthDetails();
  const payload = {
    ...formData,
  };
  return await Instance.post("/api/create/salary-rule-category", payload, {
    params: { user_id },
  });
};

// PUT - Update Salary Rule Category
export const updateSalaryRuleCategory = async (
  id: string,
  formData: Partial<SalaryRuleCategory>,
) => {
  const { user_id } = getAuthDetails();
  const payload = {
    ...formData,
  };
  return await Instance.put(`/api/salary-rule-categories/${id}`, payload, {
    params: { user_id },
  });
};

// DELETE - Delete Salary Rule Category
export const deleteSalaryRuleCategory = async (id: string) => {
  const { user_id } = getAuthDetails();
  return await Instance.delete(`/api/salary-rule-categories/${id}`, {
    params: { user_id },
  });
};

// GET - List for Parent Dropdown (for SalaryRule module)

