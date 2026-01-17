import { useState } from "react";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
// FIX: Using your custom Axios Instance
import Instance from "../../../api/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type PasswordField = "password";

const Login = () => {
  const routes = all_routes;
  const navigation = useNavigate();

  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
  });

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        newErrors.email = "Please enter a valid email address.";
        isValid = false;
      }
    }

    if (!password) {
      newErrors.password = "Password is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await Instance.post("api/login", {
        email: email,
        password: password,
        is_plan_login: true,
      });

      if (response.data.status === "success") {
        const data = response.data;

        // 1. Clear everything first to avoid stale data
        localStorage.clear();

        // 2. Essential Auth & ID
        const token = data.token || data.accessToken;
        if (token) localStorage.setItem("authToken", token);

        if (data.unique_user_id)
          localStorage.setItem("unique_user_id", data.unique_user_id);
        if (data.user_id)
          localStorage.setItem("user_id", data.user_id.toString());

        // 3. User Profile (Consolidated to just these two)
        if (data.email) localStorage.setItem("user_email", data.email);
        if (data.full_name) localStorage.setItem("full_name", data.full_name);
        // REMOVED: user_fullname, user_name (Update your header to read 'full_name')

        // 4. Role (The Single Source of Truth for Menu/Sidebar)
        const role = data.user_role || "EMPLOYEE";
        localStorage.setItem("user_role", role);
        // REMOVED: is_client_employee_admin (Use 'user_role' checks instead)

        // 5. Plan Data (Keep these, they are unique)
        if (data.plan_status)
          localStorage.setItem("plan_status", data.plan_status);
        if (data.plan_id)
          localStorage.setItem("plan_id", data.plan_id.toString());
        if (data.plan_start_date)
          localStorage.setItem("plan_start_date", data.plan_start_date);
        if (data.plan_end_date)
          localStorage.setItem("plan_end_date", data.plan_end_date);

        // Product Details
        if (Array.isArray(data.product_id) && data.product_id.length > 0) {
          localStorage.setItem("product_id", data.product_id[0].toString());
          localStorage.setItem("product_name", data.product_id[1] || "");
        }

        toast.success(data.message || "Login Successful!");

        // 6. Navigation
        setTimeout(() => {
          if (role === "REGISTER_ADMIN" || role === "ADMIN") {
            navigation(routes.adminDashboard);
          } else {
            navigation(routes.employeeDashboard);
          }
        }, 1000);
      } else {
        toast.error(response.data.message || "Login failed.");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Check your credentials.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
        <div className="row g-0 vh-100">
          {/* Left Side Image Section */}
          <div className="col-lg-5 col-xl-5 col-xxl-4 d-none d-lg-block">
            <div className="login-background position-relative d-flex align-items-center justify-content-center vh-100">
              <div className="bg-overlay-img">
                <ImageWithBasePath
                  src="assets/img/bg/bg-01.png"
                  className="bg-1"
                  alt="bg-1"
                />
                <ImageWithBasePath
                  src="assets/img/bg/bg-02.png"
                  className="bg-2"
                  alt="bg-2"
                />
                <ImageWithBasePath
                  src="assets/img/bg/bg-03.png"
                  className="bg-3"
                  alt="bg-3"
                />
              </div>
              <div className="authentication-card w-100 px-4">
                <div className="authen-overlay-item border w-100">
                  <h1 className="text-white">
                    Empowering people <br /> through seamless HR <br />{" "}
                    management.
                  </h1>
                  <div className="my-4 mx-auto authen-overlay-img">
                    <ImageWithBasePath
                      src="assets/img/bg/authentication-bg-01.png"
                      alt="Auth"
                    />
                  </div>
                  <div>
                    <p className="text-white fs-20 fw-semibold text-center">
                      Efficiently manage your workforce, streamline <br />{" "}
                      operations effortlessly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Form Section */}
          <div className="col-lg-7 col-xl-7 col-xxl-8 col-md-12 col-sm-12">
            <div className="d-flex flex-column justify-content-between vh-100 overflow-auto">
              <div className="p-4 mt-2 text-center">
                <ImageWithBasePath
                  src="assets/img/konvertr hr-logo.png"
                  className="img-fluid"
                  alt="Logo"
                />
              </div>

              <div className="d-flex align-items-center justify-content-center flex-grow-1">
                <div className="col-sm-10 col-md-8 col-lg-8 col-xl-6 col-xxl-5 mx-auto">
                  <form className="p-4" onSubmit={handleLogin} noValidate>
                    <div className="text-center mb-4">
                      <h2 className="mb-2">Sign In</h2>
                      <p className="mb-0 text-muted">
                        Please enter your details to sign in
                      </p>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <div
                        className={`input-group ${errors.email ? "is-invalid" : ""}`}
                      >
                        <input
                          type="email"
                          className={`form-control border-end-0 ${errors.email ? "is-invalid" : ""}`}
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email)
                              setErrors({ ...errors, email: "" });
                          }}
                          placeholder="Enter your email"
                        />
                        <span className="input-group-text border-start-0 bg-transparent">
                          <i className="ti ti-mail" />
                        </span>
                        {errors.email && (
                          <div className="invalid-feedback d-block text-start">
                            {errors.email}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <div
                        className={`input-group pass-group ${errors.password ? "is-invalid" : ""}`}
                      >
                        <input
                          type={
                            passwordVisibility.password ? "text" : "password"
                          }
                          className={`pass-input form-control border-end-0 ${errors.password ? "is-invalid" : ""}`}
                          required
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password)
                              setErrors({ ...errors, password: "" });
                          }}
                          placeholder="Enter your password"
                        />
                        <span
                          className="input-group-text border-start-0 bg-transparent cursor-pointer"
                          onClick={() => togglePasswordVisibility("password")}
                        >
                          <i
                            className={`ti ${passwordVisibility.password ? "ti-eye" : "ti-eye-off"}`}
                          />
                        </span>
                        {errors.password && (
                          <div className="invalid-feedback d-block text-start">
                            {errors.password}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-end mb-4">
                      <div className="text-end">
                        <Link
                          to={all_routes.forgotPassword}
                          className="link-danger text-decoration-none fw-medium"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                    </div>

                    <div className="mb-3">
                      <button
                        type="submit"
                        className="btn btn-primary w-100 py-2"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            ></span>
                            Signing In...
                          </span>
                        ) : (
                          "Sign In"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="p-4 text-center">
                <p className="mb-0 text-muted">Copyright © 2026 - Kavach</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

// import { useState } from "react";
// import ImageWithBasePath from "../../../core/common/imageWithBasePath";
// import { Link, useNavigate } from "react-router-dom";
// import { all_routes } from "../../../router/all_routes";
// import Instance from "../../../api/axiosInstance";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// type PasswordField = "password";

// const Login = () => {
//   const routes = all_routes;
//   const navigation = useNavigate();

//   // State
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState<{ email?: string; password?: string }>(
//     {},
//   );

//   const [passwordVisibility, setPasswordVisibility] = useState({
//     password: false,
//   });

//   const togglePasswordVisibility = (field: PasswordField) => {
//     setPasswordVisibility((prevState) => ({
//       ...prevState,
//       [field]: !prevState[field],
//     }));
//   };

//   // Validation Logic
//   const validateForm = () => {
//     const newErrors: { email?: string; password?: string } = {};
//     let isValid = true;

//     if (!email) {
//       newErrors.email = "Email is required.";
//       isValid = false;
//     } else {
//       const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailPattern.test(email)) {
//         newErrors.email = "Please enter a valid email address.";
//         isValid = false;
//       }
//     }

//     if (!password) {
//       newErrors.password = "Password is required.";
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleLogin = async (event: React.FormEvent) => {
//     event.preventDefault();

//     if (!validateForm()) return;

//     setIsLoading(true);

//     try {
//       const response = await Instance.post("/api/login", {
//         email: email,
//         password: password,
//         is_plan_login: true,
//       });

//       if (response.data.status === "success") {
//         localStorage.clear();
//         const token = response.data.token || response.data.accessToken;

//         if (token) localStorage.setItem("authToken", token);

//         localStorage.setItem("unique_user_id", response.data.unique_user_id);
//         localStorage.setItem("user_id", response.data.user_id.toString());
//         localStorage.setItem("user_email", response.data.email);
//         localStorage.setItem("full_name", response.data.full_name);
//         localStorage.setItem("user_name", response.data.name);
//         localStorage.setItem(
//           "is_client_employee_admin",
//           response.data.is_client_employee_admin,
//         );
//         localStorage.setItem("user_name", response.data.name);
//         localStorage.setItem("user_fullname", response.data.full_name);

//         toast.success("Login Successful! Redirecting...");

//         setTimeout(() => {
//           navigation("/employee-dashboard");
//         }, 1000);
//       } else {
//         toast.error(response.data.message || "Login failed.");
//       }
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.message || "Check your credentials.";
//       toast.error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container-fluid p-0">
//       <ToastContainer position="top-right" autoClose={3000} />

//       <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
//         <div className="row g-0 vh-100">
//           {/* LEFT SIDE - Image */}
//           <div className="col-lg-5 col-xl-5 col-xxl-4 d-none d-lg-block">
//             <div className="login-background position-relative d-flex align-items-center justify-content-center vh-100">
//               <div className="bg-overlay-img">
//                 <ImageWithBasePath
//                   src="assets/img/bg/bg-01.png"
//                   className="bg-1"
//                   alt="bg-1"
//                 />
//                 <ImageWithBasePath
//                   src="assets/img/bg/bg-02.png"
//                   className="bg-2"
//                   alt="bg-2"
//                 />
//                 <ImageWithBasePath
//                   src="assets/img/bg/bg-03.png"
//                   className="bg-3"
//                   alt="bg-3"
//                 />
//               </div>
//               <div className="authentication-card w-100 px-4">
//                 <div className="authen-overlay-item border w-100">
//                   <h1 className="text-white">
//                     Empowering people <br /> through seamless HR <br />{" "}
//                     management.
//                   </h1>
//                   <div className="my-4 mx-auto authen-overlay-img">
//                     <ImageWithBasePath
//                       src="assets/img/bg/authentication-bg-01.png"
//                       alt="Auth"
//                     />
//                   </div>
//                   <div>
//                     <p className="text-white fs-20 fw-semibold text-center">
//                       Efficiently manage your workforce, streamline <br />{" "}
//                       operations effortlessly.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT SIDE - Content */}
//           <div className="col-lg-7 col-xl-7 col-xxl-8 col-md-12 col-sm-12">
//             {/* Flex Container to spread Logo (Top), Form (Middle), Footer (Bottom) */}
//             <div className="d-flex flex-column justify-content-between vh-100 overflow-auto">
//               {/* 1. TOP SECTION: Logo (Centered) */}
//               {/* Added 'text-center' here */}
//               <div className="p-4 mt-2 text-center">
//                 <ImageWithBasePath
//                   src="assets/img/konvertr hr-logo.png"
//                   className="img-fluid"
//                   alt="Konvertr hr logo"
//                 />
//               </div>

//               {/* 2. MIDDLE SECTION: Login Form */}
//               <div className="d-flex align-items-center justify-content-center flex-grow-1">
//                 <div className="col-sm-10 col-md-8 col-lg-8 col-xl-6 col-xxl-5 mx-auto">
//                   <form className="p-4" onSubmit={handleLogin} noValidate>
//                     <div className="text-center mb-4">
//                       <h2 className="mb-2">Sign In</h2>
//                       <p className="mb-0 text-muted">
//                         Please enter your details to sign in
//                       </p>
//                     </div>

//                     <div className="mb-3">
//                       <label className="form-label">Email Address</label>
//                       <div
//                         className={`input-group ${
//                           errors.email ? "is-invalid" : ""
//                         }`}
//                       >
//                         <input
//                           type="email"
//                           className={`form-control border-end-0 ${
//                             errors.email ? "is-invalid" : ""
//                           }`}
//                           required
//                           value={email}
//                           onChange={(e) => {
//                             setEmail(e.target.value);
//                             if (errors.email)
//                               setErrors({ ...errors, email: "" });
//                           }}
//                           placeholder="Enter your email"
//                         />
//                         <span className="input-group-text border-start-0 bg-transparent">
//                           <i className="ti ti-mail" />
//                         </span>
//                         {errors.email && (
//                           <div className="invalid-feedback d-block text-start">
//                             {errors.email}
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <div className="mb-3">
//                       <label className="form-label">Password</label>
//                       <div
//                         className={`input-group pass-group ${
//                           errors.password ? "is-invalid" : ""
//                         }`}
//                       >
//                         <input
//                           type={
//                             passwordVisibility.password ? "text" : "password"
//                           }
//                           className={`pass-input form-control border-end-0 ${
//                             errors.password ? "is-invalid" : ""
//                           }`}
//                           required
//                           value={password}
//                           onChange={(e) => {
//                             setPassword(e.target.value);
//                             if (errors.password)
//                               setErrors({ ...errors, password: "" });
//                           }}
//                           placeholder="Enter your password"
//                         />
//                         <span
//                           className="input-group-text border-start-0 bg-transparent cursor-pointer"
//                           onClick={() => togglePasswordVisibility("password")}
//                         >
//                           <i
//                             className={`ti ${
//                               passwordVisibility.password
//                                 ? "ti-eye"
//                                 : "ti-eye-off"
//                             }`}
//                           />
//                         </span>
//                         {errors.password && (
//                           <div className="invalid-feedback d-block text-start">
//                             {errors.password}
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <div className="d-flex align-items-center justify-content-end mb-4">
//                       <div className="text-end">
//                         <Link
//                           to={all_routes.forgotPassword}
//                           className="link-danger text-decoration-none fw-medium"
//                         >
//                           Forgot Password?
//                         </Link>
//                       </div>
//                     </div>

//                     <div className="mb-3">
//                       <button
//                         type="submit"
//                         className="btn btn-primary w-100 py-2"
//                         disabled={isLoading}
//                       >
//                         {isLoading ? (
//                           <span>
//                             <span
//                               className="spinner-border spinner-border-sm me-2"
//                               role="status"
//                             ></span>
//                             Signing In...
//                           </span>
//                         ) : (
//                           "Sign In"
//                         )}
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>

//               {/* 3. BOTTOM SECTION: Footer */}
//               <div className="p-4 text-center">
//                 <p className="mb-0 text-muted">Copyright © 2026 - Kavach</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// import { useState } from "react";
// import ImageWithBasePath from "../../../core/common/imageWithBasePath";
// import { Link, useNavigate } from "react-router-dom";
// import { all_routes } from "../../../router/all_routes";
// import Instance from "../../../api/axiosInstance";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// type PasswordField = "password";

// const Login = () => {
//   const routes = all_routes;
//   const navigation = useNavigate();

//   // State for form data and loading status
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const [passwordVisibility, setPasswordVisibility] = useState({
//     password: false,
//   });

//   const togglePasswordVisibility = (field: PasswordField) => {
//     setPasswordVisibility((prevState) => ({
//       ...prevState,
//       [field]: !prevState[field],
//     }));
//   };

//   const handleLogin = async (event: React.FormEvent) => {
//     event.preventDefault();

//     if (!email || !password) {
//       toast.error("Please enter both email and password.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await Instance.post("/api/login", {
//         email: email,
//         password: password,
//         is_plan_login: true,
//       });

//       console.log("Login Response:", response.data);

//       if (response.data.status === "success") {
//         localStorage.clear();
//         const token = response.data.token || response.data.accessToken;

//         if (token) {
//           localStorage.setItem("authToken", token);
//         }

//         // Store User Details
//         localStorage.setItem("unique_user_id", response.data.unique_user_id);
//         localStorage.setItem("user_id", response.data.user_id.toString());
//         localStorage.setItem("user_email", response.data.email);
//         localStorage.setItem("full_name", response.data.full_name);
//         localStorage.setItem("user_name", response.data.name);
//         localStorage.setItem(
//           "is_client_employee_admin",
//           response.data.is_client_employee_admin
//         );
//         localStorage.setItem("user_name", response.data.name);
//         localStorage.setItem("user_fullname", response.data.full_name);

//         toast.success("Login Successful! Redirecting...");

//         setTimeout(() => {
//           navigation("/employee-dashboard");
//         }, 1000);
//       } else {
//         toast.error(response.data.message || "Login failed.");
//       }
//     } catch (error: any) {
//       console.error("Login Error:", error);
//       const errorMessage =
//         error.response?.data?.message || "Check your credentials.";
//       toast.error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container-fuild">
//       {/* Toast Container for Popups */}
//       <ToastContainer position="top-right" autoClose={3000} />

//       <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
//         <div className="row">
//           <div className="col-lg-5">
//             <div className="login-background position-relative d-lg-flex align-items-center justify-content-center d-none flex-wrap vh-100">
//               <div className="bg-overlay-img">
//                 <ImageWithBasePath
//                   src="assets/img/bg/bg-01.png"
//                   className="bg-1"
//                   alt="Background pattern 1"
//                 />
//                 <ImageWithBasePath
//                   src="assets/img/bg/bg-02.png"
//                   className="bg-2"
//                   alt="Background pattern 2"
//                 />
//                 <ImageWithBasePath
//                   src="assets/img/bg/bg-03.png"
//                   className="bg-3"
//                   alt="Background pattern 3"
//                 />
//               </div>
//               <div className="authentication-card w-100">
//                 <div className="authen-overlay-item border w-100">
//                   <h1 className="text-white">
//                     Empowering people <br /> through seamless HR <br />{" "}
//                     management.
//                   </h1>
//                   <div className="my-4 mx-auto authen-overlay-img">
//                     <ImageWithBasePath
//                       src="assets/img/bg/authentication-bg-01.png"
//                       alt="Authentication illustration"
//                     />
//                   </div>
//                   <div>
//                     <p className="text-white fs-20 fw-semibold text-center">
//                       Efficiently manage your workforce, streamline <br />{" "}
//                       operations effortlessly.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="col-lg-7 col-md-12 col-sm-12">
//             <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap">
//               <div className="col-md-7 mx-auto vh-100">
//                 <form className="vh-100" onSubmit={handleLogin}>
//                   <div className="vh-100 d-flex flex-column justify-content-between p-4 pb-0">
//                     <div className="mx-auto mb-5 text-center">
//                       <ImageWithBasePath
//                         src="assets/img/konvertr hr-logo.png"
//                         className="img-fluid"
//                         alt="Konvertr hr logo"
//                       />
//                     </div>
//                     <div className="">
//                       <div className="text-center mb-3">
//                         <h2 className="mb-2">Sign In</h2>
//                         <p className="mb-0">
//                           Please enter your details to sign in
//                         </p>
//                       </div>
//                       <div className="mb-3">
//                         <label className="form-label">Email Address</label>
//                         <div className="input-group">
//                           <input
//                             type="email"
//                             className="form-control border-end-0"
//                             required
//                             autoComplete="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             placeholder="Enter your email"
//                           />
//                           <span className="input-group-text border-start-0">
//                             <i className="ti ti-mail" />
//                           </span>
//                         </div>
//                       </div>
//                       <div className="mb-3">
//                         <label className="form-label">Password</label>
//                         <div className="pass-group">
//                           <input
//                             type={
//                               passwordVisibility.password ? "text" : "password"
//                             }
//                             className="pass-input form-control"
//                             required
//                             autoComplete="current-password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             placeholder="Enter your password"
//                           />
//                           <span
//                             className={`ti toggle-passwords ${
//                               passwordVisibility.password
//                                 ? "ti-eye"
//                                 : "ti-eye-off"
//                             }`}
//                             onClick={() => togglePasswordVisibility("password")}
//                             role="button"
//                             tabIndex={0}
//                             aria-label="Toggle password visibility"
//                           ></span>
//                         </div>
//                       </div>
//                       <div className="d-flex align-items-center justify-content-between mb-3">
//                         {/* <div className="d-flex align-items-center">
//                           <div className="form-check form-check-md mb-0">
//                             <input
//                               className="form-check-input"
//                               id="remember_me"
//                               type="checkbox"
//                             />
//                             <label
//                               htmlFor="remember_me"
//                               className="form-check-label mt-0"
//                             >
//                               Remember Me
//                             </label>
//                           </div>
//                         </div> */}
//                         <div className="text-end">
//                           <Link
//                             to={all_routes.forgotPassword}
//                             className="link-danger"
//                           >
//                             Forgot Password?
//                           </Link>
//                         </div>
//                       </div>
//                       <div className="mb-3">
//                         <button
//                           type="submit"
//                           className="btn btn-primary w-100"
//                           disabled={isLoading}
//                         >
//                           {isLoading ? (
//                             <span>
//                               <span
//                                 className="spinner-border spinner-border-sm me-2"
//                                 role="status"
//                                 aria-hidden="true"
//                               ></span>
//                               Signing In...
//                             </span>
//                           ) : (
//                             "Sign In"
//                           )}
//                         </button>
//                       </div>

//                       <div className="mt-5 pb-4 text-center">
//                         <p className="mb-0 text-gray-9">
//                           Copyright © 2025 - Kavach
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
