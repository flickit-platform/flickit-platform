import { Box, Typography, BoxProps } from "@mui/material";
import { TStatus, IMaturityLevel } from "@types";
import getStatusText from "@utils/getStatusText";
import hasStatus from "@utils/hasStatus";
import { Trans } from "react-i18next";
import { styles, getMaturityLevelColors } from "@styles";
import ML2 from "@/assets/svg/ml_3";
import ML3 from "@/assets/svg/ml_3";
import ML4 from "@/assets/svg/ml_4";
import ML5 from "@/assets/svg/ml_5";
import ML6 from "@/assets/svg/ml_6";
import ML7 from "@/assets/svg/ml_7";
import ML8 from "@/assets/svg/ml_8";
import ML9 from "@/assets/svg/ml_9";
import ML10 from "@/assets/svg/ml_10";
interface IGaugeProps extends BoxProps {
  systemStatus: TStatus;
  name?: string;
  maturity_level_number: number;
  maturity_level: IMaturityLevel;
}

const Gauge = (props: IGaugeProps) => {
  const {
    systemStatus,
    name = "This system",
    maturity_level,
    maturity_level_number,
    ...rest
  } = props;
  const hasStat = hasStatus(systemStatus);
  const { title, value } = maturity_level;
  const colorPallet = getMaturityLevelColors(maturity_level_number);
  const colorCode = colorPallet[value];
  const renderSVG = (maturity_level_number: number) => {
    switch (maturity_level_number) {
      case 2:
        return value !== null && value !== undefined ? (
          <ML2 colorCode={colorCode} value={value} />
        ) : (
          <ML2 colorCode={colorCode} value={-1} />
        );
      case 3:
        return value !== null && value !== undefined ? (
          <ML3 colorCode={colorCode} value={value} />
        ) : (
          <ML3 colorCode={colorCode} value={-1} />
        );
      case 4:
        return value !== null && value !== undefined ? (
          <ML4 colorCode={colorCode} value={value} />
        ) : (
          <ML4 colorCode={colorCode} value={-1} />
        );
      case 5:
        return value !== null && value !== undefined ? (
          <ML5 colorCode={colorCode} value={value} />
        ) : (
          <ML5 colorCode={colorCode} value={-1} />
        );
      case 6:
        return value !== null && value !== undefined ? (
          <ML6 colorCode={colorCode} value={value} />
        ) : (
          <ML6 colorCode={colorCode} value={-1} />
        );
      case 7:
        return value !== null && value !== undefined ? (
          <ML7 colorCode={colorCode} value={value} />
        ) : (
          <ML7 colorCode={colorCode} value={-1} />
        );
      case 8:
        return value !== null && value !== undefined ? (
          <ML8 colorCode={colorCode} value={value} />
        ) : (
          <ML8 colorCode={colorCode} value={-1} />
        );
      case 9:
        return value !== null && value !== undefined ? (
          <ML9 colorCode={colorCode} value={value} />
        ) : (
          <ML9 colorCode={colorCode} value={-1} />
        );
      case 10:
        return value !== null && value !== undefined ? (
          <ML10 colorCode={colorCode} value={value} />
        ) : (
          <ML10 colorCode={colorCode} value={-1} />
        );
    }
  };

  return (
    <Box p={1} position="relative" width="100%" {...rest}>
      {/* <img
        width="100%"
        src={`/assets/svg/ml_${maturity_level_number}.svg`}
        alt={getStatusText(systemStatus, true) as string}
      /> */}

      {renderSVG(maturity_level_number)}
      {value ? (
        <Box
          sx={{ ...styles.centerCVH, bottom: "40%", left: "25%", right: "25%" }}
          position="absolute"
        >
          <Typography variant="subtitle2" color="black">
            <Trans i18nKey="thisSystemIs" />
          </Typography>
          <Typography
            sx={{ fontWeight: "bold" }}
            variant="h5"
            color={colorCode}
          >
            {title}
          </Typography>
          <Typography variant="subtitle2" color="black">
            <Trans i18nKey="shape" />
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{ ...styles.centerCVH, bottom: "50%", left: "25%", right: "25%" }}
          position="absolute"
        >
          <Typography
            sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
            variant="h5"
            color="GrayText"
          >
            <Trans i18nKey="notEvaluated" />
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export { Gauge };
