import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import { styles } from "@/config/styles";
import { IMaturityLevel } from "@/types";

interface MaturityLevelListProps {
  maturityLevels: Array<IMaturityLevel>;
}

const MaturityLevelList = ({ maturityLevels }: MaturityLevelListProps) => (
  <>
    {maturityLevels?.map((item, index) => (
      <Box
        key={index}
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
          <Typography variant="semiBoldLarge">{item.index}</Typography>
          <Divider orientation="horizontal" flexItem sx={{ mx: 1 }} />
          <IconButton size="small">
            <SwapVertRoundedIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box>
          <Typography variant="h6">{item.title}</Typography>
          <Typography variant="body2" mt={1}>
            {item.description}
          </Typography>
        </Box>
      </Box>
    ))}
  </>
);

export default MaturityLevelList;
