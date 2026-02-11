import axios from "axios";

const InstanceSecond = axios.create({
  baseURL: "http://178.236.185.232:9090/",
  headers: {
    "Content-Type": "application/json",
  },
});

const getFreshTokenSecond = async () => {
  try {
    console.log(
      "🔄 [Instance 2] Attempting Auth at: http://178.236.185.232:9090/api/auth",
    );

    const response = await axios.post("http://178.236.185.232:9090/api/auth", {
      user_name: "john",
    });

    // Check if response exists and has a token
    const newToken = response.data?.token;

    if (newToken) {
      localStorage.setItem("authToken_IP", newToken);
      console.log("✅ [Instance 2] Token received and saved.");
      return newToken;
    } else {
      console.error(
        "❌ [Instance 2] API responded but no token found in data:",
        response.data,
      );
    }
  } catch (err: any) {
    // This will tell you if it's a CORS error, a 404, or a Network error
    console.error("❌ [Instance 2] Auth Request Failed:", err.message);
    if (err.response) {
      console.error("Status:", err.response.status, "Data:", err.response.data);
    }
  }
  return null;
};

// --- REQUEST INTERCEPTOR ---
InstanceSecond.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("authToken_IP");

    // Fix corruption check
    const isCorrupt =
      token === "undefined" ||
      token === "null" ||
      (token && token.includes("user_id"));

    if (!token || isCorrupt) {
      console.warn("🧹 [Instance 2] Token missing/corrupt. Fetching...");
      token = await getFreshTokenSecond();
    }

    if (token) {
      config.headers.Authorization = `${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// --- RESPONSE INTERCEPTOR ---
InstanceSecond.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn("⚠️ [Instance 2] 401 Unauthorized. Refreshing token...");

      localStorage.removeItem("authToken_IP");
      const newToken = await getFreshTokenSecond();

      if (newToken) {
        originalRequest.headers.Authorization = `${newToken}`;
        return InstanceSecond(originalRequest);
      }
    }
    return Promise.reject(error);
  },
);

export default InstanceSecond;
