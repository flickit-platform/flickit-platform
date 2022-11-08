import React from "react";
import Box, { BoxProps } from "@mui/material/Box";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { styles } from "../../config/styles";

interface IEmptyProps extends BoxProps {
  suggests?: JSX.Element;
  emptyMessage?: JSX.Element;
  img?: JSX.Element;
  useIllustration?: boolean;
  hideMessage?: boolean;
}

export const Empty = (props: IEmptyProps) => {
  const {
    emptyMessage = <Trans i18nKey="thisPlaceIsEmpty" />,
    useIllustration = false,
    img = useIllustration ? (
      <img src="/assets/svg/noData.svg" alt="noData" />
    ) : (
      <HourglassEmptyRoundedIcon
        sx={{ fontSize: "64px", mb: "16px", opacity: 0.8 }}
      />
    ),
    suggests,
    hideMessage,
    ...rest
  } = props;

  return (
    <Box
      sx={{ ...styles.centerCVH, opacity: 0.8 }}
      pt="64px"
      pb="44px"
      textAlign="center"
      {...rest}
    >
      {img}
      {!hideMessage && (
        <Typography variant="h5" textAlign="center">
          {emptyMessage}
        </Typography>
      )}
      {suggests}
    </Box>
  );
};
