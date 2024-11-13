import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import PermissionControl from "../../common/PermissionControl";
import QueryBatchData from "../../common/QueryBatchData";
import { useServiceContext } from "@/providers/ServiceProvider";
import { useQuery } from "@/utils/useQuery";
import ListOfItems from "./AnswerRangeList";
import EmptyState from "../common/EmptyState";
import { useParams } from "react-router-dom";
import toastError from "@/utils/toastError";
import { ICustomError } from "@/utils/CustomError";
import { debounce } from "lodash";
import { LoadingSkeletonKitCard } from "@/components/common/loadings/LoadingSkeletonKitCard";
import KitDHeader from "@components/kit-designer/common/KitHeader";
import AnswerRangeForm from "./AnswerRangeForm";
import {CircularProgress} from "@mui/material";

const AnaweRangeContent = () => {
  const { service } = useServiceContext();
  const { kitVersionId = "" } = useParams();
  const [data,setData] = useState<any>([])
  const [changeData,setChangeData] = useState(false)
  const fetchAnswerRangeKit = useQuery({
    service: (args = { kitVersionId }, config) =>
      service.fetchAnswerRangeKit(args, config),
    runOnMount: false,
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
      // await fetchAnswerRangeKit.query();
      // maturityLevelsCompetences.query();

      // Reset the form values
      setNewAnswerRange({
        title: "",
        index: fetchAnswerRangeKit.data?.items.length + 1 || 1,
        id: null,
      });
      setChangeData(prev => !prev)
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
      // await fetchAnswerRangeKit.query();
      // maturityLevelsCompetences.query();

      setNewAnswerRange({
        title: "",
        index: fetchAnswerRangeKit.data?.items.length + 1 || 1,
        id: null,
      });
      setChangeData(prev => !prev)
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

  useEffect(()=>{
    (async ()=>{
       await fetchAnswerRangeKit.query().then((res)=>{
         const {items} = res
          setData(items)
        })
       })()
  },[changeData])
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
          mainTitle={"answerRanges"}
          description={"answerRangeKitDesignerDescription"}
          subTitle={"answerRangeList"}
        />
        <Divider sx={{ my: 1 }} />
        {/*<QueryBatchData*/}
        {/*  queryBatchData={[fetchAnswerRangeKit]}*/}
        {/*  renderLoading={() => <LoadingSkeletonKitCard />}*/}
        {/*  render={([AnswerRangeData]) => {*/}
        {/*    return (*/}

        {/*{fetchAnswerRangeKit.loading ? (*/}
        {/*    <Box*/}
        {/*        sx={{*/}
        {/*          display: "flex",*/}
        {/*          justifyContent: "center",*/}
        {/*          alignItems: "center",*/}
        {/*          py: 2,*/}
        {/*        }}*/}
        {/*    >*/}
        {/*      <CircularProgress />*/}
        {/*    </Box>*/}
        {/*) : (*/}
              <>
                {data?.length !== 0 ? (
                  <Box maxHeight={500} overflow="auto">
                    <ListOfItems
                      items={data}
                      fetchQuery={fetchAnswerRangeKit}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      deleteBtn={false}
                      onReorder={handleReorder}
                      setChangeData={setChangeData}
                      name={"answerRange"}
                    />
                  </Box>
                ) : (
                    data?.length == 0 && <EmptyState
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
        {/*)}*/}
      </Box>
    </PermissionControl>
  );
};

export default AnaweRangeContent;
