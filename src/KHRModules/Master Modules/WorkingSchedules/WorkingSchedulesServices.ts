import Instance from "../../../api/axiosInstance";

// 1. UI Interface
export interface WorkingSchedule {
  id?: string;
  name: string;
  flexible_hours: boolean;
  is_night_shift: boolean;
  full_time_required_hours: number;
  hours_per_day: number; // Added
  total_overtime_hours_allowed: number; // Added
  tz: string;
  key?: string;
}

// 2. API Interface
export interface APIWorkingSchedule {
  id: number;
  name: string | false;
  flexible_hours: boolean;
  is_night_shift: boolean;
  full_time_required_hours: number;
  hours_per_day?: number;
  total_overtime_hours_allowed?: number;
  tz: string | false;
}

// 3. SERVICE FUNCTIONS
const getUserId = () => {
  const id = localStorage.getItem("user_id");
  return id ? Number(id) : 3145;
};

// GET List
export const getWorkingSchedules = async (): Promise<APIWorkingSchedule[]> => {
  try {
    const response = await Instance.get("/api/WorkingSchedules", {
      params: { user_id: getUserId() },
    });

    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return [];
  }
};

// GET Timezones
export const getTimezones = async (): Promise<string[]> => {
  try {
    const response = await Instance.get("api/timezones");
    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Error fetching timezones:", error);
    return ["UTC", "Asia/Kolkata", "America/New_York", "Europe/London"];
  }
};

// POST Create
export const addWorkingSchedule = async (data: any) => {
  const payload = {
    ...data,
    user_id: getUserId(),
  };
  return await Instance.post("/api/create/WorkingSchedules", payload);
};

// PUT Update
// URL: /api/update/workingSchedules/85?user_id=3145
export const updateWorkingSchedule = async (id: string | number, data: any) => {
  const user_id = getUserId();
  return await Instance.put(
    `/api/update/workingSchedules/${id}?user_id=${user_id}`,
    data,
  );
};

// DELETE
// URL: /api/delete/workingSchedules/85?user_id=3145
export const deleteWorkingSchedule = async (id: string | number) => {
  const user_id = getUserId();
  return await Instance.delete(
    `/api/delete/workingSchedules/${id}?user_id=${user_id}`,
  );
};
