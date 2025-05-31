"use client";
import { Paper, TextField, Button } from "@mui/material";
import { useState } from "react";
import { EmployeeListContainer } from "./EmployeeListContainer";

export function SearchEmployees() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [UseAltDesign, setUseAltDesign] = useState(false);

  const toggleDesign = () => {
    setUseAltDesign((prev) => !prev);
  };

  return (
    <>
      <Button onClick={toggleDesign}>{UseAltDesign ? "list" : "tile"}</Button>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flex: 1,
          p: 2,
          // backgroundColor: UseAltDesign ? "red" : "blue",
        }}
      >
        <TextField
          placeholder="検索キーワードを入力してください"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <EmployeeListContainer
          key="employeesContainer"
          filterText={searchKeyword}
          viewMode={UseAltDesign ? "tile" : "list"}
        />
      </Paper>
    </>
  );
}
