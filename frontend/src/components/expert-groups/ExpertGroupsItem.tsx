import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Link as MLink,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import generateRandomColor from "../../utils/generateRandomColor";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../providers/AuthProvider";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import { styles } from "../../config/styles";
import RichEditor from "../shared/rich-editor/RichEditor";
import useMenu from "../../utils/useMenu";
import MoreActions from "../shared/MoreActions";
import { useQueryDataContext } from "../shared/QueryData";
import { useServiceContext } from "../../providers/ServiceProvider";
import { useQuery } from "../../utils/useQuery";
import { Trans } from "react-i18next";
import useDialog from "../../utils/useDialog";
import ExpertGroupCEFormDialog from "./ExpertGroupCEFormDialog";

interface IExpertGroupsItemProps {
  data: any;
}

const ExpertGroupsItem = (props: IExpertGroupsItemProps) => {
  const { data } = props;
  const {
    id,
    name,
    description = "",
    picture,
    website,
    about = "",
    users = [],
    number_of_profiles,
  } = data || {};
  const { userInfo } = useAuthContext();
  const { username } = userInfo || {};

  return (
    <Box>
      <Card>
        <CardHeader
          titleTypographyProps={{
            component: Link,
            to: `${id}`,
            sx: { textDecoration: "none" },
          }}
          avatar={
            <Avatar
              component={Link}
              to={`${id}`}
              sx={(() => {
                const randomColor = generateRandomColor();
                return {
                  bgcolor: randomColor,
                  color: (t) => t.palette.getContrastText(randomColor),
                  textDecoration: "none",
                };
              })()}
              src={picture}
            >
              {name?.[0]?.toUpperCase()}
            </Avatar>
          }
          action={<Actions expertGroup={data} />}
          title={
            <Box component={"b"} color="GrayText" fontSize=".95rem">
              {name}
            </Box>
          }
          subheader={
            <Box sx={{ ...styles.centerV, textTransform: "lowercase" }}>
              {number_of_profiles} <Trans i18nKey="profiles" />
            </Box>
          }
        />
        <CardContent>{about}</CardContent>
        <Divider sx={{ mx: 2 }} />
        <CardActions disableSpacing>
          <AvatarGroup
            total={users.length}
            max={5}
            sx={{ mx: 0.5 }}
            slotProps={{
              additionalAvatar: {
                sx: { width: 28, height: 28, fontSize: ".75rem" },
              },
            }}
          >
            {users.map((user: any) => {
              return (
                <Avatar
                  key={user.id}
                  sx={{ width: 28, height: 28, fontSize: ".8rem" }}
                  alt={user.username}
                  title={user.username}
                  src="/"
                />
              );
            })}
          </AvatarGroup>
        </CardActions>
      </Card>
    </Box>
  );
};

const Actions = (props: any) => {
  const { expertGroup } = props;
  const { query: fetchExpertGroups } = useQueryDataContext();
  const { service } = useServiceContext();
  const { id } = expertGroup;
  const { query: fetchExpertGroup, loading } = useQuery({
    service: (args = { id }, config) =>
      service.fetchUserExpertGroup(args, config),
    runOnMount: false,
  });
  const dialogProps = useDialog();

  const openEditDialog = async (e: any) => {
    const data = await fetchExpertGroup();
    dialogProps.openDialog({
      data,
      type: "update",
    });
  };

  return (
    <>
      <MoreActions
        {...useMenu()}
        boxProps={{ ml: 0.2 }}
        loading={loading}
        items={[
          {
            icon: <EditRoundedIcon fontSize="small" />,
            text: <Trans i18nKey="edit" />,
            onClick: openEditDialog,
          },
        ]}
      />
      <ExpertGroupCEFormDialog
        {...dialogProps}
        onSubmitForm={fetchExpertGroups}
      />
    </>
  );
};

export default ExpertGroupsItem;
