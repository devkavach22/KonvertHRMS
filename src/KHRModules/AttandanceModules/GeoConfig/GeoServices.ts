import Instance from "../../../api/axiosInstance";

/* =====================
   AUTH HELPER
===================== */
const getAuthDetails = () => {
  const user_id = localStorage.getItem("user_id");
  return {
    user_id: user_id ? Number(user_id) : null,
  };
};

/* =====================
   UI INTERFACE
===================== */
export interface GeoConfig {
  id?: string;
  key?: string;
  name: string;
  type: string;
  absent_if: string;
  day_after: number;
  grace_minutes: number;
  no_pay_minutes: number;
  half_day_minutes: number;
  early_grace_minutes: number;
  late_beyond_days: number;
  late_beyond_time: number;
  latitude?: number | null;
  longitude?: number | null;
  radius_km?: number | null;
  employees_selection?: any[];
  created_date?: string;
}

/* =====================
   API INTERFACE
===================== */
export interface APIGeoConfig {
  id: number;
  name: string | false;
  type: string;
  absent_if: string;
  day_after: number;
  grace_minutes: number;
  no_pay_minutes: number;
  half_day_minutes: number;
  early_grace_minutes: number;
  late_beyond_days: number;
  late_beyond_time: number;
  latitude?: number | string | null;
  longitude?: number | string | null;
  radius_km?: number | string | null;
  employees_selection?: any[] | string;
  create_date?: string;
}

/* =====================
   GET GEO CONFIG
   GET /api/geoLocation?user_id=XXX
===================== */
export const getGeoConfigs = async (): Promise<APIGeoConfig[]> => {
  try {
    const { user_id } = getAuthDetails();

    const response = await Instance.get("/api/geoLocation", {
      params: {
        user_id,
      },
    });

    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching geo configs:", error);
    return [];
  }
};

/* =====================
   CREATE GEO CONFIG
===================== */
export const addGeoConfig = async (data: any) => {
  const { user_id } = getAuthDetails();
  return await Instance.post(`/api/create/geoLocation?user_id=${user_id}`, data);
};
/* =====================
   UPDATE GEO CONFIG
===================== */
export const updateGeoConfig = async (id: string, data: any) => {
  const { user_id } = getAuthDetails();
  return await Instance.put(`/api/geoLocation/${id}?user_id=${user_id}`, data);
};
/* =====================
   DELETE GEO CONFIG
===================== */
export const deleteGeoConfig = async (id: string) => {
    const { user_id } = getAuthDetails();

  return await Instance.delete(`/api/geoLocation/${id}`, {
    params: { user_id },
  });
};
