import Instance from "@/api/axiosInstance";
import InstanceSecond from "@/api/axiosInstanceSecond";
import axios from "axios";

export interface Branch {
  id: string;
  name: string;
  gst_number: string;
  country_id: string;
  state_id: string;
  city_id: string;
  address: string;
  created_date?: string;
}

const getUserId = () => {
  const id = localStorage.getItem("user_id");
  return id ? Number(id) : null;
};

export const createBranch = async (payload: any) => {
  const userId = getUserId() || 2;

  return await axios.post(
    `http://178.236.185.232:9090//api/res_branch/create?user_id=${userId}`,
    payload,
  );
};

// export const createBranch = async (payload: any) => {
//   const userId = getUserId() || 2;

//   // Using InstanceSecond ensures your base URL and auth headers are applied automatically
//   return await InstanceSecond.post("/api/res_branch/create", payload, {
//     params: { user_id: userId },
//   });
// };

// Updated Update function to use PUT and correct user_id param
export const UpdateBrnach = async (payload: any) => {
  const userId = getUserId() || 3145;

  return await axios.put(
    `http://178.236.185.232:9090//api/branch/update?user_id=${userId}`,
    payload,
  );
};

// export const getBranches = async () => {
//   const userId = getUserId() || 3145; // fallback user ID

//   try {
//     const response = await axios.get(
//       "http://178.236.185.232:9090//api/branches",
//       {
//         params: { user_id: userId },
//       },
//     );
//     return response.data?.data || response.data || [];
//   } catch (error) {
//     console.error("Error fetching Branches:", error);
//     return [];
//   }
// };

export const getBranches = async () => {
  const userId = getUserId() || 3145; // fallback user ID

  try {
    // Using InstanceSecond instead of raw axios
    const response = await InstanceSecond.get("/api/branches", {
      params: { user_id: userId },
    });

    // Return the appropriate data array from the response
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error("Error fetching Branches:", error);
    return [];
  }
};

export const checkGST = async (gstNumber: string) => {
  const res = await Instance.post(`/api/check_gstnumber`, {
    gst_number: gstNumber,
  });
  return res.data;
};

export const saveBranch = async (id: string | null, data: any) => {
  if (id) {
    return await Instance.put(`/api/branch/${id}`, data);
  }
  return await Instance.post(`/api/branch`, data);
};

// Updated Delete function using DELETE method and query params
export const deleteBranch = async (id: string) => {
  const userId = getUserId() || 3145;

  return await axios.delete(`http://178.236.185.232:9090//api/delete_branch`, {
    params: {
      branch_id: id,
      user_id: userId,
    },
  });
};
