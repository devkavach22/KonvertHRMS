import { useState, useEffect } from "react";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Instance from "../../../api/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SecretKeyLogin = () => {
  const navigate = useNavigate();
  // 1. Get query parameters from URL
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);

  // 2. Auto-fill Email & Key if user clicked a link (e.g., ?email=user@test.com&key=SK-123)
  useEffect(() => {
    const keyFromUrl = searchParams.get("key");
    const emailFromUrl = searchParams.get("email");

    if (keyFromUrl) setSecretKey(keyFromUrl);
    if (emailFromUrl) setEmail(emailFromUrl);
  }, [searchParams]);

  const handleActivation = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !secretKey) {
      toast.error("Please enter both Email and Secret Key.");
      return;
    }

    setIsLoading(true);

    try {
      // ✅ Updated API Endpoint & Payload
      const response = await Instance.post("api/activate/plan", {
        email: email,
        secret_key: secretKey,
      });

      console.log("Activation Response:", response.data);

      // Check for token in standard places
      const token =
        response.data.token ||
        response.data.accessToken ||
        response.data.data?.token;

      if (token) {
        localStorage.setItem("authToken", token);
        toast.success("Plan Activated Successfully! Logging in...");

        // Redirect to dashboard
        setTimeout(() => {
          navigate("/employee-dashboard");
        }, 1500);
      } else {
        // Sometimes activation succeeds but doesn't return a login token immediately
        // In that case, ask them to login normally
        toast.success("Plan Activated! Please log in.");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error: any) {
      console.error("Activation Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Activation failed. Invalid credentials.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
        <div className="row">
          {/* LEFT SIDE - VISUALS */}
          <div className="col-lg-5">
            <div className="login-background position-relative d-lg-flex align-items-center justify-content-center d-none flex-wrap vh-100">
              <div className="bg-overlay-img">
                <ImageWithBasePath
                  src="assets/img/bg/bg-01.png"
                  className="bg-1"
                  alt="bg"
                />
                <ImageWithBasePath
                  src="assets/img/bg/bg-02.png"
                  className="bg-2"
                  alt="bg"
                />
                <ImageWithBasePath
                  src="assets/img/bg/bg-03.png"
                  className="bg-3"
                  alt="bg"
                />
              </div>
              <div className="authentication-card w-100">
                <div className="authen-overlay-item border w-100">
                  <h1 className="text-white">
                    Activate Your <br /> Premium Plan
                  </h1>
                  <div className="my-4 mx-auto authen-overlay-img">
                    <ImageWithBasePath
                      src="assets/img/bg/authentication-bg-01.png"
                      alt="Auth"
                    />
                  </div>
                  <div>
                    <p className="text-white fs-20 fw-semibold text-center">
                      Securely access your new features <br /> with your unique
                      key.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - FORM */}
          <div className="col-lg-7 col-md-12 col-sm-12">
            <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap">
              <div className="col-md-7 mx-auto vh-100">
                <form className="vh-100" onSubmit={handleActivation}>
                  <div className="vh-100 d-flex flex-column justify-content-center p-4 pb-0">
                    <div className="mx-auto mb-5 text-center">
                      <ImageWithBasePath
                        src="assets/img/konvertr hr-logo.png"
                        className="img-fluid"
                        alt="Logo"
                      />
                    </div>

                    <div className="card shadow-sm border-0 p-4">
                      <div className="text-center mb-4">
                        <div className="avatar avatar-xl bg-success-transparent rounded-circle mb-3 mx-auto d-flex align-items-center justify-content-center">
                          <i className="ti ti-shield-check fs-24 text-success"></i>
                        </div>
                        <h2 className="mb-2">Activate Account</h2>
                        <p className="text-muted">
                          Enter your registered email and the secret key sent to
                          your inbox.
                        </p>
                      </div>

                      {/* EMAIL INPUT */}
                      <div className="mb-3">
                        <label className="form-label fw-medium">
                          Registered Email
                        </label>
                        <div className="input-group">
                          <span className="input-group-text border-end-0 bg-white text-muted">
                            <i className="ti ti-mail"></i>
                          </span>
                          <input
                            type="email"
                            className="form-control border-start-0"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                          />
                        </div>
                      </div>

                      {/* SECRET KEY INPUT */}
                      <div className="mb-4">
                        <label className="form-label fw-medium">
                          Secret Key
                        </label>
                        <div className="input-group">
                          <span className="input-group-text border-end-0 bg-white text-muted">
                            <i className="ti ti-key"></i>
                          </span>
                          <input
                            type={showKey ? "text" : "password"}
                            className="form-control border-start-0 border-end-0 ps-0"
                            required
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value)}
                            placeholder="SK-XXXX-XXXX"
                            style={{
                              letterSpacing: secretKey ? "2px" : "normal",
                              fontFamily: "monospace",
                            }}
                          />
                          <span
                            className="input-group-text border-start-0 bg-white cursor-pointer"
                            onClick={() => setShowKey(!showKey)}
                            style={{ cursor: "pointer" }}
                          >
                            <i
                              className={`ti ${
                                showKey ? "ti-eye" : "ti-eye-off"
                              }`}
                            ></i>
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <button
                          type="submit"
                          className="btn btn-primary w-100 py-2 fs-16"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Validating...
                            </span>
                          ) : (
                            "Activate & Login"
                          )}
                        </button>
                      </div>

                      <div className="text-center mt-3">
                        <Link to="/" className="text-muted fw-medium">
                          <i className="ti ti-arrow-left me-1"></i> Back to
                          Standard Login
                        </Link>
                      </div>
                    </div>

                    <div className="mt-auto pb-4 text-center">
                      <p className="mb-0 text-gray-9">
                        Copyright © 2026 - Konverthr All Rights Reserved
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

export default SecretKeyLogin;
