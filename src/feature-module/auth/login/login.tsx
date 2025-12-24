import { useState } from "react";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
// Import the shared axios instance
import Instance from "../../../api/axiosInstance";
// Import Toast for notifications
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type PasswordField = "password";

const Login = () => {
  const routes = all_routes;
  const navigation = useNavigate();

  // State for form data and loading status
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
  });

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await Instance.post("/api/login", {
        email: email,
        password: password,
      });

      console.log("Login Response:", response.data);

      if (response.data.status === "success") {
        // 1. CLEAR STORAGE: This removes the messy/concatenated strings you currently have
        localStorage.clear();

        // 2. STORE INDIVIDUAL KEYS: No more overlapping strings
        // Store the token (if returned)
        const token = response.data.token || response.data.accessToken;
        if (token) {
          localStorage.setItem("authToken", token);
        }

        // Store User Details
        localStorage.setItem("unique_user_id", response.data.unique_user_id);
        localStorage.setItem("user_id", response.data.user_id.toString());
        localStorage.setItem("user_email", response.data.email);
        localStorage.setItem("user_name", response.data.name);

        toast.success("Login Successful! Redirecting...");

        setTimeout(() => {
          navigation("/employee-dashboard");
        }, 1000);
      } else {
        toast.error(response.data.message || "Login failed.");
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      const errorMessage =
        error.response?.data?.message || "Check your credentials.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fuild">
      {/* Toast Container for Popups */}
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
        <div className="row">
          <div className="col-lg-5">
            <div className="login-background position-relative d-lg-flex align-items-center justify-content-center d-none flex-wrap vh-100">
              <div className="bg-overlay-img">
                <ImageWithBasePath
                  src="assets/img/bg/bg-01.png"
                  className="bg-1"
                  alt="Background pattern 1"
                />
                <ImageWithBasePath
                  src="assets/img/bg/bg-02.png"
                  className="bg-2"
                  alt="Background pattern 2"
                />
                <ImageWithBasePath
                  src="assets/img/bg/bg-03.png"
                  className="bg-3"
                  alt="Background pattern 3"
                />
              </div>
              <div className="authentication-card w-100">
                <div className="authen-overlay-item border w-100">
                  <h1 className="text-white">
                    Empowering people <br /> through seamless HR <br />{" "}
                    management.
                  </h1>
                  <div className="my-4 mx-auto authen-overlay-img">
                    <ImageWithBasePath
                      src="assets/img/bg/authentication-bg-01.png"
                      alt="Authentication illustration"
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

          <div className="col-lg-7 col-md-12 col-sm-12">
            <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap">
              <div className="col-md-7 mx-auto vh-100">
                <form className="vh-100" onSubmit={handleLogin}>
                  <div className="vh-100 d-flex flex-column justify-content-between p-4 pb-0">
                    <div className="mx-auto mb-5 text-center">
                      <ImageWithBasePath
                        src="assets/img/konvertr hr-logo.png"
                        className="img-fluid"
                        alt="Konvertr hr logo"
                      />
                    </div>
                    <div className="">
                      <div className="text-center mb-3">
                        <h2 className="mb-2">Sign In</h2>
                        <p className="mb-0">
                          Please enter your details to sign in
                        </p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <div className="input-group">
                          <input
                            type="email"
                            className="form-control border-end-0"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                          />
                          <span className="input-group-text border-start-0">
                            <i className="ti ti-mail" />
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <div className="pass-group">
                          <input
                            type={
                              passwordVisibility.password ? "text" : "password"
                            }
                            className="pass-input form-control"
                            required
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                          />
                          <span
                            className={`ti toggle-passwords ${
                              passwordVisibility.password
                                ? "ti-eye"
                                : "ti-eye-off"
                            }`}
                            onClick={() => togglePasswordVisibility("password")}
                            role="button"
                            tabIndex={0}
                            aria-label="Toggle password visibility"
                          ></span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center">
                          <div className="form-check form-check-md mb-0">
                            <input
                              className="form-check-input"
                              id="remember_me"
                              type="checkbox"
                            />
                            <label
                              htmlFor="remember_me"
                              className="form-check-label mt-0"
                            >
                              Remember Me
                            </label>
                          </div>
                        </div>
                        <div className="text-end">
                          <Link
                            to={all_routes.forgotPassword}
                            className="link-danger"
                          >
                            Forgot Password?
                          </Link>
                        </div>
                      </div>
                      <div className="mb-3">
                        <button
                          type="submit"
                          className="btn btn-primary w-100"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Signing In...
                            </span>
                          ) : (
                            "Sign In"
                          )}
                        </button>
                      </div>

                      <div className="mt-5 pb-4 text-center">
                        <p className="mb-0 text-gray-9">
                          Copyright © 2025 - Konverthr All Rights Reserved
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
