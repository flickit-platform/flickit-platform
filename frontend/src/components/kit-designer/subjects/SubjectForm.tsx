import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Trans } from "react-i18next";
import { styles } from "@/config/styles";
import Typography from "@mui/material/Typography";
import {theme} from "@config/theme";

interface SubjectFormProps {
    newSubject: {
    title: string;
    description: string;
    weight: number;
    index: number;
    value: number;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleCancel: () => void;
}

const SubjectForm = ({
  newSubject,
  handleInputChange,
  handleSave,
  handleCancel,
}: SubjectFormProps) => (
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
        value={newSubject.value}
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
          background:"#fff",
        }}
      />
    </Box>

    <Box width="100%" mx={1}>
      <TextField
        required
        label={<Trans i18nKey="title" />}
        name="title"
        value={newSubject.title}
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
            background:"#fff",
            width:{xs:"100%",md:"60%"},
        }}
      />

      <TextField
        label={<Trans i18nKey="description" />}
        name="description"
        required
        value={newSubject.description}
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
            background:"#fff",
            width:{xs:"100%",md:"85%"},
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
        <IconButton size="small" color="primary" onClick={handleSave}>
          <CheckIcon />
        </IconButton>
        <IconButton size="small" color="secondary" onClick={handleCancel}>
          <CloseIcon />
        </IconButton>
      </Link>
        <Box sx={{
            width:"fit-content",
            display:"flex",
            justifyContent:"center",
            alignItems:"flex-end",
            flexDirection:"column",
            gap:"0.5rem",
            textAlign:"center"
        }}>

        <Typography sx={{
            ...theme.typography.labelCondensed,
            color:"#6C8093",
            width:"100%"
        }}>
            <Trans i18nKey={"weight"} />
        </Typography>
        <TextField
            required
            value={newSubject.weight}
            onChange={handleInputChange}
            name="weight"
            variant="outlined"
            fullWidth
            size="small"
            // label={<Trans i18nKey="weight" />}
            margin="normal"
            type="number"
            inputProps={{
                style: { textAlign: "center", width: "40px" },
            }}
            sx={{
                mb: 1,
                mt: 1,
                fontSize: 14,
                "& .MuiInputBase-root": {
                    fontSize: 14,
                    overflow: "auto",
                },
                "& .MuiFormLabel-root": {
                    fontSize: 14,
                },
                background:"#fff",
                borderRadius:"8px",
            }}
        />
      </Box>
    </Box>
  </Box>
);

export default SubjectForm;
