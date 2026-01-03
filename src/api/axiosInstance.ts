import axios from "axios";

const Instance = axios.create({
  // // baseURL: "http://192.168.11.150:4000/",
  // baseURL: "http://192.168.11.245:4000/",

  baseURL: "http://178.236.185.232:4000/",

  headers: {
    "Content-Type": "application/json",
  },
});

const getFreshToken = async () => {
  try {
    console.log("🔄 Fetching fresh token...");
    // const response = await axios.post("http://192.168.11.150:4000/api/auth", {
    //   user_name: "dhaval",
    // });
    // const response = await axios.post("http://192.168.11.245:4000/api/auth", {
    //   user_name: "dhaval",
    // });
    const response = await axios.post("http://178.236.185.232:4000/api/auth", {
      user_name: "dhaval",
    });
    console.log(response,"werrw");
    
    const newToken = response.data.token;
    if (newToken) {
      localStorage.removeItem("authToken");
      localStorage.setItem("authToken", newToken);
      console.log("✅ New token saved.");
      return newToken;
    }
  } catch (err) {
    console.error("❌ Auto-login failed:", err);
  }
  return null;
};

// --- REQUEST INTERCEPTOR ---
Instance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("authToken");

    // CRITICAL FIX: Your storage is mashed together.
    // If token is too long or contains other keys like "dataColor" or "unique_user_id", it's corrupt.
    const isCorrupt =
      token &&
      (token.includes("dataColor") ||
        token.includes("unique_user_id") ||
        token.includes("user_id"));

    if (!token || token === "undefined" || isCorrupt) {
      console.warn("🧹 Storage Corrupt or Missing. Cleaning and refreshing...");
      localStorage.removeItem("authToken");
      token = await getFreshToken();
    }

    if (token) {
      // config.headers.Authorization = `Bearer ${token}`;
      config.headers.Authorization = `${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR ---
Instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 OR the specific "Token not found" error message in the response
    const isAuthError =
      error.response?.status === 401 ||
      error.response?.data?.message ===
        "Token not found. Please generate a new token";

    if (isAuthError && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn("⚠️ Auth Error detected. Retrying with fresh token...");

      localStorage.removeItem("authToken");
      const newToken = await getFreshToken();

      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        // CRITICAL: Use axios directly or the Instance to retry
        return axios(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default Instance;

// import axios from "axios";

// const Instance = axios.create({
//   baseURL: "http://192.168.11.150:4000/",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: false,
// });

// Instance.interceptors.request.use(
//   async (config) => {
//     // 1. Try to get the token from storage
//     let token = localStorage.getItem("authToken");

//     // 2. If no token exists (or is undefined), fetch a new one automatically
//     if (!token || token === "undefined") {
//       try {
//         console.log("⚠️ No token found. Attempting auto-login...");

//         // Use standard axios (not 'Instance') to avoid infinite loops
//         const response = await axios.post(
//           "http://192.168.11.150:4000/api/auth",
//           { user_name: "dhaval" }, // Using the user from your example
//           { headers: { "Content-Type": "application/json" } }
//         );

//         // Extract new token
//         token = response.data.token;

//         if (token) {
//           localStorage.setItem("authToken", token);
//           console.log("🔑 Auto-login successful. New token saved.");
//         } else {
//           console.error("❌ Token missing from auto-login response");
//         }
//       } catch (error) {
//         console.error("❌ Failed to get token automatically:", error);
//       }
//     }

//     // 3. Attach the valid token to the header
//     if (token && token !== "undefined") {
//       // Using 'Bearer' prefix as shown in your first file
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Global response interceptor to handle expired tokens (401)
// Instance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.warn("Token expired. Logging out...");
//       localStorage.removeItem("authToken");
//       // Optional: Redirect to login
//       // window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export default Instance;

// import axios from "axios";

// const Instance = axios.create({
//   baseURL: "http://192.168.11.150:4000",
//   // baseURL: "https://kavach-pdf-tools-auth.onrender.com/api",

//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true, // if using cookies
// });

// // 🔥 Add token before each request
// Instance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       config.headers.Authorization = `${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // 🔥 Handle unauthorized error globally
// Instance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.warn("Token expired. Logging out...");
//       localStorage.removeItem("authToken");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export default Instance;
