import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import {
  AssessmentKitInfoType,
  ExpertGroupDetails,
  IAssessmentInsight,
  IAssessmentKitReportModel,
  ISubjectInfo,
  PathInfo,
} from "@types";
import Typography from "@mui/material/Typography";
import { getMaturityLevelColors, styles } from "@styles";
import { Link, useParams } from "react-router-dom";
import formatDate from "@/utils/formatDate";
import ColorfullProgress from "../common/progress/ColorfulProgress";
import { convertToRelativeTime } from "@/utils/convertToRelativeTime";
import {
  Avatar,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
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

export const SubjectInsight = () => {
  const { service } = useServiceContext();
  const { assessmentId = "", subjectId = "" } = useParams();
  const [aboutSection, setAboutSection] = useState<any>(null);
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAssessment = () => {
    service
      .fetchSubjectInsight({ assessmentId, subjectId }, {})
      .then((res) => {
        const data: IAssessmentInsight = res.data;

        const selectedInsight = data.assessorInsight || data.defaultInsight;

        if (selectedInsight) {
          setAboutSection(selectedInsight);
          setEditable(data.editable ?? false);
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
  }, [subjectId, service]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="left"
      justifyContent="left"
      textAlign="left"
      maxHeight="100%"
      gap={0.5}
      ml={3}
    >
      {aboutSection ? (
        <>
          <OnHoverRichEditor
            data={aboutSection.insight}
            editable={editable}
            infoQuery={fetchAssessment}
          />
          {aboutSection?.creationTime && (
            <Typography variant="bodyMedium" mx={1}>
              {format(
                new Date(
                  new Date(aboutSection?.creationTime).getTime() -
                    new Date(aboutSection?.creationTime).getTimezoneOffset() *
                      60000
                ),
                "yyyy/MM/dd HH:mm"
              ) +
                " (" +
                convertToRelativeTime(aboutSection?.creationTime) +
                ")"}
            </Typography>
          )}
          {aboutSection.hasOwnProperty("isValid") && !aboutSection?.isValid && (
            <Box sx={{ ...styles.centerV }} gap={2} my={1}>
              <Box
                sx={{
                  zIndex: 1,
                  display: "flex",
                  justifyContent: "flex-start",
                  ml: { xs: 0.75, sm: 0.75, md: 1 },
                }}
              >
                <Typography
                  variant="labelSmall"
                  sx={{
                    backgroundColor: "#d85e1e",
                    color: "white",
                    padding: "0.35rem 0.35rem",
                    borderRadius: "4px",
                    fontWeight: "bold",
                  }}
                >
                  <Trans i18nKey="Outdated" />
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  backgroundColor: "rgba(255, 249, 196, 0.31)",
                  padding: 1,
                  borderRadius: 2,
                  maxWidth: "100%",
                }}
              >
                <InfoOutlined color="primary" sx={{ marginRight: 1 }} />
                <Typography
                  variant="titleMedium"
                  fontWeight={400}
                  textAlign="left"
                >
                  <Trans i18nKey="invalidInsight" />
                </Typography>
              </Box>
            </Box>
          )}
        </>
      ) : (
        <Typography variant="body2">
          <Trans i18nKey="noInsightAvailable" />{" "}
        </Typography>
      )}
    </Box>
  );
};

const OnHoverRichEditor = (props: any) => {
  const { data, title, editable, infoQuery } = props;
  const abortController = useRef(new AbortController());
  const [isHovering, setIsHovering] = useState(false);
  const [show, setShow] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<any>({});
  const { assessmentId = "", subjectId } = useParams();
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
      const { data: res } = await service.updateSubjectInsight(
        { assessmentId, data: { insight: data.insight }, subjectId },
        { signal: abortController.current.signal }
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
              name="insight"
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
