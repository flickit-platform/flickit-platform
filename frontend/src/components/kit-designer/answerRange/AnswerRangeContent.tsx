import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import PermissionControl from "../../common/PermissionControl";
import QueryBatchData from "../../common/QueryBatchData";
import { useServiceContext } from "@/providers/ServiceProvider";
import { useQuery } from "@/utils/useQuery";
import ListOfItems from "./AnswerRangeList";
import EmptyState from "../common/EmptyState";
import { Trans } from "react-i18next";
import { useParams } from "react-router-dom";
import toastError from "@/utils/toastError";
import { ICustomError } from "@/utils/CustomError";
import { debounce } from "lodash";
import { LoadingSkeletonKitCard } from "@/components/common/loadings/LoadingSkeletonKitCard";
import KitDHeader from "@components/kit-designer/common/KitHeader";
import QuestionnairesForm from "./AnswerRangeForm";
import AnswerRangeForm from "./AnswerRangeForm";

const AnaweRangeContent = () => {
  const { service } = useServiceContext();
  const { kitVersionId = "" } = useParams();

  const fetchAnswerRangeKit = useQuery({
    service: (args = { kitVersionId }, config) =>
      service.fetchAnswerRangeKit(args, config),
  });
  const postKitAnswerRange = useQuery({
    service: (args, config) => service.postKitAnswerRange(args, config),
    runOnMount: false,
  });

  const deleteQuestionnairesKit = useQuery({
    service: (args, config) => service.deleteQuestionnairesKit(args, config),
    runOnMount: false,
  });

  const updateKitAnswerRange = useQuery({
    service: (args, config) => service.updateKitAnswerRange(args, config),
    runOnMount: false,
  });

  const [showNewAnswerRangeForm, setShowNewAnswerRangeForm] =
    useState(false);
  const [newAnswerRange, setNewAnswerRange] = useState({
    title: "",
    index: 1,
    id: null,
  });

  useEffect(() => {
    if (fetchAnswerRangeKit.data?.items?.length) {
      setNewAnswerRange((prev) => ({
        ...prev,
        index: fetchAnswerRangeKit.data.items.length + 1,
        id: null,
      }));
    }
  }, [fetchAnswerRangeKit.data]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === "value" ? parseInt(value) || 1 : value;
    setNewAnswerRange((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleAddNewRow = () => {
    handleCancel();
    setShowNewAnswerRangeForm(true);
  };

  const handleSave = async () => {
    try {
      const data = {
        kitVersionId,
        answerRangeId: newAnswerRange.index,
        title: newAnswerRange.title,
      };
      if (newAnswerRange.id) {
        await service.updateKitAnswerRange({
          kitVersionId,
          answerRangeId: newAnswerRange.id,
          data,
        });
      } else {
        await postKitAnswerRange.query({ kitVersionId, data });
      }

      // Reset form and re-fetch data after saving
      // setShowQuestionnairesForm(false);
      await fetchAnswerRangeKit.query();
      // maturityLevelsCompetences.query();

      // Reset the form values
      setNewAnswerRange({
        title: "",
        index: fetchAnswerRangeKit.data?.items.length + 1 || 1,
        id: null,
      });
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const handleCancel = () => {
    setShowNewAnswerRangeForm(false);
    setNewAnswerRange({
      title: "",
      index: fetchAnswerRangeKit.data?.items.length + 1 || 1,
      id: null,
    });
  };

  const handleEdit = async (AnswerRangeItem: any) => {
    try {
      const data = {
        kitVersionId,
        index: AnswerRangeItem.index,
        title: AnswerRangeItem.title,
        reusable:true,
      };
      await updateKitAnswerRange.query({
        kitVersionId,
        answerRangeId: AnswerRangeItem.id,
        data,
      });

      setShowNewAnswerRangeForm(false);
      await fetchAnswerRangeKit.query();
      // maturityLevelsCompetences.query();

      setNewAnswerRange({
        title: "",
        index: fetchAnswerRangeKit.data?.items.length + 1 || 1,
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
      await fetchAnswerRangeKit.query();
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
          hasBtn={
              fetchAnswerRangeKit.loaded &&
              fetchAnswerRangeKit.data.items.length !== 0
          }
          btnTitle={"newAnswerRange"}
          mainTitle={"answerRange"}
          description={"answerRangeKitDesignerDescription"}
          subTitle={"answerRangeTemplates"}
        />
        <Divider sx={{ my: 1 }} />
        <QueryBatchData
          queryBatchData={[fetchAnswerRangeKit]}
          renderLoading={() => <LoadingSkeletonKitCard />}
          render={([AnswerRangeData]) => {
            return (
              <>
                {AnswerRangeData?.items?.length !== 0 ? (
                  <Box maxHeight={500} overflow="auto">
                    <ListOfItems
                      items={AnswerRangeData?.items}
                      fetchQuery={fetchAnswerRangeKit}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      deleteBtn={false}
                      onReorder={handleReorder}
                      name={"answerRange"}
                    />
                  </Box>
                ) : (
                  <EmptyState
                    btnTitle={"newAnswerRange"}
                    title={"answerRangeListEmptyState"}
                    SubTitle={"answerRangeEmptyStateDetailed"}
                    onAddNewRow={handleAddNewRow}
                  />
                )}
                {showNewAnswerRangeForm && (
                  <AnswerRangeForm
                    newItem={newAnswerRange}
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

export default AnaweRangeContent;
