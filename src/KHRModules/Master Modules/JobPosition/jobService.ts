import Instance from "../../../api/axiosInstance";

// jobService.ts
export interface JobPosition {
  id?: string;
  name: string;
  department_id: number | string; // Updated to allow ID
  industry_id?: number | string; // Optional, matching string/number
  no_of_recruitment: number;
  skill_ids: number[];
  contract_type_id: string | number;
  user_id?: number;
}

const getUserId = () => {
  const id = localStorage.getItem("user_id");
  return id ? Number(id) : 219; // Defaulting to 219 based on your API specs
};

// GET - List Job Positions
export const getJobs = async () => {
  try {
    const response = await Instance.get("/api/job/list", {
      params: { user_id: getUserId() },
    });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};

export const getContractTypes = async () => {
  try {
    const user_id = localStorage.getItem("user_id") || "219";
    const response = await Instance.get("/api/contract-types", {
      params: { user_id },
    });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Fetch Contract Types Error:", error);
    return [];
  }
};

// POST - Create Job Position
export const addJob = async (data: Partial<JobPosition>) => {
  const payload = {
    ...data,
    user_id: getUserId(),
  };
  return await Instance.post("/api/job/create", payload);
};

// PUT - Update Job Position
export const updateJob = async (id: string, data: Partial<JobPosition>) => {
  const payload = {
    ...data,
    user_id: getUserId(),
  };
  return await Instance.put(`/api/jobs/${id}`, payload);
};

// DELETE - Delete Job Position
export const deleteJob = async (id: string) => {
  return await Instance.delete(`/api/jobs/${id}`, {
    params: { user_id: getUserId() },
  });
};
