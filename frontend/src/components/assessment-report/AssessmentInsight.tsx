import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import CancelRounded from "@mui/icons-material/CancelRounded";
import CheckCircleOutlineRounded from "@mui/icons-material/CheckCircleOutlineRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import FormProviderWithForm from "../common/FormProviderWithForm";
import RichEditorField from "../common/fields/RichEditorField";
import { ICustomError } from "@/utils/CustomError";
import { useForm } from "react-hook-form";
import { useServiceContext } from "@/providers/ServiceProvider";
import { format } from "date-fns";
import { convertToRelativeTime } from "@/utils/convertToRelativeTime";
import { styles } from "@styles";
import { theme } from "@/config/theme";
import { t } from "i18next";

export const AssessmentInsight = () => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const [aboutSection, setAboutSection] = useState<any>(null);
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAssessment = () => {
    service
      .fetchAssessmentInsight({ assessmentId }, {})
      .then((res) => {
        const data = res.data;
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
      }}
    >
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      ) : aboutSection ? (
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
                      60000,
                ),
                "yyyy/MM/dd HH:mm",
              ) +
                " (" +
                t(convertToRelativeTime(aboutSection?.creationTime)) +
                ")"}
            </Typography>
          )}
          {(aboutSection.hasOwnProperty("isValid") || editable) &&
            !aboutSection?.isValid && (
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
                    <Trans
                      i18nKey={
                        aboutSection.hasOwnProperty("isValid")
                          ? "Outdated"
                          : "note"
                      }
                    />
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
                  <InfoOutlined
                    color="primary"
                    sx={{
                      marginRight: theme.direction === "ltr" ? 1 : "unset",
                      marginLeft: theme.direction === "rtl" ? 1 : "unset",
                    }}
                  />
                  <Typography
                    variant="titleMedium"
                    fontWeight={400}
                    textAlign="left"
                  >
                    <Trans
                      i18nKey={
                        aboutSection.hasOwnProperty("isValid")
                          ? "invalidInsight"
                          : "defaultInsightTemplate"
                      }
                    />
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
      const { data: res } = await service.updateAssessmentInsight(
        { assessmentId, data: { insight: data.insight } },
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
                background: theme.palette.primary.main,
                "&:hover": {
                  background: theme.palette.primary.dark,
                },
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
