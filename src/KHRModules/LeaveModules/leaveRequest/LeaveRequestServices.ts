import Instance from "../../../api/axiosInstance";
import { getEmployees } from "../../EmployeModules/Employee/EmployeeServices";

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


// POST: /employee/create/attendance-policy
export const addAttendancePolicy = async (data: any) => {
  return await Instance.post("/employee/create/attendance-policy", data);
};

// GET: /leave-request
export const getLeaveRequests = async () => {
  let user_id = localStorage.getItem("user_id") || localStorage.getItem("userId") || localStorage.getItem("id");
  return await Instance.get(`/api/leave-request?user_id=${user_id}`)
};

// post: http://192.168.11.245:4000/api/create/leave-request?user_id=3145
export const createLeaveRequest = async (data: any) => {
  let user_id = localStorage.getItem("user_id") || localStorage.getItem("userId") || localStorage.getItem("id");

  return await Instance.post(`/api/create/leave-request?user_id=${data.user_id}`, data);
};

// GET employees for leave request selection
export const getEmployeesForLeaveRequest = async () => {
  return await getEmployees();
};
