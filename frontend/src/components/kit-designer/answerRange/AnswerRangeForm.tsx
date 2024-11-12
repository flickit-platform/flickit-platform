import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Trans } from "react-i18next";
import { styles } from "@/config/styles";

interface QuestionnairesFormProps {
    newItem: {
    title: string;
    id: any
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleCancel: () => void;
}

const AnswerRangeForm = ({
  newItem,
  handleInputChange,
  handleSave,
  handleCancel,
}: QuestionnairesFormProps) => (
  <Box
    mt={1.5}
    p={1.5}
    sx={{
      backgroundColor: "#F3F5F6",
      borderRadius: "8px",
      border: "0.3px solid #73808c30",
      display: "flex",
      alignItems: "flex-start",
      position: "relative",
    }}
  >
    <Box width="100%" mx={1}>
      <TextField
        required
        label={<Trans i18nKey="title" />}
        name="title"
        value={newItem.title}
        onChange={handleInputChange}
        fullWidth
        inputProps={{
            "data-testid": "AnswerRange-title",
        }}
        margin="normal"
        sx={{
          mt: .3,
          fontSize: 14,
          "& .MuiInputBase-root": {
            height: 36,
            fontSize: 14,
          },
          "& .MuiFormLabel-root": {
            fontSize: 14,
          },
            background:"#fff",
        }}
      />
    </Box>

    {/* Check and Close Buttons */}
    <Box display="flex" alignItems="center" flexDirection={"column"} gap={"20px"}>
      <Link
        href="#subject-header"
        sx={{
          textDecoration: "none",
          opacity: 0.9,
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap:"20px"
        }}
      >
        {" "}
        <IconButton size="small" color="primary" data-testid="questionnaires-check-icon" onClick={handleSave}>
          <CheckIcon />
        </IconButton>
        <IconButton size="small" color="secondary" data-testid="questionnaires-close-icon" onClick={handleCancel}>
          <CloseIcon />
        </IconButton>
      </Link>
    </Box>
  </Box>
);

export default AnswerRangeForm;
