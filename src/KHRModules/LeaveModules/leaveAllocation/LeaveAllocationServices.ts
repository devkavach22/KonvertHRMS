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

// POST: /employee/create/attendance-policy
export const addAttendancePolicy = async (data: any) => {
  return await Instance.post("/employee/create/attendance-policy", data);
};

// PUT: /employee/attendance-policy/:id
export const updateAttendancePolicy = async (id: string, data: any) => {
  return await Instance.put(`/employee/attendance-policy/${id}`, data);
};

// DELETE: /employee/attendance-policy/:id
export const deleteAttendancePolicy = async (id: string) => {
  return await Instance.delete(`/employee/attendance-policy/${id}`);
};

// POST: /api/create/leave-allocate
export const createLeaveAllocation = async (data: any) => {
  try {
    const config: any = { maxBodyLength: Infinity };

    const rawUserId =
      localStorage.getItem("user_id") ||
      localStorage.getItem("userId") ||
      localStorage.getItem("id");
    if (rawUserId) {
      const parsed = Number(rawUserId);
      if (!Number.isNaN(parsed)) config.params = { user_id: parsed };
    }

    const token = localStorage.getItem("authToken");
    if (token) config.headers = { Authorization: token, "Content-Type": "application/json" };

    const response = await Instance.post("/api/create/leave-allocate", data, config);
    return response.data;
  } catch (error: any) {
    console.error("Error creating leave allocation:", error.response?.data ?? error.message ?? error);
    throw error;
  }
};

// GET: /api/leave-allocate
export const getLeaveAllocations = async (): Promise<any[]> => {
  try {
    const config: any = { maxBodyLength: Infinity };

    const rawUserId =
      localStorage.getItem("user_id") ||
      localStorage.getItem("userId") ||
      localStorage.getItem("id");
    if (rawUserId) {
      const parsed = Number(rawUserId);
      if (!Number.isNaN(parsed)) config.params = { user_id: parsed };
    }

    const token = localStorage.getItem("authToken");
    if (token) config.headers = { Authorization: token };

    const response = await Instance.get("/api/leave-allocate", config);
    // normalize response: support array or { data: [...] }
    if (Array.isArray(response.data)) return response.data;
    if (response.data && Array.isArray(response.data.data)) return response.data.data;
    if (response.data && Array.isArray(response.data.items)) return response.data.items;
    return [];
  } catch (error: any) {
    console.error("Error fetching leave allocations:", error.response?.data ?? error.message ?? error);
    return [];
  }
};
