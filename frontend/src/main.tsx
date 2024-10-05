import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toastDefaultConfig } from "@config/toastConfigs";
import { ServiceProvider } from "./providers/ServiceProvider";
import { ThemeProvider } from "@mui/material";
import { theme } from "@config/theme";
import { AppProvider } from "./providers/AppProvider";
import { AuthProvider, useAuthContext } from "./providers/AuthProvider";
import { ConfigProvider } from "./providers/ConfgProvider";
import CssBaseline from "@mui/material/CssBaseline";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import { createRoot } from "react-dom/client";
import keycloakService from "@/service/keycloakService";
import * as Sentry from "@sentry/react";
import "./assets/font/fonts.css";
import { NovuProvider } from "@novu/notification-center";

{
  process.env.NODE_ENV !== "development" &&
    Sentry.init({
      environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
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
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
}

const AppWithNovu = () => {
  const { userInfo } = useAuthContext();

  if (!userInfo) {
    return null;
  }

  return (
    <NovuProvider
      subscriberHash={userInfo.subscriberHash}
      subscriberId={userInfo.id.toString()}
      applicationIdentifier={import.meta.env.VITE_NOVU_APPLICATION_IDENTIFIER}
      backendUrl={import.meta.env.VITE_NOVU_BACKEND_URL}
      socketUrl={import.meta.env.VITE_NOVU_SOCKET_URL}
      i18n={theme.direction === "rtl" ? "fa" : "en"}
    >
      <App />
    </NovuProvider>
  );
};

const renderApp = () => {
  return createRoot(document.getElementById("root") as HTMLElement).render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Suspense fallback="loading...">
          <AppProvider>
            <AuthProvider>
              <ServiceProvider>
                <ConfigProvider>
                  <CssBaseline />
                  <ToastContainer {...toastDefaultConfig} />
                  <AppWithNovu />
                </ConfigProvider>
              </ServiceProvider>
            </AuthProvider>
          </AppProvider>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>,
  );
};

keycloakService.initKeycloak(renderApp);
