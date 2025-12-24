import Instance from "../../../api/axiosInstance";

export interface Industry {
  id?: string;
  name: string;
  full_name: string;
  key?: string;
}

const getUserId = () => {
  const id = localStorage.getItem("user_id");
  return id ? Number(id) : null;
};

// GET - http://localhost:4000/api/industries?user_id=219
export const getIndustries = async () => {
  try {
    const response = await Instance.get("/api/industries", {
      params: { user_id: getUserId() },
    });
    return response.data.data || response.data || [];
  } catch (error) {
    return [];
  }
};

// POST - http://localhost:4000/api/create/industries
export const addIndustry = async (data: {
  name: string;
  full_name: string;
}) => {
  const payload = { ...data, user_id: getUserId() };
  return await Instance.post("/api/create/industries", payload);
};

// PUT - http://localhost:4000/api/industries/25
export const updateIndustry = async (
  id: string,
  data: { name: string; full_name: string }
) => {
  const payload = { ...data, user_id: getUserId() };
  return await Instance.put(`/api/industries/${id}`, payload);
};

// DELETE - http://localhost:4000/api/industries/25?user_id=219
export const deleteIndustry = async (id: string) => {
  return await Instance.delete(`/api/industries/${id}`, {
    params: { user_id: getUserId() },
  });
};
