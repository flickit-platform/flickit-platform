import React from "react";
import { Box, Button, Divider } from "@mui/material";
import { Trans } from "react-i18next";
import { styles } from "../../config/styles";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import InfoItem from "../shared/InfoItem";
import formatDate from "../../utils/formatDate";
import { t } from "i18next";
import RichEditor from "../shared/rich-editor/RichEditor";
import Title from "../shared/Title";

interface IProfileSectionAuthorInfo {
  data: any;
}

const ProfileSectionGeneralInfo = (props: IProfileSectionAuthorInfo) => {
  const { data } = props;

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={7}>
        <Title size="small" sx={{ opacity: 0.9 }}>
          <Trans i18nKey="about" />
        </Title>
        <Box sx={{ background: "white", borderRadius: 2, p: 2.5, mt: 1 }}>
          <RichEditor
            content={
              data.about ||
              `<ul><li><p>The <strong>summary</strong> should be self-contained, almost as if the material being summarized had never existed.</p><p><a target="_blank" rel="noopener noreferrer nofollow" class="source" href="https://www.amazon.com/dp/0143127799?tag=vocabulary01-20"><em>The Sense of Style</em></a></p></li><li><p>The phrase ‘in model’ is extremely rare, but a single sheet published in 1651 is described in its title as a <strong>summary</strong> of Christian doctrine ‘in model’: it is a wall-chart.</p><p><a target="_blank" rel="noopener noreferrer nofollow" class="source" href="https://www.amazon.com/dp/0061759538?tag=vocabulary01-20"><em>The Invention of Science</em></a></p></li><li><p>After all of these experts have examined the statue, we will write a <strong>summary</strong> of their opinions which we will release to the press.</p><p><a target="_blank" rel="noopener noreferrer nofollow" class="source" href="https://www.amazon.com/dp/0689711816?tag=vocabulary01-20"><em>From the Mixed-Up Files of Mrs. Basil E. Frankweiler</em></a></p></li><li><p>She works quickly, efficiently, but stops just short of being <strong>summary</strong>.</p></li></u>`
            }
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={5}>
        <Title size="small" sx={{ opacity: 0.9 }}>
          <Trans i18nKey="detail" />
        </Title>
        <Box
          sx={{
            mt: 1,
            p: 2.5,
            borderRadius: 2,
            background: "white",
          }}
        >
          {data.profileInfos.map((info: any) => {
            return (
              <Box my={1.5}>
                <InfoItem
                  bg="white"
                  info={{
                    ...info,
                    type: info.title === "Subjects" ? "array" : info.type,
                  }}
                />
              </Box>
            );
          })}
          {data?.creation_date && (
            <Box my={1.5}>
              <InfoItem
                bg="white"
                info={{
                  item: formatDate(data?.creation_date),
                  title: t("creationDate"),
                }}
              />
            </Box>
          )}
          {data?.last_update && (
            <Box my={1.5}>
              <InfoItem
                bg="white"
                info={{
                  item: formatDate(data?.last_update),
                  title: t("lastUpdated"),
                }}
              />
            </Box>
          )}
          <Divider sx={{ my: 3 }} />
          <Box mt={1}>
            <Button variant="contained" color="success">
              publish
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ProfileSectionGeneralInfo;
