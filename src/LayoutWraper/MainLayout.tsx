// // src/layout/Layout.tsx
// import React, { useState, useEffect } from "react";
// import Sidebar from "./Sidebar";
// import Header from "./Header";

// const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

//   const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
//   const toggleCollapse = () => setSidebarCollapsed(!isSidebarCollapsed);

//   useEffect(() => {
//     const handleResize = () => setIsDesktop(window.innerWidth >= 992);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <div className="layout-container">
//       {/* Header */}
//       <Header toggleSidebar={toggleSidebar} toggleCollapse={toggleCollapse} />

//       {/* Sidebar - Only show on desktop */}
//       {isDesktop && (
//         <Sidebar
//           isOpen={isSidebarOpen}
//           toggleSidebar={toggleSidebar}
//           isCollapsed={isSidebarCollapsed}
//         />
//       )}

//       {/* Main Content */}
//       <main
//         className="content"
//         style={{
//           marginLeft: isDesktop ? (isSidebarCollapsed ? "70px" : "260px") : "0",
//           transition: "margin-left 0.3s ease",
//           marginTop: "60px",
//           padding: "20px",
//           backgroundColor: "#f8f9fa",
//           minHeight: "100vh",
//         }}
//       >
//         {children}
//       </main>
//     </div>
//   );
// };

// export default Layout;

// src/layout/Layout.tsx
// import React, { useState, useEffect } from "react";
// import Sidebar from "./Sidebar";
// import Header from "./Header";

// const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [isHovering, setIsHovering] = useState(false);
//   const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

//   const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

//   const toggleCollapse = () => {
//     setSidebarCollapsed(!isSidebarCollapsed);
//   };

//   const handleMouseEnter = () => {
//     if (isSidebarCollapsed && isDesktop) {
//       setIsHovering(true);
//     }
//   };

//   const handleMouseLeave = () => {
//     if (isSidebarCollapsed && isDesktop) {
//       setIsHovering(false);
//     }
//   };

//   useEffect(() => {
//     const handleResize = () => setIsDesktop(window.innerWidth >= 992);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Calculate actual sidebar state (collapsed but showing on hover)
//   const effectivelyCollapsed = isSidebarCollapsed && !isHovering;

//   return (
//     <div className="layout-container">
//       {/* Header */}
//       <Header toggleSidebar={toggleSidebar} toggleCollapse={toggleCollapse} />

//       {/* Sidebar - Only show on desktop */}
//       {isDesktop && (
//         <Sidebar
//           isOpen={isSidebarOpen}
//           toggleSidebar={toggleSidebar}
//           isCollapsed={effectivelyCollapsed}
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleMouseLeave}
//         />
//       )}

//       {/* Main Content */}
//       <main
//         className="content"
//         style={{
//           marginLeft: isDesktop
//             ? effectivelyCollapsed
//               ? "70px"
//               : "260px"
//             : "0",
//           transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//           marginTop: "60px",
//           padding: "20px",
//           backgroundColor: "#f8f9fa",
//           minHeight: "100vh",
//         }}
//       >
//         {children}
//       </main>
//     </div>
//   );
// };

// export default Layout;
