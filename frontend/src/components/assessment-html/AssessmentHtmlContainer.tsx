import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import LoadingSkeletonOfAssessmentRoles from "@common/loadings/LoadingSkeletonOfAssessmentRoles";
import PermissionControl from "../common/PermissionControl";
import { LoadingSkeleton } from "../common/loadings/LoadingSkeleton";

const AssessmentExportContainer = () => {
  const { assessmentId = "" } = useParams();
  const [errorObject, setErrorObject] = useState<any>(undefined);

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

  return (
    <PermissionControl error={[errorObject]}>
      <iframe
        src={iframeUrl}
        title="Report Iframe"
        width="100%"
        height="900px"
        style={{ border: "none", marginTop: -100 }}
      />
    </PermissionControl>
  );
};

export default AssessmentExportContainer;
