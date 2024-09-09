import { Box, IconButton } from "@mui/material";
import { Trans } from "react-i18next";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import InfoItem from "@common/InfoItem";
import formatDate from "@utils/formatDate";
import { t } from "i18next";
import { ICustomError } from "@utils/CustomError";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import { useParams } from "react-router";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import toastError from "@utils/toastError";
import { toast } from "react-toastify";
import FormProviderWithForm from "@common/FormProviderWithForm";
import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import QueryBatchData from "@common/QueryBatchData";
import RichEditorField from "@common/fields/RichEditorField";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import Tooltip from "@mui/material/Tooltip";
import AutocompleteAsyncField, {
  useConnectAutocompleteField,
} from "@common/fields/AutocompleteAsyncField";
import firstCharDetector from "@/utils/firstCharDetector";
import { keyframes } from "@emotion/react";
import { Link } from "react-router-dom";
import { LoadingSkeleton } from "@common/loadings/LoadingSkeleton";

import { AssessmentKitStatsType, AssessmentKitInfoType } from "@types";

interface IAssessmentKitSectionAuthorInfo {
  setExpertGroup: any;
  setAssessmentKitTitle: any;
}
const AssessmentKitSectionGeneralInfo = (
  props: IAssessmentKitSectionAuthorInfo,
) => {
  const { setExpertGroup, setAssessmentKitTitle } = props;
  const { assessmentKitId } = useParams();
  const { service } = useServiceContext();
  const formMethods = useForm({ shouldUnregister: true });
  const fetchAssessmentKitInfoQuery = useQuery({
    service: (args = { assessmentKitId }, config) =>
      service.fetchAssessmentKitInfo(args, config),
    runOnMount: true,
  });
  const fetchAssessmentKitStatsQuery = useQuery({
    service: (args = { assessmentKitId }, config) =>
      service.fetchAssessmentKitStats(args, config),
    runOnMount: true,
  });
  const publishQuery = useQuery({
    service: (args = { id: assessmentKitId }, config) =>
      service.publishAssessmentKit(args, config),
    runOnMount: false,
    toastError: true,
  });
  const unPublishQuery = useQuery({
    service: (args = { id: assessmentKitId }, config) =>
      service.unPublishAssessmentKit(args, config),
    runOnMount: false,
    toastError: true,
  });
  // const publishAssessmentKit = async () => {
  //   try {
  //     const res = await publishQuery.query();
  //     res.message && toast.success(res.message);
  //     query();
  //   } catch (e) {}
  // };
  // const unPublishAssessmentKit = async () => {
  //   try {
  //     const res = await unPublishQuery.query();
  //     res.message && toast.success(res.message);
  //     query();
  //   } catch (e) {}
  // };

  const abortController = useRef(new AbortController());
  const [show, setShow] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = (editable: boolean) => {
    editable && setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const handleCancel = () => {
    setShow(false);
  };

  const onSubmit = async (data: any, event: any, shouldView?: boolean) => {
    event.preventDefault();
    try {
      const { data: res } = await service.updateAssessmentKitStats(
        {
          assessmentKitId: assessmentKitId || "",
          data: { tags: data?.tags?.map((t: any) => t.id) },
        },
        { signal: abortController.current.signal },
      );

      await fetchAssessmentKitInfoQuery.query();
      await handleCancel();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };
  return (
    <Box>
      <QueryBatchData
        queryBatchData={[
          fetchAssessmentKitInfoQuery,
          fetchAssessmentKitStatsQuery,
        ]}
        loadingComponent={
          <LoadingSkeleton
            width="58%"
            height="360px"
            sx={{ mt: 1, borderRadius: 2 }}
          />
        }
        render={([info, stats]) => {
          const {
            id,
            title,
            summary,
            published,
            isPrivate,
            price,
            about,
            tags,
            editable,
          } = info as AssessmentKitInfoType;
          const {
            creationTime,
            lastModificationTime,
            questionnairesCount,
            attributesCount,
            questionsCount,
            maturityLevelsCount,
            likes,
            assessmentCounts,
            subjects,
            expertGroup,
          } = stats as AssessmentKitStatsType;
          setExpertGroup(expertGroup);
          setAssessmentKitTitle(title);
          return (
            <Grid container spacing={4}>
              <Grid item xs={12} md={7}>
                <Box
                  sx={{
                    mt: 1,
                    p: 2.5,
                    borderRadius: 2,
                    background: "white",
                  }}
                >
                  <OnHoverInput
                    formMethods={formMethods}
                    data={title}
                    title={<Trans i18nKey="title" />}
                    infoQuery={fetchAssessmentKitInfoQuery.query}
                    type="title"
                    editable={editable}
                  />
                  <OnHoverInput
                    formMethods={formMethods}
                    data={summary}
                    title={<Trans i18nKey="summary" />}
                    infoQuery={fetchAssessmentKitInfoQuery.query}
                    type="summary"
                    editable={editable}
                  />
                  <OnHoverStatus
                    data={published}
                    title={<Trans i18nKey="status" />}
                    infoQuery={fetchAssessmentKitInfoQuery.query}
                    editable={editable}
                  />
                  <OnHoverVisibilityStatus
                    data={isPrivate}
                    title={<Trans i18nKey="visibility" />}
                    infoQuery={fetchAssessmentKitInfoQuery.query}
                    editable={editable}
                  />
                  <Box
                    sx={{
                      height: "38px",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      mr={4}
                      sx={{ minWidth: "64px !important" }}
                    >
                      <Trans i18nKey="price" />
                    </Typography>
                    <Typography variant="body2" fontWeight="700" mr={4} ml={1}>
                      FREE
                    </Typography>
                  </Box>
                  {/* <OnHoverAutocompleteAsyncField
                    data={tags}
                    title={<Trans i18nKey="tags" />}
                    infoQuery={fetchAssessmentKitInfoQuery.query}
                    editable ={editable }
                  /> */}

                  <Box
                    my={1.5}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      mr={4}
                      sx={{ minWidth: "64px !important" }}
                    >
                      <Trans i18nKey="tags" />
                    </Typography>
                    {editable && show ? (
                      <FormProviderWithForm formMethods={formMethods}>
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <AutocompleteAsyncField
                            {...useConnectAutocompleteField({
                              service: (args, config) =>
                                service.fetchAssessmentKitTags(args, config),
                            })}
                            name="tags"
                            multiple={true}
                            defaultValue={tags}
                            searchOnType={false}
                            required={true}
                            label={""}
                            editable={true}
                            sx={{ width: "100%" }}
                          />
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                              height: "100%",
                            }}
                          >
                            <IconButton
                              edge="end"
                              sx={{
                                background: "#1976d299",
                                borderRadius: "3px",
                                height: "36px",
                                marginBottom: "2px",
                                marginRight: "3px",
                              }}
                              onClick={formMethods.handleSubmit(onSubmit)}
                            >
                              <CheckCircleOutlineRoundedIcon
                                sx={{ color: "#fff" }}
                              />
                            </IconButton>
                            <IconButton
                              edge="end"
                              sx={{
                                background: "#1976d299",
                                borderRadius: "4px",
                                height: "36px",
                                marginBottom: "2px",
                              }}
                              onClick={handleCancel}
                            >
                              <CancelRoundedIcon sx={{ color: "#fff" }} />
                            </IconButton>
                          </Box>
                        </Box>
                      </FormProviderWithForm>
                    ) : (
                      <Box
                        sx={{
                          height: "38px",
                          borderRadius: "4px",
                          paddingLeft: "8px;",
                          paddingRight: "12px;",
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          "&:hover": {
                            border: editable ? "1px solid #1976d299" : "unset",
                          },
                        }}
                        onClick={() => setShow(!show)}
                        onMouseOver={() => handleMouseOver(editable ?? false)}
                        onMouseOut={handleMouseOut}
                      >
                        <Box sx={{ display: "flex" }}>
                          {tags.map((tag: any, index: number) => {
                            return (
                              <Box
                                sx={{
                                  background: "#00000014",
                                  fontSize: "0.875rem",
                                  borderRadius: "8px",
                                  fontWeight: "700",
                                }}
                                mr={1}
                                px={1}
                              >
                                <Typography variant="body2" fontWeight="700">
                                  {tag.title}
                                </Typography>
                              </Box>
                            );
                          })}
                        </Box>
                        {isHovering && (
                          <IconButton
                            title="Edit"
                            edge="end"
                            sx={{
                              background: "#1976d299",
                              borderRadius: "3px",
                              height: "36px",
                            }}
                            onClick={() => setShow(!show)}
                          >
                            <EditRoundedIcon sx={{ color: "#fff" }} />
                          </IconButton>
                        )}
                      </Box>
                    )}
                  </Box>

                  <OnHoverRichEditor
                    data={about}
                    title={<Trans i18nKey="about" />}
                    infoQuery={fetchAssessmentKitInfoQuery.query}
                    editable={editable}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    mt: 1,
                    p: 2.5,
                    borderRadius: 2,
                    background: "white",
                  }}
                >
                  {creationTime && (
                    <Box my={1.5}>
                      <InfoItem
                        bg="white"
                        info={{
                          item: formatDate(creationTime),
                          title: t("creationDate"),
                        }}
                      />
                    </Box>
                  )}
                  {lastModificationTime && (
                    <Box my={1.5}>
                      <InfoItem
                        bg="white"
                        info={{
                          item: formatDate(lastModificationTime),
                          title: t("lastUpdated"),
                        }}
                      />
                    </Box>
                  )}

                  <Box my={1.5}>
                    <InfoItem
                      bg="white"
                      info={{
                        item: subjects.map((sub: any) => sub?.title),
                        title: t("subjects"),
                        type: "array",
                      }}
                    />
                  </Box>
                  <Box my={1.5}>
                    <InfoItem
                      bg="white"
                      info={{
                        item: questionnairesCount,
                        title: t("questionnairesCount"),
                      }}
                    />
                  </Box>
                  <Box my={1.5}>
                    <InfoItem
                      bg="white"
                      info={{
                        item: attributesCount,
                        title: t("attributesCount"),
                      }}
                    />
                  </Box>
                  <Box my={1.5}>
                    <InfoItem
                      bg="white"
                      info={{
                        item: questionsCount,
                        title: t("totalQuestionsCount"),
                      }}
                    />
                  </Box>
                  <Box my={1.5}>
                    <InfoItem
                      bg="white"
                      info={{
                        item: maturityLevelsCount,
                        title: t("maturitylevels"),
                      }}
                    />
                  </Box>

                  <Box sx={{ display: "flex" }} px={1} mt={4}>
                    <Box sx={{ display: "flex" }} mr={4}>
                      <FavoriteRoundedIcon color="primary" />
                      <Typography color="primary" ml={1}>
                        {likes}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex" }}>
                      <ShoppingCartRoundedIcon color="primary" />
                      <Typography color="primary" ml={1}>
                        {assessmentCounts}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          );
        }}
      />
    </Box>
  );
};
const OnHoverInput = (props: any) => {
  const [show, setShow] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    editable && setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const { data, title, editable, infoQuery, type, formMethods } = props;
  const [hasError, setHasError] = useState<boolean>(false);
  const [error, setError] = useState<any>({});
  const [inputData, setInputData] = useState<string>(data);
  const handleCancel = () => {
    setShow(false);
    setInputData(data);
    setError({});
    setHasError(false);
  };
  const { assessmentKitId } = useParams();
  const { service } = useServiceContext();
  const updateAssessmentKitQuery = useQuery({
    service: (
      args = {
        assessmentKitId: assessmentKitId,
        data: { [type]: inputData },
      },
      config,
    ) => service.updateAssessmentKitStats(args, config),
    runOnMount: false,
    // toastError: true,
  });
  const updateAssessmentKit = async () => {
    try {
      const res = await updateAssessmentKitQuery.query();
      res.message && toast.success(res.message);
      await infoQuery();
    } catch (e) {
      const err = e as ICustomError;
      if (Array.isArray(err.response?.data?.message)) {
        toastError(err.response?.data?.message[0]);
      } else if (
        err.response?.data &&
        err.response?.data.hasOwnProperty("message")
      ) {
        toastError(error);
      }
      setError(err);
      setHasError(true);
    }
  };
  const inputProps: React.HTMLProps<HTMLInputElement> = {
    style: {
      textAlign: firstCharDetector(inputData) ? "right" : "left",
    },
  };

  return (
    <Box>
      <Box
        my={1.5}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        width="100%"
      >
        <Typography variant="body2" mr={4} sx={{ minWidth: "64px !important" }}>
          {title}
        </Typography>

        {editable && show ? (
          <Box
            sx={{ display: "flex", flexDirection: "column", width: "100% " }}
          >
            <OutlinedInput
              inputProps={inputProps}
              error={hasError}
              fullWidth
              name={title}
              defaultValue={data || ""}
              onChange={(e) => setInputData(e.target.value)}
              value={inputData}
              required={true}
              multiline={true}
              sx={{
                minHeight: "38px",
                borderRadius: "4px",
                paddingRight: "12px;",
                fontWeight: "700",
                fontSize: "0.875rem",
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    title="Submit Edit"
                    edge="end"
                    sx={{
                      background: "#1976d299",
                      borderRadius: "3px",
                      height: "36px",
                      margin: "3px",
                    }}
                    onClick={updateAssessmentKit}
                  >
                    <CheckCircleOutlineRoundedIcon sx={{ color: "#fff" }} />
                  </IconButton>
                  <IconButton
                    title="Cancel Edit"
                    edge="end"
                    sx={{
                      background: "#1976d299",
                      borderRadius: "4px",
                      height: "36px",
                    }}
                    onClick={handleCancel}
                  >
                    <CancelRoundedIcon sx={{ color: "#fff" }} />
                  </IconButton>
                </InputAdornment>
              }
            />
            {hasError && (
              <Typography color="#ba000d" variant="caption">
                {error?.data?.[type]}
              </Typography>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              minHeight: "38px",
              borderRadius: "4px",
              paddingLeft: "8px;",
              paddingRight: "12px;",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              wordBreak: "break-word",
              "&:hover": {
                border: editable ? "1px solid #1976d299" : "unset",
              },
            }}
            onClick={() => setShow(!show)}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <Typography variant="body2" fontWeight="700">
              {data.replace(/<\/?p>/g, "")}
            </Typography>
            {isHovering && (
              <IconButton
                title="Edit"
                edge="end"
                sx={{
                  background: "#1976d299",
                  borderRadius: "3px",
                  height: "36px",
                }}
                onClick={() => setShow(!show)}
              >
                <EditRoundedIcon sx={{ color: "#fff" }} />
              </IconButton>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

const OnHoverStatus = (props: any) => {
  const { data, title, infoQuery, editable } = props;
  const { assessmentKitId } = useParams();
  const { service } = useServiceContext();
  const [selected, setSelected] = useState<boolean>(data);
  const handleToggle = async (status: boolean) => {
    if (editable) {
      setSelected(status);
      if (status !== data) {
        await updateAssessmentKit();
      }
    }
  };
  const updateAssessmentKitQuery = useQuery({
    service: (
      args = {
        assessmentKitId: assessmentKitId,
        data: { published: data ? false : true },
      },
      config,
    ) => service.updateAssessmentKitStats(args, config),
    runOnMount: false,
    toastError: true,
  });
  const updateAssessmentKit = async () => {
    try {
      const res = await updateAssessmentKitQuery.query();
      res.message && toast.success(res.message);
      await infoQuery();
    } catch (e) {}
  };
  return (
    <Box>
      <Box
        my={1.5}
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" mr={4} sx={{ minWidth: "64px !important" }}>
          {title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            background: "#00000014",
            borderRadius: "8px",
            justifyContent: "space-between",
            width: "fit-content",
            p: "2px",
            gap: "4px  ",
            ml: 0.5,
          }}
        >
          <Box
            onClick={() => handleToggle(true)}
            sx={{
              padding: 0.5,
              backgroundColor: selected ? "#2e7d32" : "transparent",
              color: selected ? "#fff" : "#000",
              cursor: editable ? "pointer" : "default",
              transition: "background-color 0.3s ease",
              animation: `${fadeIn} 0.5s ease`,
              borderRadius: "6px",
              width: "100px",
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              fontWeight="700"
              textTransform={"uppercase"}
              sx={{ userSelect: "none" }}
              fontSize="0.75rem"
            >
              <Trans i18nKey="published" />
            </Typography>
          </Box>
          <Box
            onClick={() => handleToggle(false)}
            sx={{
              padding: 0.5,
              backgroundColor: !selected ? "gray" : "transparent",
              cursor: editable ? "pointer" : "default",
              transition: "background-color 0.3s ease",
              animation: `${fadeIn} 0.5s ease`,
              borderRadius: "6px",
              color: !selected ? "#fff" : "#000",
              width: "100px",
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              fontWeight="700"
              textTransform={"uppercase"}
              sx={{ userSelect: "none" }}
              fontSize=".75rem"
            >
              <Trans i18nKey="unpublished" />
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
const OnHoverVisibilityStatus = (props: any) => {
  const { data, title, infoQuery, editable } = props;
  const { assessmentKitId, expertGroupId } = useParams();
  const { service } = useServiceContext();
  const [selected, setSelected] = useState<boolean>(data);
  const handleToggle = (status: boolean) => {
    if (editable) {
      setSelected(status);
      if (status !== data) updateAssessmentKit();
    }
  };
  const updateAssessmentKitQuery = useQuery({
    service: (
      args = {
        assessmentKitId: assessmentKitId,
        data: { isPrivate: data ? false : true },
      },
      config,
    ) => service.updateAssessmentKitStats(args, config),
    runOnMount: false,
    toastError: true,
  });
  const updateAssessmentKit = async () => {
    try {
      const res = await updateAssessmentKitQuery.query();
      res.message && toast.success(res.message);
      await infoQuery();
    } catch (e) {}
  };
  return (
    <Box>
      <Box
        my={1.5}
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" mr={4} sx={{ minWidth: "64px !important" }}>
          {title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            // justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              background: "#00000014",
              borderRadius: "8px",
              justifyContent: "space-between",
              width: "fit-content",
              p: "2px",
              gap: "4px  ",
              ml: 0.5,
            }}
          >
            <Box
              onClick={() => handleToggle(true)}
              sx={{
                padding: 0.5,
                backgroundColor: selected ? "#7954B3;" : "transparent",
                color: selected ? "#fff" : "#000",
                cursor: editable ? "pointer" : "default",
                transition: "background-color 0.3s ease",
                animation: `${fadeIn} 0.5s ease`,
                borderRadius: "6px",
                width: "100px",
                textAlign: "center",
              }}
            >
              <Typography
                variant="body2"
                fontWeight="700"
                textTransform={"uppercase"}
                sx={{ userSelect: "none" }}
                fontSize=".75rem"
              >
                <Trans i18nKey="private" />
              </Typography>
            </Box>
            <Box
              onClick={() => handleToggle(false)}
              sx={{
                padding: 0.5,
                backgroundColor: !selected ? "gray" : "transparent",
                cursor: editable ? "pointer" : "default",
                transition: "background-color 0.3s ease",
                animation: `${fadeIn} 0.5s ease`,
                borderRadius: "6px",
                color: !selected ? "#fff" : "#000",
                width: "100px",
                textAlign: "center",
              }}
            >
              <Typography
                variant="body2"
                fontWeight="700"
                textTransform={"uppercase"}
                sx={{ userSelect: "none" }}
                fontSize=".75rem"
              >
                <Trans i18nKey="public" />
              </Typography>
            </Box>
          </Box>
          {editable && selected && (
            <Box sx={{ ml: 1 }}>
              <Tooltip title={<Trans i18nKey="managePermissions" />}>
                <IconButton
                  sx={{ width: "20px", height: "20px" }}
                  color="primary"
                  component={Link}
                  to={`/user/expert-groups/${expertGroupId}/assessment-kits/${assessmentKitId}/permissions`}
                >
                  <SettingsRoundedIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
const OnHoverRichEditor = (props: any) => {
  const abortController = useRef(new AbortController());
  const [show, setShow] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    editable && setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const { data, title, infoQuery, editable } = props;
  const [titleText, setTitleText] = useState<string>(data);
  const [hasError, setHasError] = useState<boolean>(false);
  const [error, setError] = useState<any>({});
  const handleCancel = () => {
    setShow(false);
    setTitleText(data);
    setError({});
    setHasError(false);
  };
  const { assessmentKitId } = useParams();
  const { service } = useServiceContext();
  const formMethods = useForm({ shouldUnregister: true });
  const onSubmit = async (data: any, event: any, shouldView?: boolean) => {
    event.preventDefault();
    try {
      const { data: res } = await service.updateAssessmentKitStats(
        { assessmentKitId: assessmentKitId || "", data: { about: data.about } },
        { signal: abortController.current.signal },
      );
      await infoQuery();
      await setShow(false);
    } catch (e) {
      const err = e as ICustomError;
      setError(err);
      setHasError(true);
    }
  };
  return (
    <Box>
      <Box
        my={1.5}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" mr={4} sx={{ minWidth: "64px !important" }}>
          {title}
        </Typography>
        {editable && show ? (
          <FormProviderWithForm formMethods={formMethods}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <RichEditorField
                name="about"
                label={<Box></Box>}
                disable_label={true}
                required={true}
                defaultValue={data || ""}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <IconButton
                  edge="end"
                  sx={{
                    background: "#1976d299",
                    borderRadius: "3px",
                    height: "36px",
                    marginBottom: "2px",
                  }}
                  onClick={formMethods.handleSubmit(onSubmit)}
                >
                  <CheckCircleOutlineRoundedIcon sx={{ color: "#fff" }} />
                </IconButton>
                <IconButton
                  edge="end"
                  sx={{
                    background: "#1976d299",
                    borderRadius: "4px",
                    height: "36px",
                    marginBottom: "2px",
                  }}
                  onClick={handleCancel}
                >
                  <CancelRoundedIcon sx={{ color: "#fff" }} />
                </IconButton>
              </Box>
              {hasError && (
                <Typography color="#ba000d" variant="caption">
                  {error?.data?.about}
                </Typography>
              )}
            </Box>
          </FormProviderWithForm>
        ) : (
          <Box
            sx={{
              // height: "38px",
              borderRadius: "4px",
              paddingLeft: "8px;",
              paddingRight: "12px;",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              "&:hover": {
                border: editable ? "1px solid #1976d299" : "unset",
              },
            }}
            onClick={() => setShow(!show)}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <Typography
              variant="body2"
              fontWeight="700"
              dangerouslySetInnerHTML={{ __html: data }}
            />
            {isHovering && (
              <IconButton
                title="Edit"
                edge="end"
                sx={{
                  background: "#1976d299",
                  borderRadius: "3px",
                  height: "36px",
                }}
                onClick={() => setShow(!show)}
              >
                <EditRoundedIcon sx={{ color: "#fff" }} />
              </IconButton>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
const OnHoverAutocompleteAsyncField = (props: any) => {
  const abortController = useRef(new AbortController());
  const [show, setShow] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    editable && setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const { data, title, infoQuery, editable } = props;
  const [titleText, setTitleText] = useState<string>(data);
  const handleCancel = () => {
    setShow(false);
    setTitleText(data);
  };
  const { assessmentKitId } = useParams();
  const { service } = useServiceContext();
  const formMethods = useForm({ shouldUnregister: true });
  const onSubmit = async (data: any, event: any, shouldView?: boolean) => {
    event.preventDefault();
    try {
      const { data: res } = await service.updateAssessmentKitStats(
        { assessmentKitId: assessmentKitId || "", data: { tags: data.about } },
        { signal: abortController.current.signal },
      );
      if (res) {
        handleCancel();
        infoQuery();
      }
    } catch {}
  };
  const display = false;

  return (
    <Box>
      <Box
        my={1.5}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" mr={4}>
          {title}
        </Typography>
        {editable && show ? (
          <FormProviderWithForm formMethods={formMethods}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <AutocompleteAsyncField
                {...useConnectAutocompleteField({
                  service: (args, config) =>
                    service.fetchAssessmentKitTags(args, config),
                })}
                name="tags"
                multiple={true}
                defaultValue={data}
                searchOnType={false}
                label={""}
                sx={{ width: "100%" }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <IconButton
                  edge="end"
                  sx={{
                    background: "#1976d299",
                    borderRadius: "3px",
                    height: "36px",
                    marginBottom: "2px",
                    marginRight: "3px",
                  }}
                  onClick={formMethods.handleSubmit(onSubmit)}
                >
                  <CheckCircleOutlineRoundedIcon sx={{ color: "#fff" }} />
                </IconButton>
                <IconButton
                  edge="end"
                  sx={{
                    background: "#1976d299",
                    borderRadius: "4px",
                    height: "36px",
                    marginBottom: "2px",
                  }}
                  onClick={handleCancel}
                >
                  <CancelRoundedIcon sx={{ color: "#fff" }} />
                </IconButton>
              </Box>
            </Box>
          </FormProviderWithForm>
        ) : (
          <Box
            sx={{
              height: "38px",
              borderRadius: "4px",
              paddingLeft: "8px;",
              paddingRight: "12px;",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              "&:hover": {
                border: editable ? "1px solid #1976d299" : "unset",
              },
            }}
            onClick={() => setShow(!show)}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <Box sx={{ display: "flex" }}>
              {data.map((tag: any, index: number) => {
                return (
                  <Box
                    sx={{
                      background: "#00000014",
                      fontSize: "0.875rem",
                      borderRadius: "8px",
                      fontWeight: "700",
                    }}
                    mr={1}
                    px={1}
                  >
                    <Typography variant="body2" fontWeight="700">
                      {tag.title}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            {isHovering && (
              <IconButton
                title="Edit"
                edge="end"
                sx={{
                  background: "#1976d299",
                  borderRadius: "3px",
                  height: "36px",
                }}
                onClick={() => setShow(!show)}
              >
                <EditRoundedIcon sx={{ color: "#fff" }} />
              </IconButton>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default AssessmentKitSectionGeneralInfo;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
