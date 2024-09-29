import React from "react";
import { Select, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const handleLanguageChange = (event: any) => {
        const selectedLanguage = event.target.value;
        i18n.changeLanguage(selectedLanguage).then(() => {
            document.body.style.direction = selectedLanguage === "fa" ? "rtl" : "ltr"; 
        });
    };

    return (
        <Select value={i18n.language} onChange={handleLanguageChange}>
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="fa">فارسی</MenuItem>
        </Select>
    );
};

export default LanguageSelector;
