import Instance from "../../../api/axiosInstance";

export interface BankAccount {
  id?: string;
  acc_number: string;
  bank_id: string; // From Bank Master
  acc_holder_name: string;
  client_id?: string;
  ifsc_code: string;
  currency_id?: string;
  is_trusted: boolean;
}

const getAuthDetails = () => {
  const user_id = localStorage.getItem("user_id");
  return { user_id: user_id ? Number(user_id) : null };
};

// GET - Bank Account List
export const getBankAccounts = async () => {
  const { user_id } = getAuthDetails();
  const response = await Instance.get("/api/bank-account/list", {
    params: { user_id },
  });
  return response.data.data || [];
};

// POST - Create Bank Account
export const addBankAccount = async (formData: BankAccount) => {
  const { user_id } = getAuthDetails();
  return await Instance.post("/api/bank-account/create", {
    ...formData,
    user_id,
  });
};
