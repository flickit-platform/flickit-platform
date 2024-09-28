import Box from "@mui/material/Box";
import { Trans, useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  Avatar,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  CancelRounded,
  CheckCircleOutlineRounded,
  EditRounded,
  InfoOutlined,
} from "@mui/icons-material";
import FormProviderWithForm from "../common/FormProviderWithForm";
import RichEditorField from "../common/fields/RichEditorField";
import { ICustomError } from "@/utils/CustomError";
import { useForm } from "react-hook-form";
import { useServiceContext } from "@/providers/ServiceProvider";
import { format } from "date-fns";
import { convertToRelativeTime } from "@/utils/convertToRelativeTime";
import { styles } from "@styles";
import { LoadingButton } from "@mui/lab";
import AIGenerated from "../common/tags/AIGenerated";

export const AssessmentReportNarrator = ({ isWritingAdvice }: any) => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const [aboutSection, setAboutSection] = useState<any>(null);
  const [editable, setEditable] = useState(false);
  const [isAIGenerated, setIsAIGenerated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const fetchAssessment = () => {
    service
      .fetchAdviceNarration({ assessmentId }, {})
      .then((res) => {
        const data = res.data;
        setEditable(data.editable ?? false);
        if (data?.aiNarration?.narration) {
          setIsAIGenerated(true);
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
      alignItems="left"
      justifyContent="left"
      textAlign="left"
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
            data={
              aboutSection?.narration
                ? aboutSection?.narration
                : isWritingAdvice
                  ? `<p>${t("defaultAdviceValue")}</p>`
                  : `<p>${t("defaultAdviceValue")}</p>`
            }
            editable={editable}
            infoQuery={fetchAssessment}
          />
          {aboutSection?.creationTime && (
            <Typography variant="bodyMedium" mx={1}>
              {format(
                new Date(
                  new Date(aboutSection?.creationTime).getTime() -
                    new Date(aboutSection?.creationTime).getTimezoneOffset() *
                      60000,
                ),
                "yyyy/MM/dd HH:mm",
              ) +
                " (" +
                convertToRelativeTime(aboutSection?.creationTime) +
                ")"}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

const OnHoverRichEditor = (props: any) => {
  const { data, editable, infoQuery } = props;
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
    setShow(false);
    setError({});
    setHasError(false);
  };

  const onSubmit = async (data: any, event: any) => {
    event.preventDefault();
    try {
      const { data: res } = await service.updateAdviceNarration(
        { assessmentId, data: { assessorNarration: data.narration } },
        { signal: abortController.current.signal },
      );
      await infoQuery();
      setShow(false);
    } catch (e) {
      const err = e as ICustomError;
      setError(err);
      setHasError(true);
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
                  background: "#1976d299",
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
                  background: "#1976d299",
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
          <Typography dangerouslySetInnerHTML={{ __html: data }} />
          {isHovering && editable && (
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
              <EditRounded sx={{ color: "#fff" }} />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
};
