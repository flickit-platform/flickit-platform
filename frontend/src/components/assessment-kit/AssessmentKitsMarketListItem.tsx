import {
  Avatar,
  Box,
  Button,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { styles } from "@styles";
import Title from "@common/Title";
import ThumbUpOffAltRoundedIcon from "@mui/icons-material/ThumbUpOffAltRounded";
import { Trans } from "react-i18next";
import formatDate from "@utils/formatDate";

const AssessmentKitsMarketListItem = ({ bg1, bg2, data = {} }: any) => {
  console.log(data);
  return (
    <Box
      sx={{
        minHeight: "280px",
        position: "relative",
        // background: "#e7ecef",
        // background: "#dee2e6",
        background: "#E5E5E5",
        borderRadius: 2,
        p: 4,
        color: "#000000de",
        boxShadow: 4,
        mt: 2,
        height: "calc(100% - 16px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translate(-50%,-95%)",
          background:
            "radial-gradient(circle at 18.7% 37.8%, rgb(250, 250, 250) 0%, rgb(225, 234, 238) 90%)",
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
            background: "#bdbdbd",
            width: "12px",
            height: "12px",
            borderRadius: "100%",
          }}
        ></Box>
      </Box> */}
      <Title
        size="small"
        // toolbar={
        //   <Box sx={{ ...styles.centerV }}>
        //     <ThumbUpOffAltRoundedIcon
        //       fontSize="inherit"
        //       sx={{ mr: 0.5, pb: 0.2 }}
        //     />
        //     {data.likes_number || 0}
        //   </Box>
        // }
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
              return (
                <Chip
                  label={tag?.title}
                  size="small"
                  sx={{ m: 0.2, background: "#bdbdbd36" }}
                />
              );
            })}
          </Box>
        }
        toolbarProps={{ alignSelf: "flex-start", p: 1 }}
      >
        <Box
          component={Link}
          to={`/assessment-kits/${data.id}`}
          sx={{
            textDecoration: "none",
            color: "#000000de",
            whiteSpace: "nowrap",
          }}
        >
          {data.title}
        </Box>
      </Title>
      <Box mt={4} mb={2}>
        <Typography>{data.summary || ""}</Typography>
      </Box>
      <Box mt="auto">
        <CardHeader
          component={Link}
          to={`/user/expert-groups/${data.expert_group?.id}`}
          sx={{ px: 0, textDecoration: "none" }}
          titleTypographyProps={{
            sx: { textDecoration: "none" },
            color: "white",
          }}
          avatar={<Avatar alt={data.expert_group?.name} src={"/"} />}
          title={
            <Box
              component={"b"}
              fontSize=".95rem"
              textTransform={"capitalize"}
              color={"#000000de"}
            >
              {data.expert_group?.name}
            </Box>
          }
        />
      </Box>
      <Divider color="white" sx={{ opacity: 0.3 }} />
      <Box mt={2} sx={{ ...styles.centerV }}>
        <Box>
          <Box
            sx={{
              py: 0.3,
              px: 0.8,
              background: "#bdbdbd36",
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
        <Box>
          <Box
            sx={{
              py: 0.3,
              px: 0.8,
              background: "#bdbdbd36",
              color: "gray",
              fontSize: ".8rem",
              borderRadius: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              m: 0.2,
            }}
          >
            <Box component="span" color="black" textTransform="lowercase">
              <ThumbUpOffAltRoundedIcon
                fontSize="inherit"
                sx={{ mr: 0.5, pt: 0.2 }}
              />
              {data.likes_number || 0}
            </Box>
          </Box>
        </Box>
        {(data.id == 373 || data.id == 326) && (
          <Box>
            <Box
              sx={{
                py: 0.3,
                px: 0.8,
                background: "#7954B3",
                color: "#fff",
                fontSize: ".8rem",
                borderRadius: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                m: 0.2,
              }}
            >
              <Trans i18nKey="private" />
            </Box>
          </Box>
        )}
        <Typography fontWeight={"bold"} sx={{ ml: "auto" }}>
          {data.price || "FREE"}
        </Typography>
      </Box>
    </Box>
  );
};

export default AssessmentKitsMarketListItem;
