import CONFIG from "@/Config";
import { RegularizationPayload } from "@/KHRModules/AttandanceModules/EmployeeAttandance/AttendanceQueryModal";
import Service from "@/Service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const authheader = () => {
//   const token = localStorage.getItem("token");

//   return {
//     Authorization: token ? `Bearer ${token}` : "",
//     "Content-Type": "application/json",
//   };
// };

// console.log(user_id, "user_iddd");

//Usersignin
export const Usersignin = createAsyncThunk(
  "Usersignin",
  async (userdata, thunkAPI) => {
    try {
      let result = await axios({
        method: "POST",
        baseURL: CONFIG.BASE_URL_ALL,
        // headers: authheader,
        url: `api/login`,
        data: userdata,
      });
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ Usersignin ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error", });
    }
  },
);
//
// https://konverthrnode.onrender.com/api/auth

export const ApiAuth = createAsyncThunk("ApiAuth", async (_, thunkAPI) => {
  try {
    console.log("BASE_URL_ALL 👉", CONFIG.BASE_URL_ALL);
    let result = await axios({
      method: "POST",
      baseURL: CONFIG.BASE_URL_ALL,
      // headers: authheader,
      url: `api/auth`,
      data: { user_name: "dhaval" },
    });
    if (result.data) {
      localStorage.setItem("authToken", result?.data?.token);
      return result.data;
    } else {
      return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
    }
  } catch (error: any) {
    console.error("try catch [ Usersignin ] error.message >>", error?.message);
    return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error", });
  }
});

//AttendancesApi
export const AttendancesApi = createAsyncThunk(
  "AttendancesApi",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
      const user_id = localStorage.getItem("user_id");
      console.log(user_id,"user_id");
      

      let result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
        },
        url: `/api/admin/attendances`,
        params: { user_id },
      });
      // console.log(result.data)
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ AttendancesApi ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);
//AttendancesGetApi
export const AttendancesGetApi = createAsyncThunk(
  "AttendancesGetApi",
  async (userdata: { 
    employee_id?: string; 
    date_from?: string; 
    date_to?: string; 
  } = {}, thunkAPI) => {
    console.log(userdata);
    try {
      const user_id = localStorage.getItem("user_id");
      const params: any = { user_id };
      
      // Add employee_id parameter if provided
      if (userdata.employee_id) {
        params.employee_id = userdata.employee_id;
      }
      
      // Add date range parameters if provided
      if (userdata.date_from) {
        params.date_from = userdata.date_from;
      }
      if (userdata.date_to) {
        params.date_to = userdata.date_to;
      }

      let result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/admin/attendances`,
        params,
      });
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ AttendancesGetApi ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);
//UpdateAdminAttendanceApi
export const UpdateAdminAttendanceApi = createAsyncThunk(
  "UpdateAdminAttendanceApi",
  async (
    userdata: { attendanceId: string | number; payload: any },
    thunkAPI,
  ) => {
    console.log(userdata);
    try {
      const user_id = localStorage.getItem("user_id");
      let result = await axios({
        method: "PUT",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/admin/updateattendances/${userdata?.attendanceId}`,
        data: userdata?.payload,
      });
      // console.log(result.data)
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ UpdateAdminAttendanceApi ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);
export const AdminWorkingHours = createAsyncThunk(
  "AdminWorkingHours",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
      const user_id = localStorage.getItem("user_id");
      let result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/employee/working-hours`,
        params: { user_id },
      });
      // console.log(result.data)
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ AdminWorkingHours ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);

export const EmployeeRegcategories = createAsyncThunk(
  "EmployeeRegcategories",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
      const user_id = localStorage.getItem("user_id");
      let result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/regcategories`,
        params: { user_id },
      });
      // console.log(result.data)
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ AdminWorkingHours ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);

// Create Regularization Category
export const createRegCategory = createAsyncThunk(
  "createRegCategory",
  async (userdata: { type: string }, thunkAPI) => {
    try {
      const user_id = localStorage.getItem("user_id");
      let result = await axios({
        method: "POST",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/create/regcategory`,
        params: { user_id },
        data: userdata,
      });
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ createRegCategory ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({
        error: error?.response?.data?.errorMessage || error?.message || "API error"
      });
    }
  },
);

export const EmployeeAttendanceApi = createAsyncThunk(
  "EmployeeAttendanceApi",
  async (userdata: { 
    month?: number; 
    year?: number; 
    date_from?: string; 
    date_to?: string; 
  } = {}, thunkAPI) => {
    console.log(userdata);
    try {
      const user_id = localStorage.getItem("user_id");
      const params: any = { user_id };
      
      // Add month and year parameters if provided
      if (userdata.month) {
        params.month = userdata.month;
      }
      if (userdata.year) {
        params.year = userdata.year;
      }
      
      // Add date range parameters if provided (for multi-month queries)
      if (userdata.date_from) {
        params.date_from = userdata.date_from;
      }
      if (userdata.date_to) {
        params.date_to = userdata.date_to;
      }

      let result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/employee/attendance`,
        params,
      });
      // console.log(result.data)
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ EmployeeAttendanceApi ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);

export const Employeeregularization = createAsyncThunk(
  "Employeeregularization",
  async (userdata: RegularizationPayload, thunkAPI) => {
    console.log(userdata, "userdata");
    try {
      const user_id = localStorage.getItem("user_id");
      let result = await axios({
        method: "POST",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/create/regularization`,
        params: { user_id },
        data: userdata,
      });
      // console.log(result.data)
      if (result.data) {
        return result.data;
      } else {
        console.log(result, "uiui");
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.log("====================================");
      console.log(error, "uiui");
      console.log("====================================");
      console.error(
        "try catch [ AdminWorkingHours ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);

// Get Regularization Status
export const getRegularizationStatus = createAsyncThunk(
  "getRegularizationStatus",
  async (userdata, thunkAPI) => {
    try {
      const user_id = localStorage.getItem("user_id");
      let result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/regularization`,
        params: { user_id },
      });
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ getRegularizationStatus ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);

export const getCurrentAttendanceStatus = createAsyncThunk(
  "getCurrentAttendanceStatus",
  async (_, thunkAPI) => {
    try {
      const user_id = localStorage.getItem("user_id");
      const email = localStorage.getItem("user_email");
      const authToken = localStorage.getItem("authToken");

      // Validate required data before making API call
      if (!user_id || !email) {
        console.error("❌ Missing user_id or email for getCurrentAttendanceStatus");
        return thunkAPI.rejectWithValue({ error: "Missing user credentials" });
      }

      if (!authToken || authToken === "undefined" || authToken === "null") {
        console.error("❌ Missing or invalid authToken for getCurrentAttendanceStatus");
        return thunkAPI.rejectWithValue({ error: "Missing authentication token" });
      }

      let result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${authToken}`,
        },
        url: `/api/checkin_checkout_status`,
        params: { user_id, email },
      });

      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ getCurrentAttendanceStatus ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);

export const CheckinCheckout = createAsyncThunk(
  "CheckinCheckout",
  async (userdata: { Latitude: number; Longitude: number }, thunkAPI) => {
    try {
      const user_id = localStorage.getItem("user_id");
      const email = localStorage.getItem("user_email");

      const payload = {
        ...userdata,
        email,
      };

      console.log(payload, "final payload");

      const result = await axios({
        method: "POST",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/employee/attandence`,
        params: { user_id }, // still sent as query param
        data: payload, // 👈 merged payload
      });

      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({
          error: result.data?.errorMessage || "Unknown error",
        });
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        error: error?.response?.data?.errorMessage || error?.message || "API error"
      });
    }
  },
);

export const GetStructureTypes = createAsyncThunk(
  "GetStructureTypes",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
      const user_id = localStorage.getItem("user_id");
      let result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/structure-types`,
        params: { user_id },
      });
      // console.log(result.data)
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ AttendancesGetApi ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);

export const getCountries = createAsyncThunk(
  "getCountries",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
      const user_id = localStorage.getItem("user_id");
      let result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/countries`,
        params: { user_id },
      });
      // console.log(result.data)
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ AttendancesGetApi ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);

export const getWorkingSchedules = createAsyncThunk(
  "getWorkingSchedules",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
      const user_id = localStorage.getItem("user_id");
      let result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/WorkingSchedules`,
        params: { user_id },
      });
      // console.log(result.data)
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ AttendancesGetApi ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);

export const getRegularPayStructure = createAsyncThunk(
  "getRegularPayStructure",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
      const user_id = localStorage.getItem("user_id");
      let result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/salary-structure`,
        params: { user_id },
      });
      // console.log(result.data)
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ getRegularPayStructure ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);

export const getWorkEntryType = createAsyncThunk(
  "getWorkEntryType",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
      const user_id = localStorage.getItem("user_id");
      let result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/work-entry-types`,
        params: { user_id },
      });
      // console.log(result.data)
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ getRegularPayStructure ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);

export const getSalaryRules = createAsyncThunk(
  "getSalaryRules",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
      const user_id = localStorage.getItem("user_id");
      let result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/salary-rules`,
        params: { user_id },
      });
      // console.log(result.data)
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ getSalaryRules ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);

export const getSalaryStructure = createAsyncThunk(
  "getSalaryStructure",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
      const user_id = localStorage.getItem("user_id");
      let result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/salary-structure`,
        params: { user_id },
      });
      // console.log(result.data)
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ getSalaryRules ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);

export const getDashboadrdCount = createAsyncThunk(
  "getDashboadrdCount",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
      const user_id = localStorage.getItem("user_id");
      let result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/getClientLeaveDashboardCount`,
        params: { user_id },
      });
      // console.log(result.data)
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ getSalaryRules ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);

// Employee Attendance Export Excel
export const EmployeeAttendanceExportExcel = createAsyncThunk(
  "EmployeeAttendanceExportExcel",
  async (userdata: { date_from: string; date_to: string }, thunkAPI) => {
    try {
      const user_id = localStorage.getItem("user_id");
      const result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/employee/attendance/export/excel`,
        params: {
          user_id,
          date_from: userdata.date_from,
          date_to: userdata.date_to,
        },
        responseType: "blob",
      });

      if (result.data) {
        // Create download link
        const blob = new Blob([result.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `employee_attendance_${userdata.date_from}_to_${userdata.date_to}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return { success: true, message: "Excel exported successfully" };
      } else {
        return thunkAPI.rejectWithValue({ error: "Export failed" });
      }
    } catch (error: any) {
      console.error(
        "try catch [ EmployeeAttendanceExportExcel ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);

// Employee Attendance Export PDF
export const EmployeeAttendanceExportPdf = createAsyncThunk(
  "EmployeeAttendanceExportPdf",
  async (userdata: { date_from: string; date_to: string }, thunkAPI) => {
    try {
      const user_id = localStorage.getItem("user_id");
      const result = await axios({
        method: "GET",
        baseURL: "http://10.221.59.471:4000",
        headers: {
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/employee/attendance/export/pdf`,
        params: {
          user_id,
          date_from: userdata.date_from,
          date_to: userdata.date_to,
        },
        responseType: "blob",
      });

      if (result.data) {
        // Create download link
        const blob = new Blob([result.data], {
          type: "application/pdf",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `employee_attendance_${userdata.date_from}_to_${userdata.date_to}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return { success: true, message: "PDF exported successfully" };
      } else {
        return thunkAPI.rejectWithValue({ error: "Export failed" });
      }
    } catch (error: any) {
      console.error(
        "try catch [ EmployeeAttendanceExportPdf ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);

// Admin Attendance Export Excel
export const AdminAttendanceExportExcel = createAsyncThunk(
  "AdminAttendanceExportExcel",
  async (userdata: { date_from: string; date_to: string }, thunkAPI) => {
    try {
      const user_id = localStorage.getItem("user_id");
      const result = await axios({
        method: "GET",
        baseURL: "http://10.221.59.471:4000",
        headers: {
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/admin/attendances/export/excel`,
        params: {
          user_id,
          date_from: userdata.date_from,
          date_to: userdata.date_to,
        },
        responseType: "blob",
      });

      if (result.data) {
        const blob = new Blob([result.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `admin_attendance_${userdata.date_from}_to_${userdata.date_to}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return { success: true, message: "Excel exported successfully" };
      } else {
        return thunkAPI.rejectWithValue({ error: "Export failed" });
      }
    } catch (error: any) {
      console.error(
        "try catch [ AdminAttendanceExportExcel ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);

// Admin Attendance Export PDF
export const AdminAttendanceExportPdf = createAsyncThunk(
  "AdminAttendanceExportPdf",
  async (userdata: { date_from: string; date_to: string }, thunkAPI) => {
    try {
      const user_id = localStorage.getItem("user_id");
      const result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/admin/attendances/export/pdf`,
        params: {
          user_id,
          date_from: userdata.date_from,
          date_to: userdata.date_to,
        },
        responseType: "blob",
      });

      if (result.data) {
        const blob = new Blob([result.data], {
          type: "application/pdf",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `admin_attendance_${userdata.date_from}_to_${userdata.date_to}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return { success: true, message: "PDF exported successfully" };
      } else {
        return thunkAPI.rejectWithValue({ error: "Export failed" });
      }
    } catch (error: any) {
      console.error(
        "try catch [ AdminAttendanceExportPdf ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);

// Get Employees Basic Info
export const getEmployeesBasicInfo = createAsyncThunk(
  "getEmployeesBasicInfo",
  async (userdata: { user_id?: number } = {}, thunkAPI) => {
    console.log(userdata);
    try {
      const user_id = localStorage.getItem("user_id");
      const finalUserId = userdata.user_id || user_id;

      let result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/employee/employees-basic-info`,
        params: { user_id: finalUserId },
      });
      
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ getEmployeesBasicInfo ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);

// Get Contracts API
export const getContractsApi = createAsyncThunk(
  "getContractsApi",
  async (userdata, thunkAPI) => {
    try {
      const user_id = localStorage.getItem("user_id");
      let result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/contracts`,
        params: { user_id },
      });
      
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ getContractsApi ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);

// Create Contract API
export const createContractApi = createAsyncThunk(
  "createContractApi",
  async (contractData: any, thunkAPI) => {
    try {
      const user_id = localStorage.getItem("user_id");
      let result = await axios({
        method: "POST",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/create/contracts`,
        params: { user_id },
        data: contractData,
      });
      
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ createContractApi ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);

// Update Contract API
export const updateContractApi = createAsyncThunk(
  "updateContractApi",
  async (userdata: { contractId: string | number; payload: any }, thunkAPI) => {
    try {
      const user_id = localStorage.getItem("user_id");
      let result = await axios({
        method: "PUT",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/contracts/${userdata.contractId}`,
        params: { user_id },
        data: userdata.payload,
      });
      
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ updateContractApi ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);

// Delete Contract API
export const deleteContractApi = createAsyncThunk(
  "deleteContractApi",
  async (contractId: string | number, thunkAPI) => {
    try {
      const user_id = localStorage.getItem("user_id");
      let result = await axios({
        method: "DELETE",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/contracts/${contractId}`,
        params: { user_id },
      });
      
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ deleteContractApi ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);

// Get Departments API
export const getDepartmentsApi = createAsyncThunk(
  "getDepartmentsApi",
  async (userdata, thunkAPI) => {
    try {
      const user_id = localStorage.getItem("user_id");
      let result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/department`,
        params: { user_id },
      });
      
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ getDepartmentsApi ] error.message >>",
        error?.message,
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.errorMessage || error?.message || "API error" });
    }
  },
);

export const TBSlice = createSlice({
  name: "TBSlice",
  initialState: {
    //Usersignin
    isUsersignin: false,
    isUsersigninFetching: false,
    UsersigninData: {},

    //ApiAuth
    isApiAuth: false,
    isApiAuthFetching: false,
    ApiAuthData: {},

    //AttendancesApi
    isAttendancesApi: false,
    isAttendancesApiFetching: false,
    AttendancesApiData: [],

    //AttendancesGetApi
    isAttendancesGetApi: false,
    isAttendancesGetApiFetching: false,
    AttendancesGetApiData: [],

    // AdminWorkingHours
    isAdminWorkingHours: false,
    isAdminWorkingHoursFetching: false,
    AdminWorkingHoursData: [],

    // getDashboadrdCount
    isgetDashboadrdCount: false,
    isgetDashboadrdCountFetching: false,
    getDashboadrdCountData: [],

    // Employee Attendance Export
    isEmployeeAttendanceExportExcel: false,
    isEmployeeAttendanceExportExcelFetching: false,
    isEmployeeAttendanceExportPdf: false,
    isEmployeeAttendanceExportPdfFetching: false,

    // Admin Attendance Export
    isAdminAttendanceExportExcel: false,
    isAdminAttendanceExportExcelFetching: false,
    isAdminAttendanceExportPdf: false,
    isAdminAttendanceExportPdfFetching: false,

    // getSalaryStructure
    isgetSalaryStructure: false,
    isgetSalaryStructureFetching: false,
    getSalaryStructureData: [],

    // getWorkEntryType
    isgetWorkEntryType: false,
    isgetWorkEntryTypeFetching: false,
    getWorkEntryTypeData: [],

    //  getSalaryRules
    isgetSalaryRules: false,
    isgetSalaryRulesFetching: false,
    getSalaryRulesData: [],

    // getRegularPayStructure
    isgetRegularPayStructure: false,
    isgetRegularPayStructureFetching: false,
    getRegularPayStructureData: [],

    // Employeeregularization
    isEmployeeregularization: false,
    isEmployeeregularizationFetching: false,
    EmployeeregularizationData: [],

    // getRegularizationStatus
    isGetRegularizationStatus: false,
    isGetRegularizationStatusFetching: false,
    getRegularizationStatusData: [],

    // getCountries
    isGetCountries: false,
    isGetCountriesFetching: false,
    GetCountriesData: [],

    // getWorkingSchedules
    isgetWorkingSchedules: false,
    isgetWorkingSchedulesFetching: false,
    getWorkingSchedulesData: [],

    // GetStructureTypes
    isGetStructureTypes: false,
    isGetStructureTypesFetching: false,
    GetStructureTypesData: [],

    // EmployeeAttendanceApi
    isEmployeeAttendanceApi: false,
    isEmployeeAttendanceApiFetching: false,
    EmployeeAttendanceApiData: [],

    // EmployeeRegcategories
    isEmployeeRegcategories: false,
    isEmployeeRegcategoriesFetching: false,
    EmployeeRegcategoriesData: [],

    // createRegCategory
    isCreateRegCategory: false,
    isCreateRegCategoryFetching: false,
    createRegCategoryData: {},

    // CheckinCheckout
    isCheckinCheckout: false,
    isCheckinCheckoutFetching: false,
    CheckinCheckoutData: [],

    // getEmployeesBasicInfo
    isGetEmployeesBasicInfo: false,
    isGetEmployeesBasicInfoFetching: false,
    getEmployeesBasicInfoData: [],

    // Contracts APIs
    isGetContractsApi: false,
    isGetContractsApiFetching: false,
    getContractsApiData: [],

    isCreateContractApi: false,
    isCreateContractApiFetching: false,
    createContractApiData: {},

    isUpdateContractApi: false,
    isUpdateContractApiFetching: false,
    updateContractApiData: {},

    isDeleteContractApi: false,
    isDeleteContractApiFetching: false,
    deleteContractApiData: {},

    // getDepartmentsApi
    isGetDepartmentsApi: false,
    isGetDepartmentsApiFetching: false,
    getDepartmentsApiData: [],

    // getCurrentAttendanceStatus
    isGetCurrentAttendanceStatus: false,
    isGetCurrentAttendanceStatusFetching: false,
    getCurrentAttendanceStatusData: {},

    //UpdateAdminAttendanceApi
    isUpdateAdminAttendanceApi: false,
    isUpdateAdminAttendanceApiFetching: false,
    UpdateAdminAttendanceApiData: {},

    //successMessage
    isSuccess: false,
    successMessage: "",

    //Error Messge
    isError: false,
    errorMessage: "",
  },
  reducers: {
    updateState: (state, { payload }) => {
      //Usersignin
      state.isUsersignin =
        payload.isUsersignin !== undefined
          ? payload.isUsersignin
          : state.isUsersignin;

      //AttendancesApi
      state.isAttendancesApi =
        payload.isAttendancesApi !== undefined
          ? payload.isAttendancesApi
          : state.isAttendancesApi;

      //isApiAuth
      state.isApiAuth =
        payload.isApiAuth !== undefined ? payload.isApiAuth : state.isApiAuth;

      //AttendancesGetApi
      state.isAttendancesGetApi =
        payload.isAttendancesGetApi !== undefined
          ? payload.isAttendancesGetApi
          : state.isAttendancesGetApi;

      // getWorkingSchedules
      state.isgetWorkingSchedules =
        payload.isgetWorkingSchedules !== undefined
          ? payload.isgetWorkingSchedules
          : state.isgetWorkingSchedules;
      // AdminWorkingHours
      state.isAdminWorkingHours =
        payload.isAdminWorkingHours !== undefined
          ? payload.isAdminWorkingHours
          : state.isAdminWorkingHours;

      // getRegularPayStructure

      state.isgetRegularPayStructure =
        payload.isgetRegularPayStructure !== undefined
          ? payload.isgetRegularPayStructure
          : state.isgetRegularPayStructure;
      // getCountries
      state.isGetCountries =
        payload.isGetCountries !== undefined
          ? payload.isGetCountries
          : state.isGetCountries;

      // EmployeeRegcategories
      state.isEmployeeRegcategories =
        payload.isEmployeeRegcategories !== undefined
          ? payload.isEmployeeRegcategories
          : state.isEmployeeRegcategories;

      // createRegCategory
      state.isCreateRegCategory =
        payload.isCreateRegCategory !== undefined
          ? payload.isCreateRegCategory
          : state.isCreateRegCategory;

      // EmployeeAttendanceApi
      state.isEmployeeAttendanceApi =
        payload.isEmployeeAttendanceApi !== undefined
          ? payload.isEmployeeAttendanceApi
          : state.isEmployeeAttendanceApi;

      // CheckinCheckoutData
      state.isCheckinCheckout =
        payload.isCheckinCheckout !== undefined
          ? payload.isCheckinCheckout
          : state.isCheckinCheckout;

      // getWorkEntryType

      state.isgetWorkEntryType =
        payload.isgetWorkEntryType !== undefined
          ? payload.isgetWorkEntryType
          : state.isgetWorkEntryType;

      // GetStructureTypes
      state.isGetStructureTypes =
        payload.isGetStructureTypes !== undefined
          ? payload.isGetStructureTypes
          : state.isGetStructureTypes;
      // Employeeregularization
      state.isEmployeeregularization =
        payload.isEmployeeregularization !== undefined
          ? payload.isEmployeeregularization
          : state.isEmployeeregularization;

      // getRegularizationStatus
      state.isGetRegularizationStatus =
        payload.isGetRegularizationStatus !== undefined
          ? payload.isGetRegularizationStatus
          : state.isGetRegularizationStatus;
      //UpdateAdminAttendanceApi
      state.isUpdateAdminAttendanceApi =
        payload.isUpdateAdminAttendanceApi !== undefined
          ? payload.isUpdateAdminAttendanceApi
          : state.isUpdateAdminAttendanceApi;

      // getDashboadrdCount

      state.isgetDashboadrdCount =
        payload.isgetDashboadrdCount !== undefined
          ? payload.isgetDashboadrdCount
          : state.isgetDashboadrdCount;

      // Employee Attendance Export
      state.isEmployeeAttendanceExportExcel =
        payload.isEmployeeAttendanceExportExcel !== undefined
          ? payload.isEmployeeAttendanceExportExcel
          : state.isEmployeeAttendanceExportExcel;
      state.isEmployeeAttendanceExportPdf =
        payload.isEmployeeAttendanceExportPdf !== undefined
          ? payload.isEmployeeAttendanceExportPdf
          : state.isEmployeeAttendanceExportPdf;

      // Admin Attendance Export
      state.isAdminAttendanceExportExcel =
        payload.isAdminAttendanceExportExcel !== undefined
          ? payload.isAdminAttendanceExportExcel
          : state.isAdminAttendanceExportExcel;
      state.isAdminAttendanceExportPdf =
        payload.isAdminAttendanceExportPdf !== undefined
          ? payload.isAdminAttendanceExportPdf
          : state.isAdminAttendanceExportPdf;

      // getEmployeesBasicInfo
      state.isGetEmployeesBasicInfo =
        payload.isGetEmployeesBasicInfo !== undefined
          ? payload.isGetEmployeesBasicInfo
          : state.isGetEmployeesBasicInfo;

      // Contracts APIs
      state.isGetContractsApi =
        payload.isGetContractsApi !== undefined
          ? payload.isGetContractsApi
          : state.isGetContractsApi;

      state.isCreateContractApi =
        payload.isCreateContractApi !== undefined
          ? payload.isCreateContractApi
          : state.isCreateContractApi;

      state.isUpdateContractApi =
        payload.isUpdateContractApi !== undefined
          ? payload.isUpdateContractApi
          : state.isUpdateContractApi;

      state.isDeleteContractApi =
        payload.isDeleteContractApi !== undefined
          ? payload.isDeleteContractApi
          : state.isDeleteContractApi;

      // getDepartmentsApi
      state.isGetDepartmentsApi =
        payload.isGetDepartmentsApi !== undefined
          ? payload.isGetDepartmentsApi
          : state.isGetDepartmentsApi;

      state.isgetSalaryRules =
        payload.isgetSalaryRules !== undefined
          ? payload.isgetSalaryRules
          : state.isgetSalaryRules;

      // successUpdate
      state.isSuccess =
        payload.isSuccess !== undefined ? payload.isSuccess : state.isSuccess;
      state.successMessage =
        payload.successMessage !== undefined
          ? payload.successMessage
          : state.successMessage;

      // ErrorUpdate
      state.isError =
        payload.isError !== undefined ? payload.isError : state.isError;
      state.errorMessage =
        payload.errorMessage !== undefined
          ? payload.errorMessage
          : state.errorMessage;
      return state;
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(Usersignin.fulfilled, (state, { payload }) => {
    //   try {
    //     state.UsersigninData = payload;
    //     state.isUsersignin = true;
    //     state.isUsersigninFetching = false;
    //     state.isSuccess = true;
    //     state.successMessage = "Login Successfull";
    //     state.isError = false;
    //     state.errorMessage = "";
    //     return state;
    //   } catch (error) {
    //     console.error("Error: Usersignin.fulfilled try catch error >>", error);
    //   }
    // });
    // builder.addCase(
    //   Usersignin.rejected,
    //   (state, { payload }: { payload: any }) => {
    //     try {
    //       state.UsersigninData = {};
    //       state.isUsersignin = false;
    //       state.isUsersigninFetching = false;
    //       state.isError = true;
    //       payload
    //         ? (state.errorMessage = payload?.error?.message
    //             ? "Please try again (There was some network issue)."
    //             : "Please try again (There was some network issue).")
    //         : (state.errorMessage = "API Response Invalid. Please Check API");
    //     } catch (error) {
    //       console.error(
    //         "Error: [Usersignin.rejected] try catch error >>",
    //         error,
    //       );
    //     }
    //   },
    // );
    // builder.addCase(Usersignin.pending, (state) => {
    //   state.isUsersigninFetching = true;
    // });
    ///ApiAuth
    builder.addCase(ApiAuth.fulfilled, (state, { payload }) => {
      try {
        state.ApiAuthData = payload;
        state.isApiAuth = true;
        state.isApiAuthFetching = false;
        state.isSuccess = false;
        state.successMessage = "";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error("Error: ApiAuth.fulfilled try catch error >>", error);
      }
    });
    builder.addCase(
      ApiAuth.rejected,
      (state, { payload }: { payload: any }) => {
        try {
          state.ApiAuthData = {};
          state.isApiAuth = false;
          state.isApiAuthFetching = false;
          state.isError = false;
          payload
            ? (state.errorMessage = payload?.error?.message
              ? payload?.error?.message || payload?.error
              : payload?.error)
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [Usersignin.rejected] try catch error >>",
            error,
          );
        }
      },
    );
    builder.addCase(ApiAuth.pending, (state) => {
      state.isApiAuthFetching = true;
    });

    //AttendancesApi
    builder.addCase(AttendancesApi.fulfilled, (state, { payload }) => {
      try {
        state.AttendancesApiData = payload;
        state.isAttendancesApi = true;
        state.isAttendancesApiFetching = false;
        state.isSuccess = true;
        state.successMessage = payload?.message || "";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error(
          "Error: AttendancesApi.fulfilled try catch error >>",
          error,
        );
      }
    });
    builder.addCase(
      AttendancesApi.rejected,
      (state, { payload }: { payload: any }) => {
        try {
          // state.AttendancesApiData = {};
          state.isAttendancesApi = false;
          state.isAttendancesApiFetching = false;
          state.isError = true;
          payload
            ? (state.errorMessage = payload?.error?.message
              ? payload?.error?.message || payload?.error
              : payload?.error)
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesApi.rejected] try catch error >>",
            error,
          );
        }
      },
    );
    builder.addCase(AttendancesApi.pending, (state) => {
      state.isAttendancesApiFetching = true;
    });
    //AttendancesGetApi
    builder.addCase(AttendancesGetApi.fulfilled, (state, { payload }) => {
      try {
        state.AttendancesGetApiData = payload;
        state.isAttendancesGetApi = true;
        state.isAttendancesGetApiFetching = false;
        state.isSuccess = true;
        state.successMessage = payload?.message || "";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error(
          "Error: AttendancesGetApi.fulfilled try catch error >>",
          error,
        );
      }
    });
    builder.addCase(
      AttendancesGetApi.rejected,
      (state, { payload }: { payload: any }) => {
        try {
          // state.AttendancesGetApiData = {};
          state.isAttendancesGetApi = false;
          state.isAttendancesGetApiFetching = false;
          state.isError = true;
          payload
            ? (state.errorMessage = payload?.error?.message
              ? payload?.error?.message || payload?.error
              : payload?.error)
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error,
          );
        }
      },
    );
    builder.addCase(AttendancesGetApi.pending, (state) => {
      state.isAttendancesGetApiFetching = true;
    });
    //UpdateAdminAttendanceApi
    builder.addCase(
      UpdateAdminAttendanceApi.fulfilled,
      (state, { payload }) => {
        try {
          state.UpdateAdminAttendanceApiData = payload;
          state.isUpdateAdminAttendanceApi = true;
          state.isUpdateAdminAttendanceApiFetching = false;
          state.isSuccess = true;
          state.successMessage = payload?.message || "";
          state.isError = false;
          state.errorMessage = "";
          return state;
        } catch (error) {
          console.error(
            "Error: UpdateAdminAttendanceApi.fulfilled try catch error >>",
            error,
          );
        }
      },
    );
    builder.addCase(
      UpdateAdminAttendanceApi.rejected,
      (state, { payload }: { payload: any }) => {
        try {
          // state.UpdateAdminAttendanceApiData = {};
          state.isUpdateAdminAttendanceApi = false;
          state.isUpdateAdminAttendanceApiFetching = false;
          state.isError = true;
          payload
            ? (state.errorMessage = payload?.error?.message
              ? payload?.error?.message || payload?.error
              : payload?.error)
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [UpdateAdminAttendanceApi.rejected] try catch error >>",
            error,
          );
        }
      },
    );
    builder.addCase(UpdateAdminAttendanceApi.pending, (state) => {
      state.isUpdateAdminAttendanceApiFetching = true;
    });

    // AdminWorkingHours

    builder.addCase(AdminWorkingHours.fulfilled, (state, { payload }) => {
      try {
        state.AdminWorkingHoursData = payload;
        state.isAdminWorkingHours = true;
        state.isAdminWorkingHoursFetching = false;
        state.isSuccess = true;
        state.successMessage = payload?.message || "";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error(
          "Error: AttendancesGetApi.fulfilled try catch error >>",
          error,
        );
      }
    });
    builder.addCase(
      AdminWorkingHours.rejected,
      (state, { payload }: { payload: any }) => {
        try {
          // state.AttendancesGetApiData = {};
          state.isAdminWorkingHours = false;
          state.isAdminWorkingHoursFetching = false;
          state.isError = true;
          payload
            ? (state.errorMessage = payload?.error?.message
              ? payload?.error?.message || payload?.error
              : payload?.error)
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error,
          );
        }
      },
    );
    builder.addCase(AdminWorkingHours.pending, (state) => {
      state.isAdminWorkingHoursFetching = true;
    });

    // EmployeeAttendanceApi
    builder.addCase(EmployeeAttendanceApi.fulfilled, (state, { payload }) => {
      try {
        state.EmployeeAttendanceApiData = payload;
        state.isEmployeeAttendanceApi = true;
        state.isEmployeeAttendanceApiFetching = false;
        state.isSuccess = false;
        state.successMessage = payload?.message || "";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error(
          "Error: AttendancesGetApi.fulfilled try catch error >>",
          error,
        );
      }
    });
    builder.addCase(
      EmployeeAttendanceApi.rejected,
      (state, { payload }: { payload: any }) => {
        try {
          // state.AttendancesGetApiData = {};
          state.isEmployeeAttendanceApi = false;
          state.isEmployeeAttendanceApiFetching = false;
          state.isError = true;
          payload
            ? (state.errorMessage = payload?.error?.message
              ? payload?.error?.message || payload?.error
              : payload?.error)
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error,
          );
        }
      },
    );
    builder.addCase(EmployeeAttendanceApi.pending, (state) => {
      state.isEmployeeAttendanceApiFetching = true;
    });

    builder.addCase(EmployeeRegcategories.fulfilled, (state, { payload }) => {
      try {
        state.EmployeeRegcategoriesData = payload;
        state.isEmployeeRegcategories = true;
        state.isEmployeeRegcategoriesFetching = false;
        state.isSuccess = true;
        state.successMessage = payload?.message || "";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error(
          "Error: AttendancesGetApi.fulfilled try catch error >>",
          error,
        );
      }
    });
    builder.addCase(
      EmployeeRegcategories.rejected,
      (state, { payload }: { payload: any }) => {
        try {
          state.isEmployeeRegcategories = false;
          state.isEmployeeRegcategoriesFetching = false;
          state.isError = true;
          payload
            ? (state.errorMessage = payload?.error?.message
              ? payload?.error?.message || payload?.error
              : payload?.error)
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error,
          );
        }
      },
    );
    builder.addCase(EmployeeRegcategories.pending, (state) => {
      state.isEmployeeRegcategoriesFetching = true;
    });

    // createRegCategory extraReducers
    builder.addCase(createRegCategory.fulfilled, (state, { payload }) => {
      try {
        state.createRegCategoryData = payload;
        state.isCreateRegCategory = true;
        state.isCreateRegCategoryFetching = false;
        state.isSuccess = true;
        state.successMessage =
          payload?.message || "Category created successfully";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error(
          "Error: createRegCategory.fulfilled try catch error >>",
          error,
        );
      }
    });
    builder.addCase(
      createRegCategory.rejected,
      (state, { payload }: { payload: any }) => {
        try {
          state.isCreateRegCategory = false;
          state.isCreateRegCategoryFetching = false;
          state.isError = true;
          state.errorMessage = payload?.error || "Failed to create category";
        } catch (error) {
          console.error(
            "Error: [createRegCategory.rejected] try catch error >>",
            error,
          );
        }
      },
    );
    builder.addCase(createRegCategory.pending, (state) => {
      state.isCreateRegCategoryFetching = true;
    });

    builder.addCase(Employeeregularization.fulfilled, (state, { payload }) => {
      try {
        state.EmployeeregularizationData = payload;
        state.isEmployeeregularization = true;
        state.isEmployeeregularizationFetching = false;
        state.isSuccess = true;
        state.successMessage = payload?.message || "";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error(
          "Error: AttendancesGetApi.fulfilled try catch error >>",
          error,
        );
      }
    });
    builder.addCase(
      Employeeregularization.rejected,
      (state, { payload }: { payload: any }) => {
        console.log("====================================");
        console.log(payload, "kpkpkp");
        console.log("====================================");
        try {
          state.isEmployeeregularization = false;
          state.isEmployeeregularizationFetching = false;
          state.isError = true;
          payload
            ? (state.errorMessage = payload?.error?.message
              ? payload?.error?.message || payload?.error
              : payload?.error)
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error,
          );
        }
      },
    );
    builder.addCase(Employeeregularization.pending, (state) => {
      state.isEmployeeregularizationFetching = true;
    });

    builder.addCase(CheckinCheckout.fulfilled, (state, { payload }) => {
      try {
        state.CheckinCheckoutData = payload;
        state.isCheckinCheckout = true;
        state.isCheckinCheckoutFetching = false;
        state.isSuccess = true;
        state.successMessage = payload?.message || "";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error(
          "Error: AttendancesGetApi.fulfilled try catch error >>",
          error,
        );
      }
    });
    builder.addCase(
      CheckinCheckout.rejected,
      (state, { payload }: { payload: any }) => {
        try {
          state.isCheckinCheckout = false;
          state.isCheckinCheckoutFetching = false;
          state.isError = true;
          payload
            ? (state.errorMessage = payload?.error?.message
              ? payload?.error?.message || payload?.error
              : payload?.error)
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error,
          );
        }
      },
    );
    builder.addCase(CheckinCheckout.pending, (state) => {
      state.isCheckinCheckoutFetching = true;
    });

    // getCurrentAttendanceStatus reducers
    builder.addCase(getCurrentAttendanceStatus.fulfilled, (state, { payload }) => {
      try {
        state.getCurrentAttendanceStatusData = payload;
        state.isGetCurrentAttendanceStatus = true;
        state.isGetCurrentAttendanceStatusFetching = false;

        // Update CheckinCheckoutData with current status to maintain consistency
        if (payload) {
          state.CheckinCheckoutData = payload;
        }

        return state;
      } catch (error) {
        console.error(
          "Error: getCurrentAttendanceStatus.fulfilled try catch error >>",
          error,
        );
      }
    });

    builder.addCase(getCurrentAttendanceStatus.rejected, (state, { payload }: { payload: any }) => {
      try {
        state.isGetCurrentAttendanceStatus = false;
        state.isGetCurrentAttendanceStatusFetching = false;
        state.isError = true;
        payload
          ? (state.errorMessage = payload?.error?.message
            ? payload?.error?.message || payload?.error
            : payload?.error)
          : (state.errorMessage = "API Response Invalid. Please Check API");
      } catch (error) {
        console.error(
          "Error: [getCurrentAttendanceStatus.rejected] try catch error >>",
          error,
        );
      }
    });

    builder.addCase(getCurrentAttendanceStatus.pending, (state) => {
      state.isGetCurrentAttendanceStatusFetching = true;
    });

    builder.addCase(GetStructureTypes.fulfilled, (state, { payload }) => {
      try {
        state.GetStructureTypesData = payload;
        state.isGetStructureTypes = true;
        state.isGetStructureTypesFetching = false;
        state.isSuccess = true;
        state.successMessage = payload?.message || "";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error(
          "Error: AttendancesGetApi.fulfilled try catch error >>",
          error,
        );
      }
    });
    builder.addCase(
      GetStructureTypes.rejected,
      (state, { payload }: { payload: any }) => {
        try {
          state.isGetStructureTypes = false;
          state.isGetStructureTypesFetching = false;
          state.isError = true;
          payload
            ? (state.errorMessage = payload?.error?.message
              ? payload?.error?.message || payload?.error
              : payload?.error)
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error,
          );
        }
      },
    );
    builder.addCase(GetStructureTypes.pending, (state) => {
      state.isGetStructureTypesFetching = true;
    });

    builder.addCase(getCountries.fulfilled, (state, { payload }) => {
      try {
        state.GetCountriesData = payload;
        state.isGetCountries = true;
        state.isGetCountriesFetching = false;
        state.isSuccess = true;
        state.successMessage = payload?.message || "";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error(
          "Error: AttendancesGetApi.fulfilled try catch error >>",
          error,
        );
      }
    });
    builder.addCase(
      getCountries.rejected,
      (state, { payload }: { payload: any }) => {
        try {
          state.isGetCountries = false;
          state.isGetCountriesFetching = false;
          state.isError = true;
          payload
            ? (state.errorMessage = payload?.error?.message
              ? payload?.error?.message || payload?.error
              : payload?.error)
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error,
          );
        }
      },
    );
    builder.addCase(getCountries.pending, (state) => {
      state.isGetCountriesFetching = true;
    });

    builder.addCase(getWorkingSchedules.fulfilled, (state, { payload }) => {
      try {
        state.getWorkingSchedulesData = payload;
        state.isgetWorkingSchedules = true;
        state.isgetWorkingSchedulesFetching = false;
        state.isSuccess = true;
        state.successMessage = payload?.message || "";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error(
          "Error: AttendancesGetApi.fulfilled try catch error >>",
          error,
        );
      }
    });
    builder.addCase(
      getWorkingSchedules.rejected,
      (state, { payload }: { payload: any }) => {
        try {
          state.isgetWorkingSchedules = false;
          state.isgetWorkingSchedulesFetching = false;
          state.isError = true;
          payload
            ? (state.errorMessage = payload?.error?.message
              ? payload?.error?.message || payload?.error
              : payload?.error)
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error,
          );
        }
      },
    );
    builder.addCase(getWorkingSchedules.pending, (state) => {
      state.isgetWorkingSchedulesFetching = true;
    });

    builder.addCase(getRegularPayStructure.fulfilled, (state, { payload }) => {
      try {
        state.getRegularPayStructureData = payload;
        state.isgetRegularPayStructure = true;
        state.isgetRegularPayStructureFetching = false;
        state.isSuccess = true;
        state.successMessage = payload?.message || "";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error(
          "Error: AttendancesGetApi.fulfilled try catch error >>",
          error,
        );
      }
    });
    builder.addCase(
      getRegularPayStructure.rejected,
      (state, { payload }: { payload: any }) => {
        try {
          state.isgetRegularPayStructure = false;
          state.isgetRegularPayStructureFetching = false;
          state.isError = true;
          payload
            ? (state.errorMessage = payload?.error?.message
              ? payload?.error?.message || payload?.error
              : payload?.error)
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error,
          );
        }
      },
    );
    builder.addCase(getRegularPayStructure.pending, (state) => {
      state.isgetRegularPayStructureFetching = true;
    });

    builder.addCase(getWorkEntryType.fulfilled, (state, { payload }) => {
      try {
        state.getWorkEntryTypeData = payload;
        state.isgetWorkEntryType = true;
        state.isgetWorkEntryTypeFetching = false;
        state.isSuccess = true;
        state.successMessage = payload?.message || "";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error(
          "Error: AttendancesGetApi.fulfilled try catch error >>",
          error,
        );
      }
    });
    builder.addCase(
      getWorkEntryType.rejected,
      (state, { payload }: { payload: any }) => {
        try {
          state.isgetWorkEntryType = false;
          state.isgetWorkEntryTypeFetching = false;
          state.isError = true;
          payload
            ? (state.errorMessage = payload?.error?.message
              ? payload?.error?.message || payload?.error
              : payload?.error)
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error,
          );
        }
      },
    );
    builder.addCase(getWorkEntryType.pending, (state) => {
      state.isgetWorkEntryTypeFetching = true;
    });

    builder.addCase(getSalaryRules.fulfilled, (state, { payload }) => {
      try {
        state.getSalaryRulesData = payload;
        state.isgetSalaryRules = true;
        state.isgetSalaryRulesFetching = false;
        state.isSuccess = true;
        state.successMessage = payload?.message || "";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error(
          "Error: AttendancesGetApi.fulfilled try catch error >>",
          error,
        );
      }
    });
    builder.addCase(
      getSalaryRules.rejected,
      (state, { payload }: { payload: any }) => {
        try {
          state.isgetSalaryRules = false;
          state.isgetSalaryRulesFetching = false;
          state.isError = true;
          payload
            ? (state.errorMessage = payload?.error?.message
              ? payload?.error?.message || payload?.error
              : payload?.error)
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error,
          );
        }
      },
    );
    builder.addCase(getSalaryRules.pending, (state) => {
      state.isgetSalaryRulesFetching = true;
    });

    builder.addCase(getSalaryStructure.fulfilled, (state, { payload }) => {
      try {
        state.getSalaryStructureData = payload;
        state.isgetSalaryStructure = true;
        state.isgetSalaryStructureFetching = false;
        state.isSuccess = true;
        state.successMessage = payload?.message || "";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error(
          "Error: AttendancesGetApi.fulfilled try catch error >>",
          error,
        );
      }
    });
    builder.addCase(
      getSalaryStructure.rejected,
      (state, { payload }: { payload: any }) => {
        try {
          state.isgetSalaryStructure = false;
          state.isgetSalaryStructureFetching = false;
          state.isError = true;
          payload
            ? (state.errorMessage = payload?.error?.message
              ? payload?.error?.message || payload?.error
              : payload?.error)
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error,
          );
        }
      },
    );
    builder.addCase(getSalaryStructure.pending, (state) => {
      state.isgetSalaryStructureFetching = true;
    });

    builder.addCase(getDashboadrdCount.fulfilled, (state, { payload }) => {
      try {
        state.getDashboadrdCountData = payload;
        state.isgetDashboadrdCount = true;
        state.isgetDashboadrdCountFetching = false;
        state.isSuccess = true;
        state.successMessage = payload?.message || "";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error(
          "Error: AttendancesGetApi.fulfilled try catch error >>",
          error,
        );
      }
    });
    builder.addCase(
      getDashboadrdCount.rejected,
      (state, { payload }: { payload: any }) => {
        try {
          state.isgetDashboadrdCount = false;
          state.isgetDashboadrdCountFetching = false;
          state.isError = true;
          payload
            ? (state.errorMessage = payload?.error?.message
              ? payload?.error?.message || payload?.error
              : payload?.error)
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error,
          );
        }
      },
    );
    builder.addCase(getDashboadrdCount.pending, (state) => {
      state.isgetDashboadrdCountFetching = true;
    });

    // Employee Attendance Export Excel
    builder.addCase(
      EmployeeAttendanceExportExcel.fulfilled,
      (state, { payload }) => {
        state.isEmployeeAttendanceExportExcel = true;
        state.isEmployeeAttendanceExportExcelFetching = false;
        state.isSuccess = true;
        state.successMessage =
          payload?.message || "Excel exported successfully";
        state.isError = false;
        state.errorMessage = "";
      },
    );
    builder.addCase(
      EmployeeAttendanceExportExcel.rejected,
      (state, { payload }: { payload: any }) => {
        state.isEmployeeAttendanceExportExcel = false;
        state.isEmployeeAttendanceExportExcelFetching = false;
        state.isError = true;
        state.errorMessage = payload?.error || "Export failed";
      },
    );
    builder.addCase(EmployeeAttendanceExportExcel.pending, (state) => {
      state.isEmployeeAttendanceExportExcelFetching = true;
    });

    // Employee Attendance Export PDF
    builder.addCase(
      EmployeeAttendanceExportPdf.fulfilled,
      (state, { payload }) => {
        state.isEmployeeAttendanceExportPdf = true;
        state.isEmployeeAttendanceExportPdfFetching = false;
        state.isSuccess = true;
        state.successMessage = payload?.message || "PDF exported successfully";
        state.isError = false;
        state.errorMessage = "";
      },
    );
    builder.addCase(
      EmployeeAttendanceExportPdf.rejected,
      (state, { payload }: { payload: any }) => {
        state.isEmployeeAttendanceExportPdf = false;
        state.isEmployeeAttendanceExportPdfFetching = false;
        state.isError = true;
        state.errorMessage = payload?.error || "Export failed";
      },
    );
    builder.addCase(EmployeeAttendanceExportPdf.pending, (state) => {
      state.isEmployeeAttendanceExportPdfFetching = true;
    });

    // Admin Attendance Export Excel
    builder.addCase(
      AdminAttendanceExportExcel.fulfilled,
      (state, { payload }) => {
        state.isAdminAttendanceExportExcel = true;
        state.isAdminAttendanceExportExcelFetching = false;
        state.isSuccess = true;
        state.successMessage =
          payload?.message || "Excel exported successfully";
        state.isError = false;
        state.errorMessage = "";
      },
    );

    builder.addCase(
      AdminAttendanceExportExcel.rejected,
      (state, { payload }: { payload: any }) => {
        state.isAdminAttendanceExportExcel = false;
        state.isAdminAttendanceExportExcelFetching = false;
        state.isError = true;
        state.errorMessage = payload?.error || "Export failed";
      },
    );
    builder.addCase(AdminAttendanceExportExcel.pending, (state) => {
      state.isAdminAttendanceExportExcelFetching = true;
    });

    // Admin Attendance Export PDF
    builder.addCase(
      AdminAttendanceExportPdf.fulfilled,
      (state, { payload }) => {
        state.isAdminAttendanceExportPdf = true;
        state.isAdminAttendanceExportPdfFetching = false;
        state.isSuccess = true;
        state.successMessage = payload?.message || "PDF exported successfully";
        state.isError = false;
        state.errorMessage = "";
      },
    );
    builder.addCase(
      AdminAttendanceExportPdf.rejected,
      (state, { payload }: { payload: any }) => {
        state.isAdminAttendanceExportPdf = false;
        state.isAdminAttendanceExportPdfFetching = false;
        state.isError = true;
        state.errorMessage = payload?.error || "Export failed";
      },
    );
    builder.addCase(AdminAttendanceExportPdf.pending, (state) => {
      state.isAdminAttendanceExportPdfFetching = true;
    });

    // getRegularizationStatus extraReducers
    builder.addCase(getRegularizationStatus.fulfilled, (state, { payload }) => {
      try {
        state.getRegularizationStatusData = payload;
        state.isGetRegularizationStatus = true;
        state.isGetRegularizationStatusFetching = false;
        state.isSuccess = true;
        state.successMessage = payload?.message || "";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error(
          "Error: getRegularizationStatus.fulfilled try catch error >>",
          error,
        );
      }
    });
    builder.addCase(
      getRegularizationStatus.rejected,
      (state, { payload }: { payload: any }) => {
        try {
          state.isGetRegularizationStatus = false;
          state.isGetRegularizationStatusFetching = false;
          state.isError = true;
          payload
            ? (state.errorMessage = payload?.error?.message
              ? payload?.error?.message || payload?.error
              : payload?.error)
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [getRegularizationStatus.rejected] try catch error >>",
            error,
          );
        }
      },
    );
    builder.addCase(getRegularizationStatus.pending, (state) => {
      state.isGetRegularizationStatusFetching = true;
    });

    // getEmployeesBasicInfo reducers
    builder.addCase(getEmployeesBasicInfo.fulfilled, (state, { payload }) => {
      try {
        state.getEmployeesBasicInfoData = payload;
        state.isGetEmployeesBasicInfo = true;
        state.isGetEmployeesBasicInfoFetching = false;
        state.isSuccess = false;
        state.successMessage = payload?.message || "";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error(
          "Error: getEmployeesBasicInfo.fulfilled try catch error >>",
          error,
        );
      }
    });
    builder.addCase(
      getEmployeesBasicInfo.rejected,
      (state, { payload }: { payload: any }) => {
        try {
          state.isGetEmployeesBasicInfo = false;
          state.isGetEmployeesBasicInfoFetching = false;
          state.isError = true;
          payload
            ? (state.errorMessage = payload?.error?.message
              ? payload?.error?.message || payload?.error
              : payload?.error)
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [getEmployeesBasicInfo.rejected] try catch error >>",
            error,
          );
        }
      },
    );
    builder.addCase(getEmployeesBasicInfo.pending, (state) => {
      state.isGetEmployeesBasicInfoFetching = true;
    });

    // getContractsApi extraReducers
    builder.addCase(getContractsApi.fulfilled, (state, { payload }) => {
      try {
        state.getContractsApiData = payload;
        state.isGetContractsApi = true;
        state.isGetContractsApiFetching = false;
        state.isSuccess = false;
        state.successMessage = payload?.message || "";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error("Error: getContractsApi.fulfilled try catch error >>", error);
      }
    });
    builder.addCase(getContractsApi.rejected, (state, { payload }: { payload: any }) => {
      try {
        state.isGetContractsApi = false;
        state.isGetContractsApiFetching = false;
        state.isError = true;
        payload
          ? (state.errorMessage = payload?.error?.message
            ? payload?.error?.message || payload?.error
            : payload?.error)
          : (state.errorMessage = "API Response Invalid. Please Check API");
      } catch (error) {
        console.error("Error: [getContractsApi.rejected] try catch error >>", error);
      }
    });
    builder.addCase(getContractsApi.pending, (state) => {
      state.isGetContractsApiFetching = true;
    });

    // createContractApi extraReducers
    builder.addCase(createContractApi.fulfilled, (state, { payload }) => {
      try {
        state.createContractApiData = payload;
        state.isCreateContractApi = true;
        state.isCreateContractApiFetching = false;
        state.isSuccess = true;
        state.successMessage = payload?.message || "Contract created successfully";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error("Error: createContractApi.fulfilled try catch error >>", error);
      }
    });
    builder.addCase(createContractApi.rejected, (state, { payload }: { payload: any }) => {
      try {
        state.isCreateContractApi = false;
        state.isCreateContractApiFetching = false;
        state.isError = true;
        state.errorMessage = payload?.error || "Failed to create contract";
      } catch (error) {
        console.error("Error: [createContractApi.rejected] try catch error >>", error);
      }
    });
    builder.addCase(createContractApi.pending, (state) => {
      state.isCreateContractApiFetching = true;
    });

    // updateContractApi extraReducers
    builder.addCase(updateContractApi.fulfilled, (state, { payload }) => {
      try {
        state.updateContractApiData = payload;
        state.isUpdateContractApi = true;
        state.isUpdateContractApiFetching = false;
        state.isSuccess = true;
        state.successMessage = payload?.message || "Contract updated successfully";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error("Error: updateContractApi.fulfilled try catch error >>", error);
      }
    });
    builder.addCase(updateContractApi.rejected, (state, { payload }: { payload: any }) => {
      try {
        state.isUpdateContractApi = false;
        state.isUpdateContractApiFetching = false;
        state.isError = true;
        state.errorMessage = payload?.error || "Failed to update contract";
      } catch (error) {
        console.error("Error: [updateContractApi.rejected] try catch error >>", error);
      }
    });
    builder.addCase(updateContractApi.pending, (state) => {
      state.isUpdateContractApiFetching = true;
    });

    // deleteContractApi extraReducers
    builder.addCase(deleteContractApi.fulfilled, (state, { payload }) => {
      try {
        state.deleteContractApiData = payload;
        state.isDeleteContractApi = true;
        state.isDeleteContractApiFetching = false;
        state.isSuccess = true;
        state.successMessage = payload?.message || "Contract deleted successfully";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error("Error: deleteContractApi.fulfilled try catch error >>", error);
      }
    });
    builder.addCase(deleteContractApi.rejected, (state, { payload }: { payload: any }) => {
      try {
        state.isDeleteContractApi = false;
        state.isDeleteContractApiFetching = false;
        state.isError = true;
        state.errorMessage = payload?.error || "Failed to delete contract";
      } catch (error) {
        console.error("Error: [deleteContractApi.rejected] try catch error >>", error);
      }
    });
    builder.addCase(deleteContractApi.pending, (state) => {
      state.isDeleteContractApiFetching = true;
    });

    // getDepartmentsApi extraReducers
    builder.addCase(getDepartmentsApi.fulfilled, (state, { payload }) => {
      try {
        state.getDepartmentsApiData = payload;
        state.isGetDepartmentsApi = true;
        state.isGetDepartmentsApiFetching = false;
        state.isSuccess = false;
        state.successMessage = payload?.message || "";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error("Error: getDepartmentsApi.fulfilled try catch error >>", error);
      }
    });
    builder.addCase(getDepartmentsApi.rejected, (state, { payload }: { payload: any }) => {
      try {
        state.isGetDepartmentsApi = false;
        state.isGetDepartmentsApiFetching = false;
        state.isError = true;
        payload
          ? (state.errorMessage = payload?.error?.message
            ? payload?.error?.message || payload?.error
            : payload?.error)
          : (state.errorMessage = "API Response Invalid. Please Check API");
      } catch (error) {
        console.error("Error: [getDepartmentsApi.rejected] try catch error >>", error);
      }
    });
    builder.addCase(getDepartmentsApi.pending, (state) => {
      state.isGetDepartmentsApiFetching = true;
    });
  },
});

export const { updateState } = TBSlice.actions;
export const TBSelector = (state: any) => state.main.TB;

// Loca
// if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setInfoData({ ...infoData, latitude: position.coords.latitude, longitude: position.coords.longitude });
//           Service.setlocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
//           setLocationAllowed(true);
//         },
//         (error) => {
//           setLocationAllowed(false);
//           console.error("Location error:", error);
//         },
//         { enableHighAccuracy: true }
//       );
//     } else {
//       console.log("Geolocation is not supported by this browser.");
//       setLocationAllowed(false);
//     }
