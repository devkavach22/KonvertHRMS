import CONFIG from "@/Config";
import Service from "@/Service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const { user_id } = Service.getAuthDetails();


const authheader = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
};



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
      console.error("try catch [ Usersignin ] error.message >>", error?.message);
      return thunkAPI.rejectWithValue({ error: error?.message });
    }
  }
);
//AttendancesApi
export const AttendancesApi = createAsyncThunk(
  "AttendancesApi",
  async (userdata, thunkAPI) => {
    console.log(userdata)
    try {
      let result = await axios({
        method: "GET",
        baseURL: CONFIG.BASE_URL_ALL,
        headers: {
    "Content-Type": "application/json",
  },
        url: `api/admin/attendances`,
        params: { user_id },
      });
      // console.log(result.data)
      if (result.data) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
      }
    } catch (error: any) {
      console.error("try catch [ AttendancesApi ] error.message >>", error?.message);
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
      state.isUsersignin = payload.isUsersignin !== undefined ? payload.isUsersignin : state.isUsersignin;

      //AttendancesApi
      state.isAttendancesApi = payload.isAttendancesApi !== undefined ? payload.isAttendancesApi : state.isAttendancesApi;

      // successUpdate
      state.isSuccess = payload.isSuccess !== undefined ? payload.isSuccess : state.isSuccess;
      state.successMessage = payload.successMessage !== undefined ? payload.successMessage : state.successMessage;

      // ErrorUpdate
      state.isError = payload.isError !== undefined ? payload.isError : state.isError;
      state.errorMessage = payload.errorMessage !== undefined ? payload.errorMessage : state.errorMessage;
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
        console.error(
          "Error: Usersignin.fulfilled try catch error >>",
          error
        );
      }
    });
    builder.addCase(Usersignin.rejected, (state, { payload }: { payload: any }) => {
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
    });
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
        state.successMessage = payload?.message || "Hello";
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
    builder.addCase(AttendancesApi.rejected, (state, { payload }: { payload: any }) => {
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
    });
    builder.addCase(AttendancesApi.pending, (state) => {
      state.isAttendancesApiFetching = true;
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