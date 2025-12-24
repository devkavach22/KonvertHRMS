import { useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import "../../../node_modules/react-perfect-scrollbar/dist/css/styles.css";
import { Link, useLocation } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import CollapseHeader from "../../core/common/collapse-header/collapse-header";

const Chat = () => {
  const useBodyClass = (className: string) => {
    const location = useLocation();

    useEffect(() => {
      if (location.pathname === "/application/chat") {
        document.body.classList.add(className);
      } else {
        document.body.classList.remove(className);
      }
      return () => {
        document.body.classList.remove(className);
      };
    }, [location.pathname, className]);
  };
  useBodyClass("app-chat");

  const routes = all_routes;
  const [showEmoji, setShowEmoji] = useState(false);
  const [showEmoji2, setShowEmoji2] = useState(false);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto mb-2">
              <h2 className="mb-1">Chat</h2>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>
                      <i className="ti ti-smart-home" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">Application</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Chat
                  </li>
                </ol>
              </nav>
            </div>
            <div className="head-icons">
              <CollapseHeader />
            </div>
          </div>
         
        </div>
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default Chat;
