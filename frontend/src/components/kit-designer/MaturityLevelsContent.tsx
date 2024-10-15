import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import PermissionControl from "../common/PermissionControl";
import QueryBatchData from "../common/QueryBatchData";
import { useServiceContext } from "@/providers/ServiceProvider";
import { useQuery } from "@/utils/useQuery";
import { LoadingSkeleton } from "../common/loadings/LoadingSkeleton";
import { Trans } from "react-i18next";
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';
import { styles } from "@/config/styles";

const MaturityLevelsContent = () => {
    const { service } = useServiceContext();
    const maturityLevels = useQuery({
        service: (args = { kitVersionId: 501 }, config) =>
            service.getMaturityLevels(args, config),
    });
    const maturityLevelsCompetences = useQuery({
        service: (args = { kitVersionId: 501 }, config) =>
            service.getMaturityLevelsCompetences(args, config),
    });
    const items = [
        {
            "id": 2003,
            "title": "Elementary",
            "description": "description",
            "value": 1,
            "index": 1
        },
        {
            "id": 2004,
            "title": "Weak",
            "description": "description",
            "value": 2,
            "index": 2
        },
        {
            "id": 2005,
            "title": "Moderate",
            "description": "description",
            "value": 3,
            "index": 3
        },
        {
            "id": 2006,
            "title": "Good",
            "description": "description",
            "value": 4,
            "index": 4
        },
        {
            "id": 2007,
            "title": "Great",
            "description": "description",
            "value": 5,
            "index": 5
        }
    ]
    const data = [
        { id: 2003, index: 1, title: 'Elementary', competences: [] },
        { id: 2004, index: 2, title: 'Weak', competences: [{ id: 101, value: 60, maturityLevelId: 2004 }] },
        {
            id: 2005,
            index: 3,
            title: 'Moderate',
            competences: [
                { id: '102', value: 60, maturityLevelId: 2005 },
                { id: 103, value: 75, maturityLevelId: 2004 }
            ]
        },
        {
            id: 2006,
            title: 'Good',
            index: 4,
            competences: [
                { id: 104, value: 60, maturityLevelId: 2006 },
                { id: 105, value: 75, maturityLevelId: 2005 },
                { id: 106, value: 85, maturityLevelId: 2004 }
            ]
        },
        {
            id: 2007,
            title: 'Great',
            index: 5,
            competences: [
                { id: 107, value: 60, maturityLevelId: 2007 },
                { id: 108, value: 75, maturityLevelId: 2006 },
                { id: 109, value: 85, maturityLevelId: 2005 },
                { id: 110, value: 95, maturityLevelId: 2004 }
            ]
        }
    ];
    return (
        <PermissionControl>
            <QueryBatchData
                queryBatchData={[maturityLevels, maturityLevelsCompetences]}
                renderLoading={() => <LoadingSkeleton />}
                render={([maturityLevelsData, maturityLevelsCompetencesData]) => {
                    return (
                        < >
                            <Box>
                                <Typography variant="headlineSmall" fontWeight="bold">
                                    <Trans i18nKey="maturityLevels" />
                                </Typography>
                                <br />
                                <Typography variant="bodyMedium">
                                    <Trans i18nKey="maturityLevelsKitDesignerDescrption" />
                                </Typography>
                            </Box>
                            <Box mt={4}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="headlineSmall" fontWeight="bold">
                                        <Trans i18nKey="maturityLevelsList" />
                                    </Typography>
                                    {maturityLevelsData?.items?.length ? (
                                        <Button variant="contained">
                                            <Trans i18nKey="newMaturityLevel" />
                                        </Button>
                                    ) : null}
                                </Box>
                                {maturityLevelsData?.items?.length ? (<Typography variant="bodyMedium" mt={1}>
                                    <Trans i18nKey="changeOrderHelper" />
                                </Typography>
                                ) : null}

                                <Divider orientation="horizontal" flexItem sx={{ mt: 1 }} />
                                {maturityLevelsData?.items?.length ?
                                    <>
                                        {maturityLevelsData?.items?.map((item: any, index: number) => (
                                            <Box
                                                key={index}
                                                mt={1.5}
                                                p={1.5}
                                                sx={{
                                                    backgroundColor: 'gray.100',
                                                    borderRadius: "8px",
                                                    border: '0.3px solid #73808c30',
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    position: 'relative',
                                                }}
                                            >
                                                <Box sx={{ ...styles.centerCVH, background: "#F3F5F6" }} borderRadius="0.5rem" mr={2} p={0.25}>
                                                    <Typography
                                                        variant="semiBoldLarge"
                                                    >
                                                        {item.index}
                                                    </Typography>
                                                    <Divider orientation="horizontal" flexItem sx={{ mx: 1 }} />

                                                    <IconButton size="small">
                                                        <SwapVertRoundedIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>

                                                <Box>
                                                    <Typography variant="h6">
                                                        {item.title}
                                                    </Typography>
                                                    <Typography variant="body2" mt={1}>
                                                        {item.description}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </> :
                                    <Box sx={{ ...styles.centerCVH }} minHeight="180px" gap={2}>
                                        <Typography variant="headlineSmall" fontWeight="bold" color="rgba(61, 77, 92, 0.5)">
                                            <Trans i18nKey="maturityLevelsListEmptyState" />
                                        </Typography>
                                        <Typography variant="bodyMedium">
                                            <Trans i18nKey="maturityLevelsListEmptyStateDatailed" />
                                        </Typography>
                                        <Button variant="contained">
                                            <Trans i18nKey="newMaturityLevel" />
                                        </Button>
                                    </Box>
                                }
                            </Box>
                            {maturityLevelsData?.items?.length ? (
                                <Box mt={4}>
                                    <Typography variant="headlineSmall" fontWeight="bold">
                                        <Trans i18nKey="maturityLevelsList" />
                                    </Typography>
                                    <Divider orientation="horizontal" flexItem sx={{ mt: 2 }} />

                                    <TableContainer>
                                        <Table sx={{ minWidth: 650 }}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell></TableCell>
                                                    {data.map((row) => (
                                                        <TableCell sx={{ textAlign: "center" }} key={row.id}><Typography variant="semiBoldMedium">{row.title}</Typography></TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {maturityLevelsCompetencesData?.items?.map((row: any) => (
                                                    <TableRow key={row.index} sx={{ backgroundColor: row.index % 2 === 0 ? '#ffffff' : '#2466a812' }}>
                                                        <TableCell><Typography variant="semiBoldMedium">{row.title}</Typography></TableCell>
                                                        {data.map((column, index) => {
                                                            const competence = row.competences.find((c: any) => c.maturityLevelId === column.id);
                                                            return (
                                                                <TableCell key={column.id} sx={{ textAlign: "center", border: '1px solid rgba(224, 224, 224, 1)', borderRight: index === data.length - 1 ? "none" : "1px solid rgba(224, 224, 224, 1)" }}>
                                                                    {competence ? row.index : '-'}
                                                                </TableCell>
                                                            );
                                                        })}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            ) : null}

                        </>
                    );
                }}
            />
        </PermissionControl>
    );
};

export default MaturityLevelsContent;
