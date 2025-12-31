import React from "react";
import { Navigate, useLocation } from "react-router";
import { all_routes as routes } from "./all_routes";

type Props = {
  children: React.ReactNode;
};

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const isAuth = !!localStorage.getItem("user_id") || !!localStorage.getItem("user_id");

  if (!isAuth) {
    return <Navigate to={routes.login} replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export const GuestRoute: React.FC<Props> = ({ children }) => {
  const isAuth = !!localStorage.getItem("user_id") || !!localStorage.getItem("user_id");

  if (isAuth) {
    return <Navigate to={routes.adminDashboard} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
