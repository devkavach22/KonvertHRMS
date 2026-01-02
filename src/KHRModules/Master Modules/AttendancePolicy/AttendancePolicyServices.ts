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
const getUserId = () => {
  const id = localStorage.getItem("user_id");
  return id ? Number(id) : 219; // Defaulting to 219 based on your API specs
};

// GET: /employee/attendance-policies
export const getAttendancePolicies = async (): Promise<
  APIAttendancePolicy[]
> => {
  try {
    const response = await Instance.get("/employee/attendance-policies", {
      params: { user_id: getUserId() },
    });
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
