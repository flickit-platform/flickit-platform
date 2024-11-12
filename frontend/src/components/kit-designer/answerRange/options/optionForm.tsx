import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Trans } from "react-i18next";
import { styles } from "@/config/styles";

interface OptionFormProps {
    newItem: {
        title: string;
        index: number;
        value: number;
    };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSave: () => void;
    handleCancel: () => void;
}

const OptionForm = ({
                        newItem,
                        handleInputChange,
                        handleSave,
                        handleCancel,
                    }: OptionFormProps) => {
    return (
        <Box
            // mt={1.5}
            p={1.5}
            sx={{
                backgroundColor: "#F3F5F6",
                borderRadius: "0px 0px 8px 8px",
                border: "0.3px solid #73808c30",
                display: "flex",
                alignItems: "flex-start",
                position: "relative",
            }}
        >
            {/*<Box*/}
            {/*    sx={{...styles.centerCVH, background: "#F3F5F6"}}*/}
            {/*    borderRadius="0.5rem"*/}
            {/*    mr={2}*/}
            {/*    p={0.25}*/}
            {/*>*/}
            {/*    <TextField*/}
            {/*        required*/}
            {/*        id="new-maturity"*/}
            {/*        type="number"*/}
            {/*        name="index"*/}
            {/*        value={newItem.index}*/}
            {/*        onChange={handleInputChange}*/}
            {/*        variant="outlined"*/}
            {/*        size="small"*/}
            {/*        inputProps={{*/}
            {/*            "data-testid": "question-value",*/}
            {/*            style: {textAlign: "center", width: "40px"},*/}
            {/*        }}*/}
            {/*        sx={{*/}
            {/*            fontSize: 14,*/}
            {/*            "& .MuiInputBase-root": {*/}
            {/*                fontSize: 14,*/}
            {/*            },*/}
            {/*            background: "#fff",*/}
            {/*        }}*/}
            {/*    />*/}
            {/*</Box>*/}

            <Box sx={{width: {xs: "65%", md: "70%"}}} mx={1}>
                <TextField
                    required
                    label={<Trans i18nKey="title"/>}
                    name="title"
                    value={newItem.title}
                    onChange={handleInputChange}
                    fullWidth
                    inputProps={{
                        "data-testid": "questionnaires-title",
                    }}
                    margin="normal"
                    sx={{
                        mt: 0.3,
                        fontSize: 14,
                        "& .MuiInputBase-root": {
                            height: 36,
                            fontSize: 14,
                        },
                        "& .MuiFormLabel-root": {
                            fontSize: 14,
                        },
                        background: "#fff",
                        width: "100%"
                    }}
                />
            </Box>
            <Box sx={{width: {xs: "20%", md: "10%"}}}>
                <TextField
                    required
                    id="new-maturity"
                    type="number"
                    name="value"
                    value={newItem.value}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    inputProps={{
                        "data-testid": "question-value",
                        style: {textAlign: "center", width: "100%"},
                    }}
                    sx={{
                        fontSize: 14,
                        "& .MuiInputBase-root": {
                            fontSize: 14,
                        },
                        background: "#fff",
                        width: "100%",
                    }}
                    label={<Trans i18nKey="value" />}
                />
            </Box>
            {/* Check and Close Buttons */}
            <Box sx={{marginLeft: "auto"}} display="flex" alignItems="center" flexDirection={"column"} gap={"20px"}>
                <Link
                    href="#subject-header"
                    sx={{
                        textDecoration: "none",
                        opacity: 0.9,
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "20px"
                    }}
                >
                    {" "}
                    <IconButton size="small" color="primary" data-testid="questionnaires-check-icon"
                                onClick={handleSave}>
                        <CheckIcon/>
                    </IconButton>
                    <IconButton size="small" color="secondary" data-testid="questionnaires-close-icon"
                                onClick={handleCancel}>
                        <CloseIcon/>
                    </IconButton>
                </Link>
            </Box>
        </Box>
    )
}

export default OptionForm;
