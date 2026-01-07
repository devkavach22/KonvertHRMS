import Instance from "../../../api/axiosInstance";

// 1. Interface matching your GET Response JSON
export interface CalendarEventAPI {
  event_id: number; // Changed from 'id' to 'event_id'
  name: string;
  start: string; // Format: "YYYY-MM-DD HH:mm:ss"
  stop: string; // Format: "YYYY-MM-DD HH:mm:ss"
  location: string;
  duration: number;
  description: string; // Contains HTML <p>...</p>
  privacy: string; // "private" | "public"
  user_id?: {
    name: string;
    email: string;
  };
}

// 2. Create Payload Interface
export interface CreateEventPayload {
  name: string;
  start: string;
  stop: string;
  location: string;
  duration: number;
  description: string;
  privacy: "private" | "public";
}

// 3. Service Functions

// POST: Create Calendar Event
// URL: /employee/create/calendar?user_id=3145
export const createCalendarEvent = async (data: CreateEventPayload) => {
  const user_id =
    localStorage.getItem("user_id") ||
    localStorage.getItem("userId") ||
    localStorage.getItem("id");
  return await Instance.post(
    `/employee/create/calendar?user_id=${user_id}`,
    data
  );
};

// GET: Get Calendar Events
// URL: /employee/calendar?user_id=3145
export const getCalendarEvents = async () => {
  const user_id =
    localStorage.getItem("user_id") ||
    localStorage.getItem("userId") ||
    localStorage.getItem("id");
  return await Instance.get(`/employee/calendar?user_id=${user_id}`);
};
