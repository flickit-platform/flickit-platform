import React, { PropsWithChildren } from "react";
import { Box } from "@mui/material";
import GettingThingsReadyLoading from "../components/shared/loadings/GettingThingsReadyLoading";
import Navbar from "../components/shared/Navbar";
import { styles } from "../config/styles";

const AppLayout = (props: PropsWithChildren<{}>) => {
  const { children } = props;
  return (
    <Box sx={{ overflowX: "hidden", minHeight: "100vh" }}>
      <Navbar />
      <Box
        sx={{
          p: { xs: 1, sm: 1, md: 4 },
          pt: {
            xs: "84px !important",
            sm: "112px !important",
            minHeight: "100%",
          },
        }}
        maxWidth="1440px"
        m="auto"
      >
        <React.Suspense
          fallback={
            <Box sx={{ ...styles.centerVH }}>
              <GettingThingsReadyLoading color={"gray"} />
            </Box>
          }
        >
          {children}
        </React.Suspense>
      </Box>
    </Box>
  );
};

export default AppLayout;
