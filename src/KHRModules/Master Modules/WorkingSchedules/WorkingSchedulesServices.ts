import Instance from "../../../api/axiosInstance";

// 1. UI Interface
export interface WorkingSchedule {
  id?: string;
  name: string;
  flexible_hours: boolean;
  is_night_shift: boolean;
  full_time_required_hours: number;
  tz: string;
  // Bottom fields
  dayofweek?: string;
  day_period?: string;
  hour_from?: number;
  hour_to?: number;
  duration_days?: number;
  work_entry_type_id?: number;
  key?: string;
}

// 2. API Interface
export interface APIWorkingSchedule {
  id: number;
  name: string | false;
  flexible_hours: boolean;
  is_night_shift: boolean;
  full_time_required_hours: number;
  tz: string | false;
}

// 3. SERVICE FUNCTIONS

// GET List
export const getWorkingSchedules = async (): Promise<APIWorkingSchedule[]> => {
  try {
    const response = await Instance.get("/employee/working-schedules");
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return [];
  }
};

// GET Timezones
export const getTimezones = async (): Promise<string[]> => {
  try {
    // Updated Endpoint
    const response = await Instance.get("api/timezones");
    // Adjust based on whether the array is in response.data or response.data.data
    // Assuming simple array or data wrapper
    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Error fetching timezones:", error);
    // Fallback list just in case API fails
    return ["UTC", "Asia/Kolkata", "America/New_York", "Europe/London"];
  }
};

// POST Create
export const addWorkingSchedule = async (data: any) => {
  return await Instance.post("/employee/create/working-schedule", data);
};

// PUT Update
export const updateWorkingSchedule = async (id: string, data: any) => {
  return await Instance.put(`/employee/working-schedule/${id}`, data);
};

// DELETE
export const deleteWorkingSchedule = async (id: string) => {
  return await Instance.delete(`/employee/working-schedule/${id}`);
};
