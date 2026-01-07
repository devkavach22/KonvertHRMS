import Instance from "../../../api/axiosInstance";

// Helper to get User ID consistent with your other services
const getUserId = () => {
  const id =
    localStorage.getItem("user_id") ||
    localStorage.getItem("userId") ||
    localStorage.getItem("id");
  return id ? Number(id) : null;
};

const getToken = () => localStorage.getItem("authToken");

// SERVICE FUNCTIONS

export const getLeaveAllocations = async (): Promise<any> => {
  try {
    const config: any = {
      maxBodyLength: Infinity,
      params: { user_id: getUserId() },
      headers: { Authorization: getToken() },
    };

    const response = await Instance.get("/api/leave-allocate", config);

    // Based on your JSON: { status: "success", data: { count: 9523, allocations: [...] } }
    // We return the 'data' object so the component can access 'allocations'
    return response.data?.data || { allocations: [], count: 0 };
  } catch (error: any) {
    console.error("Error fetching leave allocations:", error);
    return { allocations: [], count: 0 };
  }
};

export const approveRefuseLeaveAllocation = async (
  allocationId: number,
  action: "approve" | "refuse"
) => {
  try {
    const data = {
      allocation_id: allocationId,
      action: action,
    };

    const response = await Instance.post("/api/leave-allocation/action", data, {
      params: { user_id: getUserId() },
      headers: { Authorization: getToken() },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      `Error performing ${action}:`,
      error.response?.data ?? error.message
    );
    throw error;
  }
};

export const createLeaveAllocation = async (data: any) => {
  return await Instance.post("/api/create/leave-allocate", data, {
    params: { user_id: getUserId() },
  });
};

export const updateLeaveAllocation = async (id: number, data: any) => {
  return await Instance.put(`/api/leave-allocation/${id}`, data, {
    params: { user_id: getUserId() },
  });
};

export const deleteLeaveAllocation = async (id: number) => {
  return await Instance.delete(`/api/leave-allocation/${id}`, {
    params: { user_id: getUserId() },
  });
};
