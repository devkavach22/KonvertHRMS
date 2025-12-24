import Instance from "../../../api/axiosInstance";

export interface BusinessLocation {
  id?: string;
  name: string;
  created_date: string;
  key?: string;
}

export interface APIBusinessLocation {
  id: number;
  name: string | false;
  create_date: string;
}

// Helper to get user_id
const getUserId = () => {
  const id = localStorage.getItem("user_id");
  return id ? Number(id) : null;
};

// GET - http://localhost:4000/employee/business-locations?user_id=219
export const getBusinessLocations = async (): Promise<
  APIBusinessLocation[]
> => {
  try {
    const response = await Instance.get("/employee/business-locations", {
      params: { user_id: getUserId() },
    });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Error fetching business locations:", error);
    return [];
  }
};

// POST - http://localhost:4000/employee/create/business-location
export const addBusinessLocation = async (data: { name: string }) => {
  const payload = {
    ...data,
    user_id: getUserId(),
  };
  return await Instance.post("/employee/create/business-location", payload);
};

// PUT - http://localhost:4000/employee/business-location/15
export const updateBusinessLocation = async (
  id: string,
  data: { name: string }
) => {
  const payload = {
    ...data,
    user_id: getUserId(),
  };
  return await Instance.put(`/employee/business-location/${id}`, payload);
};

// DELETE - http://localhost:4000/employee/business-location/15?user_id=219
export const deleteBusinessLocation = async (id: string) => {
  return await Instance.delete(`/employee/business-location/${id}`, {
    params: { user_id: getUserId() },
  });
};
