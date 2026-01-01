import Instance from "../../../api/axiosInstance";

export interface DropdownOption {
  value: string;
  label: string;
  swift?: string;
}

export interface BankAccount {
  id?: string;
  bank_name: string;
  partner_name: string;
  acc_number: string;
  bank_swift_code: string;
  bank_iafc_code: string;
  currency: string;
  user_id: number;
}

const getUserId = () => {
  const id = localStorage.getItem("user_id");
  return id ? Number(id) : 219; // Defaulting to 219 as per your requirement
};

// GET - Bank Account List
export const getBankAccounts = async () => {
  const user_id = getUserId();
  const response = await Instance.get("/api/bank-account/list", {
    params: { user_id },
  });
  return response.data.bank_accounts || response.data.data || [];
};

export const getBranches = async () => {
  const user_id = getUserId();
  const response = await Instance.get("/api/branch", {
    params: { user_id },
  });
  return response.data.data || [];
};

// POST - Create Bank Account
export const addBankAccount = async (formData: any) => {
  const payload = {
    ...formData,
    user_id: getUserId(),
  };
  return await Instance.post("/api/bank-account/create", payload);
};

// PUT - Update Bank Account
export const updateBankAccount = async (id: string, formData: any) => {
  const payload = {
    ...formData,
    user_id: getUserId(),
  };
  return await Instance.put(`/api/bank-account/update/${id}`, payload);
};

// DELETE - Delete Bank Account
export const deleteBankAccount = async (id: string) => {
  return await Instance.delete(`/api/bank-account/delete/${id}`, {
    params: { user_id: getUserId() },
  });
};
