import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router";
import { authRoutes, publicRoutes } from "./router.link";
import { LoadingSpinner } from "../core/common/LoadingSpinner";
import { ProtectedRoute, GuestRoute } from "./RouteGuards";

// Lazy load the main feature components
const LazyFeature = lazy(() => import("../feature-module/feature"));
const LazyAuthFeature = lazy(() => import("../feature-module/authFeature"));

const ALLRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route
          element={
            <ProtectedRoute>
              <Suspense
                fallback={<LoadingSpinner text="Loading application..." />}
              >
                <LazyFeature />
              </Suspense>
            </ProtectedRoute>
          }
        >
          {publicRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={
                <Suspense fallback={<LoadingSpinner text="Loading page..." />}>
                  {route.element}
                </Suspense>
              }
              key={idx}
            />
          ))}
        </Route>

        <Route
          element={
            <GuestRoute>
              <Suspense
                fallback={<LoadingSpinner text="Loading authentication..." />}
              >
                <LazyAuthFeature />
              </Suspense>
            </GuestRoute>
          }
        >
          {authRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={
                <Suspense fallback={<LoadingSpinner text="Loading page..." />}>
                  {route.element}
                </Suspense>
              }
              key={idx}
            />
          ))}
        </Route>
      </Routes>
    </>
  );
};

export default ALLRoutes;
