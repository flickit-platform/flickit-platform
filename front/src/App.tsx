import React from "react";
import Routes from "./routes";
import "./config/i18n";
import useGetSignedInUserInfo from "./utils/useGetSignedInUserInfo";
import Box from "@mui/material/Box";
import { styles } from "./config/styles";
import DataLoadingError from "./components/shared/errors/DataLoadingError";
import GettingThingsReadyLoading from "./components/shared/loadings/GettingThingsReadyLoading";
import ErrorBoundary from "./components/shared/errors/ErrorBoundry";

function App() {
  const { error, loading } = useGetSignedInUserInfo();

  return error ? (
    <Box sx={{ ...styles.centerVH }} height="100vh">
      <DataLoadingError />
    </Box>
  ) : (
    <ErrorBoundary>
      {loading ? (
        <Box width="100%" sx={{ minHeight: "100vh", ...styles.centerVH }}>
          <GettingThingsReadyLoading color="gray" />
        </Box>
      ) : (
        <Routes />
      )}
    </ErrorBoundary>
  );
}

export default App;
