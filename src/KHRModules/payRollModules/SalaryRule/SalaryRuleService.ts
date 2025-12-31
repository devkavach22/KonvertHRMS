import Instance from "../../../api/axiosInstance";

const getUserId = () => {
  const id = localStorage.getItem("user_id");
  return id ? Number(id) : null;
};

/* ================= GET ================= */

export const getSalaryRules = async () => {
  const response = await Instance.get("/api/salary-rules", {
    params: { user_id: getUserId() },
  });
  return response.data.data || response.data || [];
};

/* ================= POST ================= */

export const createSalaryRule = async (payload: any) => {
    console.log(payload,"ppppp");
    
  const userId = getUserId();
  return await Instance.post("/api/create/salary-rule", payload, {
    params: { user_id: userId },
  });
};
