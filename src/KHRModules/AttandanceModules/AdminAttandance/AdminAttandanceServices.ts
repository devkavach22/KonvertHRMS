import Instance from "../../../api/axiosInstance";

// Admin Attendance API response
export interface APIAdminAttendance {
  id: number;
  check_in: string;
  check_out: string | false;
  worked_hours: number;
  early_out_minutes: number;
  overtime_hours: number;
  is_early_out: boolean;
  validated_overtime_hours: number;
  is_late_in: boolean;
  late_time_display: string;
  status_code: boolean;
}

interface UpdateAttendancePayload {
  check_in: string | null;
  check_out: string | null;
  late_minutes: number;
  production_hours: number;
}

// Helper to get auth details
const getAuthDetails = () => {
  const user_id = localStorage.getItem("user_id");
  const unique_user_id = localStorage.getItem("unique_user_id");

  return {
    user_id: user_id ? Number(user_id) : null,
    unique_user_id,
  };
};

// GET - http://192.168.11.150:4000/api/admin/attendances?user_id=219
export const getAdminAttendance = async (): Promise<APIAdminAttendance[]> => {
  try {
    const { user_id } = getAuthDetails();

    const response = await Instance.get("/api/admin/attendances", {
      params: { user_id },
    });

    return response.data || response.data || [];
  } catch (error) {
    console.error("Admin Attendance Fetch Error:", error);
    return [];
  }
};


export const updateAdminAttendance = async (
  attendanceId: number,
  payload: UpdateAttendancePayload
) => {
  try {
    const response = await Instance.put(
      `/api/admin/updateattendances/${attendanceId}`,
      payload
    );

    return response.data;
  } catch (error) {
    console.error("Update Attendance Error:", error);
    throw error;
  }
};
