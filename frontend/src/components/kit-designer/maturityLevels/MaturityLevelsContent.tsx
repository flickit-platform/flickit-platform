import { useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import PermissionControl from "../../common/PermissionControl";
import QueryBatchData from "../../common/QueryBatchData";
import { useServiceContext } from "@/providers/ServiceProvider";
import { useQuery } from "@/utils/useQuery";
import { LoadingSkeleton } from "../../common/loadings/LoadingSkeleton";
import MaturityLevelsHeader from "./MaturityLevelsHeader";
import MaturityLevelForm from "./MaturityLevelForm";
import MaturityLevelList from "./MaturityLevelList";
import CompetencesTable from "./CompetencesTable";
import EmptyState from "./EmptyState";
import { Trans } from "react-i18next";
import { useParams } from "react-router-dom";

const MaturityLevelsContent = () => {
  const { service } = useServiceContext();
  const { kitVersionId } = useParams();
  const maturityLevels = useQuery({
    service: (args = { kitVersionId }, config) =>
      service.getMaturityLevels(args, config),
  });
  const maturityLevelsCompetences = useQuery({
    service: (args = { kitVersionId }, config) =>
      service.getMaturityLevelsCompetences(args, config),
  });

  const [showNewMaturityLevelForm, setShowNewMaturityLevelForm] =
    useState(false);
  const [newMaturityLevel, setNewMaturityLevel] = useState({
    title: "",
    description: "",
    index: 2,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMaturityLevel((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewMaturityLevelClick = () => {
    setShowNewMaturityLevelForm(true);
  };

  const handleSave = async () => {
    try {
      const data = {
        kitVersionId,
        index: newMaturityLevel.index,
        value: newMaturityLevel.index,
        title: newMaturityLevel.title,
        description: newMaturityLevel.description,
      };
      await service.postMaturityLevel({ kitVersionId: 501 }, data, undefined);
      setShowNewMaturityLevelForm(false);
    } catch (error) {
      console.error("Failed to save new maturity level", error);
    }
  };

  const handleCancel = () => {
    setShowNewMaturityLevelForm(false);
    setNewMaturityLevel({
      title: "",
      description: "",
      index: maturityLevels.data?.length + 1 || 0,
    });
  };

  return (
    <PermissionControl scopes={["edit-assessment-kit"]}>
      <QueryBatchData
        queryBatchData={[maturityLevels, maturityLevelsCompetences]}
        renderLoading={() => <LoadingSkeleton />}
        render={([maturityLevelsData, maturityLevelsCompetencesData]) => {
          return (
            <Box width="100%">
              <MaturityLevelsHeader
                onNewMaturityLevelClick={handleNewMaturityLevelClick}
                hasMaturityLevels={maturityLevelsData?.items?.length > 0}
              />

              {maturityLevelsData?.items?.length > 0 ? (
                <Typography variant="bodyMedium" mt={1}>
                  <Trans i18nKey="changeOrderHelper" />
                </Typography>
              ) : null}

              <Divider sx={{ my: 1 }} />

              {maturityLevelsData?.items?.length > 0 ? (
                <>
                  <MaturityLevelList
                    maturityLevels={maturityLevelsData?.items}
                  />

                  {/* Form rendered at the end of the MaturityLevelList */}
                  {showNewMaturityLevelForm && (
                    <MaturityLevelForm
                      newMaturityLevel={newMaturityLevel}
                      handleInputChange={handleInputChange}
                      handleSave={handleSave}
                      handleCancel={handleCancel}
                    />
                  )}

                  <Box mt={4}>
                    <Typography variant="headlineSmall" fontWeight="bold">
                      Competences
                    </Typography>

                    <CompetencesTable
                      data={maturityLevelsCompetencesData?.items}
                      maturityLevelsCompetences={
                        maturityLevelsCompetencesData?.items
                      }
                    />
                  </Box>
                </>
              ) : (
                <EmptyState
                  onNewMaturityLevelClick={handleNewMaturityLevelClick}
                />
              )}
            </Box>
          );
        }}
      />
    </PermissionControl>
  );
};

export default MaturityLevelsContent;
