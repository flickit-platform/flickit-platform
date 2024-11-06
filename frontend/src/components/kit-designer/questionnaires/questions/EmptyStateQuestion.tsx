import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import {alpha, Tooltip} from "@mui/material";
import { ReactElement } from "react";
import {theme} from "@config/theme";

interface EmptyStateProps {
    onAddNewRow?: () => void;
    btnTitle: string;
    title: string;
    SubTitle: string;
    disabled?: boolean;
    disableTextBox?: ReactElement<any, any>;
}

const EmptyStateQuestion = ({
                        onAddNewRow,
                        btnTitle,
                        title,
                        SubTitle,
                        disabled,
                        disableTextBox,
                    }: EmptyStateProps) => (
    <Box sx={{ ...styles.centerCVH, background: alpha(theme.palette.error.main, 0.04), borderRadius:"0 0 8px 8px" }} minHeight="180px" gap={2}>
        <Typography
            variant="headlineSmall"
            fontWeight="bold"
            color={ alpha(theme.palette.error.main, 0.3)}
        >
            <Trans i18nKey={title} />
        </Typography>
        <Typography
            color={alpha(theme.palette.error.main, 0.3)}
            variant="bodyMedium">
            <Trans i18nKey={SubTitle} />
        </Typography>
        <Tooltip disableHoverListener={!disabled} title={disableTextBox}>
            <div>
                <Button variant="outlined" sx={{
                    color: theme.palette.error.main ,
                    borderColor: theme.palette.error.main ,
                    '&:hover': {
                        borderColor: theme.palette.error.main ,
                        background:alpha(theme.palette.error.main, .04)
                    }


                }} onClick={onAddNewRow} disabled={disabled}>
                    <Trans i18nKey={btnTitle} />
                </Button>
            </div>
        </Tooltip>
    </Box>
);

export default EmptyStateQuestion;
