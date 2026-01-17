import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import Instance from "../../../api/axiosInstance"; // Shared Axios Instance
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const routes = all_routes;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendMail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("⚠️ Please enter your email.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Invalid email format.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await Instance.post("/api/forgot-password/request", {
        email,
      });

      // ⛔ HANDLE backend error even if 200 OK
      if (res.data.status === "error") {
        toast.error(res.data.message || "Failed to send reset email.");
        setIsLoading(false);
        return;
      }

      toast.success(res.data.message || "📨 Reset email sent!");

      // Navigate to Reset Password page with email as a query parameter
      setTimeout(() => {
        navigate(`${routes.resetPassword}?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to send reset email."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fuild">
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
                  <h1 className="text-white display-1">
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
                <form className="vh-100" onSubmit={handleSendMail}>
                  <div className="vh-100 d-flex flex-column justify-content-between p-4 pb-0">
                    <div className="mx-auto mb-5 text-center">
                      <ImageWithBasePath
                        src="assets/img/konvertr hr-logo.png"
                        className="img-fluid"
                        alt="Konvertr hr logo"
                      />
                    </div>
                    <div>
                      <div className="text-center mb-3">
                        <h2 className="mb-2">Forgot Password?</h2>
                        <p className="mb-0">
                          If you forgot your password, well, then we'll email
                          you instructions to reset your password.
                        </p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label" htmlFor="email">
                          Email Address
                        </label>
                        <div className="input-group">
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control border-end-0"
                            required
                            placeholder="Enter your email"
                            autoComplete="email"
                          />
                          <span className="input-group-text border-start-0">
                            <i className="ti ti-mail" />
                          </span>
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
                              Sending...
                            </span>
                          ) : (
                            "Submit"
                          )}
                        </button>
                      </div>
                      <div className="text-center">
                        <h6 className="fw-normal text-dark mb-0">
                          Return to
                          <Link to={all_routes.login} className="hover-a ms-1">
                            Sign In
                          </Link>
                        </h6>
                      </div>
                    </div>
                    <div className="mt-5 pb-4 text-center">
                      <p className="mb-0 text-gray-9">
                        Copyright © 2026 - Konverthr All Rights Reserved{" "}
                      </p>
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

export default ForgotPassword;
