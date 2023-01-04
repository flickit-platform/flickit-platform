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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import generateRandomColor from "../../utils/generateRandomColor";
import { Link } from "react-router-dom";

interface IExpertGroupsItemProps {
  data: any;
}

const ExpertGroupsItem = (props: IExpertGroupsItemProps) => {
  const { data } = props;

  return (
    <Box>
      <Card>
        <CardHeader
          titleTypographyProps={{
            component: Link,
            to: "/account/erfan/expertGroup",
            sx: { textDecoration: "none" },
          }}
          avatar={
            <Avatar
              component={Link}
              to="/account/erfan/expertGroup"
              sx={(() => {
                const randomColor = generateRandomColor();
                return {
                  bgcolor: randomColor,
                  color: (t) => t.palette.getContrastText(randomColor),
                  textDecoration: "none",
                };
              })()}
            >
              {data.title[0]?.toUpperCase()}
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
          title={data.title}
          subheader="September 14, 2016"
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
            This impressive paella is a perfect party dish and a fun meal to
            cook together with your guests. Add 1 cup of frozen peas along with
            the mussels, if you like.
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
