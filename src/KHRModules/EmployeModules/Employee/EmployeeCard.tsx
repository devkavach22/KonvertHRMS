import React from "react";
import { Link } from "react-router-dom";

interface EmployeeCardProps {
  employee: any;
  onEdit: (employee: any) => void;
  onDelete: (id: number) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onEdit,
  onDelete,
}) => {
  // --- CONFIGURATION ---
  // Updated to your brand hex code #E42128
  const BRAND_COLOR = "#E42128";
  // Created a matching gradient (Red -> Lighter Red)
  const BRAND_GRADIENT = "linear-gradient(135deg, #E42128 0%, #FF666B 100%)";

  // Data Extraction
  const designation = Array.isArray(employee.job_id)
    ? employee.job_id[1]
    : "N/A";
  const department = Array.isArray(employee.department_id)
    ? employee.department_id[1]
    : "N/A";

  // Image Logic
  const cleanBase64 =
    typeof employee.image_1920 === "string"
      ? employee.image_1920.replace(/\s/g, "")
      : null;
  const imageSrc = cleanBase64 ? `data:image/png;base64,${cleanBase64}` : null;

  // Status
  const isActive = employee.status === "active";

  return (
    // GRID: 6 per row (XXL), 4 per row (XL/Laptop)
    <div className="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4">
      <div
        className="card h-100 border-0 shadow-sm group-hover-effect"
        style={{
          borderRadius: "8px", // Square-ish look
          overflow: "hidden",
          background: "#fff",
          transition: "all 0.3s ease",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
          e.currentTarget.style.borderColor = BRAND_COLOR; // Glows brand color on hover
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
          e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)";
        }}
      >
        {/* 1. BRAND HEADER */}
        <div
          className="d-flex justify-content-between align-items-start p-3"
          style={{
            background: BRAND_GRADIENT,
            height: "100px",
          }}
        >
          <span className="badge bg-white text-dark shadow-sm rounded-1 fs-10 fw-bold text-uppercase">
            {employee.status || "Active"}
          </span>

          <div className="dropdown">
            <button
              className="btn btn-sm btn-icon rounded-1"
              style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
              data-bs-toggle="dropdown"
            >
              <i className="ti ti-dots-vertical fs-14"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-lg rounded-1 border-0 p-1">
              <li>
                <button
                  className="dropdown-item fs-13"
                  onClick={() => onEdit(employee)}
                >
                  <i className="ti ti-pencil me-2"></i>Edit
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item fs-13 text-danger"
                  onClick={() => onDelete(employee.id)}
                >
                  <i className="ti ti-trash me-2"></i>Delete
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* 2. SQUARE AVATAR (Overlapping) */}
        <div className="px-3" style={{ marginTop: "-40px" }}>
          <div
            className="bg-white p-1 shadow-sm d-inline-block rounded-2"
            style={{ width: "80px", height: "80px" }}
          >
            {imageSrc ? (
              <img
                src={imageSrc}
                alt=""
                className="w-100 h-100 object-fit-cover rounded-1"
                style={{ backgroundColor: "#f8f9fa" }}
              />
            ) : (
              <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center text-secondary fw-bold fs-24 rounded-1">
                {employee.name?.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* 3. DETAILS SECTION */}
        <div className="card-body px-3 pt-2 pb-3">
          <h6
            className="fw-bold text-dark mb-0 fs-15 text-truncate"
            title={employee.name}
          >
            {employee.name}
          </h6>
          <p className="text-muted fs-12 mb-2 text-truncate fw-medium">
            {designation}
          </p>

          {/* Divider Line */}
          <hr className="my-2 border-dashed opacity-50" />

          {/* Details Grid */}
          <div className="d-flex flex-column gap-2 mt-2">
            {/* Department */}
            <div className="d-flex align-items-center text-truncate">
              <span
                className="d-flex align-items-center justify-content-center rounded-1 me-2"
                style={{
                  width: "24px",
                  height: "24px",
                  background: "#FFEBEE", // Changed to a very light Red to match theme
                  color: BRAND_COLOR,
                }}
              >
                <i className="ti ti-briefcase fs-12"></i>
              </span>
              <span className="fs-12 text-dark text-truncate fw-medium">
                {department}
              </span>
            </div>

            {/* Email */}
            <div className="d-flex align-items-center text-truncate">
              <span
                className="d-flex align-items-center justify-content-center rounded-1 me-2 bg-light text-muted"
                style={{ width: "24px", height: "24px" }}
              >
                <i className="ti ti-mail fs-12"></i>
              </span>
              <span
                className="fs-12 text-muted text-truncate"
                title={employee.private_email || "N/A"}
              >
                {employee.private_email || "N/A"}
              </span>
            </div>

            {/* Phone */}
            <div className="d-flex align-items-center text-truncate">
              <span
                className="d-flex align-items-center justify-content-center rounded-1 me-2 bg-light text-muted"
                style={{ width: "24px", height: "24px" }}
              >
                <i className="ti ti-phone fs-12"></i>
              </span>
              <span className="fs-12 text-muted text-truncate">
                {employee.work_phone || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* 4. FOOTER STRIP (Status) */}
        <div
          className="card-footer p-0 border-0"
          style={{
            height: "4px",
            background: isActive ? "#28c76f" : "#ea5455",
          }}
        ></div>
      </div>
    </div>
  );
};

export default EmployeeCard;
