import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Trans } from "react-i18next";
import { styles } from "@/config/styles";

interface MaturityLevelFormProps {
  newMaturityLevel: {
    title: string;
    description: string;
    index: number;
    value: number;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleCancel: () => void;
}

const MaturityLevelForm = ({
  newMaturityLevel,
  handleInputChange,
  handleSave,
  handleCancel,
}: MaturityLevelFormProps) => (
  <Box
    mt={1.5}
    p={1.5}
    sx={{
      backgroundColor: "gray.100",
      borderRadius: "8px",
      border: "0.3px solid #73808c30",
      display: "flex",
      alignItems: "flex-start",
      position: "relative",
    }}
  >
    <Box
      sx={{ ...styles.centerCVH, background: "#F3F5F6" }}
      borderRadius="0.5rem"
      mr={2}
      p={0.25}
    >
      <TextField
        required
        id="new-maturity"
        type="number"
        name="value"
        value={newMaturityLevel.value}
        onChange={handleInputChange}
        variant="outlined"
        size="small"
        inputProps={{
          style: { textAlign: "center", width: "40px" },
        }}
        sx={{
          fontSize: 14,
          "& .MuiInputBase-root": {
            fontSize: 14,
          },
        }}
      />
    </Box>

    <Box width="100%" mx={1}>
      <TextField
        required
        label={<Trans i18nKey="title" />}
        name="title"
        value={newMaturityLevel.title}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        sx={{
          mt: 0,
          fontSize: 14,
          "& .MuiInputBase-root": {
            height: 32,
            fontSize: 14,
          },
          "& .MuiFormLabel-root": {
            fontSize: 14,
          },
        }}
      />

      <TextField
        label={<Trans i18nKey="description" />}
        name="description"
        required
        value={newMaturityLevel.description}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        multiline
        minRows={2}
        maxRows={3}
        sx={{
          mt: 1,
          fontSize: 14,
          "& .MuiInputBase-root": {
            fontSize: 14,
            overflow: "auto",
          },
          "& .MuiFormLabel-root": {
            fontSize: 14,
          },
        }}
      />
    </Box>

    {/* Check and Close Buttons */}
    <Box display="flex" alignItems="center">
      <Link
        href="#maturity-header"
        sx={{
          textDecoration: "none",
          opacity: 0.9,
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
        }}
      >
        {" "}
        <IconButton size="small" color="primary" onClick={handleSave}>
          <CheckIcon />
        </IconButton>
        <IconButton size="small" color="secondary" onClick={handleCancel}>
          <CloseIcon />
        </IconButton>
      </Link>
    </Box>
  </Box>
);

export default MaturityLevelForm;
