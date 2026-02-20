import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router";
import { authRoutes, publicRoutes } from "./router.link";
import { LoadingSpinner } from "../core/common/LoadingSpinner";
import { ProtectedRoute, GuestRoute } from "./RouteGuards";
import { useDispatch, useSelector } from "react-redux";
import {
  ApiAuth,
  getCurrentAttendanceStatus,
  TBSelector,
  updateState,
} from "@/Store/Reducers/TBSlice";
import { useNotificationContext } from "@/createContextStore/NotificationContext";

// Lazy load the main feature components
const LazyFeature = lazy(() => import("../feature-module/feature"));
const LazyAuthFeature = lazy(() => import("../feature-module/authFeature"));

const ALLRoutes: React.FC = () => {
  const {
    isError,
    errorMessage,
    isSuccess,
    successMessage,
    isCheckinCheckout,
  } = useSelector(TBSelector);
  const dispatch = useDispatch();
  const { openNotification } = useNotificationContext();

  // Call ApiAuth once on app initialization to get authToken
  React.useEffect(() => {
    console.log("hemanshiiiii");
    
    const authToken = localStorage.getItem("authToken");
    // Only call ApiAuth if no token exists
    if (!authToken || authToken === "undefined") {
      dispatch(ApiAuth() as any);
    }
  }, [dispatch]);

  React.useEffect(() => {
    if (isError) {
      openNotification(
        "error",
        "Error",
        errorMessage ? errorMessage : "Something went wrong",
        true,
        true,
      );
      dispatch(updateState({ isError: false, errorMessage: "" }));
    }
  }, [isError]);
  React.useEffect(() => {
    if (isSuccess) {
      openNotification(
        "success",
        "success",
        successMessage ? successMessage : "success",
        true,
        true,
      );
      dispatch(updateState({ isSuccess: false, successMessage: "" }));
    }
  }, [successMessage]);

  React.useEffect(() => {
    if (isCheckinCheckout) {
      // Check if both user_id and authToken are available before calling
      const userId = localStorage.getItem("user_id");
      const authToken = localStorage.getItem("authToken");
      
      if (userId && authToken && authToken !== "undefined" && authToken !== "null") {
        console.log("✅ Calling getCurrentAttendanceStatus after check-in/out");
        dispatch(getCurrentAttendanceStatus() as any);
      } else {
        console.log("⚠️ Skipping getCurrentAttendanceStatus - missing credentials");
      }
      dispatch(updateState({ isCheckinCheckout: false }));
    }
  }, [isCheckinCheckout]);

  React.useEffect(() => {
    // Only call if user is logged in and has valid authToken
    const userId = localStorage.getItem("user_id");
    const authToken = localStorage.getItem("authToken");
    
    if (userId && authToken && authToken !== "undefined" && authToken !== "null") {
      console.log("✅ Calling getCurrentAttendanceStatus on app load");
      dispatch(getCurrentAttendanceStatus() as any);
    } else {
      console.log("⚠️ Skipping getCurrentAttendanceStatus - missing userId or authToken");
    }
  }, [dispatch]);

  React.useEffect(() => {
    // Only call if user is logged in (check for user_id in localStorage)
    const userId = localStorage.getItem("user_id");
    if (userId) {
      dispatch(getCurrentAttendanceStatus() as any);
    }
  }, []);

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

// import React, { Suspense, lazy } from "react";
// import { Route, Routes } from "react-router";
// import { authRoutes, publicRoutes } from "./router.link";
// import { LoadingSpinner } from "../core/common/LoadingSpinner";
// import { ProtectedRoute, GuestRoute } from "./RouteGuards";
// import { useDispatch, useSelector } from "react-redux";
// import { getCurrentAttendanceStatus, TBSelector, updateState } from "@/Store/Reducers/TBSlice";
// import { useNotificationContext } from "@/createContextStore/NotificationContext";

// // Lazy load the main feature components
// const LazyFeature = lazy(() => import("../feature-module/feature"));
// const LazyAuthFeature = lazy(() => import("../feature-module/authFeature"));

// const ALLRoutes: React.FC = () => {
//   const { isError, errorMessage, isSuccess, successMessage, isCheckinCheckout } =
//     useSelector(TBSelector);
//   const dispatch = useDispatch();
//   const { openNotification } = useNotificationContext();

//   React.useEffect(() => {
//     if (isError) {
//       openNotification(
//         "error",
//         "Error",
//         errorMessage ? errorMessage : "Something went wrong",
//         true,
//         true
//       );
//       dispatch(updateState({ isError: false, errorMessage: "" }));
//     }
//   }, [isError]);
//   React.useEffect(() => {
//     if (isSuccess) {
//       openNotification(
//         "success",
//         "success",
//         successMessage ? successMessage : "success",
//         true,
//         true
//       );
//       dispatch(updateState({ isSuccess: false, successMessage: "" }));
//     }
//   }, [successMessage]);

//   React.useEffect(() => {
//     if (isCheckinCheckout) {
//       dispatch(getCurrentAttendanceStatus() as any);
//       dispatch(updateState({ isCheckinCheckout: false }));
//     }
//   }, [isCheckinCheckout])
//   React.useEffect(() => {
//     dispatch(getCurrentAttendanceStatus() as any);
//   }, [])

//   return (
//     <>
//       <Routes>
//         <Route
//           element={
//             <ProtectedRoute>
//               <Suspense
//                 fallback={<LoadingSpinner text="Loading application..." />}
//               >
//                 <LazyFeature />
//               </Suspense>
//             </ProtectedRoute>
//           }
//         >
//           {publicRoutes.map((route, idx) => (
//             <Route
//               path={route.path}
//               element={
//                 <Suspense fallback={<LoadingSpinner text="Loading page..." />}>
//                   {route.element}
//                 </Suspense>
//               }
//               key={idx}
//             />
//           ))}
//         </Route>

//         <Route
//           element={
//             <GuestRoute>
//               <Suspense
//                 fallback={<LoadingSpinner text="Loading authentication..." />}
//               >
//                 <LazyAuthFeature />
//               </Suspense>
//             </GuestRoute>
//           }
//         >
//           {authRoutes.map((route, idx) => (
//             <Route
//               path={route.path}
//               element={
//                 <Suspense fallback={<LoadingSpinner text="Loading page..." />}>
//                   {route.element}
//                 </Suspense>
//               }
//               key={idx}
//             />
//           ))}
//         </Route>
//       </Routes>
//     </>
//   );
// };

// export default ALLRoutes;
