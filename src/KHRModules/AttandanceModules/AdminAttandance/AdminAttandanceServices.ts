import Instance from "../../../api/axiosInstance";

/* =======================
Interfaces
======================= */

export interface EmployeeAttendance {
  id?: string;
  Employee_Name: string;
  Attendance_Date: string;
  Status: "Present" | "Absent" | "Leave";
  Created_Date: string;
  key?: string;
}

export interface APIEmployeeAttendance {
  id: number;
  employee: {
    id: number;
    name: string;
  };
  date: string;
  status: "Present" | "Absent" | "Leave";
}

/* =======================
Auth Helper
======================= */

const getAuthDetails = () => {
  const user_id = localStorage.getItem("user_id");
  const unique_user_id = localStorage.getItem("unique_user_id");

  return {
    user_id: user_id ? Number(user_id) : null,
    unique_user_id,
  };
};

/* =======================
API Calls
======================= */

// GET - http://localhost:4000/api/employee-attendance?user_id=219
export const getEmployeeAttendance = async (): Promise<
  APIEmployeeAttendance[]
> => {
  try {
    const { user_id } = getAuthDetails();
    const response = await Instance.get("/api/department", {
      params: { user_id },
    });
    console.log(response.data, "dddddd");

    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};

// POST - http://localhost:4000/api/create/employee-attendance
export const addEmployeeAttendance = async (formData: EmployeeAttendance) => {
  const { user_id, unique_user_id } = getAuthDetails();

  const payload = {
    ...formData,
    user_id,
    unique_user_id,
  };

  return await Instance.post("/api/create/employee-attendance", payload);
};

// PUT - http://localhost:4000/api/employee-attendance/376
export const updateEmployeeAttendance = async (
  id: string,
  formData: EmployeeAttendance
) => {
  const { user_id, unique_user_id } = getAuthDetails();

  const payload = {
    ...formData,
    user_id,
    unique_user_id,
  };

  return await Instance.put(`/api/employee-attendance/${id}`, payload);
};

// DELETE - http://localhost:4000/api/employee-attendance/376?user_id=219
export const deleteEmployeeAttendance = async (id: string) => {
  const { user_id } = getAuthDetails();

  return await Instance.delete(`/api/employee-attendance/${id}`, {
    params: { user_id },
  });
};
