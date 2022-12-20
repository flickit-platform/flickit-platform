import { PropsWithChildren, Suspense } from "react";
import { theme } from "../../config/theme";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@mui/material";
import { AppProvider } from "../../providers/AppProvider";
import { AuthProvider } from "../../providers/AuthProvider";
import CssBaseline from "@mui/material/CssBaseline";
import "react-toastify/dist/ReactToastify.css";
import { ServiceProvider } from "../../providers/ServiceProvider";
import { toastDefaultConfig } from "../../utils/toast";

interface IProvider {}

const Providers = (props: PropsWithChildren<IProvider>) => {
  const { children } = props;

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Suspense fallback="loading...">
          <AppProvider>
            <AuthProvider>
              <ServiceProvider>
                <CssBaseline />
                <ToastContainer {...toastDefaultConfig} />
                <>{children}</>
              </ServiceProvider>
            </AuthProvider>
          </AppProvider>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default Providers;
