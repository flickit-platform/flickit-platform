import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import Divider from "@mui/material/Divider";
import React, {useEffect, useMemo, useState} from "react";
import { useQuery } from "@utils/useQuery";
import {Link, useParams} from "react-router-dom";
import { useServiceContext } from "@providers/ServiceProvider";
import emptyPositiveState from "@assets/svg/emptyPositiveState.svg";
import emptyNegativeState from "@assets/svg/emptyNegativeState.svg";
import { CircularProgress } from "@mui/material";
import {toast} from "react-toastify";
import {t} from "i18next";
import {ICustomError} from "@utils/CustomError";
import toastError from "@utils/toastError";
import {useTheme} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import ClearIcon from "@mui/icons-material/Clear";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import formatDate from "@utils/formatDate";
import {linkInfo} from "@utils/linkInfo";
import {FileIcon} from "@utils/fileIcon";
import arrowBtn from "@/assets/svg/arrow.svg";
import attachmentIcon from "@/assets/svg/attachmentIcon.svg";
import {theme} from "@config/theme";

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

  const [evidenceDialog,setEvidenceDialog] = useState<{ expended:boolean,id:string }>({expended:false,id:""})

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
      <Typography variant="h5" color="#9DA7B3">
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
      borderColor={type === evidenceType.positive ? "#A4E7E7" : "#EFA5BD"}
    >
      <Typography
        variant="h5"
        color={type === evidenceType.positive ? "#1CC2C4" : "#D81E5B"}
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
            type === evidenceType.positive ? "#A4E7E7" : "#EFA5BD",
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
            color={type === evidenceType.positive ? "#A4E7E7" : "#EFA5BD"}
            textColor={type === evidenceType.positive ? "#1CC2C4" : "#D81E5B"}
            setEvidenceDialog={setEvidenceDialog}
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
        {evidenceDialog.expended &&
            <EvidenceAttachmentsDialogs
            expanded={evidenceDialog.expended}
            onClose={() => setEvidenceDialog({ ...evidenceDialog, expended: false })}
            evidenceDialog={evidenceDialog}
            title={<Trans i18nKey={"evidenceDetails"} />}
            uploadAnother={<Trans i18nKey={"uploadAnother"} />}
            uploadAttachment={<Trans i18nKey={"uploadAttachment"} />}
            />
        }
    </>
  );
};

const EvidenceAttachmentsDialogs = (props: any) => {

  const {
    expanded, onClose,title, evidenceDialog
  } = props;

    const [evidenceDetail,setEvidenceDetail] = useState<{ evidence: {}, question: {} }>({evidence: {}, question: {}})
    const [evidenceAttachment,setEvidenceAttachment] = useState([])
    const [evidenceBG,setEvidenceBG] = useState<any>({})

    useEffect(() => {
        if (evidenceDetail?.evidence?.type === null) {
            setEvidenceBG({
                background: "rgba(25, 28, 31, 0.08)",
                borderColor: "#191C1F",
                borderHover: "#061528",
            });
        }
        if (evidenceDetail?.evidence?.type === "Positive") {
            setEvidenceBG({
                background: "rgba(32, 95, 148, 0.08)",
                borderColor: "#205F94",
                borderHover: "#117476",
            });
        }
        if (evidenceDetail?.evidence?.type === "Negative") {
            setEvidenceBG({
                background: "rgba(139, 0, 53, 0.08)",
                borderColor: "#8B0035",
                borderHover: "#821237",
            });
        }
    }, [evidenceDetail?.evidence?.type]);




    const { service } = useServiceContext();

    const detailItems = ["Description", "Evidence type", "Creator", "Created", "Modified"]
    const questionItems = ["Questionnaire", "Question", "Options", "Confidence"]

    const evidenceLoadQuery = useQuery({
        service: (
            args = { evidenceID: evidenceDialog.id },
            config
        ) => service.loadEvidences(args, config),
        toastError: true,
    });
    const evidenceAttachmentQuery = useQuery({
        service: (
            args = { evidence_id: evidenceDialog.id },
            config
        ) => service.fetchEvidenceAttachments(args, config),
        toastError: true,
    });

  useEffect(()=>{
      (async ()=>{
       let evidenceDetails = await evidenceLoadQuery.query()
       let { attachments } = await evidenceAttachmentQuery.query()
          setEvidenceDetail(evidenceDetails)
          setEvidenceAttachment(attachments)
      })()
  },[])

    const downloadFile = ({ link }: { link: string }) => {
        const fileUrl = link;
        const a = document.createElement("a");
        a.href = fileUrl;
        a.target = "_blank"
        a.download = "file_name.zip";
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

  const theme = useTheme()

  return (
      <Dialog
          open={expanded}
          onClose={onClose}
          maxWidth={"sm"}
          // fullScreen={fullScreen}
          fullWidth
          sx={{
              overflow:"auto",
            ".MuiDialog-paper": {
              borderRadius: "32px",
            },
            ".MuiDialog-paper::-webkit-scrollbar": {
              display: "none",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            },
          }}
      >
        <Box
            sx={{
              // padding: "0!important",
              height: { sm: "84px" },
              minHeight:"84px",
              background: "#004F83",
              overflow: "auto",
              position: "sticky",
              top: 0,
              py: "24px",
            }}
        >
          <Box
              sx={{
                background: "#004F83",
                textAlign: "center",
                color: "#fff",
                ...theme.typography.headlineSmall,
                sm: { ...theme.typography.headlineMedium }
              }}
          >
              {title}
          </Box>
          <ClearIcon
              onClick={() => { onClose()}}
              style={{ color: "#fff" }}
              sx={{
                position: "absolute", width: "25px", height: "25px", right: "17px", top: "25px",
                cursor: "pointer"
              }} />
        </Box>
        <DialogContent
            sx={{
              width:"100%",
              background: "#fff",
              overflow: "visible",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              p: "32px"
            }}
        >
            <Box sx={{px: {xs:"unset",sm:"32px"},display:"flex",flexDirection:"column",
                justifyContent:"center",alignItems:"start",width:"100%", gap:"8px"
            }} >
                <Typography sx={{...theme.typography.headlineSmall,color:"#2B333B"}}>Evidence</Typography>
                {detailItems.map((detailItem,index)=>{
                    const {evidence} = evidenceDetail
                    return (<Box sx={{display:"flex",width:"100%"}}>
                            <Typography sx={{...theme.typography.titleMedium,color:"#2B333B",width:{xs:"45%",sm:"30%"},textAlign:"left"}} >{detailItem}:</Typography>
                            {index == 0 && <Typography sx={{...theme.typography.bodyMedium,color:"#2B333B"}}>{evidence?.description}</Typography>}
                            {index == 1 && <Typography sx={{...theme.typography.bodyMedium,color:evidenceBG.borderColor}}>{evidence?.type}</Typography>}
                            {index == 2 && <Typography sx={{...theme.typography.bodyMedium,color:"#2B333B"}}>{evidence?.createdBy?.displayName}</Typography>}
                            {index == 3 && <Typography sx={{...theme.typography.bodyMedium,color:"#2B333B"}}>{formatDate(evidence?.creationTime)}</Typography>}
                            {index == 4 && <Typography sx={{...theme.typography.bodyMedium,color:"#2B333B"}}>{formatDate(evidence?.lastModificationTime)}</Typography>}
                        </Box>
                )
                })}
                <Typography sx={{...theme.typography.titleMedium,color:"#2B333B",width:"30%",textAlign:"left"}} >Attachments:</Typography>
                {evidenceAttachment.map((item,index)=>{
                   let {name,exp} = linkInfo(item)
                    return(
                    <Box sx={{pl:"25%",display:"flex",justifyContent:"center",alignItems:"start"}}>
                           <Box sx={{width:"70px",height:"100%"}}>
                               <FileIcon
                                   downloadFile={downloadFile} item={item} name={name}
                                   mainColor={evidenceBG.borderColor}
                                   backgroundColor={evidenceBG.background}
                                   exp={exp}
                                   border={false}
                                   displayName={false}
                                   width={70}
                                   height={70}
                               />
                           </Box>
                            <Box sx={{display:"flex",gap:"5px",flexDirection: "column"}}>
                                <Typography onClick={downloadFile} style={{ color: evidenceBG.borderColor,...theme.typography.labelLarge,textAlign:"left", cursor: "pointer",textDecoration:"underline"}}
                                    >{name.substring(0,20)}{name.length > 20 && "..."}</Typography>
                                <DetailExpend evidenceBG={evidenceBG} item={item} />
                            </Box>
                    </Box>
                    )
                })}
            </Box>
            <Box sx={{px: {xs:"unset",sm:"32px"},display:"flex",flexDirection:"column",
                justifyContent:"center",alignItems:"start",width:"100%", gap:"8px",py:"32px"
            }} >
                <Typography sx={{...theme.typography.headlineSmall,color:"#2B333B"}}><Trans i18nKey={"relatedQuestion"} /></Typography>
                <Box sx={{width:"100%",background:"#C7CCD1",height:"0.5px"}}></Box>
                {questionItems.map((questionItem,index)=>{
                    const {question} = evidenceDetail
                    return (<Box sx={{display:"flex",width:"100%"}}>
                            <Typography sx={{...theme.typography.titleMedium,color:"#2B333B",width:{xs:"45%",sm:"30%"},textAlign:"left"}} >{questionItem}:</Typography>
                            {index == 0 && <Typography component={Link} to={
                                `./../../questionnaires/${question?.questionnaire?.id}/${question?.index}`
                            } sx={{...theme.typography.bodyMedium,color:"#2D80D2",textDecoration:"underline",cursor:"pointer"}}>{question?.questionnaire?.title}</Typography>}
                            {index == 1 && <Typography sx={{...theme.typography.bodyMedium,color:"#B8144B"}}>{question?.title}</Typography>}
                            <Box sx={{display:"flex", flexDirection:"column",gap:"8px"}}>
                                {index == 2 &&  question?.options?.map((option, index)=>{
                                    return(
                                        <Typography style={question?.answer?.selectedOption && question?.answer?.selectedOption.index == option.index ? {border:`1px solid ${evidenceBG.borderColor}`,background: evidenceBG.background}: {} } sx={{...theme.typography.bodyMedium,color:"#2B333B",textAlign:"left",width:"fit-content",borderRadius:"8px",px:"12px",py:"2px" }}>{option.index}.{option.title.toUpperCase()}</Typography>
                                    )
                                })}
                            </Box>
                            {index == 3 && <Typography sx={{...theme.typography.bodyMedium,color:"#2B333B",display:"flex",alignItems:"center"}}>{question?.answer?.confidenceLevel?.title}{" "}({`${question?.answer?.confidenceLevel?.id}`}/ 5)</Typography>}
                        </Box>
                    )
                })}
            </Box>
          <Box sx={{
            width: "100%", display: "flex",
            justifyContent: "center"
          }}>
            <Button
                sx={{
                  ...theme.typography.titleMedium,
                  fontSize: { xs: '0.7rem', sm: "1rem" },
                  width:"160px",
                  height: "40px",
                  fontWeight: 700,
                  "&.MuiButton-root": {
                    color: "#EDFCFC",
                    border: "1px solid #004F83",
                    background: "#004F83",
                    borderRadius: "4px",
                  },
                  "&.MuiButton-root:hover": {
                    background: "#004F83",
                    border: "1px solid #004F83",
                  },
                }}
                variant="contained"
                onClick={onClose}
            >
              <Trans i18nKey={"close"} />
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
  )
}

const DetailExpend = (props: any) =>{
    const [expendedDetail,setExpendedDetail ] = useState(false)
    const { item , evidenceBG } = props
    const {createdBy: {displayName}} = item
    const theme = useTheme()
    return (
        <Box sx={{whiteSpace:"nowrap",display: "flex",flexDirection:'column', gap:"8px"}} onClick={()=>setExpendedDetail(prev => !prev)}>
            {expendedDetail && <Typography sx={{...theme.typography.labelSmall,color:"#6C8093",textAlign:"left"}} >BY {displayName}</Typography>}
            {expendedDetail && <Typography sx={{...theme.typography.bodySmall,color:"#6C8093",textAlign:"left",whiteSpace: "break-spaces" ,wordBreak:"break-word"}}>{item.description}</Typography>}
            <Box sx={{display: "flex",justifyContent: 'flex-start',alignItems: "center",gap:"3px",width:"100%"}}>
                {expendedDetail ?  <Typography style={{...theme.typography.labelSmall ,color: evidenceBG.borderColor ,width:"fit-content",textAlign:"left",textDecoration:"underline",cursor:"pointer"}}
                    ><Trans i18nKey={"showMoreDetails"} /></Typography>
                    :  <Typography style={{...theme.typography.labelSmall ,color: evidenceBG.borderColor ,width:"fit-content",textAlign:"left", textDecoration:"underline",cursor:"pointer"}}
                    ><Trans i18nKey={"showLessDetails"}/></Typography>}
                {<img style={expendedDetail ? {
                    rotate: "180deg",
                    transition: "all .2s ease",width:"17px"
                } : { rotate: "0deg", transition: "all .2s ease",width:"17px" }} src={arrowBtn} />}
            </Box>
        </Box>

    )
}

const EvidanceDescription = ({
  number,
  color,
  textColor,
  item,
  setEvidenceDialog
}: {
  number: number;
  color: string;
  textColor: string;
  item: any;
  setEvidenceDialog: any
}) => {
    const { attachmentsCount } = item
  return (
    <>
      <Box sx={{cursor:"pointer"}} onClick={()=>setEvidenceDialog({expended:true,id:item.id})}>
       <Box sx={{display:"flex", justifyContent:"flex-start",alignItems:"center"}}>
           <Typography display="flex" margin={2} color={textColor} fontWeight="bold">
               {number}
           </Typography>
           <Typography
               variant="body1"
               sx={{
                   flex: 1,
                   whiteSpace: "pre-wrap",
                   textAlign: "justify",
                   wordBreak: "break-word",
                   unicodeBidi: "plaintext"
               }}
           >
               {item?.description}
           </Typography>
       </Box>
          {item.attachmentsCount >= 1 && <Box sx={{display:"flex",justifyContent:"flex-start",alignItems:"center",pl:"30px"}}>
              <img src={attachmentIcon} alt={attachmentIcon}/>
              <Typography sx={{...theme.typography.labelSmall,color:"#6C8093"}}>
                  {t("attachmentCount", { attachmentsCount })}
              </Typography>
          </Box>}
      </Box>
      <Divider sx={{ width: "100%", backgroundColor: color }} />
    </>
  );
};

export default RelatedEvidencesContainer;
