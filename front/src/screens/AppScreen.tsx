import React, { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AppSuspenseFallbackLoading } from "../components";

const AppScreen = (props: PropsWithChildren<{}>) => {
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
        <React.Suspense fallback={<AppSuspenseFallbackLoading />}>
          {children ? children : <Outlet />}
        </React.Suspense>
      </Box>
    </Box>
  );
};

export default AppScreen;
