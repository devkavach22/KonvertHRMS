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
  // Extracting data from [id, "name"] arrays common in your API
  const designation = Array.isArray(employee.job_id)
    ? employee.job_id[1]
    : "N/A";
  const department = Array.isArray(employee.department_id)
    ? employee.department_id[1]
    : "N/A";

  // CLEAN BASE64: Removes whitespaces/newlines that break the <img> tag
  const cleanBase64 =
    typeof employee.image_1920 === "string"
      ? employee.image_1920.replace(/\s/g, "")
      : null;

  const imageSrc = cleanBase64 ? `data:image/png;base64,${cleanBase64}` : null;

  return (
    <div className="col-xxl-3 col-xl-4 col-md-6 col-sm-12 mb-4">
      <div className="card contact-grid-box shadow-sm border-0 h-100 animate__animated animate__fadeIn">
        <div className="card-body p-3 d-flex flex-column">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span
              className={`badge ${
                employee.status === "active"
                  ? "badge-soft-success"
                  : "badge-soft-danger"
              } rounded-pill`}
            >
              {employee.status?.toUpperCase() || "ACTIVE"}
            </span>
            <div className="dropdown">
              <Link to="#" className="text-muted" data-bs-toggle="dropdown">
                <i className="ti ti-dots-vertical fs-18"></i>
              </Link>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => onEdit(employee)}
                  >
                    <i className="ti ti-edit me-2 text-primary"></i>Edit
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => onDelete(employee.id)}
                  >
                    <i className="ti ti-trash me-2 text-danger"></i>Delete
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mb-3">
            <div
              className="avatar avatar-xxl mb-3 mx-auto"
              style={{ width: "80px", height: "80px" }}
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={employee.name}
                  className="rounded-circle img-fluid border shadow-sm w-100 h-100 object-fit-cover"
                />
              ) : (
                <div className="bg-light w-100 h-100 d-flex align-items-center justify-content-center rounded-circle border">
                  <i className="ti ti-user fs-30 text-muted"></i>
                </div>
              )}
            </div>
            <h5 className="fw-bold text-dark mb-1">{employee.name}</h5>
            <p className="text-muted fs-13 mb-1">{designation}</p>
            <span className="badge badge-soft-info fs-11">{department}</span>
          </div>

          <div className="mt-auto border-top pt-3">
            <div className="d-flex align-items-center mb-2 text-truncate">
              <i className="ti ti-phone-call me-2 text-primary fs-14"></i>
              <span className="fs-13 text-muted">
                {employee.work_phone || "No Phone"}
              </span>
            </div>
            <div className="d-flex align-items-center text-truncate">
              <i className="ti ti-mail me-2 text-primary fs-14"></i>
              <span className="fs-13 text-muted">
                {employee.private_email || "No Email"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
