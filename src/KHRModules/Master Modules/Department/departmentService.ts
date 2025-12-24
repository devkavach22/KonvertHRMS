import Instance from "../../../api/axiosInstance";

export interface Department {
  id?: string;
  Department_Name: string;
  Department_Head: string;
  Created_Date: string;
  Status: "Active" | "Inactive";
  key?: string;
}

export interface APIDepartment {
  id: number;
  name: string;
  manager: { id: number; name: string } | null;
}

// Helper to get IDs from storage and ensure correct types
const getAuthDetails = () => {
  const user_id = localStorage.getItem("user_id");
  const unique_user_id = localStorage.getItem("unique_user_id");

  return {
    user_id: user_id ? Number(user_id) : null,
    unique_user_id: unique_user_id,
  };
};

// GET - http://localhost:4000/api/department?user_id=219
export const getDepartments = async (): Promise<APIDepartment[]> => {
  try {
    const { user_id } = getAuthDetails();
    const response = await Instance.get("/api/department", {
      params: { user_id },
    });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};

// POST - http://localhost:4000/api/create/department
export const addDepartment = async (formData: any) => {
  const { user_id, unique_user_id } = getAuthDetails();
  const payload = {
    ...formData,
    user_id: user_id,
    unique_user_id: unique_user_id,
  };
  return await Instance.post("/api/create/department", payload);
};

// PUT - http://localhost:4000/api/department/376
export const updateDepartment = async (id: string, formData: any) => {
  const { user_id, unique_user_id } = getAuthDetails();
  const payload = {
    ...formData,
    user_id: user_id,
    unique_user_id: unique_user_id,
  };
  return await Instance.put(`/api/department/${id}`, payload);
};

// DELETE - http://localhost:4000/api/department/376?user_id=219
export const deleteDepartment = async (id: string) => {
  const { user_id } = getAuthDetails();
  return await Instance.delete(`/api/department/${id}`, {
    params: { user_id },
  });
};
