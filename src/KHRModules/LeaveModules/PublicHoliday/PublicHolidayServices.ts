import Instance from "../../../api/axiosInstance";

// 1. UI Interface
export interface AttendancePolicy {
  id?: string;
  name: string;
  type: string;
  absent_if: string;
  // Store other fields if you want to show them in the table,
  // otherwise we just need them for the Edit form.
  day_after: number;
  grace_minutes: number;
  no_pay_minutes: number;
  half_day_minutes: number;
  early_grace_minutes: number;
  late_beyond_days: number;
  late_beyond_time: number;
  created_date?: string; // Optional: for display in table
}

// 2. API Interface (Matches the structure of data sent/received)
export interface APIAttendancePolicy {
  id: number;
  name: string | false;
  type: string;
  absent_if: string;
  day_after: number;
  grace_minutes: number;
  no_pay_minutes: number;
  half_day_minutes: number;
  early_grace_minutes: number;
  late_beyond_days: number;
  late_beyond_time: number;
  create_date?: string;
}

// 3. SERVICE FUNCTIONS

// GET: /employee/attendance-policies
export const getAttendancePolicies = async (): Promise<
  APIAttendancePolicy[]
> => {
  try {
    const response = await Instance.get("/employee/attendance-policies");
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching attendance policies:", error);
    return [];
  }
};

// work entry id api :- http://192.168.11.245:4000/api/work-entry-types?user_id=3145
export const getWorkEntryTypes = async (): Promise<any> => {
  let user_id = localStorage.getItem("user_id");
  try {
    const response = await Instance.get(`/work-entry-types?user_id=${user_id}`);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching work entry types:", error);
    return [];
  }
}

// POST :- http://192.168.11.245:4000/api/create/public-holiday?user_id=219
// Create a holiday 
export const createHoliday = async (data: any): Promise<any> => {
  let user_id = localStorage.getItem("user_id");
  return await Instance.post(`/api/create/public-holiday?user_id=${user_id}`, data);
}

// GET : http://192.168.11.245:4000/api/public-holiday?user_id=219
// Get all holidays
export const getHolidays = async (): Promise<any> => {
  let user_id = localStorage.getItem("user_id");  
  return await Instance.get(`/api/public-holiday?user_id=${user_id}`);
} 

// GET :- http://localhost:4000/api/work-entry-types?user_id=159
// work entry type
export const getWorkEntryType = async (): Promise<any> => {
  let user_id = localStorage.getItem("user_id");    
  return await Instance.get(`/api/work-entry-types?user_id=${user_id}`);
}

// GET :- http://192.168.11.245:4000/api/WorkingSchedules?user_id=3145
// calender ID :-
export const getCalenderId = async (): Promise<any> => {
  let user_id = localStorage.getItem("user_id");    
  return await Instance.get(`/api/WorkingSchedules?user_id=${user_id}`);
}

// put :- http://192.168.11.245:4000/api/public-holiday/70?user_id=3145
export const updateHoliday = async (id: number, data: any): Promise<any> => {
  let user_id = localStorage.getItem("user_id");
  return await Instance.put(`/api/public-holiday/${id}?user_id=${user_id}`, data);
}


// delete :- http://192.168.11.245:4000/api/public-holiday/70?user_id=3145
export const deleteHoliday = async (id: number): Promise<any> => {
  let user_id = localStorage.getItem("user_id");
  return await Instance.delete(`/api/public-holiday/${id}?user_id=${user_id}`);

}