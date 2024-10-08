import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

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
                    style={{ cursor: "pointer", fontWeight: "bold" }}
                    color="primary"
                >
                    فا
                </Typography>
            ) : (
                <Typography
                    onClick={() => handleLanguageChange('fa')}
                    style={{ cursor: "pointer", fontWeight: "bold" }}
                    color="primary"
                >
                    EN
                </Typography>
            )}
        </Box>
    );
};

export default LanguageSelector;
