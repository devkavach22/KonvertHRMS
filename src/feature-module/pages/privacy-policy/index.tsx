import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import CollapseHeader from "../../../core/common/collapse-header/collapse-header";

const PrivacyPolicy = () => {

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
      
          {/* /Breadcrumb */}
        
        </div>
        <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
          <p className="mb-0">2014 - 2025 © SmartHR.</p>
          <p>
            Designed &amp; Developed By{" "}
            <Link to="#" className="text-primary">
              Dreams
            </Link>
          </p>
        </div>
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default PrivacyPolicy;
