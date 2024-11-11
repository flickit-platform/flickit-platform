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
  const postQuestionnairesKit = useQuery({
    service: (args, config) => service.postQuestionnairesKit(args, config),
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

  const [showNewQuestionnairesForm, setShowNewQuestionnairesForm] =
    useState(false);
  const [newQuestionnaires, setNewQuestionnaires] = useState({
    title: "",
    description: "",
    index: 1,
    value: 1,
    id: null,
    weight: 1,
  });

  useEffect(() => {
    if (fetchAnswerRangeKit.data?.items?.length) {
      setNewQuestionnaires((prev) => ({
        ...prev,
        index: fetchAnswerRangeKit.data.items.length + 1,
        value: fetchAnswerRangeKit.data.items.length + 1,
        weight: 1,
        id: null,
      }));
    }
  }, [fetchAnswerRangeKit.data]);
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
        await service.updateKitAnswerRange({
          kitVersionId,
          answerRangeId: newQuestionnaires.id,
          data,
        });
      } else {
        await postQuestionnairesKit.query({ kitVersionId, data });
      }

      // Reset form and re-fetch data after saving
      // setShowQuestionnairesForm(false);
      await fetchAnswerRangeKit.query();
      // maturityLevelsCompetences.query();

      // Reset the form values
      setNewQuestionnaires({
        title: "",
        description: "",
        index: fetchAnswerRangeKit.data?.items.length + 1 || 1,
        value: fetchAnswerRangeKit.data?.items.length + 1 || 1,
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
      index: fetchAnswerRangeKit.data?.items.length + 1 || 1,
      value: fetchAnswerRangeKit.data?.items.length + 1 || 1,
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
      await updateKitAnswerRange.query({
        kitVersionId,
        answerRangeId: QuestionnairesItem.id,
        data,
      });

      setShowNewQuestionnairesForm(false);
      fetchAnswerRangeKit.query();
      // maturityLevelsCompetences.query();

      setNewQuestionnaires({
        title: "",
        description: "",
        index: fetchAnswerRangeKit.data?.items.length + 1 || 1,
        value: fetchAnswerRangeKit.data?.items.length + 1 || 1,
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

  const answerrangeItem =  [
    {
      "id": 7,
      "title": "test_1",
      "answerOptions": [
        {
          "id": 77091,
          "title": "Poor",
          "index": 1,
          "value": 1.0
        },
        {
          "id": 77092,
          "title": "Weak",
          "index": 2,
          "value": 2.0
        },
        {
          "id": 77093,
          "title": "Moderate",
          "index": 3,
          "value": 3.0
        },
        {
          "id": 77094,
          "title": "Good",
          "index": 4,
          "value": 4.0
        }
      ]
    },
    {
      "id": 8,
      "title": "test_2",
      "answerOptions": [
        {
          "id": 77537,
          "title": "Poor",
          "index": 1,
          "value": 1.0
        },
        {
          "id": 77538,
          "title": "Weak",
          "index": 2,
          "value": 2.0
        },
        {
          "id": 77539,
          "title": "Moderate",
          "index": 3,
          "value": 3.0
        },
        {
          "id": 77540,
          "title": "Good",
          "index": 4,
          "value": 4.0
        }
      ]
    },
    {
      "id": 9,
      "title": "test_3",
      "answerOptions": [
        {
          "id": 77541,
          "title": "Poor",
          "index": 1,
          "value": 1.0
        },
        {
          "id": 77542,
          "title": "Weak",
          "index": 2,
          "value": 2.0
        },
        {
          "id": 77543,
          "title": "Moderate",
          "index": 3,
          "value": 3.0
        },
        {
          "id": 77544,
          "title": "Good",
          "index": 4,
          "value": 4.0
        }
      ]
    },
    {
      "id": 10,
      "title": "test_4",
      "answerOptions": [
        {
          "id": 77545,
          "title": "Poor",
          "index": 1,
          "value": 1.0
        },
        {
          "id": 77546,
          "title": "Weak",
          "index": 2,
          "value": 2.0
        },
        {
          "id": 77547,
          "title": "Moderate",
          "index": 3,
          "value": 3.0
        },
        {
          "id": 77548,
          "title": "Good",
          "index": 4,
          "value": 4.0
        }
      ]
    }
  ]

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
                {AnswerRangeData?.items?.length == 0 ? (
                  <Box maxHeight={500} overflow="auto">
                    <ListOfItems
                      // items={AnswerRangeData?.items}
                      items={answerrangeItem}
                      fetchQuery={fetchAnswerRangeKit}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      deleteBtn={false}
                      onReorder={handleReorder}
                      name={"questionnaires"}
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
                {showNewQuestionnairesForm && (
                  <AnswerRangeForm
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

export default AnaweRangeContent;
