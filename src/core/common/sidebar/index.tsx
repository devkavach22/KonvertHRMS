import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import ImageWithBasePath from "../imageWithBasePath";
import "../../../assets/icon/tabler-icons/webfont/tabler-icons.css";
import { setExpandMenu } from "../../data/redux/sidebarSlice";
import { useDispatch } from "react-redux";
import { setDataLayout } from "../../data/redux/themeSettingSlice";
import { SidebarDataTest } from "../../data/json/sidebarMenu";
import { all_routes } from "../../../router/all_routes";
import type { AppDispatch } from "../../data/redux/store";

// Define flexible types for sidebar data
interface SidebarMenuItem {
  label: string;
  link: string;
  submenu?: boolean;
  showSubRoute?: boolean;
  icon: string;
  base?: string;
  materialicons?: string;
  dot?: boolean;
  submenuItems?: SidebarMenuItem[];
  links?: string[];
  themeSetting?: boolean;
  changeLogVersion?: boolean;
}

interface SidebarMainMenu {
  tittle: string;
  icon: string;
  showAsTab: boolean;
  separateRoute: boolean;
  submenuItems: SidebarMenuItem[];
}

const Sidebar = React.memo(() => {
  const Location = useLocation();

  const [subOpen, setSubopen] = useState<string>("Dashboard");
  const [subsidebar, setSubsidebar] = useState<string>("");

  // Memoize the toggle sidebar function
  const toggleSidebar = useCallback(
    (title: string) => {
      localStorage.setItem("menuOpened", title);
      if (title === subOpen) {
        setSubopen("");
      } else {
        setSubopen(title);
      }
    },
    [subOpen],
  );

  // Memoize the toggle subsidebar function
  const toggleSubsidebar = useCallback(
    (subitem: string) => {
      if (subitem === subsidebar) {
        setSubsidebar("");
      } else {
        setSubsidebar(subitem);
      }
    },
    [subsidebar],
  );

  const dispatch = useDispatch<AppDispatch>();

  // Memoize the layout change handler
  const handleLayoutChange = useCallback(
    (layout: string) => {
      dispatch(setDataLayout(layout));
    },
    [dispatch],
  );

  // Memoize the click handler
  const handleClick = useCallback(
    (label: string, themeSetting: boolean, layout: string) => {
      toggleSidebar(label);
      if (themeSetting) {
        handleLayoutChange(layout);
      }
    },
    [toggleSidebar, handleLayoutChange],
  );

  // Memoize the layout class getter
  const getLayoutClass = useCallback((label: string): string => {
    switch (label) {
      case "Default":
        return "default";
      case "Mini":
        return "mini";
      case "Boxed":
        return "boxed";
      case "Dark":
        return "dark";
      case "RTL":
        return "rtl";
      case "Horizontal":
        return "horizontal";
      case "Modern":
        return "modern";
      case "Two Column":
        return "twocolumn";
      case "Hovered":
        return "hovered";
      case "Horizontal Single":
        return "horizontal-single";
      case "Horizontal Overlay":
        return "horizontal-overlay";
      case "Horizontal Box":
        return "horizontal-box";
      case "Menu Aside":
        return "horizontal-sidemenu";
      case "Transparent":
        return "transparent";
      case "Without Header":
        return "without-header";
      case "Detached":
        return "detached";
      default:
        return "";
    }
  }, []);

  // Memoize the mouse event handlers
  const onMouseEnter = useCallback(() => {
    dispatch(setExpandMenu(true));
  }, [dispatch]);

  const onMouseLeave = useCallback(() => {
    dispatch(setExpandMenu(false));
  }, [dispatch]);

  useEffect(() => {
    const currentMenu = localStorage.getItem("menuOpened") || "Dashboard";
    setSubopen(currentMenu);
    // Select all 'submenu' elements
    const submenus = document.querySelectorAll(".submenu");
    // Loop through each 'submenu'
    submenus.forEach((submenu) => {
      // Find all 'li' elements within the 'submenu'
      const listItems = submenu.querySelectorAll("li");
      submenu.classList.remove("active");
      // Check if any 'li' has the 'active' class
      listItems.forEach((item) => {
        if (item.classList.contains("active")) {
          // Add 'active' class to the 'submenu'
          submenu.classList.add("active");
          return;
        }
      });
    });
  }, [Location.pathname]);

  return (
    <>
      <div
        className="sidebar"
        id="sidebar"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="sidebar-logo">
          <Link to={all_routes.adminDashboard} className="logo logo-normal">
            <ImageWithBasePath
              src="assets/img/konvertr hr-logo.png"
              alt="KonvertHR Logo"
            />
          </Link>
          <Link to={all_routes.adminDashboard} className="logo-small">
            <ImageWithBasePath src="assets/img/Small-logo.png" alt="Logo" />
          </Link>
          <Link to={all_routes.adminDashboard} className="dark-logo">
            <ImageWithBasePath src="assets/img/Small-logo.png" alt="Logo" />
          </Link>
        </div>
        <div className="modern-profile p-3 pb-0">
          <div className="text-center rounded bg-light p-3 mb-4 user-profile">
            <div className="avatar avatar-lg online mb-3">
              <ImageWithBasePath
                src="assets/img/profiles/avatar-02.jpg"
                alt="Img"
                className="img-fluid rounded-circle"
              />
            </div>
            <h6 className="fs-12 fw-normal mb-1">Adrian Herman</h6>
            <p className="fs-10">System Admin</p>
          </div>
          <div className="sidebar-nav mb-3">
            <ul
              className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified bg-transparent"
              role="tablist"
            >
              <li className="nav-item">
                <Link className="nav-link active border-0" to="#">
                  Menu
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link border-0" to="#">
                  Chats
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link border-0" to="#">
                  Inbox
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="sidebar-header p-3 pb-0 pt-2">
          <div className="text-center rounded bg-light p-2 mb-4 sidebar-profile d-flex align-items-center">
            <div className="avatar avatar-md onlin">
              <ImageWithBasePath
                src="assets/img/profiles/avatar-02.jpg"
                alt="Img"
                className="img-fluid rounded-circle"
              />
            </div>
            <div className="text-start sidebar-profile-info ms-2">
              <h6 className="fs-12 fw-normal mb-1">Adrian Herman</h6>
              <p className="fs-10">System Admin</p>
            </div>
          </div>
          <div className="input-group input-group-flat d-inline-flex mb-4">
            <span className="input-icon-addon">
              <i className="ti ti-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search in HRMS"
            />
            <span className="input-group-text">
              <kbd>CTRL + / </kbd>
            </span>
          </div>
          <div className="d-flex align-items-center justify-content-between menu-item mb-3">
            <div className="me-3">
              <Link to="#" className="btn btn-menubar position-relative">
                <i className="ti ti-shopping-bag"></i>
                <span className="badge bg-success rounded-pill d-flex align-items-center justify-content-center header-badge">
                  5
                </span>
              </Link>
            </div>
            <div className="me-3">
              <Link to="#" className="btn btn-menubar">
                <i className="ti ti-layout-grid-remove"></i>
              </Link>
            </div>
            <div className="me-3">
              <Link to="#" className="btn btn-menubar position-relative">
                <i className="ti ti-brand-hipchat"></i>
                <span className="badge bg-info rounded-pill d-flex align-items-center justify-content-center header-badge">
                  5
                </span>
              </Link>
            </div>
            <div className="me-3 notification-item">
              <Link to="#" className="btn btn-menubar position-relative me-1">
                <i className="ti ti-bell"></i>
                <span className="notification-status-dot"></span>
              </Link>
            </div>
            <div className="me-0">
              <Link to="#" className="btn btn-menubar">
                <i className="ti ti-settings"></i>
              </Link>
            </div>
          </div>
        </div>
        <div className="slimScrollDiv">
          <div className="sidebar-inner slimscroll">
            <div id="sidebar-menu" className="sidebar-menu">
              <ul>
                {(SidebarDataTest as SidebarMainMenu[])?.map(
                  (mainMenu: SidebarMainMenu, index: number) => (
                    <React.Fragment key={`main-${index}`}>
                      <li className="menu-title">
                        <span>{mainMenu?.tittle}</span>
                      </li>
                      <li>
                        <ul>
                          {mainMenu?.submenuItems?.map(
                            (data: SidebarMenuItem, i: number) => {
                              const link_array: string[] = [];
                              if ("submenuItems" in data) {
                                data.submenuItems?.forEach(
                                  (link: SidebarMenuItem) => {
                                    link_array.push(link?.link);
                                    if (
                                      link?.submenu &&
                                      "submenuItems" in link
                                    ) {
                                      link.submenuItems?.forEach(
                                        (item: SidebarMenuItem) => {
                                          link_array.push(item?.link);
                                        },
                                      );
                                    }
                                  },
                                );
                              }
                              data.links = link_array;

                              return (
                                <li className="submenu" key={`title-${i}`}>
                                  <Link
                                    to={data?.submenu ? "#" : data?.link}
                                    onClick={() =>
                                      handleClick(
                                        data?.label,
                                        data?.themeSetting || false,
                                        getLayoutClass(data?.label),
                                      )
                                    }
                                    className={`${
                                      subOpen === data?.label ? "subdrop" : ""
                                    } ${
                                      data?.links?.includes(Location.pathname)
                                        ? "active"
                                        : ""
                                    } ${
                                      data?.submenuItems
                                        ?.map(
                                          (link: SidebarMenuItem) => link?.link,
                                        )
                                        .includes(Location.pathname) ||
                                      data?.link === Location.pathname
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    <i className={`ti ti-${data.icon}`}></i>
                                    <span className="menu-label">
                                      {data?.label}
                                    </span>
                                    {data?.dot && (
                                      <span className="badge badge-danger fs-10 fw-medium text-white p-1 ms-2">
                                        Hot
                                      </span>
                                    )}
                                    {data?.changeLogVersion && (
                                      <span className="badge bg-pink badge-xs text-white fs-10 ms-s">
                                        v1.5.7
                                      </span>
                                    )}
                                    <span
                                      className={
                                        data?.submenu ? "menu-arrow" : ""
                                      }
                                    />
                                  </Link>
                                  {data?.submenu !== false &&
                                    subOpen === data?.label && (
                                      <ul
                                        style={{
                                          display:
                                            subOpen === data?.label
                                              ? "block"
                                              : "none",
                                        }}
                                      >
                                        {data?.submenuItems?.map(
                                          (
                                            item: SidebarMenuItem,
                                            j: number,
                                          ) => (
                                            <li
                                              className={
                                                item?.submenuItems
                                                  ? "submenu submenu-two"
                                                  : ""
                                              }
                                              key={`item-${j}`}
                                            >
                                              <Link
                                                to={
                                                  item?.submenu
                                                    ? "#"
                                                    : item?.link
                                                }
                                                onClick={() =>
                                                  item?.submenu &&
                                                  toggleSubsidebar(item?.label)
                                                }
                                                className={`${
                                                  subsidebar === item?.label
                                                    ? "subdrop"
                                                    : ""
                                                } ${
                                                  item?.link ===
                                                  Location.pathname
                                                    ? "active"
                                                    : ""
                                                }`}
                                              >
                                                <i
                                                  className={`ti ti-${item.icon}`}
                                                ></i>
                                                <span>{item?.label}</span>
                                                {item?.dot && (
                                                  <span className="badge badge-danger fs-10 fw-medium text-white p-1">
                                                    Hot
                                                  </span>
                                                )}
                                                <span
                                                  className={
                                                    item?.submenu
                                                      ? "menu-arrow"
                                                      : ""
                                                  }
                                                />
                                              </Link>
                                              {item?.submenu !== false &&
                                                subsidebar === item?.label && (
                                                  <ul
                                                    style={{
                                                      display:
                                                        subsidebar ===
                                                        item?.label
                                                          ? "block"
                                                          : "none",
                                                    }}
                                                  >
                                                    {item?.submenuItems?.map(
                                                      (
                                                        subItem: SidebarMenuItem,
                                                        k: number,
                                                      ) => (
                                                        <li
                                                          key={`subitem-${k}`}
                                                        >
                                                          <Link
                                                            to={subItem?.link}
                                                            className={
                                                              subItem?.link ===
                                                              Location.pathname
                                                                ? "active"
                                                                : ""
                                                            }
                                                          >
                                                            <i
                                                              className={`ti ti-${subItem.icon}`}
                                                            ></i>
                                                            <span>
                                                              {subItem?.label}
                                                            </span>
                                                          </Link>
                                                        </li>
                                                      ),
                                                    )}
                                                  </ul>
                                                )}
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    )}
                                </li>
                              );
                            },
                          )}
                        </ul>
                      </li>
                    </React.Fragment>
                  ),
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
