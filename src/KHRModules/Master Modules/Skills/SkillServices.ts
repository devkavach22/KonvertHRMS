import Instance from "../../../api/axiosInstance";

export interface Skill {
  id?: string;
  skill_type_name: string;
  skill_names: string[];
  skill_level_name: string;
  level_progress: number;
  default_level: boolean;
  key?: string;
}

const getUserId = () => {
  const id = localStorage.getItem("user_id");
  return id ? Number(id) : null;
};

// GET - http://localhost:4000/api/skills?user_id=219
export const getSkills = async () => {
  try {
    const response = await Instance.get("/api/skills", {
      params: { user_id: getUserId() },
    });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};

// POST - http://localhost:4000/api/create/skills
export const addSkill = async (data: any) => {
  const payload = {
    ...data,
    user_id: getUserId(),
  };
  return await Instance.post("/api/create/skills", payload);
};

// PUT - http://localhost:4000/api/skills/10
export const updateSkill = async (id: string, data: any) => {
  const payload = {
    ...data,
    user_id: getUserId(),
  };
  return await Instance.put(`/api/skills/${id}`, payload);
};

// DELETE - http://localhost:4000/api/delete/skills/9?user_id=219
export const deleteSkill = async (id: string) => {
  return await Instance.delete(`/api/delete/skills/${id}`, {
    params: { user_id: getUserId() },
  });
};
