import Instance from "../../../api/axiosInstance";

export interface Employee {
  id?: string;
  name: string;
  father_name: string;
  client_id: string;
  site_id: string;
  unit_branch: string;
  attendance_policy: string;
  employee_category: string;
  working_hours: string;
  shift_roster: string;
  timezone: string;
  is_geo_tracking: boolean;
  aadhaar_number: string;
  pan_number: string;
  voter_id: string;
  passport_no: string;
  driving_license: string;
  is_uan_applicable: boolean;
  uan_number: string;
  esi_number: string;
  user_id: number;
}

const getUserId = () => {
  const id = localStorage.getItem("user_id");
  return id ? Number(id) : null;
};


export const getStructureTypes = async () => {
  const response = await Instance.get("/api/structure-types", {
    params: { user_id: getUserId() },
  });
  return response.data.data || [];
};





export const getWorkLocations = async () => {
  const response = await Instance.get("/api/work-location", {
    params: { user_id: getUserId() },
  });
  return response.data.data || [];
};

export const getReportingManagers = async () => {
  const response = await Instance.get("/employee/employees", {
    params: { user_id: getUserId() },
  });
  return response.data.data || [];
};

// Add these to EmployeeServices.ts



export const getWorkingSchedules = async () => {
  try {
    const response = await Instance.get("/api/WorkingSchedules", {
      params: { user_id: getUserId() },
    });
    return response.data.data || response.data || [];
  } catch (error) {
    return [];
  }
};



// // Add to EmployeeServices.ts
// export const getCountries = async () => {
//   try {
//     const response = await Instance.get("/api/countries");
//     // Assuming it returns { data: [{ id: 1, name: 'India' }] }
//     return response.data.data || response.data || [];
//   } catch (error) {
//     return [];
//   }
// };


export const getWorkingHours = async () => {
  try {
    const response = await Instance.get("/api/WorkingSchedules", {
      params: { user_id: getUserId() },
    });
    // Assuming it returns { data: [{ id: 1, name: 'India' }] }
    return response.data.data || response.data || [];
  } catch (error) {
    return [];
  }
};

export const getWorkEntryType = async () => {
  try {
    const response = await Instance.get("/api/work-entry-types", {
      params: { user_id: getUserId() },
    });
    // Assuming it returns { data: [{ id: 1, name: 'India' }] }
    return response.data.data || response.data || [];
  } catch (error) {
    return [];
  }
};


export const getRegularPayStructure = async () => {
  try {
    const response = await Instance.get("/api/salary-structure", {
      params: { user_id: getUserId() },
    });
    // Assuming it returns { data: [{ id: 1, name: 'India' }] }
    return response.data.data || response.data || [];
  } catch (error) {
    return [];
  }
};



export const getBranches = async () => {
  try {
    const response = await Instance.get("/api/branch", {
      params: { user_id: getUserId() },
    });
    // Assuming the API returns { status: "success", data: [...] }
    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Error fetching branches:", error);
    return [];
  }
};

export const getStates = async () => {
  try {
    const response = await Instance.get("/api/states");
    return response.data.data || response.data || [];
  } catch (error) {
    return [];
  }
};

export const getBanks = async () => {
  try {
    const response = await Instance.get("/api/bank-account/list", {
      params: { user_id: getUserId() },
    });
    // The API returns data under the "bank_accounts" key
    return response.data.bank_accounts || [];
  } catch (error) {
    console.error("Error fetching banks:", error);
    return [];
  }
};

export const getDistricts = async () => {
  try {
    const response = await Instance.get("/api/city");
    return response.data.data || response.data || [];
  } catch (error) {
    return [];
  }
};

export const getTimezones = async () => {
  try {
    const response = await Instance.get("/api/timezones");
    // Returning the data array which contains {value, label} objects
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching timezones:", error);
    return [];
  }
};

export const addEmployee = async (payload: any) => {
  const userId = getUserId() || 219;
  return await Instance.post(`/employee/create/employee`, payload, {
    params: { user_id: userId },
  });
};

export const updateEmployee = async (id: string, data: any) => {
  const payload = { ...data, user_id: getUserId() };
  return await Instance.put(`/api/employee/${id}`, payload);
};

export const deleteEmployee = async (id: string) => {
  return await Instance.delete(`/api/employee/${id}`, {
    params: { user_id: getUserId() },
  });
};
