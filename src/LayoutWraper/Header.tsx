import React from "react";
import { Search, Bell, Mail, Menu, Settings } from "lucide-react";

interface HeaderProps {
  toggleSidebar: () => void;
  toggleCollapse: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, toggleCollapse }) => {
  return (
    <div
      className="bg-white border-bottom position-fixed w-100"
      style={{
        height: "60px",
        top: 0,
        left: 0,
        zIndex: 1030,
        boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div
        className="h-100 d-flex align-items-center px-3"
        style={{ marginLeft: "260px" }}
      >
        {/* Mobile Menu Toggle */}
        <button
          className="btn btn-sm me-3 d-lg-none"
          onClick={toggleSidebar}
          style={{ border: "none", background: "none" }}
        >
          <Menu size={20} />
        </button>

        {/* Expand/Collapse Icon */}
        <button
          className="btn btn-sm me-3 d-none d-lg-block"
          onClick={toggleCollapse}
          style={{ color: "#6c757d", border: "none", background: "none" }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Search Bar */}
        <div
          className="position-relative me-auto"
          style={{ width: "300px", maxWidth: "100%" }}
        >
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search in HRMIS"
            style={{
              borderRadius: "6px",
              paddingLeft: "35px",
              border: "1px solid #e0e0e0",
              fontSize: "0.85rem",
            }}
          />
          <Search
            size={16}
            className="position-absolute"
            style={{
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9e9e9e",
            }}
          />
          <span
            className="position-absolute text-muted d-none d-md-block"
            style={{
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "0.7rem",
              backgroundColor: "#f5f5f5",
              padding: "2px 6px",
              borderRadius: "3px",
            }}
          >
            CTRL + /
          </span>
        </div>

        {/* Right Side Icons */}
        <div className="d-flex align-items-center gap-2">
          {/* Full Screen */}
          <button
            className="btn btn-sm d-none d-md-block"
            style={{ color: "#6c757d", border: "none", background: "none" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
          </button>

          {/* Grid */}
          <button
            className="btn btn-sm d-none d-md-block"
            style={{ color: "#6c757d", border: "none", background: "none" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>

          {/* Notifications */}
          <button
            className="btn btn-sm position-relative"
            style={{ color: "#6c757d", border: "none", background: "none" }}
          >
            <Bell size={20} />
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
              style={{ backgroundColor: "#ff6600", fontSize: "0.6rem" }}
            >
              3
            </span>
          </button>

          {/* Messages */}
          <button
            className="btn btn-sm position-relative d-none d-sm-block"
            style={{ color: "#6c757d", border: "none", background: "none" }}
          >
            <Mail size={20} />
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success"
              style={{ fontSize: "0.6rem" }}
            >
              5
            </span>
          </button>

          {/* Profile */}
          <div
            className="d-flex align-items-center ms-2"
            style={{ cursor: "pointer" }}
          >
            <img
              src="https://ui-avatars.com/api/?name=John+Doe&background=ff6600&color=fff"
              alt="User"
              className="rounded-circle me-2"
              style={{ width: "32px", height: "32px" }}
            />
            <div className="d-none d-md-block">
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "500",
                  lineHeight: "1.2",
                }}
              >
                John Doe
              </div>
              <div style={{ fontSize: "0.7rem", color: "#6c757d" }}>Admin</div>
            </div>
          </div>

          {/* Settings */}
          <button
            className="btn btn-sm ms-2"
            style={{
              backgroundColor: "#ff6600",
              color: "white",
              borderRadius: "6px",
              padding: "6px 12px",
              border: "none",
            }}
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Responsive header for mobile */}
      <style>{`
        @media (max-width: 991px) {
          .bg-white.border-bottom > div {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Header;
