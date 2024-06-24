import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toastDefaultConfig } from "@config/toastConfigs";
import { ServiceProvider } from "./providers/ServiceProvider";
import { ThemeProvider } from "@mui/material";
import { theme } from "@config/theme";
import { AppProvider } from "./providers/AppProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { ConfigProvider } from "./providers/ConfgProvider";
import CssBaseline from "@mui/material/CssBaseline";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import { createRoot } from "react-dom/client";
import keycloakService from "@/service/keycloakService";
import * as Sentry from "@sentry/react";
import "./assets/font/fonts.css";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ["localhost", "https://flickit.sentry.io"],
    }),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const renderApp = () =>
  createRoot(document.getElementById("root") as HTMLElement).render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Suspense fallback="loading...">
          <AppProvider>
            <AuthProvider>
              <ServiceProvider>
                <ConfigProvider>
                  <CssBaseline />
                  <ToastContainer {...toastDefaultConfig} />
                  <App />
                </ConfigProvider>
              </ServiceProvider>
            </AuthProvider>
          </AppProvider>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );

keycloakService.initKeycloak(renderApp);
