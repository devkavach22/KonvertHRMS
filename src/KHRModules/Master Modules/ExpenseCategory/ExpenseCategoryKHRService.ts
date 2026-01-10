import Instance from "../../../api/axiosInstance";

// 1. UI Interface
export interface ExpenseCategory {
  id?: number | string;
  name: string;
  cost: number;
  reference: string;
  category_id?: number | string;
  category_name?: string;
  company_id?: number | string;
  company_name?: string;
  description?: string;
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
  return await Instance.get(`/employee/expense-category?user_id=${user_id}`);
};

// POST: Create new category
export const createExpenseCategory = async (data: any) => {
  const user_id =
    localStorage.getItem("user_id") ||
    localStorage.getItem("userId") ||
    localStorage.getItem("id");
  return await Instance.post(
    `/employee/create/expense-categroy?user_id=${user_id}`,
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

// --- DROPDOWN INTEGRATIONS ---

// 1. Product Categories
export const getCategoriesDropdown = async () => {
  try {
    const response = await Instance.get("/employee/product-category");
    // return response.data if that's the array, or response.data.data
    return Array.isArray(response.data) ? response.data : response.data.data;
  } catch (error) {
    console.error("Error fetching product categories:", error);
    return [];
  }
};

// 2. Expense Accounts
export const getAccountsDropdown = async () => {
  try {
    const user_id = localStorage.getItem("user_id");

    const response = await Instance.get(
      `/employee/expense-account?user_id=${user_id}`
    );
    return Array.isArray(response.data) ? response.data : response.data.data;
  } catch (error) {
    console.error("Error fetching expense accounts:", error);
    return [];
  }
};

// 3. Sales Taxes
export const getSalesTaxesDropdown = async () => {
  try {
    const response = await Instance.get("/employee/sales-tax");
    return Array.isArray(response.data) ? response.data : response.data.data;
  } catch (error) {
    console.error("Error fetching sales taxes:", error);
    return [];
  }
};

// 4. Purchase Taxes
export const getPurchaseTaxesDropdown = async () => {
  try {
    const response = await Instance.get("/employee/purchase-tax");
    return Array.isArray(response.data) ? response.data : response.data.data;
  } catch (error) {
    console.error("Error fetching purchase taxes:", error);
    return [];
  }
};
