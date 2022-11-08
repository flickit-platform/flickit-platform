import React from "react";
import Routes from "./routes";
import "./config/i18n";
import useGetSignedInUserInfo from "./utils/useGetSignedInUserInfo";
import { DataLoadingError, GettingThingsReadyLoading } from "./components";
import Box from "@mui/material/Box";
import ErrorBoundary from "./components/errors/ErrorBoundry";
import { styles } from "./config/styles";

function App() {
  const { error, loading } = useGetSignedInUserInfo();

  return error ? (
    <Box sx={{ ...styles.centerVH }} height="100vh">
      <DataLoadingError />
    </Box>
  ) : (
    <ErrorBoundary>
      {loading ? <GettingThingsReadyLoading /> : <Routes />}
    </ErrorBoundary>
  );
}

export default App;
