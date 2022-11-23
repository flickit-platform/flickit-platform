import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toastDefaultConfig } from "./utils/toast";
import { ServiceProvider } from "./providers/ServiceProvider";
import { ThemeProvider } from "@mui/material";
import { theme } from "./config/theme";
import { AppProvider } from "./providers/AppProvider";
import { AuthProvider } from "./providers/AuthProvider";
import CssBaseline from "@mui/material/CssBaseline";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <>
    <BrowserRouter>
      <Suspense fallback="loading...">
        <AppProvider>
          <AuthProvider>
            <ServiceProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <ToastContainer {...toastDefaultConfig} />
                <App />
              </ThemeProvider>
            </ServiceProvider>
          </AuthProvider>
        </AppProvider>
      </Suspense>
    </BrowserRouter>
  </>
);
