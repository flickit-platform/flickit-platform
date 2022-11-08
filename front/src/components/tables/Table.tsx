import React from "react";
import MUITable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

interface ITableProps<T> {
  headers: (string | JSX.Element)[];
  data: T[];
  renderRow?: (row: T, index: number) => JSX.Element | string;
}

const Table = <T extends any = any>(props: ITableProps<T>) => {
  const { headers, data, renderRow = defaultRenderRow } = props;
  return (
    <TableContainer sx={{ padding: "12px" }}>
      <MUITable
        sx={{
          minWidth: 650,
          border: "none",
          borderCollapse: "separate",
          borderSpacing: "0 16px",
        }}
      >
        <TableHead sx={{ position: "relative", top: "12px" }}>
          <TableRow>
            {headers.map((head, index) => {
              return (
                <TableCell
                  key={index}
                  sx={{
                    borderBottom: "none",
                    paddingBottom: "2px",
                    paddingTop: "0",
                  }}
                >
                  {head}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>{data.map(renderRow)}</TableBody>
      </MUITable>
    </TableContainer>
  );
};

const defaultRenderRow = (row: any, index: number) => {
  const cells = Object.keys(row).map((key) => row[key]);
  return (
    <TableRow
      key={index}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      {cells.map((cell, index) => {
        return index === 0 ? (
          <TableCell component="th" scope="row">
            {cell}
          </TableCell>
        ) : (
          <TableCell>{cell}</TableCell>
        );
      })}
    </TableRow>
  );
};

export { Table };
