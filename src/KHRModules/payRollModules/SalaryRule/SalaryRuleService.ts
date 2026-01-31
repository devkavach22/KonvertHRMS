import Instance from "../../../api/axiosInstance";

const getUserId = () => {
  const id = localStorage.getItem("user_id");
  return id ? Number(id) : null;
};

/* ================= GET SALARY RULES ================= */

export const getSalaryRules = async () => {
  const response = await Instance.get("/api/salary-rules", {
    params: { user_id: getUserId() },
  });
  return response.data.data || response.data || [];
};

/* ================= GET SALARY RULE CATEGORIES FOR DROPDOWN ================= */

export const getSalaryRuleCategoriesForSalaryRule = async () => {
  try {
    const response = await Instance.get("/api/salary-rule-categories", {
      params: { user_id: getUserId() },
    });
    const data = response.data.data || response.data || [];
    
    // Transform for dropdown usage
    return data.map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
  } catch (error) {
    console.error("Error fetching salary rule categories:", error);
    return [];
  }
};

/* ================= CREATE SALARY RULE ================= */

export const createSalaryRule = async (payload: any) => {
  console.log(payload, "Salary Rule Payload");
  
  const userId = getUserId();
  return await Instance.post("/api/create/salary-rule", payload, {
    params: { user_id: userId },
  });
};

/* ================= UPDATE SALARY RULE ================= */

export const updateSalaryRule = async (id: string | number, payload: any) => {
  const userId = getUserId();
  return await Instance.put(`/api/salary-rules/${id}`, payload, {
    params: { user_id: userId },
  });
};

/* ================= DELETE SALARY RULE ================= */

export const deleteSalaryRule = async (id: string | number) => {
  const userId = getUserId();
  return await Instance.delete(`/api/salary-rules/${id}`, {
    params: { user_id: userId },
  });
};
