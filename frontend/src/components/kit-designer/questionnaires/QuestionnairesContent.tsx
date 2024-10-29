import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import PermissionControl from "../../common/PermissionControl";
import QueryBatchData from "../../common/QueryBatchData";
import { useServiceContext } from "@/providers/ServiceProvider";
import { useQuery } from "@/utils/useQuery";
import ListOfItems from "../commen/itemsList";
import EmptyState from "../commen/EmptyState";
import { Trans } from "react-i18next";
import { useParams } from "react-router-dom";
import toastError from "@/utils/toastError";
import { ICustomError } from "@/utils/CustomError";
import { debounce } from "lodash";
import { LoadingSkeletonKitCard } from "@/components/common/loadings/LoadingSkeletonKitCard";
import KitDHeader from "@components/kit-designer/commen/KitHeader";
import QuestionnairesForm from "./QuestionnairesForm";

const QuestionnairesContent = () => {
  const { service } = useServiceContext();
  const {  kitVersionId = "" } = useParams();

  const fetchQuestionnairesKit = useQuery({
    service: (args = { kitVersionId }, config) =>
      service.fetchQuestionnairesKit(args , config)
  });
  const postQuestionnairesKit = useQuery({
    service: (args , config) =>
      service.postQuestionnairesKit(args, config),
      runOnMount: false,
  });

  const deleteQuestionnairesKit = useQuery({
    service: (args , config) =>
    service.deleteQuestionnairesKit(args, config),
    runOnMount: false,
  });

  const updateKitQuestionnaires = useQuery({
    service: (args,config) =>
        service.updateKitQuestionnaires(args,config),
    runOnMount: false,
  })


  const [showNewQuestionnairesForm, setShowNewQuestionnairesForm] =
    useState(false);
  const [newQuestionnaires, setNewQuestionnaires] = useState({
    title: "",
    description: "",
    index: 1,
    value: 1,
    id: null,
    weight: 1
  });

  useEffect(() => {
    if (fetchQuestionnairesKit.data?.items?.length) {
      setNewQuestionnaires((prev) => ({
        ...prev,
        index: fetchQuestionnairesKit.data.items.length + 1,
        value: fetchQuestionnairesKit.data.items.length + 1,
        weight: 1,
        id: null,
      }));
    }
  }, [fetchQuestionnairesKit.data]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === "value" ? parseInt(value) || 1 : value;
    setNewQuestionnaires((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleAddNewRow = () => {
    handleCancel();
    setShowNewQuestionnairesForm(true);
  };

  const handleSave = async () => {
    try {
      const data = {
        kitVersionId,
        index: newQuestionnaires.index,
        value: newQuestionnaires.value,
        title: newQuestionnaires.title,
        weight: newQuestionnaires.weight,
        description: newQuestionnaires.description,
      };
      if (newQuestionnaires.id) {
        await service.updateKitQuestionnaires(
            { kitVersionId, questionnaireId: newQuestionnaires.id, data },
        );
      } else {
        await postQuestionnairesKit.query({kitVersionId, data})
      }

      // Reset form and re-fetch data after saving
      // setShowQuestionnairesForm(false);
      await fetchQuestionnairesKit.query();
      // maturityLevelsCompetences.query();

      // Reset the form values
      setNewQuestionnaires({
        title: "",
        description: "",
        index: fetchQuestionnairesKit.data?.items.length + 1 || 1,
        value: fetchQuestionnairesKit.data?.items.length + 1 || 1,
        weight: 1,
        id: null,
      });
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const handleCancel = () => {
    setShowNewQuestionnairesForm(false);
    setNewQuestionnaires({
      title: "",
      description: "",
      index: fetchQuestionnairesKit.data?.items.length + 1 || 1,
      value: fetchQuestionnairesKit.data?.items.length + 1 || 1,
      weight: 0,
      id: null,
    });
  };

  const handleEdit = async (QuestionnairesItem: any) => {
    try {
      const data = {
        kitVersionId,
        index: QuestionnairesItem.index,
        value: QuestionnairesItem.value,
        title: QuestionnairesItem.title,
        weight: QuestionnairesItem.weight,
        description: QuestionnairesItem.description,
      };
      await updateKitQuestionnaires.query(
        { kitVersionId, questionnaireId: QuestionnairesItem.id, data },
      );

      setShowNewQuestionnairesForm(false);
      fetchQuestionnairesKit.query();
      // maturityLevelsCompetences.query();

      setNewQuestionnaires({
        title: "",
        description: "",
        index: fetchQuestionnairesKit.data?.items.length + 1 || 1,
        value: fetchQuestionnairesKit.data?.items.length + 1 || 1,
        weight: 0,
        id: null,
      });
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const handleDelete = async (questionnaireId: number) => {
    try {
      await deleteQuestionnairesKit.query({ kitVersionId, questionnaireId });
      await fetchQuestionnairesKit.query();
      handleCancel();
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

      await service.changeQuestionnairesOrder({ kitVersionId }, { orders });

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
        <KitDHeader
            onAddNewRow={handleAddNewRow}
            hasBtn={fetchQuestionnairesKit.loaded && fetchQuestionnairesKit.data.items.length !== 0}
            btnTitle={"newQuestionnaire"}
            mainTitle={"questionnaires"}
            description={"questionnairesKitDesignerDescription"}
            subTitle={"questionnairesList"}
            />
        {fetchQuestionnairesKit.loaded && fetchQuestionnairesKit.data.items.length !== 0 ? (
          <Typography variant="bodyMedium" mt={1}>
            <Trans i18nKey="changeOrderHelper" />
          </Typography>
        ) : null}
        <Divider sx={{ my: 1 }} />

        <QueryBatchData
          queryBatchData={[fetchQuestionnairesKit]}
          renderLoading={() => <LoadingSkeletonKitCard />}
          render={([QuestionnairesData]) => {
            return (
              <>
                {QuestionnairesData?.items?.length > 0 ? (
                    <Box maxHeight={500} overflow="auto">
                      <ListOfItems
                        items={QuestionnairesData?.items}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        deleteBtn={false}
                        onReorder={handleReorder}
                        name={"questionnaires"}
                      />
                    </Box>
                ) : (
                      <EmptyState
                        btnTitle={"newQuestionnaire"}
                        title={"questionnairesListEmptyState"}
                        SubTitle={"questionnairesEmptyStateDetailed"}
                        onAddNewRow={handleAddNewRow}
                      />
                )}
                {showNewQuestionnairesForm && (
                    <QuestionnairesForm
                        newItem={newQuestionnaires}
                        handleInputChange={handleInputChange}
                        handleSave={handleSave}
                        handleCancel={handleCancel}
                    />
                )}
              </>
            );
          }}
        />
      </Box>
    </PermissionControl>
  );
};

export default QuestionnairesContent;
