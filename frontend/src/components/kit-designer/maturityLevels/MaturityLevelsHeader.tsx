import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";
import Link from "@mui/material/Link";

interface MaturityLevelsHeaderProps {
  onNewMaturityLevelClick: () => void;
  hasMaturityLevels: boolean;
}

const MaturityLevelsHeader = ({
  onNewMaturityLevelClick,
  hasMaturityLevels,
}: MaturityLevelsHeaderProps) => (
  <>
    <div id="maturity-header">
      <Typography variant="headlineSmall" fontWeight="bold">
        <Trans i18nKey="maturityLevels" />
      </Typography>
      <br />
      <Typography variant="bodyMedium">
        <Trans i18nKey="maturityLevelsKitDesignerDescrption" />
      </Typography>
    </div>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mt={4}
    >
      <Typography variant="headlineSmall" fontWeight="bold">
        <Trans i18nKey="maturityLevelsList" />
      </Typography>
      {hasMaturityLevels ? (
        <Link
          href="#new-maturity"
          sx={{
            textDecoration: "none",
            opacity: 0.9,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button variant="contained" onClick={onNewMaturityLevelClick} data-test-id="newMaturity">
            <Trans i18nKey="newMaturityLevel" />
          </Button>
        </Link>
      ) : null}
    </Box>{" "}
  </>
);

export default MaturityLevelsHeader;
