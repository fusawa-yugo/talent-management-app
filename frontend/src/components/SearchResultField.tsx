"use client";
import { TablePagination } from "@mui/material";
import { Button } from "@mui/material";
import { Box } from "@mui/material";
import { useState } from "react";
import type { Employee } from "../models/Employee";
import { EmployeeListItem } from "./EmployeeListItem";

type SearchResultFieldProps = {
  employees?: Employee[];
};

const rowsPerPageOptions = [1, 5, 10, 25, 50];

const SearchResultField: React.FC<SearchResultFieldProps> = ({
  employees = [],
}) => {
  const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [viewMode, setViewMode] = useState<"list" | "tile">("list");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeViewMode = () => {
    setViewMode((prevMode) => (prevMode === "list" ? "tile" : "list"));
    console.log("View mode changed to:", viewMode);
  };

  return (
    <>
      {employees.length === 0 ? (
        <p>No employees match the filter criteria.</p>
      ) : (
        <>
          <Box
            sx={
              viewMode === "list"
                ? {
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }
                : {
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(300px, 1fr))",
                    gap: 2,
                  }
            }
          >
            {employees
              .slice(
                page * rowsPerPage,
                Math.min((page + 1) * rowsPerPage, employees.length),
              )
              .map((employee) => (
                <EmployeeListItem employee={employee} key={employee.id} />
              ))}
          </Box>
          <Box
            component="div"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 2,
            }}
          >
            <Button onClick={handleChangeViewMode}>
              {viewMode === "list" ? "tile" : "list"}
            </Button>
            <TablePagination
              component="div"
              count={employees.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={rowsPerPageOptions}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </>
      )}
    </>
  );
};

export default SearchResultField;
