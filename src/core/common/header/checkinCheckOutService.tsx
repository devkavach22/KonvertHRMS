import Instance from "../../../api/axiosInstance";

/* =====================
   AUTH HELPER
===================== */
const getAuthDetails = () => {
    const user_id = localStorage.getItem("user_id");
    const email = localStorage.getItem("user_email");

    return {
        user_id: user_id ? Number(user_id) : null,
        email: email || null,
    };
};

/* =====================
   UI PAYLOAD INTERFACE
===================== */
export interface AttendancePayload {
    email: string;
    user_id: number;
    Latitude: string;
    Longitude: string;
}

/* =====================
   API RESPONSE
===================== */
export interface APIAttendanceResponse {
    status: boolean;
    message: string;
    data?: any;
}

/* =====================
   CHECK-IN / CHECK-OUT API
   POST /api/employee/attandence
===================== */
export const submitAttendance = async (
    latitude: number,
    longitude: number
): Promise<APIAttendanceResponse> => {
    const { user_id, email } = getAuthDetails();

    if (!user_id || !email) {
        throw new Error("User not authenticated");
    }

    const payload: AttendancePayload = {
        email,
        user_id,
        Latitude: latitude.toString(),
        Longitude: longitude.toString(),
    };

    const response = await Instance.post(
        "/api/employee/attandence",
        payload
    );

    return response.data;
};
