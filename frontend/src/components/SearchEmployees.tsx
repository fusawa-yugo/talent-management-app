"use client";
import { Paper, TextField } from "@mui/material";
import { useState } from "react";
import { useFilteredEmployees } from "@/hooks/useFilteredEmployees";
import { EmployeeListContainer } from "./EmployeeListContainer";
import EmployeeDistributionCharts from "./EmployeeDistributionCharts";

export function SearchEmployees() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const {
    filteredEmployees,
    departments,
    positions,
    skills,
    departmentFilter,
    setDepartmentFilter,
    positionFilter,
    setPositionFilter,
    skillFilter,
    setSkillFilter,
  } = useFilteredEmployees(searchKeyword);

  return (
    <>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flex: 1,
          p: 2,
          marginBottom: 10,
        }}
      >
        <TextField
          placeholder="検索キーワードを入力してください"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <EmployeeListContainer
          employees={filteredEmployees}
          departments={departments}
          positions={positions}
          skills={skills}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          positionFilter={positionFilter}
          setPositionFilter={setPositionFilter}
          skillFilter={skillFilter}
          setSkillFilter={setSkillFilter}
        />
      </Paper>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flex: 1,
          p: 2,
          marginBottom: 10,
        }}
      >
        <EmployeeDistributionCharts employees={filteredEmployees} />
      </Paper>
    </>
  );
}
