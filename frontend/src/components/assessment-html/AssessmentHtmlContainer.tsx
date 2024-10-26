import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PermissionControl from "../common/PermissionControl";
import { useQuery } from "@/utils/useQuery";
import { PathInfo } from "@/types";
import { useServiceContext } from "@/providers/ServiceProvider";
import LoadingSkeletonOfAssessmentRoles from "../common/loadings/LoadingSkeletonOfAssessmentRoles";
import QueryBatchData from "../common/QueryBatchData";
import Box from "@mui/material/Box";
import AssessmentHtmlTitle from "./AssessmentHtmlTitle";

const AssessmentExportContainer = () => {
  const { assessmentId = "" } = useParams();
  const [errorObject, setErrorObject] = useState<any>(undefined);
  const { service } = useServiceContext();

  const iframeUrl =
    "https://flickit-cdn.hectora.app/static-stage/report/" +
    assessmentId +
    "/index.html";

  useEffect(() => {
    const checkIframeUrl = async () => {
      try {
        const response = await fetch(iframeUrl, { method: "HEAD" });
        if (response.status === 404) {
          setErrorObject(response);
        }
      } catch (error) {
        setErrorObject(error);
        console.error("Error fetching iframe URL:", error);
      }
    };

    checkIframeUrl();
  }, [iframeUrl]);

  const fetchPathInfo = useQuery<PathInfo>({
    service: (args, config) =>
      service.fetchPathInfo({ assessmentId, ...(args || {}) }, config),
    runOnMount: true,
  });

  return (
    <PermissionControl error={[errorObject]}>
      <QueryBatchData
        queryBatchData={[fetchPathInfo]}
        renderLoading={() => <LoadingSkeletonOfAssessmentRoles />}
        render={([pathInfo]) => {
          return (
            <>
              <Box
                m="auto"
                pb={3}
                sx={{ px: { xl: 30, lg: 12, xs: 2, sm: 3 } }}
              >
                <AssessmentHtmlTitle pathInfo={pathInfo} />
              </Box>
              <iframe
                src={iframeUrl}
                width="100%"
                height="100vh"
                style={{ border: "none" }}
              />
            </>
          );
        }}
      />
    </PermissionControl>
  );
};

export default AssessmentExportContainer;
