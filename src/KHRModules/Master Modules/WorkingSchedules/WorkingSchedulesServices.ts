import Instance from "../../../api/axiosInstance";

// --- Interfaces ---

export interface AttendanceItem {
  id?: number;
  name: string;
  dayofweek: string; // API returns string "0", "1" etc
  day_period: string;
  hour_from: number;
  hour_to: number;
  week_type?: boolean;
  // API returns [id, name] array sometimes, or just id. We handle both.
  work_entry_type_id: number | [number, string];
}

export interface WorkingSchedule {
  id?: string;
  name: string;
  flexible_hours: boolean;
  is_night_shift: boolean;
  full_time_required_hours: number;
  hours_per_day?: number;
  total_overtime_hours_allowed: number;
  tz: string;
  attendances: AttendanceItem[]; // Changed from attendance_ids to match API
}

// --- Service Functions ---

const getUserId = () => {
  const id = localStorage.getItem("user_id");
  return id ? Number(id) : 3318;
};

// GET List
export const getWorkingSchedules = async (): Promise<WorkingSchedule[]> => {
  try {
    const response = await Instance.get("/api/WorkingSchedules", {
      params: { user_id: getUserId() },
    });

    // Handle various response structures
    let rawData = [];
    if (response.data && Array.isArray(response.data.data)) {
      rawData = response.data.data;
    } else if (Array.isArray(response.data)) {
      rawData = response.data;
    }

    // Map API response to strict Interface
    return rawData.map((item: any) => ({
      id: String(item.id),
      name: item.name || "-",
      flexible_hours: item.flexible_hours || false,
      is_night_shift: item.is_night_shift || false,
      full_time_required_hours: item.full_time_required_hours || 0,
      hours_per_day: item.hours_per_day || 0,
      total_overtime_hours_allowed: item.total_overtime_hours_allowed || 0,
      tz: item.tz || "",
      // API uses 'attendances' key based on your JSON
      attendances: Array.isArray(item.attendances) ? item.attendances : [],
    }));
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return [];
  }
};

export const getTimezones = async (): Promise<any[]> => {
  try {
    const response = await Instance.get("api/timezones");
    return response.data.data || response.data || [];
  } catch (error) {
    return ["UTC", "Asia/Kolkata", "America/New_York", "Europe/London"];
  }
};

export const addWorkingSchedule = async (data: Partial<WorkingSchedule>) => {
  return await Instance.post(
    `/api/create/WorkingSchedules?user_id=${getUserId()}`,
    data,
  );
};

export const updateWorkingSchedule = async (
  id: string,
  data: Partial<WorkingSchedule>,
) => {
  return await Instance.put(
    `/api/update/workingSchedules/${id}?user_id=${getUserId()}`,
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

// import Instance from "../../../api/axiosInstance";

// // 1. UI Interface
// export interface WorkingSchedule {
//   id?: string;
//   name: string;
//   flexible_hours: boolean;
//   is_night_shift: boolean;
//   full_time_required_hours: number;
//   hours_per_day: number; // Added
//   total_overtime_hours_allowed: number; // Added
//   tz: string;
//   key?: string;
// }

// // 2. API Interface
// export interface APIWorkingSchedule {
//   id: number;
//   name: string | false;
//   flexible_hours: boolean;
//   is_night_shift: boolean;
//   full_time_required_hours: number;
//   hours_per_day?: number;
//   total_overtime_hours_allowed?: number;
//   tz: string | false;
// }

// // 3. SERVICE FUNCTIONS
// const getUserId = () => {
//   const id = localStorage.getItem("user_id");
//   return id ? Number(id) : 3145;
// };

// // GET List
// export const getWorkingSchedules = async (): Promise<APIWorkingSchedule[]> => {
//   try {
//     const response = await Instance.get("/api/WorkingSchedules", {
//       params: { user_id: getUserId() },
//     });

//     if (response.data && Array.isArray(response.data.data)) {
//       return response.data.data;
//     }
//     if (Array.isArray(response.data)) {
//       return response.data;
//     }
//     return [];
//   } catch (error) {
//     console.error("Error fetching schedules:", error);
//     return [];
//   }
// };

// // GET Timezones
// export const getTimezones = async (): Promise<string[]> => {
//   try {
//     const response = await Instance.get("api/timezones");
//     return response.data.data || response.data || [];
//   } catch (error) {
//     console.error("Error fetching timezones:", error);
//     return ["UTC", "Asia/Kolkata", "America/New_York", "Europe/London"];
//   }
// };

// // POST Create
// export const addWorkingSchedule = async (data: any) => {
//   const payload = {
//     ...data,
//     user_id: getUserId(),
//   };
//   return await Instance.post("/api/create/WorkingSchedules", payload);
// };

// // PUT Update
// // URL: /api/update/workingSchedules/85?user_id=3145
// export const updateWorkingSchedule = async (id: string | number, data: any) => {
//   const user_id = getUserId();
//   return await Instance.put(
//     `/api/update/workingSchedules/${id}?user_id=${user_id}`,
//     data,
//   );
// };

// // DELETE
// // URL: /api/delete/workingSchedules/85?user_id=3145
// export const deleteWorkingSchedule = async (id: string | number) => {
//   const user_id = getUserId();
//   return await Instance.delete(
//     `/api/delete/workingSchedules/${id}?user_id=${user_id}`,
//   );
// };
