
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { all_routes } from "../../../router/all_routes";
import CollapseHeader from "../../../core/common/collapse-header/collapse-header";

const VoiceCall = () => {
  // Remove unused state hooks if not needed

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content pb-4">
          {/* Breadcrumb */}
          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto mb-2">
              <h2 className="mb-1">Voice Call</h2>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={all_routes.adminDashboard}>
                      <i className="ti ti-smart-home" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">Application</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Voice Call
                  </li>
                </ol>
              </nav>
            </div>
            <div className="head-icons">
              <CollapseHeader />
            </div>
          </div>
          <div className="row">
            {/* Call */}
            
            {/* /Call */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default VoiceCall;
