import { Box, Chip } from "@mui/material";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { Trans } from "react-i18next";
import { theme } from "@/config/theme";

const AIGenerated = () => {
  return (
    <Chip
      label={
        <Box
          sx={{
            display: "flex",
            gap: 1,
            paddingBlock: 1,
          }}
        >
          <FaWandMagicSparkles width="16px" />
          <Trans i18nKey="AIGenerated" />
        </Box>
      }
      size="small"
      sx={{
        borderRadius: "8px",
        background: theme.palette.warning.light,
        color: theme.palette.warning.main,
        "& .MuiChip-label": {
          ...theme.typography.labelMedium,
          fontWeight: "bold",
        },
      }}
    />
  );
};

export default AIGenerated;
