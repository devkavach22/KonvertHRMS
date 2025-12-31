import Instance from "../../../api/axiosInstance";
import { toast } from "react-toastify";


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


// --- New: create leave type (POST) ---
// Example POST payload shape:
// {
//   name: "Sick Leave",
//   leave_validation_type: "manager",
//   allocation_validation_type: "manager",
//   requires_allocation: "yes",
//   employee_requests: "yes",
//   responsible_ids: [3, 5],
//   leave_type_code: "SL",
//   leave_category: "statutory",
//   request_unit: "day",
//   include_public_holidays_in_duration: true,
//   overtime_deductible: false,
//   is_earned_leave: true,
// }

export interface LeaveTypePayload {
  name: string;
  leave_validation_type?: string;
  allocation_validation_type?: string;
  requires_allocation?: string;
  employee_requests?: string;
  responsible_ids?: Array<number>;
  leave_type_code?: string;
  leave_category?: string;
  request_unit?: string;
  include_public_holidays_in_duration?: boolean;
  overtime_deductible?: boolean;
  is_earned_leave?: boolean;
  [key: string]: any;
}

/**
 * Create a leave type.
 * @param data payload matching LeaveTypePayload
 * @param userId optional user id to send as query param (e.g. ?user_id=219)
 * @param token optional Authorization token to include in headers
 * @returns server response data
 */
export const createLeaveType = async (data: LeaveTypePayload) => {
  try {
    const config: any = {};
    config.params = { user_id: localStorage.getItem("user_id") };

    const response = await Instance.post("/api/create/leave-type", data, config);
    return response.data;
  } catch (error: any) {
    console.error("Error creating leave type:", error.response?.data ?? error.message ?? error);
    throw error;
  }
};

// GET: /api/leave-types (expects paginated or list response)
export const getLeaveTypesCode = async (): Promise<any[]> => {
  // 1️⃣ Get user_id from localStorage
  const userId = localStorage.getItem("user_id");

  // 2️⃣ Call API with query param
  const response = await Instance.get("/api/leave-type", {
    params: {
      user_id: userId,
    },
  });
  return response.data?.data;
}

// put :- http://192.168.11.245:4000/api/leave-type/1?user_id=3145
// Update a leave type
export const updateLeaveType = async (id: number, data: any) => {
  let user_id = localStorage.getItem("user_id");
  try {
    const response = await Instance.put(`/api/leave-type/${id}?user_id=${user_id}`, data);
    return response.data;
  } catch (error: any) {
    console.log("error occure",error)
  }
}

// Get :- http://192.168.11.245:4000/api/leave-type?user_id=3145
// Get all leave types
export const getAllLeaveTypes = async () => {
  let user_id = localStorage.getItem("user_id");
  const response = await Instance.get(`/api/leave-type?user_id=${user_id}`);
  return response.data;
}


// delete :- http://192.168.11.245:4000/api/leave-type/29?user_id=3145
export const deleteLeaveType = async (id: number) => {
  let user_id = localStorage.getItem("user_id");
  const response = await Instance.delete(`/api/leave-type/${id}?user_id=${user_id}`);
  return response.data;
}
