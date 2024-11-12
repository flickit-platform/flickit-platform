import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import PermissionControl from "../../common/PermissionControl";
import QueryBatchData from "../../common/QueryBatchData";
import { useServiceContext } from "@/providers/ServiceProvider";
import { useQuery } from "@/utils/useQuery";
import ListOfItems from "../questionnaires/QuestionnaireList";
import EmptyState from "../common/EmptyState";
import { Trans } from "react-i18next";
import { useParams } from "react-router-dom";
import toastError from "@/utils/toastError";
import { ICustomError } from "@/utils/CustomError";
import { debounce } from "lodash";
import { LoadingSkeletonKitCard } from "@/components/common/loadings/LoadingSkeletonKitCard";
import KitDHeader from "@/components/kit-designer/common/KitHeader";
import AttributeForm from "./AttributeForm";
import SubjectTable from "./SubjectTable";
import {DeleteConfirmationDialog} from "@common/dialogs/DeleteConfirmationDialog";

const AttributesContent = () => {
  const { service } = useServiceContext();
  const { kitVersionId = "" } = useParams();
  const [subjectListOpen, setSubjectListOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [openDeleteDialog,setOpenDeleteDialog] = useState<{status:boolean,id:string}>({status:false,id:""})

  const [subjects, setSubjects] = useState([]);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const fetchSubjectKit = useQuery({
    service: (args = { kitVersionId }, config) =>
      service.fetchSubjectKit(args, config),
  });

  const fetchAttributeKit = useQuery({
    service: (args = { kitVersionId }, config) =>
      service.fetchAttributeKit(args, config),
  });

  const postAttributeKit = useQuery({
    service: (args, config) => service.postAttributeKit(args, config),
    runOnMount: false,
  });

  const deleteAttributeKit = useQuery({
    service: (args, config) => service.deleteAttributeKit(args, config),
    runOnMount: false,
  });

  const updateKitAttribute = useQuery({
    service: (args, config) => service.updateKitAttribute(args, config),
    runOnMount: false,
  });

  const [showNewAttributeForm, setShowNewAttributeForm] = useState(false);
  const [newAttribute, setNewAttribute] = useState({
    title: "",
    description: "",
    index: 1,
    value: 1,
    id: null,
    weight: 1,
  });

  useEffect(() => {
    fetchSubjectKit.query();
  }, []);

  useEffect(() => {
    if (fetchAttributeKit.data?.items?.length) {
      setNewAttribute((prev) => ({
        ...prev,
        index: fetchAttributeKit.data.items.length + 1,
        value: fetchAttributeKit.data.items.length + 1,
        weight: 1,
        id: null,
      }));
    }
  }, [fetchAttributeKit.data]);

  useEffect(() => {
    if (fetchSubjectKit.data) {
      setSubjects(fetchSubjectKit.data.items || []);
    }
  }, [fetchSubjectKit.data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === "value" ? parseInt(value) || 1 : value;
    setNewAttribute((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleAddNewRow = () => {
    handleCancel();
    setShowNewAttributeForm(true);
    setSubjectListOpen(true);
  };

  const handleSave = async (subjectId: number) => {
    try {
      const data = {
        kitVersionId,
        index: newAttribute.index,
        value: newAttribute.value,
        title: newAttribute.title,
        weight: newAttribute.weight,
        description: newAttribute.description,
        subjectId: subjectId,
      };
      if (newAttribute?.id) {
        await service.updateKitAttribute({
          kitVersionId,
          attributeId: newAttribute?.id,
          data,
        });
      } else {
        await postAttributeKit.query({ kitVersionId, data });
      }
      setShowNewAttributeForm(false);

      await fetchAttributeKit.query();

      setNewAttribute({
        title: "",
        description: "",
        index: fetchAttributeKit.data?.items.length + 1 || 1,
        value: fetchAttributeKit.data?.items.length + 1 || 1,
        weight: 1,
        id: null,
      });
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const handleSubjectSelect = (subject: any) => {
    setSelectedSubject(subject);
    setNewAttribute((prev) => ({
      ...prev,
      subjectId: subject?.id,
    }));
    setShowNewAttributeForm(true);
  };

  const handleCancel = () => {
    setShowNewAttributeForm(false);
    setNewAttribute({
      title: "",
      description: "",
      index: fetchAttributeKit.data?.items.length + 1 || 1,
      value: fetchAttributeKit.data?.items.length + 1 || 1,
      weight: 0,
      id: null,
    });
    setOpenDeleteDialog({status:false,id:""})
  };

  const handleEdit = async (AttributeItem: any) => {
    try {
      const data = {
        kitVersionId,
        index: AttributeItem.index,
        value: AttributeItem.value,
        title: AttributeItem.title,
        weight: AttributeItem.weight,
        description: AttributeItem.description,
        subjectId: AttributeItem.subject.id,
      };
      await updateKitAttribute.query({
        kitVersionId,
        attributeId: AttributeItem?.id,
        data,
      });

      setShowNewAttributeForm(false);
      fetchAttributeKit.query();

      setNewAttribute({
        title: "",
        description: "",
        index: fetchAttributeKit.data?.items.length + 1 || 1,
        value: fetchAttributeKit.data?.items.length + 1 || 1,
        weight: 0,
        id: null,
      });
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const handleDelete = async () => {
    try {
      let attributeId = openDeleteDialog.id
      await deleteAttributeKit.query({ kitVersionId, attributeId  });
      await fetchAttributeKit.query();
      handleCancel();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const debouncedHandleReorder = debounce(
    async (newOrder: any[], destinationSubjectId: any) => {
      try {
        const orders = newOrder.map((item, idx) => ({
          id: item?.id,
          index: idx + 1,
        }));

        await service.changeAttributeOrder(
          { kitVersionId },
          { orders, subjectId: destinationSubjectId },
        );
        handleCancel();
      } catch (e) {
        const err = e as ICustomError;
        toastError(err);
      }
    },
    2000,
  );

  const handleReorder = (newOrder: any[], destinationSubjectId: any) => {
    debouncedHandleReorder(newOrder, destinationSubjectId);
  };

  return (
    <PermissionControl scopes={["edit-assessment-kit"]}>
      <Box width="100%">
        <KitDHeader
          onAddNewRow={handleAddNewRow}
          hasBtn={
            fetchAttributeKit.loaded &&
            fetchAttributeKit.data.items.length !== 0
          }
          mainTitle={"attributes"}
          description={"attributesKitDesignerDescription"}
          subTitle={"attributesList"}
          btnTitle={"newAttribute"}
        />
        {fetchAttributeKit.loaded &&
        fetchAttributeKit.data.items.length !== 0 ? (
          <Typography variant="bodyMedium" mt={1}>
            <Trans i18nKey="changeOrderHelper" />
          </Typography>
        ) : null}
        <Divider sx={{ my: 1 }} />

        <QueryBatchData
          queryBatchData={[fetchAttributeKit]}
          renderLoading={() => <LoadingSkeletonKitCard />}
          render={([AttributeData]) => (
            <>
              {AttributeData?.items?.length > 0 || showNewAttributeForm ? (
                <Box>
                  <SubjectTable
                    subjects={subjects}
                    initialAttributes={AttributeData?.items}
                    onAddAttribute={handleAddNewRow}
                    onReorder={handleReorder}
                    showNewAttributeForm={showNewAttributeForm}
                    handleCancel={handleCancel}
                    handleSave={handleSave}
                    newAttribute={newAttribute}
                    setNewAttribute={setNewAttribute}
                    handleEdit={handleEdit}
                    setOpenDeleteDialog={setOpenDeleteDialog}
                  />
                </Box>
              ) : (
                !showNewAttributeForm && (
                  <EmptyState
                    btnTitle={"newAttribute"}
                    title={"attributesListEmptyState"}
                    SubTitle={"AttributeEmptyStateDetailed"}
                    onAddNewRow={handleAddNewRow}
                    disabled={subjects.length === 0}
                    disableTextBox={<Trans i18nKey={"disableAttributeMessage"}/>}
                  />
                )
              )}
            </>
          )}
        />
      </Box>
      <DeleteConfirmationDialog
          open={openDeleteDialog.status}
          onClose={() => setOpenDeleteDialog({...openDeleteDialog,status:false})}
          onConfirm={handleDelete}
          title="warning"
          content="deleteAttribute"
      />
    </PermissionControl>
  );
};

export default AttributesContent;
