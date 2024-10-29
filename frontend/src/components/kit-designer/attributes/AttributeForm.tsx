import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Trans } from "react-i18next";
import { Link, TableCell, TableRow, Typography } from "@mui/material";
import { SwapVertRounded } from "@mui/icons-material";

interface AttributeFormProps {
  newAttribute: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleCancel: () => void;
}

const AttributeForm = ({
  newAttribute,
  handleInputChange,
  handleSave,
  handleCancel,
}: AttributeFormProps) => (
  <TableRow id="new-maturity">
    <TableCell>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          borderRadius: "0.5rem",
          width: { xs: "50px", md: "64px" },
          justifyContent: "space-around",
          px: 1.5,
        }}
      >
        <Typography variant="semiBoldLarge">{1}</Typography>
        <IconButton disableRipple disableFocusRipple size="small">
          <SwapVertRounded fontSize="small" />
        </IconButton>
      </Box>
    </TableCell>
    <TableCell sx={{ width: "30%" }}>
      <TextField
        required
        label={<Trans i18nKey="title" />}
        name="title"
        value={newAttribute.title}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        sx={{
          mt: 1,
          fontSize: 14,
          "& .MuiInputBase-root": {
            height: 40,
            fontSize: 14,
          },
          "& .MuiFormLabel-root": {
            fontSize: 14,
          },
          background: "#fff",
        }}
      />
    </TableCell>
    <TableCell sx={{ width: "50%" }}>
      <TextField
        required
        label={<Trans i18nKey="description" />}
        name="description"
        value={newAttribute.description}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        sx={{
          mt: 1,
          fontSize: 14,
          "& .MuiInputBase-root": {
            height: 40,
            fontSize: 14,
          },
          "& .MuiFormLabel-root": {
            fontSize: 14,
          },
          background: "#fff",
        }}
      />
    </TableCell>
    <TableCell sx={{ width: "20%" }}>
      <TextField
        required
        label={<Trans i18nKey="weight" />}
        name="weight"
        type="number"
        value={newAttribute.weight}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        sx={{
          mt: 1,
          fontSize: 14,
          "& .MuiInputBase-root": {
            height: 40,
            fontSize: 14,
          },
          "& .MuiFormLabel-root": {
            fontSize: 14,
          },
          background: "#fff",
        }}
      />
    </TableCell>
    <TableCell sx={{ display: "flex", mt:'16px' }}>
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
        <IconButton color="primary" onClick={handleSave}>
          <CheckIcon />
        </IconButton>
        <IconButton color="secondary" onClick={handleCancel}>
          <CloseIcon />
        </IconButton>
      </Link>
    </TableCell>
  </TableRow>
);

export default AttributeForm;
