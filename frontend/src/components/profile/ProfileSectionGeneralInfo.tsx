import React from "react";
import Box from "@mui/material/Box";
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
    <Box my={4} mx={2}>
      <Typography variant="h6" sx={{ opacity: 0.8, fontSize: "1.1rem" }}>
        <Trans i18nKey="aboutProfile" />
      </Typography>
      <Box
        sx={{
          border: (t) => `1px dashed ${t.palette.primary.dark}`,
          p: 2,
          borderRadius: 2,
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={4}>
            {data.profileInfos.map((info: any) => {
              return (
                <InfoItem
                  info={{
                    ...info,
                    type: info.title === "Subjects" ? "tags" : info.type,
                  }}
                />
              );
            })}
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={2}>
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
              fontFamily="RobotoRegular"
              sx={{ my: 1 }}
            >
              {data.description ||
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores dolorem deleniti libero ratione repudiandae modi deserunt rem doloremque perferendis, mollitia doloribus saepe incidunt numquam sequi porro quos exercitationem dolor placeat?"}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProfileSectionGeneralInfo;
