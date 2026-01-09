import Instance from "../../../api/axiosInstance";

export interface ContractType {
  id?: string;
  name: string;
  code: string;
  country_name: string;
  key?: string; // For table keys
}

const getUserId = () => {
  const id = localStorage.getItem("user_id");
  return id ? Number(id) : null;
};

// GET - List
export const getContractTypes = async () => {
  try {
    const response = await Instance.get("/api/contract-types", {
      params: { user_id: getUserId() },
    });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};

// POST - Create
export const addContractType = async (data: any) => {
  const payload = {
    ...data,
    user_id: getUserId(),
  };
  return await Instance.post("/api/create/ContractType", payload);
};

// PUT - Update
export const updateContractType = async (id: string, data: any) => {
  const payload = {
    ...data,
    user_id: getUserId(),
  };
  return await Instance.put(`/api/contract-type/${id}`, payload);
};

// DELETE - Delete
export const deleteContractType = async (id: string) => {
  return await Instance.delete(`/api/contract-type/${id}`, {
    params: { user_id: getUserId() },
  });
};

// import Instance from "../../../api/axiosInstance";

// export interface ContractType {
//   id?: string;
//   name: string;
//   code: string;
//   country_name: string;
//   key?: string;
// }

// const getUserId = () => {
//   const id = localStorage.getItem("user_id");
//   return id ? Number(id) : null;
// };

// // GET - /api/contract-types?user_id=219
// export const getContractTypes = async () => {
//   try {
//     const response = await Instance.get("/api/contract-types", {
//       params: { user_id: getUserId() },
//     });
//     return response.data.data || response.data || [];
//   } catch (error) {
//     console.error("Fetch Error:", error);
//     return [];
//   }
// };

// // POST - /api/create/ContractType
// export const addContractType = async (data: any) => {
//   const payload = {
//     ...data,
//     user_id: getUserId(),
//   };
//   return await Instance.post("/api/create/ContractType", payload);
// };

// // PUT - /api/contract-type/14
// export const updateContractType = async (id: string, data: any) => {
//   const payload = {
//     ...data,
//     user_id: getUserId(),
//   };
//   return await Instance.put(`/api/contract-type/${id}`, payload);
// };

// // DELETE - /api/contract-type/14?user_id=219
// export const deleteContractType = async (id: string) => {
//   return await Instance.delete(`/api/contract-type/${id}`, {
//     params: { user_id: getUserId() },
//   });
// };
