import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Typography,
  Link as MLink,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import generateRandomColor from "../../utils/generateRandomColor";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../providers/AuthProvider";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import { styles } from "../../config/styles";

interface IExpertGroupsItemProps {
  data: any;
}

const ExpertGroupsItem = (props: IExpertGroupsItemProps) => {
  const { data } = props;
  const { id, name, description = "", picture, website } = data || {};
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
          action={
            <IconButton
              aria-label="settings"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <MoreVertIcon />
            </IconButton>
          }
          title={
            <Box component={"b"} color="GrayText" fontSize=".95rem">
              {name}
            </Box>
          }
          subheader={
            <Box sx={{ ...styles.centerV }}>
              <LanguageRoundedIcon
                fontSize="inherit"
                sx={{ opacity: 0.8, mr: 0.5 }}
              />{" "}
              <MLink
                target="_blank"
                href={website}
                sx={{ textDecoration: "none", fontSize: ".8rem", opacity: 0.9 }}
              >
                {website?.replace("https://", "").replace("http://", "")}
              </MLink>
            </Box>
          }
        />
        <CardContent>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {description}
          </Typography>
        </CardContent>
        <Divider sx={{ mx: 2 }} />
        <CardActions disableSpacing>
          <AvatarGroup
            total={24}
            sx={{ mx: 0.5 }}
            slotProps={{
              additionalAvatar: {
                sx: { width: 28, height: 28, fontSize: ".75rem" },
              },
            }}
          >
            <Avatar
              sx={{ width: 28, height: 28, fontSize: ".8rem" }}
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg"
            />
            <Avatar
              sx={{ width: 28, height: 28, fontSize: ".8rem" }}
              alt="Travis Howard"
              src="/static/images/avatar/2.jpg"
            />
            <Avatar
              sx={{ width: 28, height: 28, fontSize: ".8rem" }}
              alt="Agnes Walker"
              src="/static/images/avatar/4.jpg"
            />
          </AvatarGroup>
        </CardActions>
      </Card>
    </Box>
  );
};

export default ExpertGroupsItem;
function useAuth() {
  throw new Error("Function not implemented.");
}
