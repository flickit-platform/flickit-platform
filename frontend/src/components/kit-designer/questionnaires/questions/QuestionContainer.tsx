import React, { useState } from "react";
import Box from "@mui/material/Box";
import { styles } from "@styles";
import IconButton from "@mui/material/IconButton";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import QuestionDialog from "./QuestionDialog";
import { Divider, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

const QuestionContain = (props: any) => {
  const { title, index, total, id } = props;
  const { kitVersionId = "" } = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Box sx={{ display: "flex", py: ".5rem", px: "1rem" }}>
        <Box
          sx={{
            ...styles.centerVH,
            background: "#F3F5F6",
            width: { xs: "65px", md: "95px" },
            justifyContent: "space-around",
          }}
          borderRadius="0.5rem"
          mr={2}
          px={0.2}
        >
          <Typography variant="semiBoldLarge">{`Q. ${index}`}</Typography>
        </Box>
        <Box sx={{ width: { xs: "80%", md: "90%" } }}>{title}</Box>
        <Box
          sx={{
            width: { xs: "20%", md: "10%" },
            display: "flex",
            justifyContent: "center",
          }}
        >
          <IconButton onClick={handleEditClick}>
            <ModeEditOutlineOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      {index !== total && <Divider sx={{ width: "95%", mx: "auto" }} />}
      <QuestionDialog
        open={isDialogOpen}
        questionId={id}
        kitVersionId={kitVersionId}
        onClose={handleCloseDialog}
      />
    </>
  );
};

export default QuestionContain;
