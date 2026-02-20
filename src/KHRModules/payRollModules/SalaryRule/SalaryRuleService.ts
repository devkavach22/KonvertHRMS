import Instance from "../../../api/axiosInstance";

const getUserId = () => localStorage.getItem("user_id") || "3318";

export interface SalaryRuleData {
  id?: number;
  name: string;
  code: string;
  active: boolean;
  appears_on_payslip: boolean;
  appears_on_employee_cost_dashboard: boolean;
  appears_on_payroll_report: boolean;
  category_id: any; // Can be [number, string] from GET or number for POST
  struct_id: any;
  sequence: number;
  condition_select: string;
  condition_range: string;
  condition_range_min: number;
  condition_range_max: number;
  condition_python: string;
  condition_other_input_id: any;
  amount_select: string;
  amount_percentage_base: any;
  quantity: string | number;
  amount_fix: number;
  amount_percentage: number;
  amount_other_input_id: any;
  amount_python_compute: string;
  note: string;
}

export const getSalaryRules = async () => {
  const response = await Instance.get("/api/salary-rules", {
    params: { user_id: getUserId() },
  });
  return response.data.data || response.data || [];
};

export const getSalaryRuleCategories = async () => {
  const response = await Instance.get("/api/salary-rule-categories", {
    params: { user_id: getUserId() },
  });
  return response.data.data || response.data || [];
};

export const getStructureTypes = async () => {
  const response = await Instance.get("/api/salary-structure", {
    params: { user_id: getUserId() },
  });
  return response.data.data || response.data || [];
};

export const getInputTypes = async () => {
  const response = await Instance.get("/api/Input-Type", {
    params: { user_id: getUserId() },
  });
  return response.data.data || response.data || [];
};

export const addSalaryRule = async (payload: any) => {
  return await Instance.post("/api/create/salary-rule", payload, {
    params: { user_id: getUserId() },
  });
};

export const updateSalaryRule = async (id: string, payload: any) => {
  return await Instance.put(`/api/salary-rule/${id}`, payload, {
    params: { user_id: getUserId() },
  });
};

export const deleteSalaryRule = async (id: string) => {
  return await Instance.delete(`/api/salary-rule/${id}`, {
    params: { user_id: getUserId() },
  });
};

// import Instance from "../../../api/axiosInstance";

// const getUserId = () => {
//   const id = localStorage.getItem("user_id");
//   return id ? Number(id) : null;
// };

// /* ================= GET SALARY RULES ================= */

// export const getSalaryRules = async () => {
//   const response = await Instance.get("/api/salary-rules", {
//     params: { user_id: getUserId() },
//   });
//   return response.data.data || response.data || [];
// };

// /* ================= GET SALARY RULE CATEGORIES FOR DROPDOWN ================= */

// export const getSalaryRuleCategoriesForSalaryRule = async () => {
//   try {
//     const response = await Instance.get("/api/salary-rule-categories", {
//       params: { user_id: getUserId() },
//     });
//     const data = response.data.data || response.data || [];

//     // Transform for dropdown usage
//     return data.map((item: any) => ({
//       label: item.name,
//       value: item.id,
//     }));
//   } catch (error) {
//     console.error("Error fetching salary rule categories:", error);
//     return [];
//   }
// };

// /* ================= CREATE SALARY RULE ================= */

// export const createSalaryRule = async (payload: any) => {
//   console.log(payload, "Salary Rule Payload");

//   const userId = getUserId();
//   return await Instance.post("/api/create/salary-rule", payload, {
//     params: { user_id: userId },
//   });
// };

// /* ================= UPDATE SALARY RULE ================= */

// export const updateSalaryRule = async (id: string | number, payload: any) => {
//   const userId = getUserId();
//   return await Instance.put(`/api/salary-rules/${id}`, payload, {
//     params: { user_id: userId },
//   });
// };

// /* ================= DELETE SALARY RULE ================= */

// export const deleteSalaryRule = async (id: string | number) => {
//   const userId = getUserId();
//   return await Instance.delete(`/api/salary-rules/${id}`, {
//     params: { user_id: userId },
//   });
// };
