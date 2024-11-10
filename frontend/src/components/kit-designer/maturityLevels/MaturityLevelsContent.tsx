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
import { debounce } from "lodash";
import { LoadingSkeletonKitCard } from "@/components/common/loadings/LoadingSkeletonKitCard";
import {DeleteConfirmationDialog} from "@common/dialogs/DeleteConfirmationDialog";

const MaturityLevelsContent = () => {
  const { service } = useServiceContext();
  const { kitVersionId = "" } = useParams();
  const [openDeleteDialog,setOpenDeleteDialog] = useState<{status:boolean,id:string}>({status:false,id:""})
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
    handleCancel();
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

  const handleEdit = async (maturityLevel: any) => {
    try {
      const data = {
        kitVersionId,
        index: maturityLevel.index,
        value: maturityLevel.value,
        title: maturityLevel.title,
        description: maturityLevel.description,
      };
      await service.updateMaturityLevel(
        { kitVersionId, maturityLevelId: maturityLevel.id },
        data,
        undefined,
      );

      setShowNewMaturityLevelForm(false);
      maturityLevels.query();
      maturityLevelsCompetences.query();

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

  const handleDelete = async () => {
    try {
      let maturityLevelId = openDeleteDialog.id
      await service.deleteMaturityLevel({ kitVersionId, maturityLevelId });
      maturityLevels.query();
      maturityLevelsCompetences.query();
      handleCancel();
      setOpenDeleteDialog( prev => ({...prev,status:false}))
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const debouncedHandleReorder = debounce(async (newOrder: any[]) => {
    try {
      const orders = newOrder.map((item, idx) => ({
        id: item.id,
        index: idx + 1,
      }));

      await service.changeMaturityLevelsOrder({ kitVersionId }, { orders });
      maturityLevelsCompetences.query();

      handleCancel();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  }, 2000);

  const handleReorder = (newOrder: any[]) => {
    debouncedHandleReorder(newOrder);
  };
  return (
    <PermissionControl scopes={["edit-assessment-kit"]}>
      <Box width="100%">
        <MaturityLevelsHeader
          onNewMaturityLevelClick={handleNewMaturityLevelClick}
          hasMaturityLevels={
            maturityLevels.loaded && maturityLevels.data.items.length !== 0
          }
        />
        {maturityLevels.loaded && maturityLevels.data.items.length !== 0 ? (
          <Typography variant="bodyMedium" mt={1}>
            <Trans i18nKey="changeOrderHelper" />
          </Typography>
        ) : null}
        <Divider sx={{ my: 1 }} />

        <QueryBatchData
          queryBatchData={[maturityLevels]}
          renderLoading={() => <LoadingSkeletonKitCard />}
          render={([maturityLevelsData]) => {
            return (
              <>
                {maturityLevelsData?.items?.length > 0 ? (
                  <>
                    <Box maxHeight={500} overflow="auto">
                      <MaturityLevelList
                        maturityLevels={maturityLevelsData?.items}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onReorder={handleReorder}
                        setOpenDeleteDialog={setOpenDeleteDialog}
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
              </>
            );
          }}
        />
        {maturityLevels.loaded && maturityLevels.data.items.length !== 0 ? (
          <Box mt={4}>
            <Typography variant="headlineSmall" fontWeight="bold">
              <Trans i18nKey="competences" />
            </Typography>
            <Divider sx={{ my: 1 }} />
            {/* Separate Query for Maturity Level Competences */}
            <QueryBatchData
              queryBatchData={[maturityLevelsCompetences]}
              renderLoading={() => <LoadingSkeleton height={200} />}
              render={([maturityLevelsCompetencesData]) => {
                return (
                  <CompetencesTable
                    data={maturityLevelsCompetencesData?.items}
                    maturityLevelsCompetences={maturityLevelsCompetences}
                    kitVersionId={kitVersionId}
                  />
                );
              }}
            />{" "}
          </Box>
        ) : null}
      </Box>
      <DeleteConfirmationDialog
            open={openDeleteDialog.status}
            onClose={() => setOpenDeleteDialog({...openDeleteDialog,status:false})}
            onConfirm={handleDelete}
            title="warning"
            content="deleteMaturityLevel"
      />
    </PermissionControl>
  );
};

export default MaturityLevelsContent;
