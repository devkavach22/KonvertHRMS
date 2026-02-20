import Instance from "../../../api/axiosInstance";

const getUserId = () => localStorage.getItem("user_id") || "3318";

export const getPayslipInputTypes = async () => {
  const response = await Instance.get("/api/Input-Type", {
    params: { user_id: getUserId() },
  });
  return response.data.data || response.data || [];
};

export const getStructureTypes = async () => {
  const response = await Instance.get("/api/structure-types", {
    params: { user_id: getUserId() },
  });
  return response.data.data || [];
};

export const addPayslipInputType = async (payload: any) => {
  return await Instance.post("/api/create/Input-Type", payload, {
    params: { user_id: getUserId() },
  });
};

export const updatePayslipInputType = async (id: string, payload: any) => {
  return await Instance.put(`/api/input-type/${id}`, payload, {
    params: { user_id: getUserId() },
  });
};

export const deletePayslipInputType = async (id: string) => {
  return await Instance.delete(`/api/input-type/${id}`, {
    params: { user_id: getUserId() },
  });
};
