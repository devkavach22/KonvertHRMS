import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

import { base_path } from "./environment";
import store from "./core/data/redux/store";

import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import ALLRoutes from "./router/router";
import { initializePreloading } from "./router/preloadUtils";
import { PerformanceProvider } from "./core/providers/PerformanceProvider";
import { NotificationProvider } from "./createContextStore/NotificationContext";

// =================== STYLES ===================
import "../src/assets/css/bootstrap.min.css";
import "../src/assets/css/feather.css";
import "../src/index.scss";

import "../src/assets/icon/boxicons/boxicons/css/boxicons.min.css";
import "../src/assets/icon/weather/weathericons.css";
import "../src/assets/icon/typicons/typicons.css";
import "../src/assets/css/fontawesome/css/fontawesome.min.css";
import "../src/assets/css/fontawesome/css/all.min.css";
import "../src/assets/icon/ionic/ionicons.css";
import "../src/assets/icon/tabler-icons/webfont/tabler-icons.css";

// =================== JS ===================
import "../src/assets/js/bootstrap.bundle.min.js";
import "react-toastify/dist/ReactToastify.css";

// =================== INIT ===================
initializePreloading();

// =================== RENDER ===================
createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <NotificationProvider>
      <PerformanceProvider enableVirtualization={true}>
        <BrowserRouter basename={base_path}>
          <ErrorBoundary fallback={<div>Oops! An unexpected error occurred.</div>}>
            <ToastContainer position="top-right" autoClose={3000} />
            <ALLRoutes />
          </ErrorBoundary>
        </BrowserRouter>
      </PerformanceProvider>
    </NotificationProvider>
  </Provider>
);
