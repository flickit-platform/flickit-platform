import Routes from "./routes";
import "@config/i18n";
import useGetSignedInUserInfo from "./utils/useGetSignedInUserInfo";
import { styles } from "@styles";
import Box from "@mui/material/Box";
import ErrorDataLoading from "@common/errors/ErrorDataLoading";
import GettingThingsReadyLoading from "@common/loadings/GettingThingsReadyLoading";
import ErrorBoundary from "@common/errors/ErrorBoundry";

function App() {
  const { error, loading } = useGetSignedInUserInfo(); // Checks if the user is signed in

  return error ? (
    <Box sx={{ ...styles.centerVH }} height="100vh">

      <ErrorDataLoading />
    </Box>
  ) : (
    <ErrorBoundary>
      {loading ? (
        <Box width="100%" sx={{ mt: 10, ...styles.centerVH }}>
          <GettingThingsReadyLoading color="gray" />
        </Box>
      ) : (
        <Routes />
      )}
    </ErrorBoundary>
  );
}

export default App;
