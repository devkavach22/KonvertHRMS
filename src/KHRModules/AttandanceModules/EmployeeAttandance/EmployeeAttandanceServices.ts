import Instance from "../../../api/axiosInstance";

// Attendance API response (adjust fields if needed)
export interface APIAttendance {
  id: number;
  date: string;
  status: string;
  check_in?: string;
  check_out?: string;
}

// Helper to get auth details
const getAuthDetails = () => {
  const user_id = localStorage.getItem("user_id");
  const unique_user_id = localStorage.getItem("unique_user_id");

  return {
    user_id: user_id ? Number(user_id) : null,
    unique_user_id: unique_user_id,
  };
};

// GET - http://192.168.11.150:4000/api/attendance?user_id=219
export const getAttendance = async (): Promise<APIAttendance[]> => {
  try {
    const { user_id } = getAuthDetails();
    const response = await Instance.get("/api/employee/attendance", {
      params: { user_id },
    });
    return response.data || response.data || [];
  } catch (error) {
    console.error("Attendance Fetch Error:", error);
    return [];
  }
};

export const getCategories = async () => {
  try {
    const { user_id } = getAuthDetails();
    const response = await Instance.get("/api/regcategories", {
      params: { user_id },
    });
    return response.data || response.data || [];
  } catch (error) {
    return [];
  }
};

// POST - Create Attendance Regularization
export const createRegularization = async (payload: any) => {
  try {
    const { user_id } = getAuthDetails();

    const response = await Instance.post(
      "/api/create/regularization",
      payload,
      {
        params: { user_id },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Regularization Error:", error);
    throw error;
  }
};
