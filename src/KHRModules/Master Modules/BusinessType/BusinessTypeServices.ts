import Instance from "../../../api/axiosInstance";

// 1. UI Interface
export interface BusinessType {
  id?: string;
  name: string;
  created_date: string;
  key?: string;
}

// 2. API Interface
export interface APIBusinessType {
  id: number;
  name: string | false;
  create_date: string;
}

// Helper to get user_id from localStorage
const getUserId = () => {
  const id = localStorage.getItem("user_id");
  return id ? Number(id) : null;
};

// 3. SERVICE FUNCTIONS

// GET: http://localhost:4000/employee/business-types?user_id=219
export const getBusinessTypes = async (): Promise<APIBusinessType[]> => {
  try {
    const response = await Instance.get("/employee/business-types", {
      params: { user_id: getUserId() },
    });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Error fetching business types:", error);
    return [];
  }
};

// POST: http://localhost:4000/employee/create/business-type
export const addBusinessType = async (data: { name: string }) => {
  const payload = {
    ...data,
    user_id: getUserId(),
  };
  return await Instance.post("/employee/create/business-type", payload);
};

// PUT: http://localhost:4000/employee/business-type/10
export const updateBusinessType = async (
  id: string,
  data: { name: string }
) => {
  const payload = {
    ...data,
    user_id: getUserId(),
  };
  return await Instance.put(`/employee/business-type/${id}`, payload);
};

// DELETE: http://localhost:4000/employee/business-type/10?user_id=219
export const deleteBusinessType = async (id: string) => {
  return await Instance.delete(`/employee/business-type/${id}`, {
    params: { user_id: getUserId() },
  });
};
