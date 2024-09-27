import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import Divider from "@mui/material/Divider";
import { useEffect } from "react";
import { useQuery } from "@utils/useQuery";
import { useParams } from "react-router-dom";
import { useServiceContext } from "@providers/ServiceProvider";
import emptyPositiveState from "@assets/svg/emptyPositiveState.svg";
import emptyNegativeState from "@assets/svg/emptyNegativeState.svg";
import { CircularProgress } from "@mui/material";

export enum evidenceType {
  positive = "POSITIVE",
  negative = "NEGATIVE",
}
interface RelatedEvidencesContainerProps {
  attributeId: string;
  type: evidenceType;
  expandedAttribute: string | false;
  setEmptyEvidence: (value: boolean) => void;
  setOpositeEvidenceLoading: (value: boolean) => void;
  opositeEvidenceLoading: boolean;
}

const RelatedEvidencesContainer: React.FC<RelatedEvidencesContainerProps> = ({
  attributeId,
  type,
  expandedAttribute,
  setEmptyEvidence,
  opositeEvidenceLoading,
  setOpositeEvidenceLoading,
}) => {
  const { assessmentId } = useParams();
  const { service } = useServiceContext();
  const fetchRelatedEvidences = useQuery({
    service: (args = { assessmentId, attributeId, type }, config) =>
      service.fetchRelatedEvidences(args, config),
    runOnMount: false,
  });

  useEffect(() => {
    if (expandedAttribute === attributeId) {
      fetchRelatedEvidences.query();
    }
  }, [expandedAttribute]);

  useEffect(() => {
    if (fetchRelatedEvidences.loaded || fetchRelatedEvidences.error) {
      setOpositeEvidenceLoading(true);
      if (
        fetchRelatedEvidences?.data?.items.length === 0 ||
        fetchRelatedEvidences.error
      ) {
        setEmptyEvidence(true);
      }
    }
  }, [fetchRelatedEvidences.loaded, fetchRelatedEvidences.error]);

  const renderEmptyState = () => (
    <Box width="100%" padding={4} gap={3} sx={{ ...styles.centerCVH }}>
      <img
        width="75%"
        src={
          type === evidenceType.positive
            ? emptyPositiveState
            : emptyNegativeState
        }
        alt="empty"
      />
      <Typography color="#9DA7B3">
        <Trans
          i18nKey={
            type === evidenceType.positive
              ? "noPositiveEvidence"
              : "noNegativeEvidence"
          }
        />
      </Typography>
    </Box>
  );

  const renderEvidenceItems = () => (
    <Box
      sx={{ ...styles.centerCH }}
      gap={2}
      borderRadius={8}
      height={"50vh"}
      width="90%"
      padding="16px 0px 0px 0px"
      border="1px solid"
      borderColor={type === evidenceType.positive ? "#9CCAFF" : "#EFA5BD"}
    >
      <Typography
        fontSize="1.25rem"
        fontWeight={500}
        color={type === evidenceType.positive ? "#004F83" : "#9A003C"}
      >
        <Trans
          i18nKey={
            type === evidenceType.positive
              ? "positiveEvidences"
              : "negativeEvidences"
          }
        />
      </Typography>
      <Divider
        sx={{
          width: "100%",
          backgroundColor:
            type === evidenceType.positive ? "#9CCAFF" : "#EFA5BD",
        }}
      />
      <Box
        overflow="auto"
        gap="8px"
        display="flex"
        flexDirection="column"
        paddingX="30px"
        width="100%"
      >
        {fetchRelatedEvidences?.data?.items?.map((item: any, index: number) => (
          <EvidanceDescription
            key={index}
            number={index + 1}
            item={item}
            color={type === evidenceType.positive ? "#9CCAFF" : "#EFA5BD"}
            textColor={type === evidenceType.positive ? "#004F83" : "#D81E5B"}
          />
        ))}
      </Box>
    </Box>
  );

  return (
    <>
      {fetchRelatedEvidences.loading || !opositeEvidenceLoading ? (
        <Box sx={{ ...styles.centerVH }} height="30vh" width="100%">
          <CircularProgress />
        </Box>
      ) : fetchRelatedEvidences?.data?.items.length === 0 ? (
        renderEmptyState()
      ) : (
        renderEvidenceItems()
      )}
    </>
  );
};

const EvidanceDescription = ({
  number,
  color,
  textColor,
  item,
}: {
  number: number;
  color: string;
  textColor: string;
  item: any;
}) => {
  return (
    <>
      <Box display="flex" justifyContent="flex-start" alignItems="center">
        <Typography
          display="flex"
          margin={2}
          color={textColor}
          fontWeight="bold"
        >
          {number}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            flex: 1,
            whiteSpace: "pre-wrap",
            textAlign: "justify",
            wordBreak: "break-word",
            unicodeBidi: "plaintext",
          }}
        >
          {item?.description}
        </Typography>
      </Box>
      <Divider sx={{ width: "100%", backgroundColor: color }} />
    </>
  );
};

export default RelatedEvidencesContainer;
