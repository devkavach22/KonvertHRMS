import Instance from "../../../api/axiosInstance";
import { toast } from "react-toastify";

export interface RegCategory {
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
export const getRegCategories = async (): Promise<RegCategory[]> => {
  try {
    const { user_id } = getAuthDetails();
    // Adjust endpoint as per your actual backend route
    const response = await Instance.get("/api/regcategories", {
      params: { user_id },
    });
    return response.data.data || response.data || [];
  } catch (error: any) {
    console.error("Fetch Error:", error);
    const errorMessage =
      error.response?.data?.message || "Failed to load categories";
    toast.error(errorMessage);
    return [];
  }
};

// POST - Create
export const addRegCategory = async (formData: Omit<RegCategory, "id">) => {
  const { user_id } = getAuthDetails();
  const payload = {
    ...formData,
    user_id: user_id,
  };
  return await Instance.post("/api/create/regcategory", payload);
};

// PUT - Update
// Updated to your specific URL: http://localhost:4000/api/regcategories/2?user_id=3145
export const updateRegCategory = async (
  id: string,
  formData: Partial<RegCategory>,
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
