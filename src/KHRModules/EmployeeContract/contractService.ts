import CONFIG from "@/Config";
import Service from "@/Service";
import axios from "axios";

const { user_id } = Service.getAuthDetails();

export interface Contract {
  id?: string;
  name: string;
  employee_code: string;
  employee_id: number;
  job_id: number;
  date_start: string;
  date_end: string;
  work_entry_source: string;
  resource_calendar_id: number;
  structure_type_id: number;
  department_id: number;
  contract_type_id: number;
  wage_type: string;
  schedule_pay: string;
  wage: number;
  conveyance_allowances: number;
  skill_allowances: number;
  food_allowances: number;
  washing_allowances: number;
  special_allowances: number;
  medial_allowances: number;
  uniform_allowances: number;
  child_education_allowances: number;
  other_allowances: number;
  variable_pay: number;
  gratuity: number;
  professional_tax: number;
  lta: number;
}

export interface Employee {
  id: number;
  name: string;
  employee_code: string;
  email: string;
  department?: string;
}

export interface WorkingSchedule {
  id: number;
  name: string;
  hours_per_day?: number;
  days_per_week?: number;
}

export interface Department {
  id: number;
  name: string;
  manager?: {
    name: string;
  };
}

// Get all contracts
export const getContracts = async (): Promise<Contract[]> => {
  try {
    const response = await axios({
      method: "GET",
      baseURL: CONFIG.BASE_URL_ALL,
      headers: {
        "Content-Type": "application/json",
        authorization: `${localStorage.getItem("authToken")}`,
      },
      url: `/api/employee/Contract`,
      params: { user_id },
    });

    return response.data?.data || response.data || [];
  } catch (error: any) {
    console.error("Error fetching contracts:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch contracts",
    );
  }
};

// Create new contract
export const createContract = async (
  contractData: Omit<Contract, "id">,
): Promise<Contract> => {
  try {
    const response = await axios({
      method: "POST",
      baseURL: CONFIG.BASE_URL_ALL,
      headers: {
        "Content-Type": "application/json",
        authorization: `${localStorage.getItem("authToken")}`,
      },
      url: `/api/employee/Contract`,
      params: { user_id },
      data: contractData,
    });

    return response.data?.data || response.data;
  } catch (error: any) {
    console.error("Error creating contract:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to create contract",
    );
  }
};

// Update contract
export const updateContract = async (
  id: string,
  contractData: Partial<Contract>,
): Promise<Contract> => {
  try {
    const response = await axios({
      method: "PUT",
      baseURL: CONFIG.BASE_URL_ALL,
      headers: {
        "Content-Type": "application/json",
        authorization: `${localStorage.getItem("authToken")}`,
      },
      url: `/api/employee/Contract/${id}`,
      params: { user_id },
      data: contractData,
    });

    return response.data?.data || response.data;
  } catch (error: any) {
    console.error("Error updating contract:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to update contract",
    );
  }
};

// Delete contract
export const deleteContract = async (id: string): Promise<void> => {
  try {
    await axios({
      method: "DELETE",
      baseURL: CONFIG.BASE_URL_ALL,
      headers: {
        "Content-Type": "application/json",
        authorization: `${localStorage.getItem("authToken")}`,
      },
      url: `/api/contracts/${id}`,
      params: { user_id },
    });
  } catch (error: any) {
    console.error("Error deleting contract:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to delete contract",
    );
  }
};

// Get employees for dropdown
export const getEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await axios({
      method: "GET",
      baseURL: CONFIG.BASE_URL_ALL,
      headers: {
        "Content-Type": "application/json",
        authorization: `${localStorage.getItem("authToken")}`,
      },
      url: `/employee/employees-basic-info`,
      params: { user_id },
    });

    return response.data?.data || response.data || [];
  } catch (error: any) {
    console.error("Error fetching employees:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch employees",
    );
  }
};

// Get working schedules for dropdown
export const getWorkingSchedules = async (): Promise<WorkingSchedule[]> => {
  try {
    const response = await axios({
      method: "GET",
      baseURL: CONFIG.BASE_URL_ALL,
      headers: {
        "Content-Type": "application/json",
        authorization: `${localStorage.getItem("authToken")}`,
      },
      url: `/api/WorkingSchedules`,
      params: { user_id },
    });

    return response.data?.data || response.data || [];
  } catch (error: any) {
    console.error("Error fetching working schedules:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch working schedules",
    );
  }
};

// Get departments for dropdown
export const getDepartments = async (): Promise<Department[]> => {
  try {
    const response = await axios({
      method: "GET",
      baseURL: CONFIG.BASE_URL_ALL,
      headers: {
        "Content-Type": "application/json",
        authorization: `${localStorage.getItem("authToken")}`,
      },
      url: `/api/department`,
      params: { user_id },
    });

    return response.data?.data || response.data || [];
  } catch (error: any) {
    console.error("Error fetching departments:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch departments",
    );
  }
};
