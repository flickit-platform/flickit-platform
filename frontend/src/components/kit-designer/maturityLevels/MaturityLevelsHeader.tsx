import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";

interface MaturityLevelsHeaderProps {
  onNewMaturityLevelClick: () => void;
  hasMaturityLevels: boolean;
}

const MaturityLevelsHeader = ({
  onNewMaturityLevelClick,
  hasMaturityLevels,
}: MaturityLevelsHeaderProps) => (
  <>
    <Box>
      <Typography variant="headlineSmall" fontWeight="bold">
        <Trans i18nKey="maturityLevels" />
      </Typography>
      <br />
      <Typography variant="bodyMedium">
        <Trans i18nKey="maturityLevelsKitDesignerDescrption" />
      </Typography>
    </Box>
    <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
      <Typography variant="headlineSmall" fontWeight="bold">
        <Trans i18nKey="maturityLevelsList" />
      </Typography>
      {hasMaturityLevels ? (
        <Button variant="contained" onClick={onNewMaturityLevelClick}>
          <Trans i18nKey="newMaturityLevel" />
        </Button>
      ) : null}
    </Box>{" "}
  </>
);

export default MaturityLevelsHeader;
