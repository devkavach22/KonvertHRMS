import Instance from "../../../api/axiosInstance";

export interface LeaveDashboardRecord {
  id: number | null;
  employee_id: [number, string]; // [ID, Name]
  check_in: string | null;
  check_out: string | null;
  worked_hours: number | null;
  late_time_display: string | null;
  is_late_in: boolean | null;
  job_name: string | null;
  // UI helper
  key?: string;
}

export interface LeaveDashboardMeta {
  TotalEmployee: number;
  Presentemployee: number;
  TotalLateemployee: number;
  TodayAbsetEmployee: number;
  pendingRequests: number;
  plannedLeaves: number;
}

const getUserId = () => {
  const id = localStorage.getItem("user_id");
  return id ? Number(id) : 219;
};

export const getLeaveDashboard = async () => {
  try {
    const response = await Instance.get("/api/admin/leave-dashboard", {
      params: { user_id: getUserId() },
    });
    // Return response.data directly because it contains { data: [], meta: {} }
    return response.data;
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    return null;
  }
};
