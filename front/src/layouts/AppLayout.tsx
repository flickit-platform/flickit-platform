import React, { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import GettingThingsReadyLoading from "../components/shared/loadings/GettingThingsReadyLoading";
import Navbar from "../components/shared/Navbar";

const AppLayout = (props: PropsWithChildren<{}>) => {
  const { children } = props;
  return (
    <Box sx={{ overflowX: "hidden" }}>
      <Navbar />
      <Box
        sx={{
          p: { xs: 1, sm: 1, md: 4 },
          pt: { xs: "84px !important", sm: "112px !important" },
        }}
        maxWidth="1440px"
        m="auto"
      >
        <React.Suspense
          fallback={
            <GettingThingsReadyLoading
              color={"gray"}
              sx={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
              }}
            />
          }
        >
          {children}
        </React.Suspense>
      </Box>
    </Box>
  );
};

export default AppLayout;
