import Box from "@mui/material/Box";
import React, { PropsWithChildren } from "react";
import LockPersonRoundedIcon from "@mui/icons-material/LockPersonRounded";
import { Typography } from "@mui/material";
import { Trans } from "react-i18next";
import { styles } from "../../config/styles";

interface IAccessLevelProps {
  hasAccess: boolean;
}

export const AccessLevel = (props: PropsWithChildren<IAccessLevelProps>) => {
  const { hasAccess, children } = props;
  return hasAccess ? (
    <>{children}</>
  ) : (
    <Box textAlign="center" my={6} sx={{ ...styles.centerCVH, opacity: 0.9 }}>
      <LockPersonRoundedIcon fontSize="large" />
      <Typography variant="h4" textTransform={"uppercase"} sx={{ mt: 2 }}>
        <Trans i18nKey="accessDenied" />
      </Typography>
      <Typography variant="subLarge">
        <Trans i18nKey="youDontHaveCorrectPermissions" />
      </Typography>
    </Box>
  );
};
