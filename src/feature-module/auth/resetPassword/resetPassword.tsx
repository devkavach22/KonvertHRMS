import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import Instance from "../../../api/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type PasswordField = "tempPassword" | "newPassword" | "confirmPassword";

interface PasswordVisibility {
  tempPassword: boolean;
  newPassword: boolean;
  confirmPassword: boolean;
}

interface PasswordResponse {
  passwordResponceText: string;
  passwordResponceKey: string;
}

const ResetPassword = () => {
  const routes = all_routes;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // To get email from URL

  // Form State
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Visibility State
  const [passwordVisibility, setPasswordVisibility] =
    useState<PasswordVisibility>({
      tempPassword: false,
      newPassword: false,
      confirmPassword: false,
    });

  // Password Strength State
  const [passwordResponce, setPasswordResponce] = useState<PasswordResponse>({
    passwordResponceText:
      "Use 8 or more characters with a mix of letters, numbers, and symbols.",
    passwordResponceKey: "",
  });

  // Load email from URL query params on mount
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  // Logic to check password strength (Visual Feedback)
  const onChangeNewPassword = (password: string) => {
    setNewPassword(password);
    if (password.match(/^$|\s+/)) {
      setPasswordResponce({
        passwordResponceText:
          "Use 8 or more characters with a mix of letters, numbers & symbols",
        passwordResponceKey: "",
      });
    } else if (password.length === 0) {
      setPasswordResponce({
        passwordResponceText: "",
        passwordResponceKey: "",
      });
    } else if ( password.length < 8) {
      setPasswordResponce({
        passwordResponceText: "Weak. Must contain at least 8 characters",
        passwordResponceKey: "0",
      });
    } else if (
      password.search(/[a-z]/) < 0 ||
      password.search(/[A-Z]/) < 0 ||
      password.search(/[0-9]/) < 0
    ) {
      setPasswordResponce({
        passwordResponceText:
          "Average. Must contain at least 1 upper case and number",
        passwordResponceKey: "1",
      });
    } else if (password.search(/(?=.*?[#?!@$%^&*-])/) < 0) {
      setPasswordResponce({
        passwordResponceText: "Almost. Must contain a special symbol",
        passwordResponceKey: "2",
      });
    } else {
      setPasswordResponce({
        passwordResponceText: "Awesome! You have a secure password.",
        passwordResponceKey: "3",
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !tempPassword || !newPassword || !confirmPassword) {
      toast.error("⚠️ Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await Instance.post("/api/forgot-password/confirm", {
        email,
        temp_password: tempPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      toast.success(res.data.message || "✅ Password reset successfully!");

      setTimeout(() => {
        navigate(routes.login);
      }, 2000);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "❌ Password reset failed");
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
                    Secure your <br /> account with <br /> confidence.
                  </h1>
                  <div className="my-4 mx-auto authen-overlay-img">
                    <ImageWithBasePath
                      src="assets/img/bg/authentication-bg-01.png"
                      alt="Authentication illustration"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-7 col-md-12 col-sm-12">
            <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap">
              <div className="col-md-7 mx-auto vh-100">
                <form className="vh-100" onSubmit={handleSubmit}>
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
                        <h2 className="mb-2">Reset Password</h2>
                        <p className="mb-0">
                          Enter your details to reset your password.
                        </p>
                      </div>

                      {/* Hidden Email Field (Visual only, to show user what email is being reset) */}
                      <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          value={email}
                          readOnly
                          disabled
                        />
                      </div>

                      {/* 1. Temporary Password */}
                      <div className="mb-3">
                        <label className="form-label">Temporary Password</label>
                        <div className="pass-group">
                          <input
                            type={
                              passwordVisibility.tempPassword
                                ? "text"
                                : "password"
                            }
                            className="pass-input form-control"
                            value={tempPassword}
                            onChange={(e) => setTempPassword(e.target.value)}
                            placeholder="Enter temporary password"
                            required
                          />
                          <span
                            className={`ti toggle-passwords ${passwordVisibility.tempPassword
                                ? "ti-eye"
                                : "ti-eye-off"
                              }`}
                            onClick={() =>
                              togglePasswordVisibility("tempPassword")
                            }
                            role="button"
                          ></span>
                        </div>
                      </div>

                      {/* 2. New Password */}
                      <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <div className="pass-group">
                          <input
                            type={
                              passwordVisibility.newPassword
                                ? "text"
                                : "password"
                            }
                            className="pass-input form-control"
                            value={newPassword}
                            onChange={(e) =>
                              onChangeNewPassword(e.target.value)
                            }
                            placeholder="Enter new password"
                            required
                          />
                          <span
                            className={`ti toggle-passwords ${passwordVisibility.newPassword
                                ? "ti-eye"
                                : "ti-eye-off"
                              }`}
                            onClick={() =>
                              togglePasswordVisibility("newPassword")
                            }
                            role="button"
                          ></span>
                        </div>
                        <div className="password-strength-info text-muted small mt-1">
                          <span
                            className={
                              passwordResponce.passwordResponceKey === "3"
                                ? "text-success"
                                : passwordResponce.passwordResponceKey === "2"
                                  ? "text-info"
                                  : passwordResponce.passwordResponceKey === "1"
                                    ? "text-warning"
                                    : "text-danger"
                            }
                          >
                            {passwordResponce.passwordResponceText}
                          </span>
                        </div>
                      </div>

                      {/* 3. Confirm Password */}
                      <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <div className="pass-group">
                          <input
                            type={
                              passwordVisibility.confirmPassword
                                ? "text"
                                : "password"
                            }
                            className="pass-input form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            required
                          />
                          <span
                            className={`ti toggle-passwords ${passwordVisibility.confirmPassword
                                ? "ti-eye"
                                : "ti-eye-off"
                              }`}
                            onClick={() =>
                              togglePasswordVisibility("confirmPassword")
                            }
                            role="button"
                          ></span>
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
                              Resetting...
                            </span>
                          ) : (
                            "Reset Password"
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="mt-5 pb-4 text-center">
                      <p className="mb-0 text-gray-9">
                        Copyright © 2025 - Konverthr All Rights Reserved{" "}
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

export default ResetPassword;