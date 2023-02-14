import { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Title from "@shared/Title";
import ProfilesListContainer from "./ProfilesListContainer";

const ProfilesContainer = (props: PropsWithChildren<{}>) => {
  return (
    <Box>
      <Title>
        <Trans i18nKey="profiles" />
      </Title>

      <Box mt={2}>
        <ProfilesListContainer />
      </Box>
    </Box>
  );
};

export default ProfilesContainer;
