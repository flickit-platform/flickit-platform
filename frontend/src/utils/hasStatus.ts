import React from "react";
import { TStatus } from "../types";

const hasStatus = (status: TStatus) => {
  if (!status || (status && status === "Not Calculated")) {
    return false;
  }
  return true;
};

export default hasStatus;
