import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { base_path } from "./environment";
import "../src/assets/css/bootstrap.min.css";
import "../src/assets/css/feather.css";
import "../src/index.scss";
import store from "./core/data/redux/store";
import Store from "./Store";
import { Provider } from "react-redux";
import "../src/assets/icon/boxicons/boxicons/css/boxicons.min.css";
import "../src/assets/icon/weather/weathericons.css";
import "../src/assets/icon/typicons/typicons.css";
import "../src/assets/css/fontawesome/css/fontawesome.min.css";
import "../src/assets/css/fontawesome/css/all.min.css";
import "../src/assets/icon/ionic/ionicons.css";
import "../src/assets/icon/tabler-icons/webfont/tabler-icons.css";
import ALLRoutes from "../src/router/router.js";
import "../src/assets/js/bootstrap.bundle.min.js";

import { BrowserRouter } from "react-router";
import React from "react";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.js";
import { initializePreloading } from "./router/preloadUtils";
import { PerformanceProvider } from "./core/providers/PerformanceProvider";

// Initialize preloading for better performance
initializePreloading();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={Store}>
      <Provider store={store}>
        <PerformanceProvider enableVirtualization={true}>
          <BrowserRouter basename={base_path}>
            <ErrorBoundary
              fallback={<div>Oops! An unexpected error occurred.</div>}
            >
              <ALLRoutes />
            </ErrorBoundary>
          </BrowserRouter>
        </PerformanceProvider>
      </Provider>
    </Provider>
  </StrictMode>
);
