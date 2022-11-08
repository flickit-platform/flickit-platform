import React from "react";
import { AuthLayout } from "../../containers";
import { GettingThingsReadyLoading } from "./GettingThingsReadyLoading";

export const AuthSuspenseFallbackLoading = () => {
  return (
    <AuthLayout>
      <GettingThingsReadyLoading />
    </AuthLayout>
  );
};
