import React from "react";
import { Link } from "react-router-dom";
import CollapseHeader from "../../core/common/collapse-header/collapse-header";

interface CommonHeaderProps {
  title: string;
  parentMenu: string;
  activeMenu: string;
  routes: any;
  buttonText?: string;
  modalTarget?: string;
  rightActions?: React.ReactNode; // ✅ NEW
}

const CommonHeader: React.FC<CommonHeaderProps> = ({
  title,
  parentMenu,
  activeMenu,
  routes,
  buttonText,
  modalTarget,
  rightActions,
}) => {
  return (
    <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
      {/* Left */}
      <div className="my-auto mb-2">
        <h2 className="mb-1">{title}</h2>
        <nav>
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to={routes.adminDashboard}>
                <i className="ti ti-smart-home" />
              </Link>
            </li>
            <li className="breadcrumb-item">{parentMenu}</li>
            <li className="breadcrumb-item active">{activeMenu}</li>
          </ol>
        </nav>
      </div>

      {/* Right */}
      <div className="d-flex align-items-center flex-wrap gap-2">
        {/* ✅ Custom buttons first */}
        {rightActions}

        {/* Add Button */}
        {buttonText && modalTarget && (
          <button
            type="button"
            data-bs-toggle="modal"
            data-bs-target={modalTarget}
            className="btn btn-primary d-flex align-items-center"
          >
            <i className="ti ti-circle-plus me-2" />
            {buttonText}
          </button>
        )}

        {/* ✅ Collapse always LAST */}
        <div className="head-icons">
          <CollapseHeader />
        </div>
      </div>
    </div>
  );
};

export default CommonHeader;
