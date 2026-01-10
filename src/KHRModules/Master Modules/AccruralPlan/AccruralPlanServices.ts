import Instance from "../../../api/axiosInstance";

export interface AccruralPlan {
  id?: string;
  name: string;
  carryover_date: string;
  accrued_gain_time: string;
  is_based_on_worked_time: boolean;
  company_id?: number;
  key?: string; // For Datatable
}

const getAuthDetails = () => {
  const user_id = localStorage.getItem("user_id");
  // Assuming company_id might also be stored, or you can hardcode/fetch elsewhere
  const company_id = localStorage.getItem("company_id");
  return {
    user_id: user_id ? Number(user_id) : null,
    company_id: company_id ? Number(company_id) : 1, // Defaulting to 1 if not found
  };
};

// GET - Accrual Plan List
export const getAccruralPlans = async (): Promise<AccruralPlan[]> => {
  try {
    const { user_id } = getAuthDetails();
    // API: GET /api/accural-plan?user_id=...
    const response = await Instance.get("/api/accural-plan", {
      params: { user_id },
    });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};

// POST - Create Accrual Plan
export const addAccruralPlan = async (formData: Omit<AccruralPlan, "id">) => {
  const { user_id, company_id } = getAuthDetails();

  // API: POST /api/create/accural-plan?user_id=...
  // Payload needs company_id inside body as per your example
  const payload = {
    ...formData,
    company_id: company_id,
  };

  return await Instance.post("/api/create/accural-plan", payload, {
    params: { user_id },
  });
};

// PUT - Update Accrual Plan
export const updateAccruralPlan = async (
  id: string,
  formData: Partial<AccruralPlan>
) => {
  const { user_id } = getAuthDetails();

  // API: PUT /api/accural-plan/:id?user_id=...
  const payload = {
    ...formData,
  };

  return await Instance.put(`/api/accural-plan/${id}`, payload, {
    params: { user_id },
  });
};

// DELETE - Delete Accrual Plan
export const deleteAccruralPlan = async (id: string) => {
  const { user_id } = getAuthDetails();

  // API: DELETE /api/accural-plan/:id?user_id=...
  return await Instance.delete(`/api/accural-plan/${id}`, {
    params: { user_id },
  });
};
