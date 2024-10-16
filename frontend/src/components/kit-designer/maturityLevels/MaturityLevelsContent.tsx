import { useEffect, useState } from "react";
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
import toastError from "@/utils/toastError";
import { ICustomError } from "@/utils/CustomError";

const MaturityLevelsContent = () => {
  const { service } = useServiceContext();
  const { kitVersionId = "" } = useParams();
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
    index: 1,
    value: 1,
    id: null,
  });

  useEffect(() => {
    if (maturityLevels.data?.items?.length) {
      setNewMaturityLevel((prev) => ({
        ...prev,
        index: maturityLevels.data.items.length + 1,
        value: maturityLevels.data.items.length + 1,
        id: null,
      }));
    }
  }, [maturityLevels.data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === "value" ? parseInt(value) || 1 : value;
    setNewMaturityLevel((prev) => ({
      ...prev,
      [name]: parsedValue,
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
        value: newMaturityLevel.value,
        title: newMaturityLevel.title,
        description: newMaturityLevel.description,
      };
      if (newMaturityLevel.id) {
        await service.updateMaturityLevel(
          { kitVersionId, maturityLevelId: newMaturityLevel.id },
          data,
          undefined,
        );
      } else {
        await service.postMaturityLevel(
          { kitVersionId: kitVersionId },
          data,
          undefined,
        );
      }

      // Reset form and re-fetch data after saving
      setShowNewMaturityLevelForm(false);
      maturityLevels.query();
      maturityLevelsCompetences.query();

      // Reset the form values
      setNewMaturityLevel({
        title: "",
        description: "",
        index: maturityLevels.data?.items.length + 1 || 1,
        value: maturityLevels.data?.items.length + 1 || 1,
        id: null,
      });
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const handleCancel = () => {
    setShowNewMaturityLevelForm(false);
    setNewMaturityLevel({
      title: "",
      description: "",
      index: maturityLevels.data.items.length + 1 || 1,
      value: maturityLevels.data.items.length + 1 || 1,
      id: null,
    });
  };

  const handleEdit = (maturityLevel: any) => {
    setNewMaturityLevel(maturityLevel);
    setShowNewMaturityLevelForm(true);
  };

  const handleDelete = async (maturityLevelId: number) => {
    try {
      await service.deleteMaturityLevel({ kitVersionId, maturityLevelId });
      maturityLevels.query();
      maturityLevelsCompetences.query();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const handleReorder = async (newOrder: any[]) => {
    try {
      const orders = newOrder.map((item, idx) => ({
        id: item.id,
        index: idx + 1,
      }));

      await service.changeMaturityLevelsOrder({ kitVersionId }, { orders });
      maturityLevels.query();
      maturityLevelsCompetences.query();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
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
                  <Box maxHeight={500} overflow="auto">
                    <MaturityLevelList
                      maturityLevels={maturityLevelsData?.items}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onReorder={handleReorder}
                    />
                  </Box>
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
                    <Divider sx={{ my: 1 }} />

                    <CompetencesTable
                      data={maturityLevelsCompetencesData?.items}
                      maturityLevelsCompetences={
                        maturityLevelsCompetencesData?.items
                      }
                      kitVersionId={kitVersionId}
                    />
                  </Box>
                </>
              ) : (
                <>
                  {showNewMaturityLevelForm ? (
                    <MaturityLevelForm
                      newMaturityLevel={newMaturityLevel}
                      handleInputChange={handleInputChange}
                      handleSave={handleSave}
                      handleCancel={handleCancel}
                    />
                  ) : (
                    <EmptyState
                      onNewMaturityLevelClick={handleNewMaturityLevelClick}
                    />
                  )}
                </>
              )}
            </Box>
          );
        }}
      />
    </PermissionControl>
  );
};

export default MaturityLevelsContent;
