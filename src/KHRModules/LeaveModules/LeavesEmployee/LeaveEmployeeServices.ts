import Instance from "../../../api/axiosInstance";

export interface EmployeeLeaveRecord {
  id: string;
  type: any; // Can be string or [id, name]
  from_date: string;
  to_date: string;
  no_of_days: number;
  approved_by: any;
  status: string;
  reason: string;
  key?: string;
}

export interface EmployeeLeaveMeta {
  annual_taken: number;
  annual_remaining: number;
  medical_taken: number;
  medical_remaining: number;
  casual_taken: number;
  casual_remaining: number;
  other_taken: number;
  other_remaining: number;
}

const getUserId = () => {
  const id = localStorage.getItem("user_id");
  return id ? Number(id) : 219;
};

export const getEmployeeLeaveDashboard = async () => {
  try {
    const response = await Instance.get("/employee/employee-dashboard", {
      params: { user_id: getUserId() },
    });
    // This returns the whole object: { status, data: [], meta: {} }
    return response.data;
  } catch (error) {
    console.error("Employee Dashboard Fetch Error:", error);
    return null;
  }
};

export const deleteAttendancePolicy = async (id: string) => {
  return await Instance.delete(`/api/employee/leave-delete/${id}`, {
    params: { user_id: getUserId() },
  });
};
