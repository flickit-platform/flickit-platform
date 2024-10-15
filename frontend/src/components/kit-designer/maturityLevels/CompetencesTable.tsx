import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import { IMaturityLevel } from "@/types";

interface CompetencesTableProps {
  data: Array<{ id: number; title: string; competences: any[] }>;
  maturityLevelsCompetences: Array<any>;
}

const CompetencesTable = ({
  data,
  maturityLevelsCompetences,
}: CompetencesTableProps) => (
  <TableContainer>
    <Table sx={{ minWidth: 650 }}>
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          {data.map((row) => (
            <TableCell sx={{ textAlign: "center" }} key={row.id}>
              <Typography variant="semiBoldMedium">{row.title}</Typography>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {maturityLevelsCompetences?.map((row: any) => (
          <TableRow
            key={row.index}
            sx={{
              backgroundColor: row.index % 2 === 0 ? "#ffffff" : "#2466a812",
            }}
          >
            <TableCell>
              <Typography variant="semiBoldMedium">{row.title}</Typography>
            </TableCell>
            {data.map((column, index) => {
              const competence = row.competences.find(
                (c: any) => c.maturityLevelId === column.id,
              );
              return (
                <TableCell
                  key={column.id}
                  sx={{
                    textAlign: "center",
                    border: "1px solid rgba(224, 224, 224, 1)",
                    borderRight:
                      index === data.length - 1
                        ? "none"
                        : "1px solid rgba(224, 224, 224, 1)",
                  }}
                >
                  {competence ? row.index : "-"}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default CompetencesTable;
