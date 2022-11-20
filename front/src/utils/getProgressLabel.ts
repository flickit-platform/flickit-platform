import React from "react";
import { t } from "i18next";

const getProgressLabel = (progress: number = 0): string => {
  if (!progress) {
    return t("notStarted");
  } else if (progress >= 100) {
    return t("completed");
  } else {
    return t("inprogress");
  }
};

export default getProgressLabel;
