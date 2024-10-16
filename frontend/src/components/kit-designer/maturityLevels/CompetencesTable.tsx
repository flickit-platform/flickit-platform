import { useState } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import toastError from "@/utils/toastError";
import { ICustomError } from "@/utils/CustomError";
import { useServiceContext } from "@/providers/ServiceProvider";

interface CompetencesTableProps {
  data: Array<{ id: number; title: string; competences: any[] }>;
  maturityLevelsCompetences: Array<any>;
  kitVersionId: any;
}

const CompetencesTable = ({
  data,
  maturityLevelsCompetences,
  kitVersionId,
}: CompetencesTableProps) => {
  const { service } = useServiceContext();
  const [editState, setEditState] = useState<{
    rowIndex: number | null;
    colIndex: number | null;
    value: string;
  }>({ rowIndex: null, colIndex: null, value: "" });

  const handleCellClick = (
    rowIndex: number,
    colIndex: number,
    currentValue: string,
  ) => {
    setEditState({ rowIndex, colIndex, value: currentValue });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditState((prev) => ({
      ...prev,
      value: e.target.value,
    }));
  };

  const handleSave = async (rowId: number, colId: number) => {
    try {
      const data = {
        kitVersionId,
        affectedLevelId: rowId,
        effectiveLevelId: colId,
        value: Number(editState.value),
      };
      await service.addCompetencyToMaturityLevel(
        { kitVersionId: kitVersionId },
        data,
        undefined,
      );
      setEditState({ rowIndex: null, colIndex: null, value: "" });
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  return (
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
          {maturityLevelsCompetences?.map((row: any, rowIndex: number) => (
            <TableRow
              key={row.index}
              sx={{
                backgroundColor: row.index % 2 === 0 ? "#ffffff" : "#2466a812",
              }}
            >
              <TableCell>
                <Typography variant="semiBoldMedium">{row.title}</Typography>
              </TableCell>
              {data.map((column, colIndex) => {
                const competence = row.competences.find(
                  (c: any) => c.maturityLevelId === column.id,
                );
                const currentValue = competence ? competence.value : "-";
                const isEditing =
                  editState.rowIndex === rowIndex &&
                  editState.colIndex === colIndex;

                return (
                  <TableCell
                    key={column.id}
                    sx={{
                      textAlign: "center",
                      border: "1px solid rgba(224, 224, 224, 1)",
                      borderRight:
                        colIndex === data.length - 1
                          ? "none"
                          : "1px solid rgba(224, 224, 224, 1)",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      handleCellClick(rowIndex, colIndex, currentValue)
                    }
                  >
                    {isEditing ? (
                      <TextField
                        type="number"
                        value={editState.value}
                        onChange={handleChange}
                        onBlur={() => handleSave(row.id, column.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSave(row.id, column.id);
                        }}
                        size="small"
                        sx={{
                          mt: -1,
                          "& .MuiInputBase-input": {
                            textAlign: "center",
                            width: "80px",
                            height: "20px",
                          },
                          width: "80px",
                          height: "20px",
                        }}
                      />
                    ) : (
                      currentValue
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CompetencesTable;
