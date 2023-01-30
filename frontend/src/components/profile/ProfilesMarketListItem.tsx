import { Avatar, Box, Button, CardHeader, Chip, Divider, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { styles } from "../../config/styles";
import Title from "../shared/Title";
import ThumbUpOffAltRoundedIcon from "@mui/icons-material/ThumbUpOffAltRounded";
import { Trans } from "react-i18next";
import formatDate from "../../utils/formatDate";

const ProfilesMarketListItem = ({ bg1, bg2, data = {} }: any) => {
  return (
    <Box
      sx={{
        minHeight: "280px",
        position: "relative",
        background: `linear-gradient(165deg, ${bg1}, ${bg2})`,
        borderRadius: 2,
        p: 4,
        color: "white",
        boxShadow: 10,
        mt: 2,
        height: "calc(100% - 16px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translate(-50%,-95%)",
          background: bg1,
          width: "44px",
          height: "16px",
          borderRadius: "100%",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translate(-50%,85%)",
            background: "white",
            width: "12px",
            height: "12px",
            borderRadius: "100%",
          }}
        ></Box>
      </Box>
      <Title
        size="small"
        toolbar={
          <Box sx={{ ...styles.centerV }}>
            <ThumbUpOffAltRoundedIcon fontSize="inherit" sx={{ mr: 0.5, pb: 0.2 }} />
            {data.likes_number || 0}
          </Box>
        }
        sub={
          <Box
            sx={{
              ...styles.centerV,
              flexWrap: "wrap",
              fontSize: ".95rem",
              mt: 0.5,
              textTransform: "none",
              opacity: 0.9,
              minHeight: "27px",
            }}
          >
            {data.tags.map((tag: any) => {
              return <Chip label={tag?.title} size="small" sx={{ m: 0.2, background: "white" }} />;
            })}
          </Box>
        }
        toolbarProps={{ alignSelf: "flex-start", p: 1 }}
      >
        <Box component={Link} to={`/profiles/${data.id}`} sx={{ textDecoration: "none", color: "white" }}>
          {data.title}
        </Box>
      </Title>
      <Box mt={4} mb={2}>
        <Typography>{data.summary || ""}</Typography>
      </Box>
      <Box mt="auto">
        <CardHeader
          sx={{ px: 0 }}
          titleTypographyProps={{
            sx: { textDecoration: "none" },
            color: "white",
          }}
          avatar={<Avatar alt={data.expert_group?.name} src={"/"} />}
          title={
            <Box component={"b"} fontSize=".95rem" textTransform={"capitalize"}>
              {data.expert_group?.name}
            </Box>
          }
        />
      </Box>
      <Divider color="white" sx={{ opacity: 0.3 }} />
      <Box mt={2} sx={{ ...styles.centerV }}>
        {/* <Button size="small" variant="contained">
          <Trans i18nKey="createAssessment" />
        </Button> */}
        <Box>
          <Box
            sx={{
              py: 0.3,
              px: 0.8,
              background: "white",
              color: "gray",
              fontSize: ".8rem",
              borderRadius: 1,
              m: 0.2,
            }}
          >
            <Trans i18nKey="used" />:{" "}
            <Box component="span" color="black" textTransform="lowercase">
              {data.number_of_assessment} <Trans i18nKey="times" />
            </Box>
          </Box>
        </Box>
        <Typography fontWeight={"bold"} sx={{ ml: "auto" }}>
          {data.price || "FREE"}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfilesMarketListItem;
