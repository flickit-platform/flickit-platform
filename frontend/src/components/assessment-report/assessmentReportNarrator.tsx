import Box from "@mui/material/Box";
import { Trans, useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import CancelRounded from "@mui/icons-material/CancelRounded";
import CheckCircleOutlineRounded from "@mui/icons-material/CheckCircleOutlineRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import FormProviderWithForm from "../common/FormProviderWithForm";
import RichEditorField from "../common/fields/RichEditorField";
import { ICustomError } from "@/utils/CustomError";
import { useForm } from "react-hook-form";
import { useServiceContext } from "@/providers/ServiceProvider";
import { format } from "date-fns";
import { convertToRelativeTime } from "@/utils/convertToRelativeTime";
import AIGenerated from "../common/tags/AIGenerated";
import toastError from "@/utils/toastError";
import { theme } from "@/config/theme";
import formatDate from "@utils/formatDate";

export const AssessmentReportNarrator = ({
  setIsWritingAdvice,
  setEmptyState,
  setAIGenerated,
}: any) => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const [aboutSection, setAboutSection] = useState<any>(null);
  const [editable, setEditable] = useState(false);
  const [isAIGenerated, setIsAIGenerated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const onEditing = (editingMode: boolean) => {
    setIsWritingAdvice(editingMode);
  };
  const fetchAssessment = () => {
    service
      .fetchAdviceNarration({ assessmentId }, {})
      .then((res) => {
        const data = res.data;
        setEditable(data.editable ?? false);
        if (data?.aiNarration?.narration) {
          setIsAIGenerated(true);
          setAIGenerated(true);
        }
        const selectedNarration = data?.aiNarration || data?.assessorNarration;

        if (selectedNarration) {
          setAboutSection(selectedNarration);
        }
      })
      .catch((error) => {
        console.error("Error fetching assessment insight:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAssessment();
  }, [assessmentId, service]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="start"
      justifyContent="start"
      textAlign="start"
      maxHeight="100%"
      gap={0.5}
      py={2}
      sx={{
        background: "#fff",
        boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.25)",
        borderRadius: "12px",
        px: { xs: 2, sm: 3.75 },
        position: "relative",
      }}
    >
      {isAIGenerated && (
        <Box sx={{ position: "absolute", top: -12, right: 8 }}>
          <AIGenerated />
        </Box>
      )}

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <OnHoverRichEditor
            data={aboutSection?.narration ? aboutSection?.narration : ""}
            editable={editable}
            infoQuery={fetchAssessment}
            onEditing={onEditing}
            setEmptyState={setEmptyState}
            setIsAIGenerated={setIsAIGenerated}
            setAIGenerated={setAIGenerated}
          />
          {aboutSection?.creationTime && (
            <Typography variant="bodyMedium" mx={1}>
              {theme.direction == "rtl" ? formatDate(
                  format(
                      new Date(
                          new Date(aboutSection?.creationTime).getTime() -
                          new Date(aboutSection?.creationTime).getTimezoneOffset() *
                          60000,
                      ),
                      "yyyy/MM/dd HH:mm",
                  ), "Shamsi") : formatDate(format(
                      new Date(
                          new Date(aboutSection?.creationTime).getTime() -
                          new Date(aboutSection?.creationTime).getTimezoneOffset() *
                          60000,
                      ),
                      "yyyy/MM/dd HH:mm",
                  )+ " (" +
                  t(convertToRelativeTime(aboutSection?.creationTime)) +
                  ")", "Miladi")}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

const OnHoverRichEditor = (props: any) => {
  const {
    data,
    editable,
    infoQuery,
    onEditing,
    setEmptyState,
    setIsAIGenerated,
    setAIGenerated,
  } = props;
  const abortController = useRef(new AbortController());
  const [isHovering, setIsHovering] = useState(false);
  const [show, setShow] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<any>({});
  const { assessmentId = "" } = useParams();
  const { service } = useServiceContext();
  const formMethods = useForm({ shouldUnregister: true });

  const handleMouseOver = () => {
    editable && setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const handleCancel = () => {
    onEditing(false);
    setShow(false);
    setError({});
    setHasError(false);
  };

  const onSubmit = async (payload: any, event: any) => {
    event.preventDefault();
    try {
      const { data: res } = await service.updateAdviceNarration(
        { assessmentId, data: { assessorNarration: payload.narration } },
        { signal: abortController.current.signal },
      );
      await infoQuery();
      setEmptyState(false);
      onEditing(false);
      setShow(false);
      setIsAIGenerated(false);
      setAIGenerated(false);
    } catch (e) {
      const err = e as ICustomError;
      setError(err);
      setHasError(true);
      toastError(err);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
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
              name="narration"
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
                  background: theme.palette.primary.main,
                  "&:hover": {
                    background: theme.palette.primary.dark,
                  },
                  borderRadius: "3px",
                  height: "36px",
                  marginBottom: "2px",
                }}
                onClick={formMethods.handleSubmit(onSubmit)}
              >
                <CheckCircleOutlineRounded sx={{ color: "#fff" }} />
              </IconButton>
              <IconButton
                edge="end"
                sx={{
                  background: theme.palette.primary.main,
                  "&:hover": {
                    background: theme.palette.primary.dark,
                  },
                  borderRadius: "4px",
                  height: "36px",
                  marginBottom: "2px",
                }}
                onClick={handleCancel}
              >
                <CancelRounded sx={{ color: "#fff" }} />
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
            borderRadius: "4px",
            paddingLeft: theme.direction === "ltr" ? "12px" : "0px",
            paddingRight: theme.direction === "rtl" ? "12px" : "8px",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            "&:hover": {
              border: editable ? "1px solid #1976d299" : "unset",
              borderColor: editable ? theme.palette.primary.main : "unset",
            },
          }}
          onClick={() => {
            setShow(!show);
            onEditing(true);
          }}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          {data ? (
            <Typography dangerouslySetInnerHTML={{ __html: data }} />
          ) : (
            <Typography color="#73808C">
              <Trans i18nKey="writeYourOwnAdvices..." />
            </Typography>
          )}
          {((data === "" && editable) || (isHovering && editable)) && (
            <IconButton
              title="Edit"
              edge="end"
              sx={{
                background: theme.palette.primary.main,
                "&:hover": {
                  background: theme.palette.primary.dark,
                },
                borderRadius: "3px",
                height: "36px",
              }}
              onClick={() => {
                setShow(!show);
                onEditing(true);
              }}
            >
              <EditRounded sx={{ color: "#fff" }} />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
};
