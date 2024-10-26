import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";
import { styles } from "@/config/styles";

interface EmptyStateProps {
    onAddNewRow: () => void;
    btnTitle: string;
    title: string;
    SubTitle: string
}

const EmptyState = ({ onAddNewRow, btnTitle, title, SubTitle }: EmptyStateProps) => (

    <Box sx={{ ...styles.centerCVH }} minHeight="180px" gap={2}>
        <Typography
            variant="headlineSmall"
            fontWeight="bold"
            color="rgba(61, 77, 92, 0.5)"
        >
            <Trans i18nKey={title} />
        </Typography>
        <Typography variant="bodyMedium">
            <Trans i18nKey={SubTitle} />
        </Typography>
        <Button variant="contained" onClick={onAddNewRow}>
            <Trans i18nKey={btnTitle} />
        </Button>
    </Box>
);

export default EmptyState;
