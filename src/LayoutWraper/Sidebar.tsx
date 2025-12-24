// import React, { useState } from "react";
// import { ChevronDown, ChevronRight, User } from "lucide-react";
// import logo from "../assets/img/konvertr hr-logo.png";

// interface SidebarProps {
//   isOpen: boolean;
//   toggleSidebar: () => void;
//   isCollapsed: boolean;
// }

// const Sidebar: React.FC<SidebarProps> = ({
//   isOpen,
//   toggleSidebar,
//   isCollapsed,
// }) => {
//   const [openMenus, setOpenMenus] = useState({
//     dashboard: true,
//     applications: false,
//     layout: false,
//   });

//   const toggleMenu = (menu: keyof typeof openMenus) => {
//     if (!isCollapsed) {
//       setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
//     }
//   };

//   return (
//     <>
//       {/* Overlay for mobile */}
//       {isOpen && (
//         <div
//           className="position-fixed w-100 h-100 top-0 start-0 bg-dark bg-opacity-50 d-lg-none"
//           style={{ zIndex: 1040 }}
//           onClick={toggleSidebar}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className="bg-white border-end position-fixed h-100 overflow-auto"
//         style={{
//           width: isCollapsed ? "70px" : "260px",
//           left: isOpen ? 0 : isCollapsed ? 0 : "-260px",
//           top: 0,
//           transition: "all 0.3s ease",
//           zIndex: 1045,
//           boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
//         }}
//       >
//         {/* Logo */}
//         <div className="p-3 border-bottom d-flex align-items-center justify-content-center">
//           {isCollapsed ? (
//             <div
//               style={{
//                 width: "32px",
//                 height: "32px",
//                 backgroundColor: "#ff6600",
//                 borderRadius: "6px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "white",
//                 fontWeight: "bold",
//                 fontSize: "16px",
//               }}
//             >
//               K
//             </div>
//           ) : (
//             <img
//               src={logo}
//               alt="Company Logo"
//               style={{
//                 width: "120px",
//                 height: "auto",
//                 objectFit: "contain",
//               }}
//             />
//           )}
//         </div>

//         {/* Full Menu - Only show when not collapsed */}
//         {!isCollapsed && (
//           <>
//             {/* Menu Label */}
//             <div className="px-3 pt-3 pb-2">
//               <small
//                 className="text-muted text-uppercase"
//                 style={{
//                   fontSize: "0.7rem",
//                   fontWeight: "600",
//                   letterSpacing: "0.5px",
//                 }}
//               >
//                 Main Menu
//               </small>
//             </div>

//             {/* Dashboard Menu */}
//             <div className="px-2">
//               <div
//                 className="d-flex align-items-center justify-content-between p-2 rounded cursor-pointer"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => toggleMenu("dashboard")}
//               >
//                 <div className="d-flex align-items-center">
//                   <div
//                     className="rounded d-flex align-items-center justify-content-center me-2"
//                     style={{
//                       width: "24px",
//                       height: "24px",
//                       backgroundColor: "#fff4ed",
//                       color: "#ff6600",
//                     }}
//                   >
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     >
//                       <rect x="3" y="3" width="7" height="7"></rect>
//                       <rect x="14" y="3" width="7" height="7"></rect>
//                       <rect x="14" y="14" width="7" height="7"></rect>
//                       <rect x="3" y="14" width="7" height="7"></rect>
//                     </svg>
//                   </div>
//                   <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
//                     Dashboard
//                   </span>
//                   <span
//                     className="badge ms-2"
//                     style={{ backgroundColor: "#ff6600", fontSize: "0.65rem" }}
//                   >
//                     NEW
//                   </span>
//                 </div>
//                 {openMenus.dashboard ? (
//                   <ChevronDown size={16} />
//                 ) : (
//                   <ChevronRight size={16} />
//                 )}
//               </div>

//               {/* Submenu */}
//               {openMenus.dashboard && (
//                 <div className="ms-4 mt-1">
//                   <div
//                     className="p-2 rounded"
//                     style={{
//                       fontSize: "0.8rem",
//                       color: "#6c757d",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Admin Dashboard
//                   </div>
//                   <div
//                     className="p-2 rounded"
//                     style={{
//                       fontSize: "0.8rem",
//                       color: "#6c757d",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Employee Dashboard
//                   </div>
//                   <div
//                     className="p-2 rounded"
//                     style={{
//                       fontSize: "0.8rem",
//                       color: "#6c757d",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Deals Dashboard
//                   </div>
//                   <div
//                     className="p-2 rounded"
//                     style={{
//                       fontSize: "0.8rem",
//                       color: "#6c757d",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Leads Dashboard
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Applications Menu */}
//             <div className="px-2 mt-2">
//               <div
//                 className="d-flex align-items-center justify-content-between p-2 rounded"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => toggleMenu("applications")}
//               >
//                 <div className="d-flex align-items-center">
//                   <div
//                     className="rounded d-flex align-items-center justify-content-center me-2"
//                     style={{
//                       width: "24px",
//                       height: "24px",
//                       backgroundColor: "#e8f5e9",
//                       color: "#4caf50",
//                     }}
//                   >
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     >
//                       <rect
//                         x="3"
//                         y="3"
//                         width="18"
//                         height="18"
//                         rx="2"
//                         ry="2"
//                       ></rect>
//                       <line x1="9" y1="3" x2="9" y2="21"></line>
//                     </svg>
//                   </div>
//                   <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
//                     Applications
//                   </span>
//                 </div>
//                 {openMenus.applications ? (
//                   <ChevronDown size={16} />
//                 ) : (
//                   <ChevronRight size={16} />
//                 )}
//               </div>

//               {openMenus.applications && (
//                 <div className="ms-4 mt-1">
//                   <div
//                     className="p-2 rounded"
//                     style={{
//                       fontSize: "0.8rem",
//                       color: "#6c757d",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Chat
//                   </div>
//                   <div
//                     className="p-2 rounded"
//                     style={{
//                       fontSize: "0.8rem",
//                       color: "#6c757d",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Calendar
//                   </div>
//                   <div
//                     className="p-2 rounded"
//                     style={{
//                       fontSize: "0.8rem",
//                       color: "#6c757d",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Email
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Super Admin */}
//             <div className="px-2 mt-2">
//               <div
//                 className="d-flex align-items-center p-2 rounded"
//                 style={{ cursor: "pointer" }}
//               >
//                 <div className="d-flex align-items-center">
//                   <div
//                     className="rounded d-flex align-items-center justify-content-center me-2"
//                     style={{
//                       width: "24px",
//                       height: "24px",
//                       backgroundColor: "#e3f2fd",
//                       color: "#2196f3",
//                     }}
//                   >
//                     <User size={14} />
//                   </div>
//                   <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
//                     Super Admin
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Layout Section */}
//             <div className="px-3 pt-4 pb-2">
//               <small
//                 className="text-muted text-uppercase"
//                 style={{
//                   fontSize: "0.7rem",
//                   fontWeight: "600",
//                   letterSpacing: "0.5px",
//                 }}
//               >
//                 Layout
//               </small>
//             </div>

//             <div className="px-2">
//               <div
//                 className="d-flex align-items-center justify-content-between p-2 rounded"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => toggleMenu("layout")}
//               >
//                 <div className="d-flex align-items-center">
//                   <div
//                     className="rounded d-flex align-items-center justify-content-center me-2"
//                     style={{
//                       width: "24px",
//                       height: "24px",
//                       backgroundColor: "#fff3e0",
//                       color: "#ff9800",
//                     }}
//                   >
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     >
//                       <rect
//                         x="3"
//                         y="3"
//                         width="18"
//                         height="18"
//                         rx="2"
//                         ry="2"
//                       ></rect>
//                     </svg>
//                   </div>
//                   <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
//                     Horizontal
//                   </span>
//                 </div>
//                 {openMenus.layout ? (
//                   <ChevronDown size={16} />
//                 ) : (
//                   <ChevronRight size={16} />
//                 )}
//               </div>

//               {openMenus.layout && (
//                 <div className="ms-4 mt-1">
//                   <div
//                     className="p-2 rounded"
//                     style={{
//                       fontSize: "0.8rem",
//                       color: "#6c757d",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Detached
//                   </div>
//                   <div
//                     className="p-2 rounded"
//                     style={{
//                       fontSize: "0.8rem",
//                       color: "#6c757d",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Modern
//                   </div>
//                   <div
//                     className="p-2 rounded"
//                     style={{
//                       fontSize: "0.8rem",
//                       color: "#6c757d",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Two Column
//                   </div>
//                   <div
//                     className="p-2 rounded"
//                     style={{
//                       fontSize: "0.8rem",
//                       color: "#6c757d",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Hovered
//                   </div>
//                   <div
//                     className="p-2 rounded"
//                     style={{
//                       fontSize: "0.8rem",
//                       color: "#6c757d",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Boxed
//                   </div>
//                 </div>
//               )}
//             </div>
//           </>
//         )}

//         {/* Collapsed Menu - Only show icons */}
//         {isCollapsed && (
//           <div className="d-flex flex-column align-items-center py-3 gap-3">
//             {/* Dashboard Icon */}
//             <div
//               className="rounded d-flex align-items-center justify-content-center"
//               style={{
//                 width: "40px",
//                 height: "40px",
//                 backgroundColor: "#fff4ed",
//                 color: "#ff6600",
//                 cursor: "pointer",
//               }}
//               title="Dashboard"
//             >
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <rect x="3" y="3" width="7" height="7"></rect>
//                 <rect x="14" y="3" width="7" height="7"></rect>
//                 <rect x="14" y="14" width="7" height="7"></rect>
//                 <rect x="3" y="14" width="7" height="7"></rect>
//               </svg>
//             </div>

//             {/* Applications Icon */}
//             <div
//               className="rounded d-flex align-items-center justify-content-center"
//               style={{
//                 width: "40px",
//                 height: "40px",
//                 backgroundColor: "#e8f5e9",
//                 color: "#4caf50",
//                 cursor: "pointer",
//               }}
//               title="Applications"
//             >
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
//                 <line x1="9" y1="3" x2="9" y2="21"></line>
//               </svg>
//             </div>

//             {/* Super Admin Icon */}
//             <div
//               className="rounded d-flex align-items-center justify-content-center"
//               style={{
//                 width: "40px",
//                 height: "40px",
//                 backgroundColor: "#e3f2fd",
//                 color: "#2196f3",
//                 cursor: "pointer",
//               }}
//               title="Super Admin"
//             >
//               <User size={20} />
//             </div>

//             {/* Horizontal Icon */}
//             <div
//               className="rounded d-flex align-items-center justify-content-center"
//               style={{
//                 width: "40px",
//                 height: "40px",
//                 backgroundColor: "#fff3e0",
//                 color: "#ff9800",
//                 cursor: "pointer",
//               }}
//               title="Horizontal"
//             >
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
//               </svg>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Desktop ke liye sidebar always visible */}
//       <style>{`
//         @media (min-width: 992px) {
//           .bg-white.border-end {
//             left: 0 !important;
//           }
//         }
//       `}</style>
//     </>
//   );
// };

// export default Sidebar;

import React, { useState } from "react";
import { ChevronDown, ChevronRight, User } from "lucide-react";
import logo from "../assets/img/konvertr hr-logo.png";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isCollapsed: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
  isCollapsed,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [openMenus, setOpenMenus] = useState({
    dashboard: true,
    applications: false,
    layout: false,
  });

  const toggleMenu = (menu: keyof typeof openMenus) => {
    if (!isCollapsed) {
      setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="position-fixed w-100 h-100 top-0 start-0 bg-dark bg-opacity-50 d-lg-none"
          style={{ zIndex: 1040 }}
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className="bg-white border-end position-fixed h-100 overflow-auto"
        style={{
          width: isCollapsed ? "70px" : "260px",
          left: isOpen ? 0 : isCollapsed ? 0 : "-260px",
          top: 0,
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), left 0.3s ease",
          zIndex: 1045,
          boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Logo */}
        <div
          className="p-3 border-bottom d-flex align-items-center justify-content-center"
          style={{ transition: "all 0.3s ease" }}
        >
          {isCollapsed ? (
            <div
              style={{
                width: "32px",
                height: "32px",
                backgroundColor: "#ff6600",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              K
            </div>
          ) : (
            <img
              src={logo}
              alt="Company Logo"
              style={{
                width: "120px",
                height: "auto",
                objectFit: "contain",
                opacity: isCollapsed ? 0 : 1,
                transition: "opacity 0.2s ease",
              }}
            />
          )}
        </div>

        {/* Full Menu */}
        <div
          style={{
            opacity: isCollapsed ? 0 : 1,
            visibility: isCollapsed ? "hidden" : "visible",
            transition: "opacity 0.3s ease, visibility 0.3s ease",
            pointerEvents: isCollapsed ? "none" : "auto",
          }}
        >
          {/* Menu Label */}
          <div className="px-3 pt-3 pb-2">
            <small
              className="text-muted text-uppercase"
              style={{
                fontSize: "0.7rem",
                fontWeight: "600",
                letterSpacing: "0.5px",
              }}
            >
              Main Menu
            </small>
          </div>

          {/* Dashboard Menu */}
          <div className="px-2">
            <div
              className="d-flex align-items-center justify-content-between p-2 rounded cursor-pointer"
              style={{ cursor: "pointer" }}
              onClick={() => toggleMenu("dashboard")}
            >
              <div className="d-flex align-items-center">
                <div
                  className="rounded d-flex align-items-center justify-content-center me-2"
                  style={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: "#fff4ed",
                    color: "#ff6600",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
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
                </div>
                <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                  Dashboard
                </span>
                <span
                  className="badge ms-2"
                  style={{ backgroundColor: "#ff6600", fontSize: "0.65rem" }}
                >
                  NEW
                </span>
              </div>
              {openMenus.dashboard ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </div>

            {openMenus.dashboard && (
              <div className="ms-4 mt-1">
                {[
                  "Admin Dashboard",
                  "Employee Dashboard",
                  "Deals Dashboard",
                  "Leads Dashboard",
                ].map((item) => (
                  <div
                    key={item}
                    className="p-2 rounded"
                    style={{
                      fontSize: "0.8rem",
                      color: "#6c757d",
                      cursor: "pointer",
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Applications Menu */}
          <div className="px-2 mt-2">
            <div
              className="d-flex align-items-center justify-content-between p-2 rounded"
              style={{ cursor: "pointer" }}
              onClick={() => toggleMenu("applications")}
            >
              <div className="d-flex align-items-center">
                <div
                  className="rounded d-flex align-items-center justify-content-center me-2"
                  style={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: "#e8f5e9",
                    color: "#4caf50",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="9" y1="3" x2="9" y2="21"></line>
                  </svg>
                </div>
                <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                  Applications
                </span>
              </div>
              {openMenus.applications ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </div>

            {openMenus.applications && (
              <div className="ms-4 mt-1">
                {["Chat", "Calendar", "Email"].map((item) => (
                  <div
                    key={item}
                    className="p-2 rounded"
                    style={{
                      fontSize: "0.8rem",
                      color: "#6c757d",
                      cursor: "pointer",
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Super Admin */}
          <div className="px-2 mt-2">
            <div
              className="d-flex align-items-center p-2 rounded"
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex align-items-center">
                <div
                  className="rounded d-flex align-items-center justify-content-center me-2"
                  style={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: "#e3f2fd",
                    color: "#2196f3",
                  }}
                >
                  <User size={14} />
                </div>
                <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                  Super Admin
                </span>
              </div>
            </div>
          </div>

          {/* Layout Section */}
          <div className="px-3 pt-4 pb-2">
            <small
              className="text-muted text-uppercase"
              style={{
                fontSize: "0.7rem",
                fontWeight: "600",
                letterSpacing: "0.5px",
              }}
            >
              Layout
            </small>
          </div>

          <div className="px-2">
            <div
              className="d-flex align-items-center justify-content-between p-2 rounded"
              style={{ cursor: "pointer" }}
              onClick={() => toggleMenu("layout")}
            >
              <div className="d-flex align-items-center">
                <div
                  className="rounded d-flex align-items-center justify-content-center me-2"
                  style={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: "#fff3e0",
                    color: "#ff9800",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                  </svg>
                </div>
                <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                  Horizontal
                </span>
              </div>
              {openMenus.layout ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </div>

            {openMenus.layout && (
              <div className="ms-4 mt-1">
                {["Detached", "Modern", "Two Column", "Hovered", "Boxed"].map(
                  (item) => (
                    <div
                      key={item}
                      className="p-2 rounded"
                      style={{
                        fontSize: "0.8rem",
                        color: "#6c757d",
                        cursor: "pointer",
                      }}
                    >
                      {item}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Collapsed Menu — FIXED: Absolute positioning to stop jumping */}
        <div
          style={{
            opacity: isCollapsed ? 1 : 0,
            visibility: isCollapsed ? "visible" : "hidden",
            transition: "opacity 0.3s ease, visibility 0.3s ease",
            position: "absolute", // ✅ always absolute (fixes jump)
            top: 60,
            left: 0,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "30px",
            paddingTop: "20px",
            pointerEvents: isCollapsed ? "auto" : "none",
          }}
        >
          {/* Dashboard Icon */}
          <div
            className="rounded d-flex align-items-center justify-content-center"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#fff4ed",
              color: "#ff6600",
              cursor: "pointer",
            }}
            title="Dashboard"
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
          </div>

          {/* Applications Icon */}
          <div
            className="rounded d-flex align-items-center justify-content-center"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#e8f5e9",
              color: "#4caf50",
              cursor: "pointer",
            }}
            title="Applications"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
          </div>

          {/* Super Admin Icon */}
          <div
            className="rounded d-flex align-items-center justify-content-center"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#e3f2fd",
              color: "#2196f3",
              cursor: "pointer",
            }}
            title="Super Admin"
          >
            <User size={20} />
          </div>

          {/* Horizontal Icon */}
          <div
            className="rounded d-flex align-items-center justify-content-center"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#fff3e0",
              color: "#ff9800",
              cursor: "pointer",
            }}
            title="Horizontal"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            </svg>
          </div>
        </div>
      </div>

      {/* Keep sidebar always visible on desktop */}
      <style>{`
        @media (min-width: 992px) {
          .bg-white.border-end {
            left: 0 !important;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
