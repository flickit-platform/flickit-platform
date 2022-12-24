import React from "react";
import { Box } from "@mui/material";
import { Trans } from "react-i18next";
import { styles } from "../../config/styles";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import InfoItem from "../shared/InfoItem";
import formatDate from "../../utils/formatDate";
import { t } from "i18next";

interface IProfileSectionAuthorInfo {
  data: any;
}

const ProfileSectionGeneralInfo = (props: IProfileSectionAuthorInfo) => {
  const { data } = props;

  return (
    <Box my={4} sx={{ mx: { xs: 0, sm: 1, md: 2 } }}>
      <Typography variant="h6" sx={{ opacity: 0.8, fontSize: "1.1rem" }}>
        <Trans i18nKey="aboutProfile" />
      </Typography>
      <Box
        sx={{
          p: 1,
          borderRadius: 2,
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={12} sm={7} md={5} lg={4}>
            {data.profileInfos.map((info: any) => {
              return (
                <InfoItem
                  info={{
                    ...info,
                    type: info.title === "Subjects" ? "array" : info.type,
                  }}
                />
              );
            })}
          </Grid>
          <Grid
            item
            sm={0}
            md={1}
            sx={{ display: { xs: "none", md: "block" } }}
          ></Grid>
          <Grid item xs={12} sm={5} md={4} lg={3}>
            {data?.last_update && (
              <InfoItem
                info={{
                  item: formatDate(data?.last_update),
                  title: t("lastUpdated"),
                }}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="body2"
              fontFamily="Roboto"
              sx={{
                my: 0.5,
                background: "#f5f2f2",
                py: 1,
                px: 1,
                borderRadius: 1,
              }}
            >
              {data.description}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProfileSectionGeneralInfo;
