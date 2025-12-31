import Instance from "../../../api/axiosInstance";

export interface Bank {
  id?: string;
  name: string;
  bic: string;
  swift_code: string;
  micr_code: string;
  phone: string;
  street: string;
  email: string;
  key?: string; // For Datatable
}

const getAuthDetails = () => {
  const user_id = localStorage.getItem("user_id");
  return {
    user_id: user_id ? Number(user_id) : null,
  };
};

// GET - Bank List
export const getBanks = async (): Promise<Bank[]> => {
  try {
    const { user_id } = getAuthDetails();
    const response = await Instance.get("/api/bank/list", {
      params: { user_id },
    });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};

// POST - Create Bank
export const addBank = async (formData: Omit<Bank, "id">) => {
  const { user_id } = getAuthDetails();
  const payload = {
    ...formData,
    user_id: user_id,
  };
  return await Instance.post("/api/bank/create", payload);
};

// PUT - Update Bank
export const updateBank = async (id: string, formData: Partial<Bank>) => {
  const { user_id } = getAuthDetails();
  const payload = {
    ...formData,
    user_id: user_id,
  };
  return await Instance.put(`/api/bank/update/${id}`, payload);
};

// DELETE - Delete Bank
export const deleteBank = async (id: string) => {
  const { user_id } = getAuthDetails();
  return await Instance.delete(`/api/bank/delete/${id}`, {
    params: { user_id },
  });
};
