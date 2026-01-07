import Instance from "../../../api/axiosInstance";

// --- Interfaces ---
export interface Expense {
  id?: string | number;
  name: string; // Description/Name
  product_id: number | string;
  account_id: number | string; // Often hidden or auto-selected
  total_amount_currency: number | string;
  payment_mode: "own_account" | "company_account";
  date: string;
  // Attachment fields
  fileName?: string;
  attachment?: string; // Base64 string
  // Display fields (optional, returned by GET)
  product_name?: string;
  employee_name?: string;
  status?: string;
}

// --- Helper: Convert File to Base64 ---
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// --- API Functions ---

// 1. GET Expenses
// URL: /employee/expense?user_id=3145
export const getExpenses = async () => {
  const user_id =
    localStorage.getItem("user_id") ||
    localStorage.getItem("userId") ||
    localStorage.getItem("id");
  // Assuming the base URL (http://192.168.11.245:4000) is set in your Instance config
  return await Instance.get(`/employee/expense?user_id=${user_id}`);
};

// Add this to ExpenseKHRService.tsx

export const getExpenseAccounts = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const user_id =
      localStorage.getItem("user_id") ||
      localStorage.getItem("userId") ||
      localStorage.getItem("id");
    const response = await Instance.get(
      `employee/expense-account?user_id=${user_id}`,
      {
        headers: { Authorization: token },
      }
    );

    // Most Odoo-based APIs return an array of [id, "name"] or a data object
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error("Error fetching expense accounts:", error);
    return [];
  }
};

// 2. CREATE Expense
// URL: /employee/create/expense?user_id=3145
export const createExpense = async (data: any) => {
  const user_id =
    localStorage.getItem("user_id") ||
    localStorage.getItem("userId") ||
    localStorage.getItem("id");

  // The API expects JSON with a base64 string for the attachment
  return await Instance.post(
    `/employee/create/expense?user_id=${user_id}`,
    data
  );
};

// 3. DELETE Expense (Optional, standard placeholder)
export const deleteExpense = async (id: number | string) => {
  const user_id = localStorage.getItem("user_id");
  return await Instance.delete(`/employee/expense/${id}?user_id=${user_id}`);
};
