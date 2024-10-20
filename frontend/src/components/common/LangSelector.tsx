import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {theme} from "@config/theme";

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const handleLanguageChange = (language: string) => {
        i18n.changeLanguage(language);
        window.location.reload();
    };

    return (
        <Box display="flex" justifyContent="center">
            {i18n.language === 'fa' ? (
                <Typography
                    onClick={() => handleLanguageChange('en')}
                    sx={{cursor: "pointer", fontWeight: "bold", ...theme.typography.titleMedium }}
                    color="primary"
                >
                    فا
                </Typography>
            ) : (
                <Typography
                    onClick={() => handleLanguageChange('fa')}
                    sx={{cursor: "pointer", fontWeight: "bold", ...theme.typography.titleMedium }}
                    color="primary"
                >
                    EN
                </Typography>
            )}
        </Box>
    );
};

export default LanguageSelector;
