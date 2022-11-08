import React from "react";
import AppScreen from "../../screens/AppScreen";
import { GettingThingsReadyLoading } from "./GettingThingsReadyLoading";

export const AppSuspenseFallbackLoading = () => {
  return (
    <AppScreen>
      <GettingThingsReadyLoading
        color={"gray"}
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      />
    </AppScreen>
  );
};
