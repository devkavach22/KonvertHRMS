import CONFIG from "@/Config";
import Service from "@/Service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const { user_id, email } = Service.getAuthDetails();

const authheader = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
};

// console.log(user_id, "user_iddd");

//Usersignin
export const Usersignin = createAsyncThunk(
  "Usersignin",
  async (userdata, thunkAPI) => {
    try {
      let result = await axios({
        method: "POST",
        baseURL: "CONFIG.BASE_URL_LOGIN",
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
        error?.message
      );
      return thunkAPI.rejectWithValue({ error: error?.message });
    }
  }
);
//AttendancesApi
export const AttendancesApi = createAsyncThunk(
  "AttendancesApi",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
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
        error?.message
      );
      return thunkAPI.rejectWithValue({ error: error?.message });
    }
  }
);
//AttendancesGetApi
export const AttendancesGetApi = createAsyncThunk(
  "AttendancesGetApi",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
      let result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/admin/attendances`,
        params: { user_id },
      });
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error(
        "try catch [ AttendancesGetApi ] error.message >>",
        error?.message
      );
      return thunkAPI.rejectWithValue({ error: error?.message });
    }
  }
);
//UpdateAdminAttendanceApi
export const UpdateAdminAttendanceApi = createAsyncThunk(
  "UpdateAdminAttendanceApi",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
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
        error?.message
      );
      return thunkAPI.rejectWithValue({ error: error?.message });
    }
  }
);
export const AdminWorkingHours = createAsyncThunk(
  "AdminWorkingHours",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
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
        error?.message
      );
      return thunkAPI.rejectWithValue({ error: error?.message });
    }
  }
);

export const EmployeeRegcategories = createAsyncThunk(
  "EmployeeRegcategories",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
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
        error?.message
      );
      return thunkAPI.rejectWithValue({ error: error?.message });
    }
  }
);

// Create Regularization Category
export const createRegCategory = createAsyncThunk(
  "createRegCategory",
  async (userdata: { type: string }, thunkAPI) => {
    try {
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
        error?.message
      );
      return thunkAPI.rejectWithValue({ error: error?.response?.data?.message || error?.message });
    }
  }
);

export const EmployeeAttendanceApi = createAsyncThunk(
  "EmployeeAttendanceApi",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
      let result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/employee/attendance`,
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
        error?.message
      );
      return thunkAPI.rejectWithValue({ error: error?.message });
    }
  }
);

export const Employeeregularization = createAsyncThunk(
  "Employeeregularization",
  async (userdata, thunkAPI) => {
    console.log(userdata, "userdata");
    try {
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
        console.log(result, "uiui")
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.log('====================================');
      console.log(error, "uiui");
      console.log('====================================');
      console.error(
        "try catch [ AdminWorkingHours ] error.message >>",
        error?.message
      );
      return thunkAPI.rejectWithValue({ error: error?.message });
    }
  }
);

export const CheckinCheckout = createAsyncThunk(
  "CheckinCheckout",
  async (userdata: { Latitude: number; Longitude: number }, thunkAPI) => {
    try {
      const { user_id, email } = Service.getAuthDetails();

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
        error: error?.message || "API error",
      });
    }
  }
);

export const GetStructureTypes = createAsyncThunk(
  "GetStructureTypes",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
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
        error?.message
      );
      return thunkAPI.rejectWithValue({ error: error?.message });
    }
  }
);

export const getCountries = createAsyncThunk(
  "getCountries",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
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
        error?.message
      );
      return thunkAPI.rejectWithValue({ error: error?.message });
    }
  }
);

export const getWorkingSchedules = createAsyncThunk(
  "getWorkingSchedules",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
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
        error?.message
      );
      return thunkAPI.rejectWithValue({ error: error?.message });
    }
  }
);

export const getRegularPayStructure = createAsyncThunk(
  "getRegularPayStructure",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
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
        error?.message
      );
      return thunkAPI.rejectWithValue({ error: error?.message });
    }
  }
);

export const getWorkEntryType = createAsyncThunk(
  "getWorkEntryType",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
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
        error?.message
      );
      return thunkAPI.rejectWithValue({ error: error?.message });
    }
  }
);

export const getSalaryRules = createAsyncThunk(
  "getSalaryRules",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
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
        error?.message
      );
      return thunkAPI.rejectWithValue({ error: error?.message });
    }
  }
);

export const getSalaryStructure = createAsyncThunk(
  "getSalaryStructure",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
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
        error?.message
      );
      return thunkAPI.rejectWithValue({ error: error?.message });
    }
  }
);


export const getDashboadrdCount = createAsyncThunk(
  "getDashboadrdCount",
  async (userdata, thunkAPI) => {
    console.log(userdata);
    try {
      let result = await axios({
        method: "GET",
        baseURL: "http://10.221.59.471:4000/",
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
        error?.message
      );
      return thunkAPI.rejectWithValue({ error: error?.message });
    }
  }
);

// Employee Attendance Export Excel
export const EmployeeAttendanceExportExcel = createAsyncThunk(
  "EmployeeAttendanceExportExcel",
  async (userdata: { date_from: string; date_to: string }, thunkAPI) => {
    try {
      const result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/employee/attendance/export/excel`,
        params: { user_id, date_from: userdata.date_from, date_to: userdata.date_to },
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
      console.error("try catch [ EmployeeAttendanceExportExcel ] error.message >>", error?.message);
      return thunkAPI.rejectWithValue({ error: error?.message });
    }
  }
);

// Employee Attendance Export PDF
export const EmployeeAttendanceExportPdf = createAsyncThunk(
  "EmployeeAttendanceExportPdf",
  async (userdata: { date_from: string; date_to: string }, thunkAPI) => {
    try {
      const result = await axios({
        method: "GET",
        baseURL: "http://10.221.59.471:4000",
        headers: {
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/employee/attendance/export/pdf`,
        params: { user_id, date_from: userdata.date_from, date_to: userdata.date_to },
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
      console.error("try catch [ EmployeeAttendanceExportPdf ] error.message >>", error?.message);
      return thunkAPI.rejectWithValue({ error: error?.message });
    }
  }
);

// Admin Attendance Export Excel
export const AdminAttendanceExportExcel = createAsyncThunk(
  "AdminAttendanceExportExcel",
  async (userdata: { date_from: string; date_to: string }, thunkAPI) => {
    try {
      const result = await axios({
        method: "GET",
        baseURL: "http://10.221.59.471:4000",
        headers: {
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/admin/attendances/export/excel`,
        params: { user_id, date_from: userdata.date_from, date_to: userdata.date_to },
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
      console.error("try catch [ AdminAttendanceExportExcel ] error.message >>", error?.message);
      return thunkAPI.rejectWithValue({ error: error?.message });
    }
  }
);

// Admin Attendance Export PDF
export const AdminAttendanceExportPdf = createAsyncThunk(
  "AdminAttendanceExportPdf",
  async (userdata: { date_from: string; date_to: string }, thunkAPI) => {
    try {
      const result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
          authorization: `${localStorage.getItem("authToken")}`,
        },
        url: `/api/admin/attendances/export/pdf`,
        params: { user_id, date_from: userdata.date_from, date_to: userdata.date_to },
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
      console.error("try catch [ AdminAttendanceExportPdf ] error.message >>", error?.message);
      return thunkAPI.rejectWithValue({ error: error?.message });
    }
  }
);
export const TBSlice = createSlice({
  name: "TBSlice",
  initialState: {
    //Usersignin
    isUsersignin: false,
    isUsersigninFetching: false,
    UsersigninData: {},

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
    builder.addCase(Usersignin.fulfilled, (state, { payload }) => {
      try {
        state.UsersigninData = payload;
        state.isUsersignin = true;
        state.isUsersigninFetching = false;
        state.isSuccess = true;
        state.successMessage = "Login Successfull";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error("Error: Usersignin.fulfilled try catch error >>", error);
      }
    });
    builder.addCase(
      Usersignin.rejected,
      (state, { payload }: { payload: any }) => {
        try {
          state.UsersigninData = {};
          state.isUsersignin = false;
          state.isUsersigninFetching = false;
          state.isError = true;
          payload
            ? (state.errorMessage = payload?.error?.message
              ? "Please try again (There was some network issue)."
              : "Please try again (There was some network issue).")
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [Usersignin.rejected] try catch error >>",
            error
          );
        }
      }
    );
    builder.addCase(Usersignin.pending, (state) => {
      state.isUsersigninFetching = true;
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
          error
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
              ? "Please try again (There was some network issue)."
              : "Please try again (There was some network issue).")
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesApi.rejected] try catch error >>",
            error
          );
        }
      }
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
          error
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
              ? "Please try again (There was some network issue)."
              : "Please try again (There was some network issue).")
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error
          );
        }
      }
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
            error
          );
        }
      }
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
              ? "Please try again (There was some network issue)."
              : "Please try again (There was some network issue).")
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [UpdateAdminAttendanceApi.rejected] try catch error >>",
            error
          );
        }
      }
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
          error
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
              ? "Please try again (There was some network issue)."
              : "Please try again (There was some network issue).")
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error
          );
        }
      }
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
          error
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
              ? "Please try again (There was some network issue)."
              : "Please try again (There was some network issue).")
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error
          );
        }
      }
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
          error
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
              ? "Please try again (There was some network issue)."
              : "Please try again (There was some network issue).")
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error
          );
        }
      }
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
        state.successMessage = payload?.message || "Category created successfully";
        state.isError = false;
        state.errorMessage = "";
        return state;
      } catch (error) {
        console.error(
          "Error: createRegCategory.fulfilled try catch error >>",
          error
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
            error
          );
        }
      }
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
          error
        );
      }
    });
    builder.addCase(
      Employeeregularization.rejected,
      (state, { payload }: { payload: any }) => {
        console.log('====================================');
        console.log(payload, "kpkpkp");
        console.log('====================================');
        try {
          state.isEmployeeregularization = false;
          state.isEmployeeregularizationFetching = false;
          state.isError = true;
          payload
            ? (state.errorMessage = payload?.error
              ? payload?.error
              : "Please try again (There was some network issue).")
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error
          );
        }
      }
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
          error
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
              ? "Please try again (There was some network issue)."
              : "Please try again (There was some network issue).")
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error
          );
        }
      }
    );
    builder.addCase(CheckinCheckout.pending, (state) => {
      state.isCheckinCheckoutFetching = true;
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
          error
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
              ? "Please try again (There was some network issue)."
              : "Please try again (There was some network issue).")
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error
          );
        }
      }
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
          error
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
              ? "Please try again (There was some network issue)."
              : "Please try again (There was some network issue).")
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error
          );
        }
      }
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
          error
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
              ? "Please try again (There was some network issue)."
              : "Please try again (There was some network issue).")
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error
          );
        }
      }
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
          error
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
              ? "Please try again (There was some network issue)."
              : "Please try again (There was some network issue).")
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error
          );
        }
      }
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
          error
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
              ? "Please try again (There was some network issue)."
              : "Please try again (There was some network issue).")
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error
          );
        }
      }
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
          error
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
              ? "Please try again (There was some network issue)."
              : "Please try again (There was some network issue).")
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error
          );
        }
      }
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
          error
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
              ? "Please try again (There was some network issue)."
              : "Please try again (There was some network issue).")
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error
          );
        }
      }
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
          error
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
              ? "Please try again (There was some network issue)."
              : "Please try again (There was some network issue).")
            : (state.errorMessage = "API Response Invalid. Please Check API");
        } catch (error) {
          console.error(
            "Error: [AttendancesGetApi.rejected] try catch error >>",
            error
          );
        }
      }
    );
    builder.addCase(getDashboadrdCount.pending, (state) => {
      state.isgetDashboadrdCountFetching = true;
    });

    // Employee Attendance Export Excel
    builder.addCase(EmployeeAttendanceExportExcel.fulfilled, (state, { payload }) => {
      state.isEmployeeAttendanceExportExcel = true;
      state.isEmployeeAttendanceExportExcelFetching = false;
      state.isSuccess = true;
      state.successMessage = payload?.message || "Excel exported successfully";
      state.isError = false;
      state.errorMessage = "";
    });
    builder.addCase(EmployeeAttendanceExportExcel.rejected, (state, { payload }: { payload: any }) => {
      state.isEmployeeAttendanceExportExcel = false;
      state.isEmployeeAttendanceExportExcelFetching = false;
      state.isError = true;
      state.errorMessage = payload?.error || "Export failed";
    });
    builder.addCase(EmployeeAttendanceExportExcel.pending, (state) => {
      state.isEmployeeAttendanceExportExcelFetching = true;
    });

    // Employee Attendance Export PDF
    builder.addCase(EmployeeAttendanceExportPdf.fulfilled, (state, { payload }) => {
      state.isEmployeeAttendanceExportPdf = true;
      state.isEmployeeAttendanceExportPdfFetching = false;
      state.isSuccess = true;
      state.successMessage = payload?.message || "PDF exported successfully";
      state.isError = false;
      state.errorMessage = "";
    });
    builder.addCase(EmployeeAttendanceExportPdf.rejected, (state, { payload }: { payload: any }) => {
      state.isEmployeeAttendanceExportPdf = false;
      state.isEmployeeAttendanceExportPdfFetching = false;
      state.isError = true;
      state.errorMessage = payload?.error || "Export failed";
    });
    builder.addCase(EmployeeAttendanceExportPdf.pending, (state) => {
      state.isEmployeeAttendanceExportPdfFetching = true;
    });

    // Admin Attendance Export Excel
    builder.addCase(AdminAttendanceExportExcel.fulfilled, (state, { payload }) => {
      state.isAdminAttendanceExportExcel = true;
      state.isAdminAttendanceExportExcelFetching = false;
      state.isSuccess = true;
      state.successMessage = payload?.message || "Excel exported successfully";
      state.isError = false;
      state.errorMessage = "";
    });
    builder.addCase(AdminAttendanceExportExcel.rejected, (state, { payload }: { payload: any }) => {
      state.isAdminAttendanceExportExcel = false;
      state.isAdminAttendanceExportExcelFetching = false;
      state.isError = true;
      state.errorMessage = payload?.error || "Export failed";
    });
    builder.addCase(AdminAttendanceExportExcel.pending, (state) => {
      state.isAdminAttendanceExportExcelFetching = true;
    });

    // Admin Attendance Export PDF
    builder.addCase(AdminAttendanceExportPdf.fulfilled, (state, { payload }) => {
      state.isAdminAttendanceExportPdf = true;
      state.isAdminAttendanceExportPdfFetching = false;
      state.isSuccess = true;
      state.successMessage = payload?.message || "PDF exported successfully";
      state.isError = false;
      state.errorMessage = "";
    });
    builder.addCase(AdminAttendanceExportPdf.rejected, (state, { payload }: { payload: any }) => {
      state.isAdminAttendanceExportPdf = false;
      state.isAdminAttendanceExportPdfFetching = false;
      state.isError = true;
      state.errorMessage = payload?.error || "Export failed";
    });
    builder.addCase(AdminAttendanceExportPdf.pending, (state) => {
      state.isAdminAttendanceExportPdfFetching = true;
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
