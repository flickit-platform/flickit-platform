import { useRef } from "react";
import {
  Box,
  Divider,
  InputAdornment,
  Link as MLink,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Title from "@common/Title";
import { useServiceContext } from "@providers/ServiceProvider";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import QueryData from "@common/QueryData";
import { Trans } from "react-i18next";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import SupTitleBreadcrumb from "@common/SupTitleBreadcrumb";
import { t } from "i18next";
import setDocumentTitle from "@utils/setDocumentTitle";
import toastError from "@utils/toastError";
import { ICustomError } from "@utils/CustomError";

const AssessmentKitPermissionsContainer = () => {
  const { service } = useServiceContext();
  const { assessmentKitId } = useParams();
  const assessmentKitUsersListQueryData = useQuery({
    service: (args = { assessmentKitId: assessmentKitId }, config) =>
      service.assessmentKitUsersList(args, config),
  });

  return (
    <QueryData
      {...assessmentKitUsersListQueryData}
      render={(data) => {
        // setDocumentTitle(`${t("assessmentKit")}: ${data.title || ""}`);
        return (
          <AssessmentKitPermisson
            data={data}
            query={assessmentKitUsersListQueryData.query}
          />
        );
      }}
    />
  );
};

const AssessmentKitPermisson = (props: any) => {
  const { data, query } = props;
  const { items } = data;
  const { service } = useServiceContext();
  const queryData = useQuery({
    service: (args = { id: "expertGroupId" }, config) =>
      service.fetchUserExpertGroup(args, config),
    runOnMount: false,
  });

  return (
    <Box>
      {/* <Title
        inPageLink="assessmentKitPermissons"
        size="small"
        sup={
          <SupTitleBreadcrumb
            routes={[
              {
                title: t("expertGroups") as string,
                to: `/user/expert-groups`,
              },
              {
                title: expertGroup.title,
                to: `/user/expert-groups/${expertGroup.id} `,
              },
              {
                title: kit.title,
                to: `/user/expert-groups/${expertGroup.id}/assessment-kits/${kit.id}`,
              },
              {
                title: "permissions",
                to: `/user/expert-groups/${expertGroup.id}/assessment-kits/${kit.id}/permissions`,
              },
            ]}
          />
        }
      >
        <Trans i18nKey={"assessmentKitPermissons"} />
      </Title> */}
      <Box mt={2} p={3} sx={{ borderRadius: 2, background: "white" }}>
        <Box>
          <Title
            size="small"
            mb={2}
            titleProps={{
              fontSize: "1rem",
              fontFamily: "Roboto",
              textTransform: "unset",
              letterSpacing: ".05rem",
            }}
          >
            <Trans i18nKey="addNewUser" />
          </Title>
          <AddMember queryData={queryData} />
        </Box>
        <Box>
          <Title
            size="small"
            mb={2}
            titleProps={{
              fontSize: "1rem",
              fontFamily: "Roboto",
              textTransform: "unset",
              letterSpacing: ".05rem",
            }}
          >
            <Trans i18nKey="users" />
          </Title>
          <Box>
            {items.map((user: any, index: number) => {
              return (
                <Box key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 1,
                    }}
                  >
                    <Box sx={{ display: "flex" }}>
                      <Box mr={8}>{user?.name}</Box>
                      <Box>{user?.email}</Box>
                    </Box>
                    <Box
                      sx={{
                        background: "#862123",
                        py: 0.5,
                        px: 1,
                        borderRadius: "4px",
                        color: "#fff",
                      }}
                    >
                      <Typography variant="button">
                        <Trans i18nKey="remove" />
                      </Typography>
                    </Box>
                  </Box>
                  <Divider />
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
const AddMember = (props: any) => {
  const { queryData } = props;
  const { query } = queryData;
  const inputRef = useRef<HTMLInputElement>(null);
  const { service } = useServiceContext();
  const { expertGroupId } = useParams();
  const addMemberQueryData = useQuery({
    service: (args, config) => service.addMemberToExpertGroup(args, config),
    runOnMount: false,
  });

  const addMember = async () => {
    try {
      // const res = await addMemberQueryData.query({
      //   id: expertGroupId,
      //   email: inputRef.current?.value,
      // });
      // res?.message && toast.success(res.message);
      // query();
    } catch (e) {
      const error = e as ICustomError;
      if ("message" in error.data || {}) {
        if (Array.isArray(error.data.message)) {
          toastError(error.data?.message[0]);
        } else if (error.data?.message) {
          toastError(error.data?.message);
        }
      }
    }
  };

  return (
    <Box
      component="form"
      sx={{ mb: 2, mt: 0 }}
      onSubmit={(e) => {
        e.preventDefault();
        if (!inputRef.current?.value) {
          toastError(t("pleaseEnterEmailAddress") as string);
        } else addMember();
      }}
    >
      <TextField
        fullWidth
        type={"email"}
        size="small"
        variant="outlined"
        inputRef={inputRef}
        placeholder={t("enterEmailOfTheUserYouWantToAdd") as string}
        label={<Trans i18nKey="userEmail" />}
        InputProps={{
          endAdornment: (
            <AddMemberButton loading={addMemberQueryData.loading} />
          ),
        }}
      />
    </Box>
  );
};
const AddMemberButton = ({ loading }: { loading: boolean }) => {
  return (
    <InputAdornment position="end">
      <LoadingButton
        sx={{
          mr: "-10px",
          minWidth: "10px",
          p: 0.5,
        }}
        loading={loading}
        type="submit"
        variant="contained"
        size="small"
      >
        <AddRoundedIcon fontSize="small" />
      </LoadingButton>
    </InputAdornment>
  );
};

export default AssessmentKitPermissionsContainer;
