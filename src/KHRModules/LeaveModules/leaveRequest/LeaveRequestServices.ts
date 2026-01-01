import Instance from "../../../api/axiosInstance";
import { getEmployees } from "../../EmployeModules/Employee/EmployeeServices";

// 1. UI Interface for Leave Request
export interface LeaveRequest {
  id?: string | number;
  employees_selection: Array<{id: string | number; name: string}>;
  type: string;
  from_date: string;
  to_date: string;
  no_of_days: string | number;
  holiday_status_id: string | number;
  requested: string | number;
  company: string;
  department: string;
  payslip_state: string;
  hod_document: File | null;
  reason: string;
  employee_id?: string | number;
  employee_name?: string;
  company_name?: string;
  department_name?: string;
  leave_type?: string;
  leave_type_name?: string;
  status?: string;
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

// get :- http://192.168.11.245:4000/api/leave-request?user_id=219
// GET: /leave-request
export const getLeaveRequests = async () => {
  let user_id = localStorage.getItem("user_id") || localStorage.getItem("userId") || localStorage.getItem("id");
  return await Instance.get(`/api/leave-request?user_id=${user_id}`)
};

// post: http://192.168.11.245:4000/api/create/leave-request?user_id=3145
export const createLeaveRequest = async (data: any) => {
  let user_id = localStorage.getItem("user_id") || localStorage.getItem("userId") || localStorage.getItem("id");

  return await Instance.post(`/api/create/leave-request?user_id=${user_id}`, data);
};

// GET employees for leave request selection
export const getEmployeesForLeaveRequest = async () => {
  return await getEmployees();
};


// put :- http://192.168.11.245:4000/api/leave-request/129?user_id=3145
// update leave request
export const updateLeaveRequest = async (id: number, data: any) => {
  let user_id = localStorage.getItem("user_id");
  return await Instance.put(`/api/leave-request/${id}?user_id=${user_id}`, data);
}


// delete :- http://192.168.11.245:4000/api/leave-request/129?user_id=3145
// delete leave request
export const deleteLeaveRequest = async (id: number) => {
  let user_id = localStorage.getItem("user_id");
  return await Instance.delete(`/api/leave-request/${id}?user_id=${user_id}`);
}


