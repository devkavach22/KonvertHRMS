import Instance from "@/api/axiosInstance";

export const getAttendance = async (userId: string | number) => {
  const response = await Instance.get(`/api/attendance`, {
    params: { user_id: userId },
  });
  return response.data;
};

export default { getAttendance };
