import CONFIG from "@/Config";
import Instance from "../../../api/axiosInstance";
import axios from "axios";

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

// Export attendance to Excel
export const exportAttendanceToExcel = async (
  dateFrom: string,
  dateTo: string
): Promise<void> => {
  try {
    const { user_id } = getAuthDetails();
    const token = localStorage.getItem("authToken");

    const response = await axios.get(
      `${CONFIG.BASE_URL_ALL}/api/admin/attendances/export/excel`,
      {
        params: {
          user_id,
          date_from: dateFrom,
          date_to: dateTo,
        },
        responseType: "blob",
        headers: {
          Authorization: token || "",
        },
      }
    );

    // Create download link
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance_${dateFrom}_to_${dateTo}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export Attendance Error:", error);
    throw error;
  }
};

// Export attendance to PDF
export const exportAttendanceToPdf = async (
  dateFrom: string,
  dateTo: string
): Promise<void> => {
  try {
    const { user_id } = getAuthDetails();
    const token = localStorage.getItem("authToken");

    const response = await axios.get(
      `${CONFIG.BASE_URL_ALL}api/admin/attendances/export/pdf`,
      {
        params: {
          user_id,
          date_from: dateFrom,
          date_to: dateTo,
        },
        responseType: "blob",
        headers: {
          Authorization: token || "",
        },
      }
    );

    // Create download link
    const blob = new Blob([response.data], {
      type: "application/pdf",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance_${dateFrom}_to_${dateTo}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export PDF Error:", error);
    throw error;
  }
};
