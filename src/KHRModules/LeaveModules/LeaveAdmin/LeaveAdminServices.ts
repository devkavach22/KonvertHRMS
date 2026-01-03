import Instance from "../../../api/axiosInstance";

// --- Types for the Table Rows inside each card ---

export interface PresentEmployeeRow {
  employee_id: number;
  employee_name: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
}

export interface PlannedLeaveRow {
  employee_id: number;
  employee_name: string;
  leave_type: string;
  from: string;
  to: string;
  no_of_days: number;
  status: string;
}

export interface UnplannedLeaveRow {
  employee_id: number;
  employee_name: string;
  department: string;
  last_attendance: string;
  status: string;
}

export interface PendingRequestRow {
  leave_id: number;
  employee_id: number;
  employee_name: string;
  leave_type: string;
  from: string;
  to: string;
  no_of_days: number;
  state: string;
  actions_allowed: string[];
}

// --- Types for the Card Objects ---

export interface CardData<T> {
  count: string | number;
  description: string;
  table: T[];
}

export interface DashboardCards {
  total_present_employee: CardData<PresentEmployeeRow>;
  planned_leaves: CardData<PlannedLeaveRow>;
  unplanned_leaves: CardData<UnplannedLeaveRow>;
  pending_requests: CardData<PendingRequestRow>;
}

export interface LeaveDashboardResponse {
  success: boolean;
  cards: DashboardCards;
  meta: any;
}

const getUserId = () => {
  const id = localStorage.getItem("user_id");
  return id ? Number(id) : 219;
};

export const getLeaveDashboard =
  async (): Promise<LeaveDashboardResponse | null> => {
    try {
      const response = await Instance.get("/api/admin/leave-dashboard", {
        params: { user_id: getUserId() },
      });
      return response.data;
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      return null;
    }
  };
