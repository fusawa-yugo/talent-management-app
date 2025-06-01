"use client";
import { useFilteredEmployees } from "@/hooks/useFilteredEmployees";
import { Paper, TextField } from "@mui/material";
import { useState } from "react";
import EmployeeDistributionCharts from "./EmployeeDistributionCharts";
import { EmployeeListContainer } from "./EmployeeListContainer";

export function SearchEmployees() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const {
    employees,
    departments,
    positions,
    skills,
    departmentFilter,
    setDepartmentFilter,
    positionFilter,
    setPositionFilter,
    skillFilter,
    setSkillFilter,
    sortKey,
    setSortKey,
    sortKeys,
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
          employees={employees}
          departments={departments}
          positions={positions}
          skills={skills}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          positionFilter={positionFilter}
          setPositionFilter={setPositionFilter}
          skillFilter={skillFilter}
          setSkillFilter={setSkillFilter}
          sortKeys={sortKeys}
          sortKey={sortKey}
          setSortKey={setSortKey}
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
        <EmployeeDistributionCharts employees={employees} />
      </Paper>
    </>
  );
}
