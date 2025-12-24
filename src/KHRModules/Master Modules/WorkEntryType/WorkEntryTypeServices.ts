import Instance from "../../../api/axiosInstance";

export interface WorkEntryType {
  id?: string;
  name: string;
  code: string;
  external_code: string;
  sequence: number;
  color: number;
  is_unforeseen: boolean;
  is_leave: boolean;
  round_days: "NO" | "HALF" | "FULL";
  key?: string;
}

export interface APIWorkEntryType {
  id: number;
  name: string | false;
  code: string | false;
  external_code: string | false;
  sequence: number;
  color: number;
  is_unforeseen: boolean;
  is_leave: boolean;
  round_days: "NO" | "HALF" | "FULL" | false;
}

// Helper to get fresh IDs from storage
const getAuthDetails = () => ({
  user_id: localStorage.getItem("user_id"),
  unique_user_id: localStorage.getItem("unique_user_id"),
});

// GET - http://localhost:4000/api/work-entry-types?user_id=159
export const getWorkEntryTypes = async (): Promise<APIWorkEntryType[]> => {
  try {
    const { user_id } = getAuthDetails();
    const response = await Instance.get(`/api/work-entry-types`, {
      params: { user_id },
    });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

// POST - http://localhost:4000/api/create/work-entry-type
export const addWorkEntryType = async (data: any) => {
  const { user_id, unique_user_id } = getAuthDetails();
  const payload = {
    ...data,
    user_id: Number(user_id),
    unique_user_id: unique_user_id,
  };
  return await Instance.post("/api/create/work-entry-type", payload);
};

// PUT - http://localhost:4000/api/work-entry-type/21
export const updateWorkEntryType = async (id: string, data: any) => {
  const unique_user_id = localStorage.getItem("unique_user_id");
  const user_id = localStorage.getItem("user_id");

  const payload = {
    ...data,
    // Sending both as per your requirement, but either one works for PUT
    unique_user_id: unique_user_id,
    user_id: Number(user_id),
  };

  console.log("Updating ID:", id, "with Payload:", payload);

  return await Instance.put(`/api/work-entry-type/${id}`, payload);
};

// DELETE - http://localhost:4000/api/work-entry-type/21?user_id=159
export const deleteWorkEntryType = async (id: string) => {
  const { user_id } = getAuthDetails();
  return await Instance.delete(`/api/work-entry-type/${id}`, {
    params: { user_id },
  });
};
