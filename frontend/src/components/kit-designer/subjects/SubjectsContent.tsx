import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import PermissionControl from "../../common/PermissionControl";
import QueryBatchData from "../../common/QueryBatchData";
import { useServiceContext } from "@/providers/ServiceProvider";
import { useQuery } from "@/utils/useQuery";
import { LoadingSkeleton } from "../../common/loadings/LoadingSkeleton";
import MaturityLevelsHeader from "./SubjectsHeader";
import MaturityLevelForm from "./SubjectForm";
import ListOfItems from "../commen/itemsList";
import EmptyState from "../commen/EmptyState";
import { Trans } from "react-i18next";
import { useParams } from "react-router-dom";
import toastError from "@/utils/toastError";
import { ICustomError } from "@/utils/CustomError";
import { debounce } from "lodash";
import { LoadingSkeletonKitCard } from "@/components/common/loadings/LoadingSkeletonKitCard";
import KitHeader from "@components/kit-designer/commen/KitHeader";
import KitDHeader from "@components/kit-designer/commen/KitHeader";

const MaturityLevelsContent = () => {
  const { service } = useServiceContext();
  const {  kitVersionId = "" } = useParams();
  // const maturityLevels = useQuery({
  //   service: (args = { kitVersionId }, config) =>
  //     service.getMaturityLevels(args, config),
  // });
  // const maturityLevelsCompetences = useQuery({
  //   service: (args = { kitVersionId }, config) =>
  //     service.getMaturityLevelsCompetences(args, config),
  // });
  // const addCompetencyToSubjectKit = useQuery({
  //   service: (args={kitVersionId,newSubject},config) =>
  //       service.addCompetencyToSubjectKit(args, undefined)
  // })

  const fetchSubjectKit = useQuery({
    service: (args = { kitVersionId }, config) =>
      service.fetchSubjectKit(args, config)
  });
  const postSubjectKit = useQuery({
    service: (args , config) =>
      service.postSubjectKit(args, config),
      runOnMount: false,
  });

  const deleteSubjectKit = useQuery({
    service: (args , config) =>
        service.deleteSubjectKit(args, config),
    runOnMount: false,
  });

  const updateKitSubject = useQuery({
    service: (args,config) =>
        service.updateKitSubject(args,config),
    runOnMount: false,
  })


  const [showNewMaturityLevelForm, setShowNewMaturityLevelForm] =
    useState(false);
  const [newSubject, setNewSubject] = useState({
    title: "",
    description: "",
    index: 1,
    value: 1,
    id: null,
    weight: 1
  });

  useEffect(() => {
    if (fetchSubjectKit.data?.items?.length) {
      setNewSubject((prev) => ({
        ...prev,
        index: fetchSubjectKit.data.items.length + 1,
        value: fetchSubjectKit.data.items.length + 1,
        weight: 1,
        id: null,
      }));
    }
  }, [fetchSubjectKit.data]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === "value" ? parseInt(value) || 1 : value;
    setNewSubject((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleAddNewRow = () => {
    handleCancel();
    setShowNewMaturityLevelForm(true);
  };

  const handleSave = async () => {
    try {
      const data = {
        kitVersionId,
        index: newSubject.index,
        value: newSubject.value,
        title: newSubject.title,
        weight: newSubject.weight,
        description: newSubject.description,
      };
      if (newSubject.id) {
        await service.updateKitSubject(
          { kitVersionId, subjectId: newSubject.id },
          data,
          undefined,
        );
      } else {
        await postSubjectKit.query({kitVersionId, data})
      }

      // Reset form and re-fetch data after saving
      // setShowNewMaturityLevelForm(false);
      await fetchSubjectKit.query();
      // maturityLevelsCompetences.query();

      // Reset the form values
      setNewSubject({
        title: "",
        description: "",
        index: fetchSubjectKit.data?.items.length + 1 || 1,
        value: fetchSubjectKit.data?.items.length + 1 || 1,
        weight: 1,
        id: null,
      });
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const handleCancel = () => {
    setShowNewMaturityLevelForm(false);
    setNewSubject({
      title: "",
      description: "",
      index: fetchSubjectKit.data?.items.length + 1 || 1,
      value: fetchSubjectKit.data?.items.length + 1 || 1,
      weight: 1,
      id: null,
    });
  };

  const handleEdit = async (subjectItem: any) => {
    try {
      const data = {
        kitVersionId,
        index: subjectItem.index,
        value: subjectItem.value,
        title: subjectItem.title,
        description: subjectItem.description,
      };
      await updateKitSubject.query(
        { kitVersionId, subjectId: subjectItem.id },
        data,
        undefined,
      );

      setShowNewMaturityLevelForm(false);
      fetchSubjectKit.query();
      // maturityLevelsCompetences.query();

      setNewSubject({
        title: "",
        description: "",
        index: fetchSubjectKit.data?.items.length + 1 || 1,
        value: fetchSubjectKit.data?.items.length + 1 || 1,
        weight: 1,
        id: null,
      });
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const handleDelete = async (subjectId: number) => {
    try {
      await deleteSubjectKit.query({ kitVersionId, subjectId });
      await fetchSubjectKit.query();
      handleCancel();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  // const debouncedHandleReorder = debounce(async (newOrder: any[]) => {
  //   try {
  //     const orders = newOrder.map((item, idx) => ({
  //       id: item.id,
  //       index: idx + 1,
  //     }));
  //
  //     await service.changeMaturityLevelsOrder({ kitVersionId }, { orders });
  //     maturityLevelsCompetences.query();
  //
  //     handleCancel();
  //   } catch (e) {
  //     const err = e as ICustomError;
  //     toastError(err);
  //   }
  // }, 2000);

  // const handleReorder = (newOrder: any[]) => {
  //   debouncedHandleReorder(newOrder);
  // };

  return (
    <PermissionControl scopes={["edit-assessment-kit"]}>
      <Box width="100%">
        <KitDHeader
            onAddNewRow={handleAddNewRow}
            hasBtn={fetchSubjectKit.loaded && fetchSubjectKit.data.items.length !== 0}
            mainTitle={"subjects"}
            description={"subjectsKitDesignerDescription"}
            subTitle={"subjectsList"}
            />
        {fetchSubjectKit.loaded && fetchSubjectKit.data.items.length !== 0 ? (
          <Typography variant="bodyMedium" mt={1}>
            <Trans i18nKey="changeOrderHelper" />
          </Typography>
        ) : null}
        <Divider sx={{ my: 1 }} />

        <QueryBatchData
          queryBatchData={[fetchSubjectKit]}
          renderLoading={() => <LoadingSkeletonKitCard />}
          render={([subjectData]) => {
            return (
              <>
                {subjectData?.items?.length > 0 ? (
                  <>
                    <Box maxHeight={500} overflow="auto">
                      <ListOfItems
                        items={subjectData?.items}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        deleteBtn={false}
                        // onReorder={handleReorder}
                      />
                    </Box>

                    {showNewMaturityLevelForm && (
                      <MaturityLevelForm
                        newMaturityLevel={newSubject}
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
                        newMaturityLevel={newSubject}
                        handleInputChange={handleInputChange}
                        handleSave={handleSave}
                        handleCancel={handleCancel}
                      />
                    ) : (
                      <EmptyState
                        btnTitle={"newSubject"}
                        title={"subjectsListEmptyState"}
                        SubTitle={"subjectEmptyStateDatailed"}
                        onAddNewRow={handleAddNewRow}
                      />
                    )}
                  </>
                )}
              </>
            );
          }}
        />
      </Box>
    </PermissionControl>
  );
};

export default MaturityLevelsContent;