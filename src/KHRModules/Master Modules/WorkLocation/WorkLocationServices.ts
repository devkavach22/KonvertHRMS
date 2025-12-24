import Instance from "../../../api/axiosInstance";

// 1. UI Interface
export interface WorkLocation {
  id?: string;
  name: string;
  location_type: "home" | "office" | "other";
  created_date: string;
  key?: string;
}

// 2. API Interface
export interface APIWorkLocation {
  id: number;
  name: string;
  location_type: "home" | "office" | "other";
  create_date?: string;
}

// Helper to get user_id from localStorage
const getUserId = () => {
  const id = localStorage.getItem("user_id");
  return id ? Number(id) : null;
};

// 3. SERVICE FUNCTIONS

// GET: http://localhost:4000/api/work-location?user_id=219
export const getWorkLocations = async (): Promise<APIWorkLocation[]> => {
  try {
    const response = await Instance.get("/api/work-location", {
      params: { user_id: getUserId() },
    });
    // Returning response.data.data or direct array depending on API structure
    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Error fetching work locations:", error);
    return [];
  }
};

// POST (Create): http://localhost:4000/api/create/work-location
export const addWorkLocation = async (data: {
  name: string;
  location_type: string;
}) => {
  const payload = {
    ...data,
    user_id: getUserId(),
  };
  return await Instance.post("/api/create/work-location", payload);
};

// PUT (Update): http://localhost:4000/api/work-location/:id
export const updateWorkLocation = async (
  id: string,
  data: { name: string; location_type: string }
) => {
  const payload = {
    ...data,
    user_id: getUserId(),
  };
  return await Instance.put(`/api/work-location/${id}`, payload);
};

// DELETE: http://localhost:4000/api/work-location/:id?user_id=219
export const deleteWorkLocation = async (id: string) => {
  return await Instance.delete(`/api/work-location/${id}`, {
    params: { user_id: getUserId() },
  });
};
