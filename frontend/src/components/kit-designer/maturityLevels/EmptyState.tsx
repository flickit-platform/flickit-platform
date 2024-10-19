import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";
import { styles } from "@/config/styles";

interface EmptyStateProps {
  onNewMaturityLevelClick: () => void;
}

const EmptyState = ({ onNewMaturityLevelClick }: EmptyStateProps) => (
  <Box sx={{ ...styles.centerCVH }} minHeight="180px" gap={2}>
    <Typography
      variant="headlineSmall"
      fontWeight="bold"
      color="rgba(61, 77, 92, 0.5)"
    >
      <Trans i18nKey="maturityLevelsListEmptyState" />
    </Typography>
    <Typography variant="bodyMedium">
      <Trans i18nKey="maturityLevelsListEmptyStateDatailed" />
    </Typography>
    <Button variant="contained" onClick={onNewMaturityLevelClick}>
      <Trans i18nKey="newMaturityLevel" />
    </Button>
  </Box>
);

export default EmptyState;
