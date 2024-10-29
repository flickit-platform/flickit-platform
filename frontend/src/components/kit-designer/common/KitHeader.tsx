import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";
import Link from "@mui/material/Link";

interface KItDHeaderProps {
    onAddNewRow: () => void;
    mainTitle: string,
    description: string,
    subTitle: string,
    hasBtn: boolean,
}

const KitDHeader = ({
    mainTitle,
    description,
    subTitle,
    hasBtn,
    onAddNewRow,
}: KItDHeaderProps) => (
    <>
        <div id="maturity-header">
            <Typography variant="headlineSmall" fontWeight="bold">
                <Trans i18nKey={`${mainTitle}`} />
            </Typography>
            <br />
            <Typography variant="bodyMedium">
                <Trans i18nKey={`${description}`} />
            </Typography>
        </div>
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={4}
        >
            <Typography variant="headlineSmall" fontWeight="bold">
                <Trans i18nKey={`${subTitle}`} />
            </Typography>
            {hasBtn ? (
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
                    <Button variant="contained" onClick={onAddNewRow}>
                        <Trans i18nKey="newSubject" />
                    </Button>
                </Link>
            ) : null}
        </Box>{" "}
    </>
);

export default KitDHeader;
