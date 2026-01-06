import Instance from "../../../api/axiosInstance";

// 1. UI Interface
export interface ExpenseCategory {
  id?: number | string;
  name: string; // "Office Internet Expense"
  cost: number; // 1200
  reference: string; // "EXP-INT-001"
  category_id?: number | string;
  category_name?: string; // "All"
  company_id?: number | string;
  company_name?: string;
  description?: string; // "<p>Monthly internet charges</p>"
  re_invoice_policy: "no" | "cost" | "sales_price";
  expense_account_id?: number | string;
  expense_account_name?: string;
  sales_tax_ids?: any[];
  purchase_tax_ids?: any[];
}

// 2. SERVICE FUNCTIONS

// GET: Fetch all expense categories
export const getExpenseCategories = async () => {
  const user_id =
    localStorage.getItem("user_id") ||
    localStorage.getItem("userId") ||
    localStorage.getItem("id");
  // Adjust endpoint as per your actual backend route
  return await Instance.get(`/employee/expense-category?user_id=${user_id}`);
};

// POST: Create new category
export const createExpenseCategory = async (data: any) => {
  const user_id =
    localStorage.getItem("user_id") ||
    localStorage.getItem("userId") ||
    localStorage.getItem("id");
  return await Instance.post(
    `/employee/create/expense-category?user_id=${user_id}`,
    data
  );
};

// PUT: Update existing category
export const updateExpenseCategory = async (id: number | string, data: any) => {
  const user_id = localStorage.getItem("user_id");
  return await Instance.put(
    `/employee/expense-category/${id}?user_id=${user_id}`,
    data
  );
};

// DELETE: Remove category
export const deleteExpenseCategory = async (id: number | string) => {
  const user_id = localStorage.getItem("user_id");
  return await Instance.delete(
    `/employee/expense-category/${id}?user_id=${user_id}`
  );
};

export const getCategoriesDropdown = async () => {
  return [
    { id: 1, name: "All" },
    { id: 2, name: "Office" },
    { id: 3, name: "Travel" },
  ];
};

export const getAccountsDropdown = async () => {
  return [
    { id: 901, name: "Internet Expenses" },
    { id: 902, name: "Travel Expenses" },
    { id: 903, name: "Office Supplies" },
  ];
};

export const getTaxesDropdown = async () => {
  return [
    { id: 1, name: "GST 5%" },
    { id: 2, name: "GST 18%" },
    { id: 3, name: "VAT 10%" },
  ];
};
