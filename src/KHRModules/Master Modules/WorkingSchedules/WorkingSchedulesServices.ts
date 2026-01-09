import Instance from "../../../api/axiosInstance";

// 1. UI Interface
export interface WorkingSchedule {
  id?: string;
  name: string;
  flexible_hours: boolean;
  is_night_shift: boolean;
  full_time_required_hours: number;
  tz: string;
  // Bottom fields (Mapped from the first attendance_id for editing)
  dayofweek?: string;
  day_period?: string;
  hour_from?: number;
  hour_to?: number;
  duration_days?: number;
  work_entry_type_id?: number;
  key?: string;
}

// 2. API Interface (Matches your JSON Response)
export interface AttendanceID {
  id: number;
  dayofweek: string;
  day_period: string;
  hour_from: number;
  hour_to: number;
}

export interface APIWorkingSchedule {
  id: number;
  name: string | false;
  flexible_hours: boolean;
  is_night_shift: boolean;
  full_time_required_hours: number;
  hours_per_day?: number;
  tz: string | false;
  attendance_ids?: AttendanceID[]; // Added this array
}

// 3. SERVICE FUNCTIONS
const getUserId = () => {
  const id = localStorage.getItem("user_id");
  // Default to 3145 or 219 if not found, to ensure we get data
  return id ? Number(id) : 3145;
};

// GET List
export const getWorkingSchedules = async (): Promise<APIWorkingSchedule[]> => {
  try {
    const response = await Instance.get("/api/WorkingSchedules", {
      params: { user_id: getUserId() },
    });

    // Robust extraction: Check if response.data.data exists and is an array
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    // Fallback if the array is directly in response.data
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

export const addWorkingSchedule = async (data: any) => {
  const payload = {
    ...data,
    user_id: getUserId(),
  };
  return await Instance.post("/api/create/WorkingSchedules", payload);
};
// POST Create
// export const addWorkingSchedule = async (data: any) => {
//   return await Instance.post("/api/create/WorkingSchedules", data);
// };

// PUT Update
export const updateWorkingSchedule = async (id: string, data: any) => {
  return await Instance.put(`/employee/working-schedule/${id}`, data);
};

// DELETE
export const deleteWorkingSchedule = async (id: string) => {
  return await Instance.delete(`/employee/working-schedule/${id}`);
};
