import { Box, Button, Chip, Divider, IconButton } from "@mui/material";
import { Trans } from "react-i18next";
import { styles, getMaturityLevelColors } from "@styles";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import InfoItem from "@common/InfoItem";
import formatDate from "@utils/formatDate";
import { t } from "i18next";
import Title from "@common/Title";
import toastError from "@utils/toastError";
import { ICustomError } from "@utils/CustomError";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import { TQueryFunction } from "@types";
import { useParams } from "react-router";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import PublishedWithChangesRoundedIcon from "@mui/icons-material/PublishedWithChangesRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { toast } from "react-toastify";
import FormProviderWithForm from "@common/FormProviderWithForm";
import { InputFieldUC } from "@common/fields/InputField";
import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import QueryBatchData from "@common/QueryBatchData";
import RichEditorField from "@common/fields/RichEditorField";
import setServerFieldErrors from "@utils/setServerFieldError";
import TextField, { OutlinedTextFieldProps } from "@mui/material/TextField";
import AutocompleteAsyncField, {
  useConnectAutocompleteField,
} from "@common/fields/AutocompleteAsyncField";
import RichEditor from "@common/rich-editor/RichEditor";
interface IAssessmentKitSectionAuthorInfo {
  setExpertGroup: any;
  setAssessmentKitTitle: any;
}
const AssessmentKitSectionGeneralInfo = (
  props: IAssessmentKitSectionAuthorInfo
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
  const handleMouseOver = (current_user_is_coordinator: boolean) => {
    current_user_is_coordinator && setIsHovering(true);
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
        { signal: abortController.current.signal }
      );
      if (res) {
        fetchAssessmentKitInfoQuery.query();
      }
    } catch {}
  };
  return (
    <>
      <QueryBatchData
        queryBatchData={[
          fetchAssessmentKitInfoQuery,
          fetchAssessmentKitStatsQuery,
        ]}
        render={([info = {}, stats = {}]) => {
          setExpertGroup(stats?.expert_group);
          setAssessmentKitTitle(info?.title);
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
                    data={info?.title}
                    title={<Trans i18nKey="title" />}
                    infoQuery={fetchAssessmentKitInfoQuery.query}
                    type="title"
                    current_user_is_coordinator={
                      info?.current_user_is_coordinator
                    }
                  />
                  <OnHoverInput
                    formMethods={formMethods}
                    data={info?.summary}
                    title={<Trans i18nKey="summary" />}
                    infoQuery={fetchAssessmentKitInfoQuery.query}
                    type="summary"
                    current_user_is_coordinator={
                      info?.current_user_is_coordinator
                    }
                  />
                  <OnHoverStatus
                    data={info?.is_active}
                    title={<Trans i18nKey="status" />}
                    infoQuery={fetchAssessmentKitInfoQuery.query}
                    current_user_is_coordinator={
                      info?.current_user_is_coordinator
                    }
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
                    data={info?.tags}
                    title={<Trans i18nKey="tags" />}
                    infoQuery={fetchAssessmentKitInfoQuery.query}
                    current_user_is_coordinator={current_user_is_coordinator}
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
                    {info?.current_user_is_coordinator && show ? (
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
                            defaultValue={info?.tags}
                            searchOnType={false}
                            required={true}
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
                          "&:hover": { border: "1px solid #1976d299" },
                        }}
                        onClick={() => setShow(!show)}
                        onMouseOver={() =>
                          handleMouseOver(info?.current_user_is_coordinator)
                        }
                        onMouseOut={handleMouseOut}
                      >
                        <Box sx={{ display: "flex" }}>
                          {info?.tags.map((tag: any, index: number) => {
                            return (
                              <Box
                                sx={{
                                  background: "#00000014",
                                  fontFamily: "Roboto",
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
                    data={info?.about}
                    title={<Trans i18nKey="about" />}
                    infoQuery={fetchAssessmentKitInfoQuery.query}
                    current_user_is_coordinator={
                      info?.current_user_is_coordinator
                    }
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
                  {stats?.creation_time && (
                    <Box my={1.5}>
                      <InfoItem
                        bg="white"
                        info={{
                          item: formatDate(stats?.creation_time),
                          title: t("creationDate"),
                        }}
                      />
                    </Box>
                  )}
                  {stats?.last_update_time && (
                    <Box my={1.5}>
                      <InfoItem
                        bg="white"
                        info={{
                          item: formatDate(stats?.last_update_time),
                          title: t("lastUpdated"),
                        }}
                      />
                    </Box>
                  )}

                  <Box my={1.5}>
                    <InfoItem
                      bg="white"
                      info={{
                        item: stats?.subjects.map((sub: any) => sub?.title),
                        title: t("subjects"),
                        type: "array",
                      }}
                    />
                  </Box>
                  <Box my={1.5}>
                    <InfoItem
                      bg="white"
                      info={{
                        item: stats?.questionnaires_count,
                        title: t("questionnairesCount"),
                      }}
                    />
                  </Box>
                  <Box my={1.5}>
                    <InfoItem
                      bg="white"
                      info={{
                        item: stats?.attributes_count,
                        title: t("attributesCount"),
                      }}
                    />
                  </Box>
                  <Box my={1.5}>
                    <InfoItem
                      bg="white"
                      info={{
                        item: stats?.questions_count,
                        title: t("totalQuestionsCount"),
                      }}
                    />
                  </Box>
                  <Box my={1.5}>
                    <InfoItem
                      bg="white"
                      info={{
                        item: stats?.maturity_levels_count,
                        title: t("maturitylevels"),
                      }}
                    />
                  </Box>

                  <Box sx={{ display: "flex" }} px={1} mt={4}>
                    <Box sx={{ display: "flex" }} mr={4}>
                      <FavoriteRoundedIcon color="primary" />
                      <Typography color="primary" ml={1}>
                        {stats?.likes_count}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex" }}>
                      <ShoppingCartRoundedIcon color="primary" />
                      <Typography color="primary" ml={1}>
                        {stats?.assessments_count}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          );
        }}
      />
    </>
  );
};
const OnHoverInput = (props: any) => {
  const [show, setShow] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    current_user_is_coordinator && setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const {
    data,
    title,
    current_user_is_coordinator,
    infoQuery,
    type,
    formMethods,
  } = props;
  const [has_error, setHasError] = useState<boolean>(false);
  const [error, setError] = useState<any>({});
  const [inputData, setInputData] = useState<String>(data);
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
      config
    ) => service.updateAssessmentKitStats(args, config),
    runOnMount: false,
    toastError: true,
  });
  const updateAssessmentKit = async () => {
    try {
      const res = await updateAssessmentKitQuery.query();
      res.message && toast.success(res.message);
      await infoQuery();
    } catch (e) {
      const err = e as ICustomError;
      setError(err);
      setHasError(true);
    }
  };
  return (
    <>
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

        {current_user_is_coordinator && show ? (
          <Box
            sx={{ display: "flex", flexDirection: "column", width: "100% " }}
          >
            <OutlinedInput
              error={has_error}
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
                fontFamily: "Roboto",
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
            {has_error && (
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
              "&:hover": { border: "1px solid #1976d299" },
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
    </>
  );
};

const OnHoverStatus = (props: any) => {
  const [show, setShow] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    current_user_is_coordinator && setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const { data, title, infoQuery, current_user_is_coordinator } = props;
  const { assessmentKitId } = useParams();
  const { service } = useServiceContext();
  const updateAssessmentKitQuery = useQuery({
    service: (
      args = {
        assessmentKitId: assessmentKitId,
        data: { is_active: data ? false : true },
      },
      config
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
    <>
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
            "&:hover": { border: "1px solid #1976d299" },
          }}
          onClick={() => setShow(!show)}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          // #00000014
        >
          {data ? (
            <Box
              sx={{
                background: "#2e7d32",
                fontFamily: "Roboto",
                fontSize: "0.875rem",
                borderRadius: "8px",
                color: "#fff",
                fontWeight: "700",
              }}
              px={1}
            >
              <Trans i18nKey="published" />
            </Box>
          ) : (
            <Box
              sx={{
                background: "#00000014",
                fontFamily: "Roboto",
                fontSize: "0.875rem",
                borderRadius: "8px",
                fontWeight: "700",
              }}
              px={1}
            >
              <Trans i18nKey="unpublished" />
            </Box>
          )}
          {isHovering && (
            <IconButton
              aria-label="toggle password visibility"
              edge="end"
              sx={{
                background: "#1976d299",
                borderRadius: "3px",
                height: "36px",
              }}
              title={data ? "Archive" : "Publish"}
              onClick={updateAssessmentKit}
            >
              {data ? (
                <ArchiveRoundedIcon sx={{ color: "#fff" }} />
              ) : (
                <PublishedWithChangesRoundedIcon sx={{ color: "#fff" }} />
              )}
            </IconButton>
          )}
        </Box>
      </Box>
    </>
  );
};

const OnHoverRichEditor = (props: any) => {
  const abortController = useRef(new AbortController());
  const [show, setShow] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    current_user_is_coordinator && setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const { data, title, infoQuery, current_user_is_coordinator } = props;
  const [titleText, setTitleText] = useState<String>(data);
  const [has_error, setHasError] = useState<boolean>(false);
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
        { signal: abortController.current.signal }
      );
      if (res) {
        infoQuery();
      }
    } catch (e) {
      const err = e as ICustomError;
      setError(err);
      setHasError(true);
    }
  };
  return (
    <>
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
        {current_user_is_coordinator && show ? (
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
                label={<></>}
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
              {has_error && (
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
              "&:hover": { border: "1px solid #1976d299" },
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
    </>
  );
};
const OnHoverAutocompleteAsyncField = (props: any) => {
  const abortController = useRef(new AbortController());
  const [show, setShow] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    current_user_is_coordinator && setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const { data, title, infoQuery, current_user_is_coordinator } = props;
  const [titleText, setTitleText] = useState<String>(data);
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
        { signal: abortController.current.signal }
      );
      if (res) {
        handleCancel();
        infoQuery();
      }
    } catch {}
  };
  const display = false;

  return (
    <>
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
        {current_user_is_coordinator && show ? (
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
              "&:hover": { border: "1px solid #1976d299" },
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
                      fontFamily: "Roboto",
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
    </>
  );
};
export default AssessmentKitSectionGeneralInfo;
